const PROVIDER_DISCORD: OAuthProvider = "discord";
const PROVIDER_GITHUB: OAuthProvider = "github";

const handleOAuthSignIn = async (
  provider: OAuthProvider,
): Promise<OAuthResponse> => {
  const supabaseClient = useSupabaseClient();
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider,
  });

  if (error) {
    loggerError("OAuth sign-in failed", { provider, error });
    return {
      data: null,
      error: {
        code: error.name,
        message: error.message,
        status: error.status,
      },
    };
  }

  logger("OAuth sign-in successful", { provider, data });
  return { data, error: null };
};

const handleCredentialsSignIn = async (
  credentials: LoginEmailAndPasswordCredentials,
): Promise<AuthResult> => {
  const supabaseClient = useSupabaseClient();
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
    options: { captchaToken: credentials.token },
  });

  if (error) {
    loggerError("Credentials sign-in failed", {
      email: credentials.email,
      error,
    });
    return {
      data: null,
      error: {
        code: error.name,
        message: error.message,
        status: error.status,
      },
    };
  }

  logger("Credentials sign-in successful", { email: credentials.email });
  return { data, error: null };
};

const handleLogout = async (): Promise<void> => {
  const supabaseClient = useSupabaseClient();
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    loggerError("Logout failed", error);
    throw new Error("Falha ao desconectar usuário");
  }

  logger("Logout successful");
};

export const useAuth = () => {
  const signInWithDiscord = async (): Promise<OAuthResponse> => {
    return await handleOAuthSignIn(PROVIDER_DISCORD);
  };

  const signInWithGithub = async (): Promise<OAuthResponse> => {
    return await handleOAuthSignIn(PROVIDER_GITHUB);
  };

  const signInWithCredentials = async (
    credentials: LoginEmailAndPasswordCredentials,
  ): Promise<AuthResult> => {
    return await handleCredentialsSignIn(credentials);
  };

  const logout = async (): Promise<void> => {
    await handleLogout();
  };

  return {
    signInWithDiscord,
    signInWithGithub,
    signInWithCredentials,
    logout,
  };
};

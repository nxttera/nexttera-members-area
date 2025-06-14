export interface LoginEmailAndPasswordCredentials {
  email: string;
  password: string;
}

export interface AuthResult<T = unknown> {
  data: T | null;
  error: AuthError | null;
}

export interface AuthError {
  code?: string;
  message: string;
  status?: number;
}

export type OAuthProvider = "discord" | "github";

export interface OAuthResponse {
  data: {
    provider: string;
    url: string;
  } | null;
  error: AuthError | null;
}

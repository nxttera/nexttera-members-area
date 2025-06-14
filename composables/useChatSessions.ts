export const useChatSessions = () => {
  const sessions = ref<ChatSession[]>([]);

  const loadSessions = async (toolId?: string) => {
    const query = toolId ? `?toolId=${toolId}` : "";

    const { data, error, pending } = await useFetch<
      { sessions: ChatSession[] }
    >(
      `/api/chat/sessions${query}`,
      {
        key: `chat-sessions-${toolId || "all"}`,
        server: true,
        default: () => ({ sessions: [] }),
      },
    );

    if (error.value) {
      loggerError("Erro ao carregar sessões", { error: error.value, toolId });
      throw error.value;
    }

    if (data.value) {
      sessions.value = data.value.sessions;
    }

    return { sessions: data.value?.sessions || [], loading: pending, error };
  };

  const createSession = async (toolId: string, title?: string) => {
    const { data, error, pending } = await useFetch<{ session: ChatSession }>(
      "/api/chat/sessions",
      {
        method: "POST",
        body: { toolId, title },
        key: `create-session-${Date.now()}`,
        server: false,
      },
    );

    if (error.value) {
      loggerError("Erro ao criar sessão", { error: error.value, toolId });
      throw error.value;
    }

    if (data.value) {
      sessions.value.unshift(data.value.session);
      return data.value.session;
    }

    throw new Error("Falha ao criar sessão");
  };

  const deleteSession = async (sessionId: string) => {
    const { error, pending } = await useFetch(
      `/api/chat/sessions/${sessionId}`,
      {
        method: "DELETE",
        key: `delete-session-${sessionId}`,
        server: false,
      },
    );

    if (error.value) {
      loggerError("Erro ao deletar sessão", { error: error.value, sessionId });
      throw error.value;
    }

    sessions.value = sessions.value.filter((session) =>
      session.id !== sessionId
    );

    return { loading: pending, error };
  };

  const getSessionsByTool = (toolId: string) => {
    return computed(() =>
      sessions.value
        .filter((session) => session.tool_id === toolId)
        .sort((a, b) =>
          new Date(b.last_message_at).getTime() -
          new Date(a.last_message_at).getTime()
        )
    );
  };

  const getSessionById = (sessionId: string) => {
    return computed(() =>
      sessions.value.find((session) => session.id === sessionId)
    );
  };

  return {
    sessions: readonly(sessions),
    loadSessions,
    createSession,
    deleteSession,
    getSessionsByTool,
    getSessionById,
  };
};

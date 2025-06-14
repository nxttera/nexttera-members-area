interface UseChatOptions {
  toolId: string;
}

export const useChat = (options: UseChatOptions) => {
  const { toolId } = options;

  const currentSession = ref<ChatSession | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchSessions = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await new Promise<ChatSession[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: "1",
              toolId,
              userId: "user-1",
              sessionId: "session-1",
              title: "Conversa com a ferramenta",
              isActive: true,
              lastMessageAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              messages: [
                {
                  id: "msg-1",
                  sessionId: "session-1",
                  type: "bot",
                  content: "Olá! Como posso ajudar você hoje?",
                  timestamp: new Date().toISOString(),
                },
              ],
            },
          ]);
        }, 500);
      });

      if (response.length > 0) {
        currentSession.value = response[0];
      }

      return response;
    } catch (err) {
      error.value = "Falha ao carregar sessões de chat";
      console.error(err);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const createSession = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const newSession = await new Promise<ChatSession>((resolve) => {
        setTimeout(() => {
          resolve({
            id: `session-${Date.now()}`,
            toolId,
            userId: "user-1",
            sessionId: `session-${Date.now()}`,
            title: `Nova conversa - ${new Date().toLocaleDateString("pt-BR")}`,
            isActive: true,
            lastMessageAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            messages: [
              {
                id: `msg-${Date.now()}`,
                sessionId: `session-${Date.now()}`,
                type: "bot",
                content: "Olá! Como posso ajudar você hoje?",
                timestamp: new Date().toISOString(),
              },
            ],
          });
        }, 500);
      });

      currentSession.value = newSession;
      return newSession;
    } catch (err) {
      error.value = "Falha ao criar nova sessão";
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentSession.value) {
      error.value = "Nenhuma sessão ativa";
      return null;
    }

    try {
      isLoading.value = true;
      error.value = null;

      const userMessage: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        sessionId: currentSession.value.id,
        type: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      if (!currentSession.value.messages) {
        currentSession.value.messages = [];
      }

      currentSession.value.messages.push(userMessage);

      const botResponse = await new Promise<ChatMessage>((resolve) => {
        setTimeout(() => {
          resolve({
            id: `msg-bot-${Date.now()}`,
            sessionId: currentSession.value!.id,
            type: "bot",
            content: `Resposta para: "${content}"`,
            timestamp: new Date().toISOString(),
          });
        }, 1000);
      });

      currentSession.value.messages.push(botResponse);
      currentSession.value.lastMessageAt = new Date().toISOString();

      return botResponse;
    } catch (err) {
      error.value = "Falha ao enviar mensagem";
      console.error(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });

      if (currentSession.value?.id === sessionId) {
        currentSession.value = null;
      }

      return true;
    } catch (err) {
      error.value = "Falha ao excluir sessão";
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    currentSession: readonly(currentSession),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchSessions,
    createSession,
    sendMessage,
    deleteSession,
  };
};

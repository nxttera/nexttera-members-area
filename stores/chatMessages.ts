const MESSAGES_PER_PAGE = 20;
const TYPING_MESSAGE_ID = "typing-indicator";

export const useChatMessagesStore = defineStore("chatMessages", () => {
  const messages = ref<ChatMessage[]>([]);
  const currentSessionId = ref<string | null>(null);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const hasMoreMessages = ref(true);
  const currentPage = ref(1);
  const error = ref<string | null>(null);
  const isTyping = ref(false);

  const loadMessages = async (sessionId: string, page: number = 1) => {
    try {
      if (page === 1) {
        isLoading.value = true;
        messages.value = [];
        currentPage.value = 1;
        hasMoreMessages.value = true;
      } else {
        isLoadingMore.value = true;
      }

      error.value = null;

      const { data, error: fetchError } = await useFetch<{
        messages: ChatMessage[];
        hasMore: boolean;
      }>(`/api/chat/sessions/${sessionId}/messages`, {
        query: {
          page,
          limit: MESSAGES_PER_PAGE,
        },
        key: `chat-messages-${sessionId}-${page}`,
        server: false,
        default: () => ({ messages: [], hasMore: false }),
      });

      if (fetchError.value) {
        error.value = `Erro ao carregar mensagens: ${
          fetchError.value.message || "Erro desconhecido"
        }`;
        throw fetchError.value;
      }

      if (data.value) {
        if (page === 1) {
          messages.value = data.value.messages;
          currentSessionId.value = sessionId;
        } else {
          messages.value = [...messages.value, ...data.value.messages];
        }

        hasMoreMessages.value = data.value.hasMore;
        currentPage.value = page;
      }

      return {
        messages: data.value?.messages || [],
        hasMore: data.value?.hasMore || false,
      };
    } catch (err) {
      error.value = "Erro ao carregar mensagens";
      throw err;
    } finally {
      isLoading.value = false;
      isLoadingMore.value = false;
    }
  };

  const loadMoreMessages = async () => {
    if (
      !currentSessionId.value || !hasMoreMessages.value || isLoadingMore.value
    ) {
      return;
    }

    await loadMessages(currentSessionId.value, currentPage.value + 1);
  };

  const sendMessage = async (content: string, sessionId?: string) => {
    const targetSessionId = sessionId || currentSessionId.value;

    if (!targetSessionId || !content.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      session_id: targetSessionId,
      type: "user",
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    const typingMessage: ChatMessage = {
      id: TYPING_MESSAGE_ID,
      session_id: targetSessionId,
      type: "bot",
      content: "...",
      created_at: new Date().toISOString(),
    };

    if (targetSessionId === currentSessionId.value) {
      messages.value = [...messages.value, userMessage];
    }

    try {
      error.value = null;

      if (targetSessionId === currentSessionId.value) {
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 100));

        isTyping.value = true;
        messages.value = [...messages.value, typingMessage];
      }

      const data = await $fetch<{
        userMessage: ChatMessage;
        botMessage: ChatMessage;
      }>("/api/chat/messages", {
        method: "POST",
        body: {
          sessionId: targetSessionId,
          content: content.trim(),
        },
      });

      if (data && targetSessionId === currentSessionId.value) {
        const messagesWithoutTemp = messages.value.filter((msg) =>
          msg.id !== userMessage.id && msg.id !== TYPING_MESSAGE_ID
        );

        messages.value = [
          ...messagesWithoutTemp,
          data.userMessage,
          data.botMessage,
        ];
      }

      return data;
    } catch (err) {
      error.value = "Erro ao enviar mensagem";

      if (targetSessionId === currentSessionId.value) {
        messages.value = messages.value.filter((msg) =>
          msg.id !== userMessage.id && msg.id !== TYPING_MESSAGE_ID
        );
      }

      throw err;
    } finally {
      isTyping.value = false;
    }
  };

  const switchToSession = async (sessionId: string) => {
    if (sessionId === currentSessionId.value && messages.value.length > 0) {
      return;
    }

    currentSessionId.value = sessionId;
    messages.value = [];
    currentPage.value = 1;
    hasMoreMessages.value = true;

    await clearNuxtData(`chat-messages-${sessionId}-*`);
    await loadMessages(sessionId);
  };

  const clearMessages = () => {
    messages.value = [];
    currentSessionId.value = null;
    error.value = null;
    isTyping.value = false;
  };

  const forceStopLoading = () => {
    isLoading.value = false;
    isLoadingMore.value = false;
    isTyping.value = false;
  };

  const getMessagesByType = (type: "user" | "bot" | "system") => {
    return computed(() => messages.value.filter((msg) => msg.type === type));
  };

  const getLastMessage = computed(() =>
    messages.value.length > 0 ? messages.value[messages.value.length - 1] : null
  );

  return {
    messages,
    currentSessionId,
    isLoading,
    isLoadingMore,
    hasMoreMessages,
    currentPage,
    error,
    isTyping,
    getLastMessage,
    loadMessages,
    loadMoreMessages,
    sendMessage,
    switchToSession,
    clearMessages,
    getMessagesByType,
    forceStopLoading,
  };
});

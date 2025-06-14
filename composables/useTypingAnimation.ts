export const useTypingAnimation = () => {
  const dots = ref("...");
  const intervalId = ref<NodeJS.Timeout | null>(null);

  const startAnimation = () => {
    if (intervalId.value) return;

    intervalId.value = setInterval(() => {
      dots.value = dots.value === "..."
        ? "."
        : dots.value === "."
        ? ".."
        : "...";
    }, 500);
  };

  const stopAnimation = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null;
      dots.value = "...";
    }
  };

  onUnmounted(() => {
    stopAnimation();
  });

  return {
    dots: readonly(dots),
    startAnimation,
    stopAnimation,
  };
};

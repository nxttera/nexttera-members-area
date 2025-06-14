interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  timeout?: number;
}

export const useToast = () => {
  const toasts = useState<Toast[]>("toasts", () => []);

  const add = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      title: toast.title,
      description: toast.description,
      type: toast.type || "info",
      timeout: toast.timeout || 3000,
    };

    toasts.value.push(newToast);

    if (newToast.timeout) {
      setTimeout(() => {
        remove(id);
      }, newToast.timeout);
    }

    return id;
  };

  const remove = (id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  return {
    toasts,
    add,
    remove,
  };
};

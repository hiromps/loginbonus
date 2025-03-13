import { useState, useEffect } from "react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, duration = 3000 }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, duration };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dismiss(toast.id);
      }, toast.duration);
      
      timers.push(timer);
    });
    
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts]);

  return {
    toast,
    dismiss,
    toasts,
  };
} 
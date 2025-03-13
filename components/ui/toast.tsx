"use client";

import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { useEffect } from "react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="font-medium">{toast.title}</div>
              <button
                onClick={() => dismiss(toast.id)}
                className="ml-4 inline-flex text-gray-400 hover:text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {toast.description && (
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {toast.description}
              </div>
            )}
          </div>
          <div className="h-1 bg-primary animate-[progress_linear]" style={{
            animation: `progress ${toast.duration}ms linear forwards`
          }} />
        </div>
      ))}
      <style jsx global>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
} 
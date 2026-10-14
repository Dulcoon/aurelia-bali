'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none no-print"
    >
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="w-5 h-5 text-deepGreen shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-bronze shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />,
          error: <XCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />,
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-ivory border border-stone shadow-editorial p-4 flex items-start gap-3 transition-all duration-300"
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-charcoal/75 mt-1 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-charcoal/50 hover:text-charcoal p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

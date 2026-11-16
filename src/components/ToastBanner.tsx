import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastBannerProps {
  message: string | null;
  onDismiss: () => void;
  dismissLabel?: string;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({
  message,
  onDismiss,
  dismissLabel = 'Dismiss notification',
}) => {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-20 lg:bottom-6 right-4 sm:right-8 z-40 max-w-sm rounded-2xl bg-[#51434A] text-[#FFF9F6] px-4 py-3 shadow-lg border border-[#E8A2B5]/40 flex items-center gap-3 animate-page-enter"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="w-4 h-4 text-[#E8A2B5] shrink-0" />
      <span className="text-xs sm:text-sm font-medium leading-snug flex-1">
        {message}
      </span>
      <button
        onClick={onDismiss}
        className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg text-[#F4DDE3]/80 hover:text-white transition-colors"
        aria-label={dismissLabel}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#51434A]/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-[#FFF9F6] border border-[#EAE0D8] p-6 sm:p-8 shadow-xl space-y-5 animate-page-enter">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full text-[#7D6B74] hover:text-[#51434A] hover:bg-[#F3E9DD]/60 transition-colors"
          aria-label="Close confirmation dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#F4DDE3]/70 border border-[#E8A2B5]/60 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-[#C97A92]" />
          </div>
          <div className="space-y-1.5 pr-6">
            <h3
              id="confirm-dialog-title"
              className="font-serif-editorial text-xl font-normal text-[#51434A]"
            >
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-[#7D6B74] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[44px] px-5 py-2 rounded-xl border border-[#EAE0D8] bg-white text-xs font-medium text-[#51434A] hover:bg-[#F3E9DD]/50 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-[#B91C1C] text-white text-xs font-medium hover:bg-[#991B1B] transition-colors cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

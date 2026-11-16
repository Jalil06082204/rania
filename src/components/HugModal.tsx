import React, { useState } from 'react';
import { Check, Edit3, Heart, Sparkles, X } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { soundEngine } from '../utils/sound';

interface HugModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  soundEnabled: boolean;
  customMessage?: string;
  customSubtext?: string;
  onSaveCustomHug?: (message: string, subtext: string) => void;
}

export const HugModal: React.FC<HugModalProps> = ({
  isOpen,
  onClose,
  language,
  soundEnabled,
  customMessage,
  customSubtext,
  onSaveCustomHug,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const t = translations[language];

  const displayedMessage = customMessage?.trim() || t.common.hugMessage;
  const displayedSubtext = customSubtext?.trim() || t.common.hugSubtext;

  const [draftMsg, setDraftMsg] = useState(displayedMessage);
  const [draftSub, setDraftSub] = useState(displayedSubtext);

  if (!isOpen) return null;

  const handleOpenEdit = () => {
    setDraftMsg(displayedMessage);
    setDraftSub(displayedSubtext);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftMsg.trim()) return;
    onSaveCustomHug?.(draftMsg.trim(), draftSub.trim());
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#51434A]/45 backdrop-blur-sm transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hug-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FFF9F6] border border-[#EAE0D8] p-8 md:p-10 text-center shadow-xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => {
            setIsEditing(false);
            onClose();
          }}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#7D6B74] hover:text-[#51434A] hover:bg-[#F4DDE3]/50 transition-colors focus-visible:outline-2 focus-visible:outline-[#C97A92] cursor-pointer"
          aria-label={t.common.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Heart Illustration */}
        <div className="relative mx-auto mb-6 w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#F4DDE3]/70 animate-breathe" />
          <div className="absolute inset-3 rounded-full bg-[#E8A2B5]/25 animate-float-slow" />
          <div className="relative z-10 w-16 h-16 rounded-full bg-white border border-[#EAE0D8] flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#C97A92] fill-[#F4DDE3] animate-float-slow" />
          </div>
        </div>

        <p className="text-xs tracking-wide text-[#7D6B74] mb-2">
          {t.forRania} · {t.common.hugGentlePause}
        </p>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3 text-left mb-6">
            <div>
              <textarea
                value={draftMsg}
                onChange={(e) => setDraftMsg(e.target.value)}
                rows={3}
                className="w-full p-3.5 rounded-xl border border-[#EAE0D8] bg-white text-sm text-[#51434A] leading-relaxed"
                required
              />
            </div>
            <div>
              <textarea
                value={draftSub}
                onChange={(e) => setDraftSub(e.target.value)}
                rows={2}
                className="w-full p-3.5 rounded-xl border border-[#EAE0D8] bg-white text-xs text-[#7D6B74] leading-relaxed"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="min-h-[38px] px-4 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#7D6B74] cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="min-h-[38px] px-4 py-1.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t.common.save}</span>
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2
              id="hug-modal-title"
              className="font-serif-editorial text-2xl md:text-3xl font-medium text-[#51434A] leading-snug mb-5"
            >
              “{displayedMessage}”
            </h2>

            <p className="text-sm text-[#7D6B74] max-w-md mx-auto mb-8 leading-relaxed">
              {displayedSubtext}
            </p>
          </>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => soundEngine.playChime(soundEnabled)}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#EAE0D8] bg-white text-xs sm:text-sm font-medium text-[#51434A] hover:bg-[#F3E9DD]/60 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C97A92]" />
            <span>{t.common.playSoothingChime}</span>
          </button>

          {onSaveCustomHug && !isEditing && (
            <button
              onClick={handleOpenEdit}
              className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#EAE0D8] bg-white text-xs sm:text-sm font-medium text-[#7D6B74] hover:text-[#51434A] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C97A92]" />
              <span>{t.common.edit}</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsEditing(false);
              onClose();
            }}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs sm:text-sm font-medium hover:bg-[#3E3238] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.common.thankYouHug}
          </button>
        </div>
      </div>
    </div>
  );
};

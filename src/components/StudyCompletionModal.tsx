import React, { useEffect, useMemo, useState } from 'react';
import { Check, Edit3, Heart, Sparkles, X } from 'lucide-react';
import { localizeLoveMessage, translations } from '../i18n/translations';
import { Language, LoveMessageItem } from '../types';
import { BotanicalSprig, WaxSealHeart } from './BotanicalOrnaments';

interface StudyCompletionModalProps {
  isOpen: boolean;
  completedTopicTitle: string;
  onClose: () => void;
  loveMessages: LoveMessageItem[];
  onUpdateLoveMessage: (id: string, updated: Partial<LoveMessageItem>) => void;
  language?: Language;
}

export const StudyCompletionModal: React.FC<StudyCompletionModalProps> = ({
  isOpen,
  completedTopicTitle,
  onClose,
  loveMessages,
  onUpdateLoveMessage,
  language = 'en',
}) => {
  const t = translations[language];

  const localizedMessages = useMemo(
    () => loveMessages.map((m) => localizeLoveMessage(m, language)),
    [loveMessages, language]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState('');

  useEffect(() => {
    if (isOpen && localizedMessages.length > 0) {
      const randomIdx = Math.floor(Math.random() * localizedMessages.length);
      setCurrentIndex(randomIdx);
      setIsEditing(false);
    }
  }, [isOpen, localizedMessages.length]);

  if (!isOpen) return null;

  const activeMessage =
    localizedMessages[currentIndex] ||
    localizedMessages[0] || {
      id: 'fallback',
      text: 'Your effort matters, even when nobody sees it.',
      contextNote: 'For Rania',
      isSample: true,
    };

  const handleDrawAnother = () => {
    if (localizedMessages.length <= 1) return;
    let next = Math.floor(Math.random() * localizedMessages.length);
    if (next === currentIndex) {
      next = (currentIndex + 1) % localizedMessages.length;
    }
    setCurrentIndex(next);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setDraftText(activeMessage.text);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftText.trim() || activeMessage.id === 'fallback') return;
    onUpdateLoveMessage(activeMessage.id, {
      text: draftText.trim(),
      isSample: false,
    });
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#51434A]/45 backdrop-blur-sm animate-page-enter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="study-surprise-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl editorial-stationary rose-glass-sheen border-[#E8A2B5] p-7 sm:p-10 text-center overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 min-h-[42px] min-w-[42px] flex items-center justify-center rounded-full text-[#7D6B74] hover:text-[#51434A] hover:bg-[#F4DDE3]/50 transition-colors cursor-pointer"
          aria-label={t.common.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#F4DDE3]/80 border border-[#E8A2B5] flex items-center justify-center">
          <WaxSealHeart className="w-8 h-8" />
        </div>

        <p className="text-xs tracking-wide text-[#C97A92] font-medium mb-1">
          {t.studySurprise.badge}
        </p>

        <h2
          id="study-surprise-title"
          className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#51434A] mb-3"
        >
          {t.studySurprise.title}
        </h2>

        {completedTopicTitle && (
          <p className="text-xs text-[#7D6B74] mb-6 px-4">
            {t.studySurprise.completedGoalLabel}{' '}
            <span className="font-medium text-[#51434A]">
              “{completedTopicTitle}”
            </span>
          </p>
        )}

        <div className="rounded-2xl editorial-stationary p-6 sm:p-8 mb-6 space-y-4">
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-3 text-left">
              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={3}
                className="w-full p-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A] leading-relaxed"
                required
              />
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
                  <span>{t.studySurprise.saveNoteBtn}</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="font-serif-editorial italic text-xl sm:text-2xl text-[#51434A] leading-relaxed">
                “{activeMessage.text}”
              </p>
              <div className="pt-2 flex flex-col items-center gap-1.5">
                <BotanicalSprig className="w-24 h-5" />
                <span className="text-xs text-[#7D6B74]">
                  {t.studySurprise.fromCreator}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {localizedMessages.length > 1 && !isEditing && (
            <button
              onClick={handleDrawAnother}
              className="min-h-[42px] px-4 py-2 rounded-xl border border-[#EAE0D8] bg-white hover:bg-[#F3E9DD]/60 text-xs font-medium text-[#51434A] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C97A92]" />
              <span>{t.studySurprise.drawAnotherNoteBtn}</span>
            </button>
          )}

          {!isEditing && activeMessage.id !== 'fallback' && (
            <button
              onClick={handleStartEdit}
              className="min-h-[42px] px-4 py-2 rounded-xl border border-[#EAE0D8] bg-white hover:bg-[#FFF9F6] text-xs font-medium text-[#7D6B74] hover:text-[#51434A] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C97A92]" />
              <span>{t.studySurprise.editNoteBtn}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="min-h-[42px] px-6 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs sm:text-sm font-medium hover:bg-[#3E3238] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-[#E8A2B5] fill-[#E8A2B5]" />
            <span>{t.studySurprise.keepGoingBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

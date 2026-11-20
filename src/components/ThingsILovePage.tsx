import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Edit3,
  Heart,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { localizeLovedQuality, translations } from '../i18n/translations';
import { Language, LovedQualityItem } from '../types';
import {
  BotanicalSprig,
  FloralCornerFlourish,
  WaxSealHeart,
} from './BotanicalOrnaments';
import { ConfirmDialog } from './ConfirmDialog';

interface ThingsILovePageProps {
  items: LovedQualityItem[];
  onAddItem: (item: Omit<LovedQualityItem, 'id'>) => void;
  onUpdateItem: (id: string, updated: Partial<LovedQualityItem>) => void;
  onDeleteItem: (id: string) => void;
  onRestoreSamples: () => void;
  onBackToLoveFromMe: () => void;
  onNeedHug: () => void;
  onNotify?: (msg: string) => void;
  language?: Language;
}

export const ThingsILovePage: React.FC<ThingsILovePageProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onRestoreSamples,
  onBackToLoveFromMe,
  onNeedHug,
  onNotify,
  language = 'en',
}) => {
  const t = translations[language];

  const localizedItems = useMemo(
    () => items.map((item) => localizeLovedQuality(item, language)),
    [items, language]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [detail, setDetail] = useState('');
  const [itemToDelete, setItemToDelete] = useState<LovedQualityItem | null>(
    null
  );

  const openNewModal = () => {
    setEditingId(null);
    setTitle('');
    setCategory(language === 'fr' ? 'Ton Cœur' : 'Your Heart');
    setDetail('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: LovedQualityItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setDetail(item.detail);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !detail.trim()) return;

    if (editingId) {
      onUpdateItem(editingId, {
        title: title.trim(),
        category:
          category.trim() || (language === 'fr' ? 'Pour Rania' : 'For Rania'),
        detail: detail.trim(),
        isSample: false,
      });
      onNotify?.(t.toasts.savedToSanctuary);
    } else {
      onAddItem({
        title: title.trim(),
        category:
          category.trim() || (language === 'fr' ? 'Pour Rania' : 'For Rania'),
        detail: detail.trim(),
        isSample: false,
      });
      onNotify?.(t.toasts.savedToSanctuary);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-12 pb-14 animate-page-enter">
      {/* Top Back Navigation & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToLoveFromMe}
          className="min-h-[42px] px-4 py-2 rounded-xl border border-[#EAE0D8] bg-white hover:bg-[#FFF9F6] text-xs font-medium text-[#51434A] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#C97A92]" />
          <span>{t.thingsILovePage.backToLoveBtn}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onNeedHug}
            className="min-h-[44px] px-5 py-2 rounded-2xl bg-[#F4DDE3] hover:bg-[#E8A2B5]/60 text-[#51434A] text-xs sm:text-sm font-semibold active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#C97A92] fill-[#C97A92]" />
            <span>{t.common.needAHug}</span>
          </button>

          <button
            onClick={openNewModal}
            className="min-h-[44px] px-5 py-2 rounded-2xl bg-[#51434A] text-[#FFF9F6] text-xs sm:text-sm font-medium hover:bg-[#3E3238] active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E8A2B5]" />
            <span>{t.thingsILovePage.addQualityBtn}</span>
          </button>
        </div>
      </div>

      {/* Editorial Hero Header */}
      <section className="relative rounded-[2.25rem] editorial-stationary rose-glass-sheen p-8 sm:p-14 text-center overflow-hidden">
        <FloralCornerFlourish className="hidden sm:block absolute top-5 left-5 w-16 h-16 pointer-events-none" />
        <FloralCornerFlourish className="hidden sm:block absolute top-5 right-5 w-16 h-16 -scale-x-100 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs text-[#7D6B74]">
            <WaxSealHeart className="w-5 h-5" />
            <span>{t.thingsILovePage.badge}</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-5xl font-normal text-[#51434A] tracking-tight leading-tight">
            {t.thingsILovePage.title}
          </h1>

          <p className="font-serif-editorial italic text-base sm:text-lg text-[#7D6B74] leading-relaxed">
            {t.thingsILovePage.subtitle}
          </p>

          <div className="pt-2 flex justify-center">
            <BotanicalSprig className="w-32 h-6" />
          </div>
        </div>
      </section>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <form
          onSubmit={handleSave}
          className="rounded-3xl editorial-stationary rose-glass-sheen border-[#E8A2B5] p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D8]">
            <h2 className="font-serif-editorial text-2xl text-[#51434A]">
              {editingId
                ? t.thingsILovePage.modalEditTitle
                : t.thingsILovePage.modalNewTitle}
            </h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7D6B74]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#51434A] mb-1.5">
                {t.thingsILovePage.qualityTitleLabel}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.thingsILovePage.qualityTitlePlaceholder}
                className="w-full min-h-[46px] px-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#51434A] mb-1.5">
                {t.thingsILovePage.qualityCategoryLabel}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t.thingsILovePage.qualityCategoryPlaceholder}
                className="w-full min-h-[46px] px-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#51434A] mb-1.5">
              {t.thingsILovePage.qualityDetailLabel}
            </label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              rows={4}
              placeholder={t.thingsILovePage.qualityDetailPlaceholder}
              className="w-full p-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A] leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="min-h-[44px] px-5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#7D6B74] cursor-pointer"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{t.thingsILovePage.saveQualityBtn}</span>
            </button>
          </div>
        </form>
      )}

      {/* Editorial Monograph Grid */}
      {localizedItems.length === 0 ? (
        <section className="rounded-3xl editorial-card rose-glass-sheen p-12 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-[#C97A92] mx-auto" />
          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="font-serif-editorial text-2xl text-[#51434A]">
              {t.thingsILovePage.emptyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B74]">
              {t.thingsILovePage.emptySubtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={openNewModal}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.thingsILovePage.addQualityBtn}</span>
            </button>
            <button
              onClick={() => {
                onRestoreSamples();
                onNotify?.(t.toasts.savedToSanctuary);
              }}
              className="min-h-[44px] px-5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.thingsILovePage.restoreQualitiesBtn}</span>
            </button>
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {localizedItems.map((item, idx) => (
            <article
              key={item.id}
              className="rounded-3xl editorial-card editorial-card-interactive rose-glass-sheen p-7 sm:p-9 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2 text-xs text-[#7D6B74]">
                  <div className="flex items-center gap-2">
                    <span className="font-serif-editorial italic text-base text-[#C97A92]">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.category}</span>
                  </div>
                  <Heart className="w-3.5 h-3.5 text-[#E8A2B5] fill-[#F4DDE3]" />
                </div>

                <h2 className="font-serif-editorial text-2xl font-normal text-[#51434A] leading-snug">
                  {item.title}
                </h2>

                <p className="text-sm sm:text-[15px] text-[#51434A]/90 leading-relaxed">
                  {item.detail}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAE0D8]/70 flex items-center justify-between text-xs">
                <span className="font-serif-editorial italic text-[#7D6B74]">
                  {t.forRania}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl border border-[#EAE0D8] text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#C97A92]" />
                    <span>{t.common.edit}</span>
                  </button>
                  <button
                    onClick={() => setItemToDelete(item)}
                    className="min-h-[38px] min-w-[38px] rounded-xl border border-[#EAE0D8] text-[#7D6B74] hover:text-[#B91C1C] flex items-center justify-center cursor-pointer"
                    aria-label={t.common.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <ConfirmDialog
        isOpen={!!itemToDelete}
        title={t.thingsILovePage.deleteModalTitle}
        message={t.thingsILovePage.deleteModalMsg(itemToDelete?.title || '')}
        confirmLabel={t.thingsILovePage.deleteConfirmBtn}
        cancelLabel={t.common.cancel}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            onDeleteItem(itemToDelete.id);
            onNotify?.(t.toasts.savedToSanctuary);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
};

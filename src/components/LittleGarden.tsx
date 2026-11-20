import React, { useMemo, useState } from 'react';
import {
  Award,
  Check,
  Edit3,
  Flower2,
  Lock,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { localizeJournalEntry, translations } from '../i18n/translations';
import { GardenMood, JournalEntry, Language } from '../types';
import { ConfirmDialog } from './ConfirmDialog';

interface LittleGardenProps {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  onUpdateEntry: (id: string, updated: Partial<JournalEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onRestoreSampleEntries: () => void;
  onNotify?: (msg: string) => void;
  language?: Language;
}

const MOOD_KEYS: GardenMood[] = [
  'Serene',
  'Grateful',
  'Focused',
  'Hopeful',
  'Loved',
  'Tired',
  'Overwhelmed',
];

export const LittleGarden: React.FC<LittleGardenProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onRestoreSampleEntries,
  onNotify,
  language = 'en',
}) => {
  const t = translations[language];
  const todayIso = new Date().toISOString().split('T')[0];

  const [moodFilter, setMoodFilter] = useState<GardenMood | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entryDate, setEntryDate] = useState(todayIso);
  const [selectedMood, setSelectedMood] = useState<GardenMood>('Serene');
  const [promptIndex, setPromptIndex] = useState(0);
  const [gratitudePrompt, setGratitudePrompt] = useState(
    t.garden.gratitudePrompts[0]
  );
  const [gratitudeAnswer, setGratitudeAnswer] = useState('');
  const [achievement, setAchievement] = useState('');
  const [dailyNote, setDailyNote] = useState('');
  const [formValidationError, setFormValidationError] = useState<string | null>(
    null
  );

  // Delete confirmation dialog state
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);

  const localizedEntries = useMemo(
    () => entries.map((e) => localizeJournalEntry(e, language)),
    [entries, language]
  );

  const openNewEntryForm = () => {
    setEditingId(null);
    setEntryDate(todayIso);
    setSelectedMood('Serene');
    setGratitudePrompt(
      t.garden.gratitudePrompts[promptIndex % t.garden.gratitudePrompts.length]
    );
    setGratitudeAnswer('');
    setAchievement('');
    setDailyNote('');
    setFormValidationError(null);
    setIsFormOpen(true);
  };

  const openEditEntryForm = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setEntryDate(entry.date);
    setSelectedMood(entry.mood);
    setGratitudePrompt(entry.gratitudePrompt);
    setGratitudeAnswer(entry.gratitudeAnswer);
    setAchievement(entry.achievement);
    setDailyNote(entry.dailyNote);
    setFormValidationError(null);
    setIsFormOpen(true);
  };

  const cyclePrompt = () => {
    const nextIdx = (promptIndex + 1) % t.garden.gratitudePrompts.length;
    setPromptIndex(nextIdx);
    setGratitudePrompt(t.garden.gratitudePrompts[nextIdx]);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !dailyNote.trim() &&
      !gratitudeAnswer.trim() &&
      !achievement.trim()
    ) {
      setFormValidationError(t.garden.validationError);
      return;
    }

    setFormValidationError(null);

    if (editingId) {
      onUpdateEntry(editingId, {
        date: entryDate,
        mood: selectedMood,
        gratitudePrompt,
        gratitudeAnswer: gratitudeAnswer.trim(),
        achievement: achievement.trim(),
        dailyNote: dailyNote.trim(),
        isSample: false,
      });
      onNotify?.(t.toasts.journalUpdated);
    } else {
      onAddEntry({
        date: entryDate,
        mood: selectedMood,
        gratitudePrompt,
        gratitudeAnswer: gratitudeAnswer.trim(),
        achievement: achievement.trim(),
        dailyNote: dailyNote.trim(),
        isSample: false,
      });
      onNotify?.(t.toasts.journalAdded);
    }

    setIsFormOpen(false);
    setEditingId(null);
  };

  const filteredEntries = useMemo(() => {
    return localizedEntries.filter((entry) => {
      if (moodFilter !== 'All' && entry.mood !== moodFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inNote = entry.dailyNote.toLowerCase().includes(q);
        const inGratitude = entry.gratitudeAnswer.toLowerCase().includes(q);
        const inWin = entry.achievement.toLowerCase().includes(q);
        if (!inNote && !inGratitude && !inWin) return false;
      }
      return true;
    });
  }, [localizedEntries, moodFilter, searchQuery]);

  return (
    <div className="space-y-10 pb-12 animate-page-enter">
      {/* Header & Privacy Note */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-7 border-b border-[#EAE0D8]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#7D6B74]">
            <Lock className="w-3.5 h-3.5 text-[#C97A92]" />
            <span>{t.garden.badge}</span>
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#51434A] tracking-tight">
            {t.garden.title}
          </h1>
          <p className="text-sm sm:text-base text-[#7D6B74]">
            {t.garden.subtitle}
          </p>
        </div>

        <button
          onClick={openNewEntryForm}
          className="min-h-[46px] px-6 py-2.5 rounded-2xl bg-[#51434A] text-[#FFF9F6] text-sm font-medium hover:bg-[#3E3238] active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#E8A2B5]" />
          <span>{t.garden.newEntryBtn}</span>
        </button>
      </section>

      {/* Journal Entry Composer / Editor */}
      {isFormOpen && (
        <section className="rounded-3xl editorial-stationary rose-glass-sheen border-[#E8A2B5] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D8]">
            <div>
              <h2 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
                {editingId
                  ? t.garden.modalEditTitle
                  : t.garden.modalNewTitle}
              </h2>
              <p className="text-xs text-[#7D6B74]">{t.garden.modalSubtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7D6B74] hover:text-[#51434A]"
              aria-label={t.common.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formValidationError && (
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#B91C1C]">
              {formValidationError}
            </div>
          )}

          <form onSubmit={handleSaveEntry} className="space-y-6">
            {/* Mood Selection & Date */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-9 space-y-2">
                <label className="block text-xs font-medium text-[#51434A]">
                  {t.garden.moodQuestionLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {MOOD_KEYS.map((moodKey) => {
                    const isSelected = selectedMood === moodKey;
                    const moodInfo = t.garden.moods[moodKey];
                    return (
                      <button
                        key={moodKey}
                        type="button"
                        onClick={() => setSelectedMood(moodKey)}
                        className={`min-h-[58px] p-2.5 rounded-xl border text-left transition-colors flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#51434A] text-[#FFF9F6] border-[#51434A]'
                            : 'bg-[#FFF9F6] text-[#51434A] border-[#EAE0D8] hover:border-[#E8A2B5]'
                        }`}
                      >
                        <span className="text-xs font-semibold">
                          {moodInfo.label}
                        </span>
                        <span
                          className={`text-[10px] leading-tight ${
                            isSelected ? 'text-[#F4DDE3]' : 'text-[#7D6B74]'
                          }`}
                        >
                          {moodInfo.descriptor}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-3 space-y-2">
                <label className="block text-xs font-medium text-[#51434A]">
                  {t.garden.entryDateLabel}
                </label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] font-mono-tabular text-sm text-[#51434A]"
                  required
                />
              </div>
            </div>

            {/* Rotating Gratitude Prompt */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F3E9DD]/55 border border-[#EAE0D8] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#51434A]">
                  <Sparkles className="w-4 h-4 text-[#C97A92]" />
                  <span>{t.garden.gratitudePromptHeading}</span>
                </div>
                <button
                  type="button"
                  onClick={cyclePrompt}
                  className="min-h-[38px] px-3 py-1 rounded-xl bg-white border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-[#C97A92]" />
                  <span>{t.garden.tryAnotherPromptBtn}</span>
                </button>
              </div>
              <p className="font-serif-editorial italic text-base text-[#51434A]">
                “{gratitudePrompt}”
              </p>
              <textarea
                value={gratitudeAnswer}
                onChange={(e) => setGratitudeAnswer(e.target.value)}
                rows={2}
                placeholder={t.garden.gratitudePlaceholder}
                className="w-full p-3.5 rounded-xl border border-[#EAE0D8] bg-white text-sm text-[#51434A] focus:outline-none focus:border-[#C97A92]"
              />
            </div>

            {/* Personal Achievement / Small Win */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#51434A] mb-1.5">
                <Award className="w-4 h-4 text-[#C97A92]" />
                <span>{t.garden.achievementLabel}</span>
              </label>
              <input
                type="text"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                placeholder={t.garden.achievementPlaceholder}
                className="w-full min-h-[46px] px-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A] focus:outline-none focus:border-[#C97A92]"
              />
            </div>

            {/* Daily Notes */}
            <div>
              <label className="block text-xs font-medium text-[#51434A] mb-1.5">
                {t.garden.dailyNotesLabel}
              </label>
              <textarea
                value={dailyNote}
                onChange={(e) => setDailyNote(e.target.value)}
                rows={4}
                placeholder={t.garden.dailyNotesPlaceholder}
                className="w-full p-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A] leading-relaxed focus:outline-none focus:border-[#C97A92]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="min-h-[44px] px-5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#7D6B74]"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>
                  {editingId ? t.common.save : t.garden.saveReflectionBtn}
                </span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Filter by Mood & Search */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rose-glass-cream rounded-2xl">
          <button
            onClick={() => setMoodFilter('All')}
            className={`min-h-[38px] px-3.5 py-1 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              moodFilter === 'All'
                ? 'bg-white text-[#51434A] shadow-2xs'
                : 'text-[#7D6B74] hover:text-[#51434A]'
            }`}
          >
            {t.garden.allMoodsFilter(entries.length)}
          </button>
          {MOOD_KEYS.map((moodKey) => (
            <button
              key={moodKey}
              onClick={() => setMoodFilter(moodKey)}
              className={`min-h-[38px] px-3.5 py-1 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                moodFilter === moodKey
                  ? 'bg-white text-[#51434A] shadow-2xs'
                  : 'text-[#7D6B74] hover:text-[#51434A]'
              }`}
            >
              {t.garden.moods[moodKey].label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#7D6B74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.garden.searchPlaceholder}
            className="w-full min-h-[44px] pl-10 pr-4 rounded-2xl border border-[#EAE0D8] bg-white text-xs text-[#51434A] focus:outline-none focus:border-[#C97A92]"
          />
        </div>
      </section>

      {/* Journal Entries Feed */}
      {filteredEntries.length === 0 ? (
        <section className="rounded-3xl editorial-card rose-glass-sheen p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF9F6] border border-[#EAE0D8] flex items-center justify-center mx-auto">
            <Flower2 className="w-6 h-6 text-[#C97A92]" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
              {t.garden.emptyTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#7D6B74]">
              {t.garden.emptySubtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={openNewEntryForm}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.garden.writeNewEntryBtn}</span>
            </button>
            {entries.length === 0 && (
              <button
                onClick={() => {
                  onRestoreSampleEntries();
                  onNotify?.(t.toasts.journalRestored);
                }}
                className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.garden.restoreSampleEntriesBtn}</span>
              </button>
            )}
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-3xl editorial-card editorial-card-interactive rose-glass-sheen p-6 sm:p-8 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7D6B74] pb-3 border-b border-[#EAE0D8]/80">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tabular font-medium text-[#51434A]">
                      {entry.date}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#C97A92]">
                      {t.garden.moodLabel}{' '}
                      {t.garden.moods[entry.mood]?.label || entry.mood}
                    </span>
                    {entry.isSample && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="italic">{t.common.sample}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditEntryForm(entry)}
                      className="min-h-[38px] px-3 py-1 rounded-xl text-xs text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t.common.edit}</span>
                    </button>
                    <button
                      onClick={() => setEntryToDelete(entry)}
                      className="min-h-[38px] px-3 py-1 rounded-xl text-xs text-[#7D6B74] hover:text-[#B91C1C] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.common.delete}</span>
                    </button>
                  </div>
                </div>

                {entry.achievement && (
                  <div className="p-4 rounded-2xl bg-[#F4DDE3]/45 border border-[#E8A2B5]/40 space-y-1">
                    <span className="text-[11px] font-semibold text-[#51434A]">
                      {t.garden.smallWinHeading}
                    </span>
                    <p className="text-sm text-[#51434A]">
                      {entry.achievement}
                    </p>
                  </div>
                )}

                {entry.gratitudeAnswer && (
                  <div className="space-y-1">
                    <p className="text-xs italic text-[#7D6B74]">
                      {entry.gratitudePrompt}
                    </p>
                    <p className="text-sm text-[#51434A] leading-relaxed">
                      {entry.gratitudeAnswer}
                    </p>
                  </div>
                )}

                {entry.dailyNote && (
                  <div className="pt-2 space-y-1">
                    <span className="text-[11px] font-semibold text-[#7D6B74]">
                      {t.garden.dailyReflectionHeading}
                    </span>
                    <p className="font-serif-editorial text-base text-[#51434A] leading-relaxed whitespace-pre-line">
                      {entry.dailyNote}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!entryToDelete}
        title={t.garden.deleteModalTitle}
        message={t.garden.deleteModalMsg(entryToDelete?.date || '')}
        confirmLabel={t.garden.deleteConfirmBtn}
        cancelLabel={t.common.cancel}
        onCancel={() => setEntryToDelete(null)}
        onConfirm={() => {
          if (entryToDelete) {
            onDeleteEntry(entryToDelete.id);
            onNotify?.(t.toasts.journalDeleted);
            setEntryToDelete(null);
          }
        }}
      />
    </div>
  );
};

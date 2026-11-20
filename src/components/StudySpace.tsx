import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Circle,
  Edit3,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { localizeStudyTopic, translations } from '../i18n/translations';
import { Language, StudyPriority, StudyTopic } from '../types';
import { FloralCornerFlourish } from './BotanicalOrnaments';
import { ConfirmDialog } from './ConfirmDialog';

interface StudySpaceProps {
  topics: StudyTopic[];
  onAddTopic: (topic: Omit<StudyTopic, 'id'>) => void;
  onUpdateTopic: (id: string, updated: Partial<StudyTopic>) => void;
  onDeleteTopic: (id: string) => void;
  onToggleTopic: (id: string) => void;
  onRestoreSamples: () => void;
  onNotify?: (msg: string) => void;
  language?: Language;
}

export const StudySpace: React.FC<StudySpaceProps> = ({
  topics,
  onAddTopic,
  onUpdateTopic,
  onDeleteTopic,
  onToggleTopic,
  onRestoreSamples,
  onNotify,
  language = 'en',
}) => {
  const t = translations[language];
  const todayIso = new Date().toISOString().split('T')[0];

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'today' | 'pending' | 'completed'
  >('all');
  const [priorityFilter, setPriorityFilter] = useState<'All' | StudyPriority>(
    'All'
  );
  const [selectedDayIso, setSelectedDayIso] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for adding or editing a topic
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [moduleName, setModuleName] = useState(t.study.defaultModules[0]);
  const [priority, setPriority] = useState<StudyPriority>('Medium');
  const [dueDate, setDueDate] = useState(todayIso);
  const [notes, setNotes] = useState('');

  // Confirmation dialog before deleting
  const [topicToDelete, setTopicToDelete] = useState<StudyTopic | null>(null);

  const localizedTopics = useMemo(
    () => topics.map((item) => localizeStudyTopic(item, language)),
    [topics, language]
  );

  // Generate 7-day weekly overview dates starting from yesterday
  const weekDays = useMemo(() => {
    const days: {
      iso: string;
      dayShort: string;
      dayNum: string;
      isToday: boolean;
    }[] = [];
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    for (let i = -1; i <= 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      days.push({
        iso,
        dayShort: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
          d
        ),
        dayNum: String(d.getDate()).padStart(2, '0'),
        isToday: i === 0,
      });
    }
    return days;
  }, [language]);

  const openNewForm = () => {
    setEditingId(null);
    setTitle('');
    setModuleName(t.study.defaultModules[0]);
    setPriority('Medium');
    setDueDate(selectedDayIso || todayIso);
    setNotes('');
    setIsFormOpen(true);
  };

  const openEditForm = (topic: StudyTopic) => {
    setEditingId(topic.id);
    setTitle(topic.title);
    setModuleName(topic.module);
    setPriority(topic.priority);
    setDueDate(topic.dueDate);
    setNotes(topic.notes || '');
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      onUpdateTopic(editingId, {
        title: title.trim(),
        module: moduleName.trim() || t.study.defaultModules[0],
        priority,
        dueDate,
        notes: notes.trim(),
        isSample: false,
      });
      onNotify?.(t.toasts.studyTopicUpdated);
    } else {
      onAddTopic({
        title: title.trim(),
        module: moduleName.trim() || t.study.defaultModules[0],
        priority,
        dueDate,
        completed: false,
        notes: notes.trim(),
        isSample: false,
      });
      onNotify?.(t.toasts.studyTopicAdded);
    }

    setIsFormOpen(false);
    setEditingId(null);
  };

  const filteredTopics = useMemo(() => {
    return localizedTopics.filter((topic) => {
      if (selectedDayIso && topic.dueDate !== selectedDayIso) return false;
      if (statusFilter === 'today' && topic.dueDate !== todayIso) return false;
      if (statusFilter === 'pending' && topic.completed) return false;
      if (statusFilter === 'completed' && !topic.completed) return false;
      if (priorityFilter !== 'All' && topic.priority !== priorityFilter)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = topic.title.toLowerCase().includes(q);
        const matchesModule = topic.module.toLowerCase().includes(q);
        const matchesNotes = (topic.notes || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesModule && !matchesNotes) return false;
      }
      return true;
    });
  }, [
    localizedTopics,
    selectedDayIso,
    statusFilter,
    priorityFilter,
    searchQuery,
    todayIso,
  ]);

  const totalCount = localizedTopics.length;
  const completedCount = localizedTopics.filter((st) => st.completed).length;
  const todaysCount = localizedTopics.filter(
    (st) => st.dueDate === todayIso
  ).length;
  const todaysCompleted = localizedTopics.filter(
    (st) => st.dueDate === todayIso && st.completed
  ).length;
  const completionRate =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-10 pb-12 animate-page-enter">
      {/* Header & Primary Action */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-7 border-b border-[#EAE0D8]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#7D6B74]">
            <FloralCornerFlourish className="w-4 h-4" />
            <span>{t.study.badge}</span>
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#51434A] tracking-tight">
            {t.study.title}
          </h1>
          <p className="text-sm sm:text-base text-[#7D6B74]">
            {t.study.subtitle}
          </p>
        </div>

        <button
          onClick={openNewForm}
          className="min-h-[46px] px-6 py-3 rounded-2xl bg-[#51434A] text-[#FFF9F6] text-sm font-medium hover:bg-[#3E3238] active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#E8A2B5]" />
          <span>{t.study.addTopicBtn}</span>
        </button>
      </section>

      {/* Progress Overview & Weekly 7-Day Strip */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progress Summary */}
        <div className="lg:col-span-5 rounded-3xl rose-glass-cream rose-glass-sheen p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-[#7D6B74] mb-1">
                {t.study.gentlePaceTracker}
              </p>
              <h2 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
                {t.study.overallProgress}
              </h2>
            </div>
            <span className="font-mono-tabular text-2xl font-medium text-[#C97A92]">
              {completionRate}%
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-white border border-[#EAE0D8] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#E8A2B5] transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-[#7D6B74] border-t border-[#EAE0D8]">
            <span>
              {t.study.todaysTasks}{' '}
              <strong className="font-mono-tabular text-[#51434A]">
                {todaysCompleted}/{todaysCount} {t.study.done}
              </strong>
            </span>
            <span>
              {t.study.completedTotal}{' '}
              <strong className="font-mono-tabular text-[#51434A]">
                {completedCount} {t.study.of} {totalCount}
              </strong>
            </span>
          </div>
        </div>

        {/* 7-Day Weekly Overview */}
        <div className="lg:col-span-7 rounded-3xl editorial-card rose-glass-sheen p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C97A92]" />
              <h2 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
                {t.study.weeklyOverview}
              </h2>
            </div>
            {selectedDayIso && (
              <button
                onClick={() => setSelectedDayIso(null)}
                className="min-h-[38px] px-3 py-1 rounded-lg text-xs font-medium text-[#C97A92] hover:bg-[#FFF9F6]"
              >
                {t.study.showAllDays}
              </button>
            )}
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
            {weekDays.map((day) => {
              const dayTopics = localizedTopics.filter(
                (st) => st.dueDate === day.iso
              );
              const isSelected = selectedDayIso === day.iso;
              return (
                <button
                  key={day.iso}
                  onClick={() =>
                    setSelectedDayIso(isSelected ? null : day.iso)
                  }
                  className={`min-h-[72px] rounded-2xl p-2 flex flex-col items-center justify-between border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#51434A] text-[#FFF9F6] border-[#51434A] shadow-xs'
                      : day.isToday
                      ? 'bg-[#F4DDE3]/50 text-[#51434A] border-[#E8A2B5]'
                      : 'bg-[#FFF9F6] text-[#51434A] border-[#EAE0D8] hover:bg-[#F3E9DD]/50'
                  }`}
                >
                  <span
                    className={`text-[11px] ${
                      isSelected ? 'text-[#F4DDE3]' : 'text-[#7D6B74]'
                    }`}
                  >
                    {day.dayShort}
                  </span>
                  <span className="font-mono-tabular text-sm sm:text-base font-semibold">
                    {day.dayNum}
                  </span>
                  <span
                    className={`font-mono-tabular text-[10px] ${
                      isSelected ? 'text-[#FFF9F6]/90' : 'text-[#7D6B74]'
                    }`}
                  >
                    {dayTopics.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add / Edit Topic Form Drawer */}
      {isFormOpen && (
        <section className="rounded-3xl editorial-stationary rose-glass-sheen border-[#E8A2B5] p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE0D8]">
            <h2 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
              {editingId
                ? t.study.editTopicModalTitle
                : t.study.addTopicModalTitle}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#7D6B74] hover:text-[#51434A]"
              aria-label={t.common.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[#51434A] mb-1.5">
                  {t.study.topicTitleLabel}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.study.topicTitlePlaceholder}
                  className="w-full min-h-[46px] px-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A] focus:outline-none focus:border-[#C97A92]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#51434A] mb-1.5">
                  {t.study.medicalModuleLabel}
                </label>
                <input
                  type="text"
                  list="study-module-suggestions"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  placeholder={t.study.medicalModulePlaceholder}
                  className="w-full min-h-[46px] px-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A] focus:outline-none focus:border-[#C97A92]"
                  required
                />
                <datalist id="study-module-suggestions">
                  {t.study.defaultModules.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#51434A] mb-1.5">
                    {t.study.priorityPaceLabel}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as StudyPriority)
                    }
                    className="w-full min-h-[46px] px-3 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A] focus:outline-none focus:border-[#C97A92]"
                  >
                    <option value="High">{t.study.priorities.High}</option>
                    <option value="Medium">{t.study.priorities.Medium}</option>
                    <option value="Gentle">{t.study.priorities.Gentle}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#51434A] mb-1.5">
                    {t.study.targetDateLabel}
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full min-h-[46px] px-3 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm font-mono-tabular text-[#51434A] focus:outline-none focus:border-[#C97A92]"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[#51434A] mb-1.5">
                  {t.study.lectureNotesLabel}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder={t.study.lectureNotesPlaceholder}
                  className="w-full p-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A] focus:outline-none focus:border-[#C97A92]"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="min-h-[44px] px-5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#7D6B74] hover:text-[#51434A]"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>
                  {editingId ? t.common.save : t.study.addToPlanBtn}
                </span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Interactive Filter Controls & Search Bar */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Segmented Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rose-glass-cream rounded-2xl">
          {(
            [
              { id: 'all', label: t.study.filterAll },
              { id: 'today', label: t.study.filterToday },
              { id: 'pending', label: t.study.filterPending },
              { id: 'completed', label: t.study.filterCompleted },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white text-[#51434A] shadow-2xs'
                  : 'text-[#7D6B74] hover:text-[#51434A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Priority Filter & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-1 p-1.5 rose-glass-cream rounded-2xl">
            {(['All', 'High', 'Medium', 'Gentle'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-white text-[#51434A] shadow-2xs'
                    : 'text-[#7D6B74] hover:text-[#51434A]'
                }`}
              >
                {p === 'All' ? t.study.allPaces : t.study.priorities[p]}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#7D6B74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.study.searchPlaceholder}
              className="w-full min-h-[44px] pl-10 pr-4 rounded-2xl border border-[#EAE0D8] bg-white text-xs text-[#51434A] focus:outline-none focus:border-[#C97A92]"
            />
          </div>
        </div>
      </section>

      {/* Study Topic List or Beautiful Empty State */}
      <section className="rounded-3xl editorial-card rose-glass-sheen overflow-hidden">
        {filteredTopics.length === 0 ? (
          <div className="p-12 sm:p-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF9F6] border border-[#EAE0D8] flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6 text-[#C97A92]" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
                {t.study.emptyTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#7D6B74] leading-relaxed">
                {topics.length === 0
                  ? t.study.emptyNoTopics
                  : t.study.emptyFiltered}
              </p>
            </div>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={openNewForm}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.study.addNewTopicBtn}</span>
              </button>
              {(statusFilter !== 'all' ||
                priorityFilter !== 'All' ||
                selectedDayIso !== null ||
                searchQuery.trim() !== '') && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setPriorityFilter('All');
                    setSelectedDayIso(null);
                    setSearchQuery('');
                  }}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] transition-colors cursor-pointer"
                >
                  {t.common.clearFilters}
                </button>
              )}
              {topics.length === 0 && (
                <button
                  onClick={() => {
                    onRestoreSamples();
                    onNotify?.(t.toasts.studyTopicsRestored);
                  }}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.study.restoreSampleTopicsBtn}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#EAE0D8]/80">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FFF9F6]/70 transition-colors"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => {
                      onToggleTopic(topic.id);
                      onNotify?.(
                        !topic.completed
                          ? t.toasts.topicCompleted
                          : t.toasts.topicInProgress
                      );
                    }}
                    className="min-h-[44px] min-w-[44px] -ml-2 -mt-1 flex items-center justify-center rounded-xl text-[#7D6B74] hover:text-[#C97A92] transition-colors shrink-0 cursor-pointer"
                    aria-label={
                      topic.completed
                        ? t.study.markIncompleteAria
                        : t.study.markCompletedAria
                    }
                  >
                    {topic.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#C97A92]" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#7D6B74]">
                      <span className="font-semibold text-[#51434A]">
                        {topic.module}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {t.home.paceLabel}{' '}
                        {t.study.priorities[topic.priority] || topic.priority}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">
                        {t.common.due}{' '}
                        {topic.dueDate === todayIso
                          ? t.common.today
                          : topic.dueDate}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {topic.completed
                          ? t.common.completed
                          : t.common.inProgress}
                      </span>
                      {topic.isSample && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="italic">{t.common.sample}</span>
                        </>
                      )}
                    </div>

                    <h3
                      className={`text-base sm:text-[17px] font-medium ${
                        topic.completed
                          ? 'line-through text-[#7D6B74]'
                          : 'text-[#51434A]'
                      }`}
                    >
                      {topic.title}
                    </h3>

                    {topic.notes && (
                      <p className="text-xs sm:text-sm text-[#7D6B74] leading-relaxed">
                        {topic.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => openEditForm(topic)}
                    className="min-h-[42px] px-3.5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#F3E9DD]/50 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t.common.edit}</span>
                  </button>
                  <button
                    onClick={() => setTopicToDelete(topic)}
                    className="min-h-[42px] px-3.5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#7D6B74] hover:text-[#B91C1C] hover:border-[#FECACA] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.common.delete}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!topicToDelete}
        title={t.study.deleteModalTitle}
        message={t.study.deleteModalMessage(topicToDelete?.title || '')}
        confirmLabel={t.study.deleteConfirmBtn}
        cancelLabel={t.common.cancel}
        onCancel={() => setTopicToDelete(null)}
        onConfirm={() => {
          if (topicToDelete) {
            onDeleteTopic(topicToDelete.id);
            onNotify?.(t.toasts.studyTopicRemoved);
            setTopicToDelete(null);
          }
        }}
      />
    </div>
  );
};

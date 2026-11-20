import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Coffee,
  Edit3,
  Flower2,
  Heart,
  Mail,
  Plus,
  Stethoscope,
} from 'lucide-react';
import {
  localizeLetter,
  localizeStudyTopic,
  translations,
} from '../i18n/translations';
import {
  AppSection,
  AppSettings,
  CardioFlashcard,
  OpenWhenLetter,
  StudyTopic,
} from '../types';
import { FloralCornerFlourish, WaxSealHeart } from './BotanicalOrnaments';
import { Tilt3DCard } from './Tilt3DCard';

interface HomeDashboardProps {
  settings: AppSettings;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  studyTopics: StudyTopic[];
  onToggleTopic: (id: string) => void;
  onQuickAddTopic: (title: string, module: string) => void;
  flashcards: CardioFlashcard[];
  letters: OpenWhenLetter[];
  onNavigate: (section: AppSection) => void;
  onNeedHug: () => void;
}

const DEFAULT_EN_AFFIRMATION =
  'I am learning at my own pace, building wisdom one gentle page at a time, and I am deeply loved exactly as I am today.';
const DEFAULT_EN_REMINDER =
  'Remember to unclench your shoulders, sip some warm water, and give your eyes a quiet pause away from your notes.';

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  settings,
  onUpdateSettings,
  studyTopics,
  onToggleTopic,
  onQuickAddTopic,
  flashcards,
  letters,
  onNavigate,
  onNeedHug,
}) => {
  const t = translations[settings.language];

  // Localize default affirmation/reminder if unchanged from built-in default
  const displayedAffirmation =
    !settings.dailyAffirmation ||
    settings.dailyAffirmation === DEFAULT_EN_AFFIRMATION ||
    settings.dailyAffirmation === translations.fr.home.defaultAffirmation
      ? t.home.defaultAffirmation
      : settings.dailyAffirmation;

  const displayedReminder =
    !settings.dailyRestReminder ||
    settings.dailyRestReminder === DEFAULT_EN_REMINDER ||
    settings.dailyRestReminder === translations.fr.home.defaultRestReminder
      ? t.home.defaultRestReminder
      : settings.dailyRestReminder;

  const [isEditingAffirmation, setIsEditingAffirmation] = useState(false);
  const [affirmationDraft, setAffirmationDraft] =
    useState(displayedAffirmation);
  const [isEditingReminder, setIsEditingReminder] = useState(false);
  const [reminderDraft, setReminderDraft] = useState(displayedReminder);

  const [quickGoalTitle, setQuickGoalTitle] = useState('');
  const [quickGoalModule, setQuickGoalModule] = useState(
    settings.language === 'fr' ? 'Cardiologie' : 'Cardiology'
  );
  const [showQuickGoalInput, setShowQuickGoalInput] = useState(false);

  const todayIso = new Date().toISOString().split('T')[0];
  const formattedDate = new Intl.DateTimeFormat(
    settings.language === 'fr' ? 'fr-FR' : 'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  ).format(new Date());

  // Real progress metrics derived strictly from user's actual topics and flashcards
  const localizedTopics = useMemo(
    () => studyTopics.map((st) => localizeStudyTopic(st, settings.language)),
    [studyTopics, settings.language]
  );

  const totalTopics = localizedTopics.length;
  const completedTopics = localizedTopics.filter((st) => st.completed).length;
  const studyCompletionPercent =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const todaysTopics = localizedTopics
    .filter((st) => st.dueDate <= todayIso || !st.completed)
    .slice(0, 4);

  const masteredCards = flashcards.filter(
    (f) => f.mastered || f.reviewStatus === 'understood'
  ).length;
  const featuredLetter = letters[0]
    ? localizeLetter(letters[0], settings.language)
    : undefined;

  const handleSaveAffirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (affirmationDraft.trim()) {
      onUpdateSettings({ dailyAffirmation: affirmationDraft.trim() });
    }
    setIsEditingAffirmation(false);
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (reminderDraft.trim()) {
      onUpdateSettings({ dailyRestReminder: reminderDraft.trim() });
    }
    setIsEditingReminder(false);
  };

  const handleAddQuickGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickGoalTitle.trim()) return;
    onQuickAddTopic(
      quickGoalTitle.trim(),
      quickGoalModule.trim() ||
        (settings.language === 'fr' ? 'Cardiologie' : 'Cardiology')
    );
    setQuickGoalTitle('');
    setShowQuickGoalInput(false);
  };

  return (
    <div className="space-y-12 pb-12 animate-page-enter">
      {/* Top Personalized Editorial Greeting */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#EAE0D8]">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide text-[#7D6B74]">
            <span>{formattedDate}</span>
            <span aria-hidden="true">·</span>
            <span>{t.home.forRecipient(settings.recipientName)}</span>
            <span aria-hidden="true">·</span>
            <span>{t.tagline}</span>
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[2.65rem] font-normal text-[#51434A] tracking-tight leading-tight">
            {t.home.welcomeHomeGreeting(settings.recipientName)}
          </h1>
          <p className="text-sm sm:text-base text-[#7D6B74] max-w-2xl">
            {t.home.heroSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onNeedHug}
            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E8A2B5]/70 bg-white hover:bg-[#F4DDE3]/40 text-[#51434A] text-xs sm:text-sm font-medium active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#C97A92] fill-[#F4DDE3]" />
            <span>{t.common.needAHug}</span>
          </button>
          <button
            onClick={() => onNavigate('focus')}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#51434A] text-[#FFF9F6] hover:bg-[#3E3238] text-xs sm:text-sm font-medium active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Clock className="w-4 h-4 text-[#E8A2B5]" />
            <span>{t.home.beginFocusBtn(settings.focusMinutes)}</span>
          </button>
        </div>
      </section>

      {/* Daily Affirmation & Gentle Daily Reminder to Rest */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Daily Editable Affirmation (7 cols) - Stationery Glass Card */}
        <Tilt3DCard maxTiltDeg={4.5} scaleOnHover={1.008} className="lg:col-span-7">
          <div className="h-full rounded-3xl editorial-stationary rose-glass-sheen p-7 sm:p-9 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2 text-xs text-[#7D6B74]">
                <FloralCornerFlourish className="w-4 h-4" />
                <span className="font-medium text-[#51434A]">
                  {t.home.dailyAffirmation}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t.home.personalNote}</span>
              </div>
              {!isEditingAffirmation && (
                <button
                  onClick={() => {
                    setAffirmationDraft(displayedAffirmation);
                    setIsEditingAffirmation(true);
                  }}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#7D6B74] hover:text-[#51434A] hover:bg-[#FFF9F6] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#C97A92]" />
                  <span>{t.home.editAffirmation}</span>
                </button>
              )}
            </div>

            {isEditingAffirmation ? (
              <form onSubmit={handleSaveAffirmation} className="space-y-3">
                <textarea
                  value={affirmationDraft}
                  onChange={(e) => setAffirmationDraft(e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-[#E8A2B5] bg-[#FFF9F6] p-4 text-base font-serif-editorial italic text-[#51434A] focus:outline-none focus:ring-2 focus:ring-[#E8A2B5]"
                  aria-label={t.home.editAffirmation}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingAffirmation(false)}
                    className="min-h-[42px] px-4 py-1.5 rounded-xl text-xs font-medium text-[#7D6B74] hover:bg-[#F3E9DD]/50 transition-colors"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    className="min-h-[42px] px-5 py-1.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.home.saveAffirmation}</span>
                  </button>
                </div>
              </form>
            ) : (
              <blockquote className="font-serif-editorial italic text-2xl sm:text-[1.65rem] text-[#51434A] leading-relaxed">
                “{displayedAffirmation}”
              </blockquote>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-[#EAE0D8]/80 flex items-center justify-between text-xs text-[#7D6B74]">
            <span>{t.home.oneGentlePage(settings.recipientName)}</span>
            <span>{t.home.keptInSanctuary}</span>
          </div>
          </div>
        </Tilt3DCard>

        {/* Gentle Daily Reminder to Rest (5 cols) - Warm Cream Glass Surface */}
        <Tilt3DCard maxTiltDeg={5} scaleOnHover={1.008} className="lg:col-span-5">
          <div className="h-full rounded-3xl rose-glass-cream rose-glass-sheen p-7 sm:p-9 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2 text-xs text-[#7D6B74]">
                <Coffee className="w-4 h-4 text-[#C97A92]" />
                <span className="font-medium text-[#51434A]">
                  {t.home.gentleRestReminder}
                </span>
              </div>
              {!isEditingReminder && (
                <button
                  onClick={() => {
                    setReminderDraft(displayedReminder);
                    setIsEditingReminder(true);
                  }}
                  className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium text-[#7D6B74] hover:text-[#51434A] hover:bg-white/70 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.common.edit}</span>
                </button>
              )}
            </div>

            {isEditingReminder ? (
              <form onSubmit={handleSaveReminder} className="space-y-3">
                <textarea
                  value={reminderDraft}
                  onChange={(e) => setReminderDraft(e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-[#E8A2B5] bg-white p-3.5 text-sm text-[#51434A] focus:outline-none focus:ring-2 focus:ring-[#E8A2B5]"
                  aria-label={t.home.gentleRestReminder}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingReminder(false)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs text-[#7D6B74]"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    className="min-h-[40px] px-4 py-1.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium"
                  >
                    {t.common.save}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-base text-[#51434A] leading-relaxed">
                {displayedReminder}
              </p>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-[#EAE0D8] flex items-center justify-between gap-4">
            <div className="text-xs text-[#7D6B74]">
              <span>{t.home.waterCheckIns}</span>
              <strong className="font-mono-tabular text-[#51434A]">
                {settings.hydrationCountToday} {t.home.glasses}
              </strong>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({
                  hydrationCountToday: settings.hydrationCountToday + 1,
                })
              }
              className="min-h-[42px] px-4 py-2 rounded-xl bg-white border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:border-[#E8A2B5] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.home.sipWaterBtn}
            </button>
          </div>
          </div>
        </Tilt3DCard>
      </section>

      {/* Today's Study Goals & Real Study Progress Indicator */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Today's Study Goals (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl editorial-card rose-glass-sheen p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#EAE0D8]">
            <div>
              <p className="text-xs text-[#7D6B74] mb-1">
                {t.home.todaysFocusQueue}
              </p>
              <h2 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
                {t.home.todaysStudyGoals}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQuickGoalInput((prev) => !prev)}
                className="min-h-[42px] px-3.5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C97A92]" />
                <span>{t.home.quickAdd}</span>
              </button>
              <button
                onClick={() => onNavigate('study')}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#F3E9DD]/80 text-xs font-medium text-[#51434A] hover:bg-[#F4DDE3]/70 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{t.home.fullStudyPlanner}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {showQuickGoalInput && (
            <form
              onSubmit={handleAddQuickGoal}
              className="my-5 p-4 rounded-2xl bg-[#FFF9F6] border border-[#EAE0D8] flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={quickGoalTitle}
                onChange={(e) => setQuickGoalTitle(e.target.value)}
                placeholder={t.home.quickGoalTitlePlaceholder}
                className="flex-1 min-h-[44px] px-3.5 rounded-xl border border-[#EAE0D8] bg-white text-sm text-[#51434A] focus:outline-none focus:border-[#C97A92]"
                required
              />
              <input
                type="text"
                value={quickGoalModule}
                onChange={(e) => setQuickGoalModule(e.target.value)}
                placeholder={t.home.quickGoalModulePlaceholder}
                className="sm:w-40 min-h-[44px] px-3.5 rounded-xl border border-[#EAE0D8] bg-white text-sm text-[#51434A] focus:outline-none focus:border-[#C97A92]"
              />
              <button
                type="submit"
                className="min-h-[44px] px-5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] transition-colors whitespace-nowrap shrink-0"
              >
                {t.home.addGoalBtn}
              </button>
            </form>
          )}

          {todaysTopics.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="font-serif-editorial text-xl text-[#51434A]">
                {t.home.emptyQueueTitle}
              </p>
              <p className="text-xs text-[#7D6B74]">
                {t.home.emptyQueueSubtext}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EAE0D8]/80">
              {todaysTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="py-4.5 flex items-start justify-between gap-4 group"
                >
                  <button
                    onClick={() => onToggleTopic(topic.id)}
                    className="flex items-start gap-3.5 text-left flex-1 min-h-[44px] py-1 focus:outline-none cursor-pointer"
                  >
                    {topic.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#C97A92] shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#7D6B74] group-hover:text-[#C97A92] shrink-0 mt-0.5 transition-colors" />
                    )}
                    <div className="space-y-1">
                      <p
                        className={`text-sm sm:text-base font-medium transition-colors ${
                          topic.completed
                            ? 'line-through text-[#7D6B74]'
                            : 'text-[#51434A]'
                        }`}
                      >
                        {topic.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#7D6B74]">
                        <span className="font-medium text-[#51434A]/85">
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
                        {topic.isSample && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="italic">{t.common.sample}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real Study Progress & Featured Love Note (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Honest Progress Indicator Card */}
          <div className="rounded-3xl editorial-card rose-glass-sheen p-6 sm:p-8 space-y-5">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs text-[#7D6B74] mb-0.5">
                  {t.home.honestOverview}
                </p>
                <h3 className="font-serif-editorial text-xl font-normal text-[#51434A]">
                  {t.home.studyProgress}
                </h3>
              </div>
              <span className="font-mono-tabular text-2xl font-medium text-[#C97A92]">
                {studyCompletionPercent}%
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#F3E9DD] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#E8A2B5] transition-all duration-300"
                style={{ width: `${studyCompletionPercent}%` }}
              />
            </div>

            <div className="pt-2 divide-y divide-[#EAE0D8]/70 text-xs text-[#7D6B74]">
              <div className="py-3 flex items-center justify-between">
                <span>{t.home.studyTopicsCompleted}</span>
                <span className="font-mono-tabular font-semibold text-[#51434A]">
                  {completedTopics} / {totalTopics}
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span>{t.home.cardioFlashcardsMastered}</span>
                <span className="font-mono-tabular font-semibold text-[#51434A]">
                  {masteredCards} / {flashcards.length}
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span>{t.home.focusSessionsCompleted}</span>
                <span className="font-mono-tabular font-semibold text-[#51434A]">
                  {settings.completedPomodoroSessions}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Love Note - Postcard Glass Style */}
          {featuredLetter && (
            <Tilt3DCard maxTiltDeg={5.5} scaleOnHover={1.012}>
              <div className="rounded-3xl editorial-stationary rose-glass-sheen p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#7D6B74]">
                    <WaxSealHeart className="w-6 h-6" />
                    <span>{t.home.featuredLoveNote}</span>
                  </div>
                  <span className="text-xs text-[#7D6B74] italic">
                    {featuredLetter.isSample
                      ? t.common.sampleLabel
                      : t.home.personalNote}
                  </span>
                </div>
                <h3 className="font-serif-editorial text-xl font-normal text-[#51434A]">
                  {featuredLetter.occasion}
                </h3>
                <p className="text-sm sm:text-base text-[#51434A]/90 line-clamp-3 leading-relaxed italic font-serif-editorial">
                  “
                  {featuredLetter.content.split('\n\n')[1] ||
                    featuredLetter.content}
                  ”
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('letters')}
                    className="min-h-[40px] text-xs font-semibold text-[#51434A] hover:text-[#C97A92] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{t.home.openEnvelopeLink}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Tilt3DCard>
          )}
        </div>
      </section>

      {/* Curated Editorial Chapter Index (Quick Navigation Cards) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-xs text-[#7D6B74] mb-1">
              {t.home.curatedSanctuarySpaces}
            </p>
            <h2 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
              {t.home.exploreUniverse}
            </h2>
          </div>
          <span className="text-xs text-[#7D6B74]">
            {t.home.fiveSpacesSubtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'study' as AppSection,
              num: '01.',
              title: t.home.chapters.studyTitle,
              subtitle: t.home.chapters.studySubtitle(
                totalTopics - completedTopics
              ),
              icon: BookOpen,
            },
            {
              id: 'cardio' as AppSection,
              num: '02.',
              title: t.home.chapters.cardioTitle,
              subtitle: t.home.chapters.cardioSubtitle,
              icon: Stethoscope,
            },
            {
              id: 'focus' as AppSection,
              num: '03.',
              title: t.home.chapters.focusTitle,
              subtitle: t.home.chapters.focusSubtitle,
              icon: Clock,
            },
            {
              id: 'letters' as AppSection,
              num: '04.',
              title: t.home.chapters.lettersTitle,
              subtitle: t.home.chapters.lettersSubtitle,
              icon: Mail,
            },
            {
              id: 'things-i-love' as AppSection,
              num: '05.',
              title: t.thingsILovePage.title,
              subtitle: t.thingsILovePage.subtitle,
              icon: Heart,
            },
            {
              id: 'garden' as AppSection,
              num: '06.',
              title: t.home.chapters.gardenTitle,
              subtitle: t.home.chapters.gardenSubtitle,
              icon: Flower2,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <Tilt3DCard
                key={card.id}
                maxTiltDeg={6.5}
                scaleOnHover={1.016}
                className="h-full"
              >
                <button
                  onClick={() => onNavigate(card.id)}
                  className="w-full h-full text-left rounded-2xl editorial-card editorial-card-interactive rose-glass-sheen p-6 flex flex-col justify-between min-h-[164px] group cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-serif-editorial italic text-sm text-[#C97A92]">
                      {card.num}
                    </span>
                    <Icon className="w-4 h-4 text-[#C97A92] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-6">
                    <h3 className="font-serif-editorial text-lg font-normal text-[#51434A] group-hover:text-[#B86B82] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#7D6B74] mt-1 leading-relaxed">
                      {card.subtitle}
                    </p>
                  </div>
                </button>
              </Tilt3DCard>
            );
          })}
        </div>
      </section>
    </div>
  );
};

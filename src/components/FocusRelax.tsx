import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Coffee,
  Droplets,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Wind,
} from 'lucide-react';
import { translations } from '../i18n/translations';
import { AppSettings } from '../types';
import { soundEngine } from '../utils/sound';
import { FloralCornerFlourish } from './BotanicalOrnaments';

interface FocusRelaxProps {
  settings: AppSettings;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onNotify?: (msg: string) => void;
}

type TimerPreset = 'focus' | 'shortBreak' | 'longBreak' | 'custom';

export const FocusRelax: React.FC<FocusRelaxProps> = ({
  settings,
  onUpdateSettings,
  onNotify,
}) => {
  const t = translations[settings.language];

  const [preset, setPreset] = useState<TimerPreset>('focus');
  const [customMinutes, setCustomMinutes] = useState<number>(30);
  const [secondsLeft, setSecondsLeft] = useState<number>(
    settings.focusMinutes * 60
  );
  const [totalSeconds, setTotalSeconds] = useState<number>(
    settings.focusMinutes * 60
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [sessionCompletedType, setSessionCompletedType] = useState<
    'focus' | 'break' | null
  >(null);

  // Sync timer duration if settings change while timer is idle
  useEffect(() => {
    if (!hasStarted && !isRunning) {
      let mins = settings.focusMinutes;
      if (preset === 'focus') mins = settings.focusMinutes;
      if (preset === 'shortBreak') mins = settings.shortBreakMinutes;
      if (preset === 'longBreak') mins = settings.longBreakMinutes;
      if (preset === 'custom') mins = customMinutes;
      const secs = Math.max(1, mins) * 60;
      setTotalSeconds(secs);
      setSecondsLeft(secs);
    }
  }, [
    settings.focusMinutes,
    settings.shortBreakMinutes,
    settings.longBreakMinutes,
    preset,
    customMinutes,
    hasStarted,
    isRunning,
  ]);

  // Gentle self-care checklist
  const [selfCareChecks, setSelfCareChecks] = useState<Record<string, boolean>>(
    {
      hydrate: false,
      stretch: false,
      eyes: false,
    }
  );

  // Guided breathing pacer
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathStepIndex, setBreathStepIndex] = useState<number>(0);

  useEffect(() => {
    if (!breathingActive) return;
    const interval = window.setInterval(() => {
      setBreathStepIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [breathingActive]);

  const breathPhases = [
    t.focus.breathInhale,
    t.focus.breathHold,
    t.focus.breathExhale,
  ];
  const currentBreathText = breathPhases[breathStepIndex] || t.focus.breathInhale;

  // Countdown effect
  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // Handle timer completion cleanly outside the state updater
  useEffect(() => {
    if (!isRunning || secondsLeft > 0) return;

    setIsRunning(false);
    setHasStarted(false);
    soundEngine.playChime(settings.soundEnabled);
    if (preset === 'focus' || preset === 'custom') {
      onUpdateSettings({
        completedPomodoroSessions: settings.completedPomodoroSessions + 1,
      });
      setSessionCompletedType('focus');
      onNotify?.(t.toasts.focusSessionCompleted);
    } else {
      setSessionCompletedType('break');
      onNotify?.(t.toasts.restBreakCompleted);
    }
  }, [
    isRunning,
    secondsLeft,
    preset,
    settings.completedPomodoroSessions,
    settings.soundEnabled,
    onUpdateSettings,
    onNotify,
    t.toasts.focusSessionCompleted,
    t.toasts.restBreakCompleted,
  ]);

  const selectPreset = (nextPreset: TimerPreset, mins?: number) => {
    setIsRunning(false);
    setHasStarted(false);
    setSessionCompletedType(null);
    setPreset(nextPreset);

    let durationMins = settings.focusMinutes;
    if (nextPreset === 'focus') durationMins = settings.focusMinutes;
    if (nextPreset === 'shortBreak') durationMins = settings.shortBreakMinutes;
    if (nextPreset === 'longBreak') durationMins = settings.longBreakMinutes;
    if (nextPreset === 'custom') durationMins = mins ?? customMinutes;

    const secs = Math.max(1, durationMins) * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
  };

  const handleStart = () => {
    setSessionCompletedType(null);
    if (secondsLeft === 0) {
      setSecondsLeft(totalSeconds);
    }
    setHasStarted(true);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setHasStarted(false);
    setSessionCompletedType(null);
    setSecondsLeft(totalSeconds);
  };

  const handleCustomDurationApply = (e: React.FormEvent) => {
    e.preventDefault();
    const clamped = Math.min(180, Math.max(1, Number(customMinutes) || 25));
    setCustomMinutes(clamped);
    selectPreset('custom', clamped);
    onNotify?.(t.toasts.customTimerSet(clamped));
  };

  const minutesDisplay = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secondsDisplay = String(secondsLeft % 60).padStart(2, '0');
  const progressRatio =
    totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const circleCircumference = 2 * Math.PI * 112;
  const strokeDashoffset = circleCircumference * (1 - progressRatio);

  return (
    <div className="space-y-10 pb-12 animate-page-enter">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-7 border-b border-[#EAE0D8]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#7D6B74]">
            <FloralCornerFlourish className="w-4 h-4" />
            <span>{t.focus.badge}</span>
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#51434A] tracking-tight">
            {t.focus.title}
          </h1>
          <p className="text-sm sm:text-base text-[#7D6B74]">
            {t.focus.subtitle}
          </p>
        </div>

        {/* Sound Toggle & Session Counter */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <div className="min-h-[44px] px-4 py-2 rounded-2xl bg-white border border-[#EAE0D8] text-xs text-[#51434A] flex items-center gap-2">
            <span>{t.focus.completedSessions}</span>
            <strong className="font-mono-tabular font-semibold text-[#C97A92] text-sm">
              {settings.completedPomodoroSessions}
            </strong>
          </div>

          <button
            onClick={() => {
              const nextSound = !settings.soundEnabled;
              onUpdateSettings({ soundEnabled: nextSound });
              if (nextSound) soundEngine.playChime(true);
              onNotify?.(
                nextSound ? t.toasts.chimeEnabled : t.toasts.chimeMuted
              );
            }}
            className="min-h-[44px] px-4 py-2 rounded-2xl border border-[#EAE0D8] bg-white text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {settings.soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-[#C97A92]" />
                <span>{t.focus.chimeOn}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-[#7D6B74]" />
                <span>{t.focus.chimeMuted}</span>
              </>
            )}
          </button>
        </div>
      </section>

      {sessionCompletedType && (
        <div className="rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] p-4 text-xs sm:text-sm font-medium text-[#14532D] flex items-center justify-between gap-4 animate-page-enter">
          <span>
            {sessionCompletedType === 'focus'
              ? t.focus.focusCompleteBanner
              : t.focus.breakCompleteBanner}
          </span>
          <button
            onClick={() => setSessionCompletedType(null)}
            className="text-xs underline"
          >
            {t.common.dismiss}
          </button>
        </div>
      )}

      {/* Main Grid: Pomodoro Timer (7 cols) + Gentle Self-Care & Breathing (5 cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Pomodoro Timer Stage */}
        <div className="lg:col-span-7 rounded-3xl editorial-card p-6 sm:p-9 flex flex-col items-center space-y-7">
          {/* Preset Selector Tabs */}
          <div className="w-full flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-[#F3E9DD]/75 rounded-2xl">
            <button
              onClick={() => selectPreset('focus')}
              className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                preset === 'focus'
                  ? 'bg-white text-[#51434A] shadow-2xs'
                  : 'text-[#7D6B74] hover:text-[#51434A]'
              }`}
            >
              {t.focus.presetFocus(settings.focusMinutes)}
            </button>
            <button
              onClick={() => selectPreset('shortBreak')}
              className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                preset === 'shortBreak'
                  ? 'bg-white text-[#51434A] shadow-2xs'
                  : 'text-[#7D6B74] hover:text-[#51434A]'
              }`}
            >
              {t.focus.presetShortBreak(settings.shortBreakMinutes)}
            </button>
            <button
              onClick={() => selectPreset('longBreak')}
              className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                preset === 'longBreak'
                  ? 'bg-white text-[#51434A] shadow-2xs'
                  : 'text-[#7D6B74] hover:text-[#51434A]'
              }`}
            >
              {t.focus.presetLongBreak(settings.longBreakMinutes)}
            </button>
            <button
              onClick={() => selectPreset('custom')}
              className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                preset === 'custom'
                  ? 'bg-white text-[#51434A] shadow-2xs'
                  : 'text-[#7D6B74] hover:text-[#51434A]'
              }`}
            >
              {t.focus.presetCustom(customMinutes)}
            </button>
          </div>

          {/* Custom Duration Input */}
          {preset === 'custom' && (
            <form
              onSubmit={handleCustomDurationApply}
              className="flex flex-wrap items-center justify-center gap-2.5 bg-[#FFF9F6] px-4 py-3 rounded-2xl border border-[#EAE0D8]"
            >
              <label className="text-xs text-[#51434A] font-medium">
                {t.focus.customMinutesLabel}
              </label>
              <input
                type="number"
                min={1}
                max={180}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Number(e.target.value))}
                className="w-20 min-h-[40px] px-2.5 rounded-xl border border-[#EAE0D8] bg-white font-mono-tabular text-sm text-[#51434A] text-center"
              />
              <button
                type="submit"
                className="min-h-[40px] px-4 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium cursor-pointer"
              >
                {t.focus.setTimerBtn}
              </button>
            </form>
          )}

          {/* Circular Progress Dial */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle
                cx="128"
                cy="128"
                r="112"
                fill="none"
                stroke="#F3E9DD"
                strokeWidth="8"
              />
              <circle
                cx="128"
                cy="128"
                r="112"
                fill="none"
                stroke="#E8A2B5"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-[#7D6B74] mb-1">
                {preset === 'focus'
                  ? t.focus.dialStatusFocus
                  : preset === 'shortBreak'
                  ? t.focus.dialStatusShortBreak
                  : preset === 'longBreak'
                  ? t.focus.dialStatusLongBreak
                  : t.focus.dialStatusCustom}
              </span>
              <div className="font-mono-tabular text-5xl font-medium text-[#51434A] tracking-tight">
                {minutesDisplay}:{secondsDisplay}
              </div>
              <span className="text-xs text-[#C97A92] mt-2">
                {isRunning
                  ? t.focus.runningStatus
                  : hasStarted
                  ? t.focus.pausedStatus
                  : t.focus.readyStatus}
              </span>
            </div>
          </div>

          {/* Start / Pause / Resume / Reset Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!hasStarted && !isRunning && (
              <button
                onClick={handleStart}
                className="min-h-[48px] px-8 py-3 rounded-2xl bg-[#51434A] text-[#FFF9F6] text-sm font-medium hover:bg-[#3E3238] active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.focus.startSessionBtn}</span>
              </button>
            )}

            {isRunning && (
              <button
                onClick={handlePause}
                className="min-h-[48px] px-8 py-3 rounded-2xl bg-[#E8A2B5] text-[#51434A] text-sm font-semibold hover:bg-[#df91a7] active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>{t.focus.pauseBtn}</span>
              </button>
            )}

            {hasStarted && !isRunning && (
              <button
                onClick={handleResume}
                className="min-h-[48px] px-8 py-3 rounded-2xl bg-[#51434A] text-[#FFF9F6] text-sm font-medium hover:bg-[#3E3238] active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.focus.resumeBtn}</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="min-h-[48px] px-5 py-3 rounded-2xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm font-medium text-[#51434A] hover:bg-[#F3E9DD]/60 active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.focus.resetBtn}</span>
            </button>
          </div>

          <p className="text-xs text-[#7D6B74] text-center max-w-md">
            {t.focus.reassuranceNote}
          </p>
        </div>

        {/* Right: Gentle Reminders to Hydrate, Stretch & Rest (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hydration & Self-Care Reminders */}
          <div className="rounded-3xl editorial-card p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif-editorial text-xl font-normal text-[#51434A]">
                  {t.focus.checkInsTitle}
                </h2>
                <p className="text-xs text-[#7D6B74]">
                  {t.focus.checkInsSubtitle}
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-[#C97A92]" />
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'hydrate',
                  icon: Droplets,
                  title: t.focus.hydrateTitle,
                  subtitle: t.focus.hydrateSubtitle(
                    settings.hydrationCountToday
                  ),
                },
                {
                  id: 'stretch',
                  icon: Wind,
                  title: t.focus.stretchTitle,
                  subtitle: t.focus.stretchSubtitle,
                },
                {
                  id: 'eyes',
                  icon: Coffee,
                  title: t.focus.eyesTitle,
                  subtitle: t.focus.eyesSubtitle,
                },
              ].map((item) => {
                const Icon = item.icon;
                const checked = !!selfCareChecks[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelfCareChecks((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }));
                      if (item.id === 'hydrate' && !checked) {
                        onUpdateSettings({
                          hydrationCountToday:
                            settings.hydrationCountToday + 1,
                        });
                        onNotify?.(t.toasts.hydrationLogged);
                      }
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-colors flex items-start gap-3.5 cursor-pointer ${
                      checked
                        ? 'bg-[#F4DDE3]/40 border-[#E8A2B5]'
                        : 'bg-[#FFF9F6] border-[#EAE0D8] hover:border-[#E8A2B5]'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#C97A92] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#51434A]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#7D6B74] mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 ${
                        checked ? 'text-[#C97A92]' : 'text-[#EAE0D8]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guided Breathing Sanctuary */}
          <div className="rounded-3xl bg-[#F3E9DD]/65 border border-[#EAE0D8] p-6 sm:p-7 text-center space-y-4">
            <h3 className="font-serif-editorial text-xl font-normal text-[#51434A]">
              {t.focus.breathingTitle}
            </h3>
            <p className="text-xs text-[#7D6B74]">
              {t.focus.breathingSubtitle}
            </p>

            <div className="py-4 flex flex-col items-center justify-center">
              <div
                className={`w-28 h-28 rounded-full bg-white border border-[#E8A2B5] flex items-center justify-center px-3 shadow-xs ${
                  breathingActive ? 'animate-breathe' : ''
                }`}
              >
                <span className="font-serif-editorial italic text-xs text-[#51434A]">
                  {breathingActive ? currentBreathText : t.focus.tapToBegin}
                </span>
              </div>
            </div>

            <button
              onClick={() => setBreathingActive((prev) => !prev)}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-white border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] transition-colors cursor-pointer"
            >
              {breathingActive
                ? t.focus.pauseBreathingBtn
                : t.focus.startBreathingBtn}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

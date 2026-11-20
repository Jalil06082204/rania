import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Heart, KeyRound, Lock, Sparkles } from 'lucide-react';
import { HERO_BOTANICAL_IMAGE } from '../data/initialData';
import { translations } from '../i18n/translations';
import {
  AppSettings,
  CardioFlashcard,
  CardioQuizQuestion,
  EcgWaveNote,
  JournalEntry,
  Language,
  LovedQualityItem,
  LoveMessageItem,
  MemoryPhoto,
  OpenWhenLetter,
  StudyTopic,
  VoiceRecording,
} from '../types';
import { soundEngine } from '../utils/sound';
import { emitRoseGoldSparkles } from '../utils/sparkles';
import { AmbientAurora } from './AmbientAurora';
import {
  BotanicalSprig,
  FloralCornerFlourish,
  WaxSealHeart,
} from './BotanicalOrnaments';
import { ResilientImage } from './ResilientImage';
import { SparkleCanvas } from './SparkleCanvas';
import { Tilt3DCard } from './Tilt3DCard';

export interface UnlockedSanctuaryState {
  settings: AppSettings;
  studyTopics: StudyTopic[];
  flashcards: CardioFlashcard[];
  quizQuestions: CardioQuizQuestion[];
  ecgNotes: EcgWaveNote[];
  letters: OpenWhenLetter[];
  voiceRecordings: VoiceRecording[];
  memories: MemoryPhoto[];
  journalEntries: JournalEntry[];
  loveMessages?: LoveMessageItem[];
  thingsILove?: LovedQualityItem[];
}

interface LoginPageProps {
  onUnlocked: (state: UnlockedSanctuaryState, sessionToken?: string) => void;
  language?: Language;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onUnlocked,
  language = 'en',
}) => {
  const t = translations[language];
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Countdown timer if rate-limited / temporarily locked out
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = window.setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setErrorMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isUnlocking || lockoutSeconds > 0) return;
    if (!password.trim()) {
      setErrorMessage(t.login.errorInvalid);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.status === 429) {
        const retrySec = Number(data.retryAfterSeconds) || 300;
        setLockoutSeconds(retrySec);
        setErrorMessage(t.login.errorRateLimit(retrySec));
        setIsSubmitting(false);
        return;
      }

      if (!response.ok || !data.authenticated) {
        setErrorMessage(t.login.errorInvalid);
        setIsSubmitting(false);
        return;
      }

      // Access granted! Clear password field from memory immediately
      setPassword('');
      setIsSubmitting(false);
      setIsUnlocking(true);
      soundEngine.playChime(true);
      emitRoseGoldSparkles('unlock');

      // Subtle romantic heart animation before transitioning to the Home Dashboard
      window.setTimeout(() => {
        onUnlocked(data.state, data.sessionToken);
      }, 1150);
    } catch {
      setErrorMessage(t.login.errorInvalid);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-transparent text-[#51434A] flex flex-col justify-between relative overflow-hidden px-4 sm:px-8 py-6 sm:py-10">
      <AmbientAurora mode="gate" />
      <SparkleCanvas />

      {/* Top Editorial Bar */}
      <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <WaxSealHeart className="w-7 h-7" />
          <span className="font-serif-editorial text-lg font-medium tracking-tight text-[#51434A]">
            {t.brandName}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#7D6B74] rose-glass-chrome px-3.5 py-1.5 rounded-full border border-white/70">
          <Lock className="w-3.5 h-3.5 text-[#C97A92]" />
          <span>{t.forRania}</span>
        </div>
      </header>

      {/* Main Centered Romantic Entrance Card */}
      <main className="relative z-10 max-w-xl w-full mx-auto my-auto py-8">
        <Tilt3DCard maxTiltDeg={5.5} scaleOnHover={1.008} disabled={isUnlocking}>
          <div
            className={`relative rounded-[2.25rem] editorial-stationary rose-glass-sheen transition-all duration-700 px-6 sm:px-12 py-10 sm:py-14 text-center overflow-hidden ${
              isUnlocking
                ? 'border-[#E8A2B5] ring-4 ring-[#F4DDE3]/70 scale-[1.01]'
                : ''
            }`}
          >
          {/* Delicate Corner Botanical Flourishes */}
          <FloralCornerFlourish className="hidden sm:block absolute top-4 left-4 w-16 h-16 pointer-events-none" />
          <FloralCornerFlourish className="hidden sm:block absolute top-4 right-4 w-16 h-16 -scale-x-100 pointer-events-none" />
          <FloralCornerFlourish className="hidden sm:block absolute bottom-4 left-4 w-16 h-16 -scale-y-100 pointer-events-none" />
          <FloralCornerFlourish className="hidden sm:block absolute bottom-4 right-4 w-16 h-16 rotate-180 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center space-y-6">
            {/* Botanical Emblem + Subtle Floating Hearts Animation when Access is Granted */}
            <div className="relative flex items-center justify-center">
              <div
                className={`relative p-2.5 rounded-full bg-gradient-to-b from-[#FFF9F6] to-[#F3E9DD] border transition-all duration-700 shadow-xs ${
                  isUnlocking
                    ? 'border-[#C97A92] scale-105 shadow-[0_0_35px_rgba(232,162,181,0.45)]'
                    : 'border-[#EAE0D8]'
                }`}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-[#E8A2B5]/40 bg-[#FFF9F6]">
                  <ResilientImage
                    src={HERO_BOTANICAL_IMAGE}
                    alt="Fine line botanical heart illustration"
                    className="w-full h-full object-cover"
                    fallbackTitle="Her Little Heart"
                    priority
                  />
                </div>
              </div>

              {/* Subtle Floating Hearts Animation upon Unlock */}
              {isUnlocking && (
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Heart className="w-7 h-7 text-[#C97A92] fill-[#E8A2B5] absolute -top-6 -left-4 animate-bounce opacity-90" />
                  <Heart className="w-9 h-9 text-[#C97A92] fill-[#C97A92] absolute -top-10 animate-ping opacity-75" />
                  <Heart className="w-6 h-6 text-[#C97A92] fill-[#F4DDE3] absolute -top-5 -right-4 animate-bounce opacity-90" />
                  <Heart className="w-5 h-5 text-[#E8A2B5] fill-[#E8A2B5] absolute top-2 -left-8 animate-pulse" />
                  <Heart className="w-5 h-5 text-[#E8A2B5] fill-[#E8A2B5] absolute top-2 -right-8 animate-pulse" />
                </div>
              )}
            </div>

            {/* Romantic Lock Screen Headings */}
            <div className="space-y-2.5 max-w-md mx-auto">
              <p className="text-xs uppercase tracking-[0.22em] text-[#7D6B74] font-medium">
                {t.login.privateSanctuary}
              </p>
              <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#51434A] tracking-tight leading-tight">
                {t.login.title}
              </h1>
              <p className="font-serif-editorial italic text-base sm:text-lg text-[#7D6B74] leading-relaxed">
                {t.login.subtitle}
              </p>
            </div>

            <BotanicalSprig className="w-28 h-5" />

            {/* Unlock Success State vs Password Form */}
            {isUnlocking ? (
              <div className="py-6 space-y-3 animate-page-enter">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F4DDE3]/80 border border-[#E8A2B5] text-sm font-medium text-[#51434A]">
                  <Heart className="w-4 h-4 text-[#C97A92] fill-[#C97A92] animate-pulse" />
                  <span>{t.login.welcomeHome}</span>
                </div>
                <p className="text-xs text-[#7D6B74]">
                  {t.login.openingSanctuary}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm mx-auto space-y-4 pt-1"
              >
                <div className="text-left">
                  <label
                    htmlFor="sanctuary-secret-input"
                    className="sr-only"
                  >
                    {t.login.passphraseLabel}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#C97A92] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="sanctuary-secret-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage && lockoutSeconds === 0) {
                          setErrorMessage(null);
                        }
                      }}
                      disabled={isSubmitting || lockoutSeconds > 0}
                      placeholder={t.login.passphrasePlaceholder}
                      autoComplete="off"
                      autoFocus
                      className="w-full min-h-[52px] pl-11 pr-12 rounded-2xl border border-[#EAE0D8]/80 bg-white/65 backdrop-blur-md text-sm text-[#51434A] placeholder:text-[#7D6B74]/70 focus:outline-none focus:border-[#C97A92] focus:bg-white/90 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 min-h-[38px] min-w-[38px] rounded-xl flex items-center justify-center text-[#7D6B74] hover:text-[#51434A] transition-colors cursor-pointer"
                      aria-label={
                        showPassword
                          ? t.login.hidePassword
                          : t.login.showPassword
                      }
                      title={
                        showPassword
                          ? t.login.hidePassword
                          : t.login.showPassword
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Gentle Incorrect Password Message */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-2xl bg-[#FFF9F6] border border-[#E8A2B5] px-4 py-3 text-xs sm:text-sm text-[#51434A] font-serif-editorial italic flex items-center justify-center gap-2 animate-page-enter"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#C97A92] fill-[#F4DDE3] shrink-0" />
                    <span>
                      {lockoutSeconds > 0
                        ? t.login.errorRateLimit(lockoutSeconds)
                        : errorMessage}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || lockoutSeconds > 0}
                  className="w-full min-h-[52px] px-7 py-3.5 rounded-2xl bg-[#51434A] text-[#FFF9F6] text-sm font-medium tracking-wide hover:bg-[#3E3238] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#E8A2B5]" />
                  <span>
                    {isSubmitting ? t.login.unlocking : t.login.enterMyWorld}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
        </Tilt3DCard>
      </main>

      {/* Discreet Creator Credit Footer */}
      <footer className="relative z-10 max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7D6B74]">
        <span className="font-serif-editorial italic text-[#51434A]">
          {t.creatorCredit}
        </span>
        <span>{t.secondaryTagline}</span>
      </footer>
    </div>
  );
};

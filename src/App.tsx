/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Clock,
  Flower2,
  Heart,
  Home,
  Lock,
  Mail,
  Settings,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { DEFAULT_LOCKED_SETTINGS } from './data/initialData';
import { translations } from './i18n/translations';
import {
  AppSection,
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
} from './types';
import { AmbientAurora, AmbientAuroraMode } from './components/AmbientAurora';
import { WaxSealHeart } from './components/BotanicalOrnaments';
import { CardioAcademy } from './components/CardioAcademy';
import { FocusRelax } from './components/FocusRelax';
import { HomeDashboard } from './components/HomeDashboard';
import { HugModal } from './components/HugModal';
import { LittleGarden } from './components/LittleGarden';
import { LoginPage, UnlockedSanctuaryState } from './components/LoginPage';
import { LoveLetters } from './components/LoveLetters';
import { SettingsPage } from './components/SettingsPage';
import { StudyCompletionModal } from './components/StudyCompletionModal';
import { StudySpace } from './components/StudySpace';
import { ThingsILovePage } from './components/ThingsILovePage';
import { ToastBanner } from './components/ToastBanner';
import { WelcomePage } from './components/WelcomePage';

const UI_SECTION_STORAGE_KEY = 'hlh_active_section_v2';
const SESSION_TOKEN_HEADER_KEY = 'hlh_opaque_session_id_v1';
const LANGUAGE_STORAGE_KEY = 'hlh_language_pref_v1';

function getStoredLanguage(): Language | undefined {
  try {
    const raw = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (raw === 'en' || raw === 'fr') return raw;
  } catch {}
  return undefined;
}

function setStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {}
}

function getStoredOpaqueToken(): string | undefined {
  try {
    return localStorage.getItem(SESSION_TOKEN_HEADER_KEY) || undefined;
  } catch {
    return undefined;
  }
}

function setStoredOpaqueToken(token: string | undefined): void {
  try {
    if (token) {
      localStorage.setItem(SESSION_TOKEN_HEADER_KEY, token);
    } else {
      localStorage.removeItem(SESSION_TOKEN_HEADER_KEY);
    }
  } catch {}
}

function buildAuthHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...extra };
  const token = getStoredOpaqueToken();
  if (token) {
    headers['X-Sanctuary-Session'] = token;
  }
  return headers;
}

function attachMediaSessionQuery(memories: MemoryPhoto[]): MemoryPhoto[] {
  const token = getStoredOpaqueToken();
  if (!token) return memories;
  return memories.map((m) => {
    if (m.imageUrl.startsWith('/api/media/') && !m.imageUrl.includes('?st=')) {
      return {
        ...m,
        imageUrl: `${m.imageUrl}?st=${encodeURIComponent(token)}`,
      };
    }
    return m;
  });
}

function stripMediaSessionQuery(memories: MemoryPhoto[]): MemoryPhoto[] {
  return memories.map((m) => {
    if (m.imageUrl.startsWith('/api/media/') && m.imageUrl.includes('?st=')) {
      return {
        ...m,
        imageUrl: m.imageUrl.split('?st=')[0],
      };
    }
    return m;
  });
}

export default function App() {
  const [isSessionChecking, setIsSessionChecking] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [activeSection, setActiveSection] = useState<AppSection>(() => {
    try {
      const raw = localStorage.getItem(UI_SECTION_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AppSection;
    } catch {}
    return 'home';
  });

  // Private Sanctuary State (Populated exclusively from protected server API after authentication)
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedLang = getStoredLanguage();
    return savedLang
      ? { ...DEFAULT_LOCKED_SETTINGS, language: savedLang }
      : DEFAULT_LOCKED_SETTINGS;
  });
  const [studyTopics, setStudyTopics] = useState<StudyTopic[]>([]);
  const [flashcards, setFlashcards] = useState<CardioFlashcard[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<CardioQuizQuestion[]>([]);
  const [ecgNotes, setEcgNotes] = useState<EcgWaveNote[]>([]);
  const [letters, setLetters] = useState<OpenWhenLetter[]>([]);
  const [voiceRecordings, setVoiceRecordings] = useState<VoiceRecording[]>([]);
  const [memories, setMemories] = useState<MemoryPhoto[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loveMessages, setLoveMessages] = useState<LoveMessageItem[]>([]);
  const [thingsILove, setThingsILove] = useState<LovedQualityItem[]>([]);

  const [isHugModalOpen, setIsHugModalOpen] = useState(false);
  const [completedGoalSurpriseTitle, setCompletedGoalSurpriseTitle] = useState<
    string | null
  >(null);
  const [focusAmbientMode, setFocusAmbientMode] = useState<'focus' | 'rest'>(
    'focus'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasHydratedFromServerRef = useRef<boolean>(false);

  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const applyServerState = useCallback((state: UnlockedSanctuaryState) => {
    hasHydratedFromServerRef.current = false;
    const localLang = getStoredLanguage();
    const resolvedLanguage: Language =
      localLang || state.settings.language || 'en';
    setStoredLanguage(resolvedLanguage);
    setSettings({
      ...state.settings,
      language: resolvedLanguage,
    });
    setStudyTopics(state.studyTopics);
    setFlashcards(state.flashcards);
    setQuizQuestions(state.quizQuestions);
    setEcgNotes(state.ecgNotes);
    setLetters(state.letters);
    setVoiceRecordings(state.voiceRecordings);
    setMemories(attachMediaSessionQuery(state.memories));
    setJournalEntries(state.journalEntries);
    if (Array.isArray(state.loveMessages)) {
      setLoveMessages(state.loveMessages);
    }
    if (Array.isArray(state.thingsILove)) {
      setThingsILove(state.thingsILove);
    }
    window.setTimeout(() => {
      hasHydratedFromServerRef.current = true;
    }, 50);
  }, []);

  // Verify existing HttpOnly session cookie on page load / refresh
  useEffect(() => {
    let cancelled = false;
    async function verifySessionAndLoadState() {
      try {
        const sessionRes = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
          headers: buildAuthHeaders(),
        });
        const sessionData = await sessionRes.json();

        if (!sessionData.authenticated) {
          if (!cancelled) {
            setIsAuthenticated(false);
            setIsSessionChecking(false);
          }
          return;
        }

        if (typeof sessionData.sessionToken === 'string' && sessionData.sessionToken) {
          setStoredOpaqueToken(sessionData.sessionToken);
        }

        // Session is valid; fetch protected sanctuary data from server
        const stateRes = await fetch('/api/sanctuary/state', {
          method: 'GET',
          credentials: 'include',
          headers: buildAuthHeaders(),
        });

        if (!stateRes.ok) {
          if (!cancelled) {
            setIsAuthenticated(false);
            setIsSessionChecking(false);
          }
          return;
        }

        const { state } = await stateRes.json();
        if (!cancelled && state) {
          applyServerState(state);
          setIsAuthenticated(true);
        }
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setIsSessionChecking(false);
        }
      }
    }

    verifySessionAndLoadState();
    return () => {
      cancelled = true;
    };
  }, [applyServerState]);

  // Persist active section choice
  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      localStorage.setItem(
        UI_SECTION_STORAGE_KEY,
        JSON.stringify(activeSection)
      );
    } catch {}
  }, [activeSection, isAuthenticated]);

  // Sync updated state to protected backend whenever authenticated user modifies data
  useEffect(() => {
    if (!isAuthenticated || !hasHydratedFromServerRef.current) return;

    const timer = window.setTimeout(() => {
      fetch('/api/sanctuary/state', {
        method: 'PUT',
        credentials: 'include',
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          settings,
          studyTopics,
          flashcards,
          quizQuestions,
          ecgNotes,
          letters,
          voiceRecordings,
          memories: stripMediaSessionQuery(memories),
          journalEntries,
          loveMessages,
          thingsILove,
        }),
      }).catch(() => {});
    }, 250);

    return () => clearTimeout(timer);
  }, [
    isAuthenticated,
    settings,
    studyTopics,
    flashcards,
    quizQuestions,
    ecgNotes,
    letters,
    voiceRecordings,
    memories,
    journalEntries,
    loveMessages,
    thingsILove,
  ]);

  const handleUnlocked = (
    state: UnlockedSanctuaryState,
    sessionToken?: string
  ) => {
    if (sessionToken) {
      setStoredOpaqueToken(sessionToken);
    }
    applyServerState(state);
    setIsAuthenticated(true);
    setActiveSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLockSanctuary = async () => {
    try {
      await fetch('/api/auth/lock', {
        method: 'POST',
        credentials: 'include',
        headers: buildAuthHeaders(),
      });
    } catch {}
    setStoredOpaqueToken(undefined);
    hasHydratedFromServerRef.current = false;
    setIsAuthenticated(false);
    // Wipe private state from browser memory when locked
    setStudyTopics([]);
    setFlashcards([]);
    setQuizQuestions([]);
    setEcgNotes([]);
    setLetters([]);
    setVoiceRecordings([]);
    setMemories([]);
    setJournalEntries([]);
    setLoveMessages([]);
    setThingsILove([]);
  };

  const t = translations[settings.language];

  const handleEnterWorld = () => {
    setActiveSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (section: AppSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    if (partial.language) {
      setStoredLanguage(partial.language);
    }
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  // Study Topics Handlers
  const handleAddStudyTopic = (topic: Omit<StudyTopic, 'id'>) => {
    const newTopic: StudyTopic = {
      ...topic,
      id: `st-${Date.now()}`,
    };
    setStudyTopics((prev) => [newTopic, ...prev]);
  };

  const handleQuickAddTopic = (title: string, module: string) => {
    const todayIso = new Date().toISOString().split('T')[0];
    handleAddStudyTopic({
      title,
      module,
      priority: 'Medium',
      dueDate: todayIso,
      completed: false,
      isSample: false,
    });
    showToast(t.toasts.studyGoalAddedToday);
  };

  const handleUpdateStudyTopic = (id: string, updated: Partial<StudyTopic>) => {
    setStudyTopics((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleDeleteStudyTopic = (id: string) => {
    setStudyTopics((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleStudyTopic = (id: string) => {
    const target = studyTopics.find((item) => item.id === id);
    const becomingCompleted = target ? !target.completed : false;

    setStudyTopics((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );

    if (becomingCompleted && target) {
      setCompletedGoalSurpriseTitle(target.title);
    }
  };

  // Cardio Academy Handlers
  const handleAddFlashcard = (card: Omit<CardioFlashcard, 'id'>) => {
    setFlashcards((prev) => [{ ...card, id: `fc-${Date.now()}` }, ...prev]);
  };

  const handleUpdateFlashcard = (
    id: string,
    updated: Partial<CardioFlashcard>
  ) => {
    setFlashcards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const handleDeleteFlashcard = (id: string) => {
    setFlashcards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddQuizQuestion = (q: Omit<CardioQuizQuestion, 'id'>) => {
    setQuizQuestions((prev) => [{ ...q, id: `qz-${Date.now()}` }, ...prev]);
  };

  const handleUpdateQuizQuestion = (
    id: string,
    updated: Partial<CardioQuizQuestion>
  ) => {
    setQuizQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
    );
  };

  const handleDeleteQuizQuestion = (id: string) => {
    setQuizQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleUpdateEcgNote = (
    id: EcgWaveNote['id'],
    personalNote: string
  ) => {
    setEcgNotes((prev) =>
      prev.map((w) => (w.id === id ? { ...w, personalNote } : w))
    );
  };

  // Love Letters & Personal Messages Handlers
  const handleAddLetter = (letter: Omit<OpenWhenLetter, 'id'>): string => {
    const newId = `ow-${Date.now()}`;
    setLetters((prev) => [{ ...letter, id: newId }, ...prev]);
    return newId;
  };

  const handleUpdateLetter = (
    id: string,
    updated: Partial<OpenWhenLetter>
  ) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
    );
  };

  const handleDeleteLetter = (id: string) => {
    setLetters((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAddLoveMessage = (msg: Omit<LoveMessageItem, 'id'>) => {
    setLoveMessages((prev) => [{ ...msg, id: `lm-${Date.now()}` }, ...prev]);
  };

  const handleUpdateLoveMessage = (
    id: string,
    updated: Partial<LoveMessageItem>
  ) => {
    setLoveMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
    );
  };

  const handleDeleteLoveMessage = (id: string) => {
    setLoveMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddLovedQuality = (item: Omit<LovedQualityItem, 'id'>) => {
    setThingsILove((prev) => [{ ...item, id: `til-${Date.now()}` }, ...prev]);
  };

  const handleUpdateLovedQuality = (
    id: string,
    updated: Partial<LovedQualityItem>
  ) => {
    setThingsILove((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
    );
  };

  const handleDeleteLovedQuality = (id: string) => {
    setThingsILove((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAddVoiceRecording = (rec: Omit<VoiceRecording, 'id'>) => {
    setVoiceRecordings((prev) => [{ ...rec, id: `vr-${Date.now()}` }, ...prev]);
  };

  const handleUpdateVoiceRecording = (
    id: string,
    updated: Partial<VoiceRecording>
  ) => {
    setVoiceRecordings((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updated } : v))
    );
  };

  const handleDeleteVoiceRecording = (id: string) => {
    setVoiceRecordings((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddMemory = (mem: Omit<MemoryPhoto, 'id'>) => {
    setMemories((prev) =>
      attachMediaSessionQuery([{ ...mem, id: `mem-${Date.now()}` }, ...prev])
    );
  };

  const handleUpdateMemory = (id: string, updated: Partial<MemoryPhoto>) => {
    setMemories((prev) =>
      attachMediaSessionQuery(
        prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
      )
    );
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // Little Garden Journal Handlers
  const handleAddJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    setJournalEntries((prev) => [{ ...entry, id: `je-${Date.now()}` }, ...prev]);
  };

  const handleUpdateJournalEntry = (
    id: string,
    updated: Partial<JournalEntry>
  ) => {
    setJournalEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Server-Backed Sample Restore & Clear Handlers
  const handleRestoreScope = async (
    scope:
      | 'all'
      | 'studyTopics'
      | 'flashcards'
      | 'quizQuestions'
      | 'letters'
      | 'memories'
      | 'journalEntries'
      | 'loveMessages'
      | 'thingsILove'
  ) => {
    try {
      const res = await fetch('/api/sanctuary/reset', {
        method: 'POST',
        credentials: 'include',
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ scope }),
      });
      if (res.ok) {
        const { state } = await res.json();
        if (state) applyServerState(state);
      }
    } catch {}
  };

  const handleResetToSampleData = () => {
    handleRestoreScope('all');
    showToast(t.toasts.restoredAllSamples);
  };

  const handleClearAllData = async () => {
    try {
      const res = await fetch('/api/sanctuary/clear', {
        method: 'POST',
        credentials: 'include',
        headers: buildAuthHeaders(),
      });
      if (res.ok) {
        const { state } = await res.json();
        if (state) applyServerState(state);
      }
    } catch {}
    showToast(t.toasts.clearedAllData);
  };

  const handleExportBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings,
      studyTopics,
      flashcards,
      quizQuestions,
      ecgNotes,
      letters,
      loveMessages,
      thingsILove,
      memories: stripMediaSessionQuery(memories),
      journalEntries,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `her-little-heart-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t.toasts.backupDownloaded);
  };

  // 1. Initial Session Check Loader
  if (isSessionChecking) {
    return (
      <div className="min-h-screen w-full bg-[#FFF9F6] text-[#51434A] flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <WaxSealHeart className="w-10 h-10 animate-pulse" />
          <p className="font-serif-editorial italic text-lg text-[#7D6B74]">
            Her Little Heart...
          </p>
        </div>
      </div>
    );
  }

  // 2. Password-Only Romantic Lock Screen (Unauthenticated visitors cannot see any private content)
  if (!isAuthenticated) {
    return (
      <LoginPage
        onUnlocked={handleUnlocked}
        language={settings.language}
      />
    );
  }

  // 3. Optional Welcome Screen
  if (activeSection === 'welcome') {
    return (
      <>
        <WelcomePage
          recipientName={settings.recipientName}
          language={settings.language}
          onEnterWorld={handleEnterWorld}
          onNeedHug={() => setIsHugModalOpen(true)}
        />
        <HugModal
          isOpen={isHugModalOpen}
          onClose={() => setIsHugModalOpen(false)}
          language={settings.language}
          soundEnabled={settings.soundEnabled}
          customMessage={settings.customHugMessage}
          customSubtext={settings.customHugSubtext}
          onSaveCustomHug={(msg, sub) => {
            updateSettings({
              customHugMessage: msg,
              customHugSubtext: sub,
            });
            showToast(t.toasts.savedToSanctuary);
          }}
        />
      </>
    );
  }

  const sidebarItems: {
    id: AppSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'study', label: t.nav.study, icon: BookOpen },
    { id: 'cardio', label: t.nav.cardio, icon: Stethoscope },
    { id: 'focus', label: t.nav.focus, icon: Clock },
    { id: 'letters', label: t.nav.letters, icon: Mail },
    { id: 'things-i-love', label: t.nav.thingsILove, icon: Heart },
    { id: 'garden', label: t.nav.garden, icon: Flower2 },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  // Compact mobile bottom tabs (5 primary destinations)
  const mobileBottomItems: {
    id: AppSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'home', label: t.nav.homeShort, icon: Home },
    { id: 'study', label: t.nav.studyShort, icon: BookOpen },
    { id: 'cardio', label: t.nav.cardioShort, icon: Stethoscope },
    { id: 'focus', label: t.nav.focusShort, icon: Clock },
    { id: 'letters', label: t.nav.lettersShort, icon: Mail },
  ];

  const ambientMode: AmbientAuroraMode =
    activeSection === 'study' || activeSection === 'cardio'
      ? 'focus'
      : activeSection === 'focus'
      ? focusAmbientMode
      : activeSection === 'letters' ||
        activeSection === 'things-i-love' ||
        activeSection === 'garden'
      ? 'rest'
      : 'sanctuary';

  return (
    <div className="min-h-screen w-full bg-transparent text-[#51434A] flex flex-col lg:flex-row relative overflow-x-hidden">
      {/* Living Ambient Rose-Petal & Champagne-Cream Aurora Backdrop */}
      <AmbientAurora mode={ambientMode} />

      {/* Desktop Editorial Rose-Quartz Glass Sidebar Navigation */}
      <aside className="hidden lg:flex lg:w-68 lg:flex-col lg:fixed lg:inset-y-0 rose-glass-chrome border-r border-white/65 z-30 justify-between p-7">
        <div className="space-y-8">
          {/* Brand Lockup */}
          <div className="flex items-center gap-3 pb-5 border-b border-[#EAE0D8]/80">
            <WaxSealHeart className="w-9 h-9 shrink-0" />
            <div>
              <button
                onClick={() => handleNavigate('home')}
                className="text-left font-serif-editorial text-xl font-normal text-[#51434A] tracking-tight block cursor-pointer"
              >
                {t.brandName}
              </button>
              <p className="text-xs text-[#7D6B74]">
                {t.forRania} · {t.personalEdition}
              </p>
            </div>
          </div>

          {/* Primary Navigation Links */}
          <nav className="space-y-1.5" aria-label="Main Sidebar Navigation">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-3.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#F3E9DD]/85 text-[#51434A] font-semibold shadow-2xs'
                      : 'text-[#7D6B74] hover:text-[#51434A] hover:bg-[#FFF9F6]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#C97A92]' : 'text-[#7D6B74]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Actions & Discreet Creator Credit */}
        <div className="space-y-3 pt-6 border-t border-[#EAE0D8]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigate('welcome')}
              className="flex-1 min-h-[40px] px-3 py-2 rounded-xl border border-white/70 bg-white/55 text-xs font-medium text-[#51434A] hover:bg-[#F3E9DD]/65 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C97A92]" />
              <span>{t.nav.welcome}</span>
            </button>

            <button
              onClick={handleLockSanctuary}
              className="min-h-[40px] px-3 py-2 rounded-xl border border-white/70 bg-white/65 hover:bg-white/85 text-xs font-medium text-[#7D6B74] hover:text-[#51434A] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              title={t.nav.lockSanctuary}
            >
              <Lock className="w-3.5 h-3.5 text-[#C97A92]" />
              <span>{t.nav.lock}</span>
            </button>
          </div>

          <div className="text-[11px] text-[#7D6B74] space-y-0.5">
            <p className="font-serif-editorial italic text-xs text-[#51434A]">
              {t.creatorCredit}
            </p>
            <p>{t.secondaryTagline}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="relative z-10 flex-1 lg:pl-68 flex flex-col min-h-screen">
        {/* Top Bar Contract: 3 Zones separated by gap-8 */}
        <header className="sticky top-0 z-20 h-14 rose-glass-chrome border-b border-white/65 px-4 sm:px-8 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavigate('home')}
            className="font-serif-editorial text-lg font-medium text-[#51434A] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.brandName}
          </button>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav
            className="hidden md:flex items-center gap-6 text-xs font-medium text-[#7D6B74]"
            aria-label="Top Bar Quick Links"
          >
            <button
              onClick={() => handleNavigate('study')}
              className={`hover:text-[#51434A] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'study'
                  ? 'text-[#51434A] underline underline-offset-4'
                  : ''
              }`}
            >
              {t.nav.study}
            </button>
            <button
              onClick={() => handleNavigate('cardio')}
              className={`hover:text-[#51434A] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'cardio'
                  ? 'text-[#51434A] underline underline-offset-4'
                  : ''
              }`}
            >
              {t.nav.cardio}
            </button>
            <button
              onClick={() => handleNavigate('letters')}
              className={`hover:text-[#51434A] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'letters'
                  ? 'text-[#51434A] underline underline-offset-4'
                  : ''
              }`}
            >
              {t.nav.letters}
            </button>
            <button
              onClick={() => handleNavigate('things-i-love')}
              className={`hover:text-[#51434A] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'things-i-love'
                  ? 'text-[#51434A] underline underline-offset-4'
                  : ''
              }`}
            >
              {t.nav.thingsILove}
            </button>
            <button
              onClick={() => handleNavigate('garden')}
              className={`hover:text-[#51434A] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'garden'
                  ? 'text-[#51434A] underline underline-offset-4'
                  : ''
              }`}
            >
              {t.nav.gardenShort}
            </button>
            <button
              onClick={() => handleNavigate('settings')}
              className={`hover:text-[#51434A] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'settings'
                  ? 'text-[#51434A] underline underline-offset-4'
                  : ''
              }`}
            >
              {t.nav.settings}
            </button>
          </nav>

          {/* Zone 3: Primary action + Mobile Garden/Settings access */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => handleNavigate('garden')}
              className={`md:hidden min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'garden'
                  ? 'bg-[#F3E9DD] text-[#51434A]'
                  : 'text-[#7D6B74] hover:text-[#51434A]'
              }`}
            >
              {t.nav.gardenShort}
            </button>
            <button
              onClick={() => handleNavigate('settings')}
              className={`md:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-xs font-medium cursor-pointer ${
                activeSection === 'settings'
                  ? 'bg-[#F3E9DD] text-[#51434A]'
                  : 'text-[#7D6B74] hover:text-[#51434A]'
              }`}
              aria-label={t.nav.settings}
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsHugModalOpen(true)}
              className="min-h-[40px] px-3.5 py-1.5 rounded-full border border-[#E8A2B5]/70 bg-white hover:bg-[#F4DDE3]/60 text-xs font-medium text-[#51434A] active:scale-[0.98] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
            >
              <Heart className="w-3.5 h-3.5 text-[#C97A92] fill-[#F4DDE3]" />
              <span>{t.common.needAHug}</span>
            </button>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-7 pb-24 lg:pb-14">
          {activeSection === 'home' && (
            <HomeDashboard
              settings={settings}
              onUpdateSettings={(partial) => {
                updateSettings(partial);
                showToast(t.toasts.savedToSanctuary);
              }}
              studyTopics={studyTopics}
              onToggleTopic={(id) => {
                handleToggleStudyTopic(id);
              }}
              onQuickAddTopic={handleQuickAddTopic}
              flashcards={flashcards}
              letters={letters}
              onNavigate={handleNavigate}
              onNeedHug={() => setIsHugModalOpen(true)}
            />
          )}

          {activeSection === 'study' && (
            <StudySpace
              topics={studyTopics}
              language={settings.language}
              onAddTopic={handleAddStudyTopic}
              onUpdateTopic={handleUpdateStudyTopic}
              onDeleteTopic={handleDeleteStudyTopic}
              onToggleTopic={handleToggleStudyTopic}
              onRestoreSamples={() => handleRestoreScope('studyTopics')}
              onNotify={showToast}
            />
          )}

          {activeSection === 'cardio' && (
            <CardioAcademy
              language={settings.language}
              flashcards={flashcards}
              onAddFlashcard={handleAddFlashcard}
              onUpdateFlashcard={handleUpdateFlashcard}
              onDeleteFlashcard={handleDeleteFlashcard}
              onRestoreSampleFlashcards={() => handleRestoreScope('flashcards')}
              quizQuestions={quizQuestions}
              onAddQuizQuestion={handleAddQuizQuestion}
              onUpdateQuizQuestion={handleUpdateQuizQuestion}
              onDeleteQuizQuestion={handleDeleteQuizQuestion}
              onRestoreSampleQuizzes={() => handleRestoreScope('quizQuestions')}
              ecgNotes={ecgNotes}
              onUpdateEcgNote={handleUpdateEcgNote}
              studyTopics={studyTopics}
              onNotify={showToast}
            />
          )}

          {activeSection === 'focus' && (
            <FocusRelax
              settings={settings}
              onUpdateSettings={updateSettings}
              onNotify={showToast}
              onAmbientModeChange={setFocusAmbientMode}
            />
          )}

          {activeSection === 'letters' && (
            <LoveLetters
              language={settings.language}
              soundEnabled={settings.soundEnabled}
              letters={letters}
              onAddLetter={handleAddLetter}
              onUpdateLetter={handleUpdateLetter}
              onDeleteLetter={handleDeleteLetter}
              onRestoreSampleLetters={() => handleRestoreScope('letters')}
              loveMessages={loveMessages}
              onAddLoveMessage={handleAddLoveMessage}
              onUpdateLoveMessage={handleUpdateLoveMessage}
              onDeleteLoveMessage={handleDeleteLoveMessage}
              onRestoreSampleLoveMessages={() =>
                handleRestoreScope('loveMessages')
              }
              voiceRecordings={voiceRecordings}
              onAddVoiceRecording={handleAddVoiceRecording}
              onUpdateVoiceRecording={handleUpdateVoiceRecording}
              onDeleteVoiceRecording={handleDeleteVoiceRecording}
              memories={memories}
              onAddMemory={handleAddMemory}
              onUpdateMemory={handleUpdateMemory}
              onDeleteMemory={handleDeleteMemory}
              onRestoreSampleMemories={() => handleRestoreScope('memories')}
              onOpenThingsILove={() => handleNavigate('things-i-love')}
              thingsILoveCount={thingsILove.length}
              onNeedHug={() => setIsHugModalOpen(true)}
              onNotify={showToast}
            />
          )}

          {activeSection === 'things-i-love' && (
            <ThingsILovePage
              language={settings.language}
              items={thingsILove}
              onAddItem={handleAddLovedQuality}
              onUpdateItem={handleUpdateLovedQuality}
              onDeleteItem={handleDeleteLovedQuality}
              onRestoreSamples={() => handleRestoreScope('thingsILove')}
              onBackToLoveFromMe={() => handleNavigate('letters')}
              onNeedHug={() => setIsHugModalOpen(true)}
              onNotify={showToast}
            />
          )}

          {activeSection === 'garden' && (
            <LittleGarden
              language={settings.language}
              entries={journalEntries}
              onAddEntry={handleAddJournalEntry}
              onUpdateEntry={handleUpdateJournalEntry}
              onDeleteEntry={handleDeleteJournalEntry}
              onRestoreSampleEntries={() =>
                handleRestoreScope('journalEntries')
              }
              onNotify={showToast}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={updateSettings}
              onResetToSampleData={handleResetToSampleData}
              onClearAllData={handleClearAllData}
              onExportBackup={handleExportBackup}
              onLockSanctuary={handleLockSanctuary}
            />
          )}
        </main>
      </div>

      {/* Mobile Compact Bottom Navigation Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 rose-glass-chrome border-t border-white/65 grid grid-cols-5 items-center px-1.5"
        aria-label="Mobile Bottom Navigation"
      >
        {mobileBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isActive ? 'text-[#51434A] font-semibold' : 'text-[#7D6B74]'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-[#C97A92]' : 'text-[#7D6B74]'
                }`}
              />
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Global Toast Notification Banner */}
      <ToastBanner
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
        dismissLabel={t.common.dismiss}
      />

      {/* Global Surprise "I need a hug" Modal */}
      <HugModal
        isOpen={isHugModalOpen}
        onClose={() => setIsHugModalOpen(false)}
        language={settings.language}
        soundEnabled={settings.soundEnabled}
        customMessage={settings.customHugMessage}
        customSubtext={settings.customHugSubtext}
        onSaveCustomHug={(msg, sub) => {
          updateSettings({
            customHugMessage: msg,
            customHugSubtext: sub,
          });
          showToast(t.toasts.savedToSanctuary);
        }}
      />

      {/* Special Surprise Message After Completing a Study Goal */}
      <StudyCompletionModal
        isOpen={completedGoalSurpriseTitle !== null}
        completedTopicTitle={completedGoalSurpriseTitle || ''}
        onClose={() => setCompletedGoalSurpriseTitle(null)}
        loveMessages={loveMessages}
        onUpdateLoveMessage={(id, updated) => {
          handleUpdateLoveMessage(id, updated);
          showToast(t.toasts.savedToSanctuary);
        }}
        language={settings.language}
      />
    </div>
  );
}

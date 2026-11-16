export type AppSection =
  | 'welcome'
  | 'home'
  | 'study'
  | 'cardio'
  | 'focus'
  | 'letters'
  | 'things-i-love'
  | 'garden'
  | 'settings';

export type UserRole = 'owner' | 'rania';

export interface AccessConfig {
  ownerEmail: string;
  ownerUid: string;
  raniaEmail: string;
  raniaUid?: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type Language = 'en' | 'fr';

export type StudyPriority = 'High' | 'Medium' | 'Gentle';

export interface StudyTopic {
  id: string;
  title: string;
  module: string;
  priority: StudyPriority;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
  isSample?: boolean;
}

export type CardioCategory =
  | 'Physiologie cardiaque'
  | 'Électrocardiogramme (ECG)'
  | 'Troubles du rythme'
  | 'Insuffisance cardiaque'
  | 'Valvulopathies'
  | 'Hypertension artérielle';

export type FlashcardReviewStatus = 'unseen' | 'understood' | 'needs_revision';

export interface CardioFlashcard {
  id: string;
  category: CardioCategory;
  question: string;
  answer: string;
  lectureRef: string;
  mastered: boolean;
  reviewStatus?: FlashcardReviewStatus;
  lastReviewedDate?: string; // YYYY-MM-DD
  isSample: boolean;
}

export interface CardioQuizQuestion {
  id: string;
  category: CardioCategory;
  question: string;
  options: string[]; // 4 choices (A, B, C, D)
  correctIndex: number; // Primary correct index
  correctIndices?: number[]; // One or multiple correct indices (0..3)
  isMultipleChoice?: boolean; // True when multiple correct options can be selected
  explanation: string;
  lectureRef: string;
  isSample: boolean;
}

export interface EcgWaveNote {
  id: 'P' | 'PR' | 'QRS' | 'ST' | 'T';
  label: string;
  title: string;
  educationalConcept: string;
  personalNote: string;
}

export type EcgPatternType =
  | 'sinus'
  | 'afib'
  | 'flutter'
  | 'bav1'
  | 'esv';

export interface EcgStudyCase {
  id: string;
  title: string;
  patternType: EcgPatternType;
  contextLabel: string;
  options: string[]; // 4 rhythm identification choices
  correctIndex: number;
  systematicAnalysis: {
    frequence: string;
    rythme: string;
    ondeP: string;
    espacePR: string;
    complexeQRS: string;
  };
  explanation: string;
  lectureRef: string;
  isSample: boolean;
}

export interface OpenWhenLetter {
  id: string;
  occasion: string;
  subtitle: string;
  content: string;
  dateLabel: string;
  isSample: boolean;
}

export interface VoiceRecording {
  id: string;
  title: string;
  dateLabel: string;
  durationSeconds: number;
  audioDataUrl?: string;
  isBuiltInMelody?: boolean;
  transcriptNote: string;
  isSample: boolean;
}

export interface MemoryPhoto {
  id: string;
  title: string;
  dateLabel: string;
  locationLabel: string;
  caption: string;
  imageUrl: string;
  isSample: boolean;
}

export interface LoveMessageItem {
  id: string;
  text: string;
  contextNote?: string;
  isSample: boolean;
}

export interface LovedQualityItem {
  id: string;
  title: string;
  category: string;
  detail: string;
  isSample: boolean;
}

export type GardenMood =
  | 'Serene'
  | 'Grateful'
  | 'Focused'
  | 'Tired'
  | 'Overwhelmed'
  | 'Hopeful'
  | 'Loved';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: GardenMood;
  gratitudePrompt: string;
  gratitudeAnswer: string;
  achievement: string;
  dailyNote: string;
  isSample?: boolean;
}

export interface AppSettings {
  recipientName: string;
  language: Language;
  dailyAffirmation: string;
  dailyRestReminder: string;
  customHugMessage?: string;
  customHugSubtext?: string;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  soundEnabled: boolean;
  completedPomodoroSessions: number;
  hydrationCountToday: number;
}

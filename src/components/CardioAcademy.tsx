import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  Edit3,
  Eye,
  FileUp,
  Filter,
  HelpCircle,
  Layers,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import {
  CARDIO_CATEGORIES,
  INITIAL_ECG_STUDY_CASES,
  normalizeCardioCategory,
} from '../data/initialData';
import {
  localizeEcgCase,
  localizeEcgNote,
  localizeFlashcard,
  localizeQuizQuestion,
  translations,
} from '../i18n/translations';
import {
  CardioCategory,
  CardioFlashcard,
  CardioQuizQuestion,
  EcgPatternType,
  EcgStudyCase,
  EcgWaveNote,
  Language,
  StudyTopic,
} from '../types';
import { FloralCornerFlourish } from './BotanicalOrnaments';
import { ConfirmDialog } from './ConfirmDialog';

interface CardioAcademyProps {
  flashcards: CardioFlashcard[];
  onAddFlashcard: (card: Omit<CardioFlashcard, 'id'>) => void;
  onUpdateFlashcard: (id: string, updated: Partial<CardioFlashcard>) => void;
  onDeleteFlashcard: (id: string) => void;
  onRestoreSampleFlashcards: () => void;
  quizQuestions: CardioQuizQuestion[];
  onAddQuizQuestion: (q: Omit<CardioQuizQuestion, 'id'>) => void;
  onUpdateQuizQuestion: (
    id: string,
    updated: Partial<CardioQuizQuestion>
  ) => void;
  onDeleteQuizQuestion: (id: string) => void;
  onRestoreSampleQuizzes: () => void;
  ecgNotes: EcgWaveNote[];
  onUpdateEcgNote: (id: EcgWaveNote['id'], personalNote: string) => void;
  studyTopics?: StudyTopic[];
  onNotify?: (msg: string) => void;
  language?: Language;
}

type CardioSubMode = 'flashcards' | 'quiz' | 'ecg' | 'tracking';
type FlashcardFilterMode = 'all' | 'needs_revision' | 'understood' | 'unseen';

interface QuizSubmissionRecord {
  selectedIndices: number[];
  submitted: boolean;
  isCorrect: boolean;
  answeredAt: string; // YYYY-MM-DD
}

interface DailyStudyLog {
  [dateIso: string]: {
    cardsReviewed: number;
    quizzesAnswered: number;
    ecgPracticed: number;
  };
}

const QUIZ_SUBMISSIONS_STORAGE_KEY = 'hlh_cardio_qcm_submissions_v2';
const ECG_CASES_STORAGE_KEY = 'hlh_cardio_ecg_cases_v2';
const ECG_ANSWERS_STORAGE_KEY = 'hlh_cardio_ecg_answers_v2';
const WEEKLY_LOG_STORAGE_KEY = 'hlh_cardio_weekly_log_v2';

function getTodayIso(): string {
  return new Date().toISOString().split('T')[0];
}

function getLast7Days(
  todayShort: string,
  dayNamesShort: string[]
): { dateIso: string; label: string }[] {
  const days: { dateIso: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    const label = i === 0 ? todayShort : dayNamesShort[d.getDay()];
    days.push({ dateIso: iso, label });
  }
  return days;
}

function getNormalizedCorrectIndices(q: CardioQuizQuestion): number[] {
  if (Array.isArray(q.correctIndices) && q.correctIndices.length > 0) {
    return [...q.correctIndices].sort((a, b) => a - b);
  }
  return [q.correctIndex ?? 0];
}

function areArraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

// ============================================================================
// Educational Schematic SVG Path Generator (Clearly marked non-diagnostic)
// ============================================================================
function renderEducationalEcgPath(pattern: EcgPatternType): string {
  switch (pattern) {
    case 'sinus':
      return (
        'M 10,95 L 40,95 ' +
        'Q 52,78 64,95 L 82,95 L 88,103 L 96,28 L 104,114 L 110,95 L 132,95 Q 150,68 168,95 L 225,95 ' +
        'Q 237,78 249,95 L 267,95 L 273,103 L 281,28 L 289,114 L 295,95 L 317,95 Q 335,68 353,95 L 410,95 ' +
        'Q 422,78 434,95 L 452,95 L 458,103 L 466,28 L 474,114 L 480,95 L 502,95 Q 520,68 538,95 L 590,95'
      );
    case 'afib':
      return (
        'M 10,95 Q 18,89 26,97 Q 34,90 42,96 Q 50,88 58,95 ' +
        'L 63,102 L 70,30 L 77,112 L 82,95 ' +
        'Q 92,90 100,98 Q 108,89 116,96 Q 124,91 132,95 ' +
        'L 137,102 L 144,32 L 151,112 L 156,95 ' +
        'Q 166,88 176,97 Q 186,90 196,98 Q 206,89 216,96 Q 226,91 236,97 Q 246,89 256,95 Q 266,91 276,95 ' +
        'L 281,102 L 288,28 L 295,112 L 300,95 ' +
        'Q 310,90 320,97 Q 330,88 340,96 Q 350,90 360,95 ' +
        'L 365,102 L 372,31 L 379,112 L 384,95 ' +
        'Q 394,89 404,97 Q 414,91 424,98 Q 434,88 444,96 Q 454,90 464,97 Q 474,89 484,96 Q 494,91 504,95 ' +
        'L 509,102 L 516,29 L 523,112 L 528,95 ' +
        'Q 540,89 552,97 Q 564,90 576,96 L 590,95'
      );
    case 'flutter':
      return (
        'M 10,98 L 32,76 L 40,98 L 62,76 L 70,98 L 92,76 L 100,98 ' +
        'L 106,30 L 114,114 L 120,98 ' +
        'L 142,76 L 150,98 L 172,76 L 180,98 L 202,76 L 210,98 ' +
        'L 216,30 L 224,114 L 230,98 ' +
        'L 252,76 L 260,98 L 282,76 L 290,98 L 312,76 L 320,98 ' +
        'L 326,30 L 334,114 L 340,98 ' +
        'L 362,76 L 370,98 L 392,76 L 400,98 L 422,76 L 430,98 ' +
        'L 436,30 L 444,114 L 450,98 ' +
        'L 472,76 L 480,98 L 502,76 L 510,98 L 532,76 L 540,98 ' +
        'L 546,30 L 554,114 L 560,98 L 590,95'
      );
    case 'bav1':
      return (
        'M 10,95 L 30,95 ' +
        'Q 42,78 54,95 L 112,95 L 118,103 L 126,28 L 134,114 L 140,95 L 158,95 Q 174,68 190,95 L 225,95 ' +
        'Q 237,78 249,95 L 307,95 L 313,103 L 321,28 L 329,114 L 335,95 L 353,95 Q 369,68 385,95 L 420,95 ' +
        'Q 432,78 444,95 L 502,95 L 508,103 L 516,28 L 524,114 L 530,95 L 548,95 Q 564,68 580,95 L 590,95'
      );
    case 'esv':
      return (
        'M 10,95 L 35,95 ' +
        'Q 47,78 59,95 L 77,95 L 83,103 L 91,28 L 99,114 L 105,95 L 125,95 Q 142,68 158,95 L 195,95 ' +
        'L 204,108 L 222,18 L 246,142 L 264,95 Q 286,132 310,95 L 415,95 ' +
        'Q 427,78 439,95 L 457,95 L 463,103 L 471,28 L 479,114 L 485,95 L 505,95 Q 522,68 538,95 L 590,95'
      );
  }
}

export const CardioAcademy: React.FC<CardioAcademyProps> = ({
  flashcards,
  onAddFlashcard,
  onUpdateFlashcard,
  onDeleteFlashcard,
  onRestoreSampleFlashcards,
  quizQuestions,
  onAddQuizQuestion,
  onUpdateQuizQuestion,
  onDeleteQuizQuestion,
  onRestoreSampleQuizzes,
  ecgNotes,
  onUpdateEcgNote,
  studyTopics = [],
  onNotify,
  language = 'en',
}) => {
  const t = translations[language];
  const getCatLabel = (cat: CardioCategory) => t.cardio.categories[cat] || cat;

  const [selectedCategory, setSelectedCategory] = useState<
    CardioCategory | 'All'
  >('All');
  const [subMode, setSubMode] = useState<CardioSubMode>('flashcards');

  // Normalize and localize incoming cards & questions
  const normalizedFlashcards = useMemo(
    () =>
      flashcards.map((f) => {
        const localized = localizeFlashcard(f, language);
        return {
          ...localized,
          category: normalizeCardioCategory(localized.category),
          reviewStatus:
            localized.reviewStatus ||
            (localized.mastered ? 'understood' : 'unseen'),
        };
      }),
    [flashcards, language]
  );

  const normalizedQuizzes = useMemo(
    () =>
      quizQuestions.map((q) => {
        const localized = localizeQuizQuestion(q, language);
        return {
          ...localized,
          category: normalizeCardioCategory(localized.category),
          correctIndices: getNormalizedCorrectIndices(localized),
          isMultipleChoice:
            localized.isMultipleChoice ??
            (Array.isArray(localized.correctIndices) &&
              localized.correctIndices.length > 1),
        };
      }),
    [quizQuestions, language]
  );

  const localizedEcgNotes = useMemo(
    () => ecgNotes.map((n) => localizeEcgNote(n, language)),
    [ecgNotes, language]
  );

  // Weekly study tracking log
  const [weeklyLog, setWeeklyLog] = useState<DailyStudyLog>(() => {
    try {
      const raw = localStorage.getItem(WEEKLY_LOG_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as DailyStudyLog;
    } catch {}
    const today = getTodayIso();
    return {
      [today]: { cardsReviewed: 3, quizzesAnswered: 2, ecgPracticed: 1 },
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(WEEKLY_LOG_STORAGE_KEY, JSON.stringify(weeklyLog));
    } catch {}
  }, [weeklyLog]);

  const recordStudyActivity = (
    type: 'cardsReviewed' | 'quizzesAnswered' | 'ecgPracticed',
    count = 1
  ) => {
    const today = getTodayIso();
    setWeeklyLog((prev) => {
      const existing = prev[today] || {
        cardsReviewed: 0,
        quizzesAnswered: 0,
        ecgPracticed: 0,
      };
      return {
        ...prev,
        [today]: {
          ...existing,
          [type]: existing[type] + count,
        },
      };
    });
  };

  // ==========================================================================
  // 1. FLASHCARDS STATE & HANDLERS
  // ==========================================================================
  const [cardFilterStatus, setCardFilterStatus] =
    useState<FlashcardFilterMode>('all');
  const [revealedCardIds, setRevealedCardIds] = useState<
    Record<string, boolean>
  >({});
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTextDraft, setImportTextDraft] = useState('');
  const [importCategory, setImportCategory] = useState<CardioCategory>(
    'Physiologie cardiaque'
  );
  const [importLectureRef, setImportLectureRef] = useState(
    t.cardio.flashcardsView.importDefaultRefValue
  );

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardCategory, setCardCategory] = useState<CardioCategory>(
    'Physiologie cardiaque'
  );
  const [cardQuestion, setCardQuestion] = useState('');
  const [cardAnswer, setCardAnswer] = useState('');
  const [cardLectureRef, setCardLectureRef] = useState('');
  const [cardToDelete, setCardToDelete] = useState<CardioFlashcard | null>(
    null
  );

  const filteredFlashcards = useMemo(() => {
    return normalizedFlashcards.filter((f) => {
      const matchesCat =
        selectedCategory === 'All' || f.category === selectedCategory;
      if (!matchesCat) return false;
      if (cardFilterStatus === 'understood') {
        return f.reviewStatus === 'understood' || f.mastered;
      }
      if (cardFilterStatus === 'needs_revision') {
        return f.reviewStatus === 'needs_revision';
      }
      if (cardFilterStatus === 'unseen') {
        return f.reviewStatus === 'unseen' && !f.mastered;
      }
      return true;
    });
  }, [normalizedFlashcards, selectedCategory, cardFilterStatus]);

  const toggleRevealCard = (id: string) => {
    setRevealedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMarkCardStatus = (
    card: CardioFlashcard,
    status: 'understood' | 'needs_revision'
  ) => {
    onUpdateFlashcard(card.id, {
      mastered: status === 'understood',
      reviewStatus: status,
      lastReviewedDate: getTodayIso(),
    });
    recordStudyActivity('cardsReviewed', 1);
    onNotify?.(
      status === 'understood'
        ? t.toasts.cardUnderstood
        : t.toasts.cardNeedsRevision
    );
  };

  const openNewCardModal = () => {
    setEditingCardId(null);
    setCardCategory(
      selectedCategory === 'All' ? 'Physiologie cardiaque' : selectedCategory
    );
    setCardQuestion('');
    setCardAnswer('');
    setCardLectureRef(t.cardio.flashcardsView.cardDefaultRefValue);
    setIsCardModalOpen(true);
  };

  const openEditCardModal = (card: CardioFlashcard) => {
    setEditingCardId(card.id);
    setCardCategory(card.category);
    setCardQuestion(card.question);
    setCardAnswer(card.answer);
    setCardLectureRef(card.lectureRef);
    setIsCardModalOpen(true);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardQuestion.trim() || !cardAnswer.trim()) return;

    if (editingCardId) {
      onUpdateFlashcard(editingCardId, {
        category: cardCategory,
        question: cardQuestion.trim(),
        answer: cardAnswer.trim(),
        lectureRef:
          cardLectureRef.trim() || t.cardio.flashcardsView.cardDefaultRefValue,
        isSample: false,
      });
      onNotify?.(t.toasts.cardUpdated);
    } else {
      onAddFlashcard({
        category: cardCategory,
        question: cardQuestion.trim(),
        answer: cardAnswer.trim(),
        lectureRef:
          cardLectureRef.trim() || t.cardio.flashcardsView.cardDefaultRefValue,
        mastered: false,
        reviewStatus: 'unseen',
        isSample: false,
      });
      if (selectedCategory !== 'All' && selectedCategory !== cardCategory) {
        setSelectedCategory(cardCategory);
      }
      onNotify?.(t.toasts.cardAdded);
    }
    setIsCardModalOpen(false);
  };

  const handleBulkImportCards = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importTextDraft.trim()) return;

    const lines = importTextDraft
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    let importedCount = 0;
    for (const line of lines) {
      const parts = line.includes('|')
        ? line.split('|')
        : line.includes(';')
        ? line.split(';')
        : [];
      if (parts.length >= 2) {
        const q = parts[0].trim();
        const a = parts[1].trim();
        const ref = parts[2]?.trim() || importLectureRef.trim();
        if (q && a) {
          onAddFlashcard({
            category: importCategory,
            question: q,
            answer: a,
            lectureRef: ref || t.cardio.flashcardsView.importDefaultRefValue,
            mastered: false,
            reviewStatus: 'unseen',
            isSample: false,
          });
          importedCount += 1;
        }
      }
    }

    if (importedCount > 0) {
      setImportTextDraft('');
      setIsImportModalOpen(false);
      onNotify?.(t.toasts.cardsImported(importedCount));
    } else {
      onNotify?.(t.toasts.cardsImportFormatError);
    }
  };

  // ==========================================================================
  // 2. QCM (SINGLE & MULTIPLE CHOICE) STATE & HANDLERS
  // ==========================================================================
  const [quizSubmissions, setQuizSubmissions] = useState<
    Record<string, QuizSubmissionRecord>
  >(() => {
    try {
      const raw = localStorage.getItem(QUIZ_SUBMISSIONS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, QuizSubmissionRecord>) : {};
    } catch {
      return {};
    }
  });

  const [draftMultiSelections, setDraftMultiSelections] = useState<
    Record<string, number[]>
  >({});
  const [reviewIncorrectOnly, setReviewIncorrectOnly] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        QUIZ_SUBMISSIONS_STORAGE_KEY,
        JSON.stringify(quizSubmissions)
      );
    } catch {}
  }, [quizSubmissions]);

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [quizCategory, setQuizCategory] = useState<CardioCategory>(
    'Physiologie cardiaque'
  );
  const [quizQuestionText, setQuizQuestionText] = useState('');
  const [quizOptions, setQuizOptions] = useState<string[]>(['', '', '', '']);
  const [quizCorrectIndicesDraft, setQuizCorrectIndicesDraft] = useState<
    number[]
  >([0]);
  const [quizExplanation, setQuizExplanation] = useState('');
  const [quizLectureRef, setQuizLectureRef] = useState('');
  const [quizToDelete, setQuizToDelete] = useState<CardioQuizQuestion | null>(
    null
  );

  const categoryFilteredQuizzes = useMemo(() => {
    if (selectedCategory === 'All') return normalizedQuizzes;
    return normalizedQuizzes.filter((q) => q.category === selectedCategory);
  }, [normalizedQuizzes, selectedCategory]);

  const incorrectQuizIds = useMemo(() => {
    return categoryFilteredQuizzes
      .filter((q) => {
        const sub = quizSubmissions[q.id];
        return sub && sub.submitted && !sub.isCorrect;
      })
      .map((q) => q.id);
  }, [categoryFilteredQuizzes, quizSubmissions]);

  const displayedQuizzes = useMemo(() => {
    if (!reviewIncorrectOnly) return categoryFilteredQuizzes;
    return categoryFilteredQuizzes.filter((q) =>
      incorrectQuizIds.includes(q.id)
    );
  }, [categoryFilteredQuizzes, reviewIncorrectOnly, incorrectQuizIds]);

  const quizScoreStats = useMemo(() => {
    const total = categoryFilteredQuizzes.length;
    let answered = 0;
    let correct = 0;
    categoryFilteredQuizzes.forEach((q) => {
      const sub = quizSubmissions[q.id];
      if (sub && sub.submitted) {
        answered += 1;
        if (sub.isCorrect) correct += 1;
      }
    });
    const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return {
      total,
      answered,
      correct,
      incorrect: answered - correct,
      pct,
    };
  }, [categoryFilteredQuizzes, quizSubmissions]);

  const handleSelectSingleChoiceOption = (
    q: CardioQuizQuestion,
    optIdx: number
  ) => {
    const expected = getNormalizedCorrectIndices(q);
    const isCorrect = areArraysEqual([optIdx], expected);
    setQuizSubmissions((prev) => ({
      ...prev,
      [q.id]: {
        selectedIndices: [optIdx],
        submitted: true,
        isCorrect,
        answeredAt: getTodayIso(),
      },
    }));
    recordStudyActivity('quizzesAnswered', 1);
  };

  const handleToggleMultiChoiceDraft = (qId: string, optIdx: number) => {
    setDraftMultiSelections((prev) => {
      const current = prev[qId] || [];
      const exists = current.includes(optIdx);
      const next = exists
        ? current.filter((i) => i !== optIdx)
        : [...current, optIdx].sort((a, b) => a - b);
      return { ...prev, [qId]: next };
    });
  };

  const handleValidateMultiChoiceQuestion = (q: CardioQuizQuestion) => {
    const chosen = draftMultiSelections[q.id] || [];
    if (chosen.length === 0) {
      onNotify?.(t.toasts.quizSelectAtLeastOne);
      return;
    }
    const expected = getNormalizedCorrectIndices(q);
    const isCorrect = areArraysEqual(chosen, expected);
    setQuizSubmissions((prev) => ({
      ...prev,
      [q.id]: {
        selectedIndices: chosen,
        submitted: true,
        isCorrect,
        answeredAt: getTodayIso(),
      },
    }));
    recordStudyActivity('quizzesAnswered', 1);
  };

  const handleRetryQuestion = (qId: string) => {
    setQuizSubmissions((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
    setDraftMultiSelections((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  const openNewQuizModal = () => {
    setEditingQuizId(null);
    setQuizCategory(
      selectedCategory === 'All' ? 'Physiologie cardiaque' : selectedCategory
    );
    setQuizQuestionText('');
    setQuizOptions(['', '', '', '']);
    setQuizCorrectIndicesDraft([0]);
    setQuizExplanation('');
    setQuizLectureRef(t.cardio.flashcardsView.cardDefaultRefValue);
    setIsQuizModalOpen(true);
  };

  const openEditQuizModal = (q: CardioQuizQuestion) => {
    setEditingQuizId(q.id);
    setQuizCategory(q.category);
    setQuizQuestionText(q.question);
    setQuizOptions([...q.options]);
    setQuizCorrectIndicesDraft(getNormalizedCorrectIndices(q));
    setQuizExplanation(q.explanation);
    setQuizLectureRef(q.lectureRef);
    setIsQuizModalOpen(true);
  };

  const toggleDraftCorrectIndex = (idx: number) => {
    setQuizCorrectIndicesDraft((prev) => {
      if (prev.includes(idx)) {
        if (prev.length === 1) return prev;
        return prev.filter((i) => i !== idx);
      }
      return [...prev, idx].sort((a, b) => a - b);
    });
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizQuestionText.trim() || quizOptions.some((o) => !o.trim())) return;

    const sortedCorrect = [...quizCorrectIndicesDraft].sort((a, b) => a - b);
    const payload = {
      category: quizCategory,
      question: quizQuestionText.trim(),
      options: quizOptions.map((o) => o.trim()),
      correctIndex: sortedCorrect[0] ?? 0,
      correctIndices: sortedCorrect,
      isMultipleChoice: sortedCorrect.length > 1,
      explanation: quizExplanation.trim(),
      lectureRef:
        quizLectureRef.trim() || t.cardio.flashcardsView.cardDefaultRefValue,
      isSample: false,
    };

    if (editingQuizId) {
      onUpdateQuizQuestion(editingQuizId, payload);
      handleRetryQuestion(editingQuizId);
      onNotify?.(t.toasts.quizUpdated);
    } else {
      onAddQuizQuestion(payload);
      if (selectedCategory !== 'All' && selectedCategory !== quizCategory) {
        setSelectedCategory(quizCategory);
      }
      onNotify?.(t.toasts.quizAdded);
    }
    setIsQuizModalOpen(false);
  };

  // ==========================================================================
  // 3. ECG RHYTHM IDENTIFICATION & WAVE SANDBOX STATE
  // ==========================================================================
  const [ecgCases, setEcgCases] = useState<EcgStudyCase[]>(() => {
    try {
      const raw = localStorage.getItem(ECG_CASES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as EcgStudyCase[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ECG_STUDY_CASES;
  });

  const localizedEcgCases = useMemo(
    () => ecgCases.map((c) => localizeEcgCase(c, language)),
    [ecgCases, language]
  );

  const [selectedEcgCaseId, setSelectedEcgCaseId] = useState<string>(
    INITIAL_ECG_STUDY_CASES[0].id
  );

  const [ecgCaseAnswers, setEcgCaseAnswers] = useState<Record<string, number>>(
    () => {
      try {
        const raw = localStorage.getItem(ECG_ANSWERS_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Record<string, number>) : {};
      } catch {
        return {};
      }
    }
  );

  useEffect(() => {
    try {
      localStorage.setItem(ECG_CASES_STORAGE_KEY, JSON.stringify(ecgCases));
    } catch {}
  }, [ecgCases]);

  useEffect(() => {
    try {
      localStorage.setItem(
        ECG_ANSWERS_STORAGE_KEY,
        JSON.stringify(ecgCaseAnswers)
      );
    } catch {}
  }, [ecgCaseAnswers]);

  const activeEcgCase =
    localizedEcgCases.find((c) => c.id === selectedEcgCaseId) ||
    localizedEcgCases[0];

  const [isEcgCaseModalOpen, setIsEcgCaseModalOpen] = useState(false);
  const [newEcgTitle, setNewEcgTitle] = useState('');
  const [newEcgPattern, setNewEcgPattern] = useState<EcgPatternType>('sinus');
  const [newEcgContext, setNewEcgContext] = useState('');
  const [newEcgOptions, setNewEcgOptions] = useState<string[]>([
    language === 'fr'
      ? 'Rythme sinusal régulier normal'
      : 'Normal regular sinus rhythm',
    language === 'fr'
      ? 'Fibrillation atriale (FA)'
      : 'Atrial fibrillation (AF)',
    language === 'fr' ? 'Flutter atrial typique' : 'Typical atrial flutter',
    language === 'fr'
      ? 'Bloc atrio-ventriculaire du 1er degré (BAV I)'
      : 'First-degree AV block',
  ]);
  const [newEcgCorrectIdx, setNewEcgCorrectIdx] = useState(0);
  const [newEcgFreq, setNewEcgFreq] = useState('');
  const [newEcgRythme, setNewEcgRythme] = useState('');
  const [newEcgOndeP, setNewEcgOndeP] = useState('');
  const [newEcgPR, setNewEcgPR] = useState('');
  const [newEcgQRS, setNewEcgQRS] = useState('');
  const [newEcgExplanation, setNewEcgExplanation] = useState('');
  const [newEcgRef, setNewEcgRef] = useState(
    t.cardio.flashcardsView.cardDefaultRefValue
  );

  const openNewEcgCaseModal = () => {
    setNewEcgTitle('');
    setNewEcgPattern('sinus');
    setNewEcgContext('');
    setNewEcgOptions([
      language === 'fr'
        ? 'Rythme sinusal régulier normal'
        : 'Normal regular sinus rhythm',
      language === 'fr'
        ? 'Fibrillation atriale (FA)'
        : 'Atrial fibrillation (AF)',
      language === 'fr' ? 'Flutter atrial typique' : 'Typical atrial flutter',
      language === 'fr'
        ? 'Bloc atrio-ventriculaire du 1er degré (BAV I)'
        : 'First-degree AV block',
    ]);
    setNewEcgCorrectIdx(0);
    setNewEcgFreq('');
    setNewEcgRythme('');
    setNewEcgOndeP('');
    setNewEcgPR('');
    setNewEcgQRS('');
    setNewEcgExplanation('');
    setNewEcgRef(t.cardio.flashcardsView.cardDefaultRefValue);
    setIsEcgCaseModalOpen(true);
  };

  const handleAddCustomEcgCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEcgTitle.trim() || newEcgOptions.some((o) => !o.trim())) return;
    const defaultNoteText =
      language === 'fr'
        ? 'À préciser selon vos notes'
        : 'Specify based on your lecture notes';
    const created: EcgStudyCase = {
      id: `ecg-custom-${Date.now()}`,
      title: newEcgTitle.trim(),
      patternType: newEcgPattern,
      contextLabel:
        newEcgContext.trim() ||
        (language === 'fr'
          ? 'Schéma pédagogique illustratif (Non diagnostique) · Cas issu de vos notes de cours.'
          : 'Illustrative Educational Schematic (Non-Diagnostic) · Custom lecture case.'),
      options: newEcgOptions.map((o) => o.trim()),
      correctIndex: newEcgCorrectIdx,
      systematicAnalysis: {
        frequence: newEcgFreq.trim() || defaultNoteText,
        rythme: newEcgRythme.trim() || defaultNoteText,
        ondeP: newEcgOndeP.trim() || defaultNoteText,
        espacePR: newEcgPR.trim() || defaultNoteText,
        complexeQRS: newEcgQRS.trim() || defaultNoteText,
      },
      explanation: newEcgExplanation.trim(),
      lectureRef:
        newEcgRef.trim() || t.cardio.flashcardsView.cardDefaultRefValue,
      isSample: false,
    };
    setEcgCases((prev) => [...prev, created]);
    setSelectedEcgCaseId(created.id);
    setIsEcgCaseModalOpen(false);
    onNotify?.(t.toasts.ecgCaseAdded);
  };

  // P-QRS-T wave segment notes
  const [selectedWaveId, setSelectedWaveId] =
    useState<EcgWaveNote['id']>('QRS');
  const [editingEcgNote, setEditingEcgNote] = useState(false);
  const [ecgNoteDraft, setEcgNoteDraft] = useState('');

  const activeEcgWave =
    localizedEcgNotes.find((w) => w.id === selectedWaveId) ||
    localizedEcgNotes[0];

  const handleSelectWave = (id: EcgWaveNote['id']) => {
    setSelectedWaveId(id);
    setEditingEcgNote(false);
  };

  // ==========================================================================
  // 4. STUDY TRACKING METRICS
  // ==========================================================================
  const trackingStats = useMemo(() => {
    const understoodCount = normalizedFlashcards.filter(
      (f) => f.reviewStatus === 'understood' || f.mastered
    ).length;
    const needsRevisionCount = normalizedFlashcards.filter(
      (f) => f.reviewStatus === 'needs_revision'
    ).length;
    const totalReviewedCards = understoodCount + needsRevisionCount;

    const ecgAnsweredCount = Object.keys(ecgCaseAnswers).length;
    const ecgCorrectCount = localizedEcgCases.filter(
      (c) => ecgCaseAnswers[c.id] === c.correctIndex
    ).length;

    const completedTopicsCount = studyTopics.filter((st) => st.completed).length;

    const last7Days = getLast7Days(
      t.cardio.trackingView.todayShort,
      t.cardio.trackingView.dayNamesShort
    ).map((day) => {
      const entry = weeklyLog[day.dateIso] || {
        cardsReviewed: 0,
        quizzesAnswered: 0,
        ecgPracticed: 0,
      };
      const totalActions =
        entry.cardsReviewed + entry.quizzesAnswered + entry.ecgPracticed;
      return {
        ...day,
        ...entry,
        totalActions,
      };
    });

    const maxDailyActions = Math.max(
      5,
      ...last7Days.map((d) => d.totalActions)
    );

    return {
      understoodCount,
      needsRevisionCount,
      totalReviewedCards,
      ecgAnsweredCount,
      ecgCorrectCount,
      completedTopicsCount,
      last7Days,
      maxDailyActions,
    };
  }, [
    normalizedFlashcards,
    ecgCaseAnswers,
    localizedEcgCases,
    studyTopics,
    weeklyLog,
    t.cardio.trackingView.todayShort,
    t.cardio.trackingView.dayNamesShort,
  ]);

  return (
    <div className="space-y-10 pb-12 animate-page-enter">
      {/* Mandatory Medical & Educational Disclaimer Banner */}
      <aside
        className="rounded-3xl rose-glass-cream rose-glass-sheen p-5 sm:p-6 flex items-start gap-3.5"
        aria-label={t.cardio.disclaimerTitle}
      >
        <AlertCircle className="w-5 h-5 text-[#C97A92] shrink-0 mt-0.5" />
        <div className="text-xs text-[#51434A] leading-relaxed space-y-1">
          <p>
            <strong className="font-semibold">
              {t.cardio.disclaimerTitle}
            </strong>{' '}
            {t.cardio.disclaimerBody1}{' '}
            <strong className="underline underline-offset-2">
              {t.cardio.disclaimerHighlight}
            </strong>{' '}
            {t.cardio.disclaimerBody2}
          </p>
          <p className="text-[#7D6B74]">{t.cardio.disclaimerSubtext}</p>
        </div>
      </aside>

      {/* Header & 4-Tab Navigation (Flashcards, QCM, ECG, Suivi) */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-7 border-b border-[#EAE0D8]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#7D6B74]">
            <FloralCornerFlourish className="w-4 h-4" />
            <span>{t.cardio.headerBadge}</span>
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#51434A] tracking-tight">
            {t.cardio.title}
          </h1>
          <p className="text-sm sm:text-base text-[#7D6B74]">
            {t.cardio.subtitle}
          </p>
        </div>

        {/* Sub-mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rose-glass-cream rounded-2xl self-start lg:self-auto">
          <button
            onClick={() => setSubMode('flashcards')}
            className={`min-h-[42px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              subMode === 'flashcards'
                ? 'bg-white text-[#51434A] shadow-2xs font-semibold'
                : 'text-[#7D6B74] hover:text-[#51434A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#C97A92]" />
            <span>
              {t.cardio.tabs.flashcards} ({normalizedFlashcards.length})
            </span>
          </button>

          <button
            onClick={() => setSubMode('quiz')}
            className={`min-h-[42px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              subMode === 'quiz'
                ? 'bg-white text-[#51434A] shadow-2xs font-semibold'
                : 'text-[#7D6B74] hover:text-[#51434A]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#C97A92]" />
            <span>
              {t.cardio.tabs.quiz} ({normalizedQuizzes.length})
            </span>
          </button>

          <button
            onClick={() => setSubMode('ecg')}
            className={`min-h-[42px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              subMode === 'ecg'
                ? 'bg-white text-[#51434A] shadow-2xs font-semibold'
                : 'text-[#7D6B74] hover:text-[#51434A]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#C97A92]" />
            <span>
              {t.cardio.tabs.ecg} ({localizedEcgCases.length})
            </span>
          </button>

          <button
            onClick={() => setSubMode('tracking')}
            className={`min-h-[42px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              subMode === 'tracking'
                ? 'bg-white text-[#51434A] shadow-2xs font-semibold'
                : 'text-[#7D6B74] hover:text-[#51434A]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#C97A92]" />
            <span>{t.cardio.tabs.tracking}</span>
          </button>
        </div>
      </section>

      {/* The 6 Cardiology Learning Modules Strip */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-semibold text-[#7D6B74] uppercase tracking-wider">
            {t.cardio.sixModulesHeading}
          </h2>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="min-h-[34px] px-2.5 text-xs font-medium text-[#C97A92] hover:underline cursor-pointer"
            >
              {t.cardio.showAllSixModules}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {CARDIO_CATEGORIES.map((category, idx) => {
            const catCards = normalizedFlashcards.filter(
              (f) => f.category === category
            );
            const catUnderstood = catCards.filter(
              (f) => f.reviewStatus === 'understood' || f.mastered
            ).length;
            const catNeedsRev = catCards.filter(
              (f) => f.reviewStatus === 'needs_revision'
            ).length;
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(isSelected ? 'All' : category)
                }
                className={`text-left rounded-2xl p-3.5 sm:p-4 min-w-0 overflow-hidden transition-all flex flex-col justify-between min-h-[116px] cursor-pointer ${
                  isSelected
                    ? 'bg-[#51434A] text-[#FFF9F6] border border-[#51434A] shadow-xs'
                    : 'editorial-card editorial-card-interactive rose-glass-sheen text-[#51434A]'
                }`}
              >
                <div className="space-y-1 min-w-0 w-full">
                  <span
                    className={`font-serif-editorial italic text-xs block ${
                      isSelected ? 'text-[#E8A2B5]' : 'text-[#C97A92]'
                    }`}
                  >
                    {t.cardio.modulePrefix} 0{idx + 1}
                  </span>
                  <span className="font-serif-editorial text-[13px] sm:text-[13.5px] font-normal leading-snug block break-words [overflow-wrap:anywhere] hyphens-auto">
                    {getCatLabel(category)}
                  </span>
                </div>

                <div className="pt-3 space-y-1.5 w-full">
                  <div className="w-full h-1.5 rounded-full bg-[#F3E9DD]/60 overflow-hidden">
                    <div
                      className="h-full bg-[#E8A2B5] transition-all"
                      style={{
                        width: `${
                          catCards.length > 0
                            ? Math.round((catUnderstood / catCards.length) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <div
                    className={`flex items-center justify-between text-[10px] font-mono-tabular ${
                      isSelected ? 'text-[#F4DDE3]' : 'text-[#7D6B74]'
                    }`}
                  >
                    <span>
                      {catUnderstood}/{catCards.length}{' '}
                      {t.cardio.understoodShort}
                    </span>
                    {catNeedsRev > 0 && (
                      <span
                        className={
                          isSelected ? 'text-[#E8A2B5]' : 'text-[#C97A92]'
                        }
                      >
                        {catNeedsRev} {t.cardio.needsRevisionShort}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          SUBMODE 1: FLASHCARDS
         ===================================================================== */}
      {subMode === 'flashcards' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
                {selectedCategory === 'All'
                  ? t.cardio.flashcardsView.allTitle
                  : t.cardio.flashcardsView.categoryTitle(
                      getCatLabel(selectedCategory)
                    )}
              </h2>
              <p className="text-xs text-[#7D6B74]">
                {t.cardio.flashcardsView.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="min-h-[44px] px-4 py-2 rounded-2xl border border-[#EAE0D8] bg-white hover:bg-[#FFF9F6] text-xs font-medium text-[#51434A] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileUp className="w-3.5 h-3.5 text-[#C97A92]" />
                <span>{t.cardio.flashcardsView.importCoursesBtn}</span>
              </button>

              <button
                onClick={openNewCardModal}
                className="min-h-[44px] px-5 py-2 rounded-2xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#E8A2B5]" />
                <span>{t.cardio.flashcardsView.newCardBtn}</span>
              </button>
            </div>
          </div>

          {/* Filter by Review Status */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#7D6B74] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#C97A92]" />
              <span>{t.cardio.flashcardsView.statusLabel}</span>
            </span>
            {(
              [
                { id: 'all', label: t.cardio.flashcardsView.filterAll },
                {
                  id: 'needs_revision',
                  label: t.cardio.flashcardsView.filterNeedsRevision,
                },
                {
                  id: 'understood',
                  label: t.cardio.flashcardsView.filterUnderstood,
                },
                { id: 'unseen', label: t.cardio.flashcardsView.filterUnseen },
              ] as { id: FlashcardFilterMode; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCardFilterStatus(tab.id)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  cardFilterStatus === tab.id
                    ? 'bg-[#F4DDE3] text-[#51434A] font-semibold'
                    : 'bg-white border border-[#EAE0D8] text-[#7D6B74] hover:text-[#51434A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bulk Lecture Import Modal */}
          {isImportModalOpen && (
            <form
              onSubmit={handleBulkImportCards}
              className="rounded-3xl editorial-stationary rose-glass-sheen border-[#E8A2B5] p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D8]">
                <div>
                  <h3 className="font-serif-editorial text-xl text-[#51434A]">
                    {t.cardio.flashcardsView.importModalTitle}
                  </h3>
                  <p className="text-xs text-[#7D6B74]">
                    {t.cardio.flashcardsView.importModalSubtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="min-h-[42px] min-w-[42px] flex items-center justify-center text-[#7D6B74]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#51434A] mb-1">
                    {t.cardio.flashcardsView.importTargetModule}
                  </label>
                  <select
                    value={importCategory}
                    onChange={(e) =>
                      setImportCategory(e.target.value as CardioCategory)
                    }
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                  >
                    {CARDIO_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {getCatLabel(c)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#51434A] mb-1">
                    {t.cardio.flashcardsView.importDefaultRef}
                  </label>
                  <input
                    type="text"
                    value={importLectureRef}
                    onChange={(e) => setImportLectureRef(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#51434A] mb-1">
                  {t.cardio.flashcardsView.importTextareaLabel}
                </label>
                <textarea
                  value={importTextDraft}
                  onChange={(e) => setImportTextDraft(e.target.value)}
                  rows={5}
                  placeholder={t.cardio.flashcardsView.importTextareaPlaceholder}
                  className="w-full p-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-xs sm:text-sm text-[#51434A] font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="min-h-[42px] px-4 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#7D6B74]"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] px-5 py-1.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium"
                >
                  {t.cardio.flashcardsView.importSubmitBtn}
                </button>
              </div>
            </form>
          )}

          {/* Create / Edit Single Flashcard Modal */}
          {isCardModalOpen && (
            <form
              onSubmit={handleSaveCard}
              className="rounded-3xl editorial-stationary rose-glass-sheen border-[#E8A2B5] p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D8]">
                <h3 className="font-serif-editorial text-xl text-[#51434A]">
                  {editingCardId
                    ? t.cardio.flashcardsView.cardModalEditTitle
                    : t.cardio.flashcardsView.cardModalNewTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7D6B74]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#51434A] mb-1">
                    {t.cardio.flashcardsView.cardModuleLabel}
                  </label>
                  <select
                    value={cardCategory}
                    onChange={(e) =>
                      setCardCategory(e.target.value as CardioCategory)
                    }
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                  >
                    {CARDIO_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {getCatLabel(c)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#51434A] mb-1">
                    {t.cardio.flashcardsView.cardRefLabel}
                  </label>
                  <input
                    type="text"
                    value={cardLectureRef}
                    onChange={(e) => setCardLectureRef(e.target.value)}
                    placeholder={t.cardio.flashcardsView.cardRefPlaceholder}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#51434A] mb-1">
                  {t.cardio.flashcardsView.cardFrontLabel}
                </label>
                <textarea
                  value={cardQuestion}
                  onChange={(e) => setCardQuestion(e.target.value)}
                  rows={2}
                  className="w-full p-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                  placeholder={t.cardio.flashcardsView.cardFrontPlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#51434A] mb-1">
                  {t.cardio.flashcardsView.cardBackLabel}
                </label>
                <textarea
                  value={cardAnswer}
                  onChange={(e) => setCardAnswer(e.target.value)}
                  rows={4}
                  className="w-full p-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                  placeholder={t.cardio.flashcardsView.cardBackPlaceholder}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(false)}
                  className="min-h-[44px] px-4 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#7D6B74]"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-1.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium"
                >
                  {t.cardio.flashcardsView.saveCardBtn}
                </button>
              </div>
            </form>
          )}

          {filteredFlashcards.length === 0 ? (
            <div className="rounded-3xl editorial-card rose-glass-sheen p-12 text-center space-y-4">
              <Layers className="w-8 h-8 text-[#C97A92] mx-auto" />
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-serif-editorial text-2xl text-[#51434A]">
                  {t.cardio.flashcardsView.emptyTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#7D6B74]">
                  {t.cardio.flashcardsView.emptySubtitle}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {cardFilterStatus !== 'all' && (
                  <button
                    onClick={() => setCardFilterStatus('all')}
                    className="min-h-[44px] px-5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] cursor-pointer"
                  >
                    {t.cardio.flashcardsView.viewAllCardsBtn}
                  </button>
                )}
                <button
                  onClick={openNewCardModal}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.cardio.flashcardsView.createCardBtn}</span>
                </button>
                {flashcards.length === 0 && (
                  <button
                    onClick={() => {
                      onRestoreSampleFlashcards();
                      onNotify?.(t.toasts.cardsRestored);
                    }}
                    className="min-h-[44px] px-5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.cardio.flashcardsView.restoreSampleCardsBtn}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFlashcards.map((card) => {
                const isRevealed = !!revealedCardIds[card.id];
                const isUnderstood =
                  card.reviewStatus === 'understood' || card.mastered;
                const isNeedsRevision =
                  card.reviewStatus === 'needs_revision';

                return (
                  <div
                    key={card.id}
                    className="flashcard-3d-scene"
                  >
                    <div
                      className={`flashcard-3d-inner ${
                        isRevealed ? 'is-flipped' : ''
                      }`}
                    >
                      {/* FRONT FACE: Question */}
                      <article className="flashcard-3d-face flashcard-3d-front rounded-3xl editorial-card editorial-card-interactive rose-glass-sheen p-6 sm:p-7 flex flex-col justify-between space-y-5">
                        <div className="space-y-3.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7D6B74]">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#51434A]">
                                {getCatLabel(card.category)}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>
                                {card.isSample
                                  ? t.cardio.flashcardsView.sampleBadge
                                  : t.cardio.flashcardsView.personalBadge}
                              </span>
                            </div>

                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                                isUnderstood
                                  ? 'bg-[#F0FDF4] text-[#15803D]'
                                  : isNeedsRevision
                                  ? 'bg-[#FEF2F2] text-[#B91C1C]'
                                  : 'bg-[#FFF9F6] text-[#7D6B74]'
                              }`}
                            >
                              {isUnderstood
                                ? t.cardio.flashcardsView.statusUnderstood
                                : isNeedsRevision
                                ? t.cardio.flashcardsView.statusNeedsRevision
                                : t.cardio.flashcardsView.statusToStudy}
                            </span>
                          </div>

                          <div
                            onClick={() => toggleRevealCard(card.id)}
                            className="space-y-2 pt-1 cursor-pointer"
                          >
                            <p className="text-[10px] uppercase tracking-wider text-[#C97A92] font-semibold">
                              {t.cardio.flashcardsView.frontHeading}
                            </p>
                            <h3 className="font-serif-editorial text-lg sm:text-xl font-normal text-[#51434A] leading-snug">
                              {card.question}
                            </h3>
                            <p className="text-xs text-[#7D6B74] italic pt-2">
                              {t.cardio.flashcardsView.mentalPrompt}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#EAE0D8]/70 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => toggleRevealCard(card.id)}
                              className="min-h-[42px] px-4 py-2 rounded-xl bg-[#F4DDE3]/80 hover:bg-[#E8A2B5]/50 text-xs font-semibold text-[#51434A] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#C97A92]" />
                              <span>{t.cardio.flashcardsView.revealAnswerBtn}</span>
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleMarkCardStatus(card, 'understood')
                                }
                                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                                  isUnderstood
                                    ? 'bg-[#15803D] text-white'
                                    : 'bg-[#F0FDF4] text-[#15803D] hover:bg-[#DCFCE7]'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>
                                  {t.cardio.flashcardsView.markUnderstoodBtn}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleMarkCardStatus(card, 'needs_revision')
                                }
                                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                                  isNeedsRevision
                                    ? 'bg-[#B91C1C] text-white'
                                    : 'bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2]'
                                }`}
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>
                                  {t.cardio.flashcardsView.markNeedsRevisionBtn}
                                </span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => openEditCardModal(card)}
                              className="min-h-[34px] px-2.5 py-1 rounded-lg text-[#7D6B74] hover:text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{t.common.edit}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setCardToDelete(card)}
                              className="min-h-[34px] px-2.5 py-1 rounded-lg text-[#7D6B74] hover:text-[#B91C1C] flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{t.common.delete}</span>
                            </button>
                          </div>
                        </div>
                      </article>

                      {/* BACK FACE: Answer & Reference */}
                      <article className="flashcard-3d-face flashcard-3d-back rounded-3xl editorial-stationary rose-glass-sheen p-6 sm:p-7 flex flex-col justify-between space-y-5">
                        <div className="space-y-3.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7D6B74]">
                            <span className="font-semibold text-[#51434A]">
                              {getCatLabel(card.category)}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                                isUnderstood
                                  ? 'bg-[#F0FDF4] text-[#15803D]'
                                  : isNeedsRevision
                                  ? 'bg-[#FEF2F2] text-[#B91C1C]'
                                  : 'bg-[#FFF9F6] text-[#7D6B74]'
                              }`}
                            >
                              {isUnderstood
                                ? t.cardio.flashcardsView.statusUnderstood
                                : isNeedsRevision
                                ? t.cardio.flashcardsView.statusNeedsRevision
                                : t.cardio.flashcardsView.statusToStudy}
                            </span>
                          </div>

                          <p className="text-xs text-[#7D6B74] line-clamp-1 italic">
                            {card.question}
                          </p>

                          <div
                            onClick={() => toggleRevealCard(card.id)}
                            className="pt-3 border-t border-[#EAE0D8] space-y-2 cursor-pointer"
                          >
                            <p className="text-[10px] uppercase tracking-wider text-[#15803D] font-semibold">
                              {t.cardio.flashcardsView.backHeading}
                            </p>
                            <p className="text-sm text-[#51434A] leading-relaxed whitespace-pre-line">
                              {card.answer}
                            </p>
                            <p className="text-[11px] text-[#7D6B74] italic pt-1">
                              {card.lectureRef}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#EAE0D8]/70 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => toggleRevealCard(card.id)}
                              className="min-h-[42px] px-4 py-2 rounded-xl bg-[#F4DDE3]/80 hover:bg-[#E8A2B5]/50 text-xs font-semibold text-[#51434A] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-[#C97A92]" />
                              <span>{t.cardio.flashcardsView.hideAnswerBtn}</span>
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleMarkCardStatus(card, 'understood')
                                }
                                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                                  isUnderstood
                                    ? 'bg-[#15803D] text-white'
                                    : 'bg-[#F0FDF4] text-[#15803D] hover:bg-[#DCFCE7]'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>
                                  {t.cardio.flashcardsView.markUnderstoodBtn}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleMarkCardStatus(card, 'needs_revision')
                                }
                                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                                  isNeedsRevision
                                    ? 'bg-[#B91C1C] text-white'
                                    : 'bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2]'
                                }`}
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>
                                  {t.cardio.flashcardsView.markNeedsRevisionBtn}
                                </span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => openEditCardModal(card)}
                              className="min-h-[34px] px-2.5 py-1 rounded-lg text-[#7D6B74] hover:text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{t.common.edit}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setCardToDelete(card)}
                              className="min-h-[34px] px-2.5 py-1 rounded-lg text-[#7D6B74] hover:text-[#B91C1C] flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{t.common.delete}</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          SUBMODE 2: QCM (QUIZ)
         ===================================================================== */}
      {subMode === 'quiz' && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
                {selectedCategory === 'All'
                  ? t.cardio.quizView.allTitle
                  : t.cardio.quizView.categoryTitle(
                      getCatLabel(selectedCategory)
                    )}
              </h2>
              <p className="text-xs text-[#7D6B74]">
                {t.cardio.quizView.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {quizScoreStats.incorrect > 0 && (
                <button
                  onClick={() => setReviewIncorrectOnly((prev) => !prev)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                    reviewIncorrectOnly
                      ? 'bg-[#B91C1C] text-white border-[#B91C1C]'
                      : 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] hover:bg-[#FEE2E2]'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {reviewIncorrectOnly
                      ? t.cardio.quizView.showAllQuizzesBtn
                      : t.cardio.quizView.reviewMistakesBtn(
                          quizScoreStats.incorrect
                        )}
                  </span>
                </button>
              )}

              {Object.keys(quizSubmissions).length > 0 && (
                <button
                  onClick={() => {
                    setQuizSubmissions({});
                    setDraftMultiSelections({});
                    setReviewIncorrectOnly(false);
                    onNotify?.(t.toasts.quizReset);
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#EAE0D8] bg-white text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.cardio.quizView.resetScoreBtn}</span>
                </button>
              )}

              <button
                onClick={openNewQuizModal}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#E8A2B5]" />
                <span>{t.cardio.quizView.createQuizBtn}</span>
              </button>
            </div>
          </div>

          {/* Score & Progress Banner */}
          {categoryFilteredQuizzes.length > 0 && (
            <div className="rounded-3xl rose-glass-cream rose-glass-sheen p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-[#7D6B74]">
                  {t.cardio.quizView.scoreBannerHeading}
                </p>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-serif-editorial text-xl sm:text-2xl text-[#51434A]">
                    {t.cardio.quizView.scoreLabel}{' '}
                    <strong className="font-mono-tabular font-semibold text-[#C97A92]">
                      {quizScoreStats.correct} / {quizScoreStats.answered}
                    </strong>{' '}
                    {t.cardio.quizView.correctWord}
                  </span>
                  <span className="text-xs font-mono-tabular text-[#7D6B74]">
                    {t.cardio.quizView.scoreStatsSummary(
                      quizScoreStats.pct,
                      quizScoreStats.answered,
                      quizScoreStats.total,
                      quizScoreStats.incorrect
                    )}
                  </span>
                </div>
              </div>

              <div className="w-full sm:w-56 space-y-1.5">
                <div className="w-full h-2.5 rounded-full bg-white border border-[#EAE0D8] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#E8A2B5] transition-all duration-300"
                    style={{
                      width: `${
                        quizScoreStats.total > 0
                          ? Math.round(
                              (quizScoreStats.answered / quizScoreStats.total) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-[#7D6B74] text-right font-mono-tabular">
                  {t.cardio.quizView.validatedCount(
                    quizScoreStats.answered,
                    quizScoreStats.total
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Create / Edit QCM Modal */}
          {isQuizModalOpen && (
            <form
              onSubmit={handleSaveQuiz}
              className="rounded-3xl editorial-stationary rose-glass-sheen border-[#E8A2B5] p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D8]">
                <div>
                  <h3 className="font-serif-editorial text-xl text-[#51434A]">
                    {editingQuizId
                      ? t.cardio.quizView.modalEditTitle
                      : t.cardio.quizView.modalNewTitle}
                  </h3>
                  <p className="text-xs text-[#7D6B74]">
                    {t.cardio.quizView.modalSubtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7D6B74]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#51434A] mb-1">
                    {t.cardio.flashcardsView.cardModuleLabel}
                  </label>
                  <select
                    value={quizCategory}
                    onChange={(e) =>
                      setQuizCategory(e.target.value as CardioCategory)
                    }
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                  >
                    {CARDIO_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {getCatLabel(c)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#51434A] mb-1">
                    {t.cardio.flashcardsView.cardRefLabel}
                  </label>
                  <input
                    type="text"
                    value={quizLectureRef}
                    onChange={(e) => setQuizLectureRef(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#51434A] mb-1">
                  {t.cardio.quizView.questionPromptLabel}
                </label>
                <textarea
                  value={quizQuestionText}
                  onChange={(e) => setQuizQuestionText(e.target.value)}
                  rows={2}
                  className="w-full p-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quizOptions.map((opt, idx) => {
                  const isChecked = quizCorrectIndicesDraft.includes(idx);
                  return (
                    <div key={idx}>
                      <label className="flex items-center justify-between text-xs font-medium text-[#51434A] mb-1">
                        <span>
                          {t.cardio.quizView.optionLabel(
                            String.fromCharCode(65 + idx)
                          )}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-[#7D6B74] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleDraftCorrectIndex(idx)}
                          />
                          <span
                            className={
                              isChecked ? 'text-[#15803D] font-semibold' : ''
                            }
                          >
                            {t.cardio.quizView.correctOptionCheckbox}
                          </span>
                        </span>
                      </label>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const next = [...quizOptions];
                          next[idx] = e.target.value;
                          setQuizOptions(next);
                        }}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                        required
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#51434A] mb-1">
                  {t.cardio.quizView.explanationLabel}
                </label>
                <textarea
                  value={quizExplanation}
                  onChange={(e) => setQuizExplanation(e.target.value)}
                  rows={3}
                  className="w-full p-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="min-h-[44px] px-4 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#7D6B74]"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-1.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium"
                >
                  {t.cardio.quizView.saveQuizBtn}
                </button>
              </div>
            </form>
          )}

          {displayedQuizzes.length === 0 ? (
            <div className="rounded-3xl editorial-card rose-glass-sheen p-12 text-center space-y-4">
              <HelpCircle className="w-8 h-8 text-[#C97A92] mx-auto" />
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-serif-editorial text-2xl text-[#51434A]">
                  {reviewIncorrectOnly
                    ? t.cardio.quizView.emptyNoMistakesTitle
                    : t.cardio.quizView.emptyNoQuizzesTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#7D6B74]">
                  {reviewIncorrectOnly
                    ? t.cardio.quizView.emptyNoMistakesSubtitle
                    : t.cardio.quizView.emptyNoQuizzesSubtitle}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {reviewIncorrectOnly && (
                  <button
                    onClick={() => setReviewIncorrectOnly(false)}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium cursor-pointer"
                  >
                    {t.cardio.quizView.backToAllQuizzesBtn}
                  </button>
                )}
                <button
                  onClick={openNewQuizModal}
                  className="min-h-[44px] px-5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.cardio.quizView.createQuizBtn}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {displayedQuizzes.map((q, qIdx) => {
                const correctIndices = getNormalizedCorrectIndices(q);
                const isMulti =
                  q.isMultipleChoice || correctIndices.length > 1;
                const submission = quizSubmissions[q.id];
                const isAnswered = !!submission?.submitted;
                const draftChosen = draftMultiSelections[q.id] || [];

                return (
                  <article
                    key={q.id}
                    className="rounded-3xl editorial-card rose-glass-sheen p-6 sm:p-8 space-y-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7D6B74]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono-tabular font-semibold text-[#51434A]">
                          QCM {String(qIdx + 1).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-[#51434A]">
                          {getCatLabel(q.category)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-[#F3E9DD] text-[#51434A] text-[11px] font-medium">
                          {isMulti
                            ? t.cardio.quizView.multipleChoiceBadge
                            : t.cardio.quizView.singleChoiceBadge}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isAnswered && (
                          <button
                            onClick={() => handleRetryQuestion(q.id)}
                            className="min-h-[34px] px-2.5 py-1 rounded-lg text-xs text-[#C97A92] hover:underline cursor-pointer"
                          >
                            {t.common.retry}
                          </button>
                        )}
                        <button
                          onClick={() => openEditQuizModal(q)}
                          className="min-h-[34px] px-2.5 py-1 rounded-lg text-xs text-[#7D6B74] hover:text-[#51434A] cursor-pointer"
                        >
                          {t.common.edit}
                        </button>
                        <button
                          onClick={() => setQuizToDelete(q)}
                          className="min-h-[34px] px-2.5 py-1 rounded-lg text-xs text-[#7D6B74] hover:text-[#B91C1C] cursor-pointer"
                        >
                          {t.common.delete}
                        </button>
                      </div>
                    </div>

                    <h3 className="font-serif-editorial text-lg sm:text-xl font-normal text-[#51434A] leading-snug">
                      {q.question}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = isAnswered
                          ? submission.selectedIndices.includes(optIdx)
                          : draftChosen.includes(optIdx);
                        const isThisCorrect = correctIndices.includes(optIdx);

                        let btnStyle =
                          'bg-[#FFF9F6] border-[#EAE0D8] text-[#51434A] hover:border-[#E8A2B5]';
                        if (!isAnswered && isMulti && isSelected) {
                          btnStyle =
                            'bg-[#F4DDE3]/75 border-[#C97A92] text-[#51434A] font-medium';
                        } else if (isAnswered) {
                          if (isThisCorrect) {
                            btnStyle =
                              'bg-[#F0FDF4] border-[#86EFAC] text-[#14532D] font-medium';
                          } else if (isSelected && !isThisCorrect) {
                            btnStyle =
                              'bg-[#FEF2F2] border-[#FECACA] text-[#7F1D1D]';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              if (isAnswered) return;
                              if (isMulti) {
                                handleToggleMultiChoiceDraft(q.id, optIdx);
                              } else {
                                handleSelectSingleChoiceOption(q, optIdx);
                              }
                            }}
                            className={`min-h-[52px] p-4 rounded-2xl border text-left text-sm transition-colors flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                          >
                            <span>
                              <strong className="font-mono-tabular mr-2">
                                {String.fromCharCode(65 + optIdx)}.
                              </strong>
                              {opt}
                            </span>
                            {isAnswered && isThisCorrect && (
                              <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Multi-Choice Submit Button */}
                    {isMulti && !isAnswered && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleValidateMultiChoiceQuestion(q)}
                          className="min-h-[42px] px-5 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] transition-colors cursor-pointer"
                        >
                          {t.cardio.quizView.validateAnswerBtn(
                            draftChosen.length
                          )}
                        </button>
                      </div>
                    )}

                    {/* Detailed Explanation After Answering */}
                    {isAnswered && (
                      <div className="p-5 rounded-2xl bg-[#FFF9F6] border border-[#EAE0D8] space-y-2 text-xs animate-page-enter">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p
                            className={`font-semibold text-sm ${
                              submission.isCorrect
                                ? 'text-[#15803D]'
                                : 'text-[#B91C1C]'
                            }`}
                          >
                            {submission.isCorrect
                              ? t.cardio.quizView.correctFeedback
                              : t.cardio.quizView.incorrectFeedback(
                                  correctIndices
                                    .map((i) => String.fromCharCode(65 + i))
                                    .join(', ')
                                )}
                          </p>
                        </div>
                        <p className="text-[#51434A] leading-relaxed text-xs sm:text-sm">
                          {q.explanation}
                        </p>
                        <p className="text-[#7D6B74] italic pt-1">
                          {q.lectureRef}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          SUBMODE 3: ECG LEARNING
         ===================================================================== */}
      {subMode === 'ecg' && (
        <div className="space-y-10">
          {/* PART A: Interactive ECG Rhythm Identification Cases */}
          <section className="rounded-3xl editorial-card rose-glass-sheen p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EAE0D8]">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#C97A92] uppercase tracking-wider">
                  {t.cardio.ecgView.badge}
                </span>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#51434A]">
                  {t.cardio.ecgView.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#7D6B74]">
                  {t.cardio.ecgView.subtitle}
                </p>
              </div>

              <button
                onClick={openNewEcgCaseModal}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#E8A2B5]" />
                <span>{t.cardio.ecgView.addCaseBtn}</span>
              </button>
            </div>

            {/* Modal to Add Custom ECG Case */}
            {isEcgCaseModalOpen && (
              <form
                onSubmit={handleAddCustomEcgCase}
                className="rounded-3xl editorial-stationary rose-glass-sheen border-[#E8A2B5] p-6 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D8]">
                  <h3 className="font-serif-editorial text-xl text-[#51434A]">
                    {t.cardio.ecgView.modalTitle}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEcgCaseModalOpen(false)}
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[#7D6B74]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#51434A] mb-1">
                      {t.cardio.ecgView.caseTitleLabel}
                    </label>
                    <input
                      type="text"
                      value={newEcgTitle}
                      onChange={(e) => setNewEcgTitle(e.target.value)}
                      placeholder={t.cardio.ecgView.caseTitlePlaceholder}
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#51434A] mb-1">
                      {t.cardio.ecgView.schematicPatternLabel}
                    </label>
                    <select
                      value={newEcgPattern}
                      onChange={(e) =>
                        setNewEcgPattern(e.target.value as EcgPatternType)
                      }
                      className="w-full min-h-[44px] px-3 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                    >
                      <option value="sinus">
                        {t.cardio.ecgView.patterns.sinus}
                      </option>
                      <option value="afib">
                        {t.cardio.ecgView.patterns.afib}
                      </option>
                      <option value="flutter">
                        {t.cardio.ecgView.patterns.flutter}
                      </option>
                      <option value="bav1">
                        {t.cardio.ecgView.patterns.bav1}
                      </option>
                      <option value="esv">
                        {t.cardio.ecgView.patterns.esv}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {newEcgOptions.map((opt, idx) => (
                    <div key={idx}>
                      <label className="flex items-center justify-between text-xs font-medium text-[#51434A] mb-1">
                        <span>
                          {t.cardio.ecgView.optionLabel(
                            String.fromCharCode(65 + idx)
                          )}
                        </span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <input
                            type="radio"
                            name="newEcgCorrect"
                            checked={newEcgCorrectIdx === idx}
                            onChange={() => setNewEcgCorrectIdx(idx)}
                          />
                          <span>{t.cardio.ecgView.correctRadio}</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const next = [...newEcgOptions];
                          next[idx] = e.target.value;
                          setNewEcgOptions(next);
                        }}
                        className="w-full min-h-[42px] px-3 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newEcgFreq}
                    onChange={(e) => setNewEcgFreq(e.target.value)}
                    placeholder={t.cardio.ecgView.freqPlaceholder}
                    className="min-h-[42px] px-3 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-xs text-[#51434A]"
                  />
                  <input
                    type="text"
                    value={newEcgOndeP}
                    onChange={(e) => setNewEcgOndeP(e.target.value)}
                    placeholder={t.cardio.ecgView.pWavePlaceholder}
                    className="min-h-[42px] px-3 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-xs text-[#51434A]"
                  />
                  <input
                    type="text"
                    value={newEcgQRS}
                    onChange={(e) => setNewEcgQRS(e.target.value)}
                    placeholder={t.cardio.ecgView.qrsPlaceholder}
                    className="min-h-[42px] px-3 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-xs text-[#51434A]"
                  />
                </div>

                <textarea
                  value={newEcgExplanation}
                  onChange={(e) => setNewEcgExplanation(e.target.value)}
                  rows={2}
                  placeholder={t.cardio.ecgView.explanationPlaceholder}
                  className="w-full p-3 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                  required
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEcgCaseModalOpen(false)}
                    className="min-h-[40px] px-4 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#7D6B74]"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    className="min-h-[40px] px-5 py-1.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium"
                  >
                    {t.cardio.ecgView.saveCaseBtn}
                  </button>
                </div>
              </form>
            )}

            {/* Case Selector Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {localizedEcgCases.map((c, idx) => {
                const isSelected = c.id === activeEcgCase?.id;
                const answeredIdx = ecgCaseAnswers[c.id];
                const isCorrect = answeredIdx === c.correctIndex;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedEcgCaseId(c.id)}
                    className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#51434A] text-[#FFF9F6]'
                        : 'bg-[#FFF9F6] border border-[#EAE0D8] text-[#51434A] hover:border-[#E8A2B5]'
                    }`}
                  >
                    <span>{t.cardio.ecgView.casePillLabel(idx + 1)}</span>
                    {answeredIdx !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          isCorrect
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : 'bg-[#FEE2E2] text-[#B91C1C]'
                        }`}
                      >
                        {isCorrect ? '✓' : '!'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {activeEcgCase && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-serif-editorial text-xl text-[#51434A]">
                    {activeEcgCase.title}
                  </h3>
                  <p className="text-xs text-[#7D6B74]">
                    {activeEcgCase.contextLabel}
                  </p>
                </div>

                {/* Clearly Labeled Educational SVG Schematic on Millimetric Grid */}
                <div className="rounded-2xl bg-[#FFF9F6] border border-[#EAE0D8] p-4 sm:p-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#7D6B74] font-mono-tabular">
                    <span className="font-semibold text-[#C97A92]">
                      {t.cardio.ecgView.schematicWarningBadge}
                    </span>
                    <span>{t.cardio.ecgView.calibrationLabel}</span>
                  </div>

                  <svg
                    viewBox="0 0 600 160"
                    className="w-full h-auto overflow-visible rounded-xl bg-white border border-[#F4DDE3]"
                    role="img"
                    aria-label={t.cardio.ecgView.schematicWarningBadge}
                  >
                    <defs>
                      <pattern
                        id="ecg-case-small-grid"
                        width="12"
                        height="12"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 12 0 L 0 0 0 12"
                          fill="none"
                          stroke="#F4DDE3"
                          strokeWidth="0.6"
                        />
                      </pattern>
                      <pattern
                        id="ecg-case-large-grid"
                        width="60"
                        height="60"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect
                          width="60"
                          height="60"
                          fill="url(#ecg-case-small-grid)"
                        />
                        <path
                          d="M 60 0 L 0 0 0 60"
                          fill="none"
                          stroke="#E8A2B5"
                          strokeWidth="1"
                          strokeOpacity="0.55"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="600"
                      height="160"
                      fill="url(#ecg-case-large-grid)"
                    />
                    <path
                      d={renderEducationalEcgPath(activeEcgCase.patternType)}
                      fill="none"
                      stroke="#51434A"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Rhythm Identification Question */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#51434A]">
                    {t.cardio.ecgView.identifyPrompt}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeEcgCase.options.map((opt, optIdx) => {
                      const chosen = ecgCaseAnswers[activeEcgCase.id];
                      const isAnswered = chosen !== undefined;
                      const isThisCorrect =
                        activeEcgCase.correctIndex === optIdx;
                      const isThisChosen = chosen === optIdx;

                      let btnStyle =
                        'bg-[#FFF9F6] border-[#EAE0D8] text-[#51434A] hover:border-[#E8A2B5]';
                      if (isAnswered) {
                        if (isThisCorrect) {
                          btnStyle =
                            'bg-[#F0FDF4] border-[#86EFAC] text-[#14532D] font-medium';
                        } else if (isThisChosen && !isThisCorrect) {
                          btnStyle =
                            'bg-[#FEF2F2] border-[#FECACA] text-[#7F1D1D]';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            setEcgCaseAnswers((prev) => ({
                              ...prev,
                              [activeEcgCase.id]: optIdx,
                            }));
                            recordStudyActivity('ecgPracticed', 1);
                          }}
                          className={`min-h-[48px] p-4 rounded-2xl border text-left text-sm transition-colors flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span>
                            <strong className="font-mono-tabular mr-2">
                              {String.fromCharCode(65 + optIdx)}.
                            </strong>
                            {opt}
                          </span>
                          {isAnswered && isThisCorrect && (
                            <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Structured Educational Explanation after Identification */}
                {ecgCaseAnswers[activeEcgCase.id] !== undefined && (
                  <div className="rounded-2xl bg-[#FFF9F6] border border-[#EAE0D8] p-5 sm:p-6 space-y-4 animate-page-enter">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EAE0D8]">
                      <h4 className="font-serif-editorial text-lg text-[#51434A]">
                        {t.cardio.ecgView.structuredAnalysisTitle}
                      </h4>
                      <span
                        className={`text-xs font-semibold ${
                          ecgCaseAnswers[activeEcgCase.id] ===
                          activeEcgCase.correctIndex
                            ? 'text-[#15803D]'
                            : 'text-[#B91C1C]'
                        }`}
                      >
                        {ecgCaseAnswers[activeEcgCase.id] ===
                        activeEcgCase.correctIndex
                          ? t.cardio.ecgView.exactIdentification
                          : t.cardio.ecgView.expectedAnswer(
                              activeEcgCase.options[activeEcgCase.correctIndex]
                            )}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-[#EAE0D8]">
                        <p className="text-[10px] uppercase tracking-wider text-[#C97A92] font-semibold">
                          {t.cardio.ecgView.step1Freq}
                        </p>
                        <p className="text-[#51434A] mt-1">
                          {activeEcgCase.systematicAnalysis.frequence}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#EAE0D8]">
                        <p className="text-[10px] uppercase tracking-wider text-[#C97A92] font-semibold">
                          {t.cardio.ecgView.step2Rhythm}
                        </p>
                        <p className="text-[#51434A] mt-1">
                          {activeEcgCase.systematicAnalysis.rythme}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#EAE0D8]">
                        <p className="text-[10px] uppercase tracking-wider text-[#C97A92] font-semibold">
                          {t.cardio.ecgView.step3PWave}
                        </p>
                        <p className="text-[#51434A] mt-1">
                          {activeEcgCase.systematicAnalysis.ondeP}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#EAE0D8]">
                        <p className="text-[10px] uppercase tracking-wider text-[#C97A92] font-semibold">
                          {t.cardio.ecgView.step4PR}
                        </p>
                        <p className="text-[#51434A] mt-1">
                          {activeEcgCase.systematicAnalysis.espacePR}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#EAE0D8]">
                        <p className="text-[10px] uppercase tracking-wider text-[#C97A92] font-semibold">
                          {t.cardio.ecgView.step5QRS}
                        </p>
                        <p className="text-[#51434A] mt-1">
                          {activeEcgCase.systematicAnalysis.complexeQRS}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs sm:text-sm text-[#51434A] leading-relaxed">
                      <p>{activeEcgCase.explanation}</p>
                      <p className="text-xs text-[#7D6B74] italic">
                        {activeEcgCase.lectureRef}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* PART B: Interactive P-QRS-T Segment Annotator */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 rounded-3xl editorial-card rose-glass-sheen p-6 sm:p-8 space-y-5">
              <div>
                <h3 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
                  {t.cardio.ecgView.semiologyTitle}
                </h3>
                <p className="text-xs text-[#7D6B74]">
                  {t.cardio.ecgView.semiologySubtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {localizedEcgNotes.map((wave) => {
                  const isSelected = selectedWaveId === wave.id;
                  return (
                    <button
                      key={wave.id}
                      onClick={() => handleSelectWave(wave.id)}
                      className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#51434A] text-[#FFF9F6]'
                          : 'bg-[#FFF9F6] text-[#51434A] border border-[#EAE0D8] hover:border-[#E8A2B5]'
                      }`}
                    >
                      {wave.label}
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#7D6B74]">
                {t.cardio.ecgView.calibrationReminder}
              </p>
            </div>

            <div className="lg:col-span-5 rounded-3xl editorial-stationary rose-glass-sheen p-6 sm:p-8 space-y-5">
              {activeEcgWave && (
                <>
                  <div className="pb-4 border-b border-[#EAE0D8] space-y-1">
                    <span className="text-xs font-mono-tabular text-[#C97A92] font-semibold">
                      {t.cardio.ecgView.selectedSegmentPrefix} ·{' '}
                      {activeEcgWave.label.toUpperCase()}
                    </span>
                    <h3 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
                      {activeEcgWave.title}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-[#51434A] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#C97A92]" />
                      <span>{t.cardio.ecgView.electrophysiologyRecall}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-[#7D6B74] leading-relaxed">
                      {activeEcgWave.educationalConcept}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EAE0D8] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-[#51434A]">
                        {t.cardio.ecgView.personalCourseNotes(
                          activeEcgWave.label
                        )}
                      </h4>
                      {!editingEcgNote && (
                        <button
                          onClick={() => {
                            setEcgNoteDraft(activeEcgWave.personalNote);
                            setEditingEcgNote(true);
                          }}
                          className="min-h-[36px] px-2.5 text-xs font-medium text-[#C97A92] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{t.cardio.ecgView.annotateBtn}</span>
                        </button>
                      )}
                    </div>

                    {editingEcgNote ? (
                      <div className="space-y-3">
                        <textarea
                          value={ecgNoteDraft}
                          onChange={(e) => setEcgNoteDraft(e.target.value)}
                          rows={4}
                          className="w-full p-3.5 rounded-xl border border-[#E8A2B5] bg-white text-xs sm:text-sm text-[#51434A] leading-relaxed"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingEcgNote(false)}
                            className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#7D6B74]"
                          >
                            {t.common.cancel}
                          </button>
                          <button
                            onClick={() => {
                              onUpdateEcgNote(activeEcgWave.id, ecgNoteDraft);
                              setEditingEcgNote(false);
                              onNotify?.(t.toasts.ecgAnnotationSaved);
                            }}
                            className="min-h-[38px] px-4 py-1.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium"
                          >
                            {t.common.save}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-white border border-[#EAE0D8] text-xs sm:text-sm text-[#51434A] leading-relaxed whitespace-pre-line">
                        {activeEcgWave.personalNote}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          SUBMODE 4: STUDY TRACKING
         ===================================================================== */}
      {subMode === 'tracking' && (
        <section className="space-y-8">
          <div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#51434A]">
              {t.cardio.trackingView.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B74]">
              {t.cardio.trackingView.subtitle}
            </p>
          </div>

          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl editorial-card rose-glass-sheen p-6 space-y-2">
              <p className="text-xs text-[#7D6B74]">
                {t.cardio.trackingView.cardsUnderstoodTitle}
              </p>
              <p className="font-serif-editorial text-3xl text-[#51434A] font-mono-tabular">
                {trackingStats.understoodCount}{' '}
                <span className="text-base text-[#7D6B74]">
                  / {normalizedFlashcards.length}
                </span>
              </p>
              <p className="text-[11px] text-[#C97A92]">
                {t.cardio.trackingView.cardsNeedsRevisionSub(
                  trackingStats.needsRevisionCount
                )}
              </p>
            </div>

            <div className="rounded-3xl editorial-card rose-glass-sheen p-6 space-y-2">
              <p className="text-xs text-[#7D6B74]">
                {t.cardio.trackingView.quizAccuracyTitle}
              </p>
              <p className="font-serif-editorial text-3xl text-[#51434A] font-mono-tabular">
                {quizScoreStats.pct}%
              </p>
              <p className="text-[11px] text-[#7D6B74]">
                {t.cardio.trackingView.quizAccuracySub(
                  quizScoreStats.correct,
                  quizScoreStats.answered,
                  quizScoreStats.total
                )}
              </p>
            </div>

            <div className="rounded-3xl editorial-card rose-glass-sheen p-6 space-y-2">
              <p className="text-xs text-[#7D6B74]">
                {t.cardio.trackingView.ecgIdentifiedTitle}
              </p>
              <p className="font-serif-editorial text-3xl text-[#51434A] font-mono-tabular">
                {trackingStats.ecgCorrectCount}{' '}
                <span className="text-base text-[#7D6B74]">
                  / {localizedEcgCases.length}
                </span>
              </p>
              <p className="text-[11px] text-[#7D6B74]">
                {t.cardio.trackingView.ecgIdentifiedSub(
                  trackingStats.ecgAnsweredCount
                )}
              </p>
            </div>

            <div className="rounded-3xl editorial-card rose-glass-sheen p-6 space-y-2">
              <p className="text-xs text-[#7D6B74]">
                {t.cardio.trackingView.studyGoalsValidatedTitle}
              </p>
              <p className="font-serif-editorial text-3xl text-[#51434A] font-mono-tabular">
                {trackingStats.completedTopicsCount}{' '}
                <span className="text-base text-[#7D6B74]">
                  / {studyTopics.length}
                </span>
              </p>
              <p className="text-[11px] text-[#7D6B74]">
                {t.cardio.trackingView.studyGoalsValidatedSub}
              </p>
            </div>
          </div>

          {/* Weekly Progress Bar Chart (7 Days) + Module Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left (7 cols): Weekly Activity Chart */}
            <div className="lg:col-span-7 rounded-3xl editorial-card rose-glass-sheen p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-serif-editorial text-xl text-[#51434A]">
                  {t.cardio.trackingView.weeklyChartTitle}
                </h3>
                <p className="text-xs text-[#7D6B74]">
                  {t.cardio.trackingView.weeklyChartSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-7 gap-2.5 items-end h-44 pt-4 px-2">
                {trackingStats.last7Days.map((day) => {
                  const heightPct = Math.max(
                    8,
                    Math.round(
                      (day.totalActions / trackingStats.maxDailyActions) * 100
                    )
                  );
                  return (
                    <div
                      key={day.dateIso}
                      className="flex flex-col items-center justify-end h-full gap-2"
                    >
                      <span className="text-[11px] font-mono-tabular text-[#51434A] font-medium">
                        {day.totalActions}
                      </span>
                      <div className="w-full max-w-[36px] bg-[#F3E9DD]/60 rounded-t-xl h-32 flex items-end overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-t from-[#C97A92] to-[#E8A2B5] rounded-t-xl transition-all duration-500"
                          style={{ height: `${heightPct}%` }}
                          title={t.cardio.trackingView.weeklyTooltip(
                            day.cardsReviewed,
                            day.quizzesAnswered,
                            day.ecgPracticed
                          )}
                        />
                      </div>
                      <span className="text-[11px] text-[#7D6B74]">
                        {day.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right (5 cols): Mastery by Cardiology Module */}
            <div className="lg:col-span-5 rounded-3xl editorial-card rose-glass-sheen p-6 sm:p-8 space-y-4">
              <h3 className="font-serif-editorial text-xl text-[#51434A]">
                {t.cardio.trackingView.moduleMasteryTitle}
              </h3>
              <div className="space-y-3.5">
                {CARDIO_CATEGORIES.map((category) => {
                  const catCards = normalizedFlashcards.filter(
                    (f) => f.category === category
                  );
                  const catUnderstood = catCards.filter(
                    (f) => f.reviewStatus === 'understood' || f.mastered
                  ).length;
                  const pct =
                    catCards.length > 0
                      ? Math.round((catUnderstood / catCards.length) * 100)
                      : 0;

                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#51434A]">
                          {getCatLabel(category)}
                        </span>
                        <span className="font-mono-tabular text-[#7D6B74]">
                          {catUnderstood}/{catCards.length} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#F3E9DD] overflow-hidden">
                        <div
                          className="h-full bg-[#C97A92] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Delete Confirmation Modals */}
      <ConfirmDialog
        isOpen={!!cardToDelete}
        title={t.cardio.flashcardsView.deleteModalTitle}
        message={t.cardio.flashcardsView.deleteModalMessage(
          cardToDelete?.question || ''
        )}
        confirmLabel={t.cardio.flashcardsView.deleteConfirmBtn}
        cancelLabel={t.common.cancel}
        onCancel={() => setCardToDelete(null)}
        onConfirm={() => {
          if (cardToDelete) {
            onDeleteFlashcard(cardToDelete.id);
            onNotify?.(t.toasts.cardDeleted);
            setCardToDelete(null);
          }
        }}
      />

      <ConfirmDialog
        isOpen={!!quizToDelete}
        title={t.cardio.quizView.deleteModalTitle}
        message={t.cardio.quizView.deleteModalMessage(
          quizToDelete?.question || ''
        )}
        confirmLabel={t.cardio.quizView.deleteConfirmBtn}
        cancelLabel={t.common.cancel}
        onCancel={() => setQuizToDelete(null)}
        onConfirm={() => {
          if (quizToDelete) {
            onDeleteQuizQuestion(quizToDelete.id);
            onNotify?.(t.toasts.quizDeleted);
            setQuizToDelete(null);
          }
        }}
      />
    </div>
  );
};

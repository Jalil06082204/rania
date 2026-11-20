import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Camera,
  Check,
  Edit3,
  Heart,
  Image as ImageIcon,
  Mail,
  MailOpen,
  Mic,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Square,
  Trash2,
  Upload,
  Volume2,
  X,
} from 'lucide-react';
import {
  localizeLetter,
  localizeLoveMessage,
  localizeMemory,
  localizeVoiceRecording,
  translations,
} from '../i18n/translations';
import {
  Language,
  LoveMessageItem,
  MemoryPhoto,
  OpenWhenLetter,
  VoiceRecording,
} from '../types';
import { soundEngine } from '../utils/sound';
import {
  BotanicalSprig,
  FloralCornerFlourish,
  WaxSealHeart,
} from './BotanicalOrnaments';
import { ConfirmDialog } from './ConfirmDialog';
import { ResilientImage } from './ResilientImage';
import { Tilt3DCard } from './Tilt3DCard';

interface LoveLettersProps {
  letters: OpenWhenLetter[];
  onAddLetter: (letter: Omit<OpenWhenLetter, 'id'>) => string;
  onUpdateLetter: (id: string, updated: Partial<OpenWhenLetter>) => void;
  onDeleteLetter: (id: string) => void;
  onRestoreSampleLetters: () => void;
  loveMessages: LoveMessageItem[];
  onAddLoveMessage: (msg: Omit<LoveMessageItem, 'id'>) => void;
  onUpdateLoveMessage: (id: string, updated: Partial<LoveMessageItem>) => void;
  onDeleteLoveMessage: (id: string) => void;
  onRestoreSampleLoveMessages: () => void;
  voiceRecordings: VoiceRecording[];
  onAddVoiceRecording: (rec: Omit<VoiceRecording, 'id'>) => void;
  onUpdateVoiceRecording: (id: string, updated: Partial<VoiceRecording>) => void;
  onDeleteVoiceRecording: (id: string) => void;
  memories: MemoryPhoto[];
  onAddMemory: (mem: Omit<MemoryPhoto, 'id'>) => void;
  onUpdateMemory: (id: string, updated: Partial<MemoryPhoto>) => void;
  onDeleteMemory: (id: string) => void;
  onRestoreSampleMemories: () => void;
  onOpenThingsILove: () => void;
  thingsILoveCount: number;
  onNeedHug: () => void;
  onNotify?: (msg: string) => void;
  soundEnabled?: boolean;
  canManageContent?: boolean;
  language?: Language;
}

export const LoveLetters: React.FC<LoveLettersProps> = ({
  letters,
  onAddLetter,
  onUpdateLetter,
  onDeleteLetter,
  onRestoreSampleLetters,
  loveMessages,
  onAddLoveMessage,
  onUpdateLoveMessage,
  onDeleteLoveMessage,
  onRestoreSampleLoveMessages,
  voiceRecordings,
  onAddVoiceRecording,
  onUpdateVoiceRecording,
  onDeleteVoiceRecording,
  memories,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  onRestoreSampleMemories,
  onOpenThingsILove,
  thingsILoveCount,
  onNeedHug,
  onNotify,
  soundEnabled = true,
  canManageContent = true,
  language = 'en',
}) => {
  const t = translations[language];
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';

  const localizedLetters = useMemo(
    () => letters.map((l) => localizeLetter(l, language)),
    [letters, language]
  );

  const localizedLoveMessages = useMemo(
    () => loveMessages.map((m) => localizeLoveMessage(m, language)),
    [loveMessages, language]
  );

  const localizedRecordings = useMemo(
    () => voiceRecordings.map((r) => localizeVoiceRecording(r, language)),
    [voiceRecordings, language]
  );

  const localizedMemories = useMemo(
    () => memories.map((m) => localizeMemory(m, language)),
    [memories, language]
  );

  // Random Love Message Spotlight state
  const [activeLoveMsgIndex, setActiveLoveMsgIndex] = useState<number>(0);
  const [isManageNotesOpen, setIsManageNotesOpen] = useState<boolean>(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [noteContext, setNoteContext] = useState<string>('');

  // Active Open When Letter + Envelope Animation state
  const [selectedLetterId, setSelectedLetterId] = useState<string>(
    letters[0]?.id || ''
  );
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [isLetterRevealed, setIsLetterRevealed] = useState<boolean>(false);
  const envelopeRevealTimerRef = useRef<number | null>(null);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [editingLetterId, setEditingLetterId] = useState<string | null>(null);
  const [letterOccasion, setLetterOccasion] = useState('');
  const [letterSubtitle, setLetterSubtitle] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [letterToDelete, setLetterToDelete] = useState<OpenWhenLetter | null>(
    null
  );

  // Audio player & voice recording state (supports true Pause & Resume + Edit)
  const [activeRecId, setActiveRecId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioProgressSec, setAudioProgressSec] = useState<number>(0);
  const [melodySavedStep, setMelodySavedStep] = useState<number>(0);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const [recToDelete, setRecToDelete] = useState<VoiceRecording | null>(null);
  const [editingRec, setEditingRec] = useState<VoiceRecording | null>(null);
  const [recTitleDraft, setRecTitleDraft] = useState('');
  const [recNoteDraft, setRecNoteDraft] = useState('');

  // Optional browser microphone recorder
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingStartRef = useRef<number>(0);

  // Memories gallery state
  const [lightboxMemory, setLightboxMemory] = useState<MemoryPhoto | null>(
    null
  );
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [memTitle, setMemTitle] = useState('');
  const [memDateLabel, setMemDateLabel] = useState('');
  const [memLocation, setMemLocation] = useState('');
  const [memCaption, setMemCaption] = useState('');
  const [memImageUrl, setMemImageUrl] = useState('');
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [memoryToDelete, setMemoryToDelete] = useState<MemoryPhoto | null>(
    null
  );

  // Stop any playing audio and clear pending envelope timers when unmounting
  useEffect(() => {
    return () => {
      if (envelopeRevealTimerRef.current !== null) {
        window.clearTimeout(envelopeRevealTimerRef.current);
      }
      soundEngine.stopMusicBoxMelody();
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
        htmlAudioRef.current = null;
      }
    };
  }, []);

  const activeLetter =
    localizedLetters.find((l) => l.id === selectedLetterId) ||
    localizedLetters[0] ||
    null;

  const activeLoveMessage =
    localizedLoveMessages[activeLoveMsgIndex] ||
    localizedLoveMessages[0] ||
    null;

  // Random Love Note Handlers
  const handleDrawRandomLoveNote = () => {
    if (localizedLoveMessages.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * localizedLoveMessages.length);
    if (nextIdx === activeLoveMsgIndex) {
      nextIdx = (activeLoveMsgIndex + 1) % localizedLoveMessages.length;
    }
    setActiveLoveMsgIndex(nextIdx);
  };

  const openNewLoveNoteForm = () => {
    setEditingNoteId(null);
    setNoteText('');
    setNoteContext('');
    setIsManageNotesOpen(true);
  };

  const openEditLoveNoteForm = (msg: LoveMessageItem) => {
    setEditingNoteId(msg.id);
    setNoteText(msg.text);
    setNoteContext(msg.contextNote || '');
    setIsManageNotesOpen(true);
  };

  const handleSaveLoveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    if (editingNoteId) {
      onUpdateLoveMessage(editingNoteId, {
        text: noteText.trim(),
        contextNote: noteContext.trim() || undefined,
        isSample: false,
      });
      onNotify?.(t.toasts.savedToSanctuary);
    } else {
      onAddLoveMessage({
        text: noteText.trim(),
        contextNote: noteContext.trim() || undefined,
        isSample: false,
      });
      setActiveLoveMsgIndex(0);
      onNotify?.(t.toasts.savedToSanctuary);
    }
    setEditingNoteId(null);
    setNoteText('');
    setNoteContext('');
  };

  // Envelope Selection & 3D Opening Handlers
  const clearEnvelopeTimer = () => {
    if (envelopeRevealTimerRef.current !== null) {
      window.clearTimeout(envelopeRevealTimerRef.current);
      envelopeRevealTimerRef.current = null;
    }
  };

  const handleBreakSealAndOpen = () => {
    clearEnvelopeTimer();
    setIsEnvelopeOpen(true);
    soundEngine.playChime(soundEnabled);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsLetterRevealed(true);
      return;
    }

    envelopeRevealTimerRef.current = window.setTimeout(() => {
      setIsLetterRevealed(true);
      envelopeRevealTimerRef.current = null;
    }, 440);
  };

  const handleResealEnvelope = () => {
    clearEnvelopeTimer();
    setIsLetterRevealed(false);
    setIsEnvelopeOpen(false);
  };

  const handleSelectEnvelope = (letterId: string) => {
    if (activeLetter?.id === letterId) {
      if (isEnvelopeOpen) {
        handleResealEnvelope();
      } else {
        handleBreakSealAndOpen();
      }
      return;
    }
    clearEnvelopeTimer();
    setSelectedLetterId(letterId);
    setIsEnvelopeOpen(false);
    setIsLetterRevealed(false);
  };

  // Open When Letter CRUD handlers
  const openNewLetterModal = () => {
    setEditingLetterId(null);
    setLetterOccasion(
      language === 'fr' ? 'À ouvrir quand...' : 'Open when...'
    );
    setLetterSubtitle(
      language === 'fr'
        ? 'Un mot doux pour cet instant'
        : 'A quiet note for this moment'
    );
    setLetterContent('');
    setIsLetterModalOpen(true);
  };

  const openEditLetterModal = (letter: OpenWhenLetter) => {
    setEditingLetterId(letter.id);
    setLetterOccasion(letter.occasion);
    setLetterSubtitle(letter.subtitle);
    setLetterContent(letter.content);
    setIsLetterModalOpen(true);
  };

  const handleSaveLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterOccasion.trim() || !letterContent.trim()) return;

    if (editingLetterId) {
      onUpdateLetter(editingLetterId, {
        occasion: letterOccasion.trim(),
        subtitle: letterSubtitle.trim(),
        content: letterContent.trim(),
        dateLabel:
          language === 'fr' ? 'Lettre Personnelle' : 'Personal Letter',
        isSample: false,
      });
      onNotify?.(t.toasts.letterUpdated);
    } else {
      const createdId = onAddLetter({
        occasion: letterOccasion.trim(),
        subtitle:
          letterSubtitle.trim() ||
          (language === 'fr' ? 'Écrit avec amour' : 'Written with love'),
        content: letterContent.trim(),
        dateLabel:
          language === 'fr' ? 'Lettre Personnelle' : 'Personal Letter',
        isSample: false,
      });
      setSelectedLetterId(createdId);
      setIsEnvelopeOpen(true);
      setIsLetterRevealed(true);
      onNotify?.(t.toasts.letterAdded);
    }
    setIsLetterModalOpen(false);
  };

  // True Play / Pause / Resume / Restart Audio Handlers
  const stopAllAudio = () => {
    soundEngine.stopMusicBoxMelody();
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
      htmlAudioRef.current.currentTime = 0;
      htmlAudioRef.current = null;
    }
    setActiveRecId(null);
    setIsAudioPlaying(false);
    setAudioProgressSec(0);
    setMelodySavedStep(0);
  };

  const togglePlayPauseRecording = (rec: VoiceRecording) => {
    if (activeRecId === rec.id) {
      if (isAudioPlaying) {
        if (rec.isBuiltInMelody) {
          const step = soundEngine.pauseMusicBoxMelody();
          setMelodySavedStep(step);
        } else if (htmlAudioRef.current) {
          htmlAudioRef.current.pause();
        }
        setIsAudioPlaying(false);
      } else {
        setIsAudioPlaying(true);
        if (rec.isBuiltInMelody) {
          soundEngine.startOrResumeMusicBoxMelody(
            melodySavedStep,
            (elapsed, stepIdx) => {
              setAudioProgressSec(elapsed);
              setMelodySavedStep(stepIdx);
            },
            () => {
              setIsAudioPlaying(false);
              setActiveRecId(null);
              setAudioProgressSec(0);
              setMelodySavedStep(0);
            }
          );
        } else if (htmlAudioRef.current) {
          htmlAudioRef.current.play().catch(() => {
            setIsAudioPlaying(false);
          });
        }
      }
      return;
    }

    stopAllAudio();
    setActiveRecId(rec.id);
    setIsAudioPlaying(true);

    if (rec.isBuiltInMelody) {
      soundEngine.startOrResumeMusicBoxMelody(
        0,
        (elapsed, stepIdx) => {
          setAudioProgressSec(elapsed);
          setMelodySavedStep(stepIdx);
        },
        () => {
          setIsAudioPlaying(false);
          setActiveRecId(null);
          setAudioProgressSec(0);
          setMelodySavedStep(0);
        }
      );
    } else if (rec.audioDataUrl) {
      const audio = new Audio(rec.audioDataUrl);
      htmlAudioRef.current = audio;
      audio.ontimeupdate = () => {
        setAudioProgressSec(Math.floor(audio.currentTime));
      };
      audio.onended = () => {
        setIsAudioPlaying(false);
        setActiveRecId(null);
        setAudioProgressSec(0);
      };
      audio.onerror = () => {
        setIsAudioPlaying(false);
        setActiveRecId(null);
        setAudioProgressSec(0);
      };
      audio.play().catch(() => {
        setIsAudioPlaying(false);
        setActiveRecId(null);
      });
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;

      const tempAudio = new Audio(dataUrl);
      tempAudio.onloadedmetadata = () => {
        const dur = Math.round(tempAudio.duration) || 30;
        onAddVoiceRecording({
          title: file.name.replace(/\.[^/.]+$/, ''),
          dateLabel: new Date().toLocaleDateString(locale, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          durationSeconds: dur,
          audioDataUrl: dataUrl,
          isBuiltInMelody: false,
          transcriptNote:
            language === 'fr'
              ? 'Enregistrement vocal personnel importé.'
              : 'Personal uploaded voice recording.',
          isSample: false,
        });
        onNotify?.(t.toasts.voiceUploaded);
      };
      tempAudio.onerror = () => {
        onAddVoiceRecording({
          title: file.name.replace(/\.[^/.]+$/, ''),
          dateLabel:
            language === 'fr' ? 'Note Vocale Importée' : 'Uploaded Voice Note',
          durationSeconds: 30,
          audioDataUrl: dataUrl,
          isBuiltInMelody: false,
          transcriptNote:
            language === 'fr'
              ? 'Enregistrement vocal personnel importé.'
              : 'Personal uploaded voice recording.',
          isSample: false,
        });
        onNotify?.(t.toasts.voiceUploaded);
      };
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleStartMicRecording = async () => {
    setRecordingError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setRecordingError(t.letters.micUnavailableError);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) recordedChunksRef.current.push(ev.data);
      };

      recorder.onstop = () => {
        const elapsedSeconds = Math.max(
          1,
          Math.round((Date.now() - recordingStartRef.current) / 1000)
        );
        stream.getTracks().forEach((tr) => tr.stop());
        const blob = new Blob(recordedChunksRef.current, {
          type: 'audio/webm',
        });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio =
            typeof reader.result === 'string' ? reader.result : '';
          if (base64Audio) {
            onAddVoiceRecording({
              title: `${
                language === 'fr' ? 'Note Vocale' : 'Voice Note'
              } (${new Date().toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit',
              })})`,
              dateLabel: new Date().toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
              }),
              durationSeconds: elapsedSeconds,
              audioDataUrl: base64Audio,
              isBuiltInMelody: false,
              transcriptNote:
                language === 'fr'
                  ? 'Enregistré directement depuis le navigateur.'
                  : 'Recorded directly in browser.',
              isSample: false,
            });
            onNotify?.(t.toasts.voiceRecorded);
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = recorder;
      recordingStartRef.current = Date.now();
      recorder.start();
      setIsRecordingMic(true);
    } catch {
      setRecordingError(t.letters.micPermissionError);
    }
  };

  const handleStopMicRecording = () => {
    if (mediaRecorderRef.current && isRecordingMic) {
      mediaRecorderRef.current.stop();
      setIsRecordingMic(false);
    }
  };

  const openEditVoiceModal = (rec: VoiceRecording) => {
    setEditingRec(rec);
    setRecTitleDraft(rec.title);
    setRecNoteDraft(rec.transcriptNote);
  };

  const handleSaveVoiceEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRec || !recTitleDraft.trim()) return;
    onUpdateVoiceRecording(editingRec.id, {
      title: recTitleDraft.trim(),
      transcriptNote: recNoteDraft.trim(),
      isSample: false,
    });
    setEditingRec(null);
    onNotify?.(t.toasts.savedToSanctuary);
  };

  // Memories Gallery Handlers
  const openNewMemoryModal = () => {
    setEditingMemoryId(null);
    setMemTitle('');
    setMemDateLabel(
      new Date().toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric',
      })
    );
    setMemLocation('');
    setMemCaption('');
    setMemImageUrl('');
    setIsMemoryModalOpen(true);
  };

  const openEditMemoryModal = (mem: MemoryPhoto) => {
    setEditingMemoryId(mem.id);
    setMemTitle(mem.title);
    setMemDateLabel(mem.dateLabel);
    setMemLocation(mem.locationLabel);
    setMemCaption(mem.caption);
    setMemImageUrl(mem.imageUrl);
    setIsMemoryModalOpen(true);
  };

  const handlePhotoUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 960;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            setMemImageUrl(canvas.toDataURL('image/jpeg', 0.8));
          } else {
            setMemImageUrl(reader.result as string);
          }
        };
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memTitle.trim()) return;

    const finalImage =
      memImageUrl.trim() || '/api/media/memory_cafe_morning';

    if (editingMemoryId) {
      onUpdateMemory(editingMemoryId, {
        title: memTitle.trim(),
        dateLabel:
          memDateLabel.trim() ||
          (language === 'fr' ? 'Instant Précieux' : 'Cherished Moment'),
        locationLabel:
          memLocation.trim() ||
          (language === 'fr' ? 'Notre Univers' : 'Our Universe'),
        caption: memCaption.trim(),
        imageUrl: finalImage,
        isSample: false,
      });
      onNotify?.(t.toasts.memoryUpdated);
    } else {
      onAddMemory({
        title: memTitle.trim(),
        dateLabel:
          memDateLabel.trim() ||
          (language === 'fr' ? 'Instant Précieux' : 'Cherished Moment'),
        locationLabel:
          memLocation.trim() ||
          (language === 'fr' ? 'Notre Univers' : 'Our Universe'),
        caption: memCaption.trim(),
        imageUrl: finalImage,
        isSample: false,
      });
      onNotify?.(t.toasts.memoryAdded);
    }
    setIsMemoryModalOpen(false);
  };

  return (
    <div className="space-y-14 pb-12 animate-page-enter">
      {/* Header & Surprise "I need a hug" + "Things I Love About You" Buttons */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-7 border-b border-[#EAE0D8]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#7D6B74]">
            <WaxSealHeart className="w-5 h-5" />
            <span>{t.letters.badge}</span>
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#51434A] tracking-tight">
            {t.letters.title}
          </h1>
          <p className="text-sm sm:text-base text-[#7D6B74]">
            {t.letters.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenThingsILove}
            className="min-h-[46px] px-5 py-2.5 rounded-2xl border border-[#E8A2B5] bg-white hover:bg-[#FFF9F6] text-[#51434A] text-xs sm:text-sm font-medium active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C97A92]" />
            <span>{t.letters.openThingsILoveBtn}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C97A92]" />
          </button>

          <button
            onClick={onNeedHug}
            className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-[#F4DDE3] hover:bg-[#E8A2B5]/60 text-[#51434A] text-xs sm:text-sm font-semibold active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#C97A92] fill-[#C97A92]" />
            <span>{t.common.needAHug}</span>
          </button>

          {canManageContent && (
            <button
              onClick={openNewLetterModal}
              className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-[#51434A] text-[#FFF9F6] text-xs sm:text-sm font-medium hover:bg-[#3E3238] active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#E8A2B5]" />
              <span>{t.letters.writeNewLetterBtn}</span>
            </button>
          )}
        </div>
      </section>

      {/* PART 0: Random Love Message Spotlight & Editable Collection */}
      <section className="relative rounded-[2.25rem] editorial-stationary rose-glass-sheen p-7 sm:p-11 overflow-hidden">
        <FloralCornerFlourish className="hidden sm:block absolute top-4 left-4 w-14 h-14 pointer-events-none" />
        <FloralCornerFlourish className="hidden sm:block absolute top-4 right-4 w-14 h-14 -scale-x-100 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="space-y-1">
            <p className="text-xs text-[#C97A92] font-medium tracking-wide">
              {t.letters.randomLoveBadge}
            </p>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#51434A]">
              {t.letters.randomLoveTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B74]">
              {t.letters.randomLoveSubtitle}
            </p>
          </div>

          {activeLoveMessage && (
            <div
              key={activeLoveMessage.id}
              className="rounded-2xl rose-glass-cream px-6 py-8 sm:px-10 sm:py-9 space-y-3 animate-page-enter"
            >
              <p className="font-serif-editorial italic text-xl sm:text-3xl text-[#51434A] leading-relaxed">
                “{activeLoveMessage.text}”
              </p>
              {activeLoveMessage.contextNote && (
                <p className="text-xs text-[#7D6B74]">
                  {activeLoveMessage.contextNote} · {t.forRania}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDrawRandomLoveNote}
              className="min-h-[46px] px-6 py-2.5 rounded-2xl bg-[#51434A] text-[#FFF9F6] text-xs sm:text-sm font-medium hover:bg-[#3E3238] active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#E8A2B5]" />
              <span>{t.letters.randomLoveBtn}</span>
            </button>

            {canManageContent && activeLoveMessage && (
              <button
                onClick={() => openEditLoveNoteForm(activeLoveMessage)}
                className="min-h-[46px] px-4 py-2.5 rounded-2xl border border-[#EAE0D8] bg-white hover:bg-[#FFF9F6] text-xs font-medium text-[#51434A] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#C97A92]" />
                <span>{t.common.edit}</span>
              </button>
            )}

            {canManageContent && (
              <button
                onClick={() => setIsManageNotesOpen((prev) => !prev)}
                className="min-h-[46px] px-4 py-2.5 rounded-2xl border border-[#EAE0D8] bg-white hover:bg-[#FFF9F6] text-xs font-medium text-[#7D6B74] hover:text-[#51434A] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C97A92]" />
                <span>
                  {t.letters.manageLoveMessagesBtn} (
                  {localizedLoveMessages.length})
                </span>
              </button>
            )}
          </div>

          {/* Owner Drawer: Add / Edit / Delete Personal Love Notes */}
          {isManageNotesOpen && canManageContent && (
            <div className="pt-6 border-t border-[#EAE0D8] text-left space-y-5 animate-page-enter">
              <form
                onSubmit={handleSaveLoveNote}
                className="rounded-2xl rose-glass-cream p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-editorial text-lg text-[#51434A]">
                    {editingNoteId
                      ? t.letters.editLoveMessageTitle
                      : t.letters.newLoveMessageTitle}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsManageNotesOpen(false)}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#7D6B74]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#51434A] mb-1">
                      {t.letters.loveMessageTextLabel}
                    </label>
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder={t.letters.loveMessageTextPlaceholder}
                      className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#51434A] mb-1">
                      {t.letters.loveMessageContextLabel}
                    </label>
                    <input
                      type="text"
                      value={noteContext}
                      onChange={(e) => setNoteContext(e.target.value)}
                      placeholder={t.letters.loveMessageContextPlaceholder}
                      className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onRestoreSampleLoveMessages();
                      onNotify?.(t.toasts.savedToSanctuary);
                    }}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#7D6B74] hover:text-[#51434A] flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.letters.restoreLoveMessagesBtn}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {editingNoteId && (
                      <button
                        type="button"
                        onClick={openNewLoveNoteForm}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#7D6B74] cursor-pointer"
                      >
                        {t.common.cancel}
                      </button>
                    )}
                    <button
                      type="submit"
                      className="min-h-[38px] px-4 py-1.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.letters.saveLoveMessageBtn}</span>
                    </button>
                  </div>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {localizedLoveMessages.map((msg, i) => (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-xl bg-white/75 backdrop-blur-xs border border-[#EAE0D8] flex items-start justify-between gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveLoveMsgIndex(i)}
                      className="text-left flex-1 text-xs text-[#51434A] leading-relaxed cursor-pointer"
                    >
                      “{msg.text}”
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditLoveNoteForm(msg)}
                        className="min-h-[32px] min-w-[32px] rounded-lg text-[#7D6B74] hover:text-[#51434A] flex items-center justify-center cursor-pointer"
                        aria-label={t.common.edit}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {localizedLoveMessages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteLoveMessage(msg.id);
                            setActiveLoveMsgIndex(0);
                          }}
                          className="min-h-[32px] min-w-[32px] rounded-lg text-[#7D6B74] hover:text-[#B91C1C] flex items-center justify-center cursor-pointer"
                          aria-label={t.common.delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Add / Edit Letter Modal */}
      {isLetterModalOpen && (
        <form
          onSubmit={handleSaveLetter}
          className="rounded-3xl editorial-stationary rose-glass-sheen border-[#E8A2B5] p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D8]">
            <h2 className="font-serif-editorial text-2xl text-[#51434A]">
              {editingLetterId
                ? t.letters.modalEditTitle
                : t.letters.modalNewTitle}
            </h2>
            <button
              type="button"
              onClick={() => setIsLetterModalOpen(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7D6B74]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#51434A] mb-1.5">
                {t.letters.envelopeTitleLabel}
              </label>
              <input
                type="text"
                value={letterOccasion}
                onChange={(e) => setLetterOccasion(e.target.value)}
                placeholder={t.letters.envelopeTitlePlaceholder}
                className="w-full min-h-[46px] px-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#51434A] mb-1.5">
                {t.letters.gentleSubtitleLabel}
              </label>
              <input
                type="text"
                value={letterSubtitle}
                onChange={(e) => setLetterSubtitle(e.target.value)}
                placeholder={t.letters.gentleSubtitlePlaceholder}
                className="w-full min-h-[46px] px-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#51434A] mb-1.5">
              {t.letters.letterContentLabel}
            </label>
            <textarea
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              rows={7}
              className="w-full p-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A] leading-relaxed"
              placeholder={t.letters.letterContentPlaceholder}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsLetterModalOpen(false)}
              className="min-h-[44px] px-5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#7D6B74]"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{t.letters.saveLetterBtn}</span>
            </button>
          </div>
        </form>
      )}

      {/* PART 1: 10 "Open When..." Envelopes & Interactive Envelope-Opening Stage */}
      {localizedLetters.length === 0 ? (
        <section className="rounded-3xl editorial-card rose-glass-sheen p-12 text-center space-y-4">
          <Mail className="w-8 h-8 text-[#C97A92] mx-auto" />
          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="font-serif-editorial text-2xl text-[#51434A]">
              {t.letters.emptyLettersTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B74]">
              {t.letters.emptyLettersSubtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={openNewLetterModal}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.letters.writeFirstLetterBtn}</span>
            </button>
            <button
              onClick={() => {
                onRestoreSampleLetters();
                onNotify?.(t.toasts.lettersRestored);
              }}
              className="min-h-[44px] px-5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.letters.restoreSampleLettersBtn}</span>
            </button>
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 10 Sealed Envelopes List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-2">
              <h2 className="font-serif-editorial text-xl font-normal text-[#51434A]">
                {t.letters.sealedEnvelopesHeading}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#7D6B74]">
                <span className="font-mono-tabular">
                  {localizedLetters.length}{' '}
                  {localizedLetters.length === 1
                    ? t.letters.letterSingular
                    : t.letters.letterPlural}
                </span>
                {canManageContent && localizedLetters.length < 10 && (
                  <button
                    onClick={() => {
                      onRestoreSampleLetters();
                      onNotify?.(t.toasts.lettersRestored);
                    }}
                    className="underline hover:text-[#51434A] cursor-pointer"
                  >
                    {t.common.reset}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
              {localizedLetters.map((letter, idx) => {
                const isSelected = activeLetter?.id === letter.id;
                return (
                  <button
                    key={letter.id}
                    onClick={() => handleSelectEnvelope(letter.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#51434A] text-[#FFF9F6] border border-[#51434A] shadow-sm'
                        : 'editorial-card editorial-card-interactive rose-glass-sheen text-[#51434A]'
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      {isSelected ? (
                        isEnvelopeOpen ? (
                          <MailOpen className="w-5 h-5 text-[#E8A2B5]" />
                        ) : (
                          <Mail className="w-5 h-5 text-[#E8A2B5]" />
                        )
                      ) : (
                        <span className="font-serif-editorial italic text-sm text-[#C97A92] font-mono-tabular">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="font-serif-editorial text-base sm:text-lg font-normal leading-snug">
                        {letter.occasion}
                      </h3>
                      <p
                        className={`text-xs leading-relaxed ${
                          isSelected ? 'text-[#FFF9F6]/80' : 'text-[#7D6B74]'
                        }`}
                      >
                        {letter.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Interactive 3D Envelope-Opening Animation & Stationery Reader (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {activeLetter ? (
              <div className="rounded-[2rem] rose-glass-cream rose-glass-sheen p-4 sm:p-7 space-y-6">
                {/* Interactive 3D Linen Envelope Stage */}
                <div
                  className={`envelope-stage relative mx-auto max-w-xl transition-[padding] duration-500 ${
                    isEnvelopeOpen ? 'pt-28 sm:pt-36' : 'pt-6 sm:pt-8'
                  }`}
                >
                  <div
                    className={`envelope-3d-body relative rounded-2xl border border-[#E5D6C8] shadow-[0_22px_48px_-18px_rgba(81,67,74,0.22)] ${
                      isEnvelopeOpen ? 'translate-y-2' : 'hover:-translate-y-0.5'
                    }`}
                    style={{
                      background:
                        'linear-gradient(160deg, #FBF4EE 0%, #F4E7DA 55%, #F2DCE2 100%)',
                    }}
                  >
                    {/* 3D Inner Envelope Backing & Rising Letter Slip */}
                    <div
                      className="relative h-56 sm:h-64 rounded-2xl overflow-visible"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Back Wall Interior Lining */}
                      <div
                        className="absolute inset-0 rounded-2xl border border-[#E8D5C8]/80"
                        style={{
                          background:
                            'linear-gradient(180deg, #F4DDE3 0%, #F8EAE2 65%, #F3E9DD 100%)',
                          transform: 'translateZ(0px)',
                        }}
                      />

                      {/* Inner Letter Card Slip Rising Out of the Pocket in 3D */}
                      <div
                        className="envelope-card-insert absolute inset-x-4 sm:inset-x-6 top-5 bottom-4 rounded-xl bg-[#FFFDFB] border border-[#E8A2B5]/45 shadow-md px-5 py-4 flex flex-col justify-between pointer-events-none"
                        style={{
                          transform: isEnvelopeOpen
                            ? 'translate3d(0, -34px, 14px) scale(1)'
                            : 'translate3d(0, 12px, 2px) scale(0.95)',
                          opacity: isEnvelopeOpen ? 1 : 0.72,
                        }}
                      >
                        <div className="flex items-center justify-between text-[10px] text-[#C97A92] font-medium">
                          <span>{activeLetter.dateLabel}</span>
                          <span>{t.forRania}</span>
                        </div>
                        <p className="font-serif-editorial italic text-sm sm:text-base text-[#51434A] line-clamp-2 leading-relaxed">
                          “
                          {activeLetter.content.split('\n\n')[1] ||
                            activeLetter.content}
                          ”
                        </p>
                        <div className="h-px w-16 bg-[#E8A2B5]/60 mx-auto" />
                      </div>

                      {/* Left, Right & Bottom 3D Front Pocket Folds */}
                      <div
                        className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
                        style={{ transform: 'translateZ(18px)' }}
                      >
                        <svg
                          viewBox="0 0 600 260"
                          className="w-full h-full block"
                          preserveAspectRatio="none"
                        >
                          {/* Left fold */}
                          <polygon
                            points="0,0 305,135 0,260"
                            fill="#FBF4ED"
                            stroke="#E6D5C8"
                            strokeWidth="1.5"
                          />
                          {/* Right fold */}
                          <polygon
                            points="600,0 295,135 600,260"
                            fill="#F8EFE7"
                            stroke="#E6D5C8"
                            strokeWidth="1.5"
                          />
                          {/* Bottom pocket fold */}
                          <polygon
                            points="0,260 300,115 600,260"
                            fill="#FFF9F6"
                            stroke="#E4CFC2"
                            strokeWidth="1.5"
                          />
                        </svg>

                        {/* Envelope Front Pocket Label & Action Controls */}
                        <div className="absolute inset-x-0 bottom-0 px-5 pb-4 pt-10 text-center space-y-1.5 pointer-events-auto">
                          <p className="text-[11px] text-[#7D6B74]">
                            {isEnvelopeOpen
                              ? t.letters.envelopeOpenedCaption
                              : t.letters.envelopeSealedCaption}
                          </p>
                          <h3 className="font-serif-editorial text-lg sm:text-2xl text-[#51434A] leading-tight">
                            {activeLetter.occasion}
                          </h3>
                          <div className="pt-1 flex justify-center">
                            {!isEnvelopeOpen ? (
                              <button
                                type="button"
                                onClick={handleBreakSealAndOpen}
                                className="min-h-[40px] px-5 py-1.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                              >
                                <MailOpen className="w-3.5 h-3.5 text-[#E8A2B5]" />
                                <span>{t.letters.breakSealBtn}</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleResealEnvelope}
                                className="min-h-[38px] px-4 py-1.5 rounded-xl border border-[#EAE0D8] bg-white/95 text-xs font-medium text-[#7D6B74] hover:text-[#51434A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <Mail className="w-3.5 h-3.5 text-[#C97A92]" />
                                <span>{t.letters.resealEnvelopeBtn}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Top Hinged 3D Triangular Flap */}
                      <div
                        className={`envelope-flap absolute top-0 left-0 right-0 h-32 sm:h-36 ${
                          isEnvelopeOpen
                            ? 'envelope-flap-open z-10 pointer-events-none'
                            : 'z-30'
                        }`}
                        style={{
                          transform: isEnvelopeOpen
                            ? 'translateZ(2px) rotateX(174deg)'
                            : 'translateZ(20px) rotateX(0deg)',
                        }}
                      >
                        {/* Outer Sealed Flap Face */}
                        <div
                          onClick={!isEnvelopeOpen ? handleBreakSealAndOpen : undefined}
                          className={`envelope-flap-face absolute inset-0 ${
                            !isEnvelopeOpen ? 'cursor-pointer' : ''
                          }`}
                        >
                          <svg
                            viewBox="0 0 600 150"
                            className="w-full h-full block drop-shadow-sm"
                            preserveAspectRatio="none"
                          >
                            <polygon
                              points="0,0 600,0 300,142"
                              fill="#F6E2E8"
                              stroke="#E8A2B5"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>

                        {/* Inner Unfolded Blush Lining Face (visible when opened in 3D) */}
                        <div className="envelope-flap-inner absolute inset-0">
                          <svg
                            viewBox="0 0 600 150"
                            className="w-full h-full block"
                            preserveAspectRatio="none"
                          >
                            <polygon
                              points="0,0 600,0 300,142"
                              fill="#F4DDE3"
                              stroke="#E5C8D0"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Interactive Wax Seal Heart Centered on Flap Tip */}
                      <div
                        className={`envelope-seal absolute left-1/2 top-[102px] sm:top-[116px] z-40 flex flex-col items-center ${
                          isEnvelopeOpen ? 'opacity-0 pointer-events-none' : ''
                        }`}
                        style={{
                          transform: isEnvelopeOpen
                            ? 'translate3d(-50%, -20px, 24px) scale(0.76) rotateZ(-8deg)'
                            : 'translate3d(-50%, 0, 28px)',
                        }}
                      >
                        <button
                          type="button"
                          onClick={handleBreakSealAndOpen}
                          className="group p-2 rounded-full bg-white/95 border border-[#E8A2B5] shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                          aria-label={t.letters.breakSealBtn}
                        >
                          <WaxSealHeart className="w-11 h-11" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unfolded Stationery Letter Sheet (Reveals after 3D flap unfolds) */}
                {isLetterRevealed && (
                  <article
                    key={`${activeLetter.id}-revealed`}
                    className="rounded-[1.5rem] editorial-stationary rose-glass-sheen p-7 sm:p-11 space-y-7 envelope-letter-rise animate-page-enter"
                  >
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[#EAE0D8]">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-[#7D6B74]">
                        <span>{activeLetter.dateLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{t.forRania}</span>
                      </div>
                      <h2 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#51434A]">
                        {activeLetter.occasion}
                      </h2>
                      <p className="text-xs italic text-[#7D6B74]">
                        {activeLetter.subtitle}
                      </p>
                    </div>

                    {canManageContent && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditLetterModal(activeLetter)}
                          className="min-h-[42px] px-4 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#C97A92]" />
                          <span>{t.letters.editLetterBtn}</span>
                        </button>
                        <button
                          onClick={() => setLetterToDelete(activeLetter)}
                          className="min-h-[42px] min-w-[42px] rounded-xl border border-[#EAE0D8] text-xs text-[#7D6B74] hover:text-[#B91C1C] flex items-center justify-center cursor-pointer"
                          aria-label={t.common.delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 font-serif-editorial text-base sm:text-[19px] text-[#51434A] leading-[1.85] whitespace-pre-line">
                    {activeLetter.content}
                  </div>

                  <div className="pt-6 border-t border-[#EAE0D8]/70 flex items-center justify-between">
                    <BotanicalSprig className="w-28 h-6" />
                    <WaxSealHeart className="w-8 h-8" />
                  </div>
                  </article>
                )}
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* PART 2: Dedicated Callout for "Things I Love About You" Page */}
      <section className="rounded-3xl editorial-card editorial-card-interactive rose-glass-sheen p-7 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs text-[#C97A92] font-medium">
            <Heart className="w-4 h-4 fill-[#F4DDE3]" />
            <span>{t.thingsILovePage.badge}</span>
          </div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#51434A]">
            {t.thingsILovePage.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#7D6B74] leading-relaxed">
            {t.thingsILovePage.subtitle}
          </p>
        </div>

        <button
          onClick={onOpenThingsILove}
          className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#51434A] text-[#FFF9F6] text-xs sm:text-sm font-medium hover:bg-[#3E3238] transition-all flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>
            {t.letters.openThingsILoveBtn} ({thingsILoveCount})
          </span>
          <ArrowRight className="w-4 h-4 text-[#E8A2B5]" />
        </button>
      </section>

      {/* PART 3: Personal Audio Player for Voice Recordings */}
      <section className="rounded-3xl editorial-card rose-glass-sheen p-6 sm:p-9 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE0D8]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#7D6B74] mb-1">
              <Volume2 className="w-4 h-4 text-[#C97A92]" />
              <span>{t.letters.voiceBadge}</span>
            </div>
            <h2 className="font-serif-editorial text-2xl font-normal text-[#51434A]">
              {t.letters.voiceTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B74] mt-0.5">
              {t.letters.voiceSubtitle}
            </p>
          </div>

          {canManageContent && (
            <div className="flex flex-wrap items-center gap-2.5">
              <input
                ref={audioFileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioFileUpload}
                className="hidden"
              />
              <button
                onClick={() => audioFileInputRef.current?.click()}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-xs font-medium text-[#51434A] hover:bg-[#F3E9DD]/60 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#C97A92]" />
                <span>{t.letters.uploadAudioBtn}</span>
              </button>

              {!isRecordingMic ? (
                <button
                  onClick={handleStartMicRecording}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-[#E8A2B5]" />
                  <span>{t.letters.recordVoiceBtn}</span>
                </button>
              ) : (
                <button
                  onClick={handleStopMicRecording}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#B91C1C] text-white text-xs font-medium flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{t.letters.stopSaveRecordingBtn}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {recordingError && (
          <p className="text-xs text-[#B91C1C] bg-[#FEF2F2] p-3.5 rounded-xl border border-[#FECACA]">
            {recordingError}
          </p>
        )}

        {/* Edit Voice Recording Details Form */}
        {editingRec && (
          <form
            onSubmit={handleSaveVoiceEdit}
            className="rounded-2xl bg-[#FFF9F6] border border-[#E8A2B5] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif-editorial text-lg text-[#51434A]">
                {t.letters.editVoiceModalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setEditingRec(null)}
                className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#7D6B74]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#51434A] mb-1">
                  {t.letters.voiceTitleLabel}
                </label>
                <input
                  type="text"
                  value={recTitleDraft}
                  onChange={(e) => setRecTitleDraft(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#EAE0D8] bg-white text-sm text-[#51434A]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#51434A] mb-1">
                  {t.letters.voiceNoteLabel}
                </label>
                <input
                  type="text"
                  value={recNoteDraft}
                  onChange={(e) => setRecNoteDraft(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#EAE0D8] bg-white text-sm text-[#51434A]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingRec(null)}
                className="min-h-[38px] px-4 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#7D6B74] cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="min-h-[38px] px-4 py-1.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium cursor-pointer"
              >
                {t.letters.saveVoiceBtn}
              </button>
            </div>
          </form>
        )}

        <div className="divide-y divide-[#EAE0D8]">
          {localizedRecordings.map((rec) => {
            const isThisActive = activeRecId === rec.id;
            const isThisPlaying = isThisActive && isAudioPlaying;
            const progressPct =
              isThisActive && rec.durationSeconds > 0
                ? Math.min(
                    100,
                    Math.round((audioProgressSec / rec.durationSeconds) * 100)
                  )
                : 0;

            return (
              <div
                key={rec.id}
                className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={() => togglePlayPauseRecording(rec)}
                    className="min-h-[48px] min-w-[48px] rounded-2xl bg-[#F4DDE3]/80 hover:bg-[#E8A2B5]/50 text-[#51434A] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    aria-label={isThisPlaying ? 'Pause audio' : 'Play audio'}
                  >
                    {isThisPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#7D6B74]">
                      <span className="font-semibold text-[#51434A] text-sm">
                        {rec.title}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{rec.dateLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">
                        {isThisActive ? `${audioProgressSec}s / ` : ''}
                        {rec.durationSeconds}s
                      </span>
                      {isThisActive && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#C97A92] font-medium">
                            {isThisPlaying
                              ? t.letters.playingStatus
                              : t.letters.pausedStatus}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="w-full max-w-md h-1.5 rounded-full bg-[#F3E9DD] overflow-hidden">
                      <div
                        className="h-full bg-[#C97A92] transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <p className="text-xs text-[#7D6B74]">
                      {rec.transcriptNote}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {isThisActive && (
                    <button
                      onClick={stopAllAudio}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.letters.restartBtn}</span>
                    </button>
                  )}
                  {canManageContent && (
                    <button
                      onClick={() => openEditVoiceModal(rec)}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#C97A92]" />
                      <span>{t.common.edit}</span>
                    </button>
                  )}
                  {canManageContent && localizedRecordings.length > 1 && (
                    <button
                      onClick={() => setRecToDelete(rec)}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#7D6B74] hover:text-[#B91C1C] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.common.delete}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PART 4: Photo Memories Gallery */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#7D6B74] mb-1">
              <Camera className="w-4 h-4 text-[#C97A92]" />
              <span>{t.letters.memoriesBadge}</span>
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#51434A]">
              {t.letters.memoriesTitle}
            </h2>
          </div>

          {canManageContent && (
            <button
              onClick={openNewMemoryModal}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#E8A2B5]" />
              <span>{t.letters.addMemoryBtn}</span>
            </button>
          )}
        </div>

        {/* Add / Edit Memory Modal */}
        {isMemoryModalOpen && (
          <form
            onSubmit={handleSaveMemory}
            className="rounded-3xl editorial-stationary rose-glass-sheen border-[#E8A2B5] p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D8]">
              <h3 className="font-serif-editorial text-xl text-[#51434A]">
                {editingMemoryId
                  ? t.letters.memoryModalEditTitle
                  : t.letters.memoryModalNewTitle}
              </h3>
              <button
                type="button"
                onClick={() => setIsMemoryModalOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7D6B74]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#51434A] mb-1">
                  {t.letters.memoryTitleLabel}
                </label>
                <input
                  type="text"
                  value={memTitle}
                  onChange={(e) => setMemTitle(e.target.value)}
                  placeholder={t.letters.memoryTitlePlaceholder}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#51434A] mb-1">
                  {t.letters.memoryDateLabel}
                </label>
                <input
                  type="text"
                  value={memDateLabel}
                  onChange={(e) => setMemDateLabel(e.target.value)}
                  placeholder={t.letters.memoryDatePlaceholder}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#51434A] mb-1">
                  {t.letters.memoryLocationLabel}
                </label>
                <input
                  type="text"
                  value={memLocation}
                  onChange={(e) => setMemLocation(e.target.value)}
                  placeholder={t.letters.memoryLocationPlaceholder}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#51434A] mb-1">
                {t.letters.uploadPhotoLabel}
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUploadFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-xs font-medium text-[#51434A] flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4 text-[#C97A92]" />
                  <span>{t.letters.choosePhotoBtn}</span>
                </button>
                {memImageUrl && (
                  <span className="text-xs text-[#15803D]">
                    {t.letters.photoAttached}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#51434A] mb-1">
                {t.letters.storyCaptionLabel}
              </label>
              <textarea
                value={memCaption}
                onChange={(e) => setMemCaption(e.target.value)}
                rows={2}
                className="w-full p-3.5 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
                placeholder={t.letters.storyCaptionPlaceholder}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsMemoryModalOpen(false)}
                className="min-h-[42px] px-4 py-1.5 rounded-xl border border-[#EAE0D8] text-xs text-[#7D6B74]"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="min-h-[42px] px-5 py-1.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium"
              >
                {t.letters.saveMemoryBtn}
              </button>
            </div>
          </form>
        )}

        {/* Gallery Grid or Empty State */}
        {localizedMemories.length === 0 ? (
          <div className="rounded-3xl editorial-card rose-glass-sheen p-12 text-center space-y-4">
            <Camera className="w-8 h-8 text-[#C97A92] mx-auto" />
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-serif-editorial text-2xl text-[#51434A]">
                {t.letters.emptyMemoriesTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#7D6B74]">
                {t.letters.emptyMemoriesSubtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={openNewMemoryModal}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.letters.addMemoryBtn}</span>
              </button>
              <button
                onClick={() => {
                  onRestoreSampleMemories();
                  onNotify?.(t.toasts.memoriesRestored);
                }}
                className="min-h-[44px] px-5 py-2 rounded-xl border border-[#EAE0D8] text-xs font-medium text-[#51434A] hover:bg-[#FFF9F6] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.letters.restoreSamplePhotosBtn}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localizedMemories.map((mem) => (
              <Tilt3DCard
                key={mem.id}
                as="article"
                maxTiltDeg={6.5}
                scaleOnHover={1.016}
                className="rounded-3xl editorial-card editorial-card-interactive rose-glass-sheen p-3.5 flex flex-col justify-between group"
              >
                <div>
                  <button
                    onClick={() => setLightboxMemory(mem)}
                    className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-[#FFF9F6] block cursor-pointer"
                  >
                    <ResilientImage
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      fallbackTitle={mem.title}
                    />
                  </button>

                  <div className="p-3.5 pt-4 space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#7D6B74]">
                      <span>{mem.locationLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{mem.dateLabel}</span>
                    </div>
                    <h3 className="font-serif-editorial text-xl font-normal text-[#51434A]">
                      {mem.title}
                    </h3>
                    <p className="text-xs text-[#7D6B74] leading-relaxed">
                      {mem.caption}
                    </p>
                  </div>
                </div>

                {canManageContent && (
                  <div className="px-3.5 py-3 border-t border-[#EAE0D8]/70 flex items-center justify-between text-xs">
                    <button
                      onClick={() => openEditMemoryModal(mem)}
                      className="min-h-[38px] px-2 text-[#51434A] hover:text-[#C97A92] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t.common.edit}</span>
                    </button>
                    <button
                      onClick={() => setMemoryToDelete(mem)}
                      className="min-h-[38px] px-2 text-[#7D6B74] hover:text-[#B91C1C] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.common.remove}</span>
                    </button>
                  </div>
                )}
              </Tilt3DCard>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxMemory && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#51434A]/60 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative max-w-2xl w-full rounded-3xl editorial-stationary overflow-hidden p-3 sm:p-4">
              <button
                onClick={() => setLightboxMemory(null)}
                className="absolute top-6 right-6 z-10 min-h-[44px] min-w-[44px] rounded-full bg-white/95 text-[#51434A] flex items-center justify-center shadow-xs"
                aria-label={t.common.close}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-[#FFF9F6]">
                <ResilientImage
                  src={lightboxMemory.imageUrl}
                  alt={lightboxMemory.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 sm:p-6 space-y-2">
                <div className="text-xs text-[#7D6B74]">
                  {lightboxMemory.locationLabel} · {lightboxMemory.dateLabel}
                </div>
                <h3 className="font-serif-editorial text-2xl text-[#51434A]">
                  {lightboxMemory.title}
                </h3>
                <p className="text-sm text-[#7D6B74] leading-relaxed">
                  {lightboxMemory.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Delete Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={!!letterToDelete}
        title={t.letters.deleteLetterModalTitle}
        message={t.letters.deleteLetterModalMsg(letterToDelete?.occasion || '')}
        confirmLabel={t.letters.deleteLetterConfirmBtn}
        cancelLabel={t.common.cancel}
        onCancel={() => setLetterToDelete(null)}
        onConfirm={() => {
          if (letterToDelete) {
            onDeleteLetter(letterToDelete.id);
            onNotify?.(t.toasts.letterDeleted);
            setLetterToDelete(null);
          }
        }}
      />

      <ConfirmDialog
        isOpen={!!recToDelete}
        title={t.letters.deleteVoiceModalTitle}
        message={t.letters.deleteVoiceModalMsg(recToDelete?.title || '')}
        confirmLabel={t.letters.deleteVoiceConfirmBtn}
        cancelLabel={t.common.cancel}
        onCancel={() => setRecToDelete(null)}
        onConfirm={() => {
          if (recToDelete) {
            if (activeRecId === recToDelete.id) stopAllAudio();
            onDeleteVoiceRecording(recToDelete.id);
            onNotify?.(t.toasts.voiceDeleted);
            setRecToDelete(null);
          }
        }}
      />

      <ConfirmDialog
        isOpen={!!memoryToDelete}
        title={t.letters.deleteMemoryModalTitle}
        message={t.letters.deleteMemoryModalMsg(memoryToDelete?.title || '')}
        confirmLabel={t.letters.deleteMemoryConfirmBtn}
        cancelLabel={t.common.cancel}
        onCancel={() => setMemoryToDelete(null)}
        onConfirm={() => {
          if (memoryToDelete) {
            onDeleteMemory(memoryToDelete.id);
            onNotify?.(t.toasts.memoryDeleted);
            setMemoryToDelete(null);
          }
        }}
      />
    </div>
  );
};

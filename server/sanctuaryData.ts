import type {
  AppSettings,
  CardioFlashcard,
  CardioQuizQuestion,
  EcgWaveNote,
  JournalEntry,
  LovedQualityItem,
  LoveMessageItem,
  MemoryPhoto,
  OpenWhenLetter,
  StudyTopic,
  VoiceRecording,
} from '../src/types/index.ts';

const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export interface SanctuaryStatePayload {
  settings: AppSettings;
  studyTopics: StudyTopic[];
  flashcards: CardioFlashcard[];
  quizQuestions: CardioQuizQuestion[];
  ecgNotes: EcgWaveNote[];
  letters: OpenWhenLetter[];
  voiceRecordings: VoiceRecording[];
  memories: MemoryPhoto[];
  journalEntries: JournalEntry[];
  loveMessages: LoveMessageItem[];
  thingsILove: LovedQualityItem[];
}

export const SERVER_INITIAL_SETTINGS: AppSettings = {
  recipientName: 'Rania',
  language: 'en',
  dailyAffirmation:
    'I am learning at my own pace, building wisdom one gentle page at a time, and I am deeply loved exactly as I am today.',
  dailyRestReminder:
    'Remember to unclench your shoulders, sip some warm water, and give your eyes a quiet pause away from your notes.',
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  soundEnabled: true,
  completedPomodoroSessions: 0,
  hydrationCountToday: 2,
};

export const SERVER_INITIAL_STUDY_TOPICS: StudyTopic[] = [
  {
    id: 'st-1',
    title: 'Réviser les phases du cycle cardiaque et le diagramme de Wiggers',
    module: 'Physiologie cardiaque',
    priority: 'High',
    dueDate: getRelativeDate(0),
    completed: false,
    notes:
      'Exemple pédagogique — vérifier les courbes pression-volume ventriculaires gauche avec le polycopié de physiologie.',
    isSample: true,
  },
  {
    id: 'st-2',
    title: 'Pratiquer la lecture systématique de l’ECG (fréquence, rythme, axe QRS)',
    module: 'Électrocardiogramme (ECG)',
    priority: 'High',
    dueDate: getRelativeDate(0),
    completed: true,
    notes:
      'Exemple pédagogique — revoir le calcul de l’axe électrique dans le plan frontal avec DI et aVF.',
    isSample: true,
  },
  {
    id: 'st-3',
    title: 'Synthétiser les foyers d’auscultation cardiaque et les irradiations des souffles',
    module: 'Valvulopathies',
    priority: 'Medium',
    dueDate: getRelativeDate(0),
    completed: false,
    notes:
      'Exemple pédagogique — préparer la fiche de sémiologie clinique pour le stage hospitalier.',
    isSample: true,
  },
  {
    id: 'st-4',
    title: 'Revoir les mécanismes du SRAA et les classes d’antihypertenseurs',
    module: 'Hypertension artérielle',
    priority: 'Medium',
    dueDate: getRelativeDate(1),
    completed: false,
    notes:
      'Exemple pédagogique — schématiser les cibles pharmacologiques (IEC, ARA2, inhibiteurs calciques, diurétiques thiazidiques).',
    isSample: true,
  },
  {
    id: 'st-5',
    title: 'Révision douce de la sémiologie de l’insuffisance cardiaque gauche et droite',
    module: 'Insuffisance cardiaque',
    priority: 'Gentle',
    dueDate: getRelativeDate(2),
    completed: false,
    notes:
      'Exemple pédagogique — comparer signes fonctionnels et signes physiques droits/gauches.',
    isSample: true,
  },
  {
    id: 'st-6',
    title: 'Différencier fibrillation atriale, flutter atrial et BAV sur tracés schématiques',
    module: 'Troubles du rythme',
    priority: 'Gentle',
    dueDate: getRelativeDate(3),
    completed: false,
    notes: 'Exemple pédagogique — préparer l’enseignement dirigé de rythmologie.',
    isSample: true,
  },
];

export const SERVER_INITIAL_FLASHCARDS: CardioFlashcard[] = [
  {
    id: 'fc-1',
    category: 'Physiologie cardiaque',
    question:
      'Qu’énonce la loi de Frank-Starling concernant la mécanique ventriculaire ?',
    answer:
      'La loi de Frank-Starling décrit la propriété intrinsèque du myocarde selon laquelle une augmentation du volume télédiastolique ventriculaire (précharge / étirement initial des sarcomères) entraîne une augmentation de la force de contraction ventriculaire et donc du volume d’éjection systolique (VES), dans les limites physiologiques.',
    lectureRef:
      'Référence : Physiologie Cardiovasculaire (DFGSM2/DFGSM3) · Chapitre Hémodynamique & Loi de Starling',
    mastered: true,
    reviewStatus: 'understood',
    lastReviewedDate: getRelativeDate(0),
    isSample: true,
  },
  {
    id: 'fc-2',
    category: 'Physiologie cardiaque',
    question:
      'À quels événements mécaniques valvulaires correspondent les bruits physiologiques du cœur B1 et B2 à l’auscultation ?',
    answer:
      '• B1 (premier bruit) correspond à la fermeture des valves atrio-ventriculaires (mitrale et tricuspide) au début de la contraction isovolumétrique (début de la systole ventriculaire).\n• B2 (deuxième bruit) correspond à la fermeture des valves sigmoïdes (aortique et pulmonaire) à la fin de l’éjection ventriculaire (début de la relaxation isovolumétrique / diastole).',
    lectureRef:
      'Référence : Sémiologie Cardiovasculaire · Collège National des Enseignants de Cardiologie (CNEC)',
    mastered: false,
    reviewStatus: 'needs_revision',
    lastReviewedDate: getRelativeDate(-1),
    isSample: true,
  },
  {
    id: 'fc-3',
    category: 'Électrocardiogramme (ECG)',
    question:
      'Quelle est la signification électrophysiologique respective de l’onde P, de l’intervalle PR, du complexe QRS et de l’onde T sur un ECG de surface ?',
    answer:
      '• Onde P : dépolarisation des atriums droit et gauche à partir du nœud sinusal.\n• Intervalle PR (0,12 à 0,20 s) : temps de conduction atrio-ventriculaire (dépolarisation atriale + délai nodal AV + conduction hissienne).\n• Complexe QRS (< 0,12 s) : dépolarisation rapide des ventricules droit et gauche.\n• Onde T : repolarisation ventriculaire.',
    lectureRef:
      'Référence : Électrocardiographie normale · Référentiel CNEC (3e année de médecine)',
    mastered: true,
    reviewStatus: 'understood',
    lastReviewedDate: getRelativeDate(0),
    isSample: true,
  },
  {
    id: 'fc-4',
    category: 'Électrocardiogramme (ECG)',
    question:
      'Sur un papier ECG standard défilant à 25 mm/s avec un étalonnage de 10 mm/mV, que représentent 1 petit carreau (1 mm) et 1 grand carreau (5 mm) en durée et en amplitude ?',
    answer:
      '• En abscisse (temps à 25 mm/s) : 1 petit carreau (1 mm) = 0,04 s (40 ms) ; 1 grand carreau (5 mm) = 0,20 s (200 ms) ; 5 grands carreaux = 1 seconde.\n• En ordonnée (amplitude à 10 mm/mV) : 1 petit carreau (1 mm) = 0,1 mV ; 10 mm = 1 mV.',
    lectureRef:
      'Référence : Lecture systématique de l’ECG · Sémiologie Cardiovasculaire DFGSM3',
    mastered: true,
    reviewStatus: 'understood',
    lastReviewedDate: getRelativeDate(-2),
    isSample: true,
  },
  {
    id: 'fc-5',
    category: 'Troubles du rythme',
    question:
      'Quels sont les critères électrocardiographiques cardinaux permettant d’identifier une fibrillation atriale (FA) ?',
    answer:
      '1. Absence d’ondes P sinusales organisées sur l’ensemble des dérivations.\n2. Trémulation irrégulière de la ligne isoélectrique (ondes f rapides à 400–600/min, de morphologie et d’amplitude variables).\n3. Rythme ventriculaire totalement irrégulier (intervalles R-R irréguliers, « arythmie complète »), à QRS généralement fins en l’absence de trouble conductif intraventriculaire.',
    lectureRef:
      'Référence : Fibrillation atriale — Sémiologie ECG · Référentiel CNEC / ESC',
    mastered: false,
    reviewStatus: 'needs_revision',
    lastReviewedDate: getRelativeDate(0),
    isSample: true,
  },
  {
    id: 'fc-6',
    category: 'Troubles du rythme',
    question:
      'Comment distingue-t-on électrocardiographiquement les blocs atrio-ventriculaires (BAV) du 1er, 2e (Mobitz I vs II) et 3e degré ?',
    answer:
      '• BAV I : allongement constant de l’intervalle PR > 0,20 s (200 ms), sans aucune onde P bloquée.\n• BAV II Mobitz 1 (Luciani-Wenckebach) : allongement progressif du PR jusqu’à une onde P bloquée.\n• BAV II Mobitz 2 : blocage inopiné d’une onde P avec un intervalle PR constant sur les complexes conduits.\n• BAV III (complet) : dissociation atrio-ventriculaire complète (aucune onde P n’est conduite, rythme d’échappement régulier lent).',
    lectureRef:
      'Référence : Troubles de la conduction intracardiaque · Référentiel CNEC',
    mastered: false,
    reviewStatus: 'unseen',
    isSample: true,
  },
  {
    id: 'fc-7',
    category: 'Insuffisance cardiaque',
    question:
      'Quels sont les principaux signes cliniques distinguant l’insuffisance cardiaque gauche de l’insuffisance cardiaque droite en sémiologie ?',
    answer:
      '• Insuffisance cardiaque gauche (stase pulmonaire en amont du VG) : dyspnée d’effort, orthopnée, dyspnée paroxystique nocturne, râles crépitants bilatéraux aux bases pulmonaires, galop B3.\n• Insuffisance cardiaque droite (stase veineuse systémique en amont du VD) : turgescence jugulaire, reflux hépato-jugulaire, hépatomégalie douloureuse (hépatalgie d’effort), œdèmes des membres inférieurs déclives, blancs, mous et prenant le godet.',
    lectureRef:
      'Référence : Sémiologie de l’insuffisance cardiaque · Collège National des Enseignants de Cardiologie',
    mastered: true,
    reviewStatus: 'understood',
    lastReviewedDate: getRelativeDate(-1),
    isSample: true,
  },
  {
    id: 'fc-8',
    category: 'Valvulopathies',
    question:
      'Quelle est la chronologie auscultatoire (systolique vs diastolique) des 4 principales valvulopathies gauches (RA, IM, IA, RM) ?',
    answer:
      '• Souffles systoliques : Rétrécissement aortique (RA : souffle mésosystolique éjectionnel irradiant aux carotides) et Insuffisance mitrale (IM : souffle holosystolique de régurgitation en jet de vapeur à l’apex irradiant vers l’aisselle).\n• Souffles diastoliques : Insuffisance aortique (IA : souffle protodiastolique doux, humé, aspiratif le long du bord gauche du sternum) et Rétrécissement mitral (RM : roulement diastolique apexien avec éclat de B1).',
    lectureRef:
      'Référence : Sémiologie auscultatoire des valvulopathies · Référentiel CNEC',
    mastered: false,
    reviewStatus: 'needs_revision',
    lastReviewedDate: getRelativeDate(0),
    isSample: true,
  },
  {
    id: 'fc-9',
    category: 'Hypertension artérielle',
    question:
      'Quels sont les principaux systèmes physiologiques impliqués dans la régulation à court terme et à long terme de la pression artérielle systémique ?',
    answer:
      '• Court terme (secondes à minutes) : baroréflexe artériel (barorécepteurs du sinus carotidien et de la crosse aortique) modulant le système nerveux autonome sympathique et parasympathique.\n• Moyen et long terme (heures à jours) : régulation rénale de la volémie (natriurèse de pression), système rénine-angiotensine-aldostérone (SRAA) et peptides natriurétiques (ANP, BNP).',
    lectureRef:
      'Référence : Physiopathologie de l’hypertension artérielle · Physiologie & Pharmacologie Cardiovasculaire',
    mastered: true,
    reviewStatus: 'understood',
    lastReviewedDate: getRelativeDate(-3),
    isSample: true,
  },
];

export const SERVER_INITIAL_QUIZ_QUESTIONS: CardioQuizQuestion[] = [
  {
    id: 'qz-1',
    category: 'Physiologie cardiaque',
    question:
      'Dans la séquence normale d’activation électrique du cœur, quelle structure anatomique constitue le stimulateur (pacemaker) physiologique principal ?',
    options: [
      'Le nœud sino-atrial (nœud de Keith et Flack)',
      'Le nœud atrio-ventriculaire (nœud d’Aschoff-Tawara)',
      'Le tronc du faisceau de His',
      'Le réseau sous-endocardique de Purkinje',
    ],
    correctIndex: 0,
    correctIndices: [0],
    isMultipleChoice: false,
    explanation:
      'Correction pédagogique : Le nœud sino-atrial (situé dans la paroi supérieure de l’atrium droit près de l’abouchement de la veine cave supérieure) possède la pente de dépolarisation diastolique spontanée (phase 4) la plus rapide, ce qui en fait le pacemaker physiologique dominant du cœur.',
    lectureRef:
      'Référence : Automatisme cardiaque & Électrophysiologie · Cours de Physiologie DFGSM3',
    isSample: true,
  },
  {
    id: 'qz-2',
    category: 'Physiologie cardiaque',
    question:
      '[QCM à réponses multiples] Parmi les facteurs suivants, lesquels sont les trois déterminants directs du volume d’éjection systolique (VES) ventriculaire ?',
    options: [
      'La précharge ventriculaire (étirement télédiastolique)',
      'La postcharge ventriculaire (obstacles à l’éjection systolique)',
      'L’inotropisme (contractilité intrinsèque du myocarde)',
      'La vitesse de sédimentation globulaire',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
    isMultipleChoice: true,
    explanation:
      'Correction pédagogique : Le volume d’éjection systolique (VES) dépend directement de trois déterminants mécaniques : la précharge (loi de Frank-Starling), la postcharge (résistance à l’éjection) et l’inotropisme (contractilité myocardique, modulée notamment par le système sympathique). Le débit cardiaque est le produit de la fréquence cardiaque par le VES (DC = FC × VES).',
    lectureRef:
      'Référence : Hémodynamique cardiaque · Physiologie Cardiovasculaire DFGSM2/DFGSM3',
    isSample: true,
  },
  {
    id: 'qz-3',
    category: 'Électrocardiogramme (ECG)',
    question:
      'Sur un tracé ECG enregistré à la vitesse standard de 25 mm/s, quelle est la durée physiologique normale de l’intervalle PR chez l’adulte ?',
    options: [
      '0,04 à 0,08 seconde (1 à 2 petits carreaux)',
      '0,12 à 0,20 seconde (3 à 5 petits carreaux)',
      '0,24 à 0,32 seconde (6 à 8 petits carreaux)',
      '0,40 à 0,60 seconde (2 à 3 grands carreaux)',
    ],
    correctIndex: 1,
    correctIndices: [1],
    isMultipleChoice: false,
    explanation:
      'Correction pédagogique : L’intervalle PR normal chez l’adulte est compris entre 0,12 s (120 ms, soit 3 petits carreaux) et 0,20 s (200 ms, soit 5 petits carreaux / 1 grand carreau). Un PR < 0,12 s évoque une pré-excitation, et un PR > 0,20 s définit un bloc atrio-ventriculaire du 1er degré (BAV I).',
    lectureRef:
      'Référence : Électrocardiogramme normal · Référentiel CNEC',
    isSample: true,
  },
  {
    id: 'qz-4',
    category: 'Troubles du rythme',
    question:
      '[QCM à réponses multiples] Quelles caractéristiques électrocardiographiques sont typiquement observées lors d’une fibrillation atriale (FA) ?',
    options: [
      'Disparition des ondes P sinusales organisées',
      'Intervalles R-R totalement irréguliers',
      'Trémulation de la ligne de base par des ondes f rapides et irrégulières',
      'Allongement fixe et régulier de l’intervalle PR devant chaque QRS',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
    isMultipleChoice: true,
    explanation:
      'Correction pédagogique : La fibrillation atriale associe l’absence d’onde P sinusale, une activité atriale désorganisée (ondes f de fibrillation) et une irrégularité complète des intervalles R-R. Il n’y a plus d’intervalle PR mesurable puisque les ondes P sinusales ont disparu.',
    lectureRef:
      'Référence : Fibrillation atriale · Collège National des Enseignants de Cardiologie (CNEC)',
    isSample: true,
  },
  {
    id: 'qz-5',
    category: 'Insuffisance cardiaque',
    question:
      '[QCM à réponses multiples] Parmi les signes sémiologiques suivants, lesquels relèvent spécifiquement d’une insuffisance cardiaque droite ?',
    options: [
      'Turgescence spontanée des veines jugulaires externes',
      'Reflux hépato-jugulaire positif',
      'Œdèmes des membres inférieurs déclives, bilatéraux et prenant le godet',
      'Râles crépitants inspiratoires des bases pulmonaires',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
    isMultipleChoice: true,
    explanation:
      'Correction pédagogique : La turgescence jugulaire, le reflux hépato-jugulaire et les œdèmes déclives des membres inférieurs traduisent l’hyperpression veineuse systémique en amont du ventricule droit (insuffisance cardiaque droite). Les râles crépitants pulmonaires traduisent quant à eux une stase capillaire pulmonaire en amont du ventricule gauche (insuffisance cardiaque gauche).',
    lectureRef:
      'Référence : Sémiologie de l’insuffisance cardiaque · Référentiel CNEC',
    isSample: true,
  },
  {
    id: 'qz-6',
    category: 'Valvulopathies',
    question:
      'À quelle anomalie auscultatoire correspond classiquement un souffle mésosystolique éjectionnel, rude, râpeux, maximal au foyer aortique et irradiant vers les vaisseaux du cou (carotides) ?',
    options: [
      'Rétrécissement aortique (sténose aortique)',
      'Insuffisance mitrale',
      'Insuffisance aortique',
      'Rétrécissement mitral',
    ],
    correctIndex: 0,
    correctIndices: [0],
    isMultipleChoice: false,
    explanation:
      'Correction pédagogique : Le souffle du rétrécissement aortique (RA) est un souffle systolique d’éjection (mésosystolique, losangique), de timbre rude et râpeux, maximal au foyer aortique (2e espace intercostal droit) et irradiant de façon caractéristique vers les artères carotides.',
    lectureRef:
      'Référence : Valvulopathies acquises — Sémiologie auscultatoire · Référentiel CNEC',
    isSample: true,
  },
  {
    id: 'qz-7',
    category: 'Hypertension artérielle',
    question:
      'Dans le système rénine-angiotensine-aldostérone (SRAA), quelle enzyme catalyse la conversion de l’angiotensine I en angiotensine II ?',
    options: [
      'La rénine',
      'L’enzyme de conversion de l’angiotensine (ECA)',
      'L’aldostérone synthase',
      'L’anhydrase carbonique',
    ],
    correctIndex: 1,
    correctIndices: [1],
    isMultipleChoice: false,
    explanation:
      'Correction pédagogique : La rénine (sécrétée par l’appareil juxtaglomérulaire rénal) clive l’angiotensinogène hépatique en angiotensine I (décapeptide inactif). L’enzyme de conversion de l’angiotensine (ECA), située principalement à la surface de l’endothélium pulmonaire et vasculaire, convertit ensuite l’angiotensine I en angiotensine II (octapeptide vasoconstricteur et stimulant la sécrétion d’aldostérone).',
    lectureRef:
      'Référence : Physiopathologie et Pharmacologie du SRAA · Cours d’Hypertension Artérielle DFGSM3',
    isSample: true,
  },
];

export const SERVER_INITIAL_ECG_NOTES: EcgWaveNote[] = [
  {
    id: 'P',
    label: 'Onde P',
    title: 'Dépolarisation Atriale',
    educationalConcept:
      'Schéma pédagogique : Représente l’onde de dépolarisation électrique naissant du nœud sino-atrial et se propageant dans les atriums droit puis gauche (durée physiologique < 0,12 s).',
    personalNote:
      'Note de cours : En rythme sinusal normal, l’onde P est toujours positive en DI, DII et aVF, et négative en aVR.',
  },
  {
    id: 'PR',
    label: 'Intervalle PR',
    title: 'Temps de Conduction Atrio-Ventriculaire',
    educationalConcept:
      'Schéma pédagogique : Mesuré du début de l’onde P au début du complexe QRS (0,12 à 0,20 s, soit 3 à 5 petits carreaux à 25 mm/s). Reflète la dépolarisation atriale et le ralentissement physiologique dans le nœud AV.',
    personalNote:
      'Note de cours : PR > 0,20 s (> 200 ms) = Bloc atrio-ventriculaire (BAV) de 1er degré ; PR < 0,12 s = syndrome de pré-excitation.',
  },
  {
    id: 'QRS',
    label: 'Complexe QRS',
    title: 'Dépolarisation Ventriculaire',
    educationalConcept:
      'Schéma pédagogique : Correspond à l’activation électrique rapide du myocarde ventriculaire droit et gauche via le faisceau de His, ses branches et le réseau de Purkinje (durée normale < 0,12 s, soit < 3 petits carreaux).',
    personalNote:
      'Note de cours : Un QRS élargi (≥ 0,12 s) oriente vers un bloc de branche (droit ou gauche) ou une origine ventriculaire (ex. ESV).',
  },
  {
    id: 'ST',
    label: 'Segment ST',
    title: 'Phase Isoélectrique Ventriculaire',
    educationalConcept:
      'Schéma pédagogique : Segment compris entre la fin du complexe QRS (point J) et le début de l’onde T. Il est normalement isoélectrique (aligné sur la ligne de base PQ/TP) et correspond à la phase de plateau (phase 2) du potentiel d’action ventriculaire.',
    personalNote:
      'Note de cours : Toujours analyser la position du point J par rapport à la ligne isoélectrique sur au moins deux dérivations contiguës.',
  },
  {
    id: 'T',
    label: 'Onde T',
    title: 'Repolarisation Ventriculaire',
    educationalConcept:
      'Schéma pédagogique : Reflète la repolarisation électrique des ventricules. L’onde T normale est asymétrique (pente ascendante lente, pente descendante plus rapide) et généralement concordante avec la polarité du QRS.',
    personalNote:
      'Note de cours : L’onde T est physiologiquement négative en aVR (et parfois en V1).',
  },
];

export const SERVER_INITIAL_OPEN_WHEN_LETTERS: OpenWhenLetter[] = [
  {
    id: 'ow-stressed',
    occasion: 'Open when you feel stressed',
    subtitle: 'For the evenings when the syllabus feels heavier than usual',
    dateLabel: 'Private Letter · For Rania',
    content:
      'My dearest Rania,\n\nIf you are opening this right now, I want you to pause, close your textbook for just two minutes, and unclench your hands. Third-year medicine asks so much of your mind and heart, and it is completely okay to feel overwhelmed sometimes.\n\nYou do not have to memorize the entire hospital tonight. One lecture, one concept, one quiet breath at a time is more than enough. Make yourself a warm cup of tea, rest your eyes, and remember that your worth is never measured by a single study session. I am always in your corner.\n\nWith all my love,\nAbd Eldjalil ♡',
    isSample: true,
  },
  {
    id: 'ow-miss',
    occasion: 'Open when you miss me',
    subtitle: 'For the quiet miles between us',
    dateLabel: 'Private Letter · For Rania',
    content:
      'My sweet Rania,\n\nDistance is strange—some days it feels like just a timezone on a screen, and other days I wish more than anything I could just sit across from you at a quiet café while you highlight your cardiology notes.\n\nWhenever the distance feels heavy, remember that every single day brings us one day closer to our next hello. Look up at the sky tonight; we are under the exact same moon, and my heart is right there beside you.\n\nCounting down the days,\nAbd Eldjalil ♡',
    isSample: true,
  },
  {
    id: 'ow-encouragement',
    occasion: 'Open when you need encouragement',
    subtitle: 'When self-doubt whispers louder than the truth',
    dateLabel: 'Private Letter · For Rania',
    content:
      'Dearest Rania,\n\nLet me remind you of who you are: you are compassionate, resilient, deeply thoughtful, and going to be an extraordinary physician. Think of how far you have already come since your very first day of medical school—things that once felt impossible are now second nature to you.\n\nBe as kind and patient with yourself today as you are with everyone around you. You have everything it takes inside you.\n\nSo endlessly proud of you,\nAbd Eldjalil ♡',
    isSample: true,
  },
  {
    id: 'ow-exam',
    occasion: 'Open when you pass an exam',
    subtitle: 'To celebrate every late night and quiet victory',
    dateLabel: 'Private Letter · For Rania',
    content:
      'My brilliant Rania,\n\nYOU DID IT! I knew you would, because I see how much heart, discipline, and quiet dedication you pour into your studies even when nobody is watching.\n\nTonight, no flashcards, no study planners, and no alarms. Go celebrate, eat your favorite treat, and let yourself feel proud of what you earned. I cannot wait to celebrate with you properly!\n\nCheering the loudest for you,\nAbd Eldjalil ♡',
    isSample: true,
  },
  {
    id: 'ow-hug',
    occasion: 'Open when you need a hug',
    subtitle: 'A warm embrace wrapped in words',
    dateLabel: 'Private Letter · For Rania',
    content:
      'My love,\n\nClose your eyes for a second and imagine me wrapping my arms around you tightly, resting my chin on your shoulder, and telling you that everything is going to be alright.\n\nYou are safe, you are cherished, and you never have to carry the weight of the world alone. Wrap yourself in your softest blanket tonight and consider it a warm hug from me until I can hold you in person.\n\nHolding you close in my heart,\nAbd Eldjalil ♡',
    isSample: true,
  },
  {
    id: 'ow-tired',
    occasion: 'Open when you are exhausted after hospital rounds',
    subtitle: 'When your feet ache and your energy is spent',
    dateLabel: 'Private Letter · For Rania',
    content:
      'My dearest future doctor,\n\nStanding on your feet for hours, listening to patients, taking histories, and absorbing clinical knowledge takes immense physical and emotional strength. If all you have the energy to do tonight is take off your coat, drink some water, and rest—please do exactly that without an ounce of guilt.\n\nEven on the days when you feel too tired to read another page, you were already becoming a doctor today just by showing up with empathy. Rest deeply tonight, my love.\n\nAlways taking care of you,\nAbd Eldjalil ♡',
    isSample: true,
  },
  {
    id: 'ow-doubt',
    occasion: 'Open when you feel like you are falling behind',
    subtitle: 'A gentle reminder that your pace is enough',
    dateLabel: 'Private Letter · For Rania',
    content:
      'My sweet Rania,\n\nMedicine has a way of making even the brightest students feel like everyone else knows more. Please do not compare your quiet chapter-by-chapter progress with anyone else’s highlight reel.\n\nTrue understanding grows steadily and gently. Every single concept you review—even the ones you have to read three times—is building a foundation that will one day comfort and heal real people. Trust your pace.\n\nBelieving in you always,\nAbd Eldjalil ♡',
    isSample: true,
  },
  {
    id: 'ow-late-night',
    occasion: 'Open when you are studying late at night',
    subtitle: 'Company for the quiet hours at your desk',
    dateLabel: 'Private Letter · For Rania',
    content:
      'Hello my love,\n\nIt is late, the house is quiet, and your desk lamp is still on. I just wanted to leave this little note here so you know you are not alone in the quiet hours.\n\nFinish the paragraph you are on, take a sip of water, and promise me you will get some real sleep soon. Your mind remembers so much better when it is rested—and I love you far too much to let you burn out.\n\nGoodnight and sweet dreams,\nAbd Eldjalil ♡',
    isSample: true,
  },
  {
    id: 'ow-smile',
    occasion: 'Open when you just want a quiet smile',
    subtitle: 'No occasion needed—just because I adore you',
    dateLabel: 'Private Letter · For Rania',
    content:
      'Dearest Rania,\n\nDid you know that just thinking about your laugh—and the way you get excited when a complicated medical mechanism finally clicks—genuinely brightens my entire day?\n\nYou bring so much grace, warmth, and beauty into my life effortlessly. Whatever you are doing right this second, I hope a soft smile finds its way to your face knowing how deeply loved you are.\n\nYours, today and always,\nAbd Eldjalil ♡',
    isSample: true,
  },
  {
    id: 'ow-future',
    occasion: 'Open when you think about our future',
    subtitle: 'For all the ordinary mornings waiting for us',
    dateLabel: 'Private Letter · For Rania',
    content:
      'My dearest Rania,\n\nOne day soon, all of these long-distance calls, countdowns, and heavy exam seasons will be a chapter we look back on together over morning coffee.\n\nI look forward to the simplest things with you: unhurried walks, listening to how your day at the hospital went, cooking dinner together, and building a peaceful home filled with warmth. Every mile and every busy week is worth it because it leads to us.\n\nWith all my heart,\nAbd Eldjalil ♡',
    isSample: true,
  },
];

export const SERVER_INITIAL_LOVE_MESSAGES: LoveMessageItem[] = [
  {
    id: 'lm-1',
    text: 'Your effort matters, even when nobody sees it.',
    contextNote: 'For the quiet hours at your desk',
    isSample: true,
  },
  {
    id: 'lm-2',
    text: 'Take a little break, future doctor. The world can wait a few minutes.',
    contextNote: 'A gentle permission slip to rest',
    isSample: true,
  },
  {
    id: 'lm-3',
    text: 'I am proud of you, Rania.',
    contextNote: 'Always and unconditionally',
    isSample: true,
  },
  {
    id: 'lm-4',
    text: 'You deserve love on your productive days and on your difficult days.',
    contextNote: 'Your worth is never tied to a checklist',
    isSample: true,
  },
  {
    id: 'lm-5',
    text: 'You are more than your grades.',
    contextNote: 'A truth to keep close to your heart',
    isSample: true,
  },
  {
    id: 'lm-6',
    text: 'The kindness and patience you bring into the world will make you an extraordinary physician.',
    contextNote: 'For your clinical journey',
    isSample: true,
  },
  {
    id: 'lm-7',
    text: 'Even across the distance, I am cheering for you in every lecture and every quiet evening.',
    contextNote: 'Across every mile between us',
    isSample: true,
  },
];

export const SERVER_INITIAL_THINGS_I_LOVE: LovedQualityItem[] = [
  {
    id: 'til-1',
    title: 'Your quiet, unwavering dedication',
    category: 'Your Spirit',
    detail:
      'The way you show up for your studies and clinical rotations even on days when you are tired—not for applause, but because you genuinely care about becoming a thoughtful doctor.',
    isSample: true,
  },
  {
    id: 'til-2',
    title: 'The tenderness of your heart',
    category: 'Your Heart',
    detail:
      'You notice when people around you need comfort, and you listen with a gentleness that makes everyone feel safe and understood.',
    isSample: true,
  },
  {
    id: 'til-3',
    title: 'The way your eyes light up when a concept clicks',
    category: 'Little Details',
    detail:
      'Whether it is a tricky cardiology tracing or a small detail in a book, the spark of curiosity and joy in your voice is one of my favorite things in the world.',
    isSample: true,
  },
  {
    id: 'til-4',
    title: 'Your grace under pressure',
    category: 'Your Strength',
    detail:
      'Third-year medicine is demanding, yet you carry yourself with dignity, humility, and a quiet resilience that inspires me every single day.',
    isSample: true,
  },
  {
    id: 'til-5',
    title: 'How warm and effortless it feels to talk to you',
    category: 'Us',
    detail:
      'Even after the longest week, hearing your voice immediately makes the world feel calmer, softer, and like home.',
    isSample: true,
  },
  {
    id: 'til-6',
    title: 'Your honesty and depth',
    category: 'Your Mind',
    detail:
      'You never pretend to be anything other than who you truly are—thoughtful, sincere, and deeply authentic in everything you love.',
    isSample: true,
  },
];

export const SERVER_INITIAL_VOICE_RECORDINGS: VoiceRecording[] = [
  {
    id: 'vr-1',
    title: 'Quiet Evening Music-Box Lullaby',
    dateLabel: 'Built-in Gentle Melody',
    durationSeconds: 16,
    isBuiltInMelody: true,
    transcriptNote:
      'Plays a gentle synthesized music-box melody. Use the "Upload Audio File" or "Record Voice Note" buttons above to add private voice recordings.',
    isSample: true,
  },
];

export const SERVER_INITIAL_MEMORIES: MemoryPhoto[] = [
  {
    id: 'mem-1',
    title: 'Morning Espresso & Pressed Flowers',
    dateLabel: 'Autumn Morning',
    locationLabel: 'Corner Bistro Table',
    caption:
      'A quiet morning with warm croissants, espresso, and your notebook open beside the window.',
    imageUrl: '/api/media/memory_cafe_morning',
    isSample: true,
  },
  {
    id: 'mem-2',
    title: 'Golden Hour in the Rose Garden',
    dateLabel: 'Late Afternoon',
    locationLabel: 'Botanical Path',
    caption:
      'Walking slowly down a sunlit cobblestone path when time felt like it stood still.',
    imageUrl: '/api/media/memory_sunset_stroll',
    isSample: true,
  },
  {
    id: 'mem-3',
    title: 'Her Serene Study Sanctuary',
    dateLabel: 'Quiet Afternoon',
    locationLabel: 'Study Desk',
    caption:
      'Chamomile tea, dried blush roses, and your stethoscope resting on your anatomy atlas. So proud of the doctor you are becoming.',
    imageUrl: '/api/media/memory_study_desk',
    isSample: true,
  },
];

export const SERVER_GRATITUDE_PROMPTS: string[] = [
  'What is one small, quiet moment today that brought a little warmth to your heart?',
  'Which concept or clinical skill did you show up for today, even if it felt challenging?',
  'What is one kind thing you did for your body or mind today?',
  'Who or what made you smile softly this week?',
  'What is a tiny victory from today that deserves gentle recognition?',
];

export const SERVER_INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je-1',
    date: getRelativeDate(0),
    mood: 'Grateful',
    gratitudePrompt: SERVER_GRATITUDE_PROMPTS[0],
    gratitudeAnswer:
      'Having a quiet cup of chamomile tea by the window before starting my afternoon Cardiology revision.',
    achievement:
      'Finished reviewing the phases of the cardiac cycle without rushing myself.',
    dailyNote:
      'Today felt balanced. Taking five-minute pauses between study blocks helped me stay calm and present.',
    isSample: true,
  },
  {
    id: 'je-2',
    date: getRelativeDate(-2),
    mood: 'Serene',
    gratitudePrompt: SERVER_GRATITUDE_PROMPTS[2],
    gratitudeAnswer:
      'Closed my laptop early at 9:30 PM and listened to soft music instead of forcing another chapter.',
    achievement:
      'Practiced cardiac auscultation landmarks during clinical skills lab.',
    dailyNote: 'Reminding myself that rest is part of learning too.',
    isSample: true,
  },
];

export function createInitialSanctuaryState(): SanctuaryStatePayload {
  return {
    settings: { ...SERVER_INITIAL_SETTINGS },
    studyTopics: [...SERVER_INITIAL_STUDY_TOPICS],
    flashcards: [...SERVER_INITIAL_FLASHCARDS],
    quizQuestions: [...SERVER_INITIAL_QUIZ_QUESTIONS],
    ecgNotes: [...SERVER_INITIAL_ECG_NOTES],
    letters: [...SERVER_INITIAL_OPEN_WHEN_LETTERS],
    voiceRecordings: [...SERVER_INITIAL_VOICE_RECORDINGS],
    memories: [...SERVER_INITIAL_MEMORIES],
    journalEntries: [...SERVER_INITIAL_JOURNAL_ENTRIES],
    loveMessages: [...SERVER_INITIAL_LOVE_MESSAGES],
    thingsILove: [...SERVER_INITIAL_THINGS_I_LOVE],
  };
}

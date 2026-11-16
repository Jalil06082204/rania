import {
  AppSettings,
  CardioCategory,
  EcgStudyCase,
} from '../types';
import botanicalHeartEmblem from '../assets/images/botanical_heart_emblem_1794775758546.jpg';

export const HERO_BOTANICAL_IMAGE = botanicalHeartEmblem;

export const DEFAULT_LOCKED_SETTINGS: AppSettings = {
  recipientName: 'Rania',
  language: 'en',
  dailyAffirmation: '',
  dailyRestReminder: '',
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  soundEnabled: true,
  completedPomodoroSessions: 0,
  hydrationCountToday: 0,
};

export const CARDIO_CATEGORIES: CardioCategory[] = [
  'Physiologie cardiaque',
  'Électrocardiogramme (ECG)',
  'Troubles du rythme',
  'Insuffisance cardiaque',
  'Valvulopathies',
  'Hypertension artérielle',
];

export function normalizeCardioCategory(raw: string): CardioCategory {
  const map: Record<string, CardioCategory> = {
    'Cardiac Physiology': 'Physiologie cardiaque',
    'Physiologie cardiaque': 'Physiologie cardiaque',
    ECG: 'Électrocardiogramme (ECG)',
    'Électrocardiogramme (ECG)': 'Électrocardiogramme (ECG)',
    Arrhythmias: 'Troubles du rythme',
    'Troubles du rythme': 'Troubles du rythme',
    'Heart Failure': 'Insuffisance cardiaque',
    'Insuffisance cardiaque': 'Insuffisance cardiaque',
    'Valvular Diseases': 'Valvulopathies',
    Valvulopathies: 'Valvulopathies',
    Hypertension: 'Hypertension artérielle',
    'Hypertension artérielle': 'Hypertension artérielle',
  };
  return map[raw] || 'Physiologie cardiaque';
}

export const INITIAL_ECG_STUDY_CASES: EcgStudyCase[] = [
  {
    id: 'ecg-case-1',
    title: 'Cas pédagogique n°1 — Tracé de référence en dérivation DII',
    patternType: 'sinus',
    contextLabel:
      'Schéma pédagogique illustratif (Non diagnostique) · Étude du rythme de base en sémiologie cardiovasculaire (DFGSM3).',
    options: [
      'Rythme sinusal régulier normal',
      'Fibrillation atriale (FA)',
      'Flutter atrial typique',
      'Bloc atrio-ventriculaire du 1er degré (BAV I)',
    ],
    correctIndex: 0,
    systematicAnalysis: {
      frequence: 'Normale (environ 65–75 cycles/min sur ce schéma)',
      rythme: 'Régulier (intervalles R-R constants)',
      ondeP:
        'Présente, positive en DII, monomorphe, chaque onde P est suivie d’un QRS',
      espacePR: 'Constant et normal (compris entre 0,12 s et 0,20 s, soit 3 à 5 petits carreaux)',
      complexeQRS: 'Fin (< 0,12 s, soit < 3 petits carreaux)',
    },
    explanation:
      'Illustration pédagogique : Le rythme sinusal normal se définit par une activité atriale organisée d’origine sinusale (onde P positive en DI, DII, aVF et négative en aVR), suivie systématiquement d’un complexe QRS après un intervalle PR constant (0,12 à 0,20 s) avec des intervalles R-R réguliers.',
    lectureRef:
      'Référence pédagogique : Sémiologie de l’ECG normal · Collège National des Enseignants de Cardiologie (CNEC)',
    isSample: true,
  },
  {
    id: 'ecg-case-2',
    title: 'Cas pédagogique n°2 — Rythme irrégulier à QRS fins sans ondes P',
    patternType: 'afib',
    contextLabel:
      'Schéma pédagogique illustratif (Non diagnostique) · Analyse d’une arythmie supraventriculaire en sémiologie.',
    options: [
      'Rythme sinusal régulier',
      'Fibrillation atriale (FA)',
      'Bloc atrio-ventriculaire du 1er degré (BAV I)',
      'Tachycardie ventriculaire',
    ],
    correctIndex: 1,
    systematicAnalysis: {
      frequence: 'Variable selon la perméabilité du nœud atrio-ventriculaire',
      rythme:
        'Totalement irrégulier (« arythmie complète » : intervalles R-R tous différents)',
      ondeP:
        'Absence d’ondes P sinusales individualisables ; ligne de base remplacée par une trémulation (ondes f rapides et irrégulières)',
      espacePR: 'Non mesurable (absence d’onde P sinusale)',
      complexeQRS: 'Généralement fin (< 0,12 s) en l’absence de bloc de branche associé',
    },
    explanation:
      'Illustration pédagogique : La fibrillation atriale (FA) se caractérise sur le plan électrocardiographique par la disparition des ondes P sinusales remplacées par une trémulation rapide et irrégulière de la ligne isoélectrique (ondes f à 400–600/min) et par une irrégularité complète des intervalles R-R due au filtrage variable par le nœud AV.',
    lectureRef:
      'Référence pédagogique : Troubles du rythme supraventriculaires · Référentiel CNEC / SFC',
    isSample: true,
  },
  {
    id: 'ecg-case-3',
    title: 'Cas pédagogique n°3 — Activité atriale en « dents de scie » régulière',
    patternType: 'flutter',
    contextLabel:
      'Schéma pédagogique illustratif (Non diagnostique) · Macro-réentrée atriale droite.',
    options: [
      'Fibrillation atriale',
      'Flutter atrial typique (ondes F en toit d’usine)',
      'Extrasystole ventriculaire',
      'Rythme sinusal normal',
    ],
    correctIndex: 1,
    systematicAnalysis: {
      frequence: 'Activité atriale autour de 300/min ; réponse ventriculaire souvent en conduction 2:1 ou 4:1',
      rythme: 'Souvent régulier (si conduction AV fixe, ex. 2:1 ou 4:1)',
      ondeP:
        'Absence d’onde P sinusale ; présence d’ondes F biphasiques en « dents de scie » ou « toit d’usine » sans retour à la ligne isoélectrique (bien visibles en DII, DIII, aVF)',
      espacePR: 'Remplacé par un rapport de conduction atrio-ventriculaire (ex. 2 ondes F pour 1 QRS)',
      complexeQRS: 'Fin (< 0,12 s) en l’absence d’aberration de conduction',
    },
    explanation:
      'Illustration pédagogique : Le flutter atrial typique correspond à un circuit de macro-réentrée dans l’atrium droit (dépendant de l’isthme cavo-tricuspidien). Il génère des ondes F régulières (~300/min) en « dents de scie » sans ligne isoélectrique intermédiaire dans les dérivations inférieures.',
    lectureRef:
      'Référence pédagogique : Flutter atrial & Tachycardies supraventriculaires · Référentiel CNEC',
    isSample: true,
  },
  {
    id: 'ecg-case-4',
    title: 'Cas pédagogique n°4 — Allongement isolé du temps de conduction AV',
    patternType: 'bav1',
    contextLabel:
      'Schéma pédagogique illustratif (Non diagnostique) · Étude des troubles de la conduction atrio-ventriculaire.',
    options: [
      'Rythme sinusal avec PR normal',
      'Bloc atrio-ventriculaire du 1er degré (BAV I)',
      'Fibrillation atriale',
      'Extrasystole ventriculaire',
    ],
    correctIndex: 1,
    systematicAnalysis: {
      frequence: 'Normale (rythme de fond sinusal)',
      rythme: 'Régulier, aucune onde P bloquée',
      ondeP: 'Onde P sinusale présente devant chaque complexe QRS (rapport P/QRS = 1/1)',
      espacePR:
        'Allongé de façon constante > 0,20 s (> 200 ms, soit plus d’un grand carreau de 5 mm à 25 mm/s)',
      complexeQRS: 'Fin (< 0,12 s) lorsque le ralentissement siège dans le nœud AV',
    },
    explanation:
      'Illustration pédagogique : Dans le bloc atrio-ventriculaire du 1er degré (BAV I), tous les influx sinusaux sont conduits aux ventricules (aucune onde P bloquée), mais la conduction atrio-ventriculaire est ralentie de manière constante avec un intervalle PR strictement supérieur à 0,20 seconde (200 ms).',
    lectureRef:
      'Référence pédagogique : Troubles de la conduction intracardiaque · Référentiel CNEC',
    isSample: true,
  },
  {
    id: 'ecg-case-5',
    title: 'Cas pédagogique n°5 — Complexe QRS prématuré et élargi',
    patternType: 'esv',
    contextLabel:
      'Schéma pédagogique illustratif (Non diagnostique) · Analyse d’un battement ectopique prématuré.',
    options: [
      'Extrasystole ventriculaire (ESV) isolée sur rythme sinusal',
      'Bloc atrio-ventriculaire du 1er degré',
      'Flutter atrial',
      'Bradycardie sinusale pure',
    ],
    correctIndex: 0,
    systematicAnalysis: {
      frequence: 'Rythme de base sinusal interrompu par un battement prématuré',
      rythme: 'Irrégularité ponctuelle liée au complexe prématuré suivie d’un repos compensateur',
      ondeP: 'Le complexe prématuré n’est PAS précédé d’une onde P sinusale prématurée',
      espacePR: 'Absent devant le complexe ectopique ventriculaire',
      complexeQRS:
        'Complexe ectopique large (≥ 0,12 s), de morphologie inhabituelle, avec onde T inversée par rapport à la polarité principale du QRS (discordance appropriée)',
    },
    explanation:
      'Illustration pédagogique : Une extrasystole ventriculaire (ESV) est une dépolarisation prématurée née dans le myocarde ventriculaire en dessous de la bifurcation du faisceau de His. L’activation ventriculaire se faisant de proche en proche hors du réseau de Purkinje rapide, le QRS est large (≥ 0,12 s), non précédé d’onde P, avec inversion secondaire de l’onde T.',
    lectureRef:
      'Référence pédagogique : Sémiologie électrocardiographique des extrasystoles · Référentiel CNEC',
    isSample: true,
  },
];

export const GRATITUDE_PROMPTS: string[] = [
  'What is one small, quiet moment today that brought a little warmth to your heart?',
  'Which concept or clinical skill did you show up for today, even if it felt challenging?',
  'What is one kind thing you did for your body or mind today?',
  'Who or what made you smile softly this week?',
  'What is a tiny victory from today that deserves gentle recognition?',
];

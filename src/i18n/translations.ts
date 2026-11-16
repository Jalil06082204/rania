import {
  CardioCategory,
  CardioFlashcard,
  CardioQuizQuestion,
  EcgStudyCase,
  EcgWaveNote,
  GardenMood,
  JournalEntry,
  Language,
  LovedQualityItem,
  LoveMessageItem,
  MemoryPhoto,
  OpenWhenLetter,
  StudyPriority,
  StudyTopic,
  VoiceRecording,
} from '../types';

export interface TranslationDictionary {
  brandName: string;
  forRania: string;
  personalEdition: string;
  privateSanctuaryEdition: string;
  tagline: string;
  secondaryTagline: string;
  creatorCredit: string;
  welcomeGreeting: string;
  welcomeSubtext: string;
  welcomeBody: string;
  enterWorldBtn: string;
  exLibris: string;
  thirdYearMedicine: string;
  nav: {
    home: string;
    homeShort: string;
    study: string;
    studyShort: string;
    cardio: string;
    cardioShort: string;
    focus: string;
    focusShort: string;
    letters: string;
    lettersShort: string;
    thingsILove: string;
    thingsILoveShort: string;
    garden: string;
    gardenShort: string;
    settings: string;
    welcome: string;
    lock: string;
    lockSanctuary: string;
  };
  common: {
    sampleLabel: string;
    customLabel: string;
    save: string;
    cancel: string;
    confirm: string;
    edit: string;
    delete: string;
    remove: string;
    add: string;
    close: string;
    dismiss: string;
    reset: string;
    retry: string;
    clearFilters: string;
    needAHug: string;
    hugMessage: string;
    hugSubtext: string;
    hugGentlePause: string;
    playSoothingChime: string;
    thankYouHug: string;
    today: string;
    due: string;
    completed: string;
    inProgress: string;
    sample: string;
  };
  login: {
    privateSanctuary: string;
    title: string;
    subtitle: string;
    welcomeHome: string;
    openingSanctuary: string;
    passphraseLabel: string;
    passphrasePlaceholder: string;
    showPassword: string;
    hidePassword: string;
    errorInvalid: string;
    errorRateLimit: (seconds: number) => string;
    unlocking: string;
    enterMyWorld: string;
  };
  home: {
    forRecipient: (name: string) => string;
    welcomeHomeGreeting: (name: string) => string;
    heroSubtitle: string;
    beginFocusBtn: (mins: number) => string;
    dailyAffirmation: string;
    personalNote: string;
    editAffirmation: string;
    saveAffirmation: string;
    oneGentlePage: (name: string) => string;
    keptInSanctuary: string;
    gentleRestReminder: string;
    waterCheckIns: string;
    glasses: string;
    sipWaterBtn: string;
    todaysFocusQueue: string;
    todaysStudyGoals: string;
    quickAdd: string;
    fullStudyPlanner: string;
    quickGoalTitlePlaceholder: string;
    quickGoalModulePlaceholder: string;
    addGoalBtn: string;
    emptyQueueTitle: string;
    emptyQueueSubtext: string;
    paceLabel: string;
    honestOverview: string;
    studyProgress: string;
    studyTopicsCompleted: string;
    cardioFlashcardsMastered: string;
    focusSessionsCompleted: string;
    featuredLoveNote: string;
    openEnvelopeLink: string;
    curatedSanctuarySpaces: string;
    exploreUniverse: string;
    fiveSpacesSubtitle: string;
    chapters: {
      studyTitle: string;
      studySubtitle: (pending: number) => string;
      cardioTitle: string;
      cardioSubtitle: string;
      focusTitle: string;
      focusSubtitle: string;
      lettersTitle: string;
      lettersSubtitle: string;
      gardenTitle: string;
      gardenSubtitle: string;
    };
    defaultAffirmation: string;
    defaultRestReminder: string;
  };
  study: {
    badge: string;
    title: string;
    subtitle: string;
    addTopicBtn: string;
    gentlePaceTracker: string;
    overallProgress: string;
    todaysTasks: string;
    done: string;
    completedTotal: string;
    of: string;
    weeklyOverview: string;
    showAllDays: string;
    editTopicModalTitle: string;
    addTopicModalTitle: string;
    topicTitleLabel: string;
    topicTitlePlaceholder: string;
    medicalModuleLabel: string;
    medicalModulePlaceholder: string;
    priorityPaceLabel: string;
    targetDateLabel: string;
    lectureNotesLabel: string;
    lectureNotesPlaceholder: string;
    addToPlanBtn: string;
    filterAll: string;
    filterToday: string;
    filterPending: string;
    filterCompleted: string;
    allPaces: string;
    priorities: Record<StudyPriority, string>;
    searchPlaceholder: string;
    emptyTitle: string;
    emptyNoTopics: string;
    emptyFiltered: string;
    addNewTopicBtn: string;
    restoreSampleTopicsBtn: string;
    markIncompleteAria: string;
    markCompletedAria: string;
    deleteModalTitle: string;
    deleteModalMessage: (title: string) => string;
    deleteConfirmBtn: string;
    defaultModules: string[];
  };
  cardio: {
    disclaimerTitle: string;
    disclaimerBody1: string;
    disclaimerHighlight: string;
    disclaimerBody2: string;
    disclaimerSubtext: string;
    headerBadge: string;
    title: string;
    subtitle: string;
    tabs: {
      flashcards: string;
      quiz: string;
      ecg: string;
      tracking: string;
    };
    sixModulesHeading: string;
    showAllSixModules: string;
    modulePrefix: string;
    understoodShort: string;
    needsRevisionShort: string;
    categories: Record<CardioCategory, string>;
    flashcardsView: {
      allTitle: string;
      categoryTitle: (cat: string) => string;
      subtitle: string;
      importCoursesBtn: string;
      newCardBtn: string;
      statusLabel: string;
      filterAll: string;
      filterNeedsRevision: string;
      filterUnderstood: string;
      filterUnseen: string;
      importModalTitle: string;
      importModalSubtitle: string;
      importTargetModule: string;
      importDefaultRef: string;
      importDefaultRefValue: string;
      importTextareaLabel: string;
      importTextareaPlaceholder: string;
      importSubmitBtn: string;
      cardModalEditTitle: string;
      cardModalNewTitle: string;
      cardModuleLabel: string;
      cardRefLabel: string;
      cardRefPlaceholder: string;
      cardDefaultRefValue: string;
      cardFrontLabel: string;
      cardFrontPlaceholder: string;
      cardBackLabel: string;
      cardBackPlaceholder: string;
      saveCardBtn: string;
      emptyTitle: string;
      emptySubtitle: string;
      viewAllCardsBtn: string;
      createCardBtn: string;
      restoreSampleCardsBtn: string;
      sampleBadge: string;
      personalBadge: string;
      statusUnderstood: string;
      statusNeedsRevision: string;
      statusToStudy: string;
      frontHeading: string;
      backHeading: string;
      mentalPrompt: string;
      hideAnswerBtn: string;
      revealAnswerBtn: string;
      markUnderstoodBtn: string;
      markNeedsRevisionBtn: string;
      deleteModalTitle: string;
      deleteModalMessage: (q: string) => string;
      deleteConfirmBtn: string;
    };
    quizView: {
      allTitle: string;
      categoryTitle: (cat: string) => string;
      subtitle: string;
      showAllQuizzesBtn: string;
      reviewMistakesBtn: (count: number) => string;
      resetScoreBtn: string;
      createQuizBtn: string;
      scoreBannerHeading: string;
      scoreLabel: string;
      correctWord: string;
      scoreStatsSummary: (
        pct: number,
        answered: number,
        total: number,
        incorrect: number
      ) => string;
      validatedCount: (answered: number, total: number) => string;
      modalEditTitle: string;
      modalNewTitle: string;
      modalSubtitle: string;
      optionLabel: (letter: string) => string;
      correctOptionCheckbox: string;
      questionPromptLabel: string;
      explanationLabel: string;
      saveQuizBtn: string;
      emptyNoMistakesTitle: string;
      emptyNoQuizzesTitle: string;
      emptyNoMistakesSubtitle: string;
      emptyNoQuizzesSubtitle: string;
      backToAllQuizzesBtn: string;
      multipleChoiceBadge: string;
      singleChoiceBadge: string;
      validateAnswerBtn: (count: number) => string;
      correctFeedback: string;
      incorrectFeedback: (expectedLetters: string) => string;
      deleteModalTitle: string;
      deleteModalMessage: (q: string) => string;
      deleteConfirmBtn: string;
    };
    ecgView: {
      badge: string;
      title: string;
      subtitle: string;
      addCaseBtn: string;
      modalTitle: string;
      caseTitleLabel: string;
      caseTitlePlaceholder: string;
      schematicPatternLabel: string;
      patterns: {
        sinus: string;
        afib: string;
        flutter: string;
        bav1: string;
        esv: string;
      };
      optionLabel: (letter: string) => string;
      correctRadio: string;
      freqPlaceholder: string;
      pWavePlaceholder: string;
      qrsPlaceholder: string;
      explanationPlaceholder: string;
      saveCaseBtn: string;
      casePillLabel: (idx: number) => string;
      schematicWarningBadge: string;
      calibrationLabel: string;
      identifyPrompt: string;
      structuredAnalysisTitle: string;
      exactIdentification: string;
      expectedAnswer: (ans: string) => string;
      step1Freq: string;
      step2Rhythm: string;
      step3PWave: string;
      step4PR: string;
      step5QRS: string;
      semiologyTitle: string;
      semiologySubtitle: string;
      calibrationReminder: string;
      selectedSegmentPrefix: string;
      electrophysiologyRecall: string;
      personalCourseNotes: (label: string) => string;
      annotateBtn: string;
    };
    trackingView: {
      title: string;
      subtitle: string;
      cardsUnderstoodTitle: string;
      cardsNeedsRevisionSub: (count: number) => string;
      quizAccuracyTitle: string;
      quizAccuracySub: (
        correct: number,
        answered: number,
        total: number
      ) => string;
      ecgIdentifiedTitle: string;
      ecgIdentifiedSub: (count: number) => string;
      studyGoalsValidatedTitle: string;
      studyGoalsValidatedSub: string;
      weeklyChartTitle: string;
      weeklyChartSubtitle: string;
      weeklyTooltip: (cards: number, qcm: number, ecg: number) => string;
      moduleMasteryTitle: string;
      todayShort: string;
      dayNamesShort: string[];
    };
  };
  focus: {
    badge: string;
    title: string;
    subtitle: string;
    completedSessions: string;
    chimeOn: string;
    chimeMuted: string;
    presetFocus: (mins: number) => string;
    presetShortBreak: (mins: number) => string;
    presetLongBreak: (mins: number) => string;
    presetCustom: (mins: number) => string;
    customMinutesLabel: string;
    setTimerBtn: string;
    dialStatusFocus: string;
    dialStatusShortBreak: string;
    dialStatusLongBreak: string;
    dialStatusCustom: string;
    runningStatus: string;
    pausedStatus: string;
    readyStatus: string;
    startSessionBtn: string;
    pauseBtn: string;
    resumeBtn: string;
    resetBtn: string;
    reassuranceNote: string;
    checkInsTitle: string;
    checkInsSubtitle: string;
    hydrateTitle: string;
    hydrateSubtitle: (count: number) => string;
    stretchTitle: string;
    stretchSubtitle: string;
    eyesTitle: string;
    eyesSubtitle: string;
    breathingTitle: string;
    breathingSubtitle: string;
    tapToBegin: string;
    pauseBreathingBtn: string;
    startBreathingBtn: string;
    breathInhale: string;
    breathHold: string;
    breathExhale: string;
    focusCompleteBanner: string;
    breakCompleteBanner: string;
  };
  letters: {
    badge: string;
    title: string;
    subtitle: string;
    writeNewLetterBtn: string;
    openThingsILoveBtn: string;
    modalEditTitle: string;
    modalNewTitle: string;
    envelopeTitleLabel: string;
    envelopeTitlePlaceholder: string;
    gentleSubtitleLabel: string;
    gentleSubtitlePlaceholder: string;
    letterContentLabel: string;
    letterContentPlaceholder: string;
    saveLetterBtn: string;
    emptyLettersTitle: string;
    emptyLettersSubtitle: string;
    writeFirstLetterBtn: string;
    restoreSampleLettersBtn: string;
    sealedEnvelopesHeading: string;
    letterSingular: string;
    letterPlural: string;
    editLetterBtn: string;
    breakSealBtn: string;
    resealEnvelopeBtn: string;
    envelopeSealedCaption: string;
    envelopeOpenedCaption: string;
    randomLoveBadge: string;
    randomLoveTitle: string;
    randomLoveSubtitle: string;
    randomLoveBtn: string;
    manageLoveMessagesBtn: string;
    addLoveMessageBtn: string;
    editLoveMessageTitle: string;
    newLoveMessageTitle: string;
    loveMessageTextLabel: string;
    loveMessageTextPlaceholder: string;
    loveMessageContextLabel: string;
    loveMessageContextPlaceholder: string;
    saveLoveMessageBtn: string;
    restoreLoveMessagesBtn: string;
    voiceBadge: string;
    voiceTitle: string;
    voiceSubtitle: string;
    uploadAudioBtn: string;
    recordVoiceBtn: string;
    stopSaveRecordingBtn: string;
    editVoiceModalTitle: string;
    voiceTitleLabel: string;
    voiceNoteLabel: string;
    saveVoiceBtn: string;
    playingStatus: string;
    pausedStatus: string;
    restartBtn: string;
    micUnavailableError: string;
    micPermissionError: string;
    memoriesBadge: string;
    memoriesTitle: string;
    addMemoryBtn: string;
    memoryModalEditTitle: string;
    memoryModalNewTitle: string;
    memoryTitleLabel: string;
    memoryTitlePlaceholder: string;
    memoryDateLabel: string;
    memoryDatePlaceholder: string;
    memoryLocationLabel: string;
    memoryLocationPlaceholder: string;
    uploadPhotoLabel: string;
    choosePhotoBtn: string;
    photoAttached: string;
    storyCaptionLabel: string;
    storyCaptionPlaceholder: string;
    saveMemoryBtn: string;
    emptyMemoriesTitle: string;
    emptyMemoriesSubtitle: string;
    restoreSamplePhotosBtn: string;
    deleteLetterModalTitle: string;
    deleteLetterModalMsg: (title: string) => string;
    deleteLetterConfirmBtn: string;
    deleteVoiceModalTitle: string;
    deleteVoiceModalMsg: (title: string) => string;
    deleteVoiceConfirmBtn: string;
    deleteMemoryModalTitle: string;
    deleteMemoryModalMsg: (title: string) => string;
    deleteMemoryConfirmBtn: string;
  };
  thingsILovePage: {
    badge: string;
    title: string;
    subtitle: string;
    backToLoveBtn: string;
    addQualityBtn: string;
    modalEditTitle: string;
    modalNewTitle: string;
    qualityTitleLabel: string;
    qualityTitlePlaceholder: string;
    qualityCategoryLabel: string;
    qualityCategoryPlaceholder: string;
    qualityDetailLabel: string;
    qualityDetailPlaceholder: string;
    saveQualityBtn: string;
    restoreQualitiesBtn: string;
    emptyTitle: string;
    emptySubtitle: string;
    deleteModalTitle: string;
    deleteModalMsg: (title: string) => string;
    deleteConfirmBtn: string;
  };
  studySurprise: {
    badge: string;
    title: string;
    completedGoalLabel: string;
    fromCreator: string;
    drawAnotherNoteBtn: string;
    editNoteBtn: string;
    saveNoteBtn: string;
    keepGoingBtn: string;
  };
  garden: {
    badge: string;
    title: string;
    subtitle: string;
    newEntryBtn: string;
    modalEditTitle: string;
    modalNewTitle: string;
    modalSubtitle: string;
    validationError: string;
    moodQuestionLabel: string;
    entryDateLabel: string;
    gratitudePromptHeading: string;
    tryAnotherPromptBtn: string;
    gratitudePlaceholder: string;
    achievementLabel: string;
    achievementPlaceholder: string;
    dailyNotesLabel: string;
    dailyNotesPlaceholder: string;
    saveReflectionBtn: string;
    allMoodsFilter: (count: number) => string;
    searchPlaceholder: string;
    emptyTitle: string;
    emptySubtitle: string;
    writeNewEntryBtn: string;
    restoreSampleEntriesBtn: string;
    moodLabel: string;
    smallWinHeading: string;
    dailyReflectionHeading: string;
    deleteModalTitle: string;
    deleteModalMsg: (date: string) => string;
    deleteConfirmBtn: string;
    moods: Record<GardenMood, { label: string; descriptor: string }>;
    gratitudePrompts: string[];
  };
  settings: {
    badge: string;
    title: string;
    subtitle: string;
    securityTitle: string;
    securityBody: string;
    languageHeading: string;
    languageSubtitle: string;
    englishBtn: string;
    frenchBtn: string;
    defaultsHeading: string;
    recipientNameLabel: string;
    focusDurationLabel: string;
    shortBreakLabel: string;
    longBreakLabel: string;
    savePreferencesBtn: string;
    backupHeading: string;
    backupSubtitle: string;
    exportJsonBtn: string;
    restoreSamplesBtn: string;
    clearAllBtn: string;
    confirmResetMsg: string;
    confirmClearMsg: string;
    preferencesSavedBanner: string;
    languageUpdatedBanner: string;
    restoredBanner: string;
    clearedBanner: string;
  };
  toasts: {
    savedToSanctuary: string;
    studyGoalUpdated: string;
    studyGoalAddedToday: string;
    studyTopicUpdated: string;
    studyTopicAdded: string;
    studyTopicRemoved: string;
    studyTopicsRestored: string;
    topicCompleted: string;
    topicInProgress: string;
    cardUnderstood: string;
    cardNeedsRevision: string;
    cardUpdated: string;
    cardAdded: string;
    cardDeleted: string;
    cardsImported: (count: number) => string;
    cardsImportFormatError: string;
    cardsRestored: string;
    quizSelectAtLeastOne: string;
    quizUpdated: string;
    quizAdded: string;
    quizDeleted: string;
    quizReset: string;
    ecgCaseAdded: string;
    ecgAnnotationSaved: string;
    chimeEnabled: string;
    chimeMuted: string;
    focusSessionCompleted: string;
    restBreakCompleted: string;
    customTimerSet: (mins: number) => string;
    hydrationLogged: string;
    letterUpdated: string;
    letterAdded: string;
    letterDeleted: string;
    lettersRestored: string;
    voiceUploaded: string;
    voiceRecorded: string;
    voiceDeleted: string;
    memoryUpdated: string;
    memoryAdded: string;
    memoryDeleted: string;
    memoriesRestored: string;
    journalUpdated: string;
    journalAdded: string;
    journalDeleted: string;
    journalRestored: string;
    restoredAllSamples: string;
    clearedAllData: string;
    backupDownloaded: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandName: 'Her Little Heart',
    forRania: 'For Rania',
    personalEdition: 'Personal Edition',
    privateSanctuaryEdition: 'Private Sanctuary Edition',
    tagline: 'A little universe made just for you.',
    secondaryTagline: 'Study gently. Rest deeply. Feel loved.',
    creatorCredit: 'Made with love, just for you.',
    welcomeGreeting: 'Hello, Rania ♡',
    welcomeSubtext: 'I made this little corner of the internet just for you.',
    welcomeBody:
      'A quiet, unhurried sanctuary for your third-year medical studies, your Cardiology revisions, your gentle rest breaks, and reminders of how deeply you are loved across every mile.',
    enterWorldBtn: 'Enter My Little World',
    exLibris: 'Ex Libris',
    thirdYearMedicine: 'Third-Year Medicine',
    nav: {
      home: 'Sanctuary',
      homeShort: 'Sanctuary',
      study: 'Study Space',
      studyShort: 'Study',
      cardio: 'Cardio Academy',
      cardioShort: 'Cardio',
      focus: 'Focus & Relax',
      focusShort: 'Focus',
      letters: 'A Little Love From Me',
      lettersShort: 'Love',
      thingsILove: 'Things I Love About You',
      thingsILoveShort: 'About You',
      garden: 'Little Garden',
      gardenShort: 'Garden',
      settings: 'Settings',
      welcome: 'Welcome',
      lock: 'Lock',
      lockSanctuary: 'Lock Sanctuary',
    },
    common: {
      sampleLabel: 'Sample Placeholder',
      customLabel: 'Personal Entry',
      save: 'Save Changes',
      cancel: 'Cancel',
      confirm: 'Confirm',
      edit: 'Edit',
      delete: 'Delete',
      remove: 'Remove',
      add: 'Add New',
      close: 'Close',
      dismiss: 'Dismiss',
      reset: 'Reset',
      retry: 'Retry',
      clearFilters: 'Clear Filters',
      needAHug: 'I need a hug',
      hugMessage:
        "Take a breath, my love. You don't have to figure everything out today. I'm so proud of you.",
      hugSubtext:
        'Drop your shoulders away from your ears. Inhale slowly for four seconds, hold gently, and let today be as light as it needs to be.',
      hugGentlePause: 'A Gentle Pause',
      playSoothingChime: 'Play Soothing Chime',
      thankYouHug: 'Thank You, I Needed This ♡',
      today: 'Today',
      due: 'Due',
      completed: 'Completed',
      inProgress: 'In Progress',
      sample: 'Sample',
    },
    login: {
      privateSanctuary: 'Private Sanctuary',
      title: 'A little secret for Rania ♡',
      subtitle: 'This little world is made just for you.',
      welcomeHome: 'Welcome home, Rania ♡',
      openingSanctuary: 'Opening your sanctuary...',
      passphraseLabel: 'Secret Passphrase',
      passphrasePlaceholder: 'Whisper the secret passphrase...',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      errorInvalid: 'Not quite, my love. Try again ♡',
      errorRateLimit: (seconds: number) =>
        `Please wait ${seconds}s before trying again, my love ♡`,
      unlocking: 'Unlocking...',
      enterMyWorld: 'Enter My World',
    },
    home: {
      forRecipient: (name: string) => `For ${name}`,
      welcomeHomeGreeting: (name: string) => `Welcome home, ${name} ♡`,
      heroSubtitle:
        'Study gently. Rest deeply. Feel loved. Everything here moves at your own calm pace.',
      beginFocusBtn: (mins: number) => `Begin ${mins}m Focus`,
      dailyAffirmation: 'Daily Affirmation',
      personalNote: 'Personal Note',
      editAffirmation: 'Edit Affirmation',
      saveAffirmation: 'Save Affirmation',
      oneGentlePage: (name: string) => `One gentle page at a time, ${name}.`,
      keptInSanctuary: 'Kept in your sanctuary',
      gentleRestReminder: 'Gentle Rest Reminder',
      waterCheckIns: 'Water check-ins today: ',
      glasses: 'glasses',
      sipWaterBtn: '+ Sip Water',
      todaysFocusQueue: "Today's Focus Queue",
      todaysStudyGoals: "Today's Study Goals",
      quickAdd: 'Quick Add',
      fullStudyPlanner: 'Full Study Planner',
      quickGoalTitlePlaceholder:
        'e.g., Review aortic stenosis murmur characteristics...',
      quickGoalModulePlaceholder: 'Module (e.g., Cardiology)',
      addGoalBtn: 'Add Goal',
      emptyQueueTitle: 'Your study queue is completely clear for today.',
      emptyQueueSubtext:
        'Add a new topic or enjoy a deeply deserved evening of rest.',
      paceLabel: 'Pace:',
      honestOverview: 'Honest Overview',
      studyProgress: 'Study Progress',
      studyTopicsCompleted: 'Study Topics Completed',
      cardioFlashcardsMastered: 'Cardio Flashcards Mastered',
      focusSessionsCompleted: 'Focus Sessions Completed',
      featuredLoveNote: 'Featured Love Note',
      openEnvelopeLink: 'Open Envelope in Love Letters',
      curatedSanctuarySpaces: 'Curated Sanctuary Spaces',
      exploreUniverse: 'Explore Your Little Universe',
      fiveSpacesSubtitle: 'Five spaces crafted for your daily rhythm',
      chapters: {
        studyTitle: 'My Study Space',
        studySubtitle: (pending: number) =>
          `${pending} pending topics · Weekly planner`,
        cardioTitle: 'Cardio Academy',
        cardioSubtitle: '6 modules · Flashcards, quizzes & ECG lab',
        focusTitle: 'Focus & Relax',
        focusSubtitle: 'Pomodoro timer · Gentle breathing & rest',
        lettersTitle: 'Love Letters',
        lettersSubtitle: 'Open When notes · Voice player & memories',
        gardenTitle: 'My Little Garden',
        gardenSubtitle: 'Mood reflections · Gratitude & small wins',
      },
      defaultAffirmation:
        'I am learning at my own pace, building wisdom one gentle page at a time, and I am deeply loved exactly as I am today.',
      defaultRestReminder:
        'Remember to unclench your shoulders, sip some warm water, and give your eyes a quiet pause away from your notes.',
    },
    study: {
      badge: 'Third-Year Medical Planner · Saved in Sanctuary',
      title: 'My Study Space',
      subtitle:
        'Organize your lectures, clinical rotations, and revisions with calm clarity.',
      addTopicBtn: 'Add Study Topic',
      gentlePaceTracker: 'Gentle Pace Tracker',
      overallProgress: 'Overall Progress',
      todaysTasks: "Today's tasks:",
      done: 'done',
      completedTotal: 'Completed total:',
      of: 'of',
      weeklyOverview: 'Weekly Overview',
      showAllDays: 'Show All Days',
      editTopicModalTitle: 'Edit Study Topic',
      addTopicModalTitle: 'Add a New Study Topic',
      topicTitleLabel: 'Topic Title',
      topicTitlePlaceholder:
        'e.g., Summarize pathophysiology of left-sided heart failure',
      medicalModuleLabel: 'Medical Module',
      medicalModulePlaceholder: 'e.g., Cardiology, Semiology...',
      priorityPaceLabel: 'Priority Pace',
      targetDateLabel: 'Target Date',
      lectureNotesLabel: 'Lecture Notes or Page Reference (Optional)',
      lectureNotesPlaceholder:
        'Add lecture number, textbook chapter, or gentle study reminder...',
      addToPlanBtn: 'Add to Study Plan',
      filterAll: 'All Topics',
      filterToday: "Today's Tasks",
      filterPending: 'In Progress',
      filterCompleted: 'Completed',
      allPaces: 'All Paces',
      priorities: {
        High: 'High',
        Medium: 'Medium',
        Gentle: 'Gentle',
      },
      searchPlaceholder: 'Search module or topic...',
      emptyTitle: 'No study topics match this view',
      emptyNoTopics:
        'Your study planner is currently empty. Add your first lecture topic or restore the sample study schedule.',
      emptyFiltered:
        'Try clearing your active filters or adding a new topic for this day.',
      addNewTopicBtn: 'Add New Topic',
      restoreSampleTopicsBtn: 'Restore Sample Topics',
      markIncompleteAria: 'Mark as incomplete',
      markCompletedAria: 'Mark as completed',
      deleteModalTitle: 'Delete Study Topic?',
      deleteModalMessage: (title: string) =>
        `Are you sure you want to remove "${title}" from your study planner?`,
      deleteConfirmBtn: 'Delete Topic',
      defaultModules: [
        'Cardiology',
        'Semiology',
        'Pharmacology',
        'Pulmonology',
        'Clinical Rotation',
        'Pathology',
      ],
    },
    cardio: {
      disclaimerTitle:
        'Exclusively Educational Use (3rd-Year Medical Curriculum) — Non-Diagnostic:',
      disclaimerBody1:
        'This platform is a personal university study companion. All ECG tracings displayed are',
      disclaimerHighlight: 'educational schematic illustrations',
      disclaimerBody2: 'and never represent clinical diagnostic recordings.',
      disclaimerSubtext:
        'Never use this application for patient diagnosis or clinical decision-making. Always cross-reference every concept with your official university faculty lectures and cardiology textbooks.',
      headerBadge: 'Cardiology Revision Platform · Third-Year Medicine',
      title: 'Cardio Academy',
      subtitle:
        '6 core modules: Flashcards, Multiple-Choice Quizzes (QCM), Schematic ECG Lab, and Weekly Progress Tracking.',
      tabs: {
        flashcards: 'Flashcards',
        quiz: 'Quizzes (QCM)',
        ecg: 'ECG Lab',
        tracking: 'Progress & Stats',
      },
      sixModulesHeading: 'The 6 Cardiology Learning Modules',
      showAllSixModules: 'Show all 6 modules',
      modulePrefix: 'Module',
      understoodShort: 'understood',
      needsRevisionShort: 'to review',
      categories: {
        'Physiologie cardiaque': 'Cardiac Physiology',
        'Électrocardiogramme (ECG)': 'Electrocardiogram (ECG)',
        'Troubles du rythme': 'Cardiac Arrhythmias',
        'Insuffisance cardiaque': 'Heart Failure',
        Valvulopathies: 'Valvular Heart Disease',
        'Hypertension artérielle': 'Arterial Hypertension',
      },
      flashcardsView: {
        allTitle: 'All Revision Flashcards',
        categoryTitle: (cat: string) => `Flashcards: ${cat}`,
        subtitle:
          'Question on the front · Referenced answer on the back · Mark each card as "Understood" or "Needs Revision"',
        importCoursesBtn: 'Import Lecture Notes',
        newCardBtn: 'New Flashcard',
        statusLabel: 'Status:',
        filterAll: 'All Cards',
        filterNeedsRevision: 'Needs Revision',
        filterUnderstood: 'Understood',
        filterUnseen: 'Not Studied',
        importModalTitle: 'Import Flashcards from Your University Lectures',
        importModalSubtitle:
          'Paste your lecture Q&A using the format: Question | Answer | Reference (one card per line)',
        importTargetModule: 'Target Module',
        importDefaultRef: 'Default Lecture Reference',
        importDefaultRefValue: 'Personal Lecture Notes (Medical School)',
        importTextareaLabel: 'Content to import (one line per card)',
        importTextareaPlaceholder:
          'What is normal resting cardiac output? | Approximately 5 L/min in adults (CO = HR x SV). | Hemodynamics Lecture\nWhat is the normal QRS duration? | Less than 0.12 seconds (< 120 ms, or < 3 small squares). | ECG Semiology Lab',
        importSubmitBtn: 'Import Flashcards',
        cardModalEditTitle: 'Edit Revision Flashcard',
        cardModalNewTitle: 'Create a Cardiology Flashcard',
        cardModuleLabel: 'Cardiology Module',
        cardRefLabel: 'Lecture / Textbook Reference',
        cardRefPlaceholder: 'e.g., Cardiology Syllabus · Chapter 4',
        cardDefaultRefValue: '3rd-Year Cardiology Lecture · Personal Notes',
        cardFrontLabel: 'Front: Question',
        cardFrontPlaceholder:
          'Write the semiology or pathophysiology question...',
        cardBackLabel: 'Back: Detailed Answer & Explanation',
        cardBackPlaceholder:
          'Write the verified answer based on your university lecture...',
        saveCardBtn: 'Save Flashcard',
        emptyTitle: 'No flashcards in this selection',
        emptySubtitle:
          'Create a flashcard from your medical lectures, change the status filter, or restore the initial deck.',
        viewAllCardsBtn: 'View All Flashcards',
        createCardBtn: 'Create Flashcard',
        restoreSampleCardsBtn: 'Restore Initial Flashcards',
        sampleBadge: 'Reference Card',
        personalBadge: 'Personal Note',
        statusUnderstood: '✓ Understood',
        statusNeedsRevision: 'Needs Revision',
        statusToStudy: 'To Study',
        frontHeading: 'Front · Question',
        backHeading: 'Back · Answer & Explanation',
        mentalPrompt:
          'Formulate your answer mentally, then click "Reveal Answer".',
        hideAnswerBtn: 'Hide Answer',
        revealAnswerBtn: 'Reveal Answer',
        markUnderstoodBtn: 'Understood',
        markNeedsRevisionBtn: 'Needs Revision',
        deleteModalTitle: 'Delete Flashcard?',
        deleteModalMessage: (q: string) =>
          `Are you sure you want to delete the flashcard "${q}"?`,
        deleteConfirmBtn: 'Delete Flashcard',
      },
      quizView: {
        allTitle: 'Cardiology Quiz Bank (Single & Multiple Choice)',
        categoryTitle: (cat: string) => `Quizzes: ${cat}`,
        subtitle:
          '4 answer choices (A, B, C, D) · One or multiple correct answers as indicated · Detailed explanations and references',
        showAllQuizzesBtn: 'Show All Questions',
        reviewMistakesBtn: (count: number) => `Review Incorrect (${count})`,
        resetScoreBtn: 'Reset Score',
        createQuizBtn: 'Create Question',
        scoreBannerHeading: 'Self-Assessment Score & Progress',
        scoreLabel: 'Score:',
        correctWord: 'correct',
        scoreStatsSummary: (pct, answered, total, incorrect) =>
          `(${pct}% accuracy · ${answered}/${total} answered${
            incorrect > 0 ? ` · ${incorrect} to review` : ''
          })`,
        validatedCount: (answered, total) =>
          `${answered}/${total} questions completed`,
        modalEditTitle: 'Edit Quiz Question',
        modalNewTitle: 'Add a Quiz Question (Single or Multiple Choice)',
        modalSubtitle:
          'Check one correct option (single-choice) or multiple correct options (multiple-choice).',
        optionLabel: (letter: string) => `Choice ${letter}`,
        correctOptionCheckbox: 'Correct Answer',
        questionPromptLabel: 'Question Stem',
        explanationLabel: 'Detailed Medical Explanation',
        saveQuizBtn: 'Save Question',
        emptyNoMistakesTitle: 'No incorrect answers to review in this module!',
        emptyNoQuizzesTitle: 'No quiz questions in this module yet',
        emptyNoMistakesSubtitle:
          'All of your submitted answers in this module are correct.',
        emptyNoQuizzesSubtitle:
          'Add a custom question from your faculty exams or restore the initial question bank.',
        backToAllQuizzesBtn: 'Return to All Questions',
        multipleChoiceBadge: 'Multiple Choice (1 or more correct)',
        singleChoiceBadge: 'Single Choice (1 correct answer)',
        validateAnswerBtn: (count: number) =>
          `Submit Answer (${count} selected)`,
        correctFeedback: '✓ Correct Answer!',
        incorrectFeedback: (expectedLetters: string) =>
          `Needs Review · Correct answer(s): ${expectedLetters}`,
        deleteModalTitle: 'Delete Quiz Question?',
        deleteModalMessage: (q: string) =>
          `Are you sure you want to delete the question "${q}"?`,
        deleteConfirmBtn: 'Delete Question',
      },
      ecgView: {
        badge:
          'Semiology Training · Non-Diagnostic Educational Schematics',
        title: 'Interactive ECG Rhythm Identification',
        subtitle:
          'Examine the educational schematic waveform below, identify the rhythm, and review the systematic 5-step analysis (Rate, Rhythm, P Wave, PR Interval, QRS Complex).',
        addCaseBtn: 'Add ECG Case',
        modalTitle: 'Add an Educational ECG Study Case',
        caseTitleLabel: 'Study Case Title',
        caseTitlePlaceholder: 'e.g., Lab Case #6 — Rhythm Analysis',
        schematicPatternLabel: 'Illustrative Schematic Waveform',
        patterns: {
          sinus: 'Schematic: Normal Sinus Rhythm',
          afib: 'Schematic: Atrial Fibrillation',
          flutter: 'Schematic: Typical Atrial Flutter',
          bav1: 'Schematic: First-Degree AV Block',
          esv: 'Schematic: Premature Ventricular Contraction (PVC)',
        },
        optionLabel: (letter: string) => `Option ${letter}`,
        correctRadio: 'Correct',
        freqPlaceholder: 'Heart Rate (e.g., 75 bpm)',
        pWavePlaceholder: 'P Wave (e.g., Upright in Lead II)',
        qrsPlaceholder: 'QRS (e.g., Narrow < 0.12 s)',
        explanationPlaceholder:
          'Detailed educational explanation of the tracing...',
        saveCaseBtn: 'Save ECG Case',
        casePillLabel: (idx: number) => `Case #${idx}`,
        schematicWarningBadge:
          'EDUCATIONAL SCHEMATIC ILLUSTRATION (NON-DIAGNOSTIC)',
        calibrationLabel: 'Theoretical Calibration: 25 mm/s · 10 mm/mV',
        identifyPrompt:
          'Which rhythm or conduction pattern do you identify on this educational schematic?',
        structuredAnalysisTitle: 'Structured Electrocardiographic Analysis',
        exactIdentification: '✓ Accurate Identification',
        expectedAnswer: (ans: string) => `Expected Answer: ${ans}`,
        step1Freq: '1. Heart Rate',
        step2Rhythm: '2. Regularity (R-R)',
        step3PWave: '3. P Wave',
        step4PR: '4. PR Interval',
        step5QRS: '5. QRS Complex',
        semiologyTitle: 'Analytical Semiology of the P-QRS-T Complex',
        semiologySubtitle:
          'Select a wave or segment (P Wave, PR Interval, QRS Complex, ST Segment, T Wave) to review and annotate your lecture criteria.',
        calibrationReminder:
          'Calibration reminder: at 25 mm/s, 1 small square (1 mm) = 0.04 s (40 ms) · 1 large square (5 mm) = 0.20 s (200 ms).',
        selectedSegmentPrefix: 'SELECTED SEGMENT',
        electrophysiologyRecall: 'Electrophysiological Concept',
        personalCourseNotes: (label: string) =>
          `Personal Lecture Notes (${label})`,
        annotateBtn: 'Annotate',
      },
      trackingView: {
        title: 'Cardiology Study Progress Dashboard',
        subtitle:
          'Real-time tracking of your studied topics, understood flashcards, quiz accuracy, and 7-day revision activity.',
        cardsUnderstoodTitle: 'Flashcards Understood',
        cardsNeedsRevisionSub: (count: number) =>
          `${count} card(s) marked "Needs Revision"`,
        quizAccuracyTitle: 'Quiz Accuracy',
        quizAccuracySub: (correct, answered, total) =>
          `${correct}/${answered} correct out of ${total} questions`,
        ecgIdentifiedTitle: 'ECG Cases Identified',
        ecgIdentifiedSub: (count: number) =>
          `${count} schematic tracing(s) analyzed`,
        studyGoalsValidatedTitle: 'Study Goals Completed',
        studyGoalsValidatedSub: 'Topics completed in your study planner',
        weeklyChartTitle: 'Weekly Progress (Last 7 Days)',
        weeklyChartSubtitle:
          'Daily count of flashcards reviewed, quizzes answered, and ECG cases practiced',
        weeklyTooltip: (cards, qcm, ecg) =>
          `${cards} flashcards, ${qcm} quizzes, ${ecg} ECG cases`,
        moduleMasteryTitle: 'Mastery by Cardiology Module (6 Chapters)',
        todayShort: 'Today',
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
    },
    focus: {
      badge: 'Unhurried Productivity · Zero Guilt, Zero Streaks',
      title: 'Focus & Relax',
      subtitle:
        'Study with calm intention, then rest deeply without pressure.',
      completedSessions: 'Completed Sessions:',
      chimeOn: 'Chime On',
      chimeMuted: 'Chime Muted',
      presetFocus: (mins: number) => `${mins}m Focus`,
      presetShortBreak: (mins: number) => `${mins}m Short Break`,
      presetLongBreak: (mins: number) => `${mins}m Long Break`,
      presetCustom: (mins: number) => `Custom (${mins}m)`,
      customMinutesLabel: 'Custom Minutes (1–180):',
      setTimerBtn: 'Set Timer',
      dialStatusFocus: 'Gentle Study Focus',
      dialStatusShortBreak: 'Short Rest Pause',
      dialStatusLongBreak: 'Deep Rest Break',
      dialStatusCustom: 'Custom Session',
      runningStatus: 'In progress...',
      pausedStatus: 'Paused',
      readyStatus: 'Ready when you are',
      startSessionBtn: 'Start Session',
      pauseBtn: 'Pause',
      resumeBtn: 'Resume',
      resetBtn: 'Reset',
      reassuranceNote:
        'No daily streaks or pressure counters here. Every single minute you give to your growth—or to your rest—is worthwhile.',
      checkInsTitle: 'Gentle Body & Mind Check-Ins',
      checkInsSubtitle:
        'Small pauses between chapters to care for yourself',
      hydrateTitle: 'Sip some water or warm herbal tea',
      hydrateSubtitle: (count: number) =>
        `Hydration count today: ${count} glasses`,
      stretchTitle: 'Roll your shoulders back & stretch your neck',
      stretchSubtitle: 'Release tension from leaning over lecture notes',
      eyesTitle: '20-20-20 Eye Rest',
      eyesSubtitle:
        'Look out the window at something 20 feet away for 20 seconds',
      breathingTitle: 'Calm Breathing Pacer',
      breathingSubtitle:
        'Follow the soft circle whenever your heart rate feels rushed',
      tapToBegin: 'Tap below to begin',
      pauseBreathingBtn: 'Pause Breathing Guide',
      startBreathingBtn: 'Start Calm Breathing',
      breathInhale: 'Inhale gently...',
      breathHold: 'Hold softly...',
      breathExhale: 'Exhale slowly...',
      focusCompleteBanner:
        'Focus session complete ♡ Take a slow breath and enjoy a well-deserved rest.',
      breakCompleteBanner:
        'Break timer complete ♡ Return to your studies gently whenever you feel ready.',
    },
    letters: {
      badge: 'Private Correspondence · Personal Sanctuary',
      title: 'A Little Love From Me',
      subtitle:
        '10 sealed “Open When” envelopes, personal love notes, voice messages, and treasured memories together.',
      writeNewLetterBtn: 'Write New Letter',
      openThingsILoveBtn: 'Things I Love About You',
      modalEditTitle: 'Edit Open When Letter',
      modalNewTitle: 'Write an Open When Letter',
      envelopeTitleLabel: 'Envelope Title (“Open when...”)',
      envelopeTitlePlaceholder:
        'e.g., Open when you finish a long hospital shift',
      gentleSubtitleLabel: 'Gentle Subtitle',
      gentleSubtitlePlaceholder: 'e.g., A quiet note for tired evenings',
      letterContentLabel: 'Letter Content',
      letterContentPlaceholder: 'Write your heartfelt letter here...',
      saveLetterBtn: 'Save Letter',
      emptyLettersTitle: 'No Open When letters in your correspondence box',
      emptyLettersSubtitle:
        'Write a new personal letter or restore the initial 10 sample letters.',
      writeFirstLetterBtn: 'Write First Letter',
      restoreSampleLettersBtn: 'Restore 10 Sample Letters',
      sealedEnvelopesHeading: 'Sealed Envelopes',
      letterSingular: 'letter',
      letterPlural: 'letters',
      editLetterBtn: 'Edit Letter',
      breakSealBtn: 'Break Wax Seal & Open Letter',
      resealEnvelopeBtn: 'Fold & Reseal Envelope',
      envelopeSealedCaption: 'Sealed with a wax heart · Click to unfold',
      envelopeOpenedCaption: 'Envelope unfolded · Fine stationery view',
      randomLoveBadge: 'Little Notes From My Heart · Editable Collection',
      randomLoveTitle: 'A Little Reminder For Right Now',
      randomLoveSubtitle:
        'Draw a gentle note whenever you need warmth, or customize the collection.',
      randomLoveBtn: 'Reveal Another Love Note',
      manageLoveMessagesBtn: 'Manage Notes',
      addLoveMessageBtn: 'Add Love Note',
      editLoveMessageTitle: 'Edit Personal Love Note',
      newLoveMessageTitle: 'Add a Personal Love Note',
      loveMessageTextLabel: 'Personal Message for Rania',
      loveMessageTextPlaceholder:
        'e.g., Your effort matters, even when nobody sees it.',
      loveMessageContextLabel: 'Gentle Subtitle / Moment (Optional)',
      loveMessageContextPlaceholder: 'e.g., For quiet study evenings',
      saveLoveMessageBtn: 'Save Love Note',
      restoreLoveMessagesBtn: 'Restore Default Notes',
      voiceBadge: 'Personal Voice Notes & Gentle Lullabies',
      voiceTitle: 'Personal Audio Message Player',
      voiceSubtitle:
        'Upload a personal voice recording, record a message directly in your browser, or edit note titles.',
      uploadAudioBtn: 'Upload Audio File',
      recordVoiceBtn: 'Record Voice Note',
      stopSaveRecordingBtn: 'Stop & Save Recording',
      editVoiceModalTitle: 'Edit Audio Message Details',
      voiceTitleLabel: 'Audio Message Title',
      voiceNoteLabel: 'Personal Transcript / Note',
      saveVoiceBtn: 'Save Audio Details',
      playingStatus: 'Playing',
      pausedStatus: 'Paused',
      restartBtn: 'Restart',
      micUnavailableError:
        'Microphone recording is not available in this browser context. You can upload an audio file instead.',
      micPermissionError:
        'Microphone permission was declined or unavailable. Please use "Upload Audio File" to add a voice note.',
      memoriesBadge: 'Moments Kept Close · Personal Gallery',
      memoriesTitle: 'Photo Memories Gallery',
      addMemoryBtn: 'Add Memory Photo',
      memoryModalEditTitle: 'Edit Memory',
      memoryModalNewTitle: 'Add a Cherished Memory',
      memoryTitleLabel: 'Memory Title',
      memoryTitlePlaceholder: 'e.g., Sunday Coffee by the Window',
      memoryDateLabel: 'Date / Season',
      memoryDatePlaceholder: 'e.g., October Afternoon',
      memoryLocationLabel: 'Location',
      memoryLocationPlaceholder: 'e.g., Botanical Garden',
      uploadPhotoLabel: 'Upload Photo (Saved in Your Sanctuary)',
      choosePhotoBtn: 'Choose Photo From Device',
      photoAttached: '✓ Photo attached',
      storyCaptionLabel: 'Story / Caption',
      storyCaptionPlaceholder: 'Write what made this moment special...',
      saveMemoryBtn: 'Save Memory',
      emptyMemoriesTitle: 'Your memories gallery is empty',
      emptyMemoriesSubtitle:
        'Add a cherished photo from your device or restore the initial sample gallery.',
      restoreSamplePhotosBtn: 'Restore Sample Photos',
      deleteLetterModalTitle: 'Delete Open When Letter?',
      deleteLetterModalMsg: (title: string) =>
        `Are you sure you want to delete "${title}"?`,
      deleteLetterConfirmBtn: 'Delete Letter',
      deleteVoiceModalTitle: 'Delete Voice Recording?',
      deleteVoiceModalMsg: (title: string) =>
        `Are you sure you want to remove "${title}"?`,
      deleteVoiceConfirmBtn: 'Delete Recording',
      deleteMemoryModalTitle: 'Remove Memory Photo?',
      deleteMemoryModalMsg: (title: string) =>
        `Are you sure you want to remove "${title}" from your gallery?`,
      deleteMemoryConfirmBtn: 'Remove Photo',
    },
    thingsILovePage: {
      badge: 'Intimate Monograph · For Rania',
      title: 'Things I Love About You',
      subtitle:
        'Every quiet detail, every kindness, and every reason you mean so much to me.',
      backToLoveBtn: 'Back to A Little Love From Me',
      addQualityBtn: 'Add Something I Love',
      modalEditTitle: 'Edit Reflection',
      modalNewTitle: 'Add Something I Love About Rania',
      qualityTitleLabel: 'What I Love About You',
      qualityTitlePlaceholder: 'e.g., The quiet dedication you bring to medicine',
      qualityCategoryLabel: 'Facet / Chapter',
      qualityCategoryPlaceholder: 'e.g., Your Heart, Your Mind, Little Details',
      qualityDetailLabel: 'Personal Reflection',
      qualityDetailPlaceholder:
        'Write why this detail means so much to you...',
      saveQualityBtn: 'Save to Monograph',
      restoreQualitiesBtn: 'Restore Sample Reflections',
      emptyTitle: 'No reflections in this list yet',
      emptySubtitle:
        'Add your first personal reflection or restore the initial collection.',
      deleteModalTitle: 'Remove This Reflection?',
      deleteModalMsg: (title: string) =>
        `Are you sure you want to remove "${title}"?`,
      deleteConfirmBtn: 'Remove Reflection',
    },
    studySurprise: {
      badge: 'Study Goal Completed · A Little Surprise For You',
      title: 'A Little Note From My Heart ♡',
      completedGoalLabel: 'Completed study goal:',
      fromCreator: 'With all my love, Abd Eldjalil',
      drawAnotherNoteBtn: 'Read Another Note',
      editNoteBtn: 'Edit This Message',
      saveNoteBtn: 'Save Message',
      keepGoingBtn: 'Thank You, My Love ♡',
    },
    garden: {
      badge: 'Private Journal Sanctuary · Protected in Your Sanctuary',
      title: 'My Little Garden',
      subtitle:
        'Plant your daily reflections, quiet gratitude, and personal wins.',
      newEntryBtn: 'New Journal Entry',
      modalEditTitle: 'Edit Garden Reflection',
      modalNewTitle: 'Plant a New Reflection',
      modalSubtitle:
        'Take a slow breath and write only as much as feels comforting today.',
      validationError:
        'Please write at least a gratitude note, a small win, or a daily reflection before saving.',
      moodQuestionLabel: 'How does your heart feel today?',
      entryDateLabel: 'Entry Date',
      gratitudePromptHeading: 'Gentle Gratitude Prompt',
      tryAnotherPromptBtn: 'Try Another Prompt',
      gratitudePlaceholder: 'Write a small moment of gratitude...',
      achievementLabel: 'Personal Achievement / Small Win Today',
      achievementPlaceholder:
        'e.g., Understood heart failure pharmacology, or took a proper evening rest...',
      dailyNotesLabel: 'Daily Notes & Free Reflection',
      dailyNotesPlaceholder:
        'Write freely—your thoughts are safe and private in your sanctuary...',
      saveReflectionBtn: 'Save Reflection',
      allMoodsFilter: (count: number) => `All Moods (${count})`,
      searchPlaceholder: 'Search reflections...',
      emptyTitle: 'Your garden is waiting for its next note',
      emptySubtitle:
        'Write down a small gratitude, a personal achievement, or how you feel today.',
      writeNewEntryBtn: 'Write New Entry',
      restoreSampleEntriesBtn: 'Restore Sample Entries',
      moodLabel: 'Mood:',
      smallWinHeading: 'Small Win Worth Celebrating',
      dailyReflectionHeading: 'Daily Reflection',
      deleteModalTitle: 'Delete Journal Entry?',
      deleteModalMsg: (date: string) =>
        `Are you sure you want to delete your journal reflection from ${date}?`,
      deleteConfirmBtn: 'Delete Reflection',
      moods: {
        Serene: { label: 'Serene', descriptor: 'Calm & unhurried' },
        Grateful: { label: 'Grateful', descriptor: 'Warm & thankful' },
        Focused: { label: 'Focused', descriptor: 'Steady & clear' },
        Hopeful: { label: 'Hopeful', descriptor: 'Looking ahead gently' },
        Loved: { label: 'Loved', descriptor: 'Held & cherished' },
        Tired: { label: 'Tired', descriptor: 'Ready for deep rest' },
        Overwhelmed: {
          label: 'Overwhelmed',
          descriptor: 'Taking one breath at a time',
        },
      },
      gratitudePrompts: [
        'What is one small, quiet moment today that brought a little warmth to your heart?',
        'Which concept or clinical skill did you show up for today, even if it felt challenging?',
        'What is one kind thing you did for your body or mind today?',
        'Who or what made you smile softly this week?',
        'What is a tiny victory from today that deserves gentle recognition?',
      ],
    },
    settings: {
      badge: 'Personalization, Localization & Sanctuary Controls',
      title: 'Settings & Preferences',
      subtitle:
        "Customize Rania's sanctuary, timer defaults, language, and private session.",
      securityTitle: 'Private Passphrase & Server-Protected Sanctuary',
      securityBody:
        'Your sanctuary is protected by server-side cryptographic password verification (scrypt + constant-time comparison), rate limiting, and signed HttpOnly session cookies. Love letters, photos, voice recordings, study topics, and journal entries are stored on the server and never exposed in the browser bundle before unlocking.',
      languageHeading: 'Interface Language (Bilingual System)',
      languageSubtitle:
        'Switch seamlessly between English and French across all navigation, study tools, cardiology modules, and letters. Your selection is remembered automatically after refreshing.',
      englishBtn: 'English',
      frenchBtn: 'Français (French)',
      defaultsHeading: 'Sanctuary & Timer Defaults',
      recipientNameLabel: 'Personalized Greeting Name',
      focusDurationLabel: 'Default Focus Duration (Minutes)',
      shortBreakLabel: 'Default Short Break (Minutes)',
      longBreakLabel: 'Default Long Break (Minutes)',
      savePreferencesBtn: 'Save Preferences',
      backupHeading: 'Data Backup & Reset',
      backupSubtitle:
        'Export a JSON copy of your notes, restore the initial sample data, or clear entries.',
      exportJsonBtn: 'Export Data Backup (.json)',
      restoreSamplesBtn: 'Restore Initial Sample Data',
      clearAllBtn: 'Clear All Lists to Empty',
      confirmResetMsg:
        'Are you sure you want to restore all default sample topics, flashcards, letters, and journal entries?',
      confirmClearMsg:
        'Are you sure you want to clear all study topics and journal entries to start with a blank slate?',
      preferencesSavedBanner:
        'Preferences saved to your protected sanctuary ♡',
      languageUpdatedBanner: 'Language updated to English ♡',
      restoredBanner: 'Restored initial sample data.',
      clearedBanner: 'Cleared study topics and journal entries.',
    },
    toasts: {
      savedToSanctuary: 'Saved to your sanctuary ♡',
      studyGoalUpdated: 'Study goal updated ♡',
      studyGoalAddedToday: 'Study goal added for today ♡',
      studyTopicUpdated: 'Study topic updated in your planner ♡',
      studyTopicAdded: 'New study topic added to your planner ♡',
      studyTopicRemoved: 'Study topic removed from your planner',
      studyTopicsRestored: 'Sample study topics restored ♡',
      topicCompleted: 'Topic marked as completed ♡',
      topicInProgress: 'Topic marked as in progress',
      cardUnderstood: 'Flashcard marked as understood ♡',
      cardNeedsRevision: 'Flashcard added to "Needs Revision"',
      cardUpdated: 'Flashcard updated ♡',
      cardAdded: 'New flashcard added to Cardio Academy ♡',
      cardDeleted: 'Flashcard deleted',
      cardsImported: (count: number) =>
        `${count} flashcard(s) imported from your lecture notes ♡`,
      cardsImportFormatError:
        'Expected format: Question | Answer | Reference (one card per line)',
      cardsRestored: 'Educational flashcards restored ♡',
      quizSelectAtLeastOne:
        'Please select at least one option before submitting',
      quizUpdated: 'Quiz question updated ♡',
      quizAdded: 'New quiz question added to bank ♡',
      quizDeleted: 'Quiz question deleted',
      quizReset: 'Quiz session reset',
      ecgCaseAdded: 'New educational ECG case added ♡',
      ecgAnnotationSaved: 'ECG annotation saved ♡',
      chimeEnabled: 'Completion chime enabled',
      chimeMuted: 'Completion chime muted',
      focusSessionCompleted: 'Focus session completed ♡',
      restBreakCompleted: 'Rest break completed ♡',
      customTimerSet: (mins: number) => `Custom timer set to ${mins} minutes`,
      hydrationLogged: 'Hydration check-in logged ♡',
      letterUpdated: 'Love letter updated ♡',
      letterAdded: 'New love letter sealed & saved ♡',
      letterDeleted: 'Love letter deleted',
      lettersRestored: 'Sample Open When letters restored ♡',
      voiceUploaded: 'Voice recording uploaded ♡',
      voiceRecorded: 'Voice note recorded & saved ♡',
      voiceDeleted: 'Voice recording deleted',
      memoryUpdated: 'Memory updated ♡',
      memoryAdded: 'New memory added to your gallery ♡',
      memoryDeleted: 'Memory photo removed',
      memoriesRestored: 'Sample memories restored ♡',
      journalUpdated: 'Journal reflection updated ♡',
      journalAdded: 'New reflection planted in your Little Garden ♡',
      journalDeleted: 'Journal reflection deleted',
      journalRestored: 'Sample journal reflections restored ♡',
      restoredAllSamples: 'Restored initial sample data ♡',
      clearedAllData: 'Cleared study topics and journal reflections',
      backupDownloaded: 'Backup file downloaded (.json) ♡',
    },
  },

  // ============================================================================
  // FRENCH TRANSLATION (Français — Terminologie Médicale Universitaire Exacte)
  // ============================================================================
  fr: {
    brandName: 'Her Little Heart',
    forRania: 'Pour Rania',
    personalEdition: 'Édition Personnelle',
    privateSanctuaryEdition: 'Édition Sanctuaire Privé',
    tagline: 'Un petit univers créé juste pour toi.',
    secondaryTagline:
      'Étudie doucement. Repose-toi profondément. Sens-toi aimée.',
    creatorCredit: 'Fait avec amour, juste pour toi.',
    welcomeGreeting: 'Bonjour, Rania ♡',
    welcomeSubtext: "J'ai créé ce petit coin d'internet juste pour toi.",
    welcomeBody:
      'Un sanctuaire calme et apaisant pour tes études de troisième année de médecine, tes révisions de cardiologie, tes pauses de repos et chaque rappel de combien tu es aimée à travers la distance.',
    enterWorldBtn: 'Entrer dans mon petit monde',
    exLibris: 'Ex Libris',
    thirdYearMedicine: '3e Année de Médecine',
    nav: {
      home: 'Sanctuaire',
      homeShort: 'Sanctuaire',
      study: 'Espace Étude',
      studyShort: 'Étude',
      cardio: 'Académie Cardio',
      cardioShort: 'Cardio',
      focus: 'Focus & Calme',
      focusShort: 'Focus',
      letters: "Un Peu d'Amour de Ma Part",
      lettersShort: 'Amour',
      thingsILove: "Ce que j'aime chez toi",
      thingsILoveShort: 'Toi',
      garden: 'Petit Jardin',
      gardenShort: 'Jardin',
      settings: 'Paramètres',
      welcome: 'Bienvenue',
      lock: 'Verrouiller',
      lockSanctuary: 'Verrouiller le sanctuaire',
    },
    common: {
      sampleLabel: 'Exemple de démonstration',
      customLabel: 'Note personnelle',
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      edit: 'Modifier',
      delete: 'Supprimer',
      remove: 'Retirer',
      add: 'Ajouter',
      close: 'Fermer',
      dismiss: 'Fermer',
      reset: 'Réinitialiser',
      retry: 'Réessayer',
      clearFilters: 'Effacer les filtres',
      needAHug: "J'ai besoin d'un câlin",
      hugMessage:
        "Respire doucement, mon amour. Tu n'as pas besoin de tout résoudre aujourd'hui. Je suis si fier de toi.",
      hugSubtext:
        "Relâche doucement tes épaules. Inspire profondément pendant quatre secondes, retiens ton souffle avec calme, et laisse cette journée être aussi douce qu'elle doit l'être.",
      hugGentlePause: 'Une Pause Douce',
      playSoothingChime: 'Jouer le carillon apaisant',
      thankYouHug: "Merci, j'en avais besoin ♡",
      today: "Aujourd'hui",
      due: 'Échéance :',
      completed: 'Terminé',
      inProgress: 'En cours',
      sample: 'Exemple',
    },
    login: {
      privateSanctuary: 'Sanctuaire Privé',
      title: 'Un petit secret pour Rania ♡',
      subtitle: 'Ce petit monde est fait juste pour toi.',
      welcomeHome: 'Bienvenue chez toi, Rania ♡',
      openingSanctuary: 'Ouverture de ton sanctuaire...',
      passphraseLabel: 'Phrase secrète',
      passphrasePlaceholder: 'Murmure la phrase secrète...',
      showPassword: 'Afficher le mot de passe',
      hidePassword: 'Masquer le mot de passe',
      errorInvalid: 'Pas tout à fait, mon amour. Réessaie ♡',
      errorRateLimit: (seconds: number) =>
        `Patiente encore ${seconds}s avant de réessayer, mon amour ♡`,
      unlocking: 'Déverrouillage...',
      enterMyWorld: 'Entrer dans mon monde',
    },
    home: {
      forRecipient: (name: string) => `Pour ${name}`,
      welcomeHomeGreeting: (name: string) => `Bienvenue chez toi, ${name} ♡`,
      heroSubtitle:
        'Étudie doucement. Repose-toi profondément. Sens-toi aimée. Tout ici avance à ton propre rythme.',
      beginFocusBtn: (mins: number) => `Lancer ${mins} min de Focus`,
      dailyAffirmation: 'Affirmation du Jour',
      personalNote: 'Note Personnelle',
      editAffirmation: "Modifier l'affirmation",
      saveAffirmation: "Enregistrer l'affirmation",
      oneGentlePage: (name: string) => `Une page douce à la fois, ${name}.`,
      keptInSanctuary: 'Conservé dans ton sanctuaire',
      gentleRestReminder: 'Rappel Doux de Repos',
      waterCheckIns: "Verres d'eau aujourd'hui : ",
      glasses: 'verres',
      sipWaterBtn: "+ Boire de l'eau",
      todaysFocusQueue: 'Programme du Jour',
      todaysStudyGoals: "Objectifs d'Étude du Jour",
      quickAdd: 'Ajout rapide',
      fullStudyPlanner: "Planning d'étude complet",
      quickGoalTitlePlaceholder:
        'ex. Réviser la sémiologie auscultatoire du rétrécissement aortique...',
      quickGoalModulePlaceholder: 'Module (ex. Cardiologie)',
      addGoalBtn: 'Ajouter',
      emptyQueueTitle:
        "Ta liste d'étude est entièrement libre pour aujourd'hui.",
      emptyQueueSubtext:
        'Ajoute un nouveau chapitre ou profite d’une soirée de repos bien méritée.',
      paceLabel: 'Rythme :',
      honestOverview: 'Vue Synthétique',
      studyProgress: "Progression d'Étude",
      studyTopicsCompleted: "Chapitres d'étude validés",
      cardioFlashcardsMastered: 'Fiches de Cardiologie comprises',
      focusSessionsCompleted: 'Sessions Pomodoro terminées',
      featuredLoveNote: "Lettre d'Amour à la Une",
      openEnvelopeLink: "Ouvrir l'enveloppe dans Lettres d'Amour",
      curatedSanctuarySpaces: 'Espaces du Sanctuaire',
      exploreUniverse: 'Explore Ton Petit Univers',
      fiveSpacesSubtitle: 'Cinq espaces pensés pour ton rythme quotidien',
      chapters: {
        studyTitle: 'Mon Espace Étude',
        studySubtitle: (pending: number) =>
          `${pending} sujet(s) en attente · Planning hebdomadaire`,
        cardioTitle: 'Académie Cardio',
        cardioSubtitle: '6 modules · Fiches, QCM & Atelier ECG',
        focusTitle: 'Focus & Calme',
        focusSubtitle: 'Minuteur Pomodoro · Respiration & repos',
        lettersTitle: "Lettres d'Amour",
        lettersSubtitle: 'Lettres « À ouvrir quand » · Audio & souvenirs',
        gardenTitle: 'Mon Petit Jardin',
        gardenSubtitle: 'Journal d’humeur · Gratitude & petites victoires',
      },
      defaultAffirmation:
        "J'apprends à mon propre rythme, construisant mon savoir médical une page douce à la fois, et je suis profondément aimée telle que je suis aujourd'hui.",
      defaultRestReminder:
        "N'oublie pas de relâcher tes épaules, de boire un peu d'eau ou une tisane chaude et d'offrir à tes yeux une vraie pause loin de tes polycopiés.",
    },
    study: {
      badge: 'Planning Médical DFGSM3 · Sauvegardé dans ton Sanctuaire',
      title: 'Mon Espace Étude',
      subtitle:
        'Organise tes cours magistraux, tes stages hospitaliers et tes révisions avec clarté et sérénité.',
      addTopicBtn: "Ajouter un sujet d'étude",
      gentlePaceTracker: 'Suivi à Rythme Doux',
      overallProgress: 'Progression Globale',
      todaysTasks: 'Objectifs du jour :',
      done: 'terminé(s)',
      completedTotal: 'Total complété :',
      of: 'sur',
      weeklyOverview: 'Aperçu Hebdomadaire',
      showAllDays: 'Afficher tous les jours',
      editTopicModalTitle: "Modifier le sujet d'étude",
      addTopicModalTitle: "Ajouter un nouveau sujet d'étude",
      topicTitleLabel: 'Intitulé du cours ou chapitre',
      topicTitlePlaceholder:
        "ex. Synthétiser la physiopathologie de l'insuffisance cardiaque gauche",
      medicalModuleLabel: 'Module Médical',
      medicalModulePlaceholder: 'ex. Cardiologie, Sémiologie...',
      priorityPaceLabel: 'Priorité / Rythme',
      targetDateLabel: "Date d'échéance",
      lectureNotesLabel: 'Notes de cours ou référence de polycopié (Optionnel)',
      lectureNotesPlaceholder:
        'Ajouter le numéro du cours, le chapitre du référentiel ou un rappel...',
      addToPlanBtn: "Ajouter au planning d'étude",
      filterAll: 'Tous les sujets',
      filterToday: "Aujourd'hui",
      filterPending: 'En cours',
      filterCompleted: 'Terminés',
      allPaces: 'Tous les rythmes',
      priorities: {
        High: 'Prioritaire',
        Medium: 'Modéré',
        Gentle: 'Doux',
      },
      searchPlaceholder: 'Rechercher un module ou chapitre...',
      emptyTitle: 'Aucun sujet ne correspond à cette sélection',
      emptyNoTopics:
        "Ton planning d'étude est vide pour le moment. Ajoute ton premier chapitre de cours ou restaure les exemples.",
      emptyFiltered:
        'Essaie de réinitialiser les filtres actifs ou ajoute un nouveau sujet pour cette journée.',
      addNewTopicBtn: 'Ajouter un sujet',
      restoreSampleTopicsBtn: "Restaurer les sujets d'exemple",
      markIncompleteAria: 'Marquer comme en cours',
      markCompletedAria: 'Marquer comme terminé',
      deleteModalTitle: "Supprimer ce sujet d'étude ?",
      deleteModalMessage: (title: string) =>
        `Veux-tu vraiment retirer « ${title} » de ton planning d'étude ?`,
      deleteConfirmBtn: 'Supprimer le sujet',
      defaultModules: [
        'Cardiologie',
        'Sémiologie',
        'Pharmacologie',
        'Pneumologie',
        'Stage Hospitalier',
        'Anatomopathologie',
      ],
    },
    cardio: {
      disclaimerTitle:
        'Usage Exclusivement Pédagogique (DFGSM3 / 3e Année de Médecine) — Non Diagnostique :',
      disclaimerBody1:
        'Cette plateforme est un outil personnel de révision universitaire. Les tracés ECG présentés sont des',
      disclaimerHighlight: 'illustrations schématiques pédagogiques',
      disclaimerBody2:
        'et ne constituent jamais de véritables tracés cliniques diagnostiques.',
      disclaimerSubtext:
        'Ne jamais utiliser cette application pour le diagnostic ou la prise en charge d’un patient. Vérifiez systématiquement chaque notion avec vos cours magistraux de faculté et les référentiels officiels (Collège National des Enseignants de Cardiologie — CNEC).',
      headerBadge:
        'Plateforme de Révision Cardiologique · 3e Année de Médecine',
      title: 'Académie Cardio',
      subtitle:
        '6 modules fondamentaux : Fiches de révision, QCM corrigés, Atelier ECG schématique et Suivi hebdomadaire.',
      tabs: {
        flashcards: 'Fiches de révision',
        quiz: 'QCM',
        ecg: 'Atelier ECG',
        tracking: 'Suivi & Progrès',
      },
      sixModulesHeading: 'Les 6 Modules d’Apprentissage Cardiologique',
      showAllSixModules: 'Afficher les 6 modules',
      modulePrefix: 'Module',
      understoodShort: 'compris',
      needsRevisionShort: 'à revoir',
      categories: {
        'Physiologie cardiaque': 'Physiologie cardiaque',
        'Électrocardiogramme (ECG)': 'Électrocardiogramme (ECG)',
        'Troubles du rythme': 'Troubles du rythme',
        'Insuffisance cardiaque': 'Insuffisance cardiaque',
        Valvulopathies: 'Valvulopathies',
        'Hypertension artérielle': 'Hypertension artérielle',
      },
      flashcardsView: {
        allTitle: 'Toutes les Fiches de Révision',
        categoryTitle: (cat: string) => `Fiches : ${cat}`,
        subtitle:
          'Question au recto · Réponse référencée au verso · Marquez chaque fiche comme « Compris » ou « À revoir »',
        importCoursesBtn: 'Importer mes cours',
        newCardBtn: 'Nouvelle Fiche',
        statusLabel: 'Statut :',
        filterAll: 'Toutes les fiches',
        filterNeedsRevision: 'À revoir',
        filterUnderstood: 'Comprises',
        filterUnseen: 'Non étudiées',
        importModalTitle:
          'Importer des fiches depuis vos cours universitaires',
        importModalSubtitle:
          'Collez vos questions/réponses de faculté au format : Question | Réponse | Référence (une fiche par ligne)',
        importTargetModule: 'Module de destination',
        importDefaultRef: 'Référence du cours par défaut',
        importDefaultRefValue:
          'Notes de cours personnelles (Faculté de Médecine)',
        importTextareaLabel: 'Contenu à importer (une ligne par fiche)',
        importTextareaPlaceholder:
          'Quel est le débit cardiaque normal au repos ? | Environ 5 L/min chez l’adulte (DC = FC x VES). | Cours Hémodynamique\nQuelle est la durée normale du QRS ? | Inférieure à 0,12 seconde (< 120 ms, soit < 3 petits carreaux). | ED ECG Sémiologie',
        importSubmitBtn: 'Importer les fiches',
        cardModalEditTitle: 'Modifier la fiche de révision',
        cardModalNewTitle: 'Créer une fiche de révision cardiologique',
        cardModuleLabel: 'Module de Cardiologie',
        cardRefLabel: 'Référence du cours / Polycopié',
        cardRefPlaceholder: 'ex. Référentiel CNEC · Chapitre 4',
        cardDefaultRefValue:
          'Cours de Cardiologie DFGSM3 · Notes personnelles',
        cardFrontLabel: 'Recto : Question',
        cardFrontPlaceholder:
          'Rédigez la question de sémiologie ou physiopathologie...',
        cardBackLabel: 'Verso : Réponse détaillée & explication',
        cardBackPlaceholder:
          'Rédigez la réponse vérifiée d’après votre cours...',
        saveCardBtn: 'Enregistrer la fiche',
        emptyTitle: 'Aucune fiche dans cette sélection',
        emptySubtitle:
          'Créez une fiche à partir de vos cours de faculté, changez le filtre de statut ou restaurez le paquet initial.',
        viewAllCardsBtn: 'Voir toutes les fiches',
        createCardBtn: 'Créer une fiche',
        restoreSampleCardsBtn: 'Restaurer les fiches initiales',
        sampleBadge: 'Fiche de référence',
        personalBadge: 'Cours perso',
        statusUnderstood: '✓ Compris',
        statusNeedsRevision: 'À revoir',
        statusToStudy: 'À étudier',
        frontHeading: 'Recto · Question',
        backHeading: 'Verso · Réponse & Explication',
        mentalPrompt:
          'Formulez votre réponse mentalement puis cliquez sur « Révéler la réponse ».',
        hideAnswerBtn: 'Masquer la réponse',
        revealAnswerBtn: 'Révéler la réponse',
        markUnderstoodBtn: 'Compris',
        markNeedsRevisionBtn: 'À revoir',
        deleteModalTitle: 'Supprimer cette fiche de révision ?',
        deleteModalMessage: (q: string) =>
          `Voulez-vous vraiment supprimer la fiche « ${q} » ?`,
        deleteConfirmBtn: 'Supprimer la fiche',
      },
      quizView: {
        allTitle: 'Banque de QCM Cardiologie (Choix Simple & Multiple)',
        categoryTitle: (cat: string) => `QCM : ${cat}`,
        subtitle:
          '4 propositions (A, B, C, D) · Une ou plusieurs réponses exactes selon la consigne · Correction détaillée et références',
        showAllQuizzesBtn: 'Afficher tous les QCM',
        reviewMistakesBtn: (count: number) => `Revoir mes erreurs (${count})`,
        resetScoreBtn: 'Réinitialiser le score',
        createQuizBtn: 'Créer un QCM',
        scoreBannerHeading: 'Score d’Auto-Évaluation & Progression',
        scoreLabel: 'Score :',
        correctWord: 'exact(s)',
        scoreStatsSummary: (pct, answered, total, incorrect) =>
          `(${pct}% de réussite · ${answered}/${total} répondu(s)${
            incorrect > 0 ? ` · ${incorrect} erreur(s) à revoir` : ''
          })`,
        validatedCount: (answered, total) =>
          `${answered}/${total} QCM validés`,
        modalEditTitle: 'Modifier le QCM',
        modalNewTitle: 'Ajouter un QCM (Choix simple ou multiple)',
        modalSubtitle:
          'Cochez une seule bonne réponse (QCM simple) ou plusieurs bonnes réponses (QCM à réponses multiples).',
        optionLabel: (letter: string) => `Proposition ${letter}`,
        correctOptionCheckbox: 'Réponse exacte',
        questionPromptLabel: 'Énoncé de la question',
        explanationLabel: 'Explication pédagogique détaillée',
        saveQuizBtn: 'Enregistrer le QCM',
        emptyNoMistakesTitle: 'Aucune erreur à revoir dans ce module !',
        emptyNoQuizzesTitle: 'Aucun QCM dans ce module pour le moment',
        emptyNoMistakesSubtitle:
          'Toutes vos réponses validées dans ce module sont exactes.',
        emptyNoQuizzesSubtitle:
          'Ajoutez un QCM personnalisé depuis vos annales de faculté ou restaurez la banque initiale.',
        backToAllQuizzesBtn: 'Retourner à tous les QCM',
        multipleChoiceBadge: 'Choix multiple (1 ou plusieurs réponses)',
        singleChoiceBadge: 'Choix unique (1 seule réponse)',
        validateAnswerBtn: (count: number) =>
          `Valider ma réponse (${count} sélectionnée${count > 1 ? 's' : ''})`,
        correctFeedback: '✓ Réponse exacte !',
        incorrectFeedback: (expectedLetters: string) =>
          `À revoir · Réponse(s) exacte(s) : ${expectedLetters}`,
        deleteModalTitle: 'Supprimer ce QCM ?',
        deleteModalMessage: (q: string) =>
          `Voulez-vous vraiment supprimer la question « ${q} » ?`,
        deleteConfirmBtn: 'Supprimer le QCM',
      },
      ecgView: {
        badge:
          'Entraînement Sémiologique · Schémas Pédagogiques Non Diagnostiques',
        title: 'Identification Interactive du Rythme ECG',
        subtitle:
          'Observez l’illustration schématique ci-dessous, identifiez le rythme puis consultez l’analyse systématique (Fréquence, Rythme, Onde P, PR, QRS).',
        addCaseBtn: 'Ajouter un Cas ECG',
        modalTitle: 'Ajouter un cas pédagogique d’étude ECG',
        caseTitleLabel: 'Titre du cas pédagogique',
        caseTitlePlaceholder: 'ex. Cas ED n°6 — Analyse de rythme',
        schematicPatternLabel: 'Modèle schématique illustratif',
        patterns: {
          sinus: 'Schéma : Rythme sinusal',
          afib: 'Schéma : Fibrillation atriale',
          flutter: 'Schéma : Flutter atrial',
          bav1: 'Schéma : BAV 1er degré',
          esv: 'Schéma : Extrasystole ventriculaire',
        },
        optionLabel: (letter: string) => `Option ${letter}`,
        correctRadio: 'Correct',
        freqPlaceholder: 'Fréquence (ex. 75/min)',
        pWavePlaceholder: 'Onde P (ex. Positive en DII)',
        qrsPlaceholder: 'QRS (ex. Fins < 0,12 s)',
        explanationPlaceholder:
          'Explication pédagogique détaillée du tracé...',
        saveCaseBtn: 'Enregistrer le cas',
        casePillLabel: (idx: number) => `Cas n°${idx}`,
        schematicWarningBadge:
          'ILLUSTRATION SCHÉMATIQUE PÉDAGOGIQUE (NON DIAGNOSTIQUE)',
        calibrationLabel: 'Étalonnage théorique : 25 mm/s · 10 mm/mV',
        identifyPrompt:
          'Quel rythme ou trouble de la conduction identifiez-vous sur ce schéma pédagogique ?',
        structuredAnalysisTitle:
          'Analyse Électrocardiographique Structurée',
        exactIdentification: '✓ Identification exacte',
        expectedAnswer: (ans: string) => `Réponse attendue : ${ans}`,
        step1Freq: '1. Fréquence',
        step2Rhythm: '2. Régularité (R-R)',
        step3PWave: '3. Onde P',
        step4PR: '4. Espace PR',
        step5QRS: '5. Complexe QRS',
        semiologyTitle: 'Sémiologie Analytique du Complexe P-QRS-T',
        semiologySubtitle:
          'Sélectionnez un segment (Onde P, Intervalle PR, Complexe QRS, Segment ST, Onde T) pour réviser et annoter vos critères de cours.',
        calibrationReminder:
          'Rappel d’étalonnage : à 25 mm/s, 1 petit carreau (1 mm) = 0,04 s (40 ms) · 1 grand carreau (5 mm) = 0,20 s (200 ms).',
        selectedSegmentPrefix: 'SEGMENT SÉLECTIONNÉ',
        electrophysiologyRecall: 'Rappel électrophysiologique',
        personalCourseNotes: (label: string) =>
          `Notes personnelles de cours (${label})`,
        annotateBtn: 'Annoter',
      },
      trackingView: {
        title: 'Tableau de Bord de Progression Cardiologique',
        subtitle:
          'Suivi réel de vos chapitres étudiés, fiches comprises, scores aux QCM et activité des 7 derniers jours.',
        cardsUnderstoodTitle: 'Fiches Comprises',
        cardsNeedsRevisionSub: (count: number) =>
          `${count} fiche(s) marquée(s) « À revoir »`,
        quizAccuracyTitle: 'Réussite aux QCM',
        quizAccuracySub: (correct, answered, total) =>
          `${correct}/${answered} QCM exacts sur ${total}`,
        ecgIdentifiedTitle: 'Cas ECG Identifiés',
        ecgIdentifiedSub: (count: number) =>
          `${count} tracé(s) schématique(s) analysé(s)`,
        studyGoalsValidatedTitle: 'Objectifs d’Étude Validés',
        studyGoalsValidatedSub: 'Chapitres complétés dans votre planning',
        weeklyChartTitle: 'Progression Hebdomadaire (7 derniers jours)',
        weeklyChartSubtitle:
          'Nombre quotidien de fiches révisées, QCM validés et cas ECG pratiqués',
        weeklyTooltip: (cards, qcm, ecg) =>
          `${cards} fiches, ${qcm} QCM, ${ecg} ECG`,
        moduleMasteryTitle: 'Maîtrise par Module (6 chapitres)',
        todayShort: 'Auj.',
        dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      },
    },
    focus: {
      badge: 'Productivité Apaisée · Sans Culpabilité, Sans Pression',
      title: 'Focus & Calme',
      subtitle:
        'Étudie avec une attention calme, puis repose-toi profondément sans culpabilité.',
      completedSessions: 'Sessions terminées :',
      chimeOn: 'Carillon activé',
      chimeMuted: 'Carillon muet',
      presetFocus: (mins: number) => `Focus ${mins} min`,
      presetShortBreak: (mins: number) => `Pause courte ${mins} min`,
      presetLongBreak: (mins: number) => `Pause longue ${mins} min`,
      presetCustom: (mins: number) => `Personnalisé (${mins} min)`,
      customMinutesLabel: 'Minutes personnalisées (1–180) :',
      setTimerBtn: 'Appliquer',
      dialStatusFocus: "Concentration d'Étude Douce",
      dialStatusShortBreak: 'Courte Pause Respiratoire',
      dialStatusLongBreak: 'Pause de Repos Profond',
      dialStatusCustom: 'Session Personnalisée',
      runningStatus: 'En cours...',
      pausedStatus: 'En pause',
      readyStatus: 'Prêt quand tu l’es',
      startSessionBtn: 'Démarrer la session',
      pauseBtn: 'Pause',
      resumeBtn: 'Reprendre',
      resetBtn: 'Réinitialiser',
      reassuranceNote:
        'Aucun compteur de série punitive ici. Chaque minute que tu consacres à ton apprentissage — ou à ton repos — est précieuse.',
      checkInsTitle: 'Rappels Doux Corps & Esprit',
      checkInsSubtitle:
        'De petites pauses entre deux chapitres pour prendre soin de toi',
      hydrateTitle: "Boire un verre d'eau ou une tisane chaude",
      hydrateSubtitle: (count: number) =>
        `Hydratation aujourd'hui : ${count} verres`,
      stretchTitle: 'Relâcher les épaules & étirer doucement la nuque',
      stretchSubtitle:
        'Libérer les tensions accumulées devant les polycopiés',
      eyesTitle: 'Repos visuel 20-20-20',
      eyesSubtitle:
        'Regarder au loin par la fenêtre pendant 20 secondes pour reposer la rétine',
      breathingTitle: 'Guide de Respiration Apaisante',
      breathingSubtitle:
        'Suis le cercle lumineux dès que ton rythme cardiaque s’accélère',
      tapToBegin: 'Appuie ci-dessous pour commencer',
      pauseBreathingBtn: 'Mettre en pause le guide',
      startBreathingBtn: 'Démarrer la respiration calme',
      breathInhale: 'Inspire doucement...',
      breathHold: 'Retiens calmement...',
      breathExhale: 'Expire lentement...',
      focusCompleteBanner:
        'Session de concentration terminée ♡ Prends une grande inspiration et profite d’un repos bien mérité.',
      breakCompleteBanner:
        'Pause terminée ♡ Reprends tes révisions en douceur dès que tu te sens prête.',
    },
    letters: {
      badge: 'Correspondance Privée · Sanctuaire Personnel',
      title: "Un Peu d'Amour de Ma Part",
      subtitle:
        '10 enveloppes cachetées « À ouvrir quand… », mots doux personnels, messages vocaux et précieux souvenirs.',
      writeNewLetterBtn: 'Écrire une lettre',
      openThingsILoveBtn: "Ce que j'aime chez toi",
      modalEditTitle: 'Modifier la lettre « À ouvrir quand… »',
      modalNewTitle: 'Écrire une lettre « À ouvrir quand… »',
      envelopeTitleLabel: 'Titre de l’enveloppe (« À ouvrir quand… »)',
      envelopeTitlePlaceholder:
        'ex. À ouvrir quand tu termines une longue garde à l’hôpital',
      gentleSubtitleLabel: 'Sous-titre doux',
      gentleSubtitlePlaceholder:
        'ex. Un mot calme pour les soirées de fatigue',
      letterContentLabel: 'Contenu de la lettre',
      letterContentPlaceholder: 'Écris ta lettre avec tout ton cœur...',
      saveLetterBtn: 'Enregistrer la lettre',
      emptyLettersTitle:
        'Aucune lettre « À ouvrir quand » dans ton coffret',
      emptyLettersSubtitle:
        'Écris une nouvelle lettre personnelle ou restaure les 10 lettres initiales.',
      writeFirstLetterBtn: 'Écrire une première lettre',
      restoreSampleLettersBtn: 'Restaurer les 10 lettres initiales',
      sealedEnvelopesHeading: 'Enveloppes Cachetées',
      letterSingular: 'lettre',
      letterPlural: 'lettres',
      editLetterBtn: 'Modifier la lettre',
      breakSealBtn: 'Briser le sceau de cire & ouvrir la lettre',
      resealEnvelopeBtn: 'Replier & recacheter l’enveloppe',
      envelopeSealedCaption: 'Cachetée d’un cœur de cire · Cliquer pour déplier',
      envelopeOpenedCaption: 'Enveloppe dépliée · Papier à lettres',
      randomLoveBadge: 'Petits Mots de Mon Cœur · Collection Modifiable',
      randomLoveTitle: 'Un Petit Mot Doux Pour Cet Instant',
      randomLoveSubtitle:
        'Tire un mot doux dès que tu as besoin de réconfort, ou personnalise les messages.',
      randomLoveBtn: 'Tirer un autre mot d’amour',
      manageLoveMessagesBtn: 'Gérer les mots doux',
      addLoveMessageBtn: 'Ajouter un mot doux',
      editLoveMessageTitle: 'Modifier ce mot d’amour',
      newLoveMessageTitle: 'Ajouter un mot d’amour personnel',
      loveMessageTextLabel: 'Message personnel pour Rania',
      loveMessageTextPlaceholder:
        'ex. Tes efforts comptent, même quand personne ne les voit.',
      loveMessageContextLabel: 'Sous-titre / Moment (Optionnel)',
      loveMessageContextPlaceholder: 'ex. Pour tes soirées de révision',
      saveLoveMessageBtn: 'Enregistrer le mot doux',
      restoreLoveMessagesBtn: 'Restaurer les mots initiaux',
      voiceBadge: 'Notes Vocales Personnelles & Berceuses Douces',
      voiceTitle: 'Lecteur de Messages Audio Personnels',
      voiceSubtitle:
        'Importe un enregistrement vocal personnel, enregistre un message depuis ton navigateur ou modifie les notes.',
      uploadAudioBtn: 'Importer un fichier audio',
      recordVoiceBtn: 'Enregistrer une note vocale',
      stopSaveRecordingBtn: 'Arrêter & enregistrer',
      editVoiceModalTitle: 'Modifier les détails du message audio',
      voiceTitleLabel: 'Titre du message audio',
      voiceNoteLabel: 'Note personnelle / Transcription',
      saveVoiceBtn: 'Enregistrer',
      playingStatus: 'Lecture en cours',
      pausedStatus: 'En pause',
      restartBtn: 'Recommencer',
      micUnavailableError:
        "L'enregistrement au microphone n'est pas disponible dans ce contexte. Tu peux importer un fichier audio à la place.",
      micPermissionError:
        'Accès au microphone refusé ou indisponible. Utilise « Importer un fichier audio » pour ajouter une note vocale.',
      memoriesBadge: 'Instants Précieux · Galerie Personnelle',
      memoriesTitle: 'Galerie Photos de Souvenirs',
      addMemoryBtn: 'Ajouter une photo souvenir',
      memoryModalEditTitle: 'Modifier le souvenir',
      memoryModalNewTitle: 'Ajouter un précieux souvenir',
      memoryTitleLabel: 'Titre du souvenir',
      memoryTitlePlaceholder: 'ex. Café du dimanche matin',
      memoryDateLabel: 'Date / Saison',
      memoryDatePlaceholder: 'ex. Après-midi d’octobre',
      memoryLocationLabel: 'Lieu',
      memoryLocationPlaceholder: 'ex. Jardin botanique',
      uploadPhotoLabel: 'Importer une photo (Sauvegardée dans ton sanctuaire)',
      choosePhotoBtn: 'Choisir une photo sur l’appareil',
      photoAttached: '✓ Photo jointe',
      storyCaptionLabel: 'Histoire / Légende',
      storyCaptionPlaceholder: 'Raconte ce qui a rendu ce moment unique...',
      saveMemoryBtn: 'Enregistrer le souvenir',
      emptyMemoriesTitle: 'Ta galerie de souvenirs est vide',
      emptyMemoriesSubtitle:
        'Ajoute une photo depuis ton appareil ou restaure la galerie initiale.',
      restoreSamplePhotosBtn: 'Restaurer les photos initiales',
      deleteLetterModalTitle: 'Supprimer cette lettre ?',
      deleteLetterModalMsg: (title: string) =>
        `Veux-tu vraiment supprimer « ${title} » ?`,
      deleteLetterConfirmBtn: 'Supprimer la lettre',
      deleteVoiceModalTitle: 'Supprimer cet enregistrement vocal ?',
      deleteVoiceModalMsg: (title: string) =>
        `Veux-tu vraiment supprimer « ${title} » ?`,
      deleteVoiceConfirmBtn: "Supprimer l'enregistrement",
      deleteMemoryModalTitle: 'Retirer cette photo souvenir ?',
      deleteMemoryModalMsg: (title: string) =>
        `Veux-tu vraiment retirer « ${title} » de ta galerie ?`,
      deleteMemoryConfirmBtn: 'Retirer la photo',
    },
    thingsILovePage: {
      badge: 'Monographie Intime · Pour Rania',
      title: "Ce que j'aime chez toi",
      subtitle:
        'Chaque détail silencieux, chaque geste de douceur et chaque raison pour laquelle tu comptes tant pour moi.',
      backToLoveBtn: "Retour à Un Peu d'Amour de Ma Part",
      addQualityBtn: "Ajouter ce que j'aime",
      modalEditTitle: 'Modifier cette note',
      modalNewTitle: "Ajouter ce que j'aime chez Rania",
      qualityTitleLabel: "Ce que j'aime chez toi",
      qualityTitlePlaceholder:
        'ex. Ta persévérance silencieuse dans tes études de médecine',
      qualityCategoryLabel: 'Facette / Chapitre',
      qualityCategoryPlaceholder: 'ex. Ton Cœur, Ton Esprit, Petits Détails',
      qualityDetailLabel: 'Réflexion personnelle',
      qualityDetailPlaceholder:
        'Écris pourquoi ce détail compte tant pour toi...',
      saveQualityBtn: 'Enregistrer',
      restoreQualitiesBtn: 'Restaurer la collection initiale',
      emptyTitle: 'Aucune note dans cette liste pour le moment',
      emptySubtitle:
        'Ajoute ta première note personnelle ou restaure la collection initiale.',
      deleteModalTitle: 'Retirer cette note ?',
      deleteModalMsg: (title: string) =>
        `Veux-tu vraiment retirer « ${title} » ?`,
      deleteConfirmBtn: 'Retirer la note',
    },
    studySurprise: {
      badge: "Objectif d'Étude Validé · Une Petite Surprise Pour Toi",
      title: 'Un Petit Mot de Mon Cœur ♡',
      completedGoalLabel: "Objectif d'étude terminé :",
      fromCreator: 'Avec tout mon amour, Abd Eldjalil',
      drawAnotherNoteBtn: 'Lire un autre mot doux',
      editNoteBtn: 'Modifier ce message',
      saveNoteBtn: 'Enregistrer le message',
      keepGoingBtn: 'Merci, mon amour ♡',
    },
    garden: {
      badge: 'Journal Intime Privé · Protégé dans ton Sanctuaire',
      title: 'Mon Petit Jardin',
      subtitle:
        'Plante tes réflexions du jour, ta gratitude silencieuse et tes petites victoires.',
      newEntryBtn: 'Nouvelle note de journal',
      modalEditTitle: 'Modifier la réflexion du jardin',
      modalNewTitle: 'Planter une nouvelle réflexion',
      modalSubtitle:
        'Prends une lente inspiration et écris uniquement ce qui te fait du bien aujourd’hui.',
      validationError:
        'Merci d’écrire au moins une note de gratitude, une petite victoire ou une réflexion avant d’enregistrer.',
      moodQuestionLabel: 'Comment se sent ton cœur aujourd’hui ?',
      entryDateLabel: 'Date de la note',
      gratitudePromptHeading: 'Invitation Douce à la Gratitude',
      tryAnotherPromptBtn: 'Autre question',
      gratitudePlaceholder: 'Écris un petit instant de gratitude...',
      achievementLabel: 'Accomplissement Personnel / Petite Victoire du Jour',
      achievementPlaceholder:
        'ex. Compris la pharmacologie de l’insuffisance cardiaque, ou pris une vraie soirée de repos...',
      dailyNotesLabel: 'Notes du Jour & Réflexion Libre',
      dailyNotesPlaceholder:
        'Écris librement — tes pensées sont en sécurité dans ton sanctuaire privé...',
      saveReflectionBtn: 'Enregistrer la réflexion',
      allMoodsFilter: (count: number) => `Toutes les humeurs (${count})`,
      searchPlaceholder: 'Rechercher dans tes réflexions...',
      emptyTitle: 'Ton jardin attend sa prochaine note',
      emptySubtitle:
        'Note une petite gratitude, une victoire personnelle ou comment tu te sens aujourd’hui.',
      writeNewEntryBtn: 'Écrire une note',
      restoreSampleEntriesBtn: "Restaurer les notes d'exemple",
      moodLabel: 'Humeur :',
      smallWinHeading: 'Petite Victoire à Célébrer',
      dailyReflectionHeading: 'Réflexion du Jour',
      deleteModalTitle: 'Supprimer cette note du journal ?',
      deleteModalMsg: (date: string) =>
        `Veux-tu vraiment supprimer ta réflexion du ${date} ?`,
      deleteConfirmBtn: 'Supprimer la réflexion',
      moods: {
        Serene: { label: 'Sereine', descriptor: 'Calme & apaisée' },
        Grateful: {
          label: 'Reconnaissante',
          descriptor: 'Chaleureuse & touchée',
        },
        Focused: { label: 'Concentrée', descriptor: 'Stable & lucide' },
        Hopeful: {
          label: 'Confiante',
          descriptor: 'Tournée doucement vers demain',
        },
        Loved: { label: 'Aimée', descriptor: 'Entourée & chérie' },
        Tired: { label: 'Fatiguée', descriptor: 'Prête pour un doux repos' },
        Overwhelmed: {
          label: 'Submergée',
          descriptor: 'Une respiration à la fois',
        },
      },
      gratitudePrompts: [
        'Quel petit moment calme aujourd’hui a apporté un peu de douceur à ton cœur ?',
        'Pour quelle notion médicale ou compétence clinique as-tu persévéré aujourd’hui, même si c’était difficile ?',
        'Quel geste bienveillant as-tu accompli pour ton corps ou ton esprit aujourd’hui ?',
        'Qui ou quoi t’a fait sourire tendrement cette semaine ?',
        'Quelle petite victoire d’aujourd’hui mérite d’être reconnue avec douceur ?',
      ],
    },
    settings: {
      badge: 'Personnalisation, Langue & Contrôles du Sanctuaire',
      title: 'Paramètres & Préférences',
      subtitle:
        'Personnalise le sanctuaire de Rania, les durées du minuteur, la langue et la session privée.',
      securityTitle: 'Phrase Secrète Privée & Sanctuaire Protégé côté Serveur',
      securityBody:
        'Ton sanctuaire est protégé par une vérification cryptographique côté serveur (scrypt + comparaison à temps constant), une limitation des tentatives et des cookies de session HttpOnly signés. Les lettres d’amour, photos, notes vocales, sujets d’étude et entrées de journal sont stockés sur le serveur et ne sont jamais exposés avant le déverrouillage.',
      languageHeading: 'Langue de l’Interface (Système Bilingue)',
      languageSubtitle:
        'Bascule instantanément entre l’anglais et le français pour toute la navigation, le planning d’étude, les modules de cardiologie et les lettres. Ton choix est mémorisé après actualisation.',
      englishBtn: 'English (Anglais)',
      frenchBtn: 'Français',
      defaultsHeading: 'Paramètres par Défaut du Sanctuaire & du Minuteur',
      recipientNameLabel: 'Prénom affiché pour l’accueil personnalisé',
      focusDurationLabel: 'Durée de concentration par défaut (Minutes)',
      shortBreakLabel: 'Durée de pause courte par défaut (Minutes)',
      longBreakLabel: 'Durée de pause longue par défaut (Minutes)',
      savePreferencesBtn: 'Enregistrer les préférences',
      backupHeading: 'Sauvegarde & Réinitialisation des Données',
      backupSubtitle:
        'Exporte une copie JSON de tes notes, restaure les exemples initiaux ou vide les listes.',
      exportJsonBtn: 'Exporter une sauvegarde (.json)',
      restoreSamplesBtn: 'Restaurer les données initiales',
      clearAllBtn: 'Vider toutes les listes',
      confirmResetMsg:
        'Veux-tu vraiment restaurer tous les sujets d’étude, fiches de cardiologie, lettres et notes de journal par défaut ?',
      confirmClearMsg:
        'Veux-tu vraiment effacer tous les sujets d’étude et les notes du journal pour repartir d’une page blanche ?',
      preferencesSavedBanner:
        'Préférences enregistrées dans ton sanctuaire protégé ♡',
      languageUpdatedBanner: 'Langue mise à jour en Français ♡',
      restoredBanner: 'Données initiales restaurées.',
      clearedBanner: "Sujets d'étude et notes du journal effacés.",
    },
    toasts: {
      savedToSanctuary: 'Enregistré dans ton sanctuaire ♡',
      studyGoalUpdated: "Objectif d'étude mis à jour ♡",
      studyGoalAddedToday: "Objectif d'étude ajouté pour aujourd'hui ♡",
      studyTopicUpdated: "Sujet d'étude mis à jour dans ton planning ♡",
      studyTopicAdded: "Nouveau sujet d'étude ajouté à ton planning ♡",
      studyTopicRemoved: "Sujet d'étude retiré de ton planning",
      studyTopicsRestored: "Sujets d'étude d'exemple restaurés ♡",
      topicCompleted: 'Chapitre marqué comme terminé ♡',
      topicInProgress: 'Chapitre marqué comme en cours',
      cardUnderstood: 'Fiche marquée comme comprise ♡',
      cardNeedsRevision: 'Fiche ajoutée à la liste « À revoir »',
      cardUpdated: 'Fiche de révision mise à jour ♡',
      cardAdded: 'Nouvelle fiche ajoutée à Académie Cardio ♡',
      cardDeleted: 'Fiche supprimée',
      cardsImported: (count: number) =>
        `${count} fiche(s) importée(s) depuis vos cours ♡`,
      cardsImportFormatError:
        'Format attendu : Question | Réponse | Référence (une fiche par ligne)',
      cardsRestored: 'Fiches pédagogiques restaurées ♡',
      quizSelectAtLeastOne:
        'Sélectionnez au moins une proposition avant de valider',
      quizUpdated: 'QCM mis à jour ♡',
      quizAdded: 'Nouveau QCM ajouté à la banque ♡',
      quizDeleted: 'QCM supprimé',
      quizReset: 'Session de QCM réinitialisée',
      ecgCaseAdded: 'Nouveau cas pédagogique ECG ajouté ♡',
      ecgAnnotationSaved: 'Annotation ECG enregistrée ♡',
      chimeEnabled: 'Carillon de fin activé',
      chimeMuted: 'Carillon de fin désactivé',
      focusSessionCompleted: 'Session de concentration terminée ♡',
      restBreakCompleted: 'Pause de repos terminée ♡',
      customTimerSet: (mins: number) =>
        `Minuteur personnalisé réglé sur ${mins} minutes`,
      hydrationLogged: "Verre d'eau noté ♡",
      letterUpdated: "Lettre d'amour mise à jour ♡",
      letterAdded: "Nouvelle lettre d'amour cachetée et enregistrée ♡",
      letterDeleted: "Lettre d'amour supprimée",
      lettersRestored: 'Lettres « À ouvrir quand » restaurées ♡',
      voiceUploaded: 'Enregistrement vocal importé ♡',
      voiceRecorded: 'Note vocale enregistrée ♡',
      voiceDeleted: 'Enregistrement vocal supprimé',
      memoryUpdated: 'Souvenir mis à jour ♡',
      memoryAdded: 'Nouveau souvenir ajouté à ta galerie ♡',
      memoryDeleted: 'Photo souvenir retirée',
      memoriesRestored: 'Photos souvenirs restaurées ♡',
      journalUpdated: 'Réflexion du journal mise à jour ♡',
      journalAdded: 'Nouvelle réflexion plantée dans ton Petit Jardin ♡',
      journalDeleted: 'Réflexion supprimée du journal',
      journalRestored: 'Réflexions du journal restaurées ♡',
      restoredAllSamples: 'Données initiales restaurées ♡',
      clearedAllData: "Sujets d'étude et réflexions du journal effacés",
      backupDownloaded: 'Fichier de sauvegarde téléchargé (.json) ♡',
    },
  },
};

// ============================================================================
// BILINGUAL SAMPLE CONTENT DICTIONARIES (English & French Medical Terminology)
// ============================================================================
const EN_STUDY_TOPICS_MAP: Record<
  string,
  { title: string; module: string; notes: string }
> = {
  'st-1': {
    title: 'Review phases of the cardiac cycle and Wiggers diagram',
    module: 'Cardiac Physiology',
    notes:
      'Educational sample — verify left ventricular pressure-volume loops with your physiology lecture notes.',
  },
  'st-2': {
    title: 'Practice systematic ECG interpretation (rate, rhythm, QRS axis)',
    module: 'Electrocardiogram (ECG)',
    notes:
      'Educational sample — review frontal plane electrical axis calculation using leads I and aVF.',
  },
  'st-3': {
    title: 'Summarize cardiac auscultation landmarks and murmur radiation',
    module: 'Valvular Heart Disease',
    notes:
      'Educational sample — prepare clinical semiology summary sheet for hospital rotation.',
  },
  'st-4': {
    title: 'Review RAAS pathophysiology and antihypertensive drug classes',
    module: 'Arterial Hypertension',
    notes:
      'Educational sample — map pharmacological targets (ACE inhibitors, ARBs, CCBs, thiazide diuretics).',
  },
  'st-5': {
    title: 'Gentle revision of left-sided vs. right-sided heart failure semiology',
    module: 'Heart Failure',
    notes:
      'Educational sample — compare functional symptoms and physical examination signs.',
  },
  'st-6': {
    title:
      'Differentiate atrial fibrillation, atrial flutter, and AV blocks on schematic tracings',
    module: 'Cardiac Arrhythmias',
    notes: 'Educational sample — prepare for rhythmology tutorial session.',
  },
};

const EN_FLASHCARDS_MAP: Record<
  string,
  { question: string; answer: string; lectureRef: string }
> = {
  'fc-1': {
    question:
      'What does the Frank-Starling law of the heart state regarding ventricular mechanics?',
    answer:
      'The Frank-Starling law describes the intrinsic property of the myocardium whereby an increase in ventricular end-diastolic volume (preload / initial sarcomere stretch) leads to an increase in ventricular contraction force and stroke volume (SV), within physiological limits.',
    lectureRef:
      'Reference: Cardiovascular Physiology (3rd-Year Medicine) · Hemodynamics & Starling Law',
  },
  'fc-2': {
    question:
      'Which mechanical valvular events correspond to the physiological heart sounds S1 (B1) and S2 (B2) on auscultation?',
    answer:
      '• S1 (first heart sound) corresponds to the closure of the atrioventricular valves (mitral and tricuspid) at the onset of isovolumetric contraction (beginning of ventricular systole).\n• S2 (second heart sound) corresponds to the closure of the semilunar valves (aortic and pulmonic) at the end of ventricular ejection (beginning of isovolumetric relaxation / diastole).',
    lectureRef:
      'Reference: Cardiovascular Semiology · National College of Cardiology Educators',
  },
  'fc-3': {
    question:
      'What is the electrophysiological significance of the P wave, PR interval, QRS complex, and T wave on a surface ECG?',
    answer:
      '• P wave: depolarization of the right and left atria originating from the sinoatrial (SA) node.\n• PR interval (0.12 to 0.20 s): atrioventricular conduction time (atrial depolarization + AV nodal delay + His-Purkinje conduction).\n• QRS complex (< 0.12 s): rapid depolarization of the right and left ventricles.\n• T wave: ventricular repolarization.',
    lectureRef:
      'Reference: Normal Electrocardiography · 3rd-Year Medical Curriculum',
  },
  'fc-4': {
    question:
      'On standard ECG paper running at 25 mm/s with 10 mm/mV calibration, what do 1 small square (1 mm) and 1 large square (5 mm) represent in duration and amplitude?',
    answer:
      '• Horizontal axis (time at 25 mm/s): 1 small square (1 mm) = 0.04 s (40 ms); 1 large square (5 mm) = 0.20 s (200 ms); 5 large squares = 1 second.\n• Vertical axis (voltage at 10 mm/mV): 1 small square (1 mm) = 0.1 mV; 10 mm = 1 mV.',
    lectureRef:
      'Reference: Systematic ECG Interpretation · Cardiovascular Semiology',
  },
  'fc-5': {
    question:
      'What are the cardinal electrocardiographic criteria for identifying atrial fibrillation (AF)?',
    answer:
      '1. Absence of distinct, organized sinus P waves across all leads.\n2. Irregular undulation of the isoelectric baseline (rapid fibrillatory f waves at 400–600/min of varying morphology and amplitude).\n3. Irregularly irregular ventricular rhythm (constantly varying R-R intervals), typically with narrow QRS complexes unless bundle branch block or aberrancy is present.',
    lectureRef:
      'Reference: Atrial Fibrillation — ECG Semiology · ESC / Cardiology Syllabus',
  },
  'fc-6': {
    question:
      'How do you distinguish 1st-degree, 2nd-degree (Mobitz I vs. Mobitz II), and 3rd-degree atrioventricular (AV) blocks on an ECG?',
    answer:
      '• 1st-degree AV block: constant prolongation of the PR interval > 0.20 s (200 ms) with 1:1 AV conduction (no dropped P waves).\n• 2nd-degree Mobitz I (Wenckebach): progressive lengthening of the PR interval until a P wave is non-conducted.\n• 2nd-degree Mobitz II: intermittent non-conducted P waves with a constant PR interval in conducted beats.\n• 3rd-degree (complete) AV block: complete atrioventricular dissociation (atria and ventricles beat independently; slow regular escape rhythm).',
    lectureRef:
      'Reference: Intracardiac Conduction Disorders · Cardiology Curriculum',
  },
  'fc-7': {
    question:
      'What are the primary clinical semiology signs distinguishing left-sided heart failure from right-sided heart failure?',
    answer:
      '• Left-sided heart failure (pulmonary venous congestion upstream of the LV): exertional dyspnea, orthopnea, paroxysmal nocturnal dyspnea (PND), bilateral basilar pulmonary crackles (rales), S3 gallop.\n• Right-sided heart failure (systemic venous congestion upstream of the RV): jugular venous distension (JVD), positive hepatojugular reflux, tender hepatomegaly, bilateral dependent pitting peripheral edema.',
    lectureRef:
      'Reference: Heart Failure Semiology · 3rd-Year Medical Curriculum',
  },
  'fc-8': {
    question:
      'What is the auscultatory timing (systolic vs. diastolic) of the 4 major left-sided valvular heart diseases (AS, MR, AR, MS)?',
    answer:
      '• Systolic murmurs: Aortic Stenosis (AS: harsh crescendo-decrescendo midsystolic ejection murmur radiating to the carotids) and Mitral Regurgitation (MR: blowing holosystolic murmur at the apex radiating to the axilla).\n• Diastolic murmurs: Aortic Regurgitation (AR: high-pitched blowing early diastolic decrescendo murmur along the left sternal border) and Mitral Stenosis (MS: low-pitched diastolic rumble at the apex with an opening snap and loud S1).',
    lectureRef:
      'Reference: Auscultatory Semiology of Valvular Diseases · Cardiology Syllabus',
  },
  'fc-9': {
    question:
      'What are the major physiological systems involved in short-term and long-term regulation of systemic arterial blood pressure?',
    answer:
      '• Short-term (seconds to minutes): arterial baroreflex (carotid sinus and aortic arch baroreceptors) modulating sympathetic and parasympathetic autonomic tone.\n• Intermediate and long-term (hours to days): renal control of extracellular fluid volume (pressure natriuresis), the renin-angiotensin-aldosterone system (RAAS), and natriuretic peptides (ANP, BNP).',
    lectureRef:
      'Reference: Pathophysiology of Arterial Hypertension · Cardiovascular Physiology & Pharmacology',
  },
};

const EN_QUIZZES_MAP: Record<
  string,
  {
    question: string;
    options: string[];
    explanation: string;
    lectureRef: string;
  }
> = {
  'qz-1': {
    question:
      'In the normal electrical activation sequence of the heart, which anatomical structure serves as the primary physiological pacemaker?',
    options: [
      'The sinoatrial (SA) node (Keith-Flack node)',
      'The atrioventricular (AV) node (Aschoff-Tawara node)',
      'The bundle of His',
      'The subendocardial Purkinje network',
    ],
    explanation:
      'Educational explanation: The sinoatrial (SA) node, located in the superior wall of the right atrium near the superior vena cava junction, exhibits the steepest phase 4 spontaneous diastolic depolarization slope, making it the dominant physiological pacemaker of the heart.',
    lectureRef:
      'Reference: Cardiac Automaticity & Electrophysiology · 3rd-Year Physiology',
  },
  'qz-2': {
    question:
      '[Multiple-Choice Question] Which of the following factors are the three direct determinants of ventricular stroke volume (SV)?',
    options: [
      'Ventricular preload (end-diastolic myocardial stretch)',
      'Ventricular afterload (impedance to systolic ejection)',
      'Inotropy (intrinsic myocardial contractility)',
      'Erythrocyte sedimentation rate (ESR)',
    ],
    explanation:
      'Educational explanation: Ventricular stroke volume (SV) is directly governed by three mechanical determinants: preload (Frank-Starling mechanism), afterload (resistance against ventricular ejection), and inotropy (myocardial contractility, modulated by sympathetic tone). Cardiac output is the product of heart rate and stroke volume (CO = HR × SV).',
    lectureRef:
      'Reference: Cardiac Hemodynamics · Cardiovascular Physiology',
  },
  'qz-3': {
    question:
      'On an ECG recorded at the standard paper speed of 25 mm/s, what is the normal physiological duration of the PR interval in adults?',
    options: [
      '0.04 to 0.08 seconds (1 to 2 small squares)',
      '0.12 to 0.20 seconds (3 to 5 small squares)',
      '0.24 to 0.32 seconds (6 to 8 small squares)',
      '0.40 to 0.60 seconds (2 to 3 large squares)',
    ],
    explanation:
      'Educational explanation: The normal adult PR interval ranges from 0.12 s (120 ms, or 3 small squares) to 0.20 s (200 ms, or 5 small squares / 1 large square). A PR interval < 0.12 s suggests pre-excitation, whereas a PR interval > 0.20 s defines first-degree atrioventricular block.',
    lectureRef: 'Reference: Normal Electrocardiogram · Cardiology Syllabus',
  },
  'qz-4': {
    question:
      '[Multiple-Choice Question] Which electrocardiographic features are characteristically observed in atrial fibrillation (AF)?',
    options: [
      'Absence of organized sinus P waves',
      'Irregularly irregular R-R intervals',
      'Baseline undulation with rapid, irregular fibrillatory f waves',
      'Fixed, regular prolongation of the PR interval before every QRS complex',
    ],
    explanation:
      'Educational explanation: Atrial fibrillation is defined by the replacement of organized sinus P waves with rapid, disorganized fibrillatory f waves and completely irregular R-R intervals due to variable AV nodal conduction.',
    lectureRef: 'Reference: Atrial Fibrillation · Cardiology Syllabus',
  },
  'qz-5': {
    question:
      '[Multiple-Choice Question] Which of the following clinical semiology signs specifically indicate right-sided heart failure?',
    options: [
      'Jugular venous distension (JVD)',
      'Positive hepatojugular reflux',
      'Bilateral dependent pitting lower-extremity edema',
      'Bilateral inspiratory basilar pulmonary crackles (rales)',
    ],
    explanation:
      'Educational explanation: Jugular venous distension, hepatojugular reflux, and dependent pitting peripheral edema reflect systemic venous hypertension upstream of the right ventricle (right-sided heart failure). Basilar pulmonary crackles reflect pulmonary capillary congestion upstream of the left ventricle.',
    lectureRef: 'Reference: Heart Failure Semiology · Cardiology Syllabus',
  },
  'qz-6': {
    question:
      'Which valvular abnormality classically produces a harsh, crescendo-decrescendo midsystolic ejection murmur maximal at the right second intercostal space with radiation to the carotid arteries?',
    options: [
      'Aortic stenosis (AS)',
      'Mitral regurgitation (MR)',
      'Aortic regurgitation (AR)',
      'Mitral stenosis (MS)',
    ],
    explanation:
      'Educational explanation: Aortic stenosis (AS) produces a characteristic midsystolic (diamond-shaped) ejection murmur with a harsh quality, best heard at the aortic area (2nd right intercostal space) and radiating to the carotid arteries.',
    lectureRef:
      'Reference: Valvular Heart Disease — Auscultatory Semiology · Cardiology Syllabus',
  },
  'qz-7': {
    question:
      'Within the renin-angiotensin-aldosterone system (RAAS), which enzyme catalyzes the conversion of angiotensin I to angiotensin II?',
    options: [
      'Renin',
      'Angiotensin-converting enzyme (ACE)',
      'Aldosterone synthase',
      'Carbonic anhydrase',
    ],
    explanation:
      'Educational explanation: Renin cleaves hepatic angiotensinogen into inactive angiotensin I. Angiotensin-converting enzyme (ACE), primarily located on pulmonary and vascular endothelium, converts angiotensin I into angiotensin II, a potent vasoconstrictor and stimulator of aldosterone secretion.',
    lectureRef:
      'Reference: RAAS Pathophysiology & Pharmacology · Arterial Hypertension Lecture',
  },
};

const EN_ECG_NOTES_MAP: Record<
  EcgWaveNote['id'],
  { label: string; title: string; educationalConcept: string; personalNote: string }
> = {
  P: {
    label: 'P Wave',
    title: 'Atrial Depolarization',
    educationalConcept:
      'Educational schematic: Represents the electrical depolarization wave originating in the sinoatrial (SA) node and spreading through the right and left atria (normal duration < 0.12 s).',
    personalNote:
      'Lecture note: In normal sinus rhythm, the P wave is upright in leads I, II, and aVF, and inverted in aVR.',
  },
  PR: {
    label: 'PR Interval',
    title: 'Atrioventricular Conduction Time',
    educationalConcept:
      'Educational schematic: Measured from the beginning of the P wave to the beginning of the QRS complex (0.12 to 0.20 s, or 3 to 5 small squares at 25 mm/s). Reflects atrial depolarization plus physiological delay in the AV node.',
    personalNote:
      'Lecture note: PR > 0.20 s (> 200 ms) = 1st-degree AV block; PR < 0.12 s = pre-excitation syndrome.',
  },
  QRS: {
    label: 'QRS Complex',
    title: 'Ventricular Depolarization',
    educationalConcept:
      'Educational schematic: Corresponds to rapid electrical activation of the right and left ventricular myocardium via the His-Purkinje system (normal duration < 0.12 s, or < 3 small squares).',
    personalNote:
      'Lecture note: A widened QRS (≥ 0.12 s) points toward bundle branch block (RBBB/LBBB) or ventricular origin (e.g., PVC).',
  },
  ST: {
    label: 'ST Segment',
    title: 'Isoelectric Ventricular Plateau Phase',
    educationalConcept:
      'Educational schematic: Segment between the end of the QRS complex (J point) and the onset of the T wave. Normally isoelectric (aligned with the PR/TP baseline) and corresponds to phase 2 plateau of the ventricular action potential.',
    personalNote:
      'Lecture note: Always evaluate J-point deviation relative to the TP baseline in at least two contiguous leads.',
  },
  T: {
    label: 'T Wave',
    title: 'Ventricular Repolarization',
    educationalConcept:
      'Educational schematic: Reflects electrical repolarization of the ventricles. The normal T wave is slightly asymmetric (slower upstroke, steeper downstroke) and concordant with the main QRS deflection.',
    personalNote:
      'Lecture note: The T wave is physiologically inverted in lead aVR (and sometimes V1).',
  },
};

const EN_ECG_CASES_MAP: Record<string, Omit<EcgStudyCase, 'id' | 'patternType' | 'correctIndex' | 'isSample'>> = {
  'ecg-case-1': {
    title: 'Educational Case #1 — Reference Tracing in Lead II',
    contextLabel:
      'Illustrative Educational Schematic (Non-Diagnostic) · Baseline rhythm study in cardiovascular semiology.',
    options: [
      'Normal regular sinus rhythm',
      'Atrial fibrillation (AF)',
      'Typical atrial flutter',
      'First-degree atrioventricular block (1st-degree AV block)',
    ],
    systematicAnalysis: {
      frequence: 'Normal (~65–75 bpm on this schematic)',
      rythme: 'Regular (constant R-R intervals)',
      ondeP: 'Present, upright in Lead II, monomorphic; every P wave is followed by a QRS',
      espacePR: 'Constant and normal (between 0.12 s and 0.20 s, or 3 to 5 small squares)',
      complexeQRS: 'Narrow (< 0.12 s, or < 3 small squares)',
    },
    explanation:
      'Educational illustration: Normal sinus rhythm is defined by organized atrial activation originating from the sinus node (P wave upright in I, II, aVF and inverted in aVR), consistently followed by a narrow QRS complex after a constant PR interval (0.12–0.20 s) with regular R-R intervals.',
    lectureRef:
      'Educational Reference: Semiology of the Normal ECG · Cardiology Curriculum',
  },
  'ecg-case-2': {
    title: 'Educational Case #2 — Irregular Narrow-QRS Rhythm Without P Waves',
    contextLabel:
      'Illustrative Educational Schematic (Non-Diagnostic) · Analysis of a supraventricular arrhythmia in semiology.',
    options: [
      'Regular sinus rhythm',
      'Atrial fibrillation (AF)',
      'First-degree atrioventricular block',
      'Ventricular tachycardia',
    ],
    systematicAnalysis: {
      frequence: 'Variable depending on AV nodal conduction filtering',
      rythme: 'Irregularly irregular (all R-R intervals differ)',
      ondeP:
        'Absence of distinct sinus P waves; baseline replaced by rapid, irregular fibrillatory f waves',
      espacePR: 'Not measurable (absence of sinus P waves)',
      complexeQRS: 'Generally narrow (< 0.12 s) in the absence of bundle branch block',
    },
    explanation:
      'Educational illustration: Atrial fibrillation (AF) is characterized on the ECG by the disappearance of sinus P waves, replaced by rapid irregular baseline undulation (f waves at 400–600/min), and completely irregular R-R intervals due to variable AV nodal conduction.',
    lectureRef:
      'Educational Reference: Supraventricular Arrhythmias · Cardiology Syllabus',
  },
  'ecg-case-3': {
    title: 'Educational Case #3 — Regular "Sawtooth" Atrial Activity',
    contextLabel:
      'Illustrative Educational Schematic (Non-Diagnostic) · Right atrial macro-reentrant circuit.',
    options: [
      'Atrial fibrillation',
      'Typical atrial flutter (sawtooth F waves)',
      'Premature ventricular contraction (PVC)',
      'Normal sinus rhythm',
    ],
    systematicAnalysis: {
      frequence:
        'Atrial rate around 300/min; ventricular response often in 2:1 or 4:1 conduction',
      rythme: 'Often regular (when AV conduction ratio is fixed, e.g., 2:1 or 4:1)',
      ondeP:
        'Absence of sinus P waves; presence of biphasic "sawtooth" flutter F waves without an isoelectric baseline between deflections',
      espacePR: 'Replaced by a fixed AV conduction ratio (e.g., 2 or 3 F waves per QRS)',
      complexeQRS: 'Narrow (< 0.12 s) unless aberrant conduction is present',
    },
    explanation:
      'Educational illustration: Typical atrial flutter arises from a macro-reentrant circuit in the right atrium (cavotricuspid isthmus-dependent). It produces regular sawtooth F waves (~300/min) without an flat isoelectric baseline in the inferior leads (II, III, aVF).',
    lectureRef:
      'Educational Reference: Atrial Flutter & Supraventricular Tachycardias · Cardiology Syllabus',
  },
  'ecg-case-4': {
    title: 'Educational Case #4 — Isolated Prolongation of AV Conduction Time',
    contextLabel:
      'Illustrative Educational Schematic (Non-Diagnostic) · Study of atrioventricular conduction delay.',
    options: [
      'Normal sinus rhythm with normal PR interval',
      'First-degree atrioventricular block (1st-degree AV block)',
      'Atrial fibrillation',
      'Premature ventricular contraction',
    ],
    systematicAnalysis: {
      frequence: 'Normal (underlying sinus rhythm)',
      rythme: 'Regular, no dropped P waves',
      ondeP: 'Sinus P wave present before every QRS complex (1:1 P-to-QRS ratio)',
      espacePR:
        'Constantly prolonged > 0.20 s (> 200 ms, i.e., > 1 large 5-mm square at 25 mm/s)',
      complexeQRS: 'Narrow (< 0.12 s) when conduction delay is within the AV node',
    },
    explanation:
      'Educational illustration: In first-degree atrioventricular block (1st-degree AV block), every sinus impulse is conducted to the ventricles (no dropped beats), but AV conduction is consistently delayed, resulting in a PR interval strictly greater than 0.20 seconds (200 ms).',
    lectureRef:
      'Educational Reference: Intracardiac Conduction Disorders · Cardiology Syllabus',
  },
  'ecg-case-5': {
    title: 'Educational Case #5 — Premature and Widened QRS Complex',
    contextLabel:
      'Illustrative Educational Schematic (Non-Diagnostic) · Analysis of a premature ectopic beat.',
    options: [
      'Isolated premature ventricular contraction (PVC) on sinus rhythm',
      'First-degree atrioventricular block',
      'Atrial flutter',
      'Pure sinus bradycardia',
    ],
    systematicAnalysis: {
      frequence: 'Underlying sinus rhythm interrupted by a premature beat',
      rythme: 'Premature beat followed by a compensatory pause',
      ondeP: 'The premature complex is NOT preceded by a premature sinus P wave',
      espacePR: 'Absent before the ectopic ventricular complex',
      complexeQRS:
        'Wide ectopic complex (≥ 0.12 s) with abnormal morphology and discordant T-wave inversion',
    },
    explanation:
      'Educational illustration: A premature ventricular contraction (PVC) is an early depolarization arising in the ventricular myocardium below the bifurcation of the bundle of His. Because activation spreads cell-to-cell outside the fast Purkinje network, the QRS is wide (≥ 0.12 s), not preceded by a P wave, and followed by secondary T-wave inversion.',
    lectureRef:
      'Educational Reference: ECG Semiology of Premature Beats · Cardiology Syllabus',
  },
};

const FR_LETTERS_MAP: Record<
  string,
  { occasion: string; subtitle: string; dateLabel: string; content: string }
> = {
  'ow-stressed': {
    occasion: 'À ouvrir quand tu te sens stressée',
    subtitle: 'Pour les soirs où le programme de médecine semble trop lourd',
    dateLabel: 'Lettre Privée · Pour Rania',
    content:
      "Ma très chère Rania,\n\nSi tu ouvres cette enveloppe maintenant, j'aimerais que tu fasses une pause, que tu fermes ton polycopié pendant deux minutes et que tu relâches doucement tes épaules. La troisième année de médecine demande énormément à ton esprit et à ton cœur, et il est tout à fait normal de se sentir parfois submergée.\n\nTu n'as pas besoin d'apprendre tout l'hôpital ce soir. Un cours, une notion, une respiration calme à la fois suffisent largement. Prépare-toi une tisane chaude, repose tes yeux et souviens-toi que ta valeur ne se mesure jamais à une séance d'étude. Je suis toujours là, tout près de toi.\n\nAvec tout mon amour,\nAbd Eldjalil ♡",
  },
  'ow-miss': {
    occasion: 'À ouvrir quand je te manque',
    subtitle: 'Pour les kilomètres silencieux qui nous séparent',
    dateLabel: 'Lettre Privée · Pour Rania',
    content:
      "Ma douce Rania,\n\nLa distance est étrange — certains jours elle ne semble être qu'un fuseau horaire sur un écran, et d'autres jours je donnerais tout pour simplement m'asseoir en face de toi dans un café tranquille pendant que tu surlignes tes cours de cardiologie.\n\nChaque fois que l'éloignement pèse un peu trop, rappelle-toi que chaque journée qui passe nous rapproche de nos prochaines retrouvailles. Lève les yeux vers le ciel ce soir : nous sommes sous la même lune, et mon cœur est juste là, à tes côtés.\n\nEn comptant les jours,\nAbd Eldjalil ♡",
  },
  'ow-encouragement': {
    occasion: "À ouvrir quand tu as besoin d'encouragements",
    subtitle: 'Quand le doute murmure plus fort que la vérité',
    dateLabel: 'Lettre Privée · Pour Rania',
    content:
      "Ma chère Rania,\n\nLaisse-moi te rappeler qui tu es : tu es bienveillante, résiliente, brillante, et tu deviendras une médecin extraordinaire. Regarde tout le chemin que tu as déjà parcouru depuis ton tout premier jour à la faculté de médecine — ce qui te semblait autrefois insurmontable est aujourd'hui naturel pour toi.\n\nSois aussi douce et patiente envers toi-même aujourd'hui que tu l'es envers les autres. Tu as déjà toute cette force en toi.\n\nInfiniment fier de toi,\nAbd Eldjalil ♡",
  },
  'ow-exam': {
    occasion: 'À ouvrir quand tu as réussi un examen',
    subtitle: 'Pour célébrer chaque soirée de travail et chaque victoire',
    dateLabel: 'Lettre Privée · Pour Rania',
    content:
      "Ma brillante Rania,\n\nTU L'AS FAIT ! Je savais que tu y arriverais, parce que je vois tout le cœur, la rigueur et la persévérance silencieuse que tu mets dans tes études même quand personne ne regarde.\n\nCe soir, pas de fiches, pas de QCM et pas de réveil. Célèbre cette réussite, savoure ton plat préféré et sois fière de tout ce que tu as accompli. J'ai tellement hâte de fêter ça avec toi !\n\nTon premier admirateur,\nAbd Eldjalil ♡",
  },
  'ow-hug': {
    occasion: "À ouvrir quand tu as besoin d'un câlin",
    subtitle: 'Une étreinte chaleureuse enveloppée dans des mots',
    dateLabel: 'Lettre Privée · Pour Rania',
    content:
      "Mon amour,\n\nFerme les yeux une seconde et imagine-moi te serrer fort dans mes bras, poser mon menton sur ton épaule et te murmurer que tout va bien se passer.\n\nTu es en sécurité, tu es profondément aimée et tu n'as jamais à porter le poids du monde toute seule. Enveloppe-toi dans ta couverture la plus douce ce soir et considère-la comme un long câlin de ma part jusqu'à ce que je puisse te serrer contre moi.\n\nTout contre ton cœur,\nAbd Eldjalil ♡",
  },
  'ow-tired': {
    occasion: "À ouvrir après une longue journée de stage à l'hôpital",
    subtitle: 'Quand tes jambes sont lourdes et ton énergie épuisée',
    dateLabel: 'Lettre Privée · Pour Rania',
    content:
      "Ma très chère future docteure,\n\nRester debout pendant des heures, écouter les patients, recueillir les observations cliniques et assimiler autant de connaissances demande une force physique et émotionnelle immense. Si tout ce que tu as la force de faire ce soir est de poser ta blouse, boire un verre d'eau et dormir — fais-le sans la moindre culpabilité.\n\nMême les jours où tu te sens trop fatiguée pour lire une page de plus, tu es déjà devenue un peu plus médecin aujourd'hui simplement par ta présence et ton empathie. Repose-toi profondément ce soir, mon amour.\n\nEn prenant toujours soin de toi,\nAbd Eldjalil ♡",
  },
  'ow-doubt': {
    occasion: "À ouvrir quand tu as l'impression de prendre du retard",
    subtitle: 'Un doux rappel que ton rythme est le bon',
    dateLabel: 'Lettre Privée · Pour Rania',
    content:
      "Ma douce Rania,\n\nLes études de médecine donnent parfois même aux étudiantes les plus brillantes l'impression que tout le monde avance plus vite. Ne compare jamais ta progression calme, chapitre après chapitre, avec ce que les autres montrent en surface.\n\nLa vraie maîtrise médicale se construit avec patience et profondeur. Chaque notion que tu révises — même celles qu'il faut relire trois fois — bâtit des fondations solides qui rassureront et soigneront de vrais patients demain. Fais confiance à ton rythme.\n\nJe crois en toi, toujours,\nAbd Eldjalil ♡",
  },
  'ow-late-night': {
    occasion: 'À ouvrir quand tu révises tard le soir',
    subtitle: 'Une présence douce pour tes heures calmes au bureau',
    dateLabel: 'Lettre Privée · Pour Rania',
    content:
      "Bonsoir mon amour,\n\nIl est tard, tout est silencieux autour de toi et ta lampe de bureau est encore allumée. Je voulais simplement te laisser ce petit mot pour que tu saches que tu n'es pas seule dans le calme de la nuit.\n\nTermine le paragraphe que tu es en train de lire, bois une gorgée d'eau, et promets-moi d'aller vraiment dormir bientôt. Ton esprit retient infiniment mieux lorsqu'il est reposé — et je t'aime bien trop pour te laisser t'épuiser.\n\nDouce nuit et beaux rêves,\nAbd Eldjalil ♡",
  },
  'ow-smile': {
    occasion: 'À ouvrir quand tu veux simplement sourire',
    subtitle: 'Sans occasion particulière — juste parce que je t’adore',
    dateLabel: 'Lettre Privée · Pour Rania',
    content:
      "Ma chère Rania,\n\nSavais-tu que le simple fait de penser à ton rire — et à la façon dont ta voix s'illumine quand un mécanisme physiologique complexe devient enfin clair — éclaire véritablement toute ma journée ?\n\nTu apportes tellement de grâce, de douceur et de lumière dans ma vie sans même t'en rendre compte. Quoi que tu sois en train de faire à cet instant précis, j'espère qu'un doux sourire naît sur ton visage en sachant à quel point tu es aimée.\n\nÀ toi, aujourd'hui et toujours,\nAbd Eldjalil ♡",
  },
  'ow-future': {
    occasion: 'À ouvrir quand tu penses à notre avenir',
    subtitle: 'Pour tous les matins paisibles qui nous attendent',
    dateLabel: 'Lettre Privée · Pour Rania',
    content:
      "Ma très chère Rania,\n\nUn jour très bientôt, tous ces appels à distance, ces comptes à rebours et ces périodes d'examens intenses ne seront plus qu'un chapitre dont nous parlerons ensemble autour d'un café du matin.\n\nJ'ai tellement hâte des choses les plus simples avec toi : marcher sans regarder l'heure, t'écouter me raconter ta journée à l'hôpital, cuisiner ensemble le soir et construire un foyer paisible rempli de tendresse. Chaque kilomètre et chaque semaine chargée en valent la peine parce qu'ils nous mènent à nous.\n\nDe tout mon cœur,\nAbd Eldjalil ♡",
  },
};

const FR_LOVE_MESSAGES_MAP: Record<
  string,
  { text: string; contextNote?: string }
> = {
  'lm-1': {
    text: 'Tes efforts comptent, même quand personne ne les voit.',
    contextNote: 'Pour les heures silencieuses à ton bureau',
  },
  'lm-2': {
    text: 'Prends une petite pause, future docteure. Le monde peut attendre quelques minutes.',
    contextNote: 'Une douce permission de te reposer',
  },
  'lm-3': {
    text: 'Je suis fier de toi, Rania.',
    contextNote: 'Toujours et inconditionnellement',
  },
  'lm-4': {
    text: "Tu mérites d'être aimée lors de tes journées productives comme lors de tes journées difficiles.",
    contextNote: 'Ta valeur ne dépend jamais d’une liste de tâches',
  },
  'lm-5': {
    text: 'Tu es bien plus que tes notes.',
    contextNote: 'Une vérité à garder tout près de ton cœur',
  },
  'lm-6': {
    text: 'La bienveillance et la patience que tu portes en toi feront de toi une médecin extraordinaire.',
    contextNote: 'Pour ton parcours clinique',
  },
  'lm-7': {
    text: "Même à travers la distance, je t'encourage dans chaque cours et chaque soirée calme.",
    contextNote: 'Par-delà chaque kilomètre entre nous',
  },
};

const FR_THINGS_I_LOVE_MAP: Record<
  string,
  { title: string; category: string; detail: string }
> = {
  'til-1': {
    title: 'Ta persévérance calme et sincère',
    category: 'Ton Esprit',
    detail:
      "La façon dont tu t'investis dans tes études et tes stages hospitaliers même les jours de fatigue — non pas pour les éloges, mais parce que tu tiens sincèrement à devenir une médecin attentive et compétente.",
  },
  'til-2': {
    title: 'La tendresse infinie de ton cœur',
    category: 'Ton Cœur',
    detail:
      "Tu remarques toujours quand les personnes autour de toi ont besoin de réconfort, et tu écoutes avec une douceur qui permet à chacun de se sentir compris et en sécurité.",
  },
  'til-3': {
    title: "L'étincelle dans ta voix quand un concept s'éclaire",
    category: 'Petits Détails',
    detail:
      "Qu'il s'agisse d'un tracé de cardiologie complexe ou d'un détail dans un livre, ta curiosité et ta joie d'apprendre font partie de ce que j'admire le plus au monde.",
  },
  'til-4': {
    title: 'Ton élégance face à la pression',
    category: 'Ta Force',
    detail:
      "La troisième année de médecine est exigeante, et pourtant tu avances avec dignité, humilité et une résilience silencieuse qui m'inspire chaque jour.",
  },
  'til-5': {
    title: 'La douceur apaisante de nos conversations',
    category: 'Nous',
    detail:
      'Même après la semaine la plus longue, entendre ta voix rend immédiatement le monde plus calme, plus doux et familier.',
  },
  'til-6': {
    title: 'Ta sincérité et ta profondeur',
    category: 'Ton Âme',
    detail:
      "Tu ne fais jamais semblant d'être quelqu'un d'autre : tu es réfléchie, authentique et profondément entière dans tout ce que tu aimes.",
  },
};

const FR_VOICE_MAP: Record<
  string,
  { title: string; dateLabel: string; transcriptNote: string }
> = {
  'vr-1': {
    title: 'Berceuse Douce Boîte à Musique du Soir',
    dateLabel: 'Mélodie Douce Intégrée',
    transcriptNote:
      'Joue une douce mélodie de boîte à musique synthétisée. Utilise les boutons « Importer un fichier audio » ou « Enregistrer une note vocale » ci-dessus pour ajouter tes propres messages vocaux.',
  },
};

const FR_MEMORIES_MAP: Record<
  string,
  { title: string; dateLabel: string; locationLabel: string; caption: string }
> = {
  'mem-1': {
    title: 'Expresso du Matin & Fleurs Pressées',
    dateLabel: "Matin d'Automne",
    locationLabel: 'Table de Bistrot',
    caption:
      'Une matinée paisible avec des croissants chauds, un café et ton carnet ouvert près de la fenêtre.',
  },
  'mem-2': {
    title: 'Heure Dorée dans la Roseraie',
    dateLabel: 'Fin d’Après-Midi',
    locationLabel: 'Allée Botanique',
    caption:
      'Une promenade lente sur les pavés ensoleillés, quand le temps semblait suspendu.',
  },
  'mem-3': {
    title: "Son Sanctuaire d'Étude Apaisé",
    dateLabel: 'Après-Midi Calme',
    locationLabel: "Bureau d'Étude",
    caption:
      "Infusion de camomille, roses poudrées séchées et ton stéthoscope posé sur ton atlas d'anatomie. Si fier de la médecin que tu deviens.",
  },
};

const FR_JOURNAL_MAP: Record<
  string,
  {
    gratitudePrompt: string;
    gratitudeAnswer: string;
    achievement: string;
    dailyNote: string;
  }
> = {
  'je-1': {
    gratitudePrompt:
      'Quel petit moment calme aujourd’hui a apporté un peu de douceur à ton cœur ?',
    gratitudeAnswer:
      'Prendre une tasse de camomille chaude près de la fenêtre avant de commencer mes révisions de cardiologie de l’après-midi.',
    achievement:
      'Terminé la révision des phases du cycle cardiaque sans me précipiter.',
    dailyNote:
      'La journée a semblé équilibrée. Prendre cinq minutes de pause entre les blocs d’étude m’a aidée à rester calme et concentrée.',
  },
  'je-2': {
    gratitudePrompt:
      'Quel geste bienveillant as-tu accompli pour ton corps ou ton esprit aujourd’hui ?',
    gratitudeAnswer:
      'J’ai fermé mon ordinateur tôt à 21h30 et écouté une musique douce au lieu de forcer un chapitre supplémentaire.',
    achievement:
      'Pratiqué les foyers d’auscultation cardiaque pendant les travaux pratiques de sémiologie.',
    dailyNote:
      'Me rappeler que le repos fait pleinement partie de l’apprentissage.',
  },
};

// ============================================================================
// LOCALIZATION HELPERS FOR SAMPLE DATA
// ============================================================================
export function localizeStudyTopic(
  topic: StudyTopic,
  language: Language
): StudyTopic {
  if (!topic.isSample) return topic;
  if (language === 'en' && EN_STUDY_TOPICS_MAP[topic.id]) {
    return {
      ...topic,
      ...EN_STUDY_TOPICS_MAP[topic.id],
    };
  }
  return topic;
}

export function localizeFlashcard(
  card: CardioFlashcard,
  language: Language
): CardioFlashcard {
  if (!card.isSample) return card;
  if (language === 'en' && EN_FLASHCARDS_MAP[card.id]) {
    return {
      ...card,
      ...EN_FLASHCARDS_MAP[card.id],
    };
  }
  return card;
}

export function localizeQuizQuestion(
  quiz: CardioQuizQuestion,
  language: Language
): CardioQuizQuestion {
  if (!quiz.isSample) return quiz;
  if (language === 'en' && EN_QUIZZES_MAP[quiz.id]) {
    return {
      ...quiz,
      ...EN_QUIZZES_MAP[quiz.id],
    };
  }
  return quiz;
}

export function localizeEcgNote(
  note: EcgWaveNote,
  language: Language
): EcgWaveNote {
  if (language === 'en' && EN_ECG_NOTES_MAP[note.id]) {
    const enNote = EN_ECG_NOTES_MAP[note.id];
    const isDefaultFrPersonalNote =
      note.personalNote.startsWith('Note de cours :');
    return {
      ...note,
      label: enNote.label,
      title: enNote.title,
      educationalConcept: enNote.educationalConcept,
      personalNote: isDefaultFrPersonalNote
        ? enNote.personalNote
        : note.personalNote,
    };
  }
  return note;
}

export function localizeEcgCase(
  ecgCase: EcgStudyCase,
  language: Language
): EcgStudyCase {
  if (!ecgCase.isSample) return ecgCase;
  if (language === 'en' && EN_ECG_CASES_MAP[ecgCase.id]) {
    return {
      ...ecgCase,
      ...EN_ECG_CASES_MAP[ecgCase.id],
    };
  }
  return ecgCase;
}

export function localizeLetter(
  letter: OpenWhenLetter,
  language: Language
): OpenWhenLetter {
  if (!letter.isSample) return letter;
  if (language === 'fr' && FR_LETTERS_MAP[letter.id]) {
    return {
      ...letter,
      ...FR_LETTERS_MAP[letter.id],
    };
  }
  return letter;
}

export function localizeVoiceRecording(
  rec: VoiceRecording,
  language: Language
): VoiceRecording {
  if (!rec.isSample) return rec;
  if (language === 'fr' && FR_VOICE_MAP[rec.id]) {
    return {
      ...rec,
      ...FR_VOICE_MAP[rec.id],
    };
  }
  return rec;
}

export function localizeMemory(
  mem: MemoryPhoto,
  language: Language
): MemoryPhoto {
  if (!mem.isSample) return mem;
  if (language === 'fr' && FR_MEMORIES_MAP[mem.id]) {
    return {
      ...mem,
      ...FR_MEMORIES_MAP[mem.id],
    };
  }
  return mem;
}

export function localizeJournalEntry(
  entry: JournalEntry,
  language: Language
): JournalEntry {
  if (!entry.isSample) return entry;
  if (language === 'fr' && FR_JOURNAL_MAP[entry.id]) {
    return {
      ...entry,
      ...FR_JOURNAL_MAP[entry.id],
    };
  }
  return entry;
}

export function localizeLoveMessage(
  msg: LoveMessageItem,
  language: Language
): LoveMessageItem {
  if (!msg.isSample) return msg;
  if (language === 'fr' && FR_LOVE_MESSAGES_MAP[msg.id]) {
    return {
      ...msg,
      ...FR_LOVE_MESSAGES_MAP[msg.id],
    };
  }
  return msg;
}

export function localizeLovedQuality(
  item: LovedQualityItem,
  language: Language
): LovedQualityItem {
  if (!item.isSample) return item;
  if (language === 'fr' && FR_THINGS_I_LOVE_MAP[item.id]) {
    return {
      ...item,
      ...FR_THINGS_I_LOVE_MAP[item.id],
    };
  }
  return item;
}

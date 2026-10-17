/* Interface copy is separate from German learning examples and artwork.
   Add another language alongside uk; the UI resolves document.documentElement.lang.
   Missing translations fall back to Ukrainian. Keep semantic keys unchanged. */
window.DEUTSCH_LESSON_CATALOG = {
  uk: {
    welcome: 'Hallo! — Привіт!',
    open: 'Відкрити →',
    lesson: 'Урок',
    practiceHints: {negativePractice: 'Твердження ↔ заперечення', questionPractice: 'Твердження · заперечення · питання'},
    groups: {
      statements: {title: 'Твердження', description: 'Вчимося будувати прості правильні речення.'},
      negation: {title: 'Заперечення', description: 'Вчимося говорити, що хтось чогось не робить.'},
      questions: {title: 'Питання', description: 'Вчимося ставити прості запитання німецькою.'}
    },
    lessons: {
      pronouns: 'Займенники',
      verbs: 'Базові дієслова',
      sein: 'sein — бути',
      haben: 'haben — мати',
      placeTime: 'Місце та час',
      nicht: 'nicht — не',
      negativeActions: 'Заперечення дій',
      negativePractice: 'Практика заперечень',
      yesNo: 'Питання «так / ні»',
      questionWords: 'Питальні слова',
      habenQuestion: 'Питання з haben — мати',
      questionPractice: 'Практика питань'
    }
  }
};

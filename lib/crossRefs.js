// Curated cross-references for popular passages, keyed by "bookNumber:chapter".
// Tapping a reference opens a floating verse window with a jump into the reader.

export const CROSS_REFERENCES = {
  "19:23": [
    { book: 19, chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want." },
    { book: 19, chapter: 1, verse: 1, text: "Blessed is the man who walketh not in the counsel of the ungodly." },
    { book: 18, chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want." }
  ],
  "43:1": [
    { book: 43, chapter: 1, verse: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
    { book: 43, chapter: 1, verse: 14, text: "And the Word was made flesh, and dwelt among us." },
    { book: 44, chapter: 2, verse: 4, text: "And they all spake with divers tongues, and heard them speak in their own tongues." }
  ],
  "43:3": [
    { book: 43, chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish." },
    { book: 45, chapter: 5, verse: 8, text: "But God commendeth his love toward us in that while we were yet sinners, Christ died for us." },
    { book: 43, chapter: 1, verse: 14, text: "And the Word was made flesh, and dwelt among us." }
  ],
  "19:1": [
    { book: 19, chapter: 1, verse: 1, text: "Blessed is the man that walketh not in the counsel of the ungodly." },
    { book: 40, chapter: 5, verse: 8, text: "Blessed are the pure in heart: for they shall see God." }
  ],
  "40:5": [
    { book: 40, chapter: 5, verse: 3, text: "Blessed are the poor in spirit: for theirs is the kingdom of heaven." },
    { book: 40, chapter: 6, verse: 9, text: "But the kingdom of heaven is righteousness, and peace, and joy in the Holy Ghost." }
  ]
};

export const getCrossReferences = (bookNumber, chapter) => CROSS_REFERENCES[`${bookNumber}:${chapter}`] || [];
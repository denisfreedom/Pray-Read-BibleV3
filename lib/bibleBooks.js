// The 66 canonical books with English and Luganda names, abbreviations,
// chapter counts and testament. Static data so the reader never waits on a
// network round-trip before it can show the book grid.

export const OLD_TESTAMENT = [
  { number: 1, name: "Genesis", abbr: "Gen", luganda: "Olubereberye", lugandaAbbr: "Gn", chapters: 50 },
  { number: 2, name: "Exodus", abbr: "Exod", luganda: "Okuva", lugandaAbbr: "Ex", chapters: 40 },
  { number: 3, name: "Leviticus", abbr: "Lev", luganda: "Ebyabaleevi", lugandaAbbr: "Lv", chapters: 27 },
  { number: 4, name: "Numbers", abbr: "Num", luganda: "Okubala", lugandaAbbr: "Nm", chapters: 36 },
  { number: 5, name: "Deuteronomy", abbr: "Deut", luganda: "Ekyamateeka", lugandaAbbr: "Dt", chapters: 34 },
  { number: 6, name: "Joshua", abbr: "Josh", luganda: "Yoswa", lugandaAbbr: "Js", chapters: 24 },
  { number: 7, name: "Judges", abbr: "Judg", luganda: "Ekyabalamuzi", lugandaAbbr: "Jg", chapters: 21 },
  { number: 8, name: "Ruth", abbr: "Ruth", luganda: "Luusi", lugandaAbbr: "Rt", chapters: 4 },
  { number: 9, name: "1 Samuel", abbr: "1 Sam", luganda: "1 Samwiri", lugandaAbbr: "1Sm", chapters: 31 },
  { number: 10, name: "2 Samuel", abbr: "2 Sam", luganda: "2 Samwiri", lugandaAbbr: "2Sm", chapters: 24 },
  { number: 11, name: "1 Kings", abbr: "1 Kings", luganda: "1 Bassekabaka", lugandaAbbr: "1Kn", chapters: 22 },
  { number: 12, name: "2 Kings", abbr: "2 Kings", luganda: "2 Bassekabaka", lugandaAbbr: "2Kn", chapters: 25 },
  { number: 13, name: "1 Chronicles", abbr: "1 Chron", luganda: "1 Ebyomumirembe", lugandaAbbr: "1Ch", chapters: 29 },
  { number: 14, name: "2 Chronicles", abbr: "2 Chron", luganda: "2 Ebyomumirembe", lugandaAbbr: "2Ch", chapters: 36 },
  { number: 15, name: "Ezra", abbr: "Ezra", luganda: "Ezera", lugandaAbbr: "Ez", chapters: 10 },
  { number: 16, name: "Nehemiah", abbr: "Neh", luganda: "Nekkemiya", lugandaAbbr: "Nh", chapters: 13 },
  { number: 17, name: "Esther", abbr: "Esth", luganda: "Eseza", lugandaAbbr: "Es", chapters: 10 },
  { number: 18, name: "Job", abbr: "Job", luganda: "Yobu", lugandaAbbr: "Jb", chapters: 42 },
  { number: 19, name: "Psalms", abbr: "Ps", luganda: "Zabbuli", lugandaAbbr: "Ps", chapters: 150 },
  { number: 20, name: "Proverbs", abbr: "Prov", luganda: "Engero", lugandaAbbr: "Pr", chapters: 31 },
  { number: 21, name: "Ecclesiastes", abbr: "Eccl", luganda: "Omubuulizi", lugandaAbbr: "Ec", chapters: 12 },
  { number: 22, name: "Song of Solomon", abbr: "Song", luganda: "Oluyimba lwa Sulemaani", lugandaAbbr: "Sn", chapters: 8 },
  { number: 23, name: "Isaiah", abbr: "Isa", luganda: "Isaaya", lugandaAbbr: "Is", chapters: 66 },
  { number: 24, name: "Jeremiah", abbr: "Jer", luganda: "Yeremiya", lugandaAbbr: "Jr", chapters: 52 },
  { number: 25, name: "Lamentations", abbr: "Lam", luganda: "Okukungubaga", lugandaAbbr: "Lm", chapters: 5 },
  { number: 26, name: "Ezekiel", abbr: "Ezek", luganda: "Ezekyeri", lugandaAbbr: "Ek", chapters: 48 },
  { number: 27, name: "Daniel", abbr: "Dan", luganda: "Danyeri", lugandaAbbr: "Dn", chapters: 12 },
  { number: 28, name: "Hosea", abbr: "Hos", luganda: "Koseya", lugandaAbbr: "Hs", chapters: 14 },
  { number: 29, name: "Joel", abbr: "Joel", luganda: "Yoweeri", lugandaAbbr: "Jl", chapters: 3 },
  { number: 30, name: "Amos", abbr: "Amos", luganda: "Amosi", lugandaAbbr: "Am", chapters: 9 },
  { number: 31, name: "Obadiah", abbr: "Obad", luganda: "Obadiya", lugandaAbbr: "Ob", chapters: 1 },
  { number: 32, name: "Jonah", abbr: "Jonah", luganda: "Yona", lugandaAbbr: "Jn", chapters: 4 },
  { number: 33, name: "Micah", abbr: "Mic", luganda: "Mikka", lugandaAbbr: "Mc", chapters: 7 },
  { number: 34, name: "Nahum", abbr: "Nah", luganda: "Nakumu", lugandaAbbr: "Na", chapters: 3 },
  { number: 35, name: "Habakkuk", abbr: "Hab", luganda: "Kaabakuuku", lugandaAbbr: "Hk", chapters: 3 },
  { number: 36, name: "Zephaniah", abbr: "Zeph", luganda: "Zeffaniya", lugandaAbbr: "Zp", chapters: 3 },
  { number: 37, name: "Haggai", abbr: "Hag", luganda: "Kaggayi", lugandaAbbr: "Hg", chapters: 2 },
  { number: 38, name: "Zechariah", abbr: "Zech", luganda: "Zekkaliya", lugandaAbbr: "Zc", chapters: 14 },
  { number: 39, name: "Malachi", abbr: "Mal", luganda: "Malaki", lugandaAbbr: "Ml", chapters: 4 }
];

export const NEW_TESTAMENT = [
  { number: 40, name: "Matthew", abbr: "Matt", luganda: "Matayo", lugandaAbbr: "Mt", chapters: 28 },
  { number: 41, name: "Mark", abbr: "Mark", luganda: "Makko", lugandaAbbr: "Mr", chapters: 16 },
  { number: 42, name: "Luke", abbr: "Luke", luganda: "Lukka", lugandaAbbr: "Lk", chapters: 24 },
  { number: 43, name: "John", abbr: "John", luganda: "Yokaana", lugandaAbbr: "Jh", chapters: 21 },
  { number: 44, name: "Acts", abbr: "Acts", luganda: "Ebikolwa", lugandaAbbr: "Ac", chapters: 28 },
  { number: 45, name: "Romans", abbr: "Rom", luganda: "Abaruumi", lugandaAbbr: "Rm", chapters: 16 },
  { number: 46, name: "1 Corinthians", abbr: "1 Cor", luganda: "1 Abakkolinso", lugandaAbbr: "1Cr", chapters: 16 },
  { number: 47, name: "2 Corinthians", abbr: "2 Cor", luganda: "2 Abakkolinso", lugandaAbbr: "2Cr", chapters: 13 },
  { number: 48, name: "Galatians", abbr: "Gal", luganda: "Abaggalatiya", lugandaAbbr: "Gl", chapters: 6 },
  { number: 49, name: "Ephesians", abbr: "Eph", luganda: "Abaefeeso", lugandaAbbr: "Ep", chapters: 6 },
  { number: 50, name: "Philippians", abbr: "Phil", luganda: "Abafiripi", lugandaAbbr: "Ph", chapters: 4 },
  { number: 51, name: "Colossians", abbr: "Col", luganda: "Abakkolosaayi", lugandaAbbr: "Cl", chapters: 4 },
  { number: 52, name: "1 Thessalonians", abbr: "1 Thess", luganda: "1 Abasessaloniika", lugandaAbbr: "1Th", chapters: 5 },
  { number: 53, name: "2 Thessalonians", abdr: "", abbr: "2 Thess", luganda: "2 Abasessaloniika", lugandaAbbr: "2Th", chapters: 3 },
  { number: 54, name: "1 Timothy", abbr: "1 Tim", luganda: "1 Timoseewo", lugandaAbbr: "1Tm", chapters: 6 },
  { number: 55, name: "2 Timothy", abbr: "2 Tim", luganda: "2 Timoseewo", lugandaAbbr: "2Tm", chapters: 4 },
  { number: 56, name: "Titus", abbr: "Titus", luganda: "Tito", lugandaAbbr: "Tt", chapters: 3 },
  { number: 57, name: "Philemon", abbr: "Philem", luganda: "Firemooni", lugandaAbbr: "Pl", chapters: 1 },
  { number: 58, name: "Hebrews", abbr: "Heb", luganda: "Abaebbulaniya", lugandaAbbr: "Hb", chapters: 13 },
  { number: 59, name: "James", abbr: "Jas", luganda: "Yakobo", lugandaAbbr: "Jm", chapters: 5 },
  { number: 60, name: "1 Peter", abbr: "1 Pet", luganda: "1 Peetero", lugandaAbbr: "1Pt", chapters: 5 },
  { number: 61, name: "2 Peter", abbr: "2 Pet", luganda: "2 Peetero", lugandaAbbr: "2Pt", chapters: 3 },
  { number: 62, name: "1 John", abbr: "1 John", luganda: "1 Yokaana", lugandaAbbr: "1Jh", chapters: 5 },
  { number: 63, name: "2 John", abbr: "2 John", luganda: "2 Yokaana", lugandaAbbr: "2Jh", chapters: 1 },
  { number: 64, name: "3 John", abbr: "3 John", luganda: "3 Yokaana", lugandaAbbr: "3Jh", chapters: 1 },
  { number: 65, name: "Jude", abbr: "Jude", luganda: "Yuda", lugandaAbbr: "Jd", chapters: 1 },
  { number: 66, name: "Revelation", abbr: "Rev", luganda: "Okubikkulirwa", lugandaAbbr: "Rv", chapters: 22 }
];

export const BIBLE_BOOKS = [...OLD_TESTAMENT, ...NEW_TESTAMENT];

export const TRANSLATIONS = [
  { id: "kjv", name: "King James Version" },
  { id: "web", name: "World English Bible" },
  { id: "asv", name: "American Standard Version" },
  { id: "bsb", name: "Berean Standard Bible" },
  { id: "darby", name: "Darby Bible" },
  { id: "oeb-us", name: "Open English Bible (US)" }
];

export const getBook = (name) =>
  BIBLE_BOOKS.find((book) => book.name.toLowerCase() === String(name || "").toLowerCase()) || null;

export const getBookByNumber = (number) => BIBLE_BOOKS.find((book) => book.number === Number(number)) || null;

export const getBookNumber = (name) => {
  const book = getBook(name);
  return book ? book.number : null;
};

export const formatReference = (book, chapter) => `${book} ${chapter}`;

/** Chapter audio published for the King James Version. */
export const chapterAudioUrl = (bookNumber, chapter) =>
  `https://www.wordproaudio.org/bibles/app/audio/1/${bookNumber}/${chapter}.mp3`;
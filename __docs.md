# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

> מסמך זה נכתב על בסיס קוד המקור שסופק. קבצים שנחתכו בהדבקה (כגון חלק מהרכיבים הגדולים) תוארו לפי שמם ותפקידם הנראה מהקוד הקיים. מקומות שבהם ההתנהגות המדויקת אינה ניתנת לאימות מתוך הקטע המוצג מסומנים במפורש.

---

## 1. מהות המערכת

**Pray-Read Bible** היא פלטפורמה רוחנית דו-לשונית (אנגלית ולוגנדה) המשלבת קריאת המקרא, תפילה מבוססת כתוב, דבר-יום, שאלות ותשובות, מוזיקה רוחנית ("Verse-Songs"), קהילה ולימוד קבוצתי. הרעיון המרכזי, שמופיע לאורך כל הממשק ובטקסטים: *"Read the Word. Pray the Word. Receive Christ. Live Christ. Express Christ."* - קריאה שהופכת לתפילה, לא רק לידע.

**קהל היעד:** מאמינים, קבוצות לימוד וכנסיות, בעיקר בקהילות דוברות לוגנדה ואנגלית.

**הערך שהיא מספקת:**
- קריאת פרקי מקרא בשתי שפות (KJV, KJV+ עם מספרי Strong, תרגום לוגנדה), גם בלי חיבור לאינטרנט.
- חומרי לימוד לכל ספר ופרק: מבוא, תקציר, תפילה, הערות פרשניות, הפניות צולבות והסברים תיאולוגיים והיסטוריים.
- ספריית תפילות וטקסטי "Prayer Passages" שמקושרים לפסוקים.
- דבר-יום, מדיטציה והתקדמות בתוכנית קריאה של 30 יום.
- יומן תפילה ורשימת הדגשות/הערות אישיות, המסונכרנות לחשבון המשתמש.
- ממשק ניהול (Content Manager) שבו מנהל יכול לייבא ולערוך את כל התוכן.

**ארכיטקטורה כללית:**
- **Frontend:** React (JSX), React Router, TanStack Query, Tailwind-like utilities (קבצי CSS משלו), Lucide icons, date-fns.
- **Backend:** פונקציות שרת (`functions/*.js`) ו-entities (`entities/*.json`) בפלטפורמת Fine Structure (ה-SDK נקרא `fse2`).
- **אחסון מקומי:** IndexedDB דרך `lib/offlineDb.js`, לתמיכה ב-offline.
- **PWA:** `manifest.json`, `public/sw.js` ו-`components/layout/PwaHead.jsx`.

---

## 2. עמודים ותפקידיהם

> הכתובת היא `/<PageName>` (ללא סיומת), לפי `createPageUrl`. עמוד הבית הוא `Home`.

### 2.1 דף הבית - `pages/Home.jsx`
- **URL:** `/Home` (או `/`).
- **תפקיד:** דף נחיתה שמציג את הרעיון, את היעוד והפעולות המרכזיות.
- **רכיבים:** `HomeHero`, `HomeIntro`, `VerseOfDayCard`, `DailyDevotionalCard`, `JourneySteps`, `VisionCards`, `ExperiencePoints`, `SixWaysGrid`, `ExploreBible`, `ClosingInvite`.
- **נתונים:** דבר-היום (`VerseOfDay`) ודבר-היום של devotional (`Devotional`) נטענים דרך `fetchPublicCollection`. אם אין נתונים, מוצג תוכן ברירת מחדל מ-`lib/seedContent.js`.
- **אינטראקציות:** כפתור "שתף" של הפסוק (Web Share API או העתקה ללוח), קישורים לעמודים אחרים.

### 2.2 קריאת המקרא - `pages/BibleReader.jsx`
- **URL:** `/BibleReader`
- **תפקיד:** בחירת ספר ופרק. כולל חיפוש ספר, לשוניות "Old / New Testament" ומציג אילו ספרים זמינים offline.
- **רכיבים:** `BookGrid`, `ChapterSelector`.
- **אינטראקציה:** בחירת ספר מציגה את `ChapterSelector` עם סיידבר מחקר (מבוא, מתאר, תפילה) ורשת פרקים.

### 2.3 פרק - `pages/Chapter.jsx`
- **URL:** `/Chapter?book=<number>&chapter=<n>&verse=<n>&lang=lu`
- **תפקיד:** עמוד הקריאה המרכזי. מציג פסוקים, מאפשר סימון, הדגשה, הערה, סימניה, שיתוף, הפניות צולבות, תפילה לפסוק, קטע מחקר לפרק ו-Q&A.
- **פרמטרים ב-URL:**
  - `book` - מספר ספר 1..66.
  - `chapter` - מספר פרק.
  - `verse` - פסוק ספציפי (גולל אליו ומדגיש).
  - `lang` - `lu` מציג לוגנדה.
- **רכיבים מרכזיים:** `VerseActionBar`, `VerseCrossRefs`, `ChapterReaderPane`, `ChapterSidebar`, `ChapterResourcesPanel`, `ChapterClosingPrayer`, `PassagePrayer`, `PassageTabs`, `VersionPicker`, `AnnotatedText`, `StrongsText`, `ShareSheet`, `VersePopup`.
- **אינטראקציות:**
  - לחיצה על פסוק: פותחת `VerseActionBar` (הדגשה בצבע, סימניה, הערה, העתקה, שיתוף, הפניות צולבות, תפילה, פרשנות).
  - בחירת טקסט: סרגל כלים צף לסימון (`AnnotatedText`).
  - לחיצה על מספר Strong (לדוגמה `(G2424)`): פותחת `StrongsPopup` עם הגדרה.
  - החלפת גרסה (KJV, KJV+, WEB, לוגנדה...) דרך `VersionPicker`.
  - פתיחת פסוק מוזכר בתוך הטקסט: `VersePopup`.
  - סיום פרק: הודעת "Closing prayer" וכפתור לשיתוף.
- **הערה:** הקוד מתעד פעילות קריאה (`logReadingActivity`) ומעדכן התקדמות בתוכנית הקריאה (`recordReading`).

### 2.4 דשבורד - `pages/Dashboard.jsx`
- **URL:** `/Dashboard` (דורש התחברות לתוכן מלא).
- **תפקיד:** סיכום אישי: רצף קריאה (streak), סטטיסטיקה של פרקים, הדגשות, סימניות, הערות, הורדות offline וסיכום פעילות אחרונה (`ActivityFeed`).
- **נתונים:** `Reading`, `StudyMark`, `DevotionalProgress`, `DevotionalSaved`, `PrayerSaved`, `ReadingActivity`, ופרטי offline מ-IndexedDB.
- **אפשרויות:** מעבר לקריאה, מעבר להתקדמות בתוכנית.

### 2.5 תוכנית קריאה - `pages/Plan.jsx`
- **URL:** `/Plan`
- **תפקיד:** תוכנית של 30 ימים (הבשורה על-פי יוחנן ותשעה מזמורים).
- **נתונים:** `ReadingPlan` (או ברירת מחדל מ-`lib/planData.js`) ו-`Reading` של המשתמש.
- **אינטראקציה:** כל יום הוא `PlanRow` עם סטטוס (`completed`, `current`, `upcoming`) וקישור לפרק. מוצגים גם אחוז התקדמות ורצף.

### 2.6 דבר-יום - `pages/VerseOfDay.jsx`
- **URL:** `/VerseOfDay`
- **תפקיד:** פסוק היום בצורה גדולה, עם הפניה, הקשר ושיתוף (`ShareRow`).
- **בחירה:** לפי `verse_date` של היום, אחרת נבחר לפי מספר היום. אם אין נתונים - ברירת מחדל.

### 2.7 Devotionals - `pages/Devotionals.jsx`
- **URL:** `/Devotionals` (ו-`?devotional=<code>` לפתיחה ישירה).
- **תפקיד:** ספריית מדיטציות יומיות בעברית-לוגנדה-אנגלית. מציג את הדבר של היום בראש הדף, ואחריו רשימת קודמות.
- **רכיבים:** `DevotionalFeatured`, `DevotionalFilters`, `DevotionalCard`, `DevotionalFullView`, `ShareSheet`.
- **מסננים:** שפה (`EN` / `LU` / `BOTH`), חיפוש חופשי, נושא (topic), טווח זמן (`today` / `week` / `month` / `all`), סדרה (series).
- **אינטראקציות:** שמירה ללוח אישי (`useDevotionalLibrary`), סימון כ"נקרא", שיתוף בכמה ערוצים, ניווט "יום קודם / יום הבא".
- **pagination:** 12 פריטים בכל עמוד (`PAGE_SIZE`).

### 2.8 ספריית תפילות - `pages/PrayerLibrary.jsx`
- **URL:** `/PrayerLibrary`
- **תפקיד:** רשימת תפילות מוכנות לפי קטגוריה, עם חיפוש, שפה, שמירה למועדפים ושיתוף.
- **נתונים:** `prayers` (ציבורי) ו-`PrayerSaved` (למשתמש מחובר).
- **אינטראקציה:** שמירה/הסרה (`saveMutation`), קישור לפסוק המצוטט ופתיחה ב-`Chapter`.

### 2.9 Verse-Songs - `pages/VerseSongs.jsx` ו-`pages/VerseSongSeries.jsx`
- **URL:** `/VerseSongs` ו-`/VerseSongSeries?series=<id>`
- **תפקיד:** מוזיקה מבוססת פסוקים. לכל שיר: נגינה, הורדה ("Buy to Download - $2"), שיתוף.
- **זרימת רכישה:** לחיצה על "Buy to Download" פותחת את דף התשלום החיצוני (Pesapal), ושומרת את השיר הממתין ב-`localStorage` (`pending_verse_song_purchase`). לאחר החזרה, השיר מסומן כרכוש (`purchased_verse_songs`).
- **נגן:** `GlobalPlayer` מנגן ברצף גם אחרי ניווט בין עמודים (ראו סעיף 4).
- **פילטרים:** חיפוש חופשי, סדרה, ספר. חלק מהשירים כוללים `book_number` ו-`chapter` לקשר לפסוק.
- **זהירות:** הזרימה צד-לקוח בלבד. אין אימות של תשלום בקוד המוצג.

### 2.10 שאלות ותשובות (Q&A) - `pages/QA.jsx`
- **URL:** `/QA` (תומך ב-`?lang`, `?topic`, `?letter`, `?search`)
- **תפקיד:** מאגר שאלות ותשובות דו-לשוני, מסודר לפי האות הראשונה של השאלה.
- **רכיבים:** `QaFilters`, `QaLetterBar` (סרגל A-Z נגלל), `QaCard`.
- **אינטראקציות:** פתיחה/סגירה של תשובה, הצבעה "מועיל / לא מועיל" (נשמרת ב-`localStorage` בשם `pr_qa_votes`), העתקה ושיתוף, קישורי הפניה לפסוק.
- **Pagination:** 20 פריטים ("טען עוד").
- **offline:** השאלות נשמרות גם ב-IndexedDB (`qaItems`, `qaTopics`) דרך `lib/qaLibrary.js`.

### 2.11 תובנות תיאולוגיות והיסטוריות - `pages/TheologicalInsights.jsx`, `pages/HistoricalInsights.jsx`
- **URL:** `/TheologicalInsights`, `/HistoricalInsights`
- **רכיב:** `InsightsBoard` (עם `kind="theological"` או `"historical"`).
- **תפקיד:** רשימת מאמרים קצרים עם חיפוש, פתיחה/סגירה, שמירה (`localStorage` - `STORAGE_KEYS.savedInsights`), שיתוף והפניה לפסוק.

### 2.12 קהילה
- **`pages/Community.jsx`** - דף הנחיתה לקהילה עם שלושה "מרכזים": Revelations, Live teaching, Discussion groups.
- **`pages/CommunityRevelations.jsx`** - פוסטים של "מה האל הראה לי". תומך בלייק, תגובות ופרסום (דורש התחברות).
- **`pages/CommunityLiveTeaching.jsx`** - רשימת שיעורים חיים (`LiveSession`) עם תאריך, מארח וקישור הצטרפות.
- **`pages/DiscussionGroups.jsx`** - קבוצות לימוד קבוצתיות, הצטרפות (`localStorage` - `joinedGroups`) ושיחה בתוך כל קבוצה (`DiscussionThread`).

### 2.13 יומן תפילה - `pages/Journal.jsx`
- **URL:** `/Journal` (דורש התחברות). תומך ב-`?new=1&book=&chapter=`.
- **תפקיד:** רשומות אישיות עם קטגוריה (`praise`, `petition`, `confession`, `thanksgiving`, `reflection`), כותרת, גוף טקסט, ספר ופרק אופציונליים.
- **רכיבים:** `JournalForm`, `JournalCard`, `Spinner`, `EmptyState`.
- **אינטראקציות:** יצירה, עריכה (`editingId`), מחיקה דרך דיאלוג אישור, סינון לפי קטגוריה.

### 2.14 הערות מקרא - `pages/BibleNotes.jsx`
- **URL:** `/BibleNotes` (דורש התחברות).
- **תפקיד:** מאגר אחד לכל ההדגשות, הסימניות וההערות של המשתמש (`StudyMark`).
- **חיבור:** כל פריט מקשר חזרה ל-`Chapter` עם הפסוק המתאים.

### 2.15 Offline - `pages/Offline.jsx`
- **URL:** `/Offline`
- **תפקיד:** מרכז ההורדות. מציג כמה נתונים שמורים לכל סוג (פרקים, פסוקים, Strong, Devotionals, Commentary, Prayers, Prayer passages, Cross references, Q&A, Verse of the day).
- **אינטראקציות:** הורדת תרגום שלם או של הספרים שנבחרו (מתקדמת פרק אחר פרק), מחיקת נתונים מקומיים, בדיקת שטח אחסון משוער.
- **חשוב:** פעולה זו מסתמכת על `bibleApi.fetchChapter` ועל `strongsOffline`.

### 2.16 דף התחברות, הרשמה ושחזור סיסמה
- **`pages/Login.jsx`** - התחברות בדוא"ל וסיסמה (`fse2.auth.login`). מפנה ל-`Dashboard`.
- **`pages/Signup.jsx`** - הרשמה עם שם מלא, דוא"ל, סיסמה (מינימום 8 תווים), מדד חוזק, ואישור תנאי שימוש. אם נדרש אימות דוא"ל - מוצגת הודעה.
- **`pages/ForgotPassword.jsx`** - שליחת קישור איפוס.
- **`pages/ResetPassword.jsx`** - קבלת `token` מה-URL ובחירת סיסמה חדשה.
- **`pages/Logout.jsx`** - מחכה 900ms, מבצע logout ומפנה לבית.

### 2.17 דפי מידע
- **`pages/About.jsx`** - על הפרויקט ("A Bible you can live with").
- **`pages/Contact.jsx`** - טופס יצירת קשר (`ContactMessage`), עם ולידציה בצד לקוח.
- **`pages/Privacy.jsx`**, **`pages/Terms.jsx`** - מדיניות פרטיות ותנאי שימוש (טקסט סטטי).
- **`pages/InstallPrompt.jsx`** - הוראות להתקנת האפליקציה כ-PWA (iOS, Android, desktop) עם `beforeinstallprompt`.

### 2.18 Admin
- **`pages/Admin.jsx`** - כניסת מנהל (דוא"ל ברירת מחדל `admin@prayread.com`). כוללת גם טופס איפוס סיסמה עם "מפתח איפוס".
- **`pages/AdminDashboard.jsx`** - לוח הניהול הראשי. ראו סעיף 2.19.

### 2.19 לוח הניהול - `pages/AdminDashboard.jsx`
- **URL:** `/AdminDashboard` (דורש session מנהל).
- **תפקיד:** מרכז לניהול כל התוכן. מכיל תפריט צד עם הסעיפים:
  - `overview` - סקירה.
  - `books` - ספרים ופרקים (`PassagesPanel`).
  - `luganda` - התקנת התרגום הלוגנדי (`LugandaInstaller`).
  - `kjvplus` - התקנת KJV+ עם Strong (`KjvPlusInstaller`).
  - `devotionals` - `DevotionalsPanel`.
  - `prayers` - `PrayersPanel`.
  - `json` - ייבוא JSON (`JsonImportPanel`) וייבוא תפילות+הפניות (`PrayerCrossRefImport`).
  - `qa` - `QaPanel`.
  - `verseSongs` - `VerseSongsPanel`.
  - `collections` - `CollectionsPanel` (ניהול גנרי של כל הקולקציות).
  - `activity` - יומן פעילות (`ActivityLog`).
  - `settings` - הגדרות אתר (`SiteSettings`) כולל צבעים, שם האתר ולינק תרומה.
- **סשן:** נשמר ב-`pr_admin_token` ו-`pr_admin_mode`, ומרוענן אוטומטית (`startAdminKeepAlive`).

---

## 3. מפת ניווט (לצרכי DEBUG)

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|------|-----------|-----------|-----|
| קריאת פרק | Home | "Begin Your Pray-Read Journey" | `BibleReader` |
| קריאת פרק | BibleReader | בחירת ספר ואז פרק | `Chapter?book=&chapter=` |
| סימון פסוק | Chapter | לחיצה על פסוק | `VerseActionBar` (inline) |
| הדגשת טקסט | Chapter/Book | בחירת טקסט | סרגל כלים צף `AnnotatedText` |
| פתיחת Strong | Chapter | לחיצה על `(G###)` | `StrongsPopup` (מודאל) |
| פסוק מוזכר | Chapter | לחיצה על הפניה | `VersePopup` (מודאל) |
| הפניה צולבת | Chapter | "Cross-references" בשורת הפסוק | `VerseCrossRefs` (inline) |
| שיתוף פסוק | Chapter | "Share" בשורת הפסוק | `ShareSheet` (מודאל) |
| נגינת שיר | VerseSongs | כפתור "Play" | `GlobalPlayer` (תחתית) |
| רכישת שיר | VerseSongs | "Buy to Download" | דף תשלום חיצוני |
| שאלה ותשובה | QA | לחיצה על שאלה | פתיחה inline |
| הצבעה Q&A | QA | 👍 / 👎 | שמירה ב-`localStorage` |
| הוספת יומן | Journal | "+ New entry" | `JournalForm` (inline) |
| שמירת דבר-יום | Devotionals | "Save" | `useDevotionalLibrary` |
| שיתוף דבר-יום | Devotionals | "Share" | `ShareSheet` |
| הורדה offline | Offline | "Download" | IndexedDB |
| התחברות | Header | "Sign in" | `Login` |
| שליחת הודעה | Contact | "Send" | `submitContactMessage` |
| כניסת מנהל | Footer/URL | `/Admin` | `AdminDashboard` |
| מחיקה | כל רשימה | אייקון פח | `ConfirmDialog` |

---

## 4. מבנה קבצים

### 4.1 שכבת עטיפה ופריסה
- `Layout.jsx` - עטיפה כללית: `AuthProvider`, `ThemeProvider`, `PlayerProvider`, `AppHeader`, `GlobalPlayer`, `AppFooter` (רק בדפים Home, QA, Devotionals).
- `components/layout/AppHeader.jsx` - תפריט ניווט (ראשי + משני), כפתור כניסה/יציאה, תפריט נייד.
- `components/layout/AppFooter.jsx` - פוטר עם קישורים מהירים ורישום תרומה.
- `components/layout/GlobalPlayer.jsx` - נגן שיר צף שחי בתחתית כל דף.
- `components/layout/PwaHead.jsx` - מוסיף meta tags, manifest ורישום service worker.
- `components/layout/ScrollToTop.jsx` - גלילה לראש הדף בשינוי נתיב/ספר/פרק.

### 4.2 רכיבי קריאה (`components/read/`)
- `BookGrid.jsx` - רשת ספרי המקרא (ישן/חדש) עם חיפוש.
- `ChapterSelector.jsx` - מסך הספר: סיידבר + רשת פרקים + משאבי מחקר.
- `ChapterGrid.jsx` - רשת פרקים (`Link` לכל פרק).
- `ChapterReaderPane.jsx` - עמודת קריאה עם תפריט מחקר (Intro, Commentary, Prayer, Cross-refs).
- `ChapterSidebar.jsx` - מסך מחקר לפרק: מבוא, פרשנות, תפילה, הפניות.
- `ChapterClosingPrayer.jsx` - תפילת הסיום של הפרק.
- `ChapterResourcesPanel.jsx` - תובנות תיאולוגיות והיסטוריות לפרק.
- `BookSidebar.jsx`, `BookIntro.jsx`, `BookOutline.jsx`, `BookPrayerPanel.jsx` - סיידבר הספר: מבוא, מתאר, תפילה לספר.
- `BookStudyResources.jsx` - משאבי מחקר לספר (פרשנות, תיאולוגיה, היסטוריה) עם פאג'ינג.
- `AnnotatedText.jsx` - טקסט שניתן לסמן (הדגשה בארבעה צבעים, קו תחתון).
- `VerseActionBar.jsx` - סרגל פעולות של פסוק.
- `VerseCrossRefs.jsx` - רשימת הפניות צולבות של פסוק.
- `CrossRefList.jsx`, `CrossRefScripture.jsx` - הצגת הפניה ותוכנה.
- `PassagePrayer.jsx` - תפילה מותאמת לקטע (לפי `matchesPassage`).
- `PassageTabs.jsx` - לשוניות פרשנות/תובנות/Q&A לקטע.
- `StrongsText.jsx` - פרסור מספרי Strong מתוך הטקסט והצגה ככתר כחול.
- `StrongsPopup.jsx` - כרטיס הגדרה למספר Strong (מקור מקומי ואז שרת).
- `ShareSheet.jsx` - מודאל שיתוף עם ערוצים (WhatsApp, Facebook, X, Telegram, Email, העתקה).
- `VersePopup.jsx` - חלון פסוק במודאל.
- `VersionPicker.jsx` - בוחר תרגום והתקנה/הסרה של גרסה.
- `FloatingVerse.jsx` - כרטיס צף קטן לפסוק.
- `VerseList.jsx` - רשימת פסוקים בסיסית (ככל הנראה חלק מתצוגת קודמת).

### 4.3 רכיבי devotionals (`components/devotional/`)
- `DevotionalCard.jsx` - כרטיס ברשימה.
- `DevotionalFeatured.jsx` - הדבר הראשי של היום.
- `DevotionalFilters.jsx` - מסננים (שפה, חיפוש, נושא, טווח, סדרה).
- `DevotionalFullView.jsx` - קריאה מלאה עם תפילה, שמירה, סימון כנקרא וניווט.

### 4.4 רכיבי קהילה (`components/community/`)
- `RevelationCard.jsx`, `RevelationForm.jsx`, `CommentThread.jsx`, `ThreadMessages.jsx`.

### 4.5 רכיבי Q&A (`components/qa/`)
- `QaCard.jsx` - כרטיס שאלה-תשובה (הדגשת הפניות בתשובה).
- `QaFilters.jsx` - שפה, חיפוש, נושא.
- `QaLetterBar.jsx` - סרגל A-Z נגלל.

### 4.6 רכיבי Verse-Songs (`components/song/`)
- `SongCard.jsx`, `SeriesCard.jsx`, `SongFilters.jsx`, `SongShareSheet.jsx`.

### 4.7 רכיבי בית (`components/home/`)
- `HomeHero`, `HomeIntro`, `JourneySteps`, `VerseOfDayCard`, `DailyDevotionalCard`, `VisionCards`, `ExperiencePoints`, `SixWaysGrid`, `ExploreBible`, `ClosingInvite`, `ImageCard` (כרטיס תמונה עם שכבת כהות), `StatCard`.

### 4.8 רכיבי כלליים (`components/common/`)
- `Modal.jsx` - מודאל גנרי (סגירה ב-Escape, נעילת גלילה ברקע).
- `ShareRow.jsx`, `EmptyState.jsx`, `Pagination.jsx`, `PageHeader.jsx`, `Spinner.jsx`, `BrandIcons.jsx` (אייקוני מותג של רשתות חברתיות).

### 4.9 רכיבי ניהול (`components/admin/`)
- `CollectionsPanel.jsx` - ניהול גנרי של כל קולקציה (מבוסס `lib/adminCollections.js`).
- `RecordEditor.jsx` - טופס רשומה דינמי מכל הגדרת שדות.
- `CrossRefEditor.jsx` - עורך שבבי להפניות צולבות.
- `ConfirmDialog.jsx` - דיאלוג אישור למחיקה.
- `PassagesPanel.jsx`, `PrayersPanel.jsx` - ניהול קטעי תפילה ותפילות.
- `DevotionalsPanel.jsx` + `DevotionalForm.jsx` + `DevotionalTopicsPanel.jsx` + `DevotionalPlansPanel.jsx` + `DevotionalBulkImport.jsx` - מחלקת הדבר-יום.
- `QaPanel.jsx` + `QaQuestionsPanel.jsx` + `QaTopicsPanel.jsx` + `QaItemForm.jsx` + `QaTopicForm.jsx` + `QaAdminList.jsx` + `QaBulkImport.jsx` - מחלקת Q&A.
- `VerseSongsPanel.jsx` + `VerseSongForm.jsx` + `VerseSongSeriesForm.jsx` + `VerseSongBulkImport.jsx` - מחלקת Verse-Songs.
- `JsonImportPanel.jsx`, `PrayerCrossRefImport.jsx` - ייבוא קבצי JSON.
- `LugandaInstaller.jsx`, `KjvPlusInstaller.jsx` - התקנה מרוכזת של תרגומים.
- `ChapterCoverage.jsx` - מציג לכל ספר אילו פרקים חסרים או פגומים (דחיסה לטווחים, לדוגמה `2-5, 9, 12`).
- `LibraryReport.jsx` - דוח ביקורת על הספרייה (קריאה בלבד, דרך `scriptureAudit`).

### 4.10 ספריות ולוגיקה (`lib/`)
| קובץ | תפקיד |
|------|------|
| `AuthContext.jsx` | קונטקסט משתמש; `checkAuth` בטעינה |
| `adminSession.js` | סשן מנהל: בדיקה, חידוש, התנתקות, קריאות מנהל |
| `adminDirect.js` | גרסה דפדפנית של פעולות הניהול (עוקפת את שרת הפונקציות) |
| `adminCollections.js` | הגדרת כל הקולקציות וטפסיהן |
| `bibleApi.js` | שליפת פרקים מקומית (IndexedDB) או מהרשת |
| `bibleBooks.js` | 66 הספרים: שמות, לוגנדה, קיצורים, מספר פרקים |
| `bookGuides.js`, `bookPrayers.js`, `bookStudyContent.js`, `keyPassages.js` | תוכן מובנה לכל ספר |
| `chapterStudy.js`, `chapterIntros.js` | תוכן מחקר לפרק |
| `bookIntro.js`, `bookImport.js`, `prayerImport.js` | ייבוא ושליפה של מבואות ותפילות |
| `prayerPassages.js` | קטעי תפילה והפניות צולבות לפרק |
| `contentApi.js` | גישה לתוכן ציבורי עם fallback לזרעים (`seedContent`) |
| `devotionals.js` | כל הלוגיקה של הדבר-יום (תאריכים, שדות, שיתוף) |
| `useDevotionalLibrary.js` | hook לשמירה ולסימון "נקרא" (מקומי + שרת) |
| `qaLibrary.js` | Q&A: מיון, סינון, חישוב אות |
| `offlineDb.js` | מעטפת IndexedDB עם 10 גרסאות של סכמה |
| `player.jsx` | נגן גלובלי (`PlayerProvider`, `usePlayer`) |
| `scriptureRefs.js` | פענוח הפניות מקראיות (כגון "Psalm 23:1") |
| `strongs.js`, `strongsOffline.js` | מספרי Strong: נרמול, אחסון מקומי |
| `studyAnnotations.js` | הדגשות וקווים תחתונים (שרת + מקומי) |
| `readings.js`, `activity.js` | מעקב קריאה ופעילות |
| `share.js` | הכנת טקסטים לשיתוף ופתיחת ערוצים |
| `theme.js`, `themeContext.jsx`, `brandCss.js`, `homeCss.js` | מיתוג וצבעים |
| `sha256.js` | SHA-256 בג'אווה-סקריפט טהור (לבדיקת סיסמה ללא Web Crypto) |
| `versions.js` | רשימת התרגומים והגדרותיהם |
| `verseSongs.js` | נירמול שירים וסדרות, בניית תור נגינה |
| `planData.js` | 30 יום של תוכנית קריאה |

### 4.11 דפים (`pages/`)
ראו סעיף 2. בנוסף קיימים קבצי `Insights`, `Read` ו-`AdminDiag` ב-`__trash/` - אלה נתיבים שנמחקו או ננטשו ואינם בשימוש.

### 4.12 קבצי ישויות (`entities/`)
ראו סעיף 5.

### 4.13 פונקציות שרת (`functions/`)
| קובץ | תפקיד |
|------|------|
| `adminAuth.js` | התחברות מנהל, יצירת טוקן חתום (HMAC), איפוס סיסמה, חידוש סשן |
| `adminContent.js` | API לניהול תוכן עם טוקן מנהל |
| `bibleChapter.js` | שליפת פרק מ-bible-api.com (EN) ו-wordplanet (LU) |
| `content.js` | API ציבורי: תוכן, שליחת הודעות קשר, שאלות |
| `kjvInstall.js` | התקנת KJV+ לפי פרק, עם מספרי Strong |
| `lugandaInstall.js` | התקנת התרגום הלוגנדי לפי פרק |
| `scriptureAudit.js` | דוח ביקורת, לקריאה בלבד |
| `strongsDefinition.js` | מטמון הגדרות Strong (מקור ציבורי + Blue Letter Bible) |

### 4.14 Cron (`cron/`)
- `scriptureInstall.js` - רץ כל שעה, ממלא פרקים חסרים בלוגנדה וב-KJV+ ומשלים הגדרות Strong. עוצר כשריצה לא מתקדמת, כדי לא להעמיס על המקור.

### 4.15 קבצי נכסים (`public/`)
- `manifest.json` - הגדרות PWA (display: standalone, צבע #1d4035).
- `sw.js` - Service Worker: cache-first לשלד האפליקציה, network-first לשאר.
- `assets/` - תמונות רקע ונכסי מדיה שהועלו (לא נעשה בהם שימוש ישיר בקוד שסופק מלבד URL).

---

## 5. מודל הנתונים (Entities)

### 5.1 תוכן ציבורי (נקרא על ידי כולם, נכתב על ידי admin)
| Entity | תכלית | שדות מרכזיים | קשרים |
|--------|-------|--------------|-------|
| `Devotional` | דבר-יום דו-לשוני | `code`, `title_en/lu`, `scripture_ref`, `verse_en/lu`, `body_en/lu`, `prayer_en/lu`, `topic`, `series`, `date`, `cover_url`, `featured`, `active` | `topic` ↔ `DevotionalTopic.name_en`; `series` ↔ `DevotionalPlan.name_en` |
| `DevotionalTopic` | נושא לקיבוץ דבר-יום | `name_en`, `name_lu`, `active` | - |
| `DevotionalPlan` | תוכנית קריאה של N ימים | `name_en`, `name_lu`, `description`, `days`, `active` | מזוהה לפי `name_en` מול `Devotional.series` |
| `Prayer` | ספריית תפילות | `title`, `title_lu`, `category`, `body_en/lu`, `scripture_ref`, `cross_refs` | - |
| `PrayerPassage` | תפילה לפרק/קטע/פסוק (מיובא) | `book_number`, `chapter`, `verse`, `verse_end`, `title_en/lu`, `prayer_en/lu` | `book_number` → ספר |
| `CrossReference` | הפניה צולבת מפסוק לפסוק | `book_number`, `chapter`, `verse`, `ref_book_number`, `ref_chapter`, `ref_verse`, `ref_verse_end`, `ref_text_en/lu`, `note_en/lu` | - |
| `ChapterIntro` | מבוא לפרק | `book_number`, `chapter`, `title_en/lu`, `intro_en/lu`, `source` | - |
| `BookIntro` | מבוא לספר ותפילת סיום | `book_number`, `book_name`, `title_en/lu`, `intro_en/lu`, `closing_prayer_en/lu` | - |
| `Commentary` | פרשנות לפרק | `book`, `chapter`, `title`, `body_en/lu` | לפי שם ספר (טקסט) |
| `Insight` | תובנה תיאולוגית/היסטורית | `kind` (theological / historical), `title`, `passage`, `excerpt`, `body`, `share_count` | - |
| `VerseOfDay` | פסוק יום | `verse_date`, `reference`, `text_en/lu`, `note` | לפי תאריך |
| `QATopic` | נושא Q&A | `name_en/lu`, `description_en/lu`, `active` | - |
| `QAItem` | שאלה ותשובה | `topic_en/lu`, `topic_id`, `scripture_ref`, `question_en/lu`, `answer_en/lu`, `tags`, `featured`, `active` | `topic_en` ↔ `QATopic.name_en` |
| `VerseSongSeries` | סדרת שירים | `name`, `display_order`, `description`, `thumbnail`, `cover_image`, `accent`, `featured`, `active` | - |
| `VerseSongEpisode` | שיר בסדרה | `series_name`, `title`, `audio_url`, `duration_seconds`, `cover_url`, `episode_order`, `plays_count`, `active` | `series_name` ↔ `VerseSongSeries.name` |
| `LiveSession` | שיעור חי | `title`, `session_date`, `host`, `join_link`, `description` | - |
| `DiscussionGroup` | קבוצת לימוד | `name`, `description`, `schedule`, `member_count` | - |
| `DiscussionThread` | הודעה בקבוצה | `group_name`, `owner_email`, `author_name`, `title`, `body` | `group_name` ↔ `DiscussionGroup.name` |
| `Revelation` | "מה האל הראה לי" + תגובות | `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id` | `parent_id` מצביע לפוסט מקורי |
| `ContactMessage` | הודעת קשר | `name`, `email`, `subject`, `message`, `is_read`, `reply` | - |
| `SiteSettings` | הגדרות אתר | `setting_key`, `setting_value` | - |
| `StrongEntry` | הגדרת מספר Strong | `code`, `language`, `original_word`, `transliteration`, `definition`, … | `code` → מספר Strong |
| `KjvPlusChapter` | פרק KJV+ מלא (JSON) | `book_number`, `chapter`, `verse_count`, `verses` (JSON) | - |
| `LugandaChapter` | פרק לוגנדה מלא (JSON) | `book_number`, `chapter`, `verse_count`, `verses` (JSON) | - |
| `BibleVerse` | פסוק בודד דו-לשוני | `book_number`, `chapter`, `verse`, `text_en`, `text_lu` | - |

### 5.2 נתוני משתמש (נקראים ונכתבים רק על ידי הבעלים)
| Entity | תכלית | שדות | הערות |
|--------|-------|------|------|
| `Reading` | פרק שהושלם | `owner_email`, `book`, `chapter`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses` | מזין את הדשבורד ואת תוכנית הקריאה |
| `StudyMark` | הדגשה/סימניה/הערה על פסוק | `owner_email`, `mark_type` (highlight/bookmark/note), `book_number`, `chapter`, `verse`, `color`, `note_text` | |
| `StudyAnnotation` | הדגשה/קו תחתון בתוך טקסט | `owner_email`, `book_number`, `section`, `block_id`, `kind`, `start_offset`, `end_offset`, `color` | ב-sidebar של הספר |
| `ReadingActivity` | לוג פעולות | `owner_email`, `activity_type`, `book`, `chapter`, `verse` | מזין את `ActivityFeed` |
| `JournalEntry` | רשומת יומן תפילה | `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood` | |
| `DevotionalSaved` | דבר-יום שנשמר | `owner_email`, `devotional_code`, `saved_date` | |
| `DevotionalProgress` | דבר-יום שנקרא | `owner_email`, `devotional_code`, `completed_date` | |
| `PrayerSaved` | תפילה במועדפים | `owner_email`, `prayer_title` | |
| `Revelation` (ראו לעיל) | פוסטים של משתמשים | `owner_email` | |
| `DiscussionThread` (ראו לעיל) | הודעות | `owner_email` | |

### 5.3 ניהול ומערכת
| Entity | תכלית | גישה |
|--------|-------|------|
| `AdminAccount` | מייל + hash של סיסמה + salt + secret | owner/admin בלבד |
| `ActivityLog` | יומן פעולות מנהל | קריאה למנהל בלבד |
| `QAEntry` | שאלות שהוגשו על ידי קוראים (ישן; הוחלף ב-`QAItem`) | יצירה לכל משתמש מחובר |

### 5.4 הרשאות
כל entity מוגדר עם `x-fse2-access` שמפרט מי רשאי לבצע מה. הדפוס הרווח:
- **ציבורי:** `read` ל-`*`, `create/update/delete` ל-`owner`, `admin`.
- **משתמש:** `create/read/update/delete` ל-`owner`, `admin`, `user`, `authenticated`, עם הסינון בצד לקוח לפי `owner_email`.

> **שים לב:** בחלק מהישויות (`Reading`, `JournalEntry`, `ReadingPlan`) הכללים מוגדרים בגרסה 2 עם `policy`. מומלץ לבדוק את הגדרת ה-`read` שם, כי היא מחזירה מערך ריק. ייתכן שזו הגדרת ברירת מחדל ולא מגבלה.

---

## 6. תהליכים ואינטראקציות מרכזיות

### 6.1 קריאת פרק עם סימון
1. משתמש נכנס ל-`BibleReader` ובוחר ספר. `BookGrid` מציג את הספרים הזמינים לפי `offline.getAll("chapters")`.
2. בחירה בפרק מובילה ל-`Chapter?book=X&chapter=Y`.
3. `Chapter.jsx` קורא ל-`fetchChapter` שמחזיר פסוקים (מקומי קודם, אחר כך רשת).
4. לחיצה על פסוק פותחת `VerseActionBar`.
5. בחירת צבע הדגשה קוראת ל-`saveAnnotation` (שרת `StudyMark` + IndexedDB אם לא מחובר).
6. `logReadingActivity` מתעד את הפעולה לדשבורד.

### 6.2 התקנת תרגום לוגנדה (מנהל)
1. מנהל נכנס ל-`AdminDashboard` → "Luganda Bible".
2. `LugandaInstaller` מזהה חסרים דרך `scriptureAudit` ו-`status`.
3. לחיצה על "Install" קוראת לפונקציה `lugandaInstall` עם `action: "install"` (לפי קצב סבבים).
4. בכל סבב מתעדכן `ChapterCoverage` עם הפרקים שהושלמו.
5. במקביל, `scriptureInstall` (cron) ממשיך מילוי כל שעה.

### 6.3 ייבוא JSON של תפילות והפניות
1. מנהל מוריד תבנית (`TEMPLATE`) מ-`JsonImportPanel`.
2. ממלא ומעלה את הקובץ.
3. `prepareImport` מאמת: שדות חובה, תאריכים, מספרי ספר, שפה (EN + LU).
4. מוצגת תצוגה מקדימה עם שגיאות. הכפתור "Import" נשאר סגור כל עוד יש שגיאה.
5. ייבוא מתבצע לפי natural key (`passageNaturalKey`, `crossRefNaturalKey`). קובץ זהה שמיובא שוב **מעדכן** ולא מכפיל.

### 6.4 שיתוף דבר-יום
1. `DevotionalFullView` → "Share".
2. `ShareSheet` נפתח עם טקסט מוכן (`buildDevotionalShareText`) וקישור (`devotionalUrl`).
3. לחיצה על ערוץ פותחת `openShare(channel, text, url)`.
4. ערוצים שאינם תומכים בטקסט (Facebook, LinkedIn, Instagram) מעתיקים את הקישור בלבד.

### 6.5 רכישת שיר (Verse-Songs)
1. משתמש לוחץ על "Buy to Download".
2. נשמר `pending_verse_song_purchase` ב-`localStorage`.
3. נפתח `PESAPAL_URL` בחלון חדש.
4. בחזרה (אם המשתמש מסמן ידנית שאושר, או דרך URL), `purchased_verse_songs` מתעדכן.
5. לחיצה על "Download Again" מורידה את הקובץ.

> **זהירות אבטחה:** הזרימה כולה בצד הלקוח. אין אימות שרתי של תשלום. מומלץ לחבר webhook של Pesapal לשרת.

### 6.6 כניסת מנהל
1. `/Admin` → `adminSignIn(email, password)`.
2. `adminAuth` בודק את ה-hash (SHA-256 עם salt), ומחזיר טוקן חתום.
3. אם הפונקציה לא זמינה לדפדפן (שער הפונקציות סגור), עובר למסלול **browser-direct** ב-`adminDirect.js`, שמאמת מול `AdminAccount` ישירות.
4. נשמר `pr_admin_token` ו-`pr_admin_mode`.
5. `startAdminKeepAlive` מחדש את הסשן בכל שימוש.

### 6.7 שחזור סיסמה למשתמש רגיל
1. `ForgotPassword` → `fse2.auth.forgotPassword(email)`.
2. המשתמש מקבל מייל עם לינק ל-`/ResetPassword?token=...`.
3. `ResetPassword` שולח `fse2.auth.resetPassword(token, password)`.

---

## 7. הערות טכניות לפיתוח

### 7.1 ספריות וכלים עיקריים
- **React** עם hooks בלבד (ללא class components).
- **react-router-dom** לניווט. פרמטרי שאילתה (`?book=`, `?chapter=`) משמשים כמצב של העמוד (ראו `Chapter`, `VerseSongs`).
- **@tanstack/react-query** לכל שליפות הנתונים. מפתחות מרכזיים: `["prayers"]`, `["devotionals"]`, `["readings", email]`, `["bookIntro", bookNumber]`.
- **date-fns** לתאריכים (`formatDistanceToNow`, `format`).
- **lucide-react** לאייקונים. לכל אייקון מותג (WhatsApp וכו') יש קובץ נפרד ב-`BrandIcons.jsx`.
- **IndexedDB** דרך `lib/offlineDb.js` - ממשק קטן עם `getAll`, `put`, `get`, `delete`. הסכמה עברה 10 גרסאות ולכן יש חשיבות לשמירה על תאימות אחורה.

### 7.2 דפוסים חוזרים
- **fallback לזרע (seed):** כמעט כל עמוד ציבורי מציג את `seedContent` כשאין נתונים מהשרת, ומשלב את שני המקורות בזהירות (מזהה לפי כותרת). **בעת הוספת תוכן חדש, ודא שהכותרת ייחודית** כדי שלא יופיע כפול.
- **`safeText` / `safeId`** ב-`lib/format.js` - מונע הדפסת אובייקטים בטעות ב-JSX. השתמש בהם בכל שדה שמגיע מהשרת.
- **`selectionInside(node)`** ב-`lib/textSelection.js` - מונע פתיחת פסוק/כותרת כשהמשתמש מסמן טקסט. חובה בכל `onClick` שמתחיל ליד טקסט מסומן.
- **`createPageUrl(name)`** מ-`@/utils` - בונה URL. לא כותבים כתובות ידניות.
- **`bilingualText`** ב-`lib/bilingual.js` - מוציא ערכים דו-לשוניים מכל צורה אפשרית של קלט (מחרוזת, אובייקט, שדות בשמות שונים). משמש בייבוא.
- **Dual-write** ל-`StudyAnnotation`/`StudyMark`: כתיבה לשרת ו-IndexedDB, עם מיזוג (`mergeAnnotations`) בקריאה. מפתח הייחוד: `annotationKey` (ראו `lib/studyAnnotations.js`).

### 7.3 נקודות רגישות
- **שמות השדות:** בישויות רבות יש גם שדות ישנים (`title`, `body`) וגם חדשים (`title_en`, `body_en`). הפונקציה `fieldOf` ב-`devotionals.js` ו-`bilingualText` מטפלות בשניהם. **אל תמחק את הקריאה לשדות הישנים** לפני שמיגרציה הושלמה.
- **נתיבי ה-admin כפולים:** `functions/adminContent.js` (שרתי) ו-`lib/adminDirect.js` (דפדפן). שינוי ב-API של אחד חייב להשתקף בשני. זה המקום הנפוץ ביותר לבאגים.
- **נגן:** `PlayerProvider` מחזיק `<audio>` אחד ברמת השורש. **לא לעשות unmount** ל-`PlayerProvider` ולא ליצור `Audio()` נוסף בדפים, אחרת ינוגנו שני שירים במקביל.
- **Strong'ים:** הטקסט של KJV+ מסומן בתבנית `(G1234)` / `(H1234)`. הפרסור ב-`StrongsText.jsx` מניח שהמילה לפני הקוד קיימת. מספר Strong מנורמל (`normalizeStrongCode`) - `H0436` ו-`H436` הם אותו דבר.
- **Q&A letter:** האות מחושבת מהשאלה בזמן ריצה (`letterOf`). **לעולם אל תשמור אות במסד הנתונים**, כדי שלא תישאר אות מיושנת אחרי עריכה.
- **תוכנית הקריאה:** `findPlanDay` מזהה יום לפי `book` + `chapter`, בלי תלות במספר יום. אם תוסיף ספר לתוכנית, ודא שהשם תואם לשם ב-`bibleBooks`.
- **טוקן מנהל:** `adminSession` מסתמך על `localStorage`. לא לשמור שם שום מידע רגיש נוסף בו.

### 7.4 בעיות ידועות וסיכונים (לתשומת לב)
1. **סיסמה ברירת מחדל בקוד:** `functions/adminAuth.js` מכיל `DEFAULT_PASSWORD` ו-`DEFAULT_RESET_KEY` כטקסט גלוי. ב-production חובה להסיר ולהסתמך על secrets בלבד.
2. **`pages/Admin.jsx`** ממלא את שדה הדוא"ל כברירת מחדל. זה נוח, אבל מגלה את שם המשתמש של המנהל.
3. **תשלום שירים** נעשה בצד לקוח בלבד (ראו 6.5).
4. **הצבעות Q&A** נשמרות ב-`localStorage` בלבד. אינן מסונכרנות בין מכשירים ואינן מוגבלות בכמות.
5. **`VerseSongEpisode.plays_count`** מוגדר ב-entity אבל לא נראה שהקוד המוצג מעדכן אותו.
6. **קבצי `__trash/`** עדיין נמצאים בפרויקט. מומלץ למחוק אותם, כולל `functions/_hashcheck.js` ו-`functions/_digestCheck.js` שמכילים hash של סיסמה.
7. **`pages/Dashboard.jsx`** מייבא את `Home` (`import Home from "@/pages/Home"`) ככל הנראה בטעות. זה מיותר ומגדיל את ה-bundle.
8. **`ChapterSelector.jsx`** ו-**`ChapterSidebar.jsx`** חופפים חלקית בתפקידם. לפני שינוי באחד מהם, בדוק אם השני משתמש באותה לוגיקה.

### 7.5 כיצד להוסיף פיצ'ר חדש (צ'ק-ליסט)
1. **נתונים:** הגדר `entities/<Name>.json` עם `x-fse2-access` נכון. ודא שיש לך הרשאות `read` לציבור אם זה תוכן ציבורי.
2. **גישה לנתונים:** הוסף פונקציה ל-`lib/contentApi.js` (ציבורי) או השתמש ישירות ב-`fse2.entities` (אישי).
3. **קאש:** הגדר `queryKey` ייחודי, ואם צריך offline - הוסף store ב-`lib/offlineDb.js` והגדל את `DB_VERSION`.
4. **עמוד:** צור `pages/<Name>.jsx` והוסף אותו ל-`AppHeader` (NAV_ITEMS או SECONDARY_ITEMS) ול-`sw.js` (SHELL) אם צריך offline.
5. **ניהול:** הוסף את הישות ל-`lib/adminCollections.js` (אם ניתנת לעריכה גנרית), או צור פאנל ייעודי ב-`components/admin/`, וחבר אותו לתפריט ב-`AdminDashboard`.
6. **תרגום:** כל טקסט משתמש חייב להיות דו-לשוני (EN ו-LU) כשהוא תוכן. ממשק (כפתורים, כותרות) באנגלית בלבד בהתאם לקוד הקיים.
7. **בדיקה:** בדוק עם משתמש אורח, משתמש מחובר ומנהל. בדוק גם ללא חיבור לאינטרנט (offline).

---

*מסמך זה מתאר את מצב הקוד כפי שסופק. בכל שינוי מהותי מומלץ לעדכן את הסעיפים 2, 3 ו-5 בהתאם.*
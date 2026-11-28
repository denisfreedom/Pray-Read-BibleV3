# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

> מסמך זה נכתב על בסיס קוד המקור שסופק. קטעים רבים מהקבצים נחתכו בהעתקה, ולכן חלק מהפרטים (למשל שדות מלאים של כל ישות, או לוגיקה פנימית של כמה רכיבים) מבוססים על מה שניתן לראות ועל שמות הקבצים והפונקציות. במקומות שבהם הפרט אינו ודאי, הדבר מצוין במפורש.

---

## 1. מהות המערכת

**Pray-Read Bible** היא אפליקציית web מבוססת React (עם PWA) שמטרתה לאפשר לקורא לקרוא את המקרא בצורה מעמיקה ורוחנית: פרק שלם, לצד הערות לימוד, תפילות הקשורות לקטעים, הפניות צולבות, ומילונים של מספרי Strong. האפליקציה דו-לשונית (אנגלית ולוגנדה - Luganda) ומיועדת במיוחד לקהל באוגנדה ובקהילות דוברות לוגנדה, אך גם לקהל דובר אנגלית.

**הערך שהיא מספקת:**
- קריאת המקרא בשתי שפות, כולל 66 הספרים ו-1,189 הפרקים.
- תפילה ולימוד: לכל ספר ולכל פרק יש מבוא, תפילה לסיום, וקטעי תפילה (Prayer Passages) הקשורים לפסוקים.
- הפניות צולבות (Cross-references) וכלי לימוד (הדגשות, הערות, סימניות).
- ספריית תוכן: תפילות, דבריות יומיות (Devotionals), שאלות ותשובות (Q&A), תובנות תיאולוגיות והיסטוריות, שירי פסוקים (Verse-Songs) עם נגן אודיו גלובלי.
- אופליין: הורדת פרקים, דבריות ומילונים למכשיר, כך שהאפליקציה עובדת בלי חיבור.
- מערכת ניהול תוכן (Content Manager / Admin) לעריכה, ייבוא קבצי JSON/CSV והתקנת תרגומים.
- קהילה: התעוררויות (Revelations), קבוצות דיון, שידורים חיים.
- יומן תפילה (Journal), תוכנית קריאה של 30 יום, ולוח קריאה אישי (Dashboard).

**משתמשים:**
- **קורא אנונימי** - יכול לקרוא, להוריד לאופליין, ולשתף. אין שמירה בשרת.
- **קורא מחובר** - שומר הדגשות, הערות, יומן, התקדמות בתוכנית.
- **מנהל תוכן (Admin)** - מתחבר דרך `/Admin` ועורך את כל הקולקציות.

---

## 2. עמודים ותפקידיהם

> הערה: הנתיבים מיוצרים על ידי `createPageUrl(name)` מתוך `@/utils`. במסמך מובא שם העמוד (`pages/Name.jsx`) והנתיב המשוער `/Name`.

### 2.1 דף הבית - `pages/Home.jsx` (נתיב: `/Home` או `/`)
- **תפקיד:** דף פתיחה שמציג את הערך של האתר.
- **תוכן:** Hero עם תמונה ו-CTA, "הדבריה של היום" (Devotional של התאריך, נבחר בצורה דטרמיניסטית עם `pickDailyDevotional`), תפילה/שאלה/קטע מומלץ, רשת כרטיסים (`GRID`) לכל מודול באתר, ותחתית עם הסבר לאפליקציה.
- **פעולות:** שיתוף הדבריה (ShareSheet), מעבר לדבריות, כניסה לקורא.

### 2.2 קורא המקרא - `pages/BibleReader.jsx` (`/BibleReader`)
- **תפקיד:** עמוד בחירת ספר. מציג את 66 הספרים בשני "סקשנים" (ברית ישנה / חדשה) עם חיפוש.
- **רכיבים:** `BookGrid` (רשת הספרים, לשוניות Old/New, חיפוש לפי שם באנגלית, לוגנדה, וקיצור), `ChapterSelector` (אחרי בחירת ספר).
- **סימון offline:** עמוד קורא את `offline.getAll("chapters")` ומסמן ספר כ"זמין אופליין" רק אם *כל* פרקיו מאוחסנים מקומית (לפי שפה).
- **פעולות:** בחירת ספר → נשלח ל-ChapterSelector שמציג את הפרקים; בחירת פרק → ניווט ל-`/Chapter`.

### 2.3 עמוד פרק - `pages/Chapter.jsx` (`/Chapter?book=N&chapter=M&verse=V&lang=...`)
- **תפקיד:** העמוד המרכזי של הלימוד. מציג את טקסט הפרק בגרסה הנבחרת, לצד הפאנלים של המחקר.
- **פרמטרים ב-URL:** `book` (מספר 1 - 66), `chapter`, `verse` (לקישור עמוק - גלילה לפסוק), `lang` (`en` / `lu` / `both`), `version`.
- **רכיבים מרכזיים:**
  - `VersionPicker` - מעבר בין גרסאות מותקנות (KJV, KJV+ עם Strong, WEB, Luganda ועוד).
  - `ChapterReaderPane` - עמודת הקריאה, עם תפריט לשלושה חלקים: Intro, Commentary, Prayer, Cross-refs.
  - `VerseActionBar` - פעולות לכל פסוק (הדגשה בארבעה צבעים, סימניה, העתקה, שיתוף, הערה, הפניות צולבות, תפילה, פירוש).
  - `VerseCrossRefs` / `CrossRefList` / `CrossRefScripture` - הפניות צולבות עם טקסט הפסוק המקושר.
  - `PassagePrayer` - תפילה לקטע (Prayer Passage) שמתאימה לפסוק.
  - `PassageTabs` - לשוניות: Commentary, Theological, Historical, Q&A לקטע.
  - `ChapterClosingPrayer` - תפילת סיום הפרק בתחתית.
  - `StrongsText` / `StrongsPopup` - מספרי Strong כחולים; לחיצה פותחת הגדרה.
  - `AnnotatedText` - טקסט שניתן לסמן (בחירה → סרגל כלים).
  - `ShareSheet` - שיתוף לפי ערוצים.
  - `ChapterSidebar` (לפי הקוד: ממוקם מחוץ ל-Chapter ב-`components/read`) - סקשנים של Intro/Commentary/Prayer/Cross-refs.
- **מנגנוני פעילות:** בכל פתיחה נשלחת רשומת `ReadingActivity` (אם מחובר) ו-`logReadingActivity`. בסיום, `recordReading` מעדכן את התוכנית.
- **גלילה:** `ScrollToTop` מופעל על שינוי `book`/`chapter`, אבל לא על `verse` - כדי שקישורים לפסוק יגללו אליו.

### 2.4 ספרי ההפניה והלימוד - `pages/BookStudy`? (לא נמצא בקוד)
בקוד מופיע `components/read/BookSidebar` עם שלושה סקשנים: **Book Intro**, **Book Outline**, **Book Prayer**, ו-`BookStudyResources` (Book Commentary, Theological, Historical) בתחתית הרשת של הפרקים. רכיבים אלה מופעלים מתוך `ChapterSelector`.

### 2.5 Q&A - `pages/QA.jsx` (`/QA`)
- **תפקיד:** ספריית שאלות ותשובות, מסודרת לפי אות A - Z.
- **פילטרים:** שפה (EN / LU / BOTH), חיפוש, נושא (`All Topics` + נושאים מהשרת).
- **רכיבים:** `QaLetterBar` (סרגל אותיות גולל), `QaCard` (כרטיס עם תשובה מקופלת שנפתחת בלחיצה), `QaFilters`.
- **פעולות:** פתיחה/סגירה של תשובה, הצבעה (👍/👎, נשמרת ב-`localStorage` תחת `pr_qa_votes`), העתקה, שיתוף, קישור לפסוק.
- **שמירה על עמוד:** הפילטרים נשמרים ב-URL (`lang`, `topic`, `letter`, `search`), כך שניתן לשתף.
- **Pagination:** `PAGE_SIZE = 20` עם "הצג עוד".

### 2.6 דבריות - `pages/Devotionals.jsx` (`/Devotionals`)
- **תפקיד:** ארכיון דבריות יומיות.
- **מבנה:** דבריה "היום" בראש (`DevotionalFeatured`), ואחריה רשימה (`DevotionalCard`) ותצוגה מלאה (`DevotionalFullView`) עם ניווט Previous/Next.
- **סינונים:** שפה (EN/LU/BOTH), חיפוש טקסטואלי (על כותרות, פסוקים, גוף, נושא), נושא (`topic`), סדרה (`series`), טווח זמן (`today` / `week` / `month` / `all`).
- **שמירה למקומי:** `useDevotionalLibrary` - דבריות שמורות וסימון "נקרא" (נשמרות ב-localStorage, ומסתנכרנות לשרת למחוברים).
- **שיתוף:** `ShareSheet` עם טקסט מובנה (`buildDevotionalShareText`) וקישור (`devotionalUrl`).
- **עימוד:** `PAGE_SIZE = 12`.

### 2.7 תפילות - `pages/PrayerLibrary.jsx` (`/PrayerLibrary`)
- **תפקיד:** ספריית תפילות לפי קטגוריות (Morning, Healing, Family, ...).
- **פעולות:** חיפוש, סינון קטגוריה, מעבר שפה, שמירה למועדפים (`PrayerSaved` למחוברים), שיתוף (`ShareRow`), קישור לפסוקים (`chapterLink`).
- **הערה:** מועדפים נשמרים בשרת רק למחוברים; אורחים מקבלים הודעה להתחבר.

### 2.8 שירי פסוקים - `pages/VerseSongs.jsx` ו-`pages/VerseSongSeries.jsx`
- **VerseSongs** (`/VerseSongs`): רשימת שירים עם חיפוש, סינון לפי סדרה/ספר, כרטיס לכל שיר (`SongCard`) עם Play/Pause, שיתוף (`SongShareSheet`), ו-Download.
- **VerseSongSeries** (`/VerseSongSeries?series=ID`): מציג רשימת סדרות (`SeriesCard`) או שירי סדרה אחת.
- **נגן גלובלי:** `GlobalPlayer` ב-`Layout` נשאר פעיל בכל ניווט.
- **מודל מסחרי:** הזרמה חינמית; הורדה ב-**$2 לשיר** דרך עמוד תשלום חיצוני (`store.pesapal.com`). השרות שומר בקשה ב-`localStorage` (`pending_verse_song_purchase`) ורשימת רכישות (`purchased_verse_songs`). **שימו לב:** ההרשאה להורדה נשמרת מקומית בלבד ואינה מאומתת בשרת - יש לזה השלכות אבטחה (ראו סעיף 7).

### 2.9 תוכנית קריאה - `pages/Plan.jsx` (`/Plan`)
- **תפקיד:** תוכנית קריאה של 30 יום (ברירת מחדל: יוחנן + תהילים). `PLAN_DAYS` הוא fallback אם הטבלה ריקה.
- **תצוגה:** שורות (`PlanRow`) עם סטטוס: `completed` / `current` / `upcoming`. התקדמות באחוזים.
- **למחוברים:** הקריאות נשמרות ב-`Reading` עם `plan_day`.

### 2.10 יומן תפילה - `pages/Journal.jsx` (`/Journal`)
- **תפקיד:** יומן אישי (דורש התחברות).
- **פעולות:** יצירה/עריכה/מחיקה (`JournalForm`, `JournalCard`), סינון לפי קטגוריה (`praise`, `petition`, `confession`, `thanksgiving`, `reflection`), קישור לספר/פרק.
- **פרמטרים ב-URL:** `?new=1&book=...&chapter=...` פותח טופס עם ערכים מוזרקים.

### 2.11 הערות וסימניות - `pages/BibleNotes.jsx` (`/BibleNotes`)
- **תפקיד:** רשימה מאוחדת של `StudyMark` - highlights, bookmarks, notes.
- **קישור:** לכל רשומה, קישור חזרה לפסוק (`Chapter?book=..&chapter=..&verse=..`).

### 2.12 לוח בקרה - `pages/Dashboard.jsx` (`/Dashboard`)
- **תפקיד:** סיכום אישי: רצף קריאה (streak), מונים (הדגשות, סימניות, הערות, דבריות שנקראו), מצב אופליין, פעילות אחרונה (`ActivityFeed`).
- **נתונים:** `Reading`, `StudyMark`, `DevotionalProgress`, `PrayerSaved`, `ReadingActivity`.
- **אורחים:** מוצג `SignInBanner`-דומה עם CTA להתחברות.

### 2.13 אופליין - `pages/Offline.jsx` (`/Offline`)
- **תפקיד:** מרכז ההורדות. לכל "סקשן" (chapters, verses, strongs, devotionals, commentary, prayers, prayerPassages, crossReferences, qa, verseOfDay) יש כפתור הורדה ומחיקה, ומד נפח (`bytesToMb`).
- **תרגומים:** לפי `VERSIONS` ב-`lib/versions.js`.
- **תוכנית:** מורידה במיוחד את ספרי התוכנית (John, Psalms).
- **לוגיקה:** `chapterIsReadable` בודק אם הפרק קיים ותקין לפני שמירה, ו-`fetchChapter` מביא מהמקור.

### 2.14 קהילה
- **Community** (`/Community`) - מרכז (`HUBS`) לשלושה אזורים: Revelations, Live Teaching, Discussion Groups.
- **CommunityRevelations** (`/CommunityRevelations`) - פוסטים של קוראים (`RevelationCard`, `RevelationForm`), לייק, תגובות (`CommentThread`). מי שאינו מחובר רואה הזמנה להתחבר.
- **CommunityLiveTeaching** (`/CommunityLiveTeaching`) - רשימת שידורים (`LiveSession`) עם תאריך, מארח, וקישור הצטרפות.
- **DiscussionGroups** (`/DiscussionGroups?group=ID`) - קבוצות לימוד, הצטרפות (נשמרת מקומית ב-`joinedGroups`), ו-`ThreadMessages` להודעות בתוך הקבוצה.

### 2.15 תובנות - `pages/TheologicalInsights.jsx` ו-`pages/HistoricalInsights.jsx`
שניהם משתמשים ב-`InsightsBoard` עם `kind` = `theological` או `historical`. מציג כרטיסים עם חיפוש, פתיחה/סגירה, שמירה מקומית (`STORAGE_KEYS.savedInsights`) ושיתוף.

### 2.16 פסוק היום - `pages/VerseOfDay.jsx` (`/VerseOfDay`)
בוחר פסוק לפי `verse_date === today` מתוך `VerseOfDay`; ברירת מחדל מ-`VERSE_OF_THE_DAY`.

### 2.17 עמודים סטטיים ואימות
- **About** (`/About`) - תיאור הפרויקט.
- **Contact** (`/Contact`) - טופס הודעה (`ContactMessage`), עם ולידציה בסיסית (שדות חובה, `@`).
- **Privacy** (`/Privacy`) ו-**Terms** (`/Terms`) - טקסטים משפטיים.
- **InstallPrompt** (`/InstallPrompt`) - הוראות התקנה כ-PWA, כולל `beforeinstallprompt` ב-Chrome/Android ו-Safari ב-iOS.
- **Login** (`/Login`) - `fse2.auth.login(email, password)`, ניווט ל-Dashboard.
- **Signup** (`/Signup`) - רישום עם בדיקת חוזק סיסמה (`strengthOf`), תנאי שימוש, ותמיכה ב-"verification_required".
- **ForgotPassword** (`/ForgotPassword`) ו-**ResetPassword** (`/ResetPassword?token=...`) - איפוס סיסמה.
- **Logout** (`/Logout`) - מפעיל `logout(false)` אחרי 900ms ומנווט ל-Home.

### 2.18 עמודי מנהל
- **Admin** (`/Admin`) - כניסה: `adminSignIn(email, password)`. אם יש סשן תקף, מנווט ישירות ל-AdminDashboard. תמיכה ב"שכחתי סיסמה" עם מפתח איפוס (reset key).
- **AdminDashboard** (`/AdminDashboard`) - הלוח הראשי של המנהל. ראו סעיף 2.19.

### 2.19 AdminDashboard - מבנה
העמוד מכיל תפריט צד (`SECTIONS`) עם הפאנלים הבאים:

| מזהה | כותרת | רכיב |
|------|-------|------|
| `overview` | Dashboard | סטטיסטיקות (`StatCard`) וחלקים כלליים |
| `books` | Books & Chapters | `PassagesPanel` + `LibraryReport` |
| `luganda` | Luganda Bible | `LugandaInstaller` |
| `kjvplus` | KJV+ with Strong's | `KjvPlusInstaller` |
| `devotionals` | Devotionals | `DevotionalsPanel` |
| `qa` | Q&A | `QaPanel` |
| `verseSongs` | Verse-Songs | `VerseSongsPanel` |
| `prayers` | Prayer Library | `PrayersPanel` (mode=library) |
| `passages` | Prayer Passages | `PrayersPanel` (mode=passages) + `PrayerCrossRefImport` |
| `import` | JSON Import | `JsonImportPanel` |
| `collections` | כל הקולקציות | `CollectionsPanel` |
| `settings` | הגדרות | `SiteSettings` ורכיבי עיצוב |
| `activity` | יומן פעילות | `ActivityLog` |
| `messages` | הודעות | `ContactMessage` |

(שמות ה-id המדויקים עשויים להשתנות בקוד; יש לוודא את `SECTIONS` בקובץ.)

---

## 3. מפת ניווט (לצרכי DEBUG)

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|-------|------------|------------|-----|
| קריאת פרק | `/BibleReader` | בחירת ספר ואז פרק | `/Chapter?book=N&chapter=M` |
| קריאה ישירה לפסוק | קישור חיצוני | `/Chapter?book=N&chapter=M&verse=V` | גלילה לפסוק |
| החלפת גרסה | `/Chapter` | `VersionPicker` | אותו פרק בגרסה אחרת; נשמר ב-localStorage |
| הדגשת פסוק | `/Chapter` | בחירת פסוק → `VerseActionBar` → הדגשה | `StudyMark` (מחובר) או offline |
| פתיחת הפניה צולבת | `/Chapter` | `VerseCrossRefs` → לחיצה על פסוק | אותו עמוד עם `chapter` ו-`verse` חדשים |
| פתיחת Strong | `/Chapter` | מספר כחול בטקסט | `StrongsPopup` (מודל) |
| הורדה לאופליין | `/Offline` | כפתור "הורד" בכל סקשן | IndexedDB (`offlineDb`) |
| תוכנית יום | `/Plan` | שורה לפי יום | `/Chapter?book=..&chapter=..` |
| כתיבת יומן | `/Journal` | "+ New entry" | `JournalForm` |
| שמירת דבריה | `/Devotionals` | כפתור לב על הכרטיס | `useDevotionalLibrary` (localStorage + שרת) |
| שיתוף דבריה | `/Devotionals` או `/Home` | "Share" | `ShareSheet` (מודל) |
| שאלה ותשובה | `/QA` | לחיצה על כרטיס | פתיחת תשובה inline |
| הצבעה ב-Q&A | `/QA` | 👍 / 👎 | `localStorage: pr_qa_votes` |
| שמיעת שיר | `/VerseSongs` | Play | `GlobalPlayer` (בתחתית) |
| הורדת שיר | `/VerseSongs` | "Buy to Download - $2" | מעבר לתשלום חיצוני |
| הצטרפות לקבוצה | `/DiscussionGroups` | כפתור Join | `localStorage: joinedGroups` |
| פרסום revelation | `/CommunityRevelations` | טופס (מחובר בלבד) | `Revelation` |
| כניסת מנהל | `/Admin` | אימייל + סיסמה | `AdminDashboard` |
| התקנת תרגום | `AdminDashboard → Luganda/KJV+` | כפתור "התקן" | `lugandaInstall` / `kjvInstall` (פונקציות) |
| ייבוא JSON | `AdminDashboard → Import` | העלאת קובץ → אימות → ייבוא | Entities |

---

## 4. מבנה קבצים

### 4.1 נקודת כניסה ו-Layout
- **`Layout.jsx`** - עוטף את כל העמודים: `AuthProvider`, `ThemeProvider`, `PlayerProvider`, `AppHeader`, `AppFooter` (רק בעמודים מסוימים), `GlobalPlayer`, `ScrollToTop`, `PwaHead`. מוזרק `BRAND_CSS` כ-`<style>`.
- **`components/layout/AppHeader.jsx`** - ניווט עליון ו-drawer לנייד. מכיל `NAV_ITEMS` ו-`SECONDARY_ITEMS`.
- **`components/layout/AppFooter.jsx`** - פוטר עם `QUICK_LINKS` ו-DONATE.
- **`components/layout/GlobalPlayer.jsx`** - נגן שיר בתחתית, עם התקדמות, מהירות, שיר הבא/קודם, Shuffle, Repeat, ו-Playlist.
- **`components/layout/PwaHead.jsx`** - מוסיף meta tags, manifest, favicon, אייקוני Apple, ורושם service worker.
- **`components/layout/ScrollToTop.jsx`** - ראו סעיף 2.3.

### 4.2 Context ו-State
- **`lib/AuthContext.jsx`** - `AuthProvider`, מספק `user`, `isAuthenticated`, `logout`, `navigateToLogin`. נקרא ב-`checkAuth` פעם אחת בטעינה.
- **`lib/themeContext.jsx`** - מביא `SiteSettings` מהשרת (רק כשמחובר - ראו הערה) ומעדכן צבעים ושם האתר.
- **`lib/player.jsx`** - `PlayerProvider`: `<audio>` יחיד, `queue`, `index`, `repeat`, `shuffle`, `speed`, `volume`.

### 4.3 שכבת נתונים
- **`api/fse2Client`** - לקוח ה-SDK של הפלטפורמה. מספק `fse2.entities.<Name>.list/create/update/delete/filter`, `fse2.auth.*`, `fse2.functions.invoke(name, payload)`.
- **`lib/contentApi.js`** - קריאה ציבורית של קולקציות. `fetchPublicCollection(name, {authenticated})` עם READERS לכל קולקציה, ו-fallback ל-`seedContent`. פונקציות כתיבה: `submitContactMessage`, `submitRevelation`, `likeRevelation`, `submitComment`, `submitThreadMessage`.
- **`lib/adminSession.js` ו-`lib/adminDirect.js`** - ניהול סשן מנהל. יש **שני מסלולים**: שרת (`functions/adminAuth` + `adminContent`) ודפדפן (אימות ישיר מול `AdminAccount` ואז שימוש ב-SDK). המסלול השרתי נבדק קודם, ואם נכשל - נופל לדפדפן.
- **`lib/offlineDb.js`** - עטיפה ל-IndexedDB (`prayread-offline`, גרסה 9) עם stores: `chapters`, `verses`, `devotionals`, `commentary`, `prayers`, `prayerPassages`, `crossReferences`, `chapterIntros`, `qaItems`, `strongs`, `verseOfDay`, `highlights`, `bookmarks`, `notes`, `annotations`, `meta`, `books`. מתקן את עצמו בפתיחה (מוסיף stores חסרים).
- **`lib/bibleApi.js`** - `fetchChapter` ו-`fetchPlainChapter`. מקור לפי גרסה: KJV/WEB מ-`bible-api.com`, Luganda מ-`wordplanet.net` (דרך פונקציה), KJV+ מ-`bolls.life` / `bible.helloao.org` (ראו הערות). מטמון ב-offline DB.
- **`lib/versions.js`** - הגדרת `VERSIONS` (id, name, language, translation, strongs flag, note), ופונקציות `getVersionOrDefault`, `installVersion`, `listInstalledVersions`, `setActiveVersionId`.

### 4.4 ספריות תוכן סטטי ו-seed
- **`lib/bibleBooks.js`** - 66 ספרים עם `number`, `name`, `abbr`, `luganda`, `lugandaAbbr`, `chapters`. מקור האמת לכל ספר. `OLD_TESTAMENT` ו-`NEW_TESTAMENT` מייצאים את הקבוצות.
- **`lib/seedContent.js`** - תוכן ברירת מחדל: DEVOTIONALS, PRAYERS, VERSE_SONGS, QA_ENTRIES, INSIGHTS, COMMUNITY_POSTS, DISCUSSION_GROUPS, LIVE_SESSIONS, VERSE_OF_THE_DAY, QA_TOPICS, QA_ITEMS.
- **`lib/bookGuides.js`** - מבוא ו-outline לכל 66 הספרים (מפתח: מספר ספר).
- **`lib/bookPrayers.js`** - תפילה לכל ספר (`title`, `body`, `body_lu`), עם `[[Book C:V]]` כקישורים לפסוקים.
- **`lib/bookStudyContent.js`** - לכל ספר: תובנה תיאולוגית + תובנה היסטורית (מערך ROWS).
- **`lib/keyPassages.js`** - 3 פסוקי מפתח לכל ספר.
- **`lib/chapterStudy.js`** - בונה חומר לימוד לכל פרק מתוך הקבצים שלמעלה.
- **`lib/crossRefs.js`** - הפניות צולבות מוכנות מראש (fallback).
- **`lib/planData.js`** - `PLAN_DAYS` (30 ימים: יוחנן + תהילים).
- **`lib/luganda.js`** - פורמטר לדבריות בלוגנדה (שחזור מבנה: כותרת, פסוק, הרהור, תפילה, ומסיר שמות מקורות).

### 4.5 ספריות עזר
- **`lib/scriptureRefs.js`** - `parseReference("John 3:16")`, `resolveBook`, `chapterLink`, `joinRefs`, `splitRefs`, `buildInlineNodes`, `parseOutlineRange`. מטפל בכינויים (`Gen`, `Jn`, `Ps`).
- **`lib/strongs.js`** - נרמול קודי Strong (`H0436` ↔ `H436`), `strongPrefixForBook` (G לברית החדשה, H לישנה), `strongLexiconUrl`.
- **`lib/strongsOffline.js`** - שמירת הגדרות Strong לאופליין.
- **`lib/studyAnnotations.js`** - הדגשות/קווים תחתונים על סקשנים בספר. נכתב גם לשרת (`StudyAnnotation`) וגם מקומית.
- **`lib/textSelection.js`** - `selectionInside(node)`: מונע לחיצה "בטעות" כשהמשתמש בחר טקסט.
- **`lib/share.js`** - ערוצי שיתוף (`shareChannels`, `fullShareChannels`), `openShare`, `copyToClipboard`, `verseShareText`.
- **`lib/format.js`** - `safeText`, `splitList`, `formatDuration`, `bytesToMb`. חשוב: כל טקסט מהשרת עובר ב-`safeText` לפני רינדור.
- **`lib/reading.js`** - `toISODate`, `shiftISODate`, `formatDateLabel`, `computeStreak`, `lastSevenDays`.
- **`lib/readings.js`** - `findPlanDay`, `recordReading` (שומר קריאה ב-`Reading` ומעדכן את היום בתוכנית).
- **`lib/activity.js`** - `logReadingActivity` (לא חוסם את הקורא במקרה כשל).
- **`lib/sha256.js`** - SHA-256 ב-JS טהור (לא תלוי ב-WebCrypto).
- **`lib/theme.js`** - טוקנים של המותג: `BRAND`, `LOGO_URL`, `FAVICON_URL`, `DONATE_URL`, `HERO_IMAGE`.
- **`lib/brandCss.js`** - CSS משותף עם משתנים: `--pr-ivory`, `--pr-emerald`, `--pr-gold`, וכן classes בסיסיים (`pr-card`, `pr-btn`, `pr-input`, ...).
- **`lib/app-params.js`** - קריאת App ID וטוקן מ-localStorage (`fse2_app_token_<appId>`).

### 4.6 רכיבי Read (הליבה של הקורא)
| קובץ | תפקיד |
|------|-------|
| `ChapterSelector.jsx` | עמוד ספר: `BookSidebar` + `ChapterGrid` + `BookStudyResources`; מנהל הדגשות, סימון מיקום selection |
| `ChapterSidebar.jsx` | סקשנים לפרק: Intro / Commentary / Prayer / Cross-refs |
| `ChapterReaderPane.jsx` | פאנל הקריאה עם תפריט שלוש/ארבע לשוניות |
| `ChapterResourcesPanel.jsx` | Theological + Historical לפרק (fallback לספר) |
| `ChapterClosingPrayer.jsx` | תפילה לסיום הפרק |
| `ChapterGrid.jsx` | רשת כפתורי פרקים לספר |
| `BookSidebar.jsx` | לשוניות Intro / Outline / Prayer |
| `BookIntro.jsx`, `BookOutline.jsx`, `BookPrayerPanel.jsx` | סקשנים של הספר |
| `BookStudyResources.jsx` | Commentary / Theological / Historical עם Pagination (PAGE_SIZE=3) |
| `AnnotatedText.jsx` | טקסט עם הדגשות, בחירה → סרגל צבעים |
| `StrongsText.jsx` | מפענח `(G2424)` ומחזיר טקסט + "superscripts" כחולים |
| `StrongsPopup.jsx` | הגדרת Strong: מקומי → שרת → `strongsDefinition` function |
| `VerseActionBar.jsx` | סרגל פעולות לפסוק |
| `VerseCrossRefs.jsx` / `CrossRefList.jsx` / `CrossRefScripture.jsx` | הפניות צולבות |
| `VersePopup.jsx` | הצגת פסוק בתוך מודל (ללא ניווט) |
| `FloatingVerse.jsx` | חלון צף לפסוק |
| `PassagePrayer.jsx` | התאמת prayer passage לפסוק (`matchesPassage`) |
| `PassageTabs.jsx` | Commentary / Theological / Historical / Q&A לקטע |
| `ShareSheet.jsx` | מודל שיתוף |
| `VersionPicker.jsx` | בורר גרסאות עם התקנה/מחיקה |
| `BookGrid.jsx` | רשת 66 ספרים |
| `VerseList.jsx` | רשימת פסוקים (שימוש ב-`Chapter` ב-`Read` הישן - ככל הנראה לא פעיל) |
| `ReflectionPanel.jsx` | פאנל הרהור (מ-`__trash`, לא בשימוש) |

### 4.7 רכיבי Admin
| קובץ | תפקיד |
|------|-------|
| `CollectionsPanel.jsx` | עורך גנרי לכל הקולקציות, מבוסס `COLLECTIONS` |
| `RecordEditor.jsx` | טופס גנרי לפי `fields` (text / textarea / number / boolean / refs) |
| `ConfirmDialog.jsx` | אישור מחיקה |
| `CrossRefEditor.jsx` | עורך הפניות צולבות כ-chips |
| `PrayersPanel.jsx` | ספריית תפילות (mode=library) ופסוקי תפילה (mode=passages) |
| `PassagesPanel.jsx` | ניהול PrayerPassage, CrossReference, ChapterIntro, BookIntro |
| `PrayerCrossRefImport.jsx` | ייבוא קובץ prayer+crossref לספר |
| `JsonImportPanel.jsx` | ייבוא JSON מכל קולקציה, עם `ALIASES` לשמות חלופיים |
| `DevotionalsPanel.jsx` | דף דבריות עם Tabs |
| `DevotionalForm.jsx` | טופס דבריה (מערכת שדות REQUIRED) |
| `DevotionalBulkImport.jsx` | ייבוא דבריות מקובץ JSON (`pray-read-devotionals-v1`) |
| `DevotionalTopicsPanel.jsx` | ניהול נושאים (לא ניתן למחוק נושא עם דבריות) |
| `DevotionalPlansPanel.jsx` | תוכניות דבריות |
| `QaPanel.jsx` | דף Q&A עם טאבים |
| `QaQuestionsPanel.jsx` / `QaAdminList.jsx` / `QaItemForm.jsx` | שאלות |
| `QaTopicsPanel.jsx` / `QaTopicForm.jsx` | נושאים (מעבר שאלות לנושא אחר לפני מחיקה) |
| `QaBulkImport.jsx` | ייבוא Q&A (`pray-read-qa-v1`) |
| `VerseSongsPanel.jsx` | ניהול שירים וסדרות |
| `VerseSongForm.jsx` / `VerseSongSeriesForm.jsx` | טפסים |
| `VerseSongBulkImport.jsx` | ייבוא (`pray-read-verse-songs-v1`) |
| `LugandaInstaller.jsx` | התקנת תרגום לוגנדה (lugandaInstall) |
| `KjvPlusInstaller.jsx` | התקנת KJV+ ו-Strong (kjvInstall) + הורדת מילון |
| `ChapterCoverage.jsx` | תצוגת כיסוי פרקים לפי ספר (`compressChapters` לטווחים) |
| `LibraryReport.jsx` | דוח Audit (scriptureAudit) |

### 4.8 Pages בקוד ה-`__trash`
קבצים כמו `__trash/pages/AdminDiag.jsx`, `Read.jsx`, `ImportCheck.jsx` הם כלי בדיקה ישנים. **לא** מיועדים לייצור, ולא מופיעים בניתוב. מומלץ למחוק.

### 4.9 Functions (Backend)
| קובץ | תפקיד |
|------|-------|
| `adminAuth.js` | התחברות מנהל: סיסמה מוצפנת (SHA-256 מלוח), סשנים חתומים עם HMAC, איפוס סיסמה עם מפתח |
| `adminContent.js` | API מנהל: `list`, `upsert`, `delete`, `importBatch`, ... כל קריאה מאומתת ב-token |
| `bibleChapter.js` | שליפת פרק מ-bible-api (EN) ו-wordplanet (LU), נקיון HTML |
| `content.js` | API ציבורי: קריאות של קולקציות והגשות (ContactMessage, Revelation, ...) |
| `kjvInstall.js` | התקנת KJV+ עם Strong לפרקים |
| `lugandaInstall.js` | התקנת לוגנדה לפרקים |
| `scriptureAudit.js` | דוח קריאה בלבד: כמה פרקים מותקנים לכל תרגום, אי-התאמות, Strong |
| `strongsDefinition.js` | Cache של הגדרות Strong; מקור: מילונים ציבוריים + Blue Letter Bible |
| `cron/scriptureInstall.js` | Cron שרץ **כל שעה** וממלא פרקים חסרים של לוגנדה ו-KJV+ |

### 4.10 Entities (סכמה)
כל entity מוגדר ב-JSON עם `fields` ו-`x-fse2-access` (כללי הרשאה לפי role). ראו סעיף 5.

### 4.11 Public assets
- `public/manifest.json` - PWA manifest.
- `public/sw.js` - service worker: cache-first ל-shell (`SHELL` = רשימת נתיבים מרכזיים) ו-network-first לשאר. גרסת cache: `prayread-shell-v2` ו-`prayread-runtime-v2`.
- `public/assets/*` - תמונות, קבצי תבנית JSON ו-PDF לייבוא, וכמה קבצי PDF הנחיות פנימיות (אינם רכיבי אפליקציה).

---

## 5. מודל הנתונים (Entities)

### 5.1 תוכן ציבורי (קריאה לכולם, כתיבה למנהל)
| Entity | תכלית | שדות מרכזיים | קשרים |
|---|---|---|---|
| `Devotional` | דבריה יומית | `code`, `title_en/lu`, `scripture_ref`, `verse_en/lu`, `body_en/lu`, `prayer_en/lu`, `topic`, `series`, `date`, `cover_url`, `featured`, `active` | `topic` ↔ `DevotionalTopic.name_en` |
| `DevotionalTopic` | נושא דבריות | `name_en`, `name_lu`, `active` |  -  |
| `DevotionalPlan` | תוכנית דבריות (ימים) | `name_en`, `name_lu`, `description`, `days`, `active` | `Devotional.series` |
| `Prayer` | ספריית תפילות | `title`, `title_lu`, `category`, `body_en/lu`, `scripture_ref`, `cross_refs` |  -  |
| `PrayerPassage` | תפילה לפרק/קטע/פסוק | `book_number`, `chapter`, `verse` (0 = כל הפרק), `verse_end`, `title_en/lu`, `prayer_en/lu`, `source` | `natural key`: book+chapter+verse+verse_end |
| `CrossReference` | הפניה צולבת לפסוק | `book_number`, `chapter`, `verse`, `ref_book_number`, `ref_chapter`, `ref_verse`, `ref_verse_end`, `ref_text_en/lu`, `note_en/lu` |  -  |
| `ChapterIntro` | מבוא לפרק | `book_number`, `chapter`, `title_en/lu`, `intro_en/lu` |  -  |
| `BookIntro` | מבוא לספר ותפילת סיום | `book_number`, `title_en/lu`, `intro_en/lu`, `closing_prayer_en/lu` |  -  |
| `Commentary` | פירוש לפרק | `book`, `chapter`, `title`, `body_en/lu` |  -  |
| `Insight` | תובנה תיאולוגית/היסטורית | `kind` (theological / historical), `title`, `passage`, `excerpt`, `body`, `share_count` |  -  |
| `QATopic` | נושא Q&A | `name_en/lu`, `description_en/lu`, `active` | `QAItem.topic_en` |
| `QAItem` | שאלה ותשובה | `topic_en/lu`, `scripture_ref`, `question_en/lu`, `answer_en/lu`, `tags`, `featured`, `active` |  -  |
| `VerseOfDay` | פסוק היום | `verse_date`, `reference`, `text_en/lu`, `note` |  -  |
| `VerseSongSeries` | סדרת שירים | `name`, `display_order`, `description`, `thumbnail`, `cover_image`, `accent`, `featured`, `active` | `VerseSongEpisode.series_name` |
| `VerseSongEpisode` | שיר | `series_name`, `title`, `description`, `duration_seconds`, `audio_url`, `thumbnail`, `cover_url`, `episode_order`, `plays_count`, `active` |  -  |
| `LiveSession` | שידור חי | `title`, `session_date`, `host`, `join_link`, `description` |  -  |
| `DiscussionGroup` | קבוצת לימוד | `name`, `description`, `schedule`, `member_count` | `DiscussionThread.group_name` |
| `DiscussionThread` | הודעה בקבוצה | `group_name`, `owner_email`, `author_name`, `title`, `body` |  -  |
| `SiteSettings` | הגדרות אתר | `setting_key`, `setting_value` |  -  |
| `ReadingPlan` | 30 יום לקריאה | `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture` |  -  |
| `BibleVerse` | פסוק ב-DB (EN/LU) | `book_number`, `chapter`, `verse`, `text_en`, `text_lu` |  -  |
| `LugandaChapter` | פרק לוגנדה מותקן | `book_number`, `chapter`, `verse_count`, `verses` (JSON) |  -  |
| `KjvPlusChapter` | פרק KJV+ מותקן | כנ"ל |  -  |
| `StrongEntry` | הגדרת Strong | `code`, `language`, `original_word`, `transliteration`, `pronunciation`, `definition`, `source` |  -  |

### 5.2 תוכן משתמש (מוגבל לבעלים)
| Entity | תכלית | שדות |
|---|---|---|
| `Reading` | קריאה שהושלמה | `owner_email`, `book`, `chapter`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses` |
| `StudyMark` | הדגשה/סימניה/הערה על פסוק | `owner_email`, `mark_type` (highlight/bookmark/note), `book_number`, `chapter`, `verse`, `color`, `note_text` |
| `StudyAnnotation` | הדגשה על סקשן ספר/פרק | `owner_email`, `book_number`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset`, `text` |
| `ReadingActivity` | לוג פעילות | `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse` |
| `JournalEntry` | יומן תפילה | `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood` |
| `PrayerSaved` | תפילה שמורה | `owner_email`, `prayer_title` |
| `DevotionalSaved` | דבריה שמורה | `owner_email`, `devotional_code`, `saved_date` |
| `DevotionalProgress` | דבריה שנקראה | `owner_email`, `devotional_code`, `completed_date` |
| `Revelation` | פוסט קהילה (גם תגובות דרך `parent_id`) | `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id` |

### 5.3 מנהל ומערכת
| Entity | תכלית | גישה |
|---|---|---|
| `AdminAccount` | פרטי מנהל (hash, salt, session secret, session_version) | owner/admin בלבד |
| `ActivityLog` | יומן פעולות של המנהל | owner/admin |
| `ContactMessage` | הודעות טופס יצירת קשר | יצירה לכולם, קריאה לבעלים/מנהל |
| `QAEntry` | שאלות של קוראים (legacy) | יצירה למחוברים |
| `BookIntro` | ... (ראו לעיל) | |

### 5.4 קשרים עיקריים
- `Devotional.topic` → `DevotionalTopic.name_en`
- `Devotional.series` → `DevotionalPlan.name_en`
- `QAItem.topic_en` → `QATopic.name_en`
- `VerseSongEpisode.series_name` → `VerseSongSeries.name`
- `DiscussionThread.group_name` → `DiscussionGroup.name`
- `Revelation.parent_id` → `Revelation.id` (תגובות)
- `CrossReference` / `PrayerPassage` מזוהים לפי **natural key** (ראו `crossRefNaturalKey`, `passageNaturalKey` ב-`lib/prayerPassages.js`) כדי ש-import חוזר יעדכן ולא יכפיל.

> **שים לב:** הקשרים הם *מחרוזתיים*, לא foreign keys. שינוי שם נושא יכול להשאיר דבריות "יתומות". `DevotionalTopicsPanel` ו-`QaTopicsPanel` מונעים זאת בבדיקה לפני מחיקה, אבל לא בעת שינוי שם.

---

## 6. תהליכים ואינטראקציות מרכזיות

### 6.1 קריאת פרק מקצה לקצה
1. משתמש ב-`BibleReader` לוחץ על ספר → `ChapterSelector` מציג את הפרקים.
2. לחיצה על פרק → `navigate("/Chapter?book=N&chapter=M")`.
3. `Chapter.jsx` קורא את הפרמטרים, מביא גרסה:
   - אם הגרסה מותקנת ב-IndexedDB → טעינה מקומית מיידית.
   - אחרת → `fetchChapter` מהמקור (ושמירה ל-IndexedDB אם המשתמש הוריד).
4. במקביל מביאים: `PrayerPassage` / `CrossReference` / `ChapterIntro` של הפרק (מ-`fetchChapterPassages` ו-`fetchChapterCrossRefs`, עם fallback ל-offline).
5. מוצגות ההפניות לכל פסוק (`groupCrossRefsByVerse`).
6. רישום `logReadingActivity` (לא חוסם).

### 6.2 הדגשת פסוק
1. לחיצה על פסוק → `VerseActionBar` נפתח.
2. בחירת צבע → `saveAnnotation` / `StudyMark.create`.
3. שמירה **כפולה**: לשרת למחוברים + ל-offline DB לכולם.
4. בטעינה הבאה: `mergeAnnotations(serverRows, localRows)` מאחד לפי `annotationKey` (book:section:block:kind:start:end).

### 6.3 הורדה לאופליין
1. `/Offline` → לחיצה על "הורד" בסקשן.
2. לולאה על הפרקים של הספר/התוכנית; לכל פרק: `chapterIsReadable` → `fetchChapter` → שמירה ב-`chapters` store עם key של `chapterKey(book, chapter, version)`.
3. עדכון מונה ונפח ב-UI.
4. במחיקה: `offline.clear(store)` ויש גם מחיקה לפי ספר.

### 6.4 שיתוף
`ShareSheet` מקבל `sections` ו-`text`. אם לא ניתן `text`, נבנה מה-sections עם הקישור בסוף. ערוצים: WhatsApp, Facebook, X, Telegram, Email, Copy, Native Share (אם זמין). לרשתות שלא תומכות בטקסט (Facebook, LinkedIn, Instagram) מועתק הקישור בלבד.

### 6.5 Admin: ייבוא JSON
1. מנהל מעלה קובץ ב-`JsonImportPanel` או `PrayerCrossRefImport`.
2. `parsePrayerImportText` מפרסר. `importShapeOf` מזהה את הפורמט.
3. `prepareImport` מסיר כפילויות ומנרמל. לכל רשומה נבדק `naturalKey`.
4. מוצגת **תצוגה מקדימה** (preview) עם מספר שורות חדשות/מעודכנות/שגויות.
5. לחיצה על "ייבא" → `callAdminData("upsert", ...)` (או `adminDirect` במסלול דפדפן). יש לוג דוח.
6. ייבוא חוזר של אותו קובץ = עדכון, לא הכפלה.

### 6.6 התקנת לוגנדה / KJV+ (מנהל ו-cron)
1. מנהל לוחץ על "התקן" ב-`LugandaInstaller`.
2. הקריאה נשלחת ל-`fse2.functions.invoke("lugandaInstall", { action })`.
3. הפונקציה בודקת איזה פרקים חסרים (מול הטבלה `LugandaChapter`), מורידה חלק (batch), שומרת, ומחזירה `{ status, installed, missing }`.
4. הממשק קורא שוב ומציג מצב עד ש-`missing = 0` או ש"ההתקדמות נעצרה".
5. במקביל, `cron/scriptureInstall.js` מריץ את אותה לוגיקה כל שעה.

### 6.7 תוכנית קריאה
1. `/Plan` טוען `ReadingPlan` (או fallback).
2. `completedDays` = ימים שיש להם `Reading` עם `status: completed`.
3. `currentDay` = היום הראשון שלא הושלם.
4. לחיצה על שורה → קריאה → `recordReading` → `Reading.create` עם `plan_day`.

### 6.8 כניסת מנהל
1. `/Admin` → `adminSignIn(email, password)`.
2. ניסיון שרת: `functions/adminAuth` → מחזיר token חתום.
3. אם ה-gateway חסום לדפדפן → מסלול דפדפן: `readAdminAccount` → `verifyPassword` (SHA-256 עם salt) → חתימת סשן מקומית.
4. נשמר `pr_admin_token` ו-`pr_admin_mode` ב-localStorage.
5. `startAdminKeepAlive` מאריך את הסשן בכל שימוש (`renewAdminSession`).

---

## 7. הערות טכניות לפיתוח

### 7.1 מחסנית טכנולוגית
- **React 18** עם hooks.
- **React Router** (`react-router-dom`) - `useSearchParams`, `useNavigate`, `Link`.
- **TanStack Query** (`@tanstack/react-query`) - לכל קריאת שרת. מפתחות שאילתה: `["insights", kind]`, `["readings", email]` וכו'. חשוב: מפתח ישן חייב להתאים להפסד-נתונים.
- **Tailwind CSS** - קיים ב-`__generated/tailwind.css` ומשמש בחלק מהרכיבים הישנים (`__trash`). **הרכיבים הפעילים משתמשים בעיקר ב-classes מותאמים** (`pr-*`) מתוך `brandCss.js`. מומלץ לא לערבב.
- **lucide-react** לאייקונים.
- **date-fns** לעיצוב תאריכים (`format`, `formatDistanceToNow`).
- **Vite** (לפי ה-`__vite__mapDeps` ב-bundle). ה-alias `@/` מצביע לשורש הפרויקט.

### 7.2 דפוסים חוזרים
- **"Public first, live later"**: כל עמוד ציבורי מציג את `seedContent` מיד ואז מתעדכן מהשרת. כך אין מסך ריק גם כשהשרת איטי. אם הקוד מוסיף רשומה חדשה ל-seed, היא תופיע גם לפני שהשרת מחזיר.
- **Merge לפי מפתח טבעי**: `mergeWithBundledText`, `mergeAnnotations`, `naturalKey`. יש לשמור על אותו מפתח בשתי הצדדים.
- **Fallback מקומי → שרת**: כל קריאה מ-IndexedDB קודמת לשרת. שים לב: ה-offline DB הוא מקור לקריאה אחרי הורדה, ולכן שינוי תוכן בשרת לא יופיע אצל משתמשים עם העתק מקומי עד שיורידו מחדש. **זהו הנושא היחיד שדורש תשומת לב מיוחדת בכל שינוי תוכן.**
- **`safeText` לכל ערך שמגיע מהשרת** - מונע קריסה כשהשדה null/object.
- **סימון דינמי של "מקור"**: שדות `title_en`/`title` ו-`body`/`body_en` מוגדרים כ-alias. ה-`fieldOf` ב-`devotionals.js` ו-`bilingualText` ב-`bilingual.js` מטפלים בזה. **אל תשנה שמות שדות ישירות - השתמש ב-helpers.**
- **Re-entry safety**: `useEffect` עם cleanup מטפל ב-`Audio`, ב-`keydown`, וב-`mousedown` כדי למנוע דליפות.

### 7.3 נקודות חשובות לשינוי
- **הוספת Entity חדשה:** 1) קובץ JSON ב-`entities/`; 2) הוספה ל-`COLLECTIONS` ב-`lib/adminCollections.js` (כדי ש-CollectionsPanel יכיר את השדות); 3) readers ב-`lib/contentApi.js` אם נדרש ציבורי; 4) עדכון `adminContent.js` אם יש ולידציה מיוחדת.
- **הוספת שדה ל-Entity קיים:** עדכן את ה-JSON, `COLLECTIONS`, ה-form, וה-`pickFields` של הטופס. אם השדה משמש בקריאה ציבורית, עדכן גם `contentApi`.
- **שינוי נתיב URL:** `createPageUrl` מבוסס שם העמוד. שינוי שם קובץ עלול לשבור קישורים בתוך `ShareSheet` ו-QA (`/QA?...`). בדוק ב-grep.
- **הוספת תרגום חדש:** הוסף ל-`VERSIONS` ב-`lib/versions.js` ולוודא שיש `fetchChapter` תואם ב-`bibleApi.js`.

### 7.4 בעיות ידועות ומומלצות (הערכה מהקוד)
1. **אבטחה - סיסמת מנהל ברירת מחדל בקוד.** `DEFAULT_PASSWORD` ו-`DEFAULT_RESET_KEY` כתובים בקוד ב-`functions/adminAuth.js` וגם ב-`pages/Admin.jsx` (אימייל). יש להעביר את הערכים ל-secrets ולמחוק את ברירות המחדל לפני פרודקשן.
2. **אבטחה - הרשאה לשיר בתשלום נשמרת ב-localStorage.** כל משתמש יכול לזייף אותה. הורדה צריכה לעבור דרך שרת שבודק רכישה.
3. **Admin client-side mirror.** `adminDirect.js` מאפשר ניהול ישירות מהדפדפן עם הרשאות המשתמש המחובר. הדבר שימושי כגיבוי אך מעלה את שטח התקיפה. מומלץ לבדוק שה-`x-fse2-access` מוגדר נכון לכל entity שהמנהל כותב אליו.
4. **`themeContext` קורא הגדרות רק כשמחובר.** אורחים רואים ברירות מחדל. אם הכוונה שהמותג יהיה אחיד לכולם, יש לקרוא את `SiteSettings` כציבורי.
5. **קבצים מתים.** תיקיית `__trash/` כוללת דפי בדיקה, פונקציות זמניות (`_hashTool.js`, `_digestCheck.js`, `probeChapter.js`), וקבצי בדיקה ב-`__url_fetch/`. **הם מסוכנים** (לדוגמה `_hashTool.js` ו-`tmpSessionProbe.js` חושפים לוגיקה של סשנים). יש למחוק לפני פרודקשן.
6. **`Read.jsx` ב-`__trash`** מכיל לוגיקה לא מעודכנת (`TRANSLATIONS` מ-`bibleBooks` שלא קיים). לא בשימוש.
7. **התאמת שמות פרמטרים.** ישנם שני מסלולים לקישור פסוק (`verse` ו-`chapterUrl`). ודא שהם תואמים בכל עמוד חדש.
8. **Cron.** `cron/scriptureInstall.js` רץ כל שעה. בדוק שלא נוצר עומס על המקורות החיצוניים (`bible-api.com`, `wordplanet.net`, `bolls.life`) - יש בו עצירה כשאין התקדמות, אבל כדאי לוודא את הפרמטרים.
9. **Service Worker.** `sw.js` מטמין את `SHELL` ב-install. הגרסאות `prayread-shell-v2` ו-`prayread-runtime-v2` חייבות להתעדכן בכל שינוי גדול, אחרת משתמשים יישארו עם קוד ישן.
10. **זיכרון Audio.** `Audio` יחיד ב-`PlayerProvider`. אם מוסיפים נגן נוסף בעמוד, צריך להשתמש ב-`usePlayer` ולא ליצור `new Audio()`.

### 7.5 הרצה ובדיקה
- **בדיקה ידנית מומלצת** לאחר כל שינוי בקורא: פרק ב-EN, פרק ב-LU, פרק עם Strong, פרק עם הפניות צולבות, ומצב אופליין (DevTools → Network → Offline).
- **בדיקת Admin:** התחברות, יצירת רשומה, עריכה, ייבוא קובץ פעמיים (לוודא עדכון ולא כפילות).
- **בדיקת PWA:** `/InstallPrompt` ו-DevTools → Application → Manifest.

---

**סיכום לצוות:** המערכת בנויה סביב שלוש שכבות: (1) קורא פרקים עם מחקר מעמיק, (2) ספריית תוכן ציבורית עם fallback ל-seed, (3) ממשק ניהול גנרי שמזין את הספרייה. הבעיות החשובות ביותר לפני פרודקשן הן הסיסמאות הקשיחות, שיטת אימות ההורדות בשירי הפסוקים, ומחיקת קבצי ה-`__trash`.
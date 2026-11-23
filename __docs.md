# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

> **הערת תיקון:** חלק מהקבצים שסופקו מסומנים ב־`[נחתך]`, ולא סופקו קובצי ניתוב הרשת, `api/fse2Client` ו־`utils/createPageUrl`. לכן כתובות ה־URL שלהלן מבוססות על שמות העמודים, על `createPageUrl` ועל נתיבי ה־Service Worker. שמות הנתיבים הם case-sensitive וניתן להוסיף להם prefix בעת deployment.

---

## 1. מהות המערכת

### 1.1 תיאור כללי

**Pray-Read Bible** היא אפליקציית React מבוססת PWA שמשמשת כמרכז לקריאת המקרא, תפילה, לימוד ושיחה בקהילה. המערכת מציעה:

- קריאת כל 66 ספרי המקרא באנגלית ובלוגאנדה.
- הלבה או קו תחתון על פסוקים, משמעות, הערות וסימוני ספר.
- יומן תפילה אישי.
- תוכנית קריאה של 30 ימים.
- תהילים יומיים, מדריכים, שירי מקרא ונושאים תיאולוגיים והיסטוריים.
- קהילת משתמשים: גילויים, הערות, קבוצות דיון ושיעורים חיים.
- התקדמות אישית, פעילות קריאה, שמירת תפילות והשלמת תהילים.
- מצב offline מבוסס IndexedDB.
- נגן אודיו גלובלי שממשיך לפעול בעת מעבר בין עמודים.
- ממשק ניהול תוכן נפרד עם התחברות, עריכת תוכן, העלאת מדיה, ניהול הודעות, הגדרות ערכה ויומן פעילות.

המערכת מיועדת לקוראי מקרא מבוגרים ולקהילות מכנסיות המבקשות חוויית קריאה מדורגת, ללא הפרעה פרסומית, עם דגש על תוכן דתי, משפחתי וקהילתי. היא מתאימה גם למשתמשים ללא חשבון, תוך מתן תוכן בסיסי מובנה, ומאפשרת למשתמש מחובר לשמור נתונים אישיים ולקבל תוכן עדכני מהשרת.

### 1.2 הערך שהמערכת מספקת

| ערך | איך מיושם |
|---|---|
| קריאה רצופה וממוקדת | מסך פתיחה לפי ספר ופרק, תפילות, מעריך, מקראות מפתח והפניות בין פסוקים |
| חיבור בין קריאה לתפילה | פסוק נבחר יכול לפתוח תפילה רלוונטית, תפילת ספר או רשימת תפילות |
| שמירת התקדמות אישית | Highlights, bookmarks, הערות, יומן, קריאות שהושלמו והתקדמות תהילים נשמרים לפי חשבון |
| עבודה ללא חיבור | פרקים, אימונים ותוכן נבחר נשמרים ב־IndexedDB |
| אחידות בין מכשירים | רשומות משתמש נשמרות בשרת; חלק מההעדפות נשמרות גם מקומית |
| גיוון לשוני | ממשק ותוכן לרוב באנגלית, עם תוכן תפילה, התרגום והערות בלוגאנדה |
| מעורבות קהילתית | פרסום גילויים, סימון “לייק”, תגובות, קבוצות ושיעורים חיים |
| ניהול תוכן עצמאי | ממשק Admin מאפשר לעדכן תוכן, מדיה, ערכת צבעים, הודעות והגדרות |
| התקנה כאפליקציה | `manifest.json`, Service Worker, metadata ל־iOS ו־Android ו־beforeinstallprompt |

### 1.3 ארכיטקטורה

| שכבה | טכנולוגיה | אחריות |
|---|---|---|
| תצוגה | React, React Router | עמודים, ניתוב, קישורים, פרמטרי URL |
| ניהול מצב מקומי | `useState`, `useReducer`, Context | התחברות, ערכת נושא, נגן אודיו |
| שליפת נתונים | TanStack Query | caching, loading/error state, mutations ו־invalidation |
| SDK ושרת | `fse2` client | Entities, Auth, Functions ו־App Files |
| קבצים סטטיים | `lib/seedContent.js` | תוכן fallback כאשר אין רשומות חיות או רשת לא זמינה |
| Offline | IndexedDB | פרקים, פסוקים, אימונים, הערות והעדפות מקומיות |
| PWA | Web App Manifest, Service Worker | התקנה, cache, הפעלה מהמכשיר |
| עיצוב | `BRAND_CSS`, CSS variables, Tailwind utility subset | Ivory, emerald ו־gold; רספונסיביות |
| ניהול | `AdminDashboard` + `adminAuth`/`adminContent` | התחברות מנהל ופעולות CMS |

### 1.4 מודל “מקור אמת” ו־fallback

המערכת משתמשת בשילוב של:

1. **רשומות חיות** מה־FSe2 Entities דרך `fetchPublicCollection`.
2. **תוכן מובנה** מ־`lib/seedContent.js` כשאין רשומות או כשהשרת מחזיר רשימה ריקה.
3. **נתוני מכשיר** מ־IndexedDB כשהמשתמש גם אינו מחובר וגם אין חיבור רשת.
4. **העדפות מקומיות** ב־`localStorage` עבור דברים שאינם דורשים סנכרון, כגון saved insights, joined groups והתקדמות devotional מקומית.

הרשומות חיות מנצחות תוכן מובנה, אך לא תמיד באופן מלא: בכמה מקומות המערכת ממזגת בין המקורות, למשל בעמודי Insights ו־Devotionals.

---

## 2. עמודים ותפקידיהם

### 2.1 כללי ניתוב

שמות הנתיבים נוצרים באמצעות `createPageUrl("PageName")`. לפי ה־Service Worker והקישורים הפנימיים, הכתובות המרכזיות הן:

- `/Home`
- `/BibleReader`
- `/Chapter`
- `/Devotionals`
- `/PrayerLibrary`
- `/VerseSongs`
- `/QA`
- `/Community`

הנתיב `/` מופיע גם ב־Service Worker כנתיב התחלה, ולכן הוא כנראה נקודת כניסה לדף הבית.

### 2.2 עמודי גלילה, קהילה ומידע

| עמוד וכתובת | תפקיד והצדקה | פעולות משתמש מרכזיות |
|---|---|---|
| `pages/Home.jsx`  -  `/Home` | דף המקיצה המרכזי. מציג את ערכי המותג, פעילות יומית, אפשרויות הניווט והפיצ’רים המרכזיים. קיים כדי לתת למשתמש נקודת כניסה אחת לכל תחומי האפליקציה. | מעבר לקריאת מקרא, תהילים, תפילות, Q&A וקהילה; פתיחת daily content; שיתוף; התקנת האפליקציה; מעבר לתפילות או העלאות. |
| `pages/About.jsx`  -  `/About` | מסביר את מטרת Pray-Read, הבעיה שהאפליקציה מנסהת לפתור ואת הערכים שלה. | קריאת המשפר המרכזי, חזרה לדף הבית ומעבר לפיצ’רים מרכזיים. |
| `pages/Community.jsx`  -  `/Community` | דף מטרת לקהילה, המפריד בין Revelations, Live Teaching ו־Discussion Groups ומציג תצוגה מקצרה של פעילות אחרונה. | בחירת אחד משלושת אזורי הקהילה; צפייה בפוסטים, קבוצות ומפגשים אחרונים. |
| `pages/CommunityRevelations.jsx`  -  `/CommunityRevelations` | מאפשר לקוראים לשתף גילוי אישי ולקבל משוב מקהילה. | פרסום גילוי; סימון לייק; פתיחת וסגירת שרשור תגובות; מעבר להתחברות כשהמשתמש אינו מחובר. |
| `pages/CommunityLiveTeaching.jsx`  -  `/CommunityLiveTeaching` | מרכז מידע על שיעורים חיים עם מנחה, מועד וקישור הצטרפות. | סינון/צפייה במפגשים; פתיחת `join_link` חיצוני; מעבר לפרטי מפגש. |
| `pages/DiscussionGroups.jsx`  -  `/DiscussionGroups` | מאפשר לקבוצות קטנות ללמוד פסוק או פרק משותף ולשוחח באשרוחות קבוצתית. | בחירת קבוצה; הצטרפות/עזיבה מקומית; צפייה בהודעות; פרסום הודעה כמשתמש מחובר. |
| `pages/Contact.jsx`  -  `/Contact` | טופס יצירת קשר עם פרויקט. קיים גם כנקודת פנייה לתמיכה או שאלות לא טכניות. | מילוי שם, דוא"ל, נושא והודעה; ולידציה; שליחה; הודעת הצלחה או שגיאה. |
| `pages/Privacy.jsx`  -  `/Privacy` | מסביר מה נשמר בחשבון, מה נשמר מקומית ומה מוחק בניקוי נתונים. | קריאת מדיניות וחזרה לדף הבית. |
| `pages/Terms.jsx`  -  `/Terms` | מצהיר תנאי שימוש, זכויות תוכן ומגבלות שימוש בתוכן המקרא. | קריאת תנאים וחזרה לדף הבית. |
| `pages/InstallPrompt.jsx`  -  `/InstallPrompt` | מסביר כיצד להתקין את Pray-Read במכשיר נייד או במחשב. | התקנה דרך `beforeinstallprompt`; זיהוי מצב standalone; הצגת הוראות לפי פלטפורמה. |

### 2.3 עמודי קריאה והתקדמות

| עמוד וכתובת | תפקיד והצדקה | פעולות משתמש מרכזיות |
|---|---|---|
| `pages/BibleReader.jsx`  -  `/BibleReader` | שער כניסה למקרא. מציג את 66 הספרים בשתי שפות ומאפשר להיכנס לספר ולפרק. | חיפוש לפי שם, שם מקומי או קיצור; מעבר בין ברית ישנה לחדשה; בחירת ספר; סימון פרק שזמין offline; מעבר לפרק. |
| `pages/Chapter.jsx`  -  `/Chapter` | מסך הקריאה המרכזי. מציג פסוקים, מאפשר פעולות קריאה ולימוד, ומחבר לתוכן משלים ולהתקדמות. | בחירת פסוק; הלבה בארבע צבעים; bookmark; הערה; העתקה; שיתוף; פתיחת הפניה או תפילה; האזנה; הגדלת טקסט; מעבר לפרק הקודם/הבא; סימון פרק כהושלם; הוספת reflection ו־prayer point. |
| `pages/Plan.jsx`  -  `/Plan` | מציג את מסלול הקריאה בן 30 הימים ומחובר קריאה שהושלמה ל־יום בתכנית. | צפייה ב־completed/current/upcoming; פתיחת פרק התוכנית; חישוב התקדמות כוללת. |
| `pages/BibleNotes.jsx`  -  `/BibleNotes` | מרכז את כל הסימונים האישיים: highlights, bookmarks והערות. | סינון לפי סוג; פתיחת פסוק מסומן; מעבר לפסוק המתויג; טיפול במשתמש לא מחובר. |
| `pages/Journal.jsx`  -  `/Journal` | יומן תפילה אישי המאפשר לשמור praise, petition, confession, thanksgiving או reflection. | הוספה, עריכה ומחיקה; סינון לפי קטגוריה; קשר לספר ופרק; יצירת רשומה מהתפילה או מהמקרא. |
| `pages/Dashboard.jsx`  -  `/Dashboard` | לוח אישי המרכזי למשתמש מחובר. מציג סטטיסטיקות, התקדמות, פעילות ונתוני offline. | מעבר למקרא, יומן, הערות, תהילים, תפילות ו־offline; צפייה ב־Activity Feed; המשך קריאה של היום. |

### 2.4 עמודי תוכן וספרייה

| עמוד וכתובת | תפקיד והצדקה | פעולות משתמש מרכזיות |
|---|---|---|
| `pages/Devotionals.jsx`  -  `/Devotionals` | ספריית תהילים יומיים באנגלית ולוגאנדה. קיית כדי להציע קריאה קצרה ומעשית לפני או אחרי התהילה המרכזית. | חיפוש; סינון/מיון; פתיחת תהילה במודאל; בחירת שפה; סימון כהושלם; שיתוף; מעבר לאמצעות מקרא. |
| `pages/PrayerLibrary.jsx`  -  `/PrayerLibrary` | ספריית תפילות לפי קטגוריה ושפה. | חיפוש; סינון קטגוריה ושפה; שמירה למועדפים; ביטול השמירה; שיתוף תפילה. |
| `pages/QA.jsx`  -  `/QA` | מאגר שאלות קוראים ותשובות מכוונות, עם אפשרות לשאול שאלה חדשה. | חיפוש; סינון קטגוריה; קריאת תשובה; פתיחת פסוק; שליחת שאלה כמשתמש מחובר. |
| `pages/TheologicalInsights.jsx`  -  `/TheologicalInsights` | עטיפה מעל `InsightsBoard` עם `kind="theological"`. | אותו מנגנון Insights: חיפוש, פתיחה, שיתוף ושמירה. |
| `pages/HistoricalInsights.jsx`  -  `/HistoricalInsights` | עטיפה מעל `InsightsBoard` עם `kind="historical"`. | אותו מנגנון Insights עם תוכן היסטורי. |
| `pages/VerseOfDay.jsx`  -  `/VerseOfDay` | מציג פסוק מומלץ לכל יום לפי תאריך. | שיתוף; פתיחת הפסוק במקרא; בחירת המופע היומי מתוך הנתונים החיים או מה־seed. |
| `pages/VerseSongs.jsx`  -  `/VerseSongs` | רשימת סדרות Verse-Songs והזמנת השמעה. | בחירת סדרה; השמעת הסדרה; זיהוי העוברת בנגן הגלובלי; טיפול בשגיאת שמע. |
| `pages/VerseSongSeries.jsx`  -  `/VerseSongSeries` | תצוגת פרטים ורשימת אפיזודים של סדרה אחת. | השמעת אפיזוד מובחר או השמעת הסדרה; מעבר בין אפיזודים; חזרה לרשימת הסדרות. |

### 2.5 עמודי חשבון והתחברות

| עמוד וכתובת | תפקיד והצדקה | פעולות משתמש מרכזיות |
|---|---|---|
| `pages/Login.jsx`  -  `/Login` | התחברות לחשבון קורא קיים. | הזנת דוא"ל וסיסמה; הצגת שגיאה; מעבר ל־Dashboard לאחר הצלחה. |
| `pages/Signup.jsx`  -  `/Signup` | יצירת חשבון קורא. | שם מלא, דוא"ל, סיסמה, אימות סיסמה וקבלת תנאים; הערכת חוזקת סיסמה; טיפול בדרישת אימות דוא"ל. |
| `pages/ForgotPassword.jsx`  -  `/ForgotPassword` | התחלת שחזור סיסמה. | הזנת כתובת; שליחת בקשת reset; הודעה ניטרלית שלא חושפת אם קיים חשבון. |
| `pages/ResetPassword.jsx`  -  `/ResetPassword` | קביעת סיסמה חדשה מתוך token ב־URL. | הזנת סיסמה ואימות; בדיקת אורך מינימלי של 8 תווים; התחלת התחברות מחדש. |
| `pages/Logout.jsx`  -  `/Logout` | מסף יציאה מסודר עם מסך קצר. | הפעלת `logout` ללא redirect חיצוני וחזרה לדף הבית. |
| `pages/Admin.jsx`  -  `/Admin` | כניסת מנהל למערכת ניהול התוכן. קיימת בנפרד מהתחברות הקוראים. | הזנת דוא"ל וסיסמת מנהל; שמירת token מקומי; בדיקת session קיים; מעבר ל־AdminDashboard. |
| `pages/AdminDashboard.jsx`  -  `/AdminDashboard` | ממשק ה־CMS. מאפשר לנהל את התוכן וההגדרות שמאחורי האפליקציה. | ניהול תהילים, תפילות, שירים, Q&A, insights, פרקים, משתמשים, הודעות, צבעים, פעילות והגדרות; יצירה, עריכה, מחיקה והעלאת מדיה. |

#### מקטעי `AdminDashboard`

| מקטע | פעולות עיקריות |
|---|---|
| Dashboard | סיכום כמות תוכן, פעילות או מצב המערכת |
| Books & Chapters | ניהול רשומות `BibleVerse` ותצוגת פרקים |
| Devotionals | יצירה ועריכת תהילים בשתי שפות |
| Prayer Library | ניהול תפילות, קטגוריות ומקראות מקור |
| Verse-Songs | ניהול סדרות, אפיזודים, סדר, משך וקובצי אודיו |
| Q&A | ניהול שאלות, תשובות, סטטוס ומקראות |
| Insights | ניהול תוכן תיאולוגי או היסטורי |
| Users | צפייה או ניהול חשבונות/משתמשים, בהתאם להרשאות שהפלטפורמה מאפשרת |
| Messages | קריאה, סימון כנקרא ומענה ל־ContactMessage |
| Text Colours | שינוי צבעי ivory, emerald ו־gold דרך `SiteSettings` |
| Activity Log | צפייה בפעילות ניהולית |
| Settings | ניהול הגדרות כלליות של האתר |

### 2.6 פרמטרי URL חשובים

| עמוד | פרמטר | משמעות |
|---|---|---|
| `BibleReader` | `book` | בחירת ספר/מעבר לתצוגת ספר |
| `Chapter` | `book` | מספר קנוני של הספר, 1 - 66 |
| `Chapter` | `chapter` | מספר הפרק |
| `Chapter` | `verse` | פסוק מתויג שניתן לפתוח ישירות |
| `Devotionals` | `devotional` | קוד תהילה שיש לפתוח מיד, למשל `D-001` |
| `DiscussionGroups` | `group` | שם הקבוצה שנבחרה |
| `Journal` | `new=1` | פתיחת טופס רשומה חדשה |
| `Journal` | `book`, `chapter` | מילוי מקדים לרשומת תפילה |
| `Login` | `next` | נוצר על ידי טפסי התחברות; במימוש הנוכחי אין בו שימוש ברור |
| `ResetPassword` | `token` או `access_token` | אסמכון לאיפוס סיסמה |
| `VerseSongSeries` | `series` | שם הסדרה שנבחרה |

---

## 3. מפת ניווט לצורך DEBUG

### 3.1 ניווט עליון

התפריטים הראשיים המוגדרים ב־`AppHeader` הם:

- About
- Community
- PrayerLibrary
- BibleReader
- VerseSongs
- QA
- Devotionals
- Dashboard

התפריטים המשניים כוללים:

- TheologicalInsights
- HistoricalInsights
- VerseOfDay
- Plan
- Journal
- Offline
- BibleNotes
- CommunityRevelations
- CommunityLiveTeaching
- DiscussionGroups

ה־Footer מוסיף גם קישורים ישירים אל כל האזורים המרכזיים, כולל Bible Reader, Devotionals, Prayer Library, Verse-Songs, Q&A, Insights, Community, Plan, Journal, Dashboard ו־Offline.

### 3.2 טבלת מסלולים

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת דף הבית | Header, Footer | לוגו Pray-Read | `/Home` |
| מעבר למקרא | Header, Home | Bible Reader | `/BibleReader` |
| בחירת ספר | BibleReader | כרטיס ספר | תצוגת הספר ב־BibleReader או ישירות ל־Chapter |
| בחירת פרק | תצוגת הספר | Chapter tile | `/Chapter?book={number}&chapter={chapter}` |
| פתיחת פסוק מסומן | BibleNotes | כרטיס הערה/Highlight | `/Chapter?...&verse={verse}` |
| סימון פסוק | Chapter | לחיצה על פסוק | פתיחת `VerseActionBar` |
| הלבת פסוק | VerseActionBar | אחת מארבעת כפתורי הצבע | יצירת `StudyMark` מסוג highlight ו־`ReadingActivity` |
| סימון פסוק | VerseActionBar | Bookmark | יצירת `StudyMark` מסוג bookmark |
| כתיבת הערה | VerseActionBar | Note | יצירת `StudyMark` מסוג note |
| העתקת פסוק | VerseActionBar | Copy | Clipboard והודעת “Copied” |
| שיתוף פסוק | VerseActionBar | Share | חלונות Facebook, WhatsApp, Telegram, Instagram, LinkedIn או העתקת קישור |
| פתיחת הפניה | VerseActionBar | Cross-reference | `FloatingVerse` בתוך העמוד |
| מעבר מהפניה למקרא | FloatingVerse | Open in Bible Reader | `/Chapter?...` |
| פתיחת תפילת פסוק | Chapter/VerseActionBar | Prayer action | `PassagePrayer` בתוך העמוד |
| פתיחת מקראות משלימים | Chapter | Commentary/Theological/Historical/Q&A tabs | תוכן מתחת לפסוקים באותו עמוד |
| פתיחת מבנה הספר | BibleReader | Book Outline | `BookOutline` בתוך תצוגת הספר |
| פתיחת פסוק מתוך מבנה הספר | BookOutline | כותרת או טווח | `VersePopup` בתוך העמוד |
| פתיחת פסוק מרשימת Key Passages | BookIntro | קישור פסוק | `VersePopup` |
| פתיחת פסוק מתפילת הספר | BookPrayerPanel | קישור `[[Book Chapter:Verse]]` | `VersePopup` |
| מעבר ליום בתכנית | Plan | כרטיס יום | `/Chapter?book=...&chapter=...` |
| פתיחת תהילה | Devotionals | כרטיס תהילה | `Modal` עם תוכן מלא |
| שיתוף תהילה | Devotionals modal | ShareRow | רשת חברתית חיצונית או clipboard |
| סימון תהילה כהושלמה | Devotionals | Done/Check | local storage + `DevotionalProgress` |
| פתיחת תפילה מהספרייה | PrayerLibrary | כרטיס תפילה | תצוגת תפילה ושיתוף |
| שמירת תפילה | PrayerLibrary | Bookmark | יצירת `PrayerSaved` |
| הסרת תפילה משמורת | PrayerLibrary | Bookmark checked | מחיקת `PrayerSaved` |
| פתיחת insight | InsightsBoard | כרטיס insight | הרחבת התוכל |
| שיתוף insight | InsightsBoard | ShareRow | רשת חברתית |
| שמירת insight | InsightsBoard | Save | `localStorage` בלבד |
| מעבר לקהילה | Header, Home, Footer | Community | `/Community` |
| מעבר לגילויים | Community hub | Revelations | `/CommunityRevelations` |
| מעבר לשיעור חי | Community hub | Live teaching | `/CommunityLiveTeaching` |
| מעבר לקבוצות | Community hub | Discussion groups | `/DiscussionGroups` |
| פתיחת קבוצה | DiscussionGroups | כרטיס קבוצה | אותו עמוד עם `group` ב־URL |
| הצטרפות לקבוצה | DiscussionGroups | Join | local storage בלבד |
| פרסום הודעת קבוצה | ThreadMessages | Send | יצירת `DiscussionThread` |
| פתיחת תגובות | RevelationCard | Comments | הרחבת `CommentThread` |
| סימון לייק | RevelationCard | Heart | עדכון מספר לייקים |
| שליחת שאלה | QA | Ask/Send | יצירת `QAEntry` |
| פתיחת משוב | QA | כרטיס Q&A | תשובה ופסוק מקור |
| שליחת פנייה | Contact | Send | יצירת `ContactMessage` |
| פתיחת Dashboard | Header, Login | Dashboard | `/Dashboard` |
| מעבר ליומן | Header, Dashboard | Prayer journal | `/Journal` |
| יצירת רשומת יומן | Journal | New entry | `/Journal?new=1` או טופס מקומי |
| מעבר לסימונים | Header, Dashboard | My notes | `/BibleNotes` |
| מעבר למרכז offline | Header, Dashboard, Footer | Offline centre | `/Offline` |
| התקנת PWA | Home, InstallPrompt | Install | התקנת אפליקציית המכשיר |
| ניהול תוכן | כניסת Admin | Admin Dashboard | `/AdminDashboard` |
| יציאה | Header | Logout | `/Logout` ולאחריו `/Home` |
| תרומה | Header/Footer | Donate | קישור חיצוני ל־Pesapal |

### 3.3 נקודות Debug חשובות

| מקום | מה לבדוק |
|---|---|
| `AuthProvider` | האם `fse2.auth.me()` החזיר משתמש; האם `isAuthenticated` מתעדכן נכון |
| TanStack Query | מפתחות query כגון `["prayers"]`, `["insights", kind]`, `["readingActivity", email]` |
| `fse2.functions.invoke` | `adminAuth`, `adminContent`, `content`, `bibleChapter` |
| `localStorage` | `pr_admin_token`, `fse2_app_id`, `fse2_token`, מפתחות `STORAGE_KEYS` |
| IndexedDB | `prayread-offline`, version 4, 13 stores |
| Service Worker | `prayread-shell-v1`, `prayread-runtime-v1` |
| בחירת פסוק | האם `verse` תקין ומתאים לשפה הנוכחית |
| התחברות ל־FSe2 | חשיבון, role, token ו־appId |
| תצוגת seeded content | האם רשומות חיות קיימות אך ממוזגות עם seed באופן שונה |

---

## 4. מבנה הקבצים

### 4.1 קבצי האפליקציה הראשיים

| קובץ | תפקיד |
|---|---|
| `Layout.jsx` | מעטפת ראשית המערכת. מרכזת את `AuthProvider`, `ThemeProvider` ו־`PlayerProvider`, ומרנדרת Header, Footer, Global Player ו־PWA metadata סביב `children`. |
| `api/fse2Client.js` | לא סופק במקור, אך הוא שכבת ה־SDK המרכזית ל־Entities, Auth, Functions ו־Files. כל תקלת backend או הרשאות כנראה מתחילה כאן. |
| `utils.js` / קובץ מקביל | מספק `createPageUrl`. מימושו לא סופק, ולכן prefix ודרך יצירת הנתיבים צריכים להיות מאומתים. |

### 4.2 קבצי העמודים

כל קובצי העמודים מפורטים במלואם ב־סעיף 2:

- `pages/About.jsx`
- `pages/Admin.jsx`
- `pages/AdminDashboard.jsx`
- `pages/BibleNotes.jsx`
- `pages/BibleReader.jsx`
- `pages/Chapter.jsx`
- `pages/Community.jsx`
- `pages/CommunityLiveTeaching.jsx`
- `pages/CommunityRevelations.jsx`
- `pages/Contact.jsx`
- `pages/Dashboard.jsx`
- `pages/Devotionals.jsx`
- `pages/DiscussionGroups.jsx`
- `pages/ForgotPassword.jsx`
- `pages/HistoricalInsights.jsx`
- `pages/Home.jsx`
- `pages/InstallPrompt.jsx`
- `pages/Journal.jsx`
- `pages/Login.jsx`
- `pages/Logout.jsx`
- `pages/Offline.jsx`
- `pages/Plan.jsx`
- `pages/PrayerLibrary.jsx`
- `pages/Privacy.jsx`
- `pages/QA.jsx`
- `pages/ResetPassword.jsx`
- `pages/Signup.jsx`
- `pages/Terms.jsx`
- `pages/TheologicalInsights.jsx`
- `pages/VerseOfDay.jsx`
- `pages/VerseSongSeries.jsx`
- `pages/VerseSongs.jsx`

### 4.3 קבצי רכיבי הממשק

#### רכיבים כלליים

| קובץ | מה הוא מרנדר |
|---|---|
| `components/common/EmptyState.jsx` | מצב ריק אחיד: אייקון, כותרת, תיאור ופעולה אופציונלית. |
| `components/common/Modal.jsx` | חלון מודאלי; סוגר בלחיצת רקע, כפתור X או Escape; נועל את גלילת `body`. |
| `components/common/PageHeader.jsx` | Header גמיש לעמודים: גרסת section פשוטה או hero עם תמונת רקע ו־overlay. |
| `components/common/ShareRow.jsx` | שורת כפתורי שיתוף לפי `shareChannels`; מציג המצאת הצלחה עבור Copy. |
| `components/common/Spinner.jsx` | מצב טעינה נגיש עם `role="status"` ו־`aria-live`. |

#### רכיבי קהילה

| קובץ | מה הוא מרנדר |
|---|---|
| `components/community/RevelationCard.jsx` | כרטיס גילוי עם מחבר, פסוק, כותרת, גוף, לייק ומונה תגובות. |
| `components/community/RevelationForm.jsx` | טופס פרסום גילוי; במצב לא מחובר מציג הנחיה להתחברות. |
| `components/community/CommentThread.jsx` | רשימת תגובות וטופס תגובה; מציג מצבי busy/error ו־sign-in. |
| `components/community/ThreadMessages.jsx` | הודעות קבוצה עם שם קבוצה, מחבר, כותרת וטופס שליחה. |

#### רכיבי Dashboard, Home ו־Insights

| קובץ | מה הוא מרנדר |
|---|---|
| `components/dashboard/ActivityFeed.jsx` | פיד של עד 12 פעילויות קריאה אחרונות, עם אייקון, צבע וקישור לרלוונטי. |
| `components/home/StatCard.jsx` | כרטיס מספר סטטיסטי: label, value, hint ואייקון. |
| `components/insight/InsightsBoard.jsx` | לוח Insights לפי `kind`; חיפוש, מיזוג seed ו־DB, הרחבה, שיתוף ושמירה מקומית. |

#### רכיבי Journal

| קובץ | מה הוא מרנדר |
|---|---|
| `components/journal/JournalCard.jsx` | כרטיס רשומת יומן עם קטגוריה, כותרת, גוף, תאריך, ספר/פרק וכפתורי עריכה/מחיקה. |
| `components/journal/JournalForm.jsx` | טופס יצירה או עריכה; מנהל title, body, category, book ו־chapter ומאמת שיש תוכן. |

#### רכיבי Layout

| קובץ | מה הוא מרנדר |
|---|---|
| `components/layout/AppHeader.jsx` | Header רספונסיב: לוגו, תפריטים ראשיים ומשניים, מצב מחובר, תפריט נייד, התקנה, התרמה והתנתקות. |
| `components/layout/AppFooter.jsx` | Footer עם לוגו, קישורי מהירות, תנאים, פרטיות, תרומה וקישורים חברתיים; כולל fallback ל־“PR” אם הלוגו נכשל. |
| `components/layout/GlobalPlayer.jsx` | נגן אודיו גלובלי: play/pause, seek, skip, volume, speed, shuffle, repeat, playlist ומצב expanded. |
| `components/layout/PwaHead.jsx` | מוסיף meta tags, manifest, Apple touch icon ורושם את `/sw.js`. |

#### רכיבי תכנית קריאה

| קובץ | מה הוא מרנדר |
|---|---|
| `components/plan/PlanRow.jsx` | שורת יום בתכנית עם מספר יום, סטטוס, כותרת, מיקום ביקורת וקישור לפרק. |

#### רכיבי המקרא

| קובץ | מה הוא מרנדר |
|---|---|
| `components/read/AnnotatedText.jsx` | טקסט הניתן לסימון. בונה segments לפי גבולות ההערות, מציג toolbar לאחר בחירת טקסט ומאפשר highlight או underline. |
| `components/read/BookGrid.jsx` | רשת 66 הספרים עם חיפוש דו-לשוני, טאבים וגלילה למקום הנבחר. |
| `components/read/BookIntro.jsx` | מבוא לספר, עובדות ספר, key passages והערות אפשריות. |
| `components/read/BookOutline.jsx` | מבנה חלקי הספר; כותרות וטווחים פותחים פסוק וניתנים לסימון. |
| `components/read/BookPrayerPanel.jsx` | תפילת הספר באנגלית/לוגאנדה, קישורי מקרא פנימיים ותפילות קשורות. |
| `components/read/BookSidebar.jsx` | לוח צד עם שלושה טאבים: Intro, Outline ו־Book Prayer. |
| `components/read/ChapterGrid.jsx` | רשת פרקים עם בחירת הפרק הנוכחי. |
| `components/read/ChapterSelector.jsx` | מנהל את תצוגת הספר: sidebar, chapter grid, בחירת outline, popup פסוק והערות מקומיות/שרת. |
| `components/read/FloatingVerse.jsx` | חלון צף להצגת פסוק מהפניה ומעבר ישיר למקרא. |
| `components/read/PassagePrayer.jsx` | מציג תפילות המתאימות לפרק או פסוק נוכחיים. |
| `components/read/PassageTabs.jsx` | טאבים ל־commentary, theological insight, historical insight ו־Q&A לפי פרק. |
| `components/read/VerseActionBar.jsx` | פעולות פסוק: הלבה, bookmark, note, copy, share, cross-reference ותפילה. |
| `components/read/VerseList.jsx` | רשימת פסוקים עם מספר פסוק, סימון נבחר ו־highlight. |
| `components/read/VersePopup.jsx` | Popup פנימי שטוען פרק, מציג את פסוק היעד והקשר סביבו, ומאפשר סימון. |

### 4.4 קבצי ספריות ושירותי הלקוח

| קובץ | תפקיד |
|---|---|
| `lib/activity.js` | קביעת סוגי פעילות וכתיבת `ReadingActivity`; פעולת logging אינה צריכה לשבור את פעולת המשתמש. |
| `lib/adminSession.js` | קריאה, שמירה ומחיקה של `pr_admin_token`; עטיפת `fse2.functions.invoke("adminAuth", ...)`. |
| `lib/app-params.js` | חשיפת `appId`, token, URL ו־functions version ל־FSe2. |
| `lib/AuthContext.jsx` | Provider שמנהל משתמש, מצב authentication, login redirect ו־logout. |
| `lib/bibleApi.js` | טעינת פרק מהשרת, ניתוד HTML ו־entities, והחזרה ל־offline כשאין רשת. |
| `lib/bibleBooks.js` | מאגר סטטי של 66 הספרים: מספר, שם, קיצור, שם לוגאנדי ומספר פרקים. |
| `lib/bookGuides.js` | מבוא ומבנה חלקים לכל ספר. |
| `lib/bookPrayers.js` | תפילה מקומית לכל ספר עם הפניות `[[Book Chapter:Verse]]`. |
| `lib/brandCss.js` | מקור משותף ל־CSS variables, layout בסיסי, כרטיסים, כפתורים ורספונסיביות. |
| `lib/contentApi.js` | מיפוי collections ציבוריים ל־Entities או Functions וכתיבת submissions. |
| `lib/crossRefs.js` | הפניות בין פסוקים, בעיקר לפסוקים פופולריים. |
| `lib/format.js` | עזרי תצוגה: `safeText`, פיצול רשימות, title case, משך זמן וגודל אחסון. |
| `lib/keyPassages.js` | שלושה פסוקים מומלצים לכל ספר. |
| `lib/luganda.js` | ניקוי ועיצוב devotional לוגאנדי לפי כותרות ומבנה פסקאות. |
| `lib/offlineDb.js` | מעטפת IndexedDB, פתיחת DB, stores, put/get/delete ו־storage estimate. |
| `lib/planData.js` | תוכן fallback של תכנית 30 הימים. |
| `lib/player.jsx` | Provider ו־`Audio` singleton גלובלי עם queue ומצב playback. |
| `lib/reading.js` | עזרי תאריך, ימים אחרונים, חישוב streak ועיצוב תאריכים. |
| `lib/readings.js` | חיפוש יום תכנית לפי ספר/פרק ושמירת קריאה שהושלמה. |
| `lib/scriptureRefs.js` | parsing ו־normalization של הפניות מקרא ו־טווחים. |
| `lib/seedContent.js` | תוכן fallback לתהילים, תפילות, insights, Verse of the Day, קהילה ועוד. |
| `lib/share.js` | בניית כתובות שיתוף לרשתות חברתיות והעתקה. |
| `lib/studyAnnotations.js` | מפתח annotation, merge של רשומות מקומיות ושרת, ושמירה/מחיקה כפולה. |
| `lib/textSelection.js` | זיהוי אם הקליק נובע מבחירת טקסט, כדי למנוע ניווט לא רצוי. |
| `lib/theme.js` | קבועי מותג, נתיבי לוגו, תמונות hero, donation URL ומפתחות storage. |
| `lib/themeContext.jsx` | טעינת `SiteSettings` והחלת צבעי מותג משתנים ל־CSS. |

### 4.5 קבצי Functions בצד השרת

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | Login, session validation, password management, salted SHA-256 hash ו־token חתום ב־HMAC לכלול 12 שעות. |
| `functions/adminContent.js` | אימות admin token והרשאת פעולות privileged על רשימת entities המנוהלים. |
| `functions/bibleChapter.js` | טעינת פרק מהמקורות הציבוריים, ניקוי טקסט והרכבת תשובה אחידה. |
| `functions/content.js` | קריאת collections ציבוריים וקבלת submissions כגון פנייה ושאלה. |

### 4.6 קבצי Public ו־PWA

| קובץ | תפקיד |
|---|---|
| `public/manifest.json` | שם, צבעים, תצוגה standalone, start URL ואייקוני האפליקציה. |
| `public/sw.js` | Service Worker: cache-first עבור app shell ותמונות, network-first עבור בקשות runtime. |
| `__generated/tailwind.css` | Utility CSS מג׳נרט ולא קובץ לעריכה ידנית. |
| `public/assets/generated_*.png` | נכסי מותג ותמונות מקור. הקוד מפנה לחלקם דרך `/api/appfiles/public/app_73e21b4aa5684452/assets/...`. |
| `public/assets/media-library/*` | נכסי מדיה, PDF ו־ZIP לשימוש תכנן/ניהול; אינם חלק מה־runtime flow המוצג. |

שמות הנכסים המדויקים כוללים:

- `generated_022a23b6.png`
- `generated_0f91fdf8.png`
- `generated_5fe46b6c.png`
- `generated_703e129d.png`
- `generated_8b82ca52.png`
- `generated_a74541e8.png`
- `generated_aa744f7a.png`
- `generated_c990bd6c.png`
- `generated_f0778e1c.png`
- `media-library/1ec9f04959c2_image.png`
- `media-library/350264576583_image.png`
- `media-library/3c1ee7293fba_image.png`
- `media-library/43328fef264e_image.png`
- `media-library/58132ad5907d_image.png`
- `media-library/69a5f10e35c8_image.png`
- `media-library/a6f2acb34271_image.png`
- `media-library/b4a70bcd3e36_image.png`
- `media-library/b50e6c213bb8_pray-read-pneuma-main-3.zip`
- `media-library/ee0d38d9f96a_image.png`
- `media-library/f438ed2a3a0d_Pray-Read-Bible-Master-Prompt-For-Finestructure-Ai.pdf`

### 4.7 קבצים לא פעילים

- תיקיית `__trash/` מכילה ממשק ישן שנמחק:
  - `components/home/TodayCard.jsx`
  - `components/home/WeekStrip.jsx`
  - `components/layout/Sidebar.jsx`
  - `components/layout/SignInBanner.jsx`
  - `components/read/BookPicker.jsx`
  - `components/read/ReflectionPanel.jsx`
  - `pages/Insights.jsx`
  - `pages/Read.jsx`
- תיקיית `__url_fetch/` מכילה snapshots של דפי web, נתוני Bible API וניתוחי screenshots. היא משמשת למחקר ולהשוואה, אך אינה חלק מזרימת האפליקציה.
- קבצי `public/assets` שמכילים `data:image/...` כטקסט צריכים להיבדק בתהליך ה־build: דפדפן מצפה לקובץ PNG אמיתי. אם הקבצים מוגשים כפי שהם, עלולה להיווצר שגיאת טעינת תמונה.

---

## 5. מודל הנתונים  -  Entities

### 5.1 טבלת Entities

| Entity | מטרה | שדות מרכזיים ומשמעותם |
|---|---|---|
| `entities/ActivityLog.json` | יומן פעילות ניהולית ב־CMS. | `actor`  -  מבצע; `action`  -  פעולה; `section`  -  אזור; `detail`  -  פירוט. |
| `entities/AdminAccount.json` | חשבון מנהל נפרד ממערכת המשתמשים הרגילים. | `email`; `password_hash`; `salt`; `updated_date`. |
| `entities/BibleVerse.json` | אחסון מקרא באנגלית ולוגאנדה. | `book_number`; `book`; `chapter`; `verse`; `text_en`; `text_lu`. |
| `entities/Commentary.json` | הערת פירוש לפי ספר ופרק. | `book`; `chapter`; `title`; `body_en`; `body_lu`. |
| `entities/ContactMessage.json` | פנייה שנשלחה מטופס יצירת קשר. | `name`; `email`; `subject`; `message`; `is_read`; `reply`. |
| `entities/Devotional.json` | תהילה יומי דו-לשוני. | `code`; כותרות ב־EN/LU; `scripture`; `body`; `related`; `further_readings`; `cover_image`. |
| `entities/DevotionalProgress.json` | סימון שתהילה הושלמה על ידי משתמש. | `owner_email`; `devotional_code`; `completed_date`. |
| `entities/DiscussionGroup.json` | קבוצת לימוד. | `name`; `description`; `schedule`; `member_count`. |
| `entities/DiscussionThread.json` | הודעה בתוך קבוצה. | `group_name`; `owner_email`; `author_name`; `title`; `body`. |
| `entities/Insight.json` | תוכן תיאולוגי או היסטורי. | `kind`  -  `theological`/`historical`; `title`; `passage`; `excerpt`; `body`; `share_count`. |
| `entities/JournalEntry.json` | רשומת יומן תפילה אישית. | `owner_email`; `entry_date`; `title`; `body`; `category`; `book`; `chapter`; `mood`. |
| `entities/LiveSession.json` | שיעור חי עתידי. | `title`; `session_date`; `host`; `join_link`; `description`. |
| `entities/Prayer.json` | תפילה בספרייה. | `title`; `title_lu`; `category`; `body_en`; `body_lu`; `scripture_ref`. |
| `entities/PrayerSaved.json` | קשר בין משתמש לתפילה שנשמרה. | `owner_email`; `prayer_title`. |
| `entities/QAEntry.json` | שאלת קורא ותשובת העדרה. | `question`; `category`; `answer`; `passage_ref`; `answered_by`; `status`; `author_email`. |
| `entities/ReadingActivity.json` | פעולת קריאה אחת. | `owner_email`; `activity_type`; `book`; `book_number`; `chapter`; `verse`. |
| `entities/Reading.json` | פרק שהושלם, כולל תהליך ערכה ותפילה. | `owner_email`; `book`; `chapter`; `translation`; `plan_day`; `read_date`; `status`; `reflection`; `prayer_point`; `highlighted_verses`. |
| `entities/ReadingPlan.json` | יום בתוכנית 30 הימים. | `day`; `book`; `chapter`; `title`; `theme`; `focus`; `scripture`. |
| `entities/Revelation.json` | גילוי קהילתי או תגובה השייכת לגילוי. | `owner_email`; `author_name`; `title`; `passage`; `body`; `likes`; `parent_id`. |
| `entities/SiteSettings.json` | הגדרות אתר בצורת key/value. | `setting_key`; `setting_value`. |
| `entities/StudyAnnotation.json` | Highlight או underline בתוך מבנה הספר. | `owner_email`; `book_number`; `book`; `section`; `block_id`; `kind`; `color`; `start_offset`; `end_offset`. |
| `entities/StudyMark.json` | Highlight, bookmark או note על פסוק. | `owner_email`; `mark_type`; `book_number`; `book`; `chapter`; `verse`; `color`; `note_text`. |
| `entities/VerseOfDay.json` | פסוק מומלץ לתאריך מסוים. | `verse_date`; `reference`; `text_en`; `text_lu`; `note`. |
| `entities/VerseSongEpisode.json` | אפיזוד בסדרת Verse-Song. | `series_name`; `title`; `verse_ref`; `duration_label`; `duration_seconds`; `audio_url`; `audio_key`; `thumbnail`; `episode_order`. |
| `entities/VerseSongSeries.json` | סדרת Verse-Song. | `name`; `description`; `thumbnail`; `cover_image`; `accent`. |

### 5.2 קשרים לוגיים

ה־JSON אינו מגדיר Foreign Keys; הקשרים מיושמים בעיקר באמצעות שמות ומזהים:

| ישות הורה | שדה ביחד | ישות ילד |
|---|---|---|
| `Devotional.code` | `devotional_code` | `DevotionalProgress` |
| `Prayer.title` | `prayer_title` | `PrayerSaved` |
| `DiscussionGroup.name` | `group_name` | `DiscussionThread` |
| `VerseSongSeries.name` | `series_name` | `VerseSongEpisode` |
| `Revelation.id` | `parent_id` | `Revelation`  -  תגובה |
| `ReadingPlan.day` | `plan_day` | `Reading` |
| משתמש/דוא"ל | `owner_email` | רשומות אישיות רבות |
| ספר קנוני 1 - 66 | `book_number` | `BibleVerse`, `StudyMark`, `StudyAnnotation` |

### 5.3 הערות על שלמות הנתונים

- שינוי `Prayer.title` עלול לשבור קשרים של `PrayerSaved`.
- שינוי `Devotional.code` דורש עדכון `DevotionalProgress`.
- שינוי שם סדרה או קבוצה דורש עדכון רשומות ילד.
- `parent_id` מאפשר להבחין בין גילוי לתגובה, אך אין אילוץ שההורה אכן קיים.
- `member_count` הוא מדד שמור, ולא מונה אוטומטי של חברים.
- `highlighted_verses` ב־`Reading` הוא מחרוזת legacy, בעוד `StudyMark` הוא מודל מובנה עם רשומה נפרדת לכל סימון.
- הרשאות owner/user/authenticated צריכות להיות מלווה ב־row-level enforcement בשרת. סינון לפי `owner_email` בדפדפן אינו תחליף לאבטחה.

---

## 6. תהליכים ואינטראקציות מרכזיות

### 6.1 טעינת אפליקציה והתחברות

1. `Layout` יוצר את `AuthProvider`.
2. `AuthProvider` מריץ `fse2.auth.me()` פעם בעת טעינה.
3. המשתמש, `isAuthenticated` ו־`isLoadingAuth` מועברים דרך Context.
4. רכיבים כגון `Dashboard`, `Journal` ו־`PrayerLibrary` משתמשים ב־`useAuth()` כדי לדעת אם להפעיל queries והרשאות.
5. בהתחברות מוצלחת הדפדפן מנווט ל־`/Dashboard`.
6. בהתחברות מוגבלת מוצגת חלונית כניסה עם פרמטר `next`.
7. ביציאה מתבצע `fse2.auth.logout`, מנוקל ה־Context וחוזרים לדף הבית.

### 6.2 פתיחת ספר וקריאת פרק

1. המשתמש בוחר ספר מ־`BookGrid`.
2. נבחר ספר ומספר פרק.
3. `Chapter` קורא את `book`, `chapter` ואולי `verse` מ־URL.
4. `fetchChapter` מנסה לטעון את הפרק מהשרת.
5. השרת מפנה למקור אנגלי או לוגאנדי ומנקה את הטקסט.
6. אם הבקשה נכשלת, נבדק IndexedDB לפי שפה, ספר ופרק.
7. הפרק מוצג ונשמר כ־offline במקרים המתאימים.
8. נרשמת `ReadingActivity` מסוג `chapter_visit`.

### 6.3 סימון פסוק

1. המשתמש לוחץ על פסוק.
2. נפתח `VerseActionBar`.
3. לחיצה על צבע יוצרת `StudyMark` מסוג `highlight`.
4. Bookmark יוצר `StudyMark` מסוג `bookmark`.
5. Note יוצר `StudyMark` מסוג `note` עם `note_text`.
6. הפעולה מייצרת גם `ReadingActivity`.
7. אין כאן בהכרח optimistic update; לפי הקוד הנראה הנתונים מתעדכנים לאחר הצלחת השרת.
8. המשתמש יכול לראות את הסימונים ב־BibleNotes ובתוך הפרק.

### 6.4 השלמת פרק והתקדמות בתכנית

1. המשתמש מסמן שקרא את הפרק.
2. נשמרת רשומת `Reading` עם:
   - owner
   - ספר ופרק
   - שפה/תרגום
   - תאריך
   - status
   - reflection
   - prayer point
3. `findPlanDay` מחפש אם הספר והפרק תואמים ליום בתכנית.
4. אם קיים יום תכנית, נשמר `plan_day`.
5. ב־Plan מחושבים את הימים שהושלמו, היום הנוכחי ואחוז ההתקדמות.

### 6.5 סימון בתוך מבנה הספר

1. `AnnotatedText` מאפשר לבחור קטע טקסט.
2. מחושבים `start_offset` ו־`end_offset`.
3. מוצג toolbar עם ארבעה צבעי highlight ואפשרות underline.
4. ההערה נשמרת:
   - ב־IndexedDB, כדי לעבוד גם ללא חשבון או ללא רשת.
   - ב־`StudyAnnotation` כשהמשתמש מחובר.
5. בעת טעינה מתבצע merge לפי `annotationKey`.
6. סימון נבחר מוצג גם בעת עכביית טעינת הפרק.

### 6.6 תהילה יומית והתקדמות

1. `Devotionals` טוען נתונים חיים ומצרגל תוכן מובנה כגיבוי.
2. בחירת תהילה פותחת `Modal`.
3. סימון “הושלם” נשמר מקומית ב־`STORAGE_KEYS.doneDevotionals`.
4. כשהמשתמש מחובר נשמרת גם `DevotionalProgress`.
5. ה־Query cache מתעדכן באמצעות invalidation.
6. שיתוף התהילה נשלח עם קישור לעמוד התהילה.

### 6.7 שמירת תפילה

1. המשתמש לוחץ Bookmark בכרטיס תפילה.
2. `PrayerSaved` נוצר עם `owner_email` ו־`prayer_title`.
3. הרשומה החדשה מופיעה ב־query key `["prayerSaved", email]`.
4. לחיצה נוספת מוצאת את הרשומה ומוחקת אותה.
5. הסטטוס המקומי משתקף בעת invalidation ו־refetch.

### 6.8 פרסום גילוי ותגובות

1. משתמש לא מחובר רואה כפתור כניסה עם כתובת חזרה.
2. משתמש מחובר ממלא כותרת, פסוק וגוף.
3. `submitRevelation` יוצר רשומת `Revelation` ללא `parent_id`.
4. תגובה נוצרת עם `parent_id` של הגילוי.
5. הפיד מפריד רשומות ל־`livePosts` ו־`liveComments`.
6. Like מעדכן את מספר הלייקים; לייק על תוכן seed מנוהל בנפרד מ־local state.
7. פתיחת תגובות מבוססת על `openId`.

### 6.9 קבוצת דיון

1. המשתמש בוחר קבוצה.
2. הקבוצה נפתחת באמצעות פרמטר `group`.
3. הודעות מהשרת ממוזגות עם seed content.
4. הצטרפות נשמרת בלבד ב־`localStorage`.
5. הודעה חדשה נוצרת עם `group_name`, מחבר וגוף.
6. לאחר mutation מתבצע invalidation של ה־threads.

### 6.10 Q&A ויצירת קשר

- **Q&A:** המשתמש מחובר שולח שאלה דרך `submitQuestion`; השרת יוצר `QAEntry` עם `author_email`.
- **Contact:** גם משתמש לא מחובר יכול לשלוח פנייה; השרת יוצר `ContactMessage` עם `is_read=false`.
- בשני המקרים יש להוסיף הגבלת קצב, anti-spam והגנה מ־CAPTCHA בפריסה ציבורית.

### 6.11 ניהול תוכן

1. המנהל נכנס ב־`/Admin`.
2. `adminAuth` מאמת את הסיסמה, יוצר salt ו־hash ומנפיק token חתום.
3. ה־token נשמר ב־`localStorage` תחת `pr_admin_token`.
4. `AdminDashboard` קורא ל־`adminContent` עם ה־token.
5. הפונקציה מאמתת את ה־token לפני פעולת create/update/delete.
6. רשומות נוספות ב־`ActivityLog` על ידי ה־function או על ידי ה־CMS.
7. בעת סיום מוסרת ה־Admin את ה־token.

### 6.12 הורדת תוכן ל־offline

1. המשתמש נכנס ל־Offline Centre.
2. בוחר סוג תוכן, ספרים ושפה.
3. לכל פרק נטענים פסוקים ונשמרים ב־IndexedDB.
4. העמוד מציג כמות רשומות בכל store ואת נפח האחסון.
5. `BibleReader` מחשב ספר כזמין offline רק אם כל פרקיו בשפה הנדרשת נמצאים מקומית.
6. ניתן לנקות stores או את כל מאגר ה־offline.

### 6.13 התקנה והפעלה offline

1. `PwaHead` מוסיף metadata ורושם `/sw.js`.
2. הדפדפן מציג `beforeinstallprompt`.
3. `InstallPrompt` שומר את האירוע ומאפשר למשתמש לבחור התקנה.
4. ה־Service Worker שומר את הנתיבים המרכזיים ב־shell cache.
5. בקשות runtime מנסות קודם רשת ונפולות ל־cache כשאין חיבור.

### 6.14 נגן Verse-Song גלובלי

1. המשתמש בוחר סדרה או אפיזוד.
2. נבנית תור של tracks.
3. `PlayerProvider` טוען `audio_url` לתוך אותו `Audio` element.
4. הנגן ממשיך לעבוד בעת ניווט בין עמודים.
5. המשתמש יכול לשנות עוצמה, מהירות, shuffle ו־repeat.
6. `GlobalPlayer` מציג את המצב הנוכחי ואת התור המלא.

---

## 7. הערות טכניות לפיתוח

### 7.1 ספריות בשימוש

| ספרייה | שימוש |
|---|---|
| `react` | רכיבים, hooks ו־contexts |
| `react-router-dom` | ניתוב, `Link`, `useNavigate`, `useSearchParams` |
| `@tanstack/react-query` | שליפת collections, mutations, cache ו־invalidation |
| `lucide-react` | אייקוני הממשק |
| `date-fns` | עיצוב תאריכים, ימי שבוע ו־relative time |
| `fse2` client | Auth, Entities, Functions, Files |
| Browser APIs | `localStorage`, IndexedDB, `Audio`, `fetch`, `DOMParser`, Service Worker |

### 7.2 דפוסים חוזרים

#### Fallback של תוכן

כאשר collection חי ריק או לא זמין, הדפדפן משתמש ב־`seedContent`. יש להבטיח שה־seed וה־entity משתמשים באותו schema.

#### Query כמקור נתונים

- קריאות משתמשות ב־`useQuery`.
- פעולות כתיבה משתמשות ב־`useMutation`.
- לאחר כתיבה יש לבצע `invalidateQueries`.
- חלק מה־query keys אינם כוללים `email` או `isAuthenticated`, ולכן cache עלול להישאר עם תוצאה ציבורית גם לאחר כניסה.

#### Dual persistence

- Highlights/notes של פסוק: `StudyMark`.
- הערות במבנה הספר: `StudyAnnotation`.
- התקדמות תהילה: local + `DevotionalProgress`.
- התקדמות קריאה: `Reading`.
- Insights שמורים: רק local.
- הצטרפות לקבוצה: רק local.

#### Context hierarchy

- `AuthProvider` חייב להיות מעל `ThemeProvider`, משום שערכת הנושא תלויה במצב ההתחברות.
- `PlayerProvider` נמצא בתוך העטיפה העליונה ולכן הנגן שומר על המצב בין routes.

### 7.3 נקודות חוזקה

- יש הפרדה ברורה בין רכיבי תצוגה, שירותי נתונים ו־entities.
- קיימת שכבת fallback שמאפשרת לאפליקציה לעבוד עם תוכן מובנה.
- ה־offline model כולל content, annotations ו־study marks.
- יש נגן אודיו גלובלי ולא נגן נפרד לכל עמוד.
- רוב פעולות המשתמש מגיבות עם מצבי loading, error ו־success.
- רכיבי הספר תומכים גם במצב לא מחובר.
- ה־Service Worker וה־manifest מאפשרים התקנת PWA.
- קיימת תמיכה דו-לשונית במקרא, devotionals ותפילות.

### 7.4 בעיות וסיכונים שיש לתקן או לאמת

#### 1. ייבוא `Icon` מ־`lucide-react`

ב־`components/read/BookSidebar.jsx` מיובא:

```js
import { BookOpenIcon, HeartHandshakeIcon, ListIcon, Icon } from "lucide-react";
```

לא ברור ש־`Icon` הוא export תקני בגרסת `lucide-react`, והוא אינו נראה בשימוש. אם אין export כזה, ה־build עלול להיכשל. יש להסיר את הייבוא או להחליף אותו ב־`List`/אייקון קיים.

#### 2. אי־התאמה בין `Offline` ל־`offlineDb`

ב־`pages/Offline.jsx` מוגדר section בשם `prayers` עם store בשם `prayers`, אך ב־`lib/offlineDb.js` רשימת `STORES` כוללת `books`, `chapters`, `verses`, `devotionals`, `commentary`, `qa`, `verseOfDay`, `meta`, `highlights`, `bookmarks`, `notes`, `annotations`  -  ללא `prayers`.

יש לאחד את השמות, או להוסיף את ה־store ולבצע migration עם העלאת `DB_VERSION`.

#### 3. חוסר אכיפת owner בצד השרת

במספר עמודים נטענים רשומות רבות ואז מסוננים לפי `owner_email` בדפדפן. זה יכול לחשוף metadata של משתמשים אחרים, להגדיל את העברה, ולא מספק אבטחה. יש להוסיף server-side filters כגון:

```text
owner_email = current_user.email
```

#### 4. סיסמת מנהל ברירת מחדל

`adminAuth.js` משתמש ב־`ADMIN_INITIAL_PASSWORD` ובפועל ב־`prayread-admin` כגיבוי. אין להשאיר סיסמת ברירת מחדל בפריסה, ויש להתחיל בתהליך אתחול חד־פעמי או ליצור admin דרך deployment secret.

#### 5. SHA-256 אינו password KDF

אחסון `salt:password` ב־SHA-256 חד־פעמי חלש מדי לאחסון סיסמאות. יש להשתמש ב־PBKDF2, Argon2id או scrypt עם עלות עבודה מתאימה.

#### 6. Admin token ב־`localStorage`

חשיפה ל־XSS מאפשרת גניבת token. עדיפות ל־cookie `HttpOnly`, `Secure`, `SameSite`, או לפחות להגביל CSP ולא להשתמש ב־dangerouslySetInnerHTML`.

#### 7. `AuthContext` עלול לסמן משתמש כמחובר גם ללא משתמש

ב־`checkAuth` מוגדר `setIsAuthenticated(true)` לאחר כל קריאת `me()` שאינה זורקת שגיאה. אם `me()` מחזיר `null`, המצב עלול להיות שגוי. עדיף:

```js
setUser(currentUser || null);
setIsAuthenticated(Boolean(currentUser));
```

#### 8. ערכת נושא נטענת רק למשתמש מחובר

`SiteSettings` מוגדר כ־read עבור כל המשתמשים, אך `ThemeProvider` טוען אותו רק כש־`isAuthenticated` הוא true. אם ערכת הצבעים אמורה להיות ציבורית, יש לטעון אותה תמיד.

#### 9. חישוב `bookNumber` פגום ב־Verse of the Day

הקוד מחלץ את המספר הראשון שנמצא ב־reference. עבור `"Psalm 23:1"` יתקבל `23` במקום מספר הספר `19`; עבור `"1 John 3:1"` יתקבל `1`. יש להשתמש ב־`parseReference` או במפת הפסוקים הקנונית.

#### 10. עיוותים בהתאמת פסוקים

`matchesPassage` ו־`PassageTabs` מבצעים התאמה מבוססת טקסט ומספרים. שיטות כאלה עלולות:

- להתאים ספר שונה עם שם דומה.
- לפרש מספר פרק כמספר פסוק.
- להתנהג באופן שונה עם `Psalm`/`Psalms`, `Song of Songs` וכדומה.

הפתרון האמין הוא parsing מובנה של reference והשוואה ל־`book_number`.

#### 11. נתוני תמונות עשויים להיות data URI טקסטואליים

קבצי `public/assets/*.png` מוצגים במקור כ־`data:image/png;base64,...`. אם ה־build אינו מפענח את ה־data URI לקובץ binary, התמונות לא יטענו. יש לוודא ש־static server מגיש PNG תקין.

#### 12. נתיבי App Files תלויים בפלטפורמה

`LOGO_URL`, `APPLE_ICON_URL` וה־manifest מפנים ל־`/api/appfiles/public/app_73e21b4aa5684452/assets/...`. ב־deployment עצמאי או local environment ללא אותו endpoint הלוגו והאייקונים לא יעבדו.

#### 13. מפתחי Query לא תמיד מבודדים לפי משתמש

דוגמאות:

```js
["prayers"]
["devotionals"]
["insights"]
```

אם query ציבורי רץ לפני התחברות, TanStack Query עלול להחזיר את אותו cache גם לאחר כניסה. מומלץ לכלול את `isAuthenticated` או את רמת ההרשאה במפתח.

#### 14. חלונית Modal אינה נעולה פוקוס

`Modal` נועל גלילה ומאפשר Escape, אך אין לו focus trap, שחזור פוקוס לפתיחה, `aria-labelledby` מלא או ניהול Tab. חשוב במיוחד עם טפסים ארוכים.

#### 15. מגבלות `safeText`

`safeText` אינו sanitizer של HTML. הוא רק מונע הצגת אובייקטים כמחרוזות. React ממשיך להציג טקסט כטקסט, אך אין להשתמש בו כתחליף ל־sanitization של HTML עבור נתונים עשירים.

#### 16. עדכון likes עלול לאבד שינויים

אם מספר ה־likes נשמר כערך ב־DB, שתי לחיצות מקבילות עלולות לדרוס זו את זו. עדיף להשתמש בפעולת increment אטומית או ב־versioning.

#### 17. שינוי Schema של תוכן seed

ה־seed content משמש כ־fallback אך אינו תמיד באותו מבנה כמו ה־DB. למשל רשומות seed מקבלות `id` זמני כגון `seed-0`. פעולות update/delete לא צריכות להפנות אליהן כאילו הן רשומות DB אמיתיות.

#### 18. פעולות אינטראקטיביות בתוך `window.location.search`

חלק מהעמודים קוראים `window.location.search` בזמן render במקום `useSearchParams`. שינוי query בלי reload עלול לא לעדכן את המצב. במיוחד כדאי לבדוק את:

- Devotionals
- DiscussionGroups
- Journal
- Login/ResetPassword
- VerseSongSeries

#### 19. Service Worker דורש bump מפורש

כל שינוי במעטפת או באסטרטגיית ה־cache צריך לשנות את:

```js
const SHELL_CACHE = "prayread-shell-v2";
const RUNTIME_CACHE = "prayread-runtime-v2";
```

אחרת דפדפנים עשויים להמשיך להגיש גרסה ישנה.

#### 20. `cache.addAll` דורש שכל הנתיבים יחזירו HTML

אם `/BibleReader` וכדומה לא מוגשים עם `index.html` בעת ההתקנה, `cache.addAll` עלול להיכשל כולו. יש לוודא ש־SPA fallback מוגדר בשרת.

#### 21. קובצי ה־URL snapshot אינם תלויות

התיקיות `__url_fetch` אינן צריכות להיכלל ב־build final. הן כוללות תוכן חיצוני, snapshots וניתוחי עיצוב, ועלולות להגדיל את חבילת הפרודקט או להכניס תוכן לא רצוי.

#### 22. דיוק מצב ההתקנה

`appinstalled` מוסיף listener בתוך `useEffect`, אך אין cleanup לאותו listener מסוים. עדיף לשמור את הפונקציה במשתנה ולהסיר אותה בעת cleanup.

#### 23. זמן השהיית Logout

`Logout` משתמש בטיימר של 900ms. אם יוצא מהר מדי ייתכן שהמסך לא יוצג, ואם רכיב `logout` משתנה בזמן render עלול להתאפס הטיימר. עדיף לבצע יציאה מיד ולהציג את המסך לפני הניתוב, או להשתמש ב־`useCallback` יציב.

### 7.5 הנחיות להוספת פיצ’ר

#### להוספת עמוד

1. ליצור `pages/PageName.jsx`.
2. להוסיף route ו־`createPageUrl("PageName")`.
3. להוסיף קישור ל־Header, Footer או Home.
4. להוסיף loading/error/empty states.
5. להשתמש ב־TanStack Query ובמפתח query הכולל את כל פרמטרי השונות.
6. להוסיף route ל־Service Worker אם הוא אמור לעבוד offline.
7. לבדוק נגישות, מובייל והתנהגות במשתמש לא מחובר.

#### להוספת Entity

1. ליצור `entities/EntityName.json`.
2. להגדיר שדות, `required`, labels ו־הרשאות.
3. להוסיף את ה־Entity ל־`MANAGED` ב־`adminContent.js` אם הוא ניתן לניהול.
4. להוסיף field mapping ל־`AdminDashboard`.
5. להוסיף collection mapping ל־`lib/contentApi.js` ול־`functions/content.js`.
6. להוסיף seed רק אם הוא נדרש כ־fallback, ולשמור על אותו schema.
7. להוסיף אינדוקסים או server-side owner filtering.

#### להוספת סוג offline

1. להוסיף את שם ה־store ל־`STORES`.
2. ליצור את ה־store ב־`onupgradeneeded`.
3. להעלות את `DB_VERSION`.
4. להוסיף migration מ־versions קודמים.
5. להוסיף section ב־`Offline.jsx`.
6. לבדוק מדיניות cache ו־`cache.addAll`.

#### להוספת פעולה לנגן

יש לשמור על `PlayerProvider` כמקור המצב היחיד. רכיבי עמודים צריכים רק לבנות queue ולקרוא ל־`playQueue`, `toggle`, `next` וכדומה; אין ליצור `Audio` נפרד בתוך עמוד.

---

## סיכום למפתח חדש

הנקודות המרכזיות להבנה מהירה של המערכת הן:

1. `Layout.jsx` הוא מעטפת ה־Providers וה־global UI.
2. `lib/AuthContext.jsx` הוא מקור מצב המשתמש.
3. `lib/contentApi.js` הוא שכבת הגישה לתוכן הציבורי.
4. `lib/offlineDb.js` הוא שכבת ה־offline.
5. `lib/player.jsx` הוא מנהל האודיו הגלובלי.
6. `lib/studyAnnotations.js` הוא מנגנון ה־dual persistence של הערות.
7. `entities/*.json` הם מקור ה־data model.
8. `functions/adminAuth.js` ו־`adminContent.js` הם גבול האבטחה של ה־CMS.
9. `Chapter.jsx` הוא לב האינטראקציה של קריאה, סימון, תפילה והתקדמות.
10. `BibleReader.jsx` ו־`ChapterSelector.jsx` הם מעטפת ה־Bible Reader החדשה.
11. `seedContent.js` הוא fallback מכריע לכל אזור ציבורי שעלול להיראות ריק.
12. `public/sw.js` ו־`manifest.json` הם תשתית ה־PWA, ודורשים עדכון יחד עם שינויים במעטפת.
# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
<think>
We need produce Hebrew comprehensive. Huge codebase truncated many files. Need infer URLs createPageUrl likely /PageName. Need document every page listed, components, entities all listed. Also functions/lib perhaps section 4 asks each file created, impossible all embedded; organize supplied files and explicitly note truncations. Need avoid claiming exact unseen details. We can state URLs likely /PageName based createPageUrl and links. There are ~40 pages. Need high detail but token budget. Need include entities 24. Components 27. Technical notes and flows.

Need identify pages list:
About, AdminDashboard, Admin, BibleNotes, BibleReader, Chapter, Community, CommunityLiveTeaching, CommunityRevelations, Contact, Dashboard, Devotionals, DiscussionGroups, ForgotPassword, HistoricalInsights, Home, InstallPrompt, Journal, Login, Logout, Offline, Plan, PrayerLibrary, Privacy, QA, ResetPassword, Signup, Terms, TheologicalInsights, VerseOfDay, VerseSongSeries, VerseSongs. Also maybe PrayerLibrary etc. URL conventions exact likely /About. createPageUrl maybe prefixes app base? The observed SW shell "/BibleReader". likely URLs `/BibleReader`. Explain query params.

Components:
common EmptyState Modal PageHeader ShareRow Spinner
community CommentThread RevelationCard RevelationForm ThreadMessages
dashboard ActivityFeed
home StatCard
insight InsightsBoard
journal JournalCard JournalForm
layout AppFooter AppHeader GlobalPlayer PwaHead
plan PlanRow
read BookGrid BookSidebar ChapterGrid ChapterSelector FloatingVerse PassagePrayer PassageTabs VerseActionBar VerseList.
32.

Entities list:
ActivityLog AdminAccount BibleVerse Commentary ContactMessage Devotional DevotionalProgress DiscussionGroup DiscussionThread Insight JournalEntry LiveSession Prayer PrayerSaved QAEntry ReadingActivity Reading ReadingPlan Revelation SiteSettings StudyMark VerseOfDay VerseSongEpisode VerseSongSeries =23. Maybe public content. Need describe.

Need discuss data auth and security issues perhaps technical notes. Admin password SHA256 salted, signed HMAC server secret, default pwd hazard. Entity ACL broad authenticated and client filtering owner. Offline mismatch stores etc. service worker routing and stale caches. React query cache keys missing email e.g prayerSaved includes, some global. Potential bugs imported unused, route Read missing maybe trash old. Page Query direct list may fetch all and client filter. `app-params` accesses localStorage at module import SSR issue. `AuthContext` isAuthenticated true if me returns null maybe. Admin session localStorage token.

Need be explicit "based on supplied snippets; truncated". User asks documentation, likely deliver as artifact. We can use markdown.

URLs:
Home `/Home` or `/`? SW "/" and links createPageUrl("Home"). Manifest start "/". likely root may route Home. Document logical `/Home` and `/` entry.
Admin `/Admin`, `/AdminDashboard`.
PrayerLibrary.
CommunityLiveTeaching.
VerseSongSeries likely `/VerseSongSeries?series=...`
Chapter query.
BibleReader.
HistoricalInsights etc.

Need navigation table detailed maybe 50 rows. Include all main flows.

Need section 4 "for each file created" includes libs/functions, entities, pages components. We can cover all visible. Assets/trash mention nonruntime/reference. `__generated/tailwind.css`, public assets. Also api/fse2Client not supplied, utils not supplied. Mention dependencies not documented due omitted. But should not overfocus caveat.

Let's craft in Hebrew, professional. Detailed but concise enough. Maybe ~10k tokens. We have output max likely enough. Need not literally all code.

Start assumptions and architecture.

Entity fields with semantic.

Components list table.

Navigation table.

Flows.

Technical.

Also data collection matrix.

Let's formulate.
</think>
# תיעוד מערכת Pray-Read Bible

## 0. תקציר מנהלים

Pray-Read Bible היא אפליקציית React לקריאת התנ"ך, תפילה, לימוד, השמה וקהילה. המערכת מיועדת לקוראים שמבקשים חוויית קריאה דתית עשירה יותר מאפליקציית "פסוק היום", ולמקדמים ולקהילות המעוניינות לנהל תוכן ולעקוב אחרי קהילת קוראים.

האפליקציה משלבת:

- קריאת פרקים בעברית ובלוגנדה.
- סימון פסוקים, הערות, סימניות והפניות צלב.
- תוכן עבודה יומי, תפילות, מזמי שירה, עיונים תיאולוגיים והיסטוריים, ושאלות ותשובות.
- תוכן קהילתי: גילויים, הודעות בקבוצות דיון ומפגשי הוראה חיים.
- מעקב קריאה, יומן תפילה, קצב קריאה ומדדים אישיים.
- הפעלה במצב לא מקוון דרך IndexedDB ו-Service Worker.
- מנהל תוכן נפרד עם התחברות, טבלאות, עריכה ויומן פעילות.
- נגן אודיו גלובלי שממשיך לפעול בעת ניווט בין עמודים.

### עיקרון מרכזי

המערכת משתמשת בשלושה מקורות תוכן:

1. **נתוני מסד הנתונים**  -  תוכן חי הניהול על ידי מנהל.
2. **Seed content**  -  תוכן סטטי מובנה, המשמש כגיבוי כאשר אין רשומות במסד הנתונים.
3. **מקורות חיצוניים**  -  למשל Bible API ו-Wordplanet עבור טקסט התנ"ך.

ברוב המסכים מיושמת אסטרטגיית **"נתונים חיים קודמים, אך לעולם לא משאירים מסך ריק"**.

---

# 1. מהות המערכת

## 1.1 פונקציונליות מרכזית

### קריאת התנ"ך

המערכת מאפשרת לעבור בין 66 ספרי התנ"ך, לבחור פרק ולקרוא אותו בעברית או בלוגנדה. לאחר טעינת פרק המערכת מציגה:

- את מספר הפסוק ואת טקסט הפסוק.
- אפשרות לבחירת פסוק.
- סימון בארבע צבעים.
- הוספת סימנייה.
- כתיבת הערה.
- הפניות צלב.
- תפילות המתאימות לפסוק.
- פירושים, עיונים תיאולוגיים, עיונים היסטוריים ושאלות ותשובות.
- מעקב אחרי ביקור בפרק.
- שמירת התקדמות קריאה.
- תמיכה בהורדת פרקים לשימוש לא מקוון.

### תוכן דתי והסברתי

המערכת מציעה מספר סוגי תוכן:

- **Devotionals**  -  לימודים יומיים בעברית ובלוגנדה.
- **Prayer Library**  -  תפילות הניתנות לחיפוש, סינון ושמירה.
- **Insights**  -  עיונים תיאולוגיים והיסטוריים.
- **Q&A**  -  שאלות קוראים עם תשובות.
- **Verse of the Day**  -  פסוק יומי.
- **Verse-Songs**  -  סדרות שירי תנ"ך עם נגן אודיו.
- **Live Teaching**  -  מפגשי הוראה חיים.
- **Discussion Groups**  -  קבוצות לימוד משותפות.

### קהילה

המערכת מאפשרת למשתמשים:

- לפרסם גילוי או עדות אישית.
- לעשות לייק.
- לכתוב תגובות.
- להצטרף לקבוצות דיון.
- לשלוח הודעות בקבוצה.
- לצפות במפגשי לימוד חיים.

### התחברות והתאמה אישית

למשתמש מחובר נשמרים:

- פעילות קריאה.
- התקדמות קריאה.
- סימונים, סימניות והערות.
- יומן תפילה.
- התקדמות לימודים יומיים.
- תפילות שנשמרו.
- הצטרפות לקבוצות דיון.
- נתוני קהילה והעדפות מקומיות מסוימות.

### PWA ועבודה לא מקוונת

האפליקציה ניתנת להתקנה כ-PWA ומשתמשת ב:

- `manifest.json` להגדרת שם, צבעים, אייקונים ותצוגת standalone.
- `sw.js` לשמירת app shell ותשאולי רשת במצב offline.
- IndexedDB לשמירת פרקים, פסוקים ותוכן נבחר.
- `beforeinstallprompt` להצגת בקשת התקנה בדפדפנים תומכים.

## 1.2 קהל היעד

- קוראים אישיים המעוניינים לקרוא בקצב שלהם.
- משפחות, קבוצות קהילה וכנסיות המשתמשות בתוכן לימוד.
- מנהלי תוכן המעלים מדיונים, תפילות, שירים ועיונים.
- קוראים המעוניינים להמשיך קריאה בין מכשירים.
- משתמשים הזקוקים לתפקוד מוגבל ברשת.

## 1.3 ערך העסקי

הערך המרכזי של המערכת הוא שילוב:

1. **קריאה מודעת**  -  פרק שלם במקום פסוקים מבודדים.
2. **חיבור לתפילה**  -  הפסוק מוביל להערה, תפילה, סימון והערה.
3. **תוכן קהילתי**  -  התוכן אינו רק קריאה של יחיד.
4. **נגישות ללא חיבור**  -  הפרקים והמדריכים הנבחרים נשמרים מקומית.
5. **שיתוף קל**  -  פסוקים, מחשבות ועיונים ניתנים לשיתוף לרשתות חברתיות.

---

# 2. עמודים ותפקידיהם

## 2.1 כללי ניתוב

הניתוב מבוסס על `createPageUrl(pageName)`. בהתאם למבנה המסופק, כתובות היעד הן בצורה:

```text
/{PageName}
```

הנתיב הראשי `/` מפנה או מציג את דף הבית.

פרמטרים שימושיים:

| פרמטר | דף | משמעות |
|---|---|---|
| `book` | Chapter | מספר הספר, למשל `43` עבור יוחנן |
| `chapter` | Chapter, BibleNotes | מספר הפרק |
| `verse` | Chapter, BibleNotes | מספר הפסוק לפתיחה ממוקדת |
| `devotional` | Devotionals | קוד לימוד יומי לפתיחה |
| `series` | VerseSongSeries | שם סדרת Verse-Songs |
| `group` | DiscussionGroups | שם קבוצת דיון לפתיחה |
| `new=1` | Journal | פתיחת טופס רשומת יומן חדשה |
| `book`, `chapter` | Journal | מילוי מקדים של רשומה הקשורה לפרק |
| `kind` | Insights ישן/ארכיוני | סוג עיון: `theological` או `historical` |
| `token`, `access_token` | ResetPassword | טוקן איפוס סיסמה |
| `next` | Login | נתיב חזרה לאחר התחברות |

---

## 2.2 דפי תוכן ציבורי

### `pages/Home.jsx`  -  דף הבית

**כתובת:** `/Home` או `/`

**תפקיד:** חלון ראשוני למשתמש ולמבקר חדש, המציג את עיקרי המערכת וכניסות לפעילויות מרכזיות.

**פעולות עיקריות:**

- מעבר ל-Bible Reader.
- מעבר ל-Devotionals.
- מעבר ל-Prayer Library.
- מעבר ל-Verse-Songs.
- מעבר ל-Q&A.
- מעבר ל-Community.
- צפייה בפסוק היום.
- צפייה בתוכן קהילתי אחרון.
- הצגת בקשת התקנת האפליקציה.
- גישה לתפילות, הוראות, מדריכים ושאר הניווט.
- קישורי שיתוף לתוכן.

**הערה לדיבוג:** דף הבית מייבא `Home` גם מתוך `Dashboard`; יש לוודא שלא נוצרת תלות מעגלית או עומס כפול בעת מעבר לדשבורד.

---

### `pages/About.jsx`  -  אודות

**כתובת:** `/About`

**תפקיד:** הסבר על הזהות, המטרה והערכים של Pray-Read.

**פעולות:**

- חזרה לדף הבית.
- קריאה על מטרות הפרויקט.
- הצגת יכולות מרכזיות.
- הצגת מספרים או ערכים על הפרויקט.
- קישורים לשאר המסעות באפליקציה.

---

### `pages/BibleReader.jsx`  -  מסך התנ"ך

**כתובת:** `/BibleReader`

**תפקיד:** נקודת הכניסה לקריאת כל ספרי התנ"ך ובחירת פרק.

**רכיבים:**

- `BookGrid`  -  רשת הספרים.
- `ChapterSelector`  -  מסך בחירת פרק.
- `offline`  -  בדיקת פרקים שכבר הורדו.

**פעולות:**

- חיפוש ספר בשם אנגלי, לוגנדה או בקיצור.
- מעבר בין ברית קדומה וברית חדשה.
- גלילה אוטומטית למקום הנבחר.
- בחירת פרק.
- המעבר לכתובת:
  ```text
  /Chapter?book={number}&chapter={number}
  ```
- סימון ספר שכבר זמין במצב offline.
- טעינת נתוני הזמינות מ-IndexedDB.

**הערה לדיבוג:** זמינות offline נקבעת רק כאשר כל הפרקים של הספר קיימים במאגר, כלומר אם חסר פרק אחד הספר לא יסומן כזמין במלואו.

---

### `pages/Chapter.jsx`  -  קריאת פרק

**כתובת:** `/Chapter?book={number}&chapter={number}&verse={number}`

**תפקיד:** מסך מרכזי לקריאת פרק, עבודה אישית ועבודה עם תוכן נלווה.

**פעולות:**

- טעינת פרק בעברית או לוגנדה.
- מעבר לפרק הקודם או הבא.
- בחירת פסוק.
- סימון פסוק בצבע.
- הוספת סימנייה.
- הוספת הערה.
- העתקת פסוק.
- שיתוף פסוק.
- פתיחת הפניות צלב בחלון צף.
- מעבר למזכר המקום הנבחר.
- הצגת תפילות המתאימות לפרק/פסוק.
- הצגת פירוש ועיונים לפסוק.
- מעקב אחרי פעולת קריאה.
- שמירת התקדמות וסיכום לימוד.
- הוספת רשומת יומן הקשורה לפרק.
- עבודה במצב offline כאשר הפרק כבר נשמר.

**מקורות נתונים:**

- `fetchChapter` מ-`lib/bibleApi.js`.
- גיבוי מ-IndexedDB.
- `Reading`, `StudyMark`, `ReadingActivity`.
- `Commentary`, `Insight`, `QAEntry`, `Prayer`.
- `CROSS_REFERENCES` מקומי.

---

### `pages/Devotionals.jsx`  -  לימודים יומיים

**כתובת:** `/Devotionals`

**תפקיד:** הצגת רשימת לימודים יומיים וקריאה מלאה של לימוד.

**פעולות:**

- חיפוש לימודים.
- סינון או מיון לפי תאריך/סדר.
- פתיחת לימוד במודאל.
- הצגת גרסה אנגלית או לוגנדה.
- סימון לימוד כ"הושלם".
- שמירת התקדמות למשתמש מחובר.
- מעקב אחרי פתיחת לימוד.
- שיתוף הלימוד.
- מעבר לפרק המקושר.

**מקור תוכן:** `Devotional` entity, ובגיבוי `DEVOTIONALS` מ-`seedContent.js`.

---

### `pages/PrayerLibrary.jsx`  -  ספריית תפילות

**כתובת:** `/PrayerLibrary`

**תפקיד:** מאפשרת חיפוש, סינון, קריאה, שמירה ושיתוף תפילות.

**פעולות:**

- חיפוש תפילה.
- סינון לפי קטגוריה.
- החלפת שפה אנגלית/לוגנדה.
- פתיחת תפילה.
- שמירה למועדפים למשתמש מחובר.
- הסרת תפילה מהמועדפים.
- שיתוף תפילה.
- מעקב אחרי פתיחת תפילה.

**מקור תוכן:** `Prayer` entity ובגיבוי `PRAYERS`.

---

### `pages/VerseSongs.jsx`  -  רשימת סדרות Verse-Songs

**כתובת:** `/VerseSongs`

**תפקיד:** הצגת כל סדרות השירים והפעלתן בנגן הגלובלי.

**פעולות:**

- הצגת סדרות מהמסד ומה-seed.
- מעבר לסדרה מפורטת.
- השמעת סדרה מהאוטומטי.
- השמעת פרק מסוים בתוך הסדרה.
- הצגת שגיאת טעינת אודיו.
- בחירת סדרה לפי תוכן.

**מקור תוכן:**

- `VerseSongSeries`.
- `VerseSongEpisode`.

---

### `pages/VerseSongSeries.jsx`  -  סדרת Verse-Song מפורטת

**כתובת:** `/VerseSongSeries?series={name}`

**תפקיד:** הצגת פרקי סדרה והפעלתה.

**פעולות:**

- טעינת הסדרה לפי פרמטר `series`.
- השמעת כל הפרקים כתור.
- השמעת פרק מבודד.
- הצגת משך, כותרת ומזכירת פסוק.
- חזרה לרשימת הסדרות.

---

### `pages/VerseOfDay.jsx`  -  פסוק היום

**כתובת:** `/VerseOfDay`

**תפקיד:** הצגת פסוק יומי וקישור לפרק המקור.

**פעולות:**

- קריאת פסוק לפי התאריך הנוכחי.
- שימוש בפסוק ראשון כגיבוי.
- שיתוף הפסוק.
- מעבר לפרק המקור.

**הערה לדיבוג:** חיפוש מספר הספר מבוצע באמצעות regex על ההפניה. הוא עלול להחזיר מספר שגוי אם ההפניה כוללת מספרים נוספים לפני מספר הפרק.

---

### `pages/TheologicalInsights.jsx`  -  עיונים תיאולוגיים

**כתובת:** `/TheologicalInsights`

**תפקיד:** מעטפת דקה סביב `InsightsBoard` עם `kind="theological"`.

**פעולות:**

- חיפוש עיון.
- פתיחת עיון.
- שיתוף עיון.
- שמירת עיון למועדפים מקומיים.
- הצגת עיונים לפי מעבר.

---

### `pages/HistoricalInsights.jsx`  -  עיונים היסטוריים

**כתובת:** `/HistoricalInsights`

**תפקיד:** מעטפת דקה סביב `InsightsBoard` עם `kind="historical"`.

**פעולות:** זהות לעיונים התיאולוגיים, אך עם סינון היסטורי.

---

### `pages/QA.jsx`  -  שאלות ותשובות

**כתובת:** `/QA`

**תפקיד:** חיפוש תשובות ושליחת שאלות חדשות.

**פעולות:**

- חיפוש לפי שאלה, תשובה או הפניה.
- סינון לפי קטגוריה.
- פתיחת תשובה.
- שליחת שאלה כמשתמש מחובר.
- הצגת הצלחה או שגיאה.
- רענון הרשימה לאחר שליחה.

**מקור נתונים:** `QAEntry`; בגיבוי `QA_ENTRIES`.

---

### `pages/Community.jsx`  -  מרכז הקהילה

**כתובת:** `/Community`

**תפקיד:** דליט של שלושה אזורי קהילה:

- Revelations.
- Live Teaching.
- Discussion Groups.

**פעולות:**

- מעבר לכל אזור קהילתי.
- הצגת פעילות אחרונה.
- הצגת קבוצות דיון.
- הצגת מפגשי לימוד חיים.
- הצגת גילויים אחרונים.

---

### `pages/CommunityRevelations.jsx`  -  גילויים ועדויות

**כתובת:** `/CommunityRevelations`

**תפקיד:** פיד גילויים קהילתיים עם לייקים ותגובות.

**פעולות:**

- צפייה בגילויים.
- פרסום גילוי כמשתמש מחובר.
- לייק לגילוי.
- פתיחת וסגירת שרשור תגובות.
- שליחת תגובה.
- הצגת תגובות לפי `parent_id`.

**מודל נתונים:** גילויים ותגובות נשמרים באותה entity, `Revelation`. תגובה מזוהה באמצעות `parent_id`.

---

### `pages/CommunityLiveTeaching.jsx`  -  לימוד חי

**כתובת:** `/CommunityLiveTeaching`

**תפקיד:** הצגת מפגשי הוראה חיים ופתיחת הקישור היוצא.

**פעולות:**

- צפייה במפגשים עתידיים.
- מיון/הצגת תאריך ומארח.
- פתיחת קישור ההשתתפות.
- הצגת מצב ריק או טעינה.

**מקור נתונים:** `LiveSession` ובגיבוי `LIVE_SESSIONS`.

---

### `pages/DiscussionGroups.jsx`  -  קבוצות דיון

**כתובת:** `/DiscussionGroups`

**תפקיד:** הצגת קבוצות, הצטרפות מקומית וניהול שיחה בקבוצה.

**פעולות:**

- רשימת קבוצות.
- בחירת קבוצה.
- הצטרפות או עזיבה מקומית.
- צפייה בהודעות.
- שליחת הודעה כמשתמש מחובר.
- הצגת התקדמות ושגיאות.

**מקור נתונים:**

- `DiscussionGroup` עבור רשימת הקבוצות.
- `DiscussionThread` עבור הודעות הקבוצה.

**הערה לדיבוג:** ההצטרפות נשמרת ב-`localStorage`, ולכן אינה מסונכרנת בין מכשירים.

---

## 2.3 דפי קריאה אישית

### `pages/Dashboard.jsx`  -  לוח מחוונים

**כתובת:** `/Dashboard`

**תפקיד:** מרכז המידע האישי של הקורא.

**מדדים אפשריים:**

- ימי קריאה רצופים.
- פרקים שנקראו.
- סימניות.
- הערות.
- לימודים שהושלמו.
- תפילות שנשמרו.
- נתוני הורדה offline.
- פיד פעילות אחרונות.

**פעולות:**

- מעבר למסכי קריאה וכתיבה.
- צפייה ב-`ActivityFeed`.
- פתיחת ספרים או פרקים קודמים.
- ניקוי או ניהול מאגר offline.

**הערה לדיבוג:** חלק מההתקדמות נשמר מקומית וחלקה מהשרת. יש להבחין בין `doneDevotionals` מ-`localStorage` לבין `DevotionalProgress`.

---

### `pages/BibleNotes.jsx`  -  הערות וסימונים

**כתובת:** `/BibleNotes`

**תפקיד:** הצגת הסימונים, הסימניות וההערות של המשתמש.

**פעולות:**

- הצגת סימונים.
- הצגת סימניות.
- הצגת הערות.
- מעבר לפסוק המקור.
- הצגת מסך התחברות למשתמש לא מחובר.

**מקור נתונים:** `StudyMark` ו-`Reading`.

---

### `pages/Journal.jsx`  -  יומן תפילה

**כתובת:** `/Journal`

**תפקיד:** יצירה, עריכה, סינון ומחיקה של רשומות יומן אישיות.

**פעולות:**

- יצירת רשומה.
- עריכת רשומה.
- מחיקת רשומה לאחר אישור.
- סינון לפי קטגוריה:
  - praise
  - petition
  - confession
  - thanksgiving
  - reflection
- מילוי מקדים מפרסוק בדף הפרק.
- קישור רשומה לספר ופרק.
- חישוב ימי קריאה והתקדמות.

**מקור נתונים:** `JournalEntry`.

---

### `pages/Plan.jsx`  -  תוכנית קריאה

**כתובת:** `/Plan`

**תפקיד:** הצגת מסע קריאה בן 30 יום ומעקב אחרי ימיו שהושלמו.

**פעולות:**

- הצגת ימי התוכנית.
- סימון יום שהושלם.
- סימון היום הנוכחי.
- חישוב אחוז התקדמות.
- מעבר לפרק המתוכנן.

**מקור נתונים:**

- `ReadingPlan`.
- בגיבוי: `PLAN_DAYS`.
- התקדמות: `Reading` עם `plan_day` ו-`status`.

---

### `pages/Offline.jsx`  -  מרכז לא מקוון

**כתובת:** `/Offline`

**תפקיד:** הורדת תוכן לשימוש ללא חיבור, הצגת נפח האחסון וניהול המאגר.

**פעולות:**

- הורדת פרקים.
- הורדת פסוקים ותוכן נבחר.
- בחירת ספרים לפי תוכנית או רשימה מלאה.
- בחירת שפה.
- בחירת סוגי תוכן להורדה.
- הצגת התקדמות הורדה.
- הצגת מספר רשומות לכל store.
- הצגת שימוש ומכסת אחסון.
- מחיקת המאגר הלא מקוון.

**מאגרים:** `chapters`, `verses`, `devotionals`, `commentary`, `prayers`, `qa`, `verseOfDay` ועוד.

---

## 2.4 דפי חשבון ואימות

### `pages/Login.jsx`  -  התחברות

**כתובת:** `/Login`

**פעולות:**

- הזנת דוא"ל וסיסמה.
- התחברות.
- מעבר לדשבורד.
- מעבר לשכחתי סיסמה.
- מעבר ליצירת חשבון.
- הצגת שגיאת אימות.

---

### `pages/Signup.jsx`  -  יצירת חשבון

**כתובת:** `/Signup`

**פעולות:**

- הזנת שם, דוא"ל, סיסמה ואימות סיסמה.
- חישוב עוצמת סיסמה.
- אישור תנאי שימוש.
- יצירת חשבון.
- הצגת מסך אימות דוא"ל כאשר נדרשת אימות.
- מעבר לדשבורד בהצלחה.

---

### `pages/ForgotPassword.jsx`  -  שכחתי סיסמה

**כתובת:** `/ForgotPassword`

**פעולות:**

- הזנת כתובת דוא"ל.
- שליחת בקשת איפוס.
- הצגת הודעת תשובה זהירה שלא חושפת אם כתובת קיימת.
- הצגת שגיאה.

---

### `pages/ResetPassword.jsx`  -  איפוס סיסמה

**כתובת:** `/ResetPassword?token={token}`

**פעולות:**

- קריאת טוקן מה-URL.
- הגדרת סיסמה חדשה.
- אימות הסיסמה.
- איפוס דרך `fse2.auth.resetPassword`.
- הצגת הצלחה או שגיאה.

---

### `pages/Logout.jsx`  -  התנתקות

**כתובת:** `/Logout`

**תפקיד:** מסך מעבר קצר שמבצע התנתקות וחוזר לדף הבית.

**הערה לדיבוג:** הניתוב מתבצע לאחר כ־900 מילישניות לצורך הצגת מחוון טעינה. אין לבצע עליו ניווט ידני לפני סיום `logout`.

---

## 2.5 דפי ניהול ומערכת

### `pages/Admin.jsx`  -  כניסת מנהל

**כתובת:** `/Admin`

**תפקיד:** כניסה נפרדת למנהל תוכן.

**פעולות:**

- הזנת דוא"ל וסיסמת מנהל.
- קריאה ל-`adminAuth`.
- שמירת טוקן ב-`localStorage`.
- בדיקת תוקף הפגישה בטעינה.
- מעבר לדשבורד הניהול.

**הבדל מהתחברות משתמשים:** המנהל אינו משתמש רגיל ב-`AuthContext`; לו מנגנון session נפרד.

---

### `pages/AdminDashboard.jsx`  -  לוח ניהול תוכן

**כתובת:** `/AdminDashboard`

**תפקיד:** ניהול מלא של התוכן והגדרות האתר.

**מקטעים:**

1. Overview.
2. Books & Chapters.
3. Devotionals.
4. Prayer Library.
5. Verse-Songs.
6. Q&A.
7. Insights.
8. Users.
9. Messages.
10. Text Colours.
11. Activity Log.
12. Settings.

**פעולות:**

- רשימת רשומות לפי entity.
- חיפוש וסינון.
- יצירת רשומה.
- עריכת רשומה.
- מחיקת רשומה.
- העלאת מדיה.
- ניהול משתמשים.
- קריאת ומענה להודעות קשר.
- עריכת צבעי מותג.
- צפייה ביומן פעילות.
- ניהול הגדרות אתר.
- יציאה מהניהול.

**הערה לדיבוג:** הניהול משתמש ב-`callAdmin`, שמעביר את הטוקן בכל קריאה. כל פעולת רשומה צריכה להתאים לרשימת `MANAGED` ב-`functions/adminContent.js`.

---

### `pages/Contact.jsx`  -  יצירת קשר

**כתובת:** `/Contact`

**פעולות:**

- הזנת שם, דוא"ל, נושא והודעה.
- ולידציה מקומית.
- שליחת הודעה.
- הצגת הצלחה.
- הצגת שגיאה.

**מקור נתונים:** `ContactMessage`.

---

### `pages/InstallPrompt.jsx`  -  התקנת האפליקציה

**כתובת:** `/InstallPrompt`

**תפקיד:** הסבר והפעלת התקנת ה-PWA.

**פעולות:**

- זיהוי מערכת הפעלה.
- זיהוי מצב standalone.
- קליטת `beforeinstallprompt`.
- הפעלת ההתקנה.
- הצגת מספר התקנה לפי פלטפורמה.
- טיפול באירוע `appinstalled`.

---

### `pages/Privacy.jsx`  -  מדיניות פרטיות

**כתובת:** `/Privacy`

**תפקיד:** הסבר למשתמש על נתונים הנשמרים בשרת ובמכשיר.

**נושאים מרכזיים:**

- נתוני חשבון.
- היסטוריית קריאה.
- הערות וסימונים.
- יומן תפילה.
- נתוני offline.
- נתונים מקומיים.
- אי-מכירת מכירה ושיתוף עם מפרסמים.

---

### `pages/Terms.jsx`  -  תנאי שימוש

**כתובת:** `/Terms`

**תפקיד:** הגדרת זכויות שימוש בתוכן והבהרות לגבי מקורות התנ"ך והתוכן.

---

## 2.6 דפים ארכיוניים ב-`__trash`

הקבצים ב-`__trash` אינם חלק מהמסלול הפעיל, אלא אם מפת היישום מייבאתם במפורש:

- `pages/Read.jsx`  -  קורא פרק ישן עם בחירת ספר ושמירת השתקפים.
- `pages/Insights.jsx`  -  לוח עיונים משולב ישן.
- `components/read/BookPicker.jsx`.
- `components/read/ReflectionPanel.jsx`.
- `components/home/TodayCard.jsx`.
- `components/home/WeekStrip.jsx`.
- `components/layout/Sidebar.jsx`.
- `components/layout/SignInBanner.jsx`.

אלה יכולים לשמש כחומר עיון בעת מיגרציה, אך אינם מסלול הייצור הנוכחי.

---

# 3. מפת ניווט לצורך DEBUG

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת תפילה | דף בית / תפליות | Bible Reader / תפילות | `/BibleReader`, `/PrayerLibrary` |
| פתיחת לימוד יומי | דף בית / Devotionals | לימוד יומי / כרטיס לימוד | `/Devotionals?devotional={code}` |
| פתיחת מסך פרק | Bible Reader | לחיצה על ספר ואז פרק | `/Chapter?book={n}&chapter={n}` |
| מעבר לפרק קודם | Chapter | חץ קודם | `/Chapter` עם פרמטרים מעודכנים |
| מעבר לפרק הבא | Chapter | חץ הבא | `/Chapter` עם פרמטרים מעודכנים |
| פתיחת פסוק מסומן | Bible Notes | כרטיס סימון/הערה | `/Chapter?book={n}&chapter={n}&verse={n}` |
| סימון פסוק | Chapter | לחיצה על פסוק | פתיחת `VerseActionBar` |
| הוספת הערה | Chapter | NotebookPenIcon | שדה הערה בתוך `VerseActionBar` |
| סימון צבע | Chapter | כפתור צבע | יצירת `StudyMark` מסוג `highlight` |
| הוספת סימנייה | Chapter | BookmarkIcon | יצירת `StudyMark` מסוג `bookmark` |
| העתקת פסוק | Chapter | CopyIcon | קליפבורד ומחוון “Copied” |
| שיתוף פסוק | Chapter / ShareRow | Share2Icon | חלונות רשת חברתיות או העתקת קישור |
| פתיחת הפניה צלב | Chapter | לחיצה על cross-reference | `FloatingVerse` |
| מעבר מהפניה צלב לפרק | FloatingVerse | Open in Bible Reader | `/Chapter?...` |
| הוספת תפילה לפסוק | Chapter | HeartHandshakeIcon | `PassagePrayer` |
| הצגת פירוש | Chapter | לשונית Commentary | `PassageTabs` |
| הצגת עיון תיאולוגי | Chapter | Theological insight | `PassageTabs` |
| הצגת עיון היסטורי | Chapter | Historical insight | `PassageTabs` |
| פתיחת שאלה עבור פסוק | Chapter | Q&A for this passage | `PassageTabs` |
| שמירת קריאת פרק | Chapter | פעולת סיום/שמירה | יצירה או עדכון `Reading` |
| יצירת רשומת יומן מפרק | Chapter | NotebookPenIcon | `/Journal?book={book}&chapter={chapter}&new=1` |
| פתיחת תוכנית הקריאה | Header / Footer | Reading plan | `/Plan` |
| מעבר ליום תוכנית | Plan | כרטיס יום | `/Chapter?book={n}&chapter={n}` |
| פתיחת פיד הפעילות | Dashboard | ActivityFeed | רשימת פעילות מקומית |
| פתיחת הערות | Header / Footer | My notes | `/BibleNotes` |
| יצירת הערה | Journal | New entry | טופס `JournalForm` |
| עריכת הערה | Journal | PencilIcon | טופס `JournalForm` עם `initial` |
| מחיקת הערה | Journal | Trash2Icon | חלון אישור ואחריה `JournalEntry.delete` |
| מעבר לפסוק היום | Header / Home | Verse of the day | `/VerseOfDay` |
| פתיחת סדרת שיר | VerseSongs | כרטיס סדרה | `/VerseSongSeries?series={name}` |
| השמעת סדרה | VerseSongSeries | PlayIcon | הפעלת queue ב-`PlayerProvider` |
| השמעת פרק מסוים | VerseSongSeries | PlayIcon ליד פרק | החלפת track בנגן הגלובלי |
| פתיחת סדרת השמעה | VerseSongs | Series name | `/VerseSongSeries?series={name}` |
| פתיחת Q&A | Header / Home | Q&A | `/QA` |
| שליחת שאלה | QA | טופס שאלה | יצירת `QAEntry` |
| פתיחת קהילה | Header / Home | Community | `/Community` |
| פתיחת גילויים | Community | Revelations | `/CommunityRevelations` |
| פרסום גילוי | CommunityRevelations | טופס Share what God showed you | יצירת `Revelation` |
| לייק לגילוי | CommunityRevelations | HeartIcon | עדכון `likes` |
| פתיחת תגובות | CommunityRevelations | MessageCircleIcon | `CommentThread` |
| שליחת תגובה | CommentThread | טקסט + SendIcon | יצירת `Revelation` עם `parent_id` |
| פתיחת לימוד חי | Community | Live teaching | `/CommunityLiveTeaching` |
| פתיחת קבוצת דיון | Community / Header | Discussion groups | `/DiscussionGroups` |
| פתיחת קבוצה | DiscussionGroups | כרטיס קבוצה | בחירת קבוצה והצגת הודעות |
| שליחת הודעה | ThreadMessages | טקסט + SendIcon | יצירת `DiscussionThread` |
| הצטרפות לקבוצה | DiscussionGroups | Join | הוספה ל-`joinedGroups` ב-localStorage |
| פתיחת מרכז offline | Header / Footer | Offline centre | `/Offline` |
| הורדת פרקים | Offline | DownloadIcon | כתיבה ל-IndexedDB |
| ניקוי offline | Offline | Trash2Icon | מחיקת stores |
| פתיחת דשבורד | Header / Login | Dashboard | `/Dashboard` |
| יצירת חשבון | Login | Create account | `/Signup` |
| איפוס סיסמה | Login | Forgot password | `/ForgotPassword` |
| איפוס סיסמה בפועל | ForgotPassword / Email | קישור איפוס | `/ResetPassword?token=...` |
| כניסת מנהל | נתיב יישום חלופי | מסך Admin | `/Admin` |
| פתיחת מערכת הניהול | Admin | כניסה מוצלחת | `/AdminDashboard` |
| ניהול תוכן | AdminDashboard | תפריט תוכן | טבלת entity רלוונטית |
| ניהול צבעים | AdminDashboard | Text Colours | עדכון `SiteSettings` |
| צפייה ביומן פעילות | AdminDashboard | Activity Log | `ActivityLog` |
| ניהול הודעות | AdminDashboard | Messages | `ContactMessage` |
| יציאה מהניהול | AdminDashboard | LogOutIcon | מחיקת טוקן וחזרה למסך כניסה |

---

# 4. מבנה הקבצים

## 4.1 קבצי דפים

| קובץ | תפקיד |
|---|---|
| `pages/About.jsx` | דף מותג ומטרות הפרויקט. |
| `pages/Admin.jsx` | כניסת מנהל תוכן. |
| `pages/AdminDashboard.jsx` | ממשק ניהול התוכן והגדרות המערכת. |
| `pages/BibleNotes.jsx` | תצוגת סימונים, סימניות והערות. |
| `pages/BibleReader.jsx` | בחירת ספר ופרק. |
| `pages/Chapter.jsx` | מסך קריאת פרק ופעולות אישיות. |
| `pages/Community.jsx` | מרכז אזורי הקהילה. |
| `pages/CommunityLiveTeaching.jsx` | אירועי לימוד חי. |
| `pages/CommunityRevelations.jsx` | פיד גילויים ותגובות. |
| `pages/Contact.jsx` | שליחת פנייה למנהל. |
| `pages/Dashboard.jsx` | לוח אישי ופעילות. |
| `pages/Devotionals.jsx` | ספריית לימודים יומיים. |
| `pages/DiscussionGroups.jsx` | קבוצות דיון והודעות. |
| `pages/ForgotPassword.jsx` | בקשת איפוס סיסמה. |
| `pages/HistoricalInsights.jsx` | עיונים היסטוריים. |
| `pages/Home.jsx` | דף בית וניווט מרכזי. |
| `pages/InstallPrompt.jsx` | התקנת PWA. |
| `pages/Journal.jsx` | ניהול יומן התפילה. |
| `pages/Login.jsx` | התחברות משתמש. |
| `pages/Logout.jsx` | התנתקות וניתוב לדף הבית. |
| `pages/Offline.jsx` | הורדות וניהול מאגר offline. |
| `pages/Plan.jsx` | תוכנית קריאה והתקדמות. |
| `pages/PrayerLibrary.jsx` | חיפוש ושמירת תפילות. |
| `pages/Privacy.jsx` | מדיניות פרטיות. |
| `pages/QA.jsx` | שאלות, תשובות ושליחת שאלה. |
| `pages/ResetPassword.jsx` | בחירת סיסמה חדשה. |
| `pages/Signup.jsx` | יצירת חשבון. |
| `pages/Terms.jsx` | תנאי שימוש. |
| `pages/TheologicalInsights.jsx` | עיונים תיאולוגיים. |
| `pages/VerseOfDay.jsx` | פסוק היום. |
| `pages/VerseSongSeries.jsx` | פרטי סדרת Verse-Songs. |
| `pages/VerseSongs.jsx` | רשימת סדרות Verse-Songs. |

## 4.2 קובצי רכיבים

### `components/common`

| קובץ | תפקיד |
|---|---|
| `EmptyState.jsx` | מצב ריק אחיד עם אייקון, כותרת, תיאור ופעולה. |
| `Modal.jsx` | מודאל גנרי; סגירה ב-Escape, מחיצה, נעילת גלילת body וכותרת נגישה. |
| `PageHeader.jsx` | כותרת אחידה לדפים, עם גרסת hero או גרסת section פשוטה. |
| `ShareRow.jsx` | שורת כפתורי שיתוף לפי `shareChannels`. |
| `Spinner.jsx` | מצב טעינה נגיש עם `role="status"` ו־`aria-live`. |

### `components/community`

| קובץ | תפקיד |
|---|---|
| `CommentThread.jsx` | תצוגת תגובות וטופס תגובה חדשה. |
| `RevelationCard.jsx` | כרטיס גילוי, לייק ומספר תגובות. |
| `RevelationForm.jsx` | טופס יצירת גילוי למשתמש מחובר, כולל מצב משתמש לא מחובר. |
| `ThreadMessages.jsx` | הודעות בקבוצת דיון וטופס שליחה. |

### `components/dashboard`

| קובץ | תפקיד |
|---|---|
| `ActivityFeed.jsx` | פיד פעילות קריאה אחרונה, עם מיפוי סוג פעילות לאייקון וצבע. |

### `components/home`

| קובץ | תפקיד |
|---|---|
| `StatCard.jsx` | כרטיס מדד עם ערך, תווית, רמז ואייקון. |

### `components/insight`

| קובץ | תפקיד |
|---|---|
| `InsightsBoard.jsx` | לוח עיונים משותף לעיונים תיאולוגיים והיסטוריים, עם חיפוש, מודאל ומועדפים מקומיים. |

### `components/journal`

| קובץ | תפקיד |
|---|---|
| `JournalCard.jsx` | כרטיס רשומת יומן עם פעולות עריכה ומחיקה. |
| `JournalForm.jsx` | טופס יצירה או עריכה של רשומת יומן. |

### `components/layout`

| קובץ | תפקיד |
|---|---|
| `AppHeader.jsx` | Header רספונסיבי, ניווט ראשי/משני, משתמש, התחברות ותפריט נייד. |
| `AppFooter.jsx` | קישורי אתר, מותג, תרומה וגיבוי fallback ללוגו. |
| `GlobalPlayer.jsx` | נגן אודיו גלובלי צמוד לתחתית המסך וגרסה מורחבת. |
| `PwaHead.jsx` | הוספת meta tags, manifest ורישום Service Worker. |

### `components/plan`

| קובץ | תפקיד |
|---|---|
| `PlanRow.jsx` | שורת יום בתוכנית הקריאה, עם סטטוס וקישור לפרק. |

### `components/read`

| קובץ | תפקיד |
|---|---|
| `BookGrid.jsx` | רשת ספרים עם חיפוש וניווט בין הבריתות. |
| `BookSidebar.jsx` | מדריך ספר: הקדמה, מבנה ורשימת פרקים. |
| `ChapterGrid.jsx` | רשת בחירת פרק. |
| `ChapterSelector.jsx` | מסך מלא לבחירת ספר, פרק ומדריך. |
| `FloatingVerse.jsx` | חלון צף להצגת פסוק מהפניות צלב. |
| `PassagePrayer.jsx` | מציג תפילות המתאימות לפרק או פסוק. |
| `PassageTabs.jsx` | טאבים לפירוש, עיונים ו-Q&A לפי פרק. |
| `VerseActionBar.jsx` | פעולות על פסוק: הערה, סימנייה, העתקה, שיתוף ותפילה. |
| `VerseList.jsx` | תצוגת פסוקים הניתנת לבחירה, כולל סימון הילוט. |

## 4.3 קבצי תשתית וספריות

| קובץ | תפקיד |
|---|---|
| `Layout.jsx` | מעטפת האפליקציה; מאחדת Auth, Theme, Player, Header, Footer ו-PWA. |
| `lib/AuthContext.jsx` | מצב המשתמש, התחברות, התנתקות וטעינת המשתמש הנוכחי. |
| `lib/themeContext.jsx` | טעינת הגדרות צבע והפקת משתני CSS דינמיים. |
| `lib/theme.js` | קבועי המותג, כתובות מדיה והגדרות storage. |
| `lib/brandCss.js` | מערכת CSS מרכזית עם משתני עיצוב ומחלקות `pr-*`. |
| `lib/player.jsx` | Provider ו־API של נגן האודיו הגלובלי. |
| `lib/contentApi.js` | קריאת collections ציבוריות ושליחת תוכן משתמש. |
| `lib/bibleApi.js` | טעינת פרק, ניקוי טקסט וגיבוי מהמאגר המקומי. |
| `lib/offlineDb.js` | מעטפת IndexedDB, stores ופעולות offline. |
| `lib/activity.js` | רישום פעילות קריאה ללא קשירה להצלחת הפעולה העיקרי. |
| `lib/readings.js` | שמירת התקדמות קריאה ומיפוי פרק ליום בתוכנית. |
| `lib/reading.js` | תאריכים, ימי שבוע, חישוב streak ועיצוב תאריכים. |
| `lib/share.js` | בניית קישורי שיתוף והעתקה לקליפבורד. |
| `lib/format.js` | עיצוב משותף, טקסט בטוח, רשימות ומשך זמן. |
| `lib/luganda.js` | פירוק ועיצוב תוכן לוגנדה למבנה קריאה. |
| `lib/bookGuides.js` | מדריכי מבנה והקדמה לכל ספרי התנ"ך. |
| `lib/bibleBooks.js` | 66 הספרים, שמות אנגליים ולוגנדה, קיצורים ומספרי פרקים. |
| `lib/crossRefs.js` | הפניות צלב מקומיות למעברים נפוצים. |
| `lib/planData.js` | תוכנית קריאת ברירת המחדל בת 30 יום. |
| `lib/seedContent.js` | תוכן סטטי לכל הסוגים; משמש fallback. |
| `lib/adminSession.js` | אחסון טוקן מנהל וקריאה לפונקציות ניהול. |
| `lib/app-params.js` | פרמטרי FSe2 מקומיים לשימוש בזמן ריצה. |
| `functions/adminAuth.js` | כניסת מנהל, סיסמאות salt/hash וחתימת session. |
| `functions/adminContent.js` | API ניהול תוכן עם בדיקת session והרשאות. |
| `functions/bibleChapter.js` | שרשור פרק ממקורות חיצוניים וניקוי תשובות. |
| `functions/content.js` | API ציבורי לקריאת תוכן וקבלת הגשות. |
| `public/manifest.json` | הגדרת PWA. |
| `public/sw.js` | אסטרטגיית cache ל-shell, תמונות ובקשות רשת. |
| `__generated/tailwind.css` | תוצר Tailwind מוגבל למחלקות בסיס המשתמשות בקוד. |
| `public/assets/*` | לוגו, תמונות hero, cover images ונכסי מדיה. |
| `__url_fetch/*` | דגימות/תשמושי cache של מקורות חיצוניים; אינם חלק מה-runtime. |
| `__trash/*` | קוד ארכיוני שאינו אמור להיכלל בייצור. |

---

# 5. מודל הנתונים

## 5.1 Entity: `ActivityLog`

**תכלית:** יומן פעילות של מנהלי התוכן.

| שדה | משמעות |
|---|---|
| `actor` | מי ביצע את הפעולה. |
| `action` | סוג הפעולה, למשל create/update/delete. |
| `section` | החלק או entity שבו בוצעה הפעולה. |
| `detail` | פירוט נוסף. |

**הרשאות:** קריאה וכתיבה עבור `owner` ו-`admin`.

---

## 5.2 Entity: `AdminAccount`

**תכלית:** אחסון רשומות כניסת מנהלי תוכן.

| שדה | משמעות |
|---|---|
| `email` | כתובת המנהל; שדה חובה. |
| `password_hash` | hash של הסיסמה. |
| `salt` | salt ייחודי לחישוב ה-hash. |
| `updated_date` | תאריך עדכון הרשומה. |

**הרשאות:** ניהול מלא עבור `owner` ו-`admin`.

---

## 5.3 Entity: `BibleVerse`

**תכלית:** אחסון פסוקי תנ"ך בעברית ובלוגנדה.

| שדה | משמעות |
|---|---|
| `book_number` | מספר קנוני של הספר. |
| `book` | שם הספר. |
| `chapter` | מספר פרק. |
| `verse` | מספר פסוק. |
| `text_en` | טקסט אנגלי. |
| `text_lu` | טקסט לוגנדה. |

**קשרים:** קשור ל־`bibleBooks` לפי `book_number`, ול־`BibleReader`/`Chapter`.

---

## 5.4 Entity: `Commentary`

**תכלית:** פירוש לפרק מסוים.

| שדה | משמעות |
|---|---|
| `book` | שם הספר. |
| `chapter` | מספר הפרק. |
| `title` | כותרת הפירוש. |
| `body_en` | גרסה אנגלית. |
| `body_lu` | גרסה לוגנדה. |

**הרשאות:** קריאה ציבורית; כתיבה למנהלים.

---

## 5.5 Entity: `ContactMessage`

**תכלית:** הודעות שנשלחו מטופס יצירת הקשר.

| שדה | משמעות |
|---|---|
| `name` | שם שולח; חובה. |
| `email` | כתובת שולח; חובה. |
| `subject` | נושא. |
| `message` | גוף ההודעה. |
| `is_read` | האם ההודעה נקראה. |
| `reply` | תשובת המנהל. |

**הרשאות:** כל גולש יכול ליצור; רק מנהלים קוראים ומעדכנים.

---

## 5.6 Entity: `Devotional`

**תכלית:** לימוד יומי דו-לשוני.

| שדה | משמעות |
|---|---|
| `code` | מזהה יציב ללימוד; חובה. |
| `title` | כותרת אנגלית. |
| `title_lu` | כותרת לוגנדה. |
| `scripture` | הפניית כתובת. |
| `scripture_lu` | הפניה בלוגנדה. |
| `body` | גוף אנגלי. |
| `body_lu` | גוף לוגנדה. |
| `related` | פסוקים קשורים. |
| `further_readings` | קריאה נוספת. |
| `cover_image` | תמונת כריכה. |

**קשרים:** `DevotionalProgress` משתמש ב-`devotional_code`.

---

## 5.7 Entity: `DevotionalProgress`

**תכלית:** מעקב אחרי לימודים שהושלמו.

| שדה | משמעות |
|---|---|
| `owner_email` | בעל ההתקדמות; חובה. |
| `devotional_code` | קוד הלימוד; חובה. |
| `completed_date` | תאריך השלמה. |

**קשרים:** ל-`Devotional` לפי `devotional_code`, ולמשתמש לפי `owner_email`.

---

## 5.8 Entity: `DiscussionGroup`

**תכלית:** הגדרת קבוצת דיון.

| שדה | משמעות |
|---|---|
| `name` | שם הקבוצה; חובה. |
| `description` | תיאור הקבוצה. |
| `schedule` | לוח מפגשים. |
| `member_count` | מספר חברים. |

**קשרים:** `DiscussionThread.group_name` מפנה לשם הקבוצה. מאחר שהקשר מבוסס שם ולא מזהה, יש לשמור על אחידות שמות.

---

## 5.9 Entity: `DiscussionThread`

**תכלית:** הודעה בקבוצת דיון.

| שדה | משמעות |
|---|---|
| `group_name` | שם הקבוצה; חובה. |
| `owner_email` | דוא"ל הכותב. |
| `author_name` | שם המחבר. |
| `title` | כותרת אופציונלית. |
| `body` | גוף ההודעה. |

---

## 5.10 Entity: `Insight`

**תכלית:** עיון תיאולוגי או היסטורי.

| שדה | משמעות |
|---|---|
| `kind` | `theological` או `historical`; חובה. |
| `title` | כותרת; חובה. |
| `passage` | פסוק או פרק קשור. |
| `excerpt` | תקציר לכרטיס ולחיפוש. |
| `body` | גוף העיון. |
| `share_count` | מספר שיתופים. |

---

## 5.11 Entity: `JournalEntry`

**תכלית:** רשומת יומן תפילה אישית.

| שדה | משמעות |
|---|---|
| `owner_email` | בעל הרשומה; חובה. |
| `entry_date` | תאריך הרשומה. |
| `title` | כותרת. |
| `body` | תוכן. |
| `category` | סוג התפילה. |
| `book` | ספר מקושר. |
| `chapter` | פרק מקושר. |
| `mood` | מצב רוח אופציונלי. |

**הערה:** גרסת ההרשאות כוללת policy מסוג version 2 עם כללים מקוננים, בעוד שרוב ה-entities משתמשים במבנה rules פשוט.

---

## 5.12 Entity: `LiveSession`

**תכלית:** מפגש הוראה חי עתידי.

| שדה | משמעות |
|---|---|
| `title` | שם המפגש; חובה. |
| `session_date` | מועד. |
| `host` | מנחה. |
| `join_link` | קישור הצטרפות. |
| `description` | תיאור. |

---

## 5.13 Entity: `Prayer`

**תכלית:** תפילה בספריית התפילות.

| שדה | משמעות |
|---|---|
| `title` | כותרת; חובה. |
| `title_lu` | כותרת לוגנדה. |
| `category` | קטגוריה, למשל morning או healing. |
| `body_en` | תוכן אנגלי. |
| `body_lu` | תוכן לוגנדה. |
| `scripture_ref` | הפניית כתובת המקור. |

**קשרים:** `PrayerSaved.prayer_title` מפנה אל הכותרת.

---

## 5.14 Entity: `PrayerSaved`

**תכלית:** שמירת תפילה למשתמש.

| שדה | משמעות |
|---|---|
| `owner_email` | בעל השמירה; חובה. |
| `prayer_title` | שם התפילה; חובה. |

---

## 5.15 Entity: `QAEntry`

**תכלית:** שאלת קורא ותשובתה.

| שדה | משמעות |
|---|---|
| `question` | גוף השאלה; חובה. |
| `category` | קטגוריה. |
| `answer` | תשובה פסטורלית. |
| `passage_ref` | הפניה הביבילית. |
| `answered_by` | העונה. |
| `status` | מצב, למשל pending/answered. |
| `author_email` | דוא"ל השואל. |

**הרשאות:** קריאה ציבורית; יצירה על ידי משתמש מאומת; עדכון/מחיקה על ידי מנהלים.

---

## 5.16 Entity: `ReadingActivity`

**תכלית:** אירוע פעילות קריאה נקודתי.

| שדה | משמעות |
|---|---|
| `owner_email` | בעל הפעילות; חובה. |
| `activity_type` | סוג הפעולה; חובה. |
| `book` | שם הספר. |
| `book_number` | מספר הספר. |
| `chapter` | פרק. |
| `verse` | פסוק. |

**ערכי `activity_type`:**

- `chapter_visit`.
- `highlight`.
- `bookmark`.
- `note_saved`.
- `prayer_opened`.
- `devotional_access`.

---

## 5.17 Entity: `Reading`

**תכלית:** התקדמות קריאה וסיכום לימוד לפרק.

| שדה | משמעות |
|---|---|
| `owner_email` | בעל ההתקדמות; חובה. |
| `book` | שם הספר; חובה. |
| `chapter` | פרק; חובה. |
| `translation` | שפת/תרגום הקריאה. |
| `plan_day` | יום מתוכנית הקריאה. |
| `read_date` | תאריך הקריאה. |
| `status` | למשל `completed`. |
| `reflection` | התהלוכות אישית. |
| `prayer_point` | נקודת תפילה. |
| `highlighted_verses` | רשימת פסוקים מסומנים, למשל כמחרוזת. |

---

## 5.18 Entity: `ReadingPlan`

**תכלית:** הגדרת תוכנית קריאה.

| שדה | משמעות |
|---|---|
| `day` | מספר יום; חובה. |
| `book` | ספר; חובה. |
| `chapter` | פרק; חובה. |
| `title` | כותרת היום. |
| `theme` | נושא. |
| `focus` | מיקוד לתפילה. |
| `scripture` | הפניית הכתובת. |

**קשרים:** `Reading.plan_day` מייצג את יום התוכנית שהושלם.

---

## 5.19 Entity: `Revelation`

**תכלית:** גילוי קהילתי ותגובותיו.

| שדה | משמעות |
|---|---|
| `owner_email` | דוא"ל מפרסם. |
| `author_name` | שם מחבר. |
| `title` | כותרת; חובה. |
| `passage` | פסוק קשור. |
| `body` | תוכן. |
| `likes` | מספר לייקים. |
| `parent_id` | מזהה הגילוי האב עבור תגובה. |

**קשרים:** תגובות נשמרות כרשומות באותה entity ומקבלות `parent_id` של רשומת האב.

---

## 5.20 Entity: `SiteSettings`

**תכלית:** הגדרות אתר גלובליות וערכי מותג.

| שדה | משמעות |
|---|---|
| `setting_key` | מפתח; חובה. |
| `setting_value` | ערך. |

**שימושים אפשריים:** `site_name`, `donate_url`, צבעי ivory/emerald/gold ואחרים.

---

## 5.21 Entity: `StudyMark`

**תכלית:** סימון, סימנייה או הערה על פסוק.

| שדה | משמעות |
|---|---|
| `owner_email` | בעל הסימון; חובה. |
| `mark_type` | `highlight`, `bookmark` או `note`; חובה. |
| `book_number` | מספר הספר. |
| `book` | שם הספר. |
| `chapter` | פרק. |
| `verse` | פסוק. |
| `color` | צבע ההילוט. |
| `note_text` | תוכן ההערה. |

---

## 5.22 Entity: `VerseOfDay`

**תכלית:** פסוק מומלץ לתאריך מסוים.

| שדה | משמעות |
|---|---|
| `verse_date` | תאריך; חובה. |
| `reference` | הפניית כתובת. |
| `text_en` | טקסט אנגלי. |
| `text_lu` | טקסט לוגנדה. |
| `note` | הערת הרהבה. |

---

## 5.23 Entity: `VerseSongSeries`

**תכלית:** סדרת Verse-Song.

| שדה | משמעות |
|---|---|
| `name` | שם הסדרה; חובה. |
| `description` | תיאור. |
| `thumbnail` | תמונת ממוזערת. |
| `cover_image` | תמונת כריכה. |
| `accent` | צבע מודגש. |

---

## 5.24 Entity: `VerseSongEpisode`

**תכלית:** פרק בתוך סדרת Verse-Song.

| שדה | משמעות |
|---|---|
| `series_name` | שם הסדרה; חובה. |
| `title` | שם הפרק. |
| `verse_ref` | הפניית הפסוק. |
| `duration_label` | משך מוצג. |
| `duration_seconds` | משך בשניות. |
| `audio_url` | כתובת קובץ האודיו. |
| `audio_key` | מזהה קובץ במאגר. |
| `thumbnail` | תמונת פרק. |
| `episode_order` | סדר הפרק בסדרה. |

**קשרים:** `series_name` מקשר ל-`VerseSongSeries.name`.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 טעינת האפליקציה

1. `Layout` מעוטף את כל האפליקציה.
2. `AuthProvider` מנסה לקבל את המשתמש הנוכחי דרך `fse2.auth.me()`.
3. `ThemeProvider` טוען הגדרות מותג רק למשתמש מחובר.
4. `PlayerProvider` יוצר אלמנט `Audio` גלובלי.
5. `PwaHead` מוסיף meta tags, manifest ורושם את ה-Service Worker.
6. `AppHeader`, `AppFooter` ו-`GlobalPlayer` מוצגים סביב תוכן הדף.

### נקודות debug

- אין לבצע קריאות ל-`localStorage` ברמת מודול ללא בדיקת SSR, כפי שקורה ב-`app-params.js`.
- יש לוודא ש-`ThemeProvider` ממתין לסיום טעינת המשתמש; אחרת הגדרות משתמש מחובר עלולות להיטען כאילו המשתמש אורח.
- רישום ה-Service Worker משתמש בנתיב `/sw.js`; יש לוודא שהוא נמצא ב-root בכל סביבת deployment.

---

## 6.2 קריאת פרק ושמירת התקדמות

1. המשתמש בוחר ספר ב-Bible Reader.
2. המערכת מנווטת ל-`Chapter` עם `book` ו-`chapter`.
3. `Chapter` טוען את הפרק דרך `fetchChapter`.
4. אם הרשת נכשלת, מתבצע ניסיון לקרוא מ-IndexedDB.
5. לאחר טעינה מוצגים הפסוקים.
6. בפתיחת הפרק נרשמת פעילות `chapter_visit`.
7. המשתמש בוחר פסוק ומוצגת `VerseActionBar`.
8. פעולות סימון, הערה וסימנייה נשמרות ב-`StudyMark`.
9. לחיצה על פעולת השלמה שומרת `Reading`.
10. אם הפרק תואם לתוכנית, נמצא יום התוכנית באמצעות `findPlanDay`.
11. ההתקדמות משפיעה על `Plan`, `Dashboard` וחישוב ה-streak.
12. המשתמש יכול לפתוח טופס יומן עם הפרק הנבחר.

### כלל עסקי

רישום הפעילות אינו אמור להפיל את פעולת הקריאה העיקרית. כלומר כשל בכתיבת `ReadingActivity` לא צריך למחוק את הפרק מהמסך או להציג כבר כשל קריטי.

---

## 6.3 התחברות

1. המשתמש נכנס ל-`/Login`.
2. הוא מזין דוא"ל וסיסמה.
3. `fse2.auth.login` מאמת את הפרטים.
4. בהצלחה המשתמש מועבר ל-`/Dashboard`.
5. `AuthProvider` מעדכן את `user` ו-`isAuthenticated`.
6. דפים הדורשים כניסה מציגים `EmptyState` או מעבירים למסך התחברות.

### הערות

- לאחר כניסה יש לבצע `invalidateQueries` או רענון של queries המשתמש, כדי לא להציג נתונים של משתמש קודם.
- כפתורי יצירה צריכים לבדוק התחברות מחדש גם בזמן בקשת mutation.

---

## 6.4 יצירת גילוי ותגובה

1. משתמש נכנס ל-`/CommunityRevelations`.
2. אם אינו מחובר, `RevelationForm` מציג הנחיה לכניסה.
3. לאחר כניסה הוא מזין כותרת, פסוק ותוכן.
4. הטופס חוסם שליחה אם חסרה כותרת או גוף.
5. נוצרת רשומת `Revelation` חדשה.
6. הרשימה מתרעננת והפיד מציג את הגילוי.
7. לחיצה על לייק מעדכנת את `likes`.
8. לחיצה על תגובות פותחת `CommentThread`.
9. תגובה נשמרת כ-`Revelation` נוספת עם `parent_id`.
10. המערכת מסננת רשומות עם `parent_id` לתגובות ורשומות ללא כזה לפוסטים.

### סיכון debug

יש לוודא שמזהה הגילוי האב נשמר בצורה עקבית ושאין יצירת תגובה ללא `parent_id`, אחרת התגובה תופיע כגילוי עצמאי.

---

## 6.5 השמעת Verse-Songs

1. המשתמש בוחר סדרה.
2. `VerseSongs` ממפה את הפרקים ל-`tracks`.
3. `playQueue` מעדכן את הנגן הגלובלי.
4. `PlayerProvider` טוען את ה-`audio_url` ומעדכן `currentTime`, `duration` ו־`playing`.
5. בסיום פרק:
   - `repeat="one"` משחק את אותו פרק.
   - `repeat="all"` עובר לפרק הבא בסביבה.
   - במצב רגיל מתקדם בתור.
6. המשתמש יכול:
   - לדלג קדימה ואחורה.
   - לשנות עוצמת קול.
   - לשנות מהירות.
   - להפעיל shuffle.
   - לבחור מצב repeat.
   - לפתוח גרסה מורחבת.
7. הנגן ממוקם ברמת ה-Layout ולכן ממשיך לעבוד בעת ניווט.

---

## 6.6 הורדה לא מקוון

1. המשתמש נכנס ל-`/Offline`.
2. בוחר סוג תוכן, ספרים ושפה.
3. הדף מתחיל להוריד פרקים דרך `fetchChapter`.
4. כל פרק נשמר ב-`chapters`, והפסוקים ב-`verses`.
5. התקדמות מוצגת בזמן אמת.
6. `navigator.storage.estimate()` מחזיר שימוש ומכסת אחסון.
7. המשתמש יכול לנקות את המאגר.
8. בעת טעינת פרק לא מקוון, `BibleReader` מחשב אילו ספרים זמינים במלואם.
9. בדף Chapter נעשה fallback ל-IndexedDB.

### הערות

- אין להחליף את כל המאגר בפעולת אחת בלי להבטיח מגבלת קצב ומשאבים.
- יש להימנע משמירת אותו פרק במקומות חופפים, למשל גם כ-chapter וגם כ-verses ללא מפתח יציב.
- יש לבדוק שמחיקת המאגר אינה מוחקת נתוני משתמש חשובים שאינם קשורים ל-offline.

---

## 6.7 ניהול תוכן

1. המנהל נכנס ל-`/Admin`.
2. `adminAuth` מאמת את הסיסמה.
3. נוצר טוקן session חתום.
4. הטוקן נשמר ב-`localStorage` תחת `pr_admin_token`.
5. `AdminDashboard` קורא ל-`adminContent` דרך `callAdmin`.
6. הפונקציה בודקת את החתימה ואת תוקף ה-session.
7. המנהל יוצר, מעדכן או מוחק רשומות.
8. פעולות מנהל נרשמות ב-`ActivityLog`.
9. שינויי ערכי מותג נשמרים ב-`SiteSettings`.
10. `ThemeProvider` טוען אותם ומחליף את משתני ה-CSS.

---

## 6.8 שיתוף

`lib/share.js` מספק ערוצים:

- Facebook.
- WhatsApp.
- Telegram.
- Instagram.
- LinkedIn.
- Copy link.

המערכת:

1. מרכיבה טקסט שיתוף וקישור.
2. בוחרת את תבנית הרשת החברתית.
3. פותחת חלון חיצוני או מבצעת העתקה.
4. `ShareRow` מציג משוב "Copied" לשתי שניות לאחר הצלחת העתקה.

---

# 7. הערות טכניות לפיתוח

## 7.1 ספריות ותשתיות

| ספרייה | שימוש |
|---|---|
| React | רכיבים, hooks ו-context. |
| React Router | ניתוב, פרמטרי URL ו־`Link`. |
| TanStack React Query | טעינת collections, cache, mutations ואינטראקציות. |
| Lucide React | ספריית אייקונים. |
| date-fns | עיצוב תאריכים, ימי שבוע ופערי זמן. |
| IndexedDB API | מאגר offline. |
| Service Worker API | caching והתקנה. |
| Web Crypto API | HMAC, SHA-256 והגנת session בפונקציות השרת. |

## 7.2 דפוסי state ו־data

### Context

המערכת משתמשת בשלושה providers עיקריים:

- `AuthProvider`  -  מצב משתמש.
- `ThemeProvider`  -  מצב ערכת צבעים.
- `PlayerProvider`  -  מצת נגן אודיו.

### React Query

מקפים נפוחים:

```text
["devotionals"]
["prayers"]
["verseSongSeries"]
["verseSongEpisodes"]
["insights"]
["revelations"]
["discussion-groups"]
["discussion-threads"]
["live-sessions"]
["studyMarks", email]
["readings", email]
["readingActivity", email]
["prayerSaved", email]
["devotionalProgress", email]
```

### כלל cache חשוב

אחרי logout או התחברות כמשתמש אחר יש לנקות או לבטל queries המכילים `email`. למשל:

```text
queryClient.clear()
```

או invalidate מתאים לכל המשתמשים.

## 7.3 fallback לתוכן seed

המערכת אינה מציגה מסך ריק כאשר המסד ריק. בדפים רבים מתבצע מיזוג של:

```text
database rows + built-in seed items
```

חשוב:

- לא להוסיף ספירה כפולה.
- למחוק seed item אם רשומה חיה בעלת אותו title/code/name.
- לא לחשוב ש-seed הוא תוכן ניתן לעריכה; שינוייו דורשים deploy או עדכון קוד.
- אם התוכן החי נכשל בטעינה, ההבדל בין “אין תוכן” ל-“שגיאת רשת” צריך להיות ברור למשתמש.

## 7.4 אבטחה

### Admin Auth

`functions/adminAuth.js` משתמש ב:

- Salt ייחודי.
- SHA-256 פשוט.
- HMAC-SHA-256 לחתימת session.
- TTL של 12 שעות.

### סיכונים שיש להתייחס אליהם

1. **SHA-256 לבדו אינו מתאים לאחסון סיסמאות.**  
   יש להשתמש באלגוריתם password hashing איטי ומותאם כגון Argon2id, scrypt או PBKDF2 עם iterations גבוהות.

2. **סיסמת ברירת המחדל חלשה.**  
   `DEFAULT_PASSWORD` ברירת המחדל היא `prayread-admin`. אין להשאיר אותה כזו בפרודקשן.

3. **טוקן ב-`localStorage`.**  
   הטוקן חשוף ל-XSS. עדיפות מנגנון cookie מוגן או token קצר־חיים עם החלפה.

4. **הרשאות רחבות למשתמשים מאומתים.**  
   במספר entities כל תפקיד `authenticated` מקבל גם update/delete. אם מטרת ההרשאה היא בעלות על רשומה אישית, יש להוסיף תנאי `owner_email == current_user.email`.

5. **סינון בצד הלקוח אינו אבטחה.**  
   בדפים רבים מבוצע `list` ולאחר מכן סינון לפי `owner_email`. אין לחשוף רשומות של משתמש אחר גם אם הן מוסתרות ב-UI.

6. **אין להחזיר סיסמאות או hash-ים ללקוח.**

7. **אין להשתמש ב-`innerHTML` לתוכן משתמשים.**  
   `safeText` מספק הגנה בסיסית מבחינת סוג, אך אין להתעלם מעיבוד HTML עבור תוכן עשיר.

## 7.5 נגישות

המערכות כוללות מאמצים טובים:

- `role="status"` ו-`aria-live` בספינר.
- `role="dialog"` ו-`aria-modal`.
- סגירת מודאל ב-Escape.
- `aria-label` לכפתורי אייקונים.
- `aria-selected` בטאבים.
- נתיבי טקסט בעברית ובאנגלית.

מומלץ להוסיף:

- מיקוד פוקוס לתחילת מודאל.
- מלכודת פוקוס בתוך המודאל.
- החזרת פוקוס לכפתור שפתח אותו.
- `aria-controls` ו-`aria-labelledby`.
- הודעות שגיאה מקושרות לשדות באמצעות `aria-describedby`.
- נגישות למצבי focus ולמקלדת בתפריט הנייד.

## 7.6 עיצוב

העיצוב מבוסס CSS variables:

```text
--pr-ivory
--pr-ivory-soft
--pr-emerald
--pr-emerald-deep
--pr-gold
--pr-gold-btn
--pr-gold-deep
--pr-heading
--pr-body
--pr-border
--pr-shadow
```

- `brandCss.js` הוא מקור האמת לערכי ברירת המחדל.
- `themeContext.jsx` מחליף את המשתנים בזמן אמת.
- יש לא להניח צבע ישיר במקומים שבהם צפוי שינוי ערכת נושא.
- שינוי ערכת נושא דורש לבדוק ניגודיות בכפתורים, טקסט על ירוק ואזורי focus.

## 7.7 PWA

`sw.js` משתמש בשני caches:

- `prayread-shell-v1`.
- `prayread-runtime-v1`.

עקרונות:

- App shell: cache-first.
- תמונות: cache-first.
- בקשות אחרות: network-first.

בעת הוספת routes חדשים יש לעדכן את `SHELL`.

בעת שינוי מדהקה של Service Worker כדאי:

- להגדיל את שמות ה-cache.
- להוסיף strategy לניקוי cache ישן.
- לבדוק שה-cache לא מחזיק נתוני משתמש רגישים.
- להימנע משמירת בקשות API מאומתות במצב shared cache.

## 7.8 ביצועים

### נקודות על

- טעינת רשימות גדולות עם `list(... , 300)` עלולה להיות כבדה.
- סינון owner בצד הלקוח דורש הורדת רשומות רבות.
- שימוש ב-`useMemo` קיים בחלק מהדפים, אך יש לוודא שמערכים גדולים לא מחושבים מחדש בכל render.
- `ActivityFeed` מרענן כל 30 שניות; יש לוודא שאין ספיקת רשת מכבידה.
- `BRAND_CSS` מוזרק כ-`<style>` בכל render של Layout; עדיף להוציא אותו לקובץ CSS קבוע אם זו אפשרות בתהליך הבנייה.

## 7.9 יציבות וטיפול בשגיאות

- כל fetch של מסד נתונים צריך להחזיר מצב loading, error ו-empty; לא להסתמך רק על `data || []`.
- יש להבחין בין:
  - אין רשומות.
  - המשתמש אינו מורשה.
  - השרת נכשל.
  - תוכן לא נטען עדיין.
- בעת כשל במסד אין למחוק נתוני seed מהמסך.
- כשל בשמירת `StudyMark` או `ReadingActivity` אינו צריך למחוק את הפעולה מהממשק.
- לפני מחיקת רשומות יש להשתמש בחלון אישור.

## 7.10 דפוסים שחוזרים

### טעינת ערכים סינתטיים

```javascript
const [saved, setSaved] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
});
```

היתרון: הימנעות מקריאת localStorage בכל render.  
הסיכון: צריך לוודא שהערך הוא מערך.

### ערבוב שורה יחידה

```javascript
const live = rows || [];
const merged = [...live];
seedItems.forEach((seed) => {
  if (!merged.some((row) => row.title === seed.title)) {
    merged.push(seed);
  }
});
```

הפטרון נוח ל-fallback, אך עדיף להוציא את הלוגיקה לפונקציה משותפת כדי לשמור על אותו אלגוריתם מיזוג בכל הדפים.

### טיפול בפעולות אסינכרוניות

- לפני פעולה: הצגת מצב busy.
- לאחר הצלחה: עדכון cache או invalidation.
- לאחר כשל: הצגת הודעה ללא איבוד הקלט שהמשתמש הקליד.
- יש לבדוק ש־`onSubmit` אינו מנקה את הטקסט לפני שהשמירה הצליחה; במקרים מסוימים עדיף לנקות רק ב־success.

## 7.11 המלצות לפיתוח המשך

1. להוסיף הגדרות environment מרכזיות:
   - כתובת API.
   - סוד session.
   - מזהה אפליקציה.
   - מדיניות cache.
   - שגיאות דיבוג.

2. להוגדיל את מספר ה־`QueryClient` ולהגדיר retry רק לשגיאות רשת ולא לשגיאות הרשאה.

3. להוסיף route-level error boundaries.

4. להוסיף מבחני יחידה לפונקציות העסק:
   - `matchesPassage`.
   - `matchesPassage` של `PassageTabs`.
   - `safeText`.
   - `computeStreak`.
   - `findPlanDay`.
   - מיזוג seed.
   - בניית מפתחי offline.

5. להוסיף integration tests לזרימות:
   - התחברות.
   - שמירת הערה.
   - סימון פסוק.
   - הורדת פרק.
   - נגן אודיו.
   - ניהול תוכן.

6. להוסיף error tracking לשרת וללקוח.

7. להגדיר schema validation לפני כתיבת entities, במיוחד:
   - תאריכים.
   - מספרי פרק ופסוק.
   - `mark_type`.
   - `activity_type`.
   - `kind` של insights.
   - קטגוריות תפילה.

8. לבצע migration מסודרת למסדי עברית/לוגנדה ולהגדיר איזו שפה היא canonical.

9. להוסיף מדדי ביצועים:
   - זמן טעינת פרק.
   - אחוז נפילות בהורדת offline.
   - שגיאות אודיו.
   - אחוז שליחות תגובות.
   - זמן טעינת רשימת תוכן גדולה.

10. להוסיף מסמכיות תפעול:
    - תהליך שחרור.
    - ניהול secrets.
    - גיבוי ושחזור מסד.
    - ניהול תוכן ותרגומים.
    - טיפול בדיווח על תוכן לא מתאים.

---

## 7.12 סיכונים מרכזיים בפרויקט

| סיכון | השפעה | המלצה |
|---|---|---|
| הרשאות רחבות ל-`authenticated` | חשיפת או שינוי רשומות של משתמשים אחרים | להוסיף תנאי בעלות ברמת השרת |
| סינון משתמש רק בצד הלקוח | הורדת רשומות זרות | להשתמש בשאילתות scoped |
| סיסמת admin ברירת מחדל חלשה | חדירה למנהל תוכן | להגדיר secret חובה ולבצע rotation |
| SHA-256 לסיסמאות | חולשה מול brute force | לעבור ל-Argon2id/scrypt/PBKDF2 |
| טוקן ב-localStorage | חשיפה ב-XSS | לשקול cookie מאובטח או token קצר־חיים |
| `list` עם תקציבים גדולים | עלות רשת וזמן טעינה | pagination ושאילתות מסוננות |
| cache ללא scope למשתמש | הצגת נתונים ישנים של משתמש אחר | ניקוי cache בעת logout/login |
| seed content משתנה בקוד | סיכון לתוכן כפול או לא עקבי | ריכוז מנגנון merge והוספת metadata |
| Service Worker יכול להחזיק נתונים ישנים | הצגת תוכן מיושן | versioned caches ועדכון מדור policy |
| חיפוש הפניות פסוק ב-regex פשוט | אי-התאמה להפניות מורכבות | parser ייעודי ל-book/chapter/verse |
| חיבור למשתמש לפי שם entity | שינוי שם עלול לנתק יחסים | להשתמש במזהה יציב |
| אין pagination גלוי | עומס רשימות ארוכות | להוסיף infinite query או pagination |

---

# 8. מדריך debug מהיר

## תוכן לא מוצג

1. בדוק אם `fetchPublicCollection` מחזיר מערך.
2. בדוק אם `rows` הוא `null`, `[]` או תגובת שגיאה.
3. בדוק אם סינון הסוג מסיר את כל הפריטים.
4. בדוק אם אלגוריתם merge זוהה בין פריט חי ל-seed.
5. בדוק אם הרשומה חסרה שדות חובה.

## התחברות לא עובדת

1. בדוק `fse2.auth.me()`.
2. בדוק שה-`AuthProvider` עוטף את המסך.
3. בדוק שה-redirect מחזיר לנתיב נכון.
4. בדוק אם `isAuthenticated` התעדכן לאחר login.
5. נקה cache ונסה מחדש.

## פרק לא נטען

1. בדוק את פרמטרי `book` ו-`chapter`.
2. בדוק התאמת השם בין `bibleBooks` למקור החיצוני.
3. בדוק תגובת `bible-api` או `wordplanet`.
4. בדוק אם `fetchChapter` מנקה את הטקסט בצורה שמוחקת את כל הפסוקים.
5. בדוק fallback של IndexedDB.

## סימון או הערה לא נשמרים

1. בדוק אם המשתמש מחובר.
2. בדוק אם כתובת ה-API זמינה.
3. בדוק `owner_email`.
4. בדוק אם `mark_type` תקין.
5. בדוק אם הרשומה מוצגת עקב `filter`, אך לא נמצאה בשרת.

## הנגן לא ממשיך בין עמודים

1. ודא שהוא תחת `PlayerProvider`.
2. ודא שהוא ממוקם בתוך `Layout`, לא בתוך דף ניתן לניתוב.
3. בדוק שה-`audio_url` נגיש מהדפדפן.
4. בדוק הרשאות CORS ו־MIME עבור קובצי אודיו.
5. בדוק אם `play()` נכשל בגלל המדיניות האוטומטית של הדפדפן.

## ניהול תוכן לא מתחבר

1. בדוק שהפונקציה פועלת בסביבה התומכת ב-Web Crypto.
2. בדוק שסוד החתימה זהה בכל פונקציה.
3. בדוק שהטוקן לא פג.
4. בדוק שהשעה בשרת תקינה.
5. בדוק שה-entity נכלל ב-`MANAGED`.

---

# 9. תחזית להרחבה

הרחבה מומלצת בשלבים:

1. **הרשאות ובעלות**  -  הגבלת כל entity אישית לבעלה.
2. **ניהול סיסמאות**  -  החלפת SHA-256 באלגוריתם password hashing.
3. **גליון עסקיים**  -  pagination, סינון וחיפוש בצד השרת.
4. **מודל שפות**  -  הגדרת עברית/לוגנדה כשדות מובנים ולא כמחרוזות.
5. **Offline מלא**  -  הגדרת cache manifest, סנכרון וטיפול בקריאה לא מקוון.
6. **רישום פעילות מובנה**  -  שמירת אירועים מובנים במקום התלות בשמות ישויים.
7. **ניהול תוכן מרובה משתמשים**  -  roles, audit log מלא וdraft/publish.
8. **נגישות**  -  focus management, keyboard navigation ובדיקות screen reader.
9. **PWA מלא**  -  background sync, notifications ועדכון offline מדורג.
10. **בדיקות וניטור**  -  unit, integration, E2E ובדיקות עומס.

בסך הכול, הקוד מיישם אפליקציית PWA מלאה ורב-פיצ'רית עם מודל hybrid של תוכן חי, תוכן סטטי, נתוני משתמש ואחסון מקומי. כדי להאיץ פיתוח עתידי, הכיוון החשוב ביותר הוא לאחד את מקורות האמת לכלול אחד, להרכיב מדיניות הרשאות מוגדרת, ולהפריד נתוני משתמש מנתוני cache ומתוכן ציבורי.
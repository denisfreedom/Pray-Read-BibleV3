# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

> **היקף המסמך:** התיעוד מבוסס על קוד המקור שסופק. חלקים מהקבצים מסומנים ב„נחתך”, ולכן פרטים שלא ניתן לאמת מוצגים כמסקנה או מסומנים במפורש.
>
> **נוהל נתיבים:** הנתיבים שלהלן הם הנתיבים הלוגיים שבהם נעשה שימוש באפליקציה, כפי שמופיעים גם ב־`public/sw.js`. יישום ה־URL הסופי נעשה דרך `createPageUrl()` ולכן הוא עשוי לקבל prefix של ההתקנה או של הפלטפורמה.
>
> **קבצים לא פעילים:** הקבצים תחת `__trash/` הם קוד ישן או בדיקות זמניות. הקבצים תחת `__url_fetch/` הם snapshots של מקורות חיצוניים שנשמרו למחקר. אין להם תפקיד בהרצת האפליקציה.

---

## 1. מהות המערכת

### 1.1 תמצית

Pray-Read היא אפליקציית React לקריאת התנ"ך, מחקר ותפילה, הכוללת:

- קריאת כל 66 ספרי התנ"ך.
- תרגומים באנגלית ובלוגנדה.
- KJV ו־KJV+ עם סימוני Strong’s.
- פרקי תלמיד, הערות, הארות ומשאלות.
- תפילות, מעברי פסוקים והפניות תנ"ך.
- תוכניות קריאה יומיות, יומן תפילה ומעקב התקדמות.
- קהילה: חשיפות אישיות, הערות, לייקים, שיעורים חיים וקבוצות דיבור.
- שירי פסוקים עם נגן גלובלי שממשיך לעבוד בעת מעבר בין עמודים.
- מרכז להורדה למצב לא מקוון.
- ממשק ניהול תוכן, ייבוא כתובים, התקנת תרגומים וביקורת איכות הספרייה.

### 1.2 קהלי היעד

| קהל | שימושים מרכזיים |
|---|---|
| **קורא אורח** | קריאת פרקים, חיפוש ספרים, פתיחת הפניות, שיתוף, האזנה לשירי פסוקים והורדת תוכן למכשיר |
| **קורא מחובר** | שמירת סימונים, ספריות, הערות, התקדמות קריאה, יומן, תפילות שמורות ופעילות קהילה |
| **מנהל תוכן** | ניהול אוספים, ייבוא JSON, התקנת תרגומים, ביקורת כיסוי והפקת המשאלים |
| **מנהל מערכת** | ניהול סביבת ההתקנה, סודות, הרשאות, cron ו־PWA |

### 1.3 הערך שהמערכת מספקת

1. **קריאה ללא חיבור:** פרקים שהורדו, תוכן ציבורי והגדרות Strong’s נשמרים ב־IndexedDB.
2. **חוויית לימוד משולבת:** הפרק מוצג לצד מבוא, מתאר ספר, תפילה, פירוש, תובנה תאולוגית והיסטורית.
3. **סנכרון בין מכשירים:** סימונים, הערות, יומן והתקדמות נשמרים בשרת עבור קורא מחובר.
4. **שימוש חוזר בתוכן:** הייבוא מזהה רשומות לפי מפתח טבעי, ולכן ניתן להעלות את אותו קובץ שוב בלי ליצור כפילויות.
5. **שקיפות מצב הספרייה:** דוח `scriptureAudit` מראה כיסוי פרקים, פרקים שבורים ופערים במספר הפסוקים.
6. **גמישות תוכן:** ה־CMS בונה טפסים מתוך מטא־נתונים מרכזיים, כך שהוספת שדה או אוסף דורשת מעט קוד יישום.

### 1.4 ארכיטקטורה כוללת

המערכת מורכבת מארבע שכבות:

1. **שכבת תצוגה  -  React**
   - עמודים, קומפוננטות, React Router.
   - עיצוב מבוסס `BRAND_CSS` ומשתני CSS.
   - רכיבי `lucide-react` לאייקונים.

2. **שכבת נתוני לקוח**
   - TanStack React Query לרשת, cache ו־mutations.
   - Contextים ל־Auth, Theme ו־Player.
   - מצב מקומי לטפסים ו־UI.
   - `localStorage` להעדפות קלות ו־seed content.
   - IndexedDB לנתוני offline.

3. **שכבת פלטפורמה  -  FSe2**
   - Authentication.
   - Entities עם הרשאות שדות ו־ACL.
   - Functions המופעלות בצד השרת.
   - Cron להתקנת תוכן.

4. **מקורות חיצוניים**
   - `bible-api.com` לתקריט אנגלי.
   - Wordplanet לתנ"ך לוגנדה.
   - Bolls/Open Scriptures ל־KJV עם Strong’s.
   - Blue Letter Bible כמקור משני להגדרות Strong’s.
   - Open Scriptures Strong’s dictionaries כמקור מקורי למילון.

### 1.5 עקרונות מרכזיים

- **המקור החי מנוגה over seed content:** כאשר יש רשומות חיות, הן משתמשות בהן; כאשר אין, המערכת נופלת לנתוני `seedContent`.
- **פרקים נשמרים כיחידה אחת לכל ספר ופרק:** `KjvPlusChapter` ו־`LugandaChapter` מכילים את הפסוקים כ־JSON.
- **סימון לפי מפתח טבעי:** משמש לייבוא ולעדכון ללא כפילויות.
- **שפות מבוססות קוד:** `en` ו־`lu`, עם אפשרות למצב `both` בחלק מהמסכים.
- **הרשאות נפרדות למנהל תוכן:** מנהל התוכן אינו משתמש רגיל ואינו משתמש ב־`AuthContext`.
- **התקנה אידמפוטנטית:** משימות ההתקנה בודקות קודם מה קיים, מתקינות רק פערים וניתנות להפעלה חוזרת.

---

## 2. עמודים ותפקידיהם

### 2.1 עמודים ציבוריים וקריאה

| עמוד | נתיב לוגי | תפקיד | פעולות מרכזיות |
|---|---|---|---|
| `Home` | `/` | דף המותג והנחנה הראשי | כניסה לספריות, הצגת פסוק יום, תוכן מומלץ, קישורי קהילה, התקנת PWA, שיתוף ותרומה |
| `About` | `/About` | הסבר על מטרת האפליקציה, הקהילה וערכי המוצר | קריאת מידע, חזרה לדף הבית, ניווט לפעילויות מרכזיות |
| `BibleReader` | `/BibleReader` | בחירת ספר מתוך 66 הספרים והמעבר לפרקים | חיפוש לפי שם או קיצור באנגלית ולוגנדה, מעבר בין הברית הקדומה והחדשה, הצגת זמינות offline, בחירת פרק |
| `Chapter` | `/Chapter?book={1..66}&chapter={n}&verse={n}&lang={en\|lu}` | מרכז חוויית הקריאה והלימוד | הצגת פסוקים, החלפת תרגום, Strong’s, הערות והדגשות, תפילות, הפניות, פירושים, משאלות, שיתוף, סימון התקדמות ופעילות |
| `Devotionals` | `/Devotionals`, אפשר גם `?devotional={code}` | קטלוג וקריאת תוכניות יומיות | חיפוש, סינון, פתיחת תוכנית, סימון כהושלמה, שיתוף, מעבר לפסוק המקושר |
| `PrayerLibrary` | `/PrayerLibrary` | ספריית תפילות באנגלית ולוגנדה | חיפוש לפי כותרת/גוף, סינון לפי קטגוריה ושפה, שמירת תפילה, ביטול השמירה, פתיחת פסוק ושיתוף |
| `VerseSongs` | `/VerseSongs` | רשימת סדרות Verse-Song | השמעת סדרה, הצגת אוספים ושגיאות נגן |
| `VerseSongSeries` | `/VerseSongSeries?series={name}` | פרטי סדרת שירים ופרקיה | השמעת פרק מסוים או המשך הסדרה, מעבר בין פרקים, חזרה לרשימת הסדרות |
| `QA` | `/QA` | שאלות קוראים ותשובות | חיפוש, סינון קטגוריה, פתיחת תשובה, הגשת שאלה חדשה כמשתמש מחובר |
| `Community` | `/Community` | ראשיית מרכזי הקהילה | מעבר לחשיפות אישיות, הוראות חיות וקבוצות דיבור, הצגת תוכן אחרון |
| `CommunityRevelations` | `/CommunityRevelations` | חשיפות אישיות ותגובות | פרסום חשיפה, לייק, פתיחת תגובות, הוספת תגובה, מעבר לפסוק |
| `CommunityLiveTeaching` | `/CommunityLiveTeaching` | אירועי הוראה חיים | צפייה בפרטי מפגש, תאריך, מנחה, תיאור וקישור הצטרפות |
| `DiscussionGroups` | `/DiscussionGroups`, אפשר `?group={name}` | קבוצות לימוד משותפות | בחירת קבוצה, הצטרפות מקומית, צפייה בהודעות, שליחת הודעה |
| `TheologicalInsights` | `/TheologicalInsights` | תובניות תאולוגיות | חיפוש, פתיחת תובנה, שיתוף, שמירה מקומית, מעבר לפסוק |
| `HistoricalInsights` | `/HistoricalInsights` | תובניות היסטוריות | אותה תפודה כמו בתובניות התאולוגיות, עם תוכן היסטורי |
| `VerseOfDay` | `/VerseOfDay` | פסוק מומלץ ליום הנוכחי | בחירת פסוק לפי תאריך, מעבר לפרק, שיתוף |
| `Plan` | `/Plan` | מסלול קריאה של 30 יום | הצגת יום נוכחי ועתידי, סימון התקדמות, פתיחת הפרק המתוכנן |
| `Journal` | `/Journal`, אפשר `?new=1&book={book}&chapter={n}` | יומן תפילה אישי | יצירה, עריכה, מחיקה וסינון לפי קטגוריה; ניתן לפתוח מתוך פרק |
| `BibleNotes` | `/BibleNotes` | מרכז כל הסימונים, הספריות וההערות של הקורא | הצגה לפי סוג, ניווט לפרק ולפסוק, מחיקה או ניהול הסימונים לפי המימוש המלא |
| `Offline` | `/Offline` | מרכז הורדות וניהול אחסון מקומי | הורדת תרגומים ותוכן, בדיקת מצב, ספירת אחסון, מחיקת נתונים |
| `Dashboard` | `/Dashboard` | לוח אישי לקורא מחובר | סטטיסטיקות קריאה, highlights, bookmarks, notes, devotionals, saved prayers, streak ו־activity feed |
| `InstallPrompt` | `/InstallPrompt` | הוראות והפעלת התקנת האפליקציה כ־PWA | זיהוי מערכת הפעלה, הפעלת `beforeinstallprompt`, טיפול ב־`appinstalled` |

### 2.2 עמודי חשבון

| עמוד | נתיב לוגי | תפקיד | פעולות מרכזיות |
|---|---|---|---|
| `Login` | `/Login` | כניסת קורא רגיל | אימיות דוא״ל וסיסמה, הפנה ל־Dashboard, הצגת שגיאה |
| `Signup` | `/Signup` | יצירת חשבון | בדיקת אורך סיסמה, אימות התאמה, תנאי שימוש, רישום, טיפול בדרישת אימות דוא״ל |
| `ForgotPassword` | `/ForgotPassword` | שליחת בקשת איפוס | אימות כתובת דוא״ל והצגת תשובה כללית שאינה חושפת אם קיים חשבון |
| `ResetPassword` | `/ResetPassword?token={token}` | קביעת סיסמה חדשה | קריאת `token` או `access_token`, אימות התאמה, אימות אורך, קריאה ל־`fse2.auth.resetPassword` |
| `Logout` | `/Logout` | סיום התחברות | לאחר כ־900 מילישניות מנתק את המשתמש ומחזיר ל־Home |

### 2.3 עמודי תוכן, ציבוריות וניהול

| עמוד | נתיב לוגי | תפקיד | פעולות מרכזיות |
|---|---|---|---|
| `Contact` | `/Contact` | שליחת פנייה להנהלה | שם, דוא״ל, נושא, הודעה, בדיקת קלט, שליחה דרך `submitContactMessage` |
| `Privacy` | `/Privacy` | מסמך פרטיות | הסבר על נתוני חשבון, נתוני מכשיר, offline, retention ושיתוף |
| `Terms` | `/Terms` | תנאי שימוש | הסבר על שימוש בתוכן, זכויות יוצרים, מקורות התנ"ך ואחריות |
| `Admin` | `/Admin` | כניסת מנהל התוכן | אימות דוא״ל/סיסמה, בדיקת session קיים, הפנה אוטומטית ל־Dashboard, איפוס סיסמה עם reset key |
| `AdminDashboard` | `/AdminDashboard` | מרכז ניהול התוכן | מעבר בין overview, ספרים ופרקים, התקנת Luganda, התקנת KJV+, תוכניות, תפילות, prayer passages, ייבוא ואוספים כלליים; הפעלת audit ו־session management |

### 2.4 דפוסי מסלול חשובים

- בחירת ספר מתמיד משתמשת במספר קנוני `book`, לא בשם, כדי לשמור על יציבות בין אנגלית ולוגנדה.
- פרק נפתח עם `book` ו־`chapter`.
- פסוק ממוקד נפתח עם `verse`.
- לוגנדה מסומנת ב־`lang=lu`.
- קישור לרשומת תוכנית יומית מזוהה לפי `devotional={code}`.
- קישור לסדרת Verse-Song מזוהה לפי `series={name}`.
- חזרה מהתחברות יכולה להעביר `next={encodedPath}`.
- איפוס סיסמה דורש token מה־URL; לא ניתן לאפס סיסמה רק מכתובת דוא״ל.

---

## 3. מפת ניווט לצורך DEBUG

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| חזרה לדף הבית | כל עמוד | לוגו ה־Header | `/` |
| פתיחת ספר | `BibleReader` | כרטיס ספר | מעבר ל־`Chapter` עם `book` ו־`chapter` |
| פתיחת פרק מתוך ספר | `BibleReader` | אריח פרק ב־`ChapterGrid` | `/Chapter?book=...&chapter=...` |
| חיפוש ספר | `BibleReader` | שדה החיפוש | סינון מיידי של 66 הספרים |
| מעבר להברית החדשה | `BibleReader` | לשונית New Testament | גלילה/בחירת ספרים מהמקום |
| פתיחת פסוק מהפרק | `Chapter` | לחיצה על פסוק | בחירת פסוק והצגת `VerseActionBar` |
| פתיחת משאלה או תובנה | `Chapter` | לשונית Q&A/Insights | `PassageTabs` בתוך הפרק |
| פתיחת תפילת פסוק | `Chapter` | לחיצה על Prayer ב־`VerseActionBar` | `PassagePrayer` בתוך הפרק |
| פתיחת הפניות | `Chapter` | לחיצה על Cross-references | `CrossRefList` |
| פתיחת הפניה | `Chapter` | לחיצה על פסוק ב־`CrossRefList` | ניווט ל־`Chapter` עם פסוק יעד |
| שיתוף פסוק | `Chapter` | Share ב־`VerseActionBar` | `ShareSheet` |
| העתקת פסוק | `Chapter` | Copy ב־`VerseActionBar` | Clipboard והודעת “Copied” |
| הדגשת פסוק | `Chapter` | Highlight ב־`VerseActionBar` | יצירת `StudyMark` מסוג highlight |
| סימון פסוק | `Chapter` | Bookmark ב־`VerseActionBar` | יצירת `StudyMark` מסוג bookmark |
| כתיבת הערה | `Chapter` | Note ב־`VerseActionBar` | יצירת `StudyMark` מסוג note |
| פתיחת הגדרת Strong’s | `Chapter` ב־KJV+ | לחיצה על קוד G/H | `StrongsPopup` |
| פתיחת פסוק מהמבוא או התפילה | `BibleReader` | קישור בתוך `AnnotatedText` | `VersePopup` בתוך העמוד |
| מעבר למקום במתאר הספר | `BibleReader` | כותרת ב־`BookOutline` | בחירת קטע מודגש במתאר |
| בחירת יום בתוכנית | `Plan` | כרטיס יום | `/Chapter` עם הפרק המתוכנן |
| פתיחת תוכנית יומית | `Devotionals` | כרטיס או קישור יומן | מודאל תוכנית; לחילוץ מקור ישיר `/Devotionals?devotional=...` |
| סימון תוכנית כהושלמה | `Devotionals` | Done/Complete | יצירה או מחיקת `DevotionalProgress` |
| פתיחת פסוק מתוכנית | `Devotionals` | קישור Scripture | `Chapter` |
| שמירת תפילה | `PrayerLibrary` | כפתור Bookmark | יצירת `PrayerSaved` |
| ביטול שמירת תפילה | `PrayerLibrary` | כפתור שמור/מסומן | מחיקת `PrayerSaved` |
| פתיחת תובנה | `InsightsBoard` | כרטיס תובנה | מודאל תוכן ושיתוף |
| שיתוף תובנה | `InsightsBoard` | ShareRow | רשת חברתית או Clipboard |
| פרסום חשיפה | `CommunityRevelations` | טופס החשיפה | יצירת `Revelation` |
| לייק חשיפה | `CommunityRevelations` | כפתור Heart | עדכון מונה הלייקים |
| פתיחת תגובות | `CommunityRevelations` | כפתור Comments | רשימת תגובות בתוך הכרטיס |
| הוספת תגובה | `CommunityRevelations` | טופס תגובה | יצירת `Revelation` עם `parent_id` |
| בחירת קבוצה | `DiscussionGroups` | כרטיס קבוצה | פתיחת הודעות הקבוצה |
| שליחת הודעה | `DiscussionGroups` | טופס הודעה | יצירת `DiscussionThread` |
| נגן סדרת שירים | `VerseSongs` | Play | הפעלת `PlayerProvider` ו־`GlobalPlayer` |
| המשך נגן מסדרה | `VerseSongSeries` | Play פרק | החלפת המסלול הפעיל בנגן הגלובלי |
| הורדת פרק | `Offline` | כפתור Download ליד תרגום | אחסון ב־IndexedDB |
| מחיקת offline | `Offline` | Clear/Delete | מחיקת stores מהמכשיר |
| כניסת קורא | Header | Sign in | `/Login` |
| יצירת חשבון | Header | Get started/Sign up | `/Signup` |
| יציאה | Header | Logout | `/Logout` ואז `/` |
| כניסת מנהל תוכן | ידנית | `/Admin` | טופס Admin |
| פתיחת מסף הניהול | `Admin` | Sign in | `/AdminDashboard` |
| מעבר לאוסף ניהולי | `AdminDashboard` | תפריט Collections | `CollectionsPanel` |
| יצירת רשומה | `CollectionsPanel` | Add/New | `RecordEditor` |
| עריכת רשומה | `CollectionsPanel` | Pencil | `RecordEditor` |
| מחיקת רשומה | `CollectionsPanel` | Trash | `ConfirmDialog` ואז delete |
| התקנת Luganda | `AdminDashboard` | Install/Download | `lugandaInstall` function |
| התקנת KJV+ | `AdminDashboard` | Install/Download | `kjvInstall` function |
| הפקת דוח ספרייה | `AdminDashboard` | Audit/Report | `scriptureAudit` function |
| העלאת JSON כללי | `AdminDashboard` | Import JSON | `JsonImportPanel` |
| העלאת תפילות והפניות | `AdminDashboard` | Prayer Passages Import | `PrayerCrossRefImport` |

### 3.1 נקודות חיפוש ב־URL בזמן דיבאג

| פרמטר | היכן משמש | ערךים צפויים |
|---|---|---|
| `book` | `Chapter`, `BibleNotes`, `Journal`, `Plan` | מספר ספר 1 - 66 |
| `chapter` | `Chapter`, `Journal` | מספר פרק חיובי |
| `verse` | `Chapter`, `BibleNotes` | מספר פסוק |
| `lang` | `Chapter`, `ChapterGrid` | `en` או `lu` |
| `devotional` | `Devotionals` | קוד תוכנית, למשל `D-001` |
| `series` | `VerseSongSeries` | שם סדרה מלא |
| `group` | `DiscussionGroups` | שם קבוצה |
| `new` | `Journal` | `1` לפתיחת טופס חדש |
| `token` / `access_token` | `ResetPassword` | token איפוס מתקף |
| `next` | `Login` | נתיב חזרה מקודד |

---

## 4. מבנה קבצים

### 4.1 קבצי עמודים

כל קובץ `pages/PageName.jsx` מייצג עמוד ניתוב עצמאי. התפקידים המפורטים בסעיף 2:

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

### 4.2 רכיבי ניהול

| קובץ | אחריות | מה מרונדר |
|---|---|---|
| `components/admin/ChapterCoverage.jsx` | מציג כיסוי פרקים לפי ספר | רשת ספרים, טווחי פרקים חסרים/שבורים, מצב השלמה ופירוט נפתח |
| `components/admin/CollectionsPanel.jsx` | מנהל רשומות של אוספים לפי מטא־נתונים | בחירת אוסף, חיפוש, טבלה, הוספה, עריכה, מחיקה |
| `components/admin/ConfirmDialog.jsx` | אישור פעולה הרסנית | מודאל Delete עם כפתורי אישור וביטול |
| `components/admin/CrossRefEditor.jsx` | עריכת רשימת הפניות כ־chips | הוספה, הסרה, מניעת כפילויות case-insensitive |
| `components/admin/JsonImportPanel.jsx` | ייבוא JSON גמיש לאוספים | בחירת קובץ, preview, validation, aliases, upsert ודוח התקדמות |
| `components/admin/KjvPlusInstaller.jsx` | התקנת KJV+ ומילון Strong’s | סטטוס, כיסוי פרקים, הפעלת התקנה ודוח audit |
| `components/admin/LibraryReport.jsx` | דוח מצב ספרייה | כיסוי, פרקים שבורים, פערי מספר פסוקים ומצב Strong’s |
| `components/admin/LugandaInstaller.jsx` | התקנת תנ"ך לוגנדה | הפעלת install, סטטוס, כיסוי ורשימת פרקים חסרים |
| `components/admin/PrayerCrossRefImport.jsx` | ייבוא תפילות והפניות לפי ספר | הורדת template, בדיקה מוקדמת, progress ו־upsert |
| `components/admin/PrayersPanel.jsx` | מנהל ספריית התפילות ו־PrayerPassage | שני מצבים: ספרייה ומעברי פסוקים; חיפוש, סינון ו־CRUD |
| `components/admin/RecordEditor.jsx` | טופס גנרי ליצירה ועריכה | שדות text, textarea, number, boolean ו־refs |

### 4.3 רכיבים כלליים

| קובץ | אחריות | מה מרונדר |
|---|---|---|
| `components/common/EmptyState.jsx` | מצב ריק אחיד | אייקון, כותרת, תיאור ו־action |
| `components/common/Modal.jsx` | מודאל כללי | כותרת, תת־כותרת, תוכן, footer, סגירה ב־Escape ונעילת גלילת body |
| `components/common/PageHeader.jsx` | header אחיד לעמודים | גרסת hero עם תמונה או גרסת section פשוטה |
| `components/common/Pagination.jsx` | מפהח עמודים | קיצורי טווח עם אליפס וניווט קודם/הבא |
| `components/common/ShareRow.jsx` | כפתורי שיתוף | Facebook, WhatsApp, Telegram, Instagram, LinkedIn ו־Copy |
| `components/common/Spinner.jsx` | מצב טעינה | spinner עם `role="status"` ו־`aria-live` |

### 4.4 רכיבי קהילה, דשבורד ותוכן

| קובץ | אחריות | מה מרונדר |
|---|---|---|
| `components/community/CommentThread.jsx` | רשימת תגובות וטופס תגובה | תגובות מסוננות ב־`safeText`, כפתורי לייק ושליחה |
| `components/community/RevelationCard.jsx` | כרטיס חשיפה | מחבר, פסוק, כותרת, גוף, לייקים ותגובות |
| `components/community/RevelationForm.jsx` | יצירת חשיפה | טופס מחובר/לא מחובר, אימות שדות וניקוי לאחר הצלחה |
| `components/community/ThreadMessages.jsx` | הודעות בקבוצת דיבור | רשימת הודעות וטופס שליחה |
| `components/dashboard/ActivityFeed.jsx` | פיד פעילות קריאה | 12 פעילויות אחרונות, polling כל 30 שניות |
| `components/home/StatCard.jsx` | כרטיס מדד | label, value, hint ואייקון |
| `components/insight/InsightsBoard.jsx` | לוח תובניות | מיזוג live/seed, חיפוש, מודאל, שיתוף ושמירה מקומית |
| `components/journal/JournalCard.jsx` | כרטיס רשומת יומן | קטגוריה, כותרת, גוף, תאריך, עריכה ומחיקה |
| `components/journal/JournalForm.jsx` | טופס יומן | כותרת, גוף, קטגוריה, ספר ופרק |
| `components/plan/PlanRow.jsx` | שורת יום בתוכנית | מצב completed/current/upcoming וקישור לפרק |

### 4.5 רכיבי Layout

| קובץ | אחריות | מה מרונדר |
|---|---|---|
| `components/layout/AppHeader.jsx` | header רספונסיבי | לוגו, ניווט ראשי ומשני, התחברות, משתמש, donate ותפריט נייד |
| `components/layout/AppFooter.jsx` | footer וקישורים מהירים | לוגו עם fallback, קישורי ספריות, תרומה ומידע משפטי |
| `components/layout/GlobalPlayer.jsx` | נגן אודיו גלובלי | mini player ו־expanded sheet, seek, volume, speed, shuffle ו־repeat |
| `components/layout/PwaHead.jsx` | רישום metadata ו־service worker | meta tags, manifest, icons, Apple touch icon ו־SW registration |
| `Layout.jsx` | מעטפת האפליקציה | `AuthProvider`, `ThemeProvider`, `PlayerProvider`, Header, main, Footer ו־GlobalPlayer |

### 4.6 רכיבי הקורא

| קובץ | אחריות | מה מרונדר |
|---|---|---|
| `components/read/AnnotatedText.jsx` | טקסט עם הדגשה וקו תחתון | בחירת טקסט, חלונית צבעים, segments לפי offsets ו־inline nodes |
| `components/read/BookGrid.jsx` | רשת ספרים | חיפוש, החלפת ברית וגלילה למקום |
| `components/read/BookIntro.jsx` | מבוא לספר | עובדת ספר, טקסט מסומן ומקרי מפתח |
| `components/read/BookOutline.jsx` | מתאר הספר | כותרות, טווחי פסוקים ובחירת מקטע |
| `components/read/BookPrayerPanel.jsx` | תפילת הספר | החלפת אנגלית/לוגנדה, הפניות inline ותפילות קשורות |
| `components/read/BookSidebar.jsx` | חלונית הספר | מבוא, מתאר ותפילה, עם tabs נגישים |
| `components/read/BookStudyResources.jsx` | משאבי לימוד ברמת הספר | פירוש, תובנה תאולוגית והיסטורית, pagination ו־fallback |
| `components/read/ChapterClosingPrayer.jsx` | תפילת סיום הפרק | תפילה מלאה, סימון שפה, הפניה, share וכפתור תפילה חוזרת |
| `components/read/ChapterGrid.jsx` | רשת פרקים | אריח לכל פרק עם מצב נבחר |
| `components/read/ChapterReaderPane.jsx` | מעטפת עמוד הפרק | תפריט מחקר, tabs, panel רספונסיבי ו־wide-screen layout |
| `components/read/ChapterResourcesPanel.jsx` | תובניות הפרק | תובניה תאולוגית/היסטורית, fallback לרמת הספר וטקסט מסומן |
| `components/read/ChapterSelector.jsx` | בורא המסך של מספר הספרים | הזכרון של הספר, sidebar, grid, משאבים ו־VersePopup |
| `components/read/ChapterSidebar.jsx` | מחקר לצד פרק | מבוא, פירוש, תפילה והפניות |
| `components/read/CrossRefList.jsx` | הפניות לפסוק | הפניות ישירות והפניות אחרות באותו פרק, עם טקסט והערה |
| `components/read/FloatingVerse.jsx` | חלונית פסוק צפה | פסוק, סגירה וקישור למקום מלא בקורא |
| `components/read/PassagePrayer.jsx` | תפילה המתאימה לפסוק | התאמת reference, בחירת שפה, הדגשות ופתיחת הפניה |
| `components/read/PassageTabs.jsx` | פירוש ותובניות לפסוק | Commentary, theological, historical ו־Q&A |
| `components/read/ShareSheet.jsx` | גיליון שיתוף | חלקי הטקסט, העתקה מלאה ורשתות חברתיות |
| `components/read/StrongsPopup.jsx` | מילון Strong’s | הגדרה, מקור, מצב טעינה ושמירה offline |
| `components/read/StrongsText.jsx` | הצגת קודי Strong’s | הפרדת קודי G/H מהפסוק והצגתם כ־superscript אינטראקטיבי |
| `components/read/VerseActionBar.jsx` | פעולות פסוק | תפילה, הפניות, פירוש, highlight, bookmark, note, share ו־copy |
| `components/read/VerseList.jsx` | רשימת פסוקים בסגנון פשוט | בחירת פסוק והדגשת מספרו |
| `components/read/VersePopup.jsx` | קריאת פסוק בתוך העמוד | טעינת פרק, בחירת טווח, הדגשות ופתיחת מקור |
| `components/read/VersionPicker.jsx` | התקנה והחלפת תרגום | בחירת גרסה, התקנה, uninstall ו־active version |

### 4.7 ספריות `lib/`

| קובץ | תפקיד |
|---|---|
| `lib/activity.js` | רישום פעילות קורא בצורה עמידה שאינה מפרקת את המסך |
| `lib/adminCollections.js` | מטא־נתונים של אוספי הניהול, שדות ועזרי יצירת רשומה |
| `lib/adminDirect.js` | הטמעת API ניהול ישיר דרך entity SDK כחלופה ל־function gateway |
| `lib/adminSession.js` | ניהול session מנהל, token, חידוש ומעבר בין server mode ל־direct mode |
| `lib/app-params.js` | קריאת app id ו־token בזמן אמת מ־`localStorage` |
| `lib/AuthContext.jsx` | הצטברות מצב המשתמש הרגיל ופעולות login/logout |
| `lib/bibleApi.js` | טעינת פרקים, בחירת מקור, timeout, offline fallback ו־Strong markers |
| `lib/bibleBooks.js` | נתוני 66 הספרים: מספר, שם, קיצור, לוגנדה ומספר פרקים |
| `lib/bookGuides.js` | מבוא ומתאר לכל ספר |
| `lib/bookPrayers.js` | תפילה לכל ספר בשתי שפות |
| `lib/bookStudyContent.js` | תוכן לימוד בסיסי לכל ספר |
| `lib/brandCss.js` | מערכת CSS מרכזית ומשתני המותג |
| `lib/chapterStudy.js` | בניית מבוא, פירוש, תפילה והפניות לפרק מתוך מקורות מגוונים |
| `lib/contentApi.js` | מתאם אחיד לקריאת אוספים ציבוריים והגשת תוכן |
| `lib/crossRefs.js` | הפניות מוכרות הממוקדות ב־פסוקים פופולריים |
| `lib/format.js` | עיצוב טקסט, תאריכים, משכים, רשימות ו־safe text |
| `lib/keyPassages.js` | פסוקי מפתח לכל ספר |
| `lib/luganda.js` | פיצול וניקוי תוכניות לוגנדה |
| `lib/offlineDb.js` | מעטפת IndexedDB, stores, migration וגיבוי מקומי |
| `lib/planData.js` | תוכנית fallback של 30 יום |
| `lib/player.jsx` | queue ו־Audio element גלובליים |
| `lib/prayerImport.js` | template, validation ו־import של קובצי תפילות לפי ספר |
| `lib/prayerPassages.js` | מפתחות טבעיים, איחוד, התאמת פסוקים והפניות לפרק |
| `lib/reading.js` | חישוב תאריכים, ימים ו־streaks |
| `lib/readings.js` | שמירת התקדמות קריאה וסגירת יום בתוכנית |
| `lib/scriptureRefs.js` | parsing ו־resolution של הפניות תנ"ך |
| `lib/seedContent.js` | תוכן seed לתוכניות, תפילות, תובניות, קהילה ושירים |
| `lib/sha256.js` | מימוש SHA-256 נייד לבדיקת hash בדפדפן |
| `lib/share.js` | בניית קישורי שיתוף והעתקת טקסט |
| `lib/strongs.js` | נרמול קודי Strong’s ועזרי תצוגה/מקור |
| `lib/strongsOffline.js` | קריאה וכתיבה של הגדרות Strong’s במכשיר |
| `lib/studyAnnotations.js` | merge, save ו־remove של הדגשות/קווי תחתון |
| `lib/textSelection.js` | זיהוי אם הקליק התרחש בתוך טקסט שנבחר |
| `lib/themeContext.jsx` | טעינת `SiteSettings` והפקת גוונים מבוססים |
| `lib/theme.js` | קבועי מותג, לוגו, favicon, תמונות hero וקישורי תרומה |
| `lib/versions.js` | הגדרת תרגומים, התקנת גרסה ו־active version |

### 4.8 קבצי backend

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | כניסת מנהל, hash סיסמה, session token, חידוש, ביטול ואיפוס |
| `functions/adminContent.js` | API ניהול תוכן מוגן לפי session token |
| `functions/bibleChapter.js` | הפעלת מקורות חיצוניים לפרק אנגלי או לוגנדה |
| `functions/content.js` | קריאת אוספים ציבוריים וקבלת הגשות ציבוריות |
| `functions/kjvInstall.js` | התקנת פרקי KJV+ עם Strong’s |
| `functions/lugandaInstall.js` | התקנת פרקי התנ"ך לוגנדה |
| `functions/scriptureAudit.js` | ביקורת לקריאה בלבד של כיסוי ואיכות הספרייה |
| `functions/strongsDefinition.js` | מילון Strong’s מקומי ומילוי מקוונות מהמקורות הציבוריים |
| `cron/scriptureInstall.js` | worker שעובר כל שעה ומשלים פרקים חסרים |
| `public/sw.js` | service worker: cache-first ל־shell/תמונות ו־network-first לנתונים |
| `public/manifest.json` | manifest של PWA, צבעים, icons ו־start URL |

### 4.9 קבצים שאינם מופיעים בקוד שסופק

שני קבצים מרכזיים מופנים אך אינם נמצאים ברשימת המקור:

- `api/fse2Client.js`  -  כנראה wrapper מרכזי סביב ה־FSe2 SDK.
- `utils.js` או קובץ דומה  -  מספק `createPageUrl()`.

יישום שינוי בנתיבים או בהרשאות יכול להשפיע על שניהם.

### 4.10 קבצי נכסים וקבצים שנוצרו אוטומטית

- `__generated/tailwind.css`  -  CSS Tailwind מצומצם שנוצר אוטומטית. אין לערוך אותו ידנית; יש לשנות את מקור ה־Tailwind ולבנות מחדש.
- `public/assets/generated_*.png`  -  תמונות גנריות בשמות hash:
  - `generated_022a23b6.png`
  - `generated_0f91fdf8.png`
  - `generated_5fe46b6c.png`
  - `generated_703e129d.png`
  - `generated_8b82ca52.png`
  - `generated_a74541e8.png`
  - `generated_aa744f7a.png`
  - `generated_c990bd6c.png`
  - `generated_f0778e1c.png`
- `public/assets/ingested/media_0fc9eec909.png`
- `public/assets/ingested/media_7a14bfc357.xicon`
- `public/assets/media-library/`  -  נכסי מדיה, לוגו, favicon, template ומסמכי עזרה. הקבצים המוזהרים במפורש:
  - `0dbaf742d3ba_Prayer-Crossrefs-Template.json`
  - `5754e40e4a9f_Finestructure-Prompt-Prayer-CrossRefs-Bulk-Import.md`
  - `9865967db356_Pray-Read-Bible-Prompt-3-Bible-Reader-Rebuild.pdf`
  - `b50e6c213bb8_pray-read-pneuma-main-3.zip`
  - `b8660c2286d0_PrayRead-logo-2.png`
  - `ee6ae196bbbc_favicon.ico`
  - `f438ed2a3a0d_Pray-Read-Bible-Master-Prompt-For-Finestructure-Ai.pdf`
  - `f4ad877aa93e_WhatsApp-Image-2026-11-23-at-4-49-46-PM.jpeg`
  - `f830b722d892_OBADIAH-PRAY-READ-BULK-IMPORT.json`
  - `4345fa1c4c79_icon-512x512.png`
  - שאר קבצי `*_image.png` הם תמונות cover/דמו שאינן ממופים בקובץ מרכזי; יש לאתר את השימוש בהם לפני שינוי שם או מחיקה.

### 4.11 `__trash/` ו־`__url_fetch/`

`__trash/` כולל גרסאות קוד ישנות, דפי בדיקה ו־probe files. למשל:

- `components/home/TodayCard.jsx`
- `components/home/WeekStrip.jsx`
- `components/layout/Sidebar.jsx`
- `components/layout/SignInBanner.jsx`
- `components/read/BookPicker.jsx`
- `components/read/ReflectionPanel.jsx`
- `pages/Read.jsx`
- `pages/Insights.jsx`
- `pages/AdminDiag.jsx`
- `pages/AdminSmoke.jsx`
- `pages/ImportPreview.jsx`
- `pages/InstallerCheck.jsx`
- `pages/StrongsPopupTest.jsx`
- `functions/adminProbe.js`
- `functions/probeChapter.js`
- `functions/probeSources.js`
- `functions/tmpAuthProbe.js`
- `functions/tmpSessionProbe.js`

`__url_fetch/` מכיל snapshots של:

- Bible API.
- Wordplanet.
- Bolls.
- Blue Letter Bible.
- Open Scriptures.
- Fine Structure.
- מסמכי PDF/ZIP ו־HTML ששימשו למחקר.

הקבצים אינם חלק מ־bundle או מ־service worker, אך הם מגדילים את מאגר המקור ועלולים לחשוף מידע מחקר או נכסים לא רלוונטיים. מומלץ להעביר אותם למאגר חיצוני או לנקות אותם לפני release.

---

## 5. מודל הנתונים  -  Entities

### 5.1 עקרונות המודל

- רוב ה־entities מוגדרים ב־`entities/*.json`.
- אין בקוד שראלה Foreign Key מפורש; הקשרים נשמרים באמצעות:
  - `owner_email`
  - `book_number`
  - `chapter`
  - `verse`
  - `devotional_code`
  - `prayer_title`
  - `group_name`
  - `parent_id`
- ה־ACL נמצא ב־`x-fse2-access`.
- התפקידים:
  - `"*"`  -  קריאה ציבורית.
  - `owner`, `admin`  -  ניהול.
  - `user`, `authenticated`  -  פעולות משתמש מחובר.
- חלק מה־entities החדשים משתמשים בפורמט policy מסוג `version: 2`.

### 5.2 ישויות ניהול ופעילות

#### `ActivityLog`

- **מטרה:** יומן פעולות בממשק הניהול.
- **שדות:** `actor`, `action`, `section`, `detail`.
- **קשרים:** ללא קשר ישיר; מתעד את הפעולה בטקסט ובמטא־נתונים.
- **הרשאות:** קריאה וכתיבה רק ל־owner/admin.

#### `AdminAccount`

- **מטרה:** זהות נפרדת למנהל תוכן.
- **שדות:** `email`, `password_hash`, `salt`, `secret`, `session_version`, `updated_date`.
- **קשרים:** משמש את `adminAuth`, `adminContent` ו־session tokens.
- **הרשאות:** owner/admin בלבד.
- **הערה:** שדות `secret`, `salt` ו־`password_hash` הם רגישים ואינם אמורים להופיע בלוגים או בתשובות API.

### 5.3 תוכן ציבורי

#### `BibleVerse`

- **מטרה:** פסוק בודד באנגלית ובלוגנדה.
- **שדות מרכזיים:** `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu`.
- **קשרים:** מזוהה לפי `book_number + chapter + verse`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `Commentary`

- **מטרה:** פירוש רמת פרק.
- **שדות:** `book`, `chapter`, `title`, `body_en`, `body_lu`.
- **קשרים:** לספר לפי שם/מספר ולפרק.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `ContactMessage`

- **מטרה:** פנייה שנשלחה מטופס Contact.
- **שדות:** `name`, `email`, `subject`, `message`, `is_read`, `reply`.
- **קשרים:** ניהול תשובה ידני על ידי admin.
- **הרשאות:** כל גורם יכול ליצור; רק admin יכול לקרוא, לעדכן או למחוק.

#### `CrossReference`

- **מטרה:** הפניה מפסוק אחד לפסוק אחר.
- **שדות מקור:** `book_number`, `chapter`, `verse`.
- **שדות יעד:** `ref_book_number`, `ref_chapter`, `ref_verse`.
- **שדות תצוגה:** טקסט והערה בעברית ובלוגנדה, כגון `ref_text_en`, `ref_text_lu`, `note_en`, `note_lu`.
- **קשרים:** מקור ויעד שניהם מקביעים לפי מספר ספר/פרק/פסוק.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `Devotional`

- **מטרה:** תוכנית יומית דו־לשונית.
- **שדות מרכזיים:** `code`, `title`, `title_lu`, `scripture`, `scripture_lu`, `body`, `body_lu`, `related`, `further_readings`, `cover_image`, `category`.
- **קשרים:** `code` מקשר ל־`DevotionalProgress`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `DiscussionGroup`

- **מטרה:** קבוצת לימוד קהילתית.
- **שדות:** `name`, `description`, `schedule`, `member_count`.
- **קשרים:** `DiscussionThread.group_name` מקשר אל `name`.
- **הרשאות:** קריאה ציגורית; כתיבת admin.

#### `DiscussionThread`

- **מטרה:** הודעה בקבוצת דיבור.
- **שדות:** `group_name`, `owner_email`, `author_name`, `title`, `body`.
- **קשרים:** לקבוצה לפי `group_name`; למשתמש לפי `owner_email`.
- **הרשאות:** קריאה ציבורית; כתיבה למשתמש מחובר.

#### `Insight`

- **מטרה:** תובנה תאולוגית או היסטורית.
- **שדות:** `kind`, `title`, `passage`, `excerpt`, `body`, `share_count`.
- **קשרים:** `kind` אמור להיות `theological` או `historical`; ה־passage הוא טקסט חופשי שנפרש על ידי `scriptureRefs`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `LiveSession`

- **מטרה:** מפגש הוראה חי עתידי.
- **שדות:** `title`, `session_date`, `host`, `join_link`, `description`.
- **קשרים:** אין קשר FK; משמש התראה/עמוד קהילה.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `Prayer`

- **מטרה:** תפילה מספריית תפילות הכללית.
- **שדות:** `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref`, `cross_refs`.
- **קשרים:** `scripture_ref` מפנה לפסוק; `cross_refs` הוא רשימת הפניות בתוך השדה, לא בהכרח קשר ל־`CrossReference`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `PrayerPassage`

- **מטרה:** תפילה המשויכת לפרק, טווח פסוקים או פסוק יחיד.
- **שדות:** `book_number`, `book_name`, `chapter`, `verse`, `verse_end`, `title_en`, `title_lu`, גוף התפילה באנגלית ובלוגנדה ושדה מקור/הפניה.
- **קשרים:** פסוק `0` מייצג פרק שלם; `verse_end` מגדיר טווח.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `ReadingPlan`

- **מטרה:** יום בתוכנית הקריאה.
- **שדות:** `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture`.
- **קשרים:** `day` מקשר ל־`Reading.plan_day`.
- **הרשאות:** קריאה ציגורית; כתיבת admin.

#### `Revelation`

- **מטרה:** חשיפה אישית או תגובה לחשיפה.
- **שדות:** `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id`.
- **קשרים:** `parent_id` יוצר קשר עצמי בין חשיפה לתגובות.
- **הרשאות:** קריאה ציבורית; כתיבה למשתמש מחובר.

#### `SiteSettings`

- **מטרה:** הגדרות אתר גלובליות.
- **שדות:** `setting_key`, `setting_value`.
- **קשרים:** אין; מפתחות כגון `site_name`, `ivory`, `emerald`, `gold` ו־`donate_url`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `VerseOfDay`

- **מטרה:** פסוק מומלץ לתאריך מסוים.
- **שדות:** `verse_date`, `reference`, `text_en`, `text_lu`, `note`.
- **קשרים:** נבחר לפי תאריך.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `VerseSongSeries`

- **מטרה:** סדרת Verse-Song.
- **שדות:** `name`, `description`, `thumbnail`, `cover_image`, `accent`.
- **קשרים:** `VerseSongEpisode.series_name` מקשר אל `name`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `VerseSongEpisode`

- **מטרה:** פרק אודיו בתוך סדרת Verse-Song.
- **שדות:** `series_name`, `title`, `verse_ref`, `duration_label`, `duration_seconds`, `audio_url`, `audio_key`, `thumbnail`, `episode_order`.
- **קשרים:** לסדרה לפי `series_name`.
- **הרשאות:** קריאה ציגורית; כתיבת admin.

### 5.4 ישויות תנ"ך מותקנות

#### `KjvPlusChapter`

- **מטרה:** פרק KJV עם סימוני Strong’s.
- **שדות:** `book_number`, `book`, `chapter`, `verse_count`, `verses`.
- **`verses`:** מחרוזת JSON המכילה את הפסוקים.
- **מפתח טבעי:** `book_number + chapter`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `LugandaChapter`

- **מטרה:** פרק תנ"ך בלוגנדה.
- **שדות:** `book_number`, `book`, `chapter`, `verse_count`, `verses`.
- **מפתח טבעי:** `book_number + chapter`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

#### `StrongEntry`

- **מטרה:** הגדרת מילה לפי קוד Strong’s.
- **שדות:** `code`, `language`, `original_word`, `transliteration`, `pronunciation`, `part_of_speech`, `root_word`, `definition`, `source`.
- **קשרים:** `code` מקשר לקוד שמוצג בפסוק.
- **הרשאות:** הקריאה ציבורית; הכתיבה נעשית דרך cache/function ובהתאם להרשאות ה־entity.
- **הערה:** ה־code מנורמל, כך ש־`H0436` ו־`H436` מייצגים את אותה מילה.

### 5.5 ישויות משתמש

#### `DevotionalProgress`

- **מטרה:** סימון תוכנית יומית כהושלמה.
- **שדות:** `owner_email`, `devotional_code`, `completed_date`.
- **קשרים:** למשתמש לפי `owner_email`; לתוכנית לפי `devotional_code`.
- **הרשאות:** משתמש מחובר.

#### `JournalEntry`

- **מטרה:** רשומת יומן תפילה.
- **שדות:** `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood`.
- **קשרים:** למשתמש לפי `owner_email`; לספר/פרק דרך שדות לוגיקיים.
- **הרשאות:** משתמש מחובר.

#### `PrayerSaved`

- **מטרה:** תפילה שנשמרה במועדפי המשתמש.
- **שדות:** `owner_email`, `prayer_title`.
- **קשרים:** ל־`Prayer.title` לפי כותרת.
- **הרשאות:** משתמש מחובר.

#### `Reading`

- **מטרה:** התקדמות קריאה של פרק.
- **שדות:** `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses`.
- **קשרים:** `plan_day` מקשר ל־`ReadingPlan.day`.
- **הרשאות:** משתמש מחובר.

#### `ReadingActivity`

- **מטרה:** פעילות קריאה לצורך פיד בדשבורד.
- **שדות:** `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse`.
- **סוגי פעילות:** `chapter_visit`, `highlight`, `bookmark`, `note_saved`, `prayer_opened`, `devotional_access`.
- **קשרים:** למשתמש לפי `owner_email`.
- **הרשאות:** משתמש מחובר.

#### `StudyAnnotation`

- **מטרה:** הדגשה או קו תחתון במבוא, מתאר, תפילת ספר או פסוק בתוך popup.
- **שדות:** `owner_email`, `book_number`, `book`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset`.
- **מפתח טבעי:** ספר + section + block + kind + offsets.
- **הבדל מ־`StudyMark`:** `StudyAnnotation` הוא annotation רב־טקסטואלי; `StudyMark` הוא פעולה ברמת פסוק.
- **הרשאות:** משתמש מחובר.

#### `StudyMark`

- **מטרה:** highlight, bookmark או note ברמת פסוק.
- **שדות:** `owner_email`, `mark_type`, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text`.
- **קשרים:** למשתמש לפי `owner_email`; לפרק לפי מספר ספר/פרק/פסוק.
- **הרשאות:** משתמש מחובר.

### 5.6 ישויות קהילה

#### `QAEntry`

- **מטרה:** שאלת קורא ותשובת הנהלה.
- **שדות:** `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email`.
- **קשרים:** `passage_ref` מפנה לפסוק; `author_email` מזהה את השואל.
- **הרשאות:** קריאה ציבורית; authenticated יכולים ליצור; admin מנהלים את התשובה והסטטוס.

### 5.7 קשרים מרכזיים בין ישויות

```text
Devotional.code       → DevotionalProgress.devotional_code
ReadingPlan.day       → Reading.plan_day
Prayer.title          → PrayerSaved.prayer_title
PrayerPassage.book/chapter/verse → Bible chapter/verse
CrossReference source → target Bible verse
Revelation.parent_id  → Revelation.id (תגובה לחשיפה)
DiscussionThread.group_name → DiscussionGroup.name
StudyMark/StudyAnnotation.owner_email → משתמש מחובר
KjvPlusChapter/LugandaChapter.book_number + chapter → פרק מותקן
```

---

## 6. תהליכים ואינטראקציות מרכזיות

### 6.1 כניסת קורא רגיל

1. המשתמש נכנס ל־`Login` או `Signup`.
2. `fse2.auth.login()` או `fse2.auth.register()` מבצע אימות.
3. `AuthProvider` טוען את המשתמש עם `fse2.auth.me()`.
4. לאחר הצלחה המשתמש מופנה ל־`Dashboard`.
5. רשומות משתמש נטענות עם `enabled: !!email`, כך שהן לא נשלפים כשאין משתמש.
6. ה־Bearer/session token של הפלטפורמה נשמר במקום שה־SDK מגדיר; `appParams` קורא אותו בזמן אמת מ־`localStorage`.

### 6.2 כניסת מנהל תוכן

המנהל אינו נכנס דרך `AuthContext`. לכן יש שני מסלולים:

#### מסלול server

1. `adminSignIn()` שולח דוא״ל וסיסמה ל־`adminAuth`.
2. השרת בודק salted SHA-256.
3. נוצר token חתום המכיל זמן תפוגה וגרסת session.
4. ה־token נשמר ב־`localStorage`.
5. `adminContent` מאמת את ה־token לפני כל פעולת תוכן.
6. `ensureFreshAdminToken()` מחדש את ה־session לפני משימות ארוכות.

#### מסלול direct

אם function gateway אינו זמין לדפדפן:

1. `adminDirect` קורא את `AdminAccount` דרך entity SDK.
2. הוא משתמש ב־`sha256Hex` מהדפדפן.
3. פעולות ה־CRUD מתבצעות ישירות מול entities בהרשאות המשתמש המחובר.
4. תשובות שני המסלולים אמורות לשמור על אותו מבנה על מנת שה־panels לא ידעו איזה מסלול הפעיל.

### 6.3 פתיחת פרק בקורא

1. המשתמש בוחר ספר מ־`BookGrid`.
2. `ChapterGrid` יוצר קישור עם `book` ו־`chapter`.
3. `Chapter` קורא את הפרמטרים ואת גרסת התרגום הפעילה.
4. `fetchChapter()` מנהל את מקורות הפרק:
   - נתוני entity מותקנים.
   - מקור חיצוני עם timeout.
   - נתוני offline מקומיים כגיבוי.
5. הפרק מוחזר כ־רשימת פסוקים עם `verse` ו־`text`.
6. אם הטקסט כולל קודי G/H, `StrongsText` מציג אותם כ־superscript.
7. הפערת הפרק נרשמת ב־`ReadingActivity`.
8. סימון השלמה נשמר ב־`Reading` דרך `recordReading`.
9. אם הפרק משתייך לתוכנית, `plan_day` נסגר אוטומטית.

### 6.4 שמירת סימון בפסוק

1. המשתמש בוחר את `VerseActionBar`.
2. בוחר Highlight, Bookmark או Note.
3. נוצר `StudyMark` עם:
   - מזהה בעלים.
   - ספר, פרק ופסוק.
   - צבע או טקסט הערה.
4. הרשומה מופיעה ב־`BibleNotes` וב־Dashboard.
5. הפעולה נרשמת ב־`ReadingActivity`.

### 6.5 הדגשת טקסט ארוך

1. `AnnotatedText` מקבל טקסט ו־annotations לפי `block_id`.
2. המשתמש בוחר תווים.
3. ההיסט מחשב את `start_offset` ו־`end_offset`.
4. `AnnotatedText` מציג toolbar לבחירת צבע או underline.
5. `studyAnnotations.saveAnnotation()` שומר:
   - בשרת עבור משתמש מחובר.
   - ב־IndexedDB כדי לשרוד offline ולאורח.
6. בעת טעינה `mergeAnnotations()` ממזג שרת ו־local ומנטרל כפילויות.

### 6.6 תפילה והפניות לפסוק

1. המשתמש לוחץ Prayer או Cross-references ב־`VerseActionBar`.
2. `PassagePrayer` מחפשת תפילות שה־`scripture_ref` שלהן תואם לספר, פרק ופסוק.
3. אם אין התאמה מדויקת, ניתן להשתמש ב־fallback מה־seed content.
4. `CrossRefList` מציג הפניות ישירות לפסוק; אם אין, מוצגות הפניות אחרות בפרק.
5. לחיצה על הפניה סוגרת את הפנל ונכנסת ל־Chapter עם פסוק יעד.
6. הפעולות משתמשות ב־`normalisePassage`, `normaliseCrossRef` ו־`passageNaturalKey` כדי למנוע כפילויות.

### 6.7 פתיחת מילון Strong’s

1. `StrongsText` מזהה קוד בתבנית `(G2424)` או `(H436)`.
2. הקוד מנורמל ל־`G2424`/`H436`.
3. `StrongsPopup` מחפש קודם ב־IndexedDB.
4. אם אין, הוא מנסה entity/function מותקן.
5. אם אין גם כן, `strongsDefinition` מאחזר מהמילונים הציבוריים.
6. התוצאה נשמרת במסד הנתונים ובמכשיר, כך שהפעם הבאה מושגת מיד.
7. כפתור מקור חיצוני מאפשר לפתוח את הערך המלא ב־Blue Letter Bible.

### 6.8 ייבוא תפילות והפניות לפי ספר

1. המנהל מוריד את template מה־media library.
2. המנהל בוחר קובץ JSON המתאר לספר אחד.
3. `validatePrayerFile()` בודק:
   - פורמט.
   - מספר ספר.
   - קיום טקסט בשתי שפות.
   - טווחי פסוקים.
   - תקינות הפניות.
4. אם קיימת שגיאה, הייבוא נעצר וכל הבעיות מוצגים.
5. אם הקובץ תקין, מתבצע upsert לפי מפתח טבעי:
   - תפילה לפי ספר/פרק/פסוק/טווח/כותרת.
   - הפניה לפי פסוק מקור ופסוק יעד.
6. המסך מציג progress ודוח סיכום.
7. אותו קובץ ניתן להעלות שוב; רשומות קיימות יתעדכנו ולא יוכפלו.

### 6.9 ניהול אוסף כללי

1. `CollectionsPanel` קורא את המטא־נתונים מ־`adminCollections`.
2. בחירת אוסף מחזירה את שדות הטופס.
3. טעינת הרשומות מתבצעת עם `callAdminData("list", { entity, limit: 500 })`.
4. Add או Pencil פותחים את `RecordEditor`.
5. `RecordEditor` מייצר שדה לפי סוג:
   - text
   - textarea
   - number
   - boolean
   - refs
6. שדה refs משתמש ב־`CrossRefEditor`.
7. Delete דורש אישור ב־`ConfirmDialog`.
8. לאחר שמירה מוצג notice והרשומות נטענות מחדש.

### 6.10 התקנת התנ"ך

1. המנהל לוחץ Install או Download.
2. הלקוח קורא ל־`ensureFreshAdminToken()`.
3. נשלחת בקשה ל־`lugandaInstall` או `kjvInstall` עם action ו־token.
4. השרת מאמת את ה־session או את install key.
5. השרת קורא את הפרקים שכבר קיימים.
6. רק פרקים חסרים מורדדים.
7. כל פרק נשמר עם `book_number`, `chapter`, `verse_count` ו־JSON של פסוקים.
8. התקדמות מדווחת ללקוח.
9. הריצה ניתנת לחזרה; כשל נקודתי מנסה שוב בהרצה הבאה.
10. `ChapterCoverage` מציג את הפרקים החסרים או השבורים.

### 6.11 ביקורת ספרייה

1. `LibraryReport` מפעיל `scriptureAudit` עם `action: "status"`.
2. הפונקציה קוראת את KJV+, Luganda ו־Strong’s.
3. היא מחזירה:
   - מספר פרקים מותקנים מתוך 1,189.
   - פרקים חסרים.
   - פרקים שבורים.
   - פערים במספר הפסוקים בין התרגומים.
   - כיסוי מילון Strong’s.
4. הפונקציה אינה כותבת נתונים.

### 6.12 התקנת הספרייה אוטומטית

1. `cron/scriptureInstall.js` מופעל כל שעה.
2. הוא בודק את המצב האמיתי במסד הנתונים.
3. הוא מנסה למלא רק פרקים חסרים.
4. הוא עוצר כאשר אין עוד התקדמות, כדי לא להעמיס מקורות חיצוניים.
5. פרק שנכשל נשאר חסר וייבדק בהרצה הבאה.

### 6.13 יצירת חשיפה ותגובה

1. אורח רואה מסך התחברות.
2. משתמש מחובר שולח `title`, `passage` ו־`body`.
3. נוצר `Revelation` ללא `parent_id`.
4. לייק מגדיל את `likes`.
5. תגובה נוצרת כ־`Revelation` נוסף עם `parent_id` של החשיפה.
6. המסך מרכז רשומות ללא `parent_id` כחשיפות, ורשומות עם `parent_id` כתגובות.

### 6.14 שמירת התקדמות ו־streak

1. `recordReading()` שומר רשומת `Reading`.
2. אם לפרק יש `plan_day`, גם ה־ReadingPlan מתקדם.
3. `computeStreak()` מחשב רצף ימים מתוך `read_date`.
4. `Dashboard` מציג streak, סטטיסטיקות ו־ActivityFeed.
5. `ActivityFeed` מרענן אוטומטית כל 30 שניות.

### 6.15 הורדת תוכן למצב offline

1. `Offline` מציג את התרגומים והאוספים הניתנים להורדה.
2. להורדת פרק נשמרים `chapters` ו־`verses`.
3. לתוכן ציבורי נשמרים stores נפרדים:
   - devotionals
   - commentary
   - prayers
   - prayerPassages
   - crossReferences
   - qa
   - verseOfDay
4. הגדרות Strong’s נשמרות ב־`strongs`.
5. `offlineDb` מתקן schema ישן באמצעות הגברת `DB_VERSION`.
6. ספירת האחסון מחושבת מ־`navigator.storage` או מהנתונים המקומיים.
7. `BibleReader` מציג ספר כזמין offline רק כאשר כל פרקיו קיימים.

### 6.16 הפעלת נגן גלובלי

1. מסך Verse-Songs יוצר queue של episodes.
2. `PlayerProvider` מפעיל `Audio` אחד שנמצא ברמת האפליקציה.
3. המשתמש עובר לעמוד אחר; הנגן ממשיך לפעול כי ה־Audio element אינו נעלם עם ה־component.
4. `GlobalPlayer` מציג מצב compact או expanded.
5. מצבי queue, repeat, shuffle, speed, volume ושגיאה נשמרים ב־Provider.

---

## 7. הערות טכניות לפיתוח

### 7.1 שכבות המצב

| שכבה | כלי | מתאים ל... |
|---|---|---|
| מצב שרת | FSe2 Entities | מקור אמת לרשומות משתמש ותוכן |
| Cache אסינכרוני | TanStack React Query | רשימות, פרטי רשומות ו־mutations |
| Context | Auth, Theme, Player | מצב גלובלי או משותף לכל העמודים |
| מצב מקומי | `useState`/`useReducer` | טפסים, פתיחת מודאלים ו־UI זמני |
| `localStorage` | הגדרות ו־seed state | saved insights, joined groups, completed devotionals וכו׳ |
| IndexedDB | `offlineDb` | פרקים, תוכן, סימונים ו־Strong’s |
| Service Worker | `public/sw.js` | app shell, תמונות ונכסים סטטיים |

### 7.2 מפתחות Query

הקוד משתמש במפתחות כגון:

- `["prayers"]`
- `["insights", kind]`
- `["commentary"]`
- `["readingActivity", email]`
- `["studyMarks", email]`
- `["journalEntries"]`
- `["chapterInsights"]`

כללים מומלצים:

1. כל query התלוי במשתמש צריך לכלול את `email` או מזהה משתמש.
2. כל query שמשתנה לפי שפה או הרשאה צריך לכלול גם את הפרמטרים האלה.
3. לאחר create/update/delete יש להפעיל `invalidateQueries`.
4. יש להימנע ממפתחות סטטיים כאשר `fetchPublicCollection` עשוי להחזיר תוכן שונה למחובר וללא־מחובר.

### 7.3 דפוס Fallback

המערכת מעדיפה תוכן חי, אך שומרת seed content כרשת ביטחון. דפוס זה מופיע ב:

- Devotionals.
- Prayers.
- Insights.
- Community.
- Live sessions.
- Discussion groups.
- Study resources.

כאשר יש live rows אך חלק מהרשומות חסרות, ייתכן שה־merge יצור מצב חלקי. אם זה אינו מבוקש, כדאי להחליף את merge ל־“live wins” או “seed fallback” באופן מפורש.

### 7.4 דפוס Upsert

הייבוא אינו מסתמך על `id`, אלא על מפתח טבעי:

- פרק: ספר + פרק.
- התקדמות: משתמש + קוד/פרק.
- תפילה: ספר + פרק + פסוק/טווח + כותרת.
- הפניה: פסוק מקור + פסוק יעד.
- הערת קורא: משתמש + סוג + ספר + פרק + פסוק.

היתרון: אפשר להעלות קובץ שוב בבטיחות. החסרון: אם שני imports רצים במקביל, שניהם עלולים ליצור כפילויות. יש להוסיף אילוץ ייחודיות או advisory lock ברמת השרת.

### 7.5 הוספת entity חדש

1. ליצור `entities/NewEntity.json`.
2. להגדיר את השדות, `required`, labels ו־ACL.
3. להוסיף mapping ל־`contentApi`, `functions/content` ול־`adminCollections` אם הוא צריך להיות ניהולי או ציבורי.
4. להוסיף natural key ולוודא שה־upsert משתמש בו.
5. להוסיף שאילתות React Query עם מפתח הכולל מזהה משתמש.
6. להוסיף invalidation לאחר mutations.
7. אם הנתונים נדרשים offline  -  להוסיף store ב־`offlineDb` ולשדרג את `DB_VERSION`.
8. להוסיף migration אם מבנה הנתונים הישן עלול להתנגש.
9. להוסיף בדיקות ל־ACL ול־natural key.

### 7.6 הוספת אוסף לממשק הניהול

הוספת האוסף דורשת:

- הגדרת metadata ב־`adminCollections`.
- הבטחת שה־entity קיים.
- הוספת השדות למטא־נתונים.
- בדיקת שה־`RecordEditor` מכיל את סוג השדה הנכון.
- בדיקת שה־adminDirect ו־adminContent מכירים את ה־entity.
- בדיקת create/update/delete ו־הודעת הצלחה.

### 7.7 הוספת תרגום חדש

1. להוסיף רשומה ל־`VERSIONS` ב־`lib/versions.js`.
2. להגדיר `id`, `translation`, `language`, `strongs` ו־`note`.
3. לוודא ש־`fetchChapter` מכיר את ה־`translation`.
4. להוסיף entity או source logic.
5. לוודא מפתח cache ייחודי לתרגום.
6. להוסיף תמיכה ב־offline key.
7. להוסיף route ב־VersionPicker.
8. להוסיף דוח כיסוי ל־scriptureAudit.
9. לבדוק זמינות מקור, זכויות יוצרים, גודל נתונים והתנהגות ללא רשת.

### 7.8 הוספת דף חדש

1. ליצור `pages/NewPage.jsx`.
2. להשתמש ב־`createPageUrl("NewPage")` בכל הקישורים.
3. לא לבנות URL ידנית.
4. להוסיף את הדף לניווט רק אם הוא אמור להיות גלובלי.
5. להגדיר states: loading, empty, error ו־success.
6. להשתמש ב־EmptyState ו־Spinner כדי לשמור על אחידות.
7. לבדוק התנהגות במובייל, מקלדת ו־RTL.

### 7.9 עיצוב

- `BRAND_CSS` הוא מקור ה־CSS המרכזי.
- צבעים מוגדרים כ־CSS variables כדי ש־ThemeContext יוכל לעדכן אותם.
- רכיבים רבים משתמשים ב־inline style לצבעים ייחודיים; עדיף להעביר ערכים דומים למשתני CSS.
- `__generated/tailwind.css` הוא generated output ולא source of truth.
- שדות צבע שונים מה־brand נראים ברכיבים כמו `ChapterActionBar`; יש לשמור על ניגודיות ועל עקביות עם ivory/emerald/gold.
- כמה קומפוננטים משתמשים בשיעורי Tailwind ישנים, ואחרים ב־`pr-*`; שתי המערכות פעילות במקביל.

### 7.10 אבטחה

#### סיכונים מרכזיים שיש לטפל בהם

1. **סיסמת ברירת מחדל קבועה בקוד:** `functions/adminAuth.js` כולל fallback חלופי. יש להסיר אותו, להגדיר secret בסביבה ולבצע rotation.
2. **SHA-256 אינו password KDF מומלץ:** salted SHA-256 חלש יחסית ל־Argon2id, scrypt או PBKDF2 עם iterations גבוהות.
3. **Session ארוך:** כפי שמתועד, ה־grace הוא 14 יום. יש להפחית את חלון הסיכון, להוסיף revocation ולחייב re-authentication לפעולות רגישות.
4. **Token ב־`localStorage`:** חשוף ל־XSS. יש להקטין את השטח המזהה ולוודא כי אין הזרקת HTML.
5. **הרשאות רחבות ל־user/authenticated:** בידודים כגון `JournalEntry`, `StudyMark`, `PrayerSaved` ו־`DiscussionThread` עלולים לאפשר למשתמש מחובר לעדכן או למחוק רשומות של אחרים, אלא אם הפלטפורמה מוסיפה תנאי בעלות. יש להוסיף ownership conditions.
6. **סינון בצד הלקוח אינו אבטחה:** `owner_email` filters ב־Dashboard/BibleNotes אינם תחליף ל־ACL.
7. **יצירה ציבורית:** Contact ו־QA עלולים להיות מוקשים בספאם; כדאי להוסיף CAPTCHA/rate limiting ו־moderation.
8. **מילון Strong’s עם כתיבה:** אם הפונקציה כותבת cache ללא הגבלה, עלולה להפוך ל־write amplification.
9. **HTML ממקורות חיצוניים:** יש לנקות HTML בצד השרת ולא להעביר HTML ל־`dangerouslySetInnerHTML`.
10. **סודות ב־entity:** `AdminAccount.secret` אינו צריך להיות חשיף לדפדפן אם ניתן להחתיך אותו ל־environment secret.

### 7.11 אמינות ועמידות

- `bibleApi` מגביל קריאות חיצוניות ב־timeout של כ־9 שניות.
- ההתקנות אינדמפוטנטיות וניתנות להפעלה חוזרת.
- `ChapterCoverage` מבדיק גם פרקים שבורים, לא רק חסרים.
- `offlineDb` מתקן schema ישן בעת פתיחת המסד.
- יש להוסיף exponential backoff למקורות חיצוניים.
- יש להוסיף circuit breaker למקור שחוזר על כשל.
- יש להגביל קצב התקנה כדי לא להפגיע במקור.
- אין בקוד retry מובנה גלובלי; לכן כל מקור נכשל נדון להרצה הבאה.
- יש להוסיף לוג מובנה עם request ID, משך בקשה ומקור, ללא logging של tokens או תוכן רגיש.

### 7.12 ביצועים

- רשימות רבות מוגבלות ל־200 - 500 רשומות.
- `Pagination` הוא pagination ויזואלי; הוא אינו מבצע server-side pagination.
- ככל שהספרייה גדלה, יש להוסיף cursor pagination ואינדקסים.
- `ActivityFeed` מבצע polling כל 30 שניות; יש לשקול לעצור polling כשהדף אינו פעיל.
- `Chapter` הוא עמוד מורכב עם רבות queries ו־state; כדאי לפרק אותו ל־hooks ממוקדים.
- `AnnotatedText` מחשב segments; על טקסטים ארוכים כדאי לשמור ב־memoization.
- `StrongsPopup` עלול ליצור עודף קריאות לאותו קוד; כדאי להוסיף cache משותף.
- `ScriptureAudit` עלול להיות כבד; אין להציג אותו אוטומטית בכל התקנה.

### 7.13 נגישות

- לכל אייקון שפועל כפעולה יש צורך להוסיף `aria-label`.
- `StrongsText` משתמש ב־`role="button"` על `sup`; יש לוודא שיש טיפול מלא ב־Enter וב־Space.
- ב־`BookOutline` יש אלמנטים בעלי `role="button"`; יש לוודא תמיכת מקלדת מלאה.
- `Modal` נועל את גלילת body ומאזין ל־Escape, אך אין לו focus trap או שחזור focus.
- `ConfirmDialog` ו־`RecordEditor` צריכים ניהול focus דומה.
- יש לבדוק ניגודיות של הזהב על ירוק ושל טקסט muted.
- אין להסתמך על צבע בלבד לסטטוס completed/missing/broken.

### 7.14 נקודות דיבאג מומלצות

כאשר פרק או פעולה אינה עובדים:

1. בדוק את פרמטרי ה־URL:
   - `book`
   - `chapter`
   - `verse`
   - `lang`.
2. בדוק ש־`getBookByNumber()` מזהה את הספר.
3. בדוק אם הפרק נמצא ב־`KjvPlusChapter`, `LugandaChapter` או ב־offline.
4. בדוק אם `verses` הוא JSON תקין.
5. בדוק אם ה־source חיצוני החזיר verses או דף HTML.
6. בדוק אם `fetchChapter` החזיר timeout או תשובה ריקה.
7. בדוק אם ה־markers הם בתבנית `(G2424)`/`(H436)`.
8. בדוק אם הקוד מנורמל ל־`G2424`/`H436`.
9. בדוק את מצב המשתמש ואת `owner_email`.
10. בדוק אם ה־React Query cache מחזיר נתונים ישנים.
11. בדוק אם מדובר ב־admin server mode או direct mode.
12. בדוק אם ה־service worker מחזיר גרסת shell ישנה.
13. בדוק אם IndexedDB מכיל schema ישן.
14. בדוק אם יש לבקשת מחיקת cache לפני אבחון התנהגות רשת.

### 7.15 בעיות או סיכונים ידועים

- `AdminAuth` מכיל סיסמה ו־reset key ברירת מחדל  -  יש להסיר מיידית.
- `CommentThread` ו־`ThreadMessages` מנקים את הטקסט לפני שה־mutation הצליח; כשל עלול לאבד הודעה.
- מנהי לייקים עלולים להיות מאבדי עדכון כאשר שני משתמשים לוחצים במקביל.
- ה־parsing של `VerseOfDay` מנסה לחלץ את המספר הראשון מה־reference; עבור “John 3:16” זה אינו בהכרח מספר הספר.
- התאמת תפילות מבוססת טקסט ב־`PassagePrayer` רגישה לשינויי כתיב ולשמות ספר.
- `CrossRefEditor` עלול להפיק מפתחות React כפולים אם `splitRefs` מחזירה אותו reference יותר מפעם.
- שאילתות כמו `["prayers"]` אינן כוללות תמיד את מצב האימות.
- `ThemeProvider` טוען settings רק כשהמשתמש מחובר, גם אם `SiteSettings` קריא לציבור.
- שמות hash של נכסים ב־`public/assets` אינם מתארים את משמעותם; יש לתחקן הפניות לפני מחיקה.
- `LOGO_URL` ו־`manifest.json` מפנים ל־`app_73e21b4aa5684452`; הזזת האפליקציה ל־app ID אחר תדרוש עדכון.
- `public/sw.js` משתמש בנתיבי root; בהתקנה עם prefix יש להתאים את `SHELL` ואת `start_url`.
- קבצי `__trash` ו־`__url_fetch` עלולים להיכלל ב־source archive אך אינם אמורים להיכלל ב־deployment artifact.

### 7.16 תכנון בדיקות מומלץ

#### בדיקות יחידה

- `compressChapters`.
- `parseReference` ו־`parseOutlineRange`.
- `matchesPassage`.
- נרמול קודי Strong’s.
- validation של קובץ התפילות.
- normalizers ו־natural keys.
- חישוב streak ו־תאריכים.
- מיזוג annotations מקומי ושרת.

#### בדיקות אינטגרציה

- כניסת admin בשני המסלולים.
- create/update/delete בכל אוסף ניהולי.
- import חוזר של אותו קובץ בלי כפילויות.
- טעינת פרק מ־entity, מ־source ומ־offline.
- שמירת הדגשה לאחר reload.
- התקנת תרגום והמשך לאחר כשל חלקי.
- פעולות קהילה עם משתמש מחובר ולא מחובר.

#### בדיקות E2E

- מצב אורח לא נכשל כאשר `fse2.auth.me()` נכשל.
- קורא מחובר רואה רק את הנתונים שלו.
- מובייל, מקלדת ו־RTL.
- PWA install ועבודה ללא רשת.
- חזרה אחורה מתוך popup, modal ו־shared URL.

---

## נספח: מילון מקוצר למפתחים חדשים

| מונח | משמעות במערכת |
|---|---|
| **Entity** | טבלת נתונים עם schema ו־ACL |
| **Function** | פונקציית server לפעולות מעבר לגבול הדפדפן |
| **Admin session** | התחברות נפרדת למנהל התוכן |
| **Natural key** | מזהה עסקי לרשומה, לא `id` |
| **Upsert** | יצירה או עדכון לפי מפתח טבעי |
| **Fallback** | מקור חלופי כאשר המקור הראשי חסר או נכשל |
| **Seed** | תוכן מובנה המשמש גיבוי לתוכן חי |
| **Coverage** | כיסוי פרקים מותקנים/חסרים/שבורים |
| **Annotation** | הדגשה או קו תחתון על טקסט וטווח offsets |
| **StudyMark** | highlight/bookmark/note ברמת פסוק |
| **Passage** | פסוק, טווח פסוקים או פרק שלם |
| **Cross-reference** | קישור מפסוק מקור לפסוק יעד |
| **Chapter key** | מפתח ספר + פרק המשמש להתקנה, cache ו־offline |
| **Strong code** | מזהה מילה יוונית או עברית במילון Strong’s |
| **Service worker** | proxy/cache של הדפדפן להתקנת PWA ולעבודה ללא רשת |
| **Entity SDK** | ממשק FSe2 לקריאה וכתיבה ל־entities |
| **Function gateway** | מנגנון הפעלת functions מתוך הדפדפן |
| **Direct mode** | ניהול content ישיר דרך entity SDK ללא function gateway |
| **Server mode** | ניהול content דרך `adminContent` עם session token |
| **Grace period** | תקופה שבה session שפג זמנית עדיין מתקבל |
| **Owner** | בעל הרשומה, לרוב לפי `owner_email` |
| **RBAC** | הרשאות לפי role ולפי action |
| **Seed key** | טבלת או store של מפתחות ראשוניים ל־IndexedDB |
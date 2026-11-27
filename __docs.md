# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכתי  -  Pray-Read Bible

## הערה על כתובות ה־URL

מקור האמת לנתיבי האפליקציה הוא הפונקציה `createPageUrl(pageName)`. הנתיבים שמופיעים להלן הם הצורה הישירה הנראית בשירות ה־Service Worker, בקישות האתר ובקבצי הדפים. אם האפליקציה תפורסר תחת נתיב בסיס כגון `/app`, יש להוסיף אותו לכל הנתיבים.

המערכת בנויה כ־SPA ב־React, ומשתמשת ב־FSe2 לאחסון, בהרשאות, בהתקשרויות לשרת ובשירותי המשתמש. הנתונים מגיעים ממספר מקורות, ובכל תחום קיימת גם נפילה לאחור לנתונים מצורמים בחבילת האפליקציה או למטמון מקומי.

---

# 1. מהות המערכת

## 1.1 מה המערכת עושה

Pray-Read Bible היא אפליקציית PWA לקריאת המקרא, מחקר ותפילה באנגלית ובלוגאנדה. היא מחברת בין:

- קריאת פרקים מלאה מהמקרא.
- הערות מחקר, פירושים, רקע היסטורי ורקע תיאולוגי.
- תוכן מתפללה, מפרשי בראשית והקדמות לספרים.
- משאלות ומענות באנגלית ובלוגאנדה.
- מילים יומיות, תוכן קהילה, דיבורים וחברת לימוד.
- שירי מקרא עם נגן גלובלי.
- התקנת תוכן המקרא לקריאה לא־מקוונת.
- הכרות והערות אישיות המתעקבות אחרי המשתמש.

המערכת מיועדת לקורא אישי שרוצה לקרוא פרק אחד ברציפות, להבין את ההקשר, להתפלל ולשמור מה שהשתמש בו  -  ולא רק לראות פסוק יום אחד.

## 1.2 למי המערכת מיועדת

### קוראים רשומים

- קוראים שמשתמשים במכשיר אחד או בכמה מכשירים.
- משתמשים המשמרים סימונים, רשימות קריאה, הערות, יומן תפילה, תוכן שמור והתקדמות מילים יומיות.
- קבוצות קהילה המשתפות גלויות, תגובות, הודעות ושירים.

### משתמשים לא רשומים

- קריאת תוכן ציבורי.
- חיפוש וסינון.
- שיתוף.
- קריאת תוכן שכבר הורד למכשיר.
- שימוש מקומי בסימוני התקדמות שנשמרים בדפדפן.

### מנהלי תוכן

- הוספה ועריכה של תוכן.
- יצירת נושאים ותוכניות.
- ייבוא תוכן מקבצי JSON.
- התקנת המקרא בלוגאנדה ו־KJV+.
- בניית מילון Strong’s.
- ביקורת כיסוי המקרא והתאמת מספרי פסוקים בין תרגומים.
- ניהול שירי מקרא, סדרות, קבצי אודיו ותמונות.

## 1.3 הערך שהמערכת מספקת

1. **קריאה מתמקדת:** פרק שלם, הקשר ספרי, פירוש ותפילה במקום אחד.
2. **דו־לשוניות:** כל תוכן מרכזי ניתן להצגה באנגלית, בלוגאנדה או בשתי השפות.
3. **עבודה לא־מקוונת:** פרקים, תוכן ומילון Strong’s נשמרים ב־IndexedDB.
4. **שימור עבודת הקורא:** סימונים, הערות והתקדמות נשמרים מקומית ומסונכרנים לשרת כשיש חשבון.
5. **מערכת ניהול תוכן:** אותו מודל נתונים משמש את האתר, את מנהל התוכן, את הייבוא ואת המטמון.
6. **אמינות:** התוכן הציבורי מגיע מהשרת, אך הממשק אינו נעלם כשהשרת אינו זמין.
7. **ייבוא חוזר ובטוח:** רוב הייבואים מזהים רשומות לפי מפתח טבעי ומעדכנים רשומה קיימת במקום ליצור כפולות.

## 1.4 ארכיטקטורת על

המבנה הלוגי של המערכת:

```text
דפי Pages
   ↓
קומפוננטות UI
   ↓
ספריות lib
   ↓
TanStack Query / קריאות ישירות / React Context
   ↓
FSe2 Entity SDK / Function Gateway / Auth
   ↓
Entities, Functions, Cron
   ↓
מקורות ציבוריים ומטמון מקומי
```

### שכבות

| שכבה | תפקיד |
|---|---|
| `pages/` | מסכי מסלול מלאים, מצב מסך והרשאות גלובליות |
| `components/` | רכיבי UI חוזרים לפי תחום |
| `lib/` | לוגיקת עסק, נורמליזציה, API, מטמון, תאריכים, שיתוף ועזרי יישום |
| `entities/` | סכמת הנתונים והרשאות הגישה של הפלטפורמה |
| `functions/` | שרתי Deno לאימות מנהל, API ציבורי, התקנות וביקורת |
| `cron/` | משימות רקע להשלמת המקרא |
| `public/` | PWA manifest, Service Worker, מדיה ונכסים |
| `__trash/` | קוד ישן או ניסיוני  -  אינו חלק מההפצה |
| `__url_fetch/` | snapshots של דפי מקור חיצוניים  -  אינם קוד יצירה |

## 1.5 מקור האמת ונפילה לאחור

| תחום | מקור ראשי | נפילה לאחור |
|---|---|---|
| מילים יומיות | `Devotional` | `DEVOTIONALS` מ־`seedContent.js` |
| תפילות | `Prayer` | `PRAYERS` מ־`seedContent.js` |
| תובנות | `Insight` | `INSIGHTS` מ־`seedContent.js` |
| Q&A | `QAItem` ו־`QATopic` | `QA_ITEMS` ו־`QA_TOPICS` |
| תוכן קהילה | Entities חיים | seed records ב־`seedContent.js` |
| מקרא מותקן | `KjvPlusChapter`, `LugandaChapter` | IndexedDB, ואז מקור חיצוני |
| הערות ציפייה | `StudyAnnotation` | IndexedDB בלבד |
| סימוני פסוקים | `StudyMark` | IndexedDB |
| הגדרות Strong’s | `StrongEntry` | IndexedDB, ואז מקור חיצוני |
| התקדמות מילים יומיות | `DevotionalProgress` | `localStorage` |
| התקדמות קריאה | `Reading` | seed plan ו־local state |
| תוכן לא־מקוון | IndexedDB | אין מקור חיצוני |

המערכת אינה מוחקת seed content בעת הצגתו. במקום זאת היא ממזגת רשומות חיות עם רשומות מצורמים, ובדרך כלל מדגישה רשומה חיה בעת התאמה לפי כותרת.

---

# 2. עמודים ותפקידיהם

## 2.1 דפים ציבוריים ועיקריים

| דף | URL | תפקיד והצדקה | פעולות מרכזיות |
|---|---|---|---|
| `Home` | `/` | דף הנחיתה הראשי. מציג את המילה היומית, היכן הקורא יכול להתחיל, תוכן קהילה ותוכן נוסף. | בחירת מודול, קריאת מילה יומית, שיתוף, מעבר לכל אזורי האתר. |
| `About` | `/About` | מציג את זהות המשלח, ערכי המשלח והבסיס התיאולוגי של הפרויקט. | קריאת מידע, חזרה לדף הבית, קישורים לשאר האתר. |
| `Contact` | `/Contact` | מאפשר לשלוח שאלה, הצעה או פנייה לצוות. נועד ליצירת פנייה בפלטפורמה ולא רק לשליחת דוא"ל. | מילוי שם, דוא"ל, נושא והודעה; אימות בסיסי; שליחה ל־`ContactMessage`; הצגת הצלחה או שגיאה. |
| `Privacy` | `/Privacy` | מסביר מה נשמר בחשבון, מה נשמר מקומית ומה נמחק. | קריאה; קישור חזרה לבית. |
| `Terms` | `/Terms` | תנאי שימוש, זכויות תוכן והסתייגות לגבי תרגומי המקרא. | קריאה; קישור חזרה לבית. |
| `InstallPrompt` | `/InstallPrompt` | מסביר כיצד להתקין את האפליקציה כ־PWA במכשירים ניידים ובמחשב. | התקנה ישירה במכשירים תומכים; הוראות ידניות ל־iOS ולאנדרואיד; זיהוי מצב standalone. |
| `Community` | `/Community` | מרכז הקהילה. מחבר גלויות, הוראות חיות, קבוצות לימוד ותגובות אחרונות. | בחירת אחד משלושת המרכזים; צפייה בפרסומים אחרונים; מעבר לדף מתאים. |
| `CommunityRevelations` | `/CommunityRevelations` | מאפשר לקוראים לפרסם גלויות אישיות ולקבל משוב. | פרסום גלויה; לייק; פתיחת תגובות; תגובה; התחברות כאשר נדרשת. |
| `CommunityLiveTeaching` | `/CommunityLiveTeaching` | מציג מפגשי הוראה חיים עם תאריך, מנחה וקישור הצטרפות. | צפייה במפגשים; פתיחת קישור ההצטרפות; מעבר לקהילה. |
| `DiscussionGroups` | `/DiscussionGroups?group=<id-or-name>` | מאפשר לקרוא באותו מקרא בקבוצה קטנה ולשלוח הודעות. | בחירת קבוצה, הצטרפות מקומית, צפייה בהודעות, שליחת הודעה. |
| `TheologicalInsights` | `/TheologicalInsights` | מאגר תובנות תיאולוגיות המשולבות בקריאת הפרק. | חיפוש, פתיחת תובנה, שיתוף, שמירה מקומית, מעבר לפסוק הרלוונטי. |
| `HistoricalInsights` | `/HistoricalInsights` | מאגר רקע היסטורי ותרבותי לקריאת המקרא. | חיפוש, פתיחת תובנה, שיתוף, שמירה מקומית, מעבר לפסוק. |
| `VerseOfDay` | `/VerseOfDay` | מציג פסוק מומלץ לפי התאריך הנוכחי. | שיתוף; מעבר לפרק המקרא; טעינת פסוק חלופי כשאין רשומה להיום. |

## 2.2 דפי קריאה וספירה

| דף | URL | תפקיד והצדקה | פעולות מרכזיות |
|---|---|---|---|
| `BibleReader` | `/BibleReader?book=<number>` | מסף ראשי לכל 66 הספרים. מציג רשת ספרים, המקרא העברי והחדש, מצב הורדה ומסך הכרה של הספר. | חיפוש ספר; החלפת מקרא; בחירת ספר; בחירת פרק; סימון מצב לא־מקוון. |
| `Chapter` | `/Chapter?book=<number>&chapter=<n>&verse=<n>&lang=<en|lu>` | מסך קריאת הפרק המרכזי ביותר. מחבר את הפסוקים, המשאלות, הפרשות, התוכניות, הסימונים, ההערות והפעילויות. | קריאת פסוק, בחירת פסוק, הערה, סימון, הערת קצרה, ספר לב, העניין, שיתוף, קריאת משאלה, פתיחת פרשות, מעבר למשאלת קהילה, סימון כהוכן, קישור ליומן. |
| `Plan` | `/Plan` | מציג את מסלול הקריאה בן 30 הימים ואת ההתקדמות של הקורא. | בחירת יום, מעבר לפרק, צפייה ביום נוכחי ובאחוז השלמה. |
| `BibleNotes` | `/BibleNotes` | מרכז את הסימונים, ההערות והסימניות ששמר הקורא על פסוקים. | סינון לפי סוג, פתיחת הפסוק המסומן, מעבר להערה. |
| `Journal` | `/Journal?new=1&book=<book>&chapter=<n>` | יומן תפילה אישי עם קטגוריות שבח, בקשה, הודאה, הודות והשקפה. | הוספה, עריכה, מחיקה, סינון וחיפוש; שמירת ספר ופרק. |
| `PrayerLibrary` | `/PrayerLibrary` | מאגר תפילות המשמש גם מקור בקרת העניין בפרק. | חיפוש, סינון לפי קטגוריה ושפה, שמירה למועדפים, שיתוף, פתיחת פסוק. |
| `Devotionals` | `/Devotionals` | מציג את מילת היום, ימים קודמים ורשימת מילים יומיות. | בחירת `EN`, `LU` או `BOTH`; חיפוש; סינון לפי נושא, סדרה וטווח תאריכים; קריאה מלאה; סימון כקריא; שמירה; שיתוף. |
| `QA` | `/QA?lang=<en|lu|both>&topic=<topic>&letter=<A-Z>&search=<q>` | ספר השאלות והמענות, מסודר לפי אות ונושא. | חיפוש; סינון שפה/נושא/אות; פתיחת תשובה; הצבעה; העתקה; שיתוף; מעבר לפסוק. |
| `VerseSongs` | `/VerseSongs?series=<id>&song=<id>` | מציג את כל שירי המקרא בכרטיסים ומפעיל נגן עולמי. | חיפוש; סינון סדרה וספר; נגן/השהיה; הורדת שיר; שיתוף; ניהול תור. |
| `VerseSongSeries` | `/VerseSongSeries?series=<id>` | מציג את רשימת הסדרות כשאין סדרה נבחרת, ואת שירי הסדרה כשנבחרת סדרה. | בחירת סדרה; נגן; הורדה; שיתוף; חיפוש וסינון. |
| `Offline` | `/Offline` | מרכז הורדות המכשיר וניהול מטמון מקומי. | הורדת פרקים, פסוקים, Strong’s, מילים יומיות ועוד; בדיקת נפח; מחיקה; בדיקת קריאות מקומיות. |

## 2.3 דפי חשבון

| דף | URL | תפקיד והצדקה | פעולות מרכזיות |
|---|---|---|---|
| `Login` | `/Login?next=<path>` | כניסת קורא רשום. | אימות דוא"ל וסיסמה; הצגת שגיאה; חזרה למסך הנחיתה או לכתובת `next`. |
| `Signup` | `/Signup` | הרשמת קורא חדש. | הערכת חוזק סיסמה; אימות אימות; תנאי שימוש; הרשמה; טיפול בדרישת אימות דוא"ל. |
| `ForgotPassword` | `/ForgotPassword` | שליחת בקשת איפוס סיסמה. | אימות כתובת דוא"ל; שליחת בקשה; הודעה סופית שאינה חושפת אם החשבון קיים. |
| `ResetPassword` | `/ResetPassword?token=<token>` | קביעת סיסמה חדשה לאחר אימות. | קריאת `token` או `access_token`; אימות אורך; אימות התאמה; איפוס. |
| `Logout` | `/Logout` | מסף יציאה מוצג למשתמש לפני ניתוק ההתקשרות. | ניתוק הישיבות וחזרה לדף הבית. |
| `Dashboard` | `/Dashboard` | לוח אישי של הקורא: התקדמות, פעילות, סימונים, קריאות שהושלמו, תפילות שנשמרו ונתוני מטמון. | צפייה בסטטיסטיקות, ביקורת פעילות, מעבר למילים יומיות ולכלי הקריאה. |

## 2.4 דפי ניהול

| דף | URL | תפקיד והצדקה | פעולות מרכזיות |
|---|---|---|---|
| `Admin` | `/Admin` | כניסת מנהל תוכן נפרדת מהכניסה הרגילה של הקורא. | התחברות, זיהוי session קיים, איפוס סיסמה עם מפתח, הצגת שגיאות. |
| `AdminDashboard` | `/AdminDashboard` | מרכז ניהול התוכן והספרים. כולל התקנות, ייבוא, ניהול אוספים, פעילות, הודעות והגדרות. | ניהול תוכן, התקנת מקרא, ביקורת כיסוי, ייבוא JSON, ניהול שירים, ניהול Q&A, מחיקה ושינוי נושאים. |

## 2.5 מסכי משנה חשובים ב־`Chapter`

### `ChapterReaderPane`

מכיל את התפריט העליון של הפרק:

- `Intro`
- `Commentary`
- `Prayer`
- `Cross-refs`
- `Resources`

במסך צר החלונית נפתחת מתחת לתפריט; במסך רח היא נשארת בעמודה השמאלית.

### `BookSidebar`

מציג שלושה אזורים:

1. הקדמת הספר.
2. מבנה הספר והפסוקים.
3. תפילת הספר.

כל אזור ניתן להדגיש ולסמן, והפסוקים המקושרים ניתנים לפתיחה בתוך העמוד.

### `PassageTabs`

מציג ארבעה מקורות מידע לפי פסוק:

- פירוש.
- תובנה תיאולוגית.
- תובנה היסטורית.
- Q&A עבור הפסוק.

### `PassagePrayer`

מציג תפילה הקשורה לפסוק, הן מהמטמון המקומי והן מ־`PrayerPassage`. כאשר אין תפילה ייעודית, מוצגת תפילת הפרק או תפילת הספר.

### `VerseActionBar`

סדר הפעולות מותאם לזרימת הקורא:

1. תפילת הפסוק.
2. פרשות־חוצים.
3. פירוש.
4. הערה.
5. שיתוף.
6. סימון.
7. הערת קצרה.

## 2.6 דפי ניהול  -  חלוקה פנימית

`AdminDashboard` מכיל אזורים שונים, ובכל אחד מופעלת לוחית ייעודית:

| אזור | רכיב |
|---|---|
| Dashboard / Overview | נתוני ספירה, התראות ופעילות אחרונה |
| Books & Chapters | תצוגת כיסוי ספרים וניהול חומר לפי ספר |
| Luganda Bible | `LugandaInstaller` |
| KJV+ with Strong’s | `KjvPlusInstaller` |
| Devotionals | `DevotionalsPanel` |
| Prayers | `PrayersPanel` |
| Passages | `PassagesPanel` |
| Verse Songs | `VerseSongsPanel` |
| Q&A | `QaPanel` |
| Import | `JsonImportPanel` ו־`PrayerCrossRefImport` |
| Collections | `CollectionsPanel` |
| Insights / Verse of Day | ניהול התאמות תוכן |
| Community | ניהול גלויות, מפגשים, קבוצות ודוא"ל |
| Settings | צבעי מותג, קישור תרומה והגדרות אתר |
| Activity | `ActivityLog` |

החלוקה מיושמת בתוך דף יחיד; מעבר בין אזורים אינו מנקה את כל מצב הלוח, ולכן חשוב לבצע ריעול מחדש לפי האזור הפעיל.

---

# 3. מפת ניווט לצרכי DEBUG

## 3.1 ניווט כללי והתחברות

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| חזרה לדף הבית | כל דף | לוגו Pray-Read | `/` |
| מעבר למסלול | Header | `Dashboard` | `/Dashboard` |
| מעבר למקרא | Header | `Bible Reader` | `/BibleReader` |
| מעבר למילים יומיות | Header | `Devotionals` | `/Devotionals` |
| מעבר לספרי תפילה | Header | `Prayer Library` | `/PrayerLibrary` |
| מעבר לשירים | Header | `Verse-Songs` | `/VerseSongs` |
| מעבר ל־Q&A | Header | `Q&A` | `/QA` |
| מעבר לקהילה | Header | `Community` | `/Community` |
| מעבר לתובנות תיאולוגיות | Header / Footer | `Theological insights` | `/TheologicalInsights` |
| מעבר לתובנות היסטוריות | Header / Footer | `Historical insights` | `/HistoricalInsights` |
| מעבר לפסוק היום | Header | `Verse of the day` | `/VerseOfDay` |
| מעבר לתוכנית קריאה | Header / Footer | `Reading plan` | `/Plan` |
| מעבר ליומן | Header / Footer | `Prayer journal` | `/Journal` |
| מעבר להערות | Header | `My notes` | `/BibleNotes` |
| מעבר למטמון | Header / Footer | `Offline centre` | `/Offline` |
| התחברות כקורא | Header | `Sign in` | `/Login` |
| יצירת חשבון | דפי כניסה | `Create account` | `/Signup` |
| איפוס סיסמה | דפי כניסה | `Forgot password` | `/ForgotPassword` |
| יציאה | Header / דף חשבון | `Log out` | `/Logout` |
| כניסת מנהל | נתיב ישיר | טופס Admin | `/Admin` |
| מעבר ללוח הניהול לאחר התחברות | `Admin` | `Sign in` | `/AdminDashboard` |

## 3.2 ניווט בקריאת המקרא

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| חיפוש ספר | `BibleReader` | שדה `Search books` | סינון מקומי של הרשת |
| בחירת מקרא | `BibleReader` | לשונית `Old Testament` / `New Testament` | גלילה למקטע הרלוונטי |
| בחירת ספר | `BibleReader` | כרטיס ספר | `/BibleReader?book=<number>` |
| בחירת פרק | `BibleReader` | אריח פרק ב־`ChapterGrid` | `/Chapter?book=<number>&chapter=<n>` |
| פתיחת פסוק מתוך פרק | `Chapter` | לחיצה על פסוק | בחירת הפסוק ופתיחת `VerseActionBar` |
| פתיחת פסוק מפנייה | `PrayerLibrary`, `QA`, תובנות | קישור הפסוק | `/Chapter?book=<number>&chapter=<n>&verse=<n>` |
| פתיחת פסוק מהפרשות | `Chapter` | פרשת־חוצים או `PassageTabs` | חלון פסוק בתוך העמוד או מעבר ל־`Chapter` |
| שינוי תרגום | `Chapter` | `VersionPicker` | טעינת אותו פרק בגרסה אחרת |
| התקנת תרגום | `VersionPicker` | כפתור התקנה | הורדת התרגום למכשיר |
| סימון פסוק | `Chapter` | `Bookmark` ב־`VerseActionBar` | יצירה או מחיקה ב־`StudyMark` |
| הערה על פסוק | `Chapter` | `Note` | שדה הערה בתוך `VerseActionBar` |
| הערת צפייה | `Chapter` | `Highlighter` | יצירת הערה ב־`StudyAnnotation` |
| שיתוף פרק | `Chapter` | `Share2` | מודאל `ShareSheet` |
| פתיחת Strong’s | `Chapter` ב־KJV+ | קוד כחול כגון `G2424` | מודאל `StrongsPopup` |
| מעבר לספר נוסף | `Chapter` | לחיצה על אזור המספרים בפסוק | `VersePopup` |
| סימון כהוכן | `Chapter` | `Mark as read` | עדכון `Reading` |
| מעבר ליומן מהפרק | `Chapter` | `NotebookPen` | `/Journal?new=1&book=<book>&chapter=<n>` |
| מעבר לשיר מקרא | `Chapter` | אפשרות שיר/שיתוף | `/VerseSongs` או חלון שיתוף |

## 3.3 מילים יומיות, תפילות ושירים

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| סינון לפי שפה | `Devotionals` | `EN`, `LU`, `BOTH` | עדכון הרשימה והתצוגה |
| חיפוש מילה יומית | `Devotionals` | שדה חיפוש | סינון מקומי |
| בחירת נושא | `Devotionals` | צ׳יפ `Topic` | סינון מקומי |
| בחירת סדרה | `Devotionals` | צ׳יפ `Series` | סינון מקומי |
| פתיחת מילה יומית | `Devotionals` | כרטיס או `DevotionalFeatured` | `DevotionalFullView` |
| מעבר ליום הבא/הקודם | `DevotionalFullView` | `Previous Day` / `Next Day` | מילה יומית סמוכה |
| שמירת מילה יומית | `Devotionals` | `Heart` | local + `DevotionalSaved` |
| סימון מילה יומית כנקראה | `Devotionals` | `CheckIcon` | local + `DevotionalProgress` |
| סינון תפילות | `PrayerLibrary` | חיפוש/קטגוריה/שפה | רשימת תפילות מסוננת |
| שמירת תפילה | `PrayerLibrary` | `Bookmark` | `PrayerSaved` |
| פתיחת פסוק התפילה | `PrayerLibrary` | קישור scripture reference | `/Chapter?...` |
| נגן שיר | `VerseSongs` | `Play` | הפעלת השיר בנגן הגלובלי |
| בחירת סדרת שירים | `VerseSongs` | סל פילטרים | סינון התור |
| פתיחת שיר יחיד | `VerseSongs` | כרטיס / קישור `song` | `/VerseSongs?song=<id>` |
| שיתוף שיר | `VerseSongs` | `Share2` | `SongShareSheet` |
| הורדת שיר | `VerseSongs` | כפתור הורדה | קובץ מקומי לשימוש לא־מקוון |
| פתיחת סדרה | `VerseSongSeries` | כרטיס סדרה | `/VerseSongSeries?series=<id>` |

## 3.4 קהילה, Q&A ויומן

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פרסום גלויה | `CommunityRevelations` | טופס `Share what God showed you` | יצירת `Revelation` |
| לייק לגלויה | `CommunityRevelations` | כפתור הלייק | עדכון ספירת הלייקים |
| פתיחת תגובות | `CommunityRevelations` | כפתור `comments` | `CommentThread` |
| שליחת תגובה | `CommentThread` | טופס התגובה | יצירת רשומת `Revelation` עם `parent_id` |
| הצטרפות לקבוצה | `DiscussionGroups` | `Join group` | localStorage ו־עדכון מצב הקבוצה |
| שליחת הודעה | `DiscussionGroups` | טופס הודעה | `DiscussionThread` |
| הצטרפות למפגש חי | `CommunityLiveTeaching` | `Join` | קישור חיצוני למפגש |
| סינון שאלות | `QA` | אות, נושא, שפה וחיפוש | רשימת Q&A מסוננת |
| פתיחת תשובה | `QA` | כפתור השאלה | פתיחת תשובת `QaCard` |
| הצבעת על תשובה | `QaCard` | `ThumbsUp` / `ThumbsDown` | local voting ב־`pr_qa_votes` |
| העתקת תשובה | `QaCard` | `Copy` | Clipboard |
| שיתוף שאלה | `QaCard` | `Share2` | `ShareSheet` |
| יצירת רשומת יומן | `Journal` | `Add entry` | טופס `JournalForm` |
| עריכת רשומת יומן | `Journal` | עריכה בכרטיס | `JournalForm` עם ערך |
| מחיקת רשומת יומן | `Journal` | סל | `ConfirmDialog` ואז מחיקה |
| סינון יומן | `Journal` | בקרת קטגוריה | רשימת מסוננת |

## 3.5 מנהל תוכן

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| התקנת המקרא בלוגאנדה | `AdminDashboard` | `Install` ב־`LugandaInstaller` | `lugandaInstall` function |
| בדיקת כיסוי | `LugandaInstaller` | `Refresh` / `Status` | רשימת פרקים קיימים וחסרים |
| התקנת KJV+ | `AdminDashboard` | `Install` ב־`KjvPlusInstaller` | `kjvInstall` function |
| התקנת מילון Strong’s | `KjvPlusInstaller` | פעולת dictionary | `strongsDefinition` function |
| הפעלת ביקורת ספרייה | `KjvPlusInstaller` | `LibraryReport` | `scriptureAudit` function |
| פתיחת לשונית מילים יומיות | `AdminDashboard` | `Devotionals` | `DevotionalsPanel` |
| הוספת מילה יומית | `DevotionalsPanel` | `Add devotional` | `DevotionalForm` בתוך `Modal` |
| עריכת מילה יומית | `DevotionalsPanel` | עריכה בכרטיס | `DevotionalForm` |
| מחיקת מילה יומית | `DevotionalsPanel` | סל | `ConfirmDialog` |
| ייבוא מילים יומיות | `DevotionalsPanel` | לשונית `Bulk upload` | `DevotionalBulkImport` |
| ניהול נושאי מילים יומיות | `DevotionalsPanel` | לשונית `Topics` | `DevotionalTopicsPanel` |
| ניהול תוכניות מילים יומיות | `DevotionalsPanel` | לשונית `Plans` | `DevotionalPlansPanel` |
| עריכת תפילה כללית | `AdminDashboard` | `Prayers` | `PrayersPanel` |
| חיפוש תפילה לפי מקרא | `PrayersPanel` | בחירת ספר/פרק/פסוק | תוצאות מסוננים |
| עריכת חומר לפי ספר | `AdminDashboard` | `Passages` | `PassagesPanel` |
| בחירת סוג חומר | `PassagesPanel` | לשונית קטגוריה | טבלת רשומות מתאימה |
| ייבוא קובץ ספר | `PrayerCrossRefImport` | `Upload` | `bookImport` + `prayerImport` |
| ייבוא JSON כללי | `AdminDashboard` | `Import` | `JsonImportPanel` |
| הוספת רשומה כללית | `CollectionsPanel` | `Add` | `RecordEditor` |
| עריכת רשומה כללית | `CollectionsPanel` | עריכה בשורה | `RecordEditor` |
| מחיקת רשומה כללית | `CollectionsPanel` | סל | `ConfirmDialog` |
| ניהול Q&A | `AdminDashboard` | `Q&A` | `QaPanel` |
| מחיקת נושא Q&A בשימוש | `QaTopicsPanel` | סל | מודאל בלימוד העברת השאלות |
| הוספת שאלה | `QaPanel` | `Add a question` | `QaItemForm` |
| ייבוא Q&A | `QaPanel` | לשונית `Bulk upload` | `QaBulkImport` |
| ניהול שירים | `AdminDashboard` | `Verse Songs` | `VerseSongsPanel` |
| הוספת סדרה | `VerseSongsPanel` | לשונית `Series` → `Add series` | `VerseSongSeriesForm` |
| העלאת תמונת סדרה | `VerseSongSeriesForm` | בחירת קובץ | `Core.UploadFile` |
| הוספת שיר | `VerseSongsPanel` | לשונית `Songs` → `Add song` | `VerseSongForm` |
| העלאת אודיו | `VerseSongForm` | בחירת קובץ | `Core.UploadFile` |
| ייבוא שירים | `VerseSongsPanel` | לשונית `Bulk upload` | `VerseSongBulkImport` |

---

# 4. מבנה הקבצים

## 4.1 דפים

כל דף נמצא ב־`pages/` ומיוצא כרכיב React ברירת מחדל.

| קובץ | מה הוא מרנדר |
|---|---|
| `pages/About.jsx` | דף המותג והמסירה של Pray-Read |
| `pages/Admin.jsx` | טופס כניסת מנהל ואיפוס סיסמה |
| `pages/AdminDashboard.jsx` | מרכז הניהול והחלוקה לאזורי תוכן |
| `pages/BibleNotes.jsx` | רשימת הסימונים, ההערות והסימניות של הקורא |
| `pages/BibleReader.jsx` | מסף הספרים והכניסה לפרק |
| `pages/Chapter.jsx` | קריאת פרק וכל פעילויות הקריאה |
| `pages/Community.jsx` | מרכז הקהילה והקישורים לתתי־הקהילה |
| `pages/CommunityLiveTeaching.jsx` | מפגשי הוראה חיים |
| `pages/CommunityRevelations.jsx` | פרסום גלויות, לייקים ותגובות |
| `pages/Contact.jsx` | טופס יצירת פנייה |
| `pages/Dashboard.jsx` | לוח אישי וסטטיסטיקות הקורא |
| `pages/Devotionals.jsx` | מילה יומית, סינון ותצוגה מלאה |
| `pages/DiscussionGroups.jsx` | בחירת קבוצה, הצטרפות והודעות |
| `pages/ForgotPassword.jsx` | בקשת איפוס סיסמה |
| `pages/HistoricalInsights.jsx` | מעטפת ל־`InsightsBoard` עם סוג `historical` |
| `pages/Home.jsx` | דף הבית והניווט המרכזי |
| `pages/InstallPrompt.jsx` | הוראות והתקנת PWA |
| `pages/Journal.jsx` | ניהול יומן התפילה |
| `pages/Login.jsx` | התחברות קורא |
| `pages/Logout.jsx` | יציאה וניתוק הישיבות |
| `pages/Offline.jsx` | מרכז הורדות וניהול IndexedDB |
| `pages/Plan.jsx` | מסלול 30 הימים והתקדמות |
| `pages/PrayerLibrary.jsx` | חיפוש וניהול תפילות |
| `pages/Privacy.jsx` | מדיניות פרטיות |
| `pages/QA.jsx` | ספר השאלות והמענות |
| `pages/ResetPassword.jsx` | קביעת סיסמה חדשה |
| `pages/Signup.jsx` | הרשמת קורא |
| `pages/Terms.jsx` | תנאי שימוש |
| `pages/TheologicalInsights.jsx` | מעטפת ל־`InsightsBoard` עם סוג `theological` |
| `pages/VerseOfDay.jsx` | פסוק היום ושיתופו |
| `pages/VerseSongSeries.jsx` | אינדקס הסדרות ותצוגת שירי סדרה |
| `pages/VerseSongs.jsx` | רשת שירי המקרא והתור |

## 4.2 רכיבי ניהול

| קובץ | תפקיד |
|---|---|
| `components/admin/ChapterCoverage.jsx` | מציג כיסוי לפי ספר ומכווץ רשימות פרקים לטווחים כגון `2-5, 9, 12`. |
| `components/admin/CollectionsPanel.jsx` | מנהל כל אוסף נתונים לפי מטא־דאטה גנרי. |
| `components/admin/ConfirmDialog.jsx` | אישור מול מחיקה בלתי הפיכה. |
| `components/admin/CrossRefEditor.jsx` | עורך פרשות־חוצים כ־chips. |
| `components/admin/DevotionalBulkImport.jsx` | קורא, מאמת ומייבא קובצי מילים יומיות. |
| `components/admin/DevotionalForm.jsx` | טופס דו־לשוני למילה יומית. |
| `components/admin/DevotionalPlansPanel.jsx` | CRUD לתוכניות מילים יומיות והצגת מילים משויכות. |
| `components/admin/DevotionalsPanel.jsx` | מנהל מילים יומיות, נושאים, תוכניות וייבוא. |
| `components/admin/DevotionalTopicsPanel.jsx` | CRUD לנושאי מילים יומיות עם מניעת מחיקת נושא בשימוש. |
| `components/admin/JsonImportPanel.jsx` | ייבוא JSON גנרי לפי אוספים וייבוא קובצי ספר. |
| `components/admin/KjvPlusInstaller.jsx` | התקנת KJV+ ומילון Strong’s והצגת כיסוי. |
| `components/admin/LibraryReport.jsx` | מריץ ומציג ביקורת מקראייה קריאה־לקריאה. |
| `components/admin/LugandaInstaller.jsx` | התקנת מקרא לוגאנדה והצגת פרקים חסרים. |
| `components/admin/PassagesPanel.jsx` | ניהול תפילות פרק, פרשות־חוצים, הקדמות פרק וספר. |
| `components/admin/PrayerCrossRefImport.jsx` | ייבוא ובדיקת קבצי תפילה ו־cross references לפי ספר. |
| `components/admin/PrayersPanel.jsx` | ניהול ספרי תפילה או תפילות לפי מקרא. |
| `components/admin/QaAdminList.jsx` | רשימת Q&A לניהול, סינון, אותיות ובחירה מרובה. |
| `components/admin/QaBulkImport.jsx` | אימות וייבוא שאלות ותשובות. |
| `components/admin/QaItemForm.jsx` | טופס שאלה ותשובה דו־לשוני. |
| `components/admin/QaPanel.jsx` | מנהל Q&A, נושאים וייבוא. |
| `components/admin/QaQuestionsPanel.jsx` | רשימת שאלות, טופס ואישור מחיקה. |
| `components/admin/QaTopicForm.jsx` | טופס נושא Q&A דו־לשוני. |
| `components/admin/QaTopicsPanel.jsx` | ניהול נושאי Q&A והעברת שאלות לפני מחיקה. |
| `components/admin/RecordEditor.jsx` | טופס גנרי לפי שדות של אוסף. |
| `components/admin/VerseSongBulkImport.jsx` | אימות וייבוא שירי מקרא. |
| `components/admin/VerseSongForm.jsx` | טופס שיר, העלאת אודיו ואימות פרק. |
| `components/admin/VerseSongSeriesForm.jsx` | טופס סדרת שירים והעלאת תמונת כיסוי. |
| `components/admin/VerseSongsPanel.jsx` | ניהול שירים, סדרות וייבוא. |

## 4.3 רכיבים משותפים

| קובץ | תפקיד |
|---|---|
| `components/common/BrandIcons.jsx` | סמלי WhatsApp, Facebook, X, Telegram ודוא"ל. |
| `components/common/EmptyState.jsx` | מצב ריק עם אייקון, כותרת, הסבר ופעולה. |
| `components/common/Modal.jsx` | מודאל גנרי עם סגירה ב־Escape, סגירה בלחיצה חיצונית ונעילת גלילת הגוף. |
| `components/common/PageHeader.jsx` | כותרת אחידה לדפים, עם אפשרות לרקע תמונה. |
| `components/common/Pagination.jsx` | מנגנון עמודים מצומצם. |
| `components/common/ShareRow.jsx` | שורת כפתורי שיתוף מהירה. |
| `components/common/Spinner.jsx` | מצב טעינה נגיש עם `role="status"`. |

## 4.4 רכיבי קהילה, לוח אישי ותוכן

| קובץ | תפקיד |
|---|---|
| `components/community/CommentThread.jsx` | הצגת תגובות ושליחת תגובה חדשה. |
| `components/community/RevelationCard.jsx` | כרטיס גלויה עם לייק ומעבר לתגובות. |
| `components/community/RevelationForm.jsx` | טופס פרסום גלויה, כולל מצב לא מחובר. |
| `components/community/ThreadMessages.jsx` | הודעות בקבוצת לימוד. |
| `components/dashboard/ActivityFeed.jsx` | פיד פעילות אישי שמתעדכן אוטומטית. |
| `components/devotional/DevotionalCard.jsx` | כרטיס מילה יומית ברשימה. |
| `components/devotional/DevotionalFeatured.jsx` | כרטיש המילה היומית הראשית. |
| `components/devotional/DevotionalFilters.jsx` | מסנני שפה, חיפוש, נושא, סדרה ותאריך. |
| `components/devotional/DevotionalFullView.jsx` | תצוגת מילה יומית מלאה ופעולותיה. |
| `components/home/StatCard.jsx` | כרטיס מספר סטטיסטי. |
| `components/insight/InsightsBoard.jsx` | לוח תובנות תיאולוגיות או היסטוריות. |
| `components/journal/JournalCard.jsx` | כרטיס רשומת יומן. |
| `components/journal/JournalForm.jsx` | טופס יצירה או עריכה של רשומת יומן. |
| `components/plan/PlanRow.jsx` | שורה במסלול הקריאה עם מצב completed/current/upcoming. |

## 4.5 רכיבי פריסה ו־Q&A

| קובץ | תפקיד |
|---|---|
| `components/layout/AppFooter.jsx` | קישורי תפקידים, מותג ותרומה. |
| `components/layout/AppHeader.jsx` | ניווט ראשי ומשני, מצב מחובר ותפריט מובייל. |
| `components/layout/GlobalPlayer.jsx` | נגן אודיו גלובלי הממשיך בין עמודים. |
| `components/layout/PwaHead.jsx` | הוספת מטא־tags, manifest, favicon ורישום Service Worker. |
| `components/qa/QaCard.jsx` | כרטיס שאלה עם תשובה מקוננת, הצבעה ושיתוף. |
| `components/qa/QaFilters.jsx` | מסנני שפה, חיפוש ונושא. |
| `components/qa/QaLetterBar.jsx` | פס האותיות A - Z הנגלל. |

## 4.6 רכיבי קריאת המקרא

| קובץ | תפקיד |
|---|---|
| `components/read/AnnotatedText.jsx` | תצוגת טקסט עם הדגשות וקווי־תחתית לפי היסט־שינויים. |
| `components/read/BookGrid.jsx` | רשת 66 הספרים עם חיפוש ומעבר בין הבריתים. |
| `components/read/BookIntro.jsx` | הקדמת ספר, פסוקי מפתח והערות. |
| `components/read/BookOutline.jsx` | מבנה הספר ומעבר לטווח פסוקים. |
| `components/read/BookPrayerPanel.jsx` | תפילת הספר עם קישורי פסוקים והערות. |
| `components/read/BookSidebar.jsx` | מעטפת הפאנל השמאלי של הספר. |
| `components/read/BookStudyResources.jsx` | פירושים ותובנות לפי ספר עם pagination. |
| `components/read/ChapterClosingPrayer.jsx` | תפילת סיום הפרק. |
| `components/read/ChapterGrid.jsx` | רשת בחירת פרק. |
| `components/read/ChapterReaderPane.jsx` | תפריט לימוד ופתיחת הפאנל במסך צר. |
| `components/read/ChapterResourcesPanel.jsx` | תובנות תיאולוגיות והיסטוריות לפרק. |
| `components/read/ChapterSelector.jsx` | מסך בחירת ספר עם פאנל, מבנה ותפילה. |
| `components/read/ChapterSidebar.jsx` | פאנל מחקר לצד פרק: הקדמה, פירוש, תפילה ו־cross refs. |
| `components/read/CrossRefList.jsx` | רשימת פרשות־חוצים של פסוק ושל הפרק. |
| `components/read/CrossRefScripture.jsx` | טקסט פסוק היעד, מהיומן או ממקור המקרא. |
| `components/read/FloatingVerse.jsx` | חלון צף קטן עם פסוק וקישור למקרא. |
| `components/read/PassagePrayer.jsx` | תפילה הקשורה לפסוק ומצבי שפה. |
| `components/read/PassageTabs.jsx` | לשוניות מחקר לפי פסוק. |
| `components/read/ShareSheet.jsx` | מודאל שיתוף מלא עם רשתות, קישור, טקסט ו־native share. |
| `components/read/StrongsPopup.jsx` | הצגת משמעות קוד Strong’s. |
| `components/read/StrongsText.jsx` | הפרדת קודי Strong’s מטקסט הפסוק והפיכתם לקישושים. |
| `components/read/VerseActionBar.jsx` | פעולות הפסוק: תפילה, הערות, שיתוף וסימון. |
| `components/read/VerseCrossRefs.jsx` | הצגת פרשות־חוצים מתחת לפסוק. |
| `components/read/VerseList.jsx` | תצוגת רשימת פסוקים בסיסית. |
| `components/read/VersePopup.jsx` | חלון פסוק בתוך העמוד. |
| `components/read/VersionPicker.jsx` | בחירה, התקנה והסרה של תרגומים. |

## 4.7 רכיבי שירים

| קובץ | תפקיד |
|---|---|
| `components/song/SeriesCard.jsx` | כרטיס סדרת שירים. |
| `components/song/SongCard.jsx` | כרטיס שיר עם נגן, הורדה ושיתוף. |
| `components/song/SongFilters.jsx` | חיפוש וסינון שירים לפי סדרה וספר. |
| `components/song/SongShareSheet.jsx` | מודאל שיתוף ייעודי לשיר. |

## 4.8 ספריות `lib/`

| קובץ | תפקיד |
|---|---|
| `lib/activity.js` | כתיבת פעילות קורא, בצורה שאינה תשלול את הפעולה העיקרית אם הכתיבה נכשלת. |
| `lib/adminCollections.js` | מטא־דאטה של אוספים, שדות וסוגי שדות לטפסים הגנריים. |
| `lib/adminDirect.js` | הפעלת פעולות ניהול ישירות מהדפדפן דרך Entity SDK. |
| `lib/adminSession.js` | כניסה, בדיקה, חידוש, ביטול ואיפוס session מנהל. |
| `lib/app-params.js` | קריאת app token ו־app ID בזמן אמת. |
| `lib/AuthContext.jsx` | Provider של מצב המשתמש, כניסה, יציאה והפניית כניסה. |
| `lib/bibleApi.js` | טעינת פרק, זיהוי Strong’s ושימוש במטמון. |
| `lib/bibleBooks.js` | 66 ספרים, שמות אנגליים ולוגאנדיים, קיצורים ומספרי פרקים. |
| `lib/bookGuides.js` | הקדמות ומבני ספרים מצורמים. |
| `lib/bookImport.js` | זיהוי ופירוק קובצי ספר לאוספים. |
| `lib/bookIntro.js` | קריאת ונורמליזציה של הקדמת ספר ותפילת סיום. |
| `lib/bookPrayers.js` | תפילה מצורמת לכל ספר. |
| `lib/bookStudyContent.js` | פירושים ותובנות מצורמים לכל ספר. |
| `lib/brandCss.js` | מערכת עיצוב מרכזית עם CSS variables. |
| `lib/chapterIntros.js` | קריאת הקדמות פרק מהשרת ומהמטמון. |
| `lib/chapterStudy.js` | חישוב חומר הלימוד הרלוונטי לפרק. |
| `lib/contentApi.js` | מפת קריאת אוספים ציבוריים ופעולות יצירה ציבוריות. |
| `lib/crossRefs.js` | פרשות־חוצים מצורמות לפסוקים נפוצים. |
| `lib/devotionals.js` | נורמליזציה, תאריכים, תצוגה, מיון, כיסוי ושיתוף של מילים יומיות. |
| `lib/format.js` | עזרי תצוגה בטוחים, פיצול רשימות, כותרות ומשך זמן. |
| `lib/keyPassages.js` | פסוקי מפתח לכל ספר. |
| `lib/luganda.js` | פירוק וניקוי תוכן דו־לשוני וארוך. |
| `lib/offlineDb.js` | מעטפת IndexedDB, תיקון מבנה ישן וניהול stores. |
| `lib/planData.js` | תוכנית 30 הימים המצורמת. |
| `lib/player.jsx` | Provider ו־state machine של הנגן הגלובלי. |
| `lib/prayerImport.js` | פורמטים, ולידציה וייבוא קובצי תפילה. |
| `lib/prayerPassages.js` | תפילות פרק ופרשות־חוצים, כולל מפתחות טבעיים. |
| `lib/qaLibrary.js` | אותיות, סינון, מיון, טעינה ומטמון ספרי Q&A. |
| `lib/reading.js` | תאריכים מקומיים, יחידות זמן, רצף קריאה ותוויות. |
| `lib/readings.js` | רישום השלמת פרק והתאמתו ליום בתוכנית. |
| `lib/scriptureRefs.js` | פענוח, נרמול וקישור של פניות מקרא. |
| `lib/seedContent.js` | תוכן מצורמ: מילים יומיות, תפילות, Q&A, תובנות וקהילה. |
| `lib/sha256.js` | מימוש SHA-256 טהור ב־JavaScript. |
| `lib/share.js` | בניית טקססטים, קישורים ופתיחת רשתות שיתוף. |
| `lib/strongs.js` | נרמול קודי Strong’s ועזרי תצוגה. |
| `lib/strongsOffline.js` | מטמון מקומי להגדרות Strong’s. |
| `lib/studyAnnotations.js` | מיזוג ושמירת הערות צפייה בשרת ובמטמון. |
| `lib/textSelection.js` | מניעת פעולת לחיצה כאשר המשתמש באמצע בחירת טקסט. |
| `lib/themeContext.jsx` | טעינת הגדרות מותג והפקת צבעים נגזרים. |
| `lib/theme.js` | קבועי מותג, תמונות, קישורי תרומה ו־`STORAGE_KEYS`. |
| `lib/useDevotionalLibrary.js` | שמירה והשלמה של מילים יומיות במקום ובשרת. |
| `lib/verseSongs.js` | נרמול סדרות ושירים, בניית תור, חיפוש והורדה. |
| `lib/versions.js` | מרשם תרגומי המקרא, התקנה, הסרה ובחירת גרסה פעילה. |

## 4.9 פונקציות שרת ו־cron

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | האימות, חתימת session, איפוס סיסמה וניהול סוד מנהל. |
| `functions/adminContent.js` | API ניהול תוכן מוגנת ב־token, עם אישור זמני לאחר תפוגה. |
| `functions/bibleChapter.js` | טעינת פרק ממקורות ציבוריים וניקוי HTML. |
| `functions/content.js` | API ציבורי לתוכן ולהגשת פניות ציבוריות. |
| `functions/kjvInstall.js` | התקנת KJV+ לפי פרק והמרת מקור Strong’s. |
| `functions/lugandaInstall.js` | התקנת פרקי המקרא בלוגאנדה. |
| `functions/scriptureAudit.js` | ביקורת קריאה בלבד של כיסוי, מספרי פסוקים ו־Strong’s. |
| `functions/strongsDefinition.js` | בניית מטמון הגדרות Strong’s ממקורות ציבוריים. |
| `cron/scriptureInstall.js` | משימת שעתית להשלמת המקרא; ניתנת להרצה חוזרת ועוצרת כשאין התקדמות. |

## 4.10 קבצי ציבור ו־PWA

| קובץ | תפקיד |
|---|---|
| `__generated/tailwind.css` | תת־קבוצת מחלקי Tailwind שנוצרה אוטומטית. |
| `public/manifest.json` | שם האפליקציה, צבעי PWA, תצוגה ואייקונים. |
| `public/sw.js` | Service Worker עם cache-first ל־app shell ולתמונות, ו־network-first לשאר הבקשות. |
| `public/assets/media-library/0dbaf742d3ba_Prayer-Crossrefs-Template.json` | תבנית קובץ לייבוא תפילות ו־cross references. |
| `public/assets/media-library/f830b722d892_OBADIAH-PRAY-READ-BULK-IMPORT.json` | קובץ ייבוא לדוגמה עבור אובדיה. |
| `public/assets/media-library/4345fa1c4c79_icon-512x512.png` | אייקון האפליקציה המשמש ב־manifest וב־favicon. |
| `public/assets/media-library/ee6ae196bbbc_favicon.ico` | favicon. |
| `public/assets/media-library/b8660c2286d0_PrayRead-logo-2.png` | לוגו נוסף בספריית המדיה. |

### נכסים גנריים

הקבצים `public/assets/generated_*.png` הם נכסי תמונה גנריים שנוצרו אוטומטית. שמותיהם:

`generated_022a23b6.png`, `generated_0f91fdf8.png`, `generated_12b9fad2.png`, `generated_42d36dd2.png`, `generated_4e567607.png`, `generated_5fe46b6c.png`, `generated_703e129d.png`, `generated_8b82ca52.png`, `generated_a74541e8.png`, `generated_aa744f7a.png`, `generated_c990bd6c.png`, `generated_f0778e1c.png`.

### נכסי `media-library` נוספים

התמונות `*_image.png` משמשות כתמונות מדיה, עיצוב, כרטיסי תוכן או נכסי ממשק. שמותן כוללים:

`0c85aa753009`, `167e76d5f5ba`, `1d6d87cb476f`, `1dbef54503e4`, `1ec9f04959c2`, `1ff0be61e77a`, `209de39207b6`, `2f23bed430b0`, `338be12bc409`, `350264576583`, `3c1ee7293fba`, `3f5c848bd24a`, `43328fef264e`, `509b8dd9fb77`, `58132ad5907d`, `5e6a56a17475`, `5f9bed1b2604`, `63b0fbb0b77e`, `66f6c7e35387`, `69a5f10e35c8`, `6c913e96ceba`, `708b8e11d494`, `76b48b960fa0`, `7de90d460c48`, `7e9991b2d1af`, `803b8ad26a46`, `85b195fc595d`, `8b6bfb5e2978`, `8e87e23ff7f2`, `95eb8bea6f5e`, `99e40048d570`, `9cc70df0896c`, `a6f2acb34271`, `a8a22a4e715d`, `aba3dd407174`, `b4a70bcd3e36`, `be81da5e995e`, `ce0840ab1a1e`, `d90047a8174d`, `dfb06d6a5f1b`, `e5b6f7373a8f`, `e93b80fc4769`, `ee0d38d9f96a`, `eeb1cf10979d`, `f3b0b02ae7a0`, `f8aa8ef69f41`.

הקבצים `public/assets/ingested/` כוללים:

- `media_0fc9eec909.png`
- `media_7a14bfc357.xicon`

### קבצי עיצוב ומסמכים שאינם קוד יצירה

הקבצים `*.pdf`, קובצי `*.md` וה־ZIP בתיקיית `media-library` הם חומרי עיצוב, הנחיות או ייצואי מקור. אין להתייחס אליהם כחלק מה־runtime.

## 4.11 קבצים שאינם חלק מההפצה

### `__trash/`

הכוללים רכיבי Tailwind ישנים, דפי `Read` ישן, כלי בדיקה ו־probe זמניים. לדוגמה:

- `__trash/pages/Read.jsx`
- `__trash/pages/AdminDiag.jsx`
- `__trash/pages/AdminSmoke.jsx`
- `__trash/pages/ImportCheck.jsx`
- `__trash/pages/ImportPreview.jsx`
- `__trash/pages/InstallerCheck.jsx`
- `__trash/pages/ShareCheck.jsx`
- `__trash/pages/StrongsPopupTest.jsx`
- `__trash/functions/adminProbe.js`
- `__trash/functions/probeChapter.js`
- `__trash/functions/probeInvoke.js`
- `__trash/functions/probeSources.js`

אין לייבא קבצים מהתיקייה. ייבוא אקראי יכול להוסיף routes או endpoints מיושנים.

### `__url_fetch/`

זהוי snapshots של דפי מקור חיצוניים שנמצאו בזמן פיתוח. הם משמשים לחקירת parsing בלבד ואינם נטענים על ידי האפליקציה.

---

# 5. מודל הנתונים  -  Entities

## 5.1 ניהול והגדרות

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `AdminAccount` | חשבון מנהל תוכן ופרטי session. | `email`, `password_hash`, `salt`, `secret`, `session_version`, `updated_date` | משמש את `adminAuth` ואת מנגנון הגישה הישיר. |
| `ActivityLog` | יומן פעילות במנהל תוכן. | `actor`, `action`, `section`, `detail` | `actor` מציין את המנהל שביצע את הפעולה; אין מפתח זר המוגדר. |
| `SiteSettings` | הגדרות אתר גלובליות. | `setting_key`, `setting_value` | נקרא על ידי `ThemeContext`; משמש לצבעי מותג, שם האתר וקישור תרומה. |

## 5.2 ספרי המקרא והתוכן הספרי

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `BibleVerse` | רשומת פסוק בסיסית, בעיקר לצורך נתונים ישנים. | `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu` | מזוהה לפי מספר ספר, פרק ופסוק. |
| `KjvPlusChapter` | פרק KJV עם קודי Strong’s. | `book_number`, `book`, `chapter`, `verse_count`, `verses` | `verses` הוא JSON של פסוקים; יוצר על ידי `kjvInstall`. |
| `LugandaChapter` | פרק מקרא בלוגאנדה. | `book_number`, `book`, `chapter`, `verse_count`, `verses` | `verses` הוא JSON של פסוקים; יוצר על ידי `lugandaInstall`. |
| `BookIntro` | הקדמת ספר ותפילת סיום הספר. | `book_number`, `book_name`, `title_en`, `title_lu`, `intro_en`, `intro_lu`, `closing_prayer_en`, `closing_prayer_lu` | מזוהה לפי `book_number`; נקרא ב־`BookIntro` וב־`BookPrayerPanel`. |
| `ChapterIntro` | הקדמת פרק. | `book_number`, `book_name`, `chapter`, `title_en`, `title_lu`, `intro_en`, `intro_lu`, `source` | מזוהה לפי `book_number + chapter`. |
| `Commentary` | פירוש לפרק. | `book`, `chapter`, `title`, `body_en`, `body_lu` | מזוהה לפי שם הספר ומספר הפרק. |
| `Prayer` | תפילה כללית מספר התפילות. | `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref`, `cross_refs` | מזוהה לפי כותרת; `scripture_ref` מקשר לפרק. |
| `PrayerPassage` | תפילה לפרק, לטווח פסוקים או לפסוק יחיד. | `book_number`, `book_name`, `chapter`, `verse`, `verse_end`, `title_en`, `title_lu`, `prayer_en`, `prayer_lu` | `verse=0` מייצג את כל הפרק; מזוהה לפי ספר/פרק/טווח. |
| `CrossReference` | קשר מפסוק לפסוק אחר. | `book_number`, `chapter`, `verse`, `ref_book_number`, `ref_chapter`, `ref_verse`, `ref_verse_end`, `ref_text_en`, `ref_text_lu`, `note_en`, `note_lu` | מקור ויעד נשמרים באותה רשומה. |
| `StrongEntry` | משמעות קוד Strong’s. | `code`, `language`, `original_word`, `transliteration`, `pronunciation`, `part_of_speech`, `root_word`, `definition`, `source` | מזוהה לפי `code`; משמש את `StrongsPopup` ואת מטמון Strong’s. |

## 5.3 מילים יומיות

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `Devotional` | מילה יומית דו־לשונית. | `code`, `title_en`, `title_lu`, `scripture_ref`, `scripture_lu`, `verse_en`, `verse_lu`, `body_en`, `body_lu`, `prayer_en`, `prayer_lu`, `topic`, `series`, `date`, `cover_url`, `featured`, `active` | `code` מזוהה את המילה; `topic` ו־`series` משמשים לסינון. |
| `DevotionalTopic` | נושא מילים יומיות. | `name_en`, `name_lu`, `active` | המילה מקשרת בשם, ולא ב־topic_id; חשוב לשמור על עקביות שמות. |
| `DevotionalPlan` | תוכנית קריאה של מילים יומיות. | `name_en`, `name_lu`, `description`, `days`, `active` | הקשר למילים נוצר בניהול לפי `series == name_en`. |
| `DevotionalProgress` | סימון מילה יומית כנקראה. | `owner_email`, `devotional_code`, `completed_date` | קשור ל־`Devotional.code`. |
| `DevotionalSaved` | מילה יומית שנשמרה. | `owner_email`, `devotional_code`, `saved_date` | קשור ל־`Devotional.code`. |

## 5.4 קריאה אישית והערות

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `Reading` | פרק שהושלם ונתוני השלמה. | `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses` | `plan_day` מקשר ל־`ReadingPlan.day`; `book + chapter` הם מזהה לוגי. |
| `ReadingPlan` | תוכנית הקריאה הרשמית. | `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture` | מזוהה לפי `day`; חלופה ל־`PLAN_DAYS`. |
| `ReadingActivity` | פעולת קריאה אחת. | `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse` | קיימים סוגי `chapter_visit`, `highlight`, `bookmark`, `note_saved`, `prayer_opened`, `devotional_access`. |
| `StudyMark` | סימון, סימנייה או הערה על פסוק. | `owner_email`, `mark_type`, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text` | `mark_type` הוא `highlight`, `bookmark` או `note`. |
| `StudyAnnotation` | הדגשה או קו תחתון בחומר לימוד. | `owner_email`, `book_number`, `book`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset` | `section` כולל intro, outline, prayer או verse; ה־offset מציין מיקום בטקסט. |
| `JournalEntry` | רשומת יומן תפילה. | `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood` | קשורה למשתמש; `book` ו־`chapter` הם אופציונליים. |
| `PrayerSaved` | תפילה שנשמרה למועדפים. | `owner_email`, `prayer_title` | מזוהה לפי כותרת התפילה, לא לפי מזהה יציב של `Prayer`. |

## 5.5 קהילה, Q&A ותוכן ציבורי

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `Revelation` | גלויה אישית או תגובה לגלויה. | `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id` | `parent_id` מחבר תגובה לרשומת גלויית אב. |
| `DiscussionGroup` | קבוצת לימוד. | `name`, `description`, `schedule`, `member_count` | ההודעות מקשרות אליה בשם הקבוצה. |
| `DiscussionThread` | הודעה בקבוצת לימוד. | `group_name`, `owner_email`, `author_name`, `title`, `body` | קשור ל־`DiscussionGroup.name`. |
| `LiveSession` | מפגש הוראה חי. | `title`, `session_date`, `host`, `join_link`, `description` | אין קשר חיצוני; מוצג לפי תאריך. |
| `ContactMessage` | פנייה דרך טופס יצירת קשר. | `name`, `email`, `subject`, `message`, `is_read`, `reply` | נוצר על ידי משתמש כללי; נקרא ונענה על ידי מנהל. |
| `QAEntry` | שאלת קורא הממתינה לטיפול פסטורלי. | `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email` | נוצר על ידי משתמש מחובר; ניהולו על ידי מנהל. |
| `QAItem` | פריט בספר ה־Q&A הציבורי. | `topic_en`, `topic_lu`, `topic_id`, `scripture_ref`, `question_en`, `question_lu`, `answer_en`, `answer_lu`, `tags`, `featured`, `active` | `topic_id` מקשר ל־`QATopic`; אות המיון מחושבת מהשאלה ולא נשמרת. |
| `QATopic` | נושא בספר ה־Q&A. | `name_en`, `name_lu`, `description_en`, `description_lu`, `active` | מקשר ל־`QAItem` דרך `topic_id` ודרך שם הנושא. |
| `Insight` | תובנה תיאולוגית או היסטורית. | `kind`, `title`, `passage`, `excerpt`, `body`, `share_count` | `kind` הוא `theological` או `historical`; `passage` מקשר למקרא. |
| `VerseOfDay` | פסוק מומלץ לתאריך. | `verse_date`, `reference`, `text_en`, `text_lu`, `note` | מזוהה לפי תאריך. |

## 5.6 שירי מקרא

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `VerseSongSeries` | סדרת שירי מקרא. | `name`, `description`, `thumbnail`, `cover_image`, `accent`, `active` | השם נשמר בדיוק כפי שהמנהל הקליד. |
| `VerseSongEpisode` | שיר בודד בסדרה. | `series_name`, `title`, `book_name`, `book_number`, `chapter`, `verse`, `verse_ref`, `language`, `version`, `duration_label`, `duration_seconds`, `audio_url`, `cover_url`, `lyrics_en`, `lyrics_lu`, `episode_order`, `active` | מקשר לסדרה לפי `series_name`; השם אינו מזהה יציב ועלול להשתנות. |

## 5.7 דפוסי הקשר במערכת

ה־entities ברובם אינם משתמשים במפתחות זרים מוגדרים. הקשרים נוצרים בעיקר לפי מפתחות טבעיים:

- מילה יומית ← `code`.
- התקדמות/שמירת מילה יומית ← `owner_email + devotional_code`.
- תפילת פרק ← `book_number + chapter + verse + verse_end`.
- פרשת־חוצים ← פסוק מקור + פסוק יעד.
- הקדמת ספר ← `book_number`.
- הקדמת פרק ← `book_number + chapter`.
- סימון Strong’s ← `code`.
- הערת צפייה ← בעיקר `owner_email + block_id + kind + offsets`.
- שיר ← `series_name`.
- קבוצת דיון ← `group_name`.
- תגובת גלויה ← `parent_id`.

### סיכון עיקרי בקשרים מבוססי שם

`DevotionalPlan` ↔ `Devotional`, `VerseSongSeries` ↔ `VerseSongEpisode` ו־`PrayerSaved` ↔ `Prayer` מבוססים על שם. שינוי שם או איות שונה ינתק את הקשר. בעתיד מומלץ להוסיף `topic_id`, `series_id` ו־`prayer_id`.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 טעינת פרק מקרא

1. המשתמש נכנס ל־`/Chapter` עם `book`, `chapter`, `verse` ואולי `lang`.
2. `Chapter` קורא את הגרסה הפעילה דרך `getVersionOrDefault`.
3. `fetchChapter` מנסה למצוא את הפרק במטמון המקומי.
4. אם אין, הוא מנסה לקרוא את הפרק מה־Entity או מהשרת.
5. אם אין גם כן, הוא פונה למקור חיצוני.
6. תוצאת KJV+ מועברת דרך `markStrongCodes`.
7. הפסוקים מוצגים, והפסוק הנבחר מדגיש את `VerseActionBar`.
8. נטענים במקביל:
   - תפילות הפרק.
   - פרשות־חוצים.
   - הקדמת פרק.
   - הערות הצפייה.
   - חומרי המחקר.
9. נרשמת פעילת `chapter_visit`.
10. כאשר המשתמש מסיים את הפרק נשמרת רשומת `Reading`.

### נקודות debug

- אם מוצגת “פסוק לא נמצא”, לבדוק את פרמטר `book` ואת טבלת `offlineDb`.
- אם KJV+ מוצג ללא קודי Strong’s, לבדוק את תוצאת `markStrongCodes` ואת פורמט ה־verses.
- אם הרשימה מתעדכנת באיחור, לבדוק את `queryKey` ואת מנגנון ה־invalidation של React Query.
- אם הכרה אינה נשמרת, לבדוק את `owner_email` ואת הרשאות `Reading`.

## 6.2 יצירת הערת צפייה

1. המשתמש בוחר טקסט בתוך `AnnotatedText`.
2. `selectionInside` מונע מהלחיצה לפתוח פסוק במקום הבחירה.
3. רשימת ה־offset של הבחירה נשמרת עם:
   - `book_number`
   - `section`
   - `block_id`
   - `kind`
   - `color`
4. ההערה נשמרת ב־`StudyAnnotation` כשיש חשבון.
5. במקביל היא נשמרת ב־IndexedDB.
6. בטעינה הבאה מתבצע `mergeAnnotations` בין השרת למקומי.
7. `buildSegments` מפצל את הטקסט למקטעים ומצייד את ההדגשה והקו התחתון.

### נקודות debug

- הזהוי `block_id` חייב להיות יציב בין טעינות.
- שינוי טקסט משמעותי משנה את ה־offsets.
- יש לבדוק שה־owner מתאים למשתמש המחובר.
- מחיקה צריכה להסיר גם מהשרת וגם מהמטמון.

## 6.3 התקברות קורא

1. המשתמש מזין דוא"ל וסיסמה ב־`Login`.
2. `fse2.auth.login` מאמת את הפרטים.
3. בהצלחה המשתמש מועבר ל־`Dashboard`.
4. `AuthProvider` טוען את `fse2.auth.me()` בעליית האפליקציה.
5. `isAuthenticated`, `user`, `loading` ו־`error` נאספים ל־React Context.
6. כל רכיב שדורש חשבון משתמש ב־`useAuth()`.
7. יציאה מנקה את המצב ואז מנתק את ההתקשרות דרך FSe2.

### הערת אבטחה

`AuthContext` מבצע `setIsAuthenticated(true)` לאחר `auth.me()` שאינו זורק שגיאה. יש לוודא בסביבת הפלטפורמה ש־`me()` תמיד מחזיר אובייקט מחובר או זורק שגיאה; אחרת יש לבדוק את הערך לפני שינוי ה־state.

## 6.4 כניסת מנהל תוכן

המערכת תומכת בשני מסלולים:

### מסלול שרת

1. `adminSignIn` שולח אימיות, סיסמה ו־mode.
2. `adminAuth` קורא את `AdminAccount`.
3. הסיסמה מאומתת מול hash salted.
4. השרת יוצר session token חתום.
5. ה־token נשמר ב־`localStorage` תחת `pr_admin_token`.
6. המצב נשמר תחת `pr_admin_mode`.
7. פעולות ניהול נשלחות דרך `adminContent` עם ה־token.

### מסלול ישיר מהדפדפן

אם function gateway אינו פתוח לדפדפן:

1. `adminDirect` מאמת את המנהל דרך Entity SDK.
2. הפעולות מבוצעות ישירות מול `fse2.entities`.
3. התשובות מנורמלות לאותו מבנה כמו מסלול השרת.
4. ה־UI אינו מודע לאיזה מסלול נפעל.

### חידוש session

- `ensureFreshAdminToken` מנסה לחדש לפני פעולה ארוכה.
- `renewAdminSession` מאריך את ה־session.
- `startAdminKeepAlive` מנהל פעילות רקע.
- `adminSessionCheck` מאמת את תקינות ה־session בעליית דף Admin.
- `adminRevokeSession` מבטל session קיים.
- `adminSignOut` נקה את המצב המקומי.

### נקודות debug

- אם הכניסה מצליחה אך הפעולות נכשלות, לבדוק `pr_admin_mode`.
- אם ה־session מתחדש בכל קריאה, לבדוק את תאריך התפוגה ואת `session_version`.
- אם שינויים דרך השרת אינם נראים, לבדוק שהשרת והמצב הישיר משתמשים באותו entity.
- יש לוודא שרשימת `MANAGED` ב־`adminDirect` תואמת ל־allowlist ב־`adminContent`.

## 6.5 יצירה ועריכה דרך `CollectionsPanel`

1. המנהל בוחר אוסף מתוך `COLLECTIONS`.
2. `load` קורא את השורות דרך `callAdminData("list", ...)`.
3. החיפוש מסנן מקומית.
4. לחיצת Add יוצרת רשומה ריקה לפי `emptyRecord`.
5. `RecordEditor` מציג שדות לפי `COLLECTION_BY_ID[collection].fields`.
6. סוגי שדה:
   - `text`
   - `textarea`
   - `number`
   - `boolean`
   - `refs`
7. שדה `refs` משתמש ב־`CrossRefEditor`.
8. בשמירה מתבצע create או update דרך `callAdminData`.
9. לאחר הצלחה הרשימה נטענת מחדש.
10. למחיקה נפתח `ConfirmDialog`; המחיקה מתבצעת רק לאחר אישור.

### הערה חשובה

טפסים גנריים מאפשרים רק את השדות שהוגדרו ב־`adminCollections.js`. שדה שנוסף ל־Entity בלבד לא יופיע אוטומטית בטופס, גם אם ה־UI מציין שהמטא־דאטה נועדת להיות גנרית.

## 6.6 עריכת מילה יומית

1. `DevotionalsPanel` טוען מילים יומיות, נושאים ותוכניות.
2. לחיצת Add פותחת `DevotionalForm`.
3. הטופס מאכלס רשומה חדשה או רשומה קיימת, כולל תאיכות שמות ישנים.
4. נדרשים כותרות, פסוק, גוף ותפילה בשתי השפות, יחד עם פנייה למקרא ותאריך.
5. `scripture_ref` נבדק מול תבנית מספרית.
6. בשמירה נוצר קוד באמצעות `makeDevotionalCode` אם צריך.
7. לאחר הצלחה המודאל נסגר והרשימה מתרעננת.
8. `featured`, `active`, `date`, `series` ו־`topic` קובעים אם ומתי המילה תוצג.

## 6.7 ייבוא מילים יומיות

1. המנהל מוריד תבנית או מעלה קובץ JSON.
2. `DevotionalBulkImport` קורא את `devotionals`.
3. כל רשומה מומתת בנורמליזציה של `toRecord`.
4. נבדקים לפחות:
   - כותרת אנגלית ולוגאנדית.
   - פסוק אנגלי ולוגאנדית.
   - גוף אנגלי ולוגאנדית.
   - תפילה אנגלית ולוגאנדית.
   - פנייה למקרא.
   - תאריך.
5. שגיאות מוצגות לפי מספר שורת הקובץ.
6. כל עוד שיש שגיאה, כפתור הייבוא נשאר חסום.
7. לאחר אימות מתבצעת כתיבה דרך מנהל.
8. המפתח `code` מאפשר לייבוא חוזר לעדכן במקום ליצור כפולות.

## 6.8 ייבוא קובץ ספר לתפילות ו־cross references

1. המנהל בוחר ספר ופרק.
2. המערכת מציגה את התוכן המותקן כבסיס השוואה.
3. המנהל מעלה קובץ בפורמט `pray-read-prayer-crossrefs-v1`.
4. `validatePrayerFile` בודק את המבנה, השפות, פניות המקרא והטווחים.
5. `expandBookFile` מפרק את קובצי הספר לאוספים:
   - `PrayerPassage`
   - `CrossReference`
   - `ChapterIntro`
   - `BookIntro`
6. אם הקובץ מזוהה כקובץ ספר, `bookFileCollections` מרחיב אותו אוטומטית.
7. הייבוא מבצע upsert לפי מפתח טבעי.
8. המערכת מציגה דוח של נוספו, עודכנו ודולגו.
9. הקורא רואה את התוכן מיד לאחר רענון המטמון או השרת.

## 6.9 ייבוא JSON כללי

1. `JsonImportPanel` קורא את קובץ ה־JSON.
2. המפתחים מנוקים לפי `ALIASES`, למשל `prayers` → `Prayer`.
3. אם הקובץ מזוהה כ־book file, מתבצע הרחבה דרך `bookImport`.
4. כל אוסף מנורמל לפני כתיבה.
5. המשתמש רואה תצוגה מקדימה של כמות השורות.
6. רק לאחר אישור מתבצעת הכתיבה.
7. מפתחות טבעיים מונעים כפילויות בייבוא חוזר.

## 6.10 ניהול Q&A

### הוספת שאלה

1. `QaQuestionsPanel` פותח `QaItemForm`.
2. נבדקים נושא, שאלה ותשובה בשתי השפות.
3. שגיאות מסומנות ליד השדות.
4. בשמירה מתקבלת רשומה נורמלית.
5. רשימת השאלות מתרעננת.

### מחיקת נושא

1. `QaTopicsPanel` סופר שאלות המשויכות לנושא.
2. אם הנושא בשימוש, מוצגת חלונית העברה.
3. המנהל בוחר נושא יעד.
4. רק לאחר ההעברה מתאפשרת המחיקה.

### אותיות

`letterOf` מחשבת את האות מתחילת השאלה האנגלית. לכן עריכת שאלה מזיזה אותה אוטומטית בין קבוצות A - Z.

## 6.11 התקנת המקרא

### התקנה ידנית

1. המנהל נכנס לאזור Luganda או KJV+.
2. הלוחית מציגה את הסטטוס הנוכחי.
3. בלחיצת Install נשלחת פעולה לפונקציה המתאימה.
4. לפני הקריאה מבוצע `ensureFreshAdminToken`.
5. הפונקציה קוראת את הפרקים שכבר קיימים.
6. נבדק מה חסר.
7. הפונקציה מורידה רק פרקים חסרים ומאמתת את מספר הפסוקים.
8. הפרק נשמר ב־Entity מתאים.
9. הלוחית מתעדכנת ומציגה כיסוי לפי ספר.

### התקנה אוטומטית

`cron/scriptureInstall.js` מתוזמן פעם בשעה. הוא:

- בודק את המצב האמיתי במסד הנתונים.
- מנסה למלא רק פרקים חסרים.
- מפסיק כאשר הרצה אינה מייצרת התקדמות.
- משאיר פרק שנכשל לניסיון הבא.
- משלים גם את מילון Strong’s.

## 6.12 ביקורת המקראייה

`LibraryReport` קורא ל־`scriptureAudit` עם `action: "status"`. הפונקציה:

- קוראת בלבד.
- סופרת פרקים מותקנים לכל תרגום.
- מזהה פרקים חסרים או פגומים.
- משווה את מספר הפסוקים בין KJV+ ללוגאנדה.
- בודקת כמה מספרי Strong’s מוגדרים.
- מציגה את הפערים כך שניתן לאתר את המקור השגוי.

## 6.13 הורדה לא־מקוונת

1. המשתמש נכנס ל־`Offline`.
2. בוחר קטגוריה: פרקים, פסוקים, Strong’s, מילים יומיות, תפילות, Q&A וכו׳.
3. המערכת קוראת מהשרת או מהמקור הציבורי.
4. התוכן נכתב ל־IndexedDB במטמון מתאים.
5. ספר נחשב זמין לא־מקוון רק כאשר כל פרקיו קיימים בשפה הנדרשת.
6. `BibleReader` קורא את ה־store כדי לסמן ספרים זמינים.
7. ניתן למחוק stores או לנקות את כל המטמון.
8. נתוני המשתמש והתקדמות מקומית עשויים להישאר בנפרד מפני הניקוי.

## 6.14 חפיפת מילה יומית

1. `useDevotionalLibrary` קוראת מצב מקומי.
2. כשהמשתמש מחובר, המצב ממוזג מול `DevotionalSaved` ו־`DevotionalProgress`.
3. לחיצת Save מעדכנת מידית את המצב המקומי.
4. במקביל נשלח create/update/delete לשרת.
5. כשהמשתמש אינו מחובר, הפעולה נשמרת מקומית בלבד.
6. בכניסה מאוחרת המצב עשוי להתמזג עם השרת.

## 6.15 פעילות הקורא

1. רכיבים שונים קוראים ל־`logReadingActivity`.
2. הפעולה נשמרת ב־`ReadingActivity`.
3. ה־`ActivityFeed` מציג את 12 הפעילות האחרונות.
4. ה־feed מתרענן כל 30 שניות.
5. רק פעילות שבבעל החשבון מוצגות.
6. כישלון בכתיבת הפעילות אינו מבטל את הפעולה שהמשתמש ביקש.

## 6.16 נגן השירים הגלובלי

1. `PlayerProvider` יוצר אובייקט `Audio` אחד בשורש האפליקציה.
2. בחירת שיר מבנה תור ומפעילה אותו.
3. הנגן נשאר זמין בעת מעבר בין עמודים.
4. `GlobalPlayer` מוצג בתחתית המסך רק כאשר יש שיר פעיל.
5. הוא מציע:
   - השהיה והמשך.
   - קודם ובאחר.
   - חפש.
   - shuffle.
   - חזרה של שיר או של כל התור.
   - מהירות.
   - עוצמה.
   - הרחבה ומזעור.
6. גוף הדף מקבל מחלקת `pr-has-player` כדי למנוע חפיפה עם הנגן.

## 6.17 שיתוף

1. הרכיב הרלוונטי בונה טקסט מלא באמצעות `lib/share`.
2. `ShareSheet` מציג:
   - WhatsApp.
   - Facebook.
   - X.
   - Telegram.
   - Instagram.
   - LinkedIn.
   - מייל.
   - העתקה.
   - native share כשהמכשיר תומך.
3. רשתות שמקבלות קישור מקבלות גם את הפסוק כטקסט מוכן להדבקה.
4. `copyToClipboard` מדווח אם ההעתקה הצליחה.
5. הכתובת נוצרת מ־`window.location.origin`, ולכן היא נכספת לדומיין הפרסום.

## 6.18 עדכון PWA

1. `PwaHead` מוסיף meta tags ו־favicon.
2. הוא מוודא ש־`manifest.json` קיים.
3. הוא רושם את `public/sw.js`.
4. ה־Service Worker שומר app shell ותמונות במטמון.
5. בקשות API משתמשות תחילה ברשת ורק אחר כך במטמון.
6. בעת עדכון יש להגדיל את גרסאות `SHELL_CACHE` ו־`RUNTIME_CACHE`.

---

# 7. הערות טכניות לפיתוח

## 7.1 ספריות עיקריות

| ספרייה | שימוש |
|---|---|
| React | רכיבים, hooks ו־state מקומי |
| React Router | ניתוב, פרמטרים של URL ו־`navigate` |
| TanStack React Query | אחסון נתוני שרת, caching, mutations ו־invalidation |
| FSe2 SDK | אות, entities, functions, uploads והרשאות |
| Lucide React | ציורי ממשק |
| `date-fns` | עיצוב וחישוב תאריכים |
| Tailwind CSS | חלק מהממשק, בעיקר ברכיבים ישנים או מעבריים |
| CSS מותאם אישית | מערכת העיצוב העיקרית ב־`brandCss.js` |

## 7.2 מוסכנות תכנון

### ישרות רכיבים

רכיבים מקבלים props ולא מבצעים קריאות ישירות כאשר אפשר להעביר callback. דוגמאות:

- `RecordEditor` מקבל `onChange`, `onSave` ו־`onCancel`.
- `DevotionalsPanel` מקבל callbacks מ־`AdminDashboard`.
- רכיבי קהילה מקבלים `onSubmit`, `onLike` ו־`onToggleComments`.
- רכיבי המקרא מקבלים callbacks לפתיחת פסוקים ושמירת הערות.

### מקור נתונים יחיד

עדיף לא להוסיף קריאות ישירות ל־`fse2.entities` בתוך רכיב. במקום זאת:

- להשתמש ב־`contentApi` לתוכן ציבורי.
- להשתמש ב־React Query.
- להשתמש ב־`adminSession` לפעולות ניהול.
- להשתמש ב־`lib/offlineDb` לנתונים מקומיים.

### שכבות fallback

המערכת מעדיפה:

1. מטמון מקומי אם הוא מורשה.
2. שרת.
3. מקור חיצוני.
4. seed content.

אין להחליף סדר זה בלי לבדוק התנהגות offline.

### נורמליזציה

שכבת ה־normalizers קיימת כדי לתמוך ברשומות ישנות עם שמות שדה אחרים. לדוגמה, שדות מילה יומית ישנים עשויים להיות `title` או `scripture` במקום `title_en` או `scripture_ref`.

### מפתחות React Query

מפתחות שאינם כוללים את כל ה־dependencies יוצרים מידע ישן או סימון שגוי. בעת הוספת פילטר יש לכלול בו את כל הערכים המשפיעים על התוצאה, למשל:

- `["readingActivity", email]`
- `["studyMarks", email]`
- `["chapterInsights"]`
- `["cross-ref-scripture", bookNumber, chapter, language, versionId]`

## 7.3 רכיבי UI משותפים

### `Modal`

- נסגר ב־Escape.
- נסגר בלחיצה על הרקע.
- נועל את גלילת הגוף.
- אינו מנהל focus trap מלא.
- אין כריתור אוטומטי לפעולת המודאל על כפתור הסגירה.

### `ConfirmDialog`

- מיועד למחיקה בלבד.
- אינו משתמש ב־`Modal` המשותף.
- אין לו טיפול ב־Escape.
- יש לוודא ש־`onCancel` תמיד מוגדר כאשר הוא מוצג.

### `RecordEditor`

- מממש modal משלו.
- תלוי במבנה `[name, label, type]`.
- חייב לקבל `fields`, `values`, `onChange`, `onSave` ו־`onCancel`.

## 7.4 דפוס הזמנים והתאריכים

- תאריך מקומי מיוצג כ־`YYYY-MM-DD`.
- `toISODate` משתמש בשעות המקומיות, ולא ב־UTC ישיר.
- תאריך התפנה נקבע מול תאריך מקומי נוכחי.
- תאריכי מילים יומיות נסתכרים ב־`YYYY-MM-DD`.
- אין להשתמש ב־`new Date("YYYY-MM-DD")` בלי טיפול, מכיוון שזה עשוי להפוך ל־UTC בדפדפנים שונים.

## 7.5 שפות ותוכן דו־לשוני

- `EN`, `LU` ו־`BOTH` משמשים בממשק המילים היומיות.
- ב־Q&A משתמשים ב־`en`, `lu` ו־`both`.
- חלק מהקוד הישן משתמש ב־`EN`/`LU` ואחר ב־`en`/`lu`; יש לשמור על אותו מוסכנות בתוך אותו מסך.
- שדות סיום מתקיימים הם `*_en` ו־`*_lu`.
- שדות legacy כגון `title`, `body`, `scripture` ו־`category` עדיין נקראים בנורמליזציה כדי לתמוך בנתונים ישנים.

## 7.6 מפתחות טבעיים ו־upsert

כל ייבוא צריך להיות idempotent. לפני create יש לבצע lookup ולעדכן את הרשומה הקיימת.

מפתחות חשובים:

| סוג | מפתח מומלץ |
|---|---|
| מילה יומית | `code` |
| הקדמת פרק | `book_number + chapter` |
| הקדמת ספר | `book_number` |
| תפילת פרק | `book_number + chapter + verse + verse_end` |
| פרשת־חוצים | פסוק מקור + פסוק יעד + טווח |
| Strong’s | `code` |
| סדרת שיר | `name` או `series_id` עתידי |
| אינדקס לקריאה | `owner_email + devotional_code` |
| סימון קריאה | `owner_email + mark_type + book_number + chapter + verse` |

## 7.7 מטמון IndexedDB

מסד המטמון:

- שם: `prayread-offline`
- גרסה נוכחית: `9`
- מתעדכן אוטומטית כאשר חסרים stores חדשים.
- הקוד מנסה לשמור על נתונים קיימים בעת שינוי מבנה.
- כל store שניתן לבקש לא קיים צריך להחזיר הודעה ברורה.

Stores מרכזיים:

`books`, `chapters`, `verses`, `devotionals`, `commentary`, `prayers`, `qaItems`, `qaTopics`, `verseOfDay`, `meta`, `highlights`, `bookmarks`, `notes`, `annotations`, `strongs`, `prayerPassages`, `crossReferences`, `chapterIntros`.

### כלל בעת הוספת store

1. להוסיף את שמו ל־`STORES`.
2. להגדיל את `DB_VERSION`.
3. להוסיף handlers ל־`onupgradeneeded`.
4. להגדיר מפתח יציב ו־serialization.
5. להוסיף ניקוי, הורדה וספירה.
6. לבדוק שאין כתיבה ישירה ל־localStorage כאשר הנתון גדול.

## 7.8 אבטחה

### סיסמת מנהל

בקוד נמצאים fallback קבועים לדוא"ל, סיסמה ומפתח איפוס. יש להחליף אותם בסודות סביבה, להחליף את הסיסמה הראשונית לפני פרסום, ולא להשאיר את מפתח האיפוס הגלובלי בקוד.

### SHA-256 לסיסמאות

המערכת משתמשת ב־SHA-256 מלוח ב־salt. זה מתאים לפשטות בסיסית, אך עדיף להשתמש ב־PBKDF2, Argon2 או bcrypt עם work factor מתאים.

### session token

- ה־token חתום בשרת.
- נשמר ב־localStorage.
- יש grace period לאחר תפוגה כדי לא לנתק התקנה ארוכה.
- אין להדפיס את ה־token או את פרטי `AdminAccount` בלוגים.

### הרשאות בעלות

מספר entities נותנות למשתמשים מחוברים הרשאת CRUD רחבה, ואילו ה־UI מסנן לפי `owner_email`. סינון ב־UI אינו מנגנון אבטחה. יש להבטיח ברמת הפלטפורמה שמשתמש יכול לקרוא או לשנות רשומות שלו בלבד.

### סינון תצוגה

`safeText` מונע הצגת אובייקטים כמחרוזות, אך אינו מנקה HTML. React מספק escaping מול־XSS ברוב המקרים, ולכן אין להשתמש ב־`dangerouslySetInnerHTML` עם תוכן משתמש.

### CORS ומקורות חיצוניים

ההתקנות תלויות ב־bible-api.com, WordPlanet, Bolls, GitHub, Blue Letter Bible ועוד. שינוי markup, rate limiting או חסימת CORS ישפיע ישירות על ההתקנה. לכן נדרשים:

- User-Agent מוגדר.
- טיפול ב־HTML entities.
- fallback למקור נגיב.
- retry מוגבל.
- אי־כתיבת פרק לא תקין.

## 7.9 ביצועים

- `useMemo` ו־`useCallback` משומשים במסננים ובטעינות חוזרות.
- עלילות React Query נדרשות לפעילויות המשתמש, למשל מחיקה או עדכון רשומה.
- לא לטעון מאגרי seed גדולים בתוך רכיבים שמתעדכנים לעיתים קרובות.
- יש להימנע מיצירת אובייקטים חדשים ב־render עבור פונקציות השוואה.
- להגביל את רשימות הניהול; קיימת מגבלת 500 שורות שעלולה להסתיר רשומות.
- להשתמש ב־IndexedDB ולא ב־localStorage לתוכן מקרא גדול.

## 7.10 נגישות

הממשק כולל מספר מרכיבים נגישים:

- `role="dialog"`, `aria-modal`.
- `aria-label`.
- `aria-current`.
- `aria-pressed`.
- מצבי טעינה עם `role="status"`.
- כפתורי סגירה עם תווית.
- תפריטי A - Z נגישים.

יש לשפר:

- focus trap במודאלים.
- החזרת פוקוס לפתיחת המודאל.
- תפריטי `role="tab"` עם ניהול מקלדת מלא.
- הבהרה מספרית ברשימות.
- מצבי שגיאה המשויכים לשדות באמצעות `aria-describedby`.
- אלטרנטיבות מספריות לתמונות מכריכות.

## 7.11 נקודות תקלה ידועות

1. **חלופת המנהל:** server mode ו־direct mode חייבים לשמור על אותו צורת תשובה.
2. **רשימות מוגבלות:** `limit: 500` עלול להסתיר נתונים.
3. **זיהוי לפי שם:** תוכניות מילים יומיות וסדרות שירים רגישות לשינוי איות.
4. **מיזוג seed:** התאמה לפי כותרת עלולה להחזיר רשומה מצורמת במקום רשומה חיה דומה.
5. **העלאת תמונת סדרה:** ב־`VerseSongSeriesForm` בדיקת הקובץ משתמשת כרגע בהרשאות אודיו, ולא בהרשאות תמונה; גם הודעת השגיאה אינה תואמת את הבדיקה.
6. **זמן תוקף:** `Session` מתחדש בכל שימוש, ולכן כישלון אחד אינו בהכרח אומר שהמשתמש אינו מורשה.
7. **טעינת תוכן:** כישלון רשת יכול להחזיר תוכן seed במקום הודעת שגיאה; יש להבחין בין “אין תוכן” לבין “השרת לא זמין”.
8. **Service Worker:** שינוי URL או מבנה דף דורש עדכון גרסת cache.
9. **קבצים ישנים:** `__trash` עלולים להיות מיובאים בטעות וליצור routes או endpoints לא רצויים.
10. **קבצי `data:`:** חלק מהנכסים מגיעים כ־data URI. יש לבדוק שגודל הbundle, תאימות דפדפן והגנת CSP.
11. **URL hard-coded:** כתובת הלוגו והאייקון מפנה ל־app ID קבוע; העברת האפליקציה ל־app אחר דורשת עדכון.
12. **הרשאות Q&A:** ל־`QAEntry` יש מסלול יצירה ציבורי למשתמש מחובר, ולכן יש לוודא שאין חשיפת פרטי משתמשים או spam ללא moderation.

## 7.12 מה לבדוק לפני שחרור

- ניתוב של כל דף במובייל ובדסקטופ.
- כניסה, יציאה, איפוס סיסמה והתחברות למשתמש מחובר.
- כניסת מנה� בשרת ובמצב ישיר.
- קריאת פרק KJV, KJV+, Luganda ועם מקור חיצוני.
- אי־מקווניות לאחר סגירת רשת.
- ייבוא חוזר של אותו קובץ ללא כפילויות.
- מחיקת נושא שנמצא בשימוש.
- מחיקת סדרת שיר עם קבצים משויכים.
- השמעת שיר תוך ניווט בין עמודים.
- שיתוף בדפדפן נייד.
- שמירת הערה וטעינתה שוב.
- ייצור משתמש חדש ודרישת אימות דוא"ל.
- שגיאת רשת, timeout ופסטור ריק.
- נגישות במקלדת ובקורא מסך.
- ניקוי IndexedDB בלי למחוק סימונים חשובים בשרת.

## 7.13 מדריך להוספת פיצ’ר

### הוספת דף

1. ליצור `pages/NewPage.jsx`.
2. להשתמש ב־`createPageUrl("NewPage")`.
3. להוסיף קישור ל־`AppHeader`, `AppFooter` או מפת הניווט המתאימה.
4. לבדוק גם מובייל.
5. אם הדף דורש חשבון, להציג מצב כניסה במקום להפנות בלבד.

### הוספת entity

1. ליצור קובץ JSON תחת `entities/`.
2. להגדיר שדות, סוגים, labels ו־required.
3. לבחור רמת הרשאה מול ה־x-fse2-access.
4. להוסיף את ה־entity ל־`contentApi` אם הוא ציבורי.
5. להוסיף אותו ל־`adminCollections` אם הוא ניתן לניהול גנרי.
6. להוסיף אותו ל־`MANAGED` ב־`adminDirect` ול־allowlist ב־`adminContent`.
7. להוסיף normalizer ו־natural key.
8. להוסיף מטמון רק אם נדרש.

### הוספת שדה ל־entity קיים

1. לעדכן את סכמת ה־Entity.
2. לעדכן את ה־admin collection.
3. לעדכן את טופסי ה־import.
4. לעדכן את normalizers.
5. להגדיר תאיכות לרשומות ישנות.
6. לבדוק כי `emptyRecord` מחזיר ערך ברירת מחדל.
7. לבדוק את מסכי הקריאה, החיפוש והייצוא.

### הוספת תרגום מקרא

1. להוסיף הגדרה ל־`lib/versions.js`.
2. להגדיר את מקור השמירה.
3. להוסיף יכולת התקנה והסרה.
4. להגדיר cache key ייחודי הכולל את הגרסה והשפה.
5. להוסיף טיפול בקודי Strong’s אם נדרש.
6. לבדוק offline ו־PWA.

### הוספת ערוץ שיתוף

1. להוסיף אותו ל־`shareChannels` או `fullShareChannels`.
2. להוסיף אייקון ל־`BrandIcons` אם הוא מותאם אישית.
3. להוסיף mapping ב־`ShareSheet`.
4. לוודא שהגרסאות מובייל מקבלות קישור ולא רק טקסט.

### הוספת שדה למסלול

1. להוסיף את השדה לטבלת ה־Entity.
2. להוסיףו ל־`pickFields` או ל־normalizer.
3. להוסיףו לטופס.
4. לבדוק אם הוא נכלל בסינון, בייצוא ובייבוא.
5. להחליף מפתחות cache אם התוצאה משתנה.

---

## סיכום מבצע

המערכת בנויה סביב שלושה עקרונות:

1. **המקרא הוא מוצר לקריאה, לא רשימת פסוקים:** כל פרק כולל הקשר, מחקר, תפילה, הערות, פרשות ושיתוף.
2. **התוכן נשאר זמין גם ללא חשבון וגם ללא רשת:** seed content, מטמון מקומי ומקורות חיצוניים משלימים זה את זה.
3. **ה־CMS וה־seed נעבדים לפי אותו מודל נתונים:** ייבוא חוזר, מפתחות טבעיים, נורמליזציה ו־upsert מאפשרים לנהל את התוכן בבטחה.

לצורך דיבאג מהיר, הנקודה הראשונה לבדיקה היא לא תמיד ה־UI: חשוב לקבוע אם הבעיה נמצאת בשרת, ב־normalizer, ב־seed merge, במטמון המקומי או במקור החיצוני. רוב התקלות התצוגה נובעות מפער בין ארבעת השלבים האלה.
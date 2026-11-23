# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

## 0. מתודולוגיה והערות חשובות

התיעוד מבוסס על קוד המקור שסופק. חלק מהקבצים מסומנים במקור כ״נחתך״, ולכן:

- תיאורי המסלולים מבוססים על שימושי `createPageUrl`, על קובץ ה־Service Worker ועל קישורי הלינק הפנימיים.
- שדות שלא ניתן לראות במלואם, במיוחד ב־`Devotional`, `QAEntry`, `StudyAnnotation`, `VerseSongEpisode` ועוד, מתועדים לפי השימוש הנראה בקוד. יש להתייחס לקובץ ה־JSON המלא כמקור האמת.
- קובצי `__trash`, `__url_fetch` ו־`public/assets/media-library` מתועדים כארכיפים או חומרי מחקר, אך אינם חלק מהנתיב הרגיל של האפליקציה.
- קבצי `api/fse2Client` ו־`utils` מיובאים באפליקציה אך לא נמסרו במלואם; התיעוד מתייחס אליהם כאבסטרקציות תשתית.

בקובצי המסלולים מופיעים שמות העמודים באותיות גדולות, למשל `/BibleReader` ו־`/PrayerLibrary`.

---

# 1. מהות המערכת

## 1.1 תיאור כללי

Pray-Read Bible היא אפליקציית React לקריאת המקרא, מחקר ותפילה. היא מחברת בין:

- קריאת פרקי תנ"ך באנגלית ובלוגנדה.
- מערכת לימוד: מבוא, מתאר ספר, תהילים ופרשיות, פירושים, תובנות תיאולוגיות והיסטוריות ותפילות.
- כלי אישי: הדגשות, סימניות, הערות, יומן תפילה, קריאה שהושלמה, מעקב קריאה ורצף ימים.
- קהילה: פרסום חזויות אישיות, תגובות, קבוצות דיבור ושיעורים חיים.
- תוכן נוסף: תהילים יומיים, מניעות, ספרי תפילה, שירי פסוקים, Q&A ומאמרי תובנה.
- אפשרות עבודה ללא חיבור לאינטרנט לאחר הורדת תוכן.
- התקנה כ־PWA, המתאימה לנייד ולשולחן עבודה.
- מנהל תוכן נפרד לעריכת ספרים, מתפללים, תובנות, שירים, Q&A, הגדרות ורשומות פעילות.

## 1.2 קהלי היעד

### קורא כללי

יכול:

- לקרוא פרקים.
- לחפש בתנ"ך.
- לקרוא מניעות, תפילות ותובנות.
- להשתמש בשירי פסוקים.
- לשתף פסוקים ותוכן.
- להוריד תוכן לשימוש לא מקוון.

### קורא מחובר

קבל גישה נוספת ל:

- הדגשות וסימניות.
- הערות אישיות.
- יומן תפילה.
- התקדמות קריאה ורצף ימים.
- התראות פעילות.
- פרסום ותגובה בקהילה.
- שמירת תפילות ומניעות.

### מנהל תוכן

מנהל דרך `/Admin` ו־`/AdminDashboard`:

- מנהל את התוכן הציבורי.
- מוסיף ועורך רשומות.
- מנהל הגדרות אתר וצבעים.
- קורא פניות, שאלות ויומני פעילות.

## 1.3 הערך שהמערכת מספקת

המערכת מנסה להפוך פעילות רוחנית קצרה למסלול יומי מתמשך:

1. לבחור פרק.
2. לקרוא אותו לאט.
3. לסמן משפטים משמעותיים.
4. לפתוח פירוש, תובנה או פסוק מקושר.
5. להתפלל לפי הפרק.
6. לשמור התקדמות, רשימות והערות.
7. לחזור לאותו מקום בהמשך, גם לאחר התקנה או שינוי מכשיר.

העיקרון המרכזי הוא **שילוב של תוכן ציבורי עם מידע אישי**, תוך מתן fallback מובנה כך שהמסך לא נשאר ריק כאשר מאגר התוכן אינו זמין.

## 1.4 ארכיטקטורה כוללת

מבנה ראשי:

```text
React UI
   │
   ├── React Router ── מסלולי עמודים
   ├── TanStack Query ── קריאות, cache ו־invalidation
   ├── AuthContext ── מצב משתמש
   ├── ThemeContext ── צבעי אתר
   ├── PlayerContext ── נגן אודיו גלובלי
   │
   ├── FSe2 entities ── נתונים והרשאות
   ├── FSe2 functions ── אדמין, תוכן, פרקי תנ"ך
   ├── IndexedDB ── תוכן לא מקוון וסימוניות
   ├── localStorage ── העדפות, progress מקומי ו־admin token
   └── Service Worker ── PWA ו־caching
```

עקרונות מרכזיים:

- `Layout` מספק את כל ה־providers ברמת האפליקציה.
- הנגן נמצא מחוץ לניתובי הדפים, ולכן המשמעת ממשיכה בעת ניווט.
- תוכן ציבורי נטען דרך `contentApi`, עם תוכן seed כחלופה.
- נתוני קורא נשמרים בשם המשתמש, בעיקר לפי `owner_email`.
- ה־offline store נפרד מה־seed content ומשמש גם לשמירת הערות מקומיות.
- ה־theme מוגדר על ידי CSS variables שניתן לעדכן דרך ה־CMS.

---

# 2. עמודים ותפקידיהם

## 2.1 עמודי גלישה ותוכן ציבורי

| עמוד וכתובת | תפקיד והצדקת קיומו | פעולות ואינטראקציות מרכזיות |
|---|---|---|
| `pages/Home.jsx`  -  `/` | דף הכניסה והתדמית. הוא מציג את ערך המוצר, את הפעילות היומית, הנתיבים המרכזיים ואת התוכן הקהילתי. קיומו נועד לתת לקורא תשורה אחת שמובילה לפעולה. | קישורים ל־Bible Reader, Devotionals, Prayer Library, Q&A, Community ו־Verse-Songs; פתיחת מניעה או פסוק יומי; שיתוף; התקנת PWA; קישור לתרומה; כרטיסי תוכן מומלצים. |
| `pages/About.jsx`  -  `/About` | מסביר את זהות השירות, המטרה, השפות ומקורות התוכן. הוא נותן הקשר לפני שקורא מתחיל להשתמש באפליקציה. | קישור חזרה ל־Home; הצגת עקרונות קריאה, תפילה ושיתוף; הסבר על מקורות המקרא ועל זכויות יוצרים. |
| `pages/Devotionals.jsx`  -  `/Devotionals` | מרכז מניעות יומיות באנגלית ולוגנדה. הדף קיים כדי להפוך קריאת פסוק ליישום מעשי. | חיפוש וסינון; בחירת מניעה; פתיחת מניעה במודאל; קריאה מלאה בשפה הנבחרת; מעקב התקדמות; שיתוף; סימון כהושלם דרך `DevotionalProgress` וגם מקומי. ניתן לפתוח מניעה ישירות עם `?devotional=<code>`. |
| `pages/PrayerLibrary.jsx`  -  `/PrayerLibrary` | ספריית תפילות המשמשת לתפילה אישית ולשיתוף. היא מאפשרת גישה ללא חיבור דרך seed content. | חיפוש; סינון לפי קטגוריה ושפה; קריאת תפילה; שיתוף; שמירה למועדפים דרך `PrayerSaved`; הסרת השמירה; הודעת הצלחה. |
| `pages/QA.jsx`  -  `/QA` | מאגר שאלות קוראים עם תשובות פסטורליות והפניות למקרא. הוא מאפשר לחבר לגלות פערים בעבודת התוכן. | חיפוש וסינון לפי קטגוריה; קריאת שאלה ותשובה; פתיחת מקרא מקושר; שליחת שאלה חדשה עבור קורא מחובר; הצגת שגיאה והצלחה. |
| `pages/TheologicalInsights.jsx`  -  `/TheologicalInsights` | מעטפת דף לתובנות תיאולוגיות. הפיצול מהיסטוריות נועד למסלולי גילוי שונים. | מעביר `kind="theological"` ל־`InsightsBoard`; חיפוש; פתיחת תובנה; שיתוף; שמירה מקומית. |
| `pages/HistoricalInsights.jsx`  -  `/HistoricalInsights` | מעטפת דף לתובנות היסטוריות ורקע תרבותי. | מעביר `kind="historical"` ל־`InsightsBoard`; מציג את אותה חוויית חיפוש, פתיחה, שיתוף ושמירה. |
| `pages/VerseOfDay.jsx`  -  `/VerseOfDay` | תצוגה יומית ממוקדת שנותנת לקורא להתחיל מפסוק אחד. | בחירת הרשומה של היום או נפילה לרשומה ראשונה; הצגת הפסוק באנגלית או לוגנדה; קישור לפרק; שיתוף. |
| `pages/VerseSongs.jsx`  -  `/VerseSongs` | אינדקס לסדרות שירי מקרא ולפרקי האודיו שלהן. הוא מחבר בין דפי תוכן לנגן הגלובלי. | טעינת סדרות ופרקים; מיון לפי `episode_order`; השמעת סדרה או פרק; המשך השמעה בעת ניווט; הצגת שגיאת אודיו. |
| `pages/VerseSongSeries.jsx`  -  `/VerseSongSeries` | דף פירוט של סדרת שירים מסוימת. קיומו נותן מסלול ישיר וניתן לשיתוף. | טעינת הסדרה לפי `?series=<name>`; הצגת פרקים; השמעת סדרה או פרק; חזרה לנגן הגלובלי. |

## 2.2 עמודי קהילה

| עמוד וכתובת | תפקיד והצדקת קיומו | פעולות ואינטראקציות מרכזיות |
|---|---|---|
| `pages/Community.jsx`  -  `/Community` | מרכז מקושר לשלושת אזורי הקהילה: חזויות, לימוד חי וקבוצות דיבור. הוא מציג תוכן אחרון כדי להראות שהקהילה פעילה. | מעבר ל־Community Revelations, Live Teaching ו־Discussion Groups; הצגת פרסומים ושיעורים אחרונים; מעבר לפרטי פרסום או מפגש. |
| `pages/CommunityRevelations.jsx`  -  `/CommunityRevelations` | מאפשר לקוראים לשתף חזויות אישיות ולעדות עליהן באופן מבודד. הדף מיישם יצירת תוכן מול קהילה. | פתיחת טופס פרסום; הוספת כותרת, פסוק וגוף; סימון לייק; פתיחת וסגירת שרשור תגובות; מענה לתגובות; מיזוג live rows עם seed posts; הצגת מצב עמוס ושגיאה. |
| `pages/CommunityLiveTeaching.jsx`  -  `/CommunityLiveTeaching` | מציג מפגשי לימוד ותפילה חיים. הוא מתאים לתוכן שמתפרסם בזמן ואינו תוכן סטטי. | טעינת מפגשים; מיזוג עם מפגשי seed; הצגת תאריך, מנחה ותיאור; פתיחת `join_link`; טיפול במצב ריק וטעינה. |
| `pages/DiscussionGroups.jsx`  -  `/DiscussionGroups` | מאפשר לקבוצות ללמוד את אותו מקום תוכן במקביל ולשמור דיון מתמשך. | בחירת קבוצה; הצגת פרטים ומספר משתתפים; הצטרפות מקומית; פתיחת קבוצה ישירות עם `?group=<name>`; קריאת הודעות; שליחת הודעה עבור קורא מחובר; טיפול בשגיאה. |
| `pages/Contact.jsx`  -  `/Contact` | ערוץ לפניות כלליות שאינן שייכות ל־Q&A. הוא מפריד פניות שירות משאלות תוכן. | שם, דוא״ל, נושא והודעה; אימות בסיסי בדפדפן; שליחה ל־`ContactMessage`; הצגת הצלחה או שגיאה. |

## 2.3 עמודי הקורא, המעקב והכלים האישיים

| עמוד וכתובת | תפקיד והצדקת קיומו | פעולות ואינטראקציות מרכזיות |
|---|---|---|
| `pages/BibleReader.jsx`  -  `/BibleReader` | מסך בחירת הספר. הוא מציג את 66 הספרים בלי להמתין לרשת, תומך בחיפוש באנגלית ולוגנדה, ומפנה לפרק. | חיפוש לפי שם, קיצור ושם לוגנדה; מעבר בין ברית קדמה וחדשה; סימון ספר שכולו זמין לא מקוון; בחירת ספר; מעבר ל־`/Chapter?book=<number>&chapter=1`. |
| `pages/Chapter.jsx`  -  `/Chapter` | מרכז מסירת הקריאה. הוא מחבר את פסוקי הפרק, ההערות, הפירושים, התפילות, המאקרו, השיתוף וההתקדמות. | טעינת פרק לפי `book`, `chapter`, `verse`; החלפת גרסת תנ"ך; בחירת שפה; הדגשה, סימנייה והערה; פתיחת פסוקים מקושרים; פתיחת משאלות ותובנות; מסירת תפילה; שיתוף; סימון פרק כהושלם; פתיחת הערות אישיות. |
| `pages/BibleNotes.jsx`  -  `/BibleNotes` | מרכז ההדגשות, הסימניות וההערות שנשמרו מול פסוקים. הוא נותן לקורא לראות את כל הסימונים במקום אחד. | דרישת התחברות; מיון לפי סוג; מעבר לפסוק המסומן ב־`/Chapter?book=...&chapter=...&verse=...`; מצב ריק; מחיקת סימון; הצגת תאריך ופרטי מקור. |
| `pages/Dashboard.jsx`  -  `/Dashboard` | לוח אישי המרכז את פעילות הקורא, היעדים, ההתקדמות והמשאבים הזמינים ללא חיבור. | הצגת רצף ימים, זמן קריאה, סימניות, הערות, מניעות שהושלמו ותפילות שנשמרו; קיצורים לכלים; הצגת `ActivityFeed`; ספירת נתוני offline ונפח אחסון. |
| `pages/Journal.jsx`  -  `/Journal` | יומן תפילה אישי לפשטות, תפילה, וידוי, הודות והשתקפות. הוא מאפשר לקשור רשומה לפרק שנקרא. | יצירה דרך `?new=1`; מילוי כותרת, גוף, קטגוריה, ספר ופרק; עריכה; מחיקה עם אישור; סינון לפי קטגוריה; קישור לפרק; שמירה ב־`JournalEntry`. |
| `pages/Plan.jsx`  -  `/Plan` | מציג את מסלול הקריאה בן 30 הימים, המבוסס על יוחנן ומזמרים. הוא הופך את התוכן הסטטי ליעד יומי עם מדד התקדמות. | הצגת יום נוכחי, ימים שהושלמו והימים הבאים; חישוב אחוז התקדמות; מעבר לפרק; מצב אורח לתוכן מקומי. |
| `pages/Offline.jsx`  -  `/Offline` | מרכז ניהול התוכן המקומי. הוא נועד להבטיח שהקורא יוכל להמשיך לקרוא גם ללא חיבור. | בחירת קטגוריות להורדה; בחירת ספרים וגרסת תנ"ך; הורדת פרקים ופסוקים; הורדת מניעות, פירושים, Q&A ופסוק יומי; הצגת התקדמות; מחיקת נתונים; הצגת quota ושימוש באחסון. |
| `pages/InstallPrompt.jsx`  -  `/InstallPrompt` | מסביר כיצד להתקין את האפליקציה כ־PWA במכשירים שונים. | זיהוי standalone mode; זיהוי iOS, Android או desktop; הפעלת `beforeinstallprompt`; התקנה; טיפול לאחר `appinstalled`; הצגת הוראות ידניות לפי פלטפורמה. |

## 2.4 עמודי חשבון

| עמוד וכתובת | תפקיד והצדקת קיומו | פעולות ואינטראקציות מרכזיות |
|---|---|---|
| `pages/Login.jsx`  -  `/Login` | כניסה לחשבון קורא. היא נחוצה כדי לשמור נתונים אישיים בין מכשירים. | אימות דוא״ל וסיסמה; התחברות דרך `fse2.auth.login`; הפנה ל־Dashboard; הצגת שגיאה; קישור לשכחתי סיסמה ולהרשמה. |
| `pages/Signup.jsx`  -  `/Signup` | יצירת חשבון חדש. הוא כולל גם אימות סיסמה ותנאי שימוש. | שם מלא, דוא״ל, סיסמה ואימות; מדד חוזקת סיסמה; אישור תנאים; רישום; טיפול בדרישת אימות דוא״ל; הפנה ל־Dashboard. |
| `pages/ForgotPassword.jsx`  -  `/ForgotPassword` | מאפשר לבקש איפוס סיסמה בלי לחשוף אם כתובת מסוימת קיימת במסך. | אימות דוא״ל; קריאה ל־`fse2.auth.forgotPassword`; הודעת גניבות מאובטחת; הצגת שגיאה. |
| `pages/ResetPassword.jsx`  -  `/ResetPassword` | מאפשר לבצע איפוס באמצעות token שמתקבל מהקישור. | קריאת `token` או `access_token` מה־URL; בדיקת אורך סיסמה; אימות התאמת סיסמאות; קריאה ל־`fse2.auth.resetPassword`; הצגת הצלחה. |
| `pages/Logout.jsx`  -  `/Logout` | תאונת מעבר לעצירת ההתחברות וחזרה לדף הבית. | המתנה קצרה לצורך חוויית מעבר; קריאה ל־`logout`; החלפת הנתיב ל־Home. |

## 2.5 עמודי ניהול ומשפטיים

| עמוד וכתובת | תפקיד והצדקת קיומו | פעולות ואינטראקציות מרכזיות |
|---|---|---|
| `pages/Admin.jsx`  -  `/Admin` | כניסת מנהל תוכן. היא מבודדת מהתחברות קורא רגילה ומשתמשת ב־session token נפרד. | אימות דוא״ל וסיסמה; קריאה ל־`adminAuth`; שמירת token ב־localStorage; בדיקת session קיים; הפנה ל־AdminDashboard; הצגת שגיאה. |
| `pages/AdminDashboard.jsx`  -  `/AdminDashboard` | ממשק ניהול תוכן מלא. הוא נועד לאפשר ניהול תוכן ללא גישה ישירה למסד הנתונים. | מדפים: Overview, Books & Chapters, Devotionals, Prayers, Songs, Q&A, Insights, Users, Messages, Theme, Activity Log ו־Settings; יצירה, עריכה ומחיקה; העלאת תמונות; שינוי צבעים; ניהול פניות ושאלות; יציאה. |
| `pages/Privacy.jsx`  -  `/Privacy` | מסביר אילו נתונים נשמרים בחשבון, אילו נשארים מקומיים וכיצד מוחקים אותם. | קישור חזרה ל־Home; תיאור שמירת היסטוריית קריאה, סימונים, יומן והעדפות; הסבר על IndexedDB ו־localStorage; משפטי ביטחון ופרטיות. |
| `pages/Terms.jsx`  -  `/Terms` | מגדיר תנאי שימוש, זכויות תוכן, מקורות מקרא ואחריות המשתמש. | קישור חזרה ל־Home; הגבלת העתקה ושיתוף; התייחסות להבדלים בתרגומים; משפטים על תוכן קהילתי ושימוש בתוכן. |

---

# 3. מפת ניווט לצורך DEBUG

## 3.1 ניווט ראשי

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| חזרה לדף הבית | Header או Footer | הלוגו או `Home` | `/` |
| פתיחת מידע על האפליקציה | Header או Footer | `About` | `/About` |
| פתיחת קורא התנ"ך | Header, Home או Footer | `Bible Reader` | `/BibleReader` |
| פתיחת מניעות יומיות | Header, Home או Footer | `Devotionals` | `/Devotionals` |
| פתיחת ספריית התפילות | Header, Home או Footer | `Prayer Library` | `/PrayerLibrary` |
| פתיחת Q&A | Header, Home או Footer | `Q&A` | `/QA` |
| פתיחת הקהילה | Header, Home או Footer | `Community` | `/Community` |
| פתיחת לימוד חי | Header, Home או Community | `Live teaching` | `/CommunityLiveTeaching` |
| פתיחת פרסומי קהילה | Header, Home או Community | `Revelations` | `/CommunityRevelations` |
| פתיחת קבוצות דיבור | Header, Home או Community | `Discussion groups` | `/DiscussionGroups` |
| פתיחת תובנות תיאולוגיות | Header או Footer | `Theological insights` | `/TheologicalInsights` |
| פתיחת תובנות היסטוריות | Header או Footer | `Historical insights` | `/HistoricalInsights` |
| פתיחת פסוק היום | Header או Footer | `Verse of the day` | `/VerseOfDay` |
| פתיחת מסלול הקריאה | Header או Footer | `Reading plan` | `/Plan` |
| פתיחת יומן התפילה | Header או Footer | `Prayer journal` | `/Journal` |
| פתיחת הערות המקרא | Header או Footer | `My notes` | `/BibleNotes` |
| פתיחת מרכז ההורדה | Header או Footer | `Offline centre` | `/Offline` |
| פתיחת לוח המשתמש | Header | `Dashboard` | `/Dashboard` |
| כניסה למשתמש | Header | `Sign in` | `/Login` |
| יציאה | Header או Dashboard | `Sign out` | `/Logout` |
| פתיחת מסך ניהול | רגל או קישור ייעודי | `Admin` | `/Admin` |
| פתיחת התקנת האפליקציה | Home או Header | `Install app` | `/InstallPrompt` |
| מעבר לתנאי שימוש | Footer | `Terms` | `/Terms` |
| מעבר למדיניות פרטיות | Footer | `Privacy` | `/Privacy` |

## 3.2 זרימת קורא התנ"ך

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| בחירת ספר | `/BibleReader` | כרטיס ספר | `/Chapter?book=<number>&chapter=1` |
| בחירת פרק | `/BibleReader` או `/Chapter` | אריח פרק | `/Chapter?book=<number>&chapter=<n>` |
| הגעה לפרק מתוכנית הקריאה | `/Plan` | כפתור הפרק של `PlanRow` | `/Chapter?book=<number>&chapter=<n>` |
| פתיחת פסוק מסומן | `/BibleNotes` | כרטיס Highlight/Bookmark/Note | `/Chapter?book=<n>&chapter=<n>&verse=<n>` |
| מעבר לטאב משאלות | `/Chapter` | `Q&A for this passage` | תוכן Q&A בתוך דף הפרק |
| פתיחת פסוק מתוך פסוק מקושר | Sidebar או Prayer panel | לינק כגון `John 3:16` | `VersePopup` בתוך הדף |
| פתיחת פרשייה מתוך outline | Book Sidebar | כותרת או טווח ב־Outline | בחירת קטע ומעבר לפרק/verse popup |
| פתיחת פסוק מתוך תפילת ספר | Book Prayer Panel | קישור `[[Book 1:1]]` | `VersePopup` |
| פתיחת cross-reference | Verse Action Bar | כפתור ה־Cross References | `FloatingVerse` |
| העתקת פסוק | Verse Action Bar | `Copy` | Clipboard + משוב למשתמש |
| שיתוף פסוק | Verse Action Bar | `Share` | `ShareSheet` modal |
| פתיחת תפילה לפסוק | Verse Action Bar | `Prayer passage` | `PassagePrayer` |
| פתיחת פירוש | Verse Action Bar או Passage Tabs | `Commentary` | טאב פירוש בתוך הפרק |
| החלפת גרסת תנ"ך | Chapter Header | `VersionPicker` | טעינה מחדש ועדכון cache |
| בחירת מאקרו/תובנה | Chapter Sidebar | `Resources` | `ChapterResourcesPanel` |
| מעבר להפניה המלאה | `FloatingVerse` | `Open in Bible Reader` | דף Chapter עם book/chapter/verse |
| השלמת פרק | Chapter Controls | פעולת סיום/השלמה | יצירת `Reading` וסגירת יום התוכנית |

## 3.3 זרימת תוכן ושיתוף

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת מניעה | `/Devotionals` | כרטיס או כפתור מניעה | Modal של מניעה |
| פתיחת מניעה ישירות | קישור חיצוני | `?devotional=<code>` | Modal של המניעה הנכונה |
| סימון מניעה כהושלמה | Modal מניעה | `Mark complete` | `DevotionalProgress` ו־localStorage |
| חיפוש תפילה | `/PrayerLibrary` | שדה Search | רשימה מסוננת |
| שמירת תפילה | `/PrayerLibrary` | כפתור Bookmark | `PrayerSaved` |
| הסרת תפילה שמורה | `/PrayerLibrary` | Bookmark פעיל | מחיקת `PrayerSaved` |
| פתיחת תובנה | `/TheologicalInsights` או `/HistoricalInsights` | כרטיס תובנה | תצוגה מורחבת |
| שיתוף תובנה | כרטיס תובנה פתוח | `Share` | רשת חברתית או clipboard |
| שיתוף פסוק יומי | `/VerseOfDay` | `Share` | ערוצי השיתוף |
| פתיחת סדרת שירים | `/VerseSongs` | כרטיס סדרה | `/VerseSongSeries?series=<name>` |
| השמעת סדרה | `/VerseSongs` או `/VerseSongSeries` | Play על הסדרה | `PlayerContext` + `GlobalPlayer` |

## 3.4 זרימת קהילה

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| מעבר לפרסום חזויה | `/Community` | `Revelations` | `/CommunityRevelations` |
| מעבר ללימוד חי | `/Community` | `Live teaching` | `/CommunityLiveTeaching` |
| מעבר לקבוצת דיבור | `/Community` | `Discussion groups` | `/DiscussionGroups` |
| פתיחת טופס פרסום | `/CommunityRevelations` | `Share what God showed you` | טופס יצירה |
| שליחת פרסום | טופס פרסום | `Share` | יצירת `Revelation` |
| מתיאת לייק | כרטיס פרסום | כפתור הלב | עדכון `likes` |
| פתיחת תגובות | כרטיס פרסום | כפתור התגובות | `CommentThread` |
| שליחת תגובה | `CommentThread` | `Send` | יצירת רשומת Revelation עם `parent_id` |
| הצטרפות לקבוצה | `/DiscussionGroups` | `Join` | localStorage |
| פתיחת קבוצה | `/DiscussionGroups` | כרטיס קבוצה | `ThreadMessages` |
| שליחת הודעה לקבוצה | `ThreadMessages` | `Send` | יצירת `DiscussionThread` |

## 3.5 זרימת חשבון וניהול

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| כניסת קורא | `/Login` | `Sign in` | `/Dashboard` |
| הרשמת קורא | `/Login` | `Create account` | `/Signup` |
| איפוס סיסמה | `/Login` | `Forgot password` | `/ForgotPassword` |
| שליחת בקשת איפוס | `/ForgotPassword` | `Send reset link` | הודעת “sent” |
| קביעת סיסמה חדשה | קישור איפוס | `Reset password` | `/ResetPassword?token=...` |
| כניסת מנהל | `/Admin` | `Sign in` | `/AdminDashboard` |
| מעבר בין מדפי ניהול | `/AdminDashboard` | תפריט sidebar | טבלה או טופס בהתאם למדף |
| יצירת רשומת תוכן | מדף תוכן | `Add`/`New` | טופס יצירה |
| עריכת רשומה | טבלת תוכן | עטרת עריכה | טופס עריכה |
| מחיקת רשומה | טבלת תוכן | עטרת מחיקה | אישור ומחיקה |
| שינוי צבעי אתר | מדף `Text Colours` | בחירת צבע | עדכון `SiteSettings` |
| יציאת מנהל | `/AdminDashboard` | `Sign out` | ניקוי admin token |

---

# 4. מבנה הקבצים

## 4.1 קבצי הדפים

| קובץ | מה הוא מרנדר |
|---|---|
| `pages/Home.jsx` | דף הבית, hero, פעילות יומית, כרטיסי שירותים, תוכן קהילתי והצעת התקנה. |
| `pages/About.jsx` | מסך מותג ומידע על מקורות התוכן ועקרונות השימוש. |
| `pages/Devotionals.jsx` | רשימת מניעות, סינון, חיפוש, פתיחת מניעה ומעקב התקדמות. |
| `pages/PrayerLibrary.jsx` | ספריית תפילות עם חיפוש, סינון, שפה, שמירה ושיתוף. |
| `pages/QA.jsx` | רשימת Q&A וטופס שאלה לקורא מחובר. |
| `pages/Community.jsx` | מרכז הקהילה ותצוגת תוכן אחרון. |
| `pages/CommunityRevelations.jsx` | פרסום חזויות, לייקים ושרשורי תגובות. |
| `pages/CommunityLiveTeaching.jsx` | רשימת מפגשי לימוד חי. |
| `pages/DiscussionGroups.jsx` | קבוצות, הצטרפות ושיחות קבוצה. |
| `pages/TheologicalInsights.jsx` | מעטפת ל־InsightsBoard עם סוג תיאולוגי. |
| `pages/HistoricalInsights.jsx` | מעטפת ל־InsightsBoard עם סוג היסטורי. |
| `pages/VerseOfDay.jsx` | פסוק מומלץ ליום הנוכחי. |
| `pages/VerseSongs.jsx` | אינדקס סדרות Verse-Songs והפעלת הנגן. |
| `pages/VerseSongSeries.jsx` | פרטי סדרת שירים והשמעתה. |
| `pages/BibleReader.jsx` | בחירת ספר והכנה למעבר לפרק. |
| `pages/Chapter.jsx` | מסך קריאת פרק מלא. |
| `pages/BibleNotes.jsx` | רשימת סימוני פסוקים והערות. |
| `pages/Dashboard.jsx` | לוח אישי, סטטיסטיקות ופיד פעילות. |
| `pages/Journal.jsx` | רשימת יומן, טופס יצירה, עריכה ומחיקה. |
| `pages/Plan.jsx` | מסלול קריאה והתקדמות יומית. |
| `pages/Offline.jsx` | הורדות, מחיקות וניהול quota באחסון מקומי. |
| `pages/InstallPrompt.jsx` | הוראות והפעלת התקנת PWA. |
| `pages/Login.jsx` | טופס כניסת קורא. |
| `pages/Signup.jsx` | טופס הרשמה וחוזקת סיסמה. |
| `pages/ForgotPassword.jsx` | בקשת קישור איפוס סיסמה. |
| `pages/ResetPassword.jsx` | קביעת סיסמה חדשה. |
| `pages/Logout.jsx` | מסך מעבר והתנתקות. |
| `pages/Admin.jsx` | כניסת מנהל תוכן. |
| `pages/AdminDashboard.jsx` | CMS לניהול תוכן, משתמשים, פניות, הגדרות ופעילות. |
| `pages/Contact.jsx` | טופס יצירת פנייה. |
| `pages/Privacy.jsx` | מדיניות פרטיות. |
| `pages/Terms.jsx` | תנאי שימוש. |

## 4.2 רכיבים משותפים

| קובץ | תפקיד |
|---|---|
| `components/common/EmptyState.jsx` | מצב ריק או מצב המתנה להתחברות, עם אייקון, כותרת, הסבר ופעולה אופציונלית. |
| `components/common/Modal.jsx` | חלון דיאלוג מרכזי; סוגר בלחיצת רקע או `Escape`, נועל גלילת body ומציג כותרת, תת־כותרת, תוכן ו־footer. |
| `components/common/PageHeader.jsx` | header אחיד לעמודים, בגרסת hero עם תמונת רקע או גרסת קלטת. |
| `components/common/Pagination.jsx` | מעבר בין עמודי תוכן; מציג רשימת מספרים מקוצרת וכפתורי קודם/בא. |
| `components/common/ShareRow.jsx` | שורת שיתוף לפייסבוק, WhatsApp, Telegram, Instagram, LinkedIn והעתקה. |
| `components/common/Spinner.jsx` | מחוון טעינה נגיש עם `role="status"` ו־`aria-live`. |

## 4.3 רכיבי קהילה

| קובץ | תפקיד |
|---|---|
| `components/community/RevelationCard.jsx` | כרטיס חזויה: מחבר, פסוק, כותרת, גוף, לייק ומספר תגובות. |
| `components/community/RevelationForm.jsx` | טופס יצירת חזויה; מציג גם מסך התחברות למשתמש לא מחובר. |
| `components/community/CommentThread.jsx` | תצוגת תגובות וטופס תגובה על חזויה. |
| `components/community/ThreadMessages.jsx` | תצוגת הודעות ושליחת הודעה בקבוצת דיבור. |

## 4.4 רכיבי Dashboard, Home, Insight, Journal ו־Plan

| קובץ | תפקיד |
|---|---|
| `components/dashboard/ActivityFeed.jsx` | פיד פעילות אישי, ממופה לסוגי פעילות ולצבעים, עם רענון תקופי. |
| `components/home/StatCard.jsx` | כרטיס מדד עם אייקון, ערך, רמז וערך גדול. |
| `components/insight/InsightsBoard.jsx` | לוח תובנות לסינון לפי סוג וחיפוש, פתיחה, שיתוף ושמירה מקומית. |
| `components/journal/JournalForm.jsx` | טופס יומן עם קטגוריה, ספר ופרק; מאמת שיש תוכן. |
| `components/journal/JournalCard.jsx` | כרטיס רשומת יומן עם קטגוריה, כותרת, גוף, תאריך ופעולות עריכה/מחיקה. |
| `components/plan/PlanRow.jsx` | שורת יום בתוכנית, מצב completed/current/upcoming וקישור לפרק. |

## 4.5 רכיבי Layout

| קובץ | תפקיד |
|---|---|
| `components/layout/AppHeader.jsx` | header רספונסיבי, ניווט ראשי ומשני, מצב משתמש, התקנה, התנתקות ותפריט נייד. |
| `components/layout/AppFooter.jsx` | ניווט מקיף, מידע ארגוןי, קישורי מדיניות ותרומה; כולל fallback ל־`PR` אם הלוגו אינו נטען. |
| `components/layout/GlobalPlayer.jsx` | נגן אודיו גלובלי צף, במצב מקוצר ובמצב מורחב: play, pause, seek, skip, volume, speed, shuffle ו־repeat. |
| `components/layout/PwaHead.jsx` | מוסיף meta tags, manifest, Apple touch icon ורושם את ה־Service Worker. |

## 4.6 רכיבי הקורא

| קובץ | תפקיד |
|---|---|
| `components/read/AnnotatedText.jsx` | טקסט הניתן לבחירה ולסימון highlight או underline; מחלץ את ה־offset ומחזיר הערות לרמת הבלוק. |
| `components/read/BookGrid.jsx` | רשת 66 הספרים עם חיפוש דו־לשוני, מעבר בין שתי הברית וגלילה למקטע. |
| `components/read/BookIntro.jsx` | מבוא לספר, עובדות ספר, פסוקי מפתח והערות על המבוא. |
| `components/read/BookOutline.jsx` | מתאר חלוקת הספר; מאפשר לבחור פרשייה ולשמור על הבחירה הפעילה. |
| `components/read/BookPrayerPanel.jsx` | תפילת הספר באנגלית או לוגנדה עם פסוקי עזר מקושרים ואפשרות לסימון. |
| `components/read/BookSidebar.jsx` | עמודת המחקר של הספר עם שלושה טאבים: Intro, Outline ו־Prayer. |
| `components/read/BookStudyResources.jsx` | שלושה מקורות לימוד  -  Commentary, Theological ו־Historical  -  עם pagination בגודל שלושה שורות. |
| `components/read/ChapterClosingPrayer.jsx` | תפילת סיום הפרק, אפשרות בשפות הנבחרות, קישור פסוק, שיתוף וחזרה לתפילה. |
| `components/read/ChapterGrid.jsx` | רשת בחירת פרק עם סימון הפרק הנבחר. |
| `components/read/ChapterReaderPane.jsx` | עמודת הקריאה; מנהלת תפריט מחקרים, טאב Resources ו־fold במובייל. |
| `components/read/ChapterResourcesPanel.jsx` | תובנה תיאולוגית והיסטורית לפרק, עם fallback לתוכן ברמת הספר. |
| `components/read/ChapterSelector.jsx` | מנהל את מסך הבחירת הספר, מצב הספרים, הסימונים, ה־outline וה־popup. |
| `components/read/ChapterSidebar.jsx` | משאבי לימוד ברמת פרק: מבוא, פירוש ותפילה. |
| `components/read/FloatingVerse.jsx` | חלון צף להצגת פסוק מקושר ומעבר אליו בקורא התנ"ך. |
| `components/read/PassagePrayer.jsx` | מוצא תפילות המתאימות לפרק או פסוק ומציג אותן לפי שפה. |
| `components/read/PassageTabs.jsx` | טאבים לפירוש, תובנות ו־Q&A המתאימים לפרק. |
| `components/read/ShareSheet.jsx` | מודאל שיתוף פסוק הכולל פסוק בשתי שפות, תפילה, cross references והעתקה מלאה. |
| `components/read/StrongsText.jsx` | מפריד קודי Strong’s מתוך טקסט ומציג אותם כ־superscript. |
| `components/read/VerseActionBar.jsx` | פעולות פסוק: תפילה, הפניות, פירוש, highlight, bookmark, note, share ו־copy. |
| `components/read/VerseList.jsx` | תצוגת פסוקים קלה המבוססת Tailwind, המיועדת למסלולי קריאה ישנים יותר. |
| `components/read/VersePopup.jsx` | טוען פרק ברקע ומציג פסוק או טווח בתוך הדף, ללא ניווט. |
| `components/read/VersionPicker.jsx` | מתקין, מסיר ומבחר גרסאות תנ"ך, ומציג את הגרסה הפעילה. |

## 4.7 קבצי Entities

כל קובץ `entities/<Entity>.json` מגדיר ישות, שדות, תוויות, שדות חובה ומדיניות גישה. הפירוט המלא נמצא בסעיף 5.

- `entities/ActivityLog.json`
- `entities/AdminAccount.json`
- `entities/BibleVerse.json`
- `entities/Commentary.json`
- `entities/ContactMessage.json`
- `entities/Devotional.json`
- `entities/DevotionalProgress.json`
- `entities/DiscussionGroup.json`
- `entities/DiscussionThread.json`
- `entities/Insight.json`
- `entities/JournalEntry.json`
- `entities/LiveSession.json`
- `entities/Prayer.json`
- `entities/PrayerSaved.json`
- `entities/QAEntry.json`
- `entities/ReadingActivity.json`
- `entities/Reading.json`
- `entities/ReadingPlan.json`
- `entities/Revelation.json`
- `entities/SiteSettings.json`
- `entities/StudyAnnotation.json`
- `entities/StudyMark.json`
- `entities/VerseOfDay.json`
- `entities/VerseSongEpisode.json`
- `entities/VerseSongSeries.json`

## 4.8 קבצי Functions בצד השרת

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | כניסת מנהל, בדיקת session, חידוש/שינוי סיסמה, hashing ו־HMAC signing. |
| `functions/adminContent.js` | אימות admin token וביצוע פעולות CRUD על רשימת הישויות המנוהלות. |
| `functions/bibleChapter.js` | שרת proxy למקורות תנ"ך חיצוניים, עם ניקוי HTML ו־entities והמרה לפורמט אחיד. |
| `functions/content.js` | API ציבורי לקריאת אוספים וקבלת הגשות ציבוריות כגון פניות ושאלות. |

## 4.9 קבצי `lib`

| קובץ | תפקיד |
|---|---|
| `lib/activity.js` | מילון סוגי פעילות ורישום פעילות קורא בלי להפריע לפעולת המוצר אם הכתיבה נכשלת. |
| `lib/adminSession.js` | ניהול admin token ב־localStorage ועטיפת קריאה ל־`adminAuth`. |
| `lib/app-params.js` | פרמטרי אפליקציה תאימים ל־FSe2: app ID, token, כתובת מקור וגרסת functions. |
| `lib/AuthContext.jsx` | Provider של מצב המשתמש, כניסה, התנתקות, הפנה להתחברות וטעינת מצב. |
| `lib/bibleApi.js` | נורמליזציה, פענוח וטעינת פרקים; כולל fallback ל־IndexedDB. |
| `lib/bibleBooks.js` | נתוני 66 הספרים: מספר, שם, קיצור, שם לוגנדה ומספר פרקים. |
| `lib/bookGuides.js` | מבוא ו־outline מוכנים לכל ספר. |
| `lib/bookPrayers.js` | תפילה מוכנה לכל ספר בשתי שפות, עם הפניות `[[Book 1:1]]`. |
| `lib/bookStudyContent.js` | תוכן לימוד מוכן ברמת ספר: פירוש, תובנה תיאולוגית והיסטורית. |
| `lib/brandCss.js` | מערכת העיצוב המרכזית ו־CSS variables של ivory, emerald ו־gold. |
| `lib/chapterStudy.js` | חיבור מידע ברמת פרק לפרוצי ספר, פירוש, תובנה, תפילה ופסוקי מפתח. |
| `lib/contentApi.js` | ממשק אחיד לקריאת תוכן ציבורי מה־FSe2 או מה־content function. |
| `lib/crossRefs.js` | הפניות מקושרות לפסוקים פופולריים. |
| `lib/format.js` | כללי עיצוב טקסט, משכל בטוח, כותרות, משך זמן וגודל קבצים. |
| `lib/keyPassages.js` | שלושה פסוקי מפתח לכל ספר. |
| `lib/luganda.js` | פורמטול וניקוי של מניעות לוגנדה. |
| `lib/offlineDb.js` | IndexedDB wrapper ו־stores לפרקים, פסוקים, תוכן והערות. |
| `lib/planData.js` | תוכנית 30 הימים המשמשת fallback. |
| `lib/player.jsx` | Provider ו־audio element גלובלי עם queue, shuffle, repeat, speed ו־volume. |
| `lib/reading.js` | תאריכי ISO, תוויות תאריך, שבוע אחרון וחישוב streak. |
| `lib/readings.js` | שמירת התקדמות קריאה ומיפוי פרק ליום בתוכנית. |
| `lib/scriptureRefs.js` | פירוש הפניות מקרא, כולל ranges ו־aliases כגון `Ps` ו־`Song`. |
| `lib/seedContent.js` | תוכן בסיס למניעות, תפילות, שירים, Q&A, תובנות וחזויות. |
| `lib/share.js` | בניית קישורי שיתוף והעתקת טקסט. |
| `lib/studyAnnotations.js` | מפתח annotation, מיזוג server/local, שמירה ומחיקה. |
| `lib/textSelection.js` | מניעת פעולת קליק מקומית כאשר המשתמש רק בחר טקסט. |
| `lib/themeContext.jsx` | טעינת הגדרות מותג והפקת צבעים גזורים. |
| `lib/theme.js` | קבועי המותג, קבצי לוגו, תמונות hero וקישור תרומה. |
| `lib/versions.js` | רשימת גרסאות תנ"ך, התקנה מקומית, בחירה והסרה. |

## 4.10 קובץ השורש

| קובץ | תפקיד |
|---|---|
| `Layout.jsx` | מעטפת האפליקציה: `AuthProvider`, `ThemeProvider`, `PlayerProvider`, header, main, footer, player ו־PWA. |
| `__generated/tailwind.css` | תוצר Tailwind סטטי הכולל את שיעורי ה־utility שנמצאו בפרויקט. אין לראות בו את כל האפשרויות של Tailwind. |

## 4.11 קבצי Public

| קובץ | תפקיד |
|---|---|
| `public/manifest.json` | הגדרת PWA: שם, תצוגה, צבעים, scope, start URL ואייקונים. |
| `public/sw.js` | Service Worker עם cache-first ל־app shell ולתמונות, ו־network-first לרוב הבקשות. |
| `public/assets/generated_022a23b6.png` | נכס תמונה גנרי; משמש בין היתר כתמונת hero. |
| `public/assets/generated_0f91fdf8.png` | אייקון PWA גדול. |
| `public/assets/generated_5fe46b6c.png` | נכס תמונה גנרי. |
| `public/assets/generated_703e129d.png` | נכס תמונה גנרי. |
| `public/assets/generated_8b82ca52.png` | נכס תמונה גנרי. |
| `public/assets/generated_a74541e8.png` | נכס תמונה גנרי. |
| `public/assets/generated_aa744f7a.png` | נכס תמונה גנרי. |
| `public/assets/generated_c990bd6c.png` | לוגו ו־Apple touch icon. |
| `public/assets/generated_f0778e1c.png` | נכס תמונה גנרי. |

### `public/assets/media-library`

הקבצים הבאים הם חומרי מדיה או מחקר. אין ראיה שהם נטענים ישירות בנתיב הרגיל של האפליקציה:

- `167e76d5f5ba_image.png`
- `1d6d87cb476f_image.png`
- `1ec9f04959c2_image.png`
- `350264576583_image.png`
- `3c1ee7293fba_image.png`
- `3f5c848bd24a_image.png`
- `43328fef264e_image.png`
- `58132ad5907d_image.png`
- `63b0fbb0b77e_image.png`
- `69a5f10e35c8_image.png`
- `708b8e11d494_image.png`
- `803b8ad26a46_image.png`
- `8b6bfb5e2978_image.png`
- `9865967db356_Pray-Read-Bible-Prompt-3-Bible-Reader-Rebuild.pdf`
- `a6f2acb34271_image.png`
- `aba3dd407174_image.png`
- `b4a70bcd3e36_image.png`
- `b50e6c213bb8_pray-read-pneuma-main-3.zip`
- `d90047a8174d_image.png`
- `e5b6f7373a8f_image.png`
- `ee0d38d9f96a_image.png`
- `f3b0b02ae7a0_image.png`
- `f438ed4a3a0d_Pray-Read-Bible-Master-Prompt-For-Finestructure-Ai.pdf`
- `f4ad877aa93e_WhatsApp-Image-2026-11-23-at-4-49-46-PM.jpeg`
- `f8aa8ef69f41_image.png`

## 4.12 קבצי `__trash`

אלה רכיבים ודפים ישנים שאינם חלק מהאפליקציה הפעילה:

- `__trash/components/home/TodayCard.jsx`
- `__trash/components/home/WeekStrip.jsx`
- `__trash/components/layout/Sidebar.jsx`
- `__trash/components/layout/SignInBanner.jsx`
- `__trash/components/read/BookPicker.jsx`
- `__trash/components/read/ReflectionPanel.jsx`
- `__trash/functions/probeSources.js`
- `__trash/pages/Insights.jsx`
- `__trash/pages/Read.jsx`

הם עשויים להיות שימושיים כהשראה למימוש הישן, אך אין לייבא אותם באופן אקראי. במיוחד `Read.jsx` מיישם מסלול קריאה ישן שאינו תואם למבנה הנוכחי של `BibleReader` ו־`Chapter`.

## 4.13 קבצי `__url_fetch`

זהו ארכיב של תגובות HTTP וצילומי מסך שנאספו במהלך הפיתוח. הוא אינו תלוי ב־runtime:

- API ו־Bible API snapshots.
- דפי Wordplanet.
- נתוני Wikimedia.
- קובצי ניתוח עיצוב של Finestructure.
- Data URL של צילומי מסך.
- תגובת שגיאה מ־wordproaudio.

הקבצים יכולים לעזור ב־debug של מקורות חיצוניים ובהבנת ההיסטוריית הוויזואלית, אך אין לכלול אותם ב־build או להגיש ללקוח.

---

# 5. מודל הנתונים

## 5.1 עקרונות כלליים

- רוב הישויות כוללות שדות מערכת שנוספים אוטומטית, כגון `id`, `created_date` ו־`updated_date`.
- הקשרים בין ישויות הם לוגיים, מבוססי שם או מזהה, ולא foreign key מפורש.
- רשומות אישיות כוללות בדרך כלל `owner_email`.
- הרשאות `*` משמעותן קריאה ציבורית.
- תפקידי `owner`, `user` ו־`authenticated` משמעותם בעיקר פעולות על רשומות של המשתמש.
- שינוי שם של ספר, מניעה, סדרת שירים או קבוצה עלול לשבור קשר המבוסס על שם.

## 5.2 תוכן ציבורי וניהול

### `ActivityLog`

- **מטרה:** יומן פעילות במערכת ניהול התוכן.
- **שדות:** `actor`, `action`, `section`, `detail`.
- **קשרים:** `actor` מייצג זהות מנהל או משתמש.
- **הרשאות:** קריאה ושינוי על ידי owner/admin.

### `AdminAccount`

- **מטרה:** הגדרת חשבון מנהל תוכן.
- **שדות:** `email`, `password_hash`, `salt`, `updated_date`.
- **קשרים:** נמצא בהתאם לדוא״ל מול `AdminAccount`.
- **הרשאות:** owner/admin בלבד.

### `BibleVerse`

- **מטרה:** אחסון פסוק בודד באנגלית ובלוגנדה.
- **שדות:** `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu`.
- **קשרים:** `book_number` מתאים ל־`lib/bibleBooks.js`.
- **הרשאות:** קריאה ציבורית; יצירה ועדכון על ידי admin.

### `Commentary`

- **מטרה:** פירוש ברמת ספר ופרק.
- **שדות:** `book`, `chapter`, `title`, `body_en`, `body_lu`.
- **קשרים:** מתאים ל־`BibleVerse` ול־`lib/bibleBooks.js` לפי שם ומספר פרק.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

### `ContactMessage`

- **מטרה:** פנייה כללית מהטופס בדף Contact.
- **שדות:** `name`, `email`, `subject`, `message`, `is_read`, `reply`.
- **קשרים:** יכולה להיות מקושרת לפי `email` למשתמש, אך אין קשר חובה.
- **הרשאות:** יצירה על ידי כל גולש; קריאה, עדכון ומחיקה על ידי admin.

### `Devotional`

- **מטרה:** מניעה יומית דו־לשונית.
- **שדות מרכזיים:** `code`, `title`, `title_lu`, `scripture`, `scripture_lu`, `body`, `body_lu`, `related`, `further_readings`, `cover_image`.
- **קשרים:** `code` משמש מפתח לחיבור עם `DevotionalProgress`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

### `DevotionalProgress`

- **מטרה:** סימון מניעה שהושלמה על ידי קורא.
- **שדות:** `owner_email`, `devotional_code`, `completed_date`.
- **קשרים:** `devotional_code` → `Devotional.code`.
- **הרשאות:** owner/admin/user/authenticated.

### `DiscussionGroup`

- **מטרה:** קבוצת לימוד משותפת.
- **שדות:** `name`, `description`, `schedule`, `member_count`.
- **קשרים:** `name` → `DiscussionThread.group_name`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

### `DiscussionThread`

- **מטרה:** הודעה בתוך קבוצת דיבור.
- **שדות:** `group_name`, `owner_email`, `author_name`, `title`, `body`.
- **קשרים:** `group_name` → `DiscussionGroup.name`.
- **הרשאות:** קריאה ציבורית; יצירה/עדכון/מחיקה על ידי authenticated/admin.

### `Insight`

- **מטרה:** תובנה תיאולוגית או היסטורית המקושרת למקרא.
- **שדות:** `kind`, `title`, `passage`, `excerpt`, `body`, `share_count`.
- **ערכי `kind`:** `theological` או `historical`.
- **הרשאות:** קריאה ציגורית; כתיבת admin.

### `LiveSession`

- **מטרה:** מפגש לימוד חי עתידי.
- **שדות:** `title`, `session_date`, `host`, `join_link`, `description`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

### `Prayer`

- **מטרה:** תפילה מספריית התפילות.
- **שדות:** `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref`.
- **קשרים:** `title` → `PrayerSaved.prayer_title`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

### `PrayerSaved`

- **מטרה:** רשימת תפילות מועדפים של קורא.
- **שדות:** `owner_email`, `prayer_title`.
- **הרשאות:** owner/admin/user/authenticated.

### `QAEntry`

- **מטרה:** שאלת קורא ותשובת הנהגה או עורך.
- **שדות:** `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email`.
- **קשרים:** `passage_ref` מפנה למקרא; `author_email` למשתמש.
- **הרשאות:** קריאה ציבורית; authenticated יכול ליצור; admin/owner מענה ומעדכן.

### `ReadingPlan`

- **מטרה:** הגדרת מסלול הקריאה.
- **שדות:** `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture`.
- **קשרים:** `day` → `Reading.plan_day`; `book` ו־`chapter` → פרק מתוכנית.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

### `SiteSettings`

- **מטרה:** הגדרות אתר בצורת key/value.
- **שדות:** `setting_key`, `setting_value`.
- **שימושים:** שם האתר, צבעי ivory/emerald/gold וקישור תרומה.
- **הרשאות:** קריאה ציגורית; כתיבת admin.

### `VerseOfDay`

- **מטרה:** פסוק מומלץ לתאריך מסוים.
- **שדות:** `verse_date`, `reference`, `text_en`, `text_lu`, `note`.
- **הרשאות:** קריאה ציבורית; כתיבת admin.

### `VerseSongSeries`

- **מטרה:** סדרת שירי מקרא.
- **שדות:** `name`, `description`, `thumbnail`, `cover_image`, `accent`.
- **קשרים:** `name` → `VerseSongEpisode.series_name`.
- **הרשאות:** קריאה ציגורית; כתיבת admin.

### `VerseSongEpisode`

- **מטרה:** פרק אודיו בתוך סדרת שירים.
- **שדות:** `series_name`, `title`, `verse_ref`, `duration_label`, `duration_seconds`, `audio_url`, `audio_key`, `thumbnail`, `episode_order`.
- **קשרים:** `series_name` → `VerseSongSeries.name`.
- **הרשאות:** קריאה ציגורית; כתיבת admin.

## 5.3 נתוני קורא

### `JournalEntry`

- **מטרה:** רשומת יומן תפילה אישית.
- **שדות:** `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood`.
- **קטגוריות אפשריות:** praise, petition, confession, thanksgiving, reflection.
- **קשרים:** `book` ו־`chapter` מקשרים לרשומת `Reading`.
- **הרשאות:** owner/admin/user/authenticated.

### `Reading`

- **מטרה:** רשומת התקדמות בקריאת פרק.
- **שדות:** `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses`.
- **קשרים:** `plan_day` → `ReadingPlan.day`.
- **הרשאות:** owner/admin/user/authenticated.

### `ReadingActivity`

- **מטרה:** אירוע פעילות קורא המופיע ב־Dashboard.
- **שדות:** `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse`.
- **ערכי `activity_type`:** chapter visit, highlight, bookmark, note, prayer opened, devotional access.
- **הרשאות:** owner/admin/user/authenticated.

### `StudyAnnotation`

- **מטרה:** highlight או underline על טקסט לימודי.
- **שדות מרכזיים:** `owner_email`, `book_number`, `book`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset`.
- **מקטעי `section`:** intro, outline, prayer, verse.
- **מקטעי `kind`:** highlight, underline.
- **קשרים:** `book_number` → ספר; `block_id` מזהה קטע תוכן יציב.
- **הרשאות:** owner/admin/user/authenticated.

### `StudyMark`

- **מטרה:** סימון או הערה ברמת פסוק.
- **שדות:** `owner_email`, `mark_type`, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text`.
- **ערכי `mark_type`:** highlight, bookmark, note.
- **הרשאות:** owner/admin/user/authenticated.

### `Revelation`

- **מטרה:** פרסום חזויה אישית או תגובה על פרסום.
- **שדות:** `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id`.
- **קשר עצמי:** `parent_id` מפנה ל־`Revelation.id`.
- **הבחנה:** רשומה ברמה העליונה היא פרסום; רשומה עם `parent_id` היא תגובה.
- **הרשאות:** קריאה ציבורית; כתיבת authenticated/admin.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 טעינת האפליקציה

1. `Layout` נטען ויוצר את `AuthProvider`.
2. `AuthProvider` קורא ל־`fse2.auth.me()` כדי לקבוע אם המשתמש מחובר.
3. `ThemeProvider` נטען בתוך `AuthProvider`; אם המשתמש מחובר הוא מנסה לטעון `SiteSettings`.
4. `PlayerProvider` יוצר element אודיו גלובלי.
5. `PwaHead` מוסיף meta tags ורושם את `/sw.js`.
6. `AppHeader`, תוכן הניתוב, `AppFooter` ו־`GlobalPlayer` מוצגים.
7. רכיבי הדף טוענים נתונים דרך TanStack Query.

## 6.2 קריאת פרק

1. הקורא נכנס ל־`/BibleReader`.
2. `BookGrid` מציג מיד את 66 הספרים מ־`bibleBooks.js`.
3. בחירת ספר מנווטת ל־`/Chapter?book=<number>&chapter=1`.
4. `Chapter` מפרש את פרמטרי ה־URL ומגדיר את הגרסה, השפה והפסוק הנבחר.
5. `fetchChapter` טוען את הפרק מהמקור הפעיל.
6. אם המקור החיצוני אינו זמין, מתבצע fallback מ־IndexedDB.
7. הפסוקים מוצגים; בגרסת KJV+ מופיעים קודי Strong’s.
8. הקורא יכול לבחור פסוק ולפתוח את `VerseActionBar`.
9. הקורא יכול לפתוח את משאבי המחקר מה־Sidebar.
10. משאבי המחקר יכולים לפתוח פסוקים ב־`VersePopup` בלי לעזוב את הדף.

## 6.3 הדגשה או קו תחתון בטקסט לימודי

1. הקורא בוחר טקסט בתוך `AnnotatedText`.
2. הרכיב מחשב את ה־offset היחסיים של הבחירה.
3. מוצגת סרגל כלים עם צבעי highlight ואפשרות underline.
4. `onAnnotate` מקבל annotation המכיל:
   - ספר ו־מספר ספר.
   - סוג מקטע.
   - מזהה בלוק.
   - סוג סימון.
   - צבע.
   - start/end offsets.
5. `saveAnnotation` שומר את הסימון:
   - בשרת עבור קורא מחובר.
   - ב־IndexedDB גם עבור אורח או כשאין חיבור.
6. בעת טעינה, `mergeAnnotations` מחבר בין המקור המקומי לשרתי לפי `annotationKey`.
7. `buildSegments` מפצל את הטקסט לקטעים לפי כל נקודות הגבול ומציג סימון מתאים.

## 6.4 הדגשה, bookmark או note ברמת פסוק

1. הקורא בוחר פסוק.
2. הוא בוחר Highlight, Bookmark או Note מ־`VerseActionBar`.
3. הפעולה יוצרת רשומת `StudyMark` עם:
   - `owner_email`.
   - `mark_type`.
   - מיקום הפסוק.
   - צבע או טקסט הערה.
4. רשומת `ReadingActivity` נוצרת כדי לעדכן את ה־Dashboard.
5. רשומות מסומנות מוצגות ב־`BibleNotes`.
6. מחיקת סימון מסירה את הרשומה מהשרת.

## 6.5 סיום קריאת פרק

1. הקורא מסיים פרק או בוחר לסמן אותו כהושלם.
2. `recordReading` יוצר או מעדכן רשומת `Reading`.
3. נשמרים:
   - הספר והפרק.
   - גרסת התנ"ך.
   - תאריך הקריאה.
   - סטטוס.
   - reflection ו־prayer point.
   - פסוקים מודגשים.
4. אם הפרק תואם למסלול הקריאה, `findPlanDay` מזהה את יום התוכנית.
5. סטטוס completed מסמן את היום כהושלם.
6. `Plan` ו־`Dashboard` מחושבים מחדש מהנתונים.

## 6.6 התקדמות מניעה

1. הקורא פותח מניעה.
2. הוא בוחר `Mark complete`.
3. נוצרת רשומת `DevotionalProgress` עם `owner_email` ו־`devotional_code`.
4. מצב מקומי נשמר גם ב־localStorage כדי להציג מידית שינוי.
5. בכניסה מחדש, המצב המקומי ממוזג עם רשומות השרת.

## 6.7 שמירת תפילה

1. הקורא לוחץ Bookmark בתפילה.
2. נוצרת רשומת `PrayerSaved` עם:
   - `owner_email`.
   - `prayer_title`.
3. ה־query של התפילות השמורות מתעדכן.
4. לחיצה חוזרת מוצאת את הרשומה הקיימת ומוחקת אותה.

## 6.8 יצירת יומן

1. הקורא נכנס ל־`/Journal` או ל־`/Journal?new=1`.
2. הוא בוחר קטגוריה ומזין תוכן.
3. `JournalForm` מאמת שיש לפחות כותרת או גוף.
4. נוצרת רשומת `JournalEntry`.
5. בעריכה, `initial` מעדכן את הטופס.
6. במחיקה, מוצג אישור והרשומה נמחקת.
7. אם היומן כולל ספר ופרק, ניתן לעבור ישירות לפרק.

## 6.9 פרסום חזויה ותגובה

1. קורא מחובר ממלא את `RevelationForm`.
2. נוצרת רשומת `Revelation` ללא `parent_id`.
3. הפיד מתעדכן דרך invalidation של query ה־revelations.
4. לייק מעדכן את `likes`.
5. לחיצה על התגובות פותחת `CommentThread`.
6. תגובה נוצרת כ־`Revelation` נוספת עם `parent_id` של הפרסום.
7. רשומות seed ממוזגות עם הנתונים החיים, תוך מניעת כפילויות לפי כותרת.

## 6.10 קבוצת דיבור

1. הקורא בוחר קבוצה.
2. המצב `joined` נשמר מקומית.
3. הודעות הקבוצה נטענות דרך `fetchPublicCollection`.
4. הקורא מחובר כותב הודעה.
5. נוצרת רשומת `DiscussionThread` עם `group_name`, `owner_email`, `author_name`, `title` ו־`body`.

## 6.11 שאלה ב־Q&A

1. הקורא בוחר קטגוריה ומזין שאלה.
2. נשלחת בקשה דרך `submitQuestion`.
3. השרת יוצר `QAEntry` עם `author_email` ו־`status` התחלתי.
4. ה־query מתרענן והשאלה מופיעה ברשימה.
5. Admin יכול להוסיף `answer`, `answered_by` ולעדכן את הסטטוס.

## 6.12 פנייה בדף Contact

1. הקורא מזין שם, דוא״ל, נושא והודעה.
2. הדפדפן מאמת שדות בסיסיים.
3. נוצרת `ContactMessage` עם `is_read=false`.
4. Admin רואה את הפנייה, יכול לסמן אותה כנקראה ולכתוב תשובה.

## 6.13 הנגן הגלובלי

1. הקורא מפעיל סדרה או פרק מתוך `VerseSongs`.
2. `PlayerProvider` מקבל queue ו־index.
3. נוצר או משמש את element האודיו היחיד של האפליקציה.
4. הנגן ממשיך לפעול בעת מעבר בין דפים.
5. `GlobalPlayer` מציג:
   - כותרת וסדרה.
   - זמן ומיקום.
   - play/pause.
   - skip ו־seek.
   - volume ומהירות.
   - shuffle ו־repeat.
6. בסיום טרק:
   - `repeat=one` משחק אותו שוב.
   - `repeat=all` עובר לטרק הבא.
   - ללא repeat עובר לטרק הבא או עוצר.

## 6.14 הורדת תוכן לא מקוון

1. הקורא נכנס ל־`/Offline`.
2. הוא בוחר אילו קטגוריות להוריד.
3. עבור תנ"ך ניתן לבחור ספרים וגרסת תריבציה.
4. `fetchChapter` מוריד ומנקה את הפרק.
5. הפרקים והפסוקים נשמרים ב־IndexedDB.
6. המסך מציג כמות פריטים לכל store.
7. ניתן לבקש מחיקת כל הנתונים.
8. `BibleReader` מחשב ספר “זמין לא מקוון” רק כאשר כל הפרקים הדרושים נמצאים מקומית.

## 6.15 התקנת PWA

1. הדפדפן מפעיל `beforeinstallprompt`.
2. האירוע נשמר ב־`InstallPrompt`.
3. המשתמש לוחץ התקנה.
4. `deferred.prompt()` מציג את חלון ההתקנה של הדפדפן.
5. לאחר `appinstalled`, המסך מציג מצב מותקן.
6. ב־iOS מוצגות הוראות ידניות כאשר אין prompt מובנה.

## 6.16 ניהול תוכן

1. המנהל נכנס דרך `/Admin`.
2. `adminAuth` מאמת את הסיסמה ומנפיק token חתום.
3. ה־token נשמר ב־localStorage.
4. `AdminDashboard` בודק את תקינות ה־session בטעינה.
5. כל פעולת CRUD נשלחת דרך `callAdmin`.
6. `adminContent` מאמת את ה־token ומריץ פעולה רק על ישויות מורשות.
7. פעולות נרשמות ב־`ActivityLog`.
8. שינוי `SiteSettings` מתעדכן ב־`ThemeContext` לאחר רענון.

---

# 7. הערות טכניות לפיתוח

## 7.1 ספריות וכלי עזר

| תחום | כלי |
|---|---|
| UI | React, React Router |
| נתוני שרת ו־cache | TanStack Query |
| Icons | `lucide-react` |
| תאריכים | `date-fns` |
| Backend/Auth/Entities/Functions | FSe2 |
| עיצוב | קובץ `lib/brandCss.js` ו־Tailwind utility subset |
| מקור נתונים | IndexedDB, localStorage, Service Worker |
| שיתוף | Clipboard API ו־Web Share API |

גרסאות חבילות מדויקות לא ניתנו לזהות מהמקור שסופק.

## 7.2 דפוסים חוזרים

### Query keys

מפתחות Query כוללים לכלול את כל הקלטים שמשנים את התוצאה:

- סוג אוסף.
- סוג תוכן.
- מזהה משתמש או דוא״ל.
- ספר, פרק או גרסת תנ"ך.

דוגמה נכונה להתנהגות: שאילתת marks צריכה לכלול את הדוא״ל, ואילו שאילתת public insights יכולה להשתמש במפתח משותף.

### Merge של live ו־seed

מספר דפים משלבים נתונים חיים עם `seedContent`:

1. אם אין רשומות חיות  -  מוצג ה־seed במלואו.
2. אם יש רשומות חיות  -  הן מוצגות תחילה.
3. רשומות seed מתווספות רק אם אין רשומה חיה בעלת אותה כותרת.

יתרון: המסך לעולם אינו ריק. חסרון: התנהגות לא עקבית בין סביבות, וכפילויות לפי כותרת עלולות להתרחש.

### עדכון cache לאחר mutation

לאחר יצירה, מחיקה או עדכון יש להפעיל invalidation ממוקד. לדוגמה:

- יצירת חזויה → רשומת `revelations`.
- שמירת תפילה → `prayerSaved`.
- סימון פסוק → `studyMarks`.
- סיום מניעה → `devotionalProgress`.
- עדכון תוכן admin → רשימת האוסף המתאים.

### שמירה מקומית לצד שרת

שני סוגי מידע נשמרים בשתי מערכות:

- **לקורא מחובר:** עותק מקומי מייצב את הממשק, והשרת הוא מקור האמת.
- **לאורח:** ה־localStorage וה־IndexedDB הם המקור היחיד.

## 7.3 מה חשוב לדעת לפני שינוי פיצ’ר

### הוספת שדה ל־Entity

יש לבצע:

1. הוספת השדה ל־JSON.
2. התאמת כל ה־seed records.
3. התאמת טפסי ה־CMS.
4. עדכון מיפוי השדות ב־`AdminDashboard`.
5. עדכון קריאות ו־writes.
6. בדיקת backward compatibility לרשומות ישנות.

### הוספת ישות ציבורית

יש להוסיף:

- קובץ ב־`entities`.
- מיפוי קריאה ב־`lib/contentApi.js`.
- מקרה תאימה ב־`functions/content.js`.
- אם הישות ניתנת לניהול  -  הוספה ל־`MANAGED` ב־`functions/adminContent.js`.
- טופס ב־`AdminDashboard`.
- רשומות seed.
- key חדש ב־React Query.

### הוספת דף

הפרויקט נראה שממפי הדפים נוצרים אוטומטית, אך יש לוודא:

- שהדף מקבל את `currentPageName` דרך `Layout`.
- שהוא מוסיף לניווט הראשי, המשני או ה־footer.
- שהוא מוסיף ל־`public/sw.js` אם הוא חלק מ־app shell.
- שהוא מגיב ל־query parameters.
- שהוא מציג מצב ריק, loading ו־error.

### הוספת מקטע לימודי

`block_id` חייב להיות יציב וייחודי בתוך הספר. אחרת annotations יתערבבו בין מקטעים.

בנוסף, `start_offset` ו־`end_offset` תלויים בטקסט המדויק. אם תוכן המקטע משתנה, קיימים שני פתרונות:

1. לשמור גם fingerprint או hash של הטקסט.
2. לבצע re-anchoring של ההיסט הקיים לפי הטקסט החדש.

### הוספת גרסת תנ"ך

יש לעדכן:

- `lib/versions.js`.
- מקור ההורדה.
- מפתח ה־cache ב־IndexedDB.
- תצוגת Strong’s.
- `BibleReader` ו־`Offline`.
- לוגיקת התקנה והסרה.
- הרשאות CORS וזכויות יוצרים למקור.

### שינוי IndexedDB

יש להגדיל את `DB_VERSION` ולממש migration ב־`onupgradeneeded`. אין לשנות schema בלי migration כדי לא למחוק נתונים של קוראים קיימים.

## 7.4 נושאי אבטחה

### ניהול מנהל

- `adminAuth` משתמש ב־HMAC-SHA-256 לחתימת session.
- סיסמאות מאוחסנות עם salt, אך SHA-256 אינו אלגוריתם עבודה איטי מספיק לסיסמאות.
- מומלץ לעבור ל־PBKDF2, Argon2 או scrypt.
- יש סיסמת ברירת־מכלל כש־`ADMIN_INITIAL_PASSWORD` אינו מוגדר.
- אין להשאיר את ברירת המכלל בייצור.
- ה־admin token נשמר ב־localStorage, ולכן חשוף ל־XSS.
- מומלץ להשתמש ב־HttpOnly cookie או במנגנון session מובנה של הפלטפורמה.
- כדאי להוסיף revocation, נעילת חשבון לאחר מספר ניסיונות ואימות MFA.

### הרשאות ברמת שורה

במספר דפים המשתמש מוצג רשומות ואז מסנן לפי `owner_email` בדפדפן. זה אינו מהווה בידוד נתונים אמיתי:

- אם רשימת ה־entity כוללת רשומות של משתמשים אחרים, הן עדיין נמסרות לדפדפן.
- יש להעביר סינון לשרת או להגביל את רשימת ה־entity לפי owner בשרת.

### סיכון XSS

- `safeText` מונע הצגת אובייקטים כטקסט, אך אינו מנקה HTML.
- React מבצע escaping של טקסט ברוב המקרים, ולכן יש להימנע מ־`dangerouslySetInnerHTML`.
- ניקוי HTML ממקורות חיצוניים מתבצע ב־`functions/bibleChapter.js`, אך אותו עיקרון צריך לחול גם על תוכן CMS.

## 7.5 נושאי אמינות ונתונים

### מגבלות רשימה

מספר קריאות משתמשות במגבלות קבועות כגון 200, 300 או 400 רשומות. אין pagination ברמת API:

- אם האתר יגדל מעבר למגבלה, תוכן ישן לא יוצג.
- ה־ActivityFeed מבקש 60 רשומות ואז מסנן לפי בעלות; פעילות ישנה יכולה להיעלם אם המשתמש פעיל מאוד.

### fallback עלול להסתיר תקלה

אם השרת מחזיר שגיאה אך ה־UI מציג seed content, המשתמש עלול לחשוב שהתוכן עדכני. מומלץ:

- להציג התראה קלה כשמוצג fallback.
- לשמור timestamp של העדכון האחרון.
- לא להחליף seed בתוכן ישן ללא אינדיקציה.

### שינוי בעלות לפי שם

`PrayerSaved`, `DiscussionThread`, `VerseSongEpisode` ו־`DevotionalProgress` משתמשים בשמות כמפתחות לוגיים. שינוי שם של תפילה, קבוצה או סדרה עלול:

- לנתק קשרים.
- ליצור כפילויות.
- לגרום ל־delete של רשומה לא למצוא את היעד הנכון.

## 7.6 נושאי נגישות

המערכת כוללת כמה עבודות טובות:

- `aria-label` על כפתורי עצמים.
- `aria-current` בעמוד נוכחי.
- `aria-live` על מחוון טעינה.
- `role="dialog"` ו־`aria-modal`.
- מצבי disabled ו־focus גלויים.

מומלצות להשלמה:

- להוסיף focus trap ושחזור focus ב־`Modal`.
- להוסיף `aria-labelledby` במקום להסתפק ב־`aria-label`.
- להחליף רכיבי `span role="button"` ב־`BookOutline` באלמנטי `button`.
- לוודא שכל אייקון דקורטיבי מקבל `aria-hidden`.
- להוסיף תיאור ל־`aria-current` ולמצבי pagination.
- לוודא ש־focus עובר לטאב הפעיל בעת החלפת הערכים.

## 7.7 נושאי ביצועים

- `useMemo` ו־`useCallback` משמשים לעלות יקרות מאוד.
- `ActivityFeed` מבצע refresh כל 30 שניות גם כשהלקוח אינו צופה במסך.
- `buildSegments` עובר על כל annotations עבור כל קטע טקסט; עם מאות סימונים כדאי לבצע indexing לפי block.
- `BookGrid` מחשב סינון על כל הספרים בכל הקלדה; בהיקף 66 ספרים זו אינה בעיית ביצועים משמעותית.
- `GlobalPlayer` יוצר `Audio` פעם אחת ברמת ה־Provider, ולכן הוא יעיל יותר מיצירת נגן בכל דף.
- כדאי להוסיף virtualization לרשימות ארוכות של פסוקים, הערות או היסטוריית activity.

## 7.8 בעיות או נקודות שיש לבדוק

| נקודה | השפעה אפשרית | כיוון תיקון |
|---|---|---|
| `lib/app-params.js` גורם ל־`localStorage` ו־`window` בזמן import | כשל ב־SSR או ב־unit tests | לבצע גישה ל־window רק בפונקציה או לאחר mount |
| `AuthContext` מסמן `isAuthenticated=true` לאחר `me()` גם אם התוצאה ריקה | מצב UI שגוי | להשתמש ב־`Boolean(currentUser)` |
| מסנני ownership רבים רצים בדפדפן | חשיפת רשומות של משתמשים אחרים | סינון בשרת |
| כמה query keys אינם כוללים מזהה משתמש | שיתוף cache בין sessions | להוסיף מזהה משתמש לכל מקור נתונים פרטי |
| ב־`Offline` מופיעה קטגוריית `prayers`, אך היא אינה ברשימת `STORES` | הורדה או מחיקה של תפילות עלולה להיות שבורה | להוסיף store ו־migration, או להסיר את הקטגוריה |
| כמה קבצים משתמשים ישירות ב־`window` בזמן render | כשל ב־SSR | להעביר ל־useEffect או ל־helper guarded |
| `Modal` אינו מנעל focus | ניווט מקלדת עלול לצאת מהמודאל | להוסיף focus trap ו־restore |
| טיימרים של `ShareRow` ו־`VerseActionBar` אינם מנוקים | עדכון state לאחר unmount | לשמור את ה־timeout ולנקותו ב־effect |
| `VersionPicker` מחפש תפריט גלובלי ב־`document` | התנהגות לא צפויה אם יוצגו כמה pickers | להשתמש ב־ref מקומי |
| merge של live ו־seed לפי כותרת | דילוג על תוכן חשוב בעל כותרת זהה | להשתמש במזהה קבוע או במפתח ייחודי |
| כתובת asset היא `/api/appfiles/...` ולא `/assets/...` | תמונות שבורות אם mapping ה־appfiles אינו זמין | לוודא deployment mapping או להשתמש בנתיבים מקומיים |
| Service Worker עלול להחזיק HTML ישן | תצוגה לא עדכנית לאחר deploy | להגדיל cache version ולנקות caches ישנים |
| `public/sw.js` עלול לצרך נתוני משתמש אם כללי ה־fetch לא מבדילים בין public ל־private | סיכון cache לא צפוי | לא לשמור API מאומת או להציג לפי cache לפי משתמש |
| ה־offsets של annotations תלויים בטקסט מדויק | סימונים עלולים להזז או להיחשל | להוסיף text fingerprint ו־re-anchoring |

## 7.9 מפת Debug מהירה

### כאשר נתונים אינם מוצגים

1. בדוק אם ה־query key תקין.
2. בדוק אם `enabled` מעוכב עקב חוסר email או משתמש.
3. בדוק אם ה־endpoint מחזיר את ה־collection הנכון.
4. בדוק אם ה־seed fallback הופעל בטעות.
5. בדוק אם הנתונים נסוננים מחוץ ל־`kind`.
6. בדוק אם ה־merge לפי כותרת מסיר רשומה אמיתית.

### כאשר פעולת משתמש אינה נשמרת

1. בדוק אם יש משתמש מחובר ו־`owner_email`.
2. בדוק אם ה־entity נכלל ברשימת ההרשאות.
3. בדוק אם ה־payload כולל את כל שדות ה־required.
4. בדוק אם ה־mutation מחזירה שגיאה שאינה מוצגת.
5. בדוק אם query invalidation מתבצע לאחר הכתיבה.
6. בדוק אם ה־local copy וה־server copy ממוזגים לפי מפתח זהה.

### כאשר התוכן הלא מקוון אינו זמין

1. בדוק אם IndexedDB נפתח בגרסת ה־schema הנכונה.
2. בדוק אם לכל ספר נשמרו כל הפרקים בשפה הנבחרת.
3. בדוק אם cache key כולל version, language, book ו־chapter.
4. בדוק אם `fetchChapter` מחזיר מבנה תוצאה אחיד גם מהשרת וגם מהמקור החיצוני.
5. בדוק אם Service Worker מחזיר תשובת HTML במקום JSON.

### כאשר הנגן משחק באופן לא צפוי

1. בדוק את סדר ה־queue ואת ה־index.
2. בדוק אם `audio.src` התעדכן לפני `play()`.
3. בדוק הרשאות autoplay.
4. בדוק CORS ואת סוג הקובץ.
5. בדוק אם `repeat` או `shuffle` משנים את ה־index.
6. בדוק אם ה־error listener מנקה את המצב.

## 7.10 רשימת בדיקה מומלצת לפני release

- אורח מבקר בכל המסלולים.
- קורא מחובר בכל המסלולים.
- מנהל תוכן.
- אנגלית, לוגנדה ומצב דו־לשוני.
- רספונסיבי במובייל ובשולחן עבודה.
- מצב ללא חיבור.
- התקנת PWA.
- refresh באמצע פעולת תוכן.
- מספר סימונים באותו טקסט.
- יצירה ומחיקה של יומן והערות.
- כניסה לאחר logout.
- פעולות חוזרות מאות פעמים לאחר התקנת גרסה.
- הרשאות entity ו־owner.
- נגישות מקלדת וקורא מסך.
- אימות מקורות המקרא ותנאי השימוש.

---

## סיכום

Pray-Read Bible היא SPA דו־לשונית עם שלושה שכבות עיקריות:

1. **שכבת תוכן וקריאה**  -  מקרא, מניעות, תפילות, תובנות, Q&A ושירים.
2. **שכבת אישית**  -  התקדמות, סימונים, הערות, יומן, שמירות ו־offline.
3. **שכבת ניהול**  -  CMS, הגדרות מותג, פניות ופעילות.

הנקודה החזקה ביותר של המערכת היא השילוב בין תוכן ציבורי עם fallback מקומי לבין כלי אישי המחוברים לחשבון. הנקודות הרגישות ביותר לתחזוקה הן מדיניות ההרשאות, החיבור בין נתוני שרת לנתוני מכשיר, schema של IndexedDB, cache של React Query וניהול מפתחות התנ"ך.
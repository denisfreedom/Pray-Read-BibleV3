# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

> **הערת מתודולוגיה:** חלק מהקבצים שסופקו מופיעים עם סימון `[נחתך]`. התיעוד מבוסס על ההתנהגות הנראית בקוד, על שמות הישויות, על הנתיבים המוזכרים ב־`manifest.json` וב־`sw.js`, ועל דפוסי הניווט המשותפים. פרטים שלא ניתן לאשר מהקטעים החתוכים מסומנים במפורש.
>
> לפי `createPageUrl`, קובץ ה־PWA וה־service worker, כתובת הבסיס של כל עמוד היא `/<PageName>`. הנתיב `/` מייצג את דף הבית.

---

## 1. מהות המערכת

### 1.1 תיאור כללי

Pray-Read Bible היא אפליקציית React בת אחד המיועדת לקריאה דיגיטלית במקרא, מדיטציה, התפילה ושיתוף. המערכת מחברת בין ארבעה מקורות מרכזיים:

1. **תוכן מנוהל במסד נתונים**  -  מטיפות, תפילות, שירי פסוקים, תובנות, Q&A, תוכניות קריאה, הודעות קהילה ועוד.
2. **נתוני משתמש מסונכרנים**  -  קריאה שהושלמה, הערות, סימונים, ספרי תפילה, יומן והתקדמות דיבוטרים.
3. **מקורות מקומיים**  -  `localStorage` ו־IndexedDB, המשמשים להעדפות, הצטרפות לקבוצות, סימונים והורדות לשימוש לא מקוון.
4. **תוכן חיצוני**  -  מקרא מ־Bible API באנגלית ומקרא לוגאנדה מ־WordPlanet.

המערכת נועדה להיות שימושית גם כאשר אין חיבור לרשת: כל המקורות הציבוריים מגיעים עם תוכן מובנה בקוד, והמערכת משתמשת במטמון מקומי להמשך קריאה לא מקוונית.

### 1.2 קהל היעד

- קוראים נוצרים המבקשים לקרוא פסוק או פרק במקום להסתפק באפליקציית “פסוק היום”.
- משתמשים דוברי אנגלית ולוגאנדה המעוניינים ללמוד את המקרא בשפתם.
- כנסיים, קבוצות קטנות ומנחי תפילה המחפשים חומר להגנה, לימוד ולהתפילה.
- משתמשים המבקשים לשמור הערות, סימונים, יומן והתקדמות קריאה בין מכשירים.
- מנהלי תוכן שמעדכנים את הספרייה, הערות המקרא, השירים, התוכניות והגדרות האתר.

### 1.3 הערך שהמערכת מספקת

- **קריאה ממוקדת:** מעבר ישיר מרשימת 66 ספרים לפרק מלא, עם היסטוריית פרקים קודמים והבאים.
- **לימוד אישי:** סימון פסוקים, סימני ספר, הערות, רפלקציה ונקודת תפילה.
- **קצב קריאה:** תוכנית בת 30 יום הכוללת את אברהם ואת מזמורי תהלים, עם מעקב התקדמות.
- **מעבר מקריאה לתפילה:** דיבוטרים, ספרי תפילה, תובנות תיאולוגיות והיסטוריות, Q&A ופסוק היום.
- **קהילה:** פרסום חשיפות אישיות, תגובות, סימוני “לייק”, הוראות חיות וקבוצות דיון.
- **שימוש רציף:** נגן אודיו גלובלי שממשיך לפעול בעת ניווט בין עמודים.
- **עבודה לא מקוונית:** הורדת פרקים ותוכן ל־IndexedDB ושימוש ב־service worker.
- **ניהול תוכן:** ממשק CMS לעדכון הספרייה, התוכניות, השירים, התובנות, ההודעות, העדפות הצבע ויומן פעילות.
- **שיתוף:** Facebook, WhatsApp, Telegram, Instagram, LinkedIn והעתקת קישור.

### 1.4 ארכיטקטורה כוללת

```text
React Router
  └── Layout
      ├── AuthProvider
      │   └── ThemeProvider
      │       └── PlayerProvider
      │           ├── AppHeader
      │           ├── Page
      │           ├── AppFooter
      │           └── GlobalPlayer
      └── PwaHead
```

### שכבות הנתונים

| שכבה | תפקיד | מקור מקור אמת |
|---|---|---|
| רכיבי ממשק | כרטיסים, טפסים, מודאלים, נגן, כרטיסי ספרים | React state ו־props |
| שכבת דפים | תיאום טעינה, סינון, מצבי שגיאה ופעולות משתמש | React Query ו־hooks מכנים |
| שכבת API | קריאה וכתיבה ל־FSe2 ולפונקציות השרת | `fse2`, `contentApi`, `adminSession` |
| שכבת נתונים | ישויות ורשומות משתמש | מסד הנתונים |
| מטמון מקומי | הורדות, העדפות, התקדמות מקומית | IndexedDB ו־`localStorage` |
| PWA | התקנה, מעטפת אפליקציה ועבודה חלקית ללא רשת | `manifest.json`, `sw.js` |

### 1.5 מקור אמת והתנהגות גיבוי

ברוב הדפים קיימת שכבת fallback:

1. מנסים לקרוא רשומות עדכניות מהשרת.
2. אם אין רשומות, משתמשים בתוכן seed המובנה.
3. עבור קריאת מקרא, משתמשים גם ב־IndexedDB כמקור גיבוי.
4. נתוני משתמש מסונכרנים מגיעים מהישויות; חלקם מסוננים בנוסף בצד הלקוח לפי `owner_email`.

המערכת אינה מבטיחה רשימה מלאה: חלק הקריאות מוגבלות ל־200 - 400 רשומות, ולכן רשומות ישנות עלולות להיעלם מהתצוגה.

---

## 2. עמודים ותפקידיהם

### 2.1 דפי גלם ותוכן ציבורי

### Home  -  `/` או `/Home`

- **תפקיד:** דף הבית ומרכז הגילוי של המערכת.
- **למה הוא קיים:** הוא צריך להסביר במהירות מה ניתן לקרוא, להתפלל, לשמוע ולשתף, ולהוביל לכל תחומי המוצר.
- **פעולות מרכזיות:**
  - כניסה לקורא המקרא, הדיבוטרים, ספר התפילה, Verse-Songs, Q&A והקהילה דרך שש כרטיסי תכנית.
  - הצגת פסוק היום, דיבוטר מומלץ ותכנים מהקהילה.
  - הצגת הצעת להתקנת האפליקציה כ־PWA.
  - קישורים לתוכנית קריאה, מרכז לא מקווני, מערכת יומן ועמודי מידע.
  - קישור לתרומה.
- **מקור נתונים:** `fetchPublicCollection`, תוכן seed ו־`localStorage` למצב ההתקנה.

### About  -  `/About`

- **תפקיד:** מסמך מסגורת המותג והשימוש באפליקציה.
- **למה הוא קיים:** כדי להסביר למשתמש חדש את הערך של קריאה אישית ומדודת, במקום רק להציג רשימת תכנים.
- **פעולות מרכזיות:**
  - חזרה לדף הבית.
  - הצגת “למה בנינו את זה”, עקרונות השימוש, התמיכה בשפות והפנייה לקהילה.
  - קישורים לקריאה, תפילה והצטרפות לקהילה.

### BibleReader  -  `/BibleReader`

- **תפקיד:** אינדקס ספרי המקרא ונקודת הכניסה לקריאת פרק.
- **למה הוא קיים:** הקורא צריך לבחור ספר במהירות, גם בלי חיבור, לפי שם אנגלי, לוגאנדי או קיצור.
- **פעולות מרכזיות:**
  - חיפוש ספרים לפי שם, שם לוגאנדי או קיצור.
  - מעבר בין ברית קדמה וברית חדשה.
  - גלילה אוטומטית למקום המקטע הנבחר.
  - הצגת סטטוס הורדה של פרקים.
  - מעבר לתוכנית הקריאה ולמסכי הורדה.
  - לחיצה על ספר מובילה ל־`/Chapter` עם מספר ספר ופרק.

### Chapter  -  `/Chapter?book=<number>&chapter=<number>&verse=<number>&lang=<en|lu>`

- **תפקיד:** מסך קריאת פרק מלא ומרכז הפעילות האישיות במקרא.
- **למה הוא קיים:** זהו המקום שבו הקריאה הופכת לפעילות: סימון, הערה, תפילה, ניווט ושמירת התקדמות.
- **פעולות מרכזיות:**
  - טעינת פרק באנגלית או לוגאנדה.
  - מעבר בין פרקים קודמים ובאים.
  - בחירת פסוק ופתיחת סרגל פעולות.
  - הדגמת פסוקים בארבע צבעים.
  - סימון, הוספת סימן ספר, כתיבת הערה, העתקה, שיתוף, קישור ישיר והפניה למקראות קשורים.
  - הגדלת/הקטנת גופן הפסוקים.
  - הצגת כרטיס פסוק צף וקישור אליו מתוך המקראות הקשורים.
  - מעבר ללשוניות Commentaries, Insights ו־Q&A עבור הפרק.
  - שמירת קריאה, רפלקציה, נקודת תפילה ופסוקים מסומנים.
  - מצב מקומי או שגיאת רשת עם אפשרות לעבור לגרסה מקומית.

### Devotionals  -  `/Devotionals`

- **תפקיד:** ספריית דיבוטרים יומיים ותצוגת קריאה מלאה.
- **למה הוא קיים:** הוא ממשק תפילת יומי שמחבר בין מקרא, מחשבה ותפילה.
- **פעולות מרכזיות:**
  - חיפוש וסינון דיבוטרים.
  - פתיחת דיבוטר במודאל דרך `?devotional=<code>`.
  - הצגת גרסה אנגלית או לוגאנדה.
  - סימון “הושלם”, הצגת מצב התקדמות ושיתוף הדיבוטר.
  - מעבר בין רשימה לתצוגה מפורטת.

### PrayerLibrary  -  `/PrayerLibrary`

- **תפקיד:** ספריית תפילות לפי קטגוריה, שפה ושימוש.
- **למה הוא קיים:** המשתמש צריך למצוא תפילה מוכנה במהירות ולשמור אותה לשימוש אישי.
- **פעולות מרכזיות:**
  - חיפוש לפי כותרת ותוכן.
  - סינון לפי קטגוריה ולפי שפה.
  - הוספה או הסרה מהמועדפים דרך `PrayerSaved`.
  - שיתוף התפילה בכל ערוצי השיתוף.
  - הצגת מצב שמור והודעת שמירה.

### VerseSongs  -  `/VerseSongs`

- **תפקיד:** אינדקס סדרות Verse-Songs והאודיו הנגנים.
- **למה הוא קיים:** רוצים לשמוע את המקרא כשיר, עם תור של פרקים ברצף.
- **פעולות מרכזיות:**
  - הצגת סדרות מהמסד ומהתוכן המובנה.
  - הצגת אומנים, עטיפות, תיאורים ורשימת פרקים.
  - השמעת סדרה שלמה או פרק נבחר.
  - המשך/עצירה דרך הנגן הגלובלי.
  - מעבר לעמוד הסדרה המפורט.

### VerseSongSeries  -  `/VerseSongSeries?series=<name>`

- **תפקיד:** פרטי סדרת Verse-Song ורשימת הפרקים שלה.
- **למה הוא קיים:** הוא מאפשר להשמיע סדרה שלמה או לבחור פרק מתוך סדרה מוגדרת.
- **פעולות מרכזיות:**
  - טעינת הסדרה לפי שם מפרמטר ה־URL.
  - מיון הפרקים לפי `episode_order`.
  - השמעת פרק בודד או כל הסדרה.
  - חזרה לרשימת כל הסדרות.

### QA  -  `/QA`

- **תפקיד:** ארכיון שאלות קהילה ותשובות עבורן.
- **למה הוא קיים:** הוא מפחית את הפער בין שאלה אישית לתשובה מבוססת מקרא.
- **פעולות מרכזיות:**
  - חיפוש וסינון לפי קטגוריה.
  - הצגת שאלה, תשובה, מקרא ומצב תשובה.
  - שליחת שאלה חדשה על ידי משתמש מחובר.
  - הצגת מצב שליחה, שגיאה ואישור.
  - ניקוי הטופס לאחר הצלחה.

### VerseOfDay  -  `/VerseOfDay`

- **תפקיד:** הצגת פסוק יומי ושיתופו.
- **למה הוא קיים:** הוא מהווה נקודת כניסה קצרה למסר יומי, במיוחד עבור משתמשים שלא רוצים להיכנס למסך ארוך.
- **פעולות מרכזיות:**
  - בחירת הרשומה שתואמת לתאריך הנוכחי.
  - גיבוי בתוכן seed.
  - הצגת הפסוק, ההפניה והערת המחשבה.
  - שיתוף הפסוק וקישור לפרק המקרא.

### TheologicalInsights  -  `/TheologicalInsights`

- **תפקיד:** לוח תובנות תיאולוגיות.
- **למה הוא קיים:** הוא מארגן תובנות לפי סוג, עובר מקרא ונושא.
- **פעולות מרכזיות:**
  - חיפוש לפי כותרת, תקציר או מקרא.
  - פתיחת תובנה מלאה.
  - שמירה מקומית למועדפים.
  - שיתוף התובנה.

### HistoricalInsights  -  `/HistoricalInsights`

- **תפקיד:** אותו מנגנון כמו התובנות התיאולוגיות, אך עם `kind="historical"`.
- **למה הוא קיים:** הפרדה בין רקע היסטורי לפירוש תיאולוגי מפחית עומס ומאפשרת ניווט ממוקד.

### 2.2 דפי קהילה

### Community  -  `/Community`

- **תפקיד:** מרכז הניווט לשלושה מרחבי קהילה.
- **למה הוא קיים:** הוא מציג את הקהילה כמערכת משלימה  -  חשיפות, הוראה וקבוצות דיון  -  במקום בתפריט אחד ארוך.
- **פעולות מרכזיות:**
  - מעבר ל־Community Revelations.
  - מעבר ל־Community Live Teaching.
  - מעבר ל־Discussion Groups.
  - הצגת עדכונים אחרונים משלושת המרחבים.
  - קישורים לפרסום חשיפה, הצטרפות להוראה והצטרפות לקבוצה.

### CommunityRevelations  -  `/CommunityRevelations`

- **תפקיד:** פיד חשיפות אישיות על פסוקים, עם תגובות וסימוני “לייק”.
- **למה הוא קיים:** הוא מאפשר לקוראים לשתף תובנה אישית ולעודד זאת, תוך הפרדת חשיפות מתגובות.
- **פעולות מרכזיות:**
  - פרסום חשיפה עם כותרת, מקרא וגוף.
  - הצגת רשימת חשיפות חיות ותוכן seed.
  - סימון “לייק” והצגת מספר סיימים.
  - פתיחת שרשור תגובות.
  - כתיבת תגובה כמשתמש מחובר.
  - הנחיה להתחברות עם פרמטר `next` שמחזיר את המשתמש לעמוד.

### CommunityLiveTeaching  -  `/CommunityLiveTeaching`

- **תפקיד:** לוח אירועים להוראה חיה.
- **למה הוא קיים:** הוא מרכז פגישות, מארחים, תאריכים וקישורי הצטרפות.
- **פעולות מרכזיות:**
  - מיון והצגת מפגשים עתידיים.
  - פתיחת קישור ההצטרפות החיצוני.
  - הצגת תאריך, מארח ותיאור.
  - גיבוי ב־`LIVE_SESSIONS`.

### DiscussionGroups  -  `/DiscussionGroups`

- **תפקיד:** קבוצות לימוד ושיחה סביב פסוקים.
- **למה הוא קיים:** הוא מעודד לימוד משותף ולא רק קריאה בודדת.
- **פעולות מרכזיות:**
  - הצגת קבוצות ופרטיהן.
  - בחירת קבוצה, כולל באמצעות `?group=<name>`.
  - הצטרפות מקומית לקבוצה.
  - צפייה בהודעות הקבוצה.
  - שליחת הודעה כמשתמש מחובר.
  - הצגת מצב עסוק ושגיאת שליחה.

### 2.3 דפי חשבון, יומן והתקדמות

### Dashboard  -  `/Dashboard`

- **תפקיד:** לוח אישי של הקורא.
- **למה הוא קיים:** הוא מרכז את פעילות המשתמש  -  קריאה, סימונים, הערות, תפילות שמורות, דיבוטרים שהושלמו, יומן ונתוני הורדה.
- **פעולות מרכזיות:**
  - הצגת רצף קריאה ומדדים.
  - מעבר לקריאה הבאה, תוכנית, יומן, הערות ותפילות שמורות.
  - הצגת נפח המטמון המקומי.
  - שילוב תוכן כללי של `Home` כחלק מהממשק האישי.

### Plan  -  `/Plan`

- **תפקיד:** תוכנית קריאה בת 30 יום.
- **למה הוא קיים:** הוא הופך קריאה למסלול קבוע במקום לאימות אינטראקטיבי.
- **פעולות מרכזיות:**
  - טעינת התוכנית מהמסד ונפילה ל־`PLAN_DAYS`.
  - קביעת מצב `completed`, `current` או `upcoming`.
  - חישוב אחוז התקדמות.
  - מעבר לפרק המתוכנן.
  - המשך מהיום שאינו הושלם.

### Journal  -  `/Journal`

- **תפקיד:** יומן תפילה אישי.
- **למה הוא קיים:** הוא מאפשר לשמור התנהלויות, בקשות, הודאות, הכנעות והקשר למקרא.
- **פעולות מרכזיות:**
  - יצירת רשומה חדשה.
  - עריכה ומחיקה.
  - סינון לפי קטגוריה: praise, petition, confession, thanksgiving, reflection.
  - קישור רשומה לספר ופרק.
  - פתיחת טופס מוכנה מראש באמצעות `?new=1&book=...&chapter=...`.
  - מיון לפי תאריך והגנה מפני משתמש שאינו מחובר.

### BibleNotes  -  `/BibleNotes`

- **תפקיד:** מרכז כל הסימונים, סימני הספר וההערות של המשתמש.
- **למה הוא קיים:** הוא מאפשר למצוא שוב חומר שנשמר במהלך קריאת המקרא.
- **פעולות מרכזיות:**
  - טעינת `StudyMark` ו־`Reading`.
  - סינון לפי סוג מרק.
  - הצגת מיקום הפסוק והפנייה לפרק המדויק.
  - מצב ריק עם הנחיה להתחברות.
  - עדכון מטמון השאילתות בעת שינוי חשבון.

### Offline  -  `/Offline`

- **תפקיד:** מרכז הורדות וניהול אחסון מקומי.
- **למה הוא קיים:** הוא נותן למשתמש שליטה מפורשת על מה נשמר במכשיר.
- **פעולות מרכזיות:**
  - בחירת פרקי מקרא, פסוקים, דיבוטרים, הערות, תפילות, Q&A ופסוק היום להורדה.
  - הצגת מספר רשומות בכל מאגר.
  - הצגת נפח שימוש ומכסת אחסון.
  - הצגת התקדמות הורדה.
  - מחיקת המטמון המקומי.

### InstallPrompt  -  `/InstallPrompt`

- **תפקיד:** הדרכת התקנת האפליקציה כ־PWA.
- **למה הוא קיים:** התקנה משפרת זמינות, הפעלה ללא חיבור ושימוש מלא מסך.
- **פעולות מרכזיות:**
  - זיהוי iOS, Android, Desktop ומערכות אחרות.
  - זיהוי מצב standalone.
  - שימוש באירוע `beforeinstallprompt`.
  - התקנה בפועל בדפדפנים תומכים.
  - הצגת הוראות ידניות למערכות ללא התקנה ישירה.

### 2.4 דפי אימות ופניות

### Login  -  `/Login`

- **תפקיד:** התחברות לחשבון קורא.
- **למה הוא קיים:** נתוני המשתמש צריכים להיות מסונכרנים בין מכשירים.
- **פעולות מרכזיות:**
  - קליטת אימייל וסיסמה.
  - קריאה ל־`fse2.auth.login`.
  - מעבר ל־Dashboard לאחר הצלחה.
  - הצגת שגיאת אימות ומצב טעינה.
  - קישור להרשמה ולשחזור סיסמה.

### Signup  -  `/Signup`

- **תפקיד:** יצירת חשבון חדש.
- **למה הוא קיים:** הוא מאפשר להתחיל בשמירת נתונים אישיים ובסנכרון.
- **פעולות מרכזיות:**
  - קליטת שם מלא, אימייל, סיסמה ואימות סיסמה.
  - בדיקת אורך סיסמה, התאמה וקבלת תנאי שימוש.
  - הצגת חוזקת סיסמה.
  - טיפול במקרה שבו נדרשת אימות אימייל.
  - מעבר ל־Dashboard לאחר רישום מוצלח.

### ForgotPassword  -  `/ForgotPassword`

- **תפקיד:** בקשת קישור איפוס סיסמה.
- **למה הוא קיים:** הוא מפריד בין כשל בהזנת כתובת לבין כשל אמיתי בשליחת האימייל.
- **פעולות מרכזיות:**
  - אימות פורמט אימייל.
  - קריאה ל־`fse2.auth.forgotPassword`.
  - הצגת הודעה ניטרלית שאינה חושפת אם קיים חשבון.

### ResetPassword  -  `/ResetPassword?token=<token>`

- **תפקיד:** קביעת סיסמה חדשה.
- **למה הוא קיים:** הוא משלים את מחזור שחזור החשבון.
- **פעולות מרכזיות:**
  - קריאת `token` או `access_token` מה־URL.
  - דרישת סיסמה באורך של שמונה תווים לפחות.
  - אימות התאמה בין שתי הסיסמאות.
  - קריאה ל־`fse2.auth.resetPassword`.
  - הצגת מצב הצלחה או שגיאה.

### Logout  -  `/Logout`

- **תפקיד:** סיום התחברות וניקוי מצב המשתמש.
- **למה הוא קיים:** הוא מספק מסך מעבר ברור ונמנע ממצב לא עקבי בזמן יציאת המשתמש.
- **פעולות מרכזיות:**
  - המתנה קצרה לפני הניתוק.
  - קריאה ל־`logout`.
  - חזרה ל־Home עם החלפת היסטוריית הניווט.

### Contact  -  `/Contact`

- **תפקיד:** שליחת פנייה לצוות האתר.
- **למה הוא קיים:** הוא מספק ערוץ תמיכה ושאלות כלליות נפרד מ־Q&A.
- **פעולות מרכזיות:**
  - טופס שם, אימייל, נושא והודעה.
  - אימות שדות חובה ופורמט אימייל.
  - שליחה דרך `submitContactMessage`.
  - הצגת הצלחה, טעינה ושגיאה.

### 2.5 דפי ניהול ומשפטיים

### Admin  -  `/Admin`

- **תפקיד:** כניסת מנהל תוכן.
- **למה הוא קיים:** מערכת הניהול משתמשת בהזדמנות מאבטחה נפרדת מהתחברות הקורא הרגיל.
- **פעולות מרכזיות:**
  - קליטת אימייל וסיסמת מנהל.
  - קריאה ל־`adminAuth` עם action מתאים.
  - שמירת token ב־`localStorage`.
  - בדיקת תוקף session קיים בעת כניסת העמוד.
  - מעבר ל־AdminDashboard.
  - הצגת שגיאת התחברות.

### AdminDashboard  -  `/AdminDashboard`

- **תפקיד:** ממשק ניהול תוכן ומערכת.
- **למה הוא קיים:** הוא מאפשר לנהל את הספרייה וההגדרות מבלי לערוך קוד או לגשת ישירות למסד.
- **מקטעים:**
  - Overview.
  - Books & Chapters.
  - Devotionals.
  - Prayer Library.
  - Verse-Songs.
  - Q&A.
  - Insights.
  - Users.
  - Messages.
  - Text Colours.
  - Activity Log.
  - Settings.
- **פעולות מרכזיות:**
  - הוספה, עריכה ומחיקה של תוכן ניהולי.
  - העלאת תמונות ונכסי תוכן.
  - ניהול סדרות ופרקי Verse-Songs.
  - עריכת צבעי מותג והגדרות אתר.
  - צפייה בהודעות ויומן פעילות.
  - בדיקת session והפניה לכניסת מנהל אם ה־token אינו תקף.

### Privacy  -  `/Privacy`

- **תפקיד:** מסמך פרטיות.
- **למה הוא קיים:** הוא מסביר אילו נתונים נשמרים בחשבון, אילו נתונים נשארים מקומיים ומה נמחק בניקוי המכשיר.

### Terms  -  `/Terms`

- **תפקיד:** תנאי שימוש.
- **למה הוא קיים:** הוא מגדיר זכויות שימוש בתוכן, מגבלות פרסום מחדש, מקורות המקרא ואחריות לפרשנות דוקטרינרית.

---

## 3. מפת ניווט לצורך DEBUG

### 3.1 ניווט גלובלי

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| חזרה לדף הבית | כל עמוד | לוגו Pray-Read | `/` |
| פתיחת אודות | Header ראשי | About | `/About` |
| פתיחת קהילה | Header ראשי | Community | `/Community` |
| פתיחת ספר תפילה | Header ראשי | Prayer Library | `/PrayerLibrary` |
| פתיחת קורא המקרא | Header ראשי | Bible Reader | `/BibleReader` |
| פתיחת Verse-Songs | Header ראשי | Verse-Songs | `/VerseSongs` |
| פתיחת Q&A | Header ראשי | Q&A | `/QA` |
| פתיחת דיבוטרים | Header ראשי | Devotionals | `/Devotionals` |
| פתיחת Dashboard | Header ראשי | Dashboard | `/Dashboard` |
| פתיחת תובנות תיאולוגיות | Header משני | Theological insights | `/TheologicalInsights` |
| פתיחת תובנות היסטוריות | Header משני | Historical insights | `/HistoricalInsights` |
| פתיחת פסוק היום | Header משני | Verse of the day | `/VerseOfDay` |
| פתיחת תוכנית קריאה | Header משני | Reading plan | `/Plan` |
| פתיחת יומן | Header משני | Prayer journal | `/Journal` |
| פתיחת מרכז לא מקווני | Header משני | Offline centre | `/Offline` |
| פתיחת הערות | Header משני | My notes | `/BibleNotes` |
| פתיחת חשיפות | Header משני | Revelations | `/CommunityRevelations` |
| פתיחת הוראה חיה | Header משני | Live teaching | `/CommunityLiveTeaching` |
| כניסת משתמש | Header | Sign in | `/Login` |
| יצירת חשבון | Login/Header | Sign up/Create account | `/Signup` |
| יציאה | Header | Logout | `/Logout` |

### 3.2 קישורי Footer

| נקודת כניסה | לינק | יעד |
|---|---|---|
| Footer | Bible Reader | `/BibleReader` |
| Footer | Daily Devotionals | `/Devotionals` |
| Footer | Prayer Library | `/PrayerLibrary` |
| Footer | Verse-Songs | `/VerseSongs` |
| Footer | Q&A | `/QA` |
| Footer | Theological insights | `/TheologicalInsights` |
| Footer | Historical insights | `/HistoricalInsights` |
| Footer | Community | `/Community` |
| Footer | Revelations | `/CommunityRevelations` |
| Footer | Live teaching | `/CommunityLiveTeaching` |
| Footer | Discussion groups | `/DiscussionGroups` |
| Footer | Reading plan | `/Plan` |
| Footer | Prayer journal | `/Journal` |
| Footer | Dashboard | `/Dashboard` |
| Footer | Offline centre | `/Offline` |

### 3.3 ניווט מהדף הבית ומכרטיסי תוכן

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת קורא המקרא | Home | כרטיס Bible Reader | `/BibleReader` |
| פתיחת דיבוטרים | Home | כרטיס Daily Devotionals | `/Devotionals` |
| פתיחת תפילות | Home | כרטיס Prayer Library | `/PrayerLibrary` |
| פתיחת שירים | Home | כרטיס Verse-Songs | `/VerseSongs` |
| פתיחת Q&A | Home | כרטיס Q&A | `/QA` |
| פתיחת קהילה | Home | כרטיס Community | `/Community` |
| התקנת PWA | Home | כרטיס/באנר התקנה | `/InstallPrompt` |
| מעבר למרכז לא מקווני | Home | כפתור Offline | `/Offline` |
| מעבר לתוכנית | Home/Plan | קריאת יום בתוכנית | `/Chapter?...` |
| בחירת ספר | BibleReader | כרטיס ספר | `/Chapter?book=...` |
| חיפוש ספר | BibleReader | שדה Find a book | סינון מקומי |
| מעבר בין מקטעי המקרא | BibleReader | Old/New Testament | גלילה ל־`section-old`/`section-new` |
| פתיחת פסוק יומי | Home/VerseOfDay | קישור הפניה | `/Chapter?...` |

### 3.4 ניווט בקריאת מקרא

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| בחירת פסוק | Chapter | לחיצה על פסוק | פתיחת `VerseActionBar` |
| סימון בצבע | VerseActionBar | כפתור צבע | שמירת `StudyMark` מסוג highlight |
| סימון ספר | VerseActionBar | Bookmark | שמירת `StudyMark` מסוג bookmark |
| הוספת הערה | VerseActionBar | Notebook | שמירת `StudyMark` מסוג note |
| העתקת פסוק | VerseActionBar | Copy | Clipboard |
| שיתוף פסוק | VerseActionBar | Share | חלונית שיתוף |
| יצירת קישור ישיר | VerseActionBar | Link | עדכון פרמטרי URL |
| פתיחת מקרא קשור | FloatingVerse | Open in Bible Reader | `/Chapter?...` |
| מעבר להערות המקרא | Chapter/Dashboard | My notes/BibleNotes | `/BibleNotes` |
| מעבר ללשונית פירוש | Chapter | Commentary/Theological/Historical/Q&A | `PassageTabs` באותו עמוד |
| מעבר לפרק הבא | Chapter | כפתור הבא | `/Chapter?book=...&chapter=...` |
| מעבר לפרק הקודם | Chapter | כפתור הקודם | `/Chapter?book=...&chapter=...` |
| החלפת שפת המקרא | Chapter | EN/LU | עדכון `lang` |
| שינוי גודל הטקסט | Chapter | בקרת גופן | עדכון מקומי |

### 3.5 קהילה, תפילות, דיבוטרים ותובנות

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת מרחב חשיפות | Community | Revelations | `/CommunityRevelations` |
| פתיחת מרחב הוראה | Community | Live teaching | `/CommunityLiveTeaching` |
| פתיחת מרחב קבוצות | Community | Discussion groups | `/DiscussionGroups` |
| פרסום חשיפה | CommunityRevelations | Send | יצירת `Revelation` |
| כתיבת תגובה | RevelationCard | תגובות | `CommentThread` |
| סימון לייק | RevelationCard | Like | עדכון מספר הסיימים |
| הצטרפות לקבוצה | DiscussionGroups | Join | שמירה מקומית ב־`joinedGroups` |
| פתיחת הודעות | DiscussionGroups | בחירת קבוצה | `ThreadMessages` |
| שליחת הודעה | ThreadMessages | Send | יצירת `DiscussionThread` |
| הצטרפות להוראה חיה | LiveTeaching | Join session | קישור חיצוני |
| פתיחת דיבוטר | Devotionals | כרטיס דיבוטר | Modal באותו עמוד |
| סימון דיבוטר כהושלם | Devotionals | Mark complete | התקדמות מקומית/מסונכרנת |
| שיתוף דיבוטר | Devotionals | Share | `ShareRow` |
| סינון תפילות | PrayerLibrary | חיפוש/קטגוריה/שפה | תצוגה מסוננת |
| שמירת תפילה | PrayerLibrary | Bookmark | יצירת `PrayerSaved` |
| פתיחת תובנה | InsightsBoard | כרטיס תובנה | פריט מורחב באותו עמוד |
| שמירת תובנה | InsightsBoard | Save | `savedInsights` מקומי |
| שיתוף תובנה | InsightsBoard | Share | `ShareRow` |

### 3.6 אימות, יומן וניהול

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| התחברות | Login | Sign in | `/Dashboard` |
| שחזור סיסמה | Login | Forgot password | `/ForgotPassword` |
| איפוס סיסמה | ForgotPassword | Send reset link | `/ResetPassword?token=...` |
| השלמת איפוס | ResetPassword | Reset password | אימות חשבון/הצלחה |
| הרשמה | Signup | Create account | `/Dashboard` או אימות אימייל |
| יצירת יומן | Journal | New entry | טופס בתוך `/Journal` |
| עריכת יומן | JournalCard | Edit | טופס באותו עמוד |
| מחיקת יומן | JournalCard | Delete | מחיקת `JournalEntry` |
| כניסת מנהל | Admin | Sign in | `/AdminDashboard` |
| מעבר לניהול | קישור מנהל | Admin Dashboard | `/AdminDashboard` |
| חזרה מניהול | AdminDashboard | חזרה/יציאה | `/Admin` או `/Home` |
| הורדת תוכן | Offline | Download | IndexedDB |
| ניקוי מטמון | Offline | Clear | מחיקת ה־Offline Centre |

---

## 4. מבנה הקבצים

### 4.1 קבצי שורש

| קובץ | תפקיד | תוצר |
|---|---|---|
| `Layout.jsx` | מעטפת ראשית של כל האפליקציה | מעטפת providers, Header, תוכן הדף, Footer, נגן ו־PWA |
| `__generated/tailwind.css` | פלט Tailwind מקומי של utility classes בלבד | מחלקות עזר כגון flex, grid, spacing ו־icons; אינו מחליף את מערכת `BRAND_CSS` |

### 4.2 קבצי עמודים

כל קובץ ב־`pages/` מייצג מסך עצמאי או wrapper של מסך אחר.

| קובץ | תפקיד |
|---|---|
| `pages/Home.jsx` | דף הבית והניווט המרכזי |
| `pages/About.jsx` | מסמך של המותג והשימוש |
| `pages/BibleReader.jsx` | אינדקס המקרא וההורדות |
| `pages/Chapter.jsx` | קריאת פרק וכל פעילויות המקרא |
| `pages/Devotionals.jsx` | רשימת דיבוטרים, חיפוש, מודאל והתקדמות |
| `pages/PrayerLibrary.jsx` | חיפוש, סינון ושמירת תפילות |
| `pages/VerseSongs.jsx` | אינדקס סדרות האודיו |
| `pages/VerseSongSeries.jsx` | פרטי סדרה והשמעתה |
| `pages/QA.jsx` | ארכיון Q&A ושליחת שאלה |
| `pages/Community.jsx` | מרכז שלושת מרחבי הקהילה |
| `pages/CommunityRevelations.jsx` | פיד חשיפות, לייקים ותגובות |
| `pages/CommunityLiveTeaching.jsx` | רשימת מפגשי הוראה חיה |
| `pages/DiscussionGroups.jsx` | קבוצות דיון והודעותיהן |
| `pages/Plan.jsx` | תוכנית הקריאה ומעקב התקדמות |
| `pages/Journal.jsx` | ניהול יומן התפילה |
| `pages/BibleNotes.jsx` | הצגת סימונים, סימני ספר והערות |
| `pages/Dashboard.jsx` | לוח אישי ונתוני התקדמות |
| `pages/Offline.jsx` | מרכז הורדות וניהול מטמון |
| `pages/VerseOfDay.jsx` | פסוק היום |
| `pages/TheologicalInsights.jsx` | wrapper ל־InsightsBoard עם סוג תיאולוגי |
| `pages/HistoricalInsights.jsx` | wrapper ל־InsightsBoard עם סוג היסטורי |
| `pages/InstallPrompt.jsx` | התקנת PWA לפי פלטפורמה |
| `pages/Contact.jsx` | שליחת פנייה |
| `pages/Login.jsx` | התחברות קורא |
| `pages/Signup.jsx` | הרשמת קורא |
| `pages/ForgotPassword.jsx` | בקשת איפוס סיסמה |
| `pages/ResetPassword.jsx` | קביעת סיסמה חדשה |
| `pages/Logout.jsx` | סיום התחברות |
| `pages/Admin.jsx` | כניסת מנהל תוכן |
| `pages/AdminDashboard.jsx` | ממשק הניהול |
| `pages/Privacy.jsx` | מדיניות פרטיות |
| `pages/Terms.jsx` | תנאי שימוש |

### 4.3 רכיבי ממשק משותפים

| קובץ | Props מרכזיים | מה מרנדר |
|---|---|---|
| `components/common/EmptyState.jsx` | `icon`, `title`, `description`, `action` | מצב ריק עם אייקון, כותרת, הסבר ופעולה אופציונלית |
| `components/common/Modal.jsx` | `open`, `onClose`, `title`, `subtitle`, `children`, `footer`, `width` | מודאל עם סגירה בלחיצת רקע, כפתור X ו־Escape, נעילת גלילת הגוף |
| `components/common/PageHeader.jsx` | `eyebrow`, `title`, `lead`, `actions`, `image`, `overlay`, `children` | ראש עמוד רגיל או Hero עם תמונת רקע ושכבת כהות |
| `components/common/ShareRow.jsx` | `text`, `url`, `label` | שורת כפתורי Facebook, WhatsApp, Telegram, Instagram, LinkedIn ו־Copy |
| `components/common/Spinner.jsx` | `label`, `className` | מחוון טעינה נגיש עם `role="status"` |
| `components/community/CommentThread.jsx` | `comments`, `onSubmit`, `isAuthenticated`, `busy`, `error` | רשימת תגובות וטופס תגובה |
| `components/community/RevelationCard.jsx` | `post`, `onLike`, `commentCount`, `commentsOpen`, `onToggleComments`, `liking` | כרטיס חשיפה עם מטא־דאטה, לייק ותגובות |
| `components/community/RevelationForm.jsx` | `onSubmit`, `isAuthenticated`, `status`, `error` | טופס פרסום חשיפה או מצב התחברות |
| `components/community/ThreadMessages.jsx` | `messages`, `onSubmit`, `isAuthenticated`, `busy`, `error`, `groupName` | הודעות קבוצה וטופס מחשבה |
| `components/home/StatCard.jsx` | `label`, `value`, `hint`, `icon` | כרטיס מדד בדף הבית או Dashboard |
| `components/insight/InsightsBoard.jsx` | `kind` | לוח תובנות, חיפוש, פתיחה, שמירה ושיתוף |
| `components/journal/JournalCard.jsx` | `entry`, `onEdit`, `onDelete` | כרטיס רשומת יומן עם עריכה ומחיקה |
| `components/journal/JournalForm.jsx` | `initial`, `onSave`, `onCancel`, `saving` | טופס יצירה או עריכה של רשומת יומן |
| `components/layout/AppHeader.jsx` | `currentPageName` | Header רספונסיבי עם ניווט, אימות, מצב PWA ותפריט נייד |
| `components/layout/AppFooter.jsx` | אין | Footer עם לוגו, קישורי ניווט, מידע ותרומה |
| `components/layout/GlobalPlayer.jsx` | אין; צורך `usePlayer` | נגן אודיו גלובלי קבוע ורשימת השמעה |
| `components/layout/PwaHead.jsx` | אין | הוספת meta tags, manifest, Apple icon ורישום service worker |
| `components/plan/PlanRow.jsx` | `item`, `status` | כרטיס יום בתוכנית וקישור לפרק |
| `components/read/BookGrid.jsx` | `search`, `onSearch`, `activeTab`, `onTabChange`, `downloaded` | חיפוש ותצוגת 66 הספרים |
| `components/read/FloatingVerse.jsx` | `reference`, `verseText`, `onClose`, `chapterUrl` | חלונית פסוק צף וקישור למקרא |
| `components/read/PassageTabs.jsx` | `book`, `chapter`, `reference`, `language` | לשוניות Commentaries, Insights ו־Q&A לפי פרק |
| `components/read/VerseActionBar.jsx` | `verse`, `onHighlight`, `onBookmark`, `onNote`, `onCrossRef`, `onClose` | כל פעולות הפסוק: צבע, סימון, הערה, העתקה ושיתוף |
| `components/read/VerseList.jsx` | `verses`, `selectedVerse`, `onSelectVerse`, `highlights` | רשימת פסוקים לחיצה וסימון תרחיש |

### 4.4 פונקציות שרת

| קובץ | תפקיד | תוצר/התנהגות |
|---|---|---|
| `functions/adminAuth.js` | כניסה, session וניהול סיסמת מנהל | מאמת סיסמה מול salted SHA-256 ומנפיק token חתום ל־12 שעות |
| `functions/adminContent.js` | API ניהול תוכן | מאמת token, מגביל פעולות לישויות מנוהלות ומבצע CRUD בהרשאות האפליקציה |
| `functions/bibleChapter.js` | שליחת פרק מקרא לשרת | מאחזר אנגלית מ־Bible API ולוגאנדה מ־WordPlanet, מנקה HTML ומנרמל פסוקים |
| `functions/content.js` | API תוכן ציבורי | קורא קולקציות ציבוריות ומקבל הגשות ציבוריות כגון פנייה ושאלה |

### 4.5 ספריות ושכבות לקוח

| קובץ | תפקיד |
|---|---|
| `lib/adminSession.js` | ניהול token מנהל מקומי והזמנת פונקציות ניהול |
| `lib/app-params.js` | מתאם פרמטרי FSe2 לפי המשקפים המקומיים |
| `lib/AuthContext.jsx` | Provider ו־hook למצב התחברות של הקורא |
| `lib/bibleApi.js` | אחזור פרק, נרמול תשובות ושימוש במטמון המקומי |
| `lib/bibleBooks.js` | נתוני 66 הספרים: מספר, שם, קיצור, לוגאנדה ומספר פרקים |
| `lib/brandCss.js` | מערכת עיצוב מרכזית ו־CSS variables |
| `lib/contentApi.js` | ממשק אחיד לקריאת תוכן ושליחת תוכן ציבורי |
| `lib/crossRefs.js` | מקראות קשורות נבחרות לפי חוג |
| `lib/format.js` | עזרי טקסט, תאריכים, מזהים ומשך |
| `lib/luganda.js` | פירוק וניקוי דיבוטרים לוגאנדה |
| `lib/offlineDb.js` | מעטפת IndexedDB ו־stores לאחסון מקומי |
| `lib/planData.js` | תוכנית 30 הימים כגיבוי מקומי |
| `lib/player.jsx` | Provider וניהול תור השמעה, מהירות, עוצמה, shuffle ו־repeat |
| `lib/reading.js` | חישוב תאריכים, רצף ימים, streaks ותוויות |
| `lib/seedContent.js` | תוכן מובנה לכל הספריות |
| `lib/share.js` | בניית קישורי שיתוף והעתקה ללוח |
| `lib/themeContext.jsx` | טעינת הגדרות מותג והחלתן על גלם ה־CSS |
| `lib/theme.js` | קבועי המותג, כתובות לוגו, תמונות ו־donation |

### 4.6 קבצי ציבור, PWA ונכסים

| קובץ | תפקיד |
|---|---|
| `public/manifest.json` | הגדרת PWA: שם, צבעים, תצוגה, אייקונים ו־start URL |
| `public/sw.js` | מעטפת offline, cache-first לעצמות ולתמונות ו־network-first לשאר הבקשות |
| `public/assets/generated_022a23b6.png` | תמונת Hero ראשית |
| `public/assets/generated_0f91fdf8.png` | אייקון PWA גדול, maskable |
| `public/assets/generated_c990bd6c.png` | לוגו, Apple touch icon ואייקון 192×192 |
| `public/assets/generated_5fe46b6c.png` | נכס תמונה/כיסוי מהמותג |
| `public/assets/generated_703e129d.png` | נכס תמונה/כיסוי מהמותג |
| `public/assets/generated_8b82ca52.png` | נכס תמונה/כיסוי מהמותג |
| `public/assets/generated_a74541e8.png` | נכס תמונה/כיסוי מהמותג |
| `public/assets/generated_aa744f7a.png` | נכס תמונה/כיסוי מהמותג |
| `public/assets/generated_f0778e1c.png` | נכס תמונה/כיסוי מהמותג |
| `public/assets/media-library/b50e6c213bb8_pray-read-pneuma-main-3.zip` | ארכיון חומרי עיצוב; אינו נטען כחלק מה־runtime |
| `public/assets/media-library/f438ed2a3a0d_Pray-Read-Bible-Master-Prompt-For-Finestructure-Ai.pdf` | מסמך עיצוב/ייצור; אינו נטען כחלק מה־runtime |

בנוסף, `lib/theme.js` מפנה לנכסים דרך נתיבי FSe2 מסוג `/api/appfiles/public/app_<app-id>/assets/...`; לכן חלק מהקבצים המקומיים והנתיבים המרוחקים עשויים לייצג את אותם נכסים באמצעות שתי דרכי הגשה.

### 4.7 קבצים ארכיוניים שאינם חלק מהמערכת הפעילה

#### `__trash/`

אלה קובצים מייצגים גרסה קודמת או רכיבים שהוחלפו:

- `__trash/components/home/TodayCard.jsx`  -  כרטיס יום קריאה בעיצוב Tailwind ישן.
- `__trash/components/home/WeekStrip.jsx`  -  גרף קריאה שבועי ישן.
- `__trash/components/layout/Sidebar.jsx`  -  ניווט צד ישן, שהוחלף ב־AppHeader.
- `__trash/components/layout/SignInBanner.jsx`  -  באנר התחברות ישן.
- `__trash/components/read/BookPicker.jsx`  -  בורר ספרים ישן.
- `__trash/components/read/ReflectionPanel.jsx`  -  פאנל רפלקציה ישן.
- `__trash/pages/Insights.jsx`  -  דף תובנות מאוחד שהוחלף בשני דפים וב־InsightsBoard.
- `__trash/pages/Read.jsx`  -  קורא מקרא ישן שהוחלף ב־BibleReader ו־Chapter.

אין לייבא קבצים מ־`__trash`; הם עשויים להפנות למסלולים, שמות ממשק או מבני נתונים שאינם קיימים במערכת הנוכחית.

#### `__url_fetch/`

זו snapshots של משאבים חיצוניים ששימשו למחקר או להפקת תוכן, ואינם קבצי runtime:

- `__url_fetch/api.github.com-610168caa9/resource.json`
- `__url_fetch/bible-api.com-0cc629035b/page.html`
- `__url_fetch/bible-api.com-5cfcb2b388/page.html`
- `__url_fetch/bible-api.com-5d45e82024/page.html`
- `__url_fetch/bible-api.com-bd1cc1dba8/page.html`
- `__url_fetch/bible-api.com-cc3ac0d1a6/page.html`
- `__url_fetch/bible-api.com-f02bffcb7e/page.html`
- `__url_fetch/commons.wikimedia.org-28e25a84a2/page.html`
- `__url_fetch/commons.wikimedia.org-28e25a84a2/page.cleaned.html`
- `__url_fetch/commons.wikimedia.org-5c1fc7f1db/page.html`
- `__url_fetch/commons.wikimedia.org-5f45cc1ee9/resource.json`
- `__url_fetch/commons.wikimedia.org-662a72cc1e/page.html`
- `__url_fetch/finestructure.ai-062f449abc/screenshot_desktop.analysis.txt`
- `__url_fetch/finestructure.ai-062f449abc/screenshot_desktop.dataurl.txt`
- `__url_fetch/finestructure.ai-22f6a1ae1c/screenshot_desktop.analysis.txt`
- `__url_fetch/finestructure.ai-22f6a1ae1c/screenshot_desktop.dataurl.txt`
- `__url_fetch/finestructure.ai-25e0330875/screenshot_desktop.dataurl.txt`
- `__url_fetch/finestructure.ai-4461164b0d/screenshot_desktop.dataurl.txt`
- `__url_fetch/finestructure.ai-5591f94a1e/screenshot_desktop.analysis.txt`
- `__url_fetch/finestructure.ai-5591f94a1e/screenshot_desktop.dataurl.txt`
- `__url_fetch/finestructure.ai-5591f94a1e/screenshot_mobile.dataurl.txt`
- `__url_fetch/finestructure.ai-5685eb3d23/screenshot_desktop.dataurl.txt`
- `__url_fetch/finestructure.ai-836f0ad279/screenshot_mobile.dataurl.txt`
- `__url_fetch/finestructure.ai-b4bb9406e9/screenshot_desktop.analysis.txt`
- `__url_fetch/finestructure.ai-b4bb9406e9/screenshot_desktop.dataurl.txt`
- `__url_fetch/finestructure.ai-c48315fc0b/screenshot_desktop.analysis.txt`
- `__url_fetch/finestructure.ai-c48315fc0b/screenshot_desktop.dataurl.txt`
- `__url_fetch/finestructure.ai-cc63ca9c3f/screenshot_desktop.analysis.txt`
- `__url_fetch/finestructure.ai-cc63ca9c3f/screenshot_desktop.dataurl.txt`
- `__url_fetch/finestructure.ai-cc63ca9c3f/screenshot_mobile.dataurl.txt`
- `__url_fetch/finestructure.ai-df056e97b3/screenshot_desktop.dataurl.txt`
- `__url_fetch/finestructure.ai-f7d5534825/screenshot_desktop.analysis.txt`
- `__url_fetch/finestructure.ai-f7d5534825/screenshot_desktop.dataurl.txt`
- `__url_fetch/finestructure.ai-fcd03c6f55/screenshot_desktop.dataurl.txt`
- `__url_fetch/wordplanet.net-315c1631be/page.html`
- `__url_fetch/wordplanet.net-315c1631be/page.cleaned.html`
- `__url_fetch/wordplanet.net-8facd626b0/page.html`
- `__url_fetch/wordplanet.net-8facd626b0/page.cleaned.html`
- `__url_fetch/wordplanet.net-e67c8e32f9/page.html`
- `__url_fetch/wordplanet.net-e67c8e32f9/page.cleaned.html`
- `__url_fetch/wordproaudio.org-f4f9fd187a/page.html`

### 4.8 קבצים חיצוניים חסרים מהתיעוד שסופק

הקוד מייבא גם מ:

- `@/api/fse2Client`  -  שכבת הלקוח המרכזית ל־FSe2.
- `@/utils`  -  בו נמצא `createPageUrl`.
- קובץ bootstrap של React Router  -  לא סופק.
- קובצי `package.json`, build ו־deployment  -  לא סופקו.

לכן אי אפשר לאשר מהקוד:
- את מספרי הגרסאות המדויקים של הספריות.
- את שירות ה־API המדויק שמגיש את הפונקציות.
- את מנגנון ה־routing המלא.
- את פקודות ה־build וה־test.

---

## 5. מודל הנתונים  -  Entities

> חלק הישויות כולל גם שדות מערכת כגון `id`, `created_date` ו־`updated_date` המתווספים בדרך כלל בצד השרת, גם אם אינם מוגדרים בקובצי ה־JSON.

### 5.1 תוכן ציבורי וניהולי

| Entity | תכלית | שדות מרכזיים | קשרים |
|---|---|---|---|
| `BibleVerse` | אחסון מקומי של פסוק מקרא בשתי שפות | `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu` | מזוהה לפי מספר ספר, פרק ופסוק; קשור ל־`Commentary` ו־`StudyMark` |
| `Commentary` | הערת פירוש על ספר ופרק | `book`, `chapter`, `title`, `body_en`, `body_lu` | מקושר למקרא לפי שם ופרק, ללא מזהה ספר ייחודי |
| `Devotional` | דיבוטר יומי באנגלית ולוגאנדה | `code`, `title`, `title_lu`, `scripture`, `scripture_lu`, `body`, `body_lu`, `related`, `further_readings`, `cover_image` ונתוני מטא־דאטה נוספים | `DevotionalProgress` מפנה אליו לפי `devotional_code` |
| `Prayer` | תפילה מספריית התפילות | `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref` | `PrayerSaved` מפנה אליו לפי כותרת |
| `Insight` | תובנה תיאולוגית או היסטורית | `kind`, `title`, `passage`, `excerpt`, `body`, `share_count` | קשור למקרא בצורת טקסט חופשי |
| `QAEntry` | שאלת קהילה ותשובתה | `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email` | קשור למשתמש לפי אימייל; קשור למקרא בצורת טקסט חופשי |
| `ReadingPlan` | יום בתוכנית הקריאה | `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture` | `Reading.plan_day` מציין את יום התוכנית |
| `VerseSongSeries` | סדרת Verse-Song | `name`, `description`, `thumbnail`, `cover_image`, `accent` | `VerseSongEpisode.series_name` מפנה אל הסדרה |
| `VerseSongEpisode` | פרק בודד בסדרת שירים | `series_name`, `title`, `verse_ref`, `duration_label`, `duration_seconds`, `audio_url`, `audio_key`, `thumbnail`, `episode_order` | קשור ל־`VerseSongSeries`; `audio_key` משמש לאחסון או מיפוי קובץ |
| `VerseOfDay` | פסוק מוקצר לתאריך מסוים | `verse_date`, `reference`, `text_en`, `text_lu`, `note` | קשור למקרא בצורת טקסט חופשי |
| `LiveSession` | מפגש הוראה חיה עתידי | `title`, `session_date`, `host`, `join_link`, `description` | קישור חיצוני; אין קשר מובנה למשתמש |
| `DiscussionGroup` | קבוצת לימוד | `name`, `description`, `schedule`, `member_count` | `DiscussionThread.group_name` מפנה אל הקבוצה |
| `SiteSettings` | הגדרות מותג ואתר בצורת key/value | `setting_key`, `setting_value` | נקרא על ידי `ThemeContext`; משמש גם לשם האתר ולקישור התרומה |

### 5.2 נתוני משתמש

| Entity | תכלית | שדות מרכזיים | קשרים |
|---|---|---|---|
| `Reading` | רשומת קריאת פרק והתקדמות אישית | `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses` | קשור ל־`ReadingPlan` לפי `plan_day`; משלים את מידע `StudyMark` |
| `StudyMark` | סימון, סימן ספר או הערה על פסוק | `owner_email`, `mark_type`, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text` | קשור למיקום במקרא; `mark_type` הוא highlight, bookmark או note |
| `JournalEntry` | רשומת יומן תפילה | `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood` | קשור אופציונלית למקרא |
| `DevotionalProgress` | סימון דיבוטר כהושלם | `owner_email`, `devotional_code`, `completed_date` | קשור ל־`Devotional.code` |
| `PrayerSaved` | שמירת תפילה למועדפים | `owner_email`, `prayer_title` | קשור ל־`Prayer.title` באמצעות מפתח טקסטואלי |
| `Revelation` | חשיפה אישית או תגובה לחשיפה | `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id` | קשור עצמי: רשומה עם `parent_id` היא תגובה לחשיפת אב |
| `DiscussionThread` | הודעה בקבוצת דיון | `group_name`, `owner_email`, `author_name`, `title`, `body` | קשור ל־`DiscussionGroup.name` |
| `QAEntry` | כולל גם שאלת משתמש | `author_email` | קשור למשתמש המחובר |

### 5.3 ניהול, תקשורת ויומן

| Entity | תכלית | שדות מרכזיים |
|---|---|---|
| `AdminAccount` | חשבון מנהל תוכן | `email`, `password_hash`, `salt`, `updated_date` |
| `ActivityLog` | יומן פעילות במערכת הניהול | `actor`, `action`, `section`, `detail` |
| `ContactMessage` | פנייה מאתר | `name`, `email`, `subject`, `message`, `is_read`, `reply` |

### 5.4 מודל ההרשאות

| קבוצת ישויות | מצב גישה |
|---|---|
| `BibleVerse`, `Commentary`, `Prayer`, `Insight`, `QAEntry`, `ReadingPlan`, `VerseSongSeries`, `VerseSongEpisode`, `VerseOfDay`, `LiveSession`, `DiscussionGroup`, `Revelation` | קריאה ציבורית |
| `ContactMessage` | יצירה ציבורית; קריאה וניהול על ידי מנהל |
| `DevotionalProgress`, `PrayerSaved`, `JournalEntry`, `Reading`, `StudyMark` | CRUD למשתמש מחובר, owner או admin |
| `Revelation`, `DiscussionThread` | קריאה ציבורית; כתיבה למשתמש מחובר |
| `ActivityLog`, `AdminAccount`, `SiteSettings` | מנהל בלבד |
| ישויות תוכן ציבורי | כתיבה למנהל |

חשוב: חלק מכללי ההרשאות מאפשרים לכל משתמש מחובר לקרוא, לעדכן או למחוק רשומות. רוב הסינון לפי בעלות מתבצע כיום בצד הלקוח. יש לוודא ש־FSe2 אכיפה גם ברמת השורה, במיוחד עבור `Revelation` ו־`DiscussionThread`.

---

## 6. תהליכים ואינטראקציות מרכזיות

### 6.1 טעינת האפליקציה

1. המשתמש נכנס לאחד הנתיבים.
2. `Layout` מעטיף את הדף ב־`AuthProvider`.
3. `AuthProvider` מנסה לקבל את המשתמש הנוכחי מ־`fse2.auth.me`.
4. `ThemeProvider` טוען הגדרות מותג אם המשתמש מחובר.
5. `PlayerProvider` יוצר את אובייקט האודיו הגלובלי.
6. `PwaHead` מוסיף meta tags ורושם את `sw.js`.
7. `AppHeader`, תוכן הדף, `AppFooter` ו־`GlobalPlayer` מרונדים.

### 6.2 קריאת פרק ושמירת סימונים

1. המשתמש בוחר ספר ב־BibleReader.
2. המערכת יוצרת כתובת `/Chapter` עם מספר הספר והפרק.
3. `Chapter` קורא את הפרמטרים ומאחזר את הפרק דרך `fetchChapter`.
4. אם המקרא נמצא במטמון המקומי, הוא יכול לשמש כגיבוי להורדה כושלת.
5. המשתמש לוחץ על פסוק.
6. נפתח `VerseActionBar`.
7. לחיצה על צבע יוצרת `StudyMark` מסוג highlight.
8. Bookmark יוצר סימן book; Note יוצר רשומת note.
9. בעת סיום קריאה נשמרת רשומת `Reading` עם סטטוס, תאריך, רפלקציה, נקודת תפילה ופסוקים מסומנים.
10. המידע מוצג ב־BibleNotes וב־Dashboard.

### 6.3 התקדמות בתוכנית הקריאה

1. `Plan` טוען את התוכנית מהמסד או מ־`PLAN_DAYS`.
2. היא טוענת את רשומות `Reading` של המשתמש.
3. רשומות בסטטוס completed מזוהות לפי `plan_day`.
4. היום הנוכחי הוא היום הראשון שטרם הושלם.
5. לחיצה על כרטיס יום מובילה לפרק המתוכנן.
6. אחרי שמירת הקריאה, מטמון React Query מתעדכן והאחוז מתחשב מחדש.

### 6.4 קריאת דיבוטר וסימון כהושלם

1. `Devotionals` טוען רשומות חיות ובמקרה שאין משתמש בהן מציג את `DEVOTIONALS`.
2. בחירת דיבוטר פותחת מודאל.
3. המשתמש יכול לעבור בין אנגלית ללוגאנדה.
4. סימון “הושלם” מעדכן את מצב ההתקדמות המקומי.
5. `DevotionalProgress` מאפשרת לשמור את אותו מידע בשרת ולסנכרן אותו בין מכשירים.
6. ShareRow מאפשר לשתף את הדיבוטר.

### 6.5 שמירת תפילה ושיתוף

1. המשתמש מחפש או מסנן תפילה.
2. לחיצה על Bookmark שולחת יצירה של `PrayerSaved`.
3. הרשומה מוצגת ב־Dashboard.
4. לחיצה נוספת מוצאת את הרשומה ומוחקת אותה.
5. ShareRow בונה כתובת ייעודית לכל ערוץ.
6. ערוץ Copy משתמש ב־Clipboard API ומציג אישור למשך כשני שניות.

### 6.6 פרסום חשיפה ותגובה

1. משתמש לא מחובר רואה כרטיס התחברות עם כתובת חזרה לעמוד.
2. משתמש מחובר מזין כותרת, מקרא וגוף.
3. הטופס שולח רשומת `Revelation` חדשה ללא `parent_id`.
4. רשומות עם `parent_id` מוצגות כתגובות תחת החשיפה המתאימה.
5. תגובה חדשה נשמרת כ־`Revelation` עם `parent_id` של החשיפה.
6. Like מעדכן את מספר הסיימים; המסך מציג מספר מקומי מיידי בזמן העדכון.

### 6.7 הצטרפות לקבוצת דיון

1. המשתמש בוחר קבוצה.
2. הצטרפות נשמרת מקומית ב־`joinedGroups`.
3. הודעות הקבוצה נטענות מ־`DiscussionThread`.
4. משתמש מחובר שולח הודעה עם שם הקבוצה, שם המחבר, כותרת וגוף.
5. ההודעה מופיעה ברשימה לאחר רענון הנתונים.
6. ההצטרפות עצמה אינה נשמרת כרשומת שרת; רק ההודעות משתמשות ב־`DiscussionThread`.

### 6.8 ניהול יומן

1. משתמש מחובר בוחר “New entry”.
2. `JournalForm` מאפשר כותרת, גוף, קטגוריה, ספר ופרק.
3. חובה שכלל אחד מהכותרת או הגוף אינו ריק.
4. רשומה חדשה נשמרת כ־`JournalEntry`.
5. בעריכה מועברים נתוני הרשומה אל `initial`, והטופס מתאפס בעת החלפת ה־initial.
6. מחיקה מתבצעת לאחר אישור במסך.
7. הרשימות מסוננות לפי בעלות וקטגוריה.

### 6.9 השמעת Verse-Song

1. המשתמש בוחר סדרה או פרק.
2. `VerseSongSeries` או `VerseSongs` ממירים את הפרקים לפורמט אודיו.
3. `playQueue` מעדכן את תור הנגן.
4. `GlobalPlayer` מציג את הפרק הנוכחי, זמן, מהירות, עוצמה, shuffle ו־repeat.
5. האודיו חי ב־PlayerProvider ולא נעלם בעת ניווט בין דפים.
6. בסיום פרק התור מתקדם אוטומטית; בסיום התור ההשמעה נעצרת.

### 6.10 הורדת תוכן לא מקוון

1. המשתמש בוחר קטגוריות ב־Offline.
2. המערכת מבקשת מהשרת את התוכן הנבחר.
3. התוכן נשמר ב־IndexedDB לפי store.
4. המסך מציג מספר רשומות, נפח שימוש ומצב הורדה.
5. בקריאת מקרא לא מקוונית המערכת מחפשת תחילה במטמון.
6. ניקוי המרכז מוחק את הנתונים שנבחרו או את כל המטמון.

### 6.11 התחברות ושחזור סיסמה

1. קורא שלא מחובר נשלח ל־Login או Signup.
2. לאחר login מוצלח מופנה המשתמש ל־Dashboard.
3. רישום שדורש אימות מציג למשתמש הוראה לבדוקת אימייל.
4. בקשת forgot password מוחזרת באמצעות שירות האימות.
5. קישור האיפוס מעביר token בפרמטר URL.
6. ResetPassword מאמת את ה־token דרך שירות האימות ומעדכן את הסיסמה.

### 6.12 פרסום ועריכה ב-CMS

1. המנהל נכנס ב־Admin עם אימייל וסיסמה.
2. `adminAuth` מאמת את הסיסמה ומנפיק token חתום.
3. ה־token נשמר ב־`localStorage`.
4. המנהל מגיע ל־AdminDashboard.
5. בחירת מקטע טוענת את הנתונים הרלוונטיים.
6. פעולות CRUD נשלחות דרך `adminContent`, המאמת את אותו token.
7. השרת משתמש בהרשאות האפליקציה כדי לכתוב לישויות המנוהלות.
8. שינויי תוכן מגיעים לקוראים דרך קריאות התוכן הציבוריות.

---

## 7. הערות טכניות לפיתוח

### 7.1 ספריות וכלים בשימוש

| ספרייה/כלי | שימוש |
|---|---|
| React | רכיבי ממשק, state, context ו־effects |
| React Router | ניתוב בין עמודים, פרמטרים ו־`Link` |
| TanStack React Query | מצב שרת, caching, mutations ו־invalidation |
| FSe2 client | אימות, ישויות, הרשאות והפעלת פונקציות |
| Lucide React | אייקונים אחידים בכל המערכת |
| date-fns | עיצוב וחישוב תאריכים |
| IndexedDB | הורדות ונתוני קריאה מקומיים |
| `localStorage` | העדפות, התקדמות מקומית ו־token מנהל |
| Service Worker | מעטפת PWA ואחסון תשובות |
| Tailwind utility output | utility classes מוגנים ב־`__generated/tailwind.css` |
| `BRAND_CSS` | מערכת עיצוב ראשית ועיצוב מותג |

### 7.2 דפוסים חוזרים

#### Provider מקונן

ה־Layout מייצר provider אחד בתוך השני:

- `AuthProvider` מספק מצב משתמש.
- `ThemeProvider` משתמש במצב האימות כדי לטעון הגדרות.
- `PlayerProvider` מספק נגן גלובלי.

רכיב שאינו בתוך ה־provider המתאים יקבל שגיאה מ־`useAuth` או מ־`usePlayer`.

#### React Query למצב שרת

- `useQuery` מיועד לקריאות.
- `useMutation` מיועד ליצירה, עדכון ומחיקה.
- לאחר mutation מבצעים לרוב `invalidateQueries`.
- חלק ה־query keys כוללים את סוג המשתמש או ה־email, וחלקם אינם כוללים אותו. לכן מעבר בין משתמשים עלול להציג מידע ממטמון ישן.

#### Fallback מתוכן מובנה

ה־seed content נועד להבטיח שהמסך לא יישאר ריק כשהמסד ריק או אינו זמין. אין להחליף את ה־fallback במסד ריק בלי לוודא שהחוויה הריקה אינה מכוונת.

#### הפרדת מצב מקומי למצב מסונכרן

דוגמאות:

- הצטרפות לקבוצה  -  מקומית.
- שמירת תובנה  -  מקומית.
- סימון דיבוטר  -  מקומי, עם אפשרות סנכרון.
- סימון, הערה ויומן  -  מסונכרנים בשרת.
- token מנהל  -  מקומי ורגיש.

#### `safeText`

הפונקציה `safeText` אינה מנקה HTML. היא רק מבטיחה שמוחזר ערך בסוג string. בטיחות מול HTML מגיעה מכך ש־React מנצל את מילים ללא `dangerouslySetInnerHTML`. אין להשתמש ב־`safeText` כאילו היא מנקה XSS.

#### `createPageUrl`

כל הניווט הפנימי אמור לעבור דרך `createPageUrl`. אין לבנות נתיבים ידנית בקוד חדש, כדי לשמור על prefix, נתיבי התקנה ותאימות ה־PWA.

### 7.3 הוספת פיצ'ר חדש  -  רשימת בדיקה

1. **נתונים**
   - להוסיף או לשנות entity.
   - להגדיר required, labels והרשאות.
   - לבצע migration אם נדרש.
   - להוסיף את הישות ל־`MANAGED` אם היא צריכה להיות ב־CMS.

2. **API**
   - להוסיף מיפוי קריאה ל־`contentApi`.
   - להוסיף action ציבורי רלוונטי ב־`functions/content.js`.
   - לאשר שאין חשיפה של רשומות של משתמש אחר.

3. **ממשק**
   - ליצור רכיב עם props ברורים.
   - להוסיף דף או לשלב את הרכיב בדף קיים.
   - לטפל ב־loading, empty, error ו־success.
   - להשתמש ב־safeText לתוכן ממסד.

4. **ניווט**
   - להוסיף קישור ל־Header, Footer או Home בהתאם לחשיבות.
   - לוודא שהנתיב תואם ל־`createPageUrl`.
   - לוודא שהנתיב נכלל ב־`SHELL` של service worker אם הוא אמור לעבוד offline.

5. **מצב**
   - להחליט אם הנתון מסונכרן או מקומי.
   - להוסיף query key ייחודי הכולל מזהה משתמש כשצריך.
   - להוסיף invalidation מדויקת לאחר mutations.

6. **נגישות**
   - להוסיף labels לטפסים.
   - לוודא שכפתורי סמלים כוללים `aria-label`.
   - לוודא שפעולות לא מבוססות רק על צבע.
   - להוסיף focus management למודאלים.

7. **QA**
   - לבדוק משתמש מחובר ולא מחובר.
   - לבדוק רשת תקינה, רשת כושלת ו־offline.
   - לבדוק נתונים ריקים ונתונים חלופיים.
   - לבדוק מובייל ו־RTL עתידי.
   - לעדכן את גרסת מטמון ה־service worker לאחר שינוי עיצוב או נתיבים.

### 7.4 נקודות חולשה ואי־התאמות קיימות

הנושאים הבאים חשובים במיוחד בזמן דיבאג:

1. **סיסמת מנהל ברירת מחדל חלשה.**  
   `functions/adminAuth.js` משתמש ב־`prayread-admin` כגיבוי כאשר `ADMIN_INITIAL_PASSWORD` אינו מוגדר. בסביבה אמיתית יש לחייב הגדרת secret חיצוני ולהחליף את הסיסמה מיד.

2. **SHA-256 אינו אלגוריתם מומלץ לאחסון סיסמאות.**  
   עדיף להשתמש ב־PBKDF2, scrypt או Argon2 עם salt ייחודי לכל סיסמה ופרמטרי עבודה משתנים.

3. **token מנהל ב־`localStorage`.**  
   הוא חשוף ל־XSS. אם אפשר, עדיף cookie מאובטח `HttpOnly` או מנגנון session מבוסס שרת.

4. **סינון בעלות בצד הלקוח.**  
   `Journal`, `BibleNotes`, `Dashboard` ועוד טוענים רשומות רבות ומסננים לפי `owner_email`. יש לוודא שהשרת מחזיר רק רשומות של המשתמש.

5. **הרשאות רחבות מדי.**  
   ב־`Revelation` וב־`DiscussionThread`, כל משתמש מחובר יכול, לפי הסכמה, גם לעדכן או למחוק. יש להוסיף תנאי בעלות או moderation.

6. **אין pagination.**  
   קריאות מוגבלות ל־200 - 400 רשומות. באתר גדול חלק מהנתונים עלולים לא להופיע או להידרד מהמיון.

7. **חוסר התאמה בין `offlineDb.STORES` לבין Offline.**  
   ב־`offlineDb.js` מוגדרים stores כגון `devotionals`, `commentary`, `qa` ו־`verseOfDay`, אך לא מוגדר store בשם `prayers`, בעוד ש־Offline מציג קטגוריית “Prayers”. יש לאמת שההורדה אינה נכשלת בגלל כך.

8. **חלונית רשומות מוגבלת.**  
   ברשימות כגון `PrayerSaved`, `Reading` ו־`DevotionalProgress` משתמשים בכותרת או בקוד כמפתח טקסטואלי. שינוי שם תוכן עלול לנתק את הקשר. מזהה יציב עדיף.

9. **חיבורים לפי שם במקום מזהה.**  
   `DiscussionThread.group_name`, `VerseSongEpisode.series_name` ו־`PrayerSaved.prayer_title` רגישים לשינוי שם.

10. **התאמת מקראות לפירושים היא הערכתית.**  
    `PassageTabs` מנסה לזהות ספר ופרק מתוך מחרוזת `passage`. השיטה עלולה להיכשל בשמות כמו “1 John” ובמקרים שבהם מספר אחר מופיע לפני מספר הפרק.

11. **אי־דיוק בחישוב מספר הספר של פסוק היום.**  
    `VerseOfDay` מחפש את המספר הדיגיטלי הראשון בהפניה. הפניה כמו “John 3:16” עלולה להפיק את `3` במקום את מספרו של ספר יוחן. נדרשת פענוח לפי שם הספר, לא לפי המספר הראשון.

12. **דיבוק טיימרים ללא ניקוי.**  
    `ShareRow` ו־`VerseActionBar` יוצרים timeout ללא ביטולו בעת unmount. רצוי לשמור את מזהה ה־timeout ולנקות אותו.

13. **ניקוי טיוט לפני אישור השמירה.**  
    `CommentThread` ו־`ThreadMessages` מוחקים את הטיוט מיד לאחר קריאה ל־`onSubmit`. אם השמירה נכשלת, הטקסט אבד. עדיף לנקות רק לאחר resolution מוצלח.

14. **מודאל אינו נגיש במלואו.**  
    `Modal` נועל גלילת גוף ומאפשר Escape, אך אין מלכודת focus, אין העברת focus לתוכן ואין שחזור focus לכפתור הפותח.

15. **אזהרת התקנת PWA לא נמחקת כראוי.**  
    ב־`InstallPrompt`, ה־listener של `appinstalled` נרשם כ־anonymous ולכן אינו מוסר בעת unmount.

16. **קריאות URL מבוססות `window.location`.**  
    דפים רבים קוראים ישירות מ־`window.location.search`. שינוי פרמטרים בלי reload עלול לא לעדכן state באופן מלא. `useSearchParams` של React Router היה פתרון מתאים יותר.

17. **מטמון React Query אינו תמיד מפריד בין משתמשים.**  
    חלק מה־query keys אינם כוללים את ה־email או את מצב האימות. מומלץ לבצע `clear` או `removeQueries` בעת logout ו־login.

18. **זיהוי תוכן לפי כותרת.**  
    כמה דפים ממזגים seed ו־נתונים חיים לפי כותרת. שתי רשומות בעלות כותרת זהה עלולות להתנגש.

19. **רשימות וישויות מוגבלות וללא מיון אצל השרת.**  
    גם אם ממשק המשתמש מציג מיון מסוים, ה־API עדיין עשוי להעביר מאות רשומות.

20. **התנהגות cache של service worker עלולה להציג גרסה ישנה.**  
    המעטפת משתמשת ב־cache-first. יש להגדיל את שם המטמון בכל פריסה משמעותית.

21. **`cache.addAll` הוא all-or-nothing.**  
    אם אחד הנתיבים ב־`SHELL` נכשל, ייתכן שאף הנתיבים לא יישמרו במטמון. עדיף להוסיף אותם בנפרד.

22. **אין שכבת i18n.**  
    המערכת מציגה ממשק באנגלית, אך התוכן כולל לוגאנדה. אין כרגע תרגום רב־לשוני של labels, כפתורים והודעות שגיאה.

23. **נתוני התקדמות כפולים.**  
    סיום דיבוטר, הצטרפות לקבוצה והתקדמות קריאה מופיעים במקומות מקומיים ומסונכרנים. צריך להגדיר מקור אמת ברור לכל מדד.

24. **הגדרות הצבע סותרות בין מסמכים.**  
    `theme.js` מתאר את הצבעים כקבועים לפי מדריך המותג, אך `ThemeContext` מאפשר להחליף אותם דרך ה־CMS. כדאי ליישב זאת במדיניות ברורה.

25. **`app-params.js` ניגע ישירות ל־`window` ו־`localStorage` ברמת מודול.**  
    זה עלול לשבור בדיקות SSR או unit tests בסביבת Node. עדיף לאחל את הפרמטרים בתוך הקלטת האפליקציה.

26. **`fse2.auth.me()` חייב לזרוק שגיאה כשאין משתמש.**  
    `AuthContext` מחשיב שיש משתמש מחובר בכל פעם שהקריאה מחזירה בהצלחה. אם הלקוח מחזיר `null` במקום לזרוק, עלולה להופיע התחברות משקרית.

### 7.5 מדריך דיבאג מהיר

| תסמונת | שכבה ראשונה לבדיקה |
|---|---|
| התוכן הציבורי ריק | `fetchPublicCollection`, תשובת `functions/content.js`, תנאי fallback ו־React Query cache |
| משתמש מחובר לא מזוהה | `fse2.auth.me`, `AuthContext`, localStorage של FSe2 |
| שגיאת 401 ב־Admin | תוקף ה־token, secret בשרת, זמן תפוגה ו־`pr_admin_token` |
| שגיאת 403 בישות | `x-fse2-access` ותפקיד המשתמש |
| נתונים ישנים | מטמון React Query, תאריך entity ושינויי service worker |
| קריאה לא מקוונית נכשלת | IndexedDB, `offlineDb.STORES` ונתיבי השמירה |
| פסוק היום מקשה לפרק | פענוח `reference` למספר הספר |
| תובנה מוצגת בלשונית הלא נכונה | לוגיקת התאמת `passage` |
| הערת קהילה נעלמת לאחר כישלון | ניקוי ה־draft לפני resolution של ה־mutation |
| שינוי CSS אינו נראה | עדכון `BRAND_CSS`, סדר טעינת styles ומטמון service worker |
| התקנת PWA אינה מופיעה | תמיכת דפדפן, HTTPS, manifest ו־`beforeinstallprompt` |
| אודיו ממשיך או נעצר באופן לא צפוי | `PlayerProvider`, אירועי `Audio`, תור ו־`repeat` |

### 7.6 מה לבדוק לפני release

- כניסה והרשמה במשתמש חדש ובמשתמש קיים.
- איפוס סיסמה בדפדפן נייד.
- קריאת פרק באנגלית ובלוגאנדה.
- קריאה לאחר ניתוק רשת.
- יצירת סימון, הערה, סימן ספר ורפלקציה.
- סנכרון שתי סדרות מכשירים עם אותו חשבון.
- פרסום חשיפה, תגובה ולייק.
- הצטרפות לקבוצה ושליחת הודעה.
- שמירת יומן ועריכתו.
- השמעת סדרת Verse-Songs והמשך האודיו בין עמודים.
- הורדת כל מקטעי Offline וניקויו.
- התחברות מנהל, עריכת תוכן והתפשרות השינויים בקהילה.
- התקנת PWA ועדכון לגרסת production.
- נגישות במקלדת למודאלים, תפריט הנייד וטפסים.
- בדיקת console ו־Network לשגיאות 401, 403, 404 ו־CORS.

---

## סיכום

Pray-Read היא למעשה ארבעה מוצרים משולבים באפליקציית אחת:

1. **ספריית מקרא ותוכן רוחני** עם ממשק ציבורי ותוכן חלופי.
2. **מערכת לימוד אישי** עם הערות, סימונים, יומן, תוכנית והתקדמות מסונכרנת.
3. **קהילה ותוכן משתמשים** עם חשיפות, תגובות, קבוצות ו־Q&A.
4. **מערכת ניהול תוכן ו־PWA** המאפשרת עדכון מהיר, הפצה, התקנה ושימוש לא מקווני.

העיקרון המנחה של המערכת הוא להשאיר את המשתמש מסוגל לקרוא ולהתפלל גם כאשר התוכן המקוון חסר, השרת אינו זמין או מסד הנתונים עדיין ריק. כל שינוי עתידי צריך לשמור על שלושה עקרונות: **מקור אמת ברור, בעלות נתונים מוגנת, וגיבוי מקומי אמין**.
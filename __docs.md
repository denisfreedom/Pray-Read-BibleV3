# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

> **הערת תחום:** התיעוד מבוסס על קוד שסופק בפרויקט, כולל קטעים שמסומנים ב״נחתך״. לכן פרטים על חלק מהשדות, ה־URL הפיזי וה־routing עשויים להיות מושלמים בגרסת המקור המלאה. הנתיבים שמופיעים להלן הם הנתיבים הלוגיים הנוצרים דרך `createPageUrl(...)`; החלק המקורי של הנתיב תלוי בהגדרת האפליקציה בפלטפורמה.
>
> הקבצים תחת `__trash` ו־`__url_fetch` נחשבים שאריות בדיקה, מסמכי מחקר ודפי ניסוי. הם אינם חלק מהמסלול הפעיל של האפליקציה, ואין להתחשב בהם בתכנון או בדיבאג של המערכת הפעילה.

---

## 1. מהות המערכת

### 1.1 תיאור כללי

Pray-Read Bible היא אפליקציית React לקריאת המקרא, מחקר ותפילה, בעברית ובלוגינדה. היא מחברת בין:

- קריאת פרקים מלאה מן הביבליה.
- מבנאי ספרים, מבואים, עיונים, הערות ותפילות.
- מילים מורכבות עם מספרי Strong’s.
- הפניות צלב ותפילות המשויכות לפסוק מסוים.
- משאלות ותשובות דו-לשוניות.
- מפעל תפילות, מדקדקים יומיים, שירי מקרא והשמעה.
- קהילה: גילויים, הוראות חיות וקבוצות דיון.
- תכנית קריאה, יומן תפילה, הערות, סימונים והיסטוריית קריאה.
- הורדת תוכן לשימוש ללא חיבור.
- ממשק ניהול להעלאת תוכן, עריכתו, ביקורת התקנת הביבליה וניהול מדפים.

המערכת אינה רק “מקרא באינטרנט”. היא בנויה כסביבת לימוד יומי: הקורא בוחר פרק, קורא לאט, מסמן מילים או פסוקים, פותח הערות ותפילות רלוונטיות, ואחר כך ממשיך להתקדם בתכנית או בקבוצת לימוד.

### 1.2 קהל היעד

1. **קוראים מאמינים**  
   רוצים לקרוא פרק שלם, להבין את ההקשר ולהפוך את הקריאה לתפילה.

2. **לוקחים ומשתמשי בית**  
   משתמשים בסימונים, הערות, יומן, היסטוריית קריאה והורדות לשימוש ללא חיבור.

3. **חברי קהילה**  
   משתפים גילויים, משיחים בקבוצות ומשתתפים בהוראות חיות.

4. **מנהלי תוכן**  
   מעלים מלים, תפילות, מבואים, הערות מקרא, מילים Strong’s, שירים ונתוני קהילה.

5. **צוות תפעול**  
   מתקין פרקי KJV+ ולוגינדה, בודק כיסוי, מזהה פרקים פגומים ומשלים התקנות חוזרות באופן עמיד.

### 1.3 הערך שהמערכת מספקת

- **קריאה ללא עוכבים:** אחרי התקנה, פרקים זמינים גם ללא חיבור.
- **דו-לשוניות:** תוכן עיקרי באנגלית ובלוגינדה, עם נפילה חיננית לתוכן מובנה כאשר רשומת חי אינה זמינה.
- **חיבור בין מקרא ללימוד:** פסוק, הערת מקרא, מבוא פרק, עיון, תפילה והפניית צלב מוצגים באותו מסך.
- **ספירות אישיות:** סימונים, הערות, ספרייה, יומן והתקדמות נשמרים למשתמש מחובר.
- **המשך הפעילות בין דפים:** נגן השירים הגלובלי ממשיך לנגן בעת מעבר בין המקרא, הבית ולוח המחוונים.
- **עמידות תפעולית:** התקנות אינדקספולביות וניתנות להפעלה חוזרת מהממשק או ממשרת ה־cron.

### 1.4 ארכיטקטורה

המערכת מורכבת מחמש שכבות:

| שכבה | תפקיד |
|---|---|
| דפים | מסכים ראשיים ברמת מוצר: קריאה, תפילה, קהילה, חשבון, התקנות וניהול |
| רכיבי UI | רכיבים לשימוש חוזר: כרטיסים, טפסים, מודאלים, נגן, מחוונים ולוחות סטודיו |
| שירותי לקוח ב־`lib/` | גישה לנתונים, נרמול, פענוח הפניות, זיכרון מקומי, אימות, התקנות גרסאות, שיתוף ועיבוד סימונים |
| פלטפורמת FSe2 | מאגרי ישויות, אימות משתמשים, העלאת קבצים, הפעלת פונקציות שרת והרשאות |
| שרת ומקורות חיצוניים | התקנת מקרא, מילואי מקרא, מילון Strong’s, ייבוא והגשת תוכן |

הזרימה הכללית:

```text
Pages
  └── Components
        └── lib/*
              ├── FSe2 Entities / Functions / Auth / Integrations
              ├── IndexedDB Offline Cache
              ├── Local Storage
              └── External Bible and Lexicon Sources
```

### 1.5 מקור האמת וסדרי נפילה

| תחום | סדר העדיפות |
|---|---|
| תוכן ציבורי | רשומת חי מה־FSe2 → תוכן מובנה מ־`seedContent.js` |
| פרק מקרא | פרק מותקן במסד הנתונים → עותק לא־מקוון → מקור חיצוני/פונקציית שרת |
| הערות לימוד | רשומת המשתמש בשרת → IndexedDB → מיזוג מקומי־שרתי |
| הגדרת Strong’s | מטמון מקומי → `StrongEntry` בשרת → מילון חיצוני |
| צבעי האתר | `SiteSettings` כשהמשתמש מחובר → ברירות המחדל של `theme.js` |
| ניהול תוכן | פונקציית שרת → נתיב ישיר מהדפדפן כגיבוי |
| תוכן מובנה | משמש תמיד כערכת ביטחון כדי שמסך לא יישאר ריק |

---

## 2. עמודים ותפקידיהם

### 2.1 קודמת ניווט

- `createPageUrl("PageName")` הוא מקור האמת לנתיבים.
- שם הדף משמש גם כמזהה לניווט וגם כמפתח תצוגה בהדר.
- פרמטרים חשובים:
  - `book`  -  מספר ספר, 1 - 66.
  - `chapter`  -  מספר פרק.
  - `verse`  -  מספר פסוק.
  - `lang`  -  `en` או `lu`.
  - `series`  -  מזהה או שם סדרת שירים.
  - `song`  -  מזהה שיר.
  - `devotional`  -  קוד מדקדק יומי.
  - `group`  -  שם קבוצת דיון.
  - `letter`, `topic`, `search`  -  מסנני Q&A.
  - `token`  -  אסמכתא לאיפוס סיסמת קורא.

### 2.2 דפי גילוי ותוכן

| עמוד | נתיב לוגי | תפקיד ומטרתו | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| `Home` | `/Home` וכנריך `/` | דף הכניסה ומרכז הגילוי. מציג את ערכי המוצר, תוכן יומי והזמנה להתקנת האפליקציה. | כרטיסי תחומים, קישורי “להתחיל”, תוכן יומי, שיתוף, התקנת PWA, מעבר לקורא ולחשבון |
| `About` | `/About` | מסביר את מטרת Pray-Read, אופן השימוש והערכים של הפרויקט. | קריאת מידע, חזרה לדף הבית, קישורים לפעילויות מרכזיות |
| `Devotionals` | `/Devotionals` | ספריית המדקדקים היומיים, עם אפשרות לפתיחת מדקדק מלא. | חיפוש, סינון, פתיחת מודאל מדקדק, קריאת מדקדק, סימון כהושלם, שיתוף, קישור לפסוק |
| `PrayerLibrary` | `/PrayerLibrary` | ספריית התפילות הציבורית. מאפשרת לקרוא, לסנן ולשמור תפילות. | חיפוש, סינון לפי קטגוריה ושפה, פתיחת תפילה, קישור למקרא, שמירה למועדפים, הסרה ממועדפים, שיתוף |
| `TheologicalInsights` | `/TheologicalInsights` | מציג עיונים תיאולוגיים המשויכים לפסוקים ולספרים. | חיפוש, פתיחת עיון, קריאת קטע, שיתוף ושמירה מקומית |
| `HistoricalInsights` | `/HistoricalInsights` | מציג רקע היסטורי, תרבותי וגאוגרפי לפי פסוק. | חיפוש, פתיחת עיון, שיתוף ושמירה מקומית |
| `VerseOfDay` | `/VerseOfDay` | מציג פסוק יומי מתוך המסד או מהתוכן המובנה. | הצגת הפסוק, קישור למקרא, שיתוף |
| `Plan` | `/Plan` | מציג את מסלול הקריאה בן 30 הימים ואת מצב ההתקדמות. | מעבר לפרק היום, הצגת יום שהושלם, יום נוכחי והבא, חישוב אחוז התקדמות |
| `QA` | `/QA` | ספריית השאלות והתשובות הדו-לשונית, מסודרת לפי אות. | סינון לפי `EN`, `LU` או `BOTH`, אות, נושא וחיפוש; פתיחת תשובה; הצבעה; העתקה; שיתוף; עמודים |
| `Community` | `/Community` | מרכז קהילה המפנה לשלושה מסלולים: גילויים, הוראות חיות וקבוצות דיון. | מעבר לכל מסלול, הצגת פעילות אחרונה וקישורים קהילתיים |
| `CommunityLiveTeaching` | `/CommunityLiveTeaching` | מציג מפגשי הוראה חיה. | צפייה בפרטי מפגש, תאריך, מנחה וקישור הצטרפות |
| `CommunityRevelations` | `/CommunityRevelations` | מאפשר לקוראים לשתף גילוי אישי ולקבל תגובות. | יצירת גילוי, לייק, פתיחת שרשרת תגובות, הוספת תגובה, עיון בפוסטים קיימים |
| `DiscussionGroups` | `/DiscussionGroups` | מאפשר להצטרף לקבוצות לימוד ולשוחח בהן. | בחירת קבוצה, הצטרפות/עזיבה, קריאת הודעות, כתיבת הודעה |
| `Contact` | `/Contact` | טופס יצירת קשר עם הצוות. | מילוי שם, דוא"ל, נושא והודעה, בדיקת תקינות, שליחה, הצגת הצלחה או שגיאה |
| `Privacy` | `/Privacy` | מסביר מה נשמר בשרת, מה נשמר מקומית ומה ניתן למחוק. | קריאה וחזרה לדף הבית |
| `Terms` | `/Terms` | תנאי שימוש, זכויות תוכן והצהרות לגבי תרגומי המקרא. | קריאה וחזרה לדף הבית |

### 2.3 דפי קריאה ולימוד

| עמוד | נתיב לוגי | תפקיד ומטרתו | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| `BibleReader` | `/BibleReader` | מסך בחירת הספר והפרק, עם תצוגת זמינות לאינטרנט ושירותי לימוד נלווים. | חיפוש ספר לפי שם או קיצור, מעבר בין הברית הישנה לחדשה, בחירת ספר, בחירת פרק, פתיחת חומרי לימוד |
| `Chapter` | `/Chapter?book=43&chapter=3&verse=16&lang=en` | מסך הקריאה המרכזי. מציג פרק, פסוקים, הערות, משאלות, תפילות, הפניות צלב, מילים Strong’s וכלי שיתוף. | בחירת פסוק, החלפת גרסת מקרא, סימון, הערה, סימנייה, העתקה, שיתוף, פתיחת אוצר מילים, מעבר למחקר, תפילה והפניות צלב, סגירת תפילה והשלמת קריאה |
| `Dashboard` | `/Dashboard` | לוח אישי לקורא מחובר, המשלב את מסך הבית עם סטטיסטיקות, התקדמות ופעילות אישית. | סטטיסטיקות קריאה, סימונים, הערות והתקנות, רשימת פעילות אחרונה, קיצורי דרך |
| `BibleNotes` | `/BibleNotes` | מרכז כל הסימונים, הסימניות וההערות שנשמרו על פסוקים. | מעבר לפסוק, עריכה או מחיקה, המעבר בין סוגי הסימונים |
| `Journal` | `/Journal` | יומן תפילה אישי עם קטגוריות, ספר ופרק. | יצירת רשומה, עריכה, מחיקה, סינון לפי קטגוריה, קישור לפרק |
| `Offline` | `/Offline` | מרכז הורדות לשימוש ללא חיבור וניהול אחסון מקומי. | הורדת פרקים, פסוקים, מילים Strong’s ואוספים, בדיקת כמויות ונפח, מחיקת נתונים, התקנת גרסה |
| `InstallPrompt` | `/InstallPrompt` | מסביר כיצד להתקין את Pray-Read כאפליקציית מכשיר ומזהה מצב standalone. | התקנה דרך `beforeinstallprompt`, זיהוי iOS/Android/Desktop, הסבר להתקנה ידנית |

### 2.4 דפי חשבון

| עמוד | נתיב לוגי | תפקיד ומטרתו | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| `Login` | `/Login` | כניסת קורא רגיל דרך מערכת האימות של הפלטפורמה. | אימייל וסיסמה, טיפול בשגיאת כניסה, מעבר ללוח המחוונים |
| `Signup` | `/Signup` | הרשמת קורא חדש. | בדיקת אורך סיסמה, התאמת סיסמאות, אישור תנאי שימוש, הרשמה, טיפול בדרישת אימות דוא"ל |
| `ForgotPassword` | `/ForgotPassword` | שליחת בקשת איפוס לקורא ששכח את הסיסמה. | בדיקת כתובת דוא"ל, שליחת בקשה, הודעה שלא נחשפת אם החשבון קיים |
| `ResetPassword` | `/ResetPassword?token=...` | קביעת סיסמה חדשה לאחר אימות קישור האיפוס. | קריאת token, בדיקת התאמת סיסמאות, קיצור של 8 תווים, איפוס |
| `Logout` | `/Logout` | מסך מעבר קצר לפני ניתוק מהמערכת. | ניתוק המשתמש וחזרה אוטומטית לדף הבית |

### 2.5 דפי ניהול

| עמוד | נתיב לוגי | תפקיד ומטרתו | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| `Admin` | `/Admin` | כניסה נפרדת למנהל תוכן. אינה משתמשת בזהות הקורא הרגילה. | כניסה, זיהוי התקנה קיימת, איפוס סיסמה בעזרת מפתח, מעבר אוטומטי ללוח הניהול |
| `AdminDashboard` | `/AdminDashboard` | מרכז ניהול התוכן והתפעול. כולל מדפים לפי תחום ושמירת הפעלת הסשן בזמן עבודה ארוכה. | ניהול ספרים ופרקים, התקנת לוגינדה ו־KJV+, דיבאג כיסוי, ניהול מדקדקים ותפילות, ייבוא JSON, העלאת תוכן לפי ספר, ניהול Q&A, ניהול שירים, עיונים, הודעות, הגדרות ויומן פעילות |

מקטעי `AdminDashboard` אינם נתיבים נפרדים; הם מדפים פנימיים. לכן פעולות כגון “התקנת KJV+”, “ניהול Q&A” או “העלאת JSON” משנות את התוכן של אותו דף ולא את ה־URL.

---

## 3. מפת ניווט לצורך DEBUG

### 3.1 ניווט ציבורי

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת קורא המקרא | `Home` | כרטיס “Bible Reader” | `/BibleReader` |
| פתיחת מדקדקים | `Home` או תפריט ראשי | “Devotionals” | `/Devotionals` |
| פתיחת ספריית תפילות | `Home` או תפריט ראשי | “Prayer Library” | `/PrayerLibrary` |
| פתיחת שירי מקרא | `Home` או תפריט ראשי | “Verse-Songs” | `/VerseSongs` |
| פתיחת Q&A | `Home` או תפריט ראשי | “Q&A” | `/QA` |
| פתיחת קהילה | `Home` או תפריט ראשי | “Community” | `/Community` |
| פתיחת לוח אישי | תפריט ראשי או תפריט משני | “Dashboard” | `/Dashboard` |
| פתיחת עיון תיאולוגי | תפריט משני | “Theological insights” | `/TheologicalInsights` |
| פתיחת עיון היסטורי | תפריט משני | “Historical insights” | `/HistoricalInsights` |
| פתיחת פסוק היום | תפריט משני | “Verse of the day” | `/VerseOfDay` |
| פתיחת תכנית קריאה | תפריט משני | “Reading plan” | `/Plan` |
| פתיחת יומן | תפריט משני | “Prayer journal” | `/Journal` |
| פתיחת מרכז ההורדות | תפריט משני | “Offline centre” | `/Offline` |
| פתיחת הערות מקרא | תפריט משני | “My notes” | `/BibleNotes` |
| חיפוש אוצר מילים | תפריט משני | “Strong’s dictionary” | `/Offline`, עם דגישה למילים |

### 3.2 ניווט בקריאת המקרא

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| חיפוש ספר | `BibleReader` | שדה חיפוש ספרים | רשימת ספרים מסוננת בתוך הדף |
| בחירת מקרא | `BibleReader` | כרטיס ספר | מסך הפרקים של הספר |
| בחירת פרק | `BibleReader` | אריח מספר פרק | `/Chapter?book=...&chapter=...` |
| חיפוש ספר לפי מקור חיצוני | `BibleReader` | תיבת חיפוש | מסלול `BibleReader` → בחירת ספר → בחירת פרק → `Chapter` |
| פתיחת פרק מתוכנית | `Plan` | כרטיס יום | `/Chapter?book=...&chapter=...` |
| בחירת פסוק | `Chapter` | לחיצה על פסוק | פעולות הפסוק נפתחות ליד הפסוק |
| העלאת/הורדת גרסת מקרא | `Chapter` | `VersionPicker` | מעבר לגרסה מותקנת או התקנת גרסה חדשה |
| פתיחת מבוא הפרק | `Chapter` | לשונית “Intro” | פאנל המחקר השמאלי |
| פתיחת עיון פרק | `Chapter` | לשונית “Commentary” | `ChapterSidebar` |
| פתיחת תפילת פרק | `Chapter` | לשונית “Prayer” | `ChapterSidebar` |
| פתיחת הפניות צלב | `Chapter` | לשונית “Cross-refs” | `ChapterSidebar` |
| פתיחת עיון תיאולוגי/היסטורי | `Chapter` | לשונית “Resources” | `ChapterResourcesPanel` |
| מעבר לפסוק מהפניית צלב | `Chapter` | פריט בתוך הפניות הצלב | `VersePopup` או מסלול `Chapter` עם `verse` |
| פתיחת פסוק מתוך עיון | `Chapter` | קישור מקרא בעיון | `VersePopup` |
| פתיחת פסוק מתוך מבוא או מתפילת ספר | `BibleReader` | קישור מקרא | `VersePopup` |
| מעבר לחלק במבנאי הספר | `BibleReader` | כותרת מבנאי | פרק ופסוק מתאימים במסך הפרק |
| פתיחת מילה Strong’s | `Chapter` | קוד כחלחל כחלחל | `StrongsPopup` |
| סימון פסוק | `Chapter` | “Highlight” | `StudyMark` ו־`ReadingActivity` |
| שמירת סימנייה | `Chapter` | “Bookmark” | `StudyMark` |
| כתיבת הערה | `Chapter` | “Note” | `StudyMark` |
| העתקת פסוק | `Chapter` | “Copy” | טקסט מועתק ללוח |
| שיתוף פסוק | `Chapter` | “Share” | `ShareSheet` |
| קריאת תפילת הפסוק | `Chapter` | “Prayer” | `PassagePrayer` |
| פתיחת מסלולי Q&A לפסוק | `Chapter` | לשונית “Q&A for this passage” | תוצאות Q&A מסוננות לפי פרק |
| חזרה לתפילת הפרק מתוך תפילת הסיום | `Chapter` | “Pray again” | פאנל התפילה בצד |
| סגירת התפילה המסומנת | `Chapter` | כפתור סגירה | `ChapterClosingPrayer` |

### 3.3 ניווט קהילה, תפילות ויצירה

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| סינון Q&A לפי שפה | `QA` | `EN`, `LU`, `BOTH` | עדכון הרשימה וה־URL |
| סינון Q&A לפי אות | `QA` | אות בסרגל A - Z | עדכון הרשימה וה־URL |
| סינון Q&A לפי נושא | `QA` | צ`Chip` נושא | עדכון הרשימה וה־URL |
| חיפוש שאלה | `QA` | שדה חיפוש | עדכון ה־URL והתוצאות |
| פתיחת תשובה | `QA` | כפתור הרחבה | תשובה מלאה בתוך הכרטיס |
| הצבעה על תשובה | `QA` | לייק כן/לא | מצב מקומי ב־`pr_qa_votes` |
| העתקת תשובה | `QA` | “Copy” | טקסט מועתק |
| שיתוף תשובה | `QA` | “Share” | רשת חברתית או Clipboard |
| שמירת תפילה | `PrayerLibrary` | סמל סימנייה | `PrayerSaved` |
| הסרת תפילה מהמועדפים | `PrayerLibrary` | סמל סימנייה פעיל | מחיקת רשומת `PrayerSaved` |
| שיתוף עיון | `InsightsBoard` | `ShareRow` | רשת חברתית או Clipboard |
| שמירת עיון | `InsightsBoard` | Save | `localStorage` ב־`STORAGE_KEYS.savedInsights` |
| יצירת גילוי | `CommunityRevelations` | טופס הגילוי | יצירת `Revelation` |
| לייק על גילוי | `CommunityRevelations` | כפתור הלב | עדכון מונים ו־`localLikes` |
| פתיחת תגובות | `CommunityRevelations` | כפתור “comments” | `CommentThread` |
| מעבר להוראה חיה | `CommunityLiveTeaching` | כרטיס מפגש | קישור הצטרפות |
| הצטרפות לקבוצה | `DiscussionGroups` | “Join group” | `localStorage` ב־`STORAGE_KEYS.joinedGroups` |
| בחירת קבוצה | `DiscussionGroups` | כרטיס קבוצה | `ThreadMessages` |
| שליחת הודעה | `DiscussionGroups` | טקסט + כפתור שליחה | יצירת `DiscussionThread` |

### 3.4 ניווט אישי, התקנה ומערכת

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| כניסת קורא | דף כלשהו | “Sign in” | `/Login` |
| הרשמת קורא | דף כלשהו | “Create account” | `/Signup` |
| שכחתי סיסמה | `Login` | “Forgot password?” | `/ForgotPassword` |
| ניתוק | תפריט משתמש | “Log out” | `/Logout` ולאחר מכן `/Home` |
| התקנת PWA | `Home` או `InstallPrompt` | “Install” | התקנת standalone דרך הדפדפן |
| הורדת פרקים לאופליין | `Offline` | “Download” | IndexedDB |
| מחיקת הורדות | `Offline` | “Clear” / “Delete” | מחיקת stores מ־`prayread-offline` |
| התקנת גרסת מקרא | `Offline` או `VersionPicker` | “Install” | רשימת הגרסאות המותקנות |
| פתיחת הערות | `Dashboard` | “My notes” | `/BibleNotes` |
| מעבר ליומן עם מיקום מקרא | `Chapter` | קישור יומן עם `book` ו־`chapter` | `/Journal?book=...&chapter=...` |

### 3.5 ניווט ניהול

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| כניסת מנהל | `/Admin` | טופס כניסה | `/AdminDashboard` |
| איפוס סיסמת מנהל | `/Admin` | “Reset password” | מודאל איפוס |
| פתיחת מדף ניהול | `AdminDashboard` | כרטיס מדף | מדף פנימי |
| בדיקת כיסוי KJV+ | `AdminDashboard` | “Library report” | `LibraryReport` |
| התקנת פרקי לוגינדה | `AdminDashboard` | מדף “Luganda Bible” | `LugandaInstaller` |
| התקנת KJV+ | `AdminDashboard` | מדף “KJV+ with Strong’s” | `KjvPlusInstaller` |
| התקנת מילון Strong’s | `KjvPlusInstaller` | פעולת התקנת מילון | `kjvInstall` / `strongsDefinition` |
| פתיחת רשומת תוכן | `AdminDashboard` → “All content” | בחירת collection ורשומה | `RecordEditor` |
| יצירת רשומה | `CollectionsPanel` | “Add” | `RecordEditor` במצב חדש |
| עריכת רשומה | `CollectionsPanel` | סמל עריכה | `RecordEditor` במצב עריכה |
| מחיקת רשומה | `CollectionsPanel` | סמל פח | `ConfirmDialog` |
| ייבוא JSON כללי | `AdminDashboard` | “JSON import” | `JsonImportPanel` |
| הורדת תבנית ייבוא | `JsonImportPanel` | “Download template” | קובץ JSON |
| העלאת קובץ ייבוא | `JsonImportPanel` | בחירת קובץ | תצוגה מקדימה ואימות |
| ביצוע ייבוא | `JsonImportPanel` | “Import” | upsert של הישויות |
| ייבוא תפילות והפניות צלב לפי ספר | `AdminDashboard` | “Prayer & Cross-references” | `PrayerCrossRefImport` |
| העלאת קובץ ספר | `PrayerCrossRefImport` | בחירת קובץ | תצוגה מקדימה לפי פרק ופסוק |
| עריכת תוכן המתפילות | `AdminDashboard` | “Prayer passages” | `PassagesPanel` |
| מעבר בין אוספי תפילות | `PassagesPanel` | לשוניות | טבלה לפי collection |
| עריכת ספריית התפילות | `AdminDashboard` | “Prayer library” | `PrayersPanel` |
| פתיחת מדף ה־Q&A | `AdminDashboard` | “Q&A” | `QaPanel` |
| הוספת שאלה | `QaQuestionsPanel` | “Add a question” | `QaItemForm` |
| הוספת נושא | `QaTopicsPanel` | “Add a topic” | `QaTopicForm` |
| מחיקת נושא עם שאלות | `QaTopicsPanel` | סמל פח | חלונית “העבר שאלות לנושא אחר” |
| ייבוא Q&A | `QaPanel` | “Bulk upload” | `QaBulkImport` |
| ניהול שירי מקרא | `AdminDashboard` | “Verse-Songs” | `VerseSongsPanel` |
| הוספת שיר | `VerseSongsPanel` | “Add song” | `VerseSongForm` |
| הוספת סדרה | `VerseSongsPanel` | “Add series” | `VerseSongSeriesForm` |
| ייבוא מרובה של שירים | `VerseSongsPanel` | “Bulk upload” | `VerseSongBulkImport` |

---

## 4. מבנה הקבצים

### 4.1 עץ כללי

```text
components/
  admin/
  common/
  community/
  dashboard/
  home/
  insight/
  journal/
  layout/
  plan/
  qa/
  read/
  song/

pages/
lib/
entities/
functions/
cron/
public/
__generated/
__trash/
__url_fetch/
Layout.jsx
```

### 4.2 רכיבי ניהול  -  `components/admin/`

| קובץ | תפקיד ופלט |
|---|---|
| `ChapterCoverage.jsx` | מציג כיסוי פרקים לפי ספר. דוחס רשימות פרקים חסרים או פגומים לטווחים כגון `2-5, 9, 12`. |
| `CollectionsPanel.jsx` | מנהל גמיש של רשומות בכל collection המוגדר ב־`adminCollections.js`. תומך בחיפוש, הוספה, עריכה ומחיקה. |
| `ConfirmDialog.jsx` | מודאל אישור לפעולות הרסניות, בעיקר מחיקה. מציג אזהרה, כותרת, הודעה ומצב עסוק. |
| `CrossRefEditor.jsx` | עורך הפניות מקרא לצורת chips. מוסיף בנפרד, מסיר ושומר רשימה מאוחדת. |
| `JsonImportPanel.jsx` | ייבוא JSON גמיש לכמה collections, עם aliases, תבנית, אימות, תצוגה מקדימה ו־upsert. |
| `KjvPlusInstaller.jsx` | מתקין ומציג כיסוי KJV+ עם מספרי Strong’s. מנהל גם התקנת מילון והפעלת דוח ביקורת. |
| `LibraryReport.jsx` | מציג דוח קריאה מן השרת על כיסוי תרגומים, פרקים שבורים, הבדלי מספר פסוקים וכיסוי Strong’s. |
| `LugandaInstaller.jsx` | מתקין פרקי הביבליה בלוגינדה ומציג את הכיסוי והפרקים החסרים. |
| `PassagesPanel.jsx` | מנהל תפילות פרק, הפניות צלב, מבואי פרק ומבואי ספר באמצעות ארבע לשוניות. |
| `PrayerCrossRefImport.jsx` | מייבא קובץ תפילות/הפניות צלב של ספר אחד, מציג השוואה למצב המותקן ומאפשר להשלים חוסרים. |
| `PrayersPanel.jsx` | מנהל ספריית התפילות במצב library או passages, עם סינון לפי ספר, פרק ופסוק. |
| `QaAdminList.jsx` | רשימת ניהול Q&A עם סינון לפי נושא, אות וחיפוש, ובחירה מרובה. |
| `QaBulkImport.jsx` | מאמת ומייבא קובצי Q&A בפורמט `pray-read-qa-v1`; יוצר נושאים חדשים אם נבחר לעשות זאת. |
| `QaItemForm.jsx` | טופס דו-לשוני לשאלה ותשובה. אורך האות מחושב מהשאלה ולא נשמר. |
| `QaPanel.jsx` | מדף Q&A מרכזי: טעינת נושאים ושאלות, שמירה, מחיקה והעברת שאלות בין נושאים. |
| `QaQuestionsPanel.jsx` | מחבר בין רשימת השאלות, טופס השאלה ואישור המחיקה. |
| `QaTopicForm.jsx` | טופס לנושא Q&A דו-לשוני. |
| `QaTopicsPanel.jsx` | מנהל נושאים. מונע מחיקת נושא שיש לו שאלות עד להעברתן לנושא אחר. |
| `RecordEditor.jsx` | טופס גנרי להוספת או עריכת רשומה. שדות הטופס נוצרים מתוך מילון ה־collections. |
| `VerseSongBulkImport.jsx` | מאמת ומייבא רשימת שירי מקרא בפורמט `pray-read-verse-songs-v1`. |
| `VerseSongForm.jsx` | טופס שיר מקרא, כולל העלאת אודיו ותמונת כיסוי, בדיקת פרק מול הספר והגדרת שפה/גרסה. |
| `VerseSongSeriesForm.jsx` | טופס סדרת שירים. שומר את שם הסדרה בדיוק כפי שהמנהל הקליד. |
| `VerseSongsPanel.jsx` | מדף ניהול שירים וסדרות, עם סינון, רשימה, טפסים וייבוא מרובה. |

### 4.3 רכיבים משותפים  -  `components/common/`

| קובץ | תפקיד ופלט |
|---|---|
| `EmptyState.jsx` | מצב ריק אחיד עם אייקון, כותרת, תיאור ופעולה אופציונלית. |
| `Modal.jsx` | מודאל גנרי. סוגר בלחיצה על הרקע או ב־Escape, נועל גלילת גוף ומחזיר את מצב הגלילה לאחר סגירה. |
| `PageHeader.jsx` | כותרת אחידה לדפים, עם תמונת רקע, overlay, eyebrow, כותרת, טקסט ופעולות. |
| `Pagination.jsx` | מנגנון עימוד קומפקטי עם דפים רצופים, דפי קצה ואליפסים. |
| `ShareRow.jsx` | שורת כפתורי שיתוף לפרסומים, וואטסאפ, טלגרם, לינקדאין, אינסטגרם והעתקה. |
| `Spinner.jsx` | מצב טעינה גנרי עם `role="status"` ו־`aria-live`. |

### 4.4 רכיבי קהילה, דשבורד, בית, עיונים, יומן, תכנית ו־Q&A

| קובץ | תפקיד ופלט |
|---|---|
| `components/community/CommentThread.jsx` | מציג תגובות לגילוי ומאפשר למחובר להוסיף תגובה. |
| `components/community/RevelationCard.jsx` | כרטיס גילוי עם מחבר, פסוק, כותרת, גוף, לייק ומספר תגובות. |
| `components/community/RevelationForm.jsx` | יוצר גילוי; מציג הנחיה למשתמש לא מחובר ומנקה את הטופס לאחר הצלחה. |
| `components/community/ThreadMessages.jsx` | מציג ושולח הודעות בקבוצת דיון. |
| `components/dashboard/ActivityFeed.jsx` | מציג עד 12 פעילויות קריאה אחרונות של המשתמש, עם אייקון, צבע וזמן יחסי. |
| `components/home/StatCard.jsx` | כרטיס מספר סטטיסטי עם אייקון, ערך, תווית ורמז. |
| `components/insight/InsightsBoard.jsx` | לוח עיונים מסונן, הממזג רשומות חיות עם התוכן המובנה ומאפשר פתיחה, שיתוף ושמירה. |
| `components/journal/JournalCard.jsx` | כרטיס רשומת יומן עם קטגוריה, תאריך, ספר/פרק, עריכה ומחיקה. |
| `components/journal/JournalForm.jsx` | טופס רשומת יומן עם כותרת, גוף, קטגוריה, ספר ופרק. |
| `components/plan/PlanRow.jsx` | כרטיס יום בתכנית הקריאה, כולל סטטוס completed/current/upcoming וקישור לפרק. |
| `components/qa/QaCard.jsx` | מציג שאלה, נושא, מקרא, תשובה מקומית, הצבעה, העתקה ושיתוף. התשובה סגורה עד ללחיצה. |
| `components/qa/QaFilters.jsx` | מסנני שפה, חיפוש ונושא בספריית Q&A. |
| `components/qa/QaLetterBar.jsx` | סרגל אותיות נגדר לבחירת אות; תומך בגלילה, חצים ומירכוז האות הנבחרת. |

### 4.5 רכיבי מעטפת  -  `components/layout/`

| קובץ | תפקיד ופלט |
|---|---|
| `AppHeader.jsx` | כותרת אתר רספונסיבית עם לוגו, ניווט ראשי ומשני, תפריט משתמש, התקנה, התנתקות וניווט נייד. |
| `AppFooter.jsx` | כותרת תחתונה, קישורים מהירים, מידע מותג וקישור לתרומה. |
| `GlobalPlayer.jsx` | נגן אודיו גלובלי לשירי מקרא: play/pause, קפיצה, seek, עוצמה, מהירות, shuffle, repeat, playlist, הרחבה, מינימום ושגיאה. |
| `PwaHead.jsx` | מוסיף ל־`document.head` מטא־tags, manifest, favicon ו־Apple icon, ורושם את ה־service worker. |

### 4.6 רכיבי קריאה  -  `components/read/`

| קובץ | תפקיד ופלט |
|---|---|
| `AnnotatedText.jsx` | מציג טקסט הניתן לסימון והדגשה. מחלק את הטקסט למקטעים לפי היסטי annotations ומאפשר לבחור צבע או קו תחתון. |
| `BookGrid.jsx` | רשת 66 הספרים, מחולקת לברית הישנה והחדשה, עם חיפוש באנגלית ובלוגינדה. |
| `BookIntro.jsx` | מבוא הספר; מציג מבוא מיובא או מובנה, עובדות, פסוקי מפתח ואפשרות סימון. |
| `BookOutline.jsx` | מבנאי הספר; כל חלוגת מאפשרת מעבר לפרק ופסוק תוך השארת הבחירה מסומנת. |
| `BookPrayerPanel.jsx` | תפילת הספר, עם תוכן מיובא או מובנה, החלפת אנגלית/לוגינדה והפניות מקרא. |
| `BookSidebar.jsx` | הלשונית השמאלית של מסך בחירת הספר: מבוא, מבנאי ותפילה. |
| `BookStudyResources.jsx` | חלונית מחקר לכל ספר עם שלושה סוגי תוכן: commentary, theological, historical, כולל עימוד. |
| `ChapterClosingPrayer.jsx` | תפילת הסיום המלאה לאחר הפסוקים, כולל אנגלית/לוגינדה, שיתוף, סימון וחזרה לתפילה. |
| `ChapterGrid.jsx` | רשת פרקים של הספר. כל פרק הוא קישור ישיר למסך `Chapter`. |
| `ChapterReaderPane.jsx` | מעטפת עמודת הקריאה, לשוניות ותפריט מחקר רספונסיבי. |
| `ChapterResourcesPanel.jsx` | מציג עיון תיאולוגי והיסטורי לפרק, עם נפילה לעיון ברמת הספר. |
| `ChapterSelector.jsx` | מסך בחירת הפרק בתוך ספר, המחבר את מבנאי הספר, סימונים, popup מקרא ומשאבי לימוד. |
| `ChapterSidebar.jsx` | פאנל הלימוד של פרק: מבוא, עיון, תפילה והפניות צלב. |
| `CrossRefList.jsx` | רשימת הפניות צלב של פסוק, כולל טקסט והערה, ונפילה להפניות אחרות באותו פרק. |
| `CrossRefScripture.jsx` | מציג את טקסט הפסוק אליו מפנה הפניית צלב; אם הוא לא נשמר, מוריד אותו ממקור המקרא. |
| `FloatingVerse.jsx` | חלון צף קטן להצגת פסוק ופתיחתו במקרא. |
| `PassagePrayer.jsx` | מוצא ומציג תפילה המתאימה לפסוק או לטווח פסוקים, ומאפשר לעבור בין שפות. |
| `PassageTabs.jsx` | לשוניות עיון, העיון התיאולוגי, העיון ההיסטורי ו־Q&A עבור הפסוק הנוכחי. |
| `ShareSheet.jsx` | מודאל שיתוף מלא הכולל פסוק בשתי השפות, תפילה, הפניות צלב וקישור. |
| `StrongsPopup.jsx` | מציג משמעות מילה Strong’s ושומר העתקה מקומית במסד לאחר הצלחה. |
| `StrongsText.jsx` | מפרק קודי `(G2424)` או `(H436)` מתוך הפסוק ומציגם כמספרי עילית. |
| `VerseActionBar.jsx` | סרגל הפעולות של פסוק: תפילה, הפניות, עיון, סימון, העתקה, שיתוף, סימנייה והערה. |
| `VerseCrossRefs.jsx` | מציג את הפניות הצלב ואת מלעיליהן תחת פסוק נבחר. |
| `VerseList.jsx` | רשימת פסוקים פשוטה לשימוש במסכי קריאה קלים. |
| `VersePopup.jsx` | טעינת פרק והצגת פסוק או טווח פסוקים בתוך חלון מקומי. |
| `VersionPicker.jsx` | מציג גרסאות מותקנות, מאפשר להתקין או להסיר גרסה ומעביר גרסה פעילה. |

### 4.7 רכיבי שירי מקרא  -  `components/song/`

| קובץ | תפקיד ופלט |
|---|---|
| `SeriesCard.jsx` | כרטיס סדרת שירים עם כיסוי, שם, תיאור ומספר שירים. |
| `SongCard.jsx` | כרטיס שיר כהפעלה, עם כיסוי, מטא־נתונים, שפה, play/pause, הורדה ושיתוף. |
| `SongFilters.jsx` | חיפוש וסינון לפי סדרה וספר. |
| `SongShareSheet.jsx` | מודאל שיתוף הכולל את טקסט השיר והקישור. |

### 4.8 דפים  -  `pages/`

| קובץ | תפקיד |
|---|---|
| `pages/About.jsx` | מסך “אודות” עם hero והסבר על המוצר. |
| `pages/Admin.jsx` | מסך כניסת מנהל ואיפוס סיסמה. |
| `pages/AdminDashboard.jsx` | מרכז הניהול, כולל מדפי תוכן, התקנות, ייבוא ופעולות מערכת. |
| `pages/BibleNotes.jsx` | מרכז סימוני הפסוקים, הסימניות וההערות. |
| `pages/BibleReader.jsx` | מסך בחירת הספר והפרק. |
| `pages/Chapter.jsx` | מסך הקריאה המרכזי ומנהל הפעולות של פסוק. |
| `pages/Community.jsx` | מרכז קהילה. |
| `pages/CommunityLiveTeaching.jsx` | מפגשי הוראה חיה. |
| `pages/CommunityRevelations.jsx` | גילויים, לייקים ותגובות. |
| `pages/Contact.jsx` | טופס יצירת קשר. |
| `pages/Dashboard.jsx` | לוח אישי לקורא. |
| `pages/Devotionals.jsx` | ספריית מדקדקים יומיים. |
| `pages/DiscussionGroups.jsx` | קבוצות דיון והודעות. |
| `pages/ForgotPassword.jsx` | בקשת איפוס סיסמה. |
| `pages/HistoricalInsights.jsx` | עיונים היסטוריים. |
| `pages/Home.jsx` | דף הבית והגילוי. |
| `pages/InstallPrompt.jsx` | התקנת האפליקציה כ־PWA. |
| `pages/Journal.jsx` | יומן התפילה. |
| `pages/Login.jsx` | כניסת קורא. |
| `pages/Logout.jsx` | ניתוק וחזרה לדף הבית. |
| `pages/Offline.jsx` | מרכז הורדות וניהול מטמון מקומי. |
| `pages/Plan.jsx` | תכנית הקריאה. |
| `pages/PrayerLibrary.jsx` | ספריית התפילות. |
| `pages/Privacy.jsx` | מדיניות פרטיות. |
| `pages/QA.jsx` | ספריית Q&A. |
| `pages/ResetPassword.jsx` | קביעת סיסמה חדשה. |
| `pages/Signup.jsx` | הרשמת קורא. |
| `pages/Terms.jsx` | תנאי שימוש. |
| `pages/TheologicalInsights.jsx` | עיונים תיאולוגיים. |
| `pages/VerseOfDay.jsx` | פסוק היום. |
| `pages/VerseSongSeries.jsx` | אינדקס הסדרות או שירי סדרה מסוימת לפי `series`. |
| `pages/VerseSongs.jsx` | אינדקס כל שירי המקרא. |

### 4.9 שירותי לקוח  -  `lib/`

| קובץ | תפקיד |
|---|---|
| `activity.js` | רישום פעילות קריאה עבור המשתמש, ללא קשירה כשל להפעלת המסך הראשי. |
| `adminCollections.js` | מילון כל ה־collections הניהוליים, שדותיהם, סוגי שדות, יצירת רשומה ריקה וכותרת תצוגה. |
| `adminDirect.js` | מסלול ניהול ישיר מהדפדפן דרך entity SDK, כגיבוי לפונקציית השרת. |
| `adminSession.js` | התחברות מנהל, בדיקת סשן, חידוש, התנתקות, איפוס סיסמה ו־`callAdminData`. |
| `app-params.js` | קריאת מזהה האפליקציה וה־app token בזמן אמת מ־`localStorage`. |
| `AuthContext.jsx` | מספק את מצב המשתמש, `isAuthenticated`, טעינת אימות, התנתקות והפניה להתחברות. |
| `bibleApi.js` | טעינת פרקים, בחירת מקור, זיהוי סימוני Strong’s, שמירה לאופליין ובדיקת קריאות. |
| `bibleBooks.js` | נתוני 66 הספרים: מספר, שם, קיצור, שם לוגינדה ומספר פרקים. |
| `bookGuides.js` | מבוא ומבנאי מובנים לכל ספר. |
| `bookImport.js` | זיהוי קובצי ספר, הרחבתם ל־prayers, cross-references, chapter intros ו־book intro. |
| `bookIntro.js` | טעינה ונרמול מבוא הספר ותפילת הסיום. |
| `bookPrayers.js` | תפילת גיבוי לכל ספר, עם הפניות `[[Book 1:1]]`. |
| `bookStudyContent.js` | עיונים תיאולוגיים והיסטוריים מובנים לכל ספר. |
| `brandCss.js` | מערכת העיצוב המרכזית ומשתני CSS של ivory, emerald ו־gold. |
| `chapterIntros.js` | טעינה, נרמול ומטמון של מבואי פרקים. |
| `chapterStudy.js` | בניית מבוא, עיון, תפילה ופסוקי מפתח לרמת פרק. |
| `contentApi.js` | מיפוי collection ציבורי ל־entity SDK, כולל פעולות קהילה. |
| `crossRefs.js` | הפניות צלב מובנות למקראים נפוצים. |
| `format.js` | עיצוב תאריכים, משכלי, רשימות, IDs ו־`safeText`. |
| `keyPassages.js` | פסוקי מפתח לכל ספר. |
| `luganda.js` | פירוק ועיצוב מדקדק לוגינדה למבנה קריאה. |
| `offlineDb.js` | מעטפת IndexedDB, stores, מפתחות, מיגרציות ופעולות cache. |
| `planData.js` | תכנית הקריאה המובנת בן 30 הימים. |
| `player.jsx` | Provider גלובלי לנגן האודיו, כולל queue ושליטה בהשמעה. |
| `prayerImport.js` | פורמטי ייבוא, אימות, טעינת קבצים וייבוא תפילות/הפניות/מבואים. |
| `prayerPassages.js` | טעינה ונרמול של תפילות פרק והפניות צלב, כולל בחירה לפי פסוק. |
| `qaLibrary.js` | טעינת Q&A, חישוב אות, סינון, מיון ונתוני fallback. |
| `reading.js` | תאריכי ISO, הזזת תאריך, ימי שבוע, רצף ימים ועיצוב. |
| `readings.js` | רישום התקדמות קריאה וסגירת ימי תכנית. |
| `scriptureRefs.js` | פענוח, נרמול ויצירת קישורים למקרא. |
| `seedContent.js` | תוכן seed למדקדקים, תפילות, Q&A, עיונים, שירים וקהילה. |
| `sha256.js` | מימוש SHA-256 ב־JavaScript ללא תלות ב־Web Crypto. |
| `share.js` | בניית טקסט וקישורי שיתוף, Clipboard ו־Web Share. |
| `strongs.js` | נרמול קודי Strong’s, קידומת שפה וקישורי מילון. |
| `strongsOffline.js` | קריאה וכתיבת הגדרות Strong’s ב־IndexedDB. |
| `studyAnnotations.js` | שמירת, טעינה, מיזוג ומחיקת הדגשות וקווי תחתון. |
| `textSelection.js` | זיהוי אם לחיצה התרחשה בתוך טקסט שנבחר, כדי לא לפתוח הפניה בטעות. |
| `themeContext.jsx` | טעינת `SiteSettings`, חישוב גוונים נגזרים והחלתת הערכות המותג. |
| `theme.js` | קבועי המותג, צבעים, תמונות, קישורי לוגו ונתיבי מדיה. |
| `verseSongs.js` | נרמול סדרות/שירים, בניית אינדקס ו־queue, סינון, מטא־נתונים ושיתוף. |
| `versions.js` | מרשם גרסאות המקרא, התקנה, הסרה והגרסה הפעילה. |

### 4.10 פונקציות שרת ו־cron

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | כניסת מנהל, אימות סיסמה מלוחה, בניית סשן חתום, איפוס וניהול סשן. |
| `functions/adminContent.js` | API ניהול תוכן מוגנת בסשן; קוראת וכותבת collections מורשים. |
| `functions/bibleChapter.js` | מאחדת מקורות מקרא ציבוריים, מנקה HTML ומייצרת פרק מובנה. |
| `functions/content.js` | API ציבורי לקריאת collections וקבלת הגשות ציבוריות. |
| `functions/kjvInstall.js` | מתקין פרקי KJV+ עם Strong’s, בהתאם לפרקים החסרים בפועל. |
| `functions/lugandaInstall.js` | מתקין פרקי לוגינדה בהתאם לפרקים החסרים בפועל. |
| `functions/scriptureAudit.js` | ביקורת קריאה בלבד: כיסוי, פרקים פגומים, הבדלי מספר פסוקים וכיסוי Strong’s. |
| `functions/strongsDefinition.js` | מביא הגדרות מילים Strong’s ממקורות ציבוריים ושומר אותן כמטמון. |
| `cron/scriptureInstall.js` | משימת cron בתדירות שעתיות; משלים פרקי לוגינדה ו־KJV+ ומפסיק כאשר אין התקדמות. |

### 4.11 קבצי שורש ו־PWA

| קובץ | תפקיד |
|---|---|
| `Layout.jsx` | מעטפת האפליקציה: `AuthProvider`, `ThemeProvider`, `PlayerProvider`, כותרת, תוכן, כותרת תחתונה ונגן. |
| `__generated/tailwind.css` | CSS מחושל שנוצר אוטומטית עבור utility classes של Tailwind. אין לערוך ידנית. |
| `public/sw.js` | Service worker: cache-first עבור app shell ותמונות, network-first עבור שאר הבקשות. |
| `public/manifest.json` | הגדרת PWA: שם, קיצור, start URL, צבעים, orientation ואייקונים. |

### 4.12 נכסים סטטיים

הנכסים הבינוניים מאוחסנים כ־data URL או קבצי מדיה גדולים. תפקידם הוא תמונות מותג, רקעים, אייקונים, תבנית JSON, מסמכי עבודה וארכיון קוד. אין להתייחס אליהם כאל קוד מתפקד.

נכסים מרכזיים בעלי תפקיד ברור:

- `public/assets/media-library/4345fa1c4c79_icon-512x512.png`  -  לוגו/אייקון האפליקציה.
- `public/assets/media-library/b8660c2286d0_PrayRead-logo-2.png`  -  לוגו נוסף.
- `public/assets/media-library/ee6ae196bbbc_favicon.ico`  -  favicon.
- `public/assets/media-library/0dbaf742d3ba_Prayer-Crossrefs-Template.json`  -  תבנית הייבוא הציבורית.
- `public/assets/media-library/f830b722d892_OBADIAH-PRAY-READ-BULK-IMPORT.json`  -  קובץ ייבוא לדוגמה של ספר.
- `public/assets/media-library/5754e40e4a9f_Finestructure-Prompt-Prayer-CrossRefs-Bulk-Import.md`  -  מדריך ייבוא.
- `public/assets/media-library/7a37aadfffbf_Finestructure-Prompt-Verse-Songs-Page-Clone-Admin-Upload.md`  -  מדריך העלאת שירים.
- `public/assets/media-library/e356dc244e71_Finestructure-Prompt-QA-Page-Front-Design-Admin-Alphabetical-Bilingual.md`  -  מדריך Q&A.
- `public/assets/media-library/18b06dbedaf4_Finestructure-Prompt-FIX-CrossRefs-All-Prayers-Psalms-1Chronicles.pdf`  -  מסמך עבודה/הוראות להפניות צלב.
- `public/assets/media-library/9865967db356_Pray-Read-Bible-Prompt-3-Bible-Reader-Rebuild.pdf`  -  מסמך עבודה לקורא.
- `public/assets/media-library/f438ed2a3a0_Pray-Read-Bible-Master-Prompt-For-Finestructure-Ai.pdf`  -  מסמך master prompt.
- `public/assets/media-library/b50e6c213bb8_pray-read-pneuma-main-3.zip`  -  ארכיון מקור/הפצה קודמת.

קבצי תמונה גנריים `*_image.png` ו־`generated_*.png` משמשים נכסי עיצוב, רקעים או חומרי עיצוב. יש לאתר את השימוש המדויק באמצעות חיפוש ב־`theme.js`, `brandCss.js` ובקבצי ה־CSS לפני שינוי או מחיקה.

### 4.13 קבצים שאינם חלק מהייצור

- `__trash/`  -  כולל רכיבים ישנים בסגנון Tailwind, דפי `Read` ישן, דפי smoke test ופרובות hash/session. אין לייבא אותם למסלול הפעיל.
- `__url_fetch/`  -  snapshot של תוצאות fetch ומחקר מקורות חיצוניים. אין להפיצ אותו כחלק מה־frontend או להתייחס אליו כמקור אמת בזמן ריצה.
- `__generated/tailwind.css`  -  קובץ שנוצר אוטומטית; יש לשנות את מקור ה־Tailwind ולא את הפלט.

---

## 5. מודל הנתונים  -  Entities

> חלק מהשדות המלאים חתוכים בקוד שסופק. הטבלה מתמקדת בשדות המרכזיים המשמשים במסכים, בייבוא, בהתקנות ובהרשאות.

### 5.1 תוכן דובר וניהול

| Entity | מטרתה | שדות מרכזיים וקשרים |
|---|---|---|
| `ActivityLog` | יומן פעילות בממשק הניהול. | `actor`, `action`, `section`, `detail`; אין קשר חיצוני חובה. |
| `AdminAccount` | חשבון מנהל תוכן ומפתחות אימות. | `email`, `password_hash`, `salt`, `secret`, `session_version`, `updated_date`; יש לראות בו כרשומת singleton. |
| `ContactMessage` | הודעות מטופס יצירת קשר. | `name`, `email`, `subject`, `message`, `is_read`, `reply`; יצירה ציבורית, קריאה ועדכון למנהל. |
| `SiteSettings` | הגדרות גלובליות בצורת key/value. | `setting_key`, `setting_value`; `themeContext` קורא מכאן צבעים, שם אתר וקישור תרומה. |

### 5.2 תוכן יומי ותפילה

| Entity | מטרתה | שדות מרכזיים וקשרים |
|---|---|---|
| `Devotional` | מדקדק יומי דו-לשוני. | `code`, כותרות, מקרא, גוף, קשרים וקריאות נוספות, תמונת כיסוי; בפורמט הייבוא גם `day` ו־`category`. `code` משמש מפתח טבעי. |
| `DevotionalProgress` | סימון מדקדק כהושלם עבור משתמש. | `owner_email`, `devotional_code`, `completed_date`; קשר ל־`Devotional.code`. |
| `Prayer` | תפילה מספריית התפילות. | `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref`, `cross_refs`; ה־cross refs נשמרים כמחרוזת בצד ה־entity. |
| `PrayerSaved` | תפילה שנשמרה למשתמש. | `owner_email`, `prayer_title`; קשר ל־`Prayer` לפי כותרת, ולכן שינוי כותרת עלול לנתק את השמירה. |
| `PrayerPassage` | תפילה המשויכת לפרק, פסוק או טווח. | `book_number`, `book_name`, `chapter`, `verse`, `verse_end`, כותרות ותפילות באנגלית/לוגינדה; `verse=0` מייצג את כל הפרק. |
| `BookIntro` | מבוא ספר ותפילת סיום לספר. | `book_number`, `book_name`, כותרות, מבואים ותפילות סיום בשתי השפות; מקור מקומי ל־`BookIntro.js`. |
| `ChapterIntro` | מבוא לפרק מסוים. | `book_number`, `book_name`, `chapter`, כותרת, מבוא בשתי השפות ו־`source`. |

### 5.3 מקרא ואוצר מילים

| Entity | מטרתה | שדות מרכזיים וקשרים |
|---|---|---|
| `BibleVerse` | ייצוג נורמלי של פסוק באנגלית ובלוגינדה. | `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu`; קיים גם כ־collection בייבוא הכללי. |
| `KjvPlusChapter` | פרק KJV+ אחד עם קודי Strong’s. | `book_number`, `book`, `chapter`, `verse_count`, `verses` כ־JSON; המקור העיקרי להתקנת KJV+. |
| `LugandaChapter` | פרק לוגינדה אחד. | `book_number`, `book`, `chapter`, `verse_count`, `verses` כ־JSON; המקור העיקרי להתקנת לוגינדה. |
| `StrongEntry` | מטמון הגדרה למספר Strong’s. | `code`, `language`, מילה מקורית, תעתיק, הגייה, חלק דיבר, שורש, הגדרה ו־`source`; הקוד הוא המפתח הטבעי. |
| `StudyAnnotation` | הדגשה או קו תחתון במבוא, מבנאי, תפילה או פסוק. | `owner_email`, `book_number`, `book`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset`; ההיסטים תלויים במיקום הטקסט. |
| `StudyMark` | סימון, סימנייה או הערה ברמת פסוק. | `owner_email`, `mark_type`, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text`. |

### 5.4 לימוד, עיונים ו־Q&A

| Entity | מטרתה | שדות מרכזיים וקשרים |
|---|---|---|
| `Commentary` | הערת עיון לפרק. | `book`, `chapter`, `title`, `body_en`, `body_lu`; קשר סמנטי לספר ולפרק. |
| `Insight` | עיון תיאולוגי או היסטורי. | `kind`, `title`, `passage`, `excerpt`, `body`, `share_count`; `kind` מפריד בין theological ל־historical. |
| `QATopic` | נושא בספריית Q&A. | `name_en`, `name_lu`, `description_en`, `description_lu`, `active`; קשר ל־`QAItem`. |
| `QAItem` | שאלה ותשובה מוכנות בשתי השפות. | `topic_en`, `topic_lu`, `topic_id`, `scripture_ref`, `question_en`, `question_lu`, `answer_en`, `answer_lu`; בנוסף שדות תפעוליים כגון `tags`, `featured`, `active`, `helpful_count` והצבעות. |
| `QAEntry` | שאלה שנשלחה על ידי קורא לטיפול פסטורלי. | `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email`; שונה מ־`QAItem`, שהוא תוכן ספרייה מוכן. |
| `ReadingPlan` | יום בתכנית הקריאה. | `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture`; קשר ל־`Reading.plan_day`. |
| `Reading` | התקדמות קריאה וסיכום אישי. | `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses`. |
| `ReadingActivity` | אירוע פעילות קריאה. | `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse`; `activity_type` כולל chapter visit, highlight, bookmark, note, prayer ו־devotional. |
| `JournalEntry` | רשומת יומן תפילה. | `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood`; קשר סמנטי לספר/פרק. |

### 5.5 קהילה ושירי מקרא

| Entity | מטרתה | שדות מרכזיים וקשרים |
|---|---|---|
| `DiscussionGroup` | קבוצת לימוד. | `name`, `description`, `schedule`, `member_count`; הודעות הקבוצה מקושרות לפי `group_name`. |
| `DiscussionThread` | הודעה בקבוצת דיון. | `group_name`, `owner_email`, `author_name`, `title`, `body`; קשר ל־`DiscussionGroup` הוא טקסטואלי, לא מפתח זר. |
| `LiveSession` | מפגש הוראה חיה. | `title`, `session_date`, `host`, `join_link`, `description`. |
| `Revelation` | גילוי קורא או תגובה לגילוי. | `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id`; `parent_id` מציין גילוי אב ומאפשר לאותה entity להכיל גם תגובות. |
| `VerseSongSeries` | סדרת שירי מקרא. | `name`, `description`, `thumbnail`, `cover_image`, `accent`, `active`; שם הסדרה נשמר verbatim. |
| `VerseSongEpisode` | שיר אחד בתוך סדרה. | `series_name`, `title`, `book_name`, `book_number`, `chapter`, `verse`, `verse_ref`, `language`, `version`, משך, כתוביות, סדר ו־`active`; הקשר לסדרה הוא לפי שם. |

### 5.6 קשרים חשובים והגבלות

1. **אין Foreign Key מפורש ברוב הקשרים.** המערכת משתמשת בזוגות שדות טבעיים כגון:
   - `book_number + chapter`
   - `owner_email`
   - `devotional_code`
   - `series_name`
   - `prayer_title`
   - `topic_id`

2. **שינוי שם עלול לנתק קשרים.**  
   החלפת שם סדרת שירים או כותרת תפילה עלולה להשאיר רשומות ישנות מנותקות.

3. **הרשאות כתיבה מבוססות תפקיד, לא בדיקת בעלות מלאה בכל מקום.**  
   יש לוודא ש־RLS או בדיקות הפונקציה מגבילות רשומה משתמש לבעלים עצמו.

4. **אין כפילות טבעית מובטחת ברמת ה־entity.**  
   ה־idempotency של הייבוא מושג בעיקר בשכבת הלוגיקה של המייבא, לא כאילון ייחודיות במסד.

5. **שני מודלים לפרקים.**
   - `LugandaChapter` ו־`KjvPlusChapter` שומרים פרק שלם כ־JSON.
   - `BibleVerse` שומר פסוקים בנפרדים.
   
   יש לבחור מקור מדויק בכל flow כדי למנוע סתירות בין שתי הצורות.

---

## 6. תהליכים ואינטראקציות מרכזיות

### 6.1 התחברות קורא רגיל

1. `AuthProvider` קורא ל־`fse2.auth.me()`.
2. אם קיים משתמש מחובר, נשמרים:
   - `user`
   - `isAuthenticated = true`
3. דפים הדורשים חשבון מציגים `EmptyState` או מסך כניסה.
4. לאחר `fse2.auth.login(...)` מופנה המשתמש ל־`Dashboard`.
5. רשומות אישיות נטענות עם מפתחות React Query הכוללים את `email`, למשל:
   - `["readingActivity", email]`
   - `["studyMarks", email]`
   - `["journalEntries"]`

### 6.2 קריאת פרק

1. המשתמש בוחר ספר ב־`BibleReader`.
2. נבחר פרק ונוצרת כתובת:
   - `/Chapter?book=<book>&chapter=<chapter>`
3. `Chapter` טוען את גרסת המקרא הפעילה מ־`versions.js`.
4. `fetchChapter` מנסה למצוא:
   - רשומת פרק מותקנת.
   - עותק לא־מקוון.
   - מקור חיצוני דרך פונקציית `bibleChapter`.
5. הפרק מנורמל למבנה של פסוקים עם `verse` ו־`text`.
6. אם גרסת KJV+ מכילה קודי `(G/H...)`, הם מוצגים כמספרי Strong’s.
7. הפעולה נרשמת ב־`ReadingActivity` מסוג `chapter_visit`.
8. המשתמש יכול לבחור פסוק ולפתוח את סרגל הפעולות.
9. מידע הרמה:
   - הפניות צלב נטענות לפי פרק.
   - תפילות הפסוק נטענות לפי טווח.
   - עיונים, הערות ו־Q&A נטענים מה־public API או מהתוכן המובנה.
10. סגירת הפרק יכולה לשמור `Reading` ולסמן יום מתכנית הקריאה כהושלם.

### 6.3 סימון טקסט במבוא, במבנאי או בתפילה

1. המשתמש בוחר טקסט.
2. `AnnotatedText` מחשב את ה־offsets של הבחירה.
3. מוצגת רשת כלים לצבע או קו תחתון.
4. ההערה נשמרת:
   - ב־`StudyAnnotation` כשהמשתמש מחובר.
   - ב־IndexedDB גם כשאין חיבור.
5. בטעינה הבאה הקבצים ממוזגים לפי `annotationKey`.
6. המיקום תלוי בטקסט המדויק; שינוי טקסט עלול להזיז או להפוך הערה ללא רלוונטית.

### 6.4 סימון, סימנייה והערה בפסוק

1. המשתמש בוחר פסוק.
2. `VerseActionBar` מציע highlight, bookmark, note, copy ו־share.
3. הפעולה נשמרת ב־`StudyMark`.
4. נרשמת פעילות נפרדת ב־`ReadingActivity`.
5. `BibleNotes` מציג את כל הסימונים של המשתמש.
6. לחיצה על סימון מחזירה לפסוק המתאים דרך פרמטרי `book`, `chapter`, `verse`.

### 6.5 הפניית צלב והצגת פסוק יעד

1. הפסוק נטען עם רשומות `CrossReference` לפי `book_number`, `chapter`, `verse`.
2. אם קיימת רשומה עם `ref_text_en` או `ref_text_lu`, הטקסט השמור מוצג.
3. אם אין טקסט שמור, `CrossRefScripture` מוריד את פרק היעד.
4. לחיצה על הפניה:
   - פותחת `VersePopup` בתוך המסך, או
   - עוברת ל־`Chapter` עם פרמטר `verse`.
5. `CrossRefList` מציג גם הפניות אחרות באותו פרק כשאין הפניה ישירה לפסוק הנבחר.

### 6.6 פתיחת מילה Strong’s

1. `StrongsText` מזהה קוד כגון `(G2424)`.
2. הקוד מוצג כקישור כחלחל.
3. `StrongsPopup` מחפש קוד מנורמל, למשל `G2424`.
4. ההגדרה נקראת:
   - מהמטמון המקומי.
   - מ־`StrongEntry`.
   - ממילון חיצוני כשצריך.
5. הגדרה שנמצאה נשמרת למטמון המקומי ול־`StrongEntry`.
6. כשאין חיבור, המטמון המקומי עדיין מאפשר להציג הגדרות שכבר נצפו.

### 6.7 התקנת לוגינדה

1. המנהל נכנס ל־`AdminDashboard`.
2. בוחר “Luganda Bible”.
3. `LugandaInstaller` מבטיח שהסשן עדכני באמצעות `ensureFreshAdminToken`.
4. הוא שולח פעולה ל־`fse2.functions.invoke("lugandaInstall", ...)`.
5. השרת קורא את הפרקים שכבר קיימים ב־`LugandaChapter`.
6. רק פרקים חסרים מורדים.
7. כל פרק נשמר עם `book_number`, `chapter`, `verse_count` ו־JSON של פסוקים.
8. הפעולה ממשיכה עד לסיום, כשל מקומי או עצירה כאשר אין התקדמות.
9. ה־UI מציג כיסוי לפי ספר דרך `ChapterCoverage`.
10. אפשר להפעיל את אותו תהליך גם מ־`cron/scriptureInstall.js` באמצעות install key.

### 6.8 התקנת KJV+ ומילון Strong’s

1. `KjvPlusInstaller` שולח פעולת מצב או התקנה לפונקציית ההתקנה.
2. פרקים חסרים מורדים עם קודי Strong’s.
3. פעולה נפרדת יכולה להתקין את המילון המלא.
4. `LibraryReport` מפעיל `scriptureAudit` בפעולת `status`.
5. הדוח משווה בין:
   - KJV+
   - לוגינדה
   - מספר פסוקים צפוי
   - פרקים חסרים
   - פרקים שבורים
   - קודי Strong’s ללא הגדרה
6. פרק שנכשל אינו מוחק פרקים תקינים; הוא נבדק בהתקנה הבאה.

### 6.9 ניהול collection גנרי

1. המנהל בוחר collection מתוך `AdminDashboard`.
2. `CollectionsPanel` קורא את ה־metadata מ־`adminCollections.js`.
3. הוא טוען עד 500 רשומות דרך `callAdminData("list", ...)`.
4. בחירת רשומה פותחת `RecordEditor`.
5. שדה מסוג:
   - `text`
   - `textarea`
   - `number`
   - `boolean`
   - `refs`
6. `refs` מוצג באמצעות `CrossRefEditor`.
7. השמירה מבצעת create או update לפי האם קיים `id`.
8. המחיקה דורשת אישור ב־`ConfirmDialog`.
9. לאחר שינוי מומלץ לרענן או לבטל את מטמוני React Query הרלוונטיים.

### 6.10 ייבוא JSON כללי

1. המנהל מוריד תבנית או בוחר קובץ JSON.
2. ה־parser מזהה aliases כגון `prayer`, `prayers`, `passage` ו־`passages`.
3. הקובץ מנורמל ל־collections מוכרים.
4. נבדקים:
   - סוג הקובץ.
   - מבנה השורות.
   - שדות חובה.
   - מפתחות טבעיים.
5. מוצגת תצוגה מקדימה.
6. בשלב הכתיבה מתבצע upsert:
   - רשומה קיימת מתעדכנת.
   - רשומה חדשה נוצרת.
7. מוצג דוח מספר יצירות, עדכונים ודילוגים.

### 6.11 ייבוא תפילות והפניות צלב לפי ספר

1. המנהל מעלה קובץ JSON של ספר אחד.
2. `isBookFile` מזהה את סוג הקובץ.
3. `bookFileCollections` מרחיב את הקובץ לאוספים:
   - `PrayerPassage`
   - `CrossReference`
   - `ChapterIntro`
   - `BookIntro`
4. `validatePrayerFile` בודק את תקינות התוכן.
5. המסך מציג לפי פרק:
   - כמה תפילות קיימות.
   - כמה הפניות צלב קיימות.
   - אילו פרקים חסרים.
6. אפשר להוריד תבנית השלמה לחלקים חסרים.
7. הייבוא מתבצע דרך לוגיקת upsert לפי מפתחות טבעיים.
8. לאחר הייבוא מתבצעת קריאה חוזרת כדי לאמת את המצב החדש.

### 6.12 ניהול Q&A

#### הוספת שאלה

1. `QaPanel` טוען `QATopic` ו־`QAItem`.
2. `QaQuestionsPanel` פותח את `QaItemForm`.
3. הטופס דורש:
   - נושא.
   - שאלה באנגלית.
   - שאלה בלוגינדה.
   - תשובה באנגלית.
   - תשובה בלוגינדה.
4. אות השאלה מחושבת אוטומטית מהשאלה האנגלית.
5. השמירה מבצעת create או update.

#### מחיקת נושא

1. `QaTopicsPanel` סופר את השאלות בנושא.
2. אם אין שאלות, נשלחת בקשת מחיקה רגילה.
3. אם יש שאלות, מוצגת חלונית העברה.
4. המנהל בוחר נושא יעד.
5. רק לאחר ההעברה מתבצעת מחיקת הנושא.

#### ייבוא מרובה

1. הקובץ חייב להתאים לפורמט `pray-read-qa-v1`.
2. כל שורה נבדקת לפי שדות דו-לשוניים חובה.
3. נושאים חדשים נוצרים רק אם האפשרות מסומנת.
4. לאחר אימות מלא מתבצע הייבוא.
5. דוח מסכם יצירות, עדכונים ושגיאות.

### 6.13 ניהול שירי מקרא

#### הוספת שיר ידנית

1. `VerseSongForm` מאחד את שדות הסדרה, הספר, הפרק, הפסוק, השפה והגרסה.
2. הפרק נבדק מול `BIBLE_BOOKS`.
3. אודיו יכול להתקבל מקובץ או מקישור.
4. קובצי האודיו מוגבלים ל־MP3/M4A/WAV ול־20MB.
5. תמונת כיסוי מועלית דרך `fse2.integrations.Core.UploadFile`.
6. השמירה יוצרת או מעדכנת `VerseSongEpisode`.

#### ייבוא מרובה

1. הקובץ חייב להתאים לפורמט `pray-read-verse-songs-v1`.
2. נבדקים שם, סדרה, קובץ אודיו ופרטי הפסוק.
3. אפשר ליצור סדרות חדשות אוטומטית.
4. הייבוא מתבצע עם progress bar.
5. דוח מסכם שורות שיובאו ושורות שדולגו.

### 6.14 יצירת גילוי ותגובה

1. משתמש לא מחובר מופנה להתחברות.
2. משתמש מחובר מזין כותרת, פסוק וגוף.
3. `submitRevelation` יוצר רשומת `Revelation`.
4. לייק מעדכן את מונה `likes` וגם את המצב המקומי.
5. תגובה נוצרת כ־`Revelation` עם `parent_id`.
6. המסך ממזג רשומות חיות עם פוסטים מובנים, תוך הימנעות מכפיל לפי כותרת.

### 6.15 קבוצת דיון

1. המשתמש בוחר קבוצה.
2. הצטרפות נשמרת מקומית ב־`STORAGE_KEYS.joinedGroups`.
3. ההודעות נטענות מ־`DiscussionThread` לפי `group_name`.
4. הודעה חדשה כוללת `owner_email` ו־`author_name`.
5. אין קשר בסיס נתונים; חיבור מחדש לקבוצה אחרת דורש התאמת `group_name`.

### 6.16 תכנית קריאה והתקדמות

1. `Plan` מציג תכנית מהמסד או מ־`PLAN_DAYS`.
2. סטטוס נקבע לפי רשומות `Reading` של המשתמש.
3. לחיצה על יום מובילה לפרק.
4. סיום קריאה יכול ליצור `Reading` עם:
   - ספר ופרק.
   - תרגום.
   - `plan_day`.
   - תאריך.
   - סטטוס.
   - reflection ו־prayer point.
5. רצף הימים מחושב מתאריכי הקריאה.
6. `Dashboard` מציג סטטיסטיקות, progress ו־streak.

### 6.17 הורדה לאופליין

1. `Offline` מציג את ה־stores והכמויות.
2. כל הורדה נכתבת ל־IndexedDB בשם `prayread-offline`.
3. המסד עדיין בגרסה 9 ומתקן את עצמו כשחסרים stores.
4. פרקים, פסוקים, מילים Strong’s, מדקדקים, תפילות, הפניות, Q&A ועוד נשמרים לפי stores נפרדים.
5. `BibleReader` מחשב ספר כזמין לאופליין רק כאשר כל פרקיו קיימים.
6. ניקוי המרכז מוחק נתונים מקומיים ולא את רשומות השרת.

### 6.18 נגן גלובלי

1. בחירת שיר קוראת ל־`playQueue` או `loadQueue`.
2. `PlayerProvider` יוצר אובייקט `Audio` אחד לכל האפליקציה.
3. הנגן ממשיך לעבוד בעת ניווט בין דפים.
4. queue, index, shuffle, repeat, speed, volume ומצב expanded מנוהלים ב־Provider.
5. `GlobalPlayer` משתמש ב־body class כדי להשאיר מרחב פנוי מהנגן.
6. כשהשיר מסתיים:
   - repeat=one משחק אותו שוב.
   - repeat=all עובר לשיר הבא.
   - אחרת עוצר בסוף ה־queue.

### 6.19 PWA ועדכון גרסה

1. `PwaHead` מוסיף מטא־tags ורושם את `sw.js`.
2. ה־service worker שומר shell במטמון `prayread-shell-v2`.
3. תוכן runtime נשמר ב־`prayread-runtime-v2`.
4. `InstallPrompt` משתמש ב־`beforeinstallprompt`.
5. לאחר התקנה, `display-mode: standalone` מזהה מצב מותקן.
6. שינוי מבנה routes או נכסי shell דורש עדכון גרסת המטמון או strategy.

---

## 7. הערות טכניות לפיתוח

### 7.1 ספריות עיקריות

| ספרייה | שימוש |
|---|---|
| `react` | רכיבים, hooks, context |
| `react-router-dom` | ניווט, פרמטרי URL, redirects |
| `@tanstack/react-query` | טעינת שרת, cache, mutations ו־invalidation |
| `lucide-react` | אייקוני הממשק |
| `date-fns` | תאריכים, ימי שבוע ורצף קריאה |
| FSe2 SDK דרך `@/api/fse2Client` | entities, auth, functions, integrations |
| Tailwind utility classes | חלק מה־UI, בעיקר במסכים ישנים או חדשים יותר |
| `BRAND_CSS` | מערכת עיצוב מותגית מרכזית |

### 7.2 דפוסים חוזרים

1. **Alias `@`**
   - מפנה לשורש הפרויקט.
   - למשל `@/lib/bibleApi`.
   - יש להשתמש באותו alias גם בקבצים חדשים.

2. **פרמטרים מוגדרים מרכזית**
   - `COLLECTIONS` ב־`adminCollections.js`.
   - `VERSIONS` ב־`versions.js`.
   - `BIBLE_BOOKS` ב־`bibleBooks.js`.
   - `STORAGE_KEYS` ב־`theme.js`.
   - `createPageUrl` ב־`@/utils`.

3. **נרמול בגבול הנתונים**
   - רשומות מ־FSe2 מנורמלות לפני שמגיעות ל־UI.
   - יש להשתמש ב־`normalise...`, `toEntry`, `buildSongIndex` וכדומה במקום לבצע המרות ידניות בכל רכיב.

4. **Fallback מובנה**
   - תוכן ציבורי לא אמור להישאר ריק כשהשרת אינו זמין.
   - יש להשאיר את `seedContent.js` כמנגנון ביטחון.

5. **מטמון מקומי**
   - `localStorage`: העדפות, הצבעות, חבילות קהילה, votes, גרסאות.
   - `IndexedDB`: תוכן דיגיטלי גדול, פרקים, הערות ו־Strong’s.
   - אין להשתמש ב־`localStorage` לאוספי מקרא גדולים.

6. **React Query**
   - מפתחות עם `email` נדרשים כשהנתונים שייכים למשתמש.
   - לאחר שינוי תוכן יש לבטל את המפתחות המתאימים או לבצע refetch.
   - אין לבצע כתיבה ישירה מ־`render` או ללא mutation.

7. **טפסים**
   - טפסים רגילים משתמשים ב־`useState`.
   - `RecordEditor` מקבל `values` ו־`onChange(name, value)`.
   - `CrossRefEditor` צפוי לקבל מחרוזת מאוחדת, לא מערך.

8. **פעולות התקנה**
   - על ה־UI לרענן סשן לפני פעולה ארוכה.
   - ההתקנה עצמה צריכה להיות idempotent.
   - אין להסתמך רק על כפתור שמושבת; גם cron ו־retry חייבים להיות בטוחים.

9. **עיצוב**
   - ה־brand CSS מגדיר משתני CSS כגון:
     - `--pr-ivory`
     - `--pr-emerald`
     - `--pr-gold`
     - `--pr-heading`
     - `--pr-body`
     - `--pr-border`
   - יש להשתמש במשתנים ולא בצבעים קשיחים כשאפשר.

10. **נגינת מדיה**
    - כל נגן השירים חייב להשתמש ב־`PlayerProvider`.
    - אין ליצור `Audio` חדש בתוך כרטיס שיר, אחרת ההפעלה לא תמשיך בין דפים.

### 7.3 מה חשוב לדעת לפני שינוי

#### הוספת collection

1. להוסיף entity תחת `entities/`.
2. להגדיר את שדותיה ב־`adminCollections.js`.
3. לוודא שיש `natural key`.
4. להוסיף קריאה ציבורית ל־`lib/contentApi.js` ולפונקציית `functions/content.js` אם הוא צריך להיות ציבורי.
5. לוודא הרשאות read/write.
6. להוסיף בדיקות ייבוא.
7. לבדוק שאין סתירה עם תוכן מובנה.

#### הוספת סוג שדה ל־`RecordEditor`

1. להגדיר את הסוג ב־`adminCollections.js`.
2. לטפל בו ב־`RecordEditor`.
3. לוודא normalization לפני שמירה.
4. לוודא שהשדה מוגן מ־SQL/HTML בהתאם לסוג.

#### הוספת גרסת מקרא

1. להוסיף ל־`VERSIONS`.
2. להגדיר `language`, `translation`, `strongs` ומקור הורדה.
3. לוודא שה־offline key כולל את מזהה הגרסה.
4. לבדוק את `fetchChapter`.
5. לבדוק את `VersionPicker`.
6. לוודא שה־audit מזהה את הגרסה.

#### הוספת דף

1. ליצור קובץ תחת `pages/`.
2. להשתמש ב־`createPageUrl`.
3. לבדוק ש־service worker ו־manifest מכילים את הנתיב כשצריך.
4. להוסיף קישור מהניווט.
5. לבדוק מובייל.
6. לבדוק fallback במצב לא מקוון.

#### הוספת הערת סטודיו

1. להגדיר `block_id` יציב וייחודי בתוך הספר.
2. לוודא שהטקסט מיושם כ־text בלבד.
3. להשתמש ב־`annotationKey`.
4. לוודא merge בין server ל־local.
5. לחשוב מה קורה כאשר הטקסט משתנה או מתקצר.

### 7.4 נקודות חולשה וסיכונים ידועים

| רמת חומרה | נושא | המלצה |
|---|---|---|
| קריטית | ב־`adminAuth.js` קיימות סיסמת אדמין ומפתח איפוס גיבוי קשיחים כ־fallback. | להסיר את ה־fallback, להגדיר secrets בסביבה, להחליף את הסיסמה ואת מפתח האיפוס לפני production. |
| גבוה | SHA-256 עם salt יחיד אינו KDF מתאים לסיסמאות. | להשתמש ב־Argon2id, scrypt או bcrypt עם work factor מתאים. |
| גבוה | חלק מה־entities מאפשרים create/update/delete לכל משתמש מאומת, בלי תנאי בעלות גלויים. | להוסיף ownership checks ברמת policy/function, במיוחד ל־Revelation, DiscussionThread, Reading ו־StudyMark. |
| גבוה | `StrongEntry` מיועד לכתיבה ציבורית כמטמון. | להגביל writes, לאמת מקור ולמנוע cache poisoning. |
| גבוה | סשן מנהל נשמר ב־`localStorage`. | להבטיח CSP חזק, XSS protection והגנה מצד שלישי; בעתיד אפשר להעביר ל־HttpOnly cookie. |
| בינונית | `VerseSongSeriesForm` בודק קובצי תמונה לפי תבניות אודיו (`mp3`, `m4a`, `wav`). | להחליף בבדיקת MIME/extension תמונה, למשל `png`, `jpg`, `jpeg`, `webp`. |
| בינונית | `PrayerSaved` מקשר לתפילה לפי כותרת. | להוסיף `prayer_id` או מפתח יציב. |
| בינונית | `VerseSongEpisode` מקשר לסדרה לפי שם. | להוסיף `series_id` או מפתח יציב ולשמור את השם רק לתצוגה. |
| בינונית | שינוי בשם סדרה או תפילה עלול לפצל נתונים. | להוסיף migration או עדכון bulk. |
| בינונית | מיזוג התוכן החי עם ה־seed מתבסס לעיתים על כותרת בלבד. | להשתמש במפתח יציב וב־normalization של whitespace/case. |
| בינונית | `compressChapters` אינו מסיר כפילויות. | להוסיף `Set` לפני המיון אם ייתכן כפילויות. |
| בינונית | התאמת פסוקים ב־`matchesPassage` מבוססת על `includes` ומספרים. | להעדיף `parseReference` ולהשוות מספרי ספר/פרק/פסוק מול מודל מובנה. |
| בינונית | אין כמעט בדיקות אוטומטיות בקוד שסופק. | להוסיף unit tests ל־parsers, importers, auth hash, Strong parsing ול־reference matching. |
| נמוכה | `__trash` ו־`__url_fetch` מגדילים את מאגר הפרויקט ועלולים לבלבל דיבאג. | להסיר או להעביר למאגר חיצוני לפני deploy. |
| נמוכה | `__generated/tailwind.css` נראה כמוצר בנייה. | אין לערוך ידנית; יש לשנות את מקור ה־Tailwind. |

### 7.5 מגבלות אבטחה נוספות

- `safeText` מונע הצגת אובייקטים לא צפויים, אך אינו מנקה HTML.
- אין להשתמש ב־`dangerouslySetInnerHTML` על תוכן משתמש או מקור חיצוני.
- על כל קובץ מדיה שמועלה לבצע בדיקות:
  - סוג MIME אמיתי.
  - גודל.
  - שם קובץ.
  - סיכון path traversal.
- על מקורות המקרא לבצע בדיקות תאיכות ורישיון לפני הפצה.
- אין לחשוף secrets של התקנה, מפתחות איפוס או session secret בקוד הדפדפן.
- יש להגביל כניסת מנהל לפי ניסיונות כושלים, אפילו אם כרגע אין rate limiting מובנה.
- אין להעלות אודיו או תמונה לצד ציבורי בלי לבדוק תוכן זכותי ורלוונטי.

### 7.6 נגישות

המערכת כוללת מספר מאמצים טובים:

- `aria-label` לכפתורים אייקוניים.
- `role="dialog"` ו־`aria-modal`.
- `aria-current`, `aria-pressed`, `aria-selected`.
- `role="status"` לטעינה.
- תפריטי tab עם `role="tablist"`.
- טיפול ב־Escape ובלחיצה על רקע מודאל.
- תמיכת מקלדת בכרטיסי שיר.

נקודות שכדאי לחזק:

- להוסיף focus trap למודאלים.
- להחזיר את הפוקוס לכפתור שפתח את המודאל.
- להוסיף `aria-live` להודעות שגיאה והצלחה.
- לבדוק ניווט מקלדת מלא בסרגל A - Z, בתפריטים ובנגן.
- לוודא שצבע ה־highlight אינו המנגנון היחיד להעברת משמעות.

### 7.7 בדיקות מומלצות

#### Unit tests

- `compressChapters`
- `parseStrongs`
- `strongsContent`
- `splitRefs` / `joinRefs`
- `parseReference`
- `parseOutlineRange`
- `matchesPassage`
- `normaliseCrossRef`
- `normalisePassage`
- `isBookFile`
- `validatePrayerFile`
- `sha256Hex`
- `bookFileCollections`
- `buildSongIndex`
- `filterSongs`

#### Integration tests

1. כניסת מנהל דרך שרת ודרך direct fallback.
2. יצירת ועדכון רשומה גנרית.
3. התקנת פרק לוגינדה ו־KJV+ פעמיים ללא כפילויות.
4. הרצת audit לאחר חסר או פרק פגום.
5. ייבוא אותו קובץ פעמיים.
6. ייבוא קובץ ספר עם פסוק מלא, טווח והפניית צלב.
7. מעבר שאלות בין נושאים ולאחר מכן מחיקת נושא.
8. הפעלת אודיו והמשך השמעה בעת ניווט.
9. סימון טקסט, סגירת דפ וטעינה חוזרת.
20. שמירת פסוק לאופליין וקריאתו ללא חיבור.
21. יצירת גילוי ותגובה.
22. העלאת אודיו ושגיאת סוג קובץ.

### 7.8 כללי דיבאג מהירים

| תסמונת | נקודה ראשונה לבדיקה |
|---|---|
| התחברות מנהל נכשלת | `adminSessionCheck`, מצב ב־`pr_admin_mode`, תוקף token ו־`ADMIN_INITIAL_PASSWORD` |
| פעולת ניהול נכשלת | האם נבחר המסלול server או direct, והאם יש הרשאת role |
| התקנה נעצרת | `kjvInstall`/`lugandaInstall`, מצב HTTP של המקור, `verse_count`, רשימת הפרקים הקיימים |
| פרק לא מוצג | query parameters, גרסת מקרא פעילה, `fetchChapter`, רשומת chapter ו־offline key |
| תוכן חי לא מתעדכן | React Query key, cache invalidation, האם המשתמש מחובר, האם נשתמש ב־seed fallback |
| הערה נעלמת | `block_id`, offsets, `annotationKey`, merge בין local ל־server |
| הפניית צלב לא נפתחת | רשומת `CrossReference`, מספר ספר, פרק, פסוק ופרמטר `verse` |
| Strong’s לא מציג משמעות | קוד ללא אות/ספרות, הגדרה חסרה, cache מקומי, שגיאת CORS במילון |
| שיר לא ממשיך בין דפים | `PlayerProvider`, תקנת audio URL, `playQueue`, מצב `current` |
| PWA מציג גרסה ישנה | `sw.js`, שמות cache, עדכון service worker, manifest |
| מותג אינו מתעדכן | `SiteSettings`, `ThemeProvider`, cache של React Query, ערכי CSS variable |
| הורדה לאופליין נכשלת | IndexedDB `prayread-offline`, גרסת schema, גודל quota, קיום ה־store הנדרש |
| מסך נייד שבור | CSS media queries, תפריט נייד, overflow, מודאל ו־safe area |

### 7.9 מפתחות מקומיים חשובים

| מפתח | מטרה |
|---|---|
| `pr_admin_token` | סשן מנהל |
| `pr_admin_mode` | בחירת מסלול server/direct |
| `pr_qa_votes` | הצבעות Q&A מקומיות |
| `fse2_app_id` | מזהה האפליקציה |
| `fse2_app_token_<appId>` | app token של הפלטפורמה |
| `fse2_token` / `fse2_app_token` | fallback tokens |
| `STORAGE_KEYS.savedInsights` | עיונים שנשמרו |
| `STORAGE_KEYS.joinedGroups` | קבוצות שהמשתמש הצטרף אליהן |
| `STORAGE_KEYS.doneDevotionals` | מדקדקים שסומנו כהושלמו מקומית |

### 7.10 מסדי מטמון חשובים

- IndexedDB: `prayread-offline`, schema version 9.
- Service worker shell: `prayread-shell-v2`.
- Service worker runtime: `prayread-runtime-v2`.
- Audio player: אובייקט `Audio` יחיד ב־`PlayerProvider`.

---

## סיכום

הליבה של Pray-Read היא מסלול הקריאה:

1. המשתמש בוחר ספר ופרק.
2. המערכת טוענת פרק מהמקור המותקן, מהמטמון או ממקור חיצוני.
3. הפסוק מחובר לסימונים, הערות, תפילות, עיונים, הפניות צלב ו־Strong’s.
4. כל פעולת קריאה נשמרת כנתוני משתמש.
5. התוכן ניתן להורדה ל־IndexedDB ולשימוש ללא חיבור.
6. הנגן והסשן המנהלי ממשיכים לפעול ברמת האפליקציה כולה.
7. ה־CMS מאפשר להחליף את התוכן המובנה בתוכן אמיתי, להתקין את המקרא ולבצע ביקורת מתמשכת.

העיקרון המנחה את כל המערכת הוא **fallback**: הקורא צריך לקבל תוכן גם כשהמקור החי אינו זמין, והמנהל צריך לבצע פעולות חוזרות בבטוחה. כל הרחבה חדשה צריכה לשמר את שני העקרונות האלה.
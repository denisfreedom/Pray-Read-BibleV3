# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

> **הערת תיקונים:** חלק מהקבצים במקור מוצגים עם קיצוץ. התיעוד מבוסס על הקוד הזמין, שמות הקבצים, מבנה הישויות והנתיבים המופיעים ב־`manifest.json` וב־`service worker`. שמות הנתיבים מונחים ב־`createPageUrl`, ולכן בפועל הם ממופים לנתיבים ישירים כגון `/BibleReader` ו־`/Chapter`.

---

## 1. מהות המערכת

### 1.1 תיאור כללי

**Pray-Read Bible** היא אפליקציית PWA לקריאת התנ"ך, תפילה, מחקרים, הערות אישיות, שיתוף קהילה והשמעת שירי מקרא.

המערכת מיועדת להיות "ספרייה חיה" במקום אתר מידע סטטי: כל פעולת קריאה, התראה, הערה, תפילה שנשמרה, התקדמות בתוכנית הקריאה ופעילות קהילה נשמרת מול חשבון המשתמש וממשיכה להתקיים בין מכשירים.

האפליקציה תומכת בעיקר בשתי שפות:

- **English**
- **Luganda**

כל התוכן העברי והלוגנדה נשמר באותם רשומות באמצעות שדות עם סיומות `_en` ו־`_lu`, כך שאפשר להציג את אותה ישות בשתי השפות ולשמור את הגרסה המלאה במקום אחד.

### 1.2 קהל היעד

| קהל | שימושים מרכזיים |
|---|---|
| קוראים מאמינים | קריאת פרקים, מתפילות, הערות, סימון פסוקים, תוכנית קריאה ויומן תפילה |
| קוראים לוגנדה | קריאת התנ"ך והתוכן הלוגנדה, השמעת מקרא ושימוש בהערות אישיות |
| משתמשי קהילה | פרסום חזויות, תגובות, קבוצות דיון והשתתפות בשיעורים חיים |
| מנהלי תוכן | ניהול תוכן, ייבוא JSON, התקנת תרגומים, ביקורת אוצר וניהול שירי מקרא |
| משתמשים במצב לא מקוון | הורדת פרקים, מילים, מחקרים, תפילות, הפניות ומילון Strong's למכשיר |

### 1.3 הערך שהמערכת מספקת

1. **קריאה ממוקדת**  
   ממשק קריאה עם סימון, קו תחתון, צבע, הערות, סימני בוקמרק, פעולות שיתוף ופתיחת פסוקים מקרא אחרים בלי לצאת מהפרק.

2. **חיבור בין המקרא לתפילה**  
   כל פסוק יכול להוביל לתפילת מעבר, להפניות מקרא, למחקר, להערות תיאולוגיות והיסטוריות ולחלוקת פרק.

3. **אוצר תוכן דו-לשוני**  
   תפילות, מחקרים, מבואות ספרים ופרקים, הפניות מקרא וחומרי קהילה נשמרים במסד הנתונים ומוצגים לציבור.

4. **שימוש ללא חשבון**  
   קריאה, חיפוש, השמעה ושיתוף זמינים ללא התחברות. חשבון נדרש בעיקר לשמירת מצב אישי ולפעולות כתיבה.

5. **עבודה ללא חיבור**  
   IndexedDB מאחסן פרקים, פסוקים, חומרי לימוד, תפילות, הפניות ומילון Strong's. `service worker` מאפשר לפתוח את מעטפת האפליקציה גם כשאין רשת.

6. **התקנת תרגומים לתוך המערכת**  
   מנהל התוכן יכול להתקין את התנ"ך הלוגנדה ואת KJV+ עם מספרי Strong's, בפרקים, באופן עמיד וניתן להמשך.

7. **השמעה גלובלית**  
   `PlayerProvider` מחזיק אודיו אחד ברמת האפליקציה, כך שהמקרא ממשיך לשמוע גם בעת מעבר בין דפים.

### 1.4 יכולות עסקיות מרכזיות

- קריאת כל 66 ספרי התנ"ך, בעיקר בשתי שפות.
- התקנה מקצועית וביקורת של KJV+ ולוגנדה.
- מילון Strong's עם מילה מקורית, תעתיק, הגייה, חלק דיבר והגדרה.
- ספריית תפילות, תפילות מעבר ותפילות סיום פרק.
- מחקרים תיאולוגיים והיסטוריים.
- תוכנית קריאה בת 30 יום.
- הערות אישיות, סימונים, בוקמרקים, השלמות ויומן תפילה.
- קהילת קריאה: חזויות, תגובות, קבוצות דיון ושיעורים חיים.
- מנהל תוכן גנרי שמאפשר לקרוא, לעדכן, ליצור ולמחוק רשומות.
- ייבוא JSON חוזר, עם זיהוי רשומות קיימות ועדכוןן במקום יצירת כפילויות.
- PWA ניתן להתקנה.

### 1.5 ארכיטקטורה ברמת רכיבים

| שכבה | רכיבים מרכזיים | תפקיד |
|---|---|---|
| מעטפת ראשית | `Layout.jsx`, `AppHeader`, `AppFooter`, `GlobalPlayer`, `PwaHead` | הקשר הכולל, ניווט, עיצוב, PWA והשמעה גלובלית |
| דפים | `pages/*.jsx` | מסכי משתמש ותהליכי עבודה מלאים |
| רכיבי תצוגה | `components/**/*.jsx` | רכיבים לשימוש חוזר בקהילה, במנהל התוכן, בקורא ובהשמעה |
| שכבת נתוני לקוח | `lib/contentApi.js`, `lib/bibleApi.js`, `lib/prayerPassages.js` וכו' | טעינה, נרמול ושמירה של נתונים |
| מצב גלובלי | `AuthContext`, `ThemeContext`, `PlayerProvider` | אימות, ערכת נושא ונגן מדיה |
| שכבת נתונים | `entities/*.json` | סכמת הטבלאות והרשאות הגישה |
| שרת ויומנים | `functions/*.js`, `cron/*.js` | אימות מנהל, API ציבורי, התקנות וביקורות |
| מקורות חיצוניים | bible-api.com, WordPlanet, Blue Letter Bible, מקורות Strong's | מקורות מלאי לפרקים, לוגנדה ומילוני |
| PWA ואחסון | `public/sw.js`, `lib/offlineDb.js` | Service worker ואחסון מקומי ב־IndexedDB |

### 1.6 מודל העברת נתונים המרכזי

המערכת משתמשת בשילוש של שלושה מקורות:

1. **רשומות חיות במסד הנתונים**  -  מועדפות כאשר קיימות.
2. **תוכן מובנה בקוד**  -  `seedContent`, `bookGuides`, `bookPrayers`, `bookStudyContent`, `planData` ועוד; משמש כגיבוי כאשר מסד הנתונים ריק או שגוי.
3. **מקור חיצוני**  -  למשל פרק מ־bible-api.com או WordPlanet, ורק כאשר אין מקור מקומי זמין.

בנוסף, `offlineDb` משמש כמקור רביעי ומקומי כאשר המשתמש במצב לא מקוון.

---

## 2. עמודים ותפקידיהם

### 2.1 דפים ציבוריים

| עמוד | נתיב | תפקיד | יכולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Home** | `/Home` | דף הבית ונקודת הכניסה הראשית לאפליקציה | הצגת עיקרי השירות, פסוק היום, דווטיון, פעילות קהילה, קישורים לחלקי האפליקציה, מצב התקנת PWA וכפתור לתרומה |
| **About** | `/About` | עמוד מותג והסבר על תכלית האפליקציה | הצגת ערכים, למה נבנתה המערכת, הבעיה שהיא פותרת והפניות להמשך קריאה |
| **BibleReader** | `/BibleReader` | מסך בחירת הספר והפרק | חיפוש לפי שם אנגלי, לוגנדה או קיצור; החלפה בין הברית הישנה לחדשה; בחירת ספר; הצגת מצב זמינות לאופליין; מעבר לפרק |
| **Chapter** | `/Chapter?book=43&chapter=3&verse=16&lang=lu` | מערכת הקריאה המרכזית | טעינת פרק לפי תרגום; בחירת פסוק; הערות, סימונים, בוקמרקים והערות אישיות; תפילת מעבר; הפניות מקרא; מחקר; משאבי פרק; שיתוף; התקדמות קריאה; מקרא Strong's; תפילת סיום |
| **Devotionals** | `/Devotionals` | ספריית דווטיונים יומיים | חיפוש וסינון, מעבר בין רשימה לתצוגה מלאה, הצגה בשפה הנבחרת, סימון כהשלמה, קיצורים לפסוק ושיתוף |
| **PrayerLibrary** | `/PrayerLibrary` | ספריית התפילות הכללית | חיפוש, סינון לפי קטגוריה ושפה, קיצור למקרא, שמירה למועדפים ושיתוף |
| **VerseOfDay** | `/VerseOfDay` | הצגת פסוק היום | בחירת הרשומה לפי תאריך, קיצור לפרק ושיתוף |
| **TheologicalInsights** | `/TheologicalInsights` | לוח תובנות תיאולוגיות | חיפוש, פתיחת תובנה, קיצור למקרא, שיתוף ושמירה מקומית |
| **HistoricalInsights** | `/HistoricalInsights` | לוח תובנות היסטוריות | אותו מנגנון כמו הלוח התיאולוגי, עם `kind="historical"` |
| **Plan** | `/Plan` | תוכנית הקריאה בת 30 יום | הצגת היום הנוכחי, סטטוס ימים שהושלמו, קיצור ישיר לפרק המתוכנן |
| **Journal** | `/Journal?new=1&book=John&chapter=3` | יומן תפילה אישי | יצירה, עריכה, מחיקה, סינון לפי קטגוריה, קישור לפרק ושמירת התקדמות קריאה |
| **BibleNotes** | `/BibleNotes` | מרכז כל הסימונים, הבוקמרקים וההערות של המשתמש | הצגה לפי סוג, מעבר לפסוק המסומן והגנה למשתמש שאינו מחובר |
| **QA** | `/QA` | שאלות קוראים ותשובות | חיפוש, סינון קטגוריות, פתיחת תשובה, קיצור למקרא ושליחת שאלה כמשתמש מחובר |
| **Community** | `/Community` | מרכז קהילת הקוראים | מעבר לחזויות, לשיעורים חיים ולקבוצות דיון; הצגת תוכן עדכני |
| **CommunityRevelations** | `/CommunityRevelations` | פיד חזויות קהילתיות | פרסום חזויה, לייק, פתיחת תגובות והוספת תגובה; משתמש לא מחובר מופנה להתחברות |
| **CommunityLiveTeaching** | `/CommunityLiveTeaching` | אגף שיעורים חיים | הצגת תאריך, מנחה ותיאור, ופתיחת קישור ההצטרפות |
| **DiscussionGroups** | `/DiscussionGroups?group=GroupName` | קבוצות לימוד משותפות | בחירת קבוצה, הצטרפות מקומית, הצגת הודעות ושליחת הודעה כמשתמש מחובר |
| **Offline** | `/Offline` | מרכז הורדות וניהול אחסון מקומי | הורדת פרקים, פסוקים, חומרי תוכן ומילון Strong's; הצגת נפח אחסון; מחיקת נתונים; בדיקת קריאה מקומית |
| **InstallPrompt** | `/InstallPrompt` | הוראות התקנת האפליקציה כ־PWA | זיהוי מערכת, הצגת הוראות לפי מכשיר, הפעלת `beforeinstallprompt` ומעבר למצב standalone |
| **Contact** | `/Contact` | שליחת פנייה לאתר | אימות שם, דוא"ל והודעה; שליחה ציבורית; הצגת הצלחה או שגיאה |
| **Privacy** | `/Privacy` | מסמך פרטיות | הצגת מידע אישי, נתוני התקן מקומי ואחריות האפליקציה |
| **Terms** | `/Terms` | תנאי שימוש | הצגת זכויות שימוש בתוכן, התייחסות למקרא והגבלות פרסום מחדש |

### 2.2 דפי אימות

| עמוד | נתיב | תפקיד | יכולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Login** | `/Login?next=/...` | התחברות משתמש רגיל | אימות דוא"ל וסיסמה, הצגת שגיאה, הפנה לדאשבורד לאחר הצלחה |
| **Signup** | `/Signup` | יצירת חשבון | אימות אורך סיסמה, אימות אימות סיסמה, קבלת תנאי שימוש, חוסמ חולשת סיסמה, טיפול בדרישת אימות דוא"ל |
| **ForgotPassword** | `/ForgotPassword` | בקשת איפוס סיסמה | אימות כתובת דוא"ל ושליחת בקשת איפוס בלי לחשוף אם החשבון קיים |
| **ResetPassword** | `/ResetPassword?token=...` | קביעת סיסמה חדשה | קריאת token מ־`token` או `access_token`, אימות אורך והתאמה, קריאה ל־`resetPassword` |
| **Logout** | `/Logout` | סיום התחברות | המתנה קצרה להצגת מצב, קריאה ל־`logout` וחזרה לדף הבית |
| **Admin** | `/Admin` | כניסת מנהל תוכן | התחברות, הפנה אוטומטית אם כבר קיימת הפעלה, פתיחת חלון איפוס סיסמה |
| **AdminDashboard** | `/AdminDashboard` | מרכז ניהול התוכן | ניהול אוספים, התקנות, ייבוא, העריכה, מחיקה, הגדרות, פעילות מנהל ומעקב אחרי התקנת המתרגמים |

### 2.3 דפי המנהל

`AdminDashboard` מארגן את הפעילות בחתכים. לפי הרכיבים המיוצאים בקוד, הוא כולל בין היתר:

- סקירה כללית.
- ספרים ופרקים.
- התקנת התנ"ך הלוגנדה.
- התקנת KJV+ ומילון Strong's.
- דווטיונים.
- ספריית תפילות.
- תפילות מעבר, הפניות, מבואות פרקים ומבואות ספרים.
- אוספים גנריים.
- שירי מקרא.
- Q&A.
- תובנות.
- קהילה.
- פניות אחרות.
- ערכת נושא והגדרות אתר.
- היסטוריית פעילות.

המנהל יכול:

- לקרוא רשומות דרך `callAdminData`.
- ליצור ולעדכן רשומות דרך טפסים גנריים.
- למחוק רשומות רק לאחר אישור.
- לייבא קובצי JSON רגילים או קובצי ספר מיוחדים.
- להתקין פרקים חסרים.
- להריץ ביקורת מאגר.
- לנהל שירים, סדרות, כתיבה והעלאת מדיה.
- לנהל התקנת תוכן ופעילות מנהל.

### 2.4 רכיבי המספרים המרכזיים בעמוד Chapter

1. **רכיב הגרסה**  -  `VersionPicker` מאפשר לעבור בין KJV, KJV+, Luganda ותרגומים מותקנים אחרים.
2. **רשימת הפסוקים**  -  כל פסוק ניתן לבחירה.
3. **סרגל פעולות**  -  `VerseActionBar` מציע תפילה, הפניות, מחקר, הדגשה, הערה, העתקה ושיתוף.
4. **הפניות מקרא**  -  `VerseCrossRefs` מציג את היעד, את טקסט היעד והערת ההפניה.
5. **תפילת מעבר**  -  `PassagePrayer` מוצגת inline או בכרטיס ליד הפסוק.
6. **מחקר ותובנות**  -  `PassageTabs` מחבר בין פרשתיות ובין סוגי התוכן.
7. **חלונית לימוד**  -  במחשב נפתחת בצד; בנייד היא נטענת מתחת לסרגל הפעולות.
8. **Strong's**  -  קודים כגון `(G2424)` הופכים לקישורים קליקביליים.
9. **משאבי ספר**  -  הערות, תובנות ומחקרים מוצגים בעמוד הבחירת הפרק ובחלונית הפרק.
10. **תפילת סיום**  -  בסוף הפרק מוצגת תפילה מלאה בשפה הנבחרת.

---

## 3. מפת ניווט לצרכי DEBUG

### 3.1 ניווט ראשי

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| חזרה לדף הבית | כל דף | לוגו `Pray-Read` ב־`AppHeader` | `/Home` |
| פתיחת קורא המקרא | `Home` או `AppHeader` | `Bible Reader` | `/BibleReader` |
| פתיחת דווטיונים | `Home` או `AppHeader` | `Devotionals` | `/Devotionals` |
| פתיחת ספריית תפילות | `Home` או `AppHeader` | `Prayer Library` | `/PrayerLibrary` |
| פתיחת שירי מקרא | `Home` או `AppHeader` | `Verse-Songs` | `/VerseSongs` |
| פתיחת Q&A | `Home` או `AppHeader` | `Q&A` | `/QA` |
| פתיחת קהילה | `Home` או `AppHeader` | `Community` | `/Community` |
| פתיחת דאשבורד אישי | `AppHeader` | `Dashboard` | `/Dashboard` |
| פתיחת תובנות תיאולוגיות | תפריט משני | `Theological insights` | `/TheologicalInsights` |
| פתיחת תובנות היסטוריות | תפריט משני | `Historical insights` | `/HistoricalInsights` |
| פתיחת תוכנית הקריאה | תפריט משני | `Reading plan` | `/Plan` |
| פתיחת יומן התפילה | תפריט משני | `Prayer journal` | `/Journal` |
| פתיחת הערות המקרא | תפריט משני | `My notes` | `/BibleNotes` |
| פתיחת מרכז האופליין | תפריט משני או `AppFooter` | `Offline centre` | `/Offline` |
| פתיחת חזויות קהילה | תפריט משני | `Revelations` | `/CommunityRevelations` |
| פתיחת שיעורים חיים | תפריט משני | `Live teaching` | `/CommunityLiveTeaching` |
| פתיחת קבוצות דיון | `Community` או תפריט משני | `Discussion groups` | `/DiscussionGroups` |
| פתיחת מסך התקנת האפליקציה | `Home` | `Install` / `Install app` | `/InstallPrompt` |
| פתיחת אודות | `AppFooter` | `About` | `/About` |
| פתיחת צור קשר | `AppFooter` | `Contact` | `/Contact` |
| פתיחת מדיניות פרטיות | `AppFooter` | `Privacy` | `/Privacy` |
| פתיחת תנאי שימוש | `AppFooter` | `Terms` | `/Terms` |

### 3.2 התחברות וחשבון

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| התחברות משתמש | `AppHeader` | `Sign in` | `/Login` |
| יצירת חשבון | `Login` או `AppHeader` | `Create account` | `/Signup` |
| שכחתי סיסמה | `Login` | `Forgot password?` | `/ForgotPassword` |
| איפוס סיסמה לאחר קבלת token | דוא"ל או קישור חיצוני | קישור איפוס | `/ResetPassword?token=...` |
| התחברות מנהל | נתיב יישום ישיר | כניסת `Admin` | `/Admin` |
| פתיחת דאשבורד מנהל | `Admin` | `Sign in` | `/AdminDashboard` |
| איפוס סיסמת מנהל | `Admin` | `Reset password` | מודאל איפוס בתוך `/Admin` |
| יציאה מהחשבון | `AppHeader` | `Log out` | `/Logout`, ואז `/Home` |

### 3.3 קריאת מקרא ולימוד

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| חיפוש ספר | `/BibleReader` | שדה `Search the books` | סינון מיידי של כותרות הספרים |
| מעבר בין הברית הישנה לחדשה | `/BibleReader` | כפתורי Old/New Testament | גלילה למקטע המתאים |
| בחירת ספר | `/BibleReader` | כרטיס ספר | מעבר למסך הפרקים של הספר |
| פתיחת פרק | `ChapterGrid` | מספר הפרק | `/Chapter?book=<number>&chapter=<number>` |
| פתיחת פסוק מקובץ | `/BibleReader` | קישור מספר פסוק בדף או פרק | `/Chapter?...&verse=<number>` |
| החלפת תרגום | `/Chapter` | `VersionPicker` | אותו פרק עם תרגום אחר |
| הצגת מספר Strong's | `/Chapter` בגרסת KJV+ | קוד כחלחל `(G/H####)` | `StrongsPopup` |
| פתיחת פסוק מהפניית מקרא | `VerseCrossRefs` | כפתור ההפניה | `VersePopup` או ניווט לפרק היעד |
| פתיחת פסוק מפנייה בצד | `BookSidebar`, `BookOutline`, `BookIntro` | קישור מקרא | `VersePopup` |
| קפיצה לחלק מספר ספר | `BookOutline` | כותרת או טווח פסוקים | `VersePopup` ובחירת הפסוק המתאים |
| הצגת תפילת מעבר | `/Chapter` | אייקון התפילה ב־`VerseActionBar` | כרטיס `PassagePrayer` inline |
| הצגת מחקר ותובנות לפי פסוק | `/Chapter` | `Commentary` או טאבים רלוונטיים | `PassageTabs` |
| הצגת הפניות | `/Chapter` | `Cross-refs` | `VerseCrossRefs` |
| הצגת משאבי הפרק | `/Chapter` | `Resources` | `ChapterResourcesPanel` |
| הפעלת הערה או הדגשה | `/Chapter` | `Highlight` / `Note` | יצירת `StudyMark` |
| יצירת הערה על טקסט לימוד | `BookSidebar` וממשקי `AnnotatedText` | בחירת טקסט ובחירת צבע/קו תחתון | `StudyAnnotation` |
| פתיחת חלונית שיתוף פסוק | `/Chapter` | `Share` | `ShareSheet` |
| פתיחת תפילת סיום פרק | `/Chapter` | אזור `Closing prayer` | תצוגה מלאה בתחתית הפרק |
| מעבר ליומן עם הקשר | `/Chapter` | `Journal` או יצירת הערה | `/Journal?new=1&book=...&chapter=...` |
| מעבר לתוכנית הקריאה | דאשבורד או `Plan` | יום בתוכנית | `/Chapter?book=...&chapter=...` |
| מעבר להערות המשתמש | `AppHeader` | `My notes` | `/BibleNotes` |

### 3.4 דווטיונים, תפילות וקהילה

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת דווטיון מלא | `/Devotionals` | כרטיס דווטיון | `/Devotionals?devotional=<code>` |
| סימון דווטיון כהושלם | `/Devotionals` | `Mark complete` | התקדמות מקומית ו־`DevotionalProgress` |
| שיתוף דווטיון | `/Devotionals` | `ShareRow` | חלונית/רכיב שיתוף לפי ערוץ |
| שמירת תפילה | `/PrayerLibrary` | אייקון סימון | `PrayerSaved` |
| הסרת תפילה מהמועדפים | `/PrayerLibrary` | אייקון סימון מלא | מחיקת `PrayerSaved` |
| פתיחת פסוק מתפילה | `/PrayerLibrary` | קישור המקרא | `/Chapter?...` |
| שיתוף תפילה | `/PrayerLibrary` | `ShareRow` | רכיב השיתוף |
| פתיחת דווטיון מהצעת היום | `/Home` | כרטיס devotional | `/Devotionals?devotional=<code>` |
| פרסום חזויה | `/CommunityRevelations` | `Share what God showed you` | יצירת `Revelation` |
| לייק חזויה | `/CommunityRevelations` | כפתור הלייק | עדכון `Revelation.likes` |
| פתיחת תגובות | `/CommunityRevelations` | כפתור `comment(s)` | רשימת תגובות inline |
| שליחת תגובה | `/CommunityRevelations` | טופס התגובה | יצירת `Revelation` עם `parent_id` |
| הצטרפות לקבוצת דיון | `/DiscussionGroups` | `Join group` | סימון מקומי ב־`localStorage` |
| שליחת הודעה לקבוצה | `/DiscussionGroups` | טופס הודעה | יצירת `DiscussionThread` |
| מעבר לשיעור חי | `/CommunityLiveTeaching` | `Join` | קישור חיצוני של המפגש |
| שליחת פנייה | `/Contact` | `Send message` | יצירת `ContactMessage` |
| שליחת שאלה | `/QA` | טופס השאלה | יצירת `QAEntry` במצב ממתין/פתוח |

### 3.5 שירי מקרא ונגן גלובלי

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| השמעת שיר | `/VerseSongs` | `Play` בכרטיס | `GlobalPlayer` בתחתית המסך |
| עצירה/המשך | `GlobalPlayer` | `Pause` / `Play` | שינוי מצב הנגן |
| מעבר לשיר הבא או הקודם | `GlobalPlayer` | חצים | שינוי האינדקס בתור |
| התקדמות ידנית | `GlobalPlayer` | לחיצה על פס ההתקדמות | `seek` בשניות |
| שינוי עוצמה/מהירות | `GlobalPlayer` | בקרות עוצמה ומהירות | עדכון הנגן |
| פתיחת סדרה | `/VerseSongs` | כרטיס סדרה | `/VerseSongSeries?series=<id>` |
| בחירת סדרה מסינון | `/VerseSongs` | `<select>` | עדכון רשת השירים |
| בחירת ספר מסינון | `/VerseSongs` | `<select>` | עדכון רשת השירים |
| שיתוף שיר | `/VerseSongs` | `Share` | `SongShareSheet` |
| הורדת קובץ השמעה | כרטיס שיר | `Download` | הורדת קובץ המדיה |
| סגירת הנגן | `GlobalPlayer` | `X` | ניקוי השיר הפעיל |

### 3.6 פעולות מנהל תוכן

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת חלכת תוכן | `/AdminDashboard` | `Books & Chapters` | מסך התקנות והמילון |
| בדיקת כיסוי פרקים | מסך התקנה | `Status` / `Audit` | `ChapterCoverage` ו־`LibraryReport` |
| התקנת לוגנדה | `/AdminDashboard` | `Install Luganda Bible` | `functions/lugandaInstall.js` |
| התקנת KJV+ | `/AdminDashboard` | `Install KJV+` | `functions/kjvInstall.js` |
| התקנת מילון Strong's | `/AdminDashboard` | `Install definitions` | `functions/strongsDefinition.js` |
| הוספת רשומה | `CollectionsPanel` | `Add` | `RecordEditor` |
| עריכת רשומה | `CollectionsPanel` | `Edit` | `RecordEditor` |
| מחיקת רשומה | `CollectionsPanel` | `Delete` | `ConfirmDialog` |
| אישור מחיקה | `ConfirmDialog` | `Delete` | בקשת מחיקה לשרת |
| ביטול מחיקה | `ConfirmDialog` | `Cancel` | סגירת המודאל |
| הוספת הפניית מקרא | `RecordEditor` | שדה סוג `refs` | `CrossRefEditor` |
| הוספת הפניה לרשימת העוגנים | `CrossRefEditor` | `Add` | עדכון הטקסט המאוחד |
| הסרת הפניה | `CrossRefEditor` | `X` בעוגן | עדכון הטקסט המאוחד |
| ייבוא JSON | `/AdminDashboard` | `JSON Import` | `JsonImportPanel` |
| העלאת קובץ | `JsonImportPanel` | בחירת קובץ | ניתוח ודיווח ייבוא |
| ייבוא קובץ ספר | `PrayerCrossRefImport` | `Upload book file` | הרחבת הקובץ לאוספים וכתיבתם |
| הוספת סדרת שירים | `VerseSongsPanel` | `Add series` | `VerseSongSeriesForm` בתוך `Modal` |
| הוספת שיר | `VerseSongsPanel` | `Add song` | `VerseSongForm` בתוך `Modal` |
| העלאת אודיו | `VerseSongForm` | בחירת קובץ | `Core.UploadFile` |
| העלאת עטיפת סדרה | `VerseSongSeriesForm` | בחירת תמונה | `Core.UploadFile` |
| ייבוא מרוב שירים | `VerseSongsPanel` | לשונית `Bulk upload` | `VerseSongBulkImport` |
| בחירת אוסף באוספים הגנריים | `CollectionsPanel` | `<select>` | טעינת רשומות האוסף |
| בחירת טאב תוכן לימוד | `PassagesPanel` | `Prayer passages` וכו' | החלפת האוסף והטבלה |

---

## 4. מבנה הקבצים

### 4.1 קובץ השורש

| קובץ | תפקיד |
|---|---|
| `Layout.jsx` | מעטפת האפליקציה. יוצר את `AuthProvider`, `ThemeProvider` ו־`PlayerProvider`, מוסיף את `BRAND_CSS`, מרנדר את `PwaHead`, הכותרת, תוכן הדף, כותרת תחתונית בדף הבית ואת הנגן הגלובלי. |

### 4.2 קבצי הדפים

כל קובץ בתיקיית `pages` מייצג מסך עצמאי. התפקידים המדויקים מפורטים בסעיף 2.

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

### 4.3 רכיבי הניהול

| קובץ | תפקיד ותוצר |
|---|---|
| `components/admin/ChapterCoverage.jsx` | מציג כיסוי פרקים לפי ספר, מפר טווחים רציפים בעזרת `compressChapters`, ומבדיל בין פרקים חסרים לפרקים שבורים |
| `components/admin/CollectionsPanel.jsx` | מנהל גנרי לכל אוספי התוכן: בחירת אוסף, חיפוש, יצירה, עריכה ומחיקה |
| `components/admin/ConfirmDialog.jsx` | מודאל אישור לפעולה הרסנית, בעיקר מחיקה |
| `components/admin/CrossRefEditor.jsx` | עורך הפניות מקרא כעוגנים; מוסיף, מסיר ומנקה כפילויות, ומחזיר ערך מאוחד |
| `components/admin/JsonImportPanel.jsx` | ייבוא JSON גנרי לפי אוסף, כולל aliases, תבנית, ולידציה, דיווח שגיאות וכתיבה חוזרת |
| `components/admin/KjvPlusInstaller.jsx` | מתקין KJV+ עם מספרי Strong's, מנהל מילון ומציג כיסוי ודוח ביקורת |
| `components/admin/LibraryReport.jsx` | מריץ ביקורת קריאה על מסד הנתונים ומציג חסרים, שגויים והפרשי מספר פסוקים |
| `components/admin/LugandaInstaller.jsx` | מתקין את התנ"ך הלוגנדה ומציג כיסוי לפי פרק |
| `components/admin/PassagesPanel.jsx` | מנהל תוכן לימוד לפי ארבעה אוספים: תפילות מעבר, הפניות, מבואות פרקים ומבואות ספרים |
| `components/admin/PrayerCrossRefImport.jsx` | ממשק ייבוא ממוקד לקובצי ספר, השוואת הקובץ למה שכבר מותקן, ודיווח לפי ספר ופרק |
| `components/admin/PrayersPanel.jsx` | מנהל ספריית התפילות או תפילות המעבר, עם בחירת ספר/פרק/פסוק ועריכה |
| `components/admin/RecordEditor.jsx` | טופס גנרי שנבנה ממידע השדות ב־`adminCollections`; מטפל בטקסט, מספרים, בוליאנים והפניות |
| `components/admin/VerseSongBulkImport.jsx` | מנתח ומאמת קובץ שירים מרובים לפני כתיבה, כולל התקדמות ודיווח שגיאות לפי שורה |
| `components/admin/VerseSongForm.jsx` | טופס שיר מקרא בודד: ספר, פרק, פסוק, גרסה, שפה, מטא-דאטה, מילים, העלאת אודיו ועטיפה |
| `components/admin/VerseSongSeriesForm.jsx` | טופס סדרת שירים, כולל העלאת עטיפה ושמירת השם בדיוק כפי שהוקלד |
| `components/admin/VerseSongsPanel.jsx` | מנהל שירי המקרא: שירים, סדרות וייבוא מרוב |

### 4.4 רכיבים משותפים

| קובץ | תפקיד ותוצר |
|---|---|
| `components/common/EmptyState.jsx` | מצב ריק אחיד עם אייקון, כותרת, תיאור ופעולה אופציונלית |
| `components/common/Modal.jsx` | מודאל גנרי; סוגר בלחיצה על הרקע או `Escape` ונועל גלילת גוף |
| `components/common/PageHeader.jsx` | כותרת עמוד אחידה בגרסת רגיל או Hero עם תמונת רקע |
| `components/common/Pagination.jsx` | מפעיל ניווט בין עמודים רק כאשר יש יותר מעמוד אחד |
| `components/common/ShareRow.jsx` | סרגל שיתוף לפי ערוצי Facebook, WhatsApp, Telegram, Instagram, LinkedIn והעתקה |
| `components/common/Spinner.jsx` | מצב טעינה אחיד עם `role="status"` ו־`aria-live` |

### 4.5 רכיבי קהילה, דאשבורד ויומן

| קובץ | תפקיד ותוצר |
|---|---|
| `components/community/CommentThread.jsx` | הצגת תגובות לחזויה וטופס תגובה למשתמש מחובר |
| `components/community/RevelationCard.jsx` | כרטיס חזויה: מחבר, מעבר, גוף, לייק ותגובות |
| `components/community/RevelationForm.jsx` | טופס פרסום חזויה, כולל מצב משתמש שאינו מחובר |
| `components/community/ThreadMessages.jsx` | הצגת ושליחת הודעות בקבוצת דיון |
| `components/dashboard/ActivityFeed.jsx` | פיד פעילות קריאה של המשתמש, עם צבע ואייקון לפי סוג הפעילות |
| `components/home/StatCard.jsx` | כרטיס מספרי סטטיסטיקה לדאשבורד |
| `components/insight/InsightsBoard.jsx` | לוח אחיד לתובנות תיאולוגיות והיסטוריות, עם חיפוש, שיתוף ושמירה מקומית |
| `components/journal/JournalCard.jsx` | כרטיס רשומת יומן עם עריכה, מחיקה, תאריך ומקרא |
| `components/journal/JournalForm.jsx` | טופס יצירה או עריכה של רשומת יומן, עם קטגוריה וקשר לפרק |

### 4.6 רכיבי מבנה והתקנה

| קובץ | תפקיד ותוצר |
|---|---|
| `components/layout/AppFooter.jsx` | כותרת תחתונית, קישורי ניווט, מותג, תרומה וטיפול בכשל טעינת לוגו |
| `components/layout/AppHeader.jsx` | ניווט ראשי ומשני, תפריט משתמש, התחברות/התנתקות, תפריט נייד וכפתורי מותג |
| `components/layout/GlobalPlayer.jsx` | נגן מדיה גלובלי עם תור, השמעה, קפיצה, חפש, עוצמה, מהירות, shuffle, repeat והרחבה |
| `components/layout/PwaHead.jsx` | הוספת meta tags, manifest, favicon, Apple touch icon ורישום service worker |
| `components/plan/PlanRow.jsx` | שורת יום בתוכנית הקריאה, כולל סטטוס וקישור לפרק |
| `components/song/SeriesCard.jsx` | כרטיס סדרת שירים ומספר השירים בה |
| `components/song/SongCard.jsx` | כרטיס שיר כהה, מידע מקרא, השמעה, הורדה ושיתוף |
| `components/song/SongFilters.jsx` | חיפוש וסינון שירים לפי סדרה וספר |
| `components/song/SongShareSheet.jsx` | חלונית שיתוף שיר עם טקסט מוכן וערוצי שיתוף |

### 4.7 רכיבי הקורא

| קובץ | תפקיד ותוצר |
|---|---|
| `components/read/AnnotatedText.jsx` | תצוגת טקסט הניתנת להדגשה ולקו תחתון, תוך חישוב segments לפי offsets |
| `components/read/BookGrid.jsx` | רשת 66 ספרים, חיפוש בשתי השפות והחלפת ברית |
| `components/read/BookIntro.jsx` | מבוא לספר, מקראי מפתח והפניות פותחות למודאל מקרא |
| `components/read/BookOutline.jsx` | חלוקת ספר וקפיצה לטווח פסוקים |
| `components/read/BookPrayerPanel.jsx` | תפילת ספר עם תצוגה דו-לשונית, הפניות והדגשות |
| `components/read/BookSidebar.jsx` | החלונית השמאלית של מסך הספר: מבוא, מתאר ותפילה |
| `components/read/BookStudyResources.jsx` | משאבי לימוד ברמת הספר: מחקר, תובנות תיאולוגיות והיסטוריות, עם pagination |
| `components/read/ChapterClosingPrayer.jsx` | תפילת סיום מלאה בתחתית פרק, כולל שיתוף והפניות |
| `components/read/ChapterGrid.jsx` | רשת בחירת פרק עם קישור לנתיב Chapter |
| `components/read/ChapterReaderPane.jsx` | עמודת הקריאה, תפריט מחקר והתאמת החלונית למסך רחב או נייד |
| `components/read/ChapterResourcesPanel.jsx` | תובנות תיאולוגיות והיסטוריות ברמת פרק, עם fallback לרמת הספר |
| `components/read/ChapterSelector.jsx` | מסך הספר: מבוא, מתאר, תפילה, רשת פרקים, הערות ומודאל מקרא |
| `components/read/ChapterSidebar.jsx` | חלונית הלימוד של פרק: מבוא, מחקר, תפילה והפניות |
| `components/read/CrossRefList.jsx` | רשימת הפניות מקרא ופתיחת היעד בקורא |
| `components/read/CrossRefScripture.jsx` | טקסט הפסוק שאליו מפנה הפניה; משתמש בטקסט השמור או טוען אותו בעת הצורך |
| `components/read/FloatingVerse.jsx` | מודאל קטן להצגת פסוק ומעבר לקורא המלא |
| `components/read/PassagePrayer.jsx` | תפילה המתאימה לפסוק או לטווח פסוקים, כולל מצבי שפה והתאמת references |
| `components/read/PassageTabs.jsx` | מחקר, תובנות ו־Q&A לפי פסוק |
| `components/read/ShareSheet.jsx` | הכנת טקסט מלא לשיתוף, העתקה והפניות לרשתות |
| `components/read/StrongsPopup.jsx` | מציג הגדרת Strong's ושומר העתקה מקומית לשימוש חוזר |
| `components/read/StrongsText.jsx` | מפרק קודי Strong's מתוך טקסט וממיר אותם לקישורים קליקביליים |
| `components/read/VerseActionBar.jsx` | סרגל הפעולות של פסוק |
| `components/read/VerseCrossRefs.jsx` | תצוגת הפניות המקרא של פסוק עם טקסט והערות |
| `components/read/VerseList.jsx` | רשימת פסוקים פשוטה ובחירת פסוק |
| `components/read/VersePopup.jsx` | מודאל מקרא בתוך הדף, המאפשר גם הדגשת טקסט |
| `components/read/VersionPicker.jsx` | התקנה, הסרה ובחירה של תרגומי מקרא |

### 4.8 קבצי `lib`

| קובץ | תפקיד |
|---|---|
| `lib/activity.js` | רישום פעילות קריאה; כתיבת כשל אינה מפילה את פעולת המשתמש |
| `lib/adminCollections.js` | מטא-דאטה של אוספי הניהול, שדות, תוויות, סוגי שדה ועזרי רשומה |
| `lib/adminDirect.js` | נתיב ניהול ישיר דרך entity SDK כאשר function gateway אינו זמין לדפדפן |
| `lib/adminSession.js` | התחברות מנהל, שמירת token, בדיקת הפעלה, חידוש, התנתקות ואיפוס סיסמה |
| `lib/app-params.js` | קריאת app id ו־app token בזמן אמת מ־`localStorage` |
| `lib/AuthContext.jsx` | מצב אימות משתמש, התחברות, התנתקות והפניה למסך התחברות |
| `lib/bibleApi.js` | טעינת פרקים, תרגומים, Strong's ו־offline; מנקה את המקורות ומנפח את התוצאה |
| `lib/bibleBooks.js` | נתונים סטטיים ל־66 הספרים: שם, קיצור, שם לוגנדה, מספר ספר ומספר פרקים |
| `lib/bookGuides.js` | מבוא ומתאר מובנה לכל ספר |
| `lib/bookImport.js` | זיהוי והרחבת קובצי ספר לאוספים ורשומות מנורמלים |
| `lib/bookIntro.js` | קריאת ונרמול מבוא ספר ותפילת סיום מהשרת או מהאחסון המקומי |
| `lib/bookPrayers.js` | תפילת ספר מובנית לכל ספר, כולל הפניות מקרא |
| `lib/bookStudyContent.js` | מחקר ותובנות מובנים לרמת הספר כגיבוי לתוכן הניהול |
| `lib/brandCss.js` | מערכת עיצוב מרכזית ומשתני CSS של האפליקציה |
| `lib/chapterIntros.js` | קריאה ונרמול מבואי פרקים |
| `lib/chapterStudy.js` | בניית מחקר, מבוא, תפילה ומקראי מפתח לפי פרק |
| `lib/contentApi.js` | מיפוי אוספים ציבוריים ל־entity SDK וטעינתם דרך React Query |
| `lib/crossRefs.js` | הפניות מקרא מוכנות למקראים נפוצים |
| `lib/format.js` | נרמול טקסט, פיצול רשימות, כותרות, משך, גודל קבצים ועזרי תצוגה |
| `lib/keyPassages.js` | מקראי מפתח לכל ספר |
| `lib/luganda.js` | פורמט תוכן לוגנדה וניקוי שמות מקורות שדלפו לתוך הטקסט |
| `lib/offlineDb.js` | מעטפת IndexedDB, יצירת stores, תיקון מבנה ישן ופעולות כתיבה/קריאה/מחיקה |
| `lib/planData.js` | תוכנית ברירת מחדל בת 30 יום על יוחן והמזמנים |
| `lib/player.jsx` | נגן אודיו גלובלי, תור, shuffle, repeat, מהירות, עוצמה ושגיאות |
| `lib/prayerImport.js` | פורמט קובצי תפילות/הפניות, aliases, ולידציה, טבלאות טבעה, ייבוא והורדת תבנית |
| `lib/prayerPassages.js` | טעינת ונרמול תפילות מעבר והפניות מקרא, כולל בחירת התאמה לפי פסוק |
| `lib/reading.js` | תאריכים, ימים, רצף קריאה וחישוב streak |
| `lib/readings.js` | רישום השלמת פרק וסגירת יום בתוכנית הקריאה |
| `lib/scriptureRefs.js` | פירוק, נרמול ופתרון של הפניות מקרא; בניית קישורים ו־inline nodes |
| `lib/seedContent.js` | תוכן גיבוי מובנה: דווטיונים, תפילות, תובנות, חזויות ועוד |
| `lib/sha256.js` | מימוש SHA-256 טהור ב־JavaScript לבדיקת סיסמת מנהל |
| `lib/share.js` | בניית טקסט וקישורי שיתוף לערוצים השונים והעתקה ללוח |
| `lib/strongs.js` | נרמול קודי Strong's, קביעת שפה וניתוב למילון |
| `lib/strongsOffline.js` | אחסון וקריאת מילון Strong's מהמכשיר |
| `lib/studyAnnotations.js` | טעינה, מיזוג ושמירת הדגשות/קווי תחתון בשרת וב־offline |
| `lib/textSelection.js` | מניעת פעולת קליק כאשר המשתמש באמצע לבחור טקסט |
| `lib/themeContext.jsx` | טעינת הגדרות אתר, חישוב גווני צל ועדכון משתני CSS |
| `lib/theme.js` | קבועי המותג, לוגו, favicon, תמונות Hero וקישורי תרומה |
| `lib/verseSongs.js` | נרמול סדרות ושירים, בניית אינדקס, תור, סינון ונתוני קישור לשיתוף |
| `lib/versions.js` | מרשם תרגומי המקרא, התקנה, הסרה והגדרת התרגום הפעיל |

### 4.9 קבצי שרת ותזמונים

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | התחברות מנהל, בדיקת סיסמה, הפקת token, חידוש הפעלה, התנתקות ואיפוס סיסמה |
| `functions/adminContent.js` | API ניהול תוכן מוגן ב־token; קריאה, יצירה, עדכון, מחיקה ופעולות נוספות לפי entity |
| `functions/bibleChapter.js` | שרת אחזור פרק מקרא ממקורות חיצוניים, ניקוי HTML ונרמול verses |
| `functions/content.js` | API ציבורי לקריאת אוספים וקבלת הגשות ציבוריות |
| `functions/kjvInstall.js` | התקנת KJV+ לפי פרק וניהול נתוני Strong's |
| `functions/lugandaInstall.js` | התקנת התנ"ך הלוגנדה לפי פרק |
| `functions/scriptureAudit.js` | ביקורת קריאה בלבד על כיסוי, תקינות, מספר פסוקים ומילון Strong's |
| `functions/strongsDefinition.js` | אחזור, נרמול ושמירת הגדרות Strong's ממקורות מילוניים |
| `cron/scriptureInstall.js` | משימת cron בכל שעה שמשליכה את התקנות החסרות ועוצרת כאשר אין התקדמות |

### 4.10 קבצי `public` ונכסים

| קובץ | תפקיד |
|---|---|
| `public/manifest.json` | הגדרות התקנת PWA: שם, צבעים, תצוגה, scope ואייקונים |
| `public/sw.js` | Service worker: cache-first עבור app shell ותמונות, network-first עבור שאר הבקשות |
| `public/assets/media-library/0dbaf742d3ba_Prayer-Crossrefs-Template.json` | תבנית רשמית לייבוא תפילות והפניות |
| `public/assets/media-library/f830b722d892_OBADIAH-PRAY-READ-BULK-IMPORT.json` | קובץ ייבוא לדוגמה עבור ספר אובדיה |
| `public/assets/media-library/4345fa1c4c79_icon-512x512.png` | אייקון האפליקציה המרכזי |
| `public/assets/media-library/ee6ae196bbbc_favicon.ico` | Favicon |
| `public/assets/media-library/b8660c2286d0_PrayRead-logo-2.png` | לוגו נוסף |
| `public/assets/media-library/b50e6c213bb8_pray-read-pneuma-main-3.zip` | ארכיב פריסה/מקור מאוחד |
| קבצי `*.pdf`, `*.md` תחת `public/assets/media-library` | מסמכי עיצוב, הנחיות ודוגמאות; אינם חלק מלוגיקת הריצה |
| `public/assets/generated_*.png` | נכסי תמונה שנוצרו אוטומטית עבור דפים ורקעים |
| `public/assets/ingested/*` | נכסים שהוזנו ממקור חיצוני |
| קבצי `*_image.png` תחת `public/assets/media-library` | תמונות תוכן, עטיפות, רקעים ואייקונים לפי שימושי העמודים |

### 4.11 קבצים ארכיוניים שאינם חלק מהפרודקשן

- `__trash/`  -  גרסאות ישנות, דפי בדיקה וכלי debug זמניים.
- `__url_fetch/`  -  עותקי HTML/JSON של אתרים חיצוניים שנשמרו לצורך מחקר והנדסה.

הקבצים בתיקיות אלה אינם צריכים להיכלל ב־build או בפריסה, ומומלץ להסיר או להעביר אותם מחוץ ל־source tree.

### 4.12 CSS

| קובץ | תפקיד |
|---|---|
| `__generated/tailwind.css` | קבוצת utility classes שנוצרה אוטומטית, למשל flex, grid, spacing, visibility ו־width |
| `lib/brandCss.js` | מערכת העיצוב הראשית, כולל משתני צבע, סגנון כרטיסים, כפתורים, טפסים, modal, header, footer ונגן |

---

## 5. מודל הנתונים  -  Entities

### 5.1 עקרונות מרכזיים

- רוב הישויות מוגדרות ב־`entities/*.json`.
- רשומות כוללות שדה `id` שניתן על ידי הפלטפורמה.
- רבות מהישויות משתמשות ב־`owner_email` כדי להפריד בין משתמשים.
- רבות מהישויות משתמשות ב־`created_date` ו־`updated_date` שנוספים אוטומטית.
- אין בקוד הנראה אילוצי foreign key מלאים; הקשרים מיושמים ברמת האפליקציה באמצעות מספרי ספר, פרק, פסוק, קוד ושם.
- לפני ייבוא או עדכון יש להשתמש במפתח טבעי כדי למנוע כפילויות.

### 5.2 תיאור הישויות

| Entity | מטרה | שדות מרכזיים | קשרים ומפתח טבעי |
|---|---|---|---|
| **ActivityLog** | יומן פעילות במנהל התוכן | `actor`, `action`, `section`, `detail` | מזהה את הפעולה ואת המנהל/גורם שביצע אותה |
| **AdminAccount** | רשומת התחברות מנהל | `email`, `password_hash`, `salt`, `secret`, `session_version`, `updated_date` | רשומה יחידה או מספר רשומות מנהל; `email` הוא מזהה תחברות |
| **BibleVerse** | פסוק מקרא במסד הנתונים | `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu` | מפתח טבעי: ספר + פרק + פסוק; ישן יחסית לרשומות הפרקים המאוחסנות |
| **BookIntro** | מבוא ספר ותפילת סיום | `book_number`, `book_name`, `title_en`, `title_lu`, `intro_en`, `intro_lu`, `closing_prayer_en`, `closing_prayer_lu`, מקור | מפתח טבעי: `book_number`; הפניות מקרא נשמרות בתוך הטקסט |
| **ChapterIntro** | מבוא לפרק מסוים | `book_number`, `book_name`, `chapter`, `title_en`, `title_lu`, `intro_en`, `intro_lu`, `source` | מפתח טבעי: `book_number + chapter` |
| **Commentary** | מחקר המקשר לספר ופרק | `book`, `chapter`, `title`, `body_en`, `body_lu` | מקור ל־`PassageTabs` ול־`BookStudyResources`; הקשר מיושם לפי שם ספר ופרק |
| **ContactMessage** | פנייה מהטופס הציבורי | `name`, `email`, `subject`, `message`, `is_read`, `reply` | נוצר על ידי גולש; ניהולו מוגבל למנהלים |
| **CrossReference** | הפניה מפסוק לפסוק אחר | ספר/פרק/פסוק מקור, `ref_book_number`, `ref_chapter`, `ref_verse`, טקסט יעד בעברית ובלוגנדה, הערות | קשר לוגי מהפסוק המקורי לפסוק היעד; מפתח טבעי משולב משתי הצדדים |
| **Devotional** | דווטיון יומי | `code`, כותרות, `scripture`, `scripture_lu`, `body`, `body_lu`, `related`, `further_readings`, `cover_image`, יום וקטגוריה | `code` הוא מזהה יציב ומשמש גם להתקדמות |
| **DevotionalProgress** | סימון דווטיון כהושלם | `owner_email`, `devotional_code`, `completed_date` | קשר לוגי ל־`Devotional.code`; מפתח: בעל + קוד |
| **DiscussionGroup** | קבוצת לימוד | `name`, `description`, `schedule`, `member_count` | שם הקבוצה משמש מזהה לוגי להודעות |
| **DiscussionThread** | הודעה בקבוצה | `group_name`, `owner_email`, `author_name`, `title`, `body` | קשר ל־`DiscussionGroup` לפי `group_name` |
| **Insight** | תובנה תיאולוגית או היסטורית | `kind`, `title`, `passage`, `excerpt`, `body`, `share_count` | `kind` מפריד בין `theological` ל־`historical`; אין מזהה מקרא חובה |
| **JournalEntry** | רשומת יומן תפילה | `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood` | שייך למשתמש; הפרק הוא קישור לוגי ולא חובה |
| **KjvPlusChapter** | פרק KJV+ עם Strong's | `book_number`, `book`, `chapter`, `verse_count`, `verses` | `verses` הוא JSON של פסוקים; מפתח: ספר + פרק |
| **LiveSession** | שיעור חי עתידי | `title`, `session_date`, `host`, `join_link`, `description` | רשומה עצמאית; `join_link` מוביל לשירות חיצוני |
| **LugandaChapter** | פרק בתנ"ך הלוגנדה | `book_number`, `book`, `chapter`, `verse_count`, `verses` | `verses` הוא JSON של פסוקים; מפתח: ספר + פרק |
| **Prayer** | תפילה בספריית התפילות | `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref`, `cross_refs` | ה־title משמש גם כמזהה לשמירה במועדפים |
| **PrayerPassage** | תפילה לפרק, טווח או פסוק | `book_number`, `book_name`, `chapter`, `verse`, `verse_end`, כותרות ותפילות בשתי שפות | `verse=0` מייצג תפילת סיום לכל הפרק; מפתח: ספר + פרק + פסוק + סוף טווח |
| **PrayerSaved** | תפילה במועדפי המשתמש | `owner_email`, `prayer_title` | קשר לוגי ל־`Prayer.title`; מפתח: בעל + כותרת |
| **QAEntry** | שאלה ותשובה | `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email` | `status` מבדיל בין שאלה ממתינה לתשובה מפורסמת |
| **Reading** | פרק שהושלם | `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses` | קשר למשתמש וליום בתוכנית; ה־highlighted verses נשמרים כמחרוזת |
| **ReadingActivity** | פעולת קריאה בודדת | `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse` | מזהה את המשתמש ואת סוג הפעילות |
| **ReadingPlan** | יום בתוכנית הקריאה | `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture` | `day` הוא מפתח; `Reading.plan_day` מקשר ליום |
| **Revelation** | חזויה או תגובה לחזויה | `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id` | `parent_id` מחבר תגובה לחזויית אב; רשומות ללא `parent_id` הן פוסטים |
| **SiteSettings** | הגדרת אתר גלובלית | `setting_key`, `setting_value` | מודל key/value; למשל צבעי מותג, שם האתר וקישור תרומה |
| **StrongEntry** | מילון מספר Strong's | `code`, `language`, `original_word`, `transliteration`, `pronunciation`, `part_of_speech`, `root_word`, `definition`, `source` | `code` הוא מפתח טבעי; הקוד מנורמל ל־`G1234` או `H1234` |
| **StudyAnnotation** | הדגשה או קו תחתון בחומר לימוד | `owner_email`, `book_number`, `book`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset` | מזהה בלוק טקסט וטווח תווים; משמש גם באחסון המקומי |
| **StudyMark** | סימון או הערה בפסוק | `owner_email`, `mark_type`, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text` | משתמש ב־`mark_type` כדי להבחין בין highlight, bookmark ו־note |
| **VerseOfDay** | פסוק לתאריך מסוים | `verse_date`, `reference`, `text_en`, `text_lu`, `note` | מפתח טבעי: `verse_date` |
| **VerseSongEpisode** | שיר מקרא בתוך סדרה | `series_name`, `title`, `book_name`, `book_number`, `chapter`, `verse`, `verse_ref`, `language`, `version`, משך, כתובת אודיו ועטיפה, מילים, סדר ו־active | קשר ל־`VerseSongSeries` לפי `series_name`; בפועל רצוי להוסיף `series_id` אם רוצים קשר יציב |
| **VerseSongSeries** | סדרת שירי מקרא | `name`, `description`, `thumbnail`, `cover_image`, `accent`, `active` | השם הוא מזהה לוגי; שמו נשמר בדיוק כפי שהמנהל הקליד |

### 5.3 קבוצות הרשאות

#### קריאה ציבורית

רשומות תוכן, הפניות, מבואות, מחקרים, מילון Strong's, שירים, סדרות, אירועים ותוכנית הקריאה ניתנות לקריאה על ידי גולשים.

#### כתיבה של משתמש מחובר

המשתמש יכול לכתוב ולנהל בעיקר נתונים השייכים לו:

- `JournalEntry`
- `PrayerSaved`
- `DevotionalProgress`
- `Reading`
- `ReadingActivity`
- `StudyMark`
- `StudyAnnotation`
- `Revelation`
- `DiscussionThread`
- `QAEntry`

#### ניהול

`owner` ו־`admin` יכולים לנהל תוכן, חשבונות מנהל, פניות, היסטוריה וגישה לנתונים רגישים.

### 5.4 יחסים מרכזיים

```text
AdminAccount ── מזהה את ──> AdminDashboard

Devotional ── code ──> DevotionalProgress
Prayer ── title ──> PrayerSaved
ReadingPlan.day ──> Reading.plan_day
Bible book/chapter ──> ChapterIntro
Bible book/chapter ──> PrayerPassage
Bible verse ──> CrossReference ──> target Bible verse
Bible book/chapter ──> Commentary
Bible book/chapter ──> Reading
User ──> JournalEntry
User ──> StudyMark
User ──> StudyAnnotation
User ──> ReadingActivity
Revelation.parent_id ──> Revelation
VerseSongSeries.name ──> VerseSongEpisode.series_name
BookIntro.book_number ──> book-level prayer/cross-reference material
StrongEntry.code ──> Strong's marker in KjvPlusChapter.verses
```

> חלק מהיחסים הם יחסים לוגיים בלבד. למשל, `PrayerSaved.prayer_title` אינו foreign key, ולכן שינוי שם תפילה עלול להשאיר מועדפים ישנים מנותקים.

---

## 6. תהליכים ואינטראקציות מרכזיות

### 6.1 קריאת פרק מקרא

1. המשתמש נכנס ל־`BibleReader`.
2. בוחר ספר מתוך הרשת או מחפש לפי שם/קיצור.
3. בוחר פרק מתוך `ChapterGrid`.
4. הדפדפן מנווט ל־`/Chapter?book=<book_number>&chapter=<chapter>`.
5. `Chapter` קורא את פרמטרי ה־URL ואת הגרסה הפעילה.
6. `fetchChapter` טוען:
   - פרק מותקן במסד הנתונים, אם קיים.
   - מקור חיצוני, אם נדרש.
   - עותק מקומי, כשאין רשת.
7. הפרק מנורמל לרשימת פסוקים.
8. ב־KJV+ קודי Strong's מופרדים מהטקסט ומוצגים כקישורים.
9. הפעולה נרשמת ב־`ReadingActivity`.
10. המשתמש יכול:
    - לבחור פסוק.
    - להדגיש או לסמן.
    - לכתוב הערה.
    - להוסיף בוקמרק.
    - לפתוח תפילה.
    - לפתוח הפניות.
    - לפתוח מחקר.
    - לשתף.
11. בסיום/סימון הפרק נשמרת רשומת `Reading`.
12. אם הפרק נמצא בתוכנית הקריאה, יום התוכנית מסומן כהושלם.

### 6.2 שמירת הדגשה, קו תחתון והערה

#### הערה בפסוק

1. המשתמש בוחר פסוק.
2. `VerseActionBar` מאפשר לבחור צבע או לפתוח שדה הערה.
3. נוצר `StudyMark` עם:
   - ספר, פרק ופסוק.
   - סוג `highlight` או `note`.
   - צבע וטקסט הערה.
4. הרשומה מופיעה ב־`BibleNotes`.
5. קיצור מחזיר את המשתמש לאותו פסוק.

#### הדגשת טקסט לימוד

1. המשתמש בוחר טקסט בתוך `AnnotatedText`.
2. הרכיב מחשב את `start_offset` ו־`end_offset`.
3. נוצר `StudyAnnotation` עם:
   - ספר.
   - מקטע (`intro`, `outline`, `prayer`, `verse`).
   - מזהה בלוק.
   - סוג (`highlight` או `underline`).
   - צבע.
   - טווח תווים.
4. ההערה נשמרת בשרת וב־IndexedDB.
5. בטעינה הבאת ההערות ממוזגות עם הערות המכשיר כדי לשמור על המצב המלא.

### 6.3 התקנת התנ"ך הלוגנדה

1. המנהל נכנס ל־`AdminDashboard`.
2. בוחר `Luganda Bible`.
3. הלקוח מבטיח שההפעלה עדכנית באמצעות `ensureFreshAdminToken`.
4. `LugandaInstaller` שולח פעולת `status` או `install` ל־`functions/lugandaInstall.js`.
5. השרת קורא את הפרקים שכבר קיימים ב־`LugandaChapter`.
6. רק פרקים חסרים מתווספים לעיבוד.
7. כל פרק מורד, מנוקח ונשמר עם `book_number`, `chapter`, `verse_count` ו־`verses`.
8. הלקוח מציג כיסוי מתעדכן דרך `ChapterCoverage`.
9. אם אין התקדמות, התהליך נעצר כדי לא להפציץ את המקור.
10. משימת `cron/scriptureInstall.js` ממשיכה לבצע ניסיונות חוזרים כל שעה.

### 6.4 התקנת KJV+ ומילון Strong's

1. המנהל בוחר `KJV+ with Strong's`.
2. `KjvPlusInstaller` קורא את מצב ההתקנה ואת המילון.
3. השרת מתקין פרקים חסרים מהמקור הציבורי.
4. קודי Strong's נשמרים כחלק מטקסט הפסוק.
5. במקום אחר נמצא המילון מ־Open Scriptures ומ־Blue Letter Bible.
6. כל קוד מנורמל לפני שמירה.
7. בלחיצה על קוד בקורא פותחת `StrongsPopup`.
8. ההגדרה נשמרת גם במסד הנתונים וגם באחסון המקומי.
9. `LibraryReport` מציג את מצב הכיסוי, הפרקים השבורים, פערי מספר פסוקים ומילון ה־Strong's.

### 6.5 התחברות מנהל וניהול תוכן

1. `Admin` קורא ל־`adminSessionCheck`.
2. אם הפעלה תקפה, המשתמש מועבר ישירות ל־`AdminDashboard`.
3. אחרת הוא מזין דוא"ל וסיסמה.
4. `adminSession` מנסה תחילה את שרת `adminAuth`.
5. אם function gateway אינו פתוח לדפדפן, הוא עובר ל־`adminDirect`.
6. הנתיב הישיר משתמש בהרשאות המשתמש המחובר ב־entity SDK.
7. לאחר הצלחה נשמר:
   - `pr_admin_token`
   - `pr_admin_mode`
8. `AdminDashboard` מתקיים פעילות keep-alive ומאפשר חידוש הפעלה.
9. פעולות תוכן עוברות דרך `callAdminData`, שמסתיר את ההבדל בין שרת לנתיב ישיר.

### 6.6 יצירה ועריכה של רשומה גנרית

1. המנהל בוחר אוסף.
2. `CollectionsPanel` קורא עד 500 רשומות.
3. לחיצה על `Add` או `Edit` פותחת `RecordEditor`.
4. הטופס נבנה מ־`COLLECTION_BY_ID[collection].fields`.
5. כל שדה מוגדר כ־`[name, label, type]`.
6. שדה מסוג `refs` מרונד את `CrossRefEditor`.
7. לחיצה על `Save` שולחת יצירה או עדכון.
8. לאחר הצלחה הרשומות נטענות מחדש.
9. מחיקה מחייבת אישור ב־`ConfirmDialog`.

### 6.7 ייבוא JSON

1. המנהל בוחר קובץ JSON.
2. הקובץ מנותח ומזוהה לפי:
   - פורמט רגיל של אוספים.
   - פורמט תפילות והפניות.
   - פורמט קובץ ספר.
3. שמות אוספים חלופיים ממופים לשמות הרשמיים.
4. הקובץ נבדק לפני כתיבה.
5. כל רשומה מוצמת למפתח טבעי:
   - קוד דווטיון.
   - שם תפילה.
   - ספר + פרק.
   - פסוק מקור + פסוק יעד.
   - ספר + פרק + טווח תפילה.
6. רשומה קיימת מתעדכנת; רשומה חדשה נוצרת.
7. דוח מציג כמה רשומות נוצרו, עודכנו, דולגו או נכשלו.

### 6.8 השמעת שיר מקרא

1. המשתמש נכנס ל־`VerseSongs` או לסדרה מסוימת.
2. `buildSongIndex` מחבר בין `VerseSongSeries` לבין `VerseSongEpisode`.
3. `filterSongs` מסנן לפי חיפוש, סדרה וספר.
4. `buildQueue` בונה תור מתוך התוצאות.
5. לחיצה על `Play` קוראת ל־`playQueue` או `loadQueue`.
6. `PlayerProvider` מעביר את ה־URL לאודיו אחד גלובלי.
7. המשתמש יכול לעבור בין שירים, להשתמש ב־shuffle/repeat, לשנות מהירות ולעבור לעמוד אחר בזמן ההשמעה.
8. `GlobalPlayer` מוצמד לתחתית המסך ומוסיף class ל־`body` כדי לשמור על מרחב פנוי.

### 6.9 הורדה וקריאה לאופליין

1. המשתמש נכנס ל־`Offline`.
2. בוחר קטגוריה: פרקים, פסוקים, Strong's, דווטיונים, מחקרים, תפילות, הפניות, Q&A או פסוק היום.
3. ההורדה מושכתת נתונים מהשרת ומכניסה אותם ל־IndexedDB.
4. `BibleReader` סופר כמה פרקים קיימים לכל ספר ומחשב זמינות מלאה.
5. בעת קריאה ללא רשת, `bibleApi` מחזיר את העותק המקומי.
6. המשתמש יכול למחוק חלק מהנתונים או את כל האחסון.
7. `public/sw.js` מאפשר לפתוח את נתיבי האפליקציה גם ללא רשת.

### 6.10 פעילות קהילה

#### חזויה ותגובה

1. משתמש מחובר ממלא כותרת, מעבר וגוף.
2. נוצר `Revelation` ללא `parent_id`.
3. משתמש אחר יכול:
   - ללחוץ על לייק.
   - לפתוח את התגובות.
   - להוסיף `Revelation` עם `parent_id` של הפוסט.

#### קבוצת דיון

1. המשתמש בוחר קבוצה.
2. הצטרפות נשמרת מקומית ב־`localStorage`.
3. הודעות נטענות מ־`DiscussionThread`.
4. משתמש מחובר שולח הודעה חדשה עם `group_name` ופרטי המחבר.

### 6.11 תוכנית קריאה ויומן

1. המשתמש פותח יום בתוכנית.
2. הוא מועבר לפרק המתוכנן.
3. לאחר סימון השלמת הפרק נוצרת רשומת `Reading` עם `plan_day`.
4. `Plan` מחשב את הימים שהושלמו ואת היום הנוכחי.
5. מהיומן ניתן לפתוח טופס עם `book` ו־`chapter` מוכנים.
6. רשומת יומן נשמרת עם `owner_email`, ולכן היא ניתנת לשליטה רק במסגרת המשתמש.

---

## 7. הערות טכניות לפיתוח

### 7.1 ספריות ותשתיות

| ספרייה/טכנולוגיה | שימוש |
|---|---|
| React | רכיבי UI, hooks, context ו־state מקומי |
| React Router | ניתוב בין דפים, פרמטרי URL, מצב ניווט |
| TanStack React Query | טעינת נתונים מהשרת, cache, stale time, retry ו־invalidation |
| `lucide-react` | סמלי ממשק אחידים |
| `date-fns` | תאריכים, ימים, streak ותוויות תאריך |
| Fine Structure/FSe2 SDK | אימות, entities, functions, app token והעלאת קבצים |
| IndexedDB | אחסון אופליין |
| Web Crypto / SHA-256 | אימות וחתימת session token וסיסמת מנהל |
| Deno runtime | הרצת קובצי `functions/` ו־`cron/` |
| Service Worker API | מטמון והתקנת PWA |
| CSS variables | ערכת נושא חיה ושינוי צבעים מהניהול |
| Tailwind utility subset | מחלקה קיימת ב־`__generated/tailwind.css`; רוב העיצוב מגיע מ־`brandCss.js` |

### 7.2 דפוסים חוזרים

#### הפרדת state מקומי ל־server state

- state מקומי מתאים למצב טפסים, פתיחת תפריטים ובחירות.
- נתוני שרת נשלטים דרך React Query.
- לאחר כתיבה יש לקרוא ל־`invalidateQueries`, ולא לעדכן רק copy מקומית.

#### מפתחות React Query

מפתחות Query צריכים לכלול את כל הפרמטרים שמשנים את התוצאה, למשל:

- ספר ופרק.
- שפה.
- מזהה התרגום.
- סוג התוכן.
- דוא"ל המשתמש.

דוגמאות מרכזיות בקוד:

- `["chapterInsights"]`
- `["cross-ref-scripture", bookNumber, chapter, language, versionId]`
- `["installedPassages", bookNumber, chapter]`
- `["readingActivity", email]`
- `["studyMarks", email]`

#### עיקרון "המקור החי מנצח"

כאשר יש מסד נתונים, עדיף להשתמש בו. כאשר אין, המערכת עוברת לתוכן מובנה או למקור חיצוני. עם זאת, חלק מהדפים עדיין משתמשים ב־fallback מקומי גם כאשר יש רשומות חיות, ולכן יש לבדוק אם הכוונה היא "מיזוג" או "החלפה מלאה".

#### דו-לשוניות

- שדות תוכן: סיומת `_en` או `_lu`.
- מצבי תצוגה: `en`, `lu`, `both`.
- כל פונקציית fallback צריכה להגדיר מה להציג כאשר תרגום אחד חסר.
- בייבוא עדיף לשמור על שפה ריקה כדי לא לדרוס מידע קיים.

#### מפתחות טבעיים

לפני עדכון רשומה יש לאתר אותה לפי מפתח טבעי. דוגמאות:

- Devotional: `code`.
- Prayer: `title`.
- BookIntro: `book_number`.
- ChapterIntro: `book_number + chapter`.
- PrayerPassage: ספר + פרק + פסוק + סוף טווח.
- CrossReference: פסוק מקור + פסוק יעד.
- StrongEntry: `code`.
- VerseOfDay: `verse_date`.

#### מטמון מקומי

- מפתחות IndexedDB צריכים לכלול תרגום ו־מזהה מספר ספר.
- מחיקת/החלפת תרגום אינה צריכה למחוק עותקים של תרגומים אחרים.
- בעת שינוי מבנה `offlineDb` יש להגדיל את `DB_VERSION` ולוודא שהמערכת מוסיפה stores חדשים בלי למחוק נתונים קיימים.

#### PWA

- כל שינוי בקבצי ה־app shell דורש עדכון גרסת cache.
- `public/sw.js` משתמש כרגע בגרסות `prayread-shell-v2` ו־`prayread-runtime-v2`.
- יש לבדוק שה־service worker אינו מציג גרסה ישנה של מעטפת האפליקציה לאחר deploy.

### 7.3 מה לבדוק בעת הוספת פיצ'ר

#### הוספת דף

1. ליצור `pages/NewPage.jsx`.
2. להוסיף נתיב לניווט ראשי או משני.
3. להוסיף את הנתיב ל־`SHELL` ב־`public/sw.js` אם הוא אמור לעבוד לאופליין.
4. להוסיף טיפול במצב משתמש לא מחובר, אם נדרש.
5. להוסיף טסטים מקומיים ו־seed content רק אם הדף אמור לעבוד ללא מסד נתונים.
6. לוודא שה־footer מוצג רק בדפים שאמורים להציג אותו.

#### הוספת Entity

1. ליצור `entities/NewEntity.json`.
2. להגדיר שדות, סוגים, `required` והרשאות.
3. להוסיף את ה־entity ל־`lib/contentApi.js` אם הוא צריך להיות ציבורי.
4. להוסיף אותו ל־`MANAGED` ב־`lib/adminDirect.js` אם הוא צריך ניהול ישיר.
5. להוסיף metadata ב־`lib/adminCollections.js` אם הוא צריך טופס ניהול.
6. להוסיף normalizer ו־natural key בקובץ ה־domain הרלוונטי.
7. להוסיף תמיכת ייבוא וייצוא.
8. להוסיף IndexedDB store אם הוא צריך לעבוד אופליין.
9. להגדיל את גרסת `offlineDb`.

#### הוספת שדה ל־Entity קיים

יש לעדכן יחד:

- סכמת ה־entity.
- `adminCollections`.
- normalizer.
- טופס ייבוא.
- טופס ייצוא.
- fallback/seed content.
- מסכי הצגה רלוונטיים.

#### הוספת תרגום מקרא

1. להוסיף ל־`lib/versions.js`.
2. להגדיר את מזהה התרגום, שפתו, שם המקור והאם הוא נושא Strong's.
3. להוסיף נתיב טעינה ב־`lib/bibleApi.js`.
4. להוסיף entity או מקור אחסון ייעודי.
5. להוסיף התקנה, ביקורת ו־offline download.
6. לוודא שמפתח ה-cache כולל את `versionId`.

#### הוספת סוג תוכן ציבורי

- להוסיף אותו ל־`READERS` של `lib/contentApi.js`.
- להוסיף switch-case תאום ב־`functions/content.js`.
- לוודא הרשאת קריאה ציבורית.
- להוסיף fallback מקומי.
- לוודא שה־entity נכלל ברשימת ה־admin המתאימה.

### 7.4 נקודות Debug חשובות

| נתיב | מה לבדוק |
|---|---|
| Network tab | קריאות entity SDK, invoke של functions והורדות ממקורות חיצוניים |
| React Query cache | stale data, query key שגוי, retry כושל ו־`invalidateQueries` |
| `localStorage` | `pr_admin_token`, `pr_admin_mode`, app token, מצב התקנת PWA, דווטיונים שהושלמו, קבוצות שהצטרפו אליהן |
| IndexedDB | מסד `prayread-offline`, גרסה 8, stores ו־records לפי `book_number`, שפה ותרגום |
| Service Worker | cache versions, קבצי shell, אסטרטגיית network-first/cache-first |
| `adminSession` | האם המצב הוא `server` או `direct`, תוקף ה־token והצלחת renewal |
| `bibleApi` | האם הפרק נטען מהשרת, מהמקור החיצוני או מה־offline |
| `prayerPassages` | התאמת טווח פסוקים לפסוק הנבחר |
| `strongs` | נרמול הקוד לפני חיפוש והאם קיימת גרסה מקומית |
| `VerseSong` | תקינות URL האודיו, תור, מצב `error` ו־`ready` |
| `brandCss` ו־`ThemeContext` | עדכון משתני CSS לאחר שינוי הגדרות האתר |

### 7.5 סיכונים טכניים שמומלץ לטפל בהם

#### 1. סודות ברירת מחדל קבועים

ב־`functions/adminAuth.js` קיימים fallback קבועים לסיסמת מנהל ולמפתח איפוס. אין להשאיר אותם בפרודקשן.

יש ל:

- להגדיר את הסודות כ־environment secrets.
- למחוק את ברירות המחדל או להפעיל אותן רק בסביבת פיתוח מבודדת.
- לבצע סיבוב מיידי לסיסמה ולמפתח שחשפו בקוד.
- להחליף את סכמת salted SHA-256 ב־Argon2id, scrypt או PBKDF2 עם עלויות מתאימות.
- להגביל את מספר ניסיונות ההתחברות ולהוסיף rate limiting.

#### 2. בדיקת קובץ עטיפה שגויה

ב־`VerseSongSeriesForm` נראה שהבדיקה לעטיפת סדרה משתמשת ב־regex של קובצי אודיו (`mp3`, `m4a`, `wav`). זו כנראה טעות, משום שעטיפה אמורה להיות תמונה. יש להפריד בדיקות MIME וסיומת לקבצי תמונה.

#### 3. זיהוי משתמש לא מחובר

ב־`AuthContext.checkAuth` מוגדר `isAuthenticated` ל־`true` לאחר `fse2.auth.me()` גם אם הפונקציה מחזירה ערך ריק מבלי לזרוק שגיאה. מומלץ לבדוק גם את עצמו של המשתמש:

```text
currentUser ? true : false
```

#### 4. גבולות רשימות

חלק מהרשימות מוגבלות ל־200, 300 או 500 רשומות. ככל שהארכיב יגדל, המשתמש עלול לא לראות תוכן ישן. יש להוסיף pagination או cursor-based loading לפני שהכמויות גדלות.

#### 5. כפילויות בייבוא

ה־direct admin path עלול ליצור כפילויות אם אין לו כלל natural-key זהה. יש לוודא שכל אוסף רשומות ניהול מוגדר עם אסטרטגיית upsert עקבית.

#### 6. אין foreign keys

מחיקת תפילה או סדרה אינה מוחקת באופן אוטומטי מועדפים, הודעות קבוצה או אירועים. אם נדרשת שלמות נתונים, יש להוסיף cleanup או להעביר למזהי יציבים כגון `series_id`.

#### 7. פירוש הפניות מקרא

הפונקציות `parseReference` ו־`matchesPassage` מבצעות ניתוח טקסטואלי. שמות כמו `1 John`, `Psalm` ו־טווחים עשויים לדרוש מקרים מיוחדים. כדאי להוסיף בדיקות יחידה לכל צורת הפניה.

#### 8. חילוץ מספר ספר מ־Verse of the Day

ב־`VerseOfDay` מזוהה מספר הספר לפי המספר הראשון שמופיע בהפניה. הפניה כמו `1 John 3:16` עלולה להפיק מספר `1` במקום את מספר הספר הנכון. מומלץ להשתמש ב־`parseReference`.

#### 9. תלות במקורות חיצוניים

- bible-api.com
- WordPlanet
- Blue Letter Bible
- Open Scriptures

עלולים לשנות markup, מבנה URL או זמינות. לכן:

- יש להוסיף בדיקות parser.
- לשמור fallback מקומי.
- לא להסתמך על ניסוח אתר ללא נרמול.
- להגביל קצב בקשות בהתקנות.

#### 10. נכסי Base64 ורפו

חלק מקבצי `public/assets` מוגשמים כ־data URI. קבצים כאלה יכולים להגדיל את הרפו, להאט את build וליצור כפילויות של נכסים. מומלץ לשמור קבצי תמונה/מדיה כקבצים בינאריים רגילים.

#### 11. נגישות מודאלים

`Modal` מטפל ב־`Escape` ובחסימת גלילת גוף, אך אין נראה focus trap, החזרת מיקום הפוקוס או `aria-describedby`. מומלץ להוסיף ניהול מיקום מיקוד למקלדת.

#### 12. דיוק בפענוח HTML

`safeText` מנטרל ערכים שאינם מחרוזת, אך אינו מנקה HTML. כרגע React מציג את הטקסט כטקסט ולכן מספיק. אם בעתיד יופעל `dangerouslySetInnerHTML`, חובה להוסיף sanitizer כגון DOMPurify.

### 7.6 ניקיון מומלץ לפני production

1. להסיר את `__trash/`.
2. לא לפרוס את `__url_fetch/`.
3. למחוק probes, smoke tests וכלי debug זמניים.
4. להסיר סודות ברירת מחדל.
5. להגדיר secrets בסביבת הפריסה.
6. להגדיל את מספרי גרסת ה־service worker בכל deploy משמעותי.
7. לבצע בדיקות יחידה ל־`compressChapters`, `parseReference`, `matchesPassage`, `normalizeStrongCode`, `buildSegments`, natural keys ו־normalizers.
8. להוסיף בדיקות smoke ל־:
   - טעינת פרק ללא רשת.
   - התקנת תרגום.
   - ייבוא חוזר.
   - מחיקה במנהל.
   - השמעת שיר והמשך בין דפים.
   - איפוס סיסמה.
   - שמירת הערה למשתמש מחובר ולמשתמש מקומי.

---

## סיכום מהיר למפתח חדש

אם צריך להבין את המערכת במהירות:

1. **התחל מ־`Layout.jsx`** כדי להבין את ההקשרים והמסלול.
2. **קרא `pages/Chapter.jsx`**  -  זהו הליבה של חוויית הקורא.
3. **קרא `lib/bibleApi.js`, `lib/prayerPassages.js`, `lib/strongs.js`**  -  אלה שכבות הנתונים של הקורא.
4. **קרא `pages/AdminDashboard.jsx` ו־`lib/adminSession.js`**  -  כדי להבין את מנהל התוכן.
5. **קרא `lib/adminCollections.js` ו־`lib/adminDirect.js`**  -  כדי להבין את ה־CRUD ואת נתיבי הגיבוי.
6. **קרא `functions/kjvInstall.js`, `functions/lugandaInstall.js`, `functions/scriptureAudit.js`**  -  כדי להבין את מנגנון ההתקנה.
7. **קרא `lib/offlineDb.js`, `lib/bibleApi.js`, `public/sw.js`**  -  כדי להבין את מצב לא מקוון.
8. **השתמש ב־`entities/*.json` כמקור האמת** לגבי שדות והרשאות.

העיקרון המנחה את כל המערכת הוא: **הקורא צריך תוכן בכל מקום; התוכן החי מנצח; התוכן המובנה מגן על חוויית המשתמש; והאופליין הוא עותק מקומי של אותו מודל נתונים, לא מערכת נתונים נפרדת.**
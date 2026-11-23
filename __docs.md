# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

> התיעוד מבוסס על קטעי הקוד שסופקו. במקומות שבהם הקוד נחתך מופיעה הערה שההתנהגות המדויקת עשויה להיות מלאה יותר.  
> כתובות ה־URL מוצגות כנתיבים לוגיים של האפליקציה, כגון `/BibleReader`. בפועל מומלץ להשתמש תמיד ב־`createPageUrl(...)`, שהוא מקור האמת היחיד לניתוב.

---

## 1. מהות המערכת

### 1.1 תיאור כללי

Pray-Read היא אפליקציית React מבוססת PWA לקריאת התנ\"ך, תפילה, לימוד, השמעה ושיתוף בין מאמינים. היא מיועדת להפוך פסקה קצרה מהתנ\"ך או פרק מתפילה לחוויה יומית שלמה: קריאה איטית, הערות, תיקונים, קבוצות דיבור ותהליכים קהילתיים.

המערכת מחברת בין:

- **קריאת תנ\"ך** ב־66 ספרים, באנגלית ובלוגנדה.
- **לימוד מקרא**  -  מבוא, מתאר חלקים, הערות, תובנות תיאולוגיות והיסטוריות.
- **תפילות והתעדוקות** בשתי שפות.
- **מעקב קריאה**  -  תוכנית 30 יום, רצף ימים, השלמת פרקים, סימונים והערות.
- **קהילה**  -  הודעות, תגובות, קבוצות דיבור ושיעורים חיים.
- **תוכן מדיה**  -  Verse-Songs עם נגן גלובלי שממשיך בין עמודים.
- **מצב לא מקוון**  -  IndexedDB לצורך קריאה, הורדות והערות גם ללא חיבור.
- **ניהול תוכן**  -  ממשק נפרד לעורכים לפרסום תוכן, לנהל משתמשים, לענות על פניות ולשנות את ערכת הנושא.

### 1.2 למי המערכת מיועדת

1. **קוראי תנ"ך יומיים** שמחפשים פסקה, מתפילה או השראה קצרה.
2. **מתפללים ולוקחי תורה** שמעוניינים להפוך את הקריאה לתהליך עבודה ומדיטציה.
3. **מנהלי קבוצות וקהילות** שמשתמשים בדיבורים, הודעות ותיאום שיעורים.
4. **עורכי תוכנית** שמנהלים תוכניות בנייה, התנ\"ך, מושבים והגדרות אתר.
5. **משתמשים ללא חשבון** שרוצים לקרוא ולשתף, אך אינם רוצים להירשם.

### 1.3 הערך שהמערכת מספקת

- קריאה ללא חיבור באמצעות cache ו־IndexedDB.
- ניסיון לשמור על קריאה, הערות והתקדמות בין מכשירים דרך חשבון.
- חיבור בין המקרא, התפילה, ההערות והקהילה.
- ממשק דו־לשוני אחיד, עם תוכן זמין גם כשהשרת מחזיר תוצאה חלשה או ריקה.
- מעבר בין מקרא, מחלקה, פסקה וחלונית צפייה מבלי לצאת מהדף.
- כלי אנ(notations) לשמירת הדגשות וקו תחתון עם מיקום לפי אופסטים.
- נגן אודיו גלובלי, ללא צורך להפעיל מחדש האודיו בכל מעבר עמוד.

### 1.4 ארכיטקטורת מערכת

הזרימה הכללית היא:

**דפי Pages → רכיבי Components → React Query / Contexts → FSe2 entities ו־functions → מקורות חיצוניים ו־IndexedDB**

המערכת משתמשת בארבעה מקורות מצב:

| מקור מצב | שימוש |
|---|---|
| React local state | סינון, מצב מודאל, לשונית פעילה, טקסט טיוטה |
| TanStack Query | נתוני שרת, cache, refetch ו־invalidation |
| React Context | אימות, ערכת נושא ונגן אודיו גלובלי |
| LocalStorage / IndexedDB | העדפות אורחן, התקדמות מקומית, הורדות וסנכרון הערות |

ה־Layout מקבל את כל האפליקציה בתוך:

1. `AuthProvider`  -  זיהוי המשתמש.
2. `ThemeProvider`  -  טעינת ערכת נושא והחלתה על משתני CSS.
3. `PlayerProvider`  -  ניהול נגן אחד לכל האפליקציה.

מעבר לכך מותקנים `PwaHead`, כותרת עליונה, תוכן עמוד, כותרת תחתונה והנגן הגלובלי.

---

# 2. עמודים ותפקידיהם

## 2.1 עמודי כניסה, מידע והתקנה

| עמוד | כתובת URL | תפקיד וערך | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Home** | `/Home` | נקודת הכניסה הראשית. קיים כדי להציג במהר את ערך המוצר, תוכן יומי והאפשרויות המרכזיות. | כניסה למודולים מרכזיים, פתיחת פסקת היום או התעדוקה, שיתוף, תרומה, התקנת האפליקציה והפניות לאזורי Bible Reader, Community, Songs ו־Q&A. |
| **About** | `/About` | מסביר את זהות Pray-Read, המטרה, הערך של קריאה מודעת והתמיכה באנגלית ובלוגנדה. קיים כדי לבנות אמון ולהסביר מדוע המוצר שונה מאפליקציית “פסקה ביום”. | קריאה על המוצר, הכנה למסע הקריאה, מעבר ל־Bible Reader, תרומה ופנייה לעמודים קשורים. |
| **Contact** | `/Contact` | טופס פנייה ציבורי. קיים כדי לאפשר תמיכה, שאלות ומשוב ללא דרישת חשבון. | מילוי שם, דוא"ל, נושא והודעה; בדיקות תקינות; שליחה דרך `submitContactMessage`; הצגת הצלחה או שגיאה. |
| **Privacy** | `/Privacy` | מסביר מה נשמר בחשבון, מה נשמר מקומית וכיצד מוחקים נתונים. | קריאה בלבד; כולל הפניות למחיקת המדור הלא מקוון ולנקוי נתוני דפדפן. |
| **Terms** | `/Terms` | תנאי שימוש, זכויות בתוכן התנ\"ך, תוכני התעדוקות והתפילות, והגבלות שימוש. | קריאה בלבד וחזרה לאזורי התוכן הראשיים. |
| **InstallPrompt** | `/InstallPrompt` | מדריך התקנת ה־PWA בהתאם למערכת ההפעלה. קיים כדי להפחית חיסכון בהתקנה מובנית. | זיהוי iOS, Android או דסקטופ; הפעלת `beforeinstallprompt`; הצגת הוראות חלופיות; זיהוי מצב “מותקן”. |

## 2.2 אימות וחשבון

| עמוד | כתובת URL | תפקיד וערך | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Login** | `/Login` | כניסה לחשבון קורא. קיים כדי לשמור התקדמות, הערות וסימונים בין מכשירים. | הזנת דוא"ל וסיסמה; הצגת שגיאת אימות; התחברות דרך `fse2.auth.login`; מעבר ל־Dashboard. ניתן להוסיף `?next=...` להמשך מהדף שממנו המשתמש הגיע. |
| **Signup** | `/Signup` | יצירת חשבון. | שם מלא, דוא"ל, סיסמה, אימות סיסמה וקבלת תנאי שימוש; מדד חוזקת סיסמה; טיפול בדרישת אימות דוא"ל; מעבר ל־Dashboard לאחר הצלחה. |
| **ForgotPassword** | `/ForgotPassword` | שליחת בקשת איפוס סיסמה. | אימות כתובת דוא"ל; שליחת קישור איפוס; הודעת הצלחה גנרית שאינה חושפת אם כתובת קיימת. |
| **ResetPassword** | `/ResetPassword?token=...` או `?access_token=...` | הגדרת סיסמה חדשה לאחר אימות קישור האיפוס. | קריאת token מה־URL; בדיקת אורך סיסמה; אימות התאמת הסיסמאות; קריאה ל־`resetPassword`; הצגת מצב הצלחה. |
| **Logout** | `/Logout` | יציאה מהחשבון. | מציג מצב “Signing you out”; מנקה את המצב וה־session; מעבר ל־Home. |

## 2.3 קריאה, לימוד ומעקב

| עמוד | כתובת URL | תפקיד וערך | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **BibleReader** | `/BibleReader` | מרכז בחירת הספרים והפתיחה לקריאה. קיים כדי להציג את כל 66 הספרים במבנה נגיש ולהוביל לפרק מדויק. | חיפוש לפי שם אנגלי, לוגנדה או קיצור; מעבר בין הברית הקדומה והחדשה; סימון ספרים זמינים לא מקוון; בחירת ספר; כניסה ל־Chapter. |
| **Chapter** | `/Chapter?book=<book_number>&chapter=<n>&verse=<n>` | עמוד הליבה של מערכת הקריאה. קיים כדי להציג פרק מלא, משאבי לימוד, פעולות על פסוק, הערות, תפילה, שיתוף והשלמת קריאה. | טעינת פרק לפי ספר ומספר; החלפת גרסת תנ"ך; בחירת פסוק; הדגשה, סימון, הערה והעתקה; פתיחת תפילה, פירוש, תובנות ו־Q&A; הצגת פסקים חוצים; שיתוף; סיום קריאה; עדכון תוכנית ו־Dashboard. |
| **BibleNotes** | `/BibleNotes` | מרכז ההערות והסימונים של המשתמש. קיים כדי לאפשר חזרה לפסוק מסומן ולקרוא שוב השמרות ותפילות אישיות. | סינון לפי הדגשה, סימון והערה; מעבר לפסוק; הצגת תאורים ונקודות תפילה מהיסטוריית הקריאה; דלילת משתמש לא מחובר מציגה מסך כניסה. |
| **Plan** | `/Plan` | תוכנית הקריאה בת 30 יום. קיים כדי לתת לקורא מסלול ברור ולעקוב אחר התקדמות. | טעינת התוכנית מהשרת או מהנתונים המצורפים; חישוב ימים שהושלמו; זיהוי היום הנוכחי; הצגת סטטוס completed/current/upcoming; מעבר לפרק המתאים. |
| **Journal** | `/Journal`; יצירה: `?new=1&book=<book>&chapter=<n>` | יומן תפילה אישי. קיים כדי לאפשר לשמור התעדוקות, הוודות, בקשות, הודאות ושיקולים דעת. | סינון לפי קטגוריה; יצירה ועריכה; מחיקה; קשר לפרק ולמיקום תנ"ך; חיבור להשלמת קריאה או לתוכנית. |
| **Dashboard** | `/Dashboard` | לוח מצב אישי לקורא. קיים כדי להציג במקום אחד את קריאת השבוע, הרצף, הערות, התקדמות, תוכנית ופעילות אחרונה. | הצגת סטטיסטיקות, ימי קריאה, סימונים, הערות, התעדוקות שהושלמו ותפילות שנשמרו; קיצורים ל־BibleNotes, Offline ו־Plan; Activity Feed מתרענן אוטומטית. |
| **Offline** | `/Offline` | מרכז הורדות וניהול המדור הלא מקוון. קיים כדי לאפשר שימוש בתנ\"ך ובתוכן גם ללא חיבור. | בחירת סוגי תוכן; הורדת פרקים לפי תוכנית או כל הספרים; בחירת גרסת תנ"ך; הצגת התקדמות ונפח; מדידת storage quota; מחיקת נתונים. |

## 2.4 ספרייה, תוכן ומדיה

| עמוד | כתובת URL | תפקיד וערך | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Devotionals** | `/Devotionals`; פתיחת תוכנית: `?devotional=<code>` | ספריית התעדוקות היומיות. | חיפוש וסינון; הצגת תוכנית באנגלית או לוגנדה; סימנה כהושלמה; שיתוף; פתיחת תוכנית ישירות לפי קוד. |
| **PrayerLibrary** | `/PrayerLibrary` | ספריית תפילות לפי נושא ושפה. | חיפוש; סינון לפי קטגוריה; החלפת אנגלית/לוגנדה; שמירת תפילה למועדפים; הסרה מהמועדפים; שיתוף. |
| **VerseOfDay** | `/VerseOfDay` | מציג פסוק מומלץ ליום הנוכחי. | הצגת הפסוק וההערה; שיתוף; מעבר לפרק המתאים; בחירת תוכן מהשרת או מהנתונים המצורפים. |
| **VerseSongs** | `/VerseSongs` | רשימת סדרות Verse-Songs ואודיו. | בחירת סדרה; השמעת סדרה מלאה; הפעלה/השהיה דרך הנגן הגלובלי; הצגת פרטי סדרה ואודיו. |
| **VerseSongSeries** | `/VerseSongSeries?series=<series_name>` | מסף מפורט לסדרת אודיו אחת. | הצגת פרקי הסדרה לפי סדר; השמעת סדרה; הצגת משך, תמונה ורפרנס. |
| **QA** | `/QA` | אזור לשאלות קוראים ותשובות. | חיפוש וסינון לפי קטגוריה; קריאת שאלות ותשובות; שליחת שאלה כמשתמש מחובר; הצגת סטטוס תשובה. |
| **TheologicalInsights** | `/TheologicalInsights` | תובנות תיאולוגיות. העמוד הוא wrapper ל־`InsightsBoard` עם `kind="theological"`. | חיפוש; פתיחת תובנה; שיתוף; שמירה מקומית; מעבר לפסוק. |
| **HistoricalInsights** | `/HistoricalInsights` | תובנות היסטוריות ורקע תרבותי. העמוד הוא wrapper ל־`InsightsBoard` עם `kind="historical"`. | אותה אינטראקציות כמו בתובנות התיאולוגיות, אך עם סינון לפי סוג היסטורי. |

## 2.5 קהילה

| עמוד | כתובת URL | תפקיד וערך | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Community** | `/Community` | מרכז הקהילה. קיים כדי להפנות קוראים לשלושה מסלולים: הודעות אישיות, לימוד חי וקבוצות דיבור. | פתיחת Revelations, Live Teaching ו־Discussion Groups; הצגת הודעות אחרונות, מפגשים קרובים וקבוצות פעילות. |
| **CommunityRevelations** | `/CommunityRevelations` | מקום לפרסם הודעה אישית או הכרה אישית על פסוק. | יצירת פוסט כמשתמש מחובר; סימון לייק; פתיחת שרשור תגובות; הוספת תגובה; הצגת מספר תגובות. |
| **CommunityLiveTeaching** | `/CommunityLiveTeaching` | לוח מפגשי לימוד חי. | הצגת מועד, מנחה ותיאור; מעבר לקישור ההצטרפות; הצגת מידע על מפגשים קרובים. |
| **DiscussionGroups** | `/DiscussionGroups?group=<group_name>` | קבוצות המחווקות פרק מסוים. | הצגת קבוצות; הצטרפות מקומית; בחירת קבוצה; קריאת הודעות; פרסום הודעה כמשתמש מחובר. |

## 2.6 ניהול תוכן

| עמוד | כתובת URL | תפקיד וערך | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Admin** | `/Admin` | כניסה נפרדת למערכת ניהול התוכן. קיים כדי להפריד הרשאות עריכה מחשבון הקורא הרגיל. | הזנת דוא"ל וסיסמת מנהל; בדיקת session קיים; קבלת token; מעבר ל־AdminDashboard. |
| **AdminDashboard** | `/AdminDashboard` | ממשק ניהול התוכן. | ניהול ספרים ופרקים, התעדוקות, תפילות, שירים, Q&A, תובנות, משתמשים, הודעות, צבעי תוכן, יומן פעילות והגדרות; יצירה, עריכה, מחיקה והעלאת קבצים; ייצוא וייבוא תוכן מצורף. |

---

# 3. מפת ניווט לצורך DEBUG

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| חזרה לדף הבית | Header או Footer | הלוגו וה־wordmark | `/Home` |
| פתיחת אודות המוצר | Header | About | `/About` |
| פתיחת ספריית התפילות | Header או Footer | Prayer Library | `/PrayerLibrary` |
| פתיחת קורא התנ"ך | Header, Footer או כרטיס בדף הבית | Bible Reader | `/BibleReader` |
| פתיחת התעדוקות | Header, Footer או Home | Devotionals | `/Devotionals` |
| פתיחת Verse-Songs | Header, Footer או Home | Verse-Songs | `/VerseSongs` |
| פתיחת Q&A | Header, Footer או Home | Q&A | `/QA` |
| פתיחת הקהילה | Header, Footer או Home | Community | `/Community` |
| פתיחת התובנות התיאולוגיות | תפריט משני או Footer | Theological insights | `/TheologicalInsights` |
| פתיחת התובנות ההיסטוריות | תפריט משני או Footer | Historical insights | `/HistoricalInsights` |
| פתיחת פסוק היום | תפריט משני או Footer | Verse of the day | `/VerseOfDay` |
| פתיחת תוכנית הקריאה | תפריט משני, Footer או Dashboard | Reading plan | `/Plan` |
| פתיחת יומן התפילה | תפריט משני או Footer | Prayer journal | `/Journal` |
| פתיחת מרכז ההערות | תפריט משני או Footer | My notes | `/BibleNotes` |
| פתיחת המרכז הלא מקוון | תפריט משני או Footer | Offline centre | `/Offline` |
| פתיחת הודעות הקהילה | Community | Revelations | `/CommunityRevelations` |
| פתיחת הלימוד החי | Community | Live teaching | `/CommunityLiveTeaching` |
| פתיחת קבוצות הדיבור | Community | Discussion groups | `/DiscussionGroups` |
| בחירת ספר | BibleReader | כרטיס ספר או תוצאת חיפוש | `/Chapter?book=<number>` לאחר בחירת פרק |
| בחירת פרק | ChapterSelector או ChapterGrid | מספר הפרק | `/Chapter?book=<number>&chapter=<n>` |
| פתיחת פסוק מסומן | BibleNotes | כרטיס highlight/bookmark/note | `/Chapter?book=<number>&chapter=<n>&verse=<n>` |
| פתיחת פסקת מפתח | BookIntro | Key passage | חלונית VersePopup בתוך הדף |
| מעבר למחלקת בספר | BookOutline | כותרת המחלקה | גלילה/בחירה פנימית בתוך ה־reader |
| פתיחת פסוק מתוך מתפילה | BookPrayerPanel | קישור `[[Book chapter:verse]]` | VersePopup |
| בחירת פסוק | רשימת הפסוקים | לחיצה על פסוק | פתיחת VerseActionBar |
| הדגשת פסוק | VerseActionBar | Highlight | יצירת `StudyMark` מסוג highlight |
| סימון פסוק | VerseActionBar | Bookmark | יצירת `StudyMark` מסוג bookmark |
| הוספת הערה | VerseActionBar | Note | יצירת `StudyMark` מסוג note |
| העתקת פסוק | VerseActionBar | Copy | Clipboard |
| שיתוף פסוק | VerseActionBar | Share | ShareSheet modal |
| פתיחת פסוקים חוצים | VerseActionBar | Cross references | FloatingVerse |
| פתיחת תפילת פסוק | VerseActionBar | Prayer | PassagePrayer overlay/panel |
| פתיחת פירוש ותובנות | VerseActionBar או PassageTabs | Commentary / Insights / Q&A | לשונית בתוך Chapter |
| השלמת קריאת פרק | Chapter | Complete / Mark as read | יצירת `Reading` וסגירת יום בתוכנית |
| פתיחת תוכנית יומית ישירה | Devotionals או קישור חיצוני | קוד תוכנית | `/Devotionals?devotional=<code>` |
| סימון תוכנית כהושלמה | Devotionals | Mark as done | local state + `DevotionalProgress` |
| שמירת תפילה | PrayerLibrary | Bookmark | יצירה או מחיקה ב־`PrayerSaved` |
| שיתוף תובנה | InsightsBoard | ShareRow | פתיחת רשת חיצונית או העתקה |
| שמירת תובנה | InsightsBoard | Save | LocalStorage בלבד |
| פרסום הודעת קהילה | CommunityRevelations | פורמ הפוסט | יצירת `Revelation` דרך function |
| פתיחת שרשור תגובות | RevelationCard | Comments | רשימת תגובות וטופס תגובה |
| הצטרפות לקבוצה | DiscussionGroups | Join | LocalStorage |
| פרסום הודעה בקבוצה | DiscussionGroups | טופס הודעה | יצירת `DiscussionThread` |
| הצטרפות לשיעור חי | CommunityLiveTeaching | Join session | קישור חיצוני מ־`join_link` |
| השמעת סדרת שירים | VerseSongs | Play series | הפעלת queue בנגן הגלובלי |
| פתיחת פרטי סדרה | VerseSongs | שם הסדרה | `/VerseSongSeries?series=<name>` |
| הורדת תוכן לאופליין | Offline | Download | כתיבה ל־IndexedDB |
| מחיקת המדור הלא מקוון | Offline | Clear/Delete | מחיקת stores ו־cache |
| כניסת קורא | Header | Sign in | `/Login` |
| יצירת חשבון | Header | Create account | `/Signup` |
| איפוס סיסמה | Login | Forgot password | `/ForgotPassword` |
| כניסת מנהל | נתיב ישיר | טופס Admin | `/Admin` |
| פתיחת ניהול תוכן | Admin | לאחר login | `/AdminDashboard` |
| מעבר בין מקטעי הניהול | AdminDashboard | תפריטי sidebar | Overview, Books, Devotionals, Prayers, Songs, Q&A, Insights, Users, Messages, Theme, Activity, Settings |
| יצירת רשומת תוכן | AdminDashboard | Add/Create | מודאל עריכה לפי entity |
| עריכת רשומה | AdminDashboard | Edit | טופל מלא עם השדות של ה־entity |
| מחיקת רשומה | AdminDashboard | Delete | פעולת Destructive עם אישור |
| שליחת פנייה | Contact | Send | יצירת `ContactMessage` |
| יציאה | Header | Logout | `/Logout` ולאחר מכן `/Home` |

---

# 4. מבנה קבצים

## 4.1 קובץ שורש

| קובץ | תפקיד |
|---|---|
| `Layout.jsx` | מעטפת האפליקציה. מרכיב את ה־providers, את ראש העמוד, את גוף העמוד, את הפוטר ואת הנגן הגלובלי, ומזריק את `BRAND_CSS`. |

## 4.2 Pages

| קובץ | תפקיד |
|---|---|
| `pages/About.jsx` | דף מותג ומידע על המוצר. |
| `pages/Admin.jsx` | כניסת מנהל תוכן. |
| `pages/AdminDashboard.jsx` | ממשק ניהול התוכן. |
| `pages/BibleNotes.jsx` | מרכז ההערות, ההדגשות והסימונים. |
| `pages/BibleReader.jsx` | בחירת ספר ופתיחת הפרק. |
| `pages/Chapter.jsx` | עמוד קריאת פרק מלא. |
| `pages/Community.jsx` | מרכז הקהילה. |
| `pages/CommunityLiveTeaching.jsx` | לוח מפגשי לימוד חי. |
| `pages/CommunityRevelations.jsx` | פוסטים ותגובות של קוראים. |
| `pages/Contact.jsx` | טופס יצירת קשר. |
| `pages/Dashboard.jsx` | לוח מצב אישי. |
| `pages/Devotionals.jsx` | ספריית התעדוקות. |
| `pages/DiscussionGroups.jsx` | קבוצות דיבור והודעותיהן. |
| `pages/ForgotPassword.jsx` | שליחת בקשת איפוס סיסמה. |
| `pages/HistoricalInsights.jsx` | מעטפת לתובנות היסטוריות. |
| `pages/Home.jsx` | דף הבית ותפריט המודולים. |
| `pages/InstallPrompt.jsx` | הוראות והפעלת התקנת PWA. |
| `pages/Journal.jsx` | יומן התפילה. |
| `pages/Login.jsx` | כניסת קורא. |
| `pages/Logout.jsx` | יציאה מהחשבון. |
| `pages/Offline.jsx` | הורדות וניהול נתונים מקומיים. |
| `pages/Plan.jsx` | תוכנית הקריאה והתקדמותה. |
| `pages/PrayerLibrary.jsx` | ספריית התפילות. |
| `pages/Privacy.jsx` | מדיניות פרטיות. |
| `pages/QA.jsx` | שאלות ותשובות. |
| `pages/ResetPassword.jsx` | הגדרת סיסמה חדשה. |
| `pages/Signup.jsx` | הרשמת משתמש. |
| `pages/Terms.jsx` | תנאי שימוש. |
| `pages/TheologicalInsights.jsx` | מעטפת לתובנות תיאולוגיות. |
| `pages/VerseOfDay.jsx` | פסוק היום. |
| `pages/VerseSongSeries.jsx` | מסף סדרת Verse-Song. |
| `pages/VerseSongs.jsx` | רשימת סדרות Verse-Song. |

## 4.3 Components

### `components/common`

| קובץ | תפקיד ומה מרנדר |
|---|---|
| `EmptyState.jsx` | מצב ריק אחיד עם אייקון, כותרת, תיאור ופעולה אופציונלית. |
| `Modal.jsx` | מודאל overlay. סוגר בלחיצת רקע, בלחיצת X או ב־Escape; נועל את גלילת הגוף ומחזיר את המצב הקודם בעת הסגירה. |
| `PageHeader.jsx` | כותרת אחידה. במצב עם תמונה מייצר Hero, ובלי תמונה יוצר כותרת רגילה על רקע ivory. |
| `Pagination.jsx` | מבנה pager עם דפים ראשון/אחרון, דפים סמוכים ואליפסיס. מופיע רק כאשר יש יותר מעמוד אחד. |
| `ShareRow.jsx` | שורת כפתורי שיתוף לפי ערוצי `shareChannels`, כולל מצב “Copied”. |
| `Spinner.jsx` | מצב טעינה עם ספינר, טקסט ו־`aria-live`. |

### `components/community`

| קובץ | תפקיד ומה מרנדר |
|---|---|
| `CommentThread.jsx` | רשימת תגובות וטופס תגובה למשתמש מחובר. מציג מצב “No comments yet”. |
| `RevelationCard.jsx` | כרטיס פוסט קהילה: מחבר, פסוק, כותרת, גוף, מספר לייקים וכפתור תגובות. |
| `RevelationForm.jsx` | טופס יצירת הודעה עם כותרת, פסוק וגוף. למשתמש שאינו מחובר מציג כניסה ל־Login. |
| `ThreadMessages.jsx` | הודעות בתוך קבוצת דיבור, כולל מחבר, כותרת, גוף וטופס הוספת הודעה. |

### `components/dashboard`

| קובץ | תפקיד ומה מרנדר |
|---|---|
| `ActivityFeed.jsx` | פיד של 12 פעילויות קריאה אחרונות. ממיר סוגי פעילות לאייקונים, צבעים וקישורים. מתרענן כל 30 שניות. |

### `components/home`

| קובץ | תפקיד ומה מרנדר |
|---|---|
| `StatCard.jsx` | כרטיס מדד: תווית, ערך, אייקון ורמז משני. |

### `components/insight`

| קובץ | תפקיד ומה מרנדר |
|---|---|
| `InsightsBoard.jsx` | לוח תובנות לפי סוג וחיפוש. ממזג נתוני שרת עם נתונים מצורפים, מאפשר שמירה מקומית ושיתוף. |

### `components/journal`

| קובץ | תפקיד ומה מרנדר |
|---|---|
| `JournalCard.jsx` | כרטיס רשומת יומן עם קטגוריה, כותרת, גוף, תאריך, ספר ופרק, וכפתורי עריכה ומחיקה. |
| `JournalForm.jsx` | טופס יצירה או עריכה של רשומת יומן. מאפשר כותרת, גוף, קטגוריה, ספר ופרק. |

### `components/layout`

| קובץ | תפקיד ומה מרנדר |
|---|---|
| `AppHeader.jsx` | כותרת עליונה רספונסיבית, ניווט ראשי ומשני, תפריט משתמש, התחברות/התנתקות ומצבי נגן/חיבור. |
| `AppFooter.jsx` | כותרת תחתונה, קישורי גישה מהירים, מידע מותגי, קישורי תרומה ומצב fallback ללוגו. |
| `GlobalPlayer.jsx` | נגן גלובלי: השמעה, השהיה, seek, הצהרה, מהירות, עוצמה, shuffle, repeat, תור וגיליון מורחב. |
| `PwaHead.jsx` | מוסיף meta tags, manifest ו־apple touch icon; רשום את service worker. |

### `components/plan`

| קובץ | תפקיד ומה מרנדר |
|---|---|
| `PlanRow.jsx` | שורת יום בתוכנית. מציגה מספר יום, סטטוס, כותרת, מיקום בתנ"ך וקישור לפרק. |

### `components/read`

| קובץ | תפקיד ומה מרנדר |
|---|---|
| `AnnotatedText.jsx` | מציג טקסט הניתן להדגשה או לקו תחתון. מפצל את הטקסט לפי אופסטים, מציג כלי בחירה ומאפשר הוספה והסרה. |
| `BookGrid.jsx` | רשת 66 הספרים, חיפוש, החלפת ברית וגלילה למקטע הנבחר. |
| `BookIntro.jsx` | מבוא הספר, עובדות ספר וקישורים לפסקי מפתח. הטקסט ניתן להדגשה. |
| `BookOutline.jsx` | רשימת מחלקות הספר. כל כותרת מפנה למיקום המדויק בפרק וניתנת להדגשה. |
| `BookPrayerPanel.jsx` | תפילת הספר באנגלית או לוגנדה, עם פסקים פנימיים הניתנים ללחיצה ולהדגשה. |
| `BookSidebar.jsx` | הלשוניות Book Intro, Outline ו־Book Prayer בתוך מסך הספר. |
| `BookStudyResources.jsx` | משאבי לימוד לפי ספר: פירוש, תובנות תיאולוגיות והיסטוריות, עם pagination. |
| `ChapterClosingPrayer.jsx` | תפילת סיום הפרק, שפת תצוגה, אזכור פסוק, שיתוף וחזרה לתפילה. |
| `ChapterGrid.jsx` | רשת מספרי פרקים עם סימון הפרק הנבחר. |
| `ChapterReaderPane.jsx` | סרגל הלשוניות של משאבי הפרק והפתיחה/סגירה של הפאנל במובייל. |
| `ChapterResourcesPanel.jsx` | תובנות תיאולוגיות והיסטוריות לפרק, עם fallback לתוכן רמת הספר. |
| `ChapterSelector.jsx` | מסך הבחירה ברמת הספר: sidebar, רשת פרקים, משאבי לימוד, חלונית פסוק וניהול הדגשות. |
| `ChapterSidebar.jsx` | פאנל לימוד לצד הפרק: מבוא, פירוש ותפילה מסומנת, עם קישורים לפסקים. |
| `FloatingVerse.jsx` | חלונית צפייה צפה עם פסוק וקישור לפתיחתו במסך המלא. |
| `PassagePrayer.jsx` | מוצא תפילות התואמות לפסוק או לטווח פסוקים ומאפשר קריאה/הדגשה. |
| `PassageTabs.jsx` | לשוניות פירוש, תובנה תיאולוגית, תובנה היסטורית ו־Q&A לפסוק. |
| `ShareSheet.jsx` | מודאל שיתוף פסוק, הכולל תוכן בשתי שפות, תפילה, הפניות והעתקה מלאה. |
| `StrongsText.jsx` | מפרק קודי Strong's מתוך טקסט KJV+ ומציג אותם כ־superscript. |
| `VerseActionBar.jsx` | סרגל הפעולות של פסוק: תפילה, הפניות, פירוש, הדגשה, סימון, הערה, העתקה ושיתוף. |
| `VerseList.jsx` | רשימת פסוקים הניתנת לבחירה, עם מספר פסוק וסימון highlight. |
| `VersePopup.jsx` | טוען פרק מרובת ומציג פסוק או טווח פסוקים בתוך מודאל/חלונית, עם אפשרות לסימון. |
| `VersionPicker.jsx` | בחירה, התקנה והסרה של גרסאות תנ"ך, תוך ניהול versions מקומיים. |

## 4.4 קבצי תמיכה

| קובץ | תפקיד |
|---|---|
| `lib/activity.js` | קבועי סוגי פעילות, אייקונים ורישום פעילות קריאה. |
| `lib/adminSession.js` | ניהול token מנהל ב־LocalStorage וקריאה ל־`adminAuth`. |
| `lib/app-params.js` | פרמטרי FSe2 שנקראים מהדפדפן ומ־LocalStorage. |
| `lib/AuthContext.jsx` | הקשר אימות מרכזי, כולל `me`, login redirect ו־logout. |
| `lib/bibleApi.js` | טעינת פרק, ניקוי טקסט, עיבוד HTML ו־fallback לאחסון הלא מקוון. |
| `lib/bibleBooks.js` | נתוני 66 הספרים: שם, לוגנדה, קיצור, מספר פרק ומספר ספר. |
| `lib/bookGuides.js` | מבוא ומתאר לכל ספר. |
| `lib/bookPrayers.js` | תפילה לכל ספר, באנגלית ובלוגנדה. |
| `lib/bookStudyContent.js` | משאבי לימוד סטטיים לכל ספר. |
| `lib/brandCss.js` | מערכת העיצוב המרכזית ומשתני CSS. |
| `lib/chapterStudy.js` | הרכבת מבוא, פירוש, תפילה ומקורות מפתח ברמת פרק. |
| `lib/contentApi.js` | מיפוי אוספים ל־entities, טעינת תוכן ציבורי ופעולות כתיבה. |
| `lib/crossRefs.js` | הפניות חוצים מבחירות עבור פסוקים פופולריים. |
| `lib/format.js` | עזרי תצוגה: `safeText`, פיצול רשימות, כותרות, משך ונפח. |
| `lib/keyPassages.js` | שלוש פסקי מפתח לכל ספר. |
| `lib/luganda.js` | ניקוי ועיצוב תוכניות לוגנדה לפי מבנה כותרות ותהליך. |
| `lib/offlineDb.js` | מעטפת IndexedDB, stores, עסקאות ו־mark keys. |
| `lib/planData.js` | תוכנית ברירת המודל ל־30 יום. |
| `lib/player.jsx` | נגן אודיו גלובלי ו־queue. |
| `lib/reading.js` | תאריכי ISO, תוויות תאריך, ימי שבוע, רצף קריאה ועזרי מדדים. |
| `lib/readings.js` | זיהוי יום בתוכנית ושמירת התקדמות קריאה. |
| `lib/scriptureRefs.js` | פענוח הפניות תנ"ך, כינויים, טווחים והמרה למזהי ספר. |
| `lib/seedContent.js` | תוכן מצורף להתעדוקות, תפילות, תובנות, Q&A, שירים ועוד. |
| `lib/share.js` | בניית קישורי שיתוף לפי ערוץ והעתקה. |
| `lib/studyAnnotations.js` | מיזוג, שמירה והסרה של הדגשות טקסט בין השרת למכשיר. |
| `lib/textSelection.js` | זיהוי האם לחיצה נבעה מבחירת טקסט פעילה. |
| `lib/theme.js` | קבועי מותג, צבעים, לוגו, תמונות וקישורי תרומה. |
| `lib/themeContext.jsx` | הגדרת ערכת נושא דינמית והמרת צבעים. |
| `lib/versions.js` | הגדרת גרסאות התנ"ך, מצב התקנה והפעלה מקומית. |

## 4.5 Functions ושרת

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | כניסת מנהל, אימות סיסמה, הפקת token ובדיקת session. |
| `functions/adminContent.js` | API ניהול תוכן; מאמת token ומבצע CRUD ב־entities בהרשאות האפליקציה. |
| `functions/bibleChapter.js` | שריפת פרק ממקורות חיצוניים, ניקוי HTML והכנת נתוני פסוקים. |
| `functions/content.js` | API ציבורי לקריאת אוספים וקבלת הגשות ציבוריות. |

## 4.6 Public, generated ו־assets

| קובץ/מיקום | תפקיד |
|---|---|
| `public/manifest.json` | הגדרת PWA: שם, צבעים, תחלית, scope ואייקונים. |
| `public/sw.js` | Service worker עם cache ל־app shell ולתמונות, ו־network-first לרוב הבקשות. |
| `__generated/tailwind.css` | כלי עזר Tailwind שנוצרו אוטומטית. |
| `public/assets/generated_*.png` | לוגו, אייקוני PWA, תמונות Hero ותמונות מוצר. |
| `public/assets/media-library/*` | חומרי מקור, mockups, PDF ו־ZIP; רובם אינם חלק מה־runtime. |

### קבצים שאינם חלק מה־production

- `__trash/**`  -  גרסאות קוד ישנות, כולל `Read.jsx`, `Insights.jsx`, `BookPicker`, `Sidebar` ועוד. אין לנתח אותם כחלק מהמסלול הפעיל.
- `__url_fetch/**`  -  דפי מחקר ותשובות API שנשמרו מקומית; אינם נטענים בזמן ריצה.
- `api/fse2Client` ו־`utils/createPageUrl` מופנים מהקוד, אך מקורם לא סופק כאן. חשוב לבדוק בהם את רשימת הנתיבים ואת מנגנון ה־API.

---

# 5. מודל הנתונים  -  Entities

## 5.1 טבלת Entities

| Entity | מטרה | שדות מרכזיים | קשרים והתנהגות |
|---|---|---|---|
| **ActivityLog** | יומן פעילות ניהול תוכן. | `actor`, `action`, `section`, `detail` | משמש למעקב אחר פעולות מנהלים. קריאה/כתיבה למנהלים ובעלים. |
| **AdminAccount** | רשומת התחברות מנהל. | `email`, `password_hash`, `salt`, `updated_date` | נשמר בצד השרת. `password_hash` ו־`salt` אינם אמורים להיות חשופים ללקוח. |
| **BibleVerse** | פסוק באנגלית ובלוגנדה. | `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu` | מזוהה לוגיתית לפי `book_number + chapter + verse`. קריאה ציבורית; כתיבה למנהלים. |
| **Commentary** | הערת פירוש לספר ופרק. | `book`, `chapter`, `title`, `body_en`, `body_lu` | קשור ל־BibleVerse באמצעות שם הספר ומספר הפרק, ללא foreign key מפורש. |
| **ContactMessage** | פנייה מהטופס הציבורי. | `name`, `email`, `subject`, `message`, `is_read`, `reply` | נוצר על ידי גולש; קריאה, עדכון ומחיקה שמורים למנהלים. |
| **Devotional** | תוכנית יומית. | `code`, `title`, `title_lu`, `scripture`, `scripture_lu`, `body`, `body_lu`, `related`, `further_readings`, `cover_image` | `code` הוא מזהה לוגי ל־DevotionalProgress. |
| **DevotionalProgress** | סימון תוכנית כהושלמה. | `owner_email`, `devotional_code`, `completed_date` | קשור ל־Devotional לפי `devotional_code` ולמשתמש לפי `owner_email`. |
| **DiscussionGroup** | קבוצת לימוד. | `name`, `description`, `schedule`, `member_count` | `name` משמש כמזהה לשרשורים. |
| **DiscussionThread** | הודעה בקבוצת דיבור. | `group_name`, `owner_email`, `author_name`, `title`, `body` | קשור ל־DiscussionGroup לפי `group_name`. |
| **Insight** | תובנה תיאולוגית או היסטורית. | `kind`, `title`, `passage`, `excerpt`, `body`, `share_count` | `kind` מגדיר אם התובנה תיאולוגית או היסטורית. |
| **JournalEntry** | רשומת יומן תפילה. | `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood` | קשורה למשתמש ולמיקום תנ"ך לוגית. |
| **LiveSession** | מפגש לימוד חי. | `title`, `session_date`, `host`, `join_link`, `description` | קישור ההצטרפות יכול להפנות לשירות חיצוני. |
| **Prayer** | תפילה מהספרייה. | `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref` | `title` משמש כמזהה לוגי ל־PrayerSaved. |
| **PrayerSaved** | תפילה במועדפי המשתמש. | `owner_email`, `prayer_title` | קשור ל־Prayer לפי `prayer_title`. |
| **QAEntry** | שאלה ותשובה. | `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email` | `passage_ref` הוא קישור טקסטואלי, לא foreign key. |
| **ReadingActivity** | פעולת קריאה בודדת. | `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse` | משמש ל־Activity Feed ול־Dashboard; `activity_type` כולל visit, highlight, bookmark, note, prayer ו־devotional. |
| **Reading** | פרק שהושלם עם תוכן אישי. | `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses` | `plan_day` קשור ל־ReadingPlan.day; `highlighted_verses` נשמר כמחרוזת. |
| **ReadingPlan** | יום בתוכנית 30 הימים. | `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture` | `day + book + chapter` מייצרים את החיבור ל־Reading. |
| **Revelation** | פוסט קהילה או תגובתו. | `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id` | `parent_id` מקבל את מזהה הפוסט האב כאשר הרשומה היא תגובה. |
| **SiteSettings** | הגדרת אתר גלובלית. | `setting_key`, `setting_value` | משמש לשם האתר, צבעי theme וקישורי תרומה. |
| **StudyAnnotation** | הדגשה או קו תחתון על טקסט לימוד. | `owner_email`, `book_number`, `book`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset` | מזוהה מקומית לפי ספר, מקטע, סוג וטווח אופסטים. |
| **StudyMark** | סימון ברמת פסוק. | `owner_email`, `mark_type`, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text` | קשור למשתמש ולפסוק; `mark_type` הוא highlight, bookmark או note. |
| **VerseOfDay** | פסוק לתאריך מוגדר. | `verse_date`, `reference`, `text_en`, `text_lu`, `note` | נבחר לפי תאריך; אין קשר ישיר ל־BibleVerse. |
| **VerseSongEpisode** | פרק בסדרת Verse-Song. | `series_name`, `title`, `verse_ref`, `duration_label`, `duration_seconds`, `audio_url`, `audio_key`, `thumbnail`, `episode_order` | קשור ל־VerseSongSeries לפי `series_name`. |
| **VerseSongSeries** | סדרת Verse-Song. | `name`, `description`, `thumbnail`, `cover_image`, `accent` | `name` הוא מזהה לוגי לאופיונים ולנתיב `?series=`. |

`*` בטבלת הגיוש אינו מסומן כאן, אך שדות `required` נקבעים בקובצי ה־JSON.

## 5.2 מודל ההרשאות

ה־entities משתמשים בשני מבני גישה:

1. **גרסה 1  -  rules פשוטים**
   - קריאה ציבורית עם role `*`.
   - כתיבה על ידי `owner`, `admin`, `user` או `authenticated`.
2. **גרסה 2  -  policy מקונן**
   - נראה ב־JournalEntry, Reading ו־ReadingPlan.
   - מכיל מדיניות `read`, `write` ו־rules עם תנאים.

### חלוקת אחריות צפויה

- **תוכן ציבורי**  -  תנ"ך, תפילות, התעדוקות, תובנות, פירושים, מפגשים ו־Q&A.
- **הגשות ציבוריות**  -  יצירת `ContactMessage` ושאלת Q&A.
- **נתוני משתמש**  -  קריאה, סימונים, הערות, יומן, התקדמות, תפילות שמורות, הדגשות ו־activity.
- **ניהול**  -  עריכת תוכן, קריאת פניות, עניין על activity, ניהול משתמשים והגדרות.
- **ניהול משתמשים ו־AdminAccount**  -  אינם מיועדים להיות מודלים ציבוריים.

## 5.3 קשרים חשובים לצורך הרחבה

מרבית הקשרים מיושמים באמצעות שמות ומפתחות לוגיים, ולא באמצעות foreign keys:

- `Devotional.code` ← `DevotionalProgress.devotional_code`
- `Prayer.title` ← `PrayerSaved.prayer_title`
- `VerseSongSeries.name` ← `VerseSongEpisode.series_name`
- `DiscussionGroup.name` ← `DiscussionThread.group_name`
- `Revelation.id` ← `Revelation.parent_id`
- `ReadingPlan.day` ← `Reading.plan_day`
- `BibleVerse.book_number/chapter/verse` ← `Commentary`, `StudyMark`, `ReadingActivity`
- `owner_email` משמש כמפתח בידידות לרוב ה־entities של המשתמש.

בעת הוספת יחס חדש כדאי להוסיף אילוצי ייחוד לוגיים אם הפלטפורמה מאפשר זאת. למשל, מומלץ למנוע יצירת כמה `PrayerSaved` עם אותו `owner_email` ואותו `prayer_title`.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 עליית האפליקציה

1. `Layout` נטען.
2. `AuthProvider` מתחיל לבדוק את המשתמש דרך `fse2.auth.me()`.
3. `ThemeProvider` ממתין לאימות וטוען הגדרות אתר כשמשתמש מחובר.
4. `PlayerProvider` יוצר אובייקט `Audio` יחיד.
5. `PwaHead` מוסיף את מטא־ה־PWA ורושם את `sw.js`.
6. `AppHeader`, תוכן העמוד, `AppFooter` ו־`GlobalPlayer` מוצגים.
7. הנגן מוסתר כאשר אין טראק פעיל.

## 6.2 קריאת פרק מלאה

1. המשתמש בוחר ספר ב־BibleReader.
2. המערכת בוחרת מספר פרק ומנווטת ל־`/Chapter`.
3. `Chapter` מפענח את `book`, `chapter` ו־`verse` מה־URL.
4. `fetchChapter` טוען את הפרק:
   - מהשרת וממקורות התנ"ך החיצוניים.
   - או מהמטמון הלא מקוון כשהרשת אינה זמינה.
5. הפסוקים מוצגים ב־VerseList.
6. בחירת פסוק פותחת את VerseActionBar.
7. המשתמש יכול:
   - להדגיש,
   - לסמן,
   - להוסיף הערה,
   - להעתיק,
   - לשתף,
   - לפתוח תפילה,
   - לפתוח פירוש ותובנות,
   - לראות הפניות חוצות.
8. הפעולות נשמרות ב־StudyMark ובמקביל במטמון המקומי.
9. סיום הפרק יוצר או מעדכן `Reading`.
10. אם הפרק תואם לתוכנית, יום התוכנית מסומן כהושלם.
11. פעילות הקריאה נרשמת ב־ReadingActivity ומופיעה ב־Dashboard.

## 6.3 הדגשה או קו תחתון על טקסט לימוד

1. המשתמש בוחר קטע טקסט ב־AnnotatedText.
2. הרכיב מחשב את מיקום הבחירה ביחס לטקסט המלא.
3. מוצעת חלונית כלים עם צבעי הדגשה וקו תחתון.
4. נוצר `StudyAnnotation` עם:
   - ספר,
   - מקטע,
   - `block_id`,
   - סוג,
   - צבע,
   - טווח אופסטים.
5. ההערה נשמרת:
   - בשרת עבור משתמש מחובר,
   - וב־IndexedDB גם כשאין חיבור.
6. בטעינה המערכת ממזגת רשומות שרת ומקומיות ומסירה כפילויות.
7. `buildSegments` מפצל את הטקסט ומחיל את ההדגשות או הקווים.

## 6.4 פתיחת פסוק מתוך מסך הספר

1. המשתמש לוחץ על פסק מפתח או הפניה בתפילה.
2. `parseReference` ממיר את הטקסט למזהה ספר, פרק, פסוק וטווח.
3. VersePopup טוען את הפרק.
4. החלונית מציגה את הפסוק או את טווח הפסוקים.
5. ניתן לסמן גם את תוכן הפסוק.
6. קישור “Open in Bible Reader” מעביר ל־Chapter עם מיקום מדויק.

## 6.5 טעינת תוכן ציבורי ו־fallback

1. הדף מבקש אוסף באמצעות `fetchPublicCollection`.
2. ה־React Query מנהל cache ו־refetch.
3. אם קיימים רשומות חיות, הן מוצגות.
4. אם האוסף ריק או השרת אינו זמין, הדף משתמש ב־seed content.
5. בחלק מהעמודים התוכן החי והמצורף ממוזגים, וכפילויות מוסרות לפי כותרת.
6. לאחר יצירה או עדכון נקרא `invalidateQueries` כדי לרענן את האוסף.

## 6.6 פרסום הודעת קהילה

1. משתמש שאינו מחובר רואה כניסה ל־Login.
2. משתמש מחובר מזין כותרת, פסוק וגוף.
3. הטופס מונע שליחה ריקה ומחק כפילויות אחרי הצלחה.
4. ה־function הציבורי יוצר `Revelation`.
5. הרשומה מופיעה בפיד וב־Query Client לאחר invalidation.
6. תגובות נשמרות כ־Revelation נוסף עם `parent_id`.

## 6.7 קבוצת דיבור

1. המשתמש בוחר קבוצה מהרשימה.
2. הצטרפות נשמרת מקומית ב־LocalStorage.
3. הודעות הקבוצה נטענות מ־DiscussionThread.
4. משתמש מחובר שולח הודעה.
5. ההודעה מתווספת לרשימה והמספר/תצוגת ההודעות מתעדכנים.

## 6.8 השמעת Verse-Song

1. המשתמש בוחר Play בסדרה.
2. האודיו של כל פרק מומר ל־track עם title, series, verse reference, URL ומשך.
3. ה־queue מוחלף ב־PlayerProvider.
4. אובייקט ה־Audio הגלובלי מתחיל לנגן.
5. המשתמש יכול:
   - לדלג לשיר הבא או הקודם,
   - לבצע seek,
   - לשנות מהירות,
   - לשנות עוצמה,
   - להפעיל shuffle,
   - לבחור repeat off/all/one.
6. הנגן ממשיך לעבוד גם בעת מעבר בין עמודים.
7. שגיאת טעינת אודיו מוצגת למשתמש.

## 6.9 מרכז Offline

1. המשתמש בוחר אילו stores להוריד.
2. עבור תנ"ך נבחרת גרסת תרנ"ך וטווח ספרים.
3. כל פרק נשמר עם key שכולל ספר, פרק, שפה וגרסה.
4. הפרקים, הפסוקים והתוכן הנוסף נכנסים ל־IndexedDB.
5. המסך מציג כמות פרקים, פסוקים, נפח ומכסת אחסון.
6. במצב ללא חיבור `bibleApi` מחזיר נתונים מהמטמון.
7. ניקוי המרכז מוחק את הנתונים שנבחרו.

## 6.10 ניהול תוכן

1. מנהל נכנס ב־`/Admin`.
2. `adminAuth` בודק את הסיסמה ומנפיק token חתום.
3. ה־token נשמר ב־`localStorage` תחת `pr_admin_token`.
4. AdminDashboard טוען את המקטעים והרשומות.
5. `adminContent` מאמת את ה־token לפני כל פעולת CRUD.
6. בעת הפעולה מתווספת רשומת ActivityLog.
7. ה־Query Client מתעדכן ומציג את הנתונים החדשים.

---

# 7. הערות טכניות לפיתוח

## 7.1 ספריות ותלויות מרכזיות

| תלות | שימוש |
|---|---|
| `react` / `react-dom` | רכיבי ממשק, state, effects ו־contexts. |
| `react-router-dom` | ניתוב, פרמטרי URL, `navigate`, `Link`, `useSearchParams`. |
| `@tanstack/react-query` | cache, mutations, loading/error state ו־cache invalidation. |
| `lucide-react` | כלל ממשק אחידים. |
| `date-fns` | עיצוב תאריכים ורצף קריאה. |
| FSe2 client | entities, auth, functions ו־assets. |
| Web Audio / `Audio` API | הנגן הגלובלי. |
| IndexedDB | הורדות, סימונים והערות מקומיות. |
| LocalStorage | session מנהל, העדפות אורחן והתקדמות בסיסית. |
| Service Worker | app shell, manifest ומטמון HTTP. |
| DOMParser | ניתוח תשובות HTML ממקורות התנ"ך. |

## 7.2 דפוסי המפתח שיש לשמור

### הפרדת Server State מ־UI State

- נתוני שרת: React Query.
- מצב טרנזיציוני כגון לשונית או טקסט טיוטה: local state.
- מצב גלובלי: Context.
- מצב שחייב להישאר בין רענונים: LocalStorage/IndexedDB.

### שימוש עקבי ב־query keys

יש לכלול במפתח את כל המשתנים שמשפיעים על התוצאה: משתמש, סוג תוכן, ספר, פרק ושפה.

דוגמאות חשובות:

- `["readings", email]`
- `["studyMarks", email]`
- `["prayerSaved", email]`
- `["insights", kind]`
- `["chapterInsights"]`
- `["discussion-groups"]`
- `["verseSongEpisodes"]`

### עדכון cache אחרי mutation

לאחר create, update או delete יש לקרוא ל־`invalidateQueries` או לעדכן ישירות את המפתח הרלוונטי. חשוב לא לשכוח רשומות המשתמש הנוכחי, מכיוון שחלק מהמערכים משותפים בין כל המשתמשים.

### עקריון “חי תחילה, מצורף כגיבוי”

זהו דפוס מרכזי במערכת:

- backend הוא מקור האמת.
- seed content מבטיח שהמסך לא ייראה ריק.
- לפעמים ממזגים את שני המקורות.

בעת פיתוח חשוב לדעת אם מסך מסוים מציג נתון חי או נתון מצורף. שינוי בבסיס הנתונים עלול לא להופיע אם ה־query עדיין מחזיק cache ישן.

## 7.3 דו־לשוניות

- רוב ה־entities מכילים זוגות כגון `body/body_lu`, `title/title_lu`.
- תוכן ה־Luganda עובר לעיתים דרך `formatLugandaDevotional`.
- `bookPrayers` משתמש בשדות `body_lu`, בעוד שרכיבים אחרים עשויים להשתמש בשם `bodyLu`.
- שינוי סכמת שפה דורש בדיקה של:
  - קוראי תנ"ך,
  - תפילות,
  - התעדוקות,
  - insights,
  - commentary,
  - verse of the day,
  - תוכן קהילה.
- יש לנקות שמות מקורות שדלגו לתוכן, כפי שקורה ב־`lib/luganda.js`.

## 7.4 מערכת העיצוב

קיימות שתי שפות עיצוב מקבילות:

1. **קלאסיות מותג** ב־`brandCss.js`, למשל `pr-card`, `pr-btn`, `pr-hero`.
2. **כלי Tailwind** כגון `flex`, `h-4`, `rounded-lg`.

הערבוב מאפשר גמישות, אך עלול ליצור סתירות של צבע, גודל או מרווח. בעת שינוי רכיב יש לבדוק:

- סדר עומק של `BRAND_CSS`,
- משתני CSS דינמיים,
- שימוש בשני מקורות Tailwind,
- responsive behavior,
- נגישות במובייל.

ערכת ה־theme מבוססת על ivory, emerald ו־gold. ה־ThemeContext מחכה למשתמש מחובר לפני טעינת `SiteSettings`; לכן שינוי ערכת נושא עלול להשפיע רק על משתמשים מחוברים.

## 7.5 הוספת feature חדש

1. להוסיף או לעדכן entity רק אם נדרשים נתונים חדשים.
2. לעדכן את קובץ ה־entity ואת רשימת השדות ב־AdminDashboard.
3. לעדכן את מיפוי `contentApi`.
4. להוסיף fallback ל־seed content אם התוכן צריך להופיע גם ללא backend.
5. לבחור query key ייחודי ומלא.
6. להגדיר מדיניות גישה ובדיקת בעלות בצד השרת.
7. להוסיף סטטוסי loading, error ו־empty.
8. לבדוק נגישות: labels, focus, keyboard ו־ARIA.
9. לבדוק את התנהגות במובייל ובהתקנה כ־PWA.
10. אם נדרש offline  -  להוסיף store, key ואסטרטגיית invalidation.
11. לעדכן את שם cache ב־service worker כדי לא להשאיר stale assets.

## 7.6 נושאי אבטחה

### Admin auth

- `adminAuth` משתמש ב־salt ו־SHA-256, אך SHA-256 יחיד אינו פרמטר סיסמה עמיד מספיק.
- מומלץ לעבור ל־Argon2id, scrypt, bcrypt או PBKDF2 עם parameters מתאימים.
- חייב להיות `ADMIN_INITIAL_PASSWORD` חזק וייחודי בסביבת production.
- אין להשאיר את ברירת המחדל `prayread-admin` בפרודקשן.
- ה־token נשמר ב־LocalStorage ולכן חשוף ל־XSS; לפחות יש להגביל XSS, לא להציג secrets בקוד ולחשוב על cookie מאובטח אם הפלטפורמה מאפשר.

### הרשאות בעלות

במספר entities תנאי הבעלות מומשים בלקוח בלבד, למשל סינון שורות לפי `owner_email`. סינון בלקוח אינו מספיק: חייב להתקיים גם אכיפה בצד השרת או תנאי owner במדיניות FSe2.

`adminContent` פועל עם הרשאות האפליקציה עצמה. לכן תקינות חתימת ה־token ובדיקת ה־role הן נקודת אבטחה קריטית.

### קלט ופלט

- `safeText` אינו sanitizer של HTML; הוא רק מונע הצגה של אובייקטים לא צפויים.
- React מספק escaping ברוב המקרים, אך יש לנקות HTML בשרת אם תוכן נכנס ל־`dangerouslySetInnerHTML`.
- יש לאמת `join_link`, כתובות URL ונתוני העלאה.
- יש להגביל קצב שליחת form ו־function calls.

## 7.7 נגישות

המערכת כוללת מספר סימוני נגישות טובים:

- `aria-live` על Spinner.
- `aria-modal`, `aria-label` ו־role על Modal.
- `aria-current` על Pagination.
- תוויות טקסט ו־`aria-label` על כפתורי אייקון.
- tab semantics במסכי הלימוד.
- כפתורים אמיתיים לבחירת פסוקים ולשיתוף.

נקודות שכדאי לחזק:

1. **Modal** אינו מנהל focus trap ואינו מחזיר focus לאלמנט שפתח אותו.
2. לא כל `tablist` מחובר ל־`tabpanel` מתאים.
3. חלונית ההערה על טקסט עשויה לדרוש ניווט מקלדת מלא.
4. כפתורי Backdrop ו־Close צריכים להיות ניתנים לזיהוי גם כשהצבע דומה.
5. יש לוודא ש־focus ring לא נעלם עקב CSS מותאם.

## 7.8 אמינות וביצועים

### מקורות חיצוניים

- מקורות התנ"ך עשויים להפוך ללא זמינים, להגביל קצב בקשות או לשנות פורמט.
- יש להשאיר את מטמון IndexedDB כ־fallback.
- כתובות ה־URL של bible-api ו־wordplanet הן תלות חיצונית.
- יש לבדוק רישוי, תוכן ונגישות של כל תרגום לפני פרסום.

### עלויות שאילתות

מספר מסכים טוענים מאות רשומות ומסננים בצד הלקוח. עם צמיחת הנתונים עדיף:

- לסנן בשרת,
- להוסיף pagination,
- להגביל queries לפי בעלות,
- להוסיף indexes.

דוגמה בולטת: `ActivityFeed` מבקש 60 פעילויות ורק אחר כך מסנן לפי `owner_email`. אם למשתמש יש יותר פעילויות ממה שנכנס ל־60 הראשונות, חלק מהפעילויות שלו עלולות להיעלם.

### Service Worker

- שינוי קבצי JS או CSS דורש עדכון cache version.
- לא לשמור responses המכילים מידע אישי ב־cache שניתן לגשת מאותו דפדפן.
- כדאי לבדוק במיוחד את fetch handler ואת כללי exclusion עבור `/api/`, auth ו־admin.
- `cache.addAll(...).catch(...)` מסתיר כשל בהתקנת כל המסלולים; כדאי לרשום את השגיאה.

## 7.9 נקודות קוד ספציפיות שכדאי לבדוק ולתקן

1. **`AuthContext.checkAuth`**  
   מגדיר `isAuthenticated` ל־true גם אם `fse2.auth.me()` מחזיר ערך ריק. עדיף לבדוק גם את קיום `currentUser`.

2. **`ActivityFeed`**  
   הגבלת ה־60 רשומות מתרחשת לפני סינון לפי בעלות. כדאי לסנן בשרת או להגביל באופן שמבטיח את כל הפעילויות של המשתמש.

3. **`InsightsBoard` query key**  
   הוא משתמש ב־`["insights", kind]`, בעוד חלק מהמסכים משתמשים ב־`["insights"]`. כתוצאה מכן יכולות להיווצר שתי cache entries שונות לאותו אוסף.

4. **`Offline` ו־`prayers`**  
   מסך Offline מציג store בשם `prayers`, אך רשימת `STORES` ב־`offlineDb.js` לא כוללת אותו לפי הקוד שסופק. יש לוודא שה־store נוצר ומשמש באותו שם.

5. **`BookSidebar`**  
   קיימת ייבוא `Icon` מ־`lucide-react` שאינה נראית בשימוש. אם ה־package אינו מייצא שם כזה, ה־build ייכשל; אם הוא מייצא, עדיף להסיר את ה־import.

6. **`Login` ו־`next`**  
   רכיבים כמו RevelationForm מייצרים קישור `Login?next=...`, אך Login מנווט תמיד ל־Dashboard. יש לקרוא את `next`, לאמת שהוא נתיב פנימי ולשמור את מיקום החזרה.

7. **`Journal` query key**  
   המפתח הוא `["journalEntries"]` בלי דוא"ל. אם משתמש אחד יתחלף למשתמש אחר באותו session, עדיף להוסיף את הדוא"ל למפתח.

8. **`ChapterResourcesPanel` query key**  
   המפתח `["chapterInsights"]` אינו כולל ספר או פרק, והסינון מתבצע בצד הלקוח. אם הנתונים יגדלו, כדאי להביא את הסינון לשרת או לצמצם את התוצאה.

9. **`app-params.js`**  
   המודול קורא ישירות ל־`window` ו־`localStorage` בזמן import. אם יושבים את האפליקציה ב־SSR, יש להפוך את קריאת ה־storage ל־lazy או לבצע בדיקת `typeof window`.

10. **`BibleVerse` מול מקורות התנ"ך**  
    הקריאה הנראית ב־Chapter משתמשת ב־`fetchChapter`, ולא בקריאה ישירה מ־BibleVerse. לכן עריכת BibleVerse ב־Admin עלולה שלא לשפר את הקריאה בפועל. יש להחליט אם זו entity אמיתית או סכמת reserve ולחבר אותה למסלול ההגשה.

11. **אנטיטיות של יומן וסימונים**  
    קיימות מספר קשרים לוגיים ללא אילוץ ייחודי, למשל `PrayerSaved` ו־`DevotionalProgress`. זה עלול ליצור כפילויות אם אותו משתמש חוזר על אותה פעולה.

12. **הערות לפי אופסטים**  
    `StudyAnnotation` משתמש באופסטים יחסיים לטקסט. שינוי טקסט בעתיד עלול להזיז את ההדגשה. מומלץ לשמור גם hash או excerpt של הטקסט המסומן.

13. **Modal**  
    יש להוסיף focus trap, שחזור focus ומניעת גלילה של הרקע באמצעות דילוג לתוכן.

14. **ערכת נושא למשתמשים אורחים**  
    `ThemeProvider` טוען settings רק לאחר אימות. אם מנהל רוצה שערכת הנושא תחול גם על גולשים, יש לטעון את `SiteSettings` גם כשאין משתמש.

15. **שגיאות רשת בתוכן ציבורי**  
    רוב המסכים מציגים seed content גם כשהשרת נכשל. אין לחשוב שהמסך תקין פירושו שה־backend תקין. יש להבחין בין “אין תוכן” לבין “הבקשה נכשלה”.

16. **שיתוף רשת חיצונית**  
    `openShare` עלול לפתוח חלונות חיצוניים. יש לוודא pop-up blockers, נייד והתנהגות כאשר המשתמש מבטל חלון.

17. **תאריכים ואזורי זמן**  
    חלק מהתאריכים נבנים כ־ISO מקומי, ואחרים משתמשים ב־`new Date(...)`. יש להגדיר מדיניות אחידה ל־“היום” ול־ספירת ימים סביב חצות בינלאומי.

18. **LocalStorage כמקור מקור אמת**  
    הצטרפות לקבוצות, תוכניות שהושלמו ותובנות שנשמרו הן מקומיות. אין להציג אותן כנתונים מסונכרנים בין מכשירים.

19. **PWA ו־assets**  
    כתובות ה־assets כוללות נתיבי `/api/appfiles/...`. שינוי hosting או app ID עלול לשבור לוגו, תמונות ואייקונים. עדיף להשתמש ב־`LOGO_URL`, `HERO_IMAGE` וכדומה ולא בנתיבים ידניים.

20. **קוד ישן**  
    `__trash` כולל רכיבים עם API ועיצוב שונים. יש להתעלם מהם בזמן דיבאג של המסלול הפעיל, אלא אם מתקנים migration מכוון.

---

## סיכום מפתח למפתח חדש

ה־Bible Reader וה־Chapter הם מרכז מוצרי ומקור רוב ה־debugging. שאר המסכים משתמשים באותם שירותי תשתית:

- `AuthContext` למשתמש.
- `contentApi` לתוכן.
- `offlineDb` למצב מקומי.
- `studyAnnotations` ו־StudyMark לסימונים.
- `player` לאודיו.
- `adminAuth` ו־`adminContent` לניהול.

לפני הוספת feature כדאי לבחור תחילה היכן הוא יבוצע:

- **תצוגה בלבד**  -  רכיב תצוגה חדש.
- **נתוני שרת**  -  entity, function, policy ו־Admin field.
- **נתוני משתמש**  -  owner field, query key ו־invalidation.
- **עבודה לא מקוונת**  -  IndexedDB store ו־key.
- **שיתוף/מדיה**  -  כלל URL, fallback ו־consent.
- **תצוגה דו־לשונית**  -  שני מקורות הטקסט וה־formatter.
- **PWA**  -  עדכון cache ובדיקת cache invalidation.
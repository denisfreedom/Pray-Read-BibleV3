# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

## הערות מתחילה

- התיעוד מבוסס על קוד המקור שסופק, כולל קבצים שנחתכו באמצע.
- נתיבי העמודים מצוינים לפי הקוד המרכזי של `createPageUrl("PageName")`. בפועל, הנתיב המלא עשוי לכלול prefix שמוגדר מחוץ לקטע המקור שסופק.
- קיימים שני מנגנוני התחברות עצמאיים:
  1. **התחברות קורא** דרך `fse2.auth`.
  2. **התחברות מנהל CMS** דרך `functions/adminAuth.js` ו־`localStorage`.
- קטעי `__trash` ו־`__url_fetch` הם חומרי מקור, בדיקות ותיעוד מקורות חיצוניים; הם אינם חלק מה־runtime הפעיל.

---

# 1. מהות המערכת

## 1.1 תיאור כללי

Pray-Read Bible היא אפליקציית React לקריאת המקרא, מחקר ותפילה, המשלבת:

- קריאת פרקי המקרא באנגלית ובלוגנדה.
- מספר גרסאות מקרא, כולל KJV ו־KJV עם מספרי Strong’s.
- מערכת לימוד לפי ספר, פרק, פסוק ומקטעי מחקר.
- הערות, הדגמות, קווי־תחתון וסימונים אישיים.
- תהילים, מחקרים, תוכן הולי ו־Q&A.
- קהילה: גילויים, תגובות, הוראות חיות וקבוצות דיון.
- יומן תפילה, תוכנית קריאה ומעקב התקדמות.
- נגן אודיו גלובלי לשירי מקרא.
- מרכז הורדה לקריאה לא־מקוונת.
- PWA, התקנה למכשיר ועבודה מקוונת.
- ממשק ניהול תוכן להפצת מחקרים, תפילות, שירים, תובניות והגדרות.

המערכת נבנתה כך שאפשר לקרוא את התוכן הבסיסי גם כשאין חשבון וגם כשאין חיבור לאינטרנט. נתונים מקומיים משמשים כגיבוי, וכשהקורא מתחבר הם מסונכרנים לחשבון.

## 1.2 קהל היעד

### קוראים כלליים
- משתמשים שקוראים מקרא באופן קצר ויומי.
- מתפללים המחפשים תפילות מוכנות לפי נושא.
- משתמשים המעדיפים ללמוד פרק אחד בכל פעם.
- קוראים הזקוקים לממשק בעברית ובלוגנדה.
- משתמשים המשתמשים במחשב או בטלפון ללא חיבור קבוע.

### משתמשים מקבועים
- לומדי מקרא המסמנים פסוקים, כותבים הערות ועובדים לפי תוכנית קריאה.
- משתמשים השומרים יומן תפילה והתקדמות בין מכשירים.
- חברי קהילה המגיבים, משתפים גילויים ומשתתפים בדיון.

### מנהלי תוכן
- עורכים ומפרסמים מחקרים, תפילות, אינסייגטים, שירי מקרא ו־Q&A.
- מתקינים את המקרא בלוגנדה ואת KJV+ עם מספרי Strong’s.
- מנהלים הגדרות מותג, הודעות צור קשר ויומן פעילות.

## 1.3 הערך שהמערכת מספקת

1. **קריאה מהירה**  -  מאגר תוכן מקומי מאפשר לפתוח פרק גם ללא רשת.
2. **חוויית אחידה**  -  מערכת עיצוב משותפת עם צבעי ענבר, ירוק וזהב.
3. **שכבת לימוד**  -  הפניות פסוקים, מבנה ספר, הערות ומשאלות נפש פתוחות בתוך הדף.
4. **מעקב אישי**  -  סימונים, ספרים שמורים, הערות, יומן והתקדמות נשמרים לפי חשבון.
5. **עבריות**  -  תוכן דובר אנגלית ולוגנדה, לרבות תפילות, מחקרים, פרשיות והסברים.
6. **פחות תלות בשירותים חיצוניים**  -  תוכן בסיסי מגיע מ־seed content ומהמאגר המקומי גם אם השירות החיצוני נופל.
7. **ניהול תוכן מרכזי**  -  מנהל יכול לעדכן תוכן בלי לשנות קוד.
8. **גישה למקרא עם Strong’s**  -  הגדרות Greek/Hebrew נשמרות כדי שפתיחת אותו מילה תהיה מהירה בהמשך.

---

# 2. עמודים ותפקידיהם

## 2.1 דפי תוכן וקריאה

| עמוד | נתיב לוגי | תפקיד והצדק להיותו | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Home** | `/` | דף הכניסה ומרכז האתר. מציג את ערך המוצר, פעילויות מרכזיות, פסוק יום, תוכן מומלץ, קישורי קהילה והתקנת PWA. | לחיצה על כרטיסי הפעילויות, מעבר לקורא, מחקרים, תפילות, קהילה ושירים; שיתוף פסוק היום; קישור לתרומה; הצגת prompt להתקנת האפליקציה. |
| **About** | `/About` | מציג את זהות Pray-Read, המטרה הפנומנית והערך של האפליקציה. מיועד למבקרים שרוצים הסבר לפני הרשמה או השימוש. | קישורי CTA לקורא, למחקרים, לקהילה ולהתקנה; חזרה לדף הבית. |
| **BibleReader** | `/BibleReader` | מסך הבחירה של הקורא. מציג את 66 הספרים, חיפוש בשמות אנגליים ולוגנדה, ומעבר לבחירת פרק. | חיפוש ספר; מעבר בין Old Testament ל־New Testament; בחירת ספר; הצגת מצב הורדה מקומית; המשך למסך הספר והפרקים. |
| **Chapter** | `/Chapter?book={number}&chapter={number}` | מסך הקריאה המרכזי. מציג את פסוקי הפרק, גרסת המקרא, הערות, משאלות תפילה, הפניות, מחקר ופעולות אישיות. | בחירת פסוק; הדגמה, סימון, הערה, ספר מועדף, העתקה ושיתוף; פתיחת מחקר, תפילה, הפניות ו־Strong’s; מעבר גרסת מקרא; סיום פרק ועדכון תוכנית הקריאה. |
| **Devotionals** | `/Devotionals` | מאגר מחקרים יומיים באנגלית ולוגנדה, עם אפשרות לפתיחה, קריאה, שיתוף וסימון כהושלם. | חיפוש וסינון; פתיחת מחקר ב־Modal; הצגת הגרסה האנגלית או הלוגנדית; שיתוף; סימון “הושלם”, המשמר בשרת ובמכשיר. |
| **PrayerLibrary** | `/PrayerLibrary` | ספריית תפילות לפי נושא ושפה, המשלבת מחקר מקוון עם תוכן מקומי חלופי. | חיפוש; סינון לפי קטגוריה ושפה; פתיחת תפילה; שיתוף; שמירה למועדפים והסרה. |
| **Plan** | `/Plan` | מציג את תוכנית הקריאה בת 30 ימים המשלבת את יוחנן ואת תהלים. מאפשר לעבור בין ימים ולראות מה הושלם. | הצגת יום נוכחי, שלם ועתידי; מעבר לפרק היום; חישוב אחוז התקדמות; השוואה מול רשומות הקריאה של המשתמש. |
| **Journal** | `/Journal` | יומן תפילה אישי לשבח, בקשה, הודאה, וידוי, הודייה והשקפה. | יצירה, עריכה, מחיקה וסינון; שמירת ספר ופרק; פתיחת טופס מראש מאוכלס; מעבר לפרק המקרא המקושר. |
| **BibleNotes** | `/BibleNotes` | מרכז ההערות והסימונים האישיים שנשמרו מול הפסוקים. | הצגת היסטוריית הדגמות, ספרים שמורים והערות; מעבר חזרה לפסוק המקורי; תגובה מוכנה למשתמש שאינו מחובר. |
| **Dashboard** | `/Dashboard` | לוח אישי למשתמש מחובר: התקדמות, סימונים, יומן, מחקרים שהושלמו, פעילות אחרונה ומצב הורדות. | מעבר למקטעים אישיים; הצגת רצף קריאה ופעילות; קישור למחקרים, תוכנית, יומן, הערות ומרכז ההורדה. |
| **VerseOfDay** | `/VerseOfDay` | מציג פסוק מומלץ לפי התאריך, עם גרסה אנגלית ולוגנדית. | שיתוף הפסוק; מעבר לפרק המקרא; fallback לפסוק מקומי כשאין רשומה תאריכית. |
| **QA** | `/QA` | מאגר שאלות קוראים ותשובות פסטורליות מלוות בהפניית מקרא. | חיפוש וסינון לפי קטגוריה; קריאת תשובה; הגשת שאלה חדשה על ידי משתמש מחובר; הצגת מצב הצלחה או שגיאה. |
| **TheologicalInsights** | `/TheologicalInsights` | מציג תובניות תיאולוגיות הקשורות לפסוקים. | חיפוש; פתיחת תובנית; שיתוף; שמירה מקומית למועדפים. |
| **HistoricalInsights** | `/HistoricalInsights` | מציג תובניות היסטוריות ורקע תרבותי. | אותה תנהגות כמו בתובניות התיאולוגיות, עם `kind="historical"`. |
| **Offline** | `/Offline` | מרכז הורדה וניהול משאבי המכשיר. מאפשר לשמור פרקים ותוכן נוסף לשימוש ללא רשת. | בחירת סוגי תוכן; בחירת היקף “תוכנית” או “כל הספרים”; בחירת גרסת מקרא; הורדה עם מעקב התקדמות; מחיקת נתונים; הצגת שימוש ומכסת אחסון. |
| **InstallPrompt** | `/InstallPrompt` | מסך התקנה והסבר להתקנת Pray-Read כ־PWA במכשירים שונים. | זיהוי פלטפורמה; הפעלת `beforeinstallprompt`; זיהוי מצב standalone; הצגת הוראות ייעודיות ל־iOS, Android ו־Desktop. |

## 2.2 קהילה

| עמוד | נתיב לוגי | תפקיד והצדק להיותו | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Community** | `/Community` | שער הקהילה. מציג את שלושת מרכזי הקהילה ותצוגה מקצרה של תוכן אחרון. | מעבר ל־Revelations, Live Teaching ו־Discussion Groups; צפייה בפוסטים ובשיעורים אחרונים. |
| **CommunityRevelations** | `/CommunityRevelations` | מאגר גילויים אישיים של קוראים, עם תגובות כצאת. | פרסום גילוי; לייק; פתיחת ושליחת תגובה; התחברות; מעבר בין תגובות לפרסום. |
| **CommunityLiveTeaching** | `/CommunityLiveTeaching` | לוח לשיעורי אינטראקטיביים עתידיים ומתוכננים. | הצגת תאריך, מנחה ותיאור; מעבר לקישור ההצטרפות החיצוני; fallback לשיעורי seed. |
| **DiscussionGroups** | `/DiscussionGroups` | קבוצות קטנות לקריאת אותו מקום במקרא ודיון שבועי. | בחירת קבוצה; הצגת הודעות; שליחת הודעה כמשתמש מחובר; סימון הצטרפות; מעבר לפרק המקרא. |

## 2.3 חשבונות, מנהל ומסמכים

| עמוד | נתיב לוגי | תפקיד והצדק להיותו | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Login** | `/Login` | כניסת קורא רגיל. נפרדת מהתחברות הנהלת התוכן. | אימות דוא"ל וסיסמה דרך `fse2.auth.login`; מעבר ל־Dashboard; קישור ל־Signup ו־ForgotPassword. |
| **Signup** | `/Signup` | יצירת חשבון קורא. | שם, דוא"ל, סיסמה, אימות סיסמה והסכמת תנאים; מדד חוזקת סיסמה; טיפול בדרישת אימות דוא"ל. |
| **ForgotPassword** | `/ForgotPassword` | התחלת שחזור סיסמה. | קבלת דוא"ל; קריאה ל־`forgotPassword`; הודעת הצלחה כללית שאינה חושפת אם החשבון קיים. |
| **ResetPassword** | `/ResetPassword?token={token}` | קביעת סיסמה חדשה לאחר אימות קישור השחזור. | קריאת token מה־URL; אימות אורך מינימלי של 8 תווים; אימות התאמת סיסמאות; קריאה ל־`resetPassword`. |
| **Logout** | `/Logout` | מסך מעבר לצבירת המשתמש וניקוי המצב. | המתנה קצרה לצורך חוויית מעבר, יציאה מהחשבון וחזרה ל־Home. |
| **Admin** | `/Admin` | כניסת ניהול התוכן. משתמש במנגנון session ייעודי שאינו זהה ל־`fse2.auth`. | קבלת טוקן מ־`adminAuth`; שמירתו ב־`localStorage`; בדיקת session קיים; מעבר ל־AdminDashboard. |
| **AdminDashboard** | `/AdminDashboard` | מרכז ניהול התוכן והמערכת. כולל ניהול תוכן, התקנות, משתמשים, הודעות, ערכת צבעים, יומן פעילות והגדרות. | בחירת מקטע; הוספה, עריכה ומחיקה של רשומות; התקנת KJV+/Strong’s ו־Luganda; עדכון הגדרות; צפייה בהודעות וביומן; יציאה. |
| **Contact** | `/Contact` | טופס יצירת קשר עם הצוות. | אימות שם, דוא"ל והודעה; בדיקת תקינות דוא"ל; שליחה דרך mutation; הצגת הצלחה או שגיאה. |
| **Privacy** | `/Privacy` | מסמך שקיפות לגבי נתוני חשבון ונתונים המאוחסנים מקומית. | קישור חזרה; טקסט מקבע. |
| **Terms** | `/Terms` | תנאי שימוש והבהרות בנוגע לפרנסה, מקרא ותוכן. | קישור חזרה; טקסט מקבע. |

## 2.4 פרמטרים חשובים בנתיבים

- `Chapter`: `book`, `chapter`, `verse`, `lang`.
- `BibleReader`: בחירת ספר יכולה להיות משומרת ב־query string.
- `Devotionals`: `devotional` מאפשר לפתוח מחקר מסוים ישירות.
- `Journal`: `new=1`, `book` ו־`chapter` מאפשרים ליצור רשומה מוכנה.
- `VerseSongSeries`: `series` קובע את סדרת השירים הפתוחה.
- `ResetPassword`: `token` או `access_token`.
- `Community` וכן שאר דפי הקהילה מקבלים גם את שם העמוד/הקבוצה דרך ה־URL כאשר נדרש.

---

# 3. מפת ניווט לצורך DEBUG

## 3.1 ניווט כללי

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| חזרה לדף הבית | Header, Footer, כל דפי התוכן | הלוגו, “Pray-Read”, או קישור Home | `/` |
| פתיחת אודות האפליקציה | Header | About | `/About` |
| פתיחת הקהילה | Header | Community | `/Community` |
| פתיחת ספריית התפילות | Header | Prayer Library | `/PrayerLibrary` |
| פתיחת המקרא | Header | Bible Reader | `/BibleReader` |
| פתיחת שירי המקרא | Header | Verse-Songs | `/VerseSongs` |
| פתיחת Q&A | Header | Q&A | `/QA` |
| פתיחת מחקרים | Header | Devotionals | `/Devotionals` |
| פתיחת לוח אישי | Header | Dashboard | `/Dashboard` |
| פתיחת תובניות תיאולוגיות | תפריט משני | Theological insights | `/TheologicalInsights` |
| פתיחת תובניות היסטוריות | תפריט משני | Historical insights | `/HistoricalInsights` |
| פתיחת פסוק היום | תפריט משני | Verse of the day | `/VerseOfDay` |
| פתיחת תוכנית הקריאה | תפריט משני | Reading plan | `/Plan` |
| פתיחת יומן התפילה | תפריט משני | Prayer journal | `/Journal` |
| פתיחת מרכז ההורדה | תפריט משני | Offline centre | `/Offline` |
| פתיחת ההערות האישיות | תפריט משני | My notes | `/BibleNotes` |
| פתיחת גילויים | תפריט משני | Revelations | `/CommunityRevelations` |
| פתיחת הוראות חיות | תפריט משני | Live teaching | `/CommunityLiveTeaching` |
| פתיחת קבוצות דיון | תפריט משני | Discussion groups | `/DiscussionGroups` |
| מעבר להתקנת האפליקציה | Home/InstallPrompt | Install/Get started | `/InstallPrompt` |
| תרומה | Header, Footer, Home | Donate | כתובת חיצונית |
| חזרה מהתקנה | InstallPrompt | חץ אחורה | `/` |

## 3.2 ניווט בקורא המקרא

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| בחירת ספר | BibleReader | כרטיס ספר | מצב ספר נבחר ב־BibleReader |
| בחירת פרק | מסך הספר | מספר פרק ב־ChapterGrid | `/Chapter?book=...&chapter=...` |
| מעבר לגרסת מקרא אחרת | Chapter | VersionPicker | אותו פרק בגרסה אחרת |
| פתיחת פסוק מתוך פסוק יום | VerseOfDay | קישור לפרק | `/Chapter?...` |
| פתיחת פרק מתוכנית הקריאה | Plan | שורת יום | `/Chapter?book=...&chapter=...` |
| פתיחת פסוק מהערה | BibleNotes | כרטיס הערה | `/Chapter?...&verse=...` |
| פתיחת פסוק מהפניה חוצה | Chapter | פניה חוצה | `FloatingVerse`, וממנה ל־Chapter |
| פתיחת מקטע מתוך מבנה הספר | BookSidebar | כותרת או טווח פסוקים | `VersePopup` בתוך העמוד |
| פתיחת פסוק ממבנאות התפילה | BookPrayerPanel | קישור `[[Book 1:1]]` | `VersePopup` בתוך העמוד |
| פתיחת מקטע מפתח הפסוקים | BookIntro | קישור פסוק מפתח | `VersePopup` בתוך העמוד |
| הצגת הגדרת Strong’s | Chapter | קוד כחול מוגבה | `StrongsPopup` |
| הצגת תפילת הפסוק | Chapter | HeartHandshake | `PassagePrayer` |
| הצגת מחקר הפסוק | Chapter | MessageCircle | לשונית Commentary ב־`PassageTabs` |
| הצגת אינסייגטים | Chapter | Resources | `ChapterResourcesPanel` |
| שיתוף פסוק | Chapter/VerseActionBar | Share2 | `ShareSheet` |
| פתיחת תפילת סיום הפרק | Chapter | קישור בתחתית הפרק | `ChapterClosingPrayer` |
| שמירת הערה כיומן | Chapter | New journal entry | `/Journal?new=1&book=...&chapter=...` |

## 3.3 ניווט בתוכן, קהילה ומדיה

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת גילויים מהקהילה | Community | Revelations | `/CommunityRevelations` |
| פתיחת הוראה חיה | Community | Live teaching | `/CommunityLiveTeaching` |
| פתיחת קבוצת דיון | Community | Discussion groups | `/DiscussionGroups` |
| פרסום גילוי | CommunityRevelations | Send/Share | יצירת רשומת Revelation |
| לייק גילוי | RevelationCard | Heart | עדכון מספר הלייקים |
| פתיחת תגובות | RevelationCard | MessageCircle | רשימת התגובות |
| שליחת תגובה | CommentThread | Send | יצירת Revelation עם `parent_id` |
| הצטרפות לקבוצה | DiscussionGroups | Join | עדכון מצב מקומי |
| שליחת הודעת קבוצה | ThreadMessages | Send | יצירת DiscussionThread |
| פתיחת מחקר | Devotionals | כרטיס/כותרת | Modal עם פרטי המחקר |
| סימון מחקר כהושלם | Devotionals | Complete | התקדמות מקומית ו־DevotionalProgress |
| שיתוף מחקר | Devotionals/Insights | ShareRow | רשת חברתית או העתקה |
| שמירת תפילה | PrayerLibrary | Bookmark | יצירת PrayerSaved |
| שמירת אינסייגט | InsightsBoard | שמירה | `localStorage` |
| הגשת שאלה | QA | Send | יצירת QAEntry |
| השמעת סדרת שירים | VerseSongs | Play | תור אודיו גלובלי |
| פתיחת סדרה | VerseSongs | שם הסדרה | `/VerseSongSeries?series=...` |
| השמעת סדרה מפורטת | VerseSongSeries | Play | תור הפרקים בנגן הגלובלי |
| בחירת פרק מתוך נגן | GlobalPlayer | רשימת השמעות | שינוי טראק בנגן |

## 3.4 חשבון וניהול

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| כניסת קורא | Header | Sign in | `/Login` |
| יצירת חשבון | Login/Signup banner | Sign up/Create account | `/Signup` |
| שחזור סיסמה | Login | Forgot password | `/ForgotPassword` |
| יציאה | Header | Logout | `/Logout` |
| כניסת ניהול | כתובת ישירה | `/Admin` | טופס כניסת ניהול |
| מעבר ל־AdminDashboard | Admin | Sign in | `/AdminDashboard` |
| התקנת KJV+ | AdminDashboard | KJV+ with Strong’s | מקטע `kjvplus` |
| התקנת לוגנדה | AdminDashboard | Luganda Bible | מקטע `luganda` |
| עריכת מחקר | AdminDashboard | Edit | טופס יחידת תוכן |
| מחיקת מחקר | AdminDashboard | Delete | אישור מחיקה ורשומת ה־entity |
| עדכון צבעי מותג | AdminDashboard | Text Colours | טופס הגדרות ערכת נושא |
| צפייה בפעילות מנהלים | AdminDashboard | Activity Log | רשימת ActivityLog |
| צפייה בהודעות | AdminDashboard | Messages | רשימת ContactMessage |

---

# 4. מבנה קבצים

## 4.1 קבצי עמודים

| קובץ | נתיב | מה מרונדר |
|---|---|---|
| `About.jsx` | `pages/About.jsx` | דף מותג ומשלח המשתמש על מטרת האפליקציה. |
| `Admin.jsx` | `pages/Admin.jsx` | טופס כניסת הניהול ובדיקת session. |
| `AdminDashboard.jsx` | `pages/AdminDashboard.jsx` | אזור הניהול המלא, כולל טבלאות CRUD והתקנות. |
| `BibleNotes.jsx` | `pages/BibleNotes.jsx` | רשימת הדגמות, ספרים שמורים והערות אישיות. |
| `BibleReader.jsx` | `pages/BibleReader.jsx` | רשת הספרים, חיפוש ומעבר למסך הספר. |
| `Chapter.jsx` | `pages/Chapter.jsx` | מסך קריאת פרק מלא ושכבת האינטראקציות סביב הפסוקים. |
| `Community.jsx` | `pages/Community.jsx` | שער שלושת מרכזי הקהילה ותצוגת אחרונים. |
| `CommunityLiveTeaching.jsx` | `pages/CommunityLiveTeaching.jsx` | רשימת שיעורי הוראה חיים. |
| `CommunityRevelations.jsx` | `pages/CommunityRevelations.jsx` | פיד גילויים, לייקים ותגובות. |
| `Contact.jsx` | `pages/Contact.jsx` | טופס יצירת קשר. |
| `Dashboard.jsx` | `pages/Dashboard.jsx` | לוח מדדים אישי ופיד פעילות. |
| `Devotionals.jsx` | `pages/Devotionals.jsx` | רשימת מחקרים, Modal פירוט ומעקב השלמה. |
| `DiscussionGroups.jsx` | `pages/DiscussionGroups.jsx` | בחירת קבוצה וניהול הודעות הדיון. |
| `ForgotPassword.jsx` | `pages/ForgotPassword.jsx` | שליחת בקשת איפוס סיסמה. |
| `HistoricalInsights.jsx` | `pages/HistoricalInsights.jsx` | עוטף את `InsightsBoard` לסוג היסטורי. |
| `Home.jsx` | `pages/Home.jsx` | דף הבית ותצוגת שירותי המוצר. |
| `InstallPrompt.jsx` | `pages/InstallPrompt.jsx` | התקנת PWA לפי פלטפורמה. |
| `Journal.jsx` | `pages/Journal.jsx` | CRUD של יומן התפילה וסינון לפי קטגוריה. |
| `Login.jsx` | `pages/Login.jsx` | התחברות קורא. |
| `Logout.jsx` | `pages/Logout.jsx` | מסך יציאה וניקוי session. |
| `Offline.jsx` | `pages/Offline.jsx` | הורדת תוכן ל־IndexedDB וניהול אחסון. |
| `Plan.jsx` | `pages/Plan.jsx` | תוכנית קריאה והתקדמות יומית. |
| `PrayerLibrary.jsx` | `pages/PrayerLibrary.jsx` | חיפוש, סינון ושמירת תפילות. |
| `Privacy.jsx` | `pages/Privacy.jsx` | מדיניות פרטיות. |
| `QA.jsx` | `pages/QA.jsx` | קריאת Q&A והגשת שאלות. |
| `ResetPassword.jsx` | `pages/ResetPassword.jsx` | קביעת סיסמה חדשה. |
| `Signup.jsx` | `pages/Signup.jsx` | הרשמת קורא ובדיקת חוזקת סיסמה. |
| `Terms.jsx` | `pages/Terms.jsx` | תנאי שימוש. |
| `TheologicalInsights.jsx` | `pages/TheologicalInsights.jsx` | עוטף את `InsightsBoard` לסוג התיאולוגי. |
| `VerseOfDay.jsx` | `pages/VerseOfDay.jsx` | פסוק יום ושיתופו. |
| `VerseSongSeries.jsx` | `pages/VerseSongSeries.jsx` | תצוגת סדרה מלאה והשמעת פרקיה. |
| `VerseSongs.jsx` | `pages/VerseSongs.jsx` | רשימת סדרות והשמעתן. |

## 4.2 רכיבי ניהול

| קובץ | תפקיד | מה מרונדר |
|---|---|---|
| `components/admin/KjvPlusInstaller.jsx` | ממשק התקנת KJV+ ומילון Strong’s. | סטטוס, התקנה מדורגת, התקדמות ושגיאות; קורא ל־`kjvInstall` וסופר רשומות `StrongEntry`. |
| `components/admin/LugandaInstaller.jsx` | ממשק התקנת המקרא בלוגנדה. | סטטוס התקנה, התקנה מלאה או מדורגת והודעות התקדמות. |

## 4.3 רכיבים משותפים

| קובץ | תפקיד | מה מרונדר |
|---|---|---|
| `components/common/EmptyState.jsx` | מצב ריק אחיד. | אייקון, כותרת, תיאור ופעולה אופציונלית. |
| `components/common/Modal.jsx` | חלון מודאל נגיש בסיסי. | כותרת, תת־כותרת, תוכן, footer, סגירה בלחיצה על רקע או ב־Escape ונעילת גלילת body. |
| `components/common/PageHeader.jsx` | כותרת ראשית אחידה. | Hero עם תמונת רקע או כותרת רגילה על רקע ענבר. |
| `components/common/Pagination.jsx` | מנגנון עימוד קומפקטי. | כפתורי קודם/בא ומספרי עמוד עם קיצורי אליפסין. |
| `components/common/ShareRow.jsx` | שורת שיתוף חברתי. | כפתורי Facebook, WhatsApp, Telegram, Instagram, LinkedIn והעתקה. |
| `components/common/Spinner.jsx` | מצב טעינה גלובלי. | ספינר, טקסט טעינה ו־`aria-live`. |

## 4.4 רכיבי קהילה

| קובץ | תפקיד | מה מרונדר |
|---|---|---|
| `components/community/CommentThread.jsx` | תצוגת תגובות והוספת תגובה. | רשימת תגובות, טקסטארה ושליחה עבור משתמש מחובר. |
| `components/community/RevelationCard.jsx` | כרטיס גילוי. | מחבר, פסוק, כותרת, גוף, לייק ומעבר לתגובות. |
| `components/community/RevelationForm.jsx` | טופס פרסום גילוי. | כותרת, פסוק, גוף, מצב שגיאה וניקוי הטופס לאחר הצלחה. |
| `components/community/ThreadMessages.jsx` | צ׳אט קבוצת דיון. | הודעות, חבר, כותרת אופציונלית וטקסט לשליחה. |

## 4.5 רכיבי Dashboard, בית ואינסייגטים

| קובץ | תפקיד | מה מרונדר |
|---|---|---|
| `components/dashboard/ActivityFeed.jsx` | פיד פעילות אישי. | פעילויות אחרונות, אייקונים, צבע לפי סוג וקישור לתוכן הרלוונטי. |
| `components/home/StatCard.jsx` | כרטיס מדד. | אייקון, תווית, ערך והסבר. |
| `components/insight/InsightsBoard.jsx` | לוח אינסייגטים. | חיפוש, מיזוג מקורות, פתיחת תוכן, שיתוף ושמירה מקומית. |

## 4.6 רכיבי יומן ותוכנית

| קובץ | תפקיד | מה מרונדר |
|---|---|---|
| `components/journal/JournalCard.jsx` | כרטיס רשומת יומן. | קטגוריה, כותרת, גוף, מיקום במקרא, עריכה ומחיקה. |
| `components/journal/JournalForm.jsx` | טופס יומן. | כותרת, גוף, קטגוריה, ספר, פרק וולידציה מינימלית. |
| `components/plan/PlanRow.jsx` | שורת יום בתוכנית. | מספר יום, מצב, נושא, מוקד וקישור לפרק. |

## 4.7 רכיבי Layout

| קובץ | תפקיד | מה מרונדר |
|---|---|---|
| `components/layout/AppHeader.jsx` | Header רספונסיבי. | לוגו, תפריט ראשי ומשני, תפריט משתמש, כפתורי התחברות ותפריט מובייל. |
| `components/layout/AppFooter.jsx` | Footer מלא. | מותג, קישורי קיצור, קישורים משפטיים, התקנה ותרומה; כולל fallback ללוגו “PR”. |
| `components/layout/GlobalPlayer.jsx` | נגן אודיו גלובלי. | נגן מצומצם או מורחב, תקדמת, הפעלה/השהיה, קפיצות, עוצמה, מהירות, shuffle, repeat, רשימת שמעות ושגיאה. |
| `components/layout/PwaHead.jsx` | הוספת metadata ורישום Service Worker. | Meta tags, manifest, Apple touch icon ו־`navigator.serviceWorker.register`. |

## 4.8 רכיבי הקורא

| קובץ | תפקיד | מה מרונדר |
|---|---|---|
| `components/read/AnnotatedText.jsx` | טקסט הניתן לסימון ולהדגשה. | מפצל את הטקסט למקטעים לפי offsets, מציג סימונים, מאפשר לבחור טקסט ולהוסיף highlight או underline. |
| `components/read/BookGrid.jsx` | רשת 66 הספרים. | חיפוש באנגלית ולוגנדה, החלפת קבוצת ברית־קדשה וגלילה למקטע. |
| `components/read/BookIntro.jsx` | מבוא לספר. | עובדת הספר, מבוא, פסוקי מפתח והפניות. |
| `components/read/BookOutline.jsx` | מבנה הספר. | כותרות וטווחי פסוקים הניתנים ללחיצה ולסימון. |
| `components/read/BookPrayerPanel.jsx` | תפילת הספר. | תפילה באנגלית/לוגנדה, הפניות פנימיות ותפילות ספר נוספות. |
| `components/read/BookSidebar.jsx` | מעטפת סרגל הספר. | שלושה טאבים: מבוא, מבנה ותפילה. |
| `components/read/BookStudyResources.jsx` | משאבי לימוד ברמת הספר. | שלושה טאבים: פירוש, תובנה תיאולוגית ותובנה היסטורית; עימוד של שלוש רשומות בעמוד. |
| `components/read/ChapterClosingPrayer.jsx` | תפילת סיום פרק. | תפילה לפי מצב שפה, הפניה, שיתוף וחזרה לתפילת הפרק. |
| `components/read/ChapterGrid.jsx` | רשת בחירת פרק. | כפתור לכל פרק עם קישור מלא ל־Chapter. |
| `components/read/ChapterReaderPane.jsx` | מבנה עמוד קריאה. | תפריט מחקר נייד, לשונית Resources והתאמה למסך רחב. |
| `components/read/ChapterResourcesPanel.jsx` | אינסייגטים ברמת פרק. | אינסייגט תיאולוגי והיסטורי, עם fallback לאינסייגט ברמת הספר. |
| `components/read/ChapterSelector.jsx` | מסך בחירת פרק בתוך הספר. | סרגל מחקר, רשת פרקים, משאבי ספר, פופ־אפ פסוק ושמירת המיקום. |
| `components/read/ChapterSidebar.jsx` | סרגל הלימוד לצד פרק. | מבוא לפרק, פירוש ותפילה; תוכן ניתן לסימון והפניות נפתחות בפופ־אפ. |
| `components/read/FloatingVerse.jsx` | חלון צף להצגת פסוק. | פסוק, כותרת, סגירה ומעבר למקרא. |
| `components/read/PassagePrayer.jsx` | תפילה המתאימה לפסוק. | התאמת `scripture_ref` לפרק והפסוק, הצגה בשפת הקורא, סימון והפניות. |
| `components/read/PassageTabs.jsx` | לשוניות מחקר לפי מעבר. | פירוש, אינסייגט תיאולוגי, אינסייגט היסטורי ו־Q&A. |
| `components/read/ShareSheet.jsx` | חלון שיתוף פסוק. | הצגת פסוק בשפות, הפניות והעתקת כל התוכן. |
| `components/read/StrongsPopup.jsx` | פופ־אפ הגדרת Strong’s. | מצא או טוען הגדרה, מציג מקור, מילה מקורית, דרישה והגדרה, ומאפשר לשמור במטמון. |
| `components/read/StrongsText.jsx` | הצגת קודי Strong’s בתוך פסוק. | מפרק קודי `G/H`, מציג אותם כ־superscript ומעביר קוד לפתיחת ההגדרה. |
| `components/read/VerseActionBar.jsx` | סרגל פעולות לכל פסוק. | תפילה, הפניות, פירוש, highlight, share, bookmark, הערה והעתקה. |
| `components/read/VerseList.jsx` | רשימת פסוקים בסגנון Tailwind קל. | פסוק נבחר, סימון והדגמה. רכיב תחלופי/ישן. |
| `components/read/VersePopup.jsx` | פופ־אפ מקרא בתוך העמוד. | טוען פרק דרך `fetchChapter`, מציג טווח פסוקים ומאפשר סימון. |
| `components/read/VersionPicker.jsx` | בחירת והתקנת גרסאות מקרא. | מציג גרסה פעילה, גרסאות מותקנות, התקנה, הסרה והחלפה. |

## 4.9 קבצי תמיכה ברמת האפליקציה

| קובץ | תפקיד |
|---|---|
| `Layout.jsx` | מעטפת ה־providers וה־layout הראשי. מרכב מ־`AuthProvider`, `ThemeProvider` ו־`PlayerProvider`, מוסיף את ה־style, Header, Footer, PWA metadata ונגן. |
| `lib/app-params.js` | פרמטרי תאימות ל־FSe2: app id, token, URL ו־functions version. |
| `lib/AuthContext.jsx` | מצב משתמש ופעולות login/logout/redirect. |
| `lib/themeContext.jsx` | טעינת הגדרות מותג והפקת משתני CSS. |
| `lib/theme.js` | קבועי המותג, צבעים, קבצי לוגו, תמונות, קישורי תרומה ומפתחות localStorage. |
| `lib/brandCss.js` | מערכת העיצוב המרכזית בצורת CSS variables ומחלקות `pr-*`. |
| `__generated/tailwind.css` | תשתית מגברת Tailwind מוגבלת לשימושים קיימים. רוב העיצוב אינו מגיע מכאן אלא מ־`BRAND_CSS`. |

## 4.10 קבצי Server Functions

| קובץ | אחריות |
|---|---|
| `functions/adminAuth.js` | כניסת מנהל, בדיקת session, יציאה וניהול סיסמה. ה־token נחתם ב־HMAC ותקופתו 12 שעות. |
| `functions/adminContent.js` | API לניהול entity מותג; מאמת את טוקן הניהול ומריץ פעולות עם הרשאות האפליקציה. |
| `functions/bibleChapter.js` | טעינת פרק מלא ממקור חיצוני לפי שפה. |
| `functions/content.js` | API ציבורי לקריאת אוספים וקבלת הגשות כגון פנייה ושאלה. |
| `functions/kjvInstall.js` | התקנת KJV עם Strong’s מ־bolls.life ל־`KjvPlusChapter`. |
| `functions/lugandaInstall.js` | התקנת המקרא בלוגנדה מ־wordplanet ל־`LugandaChapter`. |
| `functions/strongsDefinition.js` | אחזור הגדרות Strong’s מ־Blue Letter Bible ושמירתן במטמון. |

## 4.11 ספריות `lib`

| קובץ | תפקיד מרכזי |
|---|---|
| `activity.js` | קבוע סוגי פעילות, אייקונים ורישום פעילות קורא. |
| `adminSession.js` | קריאה, שמירה ומחיקה של טוקן הניהול; עטיפת `callAdmin`. |
| `bibleApi.js` | טעינת פרק, בחירת גרסה, ניקוי טקסט, fallback למטמון וסימון Strong’s. |
| `bibleBooks.js` | נתוני 66 הספרים: מספר, שם, קיצור, שם לוגנדה ומספר פרקים. |
| `bookGuides.js` | מבוא ומבנה לכל ספר. |
| `bookPrayers.js` | תפילה לכל ספר, כולל הפניות `[[Book 1:1]]`. |
| `bookStudyContent.js` | תוכן בסיסי לפירוש, תובנה תיאולוגית ותובנה היסטורית לכל ספר. |
| `chapterStudy.js` | הרכבת מבוא, פירוש, תפילה ופסוקי מפתח לרמת פרק. |
| `contentApi.js` | ממשק אחיד לקריאת collections וביצוע mutations ציבוריים. |
| `crossRefs.js` | הפניות חוצות אוצרות למעברים מסוימים. |
| `format.js` | `safeText`, פיצול רשימות, כותרות, משך זמן, המרת bytes ל־MB ועוד. |
| `keyPassages.js` | פסוקי מפתח לכל ספר. |
| `luganda.js` | ניקוי ופורמט של מחקרים בלוגנדה. |
| `offlineDb.js` | מעטפת IndexedDB, יצירת stores, הוספה, קריאה, מחיקה וניהול מכסת. |
| `planData.js` | תוכנית ברירת המודל ל־30 ימים. |
| `player.jsx` | Provider אחד לנגן אודיו גלובלי, תור, shuffle, repeat, מהירות והתקדמות. |
| `reading.js` | תאריכים ב־ISO, תצוגה, רצף ימים ועזרי לוח. |
| `readings.js` | איתור יום תוכנית ושמירת התקדמות קריאה. |
| `scriptureRefs.js` | נרמול כתובות פסוקים, aliases, פתיחת טווחים ומיפוי לספרים. |
| `seedContent.js` | תוכן fallback למחקרים, תפילות, אינסייגטים, שירים וקהילה. |
| `share.js` | בניית קישורי שיתוף והעתקה ללוח. |
| `strongs.js` | נרמול קודי Strong’s, קידומת מספר ספר ו־prefix שפה. |
| `studyAnnotations.js` | מפתחות, מיזוג, שמירה והסרה של הערות סטודיו. |
| `textSelection.js` | מניעת click על אזור מסומן כשהמשתמש רק ביצע text selection. |

## 4.12 קבצי `public`

| קובץ | תפקיד |
|---|---|
| `public/manifest.json` | הגדרת PWA: שם, צבעים, תצוגה, scope ואייקונים. |
| `public/sw.js` | Service Worker: cache-first ל־app shell ולתמונות, network-first לרשת ולנתונים דינמיים. |
| `public/assets/generated_022a23b6.png` | תמונת Hero הראשית. |
| `public/assets/generated_0f91fdf8.png` | אייקון PWA בגודל 512. |
| `public/assets/generated_5fe46b6c.png` | נכס generated נוסף; ייעוד מדויק לא ניתן לאמת מהקוד. |
| `public/assets/generated_703e129d.png` | נכס generated נוסף. |
| `public/assets/generated_8b82ca52.png` | נכס generated נוסף. |
| `public/assets/generated_a74541e8.png` | נכס generated נוסף. |
| `public/assets/generated_aa744f7a.png` | נכס generated נוסף. |
| `public/assets/generated_c990bd6c.png` | לוגו ו־Apple touch icon. |
| `public/assets/generated_f0778e1c.png` | נכס generated נוסף. |

תיקיית `public/assets/media-library` מכילה PNG, JPEG, PDF ו־ZIP ששימשו כחומר מקור, העלאות או רפיות עיצוב:

- `0c85aa753009_image.png`
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
- `a6f2acb34271_image.png`
- `aba3dd407174_image.png`
- `b4a70bcd3e36_image.png`
- `d90047a8174d_image.png`
- `e5b6f7373a8f_image.png`
- `ee0d38d9f96a_image.png`
- `f3b0b02ae7a0_image.png`
- `f8aa8ef69f41_image.png`
- `9865967db356_Pray-Read-Bible-Prompt-3-Bible-Reader-Rebuild.pdf`
- `a6f2acb34271_image.png`  -  כפועל מופיע ברשימת PNG, ואין לשכוח לבדוק כפילויות/שגיאות בהעברת snapshot.
- `b50e6c213bb8_pray-read-pneuma-main-3.zip`
- `d90047a8174d_image.png`
- `e5b6f7373a8f_image.png`
- `ee0d38d9f96a_image.png`
- `f3b0b02ae7a0_image.png`
- `f438edc5f5b2_Pray-Read-Bible-Master-Prompt-For-Finestructure-Ai.pdf`
- `f4ad877aa93e_WhatsApp-Image-2026-11-23-at-4-49-46-PM.jpeg`
- `f8aa8ef69f41_image.png`

הנכסים הללו אינם אמורים לייבא עצמם ללא הפניה מקוד.

## 4.13 קבצים לא אקטיביים

### `__trash`

הקבצים הבאים הם גרסאות קודמות או כלי בדיקה ואינם אמורים להיכנס ל־build:

- `__trash/components/home/TodayCard.jsx`
- `__trash/components/home/WeekStrip.jsx`
- `__trash/components/layout/Sidebar.jsx`
- `__trash/components/layout/SignInBanner.jsx`
- `__trash/components/read/BookPicker.jsx`
- `__trash/components/read/ReflectionPanel.jsx`
- `__trash/functions/probeSources.js`
- `__trash/pages/Insights.jsx`
- `__trash/pages/Read.jsx`
- `__trash/pages/StrongsPopupTest.jsx`

### `__url_fetch`

ספרייה זו מכילה תגובות HTTP ו־HTML שנשמרו מ־bible-api.com, Bolls Life, Blue Letter Bible, Wordplanet, Wikimedia ומקורות נוספים. היא שימושית לניתוח פורמטים, אך אינה חלק מה־runtime.

---

# 5. מודל הנתונים

> רוב הקשרים הם קשרים לוגיים לפי שם או מזהה, ולא בהכרח Foreign Key מוגדר ב־FSe2.

## 5.1 רשומות ניהול ופעילות

### `ActivityLog`

**תכלית:** יומן פעולות במערכת ניהול התוכן.

**שדות עיקריים:**

- `actor`  -  המבצע או מזהה המנהל.
- `action`  -  סוג הפעולה, למשל יצירה, עדכון או מחיקה.
- `section`  -  תחום הפעולה במערכת.
- `detail`  -  פירוט חופשי של השינוי.

**קשרים:** משויך ל־`AdminAccount` דרך זהות אדמין או שדה `actor`. נקרא ונכתב על ידי owner/admin.

---

### `AdminAccount`

**תכלית:** שמירת פרטי כניסת הניהול.

**שדות עיקריים:**

- `email`  -  כתובת המנהל; שדה חובה.
- `password_hash`  -  hash של הסיסמה.
- `salt`  -  salt ייחודי למשתמש.
- `updated_date`  -  תאריך עדכון.

**קשרים:** משמש להתחברות דרך `adminAuth`; יומן `ActivityLog` יכול להפנות אליו.

---

## 5.2 תוכן מקרא

### `BibleVerse`

**תכלית:** ייצוג נורמלי של פסוק בודד, באנגלית ובלוגנדה.

**שדות עיקריים:**

- `book_number`  -  מספר הספר הקנוני.
- `book`  -  שם הספר.
- `chapter`  -  מספר פרק.
- `verse`  -  מספר פסוק.
- `text_en`  -  טקסט אנגלי.
- `text_lu`  -  טקסט לוגנדה.

**קשרים:** מתייחס ל־`bibleBooks`; יכול להיות מקור משותף ל־`KjvPlusChapter` ו־`LugandaChapter`, אך שתי האחרונות שומרות פרקים כ־JSON.

---

### `KjvPlusChapter`

**תכלית:** פרק KJV עם מספרי Greek/Hebrew מסומנים, המותקן מראש לקריאה מהירה.

**שדות עיקריים:**

- `book_number`
- `book`
- `chapter`
- `verse_count`  -  מספר הפסוקים.
- `verses`  -  מערך פסוקים בתוך מחרוזת JSON.

**קשרים:** קשור ל־`bibleBooks` לפי `book_number`. נקרא ציבורית, נכתב על ידי owner/admin.

---

### `LugandaChapter`

**תכלית:** פרק מקרא בלוגנדה.

**שדות:**

- `book_number`
- `book`
- `chapter`
- `verse_count`
- `verses`  -  JSON של פסוקי הפרק.

**קשרים:** כמו `KjvPlusChapter`; נכתב בעיקר על ידי `lugandaInstall`.

---

### `StrongEntry`

**תכלית:** מטמון הגדרות מילים מקראיות לפי קוד Strong’s.

**שדות עיקריים:**

- `code`  -  קוד מנורמל כגון `G2424` או `H0436`.
- `language`  -  Greek או Hebrew.
- `original_word`  -  המילה במקור.
- `transliteration`  -  תעתיק.
- `pronunciation`  -  הגייה.
- `part_of_speech`  -  חלק דיבור.
- `root_word`  -  שורש.
- `definition`  -  ההגדרה.
- `source`  -  למשל Blue Letter Bible.

**קשרים:** מקשר בין הקוד המוצג בפסוק להגדרה. יישום `StrongsPopup` עשוי לנסות לשמור ישירות ב־entity; כתוצאה מכך כתיבה על ידי קורא עלולה להיכשל בהתאם למדיניות ההרשאות.

---

## 5.3 תוכן לימוד וספרייה

### `Commentary`

**תכלית:** פירוש מקרא לרמת ספר ופרק, באנגלית ובלוגנדה.

**שדות:**

- `book`  -  שם הספר.
- `chapter`  -  מספר פרק.
- `title`  -  כותרת הפירוש.
- `body_en`  -  גוף אנגלי.
- `body_lu`  -  גוף לוגנדה.

**קשרים:** מתאים ל־`PassageTabs` ולמשאבי הספר. הקשר לספר מבוסס על שם, לא על `book_number`.

---

### `Devotional`

**תכלית:** מחקר יומי באנגלית ובלוגנדה.

**שדות עיקריים:**

- `code`  -  מזהה ייחודי כגון `D-001`.
- `title`, `title_lu`  -  כותרות.
- `scripture`, `scripture_lu`  -  פסוקים מרכזיים.
- `body`, `body_lu`  -  גוף המחקר.
- `related`  -  פסוקים קשורים.
- `further_readings`  -  קריאות נוספות.
- `cover_image`  -  תמונת כריכה.

**קשרים:** `DevotionalProgress.devotional_code` מפנה ל־`Devotional.code`.

---

### `DevotionalProgress`

**תכלית:** תיעוד מחקר שהקורא השלים.

**שדות:**

- `owner_email`  -  בעל ההתקדמות.
- `devotional_code`  -  קוד המחקר.
- `completed_date`  -  תאריך השלמה.

**קשרים:** התקדמות רב־מכשירית; נשמר גם במטמון מקומי כעותק מקומי.

---

### `Insight`

**תכלית:** תובנית תיאולוגית או היסטורית הקשורה למעבר מקרא.

**שדות:**

- `kind`  -  `theological` או `historical`.
- `title`
- `passage`
- `excerpt`
- `body`
- `share_count`  -  מספר שיתופים.

**קשרים:** מוצג ב־`InsightsBoard`, ב־`PassageTabs` וב־`ChapterResourcesPanel`.

---

### `Prayer`

**תכלית:** תפילה מספריית התפילות.

**שדות:**

- `title`, `title_lu`
- `category`
- `body_en`, `body_lu`
- `scripture_ref`  -  הפניית מקרא המשמשת להתאמת התפילה לפסוק.

**קשרים:** `PrayerSaved.prayer_title` מפנה אל `Prayer.title`.

---

### `PrayerSaved`

**תכלית:** שמירת תפילה למועדפי הקורא.

**שדות:**

- `owner_email`
- `prayer_title`

**קשרים:** קשור ל־`Prayer` לפי כותרת. חיבור לפי כותרת רגיש לשינוי שם עתידי.

---

### `QAEntry`

**תכלית:** שאלת קורא ותשובה פסטורלית.

**שדות:**

- `question`
- `category`
- `answer`
- `passage_ref`
- `answered_by`
- `status`  -  מצב התשובה, למשל ממתין או פורסם.
- `author_email`  -  שואל.

**קשרים:** נקרא ציבורית; משתמש מחובר יכול ליצור רשומה, והנהלה מעדכנת ומוחק.

---

### `VerseOfDay`

**תכלית:** פסוק מומלץ לתאריך מסוים.

**שדות:**

- `verse_date`
- `reference`
- `text_en`
- `text_lu`
- `note`

**קשרים:** משמש ב־`Home` וב־`VerseOfDay`; אינו מקושר באופן רשמי ל־`BibleVerse`.

---

## 5.4 קהילה

### `DiscussionGroup`

**תכלית:** קבוצת לימוד או דיון.

**שדות:**

- `name`
- `description`
- `schedule`
- `member_count`

**קשרים:** `DiscussionThread.group_name` מפנה לשם הקבוצה.

---

### `DiscussionThread`

**תכלית:** הודעה בקבוצת דיון.

**שדות:**

- `group_name`
- `owner_email`
- `author_name`
- `title`
- `body`

**קשרים:** קשור ל־`DiscussionGroup` לפי `group_name`.

---

### `LiveSession`

**תכלית:** שיעור הוראה חי עתידי.

**שדות:**

- `title`
- `session_date`
- `host`
- `join_link`
- `description`

**קשרים:** אין קשר ישיר למשתמשים; מיועד להיות נקרא ציבורית.

---

### `Revelation`

**תכלית:** גילוי אישי של קורא; אותו entity מייצג גם תגובות.

**שדות:**

- `owner_email`
- `author_name`
- `title`
- `passage`
- `body`
- `likes`
- `parent_id`  -  מזהה הפוסט האב כאשר הרשומה היא תגובה.

**קשרים:** קשר עצמי מ־`Revelation.id` אל `Revelation.parent_id`.

---

## 5.5 התקדמות, סימונים ויומן

### `Reading`

**תכלית:** רשומת השלמת פרק, כולל משוב אישי.

**שדות:**

- `owner_email`
- `book`
- `chapter`
- `translation`
- `plan_day`
- `read_date`
- `status`
- `reflection`
- `prayer_point`
- `highlighted_verses`  -  רשימת פסוקים מסומנים, כנראה כמחרוזת.

**קשרים:** `plan_day` מקשר ל־`ReadingPlan.day`; משמש לחישוב streak ולהצגת התוכנית.

---

### `ReadingPlan`

**תכלית:** הגדרת תוכנית הקריאה.

**שדות:**

- `day`
- `book`
- `chapter`
- `title`
- `theme`
- `focus`
- `scripture`

**קשרים:** `Reading.plan_day` מפנה אליו. יש לו גם fallback מקומי ב־`planData`.

---

### `ReadingActivity`

**תכלית:** פיד פעילות אישי.

**שדות:**

- `owner_email`
- `activity_type`  -  למשל `chapter_visit`, `highlight`, `bookmark`, `note_saved`, `prayer_opened`, `devotional_access`.
- `book`
- `book_number`
- `chapter`
- `verse`

**קשרים:** קשור לפעולות המבוצעות ב־`activity.js`; `ActivityFeed` מסנן לפי בעל הפעילות.

---

### `StudyMark`

**תכלית:** סימון או הערה שנשמרו על פסוק מסוים.

**שדות:**

- `owner_email`
- `mark_type`  -  `highlight`, `bookmark` או `note`.
- `book_number`
- `book`
- `chapter`
- `verse`
- `color`
- `note_text`

**קשרים:** משמש ב־`VerseActionBar`, ב־`BibleNotes` וב־`Dashboard`.

---

### `StudyAnnotation`

**תכלית:** הערת טקסט על מבוא, מבנה, תפילה או פסוק פתוח.

**שדות עיקריים:**

- `owner_email`
- `book_number`
- `book`
- `section`  -  `intro`, `outline`, `prayer` או `verse`.
- `block_id`  -  מזהה יחיד של בלוק הטקסט.
- `kind`  -  `highlight` או `underline`.
- `color`
- `start_offset`  -  תחילת הטקסט הנבחר בתוך הבלוק.
- `end_offset`  -  סוף הטקסט הנבחר.

**קשרים:** נשמר בשרת וב־IndexedDB; `mergeAnnotations` ממזג את שני המקורות.

---

### `JournalEntry`

**תכלית:** רשומת יומן תפילה אישית.

**שדות:**

- `owner_email`
- `entry_date`
- `title`
- `body`
- `category`  -  למשל praise, petition, confession, thanksgiving, reflection.
- `book`
- `chapter`
- `mood`

**קשרים:** `book` ו־`chapter` מקשרים את הרשומה למקרא; אין Foreign Key.

---

## 5.6 הגדרות ופניות

### `ContactMessage`

**תכלית:** הודעה מטופס יצירת קשר.

**שדות:**

- `name`
- `email`
- `subject`
- `message`
- `is_read`
- `reply`  -  תשובת הצוות.

**קשרים:** נוצר על ידי גולש; נקרא ונעדכן על ידי מנהל.

---

### `SiteSettings`

**תכלית:** הגדרות אתר גלובליות, בעיקר ערכת מותג וקישור תרומה.

**שדות:**

- `setting_key`  -  שם ההגדרה.
- `setting_value`  -  ערך, לרוב כמחרוזת.

**קשרים:** `ThemeContext` קורא את ההגדרות וממיר אותן למשתני CSS.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 טעינת האפליקציה

1. `Layout` יוצר את `AuthProvider`.
2. בתוך `AuthProvider` נטענים המשתמש וה־session דרך `fse2.auth.me()`.
3. `ThemeProvider` טוען הגדרות מותג עבור משתמש מחובר.
4. `PlayerProvider` יוצר אובייקט `Audio` יחיד לכל האפליקציה.
5. `PwaHead` מוסיף metadata ורישום Service Worker.
6. `AppHeader`, תוכן הדף, `AppFooter` ו־`GlobalPlayer` מרונדים סביב הדף.
7. רכיבי ה־`BRAND_CSS` מחילים את משתני הצבע ומחלקות `pr-*`.

**נקודת Debug:** אם `useAuth` זורק שגיאה, רכיב שאינו תחת `AuthProvider` הוא הגורם; רכיבי ה־pages צריכים להיות מוכנסים דרך `Layout`.

---

## 6.2 התחברות קורא מול התחברות מנהל

### קורא
- נכנס דרך `fse2.auth.login`.
- מצב המשתמש מנוהל ב־`AuthContext`.
- נתוני המשתמש נשמרים לפי `owner_email`.

### מנהל CMS
- נכנס דרך `functions/adminAuth.js`.
- מקבל token חתום.
- ה־token נשמר ב־`localStorage` תחת `pr_admin_token`.
- `adminContent`, `kjvInstall` ו־`lugandaInstall` מאמתים את אותו token.

**חשוב:** מצב מחובר של קורא אינו מעניק גישה ל־AdminDashboard, והתחברות מנהל אינה מחליפה את מצב `useAuth`.

---

## 6.3 בחירת ספר ופרק

1. המשתמש נכנס ל־BibleReader.
2. `BookGrid` מסנן את הספרים לפי:
   - שם אנגלי.
   - שם לוגנדה.
   - קיצור אנגלי.
   - קיצור לוגנדה.
3. לחיצה על ספר מעדכנת את מצב הספר הנבחר.
4. `ChapterSelector` מציג את `BookSidebar` ו־`ChapterGrid`.
5. בחירת פרק מנווטת ל־`/Chapter` עם `book` ו־`chapter`.
6. בחירת ספר מחדש מחזירה את המשתמש לתהליך דומה.

**נקודת Debug:** אם ספר לא מוצג, לבדוק תחילה את `book.number`, את מערכי `OLD_TESTAMENT` ו־`NEW_TESTAMENT`, ואת שם השדה שמועבר ל־`getBookNumber`.

---

## 6.4 טעינת פרק מקרא

1. `Chapter` קורא את `book`, `chapter`, `verse` ו־`lang` מה־URL.
2. `VersionPicker` קובע את גרסת המקרא הפעילה.
3. `bibleApi.fetchChapter` בודק אם הפרק קיים ב־IndexedDB.
4. אם הפרק לא נמצא או דורש רענון, מתבצעת שאילתת שרת או מקור חיצוני.
5. התוצאה מנורמלת לפסוקים עם `verse` ו־`text`.
6. ב־KJV+ מתווספים קודי Strong’s.
7. הפרק נשמר מקומית דרך `offline` כדי לשמש במצב offline.
8. ה־UI מציג מספר פסוק, טקסט, פעולות ותוכן לימוד.

**מקורות חלופיים:**

- English: bible-api.com.
- Luganda: wordplanet.net.
- KJV+ מותקן: `KjvPlusChapter`.
- מטמון מקומי: IndexedDB.

**נקודת Debug:** אם מוצגת שגיאת “פרק לא נמצא”, לבדוק:

- תקינות `book_number`.
- מפתח המטמון הכולל גרסה ושפה.
- תקינות JSON של `verses`.
- האם `fetchChapter` מחזיר מערך `verses` או אובייקט עטוף.

---

## 6.5 הצגת Strong’s ומילון

1. `StrongsText` מפרק קודים בפורמט `(G2424)` או `(H0436)`.
2. הקוד מוצג כ־superscript אינטראקטיבי.
3. לחיצה מעבירה את הקוד ל־`StrongsPopup`.
4. הקוד מנורמל, למשל `H0436` → `H436`.
5. `StrongsPopup` מחפש רשומה קיימת ב־`StrongEntry`.
6. אם אין רשומה, הוא מבקש מהשרת לאחר הגדרה מ־Blue Letter Bible.
7. ההגדרה מוצגת עם:
   - מקור המילה.
   - תעתיק.
   - הגייה.
   - חלק דיבור.
   - שורש.
   - הגדרה.
8. התוצאה נשמרת למטמון כדי שהפעם הבאה תהיה מהירה.

**נקודת Debug:** שגיאת כתיבה לא אמורה להפיל את המקרא; הקוד בולט בכוונה והפופ־אפ ממשיך לעבוד גם אם שמירת המטמון נכשלת.

---

## 6.6 סימון טקסט ו־Highlight בספר

1. המשתמש בוחר חלק מטקסט ב־`AnnotatedText`.
2. הרכיב מחשב את `start_offset` ו־`end_offset` בתוך `block_id`.
3. מופיעה אפשרות לבחור צבע או underline.
4. ההערה נשמרת בשרת כ־`StudyAnnotation`.
5. במקביל היא נשמרת ב־IndexedDB.
6. בטעינה הבאה `mergeAnnotations` מחבר בין השרת למטמון.
7. `buildSegments` מפצל את הטקסט לפי כל נקודות השינוי ומציג את הסימונים.

**סיכון חשוב:** ה־offsets תקפים רק כלעוד הטקסט המקור לא השתנה. שינוי במבוא, בתפילה או בפרשייה עלול להזיז סימונים.

---

## 6.7 סימון פסוק, bookmark והערה

1. בחירת פסוק מציגה את `VerseActionBar`.
2. המשתמש יכול:
   - להדגיש.
   - לשמור כ־bookmark.
   - לכתוב הערה.
   - להעתיק.
   - לשתף.
   - לפתוח תפילה, פירוש או הפניות.
3. הפעולה נשמרת כ־`StudyMark`.
4. בהתאם לפעולה נרשמת גם `ReadingActivity`.
5. הסימונים מופיעים ב־BibleNotes וב־Dashboard.

**נקודת Debug:** לפני הוספת סוג חדש ל־`StudyMark`, יש לעדכן גם את הסינון ב־BibleNotes, את `ActivityFeed`, את `ACTIVITY_TYPES` ואת כפתורי `VerseActionBar`.

---

## 6.8 הפניות, מחקר ותפילת פסוק

### הפניה חוצה
1. `getCrossReferences` מחזיר הפניות אוצרות.
2. בחירת הפניה פותחת `FloatingVerse`.
3. מהפופ־אפ אפשר לעבור ל־Chapter URL מלא.

### מחקר לפי מעבר
1. `PassageTabs` מבקש commentary, insights ו־Q&A.
2. הטאב הנבחר מציג את התוכן הרלוונטי.
3. אין תוכן חי, המערכת משתמשת ב־`seedContent` וב־`bookStudyContent`.

### תפילת פסוק
1. `matchesPassage` מנסה להתאים את `scripture_ref` לשם הספר, הפרק והפסוק.
2. תפילות מתאימות מוצגות ב־`PassagePrayer`.
3. המשתמש יכול להחליף שפה, לסמן את התפילה ולפתוח הפניות.

---

## 6.9 התקדמות קריאה ותוכנית

1. פתיחת פרק רושמת `chapter_visit`.
2. סיום פרק יוצר רשומת `Reading`.
3. אם הפרק תואם ליום בתוכנית, נמצא `plan_day`.
4. ה־`Reading` מסמן את היום כ`completed`.
5. `Plan` מחשב אילו ימים הושלמו, מהו היום הנוכחי ומה אחוז ההתקדמות.
6. `computeStreak` מחשב את רצף הימים.
7. `Dashboard` מציג את הנתונים ואת `ActivityFeed`.

**נקודת Debug:** חיבור תוכנית לפרק מתבצע לפי שם הספר ומספר הפרק, ולכן שינויי casing או שינוי שם ספר עלולים לשבור את ההתאמה.

---

## 6.10 פתיחת והשלמת מחקר

1. הדף טוען מחקרים חיים דרך React Query.
2. אם אין מחקרים חיים, מוצג `seedContent`.
3. בחירת מחקר פותחת Modal.
4. `formatEnglishDevotional` או `formatLugandaDevotional` משכללים את תצוגת התוכן.
5. סימון “הושלם”:
   - מעדכן מצב מקומי.
   - יוצר `DevotionalProgress` למשתמש מחובר.
   - מציג התראת הצלחה.

---

## 6.11 יומן תפילה

1. `Journal` שולף רשומות של המשתמש.
2. לחיצה על New מציגה את `JournalForm`.
3. הטופס מאכלס מידע מ־URL או מרשומה קיימת.
4. בעת עריכה, `initial` מתעדכן והטופס מתאפס אליו.
5. שמירה יוצרת או מעדכנת `JournalEntry`.
6. מחיקה דורשת אישור דרך `deleteTarget`.
7. הרשימה מתרעננת דרך React Query.

---

## 6.12 שמירת תפילה ואינסייגט

### תפילה
- השמירה יוצרת `PrayerSaved`.
- ההסרה מוצאת רשומה קיימת לפי `owner_email` ו־`prayer_title` ומוחקת אותה.

### אינסייגט
- השמירה נשמרת בלבד ב־`localStorage`.
- היא אינה עוברת בין מכשירים ואינה נרשמת ב־Activity.

---

## 6.13 פעילות קהילה

### פרסום גילוי
1. משתמש לא מחובר מופנה ל־Login.
2. משתמש מחובר שולח כותרת, פסוק וגוף.
3. נוצרת רשומת `Revelation` ללא `parent_id`.
4. הפיד מתרענן.

### לייק
1. הכרטיס מציג את מספר הלייקים.
2. הלייק מתבצע דרך mutation.
3. ה־UI מציג מידיות מקומית בזמן הבקשה.

### תגובה
1. תגובה נוצרת כ־`Revelation` נוסף.
2. `parent_id` מקשר אותה לפוסט האב.
3. התגובות מוצגות ב־`CommentThread`.

---

## 6.14 קבוצת דיון

1. המשתמש בוחר קבוצה מרשימת הקבוצות.
2. הודעות הקבוצה נטענות לפי `group_name`.
3. משתמש מחובר יכול לשלוח הודעה חדשה.
4. הודעה חדשה נוצרת כ־`DiscussionThread`.
5. מצב הצטרפות נשמר מקומית בלבד ב־`localStorage`.

---

## 6.15 הורדת תוכן ל־Offline

1. `Offline` מציג את המאגרים הזמינים:
   - chapters.
   - verses.
   - devotionals.
   - commentary.
   - prayers.
   - qa.
   - verseOfDay.
2. המשתמש בוחר תוכן, היקף וגרסת מקרא.
3. במצב “תוכנית” נטענים בעיקר יוחנן ותהלים.
4. במצב “כל הספרים” נטענים ספרים נבחרים או מלאים.
5. כל הורדה נכתבת ל־IndexedDB.
6. `progress` מציג כמה פריטים הושלמו.
7. ב־BibleReader ספר נחשב “זמין offline” רק אם כל פרקיו קיימים במאגר עבור אותה שפה/גרסה.
8. ניתן למחוק מאגרים ולראות את שימוש האחסון.

---

## 6.16 נגן אודיו גלובלי

1. `VerseSongs` או `VerseSongSeries` מרכיבים מערך tracks.
2. `playQueue` מעדכן את `PlayerProvider`.
3. ה־`Audio` היחיד מתחיל לפעול.
4. המשתמש יכול:
   - להפעיל ולהשהות.
   - לדלג לשעבר או להקדים.
   - לשנות עוצמה ומהירות.
   - להפעיל shuffle.
   - לבחור repeat off/all/one.
   - לפתוח תצוגה מורחבת.
5. השמעה נמשכת בין ניווט בין דפים כי ה־provider נמצא ברמת `Layout`.

---

## 6.17 התקנת PWA

1. `PwaHead` רושם את `/sw.js`.
2. `InstallPrompt` ממתין לאירוע `beforeinstallprompt`.
3. בעת לחיצה, ה־prompt המובנה של הדפדפן מוצג.
4. לאחר `appinstalled` או קבלת `accepted`, המסך מסמן שהאפליקציה מותקנה.
5. ב־iOS מוצגות הוראות ידניות כאשר אין prompt מובנה.

---

# 7. הערות טכניות לפיתוח

## 7.1 ספריות וכלי עבודה מרכזיים

| ספרייה | שימוש |
|---|---|
| React | רכיבי ממשק, state, effects ו־contexts. |
| React Router | ניתוב, פרמטרי query, לינקים ו־redirect. |
| TanStack React Query | אחזור cache של collections, mutations ו־invalidation. |
| Lucide React | סמלי ממשק אחידים. |
| date-fns | תאריכים, תצוגה ורצף קריאה. |
| FSe2 client | גישה ל־entities, auth ו־functions. |
| IndexedDB | מטמון offline. |
| localStorage | העדפות קלות, התקדמות מקומית ו־session token. |
| Service Worker API | PWA ו־caching. |
| Tailwind utility subset | עיצוב משלים במספר רכיבים. |
| `BRAND_CSS` | מערכת העיצוב העיקרית וה־CSS variables. |

---

## 7.2 דפוסים חוזרים

### Fallback מכנה

מספר דפים מציגים תוכן מקומי כאשר ה־API מחזיר רשומות ריקות:

- `DEVOTIONALS`.
- `PRAYERS`.
- `INSIGHTS`.
- `VERSE_SONGS`.
- `LIVE_SESSIONS`.
- `COMMUNITY_POSTS`.
- `DISCUSSION_GROUPS`.
- `PLAN_DAYS`.
- תוכן הלימוד לפי ספר.

היתרון הוא שהמסך לא נשאר ריק. עם זאת, חשוב להבדיל בין “אין נתונים” לבין “הטענה נכשלה”, כדי לא להציג בטעות seed במקום הודעת שגיאה.

### React Query

השימוש המרכזי:

- `queryKey` מתאר את הנתונים.
- `queryFn` טוען אותם.
- `enabled` מונע קריאות עבור משתמש שאינו מחובר.
- `invalidateQueries` מרענן מידע לאחר mutation.

כל שינוי במבנה המידע דורש בדיקה של כל ה־query keys הרלוונטיים.

### כתיבה כפולה: שרת + מכשיר

הדגם המרכזי משמש ב:

- `StudyAnnotation`.
- התקדמות מחקרים.
- סימוני פסוקים.
- הערפות קבוצות.
- מועדפי אינסייגטים.
- תוכן offline.

היתרון הוא עבודה offline וחוויה מהירה. החיסרון הוא צורך להגדיר מדיניות merge ומחיקה כאשר המכשיר חוזר להיות מקוון.

### קבצים מקומיים מול שרת

| נתונים | מקור עיקרי |
|---|---|
| סימון והערות | `StudyMark` |
| הערות טקסט | `StudyAnnotation` + IndexedDB |
| התקדמות מחקרים | `DevotionalProgress` + localStorage |
| יומן | `JournalEntry` |
| התקדמות קריאה | `Reading` |
| הצטרפות לקבוצה | localStorage בלבד |
| אינסייגטים שמורים | localStorage בלבד |
| טוקן ניהול | localStorage |
| גרסת מקרא פעילה | localStorage |
| פרקים offline | IndexedDB |

---

## 7.3 כשמוסיפים entity חדש

1. יוצרים `entities/EntityName.json`.
2. מגדירים שדות, סוגים, required ו־labels.
3. בוחרים מדיניות:
   - קריאה ציבורית.
   - כתיבת owner/user.
   - כתיבת admin בלבד.
4. מוסיפים קריאה ל־`contentApi` או ל־`functions/content.js`.
5. מוסיפים mapping ב־`AdminDashboard.FIELDS` אם צריך ניהול דרך CMS.
6. מוסיפים fallback מקומי אם התוכן חייב להופיע תמיד.
7. מוסיפים את ה־entity ל־`MANAGED` ב־`adminContent.js` אם הוא נמנהל דרך השרת.
8. מגדירים query key ייחודי.
9. מוסיפים אינטראקציות create/update/delete.
10. בודקים את כללי ה־owner ואת סינון השורות בצד הלקוח.

---

## 7.4 כשמוסיפים גרסת מקרא

יש לקחת בחשבון:

1. הוספת הגרסה ל־`VERSIONS`.
2. קביעת `id`, `language`, `translation`, `strongs` ו־`note`.
3. הגדרת דרך טעינה:
   - מקור חיצוני.
   - entity מותקן.
   - קובץ offline.
4. עדכון מפתח המטמון כך שגרסה לא תתנגש עם גרסה אחרת.
5. עדכון `VersionPicker`.
6. עדכון `bibleApi.fetchChapter`.
7. עדכון `bibleChapter`.
8. עדכון התקנת המאגר ב־Offline.
9. בדיקת Strong’s עבור גרסאות עם קודים.
10. בדיקת תצוגת השפה הכפולה.

---

## 7.5 כשמוסיפים דף

1. יוצרים קובץ תחת `pages/`.
2. רושמים את הדף במנגנון הניתוב שמחוץ לקטע המקור שסופק.
3. משתמשים ב־`createPageUrl` כדי לייצר לינקים.
4. מוסיפים קישור ל־`AppHeader` או `AppFooter` אם נדרש.
5. מוסיפים רשומה ל־`public/sw.js` אם הדף אמור לעבוד offline.
6. מוסיפים כותרת, תיאור ו־SEO metadata.
7. בודקים behavior במובייל וב־PWA.

---

## 7.6 עקרונות אבטחה

### התחברות מנהל

- `adminAuth` משתמש ב־SHA-256 עם salt.
- ה־session נחתם ב־HMAC.
- TTL הוא 12 שעות.
- הטוקן נשמר ב־`localStorage`, ולכן חשוף ל־XSS ברמת הדפדפן.
- יש סיסמת ברירת מחדל קבועה בקוד כש־`ADMIN_INITIAL_PASSWORD` אינו מוגדר. אין להשאיר אותה בסביבת production.
- SHA-256 יחיד אינו מתאים כיום לאחסון סיסמאות; מומלץ להשתמש ב־PBKDF2, bcrypt, scrypt או Argon2 עם עליות עבודה.
- מומלץ להגביל login, להוסיף rate limiting ולרשום ניסיונות כניסה.

### הרשאות Entity

- Entity של קורא מגדיר roles כגון `user` ו־`authenticated`.
- חלק מה־entities אינן מגדירים condition מפורש לפי בעלות.
- גם אם ה־UI מסנן לפי `owner_email`, ההגנה האמיתית צריכה להתבצע ב־API.
- יש להימנע מהעברת כל הרשומות האישיות ללקוח אם אפשר להשתמש בשאילתה מוגבלת לבעל הרשומה.

### הגשות ציבוריות

טופסי Contact ו־QA מתקבלים בקשות מאנשים לא מחוברים. מומלץ:

- Rate limiting.
- אימות אורך וסוג.
- Captcha או אימות דוא"ל.
- הגבלת כמות.
- מניעת spam.
- ניקוי ו־escaping של תוכן.

### `safeText`

`safeText` ממיר ערכים למחרוזת בטוחה מבחינת type, אך אינו מנקה HTML. שימוש ב־React JSX מגן מפני הזרקת HTML רגילה; עם זאת, אין להשתמש ב־`safeText` כחלופה ל־sanitizer כאשר הערך מוזרק ל־`dangerouslySetInnerHTML`.

### Strong’s

הגדרת Strong’s נשמרת במטמון ציבורי. יש להגביל את ה־API מפני abuse ולוודא שרק קודי `H` ו־`G` תקינים מתקבלים.

---

## 7.7 עקרונות ביצוע ואמינות

### עדכון מקבילי

כמה פעולות משתמשות ב־read-modify-write:

- לייק גילוי.
- מספר חברים.
- התקדמות תוכנית.
- מצב מטמון.

בעת עבודה עם כמה מכשירים או משתמשים, עדיף לבצע עדכון אטומי או להשתמש ב־transaction/operation ייעודי.

### כפילויות

- `PrayerSaved` עשוי להיווצר פעמיים אם המשתמש לוחץ מהר.
- סימוני קריאה עלולים להיווצר כפולים.
- התקנת KJV/Luganda צריכה להיות idempotent או לבדוק קיום לפני יצירה.
- לא להסתמך על `title` או `name` כמפתח ייחודי יחיד.

### קשרים שבירים

הקשרים הבאים מבוססים על טקסט ועלולים להישבר:

- `PrayerSaved.prayer_title` → `Prayer.title`.
- `DiscussionThread.group_name` → `DiscussionGroup.name`.
- `VerseSongEpisode.series_name` → `VerseSongSeries.name`.
- `Commentary.book` → ספר קנוני.
- `Reading.book` → ספר קנוני.

עדיף להוסיף מזהה יציב או `book_number` לפני שינויים נוספים.

---

## 7.8 ביצועים

### נפחי שאילתות

מספר רכיבים טוענים מאות רשומות ומסננים בצד הלקוח:

- `StrongEntry.list(..., 1000)`.
- `Reading.list(..., 300)`.
- `StudyMark.list(..., 300)`.
- `JournalEntry.list(..., 200)`.
- collections של תפילות, מחקרים ואינסייגטים.

ככל שהמערכת תגדל, עדיף:

- להשתמש בשאילתות מסוננות.
- להוסיף pagination.
- להחזיר רשומות רלוונטיות בלבד.
- להוסיף אינדוקסים לשדות `owner_email`, `book_number`, `chapter`, `series_name`, `code`.

### זיכרון ו־render

- `Community` ו־`InsightsBoard` ממזגים seed ו־נתונים חיים בכל render.
- `BookStudyResources` מחשב מסננים על כמה מאות רשומות.
- `AnnotatedText` מפצל טקסט בכל שינוי annotations.
- לשים לב ל־`useMemo` סביב חישובים כבדים.

### מטמון

- `offlineDb` משתמש ב־IndexedDB עם `DB_VERSION = 4`.
- כל שינוי במבנה ה־stores דורש bump גרסה ו־migration.
- יש לנקות נתונים ישנים אם המבנה שלהם השתנה.
- כריסה לא לשכוח לבדוק את `chapterKey`: הוא חייב לכלול גרסה ושפה.

---

## 7.9 PWA ונתונים מטמונים

### Service Worker

- `SHELL_CACHE` ו־`RUNTIME_CACHE` מוגדרים בגרסה `v1`.
- שינוי בקוד דורש bump של שם ה-cache כדי למנוע הגשה לקבצים ישנים.
- `skipWaiting` עלול להחליף cache באמצע session פעיל.
- יש לבדוק ש־`cache.addAll` לא נכשל בגלל route שחסר.
- יש לוודא שנתיבי `SHELL` תואמים למנגנון הניתוב בפועל.

### PWA metadata

- `PwaHead` מוסיף metadata רק אם אינו קיים.
- `manifest.json` והאייקונים צריכים להיות נגישים גם ללא session.
- שינוי שם האפליקציה או הצבעים דורש עדכון גם ב־`manifest.json`, גם ב־`theme.js` וגם ב־`PwaHead`.

---

## 7.10 נגישות

המערכת משתמשת באופן נגיש ב:

- `aria-label`.
- `aria-current`.
- `aria-selected`.
- `role="dialog"`.
- `aria-live`.
- `alt` ללוגו.
- כפתורים אמיתיים.
- `tabIndex` לאזורים אינטראקטיביים.

נקודות שכדאי להמשיך לשפר:

1. `Modal` אינו מיישם focus trap.
2. אין מיקוד אוטומטי לאלמנט הראשון ב modal.
3. אין focus restoration לאחר סגירה.
4. כפתורי `Escape` תלויים ב־`onClose` stable.
5. חלק מהאזורים עם `role="button"` עשויים לדרוש טיפול מפורש ב־Enter וב־Space.
6. אין כלל שמפריד מסך ריק מ־שגיאת רשת.
7. מסרים צריכים להיות מוצגים באזור live region בעת החלפת מצב.

---

## 7.11 בעיות נפוצות ונקודות בדיקה

| תסמונת | נקודה לבדיקה |
|---|---|
| הדף נטען אך אין תוכן | React Query error, סוג collection, fallback seed ו־`enabled`. |
| פרק לא מוצג | `book_number`, `chapter`, גרסה, שפה, מפתח cache ו־JSON של `verses`. |
| KJV+ מציג קודים אך ההגדרה נכשלת | תקינות BLB parser, נרמול `H0436`, זמינות `StrongEntry` והרשאות כתיבה. |
| הערות משתנות מקום | שינוי בטקסט המקור או ב־`block_id`. |
| כל המשתמשים רואים את אותו מידע | `queryKey`, אירוק `owner_email`, ו־cache key לפי משתמש. |
| התקנת לוגנדה עוצרת באמצע | תגובת מקור חיצוני, קצב בקשות, תקינות token ו־loop 90. |
| כפתור “הושלם” לא נשמר | הרשאת `DevotionalProgress`, localStorage ו־email מחובר. |
| התרומה אינה נפתחת | קישורי `DONATE_URL` ו־`DONATE_LINK_PROPS`. |
| הלוגו אינו מוצג | כתובת `LOGO_URL` ו־fallback `onError`. |
| התקנת PWA אינה מופיעה | תמיכת דפדפן, HTTPS/localhost, תקינות manifest ו־Service Worker. |
| הנגן ממשיך לעבוד בכל הדפים | מיקום `PlayerProvider` בתוך `Layout`. |
| המנהל מחובר אך אין לו גישה | טוקן `pr_admin_token`, תוקף session, secret חתימה והתאמת email. |
| מחקר לא מתעדכן אחרי עריכה | `queryClient.invalidateQueries` והתאמת query key. |
| נתונים ישנים מוצגים לאחר deploy | שמות cache של Service Worker ו־React Query. |

---

## 7.12 נקודות טכניות מומלצות לשיפור

1. **להוסיף בדיקות יחידה** ל־`scriptureRefs`, `strongs`, `matchesPassage`, `readings`, `offlineDb` ול־מיזוג annotations.
2. **להוסיף integration tests** ל־התקנת KJV/Luganda ולזרימת התחברות מנהל.
3. **להחליף את טבלת הסיסמאות** באלגוריתם עמיד יותר.
4. **להוציא את טוקן הניהול מ־localStorage** אם פלטפורמת הפריסה מאפשרת cookie מאובטח.
5. **להוסיף rate limiting** ל־login, contact, QA ו־Strong’s.
6. **להוסיף אימות server-side לבעלות** רשומות אישיות.
7. **להוסיף מזהי קבועים** במקום קשרים לפי שם.
8. **להוסיף migrations** ל־IndexedDB ול־Service Worker.
9. **להוסיף error boundary** ברמת האפליקציה וברמת הדף.
10. **להוסיף retry/backoff** למקורות חיצוניים.
11. **להוסיף observability**: לוג מובנה להתקנות, כתיבות ושגיאות מקור חיצוני.
12. **לנקות assets כפולים** ולהפריד בין assets פעילים לחומרי רפייה.
13. **להוסיף בדיקות accessibility**.
14. **להוסיף cache busting** מבוסס build hash.
15. **להגדיר מדיניות מקור חיצוני** אחידה: תגובה לא עובדת, timeout, retry ו־הודעה למשתמש.
16. **להוסיף מדדי ביצועים** לזמן טעינת פרק, גודל מטמון ושיעור כשלי cache.

---

# סיכום מפעיל

מערכת Pray-Read בנויה סביב ארבע שכבות:

1. **תוכן ונתונים**  -  entities, seed content ומקורות חיצוניים.
2. **שירותי גישה**  -  `fse2`, React Query, Server Functions ו־IndexedDB.
3. **לוגיקת קורא**  -  קריאת פרקים, סימונים, תפילות, מחקר, קהילה והתקדמות.
4. **ממשק ועיצוב**  -  רכיבי `pr-*`, Header/Footer, PWA ונגן גלובלי.

הנתיב המרכזי להבנת המערכת הוא:

`BibleReader` → בחירת ספר → `ChapterSelector` → `Chapter` → `bibleApi.fetchChapter` → `IndexedDB/Entity/מקור חיצוני` → עיבוד ותצוגת פסוקים → `VerseActionBar`, `PassageTabs`, `PassagePrayer`, `StrongsPopup`, `AnnotatedText`.

להבנת ה־CMS:

`Admin` → `adminAuth` → `AdminDashboard` → `adminContent` → entities → React Query → המסכים הציבוריים.

להבנת העבודה ללא רשת:

`Offline`/`VersionPicker` → `lib/versions` → `lib/offlineDb` → `lib/bibleApi` → fallback מקומי.
```
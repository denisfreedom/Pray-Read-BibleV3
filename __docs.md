# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד טכני  -  Pray-Read Bible

> **הערת היקף:** התיעוד מבוסס על קטעי המקור שסופקו. חלק מהקבצים והסכמות נחתכו, וקובצי הכניסה והניתוב הראשיים של האפליקציה לא הוצגו. לכן שמות הכתובות להלן הם שמות העמודים הלוגיים שמשמשים את `createPageUrl`, ולא בהכרח נתיבי HTTP מלאים בכל סביבת פריסה. בפרט, פרטי שדות שלא הופיעו במפורש בקוד מתוארים ברמת התכלית, ולא כהתחייבות לסכמה מלאה.

---

## 1. מהות המערכת

**Pray-Read Bible** היא אפליקציית React לקריאה וללימוד של התנ״ך, המשלבת תוכן באנגלית ובלוגנדה עם כלים ללימוד, תפילה ומעקב אישי.

האפליקציה מיועדת לקוראים פרטיים ולקהילות המעוניינים לקרוא פרקים שלמים, לשמור סימונים אישיים, להשתמש בחומרי עזר, ולהמשיך בקריאה גם כאשר החיבור לרשת מוגבל. לצד חוויית הקורא קיימת מערכת ניהול תוכן למנהלים.

### יכולות מרכזיות

- **קורא תנ״ך:** רשימת 66 הספרים, חלוקה לברית הישנה והחדשה, בחירת פרק ומעבר לקריאה.
- **תרגומים ושפות:** אנגלית ולוגנדה, לצד מנגנון לבחירת גרסאות תנ״ך נתמכות.
- **חומרי לימוד:** מבואות לספרים ולפרקים, מתאר ספר, פירושים, הפניות מקבילות, תובנות תאולוגיות והיסטוריות ותפילות.
- **סימונים אישיים:** הדגשה, קו תחתון, סימנייה והערות לפסוקים; חלק מהסימונים יכולים להיות משויכים לחשבון וחלקם נשמרים גם במכשיר.
- **Strong’s:** הצגת מספרי Strong’s בטקסט KJV+ ופתיחת חלונית עם הגדרות מילוניות.
- **תכנים נוספים:** תפילות, קריאות יומיות, תכנית קריאה, יומן, שאלות ותשובות, תובנות, שירים המבוססים על פסוקים ותכני קהילה.
- **גישה לא מקוונת ו-PWA:** שמירת תוכן ב-IndexedDB, שירות דרך Service Worker, ומרכז ייעודי לניהול הורדות.
- **מערכת ניהול:** עריכת רשומות, ייבוא קובצי JSON, ניהול חומרי תפילה והפניות, התקנת תרגומים ובדיקת תקינות ספריית התנ״ך.

### מקורות נתונים עיקריים

- **FSE2:** ישויות ותוכן שמורים, הזדהות ופונקציות שרת.
- **תוכן seed מקומי:** גיבוי או ברירת מחדל עבור חלק מהמדורים, כדי שיוכלו להציג תוכן גם כאשר אין רשומות פעילות בשרת.
- **מקורות תנ״ך חיצוניים:** לדוגמה `bible-api.com` באנגלית ו-Wordplanet בלוגנדה.
- **IndexedDB:** תוכן שנשמר במכשיר לשימוש לא מקוון.
- **LocalStorage:** הגדרות והעדפות מקומיות מסוימות.

---

## 2. עמודים ותפקידיהם

כתובות הדוגמה מוצגות ככתובות לוגיות. בפועל יש לבדוק את הגדרת ה-router או את מימוש `createPageUrl` כדי לדעת את נתיב הפריסה המדויק.

| עמוד | כתובת לוגית | תפקיד ופעולות מרכזיות |
|---|---|---|
| `Home` | `/Home` או `/` | דף הבית. מציג את הצגת המוצר, קישורים למדורים, תוכן נבחר כגון קריאה יומית וקריאות לפעולה. משמש נקודת כניסה לקורא, לתפילה, לקהילה ולהתקנת האפליקציה. |
| `About` | `/About` | מציג את מטרת Pray-Read ואת הרקע למוצר. מכיל ניווט חזרה לדף הבית וקישורים למידע נוסף. |
| `BibleReader` | `/BibleReader` | נקודת הכניסה הראשית לקריאת התנ״ך. כולל חיפוש ספרים, מעבר בין הברית הישנה והחדשה, סטטוס הורדה ובחירת ספר. בתוך העמוד מוצג רכיב בחירת הספר/הפרק וחומרי לימוד לספר. |
| `Chapter` | `/Chapter?book=<מספר>&chapter=<מספר>` | קורא פרק. פרמטרי `book` ו-`chapter` מציינים את הספר והפרק; עשויים להופיע גם `lang`, `verse` ופרמטרים נוספים. מציג פסוקים, כלים ללימוד, הפניות, תפילות, סימונים, שיתוף ולעיתים מידע על תכנית הקריאה. |
| `Dashboard` | `/Dashboard` | לוח אישי למשתמש מחובר: פעילות קריאה, פרקים שהושלמו, סימונים, תפילות שמורות, התקדמות בתכנים ונתוני שימוש לא מקוון. הקוד מציג גם שימוש ברכיב `ActivityFeed`. |
| `BibleNotes` | `/BibleNotes` | מציג סימניות, הדגשות והערות של המשתמש. ללא התחברות מוצגת הודעה המכוונת לכניסה לחשבון. לחיצה על פריט מובילה לפרק ולפסוק הרלוונטיים. |
| `Devotionals` | `/Devotionals` | ספריית קריאות יומיות. כוללת חיפוש, מעבר בין תצוגות, פתיחת פריט, שיתוף וסימון השלמה. ניתן לפתוח פריט ישירות עם פרמטר `devotional`. |
| `PrayerLibrary` | `/PrayerLibrary` | ספריית תפילות. כוללת חיפוש, סינון לפי קטגוריה, בחירת שפה, שמירת תפילה למועדפים ושיתוף. |
| `Plan` | `/Plan` | מציג את תכנית הקריאה, המבוססת כברירת מחדל על מסלול בן 30 ימים. מציג השלמה והתקדמות לפי פרקי קריאה שנרשמו. |
| `Journal` | `/Journal` | יומן תפילה ורפלקציה. משתמש מחובר יכול ליצור, לערוך, למחוק ולסנן רשומות לפי סוג. אפשר לפתוח טופס חדש עם `?new=1` ולשייך רשומה לספר ולפרק דרך פרמטרים. |
| `VerseOfDay` | `/VerseOfDay` | מציג פסוק יומי, טקסט באנגלית או בלוגנדה, קישור לקריאה ושיתוף. אם אין נתון שמתאים לתאריך, העמוד משתמש ברשומת ברירת מחדל מתוך תוכן seed. |
| `TheologicalInsights` | `/TheologicalInsights` | תצוגת תובנות תאולוגיות. נשען על `InsightsBoard` עם סוג `theological`, וכולל חיפוש, פתיחת פריט ושמירת פריטים מקומית לפי המימוש. |
| `HistoricalInsights` | `/HistoricalInsights` | תצוגת תובנות היסטוריות. נשען על אותו רכיב משותף, עם סוג `historical`. |
| `QA` | `/QA` | ספריית שאלות ותשובות. המשתמש יכול לחפש ולסנן שאלות, לקרוא תשובות ולשלוח שאלה חדשה. תוכן מקומי משמש כגיבוי כאשר אין נתוני שרת. |
| `VerseSongs` | `/VerseSongs` | מציג סדרות של שירים המבוססים על פסוקים. משתמש בנגן הגלובלי ויכול להפעיל סדרה או פרק. |
| `VerseSongSeries` | `/VerseSongSeries?series=<שם>` | פירוט של סדרת שירים ופרקיה. מאפשר בחירת פרק והפעלת רשימת השמעה. |
| `Community` | `/Community` | מרכז קהילה המפנה לתובנות קוראים, שיעורים חיים וקבוצות דיון. מציג תוכן עדכני מתוך ישויות השרת, עם תוכן seed לפי הצורך. |
| `CommunityRevelations` | `/CommunityRevelations` | מציג פרסומים של קוראים ותגובות. משתמש מחובר יכול לפרסם, לסמן לייק ולהציג או להוסיף תגובות. |
| `CommunityLiveTeaching` | `/CommunityLiveTeaching` | מציג מפגשי לימוד חיים, כולל מידע על תאריך, מנחה וקישור הצטרפות בהתאם לרשומות הזמינות. |
| `DiscussionGroups` | `/DiscussionGroups?group=<שם>` | מציג קבוצות דיון, מאפשר בחירת קבוצה, הצטרפות מקומית לקבוצה לפי המימוש, צפייה בהודעות ושליחת הודעה למשתמש מחובר. |
| `Contact` | `/Contact` | טופס פנייה. בודק שם, דוא״ל והודעה לפני שליחה ושומר את הפנייה דרך ממשק התוכן. |
| `Login` | `/Login` | התחברות לחשבון משתמש באמצעות FSE2. לאחר הצלחה מתבצע ניווט ללוח המחוונים. |
| `Signup` | `/Signup` | יצירת חשבון משתמש. כולל בדיקות חוזק סיסמה, התאמת סיסמאות ואישור תנאי שימוש; ייתכן שתידרש אימות כתובת דוא״ל. |
| `ForgotPassword` | `/ForgotPassword` | בקשת קישור לאיפוס סיסמה. |
| `ResetPassword` | `/ResetPassword?token=<token>` | קביעת סיסמה חדשה על בסיס טוקן איפוס. מבצע בדיקת אורך והתאמה בין הסיסמה לאישור. |
| `Logout` | `/Logout` | מבצע יציאה מהחשבון לאחר השהיה קצרה ומנווט לדף הבית. |
| `Admin` | `/Admin` | מסך כניסה למנהל התוכן. מאפשר התחברות, ובקטע שהוצג גם זרימת איפוס סיסמת מנהל. אם כבר קיימת פגישת מנהל תקפה, מתבצע מעבר ישיר ללוח הניהול. |
| `AdminDashboard` | `/AdminDashboard` | לוח הניהול. כולל אזורי ניהול לתוכן, יבוא, התקנת תנ״ך ודוחות ספרייה. פעולות התוכן דורשות הרשאת מנהל. |
| `Offline` | `/Offline` | מרכז ניהול תוכן לא מקוון. מאפשר לבדוק הורדות, להוריד תוכן לפי קטגוריה ותרגום, ולנהל תוכן שנשמר במכשיר. |
| `InstallPrompt` | `/InstallPrompt` | מסביר כיצד להתקין את האפליקציה ומזהה פלטפורמות כגון iOS, Android ומחשב. בדפדפנים תומכים נעשה שימוש באירוע `beforeinstallprompt`. |
| `Privacy` | `/Privacy` | מציג מדיניות פרטיות, לרבות ההבחנה בין נתוני חשבון לבין תוכן הנשמר מקומית. |
| `Terms` | `/Terms` | מציג תנאי שימוש ומידע כללי על השימוש בתוכן. |

### פרמטרים שכדאי לבדוק בעת ניפוי תקלות

- `Chapter`: `book`, `chapter`, ולעיתים `verse` או `lang`.
- `BibleReader`: פרמטרים ב-URL עשויים לבחור ספר או מצב קריאה, בהתאם להמשך הקובץ המלא.
- `Devotionals`: `devotional` לפתיחה ישירה של קריאה.
- `DiscussionGroups`: `group` לבחירת קבוצה.
- `VerseSongSeries`: `series` לבחירת סדרה.
- `Journal`: `new`, `book` ו-`chapter` ליצירת רשומה משויכת לקריאה.
- `ResetPassword`: `token` או `access_token`.

---

## 3. מפת ניווט לצורכי DEBUG

הטבלה מתארת מסלולים שניתנים להסיק מהקוד שסופק. ניווטים שלא הוצג עבורם הקומפוננטה או הקישור המדויק מסומנים כתלויים במימוש המלא.

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת קורא התנ״ך | `Home` או `AppHeader` | `Bible Reader` | `BibleReader` |
| בחירת ספר | `BibleReader` | בחירה ברשימת הספרים | בחירת ספר והצגת `ChapterSelector` |
| פתיחת פרק | `BibleReader` | פרק ב-`ChapterGrid` | `Chapter?book=<n>&chapter=<n>` |
| פתיחת פרק בשפת לוגנדה | `ChapterGrid` | אריח פרק במצב `lang="lu"` | `Chapter?book=<n>&chapter=<n>&lang=lu` |
| מעבר בין פרקים | `Chapter` | כפתורי ניווט לפרק קודם/הבא, לפי ממשק העמוד | `Chapter` עם ערכי `book`/`chapter` חדשים |
| פתיחת מבוא, מתאר או תפילת ספר | `BibleReader` | לשוניות בסרגל הספר | אזור מתאים ב-`BookSidebar` |
| פתיחת פסוק מתוך חומר לימוד | `BookSidebar` או רכיב לימוד | לחיצה על הפניה או טווח פסוקים | `VersePopup` בתוך העמוד |
| מעבר לפסוק מתוך חלונית | `VersePopup` | קישור לפתיחת הפרק | `Chapter` |
| פתיחת הפניה מקבילה לפסוק | `Chapter` | כפתור הפניות/הפניה | `CrossRefList` או אזור הפניות |
| פתיחת פסוק של הפניה | `CrossRefList` | לחיצה על פריט הפניה | `Chapter?book=<n>&chapter=<n>&verse=<n>` |
| הצגת טקסט הפסוק שאליו מפנים | אזור הפניות | פתיחת הפניה או הצגת רשומה | `CrossRefScripture` טוען טקסט לפי שפה וגרסה |
| פתיחת הגדרת Strong’s | פרק KJV+ | לחיצה על מספר Strong’s כחול | `StrongsPopup` |
| סימון פסוק | פרק | פעולת סימון/הדגשה בסרגל הפסוק | שמירה דרך פונקציות הסימון והאחסון |
| הוספת הערה לפסוק | פרק | פעולת הערה בסרגל הפעולות | רשומת `StudyMark` או מנגנון הסימונים |
| שיתוף פסוק | פרק או כרטיס שיתוף | `Share` / בחירת ערוץ | `ShareSheet` או `ShareRow` |
| מעבר לתפילות הקשורות לפסוק | פרק | פעולת תפילה/לשונית תפילה | `PassagePrayer` או מקטע התפילה |
| פתיחת ספריית התפילות | `AppHeader`, `Home` או קישור מהתוכן | `Prayer Library` | `PrayerLibrary` |
| שמירת תפילה למועדפים | `PrayerLibrary` | כפתור שמירה | שמירת `PrayerSaved` עבור המשתמש |
| פתיחת רשימת הקריאות היומיות | `AppHeader` או `Home` | `Devotionals` | `Devotionals` |
| פתיחת קריאה יומית מסוימת | `Devotionals` | בחירת קריאה | חלונית/תצוגת פרטים; ניתן גם באמצעות `?devotional=` |
| סימון קריאה יומית כהושלמה | `Devotionals` | פעולת השלמה | עדכון התקדמות בשרת ו/או במכשיר |
| פתיחת תכנית הקריאה | `AppHeader`, `AppFooter` או `Home` | `Reading plan` | `Plan` |
| פתיחת פריט בתכנית | `Plan` | כפתור קריאה בשורת היום | `Chapter` לפי הספר והפרק |
| פתיחת יומן | `AppHeader`, `Dashboard` או קישור בעמוד | `Prayer journal` | `Journal` |
| יצירת רשומת יומן | `Journal` | כפתור יצירה / `?new=1` | טופס `JournalForm` בתוך העמוד |
| עריכת רשומת יומן | `Journal` | עריכה בכרטיס `JournalCard` | טופס העריכה |
| מחיקת רשומת יומן | `Journal` | מחיקה בכרטיס | דיאלוג אישור, ואז מחיקה |
| צפייה בסימונים | `AppHeader` או `Dashboard` | `My notes` | `BibleNotes` |
| פתיחת קהילה | `AppHeader` או `Home` | `Community` | `Community` |
| פתיחת גילויי קוראים | `Community` | כרטיס `Revelations` | `CommunityRevelations` |
| פרסום גילוי | `CommunityRevelations` | טופס פרסום | שליחה דרך `submitRevelation`; נדרש משתמש מחובר |
| פתיחת/הוספת תגובה | `CommunityRevelations` | כפתור תגובות / טופס `CommentThread` | תגובות תחת הגילוי |
| סימון לייק | `CommunityRevelations` | כפתור הלייק בכרטיס | פעולה דרך `likeRevelation` |
| פתיחת קבוצות דיון | `Community` | כרטיס קבוצות | `DiscussionGroups` |
| פתיחת קבוצה מסוימת | `DiscussionGroups` | בחירת קבוצה או `?group=` | תצוגת ההודעות של הקבוצה |
| שליחת הודעה בקבוצה | `DiscussionGroups` | טופס `ThreadMessages` | יצירת `DiscussionThread` |
| פתיחת שיעורים חיים | `Community` | כרטיס שיעורים | `CommunityLiveTeaching` |
| פתיחת תובנות תאולוגיות | `AppHeader`, `AppFooter` או `Community` | קישור תובנות | `TheologicalInsights` |
| פתיחת תובנות היסטוריות | `AppHeader`, `AppFooter` או `Community` | קישור תובנות | `HistoricalInsights` |
| שליחת שאלה | `QA` | טופס השאלה | שליחה דרך `submitQuestion` |
| שליחת פנייה | `AppFooter` או קישור צור קשר | `Contact` | `Contact` |
| התחברות | `AppHeader`, טופס לא מחובר או `Login` | `Sign in` | `Login` |
| יצירת חשבון | `Login` | קישור הרשמה | `Signup` |
| איפוס סיסמת משתמש | `Login` | קישור שכחתי סיסמה | `ForgotPassword` |
| קביעת סיסמה חדשה | מייל איפוס | קישור עם טוקן | `ResetPassword?token=...` |
| יציאה | `AppHeader` או ניווט החשבון | `Log out` | `Logout`, ואז `Home` |
| פתיחת ממשק מנהל | כניסה למנהל | `/Admin` | `Admin` |
| מעבר ללוח ניהול | `Admin` | התחברות תקינה | `AdminDashboard` |
| עריכת רשומה | `AdminDashboard` | בחירת אזור/רשומה | `RecordEditor` או עורך ייעודי |
| מחיקת רשומה | אזור ניהול | `Delete` | `ConfirmDialog`, ואז מחיקה |
| ייבוא תפילות והפניות | `AdminDashboard` | אזור הייבוא הייעודי | `PrayerCrossRefImport` |
| ייבוא תוכן JSON כללי | `AdminDashboard` | אזור ייבוא JSON | `JsonImportPanel` |
| התקנת תנ״ך בלוגנדה | `AdminDashboard` | אזור `Luganda Bible` | `LugandaInstaller` |
| התקנת KJV+ | `AdminDashboard` | אזור KJV+ | `KjvPlusInstaller` |
| בדיקת שלמות ספריית התנ״ך | התקנת KJV+ | הפעלת הדוח | `LibraryReport` |
| פתיחת מרכז לא מקוון | ניווט או דף הבית | `Offline` | `Offline` |
| הורדת תוכן למכשיר | `Offline` | פעולת הורדה בקטגוריה | IndexedDB |
| התקנת האפליקציה | `Home` או קישור התקנה | `Install` / קישור עמוד | `InstallPrompt` או הנחיות התקנה |
| צפייה בתנאים או בפרטיות | `AppFooter` | `Terms` / `Privacy` | עמוד משפטי מתאים |

---

## 4. מבנה קבצים

### 4.1 עמודים  -  `pages/`

| קובץ | תפקיד ומה הוא מרנדר |
|---|---|
| `pages/About.jsx` | דף הסבר על Pray-Read, מטרותיו והערך לקורא. |
| `pages/Admin.jsx` | מסך התחברות ואיפוס חשבון מנהל. |
| `pages/AdminDashboard.jsx` | לוח ניהול תוכן, כולל אזורי עריכה, ייבוא והתקנת נתוני תנ״ך. |
| `pages/BibleNotes.jsx` | תצוגת הסימונים וההערות של המשתמש. |
| `pages/BibleReader.jsx` | בחירת ספר, ניווט לבריתות, סטטוס הורדות וטעינת בורר הספר. |
| `pages/Chapter.jsx` | עמוד קורא הפרק. מחבר את נתוני הפסוקים, חומרי הלימוד, הסימונים, ההפניות והשיתוף. |
| `pages/Community.jsx` | מרכז קהילה עם קישורים ותוכן עדכני ממספר תחומי קהילה. |
| `pages/CommunityLiveTeaching.jsx` | רשימת מפגשי הוראה חיים. |
| `pages/CommunityRevelations.jsx` | פוסטים, לייקים ותגובות של קהילת הקוראים. |
| `pages/Contact.jsx` | טופס שליחת פנייה. |
| `pages/Dashboard.jsx` | לוח מחוונים אישי, התקדמות ופעילות. |
| `pages/Devotionals.jsx` | ספריית קריאות יומיות, חיפוש, סימון השלמה ושיתוף. |
| `pages/DiscussionGroups.jsx` | קבוצות דיון והודעות בתוך קבוצה. |
| `pages/ForgotPassword.jsx` | טופס בקשת איפוס סיסמה. |
| `pages/HistoricalInsights.jsx` | מעטפת ל-`InsightsBoard` עבור תובנות היסטוריות. |
| `pages/Home.jsx` | דף הבית, תוכן נבחר, ניווט וקריאות לפעולה. |
| `pages/InstallPrompt.jsx` | הוראות והצעות להתקנת ה-PWA. |
| `pages/Journal.jsx` | רשימת יומן, פילטרים וטפסי יצירה/עריכה. |
| `pages/Login.jsx` | מסך כניסה לחשבון משתמש. |
| `pages/Logout.jsx` | מסך יציאה ומעבר לדף הבית. |
| `pages/Offline.jsx` | מרכז הורדה וניהול אחסון מקומי. |
| `pages/Plan.jsx` | תכנית הקריאה והתקדמות בימים. |
| `pages/PrayerLibrary.jsx` | חיפוש, סינון, שמירה ושיתוף של תפילות. |
| `pages/Privacy.jsx` | תוכן מדיניות פרטיות. |
| `pages/QA.jsx` | הצגת שאלות ותשובות והגשת שאלה. |
| `pages/ResetPassword.jsx` | שינוי סיסמה באמצעות טוקן. |
| `pages/Signup.jsx` | יצירת משתמש חדש ואימות פרטי הרשמה. |
| `pages/Terms.jsx` | תוכן תנאי שימוש. |
| `pages/TheologicalInsights.jsx` | מעטפת ל-`InsightsBoard` עבור תובנות תאולוגיות. |
| `pages/VerseOfDay.jsx` | הצגת הפסוק היומי ושיתוף. |
| `pages/VerseSongSeries.jsx` | צפייה בפרקי סדרת שירים והפעלתם. |
| `pages/VerseSongs.jsx` | קטלוג סדרות שירים והפעלה דרך הנגן הגלובלי. |

### 4.2 רכיבים  -  `components/`

#### `components/admin/`

| קובץ | תפקיד |
|---|---|
| `components/admin/ChapterCoverage.jsx` | מציג כיסוי פרקי התנ״ך, פרקים חסרים ופרקים פגומים. כולל `compressChapters`, שמקבצת מספרי פרקים לטווחים. |
| `components/admin/CollectionsPanel.jsx` | ממשק CRUD גנרי לאוספי תוכן המוגדרים ב-`adminCollections`. כולל חיפוש, טעינה, עריכה ואישור מחיקה. |
| `components/admin/ConfirmDialog.jsx` | דיאלוג אישור לפעולה בלתי הפיכה, בעיקר מחיקה. |
| `components/admin/CrossRefEditor.jsx` | עורך הפניות מקבילות המבוסס על שבבים; משתמש בפונקציות פיצול ואיחוד של הפניות. |
| `components/admin/JsonImportPanel.jsx` | ייבוא JSON כללי לאוספי תוכן, עם התאמת רשומות למפתחות טבעיים לפי הלוגיקה שבקובץ. |
| `components/admin/KjvPlusInstaller.jsx` | ממשק התקנת KJV+ ונתוני Strong’s; משתמש בפונקציות שרת ייעודיות. |
| `components/admin/LibraryReport.jsx` | דוח ביקורת קריאה בלבד על כיסוי הפרקים, תרגומים ונתוני Strong’s. |
| `components/admin/LugandaInstaller.jsx` | ממשק התקנת פרקי התנ״ך בלוגנדה. |
| `components/admin/PassagesPanel.jsx` | ממשק ניהול תפילות פסוקים, הפניות, מבואות פרקים ומבוא/תפילת סיום לספר. |
| `components/admin/PrayerCrossRefImport.jsx` | יבוא קובץ עבור ספר אחד, כולל בדיקה, תצוגה מקדימה, התקדמות ודוח. |
| `components/admin/PrayersPanel.jsx` | ניהול ספריית התפילות או תפילות הקשורות לפסוקים, בהתאם למצב הרכיב. |
| `components/admin/RecordEditor.jsx` | טופס עריכה גנרי לפי הגדרות שדות; מטפל בטקסט, מספרים, בוליאנים והפניות. |

#### `components/common/`

| קובץ | תפקיד |
|---|---|
| `components/common/EmptyState.jsx` | מצב ריק סטנדרטי עם אייקון, כותרת, הסבר ופעולה אופציונלית. |
| `components/common/Modal.jsx` | חלונית מודאלית משותפת; כוללת סגירה ב-Escape, נעילת גלילת גוף ותוכן/כותרת/כותרת תחתונה. |
| `components/common/PageHeader.jsx` | כותרת עמוד או Hero עם תמונת רקע, שכבת הצללה, כותרת ופעולות. |
| `components/common/Pagination.jsx` | רכיב עימוד לרשימות ארוכות. |
| `components/common/ShareRow.jsx` | שורת פעולות שיתוף; נשענת על `lib/share.js`. |
| `components/common/Spinner.jsx` | חיווי טעינה נגיש עם טקסט. |

#### `components/community/`

| קובץ | תפקיד |
|---|---|
| `components/community/CommentThread.jsx` | תצוגת תגובות וטופס הוספה עבור גילוי. |
| `components/community/RevelationCard.jsx` | כרטיס גילוי של משתמש עם לייקים ופתיחת תגובות. |
| `components/community/RevelationForm.jsx` | טופס פרסום גילוי; למשתמש לא מחובר מוצג קישור התחברות. |
| `components/community/ThreadMessages.jsx` | רשימת הודעות וטופס שליחת הודעה בקבוצת דיון. |

#### רכיבים נוספים

| קובץ | תפקיד |
|---|---|
| `components/dashboard/ActivityFeed.jsx` | מציג פעילות קריאה של משתמש, עם אייקון לפי סוג פעילות ורענון מחזורי דרך React Query. |
| `components/home/StatCard.jsx` | כרטיס סטטיסטיקה לשימוש בדף הבית או בלוח מחוונים. |
| `components/insight/InsightsBoard.jsx` | ממשק משותף לתובנות תאולוגיות והיסטוריות: טעינה, חיפוש, פתיחה ושמירה מקומית. |
| `components/journal/JournalCard.jsx` | כרטיס של רשומת יומן, כולל עריכה ומחיקה. |
| `components/journal/JournalForm.jsx` | טופס יצירה/עריכה של רשומת יומן עם בדיקת תוכן וסוג רשומה. |
| `components/layout/AppFooter.jsx` | Footer וקישורים מהירים; מופיע ב-`Layout` רק בעמוד הבית לפי הקוד שהוצג. |
| `components/layout/AppHeader.jsx` | ניווט ראשי ומשני, פעולות משתמש ותצוגת מובייל. |
| `components/layout/GlobalPlayer.jsx` | ממשק הנגן הגלובלי, המחובר ל-`PlayerProvider`. |
| `components/layout/PwaHead.jsx` | הוספת מטא-תגים, קישורי manifest ואייקונים, ורישום Service Worker. |
| `components/plan/PlanRow.jsx` | שורת יום בתכנית הקריאה וקישור לפרק המתאים. |
| `components/read/AnnotatedText.jsx` | הצגת טקסט עם הדגשות וקווים תחתונים, בחירת טקסט וסרגל פעולות. |
| `components/read/BookGrid.jsx` | רשימת ספרים לפי בריתות, חיפוש וסינון. |
| `components/read/BookIntro.jsx` | מבוא ספר, עם עדיפות למבוא שיובא מהשרת וגיבוי לתוכן מקומי. |
| `components/read/BookOutline.jsx` | תצוגת מתאר הספר; לחיצה על טווח פותחת או בוחרת את החלק המתאים. |
| `components/read/BookPrayerPanel.jsx` | תפילת הספר, עם תמיכה בשפה, קישורי פסוקים וסימוני טקסט. |
| `components/read/BookSidebar.jsx` | סרגל צד למבוא, מתאר ותפילת ספר. |
| `components/read/BookStudyResources.jsx` | משאבי לימוד מתחת לגריד הפרקים, עם לשוניות ועימוד. |
| `components/read/ChapterClosingPrayer.jsx` | תפילת סיום לפרק, כולל תמיכה בשפות, שיתוף וקישור לתפילה נוספת. |
| `components/read/ChapterGrid.jsx` | קישורים לכל פרקי הספר. |
| `components/read/ChapterReaderPane.jsx` | מעטפת אזור הקריאה, לשוניות ומנגנון פתיחת תפריט לימוד. |
| `components/read/ChapterResourcesPanel.jsx` | תובנות תאולוגיות והיסטוריות לפרק או לספר. |
| `components/read/ChapterSelector.jsx` | קורא הספר: סרגל ספר, גריד פרקים, סימונים וחלונית פסוק. |
| `components/read/ChapterSidebar.jsx` | אזורי מבוא, פירוש, תפילה והפניות עבור פרק. |
| `components/read/CrossRefList.jsx` | רשימת הפניות לפסוק, כולל מעבר לפרק היעד. |
| `components/read/CrossRefScripture.jsx` | טעינת הטקסט של פסוק יעד להפניה כאשר הטקסט לא נשמר יחד עם ההפניה. |
| `components/read/FloatingVerse.jsx` | חלונית פסוק צפה עם קישור לפתיחה בקורא התנ״ך. |
| `components/read/PassagePrayer.jsx` | מציאת והצגת תפילה התואמת לפרק או לפסוק הנוכחי. |
| `components/read/PassageTabs.jsx` | לשוניות תוכן הקשורות למעבר מסוים, כגון פירוש, תובנות ושאלות. |
| `components/read/ShareSheet.jsx` | חלונית שיתוף מפורטת, שיכולה לכלול פסוק, תפילה והפניות. |
| `components/read/StrongsPopup.jsx` | חלונית פירוש למספר Strong’s; קוראת מטמון מקומי/שרת ויכולה לשמור הגדרה. |
| `components/read/StrongsText.jsx` | מנתח סימוני Strong’s בטקסט ומציג אותם כמרכיבים אינטראקטיביים. |
| `components/read/VerseActionBar.jsx` | פעולות לפסוק: תפילה, הפניות, פירוש, סימון, שיתוף, העתקה והערה. |
| `components/read/VerseCrossRefs.jsx` | הצגת הפניות מקבילות מתחת לפסוק. |
| `components/read/VerseList.jsx` | רשימה פשוטה של פסוקים, עם מצבי בחירה והדגשה. |
| `components/read/VersePopup.jsx` | חלונית לקריאת פסוק או טווח פסוקים מבלי לעזוב את עמוד הספר. |
| `components/read/VersionPicker.jsx` | בחירת גרסה והתקנה/הסרה של גרסאות מקומיות לפי מנגנון הגרסאות. |

### 4.3 לוגיקת אפליקציה  -  `lib/`

| קובץ | תפקיד |
|---|---|
| `lib/activity.js` | כתיבת פעילות קריאה וסיווג סוגי הפעילות. |
| `lib/adminCollections.js` | הגדרת האוספים והשדות שה-CMS מנהל; מקור התצורה לטפסים גנריים. |
| `lib/adminDirect.js` | פעולות CMS ישירות מתוך הדפדפן מול SDK הישויות, כחלופה למסלול הפונקציות. |
| `lib/adminSession.js` | ניהול התחברות, טוקן, חידוש, בדיקת session וניתוב בין מסלול שרת למסלול דפדפן. |
| `lib/app-params.js` | קריאה דינמית של מזהה אפליקציה וטוקן FSE2 מ-LocalStorage. |
| `lib/AuthContext.jsx` | Context משותף לנתוני משתמש, התחברות, טעינת session ויציאה. |
| `lib/bibleApi.js` | שכבת טעינה וניתוב של פרקי תנ״ך, עם שילוב גרסאות ונתונים מקומיים/לא מקוונים. |
| `lib/bibleBooks.js` | רשימת 66 הספרים, שמות אנגלית/לוגנדה, קיצורים ומספר הפרקים. |
| `lib/bookGuides.js` | מבואות ומתארים סטטיים לספרי התנ״ך. |
| `lib/bookImport.js` | זיהוי והרחבת קובץ ספר לתוכן המיובא לאוספי האפליקציה. |
| `lib/bookIntro.js` | שליפה, נרמול ומפתחות עבור מבואי ספר ותפילות סיום. |
| `lib/bookPrayers.js` | תפילות ברירת מחדל לספרים. |
| `lib/bookStudyContent.js` | תוכן לימוד סטטי לספרים המשמש fallback. |
| `lib/brandCss.js` | מערכת CSS מרכזית של משתני צבע, פריסה ורכיבי Pray-Read. |
| `lib/chapterIntros.js` | טעינה ונרמול של מבואי פרקים, עם קשר לאחסון הלא מקוון. |
| `lib/chapterStudy.js` | הרכבת חומרי לימוד לפרק מתוך מבואות, תפילות, מתארים ותוכן נוסף. |
| `lib/contentApi.js` | שכבת קריאה ושליחה של תוכן ציבורי דרך FSE2. |
| `lib/crossRefs.js` | הפניות סטטיות נבחרות לפי ספר ופרק. |
| `lib/format.js` | פונקציות עזר לטקסט בטוח, רשימות, כותרות ופורמטים. |
| `lib/keyPassages.js` | רשימת פסוקים מרכזיים לכל ספר. |
| `lib/luganda.js` | עיצוב וניקוי תוכן devotional בלוגנדה. |
| `lib/offlineDb.js` | עטיפת IndexedDB, חנויות הנתונים, מפתחות ופעולות אחסון מקומי. |
| `lib/planData.js` | תכנית קריאה מקומית המשמשת fallback לנתוני `ReadingPlan`. |
| `lib/player.jsx` | Context לנגן האודיו הגלובלי ולתור השמעה. |
| `lib/prayerImport.js` | בדיקה, נרמול וייבוא של תפילות והפניות מתוך קובצי JSON. |
| `lib/prayerPassages.js` | שליפה, נרמול, מפתחות טבעיים והתאמת תפילות והפניות לפרקים ולפסוקים. |
| `lib/reading.js` | פונקציות תאריך, הצגה וחישוב נתוני קריאה. |
| `lib/readings.js` | כתיבת התקדמות קריאה והתאמת פרק ליום בתכנית. |
| `lib/scriptureRefs.js` | ניתוח הפניות לתנ״ך, פתרון שמות ספרים ויצירת קישורים לפרקים. |
| `lib/seedContent.js` | תוכן מקומי ראשוני עבור מדורים ציבוריים. |
| `lib/sha256.js` | מימוש SHA-256 ב-JavaScript עבור בדיקות סיסמת מנהל בסביבות ללא Web Crypto זמין. |
| `lib/share.js` | בניית כתובות וטקסטי שיתוף והעתקה ללוח. |
| `lib/strongs.js` | נרמול Strong’s, זיהוי קידומות וטיפול בסימוני המקור. |
| `lib/strongsOffline.js` | מטמון הגדרות Strong’s ב-IndexedDB. |
| `lib/studyAnnotations.js` | מיזוג, טעינה ושמירה של הדגשות וקווים תחתונים. |
| `lib/textSelection.js` | בדיקה אם בחירת הטקסט נמצאת בתוך רכיב מסוים. |
| `lib/theme.js` | ערכי מותג, כתובות נכסים והגדרות קבועות של עיצוב. |
| `lib/themeContext.jsx` | טעינת הגדרות עיצוב ציבוריות והפצתן דרך Context. |
| `lib/versions.js` | קטלוג גרסאות תנ״ך, גרסאות מותקנות וגרסה פעילה. |

### 4.4 פונקציות שרת ואוטומציה

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | התחברות מנהל, בדיקת סיסמה, הפקת session וניהול איפוס סיסמה. |
| `functions/adminContent.js` | API ניהולי לביצוע פעולות CRUD המאומתות באמצעות session מנהל. |
| `functions/bibleChapter.js` | שרת ביניים לשליפת פרק תנ״ך ממקורות חיצוניים ולעיבוד הטקסט. |
| `functions/content.js` | API ציבורי לקריאת תוכן ולשליחת תוכן ציבורי, בהתאם לפעולות הנתמכות. |
| `functions/kjvInstall.js` | התקנת פרקי KJV+ ונתוני Strong’s מאתרים חיצוניים אל הישויות. |
| `functions/lugandaInstall.js` | התקנת פרקי התנ״ך בלוגנדה. |
| `functions/scriptureAudit.js` | ביקורת קריאה בלבד של שלמות ספריית התנ״ך. |
| `functions/strongsDefinition.js` | אחזור וניהול הגדרות Strong’s, עם שימוש במילון ובמקור משלים. |
| `cron/scriptureInstall.js` | משימת רקע מחזורית שמנסה להשלים פרקים חסרים של לוגנדה ו-KJV+. |

### 4.5 ישויות, נכסים וקבצים נוספים

- `entities/*.json`  -  סכמות ישויות והרשאות; מפורטות בסעיף 5.
- `Layout.jsx`  -  מעטפת אפליקציה עם `AuthProvider`, `ThemeProvider`, `PlayerProvider`, Header, Footer, נגן גלובלי ו-PWA.
- `public/manifest.json`  -  פרטי PWA, שם, אייקונים וצבעי מערכת.
- `public/sw.js`  -  Service Worker עם Cache Shell ו-Cache Runtime.
- `__generated/tailwind.css`  -  CSS שנוצר אוטומטית עבור מחלקות Tailwind.
- `public/assets/*`  -  תמונות, אייקונים, קובצי תבנית ומסמכים. אינם חלק מלוגיקת React, אבל משמשים כמשאבים או כחומרי ייבוא.
- `__trash/*`  -  קוד ישן, קוד בדיקה וקבצים זמניים; אין להתייחס אליו כאל חלק פעיל בלי לוודא שהוא מחובר ל-router או ל-build.
- `__url_fetch/*`  -  תוצרים שנאספו מאתרים חיצוניים במהלך פיתוח/בדיקה; לא מדובר במודולים של האפליקציה.

### 4.6 קובצי בדיקה/ארטיפקטים תחת `__trash`

הקבצים שסופקו תחת `__trash` כוללים עמודים ישנים או בדיקות נקודתיות:

- `__trash/components/home/TodayCard.jsx`
- `__trash/components/home/WeekStrip.jsx`
- `__trash/components/layout/Sidebar.jsx`
- `__trash/components/layout/SignInBanner.jsx`
- `__trash/components/read/BookPicker.jsx`
- `__trash/components/read/ReflectionPanel.jsx`
- `__trash/functions/adminProbe.js`
- `__trash/functions/_digestCheck.js`
- `__trash/functions/_hashcheck.js`
- `__trash/functions/_hashTool.js`
- `__trash/functions/probeChapter.js`
- `__trash/functions/probeInvoke.js`
- `__trash/functions/probeSources.js`
- `__trash/functions/tmpAuthProbe.js`
- `__trash/functions/_tmpDecodeBook.js`
- `__trash/functions/_tmpSessionProbe.js`
- `__trash/pages/AdminDiag.jsx`
- `__trash/pages/AdminPassagesCheck.jsx`
- `__trash/pages/AdminSmoke.jsx`
- `__trash/pages/ImportCheck.jsx`
- `__trash/pages/ImportPreview.jsx`
- `__trash/pages/Insights.jsx`
- `__trash/pages/InstallerCheck.jsx`
- `__trash/pages/Read.jsx`
- `__trash/pages/ShareCheck.jsx`
- `__trash/pages/StrongsPopupTest.jsx`

אלו נראים ככלי בדיקה, אבחון או גרסה קודמת של זרימות. לפני מחיקה או החזרה לשימוש, יש לבדוק הפניות מ-router ומ-scripts.

---

## 5. מודל הנתונים  -  Entities

ישויות FSE2 הן שכבת הנתונים המרכזית. כללי הגישה נקבעים בסכמות ובשרת; סינון בצד הלקוח אינו תחליף להרשאות בצד השרת. תיאורי השדות להלן מבוססים על הקבצים שסופקו, וחלק מהסכמות נחתכו.

| Entity | תכלית, שדות מרכזיים וקשרים |
|---|---|
| `ActivityLog` | יומן פעולות של מנהל התוכן. שדות: `actor`, `action`, `section`, `detail`. מיועד לתיעוד פעולות ניהול. הקריאה והכתיבה מוגבלות לפי הסכמה לתפקידי owner/admin. |
| `AdminAccount` | פרטי חשבון מנהל. שדות: `email`, `password_hash`, `salt`, `secret`, `session_version`, `updated_date`. משמש את מנגנון ההתחברות והחתימה של sessions. אין להציג או לחשוף שדות סודיים בצד לקוח. |
| `BibleVerse` | פסוק שמור באנגלית ובלוגנדה. שדות: `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu`. קשר לוגי לספר ולפרק. קריאה ציבורית; שינוי מנהלי לפי הסכמה. |
| `BookIntro` | מבוא ספר ותפילת סיום ספר בשתי שפות. שדות הידועים מהסכמה ומהשימוש: `book_number`, `book_name`, `title_en`, `title_lu`, `intro_en`, `intro_lu`, `closing_prayer_en`, `closing_prayer_lu`. מזוהה לוגית לפי מספר הספר. מוצג ב-`BookIntro` וב-`BookPrayerPanel`. |
| `ChapterIntro` | מבוא לפרק בספר מסוים. שדות: `book_number`, `book_name`, `chapter`, `title_en`, `title_lu`, `intro_en`, `intro_lu`, `source`. קשר לספר ולפרק. |
| `Commentary` | הערות פירוש לפרק. שדות: `book`, `chapter`, `title`, `body_en`, `body_lu`. צרכן בולט: רכיבי הלימוד והקריאה לפי פרק. |
| `ContactMessage` | פנייה שנשלחה מטופס צור קשר. שדות: `name`, `email`, `subject`, `message`, `is_read`, `reply`. הציבור יכול ליצור פנייה; פעולות ניהול לקריאה/עדכון/מחיקה מוגבלות לפי ההרשאות. |
| `CrossReference` | הפניה בין פסוק מקור לפסוק יעד. שדות ידועים: `book_number`, `chapter`, `verse`, `ref_book_number`, `ref_chapter`, `ref_verse`; בקוד נעשה שימוש גם ב-`ref_verse_end`, `ref_text_en`, `ref_text_lu`, `note_en`, `note_lu`. קשרים לשני מיקומים בתנ״ך: מקור ויעד. |
| `Devotional` | קריאה יומית בשתי שפות. שדות: `code`, `title`, `title_lu`, `scripture`, `scripture_lu`, `body`, `body_lu`, `related`, `further_readings`, וכן שדות מדיה/סיווג נוספים לפי הסכמה המלאה. התקדמות קשורה ל-`DevotionalProgress` באמצעות `code`. |
| `DevotionalProgress` | סימון קריאה יומית שהושלמה. שדות: `owner_email`, `devotional_code`, `completed_date`. קשר למשתמש ול-`Devotional.code`. |
| `DiscussionGroup` | מטא-נתונים על קבוצת דיון. שדות: `name`, `description`, `schedule`, `member_count`. הודעות הקבוצה נשמרות ב-`DiscussionThread`, בדרך כלל לפי `group_name`. |
| `DiscussionThread` | הודעה בקבוצה. שדות: `group_name`, `owner_email`, `author_name`, `title`, `body`. קשר לוגי לקבוצה ולמשתמש שכתב. |
| `Insight` | תובנה היסטורית או תאולוגית. שדות: `kind`, `title`, `passage`, `excerpt`, `body`, `share_count`. `kind` צפוי להבחין בין `theological` ל-`historical`. |
| `JournalEntry` | רשומת יומן פרטית. שדות: `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood`. שייכת למשתמש ויכולה להיות קשורה לספר ולפרק. |
| `KjvPlusChapter` | פרק KJV+ כולל נתוני Strong’s. שדות: `book_number`, `book`, `chapter`, `verse_count`, `verses` (JSON כמחרוזת). הטקסט נטען לקורא ולשימוש לא מקוון. |
| `LiveSession` | מפגש הוראה חי. שדות: `title`, `session_date`, `host`, `join_link`, `description`. מוצג בעמוד שיעורים חיים. |
| `LugandaChapter` | פרק תנ״ך בלוגנדה. שדות: `book_number`, `book`, `chapter`, `verse_count`, `verses` (JSON כמחרוזת). הקורא והמתקין משתמשים בו. |
| `Prayer` | פריט בספריית התפילות. שדות: `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref`, `cross_refs`. קשר לוגי להפניה מקראית. שמירה למועדפים נעשית ב-`PrayerSaved`. |
| `PrayerPassage` | תפילה לפרק או לטווח פסוקים. שדות ידועים: `book_number`, `book_name`, `chapter`, `verse`, `verse_end`, `title_en`, `title_lu`, ושדות התפילה באנגלית ובלוגנדה, לרבות נוסח התפילה. `verse = 0` או ערך חסר מציין תפילה לפרק שלם לפי תיאור הסכמה. |
| `PrayerSaved` | סימון תפילה כמועדפת למשתמש. שדות: `owner_email`, `prayer_title`. הקשר לתפילה הוא לפי הכותרת, לא לפי מפתח זר גלוי; יש לשים לב לכך בעת שינוי כותרות או מנגנון זיהוי. |
| `QAEntry` | שאלה ותשובה. שדות: `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email`. הקוד תומך בהצגה ציבורית ובהגשת שאלה; השדות `status` ו-`author_email` מסייעים לניהול. |
| `ReadingActivity` | אירוע פעילות של קורא. שדות: `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse`. הקוד כולל סוגים כגון ביקור בפרק, הדגשה, סימנייה, פתק, פתיחת תפילה וגישה לקריאה יומית. |
| `Reading` | התקדמות קריאה של משתמש. שדות: `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses`. קשר למשתמש; `plan_day` מקשר ליום בתכנית הקריאה. |
| `ReadingPlan` | תכנית הקריאה. שדות: `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture`. נתוני fallback קיימים גם ב-`lib/planData.js`. |
| `Revelation` | פוסט קהילתי או תגובה. שדות: `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id`. פוסט ראשי ללא `parent_id`; תגובה מקושרת לפוסט באמצעות מזהה ההורה. |
| `SiteSettings` | הגדרות אתר. שדות: `setting_key`, `setting_value`. משמשות, בין היתר, להגדרות ערכת צבעים ושם/קישור תרומה בהתאם ללוגיקת ההגדרות. |
| `StrongEntry` | ערך מילוני עבור קוד Strong’s. שדות: `code`, `language`, `original_word`, `transliteration`, `pronunciation`, `part_of_speech`, `root_word`, `definition`, `source` ועוד לפי הסכמה. משמש מטמון להגדרות. |
| `StudyAnnotation` | הדגשה או קו תחתון באזורי לימוד של ספר. שדות: `owner_email`, `book_number`, `book`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset` ושדות נוספים לפי הסכמה. נשמר בשרת ובאחסון המקומי. |
| `StudyMark` | הדגשה, סימנייה או פתק על פסוק. שדות: `owner_email`, `mark_type`, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text`. מוצג בעמוד `BibleNotes` ומשויך למשתמש ולמיקום בתנ״ך. |
| `VerseOfDay` | פסוק יומי. שדות: `verse_date`, `reference`, `text_en`, `text_lu`, `note`. משמש את עמוד הפסוק היומי ודף הבית. |
| `VerseSongEpisode` | פרק אחד בסדרת שירים. שדות: `series_name`, `title`, `verse_ref`, `duration_label`, `duration_seconds`, `audio_url`, `audio_key`, `thumbnail`, `episode_order`. מקושר לסדרה באמצעות `series_name`. |
| `VerseSongSeries` | מטא-נתונים על סדרת שירים. שדות: `name`, `description`, `thumbnail`, `cover_image`, `accent`. פרקים קשורים באמצעות `VerseSongEpisode.series_name`. |

### הערות על הרשאות ומפתחות

- בקבצי הסכמה רבים מוגדרת קריאה ציבורית וכתיבה למנהל בלבד.
- נתונים אישיים כגון יומן, סימונים והתקדמות משתמש צריכים להיות מוגנים באמצעות הרשאות שרת שמתאימות ל-`owner_email`.
- `PrayerSaved` משתמש בכותרת תפילה כמזהה קשר. זה נוח ופשוט, אך שינוי כותרת עלול להשפיע על קשרים קיימים.
- בקוד הלקוח מופיעים לעיתים סינונים לפי דוא״ל. יש לוודא שהשרת אוכף הרשאות מקבילות, ולא להסתמך על סינון React בלבד.
- שדות כגון `verses` נשמרים כמחרוזות JSON. יש לשמור על חוזה הסריאליזציה בין פונקציות ההתקנה, ה-API והקורא.

---

## 6. תהליכים ואינטראקציות מרכזיות

### 6.1 קריאת פרק

1. המשתמש נכנס ל-`BibleReader`.
2. `BookGrid` מציג את הספרים לפי הבריתות, עם חיפוש בשמות באנגלית ובלוגנדה.
3. בחירת ספר מציגה את ממשק בחירת הפרקים והמשאבים של הספר.
4. בחירת פרק מנווטת לעמוד `Chapter` עם מספר הספר והפרק ב-query string.
5. `Chapter` קורא ל-`fetchChapter` מתוך `lib/bibleApi.js`.
6. שכבת ה-API בוחרת מקור נתונים בהתאם לגרסה, לשפה ולזמינות נתונים מקומיים. כאשר אין רשת, נעשה שימוש במטמון/עותק לא מקוון ככל שקיים.
7. העמוד מציג פסוקים ורכיבי עזר כגון מבוא, פירוש, תפילה, הפניות ומשאבים.
8. פעולות משתמש יכולות לעדכן סימונים, פעילות קריאה או התקדמות בקריאה.

**נקודות בדיקה לדיבאג:** ערכי `book` ו-`chapter`, הגרסה הפעילה, שם ה-store המקומי, מבנה `verses` והתגובה שהחזיר מקור התנ״ך.

### 6.2 סימון טקסט, פסוק או חומר לימוד

- `VerseActionBar` מספק פעולות על פסוק: סימון, שמירת הערה, העתקה, שיתוף והפניה לכלי לימוד.
- `AnnotatedText` מאפשר לבחור טקסט ולהציג כלי סימון.
- `studyAnnotations.js` מספק מפתחות, מיזוג בין רשומות שרת לרשומות מקומיות ושמירה.
- `StudyMark` משמש לסימונים ברמת פסוק; `StudyAnnotation` משמש לסימונים בבלוקים של חומר לימוד.
- סימון עשוי להירשם גם ב-`ReadingActivity`.

**חשוב:** בעת שינוי טקסט מקור של בלוק מסומן, היסטי התווים (`start_offset`/`end_offset`) עלולים כבר לא להתאים למילים שהמשתמש סימן.

### 6.3 פתיחת הפניה או פסוק מתוך חומר לימוד

1. חומר לימוד מציג הפניה מקראית.
2. `scriptureRefs.js` מנתח את שם הספר, הפרק והפסוקים.
3. `selectionInside` מונע הפעלה לא מכוונת כאשר המשתמש מסמן טקסט לצורך סימון.
4. הפניה יכולה לפתוח `VersePopup` בתוך העמוד, או לנווט ישירות ל-`Chapter`.
5. `CrossRefScripture` טוען טקסט יעד אם הוא לא שמור כבר ברשומת ההפניה.

### 6.4 תפילות והפניות מקבילות

- נתוני תפילה לפרק ולפסוק נשמרים בין היתר ב-`PrayerPassage`.
- הפניות מקבילות נשמרות ב-`CrossReference`.
- `prayerPassages.js` אחראי לנרמול רשומות, קבוצות הפניות והתאמת תפילה לפסוק.
- `PassagePrayer` ו-`ChapterSidebar` מציגים תוכן התואם למיקום שבו הקורא נמצא.
- אם אין תפילה מתאימה, הרכיבים יכולים להציג תוכן fallback מקומי לפי המימוש.

### 6.5 ייבוא קובץ תפילות והפניות

1. מנהל נכנס לאזור הייבוא מתוך `AdminDashboard`.
2. בוחר קובץ ספר אחד, לפי פורמט הייבוא המוגדר ב-`prayerImport.js`.
3. המערכת קוראת את הקובץ ומנרמלת אותו. קובצי ספר עשויים לעבור הרחבה דרך `bookImport.js`.
4. מתבצעת ולידציה לפני כתיבה. שגיאות מוצגות כדי למנוע ייבוא של קובץ לא תקין.
5. בעת ייבוא תקין, שורות מומרות לרשומות המתאימות, למשל `PrayerPassage`, `CrossReference`, `ChapterIntro` או `BookIntro`.
6. מנגנון המפתחות הטבעיים מאפשר לייבא שוב קובץ ולעדכן רשומות קיימות במקום ליצור כפילויות.
7. בסיום מוצג דוח תוצאות.

**נקודות בדיקה לדיבאג:** גרסת `format`, `book_number`, התאמת שם הספר, תוצאות validation, מפתח טבעי ותשובת ה-API לנקודת הכתיבה.

### 6.6 עריכת תוכן בממשק הניהול

1. מנהל נכנס ל-`Admin`.
2. `adminSession.js` בודק אם יש session תקף; במקרה כזה מתבצע מעבר ישיר ל-`AdminDashboard`.
3. לאחר בחירת אזור, רכיב ניהול טוען רשומות באמצעות `callAdminData`.
4. `CollectionsPanel` או רכיבים ייעודיים משתמשים בהגדרות `adminCollections.js` ליצירת טפסים.
5. `RecordEditor` מציג את השדות הרלוונטיים, כולל עורך הפניות.
6. מחיקה עוברת דרך `ConfirmDialog`.
7. הקריאות עוברות דרך מסלול שרת או מסלול SDK ישיר, לפי זמינות שער הפונקציות ומצב session.

### 6.7 התקנת פרקי תנ״ך

- `LugandaInstaller` פונה ל-`lugandaInstall`.
- `KjvPlusInstaller` פונה ל-`kjvInstall` ומטפל גם בתוכן KJV+ ובהכנת הגדרות Strong’s.
- הפונקציות משוות בין הפרקים הצפויים לבין הנתונים שכבר שמורים, ומנסות להשלים פרקים חסרים.
- `ChapterCoverage` מציג את מצב הכיסוי; `LibraryReport` מפעיל `scriptureAudit` לקבלת דוח קריאה.
- `cron/scriptureInstall.js` מאפשר השלמה מחזורית ברקע.

### 6.8 ייבוא JSON כללי

- `JsonImportPanel` מקבל קובץ JSON ובודק את מבנה האוספים.
- שמות ידידותיים או alias יכולים להיות ממופים לשמות הישויות.
- לפי ההערות בקוד, שורות מותאמות לרשומות קיימות לפי מפתח טבעי, כך שניתן לייבא מחדש קובץ לצורך עדכון.
- יש לבדוק את דוח השגיאות לפני ביצוע הכתיבה.

### 6.9 שיתוף

- `ShareRow` ו-`ShareSheet` משתמשים בפונקציות מתוך `lib/share.js`.
- ניתן לשתף טקסט, קישור או מכלול מקטעים, למשל פסוק, תפילה והפניות.
- ערוצים מסוימים מקבלים כתובת בלבד, ובמקרים אלה התוכן מועתק תחילה ללוח.
- דפדפנים ללא תמיכה ב-Web Share עשויים לעבור למנגנון העתקה או לפתיחת כתובת שיתוף.

### 6.10 התחברות והרשאות

- `AuthProvider` ב-`Layout` בודק את המשתמש הנוכחי דרך `fse2.auth.me()`.
- `useAuth` מספק `user`, `isAuthenticated`, פעולות יציאה וסטטוס טעינה לרכיבים.
- דפי משתמש כגון יומן ולוח מחוונים מציגים נתונים אישיים רק כשיש משתמש זמין.
- פעולות קהילה מסוימות נגישות רק למשתמש מחובר; רכיבי טופס מכוונים למסך התחברות כאשר נדרש.
- התחברות מנהל נפרדת מהתחברות משתמש רגיל ומנוהלת דרך `adminSession.js` ופונקציות הניהול.

### 6.11 שימוש לא מקוון ו-PWA

- `PwaHead` מוסיף תגי מטא, manifest וקישור ל-Service Worker.
- `public/sw.js` משתמש ב-cache עבור מעטפת האפליקציה ונכסים, וברשת עבור בקשות אחרות בהתאם למימוש.
- `offlineDb.js` מנהל IndexedDB ומכיל stores עבור פרקים, תוכן, סימונים, תפילות, הפניות והגדרות Strong’s, בין היתר.
- עמוד `Offline` מאפשר הורדת תוכן וניהול אחסון מקומי.
- נתוני PWA ו-IndexedDB הם מנגנונים נפרדים: הראשון שומר משאבי אתר; השני שומר תוכן מובנה של האפליקציה.

### 6.12 תכנית קריאה ויומן

- `ReadingPlan` מספקת את מבנה התכנית; אם אין רשומות, `PLAN_DAYS` משמש fallback.
- `Reading` מתעד פרק שהושלם ויכול לשאת `plan_day`, רפלקציה ונקודת תפילה.
- `findPlanDay` מקשר ספר ופרק ליום המתאים.
- `JournalEntry` משמש ליומן חופשי יותר, עם קטגוריות ותאריך.
- אלה שני מודלים שונים: התקדמות קריאה אינה בהכרח רשומת יומן, גם אם שניהם קשורים לאותו פרק.

---

## 7. הערות טכניות לפיתוח

### 7.1 טכנולוגיות וספריות שניתן לזהות

- **React**  -  רכיבים ו-State.
- **React Router**  -  `Link`, `useNavigate` ו-`useSearchParams`.
- **TanStack React Query**  -  שליפת נתונים, cache, mutations ורענון שאילתות.
- **FSE2 SDK**  -  הזדהות, ישויות ופונקציות שרת. `api/fse2Client` עצמו לא הוצג.
- **Lucide React**  -  אייקונים.
- **date-fns**  -  עיצוב תאריכים וזמן יחסי.
- **IndexedDB**  -  אחסון תוכן מקומי.
- **Service Worker / Web App Manifest**  -  תמיכת PWA.
- **Tailwind CSS**  -  קיימים קלאסים שנוצרו בקובץ CSS, לצד מערכת CSS ייעודית של Pray-Read.

### 7.2 דפוסים חוזרים

1. **שכבות Context ברמת האפליקציה:**  
   `Layout.jsx` עוטף את התוכן ב-`AuthProvider`, `ThemeProvider` ו-`PlayerProvider`. רכיב שמשתמש ב-Context חייב להישאר מתחת לספק המתאים.

2. **הפרדה בין עמוד לרכיב:**  
   עמוד בדרך כלל מנהל נתונים, query ומצב עליון; רכיבים ב-`components/` מציגים יחידות ממשק ממוקדות.

3. **React Query לשאילתות:**  
   מפתחות query כגון `["insights", kind]`, `["readings", email]` או `["chapterInsights"]` הם חלק מהתנהגות ה-cache. אחרי mutation יש לבדוק אם נדרש `invalidateQueries`.

4. **תוכן fallback:**  
   חלק מהעמודים משלבים רשומות שרת עם נתוני `seedContent.js` או נתוני ספרים סטטיים. בעת דיבאג יש לבדוק אם התצוגה מגיעה מהשרת, מה-cache או מה-seed.

5. **נרמול נתונים:**  
   בפרט עבור תפילות, הפניות, מבואות ו-Strong’s, ה-UI אינו בהכרח עובד ישירות מול צורת הרשומה המקורית. יש לעבור דרך פונקציות הנרמול לפני הוספת שימוש נוסף.

6. **מפתח טבעי בייבוא:**  
   בעת הוספת ישות לייבוא יש להגדיר מפתח טבעי יציב. אחרת ייתכנו כפילויות בייבוא חוזר או עדכון של רשומה לא נכונה.

7. **תמיכה דו-לשונית:**  
   אין להניח שמחרוזת `language` או שמות השדות זהים בכל הישויות. בחלק מהתוכן מופיעים שמות כגון `body_lu`, באחרים `text_lu`, ובכמה רכיבים קיימת נפילה לשפה החלופית.

8. **אחסון מקומי ושרת:**  
   `StudyAnnotation` נשמרת גם בשרת וגם מקומית. בעת שינוי מפתח או מבנה יש לבדוק סנכרון ומיזוג. תוכן זמני שנשמר רק במכשיר אינו בהכרח זמין במכשיר אחר.

### 7.3 בדיקות מומלצות בעת שינוי

- בדיקת קריאה עם משתמש מחובר ועם משתמש אורח.
- בדיקה שהרשאות שרת תואמות לתרחישי הלקוח.
- בדיקת אנגלית, לוגנדה, מצב `both` היכן שקיים, ו-fallback כאשר תרגום חסר.
- בדיקת עבודה עם ובלי רשת, כולל מטמון מיושן ב-IndexedDB.
- בדיקת פרמטרי URL: מספר ספר, מספר פרק, פסוק, שפה וקישור עמוק.
- בדיקת מצבי טעינה, תוצאה ריקה, שגיאה, ורשומות seed.
- בדיקת ייבוא חוזר של אותו קובץ והבטחה שאין כפילויות.
- בדיקת הזזת/שינוי טקסט כאשר קיימות `StudyAnnotation` עם offsets.
- בדיקת ניגודיות ונגישות: תפקידים, `aria-label`, מצב דיאלוג והתנהגות מקלדת.
- בדיקת התנהגות PWA אחרי שינוי נתיב, אייקון או שם cache.

### 7.4 נקודות רגישות

#### אבטחת מנהל

בקוד שסופק מתוארים ערכי fallback לחשבון מנהל ולהגדרות איפוס. יש להתייחס אליהם כאל **סיכון תצורה**:

- לקבוע סודות ייעודיים בסביבת השרת.
- להחליף פרטי ברירת מחדל לפני פריסה.
- לא לחשוף טוקנים, salts, secrets או `password_hash` בלוגים ובתגובות API.
- להעדיף את אימות השרת כאשר הוא זמין, ולבדוק בזהירות את מסלול הגיבוי הישיר בדפדפן.
- לחזור ולבדוק כיצד חידוש session ו-`session_version` מבטלים sessions ישנים.

#### אינטגרציות חיצוניות

טעינת תנ״ך והגדרות Strong’s נשענת על שירותים חיצוניים. שינוי מקור, parser או proxy עלול לגרום לשינויי HTML/JSON, חסימות CORS או הבדל במבנה הטקסט. פונקציות התקנה ודוחות צריכים לטפל ב:

- תשובת HTTP לא תקינה.
- תשובה ריקה או חלקית.
- שינוי בפורמט המקור.
- כפילות פרקים.
- הבדל במספר הפסוקים.
- קצב בקשות ויכולת לחדש התקנה לאחר כשל.

#### מגבלת קוד המקור שנמסר

קובצי ניתוב, קובץ אתחול אפליקציה, `api/fse2Client`, `utils`, סקריפטי build ופרטי סכמה מלאים לא הוצגו. לפני שינוי כתובת עמוד, שיטת build, הרשאות או הגדרות deployment יש לאמת אותם מול המאגר המלא ולא להסיק אותם רק משמות הקבצים.

### 7.5 קיצורי דרך יעילים לדיבאג

- תקלה במסך: להתחיל ב-`pages/<Page>.jsx`, לזהות את query key ואת רכיב התצוגה.
- נתון חסר: לבדוק לפי הסדר את תגובת השרת, נרמול ב-`lib/`, fallback מקומי ו-cache של React Query.
- תקלה בפרק: לבדוק `book_number`, `chapter`, `language`, `versionId`, ואז את `fetchChapter` ואת `offlineDb`.
- תקלה בסימונים: לזהות האם מדובר ב-`StudyMark` או `StudyAnnotation`, לבדוק owner, מפתח ורשומות IndexedDB.
- תקלה בייבוא: לבדוק את פורמט הקובץ, validator, המפתח הטבעי ותשובת פונקציית הכתיבה.
- תקלה בהרשאות מנהל: לבדוק `adminSession.js`, את מצב ההתחברות, את תוקף הטוקן ואת המסלול שבו בוצעה הפעולה.
- תקלה בניגון: לבדוק `PlayerProvider`, כתובת `audio_url`, אירועי metadata/error, ולוודא ש-`GlobalPlayer` נשאר בתוך `Layout`.
- תקלה באופליין: לבדוק אם Service Worker מותקן, אם ה-store קיים, ומהו ה-`DB_VERSION` הפעיל.
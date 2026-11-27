# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד טכני  -  Pray-Read Bible

> **היקף התיעוד:** המסמך מבוסס על קובצי המקור שסופקו. חלק מהקטעים נקטעו, וקובצי תשתית כגון `App.jsx`, קובץ הגדרת ה־router, `package.json` וחלק מסכמות ה־entities לא הוצגו. לכן כתובות העמודים ושמות הנתיבים מתוארים לפי שמות העמודים המועברים ל־`createPageUrl`, ולא לפי קובץ routing מלא. במקומות שבהם הסכמה נקטעה, מצוינים רק השדות והקשרים שניתן להסיק מהמקור שסופק.

---

## 1. מהות המערכת

**Pray-Read Bible** היא אפליקציית React לקריאת התנ״ך וללימודו, עם תוכן באנגלית ובלוגנדה. היא משלבת חוויית קריאה עם תפילה, חומרי לימוד, מוזיקה וכלים לשמירת התקדמות אישית.

### קהלי יעד

- קוראים שרוצים לקרוא פרקים שלמים ולחזור אליהם.
- משתמשים הדוברים אנגלית, לוגנדה או שתיהן.
- קוראים המעוניינים בסימניות, הדגשות, הערות, תפילות ותוכנית קריאה.
- מנהלי תוכן המנהלים את ספריות התוכן ואת התקנת נוסחי המקרא.

### הערך למשתמש

- קריאת תנ״ך לפי ספר ופרק, בכמה תרגומים ובשתי שפות.
- גישה לתפילות, מבואות, הערות לימוד והפניות מקבילות לפסוקים.
- שמירת התקדמות, סימניות, הערות ויומן תפילה  -  באופן מקומי, ובחלק מהתהליכים גם בחשבון המשתמש.
- הורדת תוכן לשימוש לא מקוון והתקנה כאפליקציית PWA.
- ניגון שירי פסוקים שממשיך לפעול בעת מעבר בין עמודים.
- השתתפות בקהילת קוראים: שיתופים, תגובות וקבוצות דיון.

### שני אזורי שימוש מרכזיים

1. **האזור הציבורי**  -  קריאה וצריכת תוכן, עם אפשרות להתחבר כדי לשמור נתונים אישיים.
2. **אזור ניהול התוכן**  -  התחברות מנהל, ניהול רשומות, ייבוא קבצים והתקנת מאגרי התנ״ך.

### עקרונות תכנון ניכרים בקוד

- **Fallback לתוכן מובנה:** תוכן שנקרא מהשרת עשוי להשתלב עם תוכן seed שמגיע עם האפליקציה, כך שחלק מהמסכים יוכלו להציג תוכן גם כשהמאגר ריק או כשהטעינה טרם הסתיימה.
- **תמיכה בעבודה לא מקוונת:** נתוני תנ״ך ותוכן נוספים נשמרים ב־IndexedDB וב־Service Worker.
- **תוכן דו־לשוני:** פונקציות עזר מרכזיות מפרשות שדות באנגלית ובלוגנדה, תוך תמיכה בשמות שדות ישנים.
- **ממשק ניהול מבוסס מטא־נתונים:** חלק מטפסי הניהול נוצרים מתוך הגדרת collections ושדות, ולא נכתבים מחדש לכל entity.

---

## 2. עמודים ותפקידיהם

הנתיבים להלן הם שמות העמודים המשמשים את `createPageUrl`. יש לוודא את הנתיב הסופי ואת רישום ה־route בקובץ ה־router, שלא סופק.

| עמוד | URL משוער | תפקיד ומה המשתמש יכול לעשות |
|---|---|---|
| `Home` | `/Home` או `/` | דף הבית. מציג תוכן מרכזי, ניווט למודולים, devotionals ותוכן היום. משתמש ב־seed ובנתונים חיים. בחלק מהפריסות `/` משמש כעמוד הבית. |
| `About` | `/About` | מציג מידע על המיזם, מטרותיו והגישה לקריאה המשלבת לימוד ותפילה. |
| `BibleReader` | `/BibleReader` | בחירת ספר מתוך 66 ספרי המקרא. כולל חיפוש, חלוקה לברית הישנה/החדשה, מידע על זמינות מקומית וכניסה לבחירת פרק. |
| `Chapter` | `/Chapter?book=<מספר>&chapter=<מספר>` | קריאה ולימוד של פרק. תומך בשינוי תרגום, שפה, בחירת פסוק, סימון, שמירה, תפילה, cross-references, הערות ומשאבי לימוד. |
| `Devotionals` | `/Devotionals` | ספריית devotionals דו־לשונית. מציגה devotional יומי, רשומות קודמות, חיפוש, טווח תאריכים, topic וסדרה. מאפשרת פתיחת תוכן מלא, שמירה וסרגל שיתוף. |
| `PrayerLibrary` | `/PrayerLibrary` | ספריית תפילות. מאפשרת חיפוש, סינון לפי קטגוריה ושפה, שמירת תפילות ושיתוף. |
| `VerseSongs` | `/VerseSongs` | ספריית שירי פסוקים. מציגה כרטיסים, חיפוש וסינון לפי סדרה/ספר, ניגון באמצעות הנגן הגלובלי, הורדה ושיתוף. |
| `VerseSongSeries` | `/VerseSongSeries?series=<id>` | ללא `series` מציגה סדרות; עם `series` מציגה את שירי הסדרה. |
| `QA` | `/QA` | ספריית שאלות ותשובות. תמיכה באנגלית, לוגנדה או שתיהן; חיפוש, סינון לפי topic ואות, פתיחה/סגירה של תשובות ושיתוף. |
| `TheologicalInsights` | `/TheologicalInsights` | לוח תובנות תאולוגיות. משתמש ברכיב `InsightsBoard` עם סוג `theological`, כולל חיפוש, פתיחת פריט ושמירה מקומית. |
| `HistoricalInsights` | `/HistoricalInsights` | לוח תובנות היסטוריות, באותו רכיב משותף של התובנות התאולוגיות. |
| `VerseOfDay` | `/VerseOfDay` | מציג פסוק יומי. טוען רשומות חיות ומשתמש בתוכן seed כחלופה. מאפשר קישור לקריאה ושיתוף. |
| `Plan` | `/Plan` | תוכנית קריאה, עם התקדמות לפי ימים ופרקים. משתמש בתוכנית מהשרת או בתוכנית seed. מחובר לרשומות `Reading` של המשתמש. |
| `Journal` | `/Journal` | יומן תפילה אישי. מאפשר יצירה, עריכה, סינון ומחיקה של רשומות, עם קטגוריה וקישור אופציונלי לספר/פרק. פרמטרים כגון `?new=1&book=43&chapter=3` יכולים לפתוח טופס חדש בהקשר לפרק. |
| `BibleNotes` | `/BibleNotes` | מציג למשתמש מחובר סימניות, הדגשות והערות שנשמרו בפסוקים. משתמשים שאינם מחוברים מקבלים מסך הסבר/התחברות. |
| `Dashboard` | `/Dashboard` | מסך אישי עם סטטיסטיקות, התקדמות קריאה, סימניות, הערות, פעילות ונתונים נוספים. הקוד משלב גם את `Home` במבנה העמוד. |
| `Offline` | `/Offline` | מרכז הורדות וניהול אחסון מקומי. מאפשר הורדה ומחיקה של פרקי תנ״ך ותוכן כגון devotionals, תפילות, cross-references ותובנות Strong’s. |
| `Community` | `/Community` | מרכז קהילה עם קישורים לאזורי גילויים, שיעורים חיים וקבוצות דיון, וכן הצצה לתוכן האחרון. |
| `CommunityRevelations` | `/CommunityRevelations` | פוסטים קהילתיים של גילויים, likes ותגובות. התחברות נדרשת ליצירת תוכן ולחלק מהאינטראקציות. |
| `CommunityLiveTeaching` | `/CommunityLiveTeaching` | רשימת מפגשי לימוד חיים: מועד, מארח, תיאור וקישור הצטרפות. |
| `DiscussionGroups` | `/DiscussionGroups?group=<id או שם>` | רשימת קבוצות דיון והודעות לפי קבוצה. מאפשרת הצטרפות מקומית לקבוצה ושליחת הודעה למשתמש מחובר. |
| `Contact` | `/Contact` | טופס יצירת קשר. מבצע ולידציה בסיסית ושולח הודעה לשרת. |
| `InstallPrompt` | `/InstallPrompt` | מדריך התקנה כ־PWA. מזהה iOS/Android/Desktop ומציג אפשרויות התקנה רלוונטיות. |
| `Login` | `/Login` | התחברות משתמש דרך `fse2.auth.login`, ולאחר הצלחה ניווט ללוח הבקרה. |
| `Signup` | `/Signup` | יצירת חשבון, בדיקת חוזק סיסמה, אישור תנאי שימוש ואפשרות לתהליך אימות דוא״ל. |
| `ForgotPassword` | `/ForgotPassword` | בקשת קישור לאיפוס סיסמה באמצעות כתובת הדוא״ל. |
| `ResetPassword` | `/ResetPassword?token=<token>` | בחירת סיסמה חדשה לאחר פתיחת קישור איפוס. בודק אורך והתאמה בין הסיסמה לאישור. |
| `Logout` | `/Logout` | מנתק את המשתמש ומנווט לדף הבית. |
| `Privacy` | `/Privacy` | מציג מדיניות פרטיות, לרבות הבחנה בין נתונים בחשבון לבין נתונים מקומיים. |
| `Terms` | `/Terms` | מציג תנאי שימוש ומידע כללי על השימוש בתוכן ובמקורות המקרא. |
| `Admin` | `/Admin` | כניסה לממשק מנהל. כולל התחברות, בדיקת session ואיפוס סיסמת מנהל. |
| `AdminDashboard` | `/AdminDashboard` | מסך ניהול תוכן. מציג אזורי ניהול, התקנות ספרי תנ״ך, imports, תצוגות ודיווחים. חלקיו נבחרים לפי סעיף/טאב פנימי. |

### פרמטרים שימושיים בעמודים

| פרמטר | שימוש |
|---|---|
| `book` | מספר ספר המקרא, בדרך כלל 1 - 66. |
| `chapter` | מספר פרק. |
| `verse` | פסוק לפתיחה או למיקוד בתוך פרק. |
| `lang` | בחירת שפה בעמודים שתומכים בכך, למשל `lu`. |
| `series` | מזהה סדרת שירי פסוקים או ערך הקשור לסדרה. |
| `song` | מזהה/קוד שיר במקרים שבהם העמוד פותח פריט מסוים. |
| `group` | בחירת קבוצת דיון. |
| `topic`, `letter`, `search` | מצב סינון ראשוני ב־Q&A. |
| `next` | יעד חזרה לאחר התחברות, למשל מקישור מתוך קהילה. |
| `token` / `access_token` | אסימון בתהליך איפוס סיסמת משתמש. |

---

## 3. מפת ניווט לצורכי Debug

הטבלה מתארת את מסלולי המשתמש המרכזיים לפי שמות הרכיבים והפעולות בקוד.

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| מעבר לספריית המקרא | ניווט עליון/תפריט | **Bible Reader** | `BibleReader` |
| חיפוש ספר | `BibleReader` | שדה חיפוש | סינון רשימת הספרים באותו עמוד |
| פתיחת רשימת פרקי ספר | `BibleReader` | לחיצה על כרטיס ספר | רכיב `ChapterSelector` בעמוד הבחירה |
| פתיחת פרק | `ChapterSelector` | לחיצה על מספר פרק | `Chapter?book=…&chapter=…` |
| פתיחת פרק בשפה לוגנדית | `ChapterGrid` | בחירת פרק כאשר `lang=lu` | `Chapter?book=…&chapter=…&lang=lu` |
| בחירת גרסת תנ״ך | `Chapter` | `VersionPicker` | שינוי הגרסה בעמוד הנוכחי |
| הצגת פרטי Strong’s | `Chapter` | לחיצה על סימון Strong’s בפסוק | `StrongsPopup` כחלונית/מודאל |
| הצגת פעולות פסוק | `Chapter` | לחיצה/בחירה בפסוק | `VerseActionBar` |
| פתיחת תפילה לפסוק | `VerseActionBar` | פעולת התפילה | תצוגת תפילה/`PassagePrayer` |
| פתיחת cross-references | `VerseActionBar` | פעולת הקישורים | תצוגת cross-references של הפסוק |
| מעבר לפסוק מקביל | רכיב cross-reference | לחיצה על הפניה | `Chapter?book=…&chapter=…&verse=…` |
| פתיחת פסוק מתוך אזור לימוד בספר | `ChapterSelector` | לחיצה על הפניה במבוא/תפילה/מיקוד | `VersePopup` בתוך עמוד הספר |
| פתיחת משאבים בפרק | `Chapter` | בחירת אזור משאבים | פאנל `ChapterResourcesPanel` |
| מעבר לעמוד devotional | ניווט עליון/דף הבית | **Devotionals** | `Devotionals` |
| פתיחת devotional מלא | `Devotionals` | לחיצה על כרטיס | תצוגת `DevotionalFullView` באותו עמוד |
| מעבר בין devotionals לפי ימים | `DevotionalFullView` | **Previous Day / Next Day** | מעבר לפריט קודם/הבא |
| שיתוף devotional | כרטיס או תצוגה מלאה | **Share** | `ShareSheet` |
| שמירת devotional | כרטיס/תצוגה מלאה | כפתור שמירה | עדכון מקומי ולעיתים גם `DevotionalSaved` בשרת |
| מעבר לספריית תפילות | ניווט עליון | **Prayer Library** | `PrayerLibrary` |
| שמירת תפילה | `PrayerLibrary` | כפתור bookmark | יצירה/מחיקה של `PrayerSaved` למשתמש מחובר |
| פתיחת שיר | `VerseSongs` או `VerseSongSeries` | **Play** או לחיצה על הכרטיס | נגן גלובלי `GlobalPlayer` |
| הרחבת הנגן | כל עמוד בזמן ניגון | כפתור הרחבה בנגן | תצוגת נגן מורחבת |
| שיתוף שיר | כרטיס שיר | **Share** | `SongShareSheet` |
| הורדת שיר | כרטיס שיר | **Download** | הורדת קובץ דרך `downloadSong` |
| מעבר לסדרת שירים | `VerseSongs` | בחירת סדרה | `VerseSongSeries?series=…` |
| מעבר ל־Q&A | ניווט עליון | **Q&A** | `QA` |
| פתיחת תשובה | `QA` | לחיצה על כרטיס שאלה | פתיחה/סגירה של `QaCard` |
| שינוי שפה ב־Q&A | `QA` | `EN`, `LU`, `BOTH` | סינון תצוגת השפה בעמוד |
| סינון שאלה לפי אות | `QA` | בחירה ב־`QaLetterBar` | סינון הרשימה |
| שיתוף שאלה | `QaCard` | פעולת share/copy | פעולת שיתוף או העתקה |
| מעבר לתובנות תאולוגיות | ניווט משני/קישור משאבים | **Theological insights** | `TheologicalInsights` |
| מעבר לתובנות היסטוריות | ניווט משני/קישור משאבים | **Historical insights** | `HistoricalInsights` |
| פתיחת פסוק היום | ניווט משני/קישור בדף הבית | **Verse of the day** | `VerseOfDay` |
| מעבר לתוכנית קריאה | ניווט משני | **Reading plan** | `Plan` |
| פתיחת פרק מתוכנית | `Plan` | כפתור/קישור של `PlanRow` | `Chapter?book=…&chapter=…` |
| פתיחת יומן מתוך פרק | אזור קריאה או קישור | קישור ל־Journal עם `new=1` | `Journal?new=1&book=…&chapter=…` |
| יצירת רשומת יומן | `Journal` | **New journal entry** | `JournalForm` בתוך העמוד |
| עריכת רשומת יומן | `Journal` | אייקון עריכה בכרטיס | טופס עריכת `JournalForm` |
| מחיקת רשומת יומן | `Journal` | אייקון מחיקה | דיאלוג אישור ולאחר מכן מחיקה |
| צפייה בהערות | ניווט משני | **My notes** | `BibleNotes` |
| הורדת תוכן לשימוש לא מקוון | ניווט משני | **Offline centre** | `Offline` |
| התחברות | כותרת/קישור פנימי | **Sign in** | `Login` |
| יצירת חשבון | עמוד התחברות | **Create account** | `Signup` |
| שחזור סיסמה | עמוד התחברות | **Forgot password** | `ForgotPassword` |
| איפוס סיסמה | קישור במייל | קישור עם token | `ResetPassword?token=…` |
| יציאה מהחשבון | תפריט משתמש | **Log out** | `Logout`, ואז `Home` |
| מעבר למרכז הקהילה | ניווט עליון | **Community** | `Community` |
| הצגת גילויים | `Community` | כרטיס **Revelations** | `CommunityRevelations` |
| פרסום גילוי | `CommunityRevelations` | טופס שיתוף | `submitRevelation` לשרת |
| לייק לגילוי | `RevelationCard` | כפתור like | `likeRevelation` |
| פתיחת תגובות | `RevelationCard` | כפתור תגובות | הצגת `CommentThread` |
| הוספת תגובה | `CommentThread` | שליחת הטופס | `submitComment` |
| מעבר לשיעורים חיים | `Community` | כרטיס **Live teaching** | `CommunityLiveTeaching` |
| הצטרפות למפגש | `CommunityLiveTeaching` | קישור join | כתובת המפגש |
| מעבר לקבוצות דיון | `Community` | כרטיס **Discussion groups** | `DiscussionGroups` |
| שליחת הודעה לקבוצה | `DiscussionGroups` | טופס `ThreadMessages` | יצירת `DiscussionThread` |
| שליחת הודעת קשר | `Contact` | **Send** | `ContactMessage` דרך `submitContactMessage` |
| התקנת האפליקציה | `InstallPrompt` או קישור רלוונטי | **Install app** / הוראות מערכת | Prompt של הדפדפן או הוראות ידניות |
| כניסה לניהול | `Admin` | כפתור כניסה | `AdminDashboard` |
| ניהול תוכן | `AdminDashboard` | בחירת סעיף/טאב | רכיב ניהול מתאים |
| מחיקת רשומה בממשק ניהול | מסך ניהול רלוונטי | אייקון פח | `ConfirmDialog` ואז מחיקה |
| התקנת תנ״ך לוגנדית | `AdminDashboard` → Luganda | **Install/Resume** | `LugandaInstaller` → פונקציית `lugandaInstall` |
| התקנת KJV+ | `AdminDashboard` → KJV+ | **Install/Resume** | `KjvPlusInstaller` → `kjvInstall` |
| בדיקת מצב ספריית המקרא | מסך התקנה | פעולה להצגת audit | `LibraryReport` / `scriptureAudit` |
| ייבוא JSON כללי | ניהול תוכן | **JSON import** | `JsonImportPanel` |
| ייבוא תפילות והפניות | ניהול תוכן | **Prayer/Cross-ref import** | `PrayerCrossRefImport` |
| ניהול שאלות ותשובות | `AdminDashboard` | סעיף Q&A | `QaPanel` |
| ייבוא שאלות ותשובות | `QaPanel` | טאב **Bulk upload** | `QaBulkImport` |
| ניהול devotionals | `AdminDashboard` | סעיף Devotionals | `DevotionalsPanel` |
| ייבוא devotionals | `DevotionalsPanel` | טאב **Bulk upload** | `DevotionalBulkImport` |
| ניהול סדרות ושירי פסוקים | `AdminDashboard` | סעיף Verse Songs | `VerseSongsPanel` |
| ייבוא שירי פסוקים | `VerseSongsPanel` | טאב **Bulk upload** | `VerseSongBulkImport` |

---

## 4. מבנה קבצים

### 4.1 עמודים  -  `pages/`

| קובץ | תפקיד ומה הוא מרנדר |
|---|---|
| `pages/About.jsx` | עמוד מידע על המיזם. |
| `pages/Admin.jsx` | מסך התחברות מנהל ובקשת איפוס סיסמת מנהל. |
| `pages/AdminDashboard.jsx` | מעטפת ניהול התוכן והניווט בין אזורי ניהול, דוחות והתקנות. |
| `pages/BibleNotes.jsx` | רשימת הערות, סימניות והדגשות של המשתמש. |
| `pages/BibleReader.jsx` | בחירת ספר וכניסה לתצוגת ספר/פרקים. |
| `pages/Chapter.jsx` | תצוגת פרק תנ״ך, פעולות פסוקים, פאנלי לימוד ותפילה. |
| `pages/Community.jsx` | מרכז הקהילה וקישורים לתת־האזורים. |
| `pages/CommunityLiveTeaching.jsx` | רשימת שיעורים חיים. |
| `pages/CommunityRevelations.jsx` | פוסטים קהילתיים, likes ותגובות. |
| `pages/Contact.jsx` | טופס יצירת קשר. |
| `pages/Dashboard.jsx` | לוח בקרה אישי ופעילות קריאה. |
| `pages/Devotionals.jsx` | ספריית devotionals, מסננים, פריט יומי, תצוגה מלאה ושיתוף. |
| `pages/DiscussionGroups.jsx` | קבוצות דיון, הצטרפות והודעות. |
| `pages/ForgotPassword.jsx` | בקשת קישור לאיפוס סיסמה. |
| `pages/HistoricalInsights.jsx` | מעטפת שמרנדרת `InsightsBoard` עבור `historical`. |
| `pages/Home.jsx` | דף הבית והצגת תוכן מרכזי. |
| `pages/InstallPrompt.jsx` | מידע ופעולות להתקנת PWA. |
| `pages/Journal.jsx` | יומן תפילה אישי: הצגה, יצירה, עריכה ומחיקה. |
| `pages/Login.jsx` | התחברות משתמש. |
| `pages/Logout.jsx` | ניתוק משתמש וניווט חזרה לדף הבית. |
| `pages/Offline.jsx` | מרכז הורדות, בדיקת תוכן מקומי וניהול האחסון. |
| `pages/Plan.jsx` | תוכנית הקריאה ומעקב אחר השלמת ימים. |
| `pages/PrayerLibrary.jsx` | ספריית תפילות, חיפוש, סינון ושמירה. |
| `pages/Privacy.jsx` | מדיניות פרטיות. |
| `pages/QA.jsx` | ספריית שאלות ותשובות לקוראים. |
| `pages/ResetPassword.jsx` | קבלת token ובחירת סיסמה חדשה. |
| `pages/Signup.jsx` | הרשמה וולידציה של פרטי החשבון. |
| `pages/Terms.jsx` | תנאי שימוש. |
| `pages/TheologicalInsights.jsx` | מעטפת `InsightsBoard` עבור `theological`. |
| `pages/VerseOfDay.jsx` | פסוק היום, קישור לקריאה ושיתוף. |
| `pages/VerseSongSeries.jsx` | אינדקס סדרות או רשימת שירים בתוך סדרה. |
| `pages/VerseSongs.jsx` | ספריית שירי הפסוקים והפעלת הנגן. |

### 4.2 רכיבי ממשק ניהול  -  `components/admin/`

| קובץ | תפקיד |
|---|---|
| `components/admin/ChapterCoverage.jsx` | תצוגת כיסוי פרקים: מלאים, חסרים או פגומים. מייצא גם `compressChapters` לדחיסת מספרי פרקים לטווחים. |
| `components/admin/CollectionsPanel.jsx` | ניהול collections מתוך רשימת ההגדרות המרכזית, כולל טעינה, חיפוש, עריכה ופעולות CRUD. |
| `components/admin/ConfirmDialog.jsx` | דיאלוג אישור לפעולות בלתי הפיכות, בעיקר מחיקה. |
| `components/admin/CrossRefEditor.jsx` | עריכת הפניות מקבילות כתגיות; משתמש ב־`splitRefs` ו־`joinRefs`. |
| `components/admin/DevotionalBulkImport.jsx` | טעינה, בדיקה וייבוא מרובה של devotionals מקובץ JSON. |
| `components/admin/DevotionalForm.jsx` | טופס devotional דו־לשוני, כולל ולידציה ושדות תוכן. |
| `components/admin/DevotionalPlansPanel.jsx` | יצירה ועריכה של תוכניות devotional והצגת devotionals השייכים לתוכנית. |
| `components/admin/DevotionalsPanel.jsx` | מסך ניהול devotionals, topics, plans וייבוא מרובה. |
| `components/admin/DevotionalTopicsPanel.jsx` | ניהול topics, תוך חסימת מחיקה של topic שנמצא בשימוש. |
| `components/admin/JsonImportPanel.jsx` | ייבוא JSON כללי למספר collections, כולל aliases ובדיקת מבנה. |
| `components/admin/KjvPlusInstaller.jsx` | ניהול התקנת KJV+ ומילון Strong’s, עם מצב התקדמות ודוחות. |
| `components/admin/LibraryReport.jsx` | פאנל audit לקריאת מצב ספרי התנ״ך, פערי פסוקים ו־Strong’s. |
| `components/admin/LugandaInstaller.jsx` | ממשק התקנת המקרא בלוגנדה. |
| `components/admin/PassagesPanel.jsx` | ניהול prayer passages, cross-references, מבואות פרקים ומבוא/תפילת ספר. |
| `components/admin/PrayerCrossRefImport.jsx` | תהליך ייבוא חומרי תפילה והפניות, עם תצוגת תוכן שכבר הותקן. |
| `components/admin/PrayersPanel.jsx` | ניהול ספריית תפילות או תפילות לפי ספר/פרק/פסוק, בהתאם ל־`mode`. |
| `components/admin/QaAdminList.jsx` | רשימת שאלות לניהול, כולל חיפוש, אות, topic ובחירה קבוצתית. |
| `components/admin/QaBulkImport.jsx` | ייבוא שאלות ותשובות מקובץ, עם בדיקת שדות ואפשרות ליצור topics. |
| `components/admin/QaItemForm.jsx` | טופס של שאלה ותשובה דו־לשונית. |
| `components/admin/QaPanel.jsx` | מעטפת ניהול Q&A: טעינת topics ושאלות, שמירה, מחיקה וייבוא. |
| `components/admin/QaQuestionsPanel.jsx` | רשימת שאלות, טופס והפעלת דיאלוג אישור למחיקה. |
| `components/admin/QaTopicForm.jsx` | טופס topic דו־לשוני. |
| `components/admin/QaTopicsPanel.jsx` | ניהול topics והעברת שאלות לפני מחיקת topic בשימוש. |
| `components/admin/RecordEditor.jsx` | טופס גנרי המייצר שדות לפי הגדרת collection. |
| `components/admin/VerseSongBulkImport.jsx` | ייבוא מרובה של שירי פסוקים. |
| `components/admin/VerseSongForm.jsx` | טופס של שיר יחיד, כולל פרטי פסוק, גרסה וקבצי מדיה. |
| `components/admin/VerseSongSeriesForm.jsx` | יצירה ועריכה של סדרת שירים ועטיפה. |
| `components/admin/VerseSongsPanel.jsx` | ניהול סדרות ושירים, חיפוש, סינון, עריכה וייבוא. |

### 4.3 רכיבים משותפים  -  `components/common/`

| קובץ | תפקיד |
|---|---|
| `components/common/BrandIcons.jsx` | אייקוני SVG לרשתות שיתוף שאינן זמינות ב־Lucide. |
| `components/common/EmptyState.jsx` | תצוגת מצב ריק עם כותרת, הסבר, אייקון ופעולה אפשרית. |
| `components/common/Modal.jsx` | מודאל כללי; תומך ב־Escape, חסימת גלילת רקע, כותרת, גוף ו־footer. |
| `components/common/PageHeader.jsx` | כותרת עמוד סטנדרטית או Hero עם תמונת רקע ו־overlay. |
| `components/common/Pagination.jsx` | דפדוף בין עמודים ברשימות ארוכות. |
| `components/common/ShareRow.jsx` | שורת פעולות שיתוף באמצעות `lib/share`. |
| `components/common/Spinner.jsx` | אינדיקטור טעינה נגיש. |

### 4.4 רכיבים לפי תחום

| קובץ | תפקיד |
|---|---|
| `components/community/CommentThread.jsx` | הצגת תגובות ושליחת תגובה חדשה. |
| `components/community/RevelationCard.jsx` | כרטיס גילוי עם likes ופתיחת תגובות. |
| `components/community/RevelationForm.jsx` | טופס יצירת גילוי; מציג כניסה אם המשתמש אינו מחובר. |
| `components/community/ThreadMessages.jsx` | הצגת ושליחת הודעות לקבוצת דיון. |
| `components/dashboard/ActivityFeed.jsx` | פיד פעילות אישי, שמגיע מ־`ReadingActivity`. |
| `components/devotional/DevotionalCard.jsx` | כרטיס devotional עם תאריך, כותרת, פסוק, topic ותקציר. |
| `components/devotional/DevotionalFeatured.jsx` | כרטיס devotional מובלט, בדרך כלל devotional היום. |
| `components/devotional/DevotionalFilters.jsx` | בקרי שפה, חיפוש, topic, סדרה וטווח תאריכים. |
| `components/devotional/DevotionalFullView.jsx` | תצוגת devotional מלאה עם גוף, תפילה, ניווט ושיתוף. |
| `components/home/StatCard.jsx` | כרטיס סטטיסטיקה לשימוש בדפי בית/לוח בקרה. |
| `components/insight/InsightsBoard.jsx` | לוח משותף לתובנות תאולוגיות והיסטוריות. |
| `components/journal/JournalCard.jsx` | כרטיס רשומת יומן עם עריכה ומחיקה. |
| `components/journal/JournalForm.jsx` | טופס רשומת יומן. |
| `components/layout/AppFooter.jsx` | כותרת תחתונה עם קישורים, מותג ופרטי תמיכה. |
| `components/layout/AppHeader.jsx` | ניווט ראשי ומשני, פעולות משתמש ותפריט למכשירים קטנים. |
| `components/layout/GlobalPlayer.jsx` | ממשק נגן המוזיקה הגלובלי. |
| `components/layout/PwaHead.jsx` | הכנסת meta tags, קישורי manifest ואייקונים, ורישום service worker. |
| `components/plan/PlanRow.jsx` | שורה/כרטיס של יום תוכנית עם קישור לפרק ומצב השלמה. |
| `components/qa/QaCard.jsx` | כרטיס שאלה ותשובה, עם הפניות מקראיות ופעולות. |
| `components/qa/QaFilters.jsx` | בקרי שפה, חיפוש ו־topic עבור Q&A. |
| `components/qa/QaLetterBar.jsx` | סרגל אותיות אופקי לסינון שאלות. |
| `components/read/AnnotatedText.jsx` | הצגת טקסט עם highlight/underline לפי טווחי offsets, ותפריט סימון. |
| `components/read/BookGrid.jsx` | רשת ספרים לפי ברית ישנה/חדשה, עם חיפוש. |
| `components/read/BookIntro.jsx` | מבוא ספר, key passages וסימון טקסט. |
| `components/read/BookOutline.jsx` | מתווה ספר עם הפניות לטווחי פרקים/פסוקים. |
| `components/read/BookPrayerPanel.jsx` | תפילת ספר, עם הפניות מקראיות מוטמעות. |
| `components/read/BookSidebar.jsx` | מעטפת הצד של קורא הספר, עם מבוא, מתווה ותפילה. |
| `components/read/BookStudyResources.jsx` | משאבי ספר: commentary, תובנות תאולוגיות והיסטוריות ודפדוף. |
| `components/read/ChapterClosingPrayer.jsx` | תפילה סוגרת לפרק, כולל שיתוף וחזרה לתפילה. |
| `components/read/ChapterGrid.jsx` | רשת בחירת פרקים לספר. |
| `components/read/ChapterReaderPane.jsx` | מעטפת אזור הקריאה בפרק, כולל תפריט אזורי לימוד. |
| `components/read/ChapterResourcesPanel.jsx` | משאבי תובנות לפרק, עם fallback לתובנות ספר. |
| `components/read/ChapterSelector.jsx` | מסך בחירת פרק עם sidebar, סימונים ו־`VersePopup`. |
| `components/read/ChapterSidebar.jsx` | פאנל study של פרק, כולל מבוא, commentary, תפילה ו־cross-references. |
| `components/read/CrossRefList.jsx` | הצגת הפניות מקבילות עם אפשרות לעבור לפסוק המופנה. |
| `components/read/CrossRefScripture.jsx` | טעינה והצגה של טקסט הפסוק שאליו מפנה cross-reference. |
| `components/read/FloatingVerse.jsx` | חלונית צפה להצגת פסוק וקישור לפתיחתו בקורא. |
| `components/read/PassagePrayer.jsx` | תפילה המשויכת לפרק/פסוק, עם התאמת שפה והצגת תוכן מתאים. |
| `components/read/PassageTabs.jsx` | טאבים ל־commentary, insights ו־Q&A הקשורים לקטע. |
| `components/read/ShareSheet.jsx` | חלונית שיתוף של פסוק, פרק או devotional. |
| `components/read/StrongsPopup.jsx` | הצגת הגדרה של מספר Strong’s; משתמש גם במטמון לא מקוון. |
| `components/read/StrongsText.jsx` | זיהוי Strong’s markers בתוך טקסט והפקת צמתים אינטראקטיביים. |
| `components/read/VerseActionBar.jsx` | פעולות של פסוק: תפילה, קישורים, סימון, שיתוף, העתקה, הערה ושמירה. |
| `components/read/VerseCrossRefs.jsx` | תצוגת cross-references מתחת לפסוק. |
| `components/read/VerseList.jsx` | רשימת פסוקים פשוטה עם פסוק נבחר והדגשות. |
| `components/read/VersePopup.jsx` | חלונית קריאת פסוק/קטע מתוך sidebar ללא יציאה ממנו. |
| `components/read/VersionPicker.jsx` | בחירת גרסת תנ״ך, התקנה או הסרה של גרסאות. |
| `components/song/SeriesCard.jsx` | כרטיס סדרת שירים. |
| `components/song/SongCard.jsx` | כרטיס שיר עם ניגון, הורדה ושיתוף. |
| `components/song/SongFilters.jsx` | חיפוש וסינון שירים לפי סדרה וספר. |
| `components/song/SongShareSheet.jsx` | מודאל שיתוף של שיר. |

### 4.5 מעטפת, Backend וקבצי תשתית

| קובץ | תפקיד |
|---|---|
| `Layout.jsx` | מעטפת האפליקציה: `AuthProvider`, `ThemeProvider`, `PlayerProvider`, header, main, footer ונגן גלובלי. |
| `cron/scriptureInstall.js` | משימת רקע מתוזמנת שמנסה להשלים פרקי תנ״ך חסרים. תיאור הקוד מציין הרצה מחזורית ובטוחה לחזרה. |
| `functions/adminAuth.js` | תשתית התחברות/ניהול סיסמת מנהל ו־session חתום. |
| `functions/adminContent.js` | API שרתי לפעולות ניהול תוכן המאומתות באמצעות session מנהל. |
| `functions/bibleChapter.js` | קבלת פרק ממקורות חיצוניים ועיבוד/ניקוי הטקסט. |
| `functions/content.js` | API ציבורי לתוכן ולפעולות ציבוריות כגון יצירת קשר ופעולות קהילה. |
| `functions/kjvInstall.js` | התקנת KJV+ פרק־אחר־פרק. |
| `functions/lugandaInstall.js` | התקנת פרקי המקרא בלוגנדה. |
| `functions/scriptureAudit.js` | בדיקת מצב ספריית התנ״ך; התיאור מציין פונקציה לקריאה בלבד. |
| `functions/strongsDefinition.js` | חיפוש/שמירה של הגדרות Strong’s במאגר. |
| `entities/ActivityLog.json` | סכמת לוג לפעולות מנהל. |
| `entities/AdminAccount.json` | חשבון מנהל, hash, salt ופרטי session. |
| `entities/BibleVerse.json` | פסוקי מקרא שמורים באנגלית ובלוגנדה. |
| `entities/BookIntro.json` | מבוא ותפילה סוגרת לספר. |
| `entities/ChapterIntro.json` | מבוא לפרק. |
| `entities/Commentary.json` | הערת commentary לספר/פרק. |
| `entities/ContactMessage.json` | הודעת קשר שנשלחה מהאתר. |
| `entities/CrossReference.json` | הפניה מקבילה מפסוק מקור אל פסוק יעד, עם טקסטים והערות. |
| `entities/Devotional.json` | devotional דו־לשוני ותזמון פרסומו. |
| `entities/DevotionalPlan.json` | תוכנית של devotionals לפי ימים. |
| `entities/DevotionalProgress.json` | devotional שהמשתמש סימן כהושלם. |
| `entities/DevotionalSaved.json` | devotional שנשמר על ידי משתמש. |
| `entities/DevotionalTopic.json` | topic לספריית devotionals. |
| `entities/DiscussionGroup.json` | קבוצת דיון, תיאור, לוח זמנים ומספר חברים. |
| `entities/DiscussionThread.json` | הודעה בקבוצת דיון. |
| `entities/Insight.json` | תובנה היסטורית או תאולוגית. |
| `entities/JournalEntry.json` | רשומת יומן תפילה של משתמש. |
| `entities/KjvPlusChapter.json` | פרק KJV+ עם Strong’s markers. |
| `entities/LiveSession.json` | מפגש לימוד חי. |
| `entities/LugandaChapter.json` | פרק תנ״ך בלוגנדה. |
| `entities/Prayer.json` | תפילה מספריית התפילות. |
| `entities/PrayerPassage.json` | תפילה המשויכת לפרק/פסוק או לטווח פסוקים. |
| `entities/PrayerSaved.json` | תפילה שמורה של משתמש. |
| `entities/QAEntry.json` | שאלה שהוגשה על ידי קורא ותשובת צוות. |
| `entities/QAItem.json` | פריט Q&A דו־לשוני בספרייה. |
| `entities/QATopic.json` | topic דו־לשוני של Q&A. |
| `entities/ReadingActivity.json` | פעילות קריאה של משתמש. |
| `entities/Reading.json` | פרק שהמשתמש קרא, עם מצב והערות התקדמות. |
| `entities/ReadingPlan.json` | יום/פרק בתוכנית הקריאה. |
| `entities/Revelation.json` | גילוי קהילתי או רשומת תגובה המקושרת אליה. |
| `entities/SiteSettings.json` | הגדרות אתר כגון צבעים ושם. |
| `entities/StrongEntry.json` | ערך מילון עבור מספר Strong’s. |
| `entities/StudyAnnotation.json` | highlight/underline של טקסט באזורי לימוד. |
| `entities/StudyMark.json` | סימניה, highlight או note על פסוק. |
| `entities/VerseOfDay.json` | פסוק שנבחר לתאריך מסוים. |
| `entities/VerseSongEpisode.json` | שיר/פרק בתוך סדרת שירי פסוקים. |
| `entities/VerseSongSeries.json` | סדרת שירי פסוקים. |

### 4.6 ספריות לוגיקה  -  `lib/`

| קובץ | תפקיד |
|---|---|
| `lib/activity.js` | כתיבת פעילות משתמש והגדרות תוויות/סוגי פעילות. |
| `lib/adminCollections.js` | הגדרות collections והשדות שמייצרים טפסי ניהול. |
| `lib/adminDirect.js` | נתיב חלופי של פעולות ניהול דרך SDK ישירות מהדפדפן. |
| `lib/adminSession.js` | התחברות, בדיקת session, חידוש token ו־keep-alive למנהל. |
| `lib/app-params.js` | קריאת מזהה אפליקציה ו־tokens של FSe2. |
| `lib/AuthContext.jsx` | Context להתחברות משתמש רגיל. |
| `lib/bibleApi.js` | שכבת שליפה אחידה לפרקי תנ״ך, עם גרסאות, מטמון ושימוש לא מקוון. |
| `lib/bibleBooks.js` | נתונים סטטיים של 66 ספרים, שמות, קיצורים ומספרי פרקים. |
| `lib/bilingual.js` | חילוץ ונרמול של שדות אנגלית ולוגנדה ממבני נתונים שונים. |
| `lib/bookGuides.js` | מבוא ומתווה מובנים לספרי התנ״ך. |
| `lib/bookImport.js` | נרמול והרחבה של קובצי ייבוא לפי ספר. |
| `lib/bookIntro.js` | שליפה, נרמול ומפתחות cache למבואות/תפילות ספר. |
| `lib/bookPrayers.js` | תפילות מובנות לפי ספר. |
| `lib/bookStudyContent.js` | חומרי לימוד מובנים לספרים, כ־fallback. |
| `lib/brandCss.js` | מערכת CSS של המותג ומשתני צבע. |
| `lib/chapterIntros.js` | שליפה, נרמול ומטמון של מבואות פרקים. |
| `lib/chapterStudy.js` | בניית תוכן לימוד לפרקים מתוך מדריכים ותוכן קיים. |
| `lib/contentApi.js` | שכבת גישה ציבורית לתוכן ולפעולות מול ה־Backend. |
| `lib/crossRefs.js` | cross-references מובנים למקטעים נבחרים. |
| `lib/devotionals.js` | נרמול, מיון, בחירה, תצוגה ושיתוף של devotionals. |
| `lib/format.js` | עזרי טקסט בטוחים, רשימות ופורמטים. |
| `lib/keyPassages.js` | קטעי מפתח מובנים לכל ספר. |
| `lib/luganda.js` | עיבוד/עיצוב טקסט devotional בלוגנדה. |
| `lib/offlineDb.js` | wrapper ל־IndexedDB, כולל stores וגרסאות מבנה. |
| `lib/planData.js` | נתוני seed של תוכנית הקריאה. |
| `lib/player.jsx` | Context וניהול מצב של נגן האודיו הגלובלי. |
| `lib/prayerImport.js` | בדיקה, נרמול והכנה לייבוא תפילות והפניות. |
| `lib/prayerPassages.js` | שליפה, נרמול ובחירת תפילות/הפניות לפי פרק ופסוק. |
| `lib/qaLibrary.js` | טעינה, מיון, סינון ו־fallback לספריית Q&A. |
| `lib/reading.js` | תאריכים, תוויות, רצף קריאה ועזרי זמן. |
| `lib/readings.js` | שיוך קריאה ליום תוכנית ושמירת התקדמות. |
| `lib/scriptureRefs.js` | parsing ופתרון שמות/הפניות מקראיות. |
| `lib/seedContent.js` | תוכן seed לספריות הציבוריות. |
| `lib/sha256.js` | מימוש SHA-256 לצורך בדיקת סיסמת מנהל בסביבה שבה Web Crypto אינו זמין. |
| `lib/share.js` | בניית טקסט שיתוף, פתיחת ערוצי שיתוף והעתקה. |
| `lib/strongs.js` | נרמול Strong’s markers וקודי מילון. |
| `lib/strongsOffline.js` | שמירה וקריאה של ערכי Strong’s ב־IndexedDB. |
| `lib/studyAnnotations.js` | שמירה, מיזוג והסרה של annotations מקומיים ובשרת. |
| `lib/textSelection.js` | זיהוי אם לחיצה על אזור מתרחשת בזמן בחירת טקסט. |
| `lib/themeContext.jsx` | טעינת הגדרות עיצוב והחלת משתני CSS. |
| `lib/theme.js` | צבעי מותג, כתובות נכסים וקבועים חזותיים. |
| `lib/useDevotionalLibrary.js` | hook לספריית devotionals האישית: שמורים ונקראו. |
| `lib/verseSongs.js` | נרמול, אינדוקס, סינון, תור ניגון ושיתוף של שירים. |
| `lib/versions.js` | קטלוג גרסאות תנ״ך וניהול גרסאות מותקנות. |

### 4.7 קבצים ציבוריים, Generated ונכסי עזר

- `public/manifest.json`  -  הגדרות PWA, שם, אייקונים, start URL, צבעים ו־display mode.
- `public/sw.js`  -  Service Worker. לפי ההערה בקובץ: cache-first למעטפת ולתמונות, network-first לשאר הבקשות.
- `__generated/tailwind.css`  -  CSS שנוצר אוטומטית לכלי Tailwind. יש להתייחס אליו כתוצר build/generated ולא כנקודת מקור לעיצוב.
- `public/assets/generated_*.png`, `public/assets/ingested/*`, `public/assets/media-library/*`  -  נכסים סטטיים, מדיה, קובצי JSON/PDF ומשאבים שהועלו. חלקם נצרכים דרך כתובות או מזהים; יש לזהות שימושים לפני הסרה או שינוי.
- `__url_fetch/*`  -  תוצרי fetch/בדיקה של מקורות חיצוניים שהופיעו בחומר שסופק. אינם חלק מתיקיית runtime טיפוסית, ולכן לפני הכללתם ב־build יש לבדוק את הגדרות הפרויקט.

### 4.8 קבצים תחת `__trash/`

קבצים אלה נראים כקוד ניסוי, בדיקות זמניות או גרסאות ישנות; הם אינם מוצגים כחלק מה־runtime המרכזי שסופק. חשוב לבדוק שאין imports או routes פעילים לפני מחיקה.

- `__trash/components/home/TodayCard.jsx`  -  כרטיס קריאת היום מהגרסה/העיצוב הקודמים.
- `__trash/components/home/WeekStrip.jsx`  -  סרגל פעילות שבועית ישן.
- `__trash/components/layout/Sidebar.jsx`  -  מעטפת ניווט ישנה.
- `__trash/components/layout/SignInBanner.jsx`  -  באנר התחברות ישן.
- `__trash/components/read/BookPicker.jsx`  -  בורר ספרים מגרסת קורא ישנה.
- `__trash/components/read/ReflectionPanel.jsx`  -  פאנל reflection ותפילה מהקורא הישן.
- `__trash/functions/adminProbe.js`  -  כלי בדיקה זמני לשרשרת התחברות מנהל.
- `__trash/functions/_digestCheck.js`  -  כלי בדיקה זמני ל־hash.
- `__trash/functions/_hashcheck.js`  -  ניסוי זמני לבדיקת פורמט hash.
- `__trash/functions/_hashTool.js`  -  כלי יצירת hash זמני.
- `__trash/functions/probeChapter.js`  -  בדיקת תוכן של פרק שמור.
- `__trash/functions/probeInvoke.js`  -  בדיקת קריאה ל־Backend.
- `__trash/functions/probeSources.js`  -  בדיקת מקורות ו־parsers.
- `__trash/functions/tmpAuthProbe.js`  -  בדיקת הקשר ההרשאות בקריאת function.
- `__trash/functions/_tmpDecodeBook.js`  -  כלי פענוח זמני של קובצי ספר.
- `__trash/functions/_tmpSessionProbe.js`  -  בדיקת session מנהל.
- `__trash/pages/AdminDiag.jsx`  -  בדיקה זמנית להתחברות מנהל.
- `__trash/pages/AdminPassagesCheck.jsx`  -  בדיקת רינדור למסך passages.
- `__trash/pages/AdminSmoke.jsx`  -  בדיקות smoke למסכי ניהול.
- `__trash/pages/ImportCheck.jsx`  -  בדיקת parser ו־natural keys של imports.
- `__trash/pages/ImportPreview.jsx`  -  תצוגת preview זמנית לקובץ ייבוא.
- `__trash/pages/Insights.jsx`  -  גרסת עמוד תובנות ישנה.
- `__trash/pages/InstallerCheck.jsx`  -  מסך בדיקה למתקינים ול־coverage.
- `__trash/pages/Read.jsx`  -  קורא ישן, כפי הנראה הוחלף ב־`BibleReader` ו־`Chapter`.
- `__trash/pages/ShareCheck.jsx`  -  מסך בדיקה זמני לחלונית שיתוף.
- `__trash/pages/StrongsPopupTest.jsx`  -  בדיקת מקורות חיצוניים ל־Strong’s.

---

## 5. מודל הנתונים  -  Entities

### 5.1 תוכן תנ״ך וחומרי לימוד

| Entity | תכלית ושדות מרכזיים | קשרים |
|---|---|---|
| `BibleVerse` | פסוק בודד; `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu`. | שייך לספר/פרק; מאפשר שמירת טקסט דו־לשוני. |
| `LugandaChapter` | פרק שלם בלוגנדה; מספר ספר/פרק, `verse_count`, `verses` בפורמט JSON. | מפתח טבעי צפוי של ספר + פרק. |
| `KjvPlusChapter` | פרק KJV+ עם סימוני Strong’s; `verses` JSON ו־`verse_count`. | מקביל ל־`LugandaChapter`, בגרסת KJV+. |
| `BookIntro` | מבוא ותפילה סוגרת לספר; מספר/שם ספר, כותרות ותוכן EN/LU. | ספר אחד לכל רשומה לפי `book_number`. |
| `ChapterIntro` | מבוא דו־לשוני לפרק; ספר, פרק, כותרת וטקסטים. | תלוי בספר ובפרק. |
| `Commentary` | הערת commentary על ספר/פרק; `book`, `chapter`, `title`, `body_en`, `body_lu`. | משויך לפרק לפי ספר ושדה `chapter`. |
| `CrossReference` | הפניה מפסוק מקור לפסוק יעד; פרטי המקור והיעד, טקסטי יעד והערות לפי שדות שהופיעו בחלקים שסופקו. | פסוק מקור אחד עשוי להפנות לפסוק/טווח אחר. סכמת השדות המלאה נקטעה. |
| `PrayerPassage` | תפילה הקשורה לפרק, לפסוק/טווח או לסגירת פרק; כוללת מספרי ספר/פרק/פסוקים, כותרות ותוכן באנגלית ובלוגנדה. | שייכת למיקום מקראי. לפי ההערה, `verse = 0`/חסר עשוי לציין תפילת פרק שלם. |
| `Prayer` | פריט מספריית התפילות; כותרת, קטגוריה, גוף EN/LU, `scripture_ref`, `cross_refs`. | עשויה להצביע על הפניה מקראית ורשימת הפניות. |
| `Insight` | תובנה תאולוגית/היסטורית; `kind`, `title`, `passage`, `excerpt`, `body`, `share_count`. | משויכת לסוג ולמיקום מקראי באמצעות `passage`. |
| `StrongEntry` | הגדרה למספר Strong’s; `code`, שפה, מילה מקורית, תעתיק, הגייה, חלק דיבר, שורש והגדרה. | מקושרת לקוד Strong’s שנמצא בטקסט KJV+. |
| `VerseOfDay` | פסוק לתאריך; `verse_date`, `reference`, טקסט EN/LU ו־`note`. | רשומה אחת או יותר לפי תאריך; הבחירה נעשית בצד הלקוח. |

### 5.2 ספריות תוכן ו־Q&A

| Entity | תכלית ושדות מרכזיים | קשרים |
|---|---|---|
| `Devotional` | devotional דו־לשוני עם כותרת, reference, verse, body, prayer, topic, series, date, cover, featured ו־active. | topic וסדרה שמורים בעיקר כשמות/ערכים; רשומות התקדמות ושמירה משתמשות בקוד devotional. |
| `DevotionalTopic` | topic דו־לשוני עם `name_en`, `name_lu`, `active`. | משמש למיון וסינון devotionals. |
| `DevotionalPlan` | תוכנית devotionals; שמות בשתי שפות, תיאור, מספר ימים ו־active. | התוכן משויך בפועל גם דרך שדה `series`/שם התוכנית ברשומות devotional, לפי הקוד שסופק. |
| `QAItem` | שאלה ותשובה בספרייה, חובה באנגלית ובלוגנדה; topic, reference, tags ו־active/featured לפי היבטי הממשק. | קשור ל־`QATopic` לפי שם ולפי `topic_id`. |
| `QATopic` | topic דו־לשוני ל־Q&A, כולל תיאורים ו־active. | הורה לוגי ל־`QAItem`; המחיקה מוגבלת אם יש שאלות תחתיו. |
| `QAEntry` | שאלה שהוגשה על ידי קורא ותשובה/סטטוס; `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email`. | תוכן של פנייה/שאלה אישית, נבדל מספריית `QAItem`. |
| `VerseSongSeries` | סדרת שירים; `name`, `description`, thumbnails/covers, `accent`, `active`. | סדרה מכילה `VerseSongEpisode`, בדרך כלל לפי `series_name`. |
| `VerseSongEpisode` | שיר בסדרה; שם סדרה, כותרת, ספר/פרק/פסוק, reference, שפה, גרסה, כתובת אודיו, סדר ותכונות נוספות. | שייך לסדרה לפי `series_name`; הסכמה המלאה נקטעה. |
| `LiveSession` | שיעור חי; כותרת, תאריך, מארח, קישור ותיאור. | אין קשר entity מפורש נוסף בסכמות שהוצגו. |

### 5.3 נתוני משתמש, התקדמות וקהילה

| Entity | תכלית ושדות מרכזיים | קשרים |
|---|---|---|
| `Reading` | קריאה שהושלמה/נשמרה; משתמש, ספר, פרק, תרגום, `plan_day`, תאריך, מצב, reflection, prayer point ו־highlights. | משויך לחשבון לפי `owner_email`; עשוי להתאים ליום ב־`ReadingPlan`. |
| `ReadingPlan` | יום בתוכנית קריאה; `day`, `book`, `chapter`, כותרת, theme, focus ו־scripture. | `Reading.plan_day` מצביע על יום בתוכנית. |
| `ReadingActivity` | אירוע פעילות כגון ביקור בפרק, highlight, bookmark או note; owner, סוג פעולה, ספר, פרק ופסוק. | משויך למשתמש לפי `owner_email`. |
| `StudyMark` | סימון פסוק: `mark_type` מסוג highlight/bookmark/note, מיקום, צבע או טקסט note. | משויך למשתמש ולמיקום פסוקי. |
| `StudyAnnotation` | highlight/underline על אזורי טקסט במבוא, outline, תפילת ספר או פסוק שנפתח מה־sidebar; כולל section, `block_id`, סוג, צבע ו־offsets. | משויך למשתמש ולספר; קיימת גם שמירה מקומית. |
| `JournalEntry` | רשומת יומן; owner, תאריך, כותרת, גוף, קטגוריה, ספר/פרק ו־mood. | משויך למשתמש לפי `owner_email`. |
| `PrayerSaved` | תפילה שנשמרה; בעלים וכותרת תפילה. | משויך למשתמש ולתפילה באמצעות כותרת. |
| `DevotionalSaved` | devotional שנשמר; בעלים, קוד ותאריך שמירה. | משויך ל־`Devotional` באמצעות `devotional_code`. |
| `DevotionalProgress` | devotional שהושלם; בעלים, קוד ותאריך השלמה. | משויך ל־`Devotional` באמצעות `devotional_code`. |
| `Revelation` | פוסט קהילתי; בעלים, שם מחבר, כותרת, passage, גוף, likes ו־`parent_id`. | `parent_id` משמש לקישור תגובה לפוסט; תגובות מוצגות כרשומות child. |
| `DiscussionGroup` | קבוצת דיון; שם, תיאור, לו״ז ומספר חברים. | הודעות מקושרות לפי `group_name`. |
| `DiscussionThread` | הודעה בקבוצה; `group_name`, בעלים, מחבר, כותרת וגוף. | שייכת לוגית לקבוצה לפי שם הקבוצה. |
| `ContactMessage` | הודעת קשר ציבורית; שם, אימייל, נושא, הודעה, מצב קריאה ותשובה. | אין קשר חובה לחשבון משתמש. |

### 5.4 ניהול מערכת

| Entity | תכלית ושדות מרכזיים | קשרים והרשאות כפי שנראו |
|---|---|---|
| `AdminAccount` | פרטי מנהל, כולל אימייל, password hash, salt, session secret/version ותאריך עדכון. | גישה מוגבלת ל־owner/admin לפי הסכמה שסופקה. |
| `ActivityLog` | לוג פעולות מנהל: actor, action, section, detail. | מיועד למעקב אחרי פעולות ניהול. |
| `SiteSettings` | הגדרות ברמת אתר: `setting_key` ו־`setting_value`. | משמש, בין היתר, להגדרות ערכת נושא וקישור תרומה. |

### כללי גישה ותכנון נתונים

- בסכמות רבות נתוני תוכן ניתנים לקריאה ציבורית, וכתיבה מוגבלת ל־owner/admin.
- נתוני משתמש מוגנים בדרך כלל על בסיס `owner_email` והרשאות משתמש מאומת.
- חלק מהפעולות בממשק הניהול מתבצעות דרך פונקציות שרת (`adminContent`), וחלק יכולות לעבור לנתיב דפדפן חלופי (`adminDirect`).
- קיימות סכמות עם `x-fse2-access` בגרסאות שונות. כשמשנים הרשאות, חשוב להבין את מודל ההרשאות של פלטפורמת FSe2 ולא להסתמך רק על הסתרת כפתורים בממשק.
- קבצים שסופקו מציגים גם `ReadingPlan` ו־`Reading` עם הגדרות policy מסוג version 2; יש להתייחס למדיניות שלהם לפי הסכמה המלאה בפלטפורמה, ולא לפי הקטע המקוצר בלבד.

---

## 6. תהליכים ואינטראקציות מרכזיות

### 6.1 קריאת פרק תנ״ך

1. המשתמש נכנס ל־`BibleReader`.
2. בוחר ספר מתוך `BookGrid`, או מחפש ספר בשם אנגלי/לוגנדי/קיצור.
3. `ChapterSelector` מציג מספרי פרקים, sidebar ומשאבי ספר.
4. בחירת פרק מעבירה ל־`Chapter` עם `book` ו־`chapter` בפרמטרי URL.
5. `Chapter` קורא ל־`fetchChapter` מתוך `lib/bibleApi.js`.
6. שכבת ה־API מנסה להשתמש במקור המתאים, בגרסה שנבחרה, ובנתונים מקומיים/מותקנים בהתאם למצב.
7. המשתמש יכול לבחור פסוק, לשמור סימניה או note, לבצע highlight, לפתוח תפילה, cross-reference או משאב לימוד.
8. פעולות קריאה עשויות להירשם דרך `logReadingActivity` ולשמור התקדמות דרך `recordReading`.

**נקודות Debug:** בדקו את פרמטרי ה־URL, מזהה הגרסה, זמינות IndexedDB, מצב התחברות, ותוצאת פונקציית `fetchChapter`.

### 6.2 מעבר בין גרסאות תנ״ך והתקנת גרסה

1. המשתמש פותח את `VersionPicker`.
2. מוצגות גרסאות זמינות ומותקנות מתוך `lib/versions.js`.
3. בחירת גרסה מעדכנת את הגרסה הפעילה.
4. התקנה/הסרה מעדכנת את הנתונים המקומיים.
5. המסך קורא את הפרק שוב לפי הגרסה הפעילה.

**נקודת הרחבה:** גרסה חדשה דורשת עדכון של רשימת `VERSIONS`, טיפול בשליפה ב־`bibleApi.js` ותמיכה ב־offline/cache אם נדרשת.

### 6.3 סימון טקסט ב־sidebar

1. המשתמש מסמן טקסט ב־`AnnotatedText`.
2. מוצג toolbar לבחירת צבע או underline.
3. הרכיב מחשב segments מתוך offsets.
4. הורה הרכיב שומר annotations באמצעות `saveAnnotation`.
5. השמירה מתבצעת באופן מקומי, ולמשתמשים מחוברים גם מול `StudyAnnotation`.
6. בטעינה הבאה נעשה merge בין רשומות מקומיות לשרת דרך `mergeAnnotations`.

**דגש:** `block_id`, `section`, `start_offset` ו־`end_offset` הם חלק מהזהות של annotation. שינוי טקסט המקור עלול להזיז offsets או לגרום לסימון להופיע על מיקום שגוי.

### 6.4 שמירת סימון/הערה לפסוק

1. המשתמש בוחר פסוק.
2. `VerseActionBar` מציג פעולות.
3. פעולה יוצרת/מעדכנת `StudyMark` דרך הזרימה הממומשת בעמוד `Chapter`.
4. פעילות עשויה להירשם ב־`ReadingActivity`.
5. `BibleNotes` מציג את הסימונים של החשבון המחובר.

**דגש:** `StudyMark` הוא סימון של פסוק; `StudyAnnotation` הוא סימון על טקסט באזורי לימוד. אלה שני מודלים שונים.

### 6.5 פתיחת תפילה או cross-reference

1. תפילות והפניות נטענות לפי ספר/פרק באמצעות `lib/prayerPassages.js`.
2. פונקציות כגון `normalisePassage` ו־`normaliseCrossRef` מתאימות נתונים לצורה אחידה.
3. העמוד בוחר את התפילה המתאימה לפרק או לפסוק.
4. cross-reference יכול להציג טקסט שכבר נשמר ברשומה או לבקש את הפסוק מ־`CrossRefScripture`.
5. לחיצה על ההפניה מנווטת לפרק/פסוק יעד או פותחת חלונית פנימית, בהתאם להקשר.

### 6.6 קריאת devotional ושמירתו

1. `Devotionals` טוען תוכן ציבורי דרך `fetchPublicCollection`.
2. הנתונים עוברים סינון לפי visible/active/date, ולעיתים ממוזגים עם `DEVOTIONALS` שב־seed.
3. `DevotionalFilters` משנה שפה, חיפוש, topic, סדרה וטווח תאריכים.
4. המשתמש פותח כרטיס מלא, משתף או מסמן כנקרא/שמור.
5. `useDevotionalLibrary` שומר מצב מקומי גם למשתמש לא מחובר; למשתמש מחובר הסימונים יכולים להישמר גם ב־`DevotionalSaved` וב־`DevotionalProgress`.

### 6.7 ניהול devotionals

1. מנהל נכנס ל־`Admin` וממשיך ל־`AdminDashboard`.
2. נפתח `DevotionalsPanel`.
3. המנהל בוחר אחד מהטאבים: devotionals, topics, plans או bulk upload.
4. יצירה/עריכה נעשית ב־`DevotionalForm`, תוכנית דרך `DevotionalPlansPanel`, topic דרך `DevotionalTopicsPanel`.
5. ייבוא מרובה מתחיל בבדיקת JSON והצגת שגיאות לפני הכתיבה.
6. הנתונים נשמרים דרך `callAdminData` או דרך נתיב ה־direct fallback.

### 6.8 ייבוא תפילות והפניות

1. המנהל פותח `PrayerCrossRefImport`.
2. בוחר קובץ JSON.
3. הקובץ עובר parsing, נרמול ו־validation באמצעות `lib/prayerImport.js` ו־`lib/bookImport.js`.
4. המסך מציג שגיאות ודוח לפני הכתיבה.
5. הנתונים נכתבים ל־`PrayerPassage`, `CrossReference`, `ChapterIntro` ו־`BookIntro`, לפי מבנה הקובץ.
6. ממשקי `PassagesPanel`, `PrayersPanel` והקורא משתמשים באותן ישויות.

**דגש:** הייבוא מתוכנן להיות אידמפוטנטי בחלק מהזרימות באמצעות natural keys. לפני שינוי parser יש לבדוק את פונקציות `passageNaturalKey`, `crossRefNaturalKey` ומפתחות מבואות.

### 6.9 Q&A  -  תצוגה וניהול

**צד הקורא:**

1. `QA` טוען את הספרייה דרך `loadQaLibrary`.
2. שאלות ממוינות לפי אות, topic ומחרוזת חיפוש.
3. `QaLetterBar` משנה את סינון האות.
4. `QaCard` פותח תשובה ומציג הפניות מקראיות.

**צד המנהל:**

1. `QaPanel` טוען `QATopic` ו־`QAItem`.
2. topics מנוהלים לפני שאלות, משום שכל שאלה שייכת ל־topic.
3. `QaItemForm` אוכף שאלה ותשובה באנגלית ובלוגנדה.
4. לפני מחיקת topic שבשימוש, ממשק הניהול מבקש להעביר את השאלות ל־topic אחר.
5. `QaBulkImport` בודק את כל הרשומות לפני פתיחת הייבוא.

### 6.10 השמעת שיר פסוקים

1. `VerseSongs` טוען סדרות ופרקים דרך `fetchPublicCollection`.
2. `buildSongIndex` יוצר אינדקס אחיד לתצוגה.
3. המשתמש מסנן את הרשימה ובוחר Play.
4. `PlayerProvider` מנהל תור ניגון ואובייקט `Audio` יחיד ברמת האפליקציה.
5. `GlobalPlayer` נשאר במעטפת `Layout`, ולכן הניגון ממשיך במעבר בין עמודים.
6. הנגן מנהל התקדמות, עוצמה, מהירות, shuffle, repeat, מעבר קדימה/אחורה והקטנה/הרחבה.

### 6.11 הורדת תוכן ושימוש לא מקוון

1. המשתמש נכנס ל־`Offline`.
2. בוחר סוג תוכן או גרסה.
3. הממשק מביא נתונים ומכניס אותם ל־stores ב־IndexedDB.
4. קורא התנ״ך בודק תחילה תוכן זמין מקומית, בהתאם ללוגיקה ב־`bibleApi.js`.
5. `public/sw.js` שומר חלק ממשאבי האפליקציה במטמון HTTP.
6. המשתמש יכול לנקות נתונים מקומיים מתוך מרכז ה־Offline.

**הבחנה חשובה:** IndexedDB של `offlineDb.js` ו־cache של Service Worker הם מנגנונים נפרדים; ניקוי אחד לא בהכרח מנקה את השני.

### 6.12 התקנת מאגרי תנ״ך בממשק מנהל

1. מנהל נכנס ל־`AdminDashboard`.
2. בוחר `LugandaInstaller` או `KjvPlusInstaller`.
3. רכיב ההתקנה מוודא שה־admin token מעודכן.
4. הוא שולח פעולה ל־function המתאימה.
5. ה־Backend בודק מה כבר מותקן ומנסה להתקין פרקים חסרים.
6. `ChapterCoverage` מציג פרקים חסרים/פגומים.
7. `LibraryReport` מבצע audit לקריאה בלבד.

### 6.13 קהילה ותגובות

- **גילויים:** `CommunityRevelations` טוען פוסטים והודעות child, מאפשר יצירה, like ופתיחת תגובות.
- **קבוצות:** `DiscussionGroups` מציג קבוצות ו־threads, ושולח הודעות דרך `submitThreadMessage`.
- **שיעורים חיים:** `CommunityLiveTeaching` מציג `LiveSession` ויכול להשלים רשימה בתוכן seed.
- פעולות כתיבה עשויות לדרוש התחברות; רכיבי הטפסים מציגים מסלול ל־`Login` עבור משתמש לא מחובר.

### 6.14 הרשמה והתחברות

- `AuthProvider` ב־`Layout` בודק משתמש קיים דרך `fse2.auth.me()`.
- `Login` משתמש ב־`fse2.auth.login`.
- `Signup` משתמש ב־`fse2.auth.register`, ובמקרה הצורך מציג הודעת אימות.
- `ForgotPassword` מבקש קישור איפוס.
- `ResetPassword` מקבל token מה־URL ומעביר סיסמה חדשה ל־SDK.
- `Logout` מנתק את המשתמש ומנווט ל־Home.

### 6.15 ניהול תוכן: מנגנון הרשאה

`lib/adminSession.js` מתאר שני נתיבי עבודה:

1. נתיב שרת: פונקציות מנהל מאמתות token חתום ומשתמשות בהרשאות האפליקציה.
2. נתיב דפדפן: במקרה ש־function gateway אינו זמין, מתבצעות פעולות דרך Entity SDK והרשאות המנהל המחובר.

המשמעות לדיבוג היא שכשל ב־CMS עשוי להתרחש ב־gateway, באימות session או בהרשאות ה־entity  -  והודעת שגיאה אחת עלולה להסתיר באיזה נתיב מדובר.

---

## 7. הערות טכניות לפיתוח

### 7.1 ספריות וטכנולוגיות שניתן לזהות

- **React**  -  רכיבי ממשק, hooks ו־Context.
- **React Router**  -  ניווט באמצעות `Link`, `useNavigate` ו־`useSearchParams`.
- **TanStack Query (`@tanstack/react-query`)**  -  טעינת נתונים, cache, refetch ומוטציות בעמודים רבים.
- **FSe2 SDK**  -  גישה ל־entities, אימות ופונקציות Backend.
- **Lucide React**  -  אייקונים.
- **date-fns**  -  פורמט תאריכים וזמן יחסי.
- **IndexedDB**  -  שמירת תוכן לא מקוון.
- **Service Worker / PWA**  -  cache למעטפת, manifest והתקנה כאפליקציה.
- **Tailwind/generated CSS לצד CSS מותאם**  -  קיימים utility classes וכן מחלקות מותג מסוג `pr-*`.
- **Audio API בדפדפן**  -  נגן גלובלי.

לא ניתן לקבוע את כל גרסאות הספריות או פקודות build משום ש־`package.json` וקובצי תצורה לא סופקו.

### 7.2 דפוסים חוזרים

#### טעינה עם fallback

עמודי תוכן רבים משלבים:

- רשומות מהשרת;
- קובצי seed כגון `lib/seedContent.js`;
- לפעמים תוכן שנשמר מקומית.

לפני שינוי fallback יש להחליט אם התוכן המקומי אמור **להחליף** את התוכן החי או **להתמזג** איתו. לדוגמה, חלק מהעמודים מוסיפים seed רק אם אין רשומה בעלת אותו title.

#### נרמול נתונים

ה־Backend ותוכן legacy עשויים להשתמש בכמה שמות שדות לאותו מידע. יש להשתמש בעזרי נרמול קיימים, למשל:

- `bilingualText` ב־`lib/bilingual.js`;
- helpers ב־`lib/devotionals.js`;
- `normalisePassage` ו־`normaliseCrossRef`;
- `resolveBook` ו־`parseReference`;
- `safeText` מתוך `lib/format.js`.

הוספת גישה ישירה לשדה במקום שבו קיימת פונקציית normalization עלולה לשבור רשומות ישנות.

#### תבניות מודאל וטופס

- `Modal` הוא רכיב כללי שמטפל ב־Escape ובגלילת רקע.
- `RecordEditor` מייצר טופס לפי הגדרת collection.
- `ConfirmDialog` משמש לאישור פעולות מחיקה.
- טפסים ייעודיים כגון `QaItemForm` ו־`DevotionalForm` מכילים ולידציה ייחודית.

### 7.3 נקודות חשובות כאשר מוסיפים פיצ׳ר

1. **התחילו ממודל הנתונים:** הגדירו אם נדרש entity חדש או הרחבת קיים, מהם השדות הנדרשים ומהו המפתח הטבעי.
2. **בדקו את הרשאות ה־entity:** הוספת כפתור כתיבה לממשק אינה מספיקה; יש להתאים את מדיניות FSe2.
3. **עדכנו נרמול:** אם התוכן דו־לשוני, הוסיפו תמיכה בשדות החדשים ל־helpers המתאימים.
4. **בדקו מסלול לא מקוון:** האם הנתון צריך להישמר ב־IndexedDB? האם הוא חלק ממרכז ההורדות? האם ה־Service Worker צריך לכלול אותו?
5. **שמרו על natural keys:** imports צריכים לזהות רשומות קיימות ולמנוע כפילויות.
6. **הגדירו query keys יציבים:** בעבודה עם React Query, שמרו על query keys עקביים וכוללים פרמטרים משמעותיים כגון אימייל, ספר, פרק או סוג תוכן.
7. **עדכנו נתוני seed:** אם מסך מציג fallback, יש להחליט אם לעדכן גם את הספרייה המובנית.
8. **השתמשו ב־URL עבור מצב שניתן לשתף:** פרק, ספר, שפה או קבוצה צריכים להיות מיוצגים בפרמטרים כאשר מצופה שניתן יהיה לפתוח אותם ישירות.
9. **שמרו על התאמה בין שמות routes:** `createPageUrl("Chapter")` תלוי במיפוי של האפליקציה. לפני הוספת עמוד יש לבדוק את רישום הנתיבים.
10. **בדקו את מצב המשתמש הלא מחובר:** חלק מהפיצ׳רים עובדים מקומית, ואחרים דורשים חשבון. רצוי להבהיר זאת בממשק ולא להניח שהשרת זמין.
11. **בדקו נגישות בסיסית:** שימוש ב־`aria-label`, כפתורים סמנטיים, מצב loading ודיאלוגים נגישים כבר מופיע בחלק מהרכיבים; יש להמשיך באותו דפוס.
12. **אל תשנו generated files כנקודת מקור:** `__generated/tailwind.css` הוא תוצר. יש למצוא את מקור ה־CSS או את תצורת הייצור.

### 7.4 נקודות Debug לפי שכבה

| סימפטום | אזור בדיקה ראשון |
|---|---|
| עמוד נפתח לכתובת שגויה | קובץ ה־router וה־`createPageUrl`  -  אינם מופיעים בחומר שסופק. |
| מסך תוכן ריק | `fetchPublicCollection`, query key, הרשאות entity, תגובת FSe2 ו־fallback seed. |
| פרק לא נטען | פרמטרי `book/chapter/lang`, `lib/bibleApi.js`, זמינות מקור חיצוני, IndexedDB ו־entity של פרק מותקן. |
| תוכן לוגנדי ריק | שדות `*_lu`, נרמול `bilingual.js`, סטטוס התקנת `LugandaChapter` ומקור Wordplanet. |
| סימוני Strong’s לא נראים | מבנה הטקסט הגולמי, regex ב־`StrongsText.jsx`, והאם הפרק אכן מכיל markers. |
| סימון טקסט מופיע במקום שגוי | התאמה בין טקסט המקור לבין offsets שנשמרו ב־`StudyAnnotation`. |
| המנהל אינו מצליח לשמור | בדיקת session ב־`adminSession.js`, נתיב `adminContent`/`adminDirect`, הרשאות entity ו־payload. |
| ייבוא יוצר כפילויות | validation ו־natural key ב־`prayerImport.js`, `prayerPassages.js` או כלי הייבוא הספציפי. |
| פעולה נשמרת אך לא מופיעה | cache של React Query, invalidate/refetch, סינון לפי owner או השוואת מזהים/שמות. |
| ניגון נעצר במעבר עמוד | `PlayerProvider` ו־`Layout`; יש לוודא שה־provider נשאר ברמת השורש. |
| תוכן לא זמין במצב offline | בדיקת IndexedDB store, `offlineDb.js`, תהליך ההורדה ו־Service Worker בנפרד. |
| נתוני משתמש מוצגים למשתמש אחר | סינון `owner_email` והרשאות entity; אין להסתמך רק על סינון בצד לקוח. |

### 7.5 אבטחה ותפעול

- **סודות מנהל:** קובץ `functions/adminAuth.js` מתאר fallback של סיסמת מנהל כאשר secret סביבתי חסר. יש לוודא שבפריסת Production מוגדר secret חזק, ושאין אפשרות שה־fallback יהיה אמצעי התחברות פעיל.
- **אל תכניסו credentials או reset keys לקוד לקוח.** סודות, מפתחות חתימה ו־install keys צריכים להישאר בצד שרת/סביבת פריסה.
- **הגנת נתוני משתמש:** נתונים כמו יומן, קריאה וסימונים חייבים להיות מוגנים לפי בעלות בשרת, ולא רק באמצעות סינון React.
- **תוכן משתמש:** `safeText` מסייע להציג ערכים בצורה צפויה, אך אין להתייחס אליו כאל מנגנון סינון HTML מלא. העדיפו רינדור React רגיל והימנעו מ־HTML לא מהימן.
- **מקורות חיצוניים:** המקרא באנגלית ובלוגנדה והגדרות Strong’s נשענים על מקורות חיצוניים בחלק מתהליכי ההתקנה/שליפה. זמינותם, מבנה תגובתם ותנאי השימוש שלהם עשויים להשתנות.
- **עדכוני PWA:** בעת שינוי cache strategy או מעטפת, יש לבדוק גרסאות cache ב־`sw.js` כדי למנוע הצגת קבצים ישנים.
- **מחיקת נתונים:** מחיקת תוכן מקומי ב־IndexedDB, ניקוי Cache Storage ומחיקת נתוני שרת הם פעולות שונות. יש לנסח למשתמש בבירור מה נמחק.
- **קובצי `__trash/`:** לפני העברה או מחיקה, יש לוודא שאין להם import, route או שימוש תפעולי.

### 7.6 דברים שכדאי לאמת לפני תחילת שינוי משמעותי

1. מיפוי הנתיבים בפועל מול שמות העמודים.
2. חוזה התשובה של `callAdminData` ושל `fetchPublicCollection`.
3. הסכמות המלאות של entities שנקטעו בחומר.
4. הגדרות build, aliases וגרסאות חבילות מתוך קובצי הפרויקט שלא סופקו.
5. מדיניות גישה אפקטיבית ב־FSe2 לכל entity.
6. אילו תיקיות (`__trash`, `__url_fetch`, נכסי מדיה) נכללות ב־build.
7. מהו מקור האמת לכל תוכן: entity חי, seed, IndexedDB או נתון שנוצר בזמן ריצה.

---

**סיכום למפתח:** נקודת הכניסה להבנת האפליקציה היא `Layout.jsx` וה־providers שבו; עמודים נמצאים תחת `pages/`; רכיבי ממשק תחת `components/`; לוגיקת דומיין ושכבת נתונים תחת `lib/`; פעולות שרת תחת `functions/`; והסכמות וההרשאות תחת `entities/`. כשעוקבים אחרי תקלה, עברו לפי הרצף: **עמוד → רכיב → helper ב־`lib` → SDK/FSe2 או IndexedDB → entity/function**.
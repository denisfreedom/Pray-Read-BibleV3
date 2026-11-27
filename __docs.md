# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray‑Read Bible

## הערת היקף ודיוק

התיעוד מבוסס על קטעי המקור שסופקו. חלק מהקבצים נחתכו, וקובצי ניתוב מרכזיים  -  כגון `App.jsx`, הגדרת ה־Router, תצורת הבנייה ו־`package.json`  -  לא נכללו. לכן:

- כתובות העמודים להלן מוצגות לפי המוסכמה הנראית בקוד: `createPageUrl("PageName")` מתורגם בדרך כלל ל־`/PageName`.
- אין במידע שסופק מספיק כדי לאמת את הגדרת ה־Router, את שמות כל מקטעי הניהול או את כל השדות בכל Entity.
- כששדות או התנהגות מוסקים משמות ומצריכת הנתונים, הם מסומנים ככאלה ולא מוצגים כוודאות.
- התיקייה `__trash` מכילה רכיבים וניסויים ישנים; אין להניח שהם חלק מהאפליקציה הפעילה.

---

# 1. מהות המערכת

**Pray‑Read Bible** היא אפליקציית React לקריאה, לימוד ושיתוף של תוכן מקראי, עם דגש על אנגלית ולוגנדה. האפליקציה משלבת קורא תנ״ך, חומרי תפילה ולימוד, כלי סימון אישיים, תוכן קהילתי, מוזיקה ומערכת ניהול תוכן.

## קהלי יעד

- **קוראים ומאמינים**  -  קוראים פרקים, לומדים חומרי רקע, מתפללים, שומרים הערות ומתקדמים בתוכניות קריאה.
- **משתמשים רשומים**  -  מסנכרנים התקדמות, סימונים וכתיבה אישית לחשבון.
- **מנהלי תוכן**  -  מנהלים ספריות ותכנים, מייבאים קבצים ומתקינים מהדורות מקרא.
- **משתמשים במכשירים עם חיבור מוגבל**  -  משתמשים בתכנים שהורדו ובנתוני IndexedDB, וכן באפליקציית PWA.

## הערך שהמערכת מספקת

- **קריאה דו־לשונית**  -  אנגלית ולוגנדה, כולל בחירת מהדורות.
- **קריאה בהקשר**  -  תפילות, מבואות, הערות, הפניות מקבילות ותובנות מחוברות לפרק או לפסוק.
- **התאמה אישית**  -  סימוני פסוקים, סימניות, הערות, יומן תפילה והיסטוריית קריאה.
- **שימוש גם ללא רשת**  -  אחסון מקומי של חלק מהתכנים ו־Service Worker למעטפת האפליקציה.
- **הפצת תוכן**  -  שיתוף פסוקים, תפילות, ספרי לימוד ותכנים קהילתיים.
- **ניהול תכנים מרכזי**  -  ממשק CMS המבוסס במידה רבה על Entities ועל הגדרות שדות.

---

# 2. עמודים ותפקידיהם

## מוסכמת כתובות

הנתיבים בטבלה הם נתיבים צפויים לפי `createPageUrl("…")`. יש לאמת אותם מול קובץ ה־Router לפני שינוי ניווט או deep links.

| עמוד | כתובת משוערת | תפקיד, פעולות ואינטראקציות מרכזיות |
|---|---|---|
| `Home` | `/Home` או `/` | דף הבית. מציג היכרות עם המוצר, קישורים לאזורים המרכזיים, תוכן יומי וכניסות לתוכן נבחר. כולל פעולות שיתוף וקישורים לתפילות, לתנ״ך, למוזיקה ול־Q&A. |
| `About` | `/About` | מציג את מטרת האפליקציה ואת הרקע שלה. כולל קישור חזרה לבית וקישורים מתוך התוכן לאזורים אחרים. |
| `BibleReader` | `/BibleReader` | שער לבחירת ספר בתנ״ך. כולל חיפוש לפי שם באנגלית, שם לוגנדה וקיצור, מעבר בין הברית הישנה לחדשה, סטטוס זמינות לא מקוונת ובחירת ספר. בחירת ספר מציגה את בחירת הפרקים ואת משאבי הלימוד. |
| `Chapter` | `/Chapter?book=<מספר>&chapter=<מספר>` | קורא פרק. הפרמטרים `book` ו־`chapter` מזהים את הפרק; `lang`, `version` או `verse` עשויים להופיע בקישורים ובמצבי ניווט. הקורא משלב טקסט פסוקים, ניווט, בחירת מהדורה, סימונים, תפילה, הפניות ומידע לימודי. |
| `Devotionals` | `/Devotionals` | ספריית devotionals דו־לשונית. כוללת סינון שפה, חיפוש, נושא, סדרה וטווח תאריכים; הצגת devotional יומי, מעבר לקריאה מלאה, שמירה, סימון כנקרא ושיתוף. |
| `PrayerLibrary` | `/PrayerLibrary` | ספריית תפילות. כוללת חיפוש, סינון לפי קטגוריה ושפה, שיתוף ושמירת תפילות למשתמשים מחוברים. |
| `QA` | `/QA` | ספריית שאלות ותשובות. תומכת בשפות אנגלית/לוגנדה/שתיהן, נושא, חיפוש, מסנן אותיות A - Z, פתיחת תשובה, הצבעות ושיתוף/העתקה. |
| `TheologicalInsights` | `/TheologicalInsights` | מציג תובנות תיאולוגיות באמצעות `InsightsBoard`, כולל חיפוש, פתיחה, שמירה ושיתוף לפי המימוש המשותף. |
| `HistoricalInsights` | `/HistoricalInsights` | מציג תובנות היסטוריות באמצעות אותו רכיב משותף, עם `kind="historical"`. |
| `VerseOfDay` | `/VerseOfDay` | מציג פסוק ליום הנוכחי, מתוך נתונים חיים או נתוני seed. כולל קישור להקשר המקראי ושיתוף. |
| `Plan` | `/Plan` | מציג תוכנית קריאה, כברירת מחדל תוכנית בת 30 יום אם אין רשומות בשרת. מציג התקדמות ויום נוכחי לפי פרקי קריאה שהושלמו. |
| `Journal` | `/Journal` | יומן תפילה אישי. מאפשר ליצור, לערוך ולמחוק רשומות, לסנן לפי קטגוריה ולקשר רשומה לספר/פרק. נדרש חשבון כדי לקרוא ולשמור נתונים בחשבון, בהתאם למדיניות ה־Entity. |
| `Dashboard` | `/Dashboard` | לוח אישי. מציג מדדי קריאה, רצף, סימונים, devotional progress, תכנים שמורים ופעילות. משתמש ב־`ActivityFeed` ובנתוני חשבון. |
| `BibleNotes` | `/BibleNotes` | מציג סימונים אישיים  -  highlights, bookmarks והערות  -  ומקשר מהם חזרה לפרק הרלוונטי. העמוד מבקש התחברות לצפייה בנתוני החשבון. |
| `Offline` | `/Offline` | מרכז ניהול תכנים לא מקוונים. מאפשר לבחור סוג תוכן/מהדורה, להוריד תכנים, לראות כמויות ואחסון, ולמחוק נתונים מקומיים. |
| `VerseSongs` | `/VerseSongs` | ספריית שירי פסוקים. כוללת חיפוש, סינון לפי סדרה/ספר, ניגון דרך נגן גלובלי, שיתוף והורדה בתשלום לפי הממשק. |
| `VerseSongSeries` | `/VerseSongSeries?series=<id>` | מציג סדרה נבחרת או רשימת סדרות ושירים, בהתאם ל־query string. מאפשר סינון, ניגון, שיתוף ותהליך רכישה/הורדה. |
| `Community` | `/Community` | עמוד מרכזי לכניסה לגילויים קהילתיים, הוראה חיה וקבוצות דיון. מציג תוכן עדכני או נתוני seed. |
| `CommunityRevelations` | `/CommunityRevelations` | פיד של גילויים/עדויות. משתמש מחובר יכול לשלוח פוסט, לתת Like ולהגיב. תגובות מיוצגות כרשומות בעלות `parent_id`. |
| `CommunityLiveTeaching` | `/CommunityLiveTeaching` | מציג מפגשי הוראה חיים: כותרת, תאריך, מנחה וקישור הצטרפות. |
| `DiscussionGroups` | `/DiscussionGroups` | מציג קבוצות דיון, מאפשר לבחור קבוצה, להצטרף מקומית ולהציג/לשלוח הודעות לקבוצה. `group` עשוי להגיע כפרמטר URL. |
| `Contact` | `/Contact` | טופס פנייה. בודק שם, אימייל והודעה, ושולח לשרת דרך `submitContactMessage`. מציג מצב הצלחה/שגיאה. |
| `Login` | `/Login` | כניסת משתמש רגיל באמצעות `fse2.auth.login`. לאחר הצלחה מנווט ל־Dashboard. |
| `Signup` | `/Signup` | יצירת חשבון. בודק אורך סיסמה, התאמת סיסמה ואישור תנאים; עשוי להציג מצב אימות אימייל. |
| `ForgotPassword` | `/ForgotPassword` | בקשת קישור לאיפוס סיסמה לחשבון משתמש. |
| `ResetPassword` | `/ResetPassword?token=…` | בחירת סיסמה חדשה לפי token שמתקבל ב־URL. מאמת אורך והתאמת סיסמה. |
| `Logout` | `/Logout` | מסך קצר שמבצע יציאה לאחר השהיה ומנווט לבית. |
| `InstallPrompt` | `/InstallPrompt` | מדריך/הצעה להתקנת PWA. מזהה iOS/Android/desktop ומשתמש באירוע `beforeinstallprompt` כשזמין. |
| `Privacy` | `/Privacy` | מדיניות פרטיות סטטית. מתארת נתוני חשבון ואחסון מקומי. |
| `Terms` | `/Terms` | תנאי שימוש סטטיים. |
| `Admin` | `/Admin` | מסך כניסה למנהל תוכן, בדיקת session ואיפוס סיסמת מנהל. |
| `AdminDashboard` | `/AdminDashboard` | סביבת ניהול: ניהול תכנים, יבוא, ספריות ומתקיני תנ״ך. מחייבת session של מנהל. |

### פרמטרים בולטים בכתובות

- `book`  -  מספר ספר מקראי.
- `chapter`  -  מספר פרק.
- `verse`  -  פסוק יעד, כשקיים.
- `lang`  -  שפת קריאה, למשל `lu`.
- `series` / `song`  -  סינון שירי פסוקים.
- `group`  -  בחירת קבוצת דיון.
- `next`  -  יעד חזרה לאחר כניסה.
- `token` או `access_token`  -  token לאיפוס סיסמה.
- `topic`, `letter`, `search`, `lang`  -  סינון Q&A שמסונכרן עם query string.

---

# 3. מפת ניווט לצורכי DEBUG

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| מעבר לקורא התנ״ך | Header או Home | `Bible Reader` | `/BibleReader` |
| בחירת ספר | `BibleReader` | כרטיס ספר | אזור בחירת פרק ומשאבי ספר |
| פתיחת פרק | בחירת פרק בספר | אריח מספר פרק | `/Chapter?book=…&chapter=…` |
| פתיחת פסוק מקישור פנימי | תובנה/תפילה/הפניה | קישור Scripture reference | פרק עם פסוק יעד |
| פתיחת פירוט Strong’s | `Chapter` במהדורת KJV+ | לחיצה על קוד Strong’s כחול | `StrongsPopup` מעל הקורא |
| מעבר בין מהדורות | `Chapter` | `VersionPicker` | אותו פרק במהדורה אחרת |
| פתיחת תפילת פסוק | `Chapter` | פעולת Prayer בסרגל הפסוק | אזור/חלונית תפילה |
| פתיחת הפניות מקבילות | `Chapter` | פעולת Cross‑refs | `CrossRefList` או אזור הפניות |
| מעבר לפרק יעד מהפניה | `CrossRefList` | לחיצה על הפניה | `/Chapter?book=…&chapter=…&verse=…` |
| פתיחת שיתוף של פסוק/פרק | `Chapter` | Share | `ShareSheet` |
| הוספת סימון/הערה לפסוק | `Chapter` | פעולות Highlight / Bookmark / Note | נשמר ב־`StudyMark` ו/או באחסון מקומי |
| פתיחת ספר devotional | Header או Home | `Daily Devotionals` | `/Devotionals` |
| פתיחת devotional מלא | רשימת devotionals | כרטיס או כפתור פתיחה | תצוגת `DevotionalFullView` בעמוד |
| שמירת devotional | כרטיס/תצוגה מלאה | Save/Heart | עדכון ספריית המשתמש המקומית ובמידת הצורך השרת |
| שיתוף devotional | כרטיס/תצוגה מלאה | Share | `ShareSheet` |
| מעבר לספריית תפילות | Header או Home | `Prayer Library` | `/PrayerLibrary` |
| שמירת תפילה | כרטיס תפילה | Bookmark | יצירה/מחיקה ב־`PrayerSaved` |
| פתיחת Q&A | Header או Home | `Q&A` | `/QA` |
| סינון Q&A | `/QA` | שפה, נושא, אות או חיפוש | אותה כתובת, עם מצב מסננים |
| שליחת גילוי | Community | `Revelations` ואז טופס שליחה | `/CommunityRevelations` |
| תגובה לגילוי | כרטיס גילוי | פתיחת comments ושליחת הודעה | רשומת `Revelation` עם `parent_id` |
| צפייה בהוראה חיה | Community | `Live teaching` | `/CommunityLiveTeaching` |
| פתיחת קבוצת דיון | Community | `Discussion groups` | `/DiscussionGroups` |
| שליחת הודעה לקבוצה | קבוצת דיון | טופס Messages | יצירת `DiscussionThread` |
| פתיחת תוכנית קריאה | Header או Dashboard | `Reading plan` | `/Plan` |
| פתיחת יומן | Header או Dashboard | `Prayer journal` | `/Journal` |
| פתיחת רשומה חדשה ביומן מתוך קישור | קישור יומן | `?new=1&book=…&chapter=…` | `/Journal` עם טופס פתוח |
| פתיחת הערות תנ״ך | Header | `My notes` | `/BibleNotes` |
| כניסה למצב לא מקוון | Header | `Offline centre` | `/Offline` |
| הורדת תוכן | `/Offline` | בחירת תוכן ולחצן הורדה | IndexedDB מקומי |
| ניגון שיר | `/VerseSongs` או סדרה | Play | נגן גלובלי בתחתית האפליקציה |
| רכישת הורדת שיר | כרטיס שיר | `Buy to Download` | תהליך רכישה חיצוני/מקומי לפי מימוש העמוד |
| כניסת משתמש | Header או עמוד מוגן | `Sign in` | `/Login` |
| יצירת משתמש | `/Login` | קישור Signup | `/Signup` |
| איפוס סיסמה למשתמש | `/Login` | Forgot password | `/ForgotPassword` |
| קביעת סיסמה חדשה | קישור אימייל | קישור עם token | `/ResetPassword?token=…` |
| כניסה לניהול תוכן | עמוד מנהל | טופס כניסה | `/Admin` ואז `/AdminDashboard` |
| ניהול תכני devotional | AdminDashboard | מקטע Devotionals | `DevotionalsPanel` |
| יבוא devotional בכמות | `DevotionalsPanel` | Bulk upload | `DevotionalBulkImport` |
| ניהול Q&A | AdminDashboard | מקטע Q&A | `QaPanel` |
| יבוא Q&A | `QaPanel` | Bulk upload | `QaBulkImport` |
| ניהול תפילות ומעברי ספרים | AdminDashboard | מקטע תפילות/Passages | `PrayersPanel` / `PassagesPanel` |
| יבוא תפילות והפניות | AdminDashboard | Prayer/cross‑reference import | `PrayerCrossRefImport` או `JsonImportPanel` |
| ניהול אוספים כלליים | AdminDashboard | Collections | `CollectionsPanel` |
| התקנת התנ״ך בלוגנדה | AdminDashboard | Luganda Bible | `LugandaInstaller` |
| התקנת KJV+ ו־Strong’s | AdminDashboard | KJV+ with Strong’s | `KjvPlusInstaller` |
| יציאה ממנהל | AdminDashboard | Sign out | ביטול session וחזרה למסך מנהל/בית |

---

# 4. מבנה קבצים

## 4.1 דפי האפליקציה  -  `pages/`

| קובץ | תפקיד ומה הוא מרנדר |
|---|---|
| `pages/About.jsx` | דף מידע על Pray‑Read וקישורים לעמודי האפליקציה. |
| `pages/Admin.jsx` | כניסת מנהל, בדיקת session וטופס איפוס סיסמת מנהל. |
| `pages/AdminDashboard.jsx` | לוח הניהול המרכזי, מקטעים לניהול נתונים, יבוא ומתקיני תנ״ך. |
| `pages/BibleNotes.jsx` | רשימת סימוני פסוקים אישיים וקישורים חזרה לפרקים. |
| `pages/BibleReader.jsx` | חיפוש ובחירת ספר, מצב זמינות מקומית וטעינת `ChapterSelector`. |
| `pages/Chapter.jsx` | עמוד קריאה בפרק; מתזמר נתוני פסוקים, מהדורה, תפילות, הפניות, פעולות לימוד וסימונים. |
| `pages/Community.jsx` | שער לאזורי קהילה ותצוגת תוכן נבחר. |
| `pages/CommunityLiveTeaching.jsx` | רשימת מפגשי הוראה חיים. |
| `pages/CommunityRevelations.jsx` | פיד גילויים, יצירה, Like ותגובות. |
| `pages/Contact.jsx` | טופס פנייה ושליחתו לשרת. |
| `pages/Dashboard.jsx` | לוח פעילות והתקדמות אישי. |
| `pages/Devotionals.jsx` | ספריית devotional, מסננים, כרטיס יומי ותצוגה מלאה. |
| `pages/DiscussionGroups.jsx` | קבוצות דיון והודעות. |
| `pages/ForgotPassword.jsx` | בקשת איפוס סיסמה לחשבון משתמש. |
| `pages/HistoricalInsights.jsx` | עטיפה של `InsightsBoard` עבור תובנות היסטוריות. |
| `pages/Home.jsx` | עמוד הבית, תוכן נבחר וכניסות מהירות לתכונות. |
| `pages/InstallPrompt.jsx` | הוראות/הצעת התקנת PWA. |
| `pages/Journal.jsx` | קריאה, יצירה, עריכה, סינון ומחיקה של רשומות יומן. |
| `pages/Login.jsx` | כניסת משתמש רגיל. |
| `pages/Logout.jsx` | ביצוע יציאה והפניה לעמוד הבית. |
| `pages/Offline.jsx` | מרכז הורדה ומחיקת תכנים מקומיים. |
| `pages/Plan.jsx` | תוכנית קריאה והתקדמות. |
| `pages/PrayerLibrary.jsx` | ספריית תפילות, חיפוש, שפה, קטגוריה ושמירה. |
| `pages/Privacy.jsx` | טקסט מדיניות פרטיות. |
| `pages/QA.jsx` | ספריית שאלות ותשובות ציבורית עם פילטרים וניווט אלפביתי. |
| `pages/ResetPassword.jsx` | איפוס סיסמת משתמש לפי token. |
| `pages/Signup.jsx` | רישום משתמש ואימות קלט. |
| `pages/Terms.jsx` | תנאי שימוש. |
| `pages/TheologicalInsights.jsx` | עטיפה של `InsightsBoard` עבור תובנות תיאולוגיות. |
| `pages/VerseOfDay.jsx` | פסוק היום ושיתוף. |
| `pages/VerseSongSeries.jsx` | תצוגת סדרות/שירים עם סינון ורכישה. |
| `pages/VerseSongs.jsx` | ספריית שירים כללית, ניגון, חיפוש ושיתוף. |

## 4.2 רכיבי ניהול  -  `components/admin/`

| קובץ | תפקיד |
|---|---|
| `ChapterCoverage.jsx` | הצגת כיסוי פרקי התנ״ך; `compressChapters` מכווץ מספרי פרקים לטווחים כגון `2-5`. |
| `CollectionsPanel.jsx` | CRUD גנרי לאוספים שנרשמו ב־`adminCollections`. |
| `ConfirmDialog.jsx` | חלון אישור לפעולה הרסנית, כגון מחיקה. |
| `CrossRefEditor.jsx` | עריכה של רשימת הפניות מקבילות בצורת chips. |
| `DevotionalBulkImport.jsx` | קריאת קובץ devotional בכמות, ולידציה והעברה ליבוא. |
| `DevotionalForm.jsx` | טופס עריכת devotional דו־לשוני. |
| `DevotionalPlansPanel.jsx` | ניהול תוכניות devotional והצגת devotionals המשויכים לתוכנית. |
| `DevotionalsPanel.jsx` | סביבת ניהול devotionals: רשימה, נושאים, תוכניות ויבוא. |
| `DevotionalTopicsPanel.jsx` | ניהול נושאים; מונע מחיקת נושא שנמצא בשימוש. |
| `JsonImportPanel.jsx` | יבוא JSON למספר collections, התאמה לרשומות קיימות ודוח יבוא. |
| `KjvPlusInstaller.jsx` | ממשק התקנה/בדיקה של KJV+ ומילון Strong’s. |
| `LibraryReport.jsx` | דוח ביקורת לקריאות התנ״ך, פערים ומצב Strong’s. |
| `LugandaInstaller.jsx` | ממשק התקנת התנ״ך בלוגנדה. |
| `PassagesPanel.jsx` | ניהול תפילות־פסוקים, הפניות, מבואות פרק ומבואות ספר. |
| `PrayerCrossRefImport.jsx` | בדיקה ויבוא של קובצי תפילות והפניות, עם תצוגה של תוכן שכבר הותקן. |
| `PrayersPanel.jsx` | ספריית תפילות או מצב ניהול תפילות לפי פרק/פסוק. |
| `QaAdminList.jsx` | רשימת Q&A בממשק מנהל, כולל חיפוש, נושא, אות וסימון מרובה. |
| `QaBulkImport.jsx` | יבוא שאלות ותשובות בכמות עם בדיקת שלמות ועדכון רשומות קיימות. |
| `QaItemForm.jsx` | טופס שאלה/תשובה דו־לשוני. |
| `QaPanel.jsx` | מתאם בין נושאי Q&A, פריטים ויבוא. |
| `QaQuestionsPanel.jsx` | רשימת שאלות, טופס עריכה ואישור מחיקה. |
| `QaTopicForm.jsx` | טופס נושא Q&A דו־לשוני. |
| `QaTopicsPanel.jsx` | ניהול נושאים, לרבות העברת שאלות לפני מחיקת נושא. |
| `RecordEditor.jsx` | טופס גנרי שנבנה ממטא־נתוני collection. |
| `VerseSongBulkImport.jsx` | יבוא סדרת שירים ופרטי שירים מקובץ JSON. |
| `VerseSongForm.jsx` | טופס עריכת שיר; מנסה לקרוא metadata של משך האודיו. |
| `VerseSongSeriesForm.jsx` | טופס יצירה/עריכה של סדרת שירים. |
| `VerseSongsPanel.jsx` | ניהול סדרות ופרקי שיר, חיפוש, מחיקה ויבוא. |

## 4.3 רכיבים משותפים  -  `components/common/`

| קובץ | תפקיד |
|---|---|
| `BrandIcons.jsx` | סמלי מותג לרשתות שיתוף שאינן חלק מספריית Lucide. |
| `EmptyState.jsx` | מצב ריק אחיד עם סמל, כותרת, תיאור ופעולה. |
| `Modal.jsx` | מודאל משותף עם סגירה ב־Escape, חסימת גלילת body וכותרת/תחתית. |
| `PageHeader.jsx` | כותרת עמוד, עם או בלי תמונת Hero. |
| `Pagination.jsx` | רכיב דפדוף לעמודים ארוכים. |
| `ShareRow.jsx` | שורת כפתורי שיתוף קומפקטית. |
| `Spinner.jsx` | מצב טעינה נגיש עם `role="status"`. |

## 4.4 רכיבים לפי תחום

### `components/community/`

| קובץ | תפקיד |
|---|---|
| `CommentThread.jsx` | הצגת תגובות לגילוי וטופס תגובה למשתמש מחובר. |
| `RevelationCard.jsx` | כרטיס גילוי, Like ופתיחת תגובות. |
| `RevelationForm.jsx` | טופס יצירת גילוי או prompt להתחברות. |
| `ThreadMessages.jsx` | הודעות קבוצת דיון וטופס שליחת הודעה. |

### `components/dashboard/`

| קובץ | תפקיד |
|---|---|
| `ActivityFeed.jsx` | קריאת פעילויות המשתמש והצגתן באופן תמציתי. |

### `components/devotional/`

| קובץ | תפקיד |
|---|---|
| `DevotionalCard.jsx` | כרטיס devotional ברשימה. |
| `DevotionalFeatured.jsx` | devotional מובלט/יומי. |
| `DevotionalFilters.jsx` | פילטרי שפה, חיפוש, נושא, תאריך וסדרה. |
| `DevotionalFullView.jsx` | תצוגת devotional מלאה עם תפילה, פסוק ופעולות. |

### `components/home/`

| קובץ | תפקיד |
|---|---|
| `StatCard.jsx` | כרטיס מדד עם תווית, ערך, רמז ואייקון. |

### `components/insight/`

| קובץ | תפקיד |
|---|---|
| `InsightsBoard.jsx` | לוח תובנות משותף לתוכן תיאולוגי והיסטורי. |

### `components/journal/`

| קובץ | תפקיד |
|---|---|
| `JournalCard.jsx` | כרטיס רשומת יומן עם עריכה ומחיקה. |
| `JournalForm.jsx` | טופס רשומת יומן עם קטגוריה וקישור לספר/פרק. |

### `components/layout/`

| קובץ | תפקיד |
|---|---|
| `AppFooter.jsx` | Footer וקישורים מהירים. |
| `AppHeader.jsx` | ניווט ראשי/משני, משתמש ופעולות התחברות/יציאה. |
| `GlobalPlayer.jsx` | ממשק נגן שירים שנשאר גלוי בין עמודים. |
| `PwaHead.jsx` | הוספת meta/link tags ורישום Service Worker. |

### `components/plan/`

| קובץ | תפקיד |
|---|---|
| `PlanRow.jsx` | פריט תוכנית עם מצב completed/current/upcoming וקישור לפרק. |

### `components/qa/`

| קובץ | תפקיד |
|---|---|
| `QaCard.jsx` | כרטיס שאלה ותשובה, הפניות מקראיות והצבעות. |
| `QaFilters.jsx` | פילטר שפה, חיפוש ונושאים. |
| `QaLetterBar.jsx` | סרגל A - Z גליל אופקי עם ספירות. |

### `components/read/`

| קובץ | תפקיד |
|---|---|
| `AnnotatedText.jsx` | טקסט עם סימון טווחים, הדגשה וקו תחתון. |
| `BookGrid.jsx` | רשת 66 הספרים וסינון לפי שם. |
| `BookIntro.jsx` | מבוא ספר, קטעים מרכזיים וסימונים. |
| `BookOutline.jsx` | חלוקה למקטעים וניווט לטווחים בספר. |
| `BookPrayerPanel.jsx` | תפילת הספר, עם תמיכה בטקסט מיובא ותוכן fallback. |
| `BookSidebar.jsx` | לוח צד לספר: מבוא, מתווה ותפילה. |
| `BookStudyResources.jsx` | משאבי לימוד לספר: commentary ותובנות. |
| `ChapterClosingPrayer.jsx` | תפילת סיום לפרק. |
| `ChapterGrid.jsx` | אריחי פרקים של ספר. |
| `ChapterReaderPane.jsx` | מעטפת אזורי הלימוד לצד פרק. |
| `ChapterResourcesPanel.jsx` | תובנות תיאולוגיות והיסטוריות לפרק/ספר. |
| `ChapterSelector.jsx` | בחירת פרק ותוכן לימודי של ספר. |
| `ChapterSidebar.jsx` | לוח צד של פרק: מבוא, commentary, תפילה והפניות. |
| `CrossRefList.jsx` | רשימת הפניות מקבילות, עם fallback להפניות פרק. |
| `CrossRefScripture.jsx` | הצגת הטקסט של הפסוק שאליו מפנים. |
| `FloatingVerse.jsx` | חלונית פסוק צפה וקישור לקורא. |
| `PassagePrayer.jsx` | תפילה המתאימה לפסוק/פרק. |
| `PassageTabs.jsx` | טאבים של חומרי לימוד הקשורים למעבר. |
| `ShareSheet.jsx` | מודאל שיתוף של פסוק, פרק או devotional. |
| `StrongsPopup.jsx` | חלונית פירוש למספר Strong’s. |
| `StrongsText.jsx` | פענוח סמני Strong’s והצגתם כקישורים. |
| `VerseActionBar.jsx` | פעולות לפסוק: תפילה, הפניות, סימון, שיתוף, הערה ועוד. |
| `VerseCrossRefs.jsx` | אזור הפניות מקבילות מתחת לפסוק. |
| `VerseList.jsx` | רשימת פסוקים בסיסית. |
| `VersePopup.jsx` | הצגת קטע פסוקים בחלונית בתוך הקורא. |
| `VersionPicker.jsx` | בחירת מהדורה מותקנת, התקנה והסרה שלה. |

### `components/song/`

| קובץ | תפקיד |
|---|---|
| `SeriesCard.jsx` | כרטיס סדרת שירים. |
| `SongCard.jsx` | כרטיס שיר עם ניגון, שיתוף ורכישת הורדה. |
| `SongFilters.jsx` | חיפוש ופילטרים לפי סדרה וספר. |
| `SongShareSheet.jsx` | מודאל שיתוף של שיר. |

## 4.5 תשתית ואינטגרציות

### קבצים בשורש

| קובץ | תפקיד |
|---|---|
| `Layout.jsx` | עוטף את האפליקציה ב־`AuthProvider`, `ThemeProvider` ו־`PlayerProvider`; מרנדר Header, תוכן, Footer מותנה, נגן ו־PWA head. |

### `lib/`

| קובץ | תפקיד |
|---|---|
| `activity.js` | סוגי פעילות וכתיבת פעילות משתמש. |
| `adminCollections.js` | מטא־נתונים של collections, שדות, כותרות וברירות מחדל לטפסי ניהול. |
| `adminDirect.js` | מימוש צד־לקוח מקביל לפעולות CMS דרך SDK של FSE2. |
| `adminSession.js` | התחברות, שמירה/רענון/ביטול של session מנהל וניתוב בין מסלול שרת למסלול ישיר. |
| `app-params.js` | קריאת App ID ו־token של FSE2 מתוך `localStorage`. |
| `AuthContext.jsx` | Context של משתמש רגיל: בדיקת auth, יציאה והפניה לכניסה. |
| `bibleApi.js` | טעינת פרקים לפי מהדורה, שילוב נתונים מקומיים ו־offline. |
| `bibleBooks.js` | רשימת 66 הספרים, שמות, קיצורים ומספרי פרקים. |
| `bilingual.js` | חילוץ טקסט אנגלי ולוגנדה ממבנים ישנים וחדשים. |
| `bookGuides.js` | נתוני seed של מבואות ומתווים לכל ספר. |
| `bookImport.js` | פענוח קובצי ספר והמרתם לאוספי יבוא. |
| `bookIntro.js` | קריאה ונרמול של מבוא ספר ותפילת סיום ספר. |
| `bookPrayers.js` | תפילות seed לפי ספר. |
| `bookStudyContent.js` | תוכן fallback לתובנות ותוכן לימודי של ספרים. |
| `brandCss.js` | מערכת CSS וטוקנים של המותג. |
| `chapterIntros.js` | קריאה/נרמול של מבואי פרקים. |
| `chapterStudy.js` | בניית תוכן לימודי לפרק מתוך מקורות קיימים. |
| `contentApi.js` | שכבת גישה לתוכן ציבורי, submit ציבורי ופעולות קהילה. |
| `crossRefs.js` | הפניות מקבילות מובנות לקטעים נבחרים. |
| `devotionals.js` | נרמול, תאריכים, מפתחות, מיזוג seed ופונקציות ספריית devotional. |
| `format.js` | עזרי טקסט בטוח, רשימות ופורמט נתונים. |
| `keyPassages.js` | פסוקים מרכזיים לכל ספר. |
| `luganda.js` | עזרי עיצוב/ניקוי של טקסט devotional בלוגנדה. |
| `offlineDb.js` | מעטפת IndexedDB, stores ומפתחות מקומיים. |
| `planData.js` | תוכנית קריאה מובנית המשמשת fallback. |
| `player.jsx` | Context גלובלי לנגן אודיו, queue, זמן, עוצמה וחזרה. |
| `prayerImport.js` | בדיקה, נרמול ויבוא קובצי תפילות והפניות. |
| `prayerPassages.js` | נרמול ואחזור תפילות־פסוקים והפניות. |
| `qaLibrary.js` | טעינה, מיון, סינון, אותיות ונרמול ספריית Q&A. |
| `reading.js` | תאריכים, תוויות תאריך, רצפים וחישובי התקדמות. |
| `readings.js` | התאמת פרקים ליום בתוכנית ורישום קריאה שהושלמה. |
| `scriptureRefs.js` | פענוח הפניות מקראיות, שמות ספרים ויצירת קישורים. |
| `seedContent.js` | נתוני fallback ציבוריים, לרבות devotionals, תפילות, Q&A, קהילה ועוד. |
| `sha256.js` | מימוש SHA‑256 בצד לקוח עבור בדיקות מנהל בסביבות ללא Web Crypto. |
| `share.js` | בניית טקסטים וקישורים ופתיחת ערוצי שיתוף. |
| `strongs.js` | נרמול ופענוח מספרי Strong’s וקודים. |
| `strongsOffline.js` | קריאה/כתיבה של פירושי Strong’s באחסון המקומי. |
| `studyAnnotations.js` | טעינה, איחוד ושמירה של סימוני טקסט בלוח הצד. |
| `textSelection.js` | בדיקה אם בחירה קיימת נמצאת בתוך אזור טקסט מסוים. |
| `theme.js` | טוקני מותג, כתובות נכסים ומפתחות אחסון. |
| `themeContext.jsx` | טעינת הגדרות אתר והחלת ערכי צבע/מותג. |
| `useDevotionalLibrary.js` | Hook לניהול devotional שנשמרו או נקראו. |
| `verseSongs.js` | נרמול סדרות ושירים, בניית queue וסינון. |
| `versions.js` | קטלוג מהדורות, התקנה/הסרה ומהדורה פעילה. |

### `functions/`

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | התחברות מנהל, hash סיסמה, session חתום, רענון ואיפוס. |
| `functions/adminContent.js` | API ניהול תוכן המאומת באמצעות session מנהל. |
| `functions/bibleChapter.js` | שירות צד־שרת לשליפת פרק ממקורות מקרא חיצוניים וניקוי הטקסט. |
| `functions/content.js` | API תוכן ציבורי ושליחת טפסים/פעולות ציבוריות. |
| `functions/kjvInstall.js` | התקנת פרקי KJV+ עם Strong’s. |
| `functions/lugandaInstall.js` | התקנת פרקי לוגנדה. |
| `functions/scriptureAudit.js` | בדיקת מצב הספרייה; לפי הקוד המוצהר, קריאה בלבד. |
| `functions/strongsDefinition.js` | אחזור/שמירה של הגדרות Strong’s ממקורות מילון חיצוניים. |

### אוטומציה וקובצי public

| קובץ/נתיב | תפקיד |
|---|---|
| `cron/scriptureInstall.js` | תהליך מתוזמן שמנסה להשלים פרקי לוגנדה ו־KJV+ חסרים. בכותרת הקובץ מצוין תזמון שעתי. |
| `public/manifest.json` | הגדרות PWA: שם, אייקונים, צבע, scope ומצב standalone. |
| `public/sw.js` | Service Worker: cache למעטפת האפליקציה ו־runtime caching לפי אסטרטגיות המוגדרות בו. |
| `__generated/tailwind.css` | CSS שנוצר אוטומטית; לא מקור ראשי מומלץ לעריכה. |
| `public/assets/**` | קובצי תמונה, אייקון, מסמכים ותבניות יבוא. אלה נכסי תוכן ולא לוגיקת React. |
| `__url_fetch/**` | תוצרי איסוף/בדיקה של כתובות חיצוניות; אין להתייחס אליהם כקוד אפליקציה פעיל בלי בירור נוסף. |
| `__trash/**` | קוד ישן או כלי בדיקה זמניים; לא להשתמש בו כמודל למימוש הפעיל בלי לבדוק את ה־Router וה־Git history. |

---

# 5. מודל הנתונים  -  Entities

ה־Entities הם שכבת הנתונים של FSE2. האפליקציה משתמשת גם בנתוני seed וב־IndexedDB, כך שלא כל התוכן חייב להגיע מהשרת בכל טעינה.

> בחלק מהגדרות ה־JSON שסופקו השדות נחתכו. להלן השדות המרכזיים שניתן לזהות והקשרים הסבירים לפי הקוד. ייתכן שהסכמה בפועל כוללת שדות נוספים.

| Entity | תכלית ושדות מרכזיים | קשרים |
|---|---|---|
| `ActivityLog` | תיעוד פעולות במערכת הניהול: `actor`, `action`, `section`, `detail`. | לוג תפעולי; לא תוכן קורא. |
| `AdminAccount` | חשבון מנהל: `email`, `password_hash`, `salt`, `secret`, `session_version`, `updated_date`. | משמש את `adminAuth.js`; לא חשבון משתמש רגיל. |
| `BibleVerse` | פסוק שמור: `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu`. | שייך למיקום תנ״כי לפי מפתח ספר/פרק/פסוק. |
| `BookIntro` | מבוא ותפילת סיום של ספר: `book_number`, `book_name`, כותרות, `intro_en`, `intro_lu`, `closing_prayer_en`, `closing_prayer_lu`. | ספר אחד מתוך 66; מפתח טבעי לפי `book_number`. |
| `ChapterIntro` | מבוא לפרק: `book_number`, `book_name`, `chapter`, כותרות, `intro_en`, `intro_lu`, `source`. | תלוי בספר ובפרק; מפתח טבעי לפי ספר+פרק. |
| `Commentary` | הערת commentary לפרק: `book`, `chapter`, `title`, `body_en`, `body_lu`. | קשור למיקום ספר/פרק. |
| `ContactMessage` | הודעת קשר: שם, אימייל, נושא, הודעה, `is_read`, `reply`. | נוצר ציבורית; ניהול/קריאה למנהלים. |
| `CrossReference` | הפניה מקבילה מפסוק מקור ליעד. שדות שנראים כוללים מיקום מקור `book_number/chapter/verse`, מיקום יעד `ref_book_number/ref_chapter/ref_verse`, וטקסט/הערות בשתי שפות. | קשר סמנטי בין שני מיקומים בתנ״ך; עשוי לכלול טווח פסוקים ונתוני unresolved. |
| `Devotional` | תוכן devotional דו־לשוני. שדות מרכזיים: `code`, `title_en/title_lu`, `scripture_ref`, `scripture_lu`, `verse_en/verse_lu`, `body_en/body_lu`, `prayer_en/prayer_lu`, `topic`, `series`, `date`, `cover_url`, `featured`, `active`. | משויך ל־`DevotionalTopic` לפי שם נושא ול־`DevotionalPlan`/סדרה לפי ערכי טקסט, לפי המימוש. |
| `DevotionalPlan` | תוכנית devotionals: `name_en`, `name_lu`, `description`, `days`, `active`. | חיבור ה־devotionals נראה מבוסס על `series`/שם; בקוד `DevotionalPlansPanel` משווה ל־`plan.name_en`. |
| `DevotionalProgress` | devotional שהמשתמש סימן כהושלם: `owner_email`, `devotional_code`, `completed_date`. | משתמש + devotional לפי code. |
| `DevotionalSaved` | devotional שהמשתמש שמר: `owner_email`, `devotional_code`, `saved_date`. | משתמש + devotional לפי code. |
| `DevotionalTopic` | נושא devotional: `name_en`, `name_lu`, `active`. | מקושר ל־devotional לפי שם נושא, לא בהכרח FK קשיח. |
| `DiscussionGroup` | קבוצת דיון: `name`, `description`, `schedule`, `member_count`. | מקושרת להודעות דרך `group_name`. |
| `DiscussionThread` | הודעה בתוך קבוצה: `group_name`, `owner_email`, `author_name`, `title`, `body`. | שייכת לקבוצה לפי שם; נכתבת על ידי משתמש. |
| `Insight` | תובנה תיאולוגית/היסטורית: `kind`, `title`, `passage`, `excerpt`, `body`, `share_count`. | `passage` מחבר אותה לספר/פרק דרך פענוח הפניה. |
| `JournalEntry` | רשומת יומן: `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood`. | שייכת למשתמש; אופציונלית קשורה למיקום מקראי. |
| `KjvPlusChapter` | פרק KJV+: `book_number`, `book`, `chapter`, `verse_count`, `verses` (JSON כמחרוזת). | מפתח פרק; הטקסט כולל סימוני Strong’s. |
| `LiveSession` | שיעור/מפגש חי: `title`, `session_date`, `host`, `join_link`, `description`. | תוכן ציבורי עצמאי. |
| `LugandaChapter` | פרק בלוגנדה: `book_number`, `book`, `chapter`, `verse_count`, `verses`. | מפתח פרק; משמש קריאה מקוונת/לא מקוונת. |
| `Prayer` | תפילה בספרייה: `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref`, `cross_refs`. | מקושרת להפניות מקראיות; נשמרת לפי כותרת ב־`PrayerSaved`. |
| `PrayerPassage` | תפילה הקשורה לפרק/פסוק/טווח: `book_number`, `book_name`, `chapter`, `verse`, `verse_end`, כותרות ותוכן תפילה בשתי שפות. `verse=0` משמש לפי ההגדרה לתוכן של פרק שלם. | מיקום תנ״כי; עשויה להתאים לפסוק יחיד, טווח או תפילת סיום. |
| `PrayerSaved` | תפילה שמורה: `owner_email`, `prayer_title`. | משתמש + תפילה, עם מפתח שמירה מבוסס כותרת. |
| `QAEntry` | שאלה שנשלחה על ידי קורא עם `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email`. | תהליך שאלה/תשובה אחר מספריית Q&A; הרשאות לפי הקובץ. |
| `QAItem` | פריט בספריית Q&A הדו־לשונית: נושא, הפניה מקראית, `question_en/question_lu`, `answer_en/answer_lu`; לפי ממשק המנהל קיימים גם `tags`, `featured`, `active` ועוד. | קשור ל־`QATopic`, בדרך כלל לפי שם נושא ו/או `topic_id`. |
| `QATopic` | נושא Q&A: `name_en`, `name_lu`, `description_en`, `description_lu`, `active`. | נושא של פריטי `QAItem`. |
| `ReadingActivity` | פעילות קריאה: `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse`. | משתמש ומיקום מקראי. |
| `Reading` | התקדמות קריאה: `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses`. | משתמש + פרק; `plan_day` מקשר ל־`ReadingPlan`. |
| `ReadingPlan` | פריט בתוכנית קריאה: `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture`. | פריטי תוכנית; משתמשים ב־`Reading.plan_day` לציון התקדמות. |
| `Revelation` | פוסט גילוי או תגובה: `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id`. | `parent_id` מקשר תגובה לפוסט אב. |
| `SiteSettings` | הגדרות אתר כגון `setting_key`, `setting_value`. | זוגות מפתח/ערך; משמשים לערכת נושא וקישורים. |
| `StrongEntry` | הגדרת מילון Strong’s: `code`, `language`, `original_word`, `transliteration`, `pronunciation`, `part_of_speech`, `root_word`, `definition`, `source`. | מפתח לפי קוד Strong’s; נשמר גם מקומית. |
| `StudyAnnotation` | סימון טווח טקסט: `owner_email`, `book_number`, `book`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset` ושדות נוספים לפי הסכמה. | קשור למשתמש, לספר ולמקטע טקסט; המקבילה המקומית נשמרת ב־IndexedDB. |
| `StudyMark` | סימון פסוק: `owner_email`, `mark_type`, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text`. | משתמש + פסוק; `mark_type` כולל highlight/bookmark/note לפי ההגדרה. |
| `VerseOfDay` | פסוק ליום: `verse_date`, `reference`, `text_en`, `text_lu`, `note`. | תאריך והפניה מקראית. |
| `VerseSongEpisode` | שיר יחיד בסדרה: `series_name`, `title`, `description`, `duration_seconds`, `audio_url`, `thumbnail`, `cover_url`, `episode_order`, `plays_count`, `active`. | משויך לסדרה לפי `series_name`. |
| `VerseSongSeries` | סדרת שירים: `name`, `display_order`, `description`, `thumbnail`, `cover_image`, `accent`, `featured`, `active`. | אוסף של `VerseSongEpisode` לפי שם סדרה. |

## הרשאות והפרדת נתונים

ב־Entities מופיעות כמה תבניות הרשאה:

- תוכן ציבורי לקריאה (`roles: ["*"]`) ועדכונים למנהלים.
- נתונים אישיים עם הרשאות למשתמשים מאומתים, כגון `JournalEntry`, `Reading`, `StudyMark` ו־`DevotionalProgress`.
- טפסים ציבוריים שמאפשרים יצירה אך לא קריאה ציבורית, כגון `ContactMessage`.
- ממשק המנהל יכול להשתמש ב־`adminContent` עם token מנהל או במסלול SDK ישיר דרך `adminDirect`.

הגדרת הרשאה ב־JSON אינה תחליף לבדיקת הרשאות בשרת. יש לאמת שהשרת מוודא בעלות על `owner_email` ולא מסתמך על סינון בלבד בצד React.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 טעינת וקריאת פרק

1. המשתמש בוחר ספר ופרק ב־`BibleReader`/`ChapterSelector`.
2. המיקום מועבר ב־URL, בדרך כלל באמצעות `book` ו־`chapter`.
3. `Chapter.jsx` מזהה את הספר דרך `bibleBooks.js` וטוען את הפרק דרך `bibleApi.js`.
4. שירות הקריאה יכול לשלב מקורות מקוונים, עותק שהותקן ב־Entity ועותק IndexedDB, בהתאם למהדורה ולזמינות.
5. סביב הפרק נטענים נתונים משלימים: תפילות־פסוקים, הפניות, מבואות, commentary, תובנות ותוכן fallback.
6. המשתמש יכול לנווט, לשנות מהדורה, לפתוח חלוניות ולהוסיף סימונים.
7. פעולות משתמש מסוימות נרשמות ב־`ReadingActivity` או ב־`Reading`.

**נקודות Debug מומלצות:** לבדוק קודם את ה־query parameters, את `book_number`, את מזהה המהדורה ואת מקור הנתון שנבחר. אחרי כן לבדוק את cache של React Query ואת IndexedDB.

## 6.2 סימון טקסט וסימוני פסוקים

יש שני מסלולים נפרדים של סימונים:

- **סימוני טווח בטקסט לימודי**  -  `StudyAnnotation`, עם `section`, `block_id` ו־offsets של תחילת/סוף טווח. `AnnotatedText` בונה את מקטעי הטקסט ומרנדר את הסימון.
- **סימוני פסוקים**  -  `StudyMark`, עם סוג סימון, ספר, פרק ופסוק. משמשים highlights, bookmarks והערות.

במקומות מסוימים הסימונים נשמרים גם ב־IndexedDB, כך שהקריאה לא תלויה בחיבור. עבור משתמש מחובר הנתונים עשויים להסתנכרן לשרת.

## 6.3 תפילות והפניות

1. תוכן מיובא נשמר ב־`PrayerPassage`, `CrossReference`, `ChapterIntro` ו־`BookIntro`.
2. `prayerPassages.js`, `chapterIntros.js` ו־`bookIntro.js` מנרמלים את הצורה שקיימת בנתונים.
3. הקורא בוחר תפילה שמתאימה לפרק/פסוק באמצעות פונקציות התאמה.
4. אם קיים תוכן מיובא, הוא מקבל עדיפות על תוכן fallback.
5. הפניה מקבילה יכולה להציג טקסט שנשמר עם הרשומה או להביא פסוק מהמקור.
6. לחיצה על ההפניה מנווטת למיקום היעד או פותחת אותו בחלונית.

## 6.4 שמירת devotional והתקדמות

1. המשתמש מסנן devotionals ובוחר פריט.
2. תוכן הרשומה מנורמל דרך `devotionals.js`, שמכיר גם שמות שדות ישנים.
3. שמירה/סימון כנקרא מטופלים ב־`useDevotionalLibrary.js`.
4. המצב נשמר מקומית; משתמש מחובר עשוי לקבל גם סנכרון ל־`DevotionalSaved` ו־`DevotionalProgress`.
5. במסך הניהול, יצירה ועריכה נעשות דרך `DevotionalsPanel` ו־`DevotionalForm`; יבוא בכמות עובר דרך ולידציה ב־`DevotionalBulkImport`.

## 6.5 ניהול תוכן (CMS)

המסלול הכללי:

1. המנהל נכנס בעמוד `/Admin`.
2. `adminSession.js` מנסה את מסלול השרת ומסוגל לעבור למסלול ישיר דרך ה־SDK, לפי זמינות Function Gateway.
3. `AdminDashboard` מציג מקטע ניהול.
4. קריאה/כתיבה מתבצעת באמצעות `callAdminData` או דרך קוד ייעודי.
5. אוספים גנריים מוגדרים ב־`adminCollections.js`; `RecordEditor` בונה את השדות לפי המטא־נתונים.
6. לפני מחיקה מוצג `ConfirmDialog`.
7. אחרי שמירה, הפאנלים טוענים מחדש או מעדכנים את מצב המסך.

**מקום חשוב להרחבה:** אם אוסף מתאים לטופס הגנרי, לרוב צריך לעדכן את מטא־נתוני האוסף ולא להוסיף טופס ייעודי חדש.

## 6.6 יבוא קבצים

יש כמה פורמטים שונים, וכל אחד הוא חוזה נתונים:

- `pray-read-devotionals-v1`
- `pray-read-qa-v1`
- `pray-read-verse-songs-v1`
- `pray-read-prayer-crossrefs-v1`
- `pray-read-crossrefs-backfill-v1`
- יבוא JSON גנרי לפי collection

תהליך מומלץ להבנת כשל יבוא:

1. לבדוק את שדה `format`.
2. לבדוק שדות חובה ומספר רשומה בדוח.
3. לבדוק נרמול של שמות ספרים והפניות.
4. לבדוק את `natural key` שבו משתמש היבוא לעדכון במקום יצירת כפילות.
5. לבדוק אם הקובץ מייצג אוסף כללי או קובץ ספר מקונן.
6. לבדוק את דוח התוצאה ואת מצב הרשומות בשרת.

הקוד מתאר חלק מהיבואים כבטוחים להרצה חוזרת, אך יש לאמת את המפתח הטבעי בפונקציה הרלוונטית לפני הפעלה חוזרת בסביבת production.

## 6.7 התקנת ספרי התנ״ך

- `LugandaInstaller` ו־`KjvPlusInstaller` מדברים עם Functions ייעודיות.
- לפני כל פעולה הם מבטיחים שה־admin token טרי.
- השרת בודק אילו פרקים כבר מותקנים ומנסה להשלים חסרים.
- `ChapterCoverage` מציג מצב לפי ספר ופרק.
- `LibraryReport` מפעיל `scriptureAudit` לצורך ביקורת.
- `cron/scriptureInstall.js` משמש השלמה אוטומטית תקופתית.

## 6.8 ניגון שירים

1. `VerseSongs` או `VerseSongSeries` טוענים סדרות ושירים.
2. `verseSongs.js` מנרמל רשומות ומייצר queue.
3. בחירה בשיר מגיעה ל־`PlayerProvider`.
4. `player.jsx` מחזיק אלמנט `Audio` גלובלי ב־Context.
5. `GlobalPlayer` מוצג בכל Layout, ולכן הניגון ממשיך בין עמודים.
6. הנגן מנהל זמן, משך, עוצמה, מהירות, shuffle ו־repeat.
7. תהליך רכישת הורדה משתמש גם במפתחות `localStorage`; יש לבדוק את הלוגיקה המלאה בעמוד לפני הסתמכות על רכישה כהרשאה מאובטחת.

## 6.9 שימוש לא מקוון ו־PWA

- `PwaHead` מוסיף manifest, אייקונים ו־meta tags ורושם Service Worker.
- `public/sw.js` מטפל ב־cache של מעטפת ונתוני runtime.
- `offlineDb.js` מנהל IndexedDB ומוסיף stores חסרים במעבר בין גרסאות.
- עמוד `Offline` מציע הורדת תכנים לאחסון המקומי.
- האפליקציה משתמשת בכמה שכבות cache: React Query, Service Worker ו־IndexedDB. בעת Debug יש לזהות איזו שכבה מחזירה את התוכן; ניקוי שכבה אחת אינו בהכרח מנקה את האחרות.

---

# 7. הערות טכניות לפיתוח

## ספריות ותשתיות שניתן לזהות

- **React**  -  ממשק ורכיבים.
- **React Router**  -  ניווט (`Link`, `useNavigate`, `useSearchParams`).
- **TanStack React Query**  -  טעינת נתונים, cache, mutations ועדכון מסכים.
- **Lucide React**  -  אייקונים.
- **date-fns**  -  עיצוב מרחקי זמן ותאריכים.
- **FSE2 SDK**  -  `fse2.entities`, `fse2.auth` ו־`fse2.functions.invoke`.
- **IndexedDB**  -  אחסון offline דרך `lib/offlineDb.js`.
- **Web APIs**  -  `Audio`, `localStorage`, `navigator.share`, `beforeinstallprompt`, `Service Worker`.
- **CSS מותאם**  -  מחלקות `pr-*`, טוקנים ב־`brandCss.js` ו־CSS שנוצר ב־`__generated/tailwind.css`.

לא סופקה תצורת dependencies מלאה; אין להסיק מכאן גרסאות או פקודות build.

## דפוסים חוזרים

### 1. תוכן live עם seed fallback

רבים מהעמודים קוראים ל־`fetchPublicCollection`, ואם אין נתונים  -  משתמשים ב־`seedContent.js` או בקובצי seed תחומיים. לכן:

- נתון שמוצג במסך לא בהכרח נשמר ב־Entity.
- כדי לבדוק אם תוכן הגיע מהשרת, בדוק את תוצאת ה־query ולא רק את ה־UI.
- בעת עריכת תוכן ב־CMS, בדוק האם ה־seed עדיין ממוזג למסך ועלול להציג רשומה מקבילה.

### 2. נרמול לאחור

קבצים כגון `devotionals.js`, `bilingual.js`, `prayerPassages.js` ו־`bookImport.js` נועדו לתמוך בצורות נתונים ותיקות. לפני הסרת alias או שינוי שם שדה, בדוק:

- אילו נתונים נוצרו בעבר.
- איך המייבא כותב כיום.
- איך הרכיבים קוראים שדות legacy.
- האם התוכן נשמר בשתי שפות בנפרד.

### 3. הבדלים בין משתמש רגיל למנהל

אין לערבב בין:

- `AuthContext` ו־`fse2.auth`  -  משתמש רגיל.
- `adminSession` ו־`adminAuth`  -  מנהל תוכן.

לשני המסלולים יש session, הרשאות וזרימת כניסה נפרדים.

### 4. Query keys

React Query משמש בהרבה אזורים. לשמות query keys יש משמעות תפעולית, למשל:

- `["readingActivity", email]`
- `["chapterInsights"]`
- `["bookIntro", book.number]`
- `["installedPassages", bookNumber, chapter]`
- `["devotionalProgress", email]`

בעת כתיבה או מחיקה יש לבדוק אם יש invalidation/refetch של ה־query המתאים. אם לא, ה־UI עשוי להישאר במצב ישן למרות שהשרת עודכן.

### 5. מפתחות טבעיים

תוכן מיובא ותוכן לפי מיקום מקראי משתמשים במפתחות טבעיים, לדוגמה:

- ספר: מספר ספר.
- פרק: מספר ספר + פרק.
- תפילה/הפניה: מיקום מקור ויעד.
- devotional: code.
- Strong’s: code מנורמל.
- Q&A: לפי מנגנון היבוא והנרמול.

שינוי שדות מפתח מחייב עדכון עקבי של היבוא, הקריאה, העריכה ומנגנוני ה־upsert.

### 6. שפות

- מזהי השפה אינם אחידים בכל המסכים: קיימים `en`/`lu`, ובמקומות אחרים `EN`/`LU`/`BOTH`.
- ה־Entities משתמשים בשדות `*_en` ו־`*_lu`.
- אל תניחו שטקסט אנגלי משמש תחליף ללוגנדה. לפי `bilingual.js`, מחרוזת פשוטה נחשבת אנגלית בלבד.

### 7. ניווט מבוסס הפניות

`scriptureRefs.js` הוא רכיב מרכזי. שינוי ברשימת aliases או בפענוח הפניה יכול להשפיע על:

- קישורי devotional.
- תפילות ומבואות.
- תובנות.
- הפניות מקבילות.
- פתיחת חלוניות פסוק.

יש לבדוק מקרים של ספרים בעלי מספר תחילי, שמות חלופיים, טווח פסוקים והפניות ללא פסוק.

### 8. אבטחה ונתונים רגישים

- אין להעביר סודות שרת או מפתחות התקנה לקוד צד לקוח.
- `adminAuth.js` מתאר fallback להתקנת מנהל חדשה. יש להגדיר סודות מתאימים ולשנות/להסיר ערכי ברירת מחדל לפני פריסה.
- יש לוודא שה־token של מנהל אינו נכתב ללוגים או נחשף ב־URL.
- אין להסתמך על `owner_email` שנשלח מהדפדפן לצורך הרשאה; השרת צריך לאמת את המשתמש מול session.
- בדוק שהרשאות ה־Entities תואמות למסכים: UI שמסתיר כפתור אינו מנגנון אבטחה.
- מנגנון רכישת שיר ששומר סטטוס ב־`localStorage` אינו לבדו הוכחת תשלום מאובטחת.

### 9. טיפול בשגיאות ו־race conditions

- חלק מהרכיבים משתמשים בדגל `active` או cleanup כדי למנוע עדכון state אחרי unmount  -  המשך להשתמש בדפוס זה בקריאות async מקומיות.
- טעינת מקורות חיצוניים תלויה בזמינות ובמבנה HTML/API של צד שלישי; יש לבדוק את תגובת המקור ואת parser, לא רק את הקומפוננטה.
- ברכיבי יבוא, הבדל בין שגיאת JSON, שגיאת schema, שגיאת רשת ושגיאת כתיבה ל־Entity.

### 10. נגישות ומודאלים

- קיימים `aria-label`, `role="dialog"` ו־`aria-modal` ברכיבים משותפים.
- `Modal` תומך ב־Escape ובחסימת גלילת גוף הדף.
- `ConfirmDialog` הוא מימוש נפרד; כשמשנים התנהגות מודאלית, בדוק עקביות בין שני המימושים.
- ברכיבים אינטראקטיביים שמוצגים ככרטיסים, יש לוודא תמיכה במקלדת ולא רק בעכבר.

## הצעות עבודה למפתח חדש

1. **להתחיל מ־`Layout.jsx`** כדי להבין את Providers, ה־Header, ה־Footer והנגן.
2. **לאתר את הגדרת ה־Router** שאינה כלולה בחומר ולוודא את שמות/נתיבי העמודים.
3. **לעבור על `lib/bibleBooks.js`, `lib/contentApi.js`, `lib/offlineDb.js` ו־`lib/adminSession.js`**  -  אלה נקודות ציר מרכזיות.
4. **לבדוק את ה־Entity JSON הרלוונטי לפני שינוי UI** ולוודא שמות שדות והרשאות.
5. **לעקוב אחר מקור נתון**: seed, שרת, IndexedDB או Service Worker.
6. **להריץ בדיקת תהליך מקצה לקצה**: טעינה, פעולה, כתיבה, רענון וחזרה למסך.
7. **לא להשתמש בקובצי `__trash` או `__url_fetch` כקוד פעיל** בלי אימות מול ה־Router והגרסה הנוכחית.
8. **לאשר התנהגות בפועל לפני תיעוד חוזה API**: קטעי המקור אינם כוללים את כל גופי ה־Functions, ה־Router או תצורת ה־SDK.

### רשימת בדיקות קצרה לשינוי

- האם הקישור משתמש ב־`createPageUrl`?
- האם הפרמטרים ב־URL נשמרים במעבר עמוד?
- האם נתונים מקומיים ונתוני שרת מתאחדים ללא כפילות?
- האם יש fallback מתאים כשאין תוכן בשרת?
- האם משתמש אנונימי יכול לראות/לכתוב את הנתונים הנדרשים?
- האם לאחר mutation מתבצע עדכון query cache?
- האם הפיצ׳ר פועל גם ללא חיבור, אם הוא אמור להיות זמין offline?
- האם בדקת תוכן בשתי השפות?
- האם יבוא חוזר מעדכן ולא יוצר כפילויות?
- האם שינית גם את סכמת ה־Entity, מטא־נתוני הניהול וה־parser לפי הצורך?
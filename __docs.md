# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד טכני  -  Pray-Read Bible

## הערות על היקף התיעוד

התיעוד מבוסס על קטעי המקור שסופקו. חלק מהקבצים נחתכו, וקבצים חשובים כגון הגדרת ה־router, נקודת הכניסה, הגדרת `fse2Client`, קובצי build ו־`package.json` לא נכללו. לכן:

- נתיבי העמודים להלן הם הנתיבים המקובלים לפי שמות `pages` והשימוש ב־`createPageUrl`; יש לאמת אותם מול הגדרת הניתוב בפועל.
- בפרטי שדות של Entity נכללים רק שדות שנראו בסכימה שסופקה. יש Entity שסכימתו נחתכה.
- קשרים בין Entities מתוארים לעיתים כקשרים לוגיים לפי מפתחות כמו `owner_email`, מספר ספר או מזהה רשומה; לא בהכרח קיימת אכיפת FK במסד.
- תיקיית `__trash` וקובצי `__url_fetch` הם חומר ארכיוני/בדיקות ותוכן שנאסף, ולא חלק מהזרימה הפעילה כפי שניתן להסיק מהקוד.

---

# 1. מהות המערכת

**Pray-Read Bible** היא אפליקציית React לקריאה, לימוד ותפילה סביב התנ״ך, עם תמיכה באנגלית ובלוגנדה. היא משלבת קורא תנ״ך, ספריית תוכן רוחני, כלי לימוד, תכני קהילה, נגן מוזיקה וממשק ניהול תוכן.

המערכת מיועדת לכמה סוגי משתמשים:

- **קוראים ואורחים**  -  קריאה בתנ״ך, עיון בתפילות, שאלות ותשובות, תובנות ותכני קהילה ציבוריים.
- **משתמשים מחוברים**  -  שמירת סימניות, הדגשות, הערות, יומן תפילה, התקדמות בקריאה ותכנים שמורים בין מכשירים.
- **מנהלי תוכן**  -  ניהול מאגרי תוכן, ייבוא קבצים, התקנת טקסטים מקראיים ובדיקת שלמות הספרייה.

### הערך המרכזי

- גישה לתוכן **באנגלית ובלוגנדה**.
- שילוב בין הטקסט המקראי לבין תפילות, מבואות, פירושים, הפניות צולבות ותובנות.
- עבודה חלקית או מלאה **ללא חיבור לרשת**, באמצעות IndexedDB, מטמון Service Worker והתקנת פרקים מראש.
- אפשרות להשתמש באפליקציה גם ללא חשבון, כאשר נתונים אישיים מסוימים מסונכרנים לשרת רק עבור משתמשים מחוברים.
- סביבת CMS פנימית לניהול ועדכון תכנים.

---

# 2. עמודים ותפקידיהם

## נתיבים והפניות

רוב הקישורים נוצרים באמצעות `createPageUrl("PageName")`. שם העמוד הוא אפוא המקור העיקרי לזיהוי היעד. בפרט, ה־URL עשוי לקבל פרמטרים כמו `book`, `chapter`, `verse`, `lang`, `series` או `next`.

| עמוד | URL משוער | תפקיד ופעולות מרכזיות |
|---|---|---|
| `Home` | `/` או `/Home` | דף הבית. מציג כניסה לפיצ׳רים, תוכן יומי כמו devotional ופסוק היום, קישורים מרכזיים ופעולות שיתוף. |
| `About` | `/About` | מציג את מטרת Pray-Read, אופי הפרויקט והסבר כללי על השירות. קישור חזרה לבית. |
| `BibleReader` | `/BibleReader` | נקודת הכניסה לקורא התנ״ך. חיפוש ספרים, מעבר בין הברית הישנה והחדשה, בחירת ספר ופתיחת עמוד ספר. מציג מידע על זמינות לא־מקוונת. |
| `Chapter` | `/Chapter?book=N&chapter=N` | עמוד קריאת פרק. מציג פסוקים, בחירת גרסה ושפה, סימונים, הערות, תפילות והפניות צולבות, משאבי לימוד ושיתוף. |
| `Devotionals` | `/Devotionals` | ספריית devotional דו־לשונית. סינון לפי שפה, חיפוש, נושא, סדרה וטווח תאריכים; צפייה בפריט מלא, שמירה, סימון כנקרא ושיתוף. |
| `PrayerLibrary` | `/PrayerLibrary` | ספריית תפילות ציבורית עם חיפוש, קטגוריות, בחירת שפה ושמירת תפילות למשתמשים מחוברים. |
| `QA` | `/QA` | ספריית שאלות ותשובות. מסנני שפה, נושא, אות וחיפוש; פתיחת תשובה, הצבעה/העתקה/שיתוף לפי רכיבי העמוד. |
| `TheologicalInsights` | `/TheologicalInsights` | מציג תובנות תאולוגיות באמצעות `InsightsBoard`. חיפוש, פתיחת פריט ושיתוף. |
| `HistoricalInsights` | `/HistoricalInsights` | מציג תובנות היסטוריות באמצעות אותו רכיב `InsightsBoard`. |
| `VerseOfDay` | `/VerseOfDay` | פסוק היום, בחירת תוכן לפי תאריך עם fallback לתוכן seed ושיתוף. |
| `Plan` | `/Plan` | תוכנית קריאה יומית. מציג את הימים, מצב השלמה והתקדמות המשתמש. קישורים לקטעי הקריאה. |
| `Journal` | `/Journal` | יומן תפילה אישי: יצירה, עריכה, סינון לפי קטגוריה ומחיקה. העמוד משתמש ב־`JournalEntry` ומצופה לחשבון מחובר. |
| `BibleNotes` | `/BibleNotes` | ריכוז סימניות, הדגשות והערות מקראיות של המשתמש. אורח מקבל הודעת התחברות. |
| `Dashboard` | `/Dashboard` | לוח אישי עם פעילות קריאה, נתוני התקדמות, סימונים ותכנים אישיים. חלק מהתצוגה מסתמך על `ReadingActivity`, `Reading`, `StudyMark` ותוכן אישי נוסף. |
| `Offline` | `/Offline` | מרכז הורדות וניהול מידע לא־מקוון: פרקי תנ״ך, מילון Strong’s, devotional ותכני לימוד. כולל גם אפשרויות מחיקה/ניהול של נתוני IndexedDB. |
| `VerseSongs` | `/VerseSongs` | אינדקס שירי פסוקים וסדרות. חיפוש וסינון, ניגון, שיתוף והורדה בתשלום לפי המימוש המקומי. |
| `VerseSongSeries` | `/VerseSongSeries?series=...` | תצוגת סדרה או רשימת סדרות, בהתאם לפרמטרים ולמימוש. סינון לפי ספר/סדרה, ניגון ושיתוף. |
| `Community` | `/Community` | מרכז כניסה לאזורי קהילה: עדויות, הוראה חיה וקבוצות דיון. מציג תצוגות מקדימות של תוכן ציבורי. |
| `CommunityRevelations` | `/CommunityRevelations` | הצגה ופרסום של עדויות/תובנות משתמשים, לייקים ותגובות. פרסום ותגובה דורשים התחברות. |
| `CommunityLiveTeaching` | `/CommunityLiveTeaching` | רשימת מפגשי הוראה חיים: תאריך, מארח וקישור הצטרפות אם קיים. |
| `DiscussionGroups` | `/DiscussionGroups?group=...` | קבוצות דיון והודעות לפי קבוצה. משתמש יכול להצטרף מקומית ולשלוח הודעות לפי מדיניות המערכת. |
| `Contact` | `/Contact` | טופס יצירת קשר. שולח הודעה דרך `submitContactMessage`, עם בדיקת שם, כתובת דוא״ל ותוכן. |
| `Login` | `/Login` | התחברות לחשבון משתמש רגיל דרך `fse2.auth.login`. הצלחה מובילה ל־Dashboard. |
| `Signup` | `/Signup` | יצירת חשבון, בדיקת חוזק/אורך סיסמה, התאמת אימות וקבלת תנאים. ייתכן שלב אימות דוא״ל. |
| `ForgotPassword` | `/ForgotPassword` | בקשת קישור לאיפוס סיסמה דרך `fse2.auth.forgotPassword`. |
| `ResetPassword` | `/ResetPassword?token=...` | איפוס סיסמה באמצעות token שמגיע ב־URL. בודק אורך סיסמה והתאמה. |
| `Logout` | `/Logout` | מסך ביניים קצר, מבצע יציאה ומנווט לבית. |
| `Privacy` | `/Privacy` | מדיניות פרטיות סטטית, כולל הסבר כללי על נתונים אישיים ואחסון מקומי. |
| `Terms` | `/Terms` | תנאי שימוש סטטיים. |
| `InstallPrompt` | `/InstallPrompt` | מדריך/פעולת התקנה כ־PWA. מזהה פלטפורמה ומנסה להציג prompt נתמך בדפדפן. |
| `Admin` | `/Admin` | כניסה נפרדת למנהל התוכן. כולל התחברות ואיפוס סיסמת מנהל. |
| `AdminDashboard` | `/AdminDashboard` | סביבת ניהול התוכן. מציגה אזורים לניהול ספריות, ייבוא, הגדרות והתקנת טקסטים מקראיים. |

### עמודים מנהליים  -  אזורים מרכזיים

`AdminDashboard` כולל, בין היתר, אזורים כגון:

- לוח בקרה וסיכום.
- ספרים ופרקים.
- התקנת התנ״ך בלוגנדה.
- התקנת KJV+ עם Strong’s.
- תפילות.
- ייבוא JSON.
- ייבוא תפילות והפניות צולבות.
- ניהול אוספי תוכן.
- ניהול שירי פסוקים.
- ניהול שאלות ותשובות.
- ניהול devotionals, נושאים ותוכניות.
- ניהול מבואות ותוכן תפילה לספרים/פרקים.
- הגדרות עיצוב ופעולות נוספות  -  לפי רשימת המקטעים המלאה בקובץ, שלא סופקה בשלמותה.

---

# 3. מפת ניווט לצורכי DEBUG

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת קורא התנ״ך | Header או Home | `Bible Reader` | `/BibleReader` |
| פתיחת ספר בתנ״ך | `/BibleReader` | בחירת ספר ב־`BookGrid` | בחירת הספר באותו עמוד |
| פתיחת פרק בספר | עמוד ספר בקורא | מספר פרק ב־`ChapterGrid` | `/Chapter?book=N&chapter=N` |
| פתיחת פרק בשפה לוגנדית | עמוד ספר/בחירת פרק | פרק כאשר `lang=lu` | `/Chapter?book=N&chapter=N&lang=lu` |
| מעבר לפסוק מסוים | קישור הפניה או תוכן | קישור reference | `/Chapter?book=N&chapter=N&verse=N` או popup מקומי |
| פתיחת devotional | Header או Home | `Daily Devotionals` | `/Devotionals` |
| קריאת devotional מלאה | `/Devotionals` | פתיחת כרטיס | תצוגת devotional מלאה באותו עמוד |
| מעבר בין devotional קודם/הבא | devotional פתוח | `Previous Day` / `Next Day` | פריט אחר באותו מסך |
| שיתוף devotional/פסוק | כרטיס/עמוד תוכן | `Share` | מודאל `ShareSheet` |
| פתיחת ספריית תפילות | Header או Home | `Prayer Library` | `/PrayerLibrary` |
| כניסה ל־Q&A | Header או Home | `Q&A` | `/QA` |
| פתיחת שאלה | `/QA` | לחיצה על כרטיס שאלה | תשובה נפתחת באותו עמוד |
| בחירת אות ב־Q&A | `/QA` | `QaLetterBar` | סינון תוצאות בעמוד |
| כניסה לתובנות תאולוגיות | תפריט משני/Footer | `Theological insights` | `/TheologicalInsights` |
| כניסה לתובנות היסטוריות | תפריט משני/Footer | `Historical insights` | `/HistoricalInsights` |
| פתיחת פסוק היום | תפריט/קישור | `Verse of the day` | `/VerseOfDay` |
| פתיחת תוכנית הקריאה | תפריט/קישור | `Reading plan` | `/Plan` |
| פתיחת פריט תוכנית | `/Plan` | שורת יום | `/Chapter?book=N&chapter=N` |
| פתיחת היומן | תפריט/קישור | `Prayer journal` | `/Journal` |
| יצירת רשומה חדשה ביומן | `/Journal` | `Add`/`New entry` | טופס בעמוד |
| פתיחת יומן חדש מתוך פרק | `/Chapter` | קישור יצירת הערה/תפילה | `/Journal?new=1&book=...&chapter=...` לפי הקישור |
| הצגת ההערות שלי | תפריט/קישור | `My notes` | `/BibleNotes` |
| כניסה למרכז Offline | תפריט/קישור | `Offline centre` | `/Offline` |
| פתיחת שירי פסוקים | Header או Footer | `Verse-Songs` | `/VerseSongs` |
| פתיחת סדרה | אינדקס שירים | כרטיס `SeriesCard` | `/VerseSongSeries?series=ID` |
| הפעלת שיר | כרטיס שיר | `Play` או לחיצה על כרטיס | עדכון `PlayerContext`; הנגן הגלובלי מופיע |
| פתיחת נגן מורחב/מזער | נגן גלובלי | כפתורי הרחבה/מזעור | נשאר באותו עמוד |
| כניסה למרכז הקהילה | Header | `Community` | `/Community` |
| פתיחת עדויות | `/Community` | `Revelations` | `/CommunityRevelations` |
| פרסום עדות | `/CommunityRevelations` | טופס `Share what God showed you` | יצירת `Revelation` |
| הצגת תגובות לעדות | כרטיס עדות | כפתור comments | תצוגת `CommentThread` בעמוד |
| פתיחת קבוצות דיון | `/Community` | `Discussion groups` | `/DiscussionGroups` |
| פתיחת קבוצה מסוימת | `/DiscussionGroups` | בחירת קבוצה | אותו עמוד עם קבוצה נבחרת |
| יצירת קשר | Footer/קישור | `Contact` | `/Contact` |
| התחברות משתמש | Header או טופס אורח | `Sign in` | `/Login` |
| הרשמה | `/Login` | `Sign up` | `/Signup` |
| בקשת איפוס סיסמה | `/Login` | `Forgot password` | `/ForgotPassword` |
| קביעת סיסמה חדשה | קישור דוא״ל | קישור עם token | `/ResetPassword?token=...` |
| יציאה | תפריט משתמש | `Log out` | `/Logout`, ואז Home |
| התקנת האפליקציה | תפריט/קישור | `Install` | `/InstallPrompt` |
| כניסת מנהל | `/Admin` | טופס התחברות | `/AdminDashboard` במקרה הצלחה |
| איפוס סיסמת מנהל | `/Admin` | פעולת reset | מודאל/טופס באותו עמוד |
| פתיחת פאנל תוכן | `/AdminDashboard` | בחירת סעיף בסרגל/טאבים | פאנל מתאים באותו עמוד |
| הוספה/עריכה של רשומה | פאנל ניהול | `Add` / `Edit` | `RecordEditor` או מודאל ייעודי |
| מחיקת רשומה | פאנל ניהול | `Delete` | `ConfirmDialog`, ואז מחיקה |
| ייבוא תוכן | Admin Dashboard | `Bulk upload` / `Import` | רכיב ייבוא מתאים |
| התקנת Luganda Bible | אזור Luganda | כפתור התקנה/המשך | הפעלת `lugandaInstall` |
| התקנת KJV+ | אזור KJV+ | כפתור התקנה/המשך | הפעלת `kjvInstall` |
| הפעלת ביקורת ספרייה | אזור KJV+ / דוח | `Run audit` | `scriptureAudit` ומציג דוח |

> בקורא התנ״ך, חלק מהפתיחות מתבצעות בלי ניווט: `VersePopup`, חלוניות הפניה צולבת ו־`ShareSheet` הן אינטראקציות בתוך העמוד.

---

# 4. מבנה קבצים

## 4.1 רכיבי ניהול  -  `components/admin`

| קובץ | תפקיד ומה הוא מציג |
|---|---|
| `ChapterCoverage.jsx` | תצוגת כיסוי פרקים בהתקנת תנ״ך: שלמים, חסרים או פגומים. `compressChapters` דוחסת מספרי פרקים לטווחים, למשל `2-5, 9`. |
| `CollectionsPanel.jsx` | פאנל CRUD כללי לאוספי תוכן. בונה רשימות וטפסים לפי מטא־דאטה מ־`adminCollections`. |
| `ConfirmDialog.jsx` | דיאלוג אישור לפני פעולה הרסנית, בעיקר מחיקה. |
| `CrossRefEditor.jsx` | עריכת רשימת הפניות מקראיות כ־chips, עם הוספה והסרה. משתמש ב־`splitRefs` ו־`joinRefs`. |
| `DevotionalBulkImport.jsx` | ייבוא devotionals מקובץ JSON, כולל בדיקת שדות ויצירת/עדכון רשומות. |
| `DevotionalForm.jsx` | טופס הוספה ועריכה של devotional דו־לשוני. מטפל בשדות חובה, תאריך, הפניה מקראית ושדות תצוגה. |
| `DevotionalPlansPanel.jsx` | ניהול תוכניות devotional: שם, תיאור, מספר ימים, שמירה ומחיקה; מציג פריטי סדרה לפי תוכן. |
| `DevotionalsPanel.jsx` | מעטפת ניהול ספריית devotional: טעינת תכנים, טאבים ל־devotionals, נושאים, תוכניות וייבוא. |
| `DevotionalTopicsPanel.jsx` | ניהול נושאי devotional. מונע מחיקת נושא שנמצא בשימוש לפני העברת התכנים. |
| `JsonImportPanel.jsx` | ייבוא JSON למספר collections, עם תבנית, נרמול ובדיקות לפני כתיבה. |
| `KjvPlusInstaller.jsx` | ממשק התקנת KJV+ ו־Strong’s, כולל מצב התקנה, חידוש סשן, כיסוי פרקים ודוח ספרייה. |
| `LibraryReport.jsx` | דוח קריאה בלבד של מצב הספרייה: כיסוי תרגומים, אי־התאמות ומצב Strong’s. |
| `LugandaInstaller.jsx` | ממשק התקנת הטקסט בלוגנדה, כולל עדכון מצב והודעות שגיאה/הצלחה. |
| `PassagesPanel.jsx` | ניהול חומר מקראי מיובא: תפילות פסוקים, הפניות צולבות, מבואות פרקים ומבוא/תפילה לספר. |
| `PrayerCrossRefImport.jsx` | מסך ייבוא ייעודי לתפילות והפניות צולבות; כולל תצוגת תכנים שכבר הותקנו לפי ספר/פרק. |
| `PrayersPanel.jsx` | ניהול ספריית תפילות, או מצב תפילות הקשורות לקטעי תנ״ך, כולל חיפוש וטפסים. |
| `QaAdminList.jsx` | רשימת שאלות ניהולית עם חיפוש, נושא, אות, בחירה קבוצתית ופעולות bulk. |
| `QaBulkImport.jsx` | ייבוא שאלות ותשובות. בודק תוכן דו־לשוני, יכול ליצור נושאים חסרים ומדווח על תוצאות. |
| `QaItemForm.jsx` | טופס שאלה ותשובה דו־לשונית; השאלה, התשובה והנושא עוברים ולידציה. |
| `QaPanel.jsx` | מעטפת ניהול Q&A: טעינת נושאים ופריטים, CRUD וטאבים. |
| `QaQuestionsPanel.jsx` | ניהול השאלות עצמן, כולל טופס ומחיקה מאושרת. |
| `QaTopicForm.jsx` | טופס נושא Q&A עם שם חובה באנגלית ובלוגנדה. |
| `QaTopicsPanel.jsx` | ניהול נושאים; אם נושא בשימוש, מציע להעביר את השאלות לנושא אחר לפני מחיקה. |
| `RecordEditor.jsx` | טופס גנרי לרשומת collection. סוג שדה קובע אם יוצג טקסט, מספר, boolean, textarea או עורך הפניות. |
| `VerseSongBulkImport.jsx` | ייבוא קבוצת שירי פסוקים וסדרה; כולל בדיקות פורמט וקישורי שמע. |
| `VerseSongForm.jsx` | טופס עריכת שיר; כולל URL שמע, משך, קאבר ופרטי סדרה. |
| `VerseSongSeriesForm.jsx` | טופס יצירה/עריכה של סדרת שירי פסוקים. |
| `VerseSongsPanel.jsx` | מעטפת ניהול סדרות ושירים, חיפוש, בחירת סדרה, יצירה, עריכה, מחיקה וייבוא. |

## 4.2 רכיבים משותפים  -  `components/common`

| קובץ | תפקיד |
|---|---|
| `BrandIcons.jsx` | אייקוני מותג לשירותי שיתוף, כגון WhatsApp, Facebook, X ו־Telegram. |
| `EmptyState.jsx` | תצוגת מצב ריק אחידה עם אייקון, כותרת, הסבר ופעולה אפשרית. |
| `Modal.jsx` | מודאל משותף: סגירה ב־Escape/לחיצה מחוץ לחלון, נעילת גלילת `body`, כותרת וכפתורי footer. |
| `PageHeader.jsx` | כותרת עמוד סטנדרטית, עם או בלי תמונת hero. |
| `Pagination.jsx` | רכיב עימוד לרשימות ארוכות. |
| `ShareRow.jsx` | שורת פעולות שיתוף בסיסית; משתמש ב־`openShare` וב־`shareChannels`. |
| `Spinner.jsx` | מצב טעינה נגיש עם label ו־`role="status"`. |

## 4.3 רכיבי קהילה  -  `components/community`

| קובץ | תפקיד |
|---|---|
| `CommentThread.jsx` | הצגת תגובות לעדות והגשת תגובה למשתמש מחובר. |
| `RevelationCard.jsx` | כרטיס עדות עם פרטי מחבר, קטע, לייקים ופתיחת תגובות. |
| `RevelationForm.jsx` | טופס פרסום עדות; אורח מקבל קישור התחברות. |
| `ThreadMessages.jsx` | הצגת הודעות בקבוצת דיון וטופס הודעה למשתמש מחובר. |

## 4.4 רכיבי Dashboard, devotional ו־Home

| קובץ | תפקיד |
|---|---|
| `components/dashboard/ActivityFeed.jsx` | מציג פעילות קריאה אחרונה של המשתמש באמצעות `ReadingActivity` ו־React Query. |
| `components/devotional/DevotionalCard.jsx` | כרטיס devotional ברשימה: תאריך, כותרת, פסוק, נושא ותקציר. |
| `components/devotional/DevotionalFeatured.jsx` | כרטיס devotional מובלט/יומי. |
| `components/devotional/DevotionalFilters.jsx` | מסנני שפה, חיפוש, נושא, טווח תאריכים וסדרה. |
| `components/devotional/DevotionalFullView.jsx` | תצוגה מלאה של devotional, עם תוכן, תפילה ופעולות. |
| `components/home/StatCard.jsx` | כרטיס נתון סטטיסטי עם ערך, תיאור ואייקון. |

## 4.5 רכיבי יומן ו־Layout

| קובץ | תפקיד |
|---|---|
| `components/journal/JournalCard.jsx` | כרטיס רשומת יומן עם עריכה ומחיקה. |
| `components/journal/JournalForm.jsx` | טופס יצירה/עריכה של רשומת יומן, קטגוריה והקשר של ספר/פרק. |
| `components/layout/AppFooter.jsx` | Footer וקישורים מהירים לעמודים. |
| `components/layout/AppHeader.jsx` | Header, ניווט, תפריט ראשי/משני ופעולות משתמש. |
| `components/layout/GlobalPlayer.jsx` | נגן שירי פסוקים קבוע בתחתית האפליקציה. |
| `components/layout/PwaHead.jsx` | הוספת meta tags וקישורי PWA ורישום Service Worker. |
| `Layout.jsx` | עוטף את האפליקציה ב־`AuthProvider`, `ThemeProvider`, `PlayerProvider`, Header, Footer ונגן. ה־Footer מוצג רק בחלק מהעמודים לפי `currentPageName`. |

## 4.6 רכיבי לימוד וקריאה

| קובץ | תפקיד |
|---|---|
| `components/insight/InsightsBoard.jsx` | לוח תובנות לפי סוג, עם נתוני שרת ותוכן seed, חיפוש ושמירה מקומית. |
| `components/plan/PlanRow.jsx` | שורת יום בתוכנית הקריאה, עם מצב, קישור לפרק וסימון השלמה. |
| `components/qa/QaCard.jsx` | כרטיס שאלה ותשובה, פתיחה/סגירה, הפניות מקראיות ופעולות תגובה. |
| `components/qa/QaFilters.jsx` | מסנני שפה, חיפוש ונושא לעמוד Q&A. |
| `components/qa/QaLetterBar.jsx` | סרגל בחירת אותיות A - Z עם גלילה אופקית ומספר תוצאות. |
| `components/read/AnnotatedText.jsx` | הצגת טקסט עם highlight/underline לפי offsets, וסרגל סימון בחירת טקסט. |
| `components/read/BookGrid.jsx` | רשימת ספרי התנ״ך, חיפוש לפי שם/קיצור ושינוי בין הבריתות. |
| `components/read/BookIntro.jsx` | מבוא לספר, כולל תוכן מיובא או fallback, סימונים והפניות. |
| `components/read/BookOutline.jsx` | מתווה הספר עם קפיצה לטווח פסוקים והדגשת סעיף נבחר. |
| `components/read/BookPrayerPanel.jsx` | תפילת הספר, כולל העדפה לתפילה מיובאת וסימונים. |
| `components/read/BookSidebar.jsx` | מעטפת צד לספר: מבוא, מתווה ותפילת הספר. |
| `components/read/BookStudyResources.jsx` | משאבי לימוד מתחת לרשת הפרקים: commentary ותובנות לפי ספר. |
| `components/read/ChapterClosingPrayer.jsx` | תפילת סיום לפרק, לאחר הפסוקים, עם שיתוף וסימונים. |
| `components/read/ChapterGrid.jsx` | רשת פרקי הספר; קישור לכל פרק. |
| `components/read/ChapterReaderPane.jsx` | מעטפת אזור הקריאה בפרק, טאבים/תפריט ללימוד ומבנה מותאם למסכים. |
| `components/read/ChapterResourcesPanel.jsx` | תובנות תאולוגיות והיסטוריות לפרק או fallback לתוכן ספר. |
| `components/read/ChapterSelector.jsx` | מסך ספר: sidebar, רשת פרקים, משאבי לימוד ו־VersePopup. |
| `components/read/ChapterSidebar.jsx` | פאנל לימוד לפרק: מבוא, commentary, prayer והפניות צולבות. |
| `components/read/CrossRefList.jsx` | רשימת הפניות צולבות עם אפשרות ניווט לפרק/פסוק. |
| `components/read/CrossRefScripture.jsx` | מציג את טקסט הפסוק אליו מפנה cross-reference, עם fetch בעת הצורך. |
| `components/read/FloatingVerse.jsx` | חלונית פסוק צפה עם קישור לפתיחה מלאה בקורא. |
| `components/read/PassagePrayer.jsx` | תפילה שמותאמת לפסוק/פרק הנוכחי. |
| `components/read/PassageTabs.jsx` | טאבים של commentary, תובנות ו־Q&A עבור הקטע הנוכחי. |
| `components/read/ShareSheet.jsx` | מודאל שיתוף מורחב לפסוק, פרק או devotional. |
| `components/read/StrongsPopup.jsx` | חלונית הגדרת Strong’s; קוראת cache מקומי/שרת ומבקשת מקור חיצוני לפי הצורך. |
| `components/read/StrongsText.jsx` | מפרק סימוני Strong’s מתוך הטקסט ומציג אותם כקישורים לחיצים. |
| `components/read/VerseActionBar.jsx` | פעולות פסוק: סימון, bookmark, הערה, cross-reference, תפילה, commentary, שיתוף והעתקה. |
| `components/read/VerseCrossRefs.jsx` | הצגת הפניות צולבות מתחת לפסוק. |
| `components/read/VerseList.jsx` | רשימת פסוקים פשוטה עם בחירה וסימון. |
| `components/read/VersePopup.jsx` | חלונית קריאת קטע מקראי מבלי לצאת מהעמוד הנוכחי. |
| `components/read/VersionPicker.jsx` | בחירת גרסה, התקנה והסרת גרסאות במכשיר. |

## 4.7 רכיבי שירים  -  `components/song`

| קובץ | תפקיד |
|---|---|
| `components/song/SeriesCard.jsx` | כרטיס סדרת שירים וקישור לתוכן הסדרה. |
| `components/song/SongCard.jsx` | כרטיס שיר עם Play, הורדה/רכישה ושיתוף. |
| `components/song/SongFilters.jsx` | חיפוש וסינון לפי סדרה וספר מקראי. |
| `components/song/SongShareSheet.jsx` | מודאל שיתוף לשיר, כולל טקסט וקישור. |

## 4.8 עמודים  -  `pages`

| קובץ | תפקיד |
|---|---|
| `pages/About.jsx` | עמוד מידע על הפרויקט. |
| `pages/AdminDashboard.jsx` | סביבת CMS למנהל. |
| `pages/Admin.jsx` | התחברות ואיפוס סיסמת מנהל. |
| `pages/BibleNotes.jsx` | ריכוז סימונים והערות של משתמש. |
| `pages/BibleReader.jsx` | בחירת ספר, חיפוש ותצוגת הספרים. |
| `pages/Chapter.jsx` | קורא פרקים מלא; מחבר בין הטקסט, שירותי data, סימונים, תפילות ושיתוף. |
| `pages/Community.jsx` | Hub של תכני קהילה. |
| `pages/CommunityLiveTeaching.jsx` | רשימת מפגשי הוראה חיים. |
| `pages/CommunityRevelations.jsx` | עדויות, לייקים ותגובות. |
| `pages/Contact.jsx` | טופס יצירת קשר. |
| `pages/Dashboard.jsx` | תצוגת פעילות והתקדמות אישית. |
| `pages/Devotionals.jsx` | ספריית devotional. |
| `pages/DiscussionGroups.jsx` | קבוצות דיון והודעות. |
| `pages/ForgotPassword.jsx` | בקשת איפוס סיסמת משתמש. |
| `pages/HistoricalInsights.jsx` | תובנות היסטוריות דרך `InsightsBoard`. |
| `pages/Home.jsx` | דף הבית והתוכן המומלץ/היומי. |
| `pages/InstallPrompt.jsx` | הנחיות והצעת התקנת PWA. |
| `pages/Journal.jsx` | יומן תפילה אישי. |
| `pages/Login.jsx` | התחברות משתמש רגיל. |
| `pages/Logout.jsx` | יציאה והפניה לבית. |
| `pages/Offline.jsx` | מרכז ניהול הורדות ותוכן לא־מקוון. |
| `pages/Plan.jsx` | תוכנית קריאה והתקדמות. |
| `pages/PrayerLibrary.jsx` | ספריית תפילות. |
| `pages/Privacy.jsx` | מדיניות פרטיות סטטית. |
| `pages/QA.jsx` | ספריית שאלות ותשובות. |
| `pages/ResetPassword.jsx` | איפוס סיסמת משתמש באמצעות token. |
| `pages/Signup.jsx` | הרשמת משתמש. |
| `pages/Terms.jsx` | תנאי שימוש. |
| `pages/TheologicalInsights.jsx` | תובנות תאולוגיות דרך `InsightsBoard`. |
| `pages/VerseOfDay.jsx` | פסוק היום. |
| `pages/VerseSongSeries.jsx` | סדרות/תוכן שירי פסוקים לפי פרמטר URL. |
| `pages/VerseSongs.jsx` | אינדקס שירי פסוקים וניגון. |

## 4.9 תהליכי שרת ו־Cron

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | API לאימות מנהל, ניהול סיסמה וסשן חתום. |
| `functions/adminContent.js` | API לפעולות CRUD וניהול תוכן עבור CMS, לאחר אימות טוקן מנהל. |
| `functions/bibleChapter.js` | שירות שרת להבאת פרקי תנ״ך ממקורות חיצוניים וניקוי הטקסט. |
| `functions/content.js` | API לתוכן ציבורי ולשליחת תכנים ציבוריים כגון הודעת Contact או תוכן שהוגש. |
| `functions/kjvInstall.js` | התקנת פרקי KJV+ והטקסט עם Strong’s ל־Entities. |
| `functions/lugandaInstall.js` | התקנת פרקי התנ״ך בלוגנדה. |
| `functions/scriptureAudit.js` | דוח קריאה בלבד על מצב התקנת פרקי התנ״ך וה־Strong’s. |
| `functions/strongsDefinition.js` | טעינת/שמירת הגדרות מילון Strong’s ושימוש במקורות חיצוניים. |
| `cron/scriptureInstall.js` | משימת Cron מחזורית שמנסה להשלים פרקים חסרים, באופן שנועד להיות בטוח להפעלה חוזרת. |

## 4.10 ספריות עזר  -  `lib`

| קובץ | תפקיד |
|---|---|
| `lib/activity.js` | כתיבת אירועי פעילות משתמש, כגון פתיחת פרק, highlight או bookmark. |
| `lib/adminCollections.js` | הגדרת collections ושדות ה־CMS, לרבות כותרות, טפסים ומפתחות רשומה. |
| `lib/adminDirect.js` | נתיב חלופי להרצת פעולות CMS ישירות מהדפדפן דרך SDK, כש־function gateway אינו זמין. |
| `lib/adminSession.js` | ניהול סשן מנהל, טוקנים, אימות, חידוש והפניה בין נתיב שרת לנתיב ישיר. |
| `lib/app-params.js` | קריאת מזהה אפליקציה וטוקן `fse2` באופן דינמי מ־`localStorage`. |
| `lib/AuthContext.jsx` | Context לאימות משתמש רגיל, מצב התחברות ופעולות logout/login. |
| `lib/bibleApi.js` | שכבת גישה לפרק מקראי: גרסה, רשת, cache ואחסון Offline. |
| `lib/bibleBooks.js` | נתונים סטטיים ל־66 ספרים, מספרי פרקים, שמות וקיצורים באנגלית ובלוגנדה. |
| `lib/bilingual.js` | חילוץ טקסט באנגלית ובלוגנדה ממבנים ושמות שדות שונים. |
| `lib/bookGuides.js` | מבואות ומתווים סטטיים לספרי התנ״ך. |
| `lib/bookImport.js` | נרמול ופירוק קובצי תוכן לספר, תפילות והפניות צולבות. |
| `lib/bookIntro.js` | קריאה ונרמול של `BookIntro`, כולל מפתח טבעי ו־fallback. |
| `lib/bookPrayers.js` | תפילות ספר סטטיות עם סימוני references פנימיים. |
| `lib/bookStudyContent.js` | תוכן commentary ותובנות fallback לכל ספר. |
| `lib/brandCss.js` | מערכת עיצוב CSS מרכזית ומשתני צבע. |
| `lib/chapterIntros.js` | קריאה, נרמול ו־cache למבואות פרקים. |
| `lib/chapterStudy.js` | הרכבת חומרי לימוד לפרק ממקורות שונים. |
| `lib/contentApi.js` | שכבת גישה לתוכן ציבורי; מקשרת בין אוספי FSE2 לבין עמודים. |
| `lib/crossRefs.js` | הפניות צולבות סטטיות fallback לקטעים נבחרים. |
| `lib/devotionals.js` | עזרי devotional: שדות תואמי־legacy, תאריך, מפתחות, שיתוף, תצוגה וסינון. |
| `lib/format.js` | המרות בטוחות לתצוגה, פיצול רשימות ופורמט נתונים. |
| `lib/keyPassages.js` | פסוקי מפתח סטטיים לכל ספר. |
| `lib/luganda.js` | עיצוב וניקוי טקסט devotional בלוגנדה. |
| `lib/offlineDb.js` | Wrapper ל־IndexedDB, פתיחה, שדרוג stores ופעולות Offline. |
| `lib/planData.js` | תוכנית קריאה סטטית כ־fallback כאשר אין תוכנית בשרת. |
| `lib/player.jsx` | Context וניהול של נגן שמע גלובלי, queue, מצב playback ועוצמה. |
| `lib/prayerImport.js` | ולידציה, נרמול וייבוא JSON של תפילות והפניות צולבות. |
| `lib/prayerPassages.js` | קריאה, נרמול ובחירה של תפילות קטעים והפניות לפי ספר/פרק/פסוק. |
| `lib/qaLibrary.js` | קריאה, סינון ומיון של Q&A, כולל Offline ו־seed. |
| `lib/reading.js` | פונקציות תאריך, פורמט ותמיכה בחישובי קריאה. |
| `lib/readings.js` | חישוב/שמירת התקדמות קריאה וזיהוי יום בתוכנית. |
| `lib/scriptureRefs.js` | פענוח, נרמול ופתיחת references מקראיים. |
| `lib/seedContent.js` | תוכן seed ציבורי ל־fallback כאשר אין רשומות שרת. |
| `lib/sha256.js` | מימוש SHA-256 ב־JavaScript עבור בדיקת סיסמת מנהל בסביבות ללא Web Crypto זמין. |
| `lib/share.js` | בניית טקסטים וקישורים לשיתוף, העתקה ושימוש ב־Web Share API. |
| `lib/strongs.js` | נרמול וקיבוץ Strong’s codes ועיבוד סימונים. |
| `lib/strongsOffline.js` | אחסון וקריאה של מילון Strong’s ב־IndexedDB. |
| `lib/studyAnnotations.js` | טעינה, איחוד, שמירה ומחיקה של annotations, מקומית ובשרת. |
| `lib/textSelection.js` | בדיקה האם המשתמש בחר טקסט בתוך רכיב, כדי למנוע ניווט לא מכוון. |
| `lib/themeContext.jsx` | קריאת הגדרות עיצוב וחשיפת CSS variables לתצוגה. |
| `lib/theme.js` | קבועי מותג, כתובות נכסי מותג ומפתחות `localStorage`. |
| `lib/useDevotionalLibrary.js` | hook לניהול devotional שנשמרו/נקראו, מקומית ובשרת למשתמש מחובר. |
| `lib/verseSongs.js` | נרמול סדרות ושירים, בניית queue, סינון, קישורים והורדת שירים. |
| `lib/versions.js` | registry של גרסאות תנ״ך, התקנה, הסרה ובחירת גרסה פעילה. |

## 4.11 קבצים ציבוריים ו־Assets

| קובץ/נתיב | תפקיד |
|---|---|
| `public/manifest.json` | הגדרות PWA: שם, אייקונים, start URL, display וצבעי theme. |
| `public/sw.js` | Service Worker. לפי התיעוד בקובץ: cache-first לחלק מה־shell והתמונות, network-first למשאבים אחרים. |
| `__generated/tailwind.css` | CSS שנוצר, כולל utilities של Tailwind. אין לערוך ידנית אלא אם תהליך היצירה מחייב זאת. |
| `public/assets/generated_*.png` | נכסים שנוצרו/נאספו אוטומטית. |
| `public/assets/ingested/*` | מדיה שיובאה למערכת. |
| `public/assets/media-library/*` | קובצי מדיה, תבניות JSON, מסמכים, לוגו וקבצים שהועלו לספריית המדיה. |
| `__url_fetch/*` | עותקי תוצאות של משיכת משאבים חיצוניים לצורכי בדיקה/מחקר; אינם מוכיחים כשלעצמם שהאפליקציה עושה בהם שימוש בזמן ריצה. |

## 4.12 חומר ארכיוני  -  `__trash`

הקבצים תחת `__trash` אינם נראים כחלק מהמסלול הפעיל של האפליקציה, אך כוללים רכיבים ועמודים ישנים/זמניים:

- `__trash/components/home/TodayCard.jsx`  -  כרטיס קריאה יומית בגרסה ישנה.
- `__trash/components/home/WeekStrip.jsx`  -  תרשים פעילות שבועי ישן.
- `__trash/components/layout/Sidebar.jsx`  -  Sidebar ישן.
- `__trash/components/layout/SignInBanner.jsx`  -  באנר התחברות ישן.
- `__trash/components/read/BookPicker.jsx`  -  בחירת ספר ישנה.
- `__trash/components/read/ReflectionPanel.jsx`  -  פאנל רפלקציה ישן.
- `__trash/functions/adminProbe.js`, `__trash/functions/_digestCheck.js`, `__trash/functions/_hashcheck.js`, `__trash/functions/_hashTool.js`, `__trash/functions/probeChapter.js`, `__trash/functions/probeInvoke.js`, `__trash/functions/probeSources.js`, `__trash/functions/tmpAuthProbe.js`, `__trash/functions/_tmpDecodeBook.js`, `__trash/functions/_tmpSessionProbe.js`  -  עזרי בדיקה זמניים.
- `__trash/pages/AdminDiag.jsx`, `__trash/pages/AdminPassagesCheck.jsx`, `__trash/pages/AdminSmoke.jsx`, `__trash/pages/ImportCheck.jsx`, `__trash/pages/ImportPreview.jsx`, `__trash/pages/Insights.jsx`, `__trash/pages/InstallerCheck.jsx`, `__trash/pages/Read.jsx`, `__trash/pages/ShareCheck.jsx`, `__trash/pages/StrongsPopupTest.jsx`  -  עמודי בדיקה או גרסאות ישנות.
- קובצי `__url_fetch`  -  תוצאות fetch חיצוניות ותמונות מסך, ולא רכיבי React.

---

# 5. מודל הנתונים  -  Entities

ה־Entities הם סכימות של שכבת FSE2. בפועל, חלק מהתוכן נקרא דרך `fse2.entities`, וחלק דרך Functions כגון `content`, `adminContent`, `lugandaInstall` ו־`scriptureAudit`.

## תוכן מקראי ולימוד

| Entity | תכלית, שדות מרכזיים וקשרים |
|---|---|
| `BibleVerse` | פסוק דו־לשוני. שדות: `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu`. המפתח הלוגי הוא ספר/פרק/פסוק. |
| `KjvPlusChapter` | פרק KJV+ כולל Strong’s. שדות: `book_number`, `book`, `chapter`, `verse_count`, `verses` בפורמט JSON. משויך לספר ופרק. |
| `LugandaChapter` | פרק מלא בלוגנדה. מבנה דומה ל־`KjvPlusChapter`. משמש קורא ומרכז Offline. |
| `BookIntro` | מבוא ותפילת סיום לספר, באנגלית ובלוגנדה. שדות שנראו: `book_number`, `book_name`, `title_en`, `title_lu`, `intro_en`, `intro_lu`, `closing_prayer_en`, `closing_prayer_lu` ועוד לפי הסכימה המלאה. מפתח לוגי: מספר ספר. |
| `ChapterIntro` | מבוא לפרק, באנגלית ובלוגנדה. שדות: `book_number`, `book_name`, `chapter`, `title_en`, `title_lu`, `intro_en`, `intro_lu`, `source`. מפתח לוגי: ספר ופרק. |
| `Commentary` | הערת פירוש לפרק. שדות: `book`, `chapter`, `title`, `body_en`, `body_lu`. נקשרת לוגית לפרק. |
| `CrossReference` | הפניה מפסוק מקור להפניה מקראית אחרת, כולל טקסט/הערה לפי השדות המלאים. השדות שראו כוללים `book_number`, `chapter`, `verse`, `ref_book_number`, `ref_chapter`, `ref_verse` ועוד. |
| `PrayerPassage` | תפילה לפי ספר, פרק ופסוק/טווח; פסוק `0` מתואר כמייצג פרק שלם. השדות המלאים נחתכו, אך ידועים מזהי ספר/פרק/פסוק, כותרות ותוכן EN/LU. |
| `Prayer` | תפילה בספריית התפילות. שדות שנראו: `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref`, `cross_refs`. |
| `StrongEntry` | הגדרת מונח Strong’s שנשמרת לשימוש חוזר. שדות: `code`, `language`, `original_word`, `transliteration`, `pronunciation`, `part_of_speech`, `root_word`, `definition`, `source`. |
| `Insight` | תובנה תאולוגית או היסטורית. שדות: `kind`, `title`, `passage`, `excerpt`, `body`, `share_count`. ערכי `kind` שהקוד מצפה להם: `theological` או `historical`. |
| `ReadingPlan` | פריטי תוכנית קריאה. שדות: `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture`. |
| `VerseOfDay` | פסוק שנבחר לתאריך. שדות: `verse_date`, `reference`, `text_en`, `text_lu`, `note`. |
| `QAEntry` | שאלה שהוגשה על ידי קורא ותשובה פסטורלית. שדות שנראו: `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email`. |
| `QAItem` | פריט Q&A בספרייה, דו־לשוני. שדות שנראו: `topic_en`, `topic_lu`, `topic_id`, `scripture_ref`, `question_en`, `question_lu`, `answer_en`, `answer_lu` ועוד. |
| `QATopic` | נושא Q&A. שדות: `name_en`, `name_lu`, `description_en`, `description_lu`, `active`. |
| `Devotional` | devotional יומי. שדות שנראו בתיעוד הקוד: `code`, `title_en`, `title_lu`, `scripture_ref`, `scripture_lu`, `verse_en`, `verse_lu`, `body_en`, `body_lu`, `prayer_en`, `prayer_lu`, `topic`, `series`, `date`, `cover_url`, `featured`, `active`. |
| `DevotionalTopic` | נושא לספריית devotional. שדות: `name_en`, `name_lu`, `active`. |
| `DevotionalPlan` | תוכנית devotional. שדות: `name_en`, `name_lu`, `description`, `days`, `active`. פריטי התוכנית מתאימים ל־devotionals לפי סדרה/תכונות במימוש. |

## משתמש, התקדמות ופעילות

| Entity | תכלית, שדות מרכזיים וקשרים |
|---|---|
| `Reading` | פרק שהמשתמש השלים, יחד עם רפלקציה/תפילה. שדות: `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses`. שייך למשתמש; מקושר לוגית ליום בתוכנית. |
| `ReadingActivity` | פעילות משתמש, למשל ביקור בפרק, highlight, bookmark או note. שדות: `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse`. משמש ב־Dashboard וב־ActivityFeed. |
| `StudyMark` | סימון של משתמש בפסוק: highlight, bookmark או note. שדות: `owner_email`, `mark_type`, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text`. |
| `StudyAnnotation` | highlight או underline על בלוק טקסט בסביבת לימוד. שדות שנראו: `owner_email`, `book_number`, `book`, `section`, `block_id`, `kind`, `color`, `start_offset` ועוד. זיהוי הטקסט מתבסס על offsets. |
| `JournalEntry` | רשומת יומן תפילה אישית. שדות: `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood`. |
| `DevotionalProgress` | devotional שהמשתמש סימן כהושלם. שדות: `owner_email`, `devotional_code`, `completed_date`. |
| `DevotionalSaved` | devotional שנשמר למשתמש. שדות: `owner_email`, `devotional_code`, `saved_date`. |
| `PrayerSaved` | תפילה שנשמרה למועדפים. שדות: `owner_email`, `prayer_title`. המפתח הלוגי לפי המימוש הוא משתמש וכותרת תפילה. |

## קהילה, הגדרות ומוזיקה

| Entity | תכלית, שדות מרכזיים וקשרים |
|---|---|
| `Revelation` | עדות/תובנה קהילתית ותגובות. שדות: `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id`. `parent_id` מאפשר לקשר תגובה לעדות. |
| `DiscussionGroup` | קבוצה ללימוד משותף. שדות: `name`, `description`, `schedule`, `member_count`. |
| `DiscussionThread` | הודעה בקבוצת דיון. שדות: `group_name`, `owner_email`, `author_name`, `title`, `body`. השיוך לקבוצה הוא לפי שם הקבוצה. |
| `LiveSession` | מפגש הוראה חי. שדות: `title`, `session_date`, `host`, `join_link`, `description`. |
| `VerseSongSeries` | סדרת שירים. שדות: `name`, `display_order`, `description`, `thumbnail`, `cover_image`, `accent`, `featured`, `active`. |
| `VerseSongEpisode` | שיר בסדרה. שדות: `series_name`, `title`, `description`, `duration_seconds`, `audio_url`, `thumbnail`, `cover_url`, `episode_order`, `plays_count`, `active`. השיוך לסדרה נעשה לפי `series_name`. |
| `SiteSettings` | הגדרות אתר כגון צבעים, שם וקישור תרומה. שדות: `setting_key`, `setting_value`. |
| `ContactMessage` | הודעת טופס יצירת קשר. שדות: `name`, `email`, `subject`, `message`, `is_read`, `reply`. |
| `ActivityLog` | תיעוד פעולות מנהל. שדות: `actor`, `action`, `section`, `detail`. |
| `AdminAccount` | פרטי גישה למנהל. שדות: `email`, `password_hash`, `salt`, `secret`, `session_version`, `updated_date`. נתונים אלה רגישים במיוחד. |

### עקרונות קשרים במודל

- **בעלות משתמש:** רשומות אישיות נושאות בדרך כלל `owner_email`.
- **מיקום בתנ״ך:** התוכן המקראי משויך באמצעות `book_number`, `chapter` ולעיתים `verse`.
- **זהות יציבה:** חלק מהייבואים משתמשים ב־natural keys, למשל ספר/פרק/פסוק, devotional code, או שם סדרה.
- **קשרים שאינם FK:** `PrayerSaved.prayer_title`, `DiscussionThread.group_name` ו־`VerseSongEpisode.series_name` הם דוגמאות לשיוך באמצעות ערך טקסט; שינוי שם עלול לפגוע בהתאמה.
- **תגובות:** `Revelation.parent_id` משמש לקשר תגובה לפוסט אב.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 קריאת פרק בתנ״ך

1. המשתמש פותח `/BibleReader`.
2. `BibleReader` מציג את הספרים מתוך `bibleBooks.js`; אין צורך ב־fetch כדי לבנות את רשימת הספרים.
3. המשתמש בוחר ספר ב־`BookGrid`.
4. `ChapterSelector` מציג sidebar עם מבוא, מתווה ותפילת הספר, וכן `ChapterGrid`.
5. בחירת פרק מנווטת ל־`/Chapter?book=...&chapter=...`.
6. `pages/Chapter.jsx` קורא ל־`fetchChapter` מתוך `lib/bibleApi.js`.
7. שכבת הקריאה מנסה להביא פרק לפי גרסה ושפה, ובמקביל יכולה להסתמך על IndexedDB או על עותקים מותקנים בשרת.
8. העמוד מציג פסוקים, משאבי לימוד, תפילות והפניות צולבות.
9. משתמש מחובר יכול לשמור התקדמות ופעילות; משתמש אורח עדיין יכול לקרוא, בהתאם לזמינות התוכן וה־cache.

**נקודות debug:** `pages/Chapter.jsx`, `lib/bibleApi.js`, `lib/versions.js`, `lib/offlineDb.js`, `functions/bibleChapter.js`.

## 6.2 סימון טקסט ב־reader

1. המשתמש מסמן טקסט בתוך רכיב `AnnotatedText`.
2. הרכיב מציג סרגל פעולות לבחירת צבע או underline.
3. ההערה נשמרת בעזרת `studyAnnotations.js`.
4. למשתמש מחובר היא נכתבת גם ל־`StudyAnnotation`; בנוסף נשמר עותק מקומי כדי לאפשר עבודה לא־מקוונת.
5. בעת טעינה חוזרת, הנתונים המקומיים והשרתיים מאוחדים לפי מפתח annotation.

**שיקול חשוב:** offsets תלויים במחרוזת הטקסט ובמבנה הבלוק. שינוי תוכן או עיבוד טקסט עלול להזיז את מיקום הסימון.

## 6.3 הפניות מקראיות מתוך תוכן

1. תוכן עשוי להכיל reference רגיל, או marker בפורמט כמו `[[Genesis 12:3]]`.
2. `scriptureRefs.js` מפענח את שם הספר והטווח.
3. בחלק מהאזורים נפתח `VersePopup` בתוך העמוד.
4. באזורים אחרים נוצרת כתובת `/Chapter?book=...&chapter=...&verse=...`.
5. רכיבי `CrossRefScripture`, `CrossRefList` ו־`VerseCrossRefs` מציגים טקסט או הערה עבור ההפניה.

## 6.4 ייבוא תפילות והפניות צולבות

1. המנהל פותח את אזור הייבוא בממשק Admin.
2. `PrayerCrossRefImport` או `JsonImportPanel` מקבלים קובץ.
3. `prayerImport.js` ו־`bookImport.js` מזהים פורמט, מנרמלים שמות שדות וממירים references.
4. הקובץ עובר ולידציה לפני כתיבה.
5. שורות מותאמות לרשומות קיימות בעזרת natural keys כדי לצמצם כפילויות.
6. התוצאות נכתבות דרך `callAdminData`, או במסלול הישיר דרך `adminDirect`.
7. עמוד הקורא קורא את הנתונים דרך `prayerPassages.js`, `chapterIntros.js` ו־`bookIntro.js`.

**בדיקות חשובות:** מספר ספר תקין, פרק/פסוק, פורמט טווחים, שמות fields דו־לשוניים, ומניעת כתיבה חלקית כאשר הקובץ אינו תקין.

## 6.5 ניהול devotional וייבוא bulk

1. המנהל נכנס ל־`DevotionalsPanel`.
2. הוא בוחר טאב: רשומות, נושאים, תוכניות או ייבוא.
3. טופס ידני משתמש ב־`DevotionalForm`; ייבוא bulk משתמש ב־`DevotionalBulkImport`.
4. השדות מנורמלים דרך helpers ב־`devotionals.js`.
5. התוכן נקרא בצד הציבורי דרך `contentApi.js`, והעמוד `Devotionals.jsx` משלב אותו עם `DEVOTIONALS` שב־`seedContent.js`.
6. בתצוגה הציבורית ניתן לשמור/לסמן כנקרא. `useDevotionalLibrary` שומר מקומית, ובמשתמש מחובר גם ב־Entities המתאימים.

## 6.6 ניהול Q&A

1. עמוד הציבור `QA` טוען ספרייה דרך `qaLibrary.js`, עם אפשרות ל־seed/Offline.
2. מסננים לפי שפה, נושא, אות וחיפוש.
3. אות השאלה מחושבת מתוך הטקסט ולא נשמרת כנתון קבוע.
4. בממשק Admin, `QaPanel` טוען `QATopic` ו־`QAItem`.
5. טופס השאלה דורש שאלה ותשובה באנגלית ובלוגנדה.
6. מחיקת נושא בשימוש אינה מתבצעת ישירות: מנהל צריך להעביר את השאלות לנושא אחר.
7. `QaBulkImport` מבצע בדיקות ומאפשר עדכון רשומות קיימות במקום יצירת כפילויות.

## 6.7 פעילות קריאה והתקדמות

1. עמוד `Chapter` יכול לרשום ביקור בפרק דרך `logReadingActivity`.
2. השלמת פרק נשמרת דרך `recordReading` ב־`readings.js`.
3. אם הפרק נמצא בתוכנית הקריאה, `findPlanDay` מתאים אותו ליום הרלוונטי.
4. `Plan` ו־`Dashboard` קוראים את ההתקדמות ומציגים ימים שהושלמו, רצף ונתוני פעילות.
5. נתונים אישיים מתוכננים להיקשר לחשבון דרך `owner_email`.

## 6.8 קהילה

1. העמודים הציבוריים טוענים קבוצות, מפגשים ועדויות דרך `fetchPublicCollection`.
2. אם אין רשומות שרת, חלק מהעמודים משתמשים ב־seed content.
3. פרסום עדות/תגובה/הודעה מתבצע דרך פונקציות `contentApi.js`.
4. טפסי יצירה מוסתרים או מוחלפים בהפניה להתחברות כאשר המשתמש אינו מחובר.
5. `Revelation` משתמש ב־`parent_id` כדי לייצג תגובות בתור רשומות מאותו Entity.

## 6.9 נגן שירי פסוקים

1. `VerseSongs` או `VerseSongSeries` טוענים סדרות ושירים דרך `contentApi.js`.
2. לחיצה על שיר בונה או מפעילה queue באמצעות `lib/verseSongs.js`.
3. `PlayerProvider` יוצר רכיב `Audio` יחיד ברמת Layout.
4. `GlobalPlayer` מציג את הנגן בכל עמוד, כך שהמעבר בין עמודים אינו מפסיק את השיר.
5. השמעה, דילוג, Repeat, Shuffle, seek, מהירות ועוצמה מנוהלים ב־`lib/player.jsx`.
6. מנגנון רכישה/הורדה משתמש בערכים ב־`localStorage` לפי קובצי העמודים; יש לבדוק את זרימת התשלום מול שירות הסליקה בפועל.

## 6.10 התקנת התנ״ך וביקורת הספרייה

1. המנהל פותח את פאנל Luganda או KJV+.
2. רכיבי `LugandaInstaller` ו־`KjvPlusInstaller` קוראים ל־Functions ייעודיות.
3. לפני קריאות ממושכות, הקוד מנסה לרענן סשן מנהל.
4. השרת בודק גישה ומתקין/מעדכן פרקים.
5. `ChapterCoverage` מציג פרקים חסרים או פגומים.
6. `LibraryReport` קורא ל־`scriptureAudit` ומציג תוצאות ללא כתיבה.
7. `cron/scriptureInstall.js` מפעיל התקנה מחזורית ברקע לפי התזמון שהוגדר בקובץ.

## 6.11 עבודה לא־מקוונת ו־PWA

1. `PwaHead` מוסיף manifest, אייקונים ומטא־דאטה.
2. `public/sw.js` מתקין cache לאזורים מרכזיים ומנהל cache runtime.
3. `offlineDb.js` יוצר/משדרג IndexedDB ומחזיק stores לתוכן וסימונים.
4. עמוד `Offline` מרכז הורדה, ספירת נתונים וניקוי.
5. `bibleApi.js`, `qaLibrary.js`, `prayerPassages.js` ושירותי תוכן אחרים יכולים להשתמש בעותקים מקומיים לפי היישום.

---

# 7. הערות טכניות לפיתוח

## 7.1 ספריות ותשתיות שניתן לזהות

- **React**  -  רכיבי UI ו־Hooks.
- **React Router**  -  `Link`, `useNavigate`, `useSearchParams`.
- **TanStack React Query**  -  טעינת נתונים, cache, mutations ו־query invalidation.
- **FSE2 SDK**  -  גישה ל־Auth, Entities ו־Functions.
- **Lucide React**  -  אייקונים.
- **date-fns**  -  תאריכים ופורמטים.
- **IndexedDB**  -  אחסון Offline דרך `lib/offlineDb.js`.
- **Web Audio / `Audio`**  -  נגן מוזיקה גלובלי.
- **Service Worker ו־Web App Manifest**  -  יכולות PWA.
- **Tailwind utilities ו־CSS מותאם**  -  מחלקות utility יחד עם מערכת `pr-*`.
  
הקוד אינו כולל את הגרסאות או קובצי ה־dependency, ולכן לא ניתן לקבוע מהמקור בלבד את גרסאות הספריות.

## 7.2 דפוסים חוזרים

### שכבות אחריות

- **`pages/`**  -  הרכבת המסך, מצב מקומי וחיבור שירותים.
- **`components/`**  -  רכיבי UI ממוקדים.
- **`lib/`**  -  כללי עסק, נרמול, קריאת נתונים, cache ועזרי ניווט.
- **`functions/`**  -  פעולות שרת, אינטגרציות עם מקורות חיצוניים וכתיבה עם הרשאות.
- **`entities/`**  -  סכימות ומדיניות גישה.
- **`public/`**  -  נכסים סטטיים, PWA ו־Service Worker.

### Fallback ל־seed

עמודים רבים משלבים נתוני שרת עם תוכן מתוך `seedContent.js`, `planData.js`, `bookGuides.js` או קובצי תוכן סטטיים אחרים. כאשר משנים fallback, צריך לבדוק אם הוא:

1. מוצג רק כאשר אין נתוני שרת; או
2. ממוזג לתוך הנתונים החיים ומונע כפילות לפי כותרת/מפתח.

### נרמול שדות legacy

`devotionals.js`, `bilingual.js`, `bookImport.js`, `prayerImport.js` ושירותים נוספים תומכים בשמות שדות ישנים או במבנים שונים. אין להסיר alias או fallback בלי לבדוק רשומות קיימות וקובצי ייבוא.

### מפתחות טבעיים

ייבוא חוזר נועד להיות idempotent ככל האפשר. לפני הוספת שדה או שינוי key, בדקו:

- האם קיימת פונקציית `*NaturalKey`.
- האם הייבוא מעדכן רשומה קיימת או יוצר חדשה.
- האם המפתח הוא מספר ספר/פרק/פסוק, code או טקסט כמו title/name.
- האם שינוי שם עלול לנתק קישורים לוגיים.

## 7.3 אבטחה והרשאות

- `AdminAccount`, טוקני מנהל, `secret`, `password_hash` ו־`salt` הם מידע רגיש ואין לחשוף אותו ב־UI או בלוגים.
- בקובץ `functions/adminAuth.js` מופיעים fallback credentials/מפתחות ברירת מחדל לפי הקוד שסופק. **יש להסיר ברירות מחדל אלה בסביבת production, להגדיר secrets בסביבת השרת ולהחליף כל סיסמה/מפתח שנחשפו בקוד.**
- `adminSession.js` תומך גם בנתיב שרת וגם בנתיב ישיר מהדפדפן. שינויים במסלול החלופי חייבים לשמור על בדיקת הרשאות ב־Entity ובשרת; אין להסתמך על הסתרת כפתורים בלבד.
- סכימות `x-fse2-access` מגדירות מי יכול לקרוא, ליצור, לערוך ולמחוק. שינוי הרשאות דורש סקירה נפרדת, במיוחד עבור נתונים אישיים.
- תכנים שמוצגים מהשרת צריכים להמשיך לעבור escaping/תצוגה בטוחה. `safeText` מועיל לרינדור ערכים פשוטים, אך אינו תחליף למדיניות בטיחות כאשר מרנדרים HTML.

## 7.4 טעינה, שגיאות ו־React Query

- שימוש ב־`useQuery` מופיע במקומות רבים; כדאי לבדוק את `queryKey` לפני שינוי cache או invalidation.
- שמות מפתחות כגון `["insights"]`, `["commentary"]`, `["readingPlan"]` משותפים בין רכיבים שונים. שינוי key באופן לא עקבי עלול לגרום לטעינה כפולה או לתוכן מיושן.
- חלק מהעמודים מקבלים נתונים בפורמטים שונים  -  מערך ישיר או אובייקט `{ rows }`. עזרי `rowsOf` קיימים בכמה פאנלים מנהליים.
- יש לשמר הודעות `loading`, `error`, `empty` ו־success. פעולת ייבוא/מחיקה צריכה להציג מצב ברור ולא להיכשל בשקט.

## 7.5 Offline והגירת IndexedDB

- `offlineDb.js` משתמש ב־`DB_VERSION`. כאשר מוסיפים Store או משנים סכימה, יש לעדכן את גרסת DB ואת תהליך השדרוג.
- אין להניח שכל store קיים בכל מכשיר: המשתמשים עשויים להגיע עם גרסה ישנה של DB.
- אם שינוי משפיע על `chapterKey`, מפתחות annotations או נתוני verses, יש לבדוק תאימות לעותקים שכבר שמורים בדפדפן.
- שדרוג Service Worker צריך לשקול שינוי שם cache (`SHELL_CACHE` / `RUNTIME_CACHE`) וניקוי cache ישן.

## 7.6 שפה ומקורות תוכן

- שפה מסומנת בקוד באופן לא אחיד לפי אזור: `en`/`lu`, `EN`/`LU`/`BOTH`. יש להמיר בצורה מפורשת בגבולות בין רכיבים.
- שמות ספרים באנגלית ובלוגנדה מטופלים דרך `bibleBooks.js` ו־`scriptureRefs.js`; אין לפצל או לנרמל אותם באופן עצמאי במקומות נוספים.
- מקורות תנ״ך חיצוניים הם תלות רשת. יש לבדוק fallback Offline, parsing, HTML entities, סימון Strong’s והבדלי verse numbering.
- אין להניח שמספר פסוקים זהה בין תרגומים; קיים כלי audit שמיועד לזהות אי־התאמות.

## 7.7 עיצוב ונגישות

- צבעים מרכזיים מוגדרים ב־`lib/theme.js` ו־`lib/brandCss.js`; רכיבים רבים משתמשים ב־CSS variables כגון `--pr-border`, `--pr-emerald` ו־`--pr-gold`.
- שינוי צבעי מותג צריך להתבצע בשכבה המרכזית ולא באמצעות תיקון נקודתי בעשרות רכיבים.
- חלק מה־UI משתמש ב־inline styles ובחלקו utility classes. הוספת רכיב חדש צריכה להתאים למערכת `pr-*` הקיימת.
- במודאלים ובכפתורים קיימים שימושים ב־`aria-label`, `aria-modal`, `role="dialog"` ו־`role="status"`. יש לשמור עליהם בעת שינוי התנהגות.
- רכיבים המקבלים callback של ניווט או סגירה צריכים לעצור bubbling כשנדרשת אינטראקציה פנימית, למשל לחצנים בתוך כרטיס שיר.

## 7.8 נקודות שכדאי לבדוק לפני הרחבה

1. **ה־Router בפועל:** לא סופק, ולכן צריך לאשר paths, aliases ו־fallback לכתובות ישירות.
2. **`createPageUrl`:** משפיע על כל ניווט וקישור שיתוף.
3. **`fse2Client`:** לא סופק; יש לבדוק תצורת auth, endpoint ו־error shape.
4. **מדיניות הרשאות Entities:** חלק מהסכימות נחתכו, ויש להסתכל על הגרסה המלאה לפני שינוי גישה.
5. **קשרים לפי שם טקסט:** שינוי שם topic, סדרה או קבוצה עלול להפר קשרים.
6. **ייבוא חוזר:** לבדוק natural keys לפני שינוי פורמט הקובץ או שמות השדות.
7. **PWA:** יש לבדוק reload לאחר שינוי Service Worker, offline ופתיחת deep link ישירות.
8. **ניהול סודות:** להעביר סודות ל־environment/secrets של השרת ולבצע rotation אם נחשפו.
9. **קוד ארכיוני:** אין להעתיק ל־production או לנתיב פעיל קבצים מ־`__trash` בלי לוודא שהם עדיין תואמים לארכיטקטורה הנוכחית.
10. **נכסים גדולים:** קובצי תמונה ומסמכים תחת `public/assets` עשויים להיות כבדים; יש לבחון lazy loading, משקל וזכויות שימוש.

---

## מסלול קצר להתמצאות במערכת

- **להבנת ה־shell וה־providers:** `Layout.jsx`, `lib/AuthContext.jsx`, `lib/themeContext.jsx`, `lib/player.jsx`.
- **להבנת קורא התנ״ך:** `pages/BibleReader.jsx`, `components/read/ChapterSelector.jsx`, `pages/Chapter.jsx`, `lib/bibleApi.js`.
- **להבנת Offline:** `pages/Offline.jsx`, `lib/offlineDb.js`, `lib/versions.js`, `public/sw.js`.
- **להבנת ה־CMS:** `pages/AdminDashboard.jsx`, `lib/adminSession.js`, `lib/adminCollections.js`, `functions/adminContent.js`.
- **להבנת ייבוא חומר מקראי:** `components/admin/PrayerCrossRefImport.jsx`, `lib/prayerImport.js`, `lib/bookImport.js`, `lib/prayerPassages.js`.
- **להבנת devotional:** `pages/Devotionals.jsx`, `lib/devotionals.js`, `lib/useDevotionalLibrary.js`, `components/admin/DevotionalForm.jsx`.
- **להבנת שירים ונגן:** `pages/VerseSongs.jsx`, `lib/verseSongs.js`, `lib/player.jsx`, `components/layout/GlobalPlayer.jsx`.
- **להבנת סכימות והרשאות:** קובצי `entities/*.json` וה־Functions המתאימות.
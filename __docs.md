# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד טכני  -  Pray-Read Bible

## הערה על היקף התיעוד

התיעוד מבוסס על קטעי המקור שסופקו. חלק מהקבצים נקטעו, וקובצי ניתוב מרכזיים כגון `App.jsx`, `main.jsx`, קובצי הגדרות החבילות ו־`utils` לא נכללו. לכן:

- שמות העמודים והיעדים בכתובות מבוססים על `createPageUrl("PageName")` ועל קישורים שנראים בקוד. יש לוודא את כתובת ה־URL המדויקת מול הגדרות ה־router בפועל.
- תיאורי קבצים שנקטעו נשענים על ה־imports, שמות הרכיבים, ה־props וההערות שנותרו בקטעים.
- רכיבי עזר, תמונות וקובצי ייבוא מתוארים לפי תפקידם הנראה במערכת, ולא לפי פרטים שלא הופיעו במקור.

---

# 1. מהות המערכת

**Pray-Read Bible** היא אפליקציית React לקריאה, לימוד ושימוש קהילתי בתוכן נוצרי, עם תמיכה באנגלית ובלוגנדה. היא משלבת ספר תנ״ך, חומרי לימוד ותפילה, תוכן יומי, מוזיקה, פעילות קהילתית וכלי ניהול תוכן.

### למי היא מיועדת

- **קוראים ומשתמשים מזדמנים**  -  קריאת התנ״ך, עיון בתפילות ובתכנים, שיתוף תוכן והתקנה כאפליקציית PWA.
- **משתמשים רשומים**  -  שמירת סימניות, הדגשות, הערות, יומן תפילה והתקדמות בקריאה בין מכשירים.
- **מנהלי תוכן**  -  עריכת ספריות התוכן, ייבוא אצוות, ניהול שאלות ותשובות, תוכניות ותוכן לימודי, והתקנת טקסטים תנ״כיים.

### הערך שהמערכת מספקת

1. **ספר תנ״ך דו־לשוני**  -  66 ספרים, בחירת מהדורה, חיפוש פרקים, כלי סימון ומידע לימודי.
2. **עבודה גם ללא חיבור**  -  פרקים ותוכן נוסף נשמרים ב־IndexedDB; ה־PWA כולל מעטפת ו־service worker.
3. **לימוד המשכי**  -  הקדמות, מתווים, תפילות, הערות, הפניות מקבילות ותוכן תיאולוגי והיסטורי.
4. **תוכן רוחני נוסף**  -  devotionals, ספריית תפילות, Verse of the Day, שאלות ותשובות, תוכנית קריאה ויומן.
5. **האזנה ושיתוף**  -  שירי פסוקים עם נגן גלובלי, ושיתוף דרך ערוצים שונים.
6. **ניהול תוכן מרכזי**  -  ממשק CMS מבוסס אוספים וטפסים דינמיים, לצד יבוא JSON ו־bulk import.

### שני סוגי משתמשים וגבולות חשובים

- **התחברות משתמש רגילה** נעשית דרך `fse2.auth` ומנוהלת ב־`AuthContext`.
- **התחברות מנהל** היא מנגנון נפרד, דרך `adminSession` ו־`adminAuth.js`.
- חלק מהתוכן הציבורי מגיע ממסד הנתונים, וחלקו זמין גם דרך תוכן seed מקומי.
- אין להניח שכל העמודים או הפעולות מוגנים באותה שכבת הרשאות: המדיניות נקבעת לפי ה־entity וה־API שבו משתמשים.

---

# 2. עמודים ותפקידיהם

## 2.1 מוסכמת כתובות וניווט

הקוד משתמש בפונקציה `createPageUrl("PageName")`. הדוגמאות בקוד מראות, למשל, ניווט אל `Chapter`, `Home`, `Dashboard`, `AdminDashboard` ו־`Login`. לכן בטבלה להלן כתובת היעד מוצגת לפי שם העמוד, ולא כנתיב קשיח. יש לאמת את המיפוי המדויק בקובץ הגדרת ה־router.

כתובות רבות כוללות query parameters, למשל:

- `Chapter?book=43&chapter=3&verse=16`
- `BibleReader?book=43&chapter=3`
- `QA?lang=lu&topic=Prayer`
- `VerseSongs?series=...&song=...`

## 2.2 עמודי תוכן ומשתמש

| עמוד | כתובת משוערת | תפקיד, פעולות ואינטראקציות |
|---|---|---|
| `Home` | `/Home` או `/` | דף הבית והכניסה למוצר. מציג אזורי ניווט, תוכן יומי וקריאות לפעולה. משתמש ב־seed ובתוכן ציבורי. כולל קישורים לספר התנ״ך, devotionals, תפילות, שירים, קהילה ועוד; שיתוף תוכן יכול לפתוח `ShareSheet`. |
| `About` | `/About` | מידע על המיזם ועל מטרות האפליקציה. קישורים לעמוד הבית ולעמודים נוספים. |
| `BibleReader` | `/BibleReader` | אינדקס ספרי התנ״ך ובחירת ספר/פרק. חיפוש לפי שמות באנגלית, לוגנדה וקיצורים; מעבר בין הברית הישנה והחדשה; הצגת מצב זמינות offline; כניסה לבחירת פרק ולמשאבי לימוד. |
| `Chapter` | `/Chapter?book=…&chapter=…` | קורא פרק מלא. מקבל ספר, פרק, שפה/מהדורה ולעיתים פסוק דרך URL. מציג פסוקים, פעולות פסוק, הערות לימוד, תפילות, cross-references, כלי שיתוף והתקדמות בקריאה. הפסוקים נטענים דרך `fetchChapter`, עם תמיכה במטמון וב־offline. |
| `Devotionals` | `/Devotionals` | ספריית devotionals דו־לשונית. מציגה devotional יומי, רשימה, חיפוש, סינון לפי שפה, נושא, סדרה וטווח תאריכים, צפייה מלאה, סימון כנקרא/שמירה ושיתוף. |
| `PrayerLibrary` | `/PrayerLibrary` | ספריית תפילות ציבורית. חיפוש, סינון לפי קטגוריה ושפה, סימניות למשתמשים מחוברים ושיתוף. תוכן seed משמש גיבוי כאשר אין נתונים חיים. |
| `QA` | `/QA` | ספריית שאלות ותשובות. פילטרים לפי שפה, נושא, אות וחיפוש; תשובות נפתחות לפי דרישה; ניתן להצביע, להעתיק ולשתף לפי הקוד. מצב הפילטרים נשמר גם בפרמטרי URL. |
| `TheologicalInsights` | `/TheologicalInsights` | תצוגת `InsightsBoard` עבור `kind="theological"`. חיפוש, פתיחת פריט, שמירה מקומית ושיתוף. |
| `HistoricalInsights` | `/HistoricalInsights` | אותה תשתית של `InsightsBoard`, עבור `kind="historical"`. |
| `VerseOfDay` | `/VerseOfDay` | הצגת פסוק היום. בוחר רשומה לפי התאריך הנוכחי, עם fallback ל־seed; מציג הפניה, שיתוף וקישור לקריאת הפרק. |
| `Plan` | `/Plan` | תוכנית קריאה בת 30 יום. טוענת תוכנית חיה או fallback מ־`PLAN_DAYS`; מציגה התקדמות, היום הבא והפרקים הרלוונטיים. מצב השלמה נלקח מרשומות `Reading` של המשתמש. |
| `Journal` | `/Journal` | יומן תפילה אישי. יצירה, עריכה, סינון ומחיקה של רשומות לפי קטגוריה. ניתן להגיע עם `?new=1`, ובמקרים מסוימים עם `book` ו־`chapter` כדי להתחיל רשומה המשויכת לפרק. מיועד למשתמש מחובר. |
| `BibleNotes` | `/BibleNotes` | ריכוז highlights, bookmarks ו־notes של המשתמש, עם קישורים חזרה לפרק ולפסוק. אם המשתמש אינו מחובר מוצגת הודעת התחברות. |
| `Dashboard` | `/Dashboard` | לוח פעילות והתקדמות אישי: קריאה, רצף ימים, סימונים, התקדמות devotionals, פעילות אחרונה ונתוני offline. העמוד משתמש בחלקים מעמוד `Home` לצד נתוני משתמש. |
| `Offline` | `/Offline` | מרכז ניהול תוכן offline. מאפשר לבחור ולשמור תוכן כגון פרקי תנ״ך, מילון Strong’s, devotionals, תפילות, cross-references ו־Q&A; מציג נתוני אחסון ומאפשר לנקות תוכן. |
| `VerseSongs` | `/VerseSongs` | ספריית שירי פסוקים. חיפוש וסינון לפי סדרה וספר; הפעלת שיר, הורדה ושיתוף; שימוש בנגן גלובלי. URL עשוי לכלול `series` ו־`song`. |
| `VerseSongSeries` | `/VerseSongSeries` | ללא פרמטר סדרה מציג אינדקס סדרות; עם `?series=...` מציג את שירי הסדרה. אפשר לסנן, להפעיל ולשתף. |
| `Community` | `/Community` | מרכז קהילה המקשר אל revelations, הוראה חיה וקבוצות דיון. מציג תמצית ועדכונים לפי הנתונים הקיימים או seed. |
| `CommunityRevelations` | `/CommunityRevelations` | רשימת שיתופים של משתמשים, likes ותגובות. משתמשים מחוברים יכולים לפרסם revelation ולכתוב תגובות. כוללת מצבי טעינה, שגיאה וריק. |
| `CommunityLiveTeaching` | `/CommunityLiveTeaching` | רשימת מפגשי לימוד חיים, כולל תאריך, מארח וקישור הצטרפות לפי רשומות `LiveSession` או seed. |
| `DiscussionGroups` | `/DiscussionGroups` | הצגת קבוצות דיון, בחירת קבוצה, הצטרפות מקומית לקבוצה וכתיבת הודעות. קבוצה ראשונית יכולה להגיע מפרמטר `?group=...`. הודעות נשמרות ב־`DiscussionThread`. |
| `Contact` | `/Contact` | טופס יצירת קשר. אימות בסיסי לשם, אימייל והודעה; שליחה דרך `submitContactMessage`; מציג הצלחה או שגיאה. |
| `InstallPrompt` | `/InstallPrompt` | הנחיות והפעלה להתקנת האפליקציה. בודק פלטפורמה ו־standalone; ב־Android/דפדפנים מתאימים משתמש ב־`beforeinstallprompt`; ב־iOS עשוי להציג הוראות ידניות. |
| `Privacy` | `/Privacy` | מדיניות פרטיות סטטית: סוגי הנתונים שנשמרים בחשבון ובמכשיר והסבר על אחסון offline. |
| `Terms` | `/Terms` | תנאי שימוש סטטיים, לרבות שימוש בתוכן ובטקסטים תנ״כיים. |
| `Login` | `/Login` | התחברות לחשבון משתמש רגיל דרך `fse2.auth.login`. לאחר הצלחה מנווט אל `Dashboard`. |
| `Signup` | `/Signup` | יצירת חשבון, בדיקת אורך וחוזק סיסמה, אישור תנאים, טיפול באימות אימייל וניווט לאחר הרשמה. |
| `ForgotPassword` | `/ForgotPassword` | בקשת קישור איפוס סיסמה באימייל דרך `fse2.auth.forgotPassword`. |
| `ResetPassword` | `/ResetPassword?token=…` | בחירת סיסמה חדשה על בסיס token ב־URL. בודק אורך של שמונה תווים והתאמה בין השדות. |
| `Logout` | `/Logout` | עמוד ביניים קצר שמנתק משתמש רגיל לאחר השהיה ומחזיר ל־Home. אין לבלבל עם יציאה מממשק מנהל. |

## 2.3 עמודי ניהול

| עמוד | כתובת משוערת | תפקיד, פעולות ואינטראקציות |
|---|---|---|
| `Admin` | `/Admin` | כניסה לממשק הניהול. טופס אימייל/סיסמה, בדיקת session קיים, ואזור איפוס סיסמת מנהל עם reset key וסיסמה חדשה. |
| `AdminDashboard` | `/AdminDashboard` | ממשק CMS. כולל אזורי תוכן, ספריות, התקנת תנ״ך, יבוא, דיווחים, הגדרות וניהול משתמשי־מנהל לפי חלקי הקוד שסופקו. דורש session מנהל תקף. |

### אזורי ניהול מרכזיים שנראים בקוד

`AdminDashboard` כולל או מייבא ממשקים עבור:

- ספרים ופרקים.
- התקנת תנ״ך לוגנדי.
- התקנת KJV+ ומילון Strong’s.
- devotionals, נושאים ותוכניות.
- תפילות, prayer passages, הקדמות פרקים וספרים ו־cross-references.
- שאלות ותשובות ונושאים.
- שירים וסדרות.
- ייבוא JSON וייבוא קובצי prayer/cross-reference.
- עריכת collections באופן כללי.
- ניהול settings ודיווח על תוכן.

רשימת הסעיפים המלאה נמצאת ב־`SECTIONS` של `pages/AdminDashboard.jsx`, אך קטע הקובץ נקטע.

---

# 3. מפת ניווט לצורכי DEBUG

היעדים להלן הם שמות עמודים כפי שהם מועברים ל־`createPageUrl`. בממשק בפועל עשויים להיות נתיבי URL שונים.

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| מעבר לדף הבית | Header או Footer | לוגו / `Home` | `Home` |
| פתיחת קורא התנ״ך | Header, Footer, Home | `Bible Reader` | `BibleReader` |
| פתיחת ספר או פרק | `BibleReader` | בחירת ספר ואז אריח פרק | `Chapter?book={number}&chapter={n}` |
| פתיחת פרק בשפה לוגנדית | `ChapterGrid` | אריח פרק כאשר `lang="lu"` | `Chapter?book={number}&chapter={n}&lang=lu` |
| פתיחת פסוק מהתוכן | כרטיס תוכן, cross-reference או קישור הפניה | לחיצה על הפניה תנ״כית | `Chapter` עם פרמטרי ספר/פרק/פסוק |
| פתיחת הקדמה, מתווה או תפילת ספר | `BibleReader` → `ChapterSelector` | לשונית ב־`BookSidebar` | נשארים בעמוד הספר; בחירת פסוק עשויה לפתוח `VersePopup` |
| פתיחת פסוק מתוך sidebar | `BookIntro`, `BookPrayerPanel`, `BookOutline` | לחיצה על הפניה או טווח | `VersePopup` בתוך העמוד |
| הצגת תפילה המתאימה לפסוק | `Chapter` | פעולת prayer או אזור תפילה | כרטיס/חלונית תפילה בעמוד הפרק |
| הצגת cross-references | `Chapter` | פעולת `Cross-refs` / כפתור קישורים | חלונית/כרטיס cross-references |
| פתיחת cross-reference | `CrossRefList` או `VerseCrossRefs` | לחיצה על הפניה | ניווט אל `Chapter` של הפסוק המקושר |
| הצגת מידע Strong’s | `Chapter` עם KJV+ | לחיצה על קוד כחול כגון `G2424` | `StrongsPopup` |
| שינוי גרסת תנ״ך | `Chapter` | `VersionPicker` | שינוי פנימי של המהדורה, ללא החלפת עמוד |
| סימון פסוק | `Chapter` | פעולת highlight ב־`VerseActionBar` | שמירה מקומית/לחשבון בהתאם למסלול |
| הוספת הערה לפסוק | `Chapter` | `Note` ב־`VerseActionBar` | טופס/פעולת note של הפסוק |
| שמירת bookmark | `Chapter` | פעולת bookmark | `StudyMark` או אחסון מקומי לפי תהליך העמוד |
| שיתוף פסוק/פרק | `Chapter` | כפתור Share | `ShareSheet` |
| פתיחת devotionals | Header, Footer או Home | `Devotionals` | `Devotionals` |
| קריאת devotional מלאה | `Devotionals` | פתיחת כרטיס | `DevotionalFullView` בתוך העמוד |
| שיתוף devotional | כרטיס או תצוגה מלאה | Share | `ShareSheet` |
| סימון devotional כשמור/נקרא | `Devotionals` | שמירה/סימון קריאה | עדכון `useDevotionalLibrary`, מקומי ובמידת האפשר גם בשרת |
| פתיחת ספריית תפילות | Header, Footer או Home | `Prayer Library` | `PrayerLibrary` |
| שמירת תפילה | `PrayerLibrary` | Bookmark | `PrayerSaved` של המשתמש המחובר |
| פתיחת שאלות ותשובות | Header, Footer או Home | `Q&A` | `QA` |
| סינון Q&A | `QA` | שפה, נושא, אות או חיפוש | נשארים ב־`QA`; חלק מהמצב נשמר ב־query params |
| פתיחת עמוד insight | Header/Footer | Theological או Historical insights | `TheologicalInsights` / `HistoricalInsights` |
| פתיחת תוכנית קריאה | Header או Footer | `Reading plan` | `Plan` |
| פתיחת יומן תפילה | Header או Footer | `Prayer journal` | `Journal` |
| יצירת רשומת יומן מתוך פרק | `Chapter` או קישור פנימי | קישור יומן עם `new=1`, `book`, `chapter` | `Journal?new=1&book=…&chapter=…` |
| צפייה בהערות המשתמש | Header | `My notes` | `BibleNotes` |
| פתיחת שירי פסוקים | Header, Footer או Home | `Verse-Songs` | `VerseSongs` |
| פתיחת סדרות שירים | `VerseSongs` | בחירה בסדרה | `VerseSongSeries?series={id}` |
| הפעלת שיר | כרטיס `SongCard` | Play או לחיצה על הכרטיס | `PlayerProvider` מתחיל לנגן; `GlobalPlayer` מופיע |
| שיתוף שיר | `SongCard` | Share | `SongShareSheet` |
| פתיחת מרכז הקהילה | Header או Home | `Community` | `Community` |
| פתיחת revelations | `Community` | Hub מסוג Revelations | `CommunityRevelations` |
| פרסום revelation | `CommunityRevelations` | טופס פרסום | יצירת `Revelation`; דורש התחברות |
| פתיחת תגובות | `RevelationCard` | Comments | הרחבת `CommentThread` |
| פתיחת קבוצות דיון | `Community` | Discussion groups | `DiscussionGroups` |
| בחירת קבוצה וכתיבת הודעה | `DiscussionGroups` | בחירת קבוצה וטופס הודעה | `DiscussionThread` עבור הקבוצה |
| פתיחת הוראה חיה | `Community` | Live teaching | `CommunityLiveTeaching` |
| התקנת האפליקציה | Footer או Home | Install / Offline centre | `InstallPrompt` או `Offline`, לפי הקישור |
| יצירת קשר | Footer או קישור פנימי | Contact | `Contact` |
| הרשמה | Header/מסך התחברות | Sign up | `Signup` |
| התחברות משתמש | Header או עמוד מוגן | Sign in | `Login` |
| איפוס סיסמת משתמש | `Login` | Forgot password | `ForgotPassword` |
| בחירת סיסמה חדשה | קישור באימייל | Reset link עם token | `ResetPassword?token=…` |
| יציאה מחשבון משתמש | Header | Log out | `Logout` או ניתוק דרך `AuthContext` |
| כניסה לממשק מנהל | כתובת מנהל | טופס התחברות ב־`Admin` | `AdminDashboard` |
| עריכת רשומת תוכן | `AdminDashboard` → אזור ניהול | Edit | `RecordEditor` או טופס ייעודי |
| מחיקת רשומה | אזור CMS | Delete | `ConfirmDialog`, ואז מחיקה |
| העלאת קובץ JSON | אזור Import | Upload/Choose file | תצוגה ואימות בתוך `JsonImportPanel` או כלי bulk ייעודי |
| התקנת Bible | `AdminDashboard` → Luganda/KJV+ | Install/Resume | פעולת שרת `lugandaInstall` או `kjvInstall` |
| הפעלת audit | ממשק התקנה | Refresh/Run report | `scriptureAudit` דרך `LibraryReport` |

---

# 4. מבנה קבצים

## 4.1 רכיבי Admin

| קובץ | תפקיד ומה הוא מרנדר |
|---|---|
| `components/admin/ChapterCoverage.jsx` | תצוגת כיסוי פרקי תנ״ך למנהל. מחשבת פרקים חסרים/פגומים ומציגה רשימות מקוצרות; `compressChapters` ממירה רצפים כמו `2,3,4,9` ל־`2-4, 9`. |
| `components/admin/CollectionsPanel.jsx` | CMS גנרי לאוספים. טוען רשומות דרך `callAdminData`, חיפוש, עריכה, הוספה ומחיקה באמצעות `RecordEditor` ו־`ConfirmDialog`. |
| `components/admin/ConfirmDialog.jsx` | חלון אישור לפעולה הרסנית. תומך בכותרת, הודעה, תווית פעולה, מצב busy ואישור/ביטול. |
| `components/admin/CrossRefEditor.jsx` | עריכה של הפניות תנ״כיות כ־chips; מפצל ומחבר ערכים באמצעות `scriptureRefs`. |
| `components/admin/DevotionalBulkImport.jsx` | העלאה ואימות של קובץ devotionals בפורמט `pray-read-devotionals-v1`; ממיר שורות לרשומות ומבצע יבוא. |
| `components/admin/DevotionalForm.jsx` | טופס עריכת devotional דו־לשוני, כולל הפניה, טקסט פסוק, גוף, תפילה, נושא, תאריך, תמונה ודגלי active/featured. |
| `components/admin/DevotionalPlansPanel.jsx` | ניהול תוכניות devotionals. מאפשר יצירה, עריכה, מחיקה וצפייה ב־devotionals השייכים לסדרה/תוכנית. |
| `components/admin/DevotionalsPanel.jsx` | מעטפת ניהול devotionals: טעינת תוכן, טאבים ל־devotionals, נושאים, תוכניות ו־bulk upload. |
| `components/admin/DevotionalTopicsPanel.jsx` | ניהול נושאי devotional; מונע מחיקת נושא שבו עדיין נעשה שימוש. |
| `components/admin/JsonImportPanel.jsx` | יבוא JSON של collections, זיהוי aliases, הכנת רשומות, בדיקת מבנה ודיווח תוצאות. |
| `components/admin/KjvPlusInstaller.jsx` | ממשק התקנת KJV+ ומילון Strong’s. מנהל מצב התקנה, session administrator, סטטוס ודיווח coverage. |
| `components/admin/LibraryReport.jsx` | הפעלת דוח `scriptureAudit` והצגת מצב האוסף התנ״כי, פערי פסוקים ומצב Strong’s. |
| `components/admin/LugandaInstaller.jsx` | ממשק התקנת התנ״ך הלוגנדי. מחדש session לפני קריאות ארוכות ומציג התקדמות/שגיאה. |
| `components/admin/PassagesPanel.jsx` | עריכת PrayerPassage, CrossReference, ChapterIntro ו־BookIntro. משתמש ב־CMS גנרי לפי טאבים. |
| `components/admin/PrayerCrossRefImport.jsx` | מסך יבוא ייעודי לתוכן prayer passages ו־cross-references. כולל קריאת קובץ, בדיקה/preview והשוואה לתוכן שכבר הותקן בספר/פרק. |
| `components/admin/PrayersPanel.jsx` | ניהול ספריית תפילות ובמצב passages גם עבודה לפי ספר/פרק/פסוק; כולל חיפוש, עריכה ומחיקה. |
| `components/admin/QaAdminList.jsx` | רשימת שאלות מנהל: סינון נושא/אות/חיפוש, בחירה מרובה ופעולות bulk. |
| `components/admin/QaBulkImport.jsx` | יבוא שאלות ותשובות בפורמט `pray-read-qa-v1`; מאמת שאלות/תשובות בשתי שפות ומאפשר יצירת נושאים חסרים. |
| `components/admin/QaItemForm.jsx` | טופס שאלה ותשובה דו־לשוני, כולל נושא, הפניה, תגיות, featured ו־active. |
| `components/admin/QaPanel.jsx` | מעטפת CMS של QA: טעינת `QATopic` ו־`QAItem`, שמירה/מחיקה וטאבים. |
| `components/admin/QaQuestionsPanel.jsx` | שילוב רשימת שאלות, טופס עריכה ו־ConfirmDialog. |
| `components/admin/QaTopicForm.jsx` | טופס נושא Q&A באנגלית ובלוגנדה, כולל תיאורים ומצב active. |
| `components/admin/QaTopicsPanel.jsx` | ניהול נושאי Q&A; כאשר נושא בשימוש, מבקש להעביר את השאלות לנושא אחר לפני מחיקה. |
| `components/admin/RecordEditor.jsx` | טופס דינמי ליצירה/עריכה לפי מערך שדות. תומך text, textarea, number, boolean ו־refs. |
| `components/admin/VerseSongBulkImport.jsx` | יבוא אצווה של שירי פסוקים. מאמת שדות, סדרות וקובצי שמע, ועוקב אחר התקדמות. |
| `components/admin/VerseSongForm.jsx` | טופס שיר בודד: סדרה, ספר/פרק/פסוק, שפה, מהדורה, אודיו, תמונה ומילים. תומך העלאת מדיה ובדיקות. |
| `components/admin/VerseSongSeriesForm.jsx` | טופס יצירה/עריכה לסדרת שירי פסוקים, כולל תיאור, תמונת cover, צבע ומצב active. |
| `components/admin/VerseSongsPanel.jsx` | מעטפת CMS של שירים וסדרות: טעינה, חיפוש, סינון, עריכה, מחיקה ו־bulk import. |

## 4.2 רכיבים משותפים וקהילתיים

| קובץ | תפקיד ומה הוא מרנדר |
|---|---|
| `components/common/BrandIcons.jsx` | אייקוני SVG ממותגים לשירותי שיתוף שאינם כלולים ב־Lucide, כגון WhatsApp, Facebook, X ו־Telegram, לצד אייקוני עזר נוספים. |
| `components/common/EmptyState.jsx` | מצב ריק אחיד עם אייקון, כותרת, הסבר ופעולת CTA אפשרית. |
| `components/common/Modal.jsx` | חלון modal כללי. תומך Escape, סגירה בלחיצה על הרקע ונעילת גלילת body. |
| `components/common/PageHeader.jsx` | Header לעמוד: hero עם תמונת רקע או כותרת על רקע בהיר, כולל eyebrow, lead, פעולות ו־children. |
| `components/common/Pagination.jsx` | רכיב דפדוף עמודים, עם כפתורי קודם/הבא, מספרי קצה וטווח סביב העמוד הנוכחי. |
| `components/common/ShareRow.jsx` | שורת כפתורי שיתוף; מפעילה `openShare` ומציגה אישור העתקה. |
| `components/common/Spinner.jsx` | מצב טעינה נגיש עם טקסט ו־spinner. |
| `components/community/CommentThread.jsx` | רשימת תגובות וטופס תגובה. הטופס מוצג למשתמש מחובר. |
| `components/community/RevelationCard.jsx` | כרטיס revelation עם כותב, הפניה, גוף, likes ומעבר לתגובות. |
| `components/community/RevelationForm.jsx` | טופס פרסום revelation; למשתמש לא מחובר מוצגת קריאה להתחברות. |
| `components/community/ThreadMessages.jsx` | רשימת הודעות בקבוצת דיון וטופס שליחת הודעה למשתמש מחובר. |
| `components/dashboard/ActivityFeed.jsx` | פיד פעילות אחרונה של משתמש, עם אייקון לפי סוג הפעולה ומועד יחסי. |
| `components/home/StatCard.jsx` | כרטיס סטטיסטיקה: תווית, ערך, hint ואייקון אופציונלי. |

## 4.3 רכיבי devotional, תפילה ולימוד

| קובץ | תפקיד ומה הוא מרנדר |
|---|---|
| `components/devotional/DevotionalCard.jsx` | כרטיס devotional ברשימה: cover, תאריך, כותרת, פסוק, נושא, שפה ותקציר. |
| `components/devotional/DevotionalFeatured.jsx` | תצוגת devotional מובלט/יומי הכוללת תמונה, פסוק, גוף מקוצר ופעולות. |
| `components/devotional/DevotionalFilters.jsx` | סרגל שפה, חיפוש, נושאים, טווח זמן וסדרה. |
| `components/devotional/DevotionalFullView.jsx` | קריאה מלאה של devotional, כולל body, פסוק, תפילה, ניווט לימים קודמים/הבאים ושיתוף/שמירה. |
| `components/insight/InsightsBoard.jsx` | מסך משותף ל־insights תיאולוגיים והיסטוריים, כולל שילוב seed עם נתוני שרת וחיפוש. |
| `components/journal/JournalCard.jsx` | הצגת רשומת יומן עם פעולות עריכה ומחיקה ופרטי תאריך/פרק. |
| `components/journal/JournalForm.jsx` | טופס יצירה/עריכת רשומת יומן, כולל כותרת, גוף, קטגוריה וספר/פרק. |
| `components/plan/PlanRow.jsx` | שורת יום בתוכנית קריאה, עם מצב completed/current/upcoming וקישור לפרק. |

## 4.4 רכיבי Layout

| קובץ | תפקיד ומה הוא מרנדר |
|---|---|
| `components/layout/AppFooter.jsx` | Footer גלובלי עם קישורים מהירים, מיתוג וקישורי תמיכה/תרומה. |
| `components/layout/AppHeader.jsx` | Header ניווט ראשי ומשני; מציג קישורים, משתמש ואפשרויות התחברות/יציאה. |
| `components/layout/GlobalPlayer.jsx` | נגן אודיו גלובלי תחתון. מציג track, התקדמות, volume, מהירות, repeat, shuffle, queue ומצבי expanded/minimized. |
| `components/layout/PwaHead.jsx` | הוספת meta tags, manifest, favicon ואייקונים; רישום service worker לפי הקוד המלא. |
| `Layout.jsx` | Root layout: עוטף את האפליקציה ב־`AuthProvider`, `ThemeProvider`, `PlayerProvider`; מציג Header, main, Footer לפי שם העמוד ו־GlobalPlayer. |

## 4.5 רכיבי קורא התנ״ך

| קובץ | תפקיד ומה הוא מרנדר |
|---|---|
| `components/read/AnnotatedText.jsx` | טקסט שניתן לסמן. מחשב מקטעי טקסט לפי offsets ומציג highlights/underline עם כלי סימון. |
| `components/read/BookGrid.jsx` | אינדקס ספרים לפי הברית הישנה והחדשה, עם חיפוש, טאבים ומצב הורדה offline. |
| `components/read/BookIntro.jsx` | הקדמת ספר, עם תוכן imported או fallback, פסוקי מפתח והערות/סימונים. |
| `components/read/BookOutline.jsx` | מתווה ספר עם טווחי פסוקים לחיצים, בחירה פעילה ואפשרות לסמן טקסט. |
| `components/read/BookPrayerPanel.jsx` | תפילה לספר. מעדיף תפילת סיום מיובאת, אחרת משתמש ב־fallback, ותומך בסימונים ופתיחת הפניות. |
| `components/read/BookSidebar.jsx` | Sidebar של הספר עם לשוניות Intro, Outline ו־Prayer. |
| `components/read/BookStudyResources.jsx` | משאבי לימוד לספר: commentary, insights תיאולוגיים והיסטוריים, עם pagination. |
| `components/read/ChapterClosingPrayer.jsx` | תפילת סיום פרק לאחר הפסוק האחרון, עם שפה, סימונים, שיתוף וחזרה לאזור תפילה. |
| `components/read/ChapterGrid.jsx` | גריד פרקים של ספר, עם קישור לכל פרק ושמירת בחירה פעילה. |
| `components/read/ChapterReaderPane.jsx` | מעטפת תצוגת פרק וממשק לפתיחת תפריט חלקי לימוד: intro, commentary, prayer ו־crossrefs. |
| `components/read/ChapterResourcesPanel.jsx` | תצוגת insights תיאולוגיים והיסטוריים לפרק, עם fallback למשאבי הספר. |
| `components/read/ChapterSelector.jsx` | תצוגת ספר: sidebar, גריד פרקים, משאבי לימוד, popup לפסוק וסימונים שמנוהלים דרך `studyAnnotations`. |
| `components/read/ChapterSidebar.jsx` | פאנל לימוד לפרק: הקדמה, commentary, prayer ו־crossrefs; משתמש בנתונים מיובאים וב־fallbacks. |
| `components/read/CrossRefList.jsx` | רשימת הפניות מקבילות, טקסט והערות בשפה המתאימה; קישור להפניה אחרת. |
| `components/read/CrossRefScripture.jsx` | הצגת הטקסט של פסוק שאליו מפנה cross-reference; משתמש בטקסט שמור או מביא פרק ממקור התנ״ך. |
| `components/read/FloatingVerse.jsx` | חלונית צפה לפסוק עם הפניה, טקסט וקישור לפתיחה בקורא. |
| `components/read/PassagePrayer.jsx` | תפילה שמתאימה להפניה הנוכחית, כולל התאמת טווח הפסוקים, שפה וסימונים. |
| `components/read/PassageTabs.jsx` | לשוניות משאבים עבור מעבר תנ״כי: commentary, insights ו־Q&A רלוונטי. |
| `components/read/ShareSheet.jsx` | חלון שיתוף כללי לפסוק/פרק/devotional, כולל preview, טקסט מחושב, ערוצים והעתקה. |
| `components/read/StrongsPopup.jsx` | כרטיס הגדרה למספר Strong’s. קורא cache offline, מבצע lookup לפי הצורך ושומר עותק. |
| `components/read/StrongsText.jsx` | מזהה קודים בפורמט `(G123)` או `(H123)`, מציג אותם כקישורים ומאפשר פתיחת popup. |
| `components/read/VerseActionBar.jsx` | פעולות לפסוק: prayer, crossrefs, commentary, highlight, share, bookmark, note והעתקה. |
| `components/read/VerseCrossRefs.jsx` | תצוגת cross-references מתחת לפסוק, כולל טקסט/הערה/הפניה. |
| `components/read/VerseList.jsx` | רשימת פסוקים פשוטה לבחירה והדגשת פסוק. |
| `components/read/VersePopup.jsx` | popup פנימי שמביא פרק ומציג את הפסוק וסביבתו, עם אפשרות לסימון. |
| `components/read/VersionPicker.jsx` | בחירת מהדורה, התקנה והסרה של גרסאות; מצב ההתקנות מנוהל דרך `lib/versions.js`. |

## 4.6 רכיבי Q&A ושירים

| קובץ | תפקיד ומה הוא מרנדר |
|---|---|
| `components/qa/QaCard.jsx` | כרטיס שאלה; תשובה מתקפלת, מקטעי הפניה מודגשים, שפה, הצבעות ושיתוף. |
| `components/qa/QaFilters.jsx` | פילטרי Q&A לפי שפה, חיפוש ונושא. |
| `components/qa/QaLetterBar.jsx` | סרגל A - Z שניתן לגלילה ולבחירת אות, כולל ספירה והזזת האות הפעילה למרכז. |
| `components/song/SeriesCard.jsx` | כרטיס סדרת שירים עם cover, תיאור, ספירה וקישור לעמוד הסדרה. |
| `components/song/SongCard.jsx` | כרטיס שיר עם הפעלה/השהיה, מטא־נתונים, הורדה ושיתוף. |
| `components/song/SongFilters.jsx` | חיפוש וסינון שירים לפי סדרה וספר. |
| `components/song/SongShareSheet.jsx` | חלון שיתוף ייעודי לשיר עם טקסט וקישור מחושבים. |

## 4.7 ספריות, פונקציות ונתונים

| קובץ | תפקיד |
|---|---|
| `cron/scriptureInstall.js` | משימת רקע מתוזמנת מדי שעה: מתקינה פרקים חסרים של Luganda ו־KJV+, באופן חוזר ובטוח. |
| `functions/adminAuth.js` | API צד־שרת לאימות מנהל, סיסמה ו־session חתום. יש לעיין בקובץ המלא לפני שינוי אבטחה. |
| `functions/adminContent.js` | API ניהול תוכן המאמת token מנהל ומבצע פעולות על entities. מכיל מפתחות טבעיים למניעת כפילויות בייבוא. |
| `functions/bibleChapter.js` | פונקציית שרת להבאת פרקי תנ״ך ממקורות חיצוניים ולניקוי טקסט. |
| `functions/content.js` | API ציבורי לתוכן, למשל devotionals גלויים ושליחת תוכן ציבורי. |
| `functions/kjvInstall.js` | שרת התקנת פרקי KJV+ וסמני Strong’s. |
| `functions/lugandaInstall.js` | שרת התקנת פרקי תנ״ך לוגנדי. |
| `functions/scriptureAudit.js` | בדיקת מצב הספרייה התנ״כית; לפי ההערה בקובץ היא לקריאה בלבד. |
| `functions/strongsDefinition.js` | יצירה/שליפה של הגדרות Strong’s מול dictionaries ומקור lexicon, ושמירת cache. |
| `lib/activity.js` | סוגי פעילות וכתיבת פעילות המשתמש, כגון קריאת פרק, סימון או שמירת note. |
| `lib/adminCollections.js` | הגדרת collections והשדות שלהם עבור ה־CMS הגנרי. משמש גם ליצירת רשומות ריקות ולתצוגת כותרות. |
| `lib/adminDirect.js` | מימוש דפדפן של פעולות CMS דרך SDK, כחלופה ל־function gateway. |
| `lib/adminSession.js` | session מנהל: התחברות, token, חידוש, keep-alive, יציאה ונתיב fallback ל־adminDirect. |
| `lib/app-params.js` | getters לקריאת app ID ו־token עדכני מ־localStorage. |
| `lib/AuthContext.jsx` | Context של משתמש רגיל: טעינת `me`, מצב התחברות, logout ו־redirect ל־login. |
| `lib/bibleApi.js` | שכבת גישה לפרקי תנ״ך: מקורות, fallback, cache, offline ומהדורות. |
| `lib/bibleBooks.js` | נתונים סטטיים על 66 ספרי התנ״ך, שמות באנגלית/לוגנדה, קיצורים ומספר פרקים. |
| `lib/bilingual.js` | קריאת טקסט דו־לשוני מצורות נתונים שונות, בלי להעתיק אוטומטית אנגלית לשדה לוגנדי. |
| `lib/bookGuides.js` | הקדמות ומתווים מקומיים לכל ספר, בתור fallback לחומר ספרי. |
| `lib/bookImport.js` | זיהוי והרחבת קובצי ייבוא לפי ספר, כולל חילוץ collections והמרת הפניות. |
| `lib/bookIntro.js` | נרמול, מפתחות טבעיים וטעינה של הקדמות ספר ותפילות סיום. |
| `lib/bookPrayers.js` | תפילות fallback לפי ספר, עם סמני הפניה בפורמט `[[...]]`. |
| `lib/bookStudyContent.js` | משאבי לימוד fallback לכל ספר, לתחומי commentary/תיאולוגיה/היסטוריה. |
| `lib/brandCss.js` | מערכת עיצוב CSS עם משתני צבע ורכיבים משותפים. |
| `lib/chapterIntros.js` | נרמול, מפתחות וטעינה של הקדמות פרקים; תומך ב־offline וב־fallback. |
| `lib/chapterStudy.js` | הרכבת חומרי לימוד לפרק מתוך guides, commentary, תפילות, הפניות ומשאבים. |
| `lib/contentApi.js` | שכבת קריאה ציבורית ל־collections, עם שימוש ב־FSE2 ונתיבים שונים לפי אוסף/אימות. |
| `lib/crossRefs.js` | cross-references מקומיים מקובצים לפי `bookNumber:chapter`, עבור fallback. |
| `lib/devotionals.js` | helpers לנרמול devotional, תאריכים, שפה, מזהים, מיון, שיתוף וטקסטים ישנים/חדשים. |
| `lib/format.js` | פונקציות עזר לטקסט בטוח, IDs, רשימות, שמות ותצוגת משך. |
| `lib/keyPassages.js` | פסוקי מפתח מקומיים לפי ספר. |
| `lib/luganda.js` | ניקוי ועיצוב devotionals בלוגנדה, כולל מבנה כותרות והסרת שמות מקורות שנזלגו לטקסט. |
| `lib/offlineDb.js` | מעטפת IndexedDB ו־stores עבור פרקים, תוכן ותוכן משתמש; מבצעת שדרוג מבנה DB. |
| `lib/planData.js` | תוכנית קריאה מקומית של 30 יום כ־fallback. |
| `lib/player.jsx` | Provider של נגן אודיו גלובלי; מחזיק Audio element, תור, ניגון, volume, repeat ועוד. |
| `lib/prayerImport.js` | אימות, נרמול והכנת קובצי תפילות ו־cross-references לייבוא. |
| `lib/prayerPassages.js` | שליפה ונרמול של תפילות פרק והפניות מקבילות, כולל בחירה לפי פרק/פסוק. |
| `lib/qaLibrary.js` | טעינה, נרמול, סינון, מיון וספירה של שאלות ונושאים, כולל offline ו־seed. |
| `lib/reading.js` | פעולות תאריך, תצוגת תאריך, טווחים וחישובי קריאה. |
| `lib/readings.js` | מציאת יום תוכנית מתאים ושמירת התקדמות בקריאה. |
| `lib/scriptureRefs.js` | פענוח שמות/קיצורים והפניות תנ״כיות, בניית קישורים וניתוח טווחים. |
| `lib/seedContent.js` | ספריית fallback מקומית: devotionals, תפילות, insights, Q&A, community ועוד. |
| `lib/sha256.js` | מימוש SHA-256 ב־JavaScript עבור סביבות שבהן Web Crypto אינו זמין. |
| `lib/share.js` | בניית טקסטים וקישורי שיתוף, העתקה ופתיחת ערוצי שיתוף. |
| `lib/strongs.js` | נרמול קודי Strong’s, סימון, שפה וקישורי lexicon. |
| `lib/strongsOffline.js` | קריאה וכתיבה של הגדרות Strong’s ב־IndexedDB. |
| `lib/studyAnnotations.js` | מיזוג, שמירה והסרה של סימוני טקסט בספר/הקדמה/תפילה/פסוק, מקומית ובשרת. |
| `lib/textSelection.js` | בדיקה האם המשתמש מסמן טקסט באזור מסוים, כדי למנוע ניווט בלתי מכוון. |
| `lib/themeContext.jsx` | טעינת settings ציבוריים והפצת צבעים/הגדרות Theme דרך Context. |
| `lib/theme.js` | קבועי מותג, קישורים, תמונות, אייקונים והגדרות מותג. |
| `lib/useDevotionalLibrary.js` | hook לספרייה האישית של devotionals שמורים/נקראו, עם תמיכה מקומית ושרת. |
| `lib/verseSongs.js` | נרמול שירים וסדרות, בניית אינדקס/תור, סינון, הורדה וקישורי שיתוף. |
| `lib/versions.js` | רישום גרסאות תנ״ך, התקנה/הסרה ושמירת הגרסה הפעילה. |

## 4.8 עמודים

| קובץ | תפקיד |
|---|---|
| `pages/About.jsx` | עמוד אודות סטטי. |
| `pages/AdminDashboard.jsx` | מרכז ניהול תוכן והפעלה של כל פאנלי המנהל. |
| `pages/Admin.jsx` | מסך התחברות ואיפוס סיסמת מנהל. |
| `pages/BibleNotes.jsx` | תצוגת סימוני המשתמש. |
| `pages/BibleReader.jsx` | אינדקס ספרים וכניסה לקורא. |
| `pages/Chapter.jsx` | קורא פרק תנ״ך והפעולות סביב הפסוקים. |
| `pages/Community.jsx` | Hub של הקהילה. |
| `pages/CommunityLiveTeaching.jsx` | רשימת מפגשי הוראה חיים. |
| `pages/CommunityRevelations.jsx` | פרסומים, likes ותגובות. |
| `pages/Contact.jsx` | טופס יצירת קשר. |
| `pages/Dashboard.jsx` | dashboard משתמש ונתוני פעילות. |
| `pages/Devotionals.jsx` | ספריית devotional ותצוגה מלאה. |
| `pages/DiscussionGroups.jsx` | קבוצות דיון והודעות. |
| `pages/ForgotPassword.jsx` | בקשת איפוס סיסמה למשתמש. |
| `pages/HistoricalInsights.jsx` | מסך insights היסטוריים דרך רכיב משותף. |
| `pages/Home.jsx` | דף הבית והתוכן המוביל. |
| `pages/InstallPrompt.jsx` | הוראות והפעלה להתקנת PWA. |
| `pages/Journal.jsx` | יומן תפילה אישי. |
| `pages/Login.jsx` | התחברות משתמש רגיל. |
| `pages/Logout.jsx` | יציאה מחשבון משתמש והפניה ל־Home. |
| `pages/Offline.jsx` | ניהול והורדת תוכן offline. |
| `pages/Plan.jsx` | תוכנית הקריאה והתקדמות. |
| `pages/PrayerLibrary.jsx` | ספריית תפילות ושמירת מועדפים. |
| `pages/Privacy.jsx` | מדיניות פרטיות. |
| `pages/QA.jsx` | ספריית שאלות ותשובות לקוראים. |
| `pages/ResetPassword.jsx` | שינוי סיסמה דרך token. |
| `pages/Signup.jsx` | הרשמת משתמש. |
| `pages/Terms.jsx` | תנאי שימוש. |
| `pages/TheologicalInsights.jsx` | מסך insights תיאולוגיים דרך רכיב משותף. |
| `pages/VerseOfDay.jsx` | פסוק היום. |
| `pages/VerseSongSeries.jsx` | אינדקס סדרות או תצוגת סדרה. |
| `pages/VerseSongs.jsx` | ספריית שירי פסוקים. |

## 4.9 Entities

קובצי JSON אלה הם סכמות נתונים/הרשאות של פלטפורמת FSE2, ולא רכיבי UI:

| קובץ | תפקיד |
|---|---|
| `entities/ActivityLog.json` | יומן פעולות מנהל. |
| `entities/AdminAccount.json` | פרטי חשבון מנהל, hash, salt, secret וגרסת session. |
| `entities/BibleVerse.json` | פסוק בודד באנגלית ובלוגנדה. |
| `entities/BookIntro.json` | הקדמת ספר ותפילת סיום ספר. |
| `entities/ChapterIntro.json` | הקדמת פרק. |
| `entities/Commentary.json` | הערת commentary לספר/פרק. |
| `entities/ContactMessage.json` | הודעת יצירת קשר ותשובת מנהל. |
| `entities/CrossReference.json` | הפניה מפסוק למקום אחר בתנ״ך, עם טקסט והערות. |
| `entities/Devotional.json` | devotional דו־לשוני. |
| `entities/DevotionalPlan.json` | תוכנית devotional. |
| `entities/DevotionalProgress.json` | devotional שסומן כהושלם על ידי משתמש. |
| `entities/DevotionalSaved.json` | devotional שנשמר על ידי משתמש. |
| `entities/DevotionalTopic.json` | נושא devotional. |
| `entities/DiscussionGroup.json` | קבוצת דיון. |
| `entities/DiscussionThread.json` | הודעה בקבוצת דיון. |
| `entities/Insight.json` | insight תיאולוגי או היסטורי. |
| `entities/JournalEntry.json` | רשומת יומן תפילה אישית. |
| `entities/KjvPlusChapter.json` | פרק KJV+ עם נתוני פסוקים ו־Strong’s. |
| `entities/LiveSession.json` | מפגש לימוד חי. |
| `entities/LugandaChapter.json` | פרק תנ״ך בלוגנדה. |
| `entities/Prayer.json` | תפילה בספריית התפילות. |
| `entities/PrayerPassage.json` | תפילה המשויכת לפרק/טווח פסוקים. |
| `entities/PrayerSaved.json` | תפילה שמורה של משתמש. |
| `entities/QAEntry.json` | שאלה שנשלחה על ידי קורא, במבנה שונה מספריית QA. |
| `entities/QAItem.json` | פריט Q&A דו־לשוני בספרייה. |
| `entities/QATopic.json` | נושא בספריית Q&A. |
| `entities/ReadingActivity.json` | אירוע פעילות קריאה. |
| `entities/Reading.json` | התקדמות/רשומת קריאה של פרק. |
| `entities/ReadingPlan.json` | תוכנית קריאה כללית. |
| `entities/Revelation.json` | revelation או רשומת תגובה שמקושרת דרך `parent_id`. |
| `entities/SiteSettings.json` | הגדרות אתר key/value. |
| `entities/StrongEntry.json` | הגדרת מילון למספר Strong’s. |
| `entities/StudyAnnotation.json` | highlight/underline בתוך טקסט לימודי. |
| `entities/StudyMark.json` | highlight, bookmark או note של פסוק. |
| `entities/VerseOfDay.json` | פסוק שנבחר לתאריך. |
| `entities/VerseSongEpisode.json` | פרק/שיר בתוך סדרת שירים. |
| `entities/VerseSongSeries.json` | סדרת שירי פסוקים. |

## 4.10 נכסים וארכיון

- `public/manifest.json`  -  הגדרות PWA: שם, תצוגת standalone, צבעים ואייקונים.
- `public/sw.js`  -  service worker; לפי ההערה משתמש ב־cache-first למעטפת/תמונות וב־network-first לתוכן אחר.
- `__generated/tailwind.css`  -  CSS שנוצר אוטומטית; עדיף לא לערוך ידנית.
- `public/assets/**`  -  תמונות, לוגואים, PDFs, קובצי JSON ותוכן מדיה. חלקם מיועדים להצגה או לייבוא.
- `__trash/**`  -  קבצי בדיקה/ניסוי/גרסאות ישנות שאינם בהכרח חלק מהאפליקציה הפעילה. אין להחזירם לנתיבים פעילים בלי לבדוק את ה־router וה־imports.

---

# 5. מודל הנתונים  -  Entities

## 5.1 תוכן תנ״כי ולימודי

| Entity | מטרה ושדות מרכזיים | קשרים |
|---|---|---|
| `BibleVerse` | `book_number`, `chapter`, `verse`, `text_en`, `text_lu`; פסוק לפי מיקום. | משויך ל־`book_number` של `BIBLE_BOOKS`; אינו בהכרח קשור דרך FK פורמלי. |
| `LugandaChapter` | `book_number`, `book`, `chapter`, `verse_count`, `verses` (JSON). | פרק אחד של ספר; מקור לטקסט לוגנדי ול־offline. |
| `KjvPlusChapter` | אותם שדות מבניים, עם פסוקים המכילים סימוני Strong’s. | משויך לספר/פרק ול־`StrongEntry` דרך קודים בטקסט. |
| `BookIntro` | מספר ספר, שמות, כותרות, `intro_en/lu`, `closing_prayer_en/lu`. | רשומה לפי ספר; תוכן נצרך ב־`BookIntro` ו־`BookPrayerPanel`. |
| `ChapterIntro` | ספר, פרק, כותרת והקדמה בשתי שפות, מקור. | רשומה לפי ספר ופרק; משמשת ב־`ChapterSidebar`. |
| `PrayerPassage` | ספר, פרק, `verse`, `verse_end`, כותרת ותפילה בשתי שפות, מקור. `verse=0`/ללא פסוק עשוי לציין פרק שלם/תפילת סיום בהתאם לנרמול. | משויכת למיקום תנ״כי; נקראת ב־`prayerPassages.js` ובממשק הקורא. |
| `CrossReference` | מיקום המקור (`book_number/chapter/verse`), מיקום היעד (`ref_book_number/ref_chapter/ref_verse` וכן שדות יעד נוספים לפי הסכמה), טקסט והערות בשתי שפות. | מקושרת לפסוק מקור ולפסוק יעד לפי מספרים; לא נראה FK קשיח. |
| `Commentary` | `book`, `chapter`, `title`, `body_en`, `body_lu`. | תוכן לימודי לפי פרק. |
| `Insight` | `kind`, `title`, `passage`, `excerpt`, `body`, `share_count`. `kind` הוא תיאולוגי/היסטורי. | עשוי להתייחס לספר או passage דרך טקסט הפניה. |
| `StrongEntry` | קוד Strong’s, שפה, מילה מקורית, תעתיק, הגייה, חלק דיבר, שורש, הגדרה ומקור. | הקוד מקושר לסמן בטקסט KJV+; נשמר גם ב־offline. |

## 5.2 תוכן עריכתי

| Entity | מטרה ושדות מרכזיים | קשרים |
|---|---|---|
| `Prayer` | `title`, `title_lu`, `category`, גופי תפילה EN/LU, `scripture_ref`, `cross_refs`. | עשוי להיות מוצג לפי הפניה או קטגוריה. |
| `Devotional` | `code`, כותרות, הפניה, פסוק, גוף ותפילה בשתי שפות, `topic`, `series`, `date`, cover, `featured`, `active`. | קשור ל־topic ול־plan בעיקר לפי שמות/קוד; `DevotionalSaved` ו־`DevotionalProgress` מפנים אל `code`. |
| `DevotionalTopic` | `name_en`, `name_lu`, `active`. | משויך ל־`Devotional.topic` בעיקר לפי שם, לא ניכר FK. |
| `DevotionalPlan` | שם באנגלית/לוגנדה, תיאור, מספר ימים, active. | devotional מזוהה בפאנל גם לפי שם סדרה; יש לבדוק התאמת מודל בין `series` לבין תוכנית. |
| `VerseOfDay` | תאריך, הפניה, טקסט EN/LU והערה. | נבחר לפי `verse_date`. |
| `QAItem` | נושא EN/LU, `topic_id`, הפניה, שאלה ותשובה בשתי שפות, tags ודגלי תצוגה לפי הסכמה המלאה. | נושא דרך `topic_id` ו/או `topic_en`; ה־UI משתמש בשמות נושא. |
| `QATopic` | `name_en`, `name_lu`, תיאורים בשתי שפות ו־active. | אחד לרבים לוגית מול `QAItem`. |
| `QAEntry` | שאלה שהוגשה על ידי קורא, קטגוריה, תשובה, הפניה, עונה, סטטוס ומייל מחבר. | שונה מ־`QAItem`, שהוא תוכן הספרייה הציבורית. אין לאחד ביניהם ללא בדיקת שימושים. |
| `VerseSongSeries` | שם, תיאור, thumbnail/cover, accent ו־active. | סדרה אחת מכילה מספר `VerseSongEpisode`; בקוד נעשה שימוש בשם סדרה. |
| `VerseSongEpisode` | `series_name`, title, ספר/פרק/פסוק, שפה, גרסה, משך, קישורי מדיה, מילים וסדר לפי הסכמה המלאה. | משויך לסדרה לפי `series_name`; הפאנל הציבורי בונה מהם אינדקס ותור. |
| `LiveSession` | כותרת, תאריך, מארח, קישור הצטרפות ותיאור. | תוכן עצמאי. |
| `DiscussionGroup` | שם, תיאור, לוח זמנים ומספר חברים. | הודעות `DiscussionThread` מקושרות לוגית באמצעות `group_name`. |
| `DiscussionThread` | שם קבוצה, email בעלים, שם כותב, כותרת וגוף. | הודעה בקבוצה לפי `group_name`. |
| `Revelation` | בעלים, שם כותב, כותרת, passage, גוף, likes ו־`parent_id`. | `parent_id` משמש לקישור תגובה לפרסום; רשומות ללא parent הן פרסומים ראשיים. |
| `ContactMessage` | שם, אימייל, נושא, הודעה, `is_read`, reply. | נוצר ציבורית ומנוהל על ידי admin. |

## 5.3 נתוני משתמש והתקדמות

| Entity | מטרה ושדות מרכזיים | קשרים |
|---|---|---|
| `Reading` | בעלים, ספר, פרק, translation, plan day, תאריך, status, reflection, prayer point ו־highlighted verses. | מקושר ליום תוכנית לפי ספר/פרק ולמשתמש לפי email. |
| `ReadingActivity` | בעלים, סוג פעילות, ספר/מספר ספר/פרק/פסוק. | רשומות רבות למשתמש; מוצגות ב־`ActivityFeed`. |
| `StudyMark` | בעלים, סוג mark, מיקום תנ״כי, צבע ו־`note_text`. | marks של פסוקים; נצרכים ב־`BibleNotes` ובקורא. |
| `StudyAnnotation` | בעלים, ספר, section, block, kind, צבע ו־offsets. | סימון של טווח טקסט בתוך block מסוים; נשמר גם מקומית. |
| `JournalEntry` | בעלים, תאריך, כותרת, גוף, קטגוריה, ספר, פרק ו־mood. | רשומות אישיות של משתמש. |
| `PrayerSaved` | בעלים ו־`prayer_title`. | סימניה לפי כותרת תפילה. |
| `DevotionalSaved` | בעלים, `devotional_code`, תאריך שמירה. | מקושר ל־`Devotional.code`. |
| `DevotionalProgress` | בעלים, `devotional_code`, תאריך השלמה. | מקושר ל־`Devotional.code`. |

## 5.4 ניהול ותצורה

| Entity | מטרה ושדות מרכזיים | קשרים |
|---|---|---|
| `AdminAccount` | אימייל, `password_hash`, `salt`, `secret`, `session_version`, תאריך עדכון. | משמש מנגנון login/session של מנהל; רגיש במיוחד. |
| `ActivityLog` | actor, action, section, detail. | לוג של פעולות CMS. |
| `SiteSettings` | `setting_key`, `setting_value`. | הגדרות גלובליות כגון שם, צבעים וקישור תרומה. |

### הרשאות והגנת נתונים

הגדרת `x-fse2-access` בכל entity היא חלק מהמודל התפעולי ולא תיעוד בלבד:

- יש entities עם קריאה ציבורית וכתיבה למנהל בלבד.
- נתוני משתמש כגון יומן/סימונים/התקדמות משתמשים ב־roles של authenticated/user, ובחלק מהסכמות מצוינת גישת בעלים.
- יש לבדוק בקפידה ש־`owner_email` מסונן ואכיפת הרשאות מתבצעת בשרת, ולא רק באמצעות `.filter()` בצד הלקוח.
- `QAEntry` ו־`QAItem` הם שני מודלים שונים; שינוי אחד אינו בהכרח משנה את האחר.
- קשרים רבים נשמרים לפי שם, email או code ולא דרך FK. שינוי שם סדרה/נושא עלול להשאיר רשומות קשורות עם ערכים ישנים.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 קריאת פרק תנ״ך

1. המשתמש פותח `BibleReader`.
2. `lib/bibleBooks.js` מספק את רשימת הספרים המקומית.
3. המשתמש בוחר ספר ופרק דרך `ChapterSelector` ו־`ChapterGrid`.
4. `pages/Chapter.jsx` קורא את `book`, `chapter`, שפה ומהדורה מה־URL ומהמצב.
5. `lib/bibleApi.js` מנסה להביא פרק דרך הנתיב המתאים, ובודק cache/offline לפי המימוש.
6. `Chapter` מציג פסוקים ורכיבים נלווים: `VerseActionBar`, `ChapterSidebar`, `PassageTabs`, `VerseCrossRefs` ותפילת סיום.
7. המשתמש יכול לשמור mark, לכתוב note, לפתוח הפניה, לשתף או לסמן קריאה.
8. כאשר המשתמש מחובר, נתוני משתמש עשויים להישמר ב־entities; במקביל חלק מהסימונים נשמרים מקומית.

**נקודות בדיקה בדיבאג:** בדקו את query params, `versionId`, שפת הפרק, cache ב־IndexedDB, תשובת מקור התנ״ך ומדיניות גישה לנתוני המשתמש.

## 6.2 שמירת סימונים והערות

- סימון טווח טקסט ב־sidebar/הקדמת ספר נעשה דרך `AnnotatedText`.
- offsets נשמרים מול `block_id`, ספר, section וסוג הסימון.
- `studyAnnotations.js` ממזג נתוני שרת ונתונים מקומיים כדי לאפשר עבודה לאורח/offline.
- סימון של פסוק נפרד נשמר ב־`StudyMark`, עם `mark_type` כמו highlight, bookmark או note.
- `BibleNotes` מרכז את הסימונים ומקשר חזרה לפרק/פסוק.
- יש להבחין בין **StudyAnnotation** (טווח תווים בטקסט לימודי) לבין **StudyMark** (פעולה על פסוק).

## 6.3 שמירת התקדמות קריאה

1. המשתמש פותח פרק.
2. `Chapter` מזהה אם הספר/פרק שייכים ל־`ReadingPlan`.
3. `lib/readings.js` מוצא יום תוכנית מתאים.
4. המשתמש מסמן השלמה או שומר התקדמות.
5. נוצרת/מתעדכנת רשומת `Reading`, ובמידת הצורך נרשמת פעילות ב־`ReadingActivity`.
6. `Plan` ו־`Dashboard` מחשבים ימים שהושלמו ורצף קריאה מתוך הרשומות.

## 6.4 ספריית devotional

1. `Devotionals` טוען תוכן ציבורי דרך `fetchPublicCollection`.
2. אם התוכן החי חסר או חלקי, נעשה שימוש ב־`DEVOTIONALS` מקומי וב־helpers מתוך `lib/devotionals.js`.
3. המשתמש מסנן לפי שפה, חיפוש, נושא, סדרה וטווח.
4. פתיחת כרטיס מציגה `DevotionalFullView`.
5. שמירה והשלמה מנוהלות ב־`useDevotionalLibrary`: localStorage/אחסון מקומי, ובמשתמש מחובר גם entities.
6. שיתוף נבנה בעזרת `buildDevotionalShareText` ו־`ShareSheet`.

**חשוב:** קוד הממשק תומך בשמות שדות חדשים וישנים, כדי שרשומות legacy לא ייעלמו. שינוי סכמת devotional צריך להתבצע יחד עם helpers, טפסי CMS, bulk import, API ו־seed.

## 6.5 ייבוא תוכן מנהל

תבנית נפוצה ב־CMS:

1. מנהל נכנס דרך `Admin`.
2. `adminSession.js` בודק/מחדש session.
3. פאנל CMS טוען רשומות.
4. טופס או קובץ עוברים validation.
5. הממשק שולח פעולה דרך `callAdminData` או SDK.
6. `adminContent.js` או `adminDirect.js` מבצעים את הפעולה.
7. יבוא משתמש ב־natural keys כדי לבצע upsert ולצמצם כפילויות.
8. הממשק מציג notice/report ומרענן נתונים.

### משפחות יבוא

- `JsonImportPanel`  -  JSON לפי collection, עם aliases ומפתחות טבעיים.
- `PrayerCrossRefImport`  -  קובצי תפילות והפניות מקבילות, כולל קובצי ספר.
- `DevotionalBulkImport`  -  JSON בפורמט `pray-read-devotionals-v1`.
- `QaBulkImport`  -  JSON בפורמט `pray-read-qa-v1`.
- `VerseSongBulkImport`  -  JSON בפורמט `pray-read-verse-songs-v1`.

לפני הרחבת יבוא, יש לבדוק:
- האם הקלט הוא מערך או `{ rows: [...] }`.
- שמות שדות ישנים וחדשים.
- natural key ותנאי עדכון.
- כללי אימות ו־error reporting.
- האם פעולות create/update מוגנות בשרת.
- האם נדרש refresh ל־React Query/מצב המקומי.

## 6.6 התקנת מקורות התנ״ך

- `LugandaInstaller` ו־`KjvPlusInstaller` קוראים לפונקציות שרת ייעודיות.
- לפני כל פעולה הקוד מרענן token מנהל, כדי לא לקטוע התקנה ארוכה.
- הפונקציות בודקות פרקים קיימים ומנסות להתקין חסרים.
- `scriptureAudit` מדווח על coverage ומספר פסוקים; `LibraryReport` אינו אמור לשנות נתונים.
- `cron/scriptureInstall.js` מריץ השלמות מחזוריות ומנסה שוב בפרקים שלא הותקנו.
- `ChapterCoverage` מציג פרקים מוכנים, חסרים ופגומים בצורה מרוכזת.

## 6.7 שירי פסוקים ונגן גלובלי

1. `VerseSongs` טוען `VerseSongSeries` ו־`VerseSongEpisode`.
2. `lib/verseSongs.js` בונה אינדקס, מפיק תור ומשייך שיר לסדרה.
3. לחיצה על כרטיס מעבירה תור ל־`PlayerProvider`.
4. ה־Provider מנהל `Audio` יחיד לאורך חיי האפליקציה.
5. `GlobalPlayer` מופיע בכל עמוד דרך `Layout`, ולכן הניגון ממשיך במעבר בין עמודים.
6. ניתן לשנות volume/speed, לדלג, להפעיל shuffle/repeat ולצמצם את הנגן.

**נקודת דיבאג:** בדקו `audio_url`, `current`, `queue`, `index`, מצב `playing` ו־`error` ב־PlayerContext.

## 6.8 קהילה

- פרסומי `Revelation` הראשיים מסוננים לפי `parent_id` חסר; תגובות הן רשומות עם `parent_id`.
- הפעולות לפרסום/תגובה/like עוברות דרך `contentApi`.
- `DiscussionGroups` טוען קבוצות והודעות בנפרד; שם הקבוצה משמש קשר לוגי.
- חברות בקבוצה נראית בחלקה מקומית דרך localStorage, לפי ה־state של העמוד.
- `LiveSession` הוא תוכן תצוגה; חלק מהעמודים משלבים רשומות seed עם תוכן חי.

## 6.9 Offline ו־PWA

- `offlineDb.js` מנהל IndexedDB בשם `prayread-offline`.
- הגרסה הנראית בקוד היא `DB_VERSION = 9`; הוספת store או שינוי מבני דורשים הגדלת גרסה והגירת DB.
- `Offline` מנהל הורדות ומחיקות של stores.
- `bibleApi.js` וקובצי תוכן נוספים יכולים להשתמש בעותק המקומי.
- `PwaHead` מגדיר manifest ומרשם service worker.
- `public/sw.js` שומר shell/runtime caches.
- localStorage משמש גם להעדפות/מצבי משתמש מסוימים; אין להניח שכל נתון מקומי נמצא ב־IndexedDB.

---

# 7. הערות טכניות לפיתוח

## 7.1 ספריות ותשתיות שניתן לזהות

- **React**  -  רכיבי פונקציה ו־Hooks.
- **React Router**  -  `Link`, `useNavigate`, `useSearchParams`; יצירת קישורים דרך `createPageUrl`.
- **TanStack React Query**  -  `useQuery`, `useMutation`, `useQueryClient` לטעינה, mutations, caching ו־refresh.
- **FSE2 SDK**  -  `fse2.entities`, `fse2.auth`, `fse2.functions.invoke`, `fse2.integrations.Core.UploadFile`.
- **Lucide React**  -  אייקונים.
- **date-fns**  -  עיצוב תאריכים וזמנים.
- **IndexedDB**  -  אחסון offline דרך `offlineDb.js`.
- **localStorage**  -  session/העדפות/נתוני לקוח מסוימים.
- **Service Worker ו־Web App Manifest**  -  PWA.
- **Tailwind CSS שנוצר** לצד מערכת CSS מותגית (`BRAND_CSS`).

## 7.2 דפוסים חוזרים

### טעינת collection

עמודים רבים משתמשים בתבנית:

```text
useQuery או useEffect → fetchPublicCollection / fse2.entities.* → state/UI
```

במנהל, דפוס נפוץ הוא:

```text
callAdminData("list", { entity, limit }) → rows → form → create/update/delete
```

התגובה יכולה להיות מערך ישיר או `{ rows: [...] }`; חלק מהפאנלים כוללים `rowsOf` כדי לתמוך בשתי הצורות.

### Seed לצד תוכן שרת

בחלקים רבים תוכן seed משמש כ־fallback או מתווסף לתוכן החי. יש לבדוק בכל עמוד אם הוא:
- מחליף seed כאשר יש נתונים חיים;
- ממזג seed ורשומות חיות;
- ממזג לפי title או מזהה אחר.

אין להניח שכל seed מוצג תמיד או שהשרת תמיד מנצח.

### נרמול שדות legacy

יש helpers שמבינים שמות שדות ישנים וחדשים, במיוחד ב־devotionals, prayer imports ותוכן דו־לשוני. יש לשמר תאימות לאחור עד שהנתונים הועברו בפועל.

### Natural keys במקום FK

ייבוא ויחסים בין רשומות משתמשים לעיתים בקוד, שם, הפניה או מיקום תנ״כי. לפני שינוי שם של סדרה/נושא/כותרת, בדקו איך נבנים הקשרים ואיך ה־upsert מתבצע.

## 7.3 הנחיות להוספת פיצ׳ר

1. **ממשו את מסלול הנתונים לכל אורכו:** entity/schema → API → helper → hook/query → page/component → seed/offline/import, לפי הצורך.
2. **הפרידו נתוני תוכן מנתוני משתמש.** פרטי משתמש צריכים להיות מסוננים ומוגנים בשרת.
3. **הגדירו query keys יציבים.** קיימים מפתחות כגון `["readingPlan"]`, `["insights", kind]`, `["readingActivity", email]`. לאחר mutation יש לבצע invalidate/refetch נכון.
4. **טפלו בכל המצבים:** טעינה, שגיאה, מצב ריק, הצלחה, מצב busy וללא התחברות.
5. **שמרו תמיכה דו־לשונית.** אין למלא את שדה LU מתוך EN אוטומטית; `lib/bilingual.js` מגדיר במפורש התנהגות זו.
6. **הוסיפו fallback מקומי כשנדרש.** תוכן ציבורי רב נשען על seed ועל עבודה offline.
7. **בדקו URL ו־deep links.** עמודים רבים תלויים ב־query params. שינוי שם עמוד או פרמטר עשוי לשבור קישורים שכבר מופצים.
8. **השתמשו בקומפוננטות המשותפות** `Modal`, `ConfirmDialog`, `EmptyState`, `Spinner`, `ShareSheet` במקום ליצור וריאציות לא אחידות.
9. **שמרו נגישות:** `aria-label`, `aria-pressed`, role של dialog וניווט מקלדת כבר קיימים בחלק מהרכיבים.
10. **עדכנו IndexedDB בזהירות.** שינוי ל־`STORES` ב־`offlineDb.js` מחייב בדיקת version upgrade ומעבר על מכשירים עם DB ישן.

## 7.4 אבטחה וסיכונים שיש לבדוק לפני שינוי

- בקוד של `functions/adminAuth.js` מופיעה הערה על סיסמת ברירת מחדל ו־reset key ברירת מחדל. יש להתייחס לכך כאל **סיכון אבטחה**: לוודא שהערכים אינם פעילים בסביבת production, להגדיר secrets ייעודיים, לשנות פרטי גישה ולוודא שלא נחשפו בפומבי.
- `AdminAccount` מכיל `secret`, `password_hash` ו־`salt`. אין להעביר אותם ללקוח או להציגם בלוגים.
- SHA-256 עם salt אינו תחליף אוטומטי ל־KDF ייעודי לסיסמאות. לפני שינוי מנגנון אימות, יש לבדוק את יישום השרת המלא, תאימות בין לקוח לשרת ותהליך הגירה.
- `adminDirect.js` מריץ פעולות ישירות דרך SDK בהרשאות המשתמש המחובר. יש לוודא שמדיניות ה־entity אינה מאפשרת עקיפת הרשאות.
- הפונקציות להתקנת תנ״ך מקבלות session או install key. יש לבדוק שה־install key מוגן ואינו נשלח לדפדפן.
- פרטי משתמש מופיעים בחלק מהקריאות דרך `owner_email`. סינון UI לפי email אינו תחליף להרשאות row-level בשרת.
- בעת הצגת טקסט מה־DB יש להמשיך להשתמש בהצגה בטוחה; `safeText` אינו מאפשר HTML, אך יש לבדוק כל מקום שמשתמש ב־`dangerouslySetInnerHTML` אם יתווסף בעתיד.

## 7.5 נקודות דיבאג שימושיות

### עמוד אינו נטען או קישור שגוי
- בדקו את ה־router ואת המיפוי בפועל של `createPageUrl`.
- בדקו query params, בעיקר `book`, `chapter`, `verse`, `lang`, `series`, `song` ו־`token`.
- בדקו אם ה־page name שנשלח ל־`Layout.currentPageName` תואם לתנאים של ה־Footer.

### רשומות אינן מופיעות
- בדקו `fetchPublicCollection` והאם העמוד משתמש ב־seed, ממזג אותו או מחליף אותו.
- בדקו filters כגון `active`, תאריך פרסום, הרשאה ושם collection.
- בדקו אם התשובה היא מערך או `{ rows }`.
- בדקו אם סינון לפי שפה/נושא מבוסס על שדה חדש או legacy.

### שינוי CMS לא מופיע באתר
- ודאו שהכתיבה הצליחה ב־`callAdminData`.
- בדקו האם הפאנל מרענן את הרשימה אחרי mutation.
- בדקו את query key ב־React Query או state מקומי.
- בדקו אם `contentApi` ממיין או מסנן רשומות, למשל devotionals לפי active ותאריך.

### תוכן offline חסר
- בדקו `DB_VERSION`, את store הנכון, ואת `chapterKey`/מפתח הרשומה.
- בדקו אם העמוד קורא קודם מהרשת או קודם מה־cache.
- בדקו service worker cache מול IndexedDB  -  אלה שתי שכבות שונות.
- בדקו גרסאות מקומיות מותקנות ב־`versions.js`.

### פרק או שפה שגויים
- בדקו התאמה בין `book_number`, שם הספר, `chapter`, `language` ו־`versionId`.
- בדקו פורמט `verses` ב־`LugandaChapter`/`KjvPlusChapter`.
- בדקו אם המקור החיצוני שינה HTML/API או אם פונקציית הניקוי הסירה/שינתה תוכן.

### נגן לא פועל
- בדקו `audio_url`, את פורמט הקובץ, מצב CORS וגודל הקובץ.
- בדקו `queue`, `index`, `current` וה־`error` ב־`PlayerProvider`.
- בדקו שה־`GlobalPlayer` מרונדר תחת `PlayerProvider`.

## 7.6 קבצים שלא כדאי לערוך כתחליף לקוד מקור

- `__generated/tailwind.css`  -  קובץ שנוצר, שינוי בו עלול להידרס.
- `public/sw.js`  -  שינוי cache name או רשימת shell דורש בדיקת גרסאות ועדכון cache.
- `public/assets/**`  -  נכסים עשויים להיות מקושרים לפי נתיב/מזהה; החלפה בלי עדכון references תגרום לתמונות/תבניות שבורות.
- `__trash/**` ו־`__url_fetch/**`  -  קבצי בדיקה ותיעוד/איסוף מקורות, לא בהכרח חלק מהאפליקציה שרצה. יש לוודא שאינם מיובאים או רשומים ב־router לפני מחיקה או שחזור.

---

## סיכום ארכיטקטוני מהיר

```text
pages/
  עמודים וזרימות משתמש
    ↓
components/
  רכיבי UI לפי תחום
    ↓
lib/
  נרמול, helpers, טעינה, offline, auth, share, player
    ↓
api/fse2Client
  גישה ל־FSE2 entities, functions, auth ו־uploads
    ↓
entities/ + functions/ + cron/
  סכמות, הרשאות, API צד־שרת והתקנות מתוזמנות
```

נקודות הכניסה הטובות ביותר למפתח חדש:

1. `Layout.jsx`  -  להבין providers ומסגרת האתר.
2. `pages/BibleReader.jsx` ו־`pages/Chapter.jsx`  -  זרימת קורא התנ״ך.
3. `lib/bibleApi.js`, `lib/offlineDb.js`, `lib/versions.js`  -  מקור נתוני התנ״ך ו־offline.
4. `lib/contentApi.js` ו־`lib/seedContent.js`  -  קריאת תוכן ציבורי ו־fallback.
5. `pages/Admin.jsx`, `lib/adminSession.js`, `functions/adminAuth.js`  -  מנהל והרשאות.
6. `lib/adminCollections.js`, `components/admin/RecordEditor.jsx`  -  הרחבת CMS גנרי.
7. `entities/*.json`  -  שדות והרשאות הנתונים לפני הוספת או שינוי פיצ׳ר.
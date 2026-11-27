# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

> **הערת תחום:** התיעוד מבוסס על הקוד שסופק. חלק מהקבצים מוצגים עם `[נחתך]`, ולכן שמות פעולות פנימיות מסוימים מסומנים כמשוערים. כתובות ה־URL מוצגות כנתיבים לוגיים שנוצרים דרך `createPageUrl`; בהתקנה אמיתית הפלטפורמה עשויה להוסיף prefix משלה.

---

## 1. מהות המערכת

### 1.1 תיאור כללי

**Pray-Read Bible** היא אפליקציית קריאה, מדיטציה ותפילה דו-לשונית, המיועדת לקוראי מקרא בעברית ובלוגanda. המערכת מחברת בין כמה תחומים שבדרך כלל מוצגים באפליקציות נפרדות:

- קריאת תנ"ך פרק־פרק.
- מערכת לימוד והערות בקריאת התנ"ך.
- תפילות, מערכות פסוקים והפניות צלב.
- קונקורדנציה והגדרות מילים יווניות ועבריות לפי Strong’s.
- מכירות יומיות.
- ספריית תפילות.
- ספריית Q&A דו־לשונית.
- שירים מבוססי פסוקים עם נגן גלובלי.
- קהילה, הודעות, גילויים ודיונים בקבוצות.
- יומן תפילה, תוכנית קריאה ומעקב התקדמות.
- מרכז נתונים להורדה והפצה מקוומית.
- ממשק ניהול תוכן מלא לעורכים ולמנהלים.

### 1.2 קהל היעד

1. **קוראים יומיים** המחפשים פסוק או תפילה קצרה המותאמת לשפה ולתאריך.
2. **קוראי תנ"ך עמוקים** המחפשים פרק מלא עם הערות, פירושים, מערכות פסוקים והפניות צלב.
3. **משפחות, קהילות וקבוצות לימוד** המשתמשים בתוכנית הקריאה, השירים, הקבוצות והדיונים.
4. **משתמשים ללא חשבון** המשתמשים ברוב התכנים; חשבון נדרש רק לשמירה עקבית בין מכשירים.
5. **עורכי תוכן ומנהלי מערכת** המעלים תנ"ך, מחכירות, תפילות, סיפורים, שירים, Q&A והגדרות Strong’s.

### 1.3 הערך שהמערכת מספקת

- **קריאה ללא חיבור:** פרקים שהורדו נשמרים ב־IndexedDB ונפתחים גם ללא רשת.
- **המשכיות בין מכשירים:** סימונים, הערות, תפילות שמורות, מכירות והתקדמות נשמרים בשרת כאשר המשתמש מחובר.
- **לימוד רב־ממדדי:** פסוק, פרק, ספר, אנקדוטה, הערה, הגדרת מילה, מערכת פסוקים, הפניית צלב ופירוש ניתנים לפתיחה זה מתוך זה.
- **נגן גלובלי:** השמעת שיר נמשכת בעת מעבר בין עמודים.
- **תוכן עמיד:** כאשר מסד הנתונים ריק או אינו זמין, האפליקציה משתמשת ב־seed content מקומי.
- **עבריות ולוגנדית:** רוב התוכן העורך נשמר בשתי שפות, והמשתמש יכול לבחור EN, LU או BOTH.
- **שקיפות תוכן:** אפשר לראות אילו פרקים חסרים או פגומים, ולהפעיל התקנה חוזרת ובטוחה.

### 1.4 ארכיטקטורה

המערכת בנויה כיישום React חד־דפי עם מספר שכבות:

| שכבה | תפקיד |
|---|---|
| `pages/` | מסכי מסלול מרכזיים והרכבת חוויית המשתמש |
| `components/` | רכיבי UI חוזרים לפי תחום |
| `lib/` | לוגיקת עסק, נתונים, תקשורת, PWA, offline ועיצוב |
| `entities/` | הגדרות מסד הנתונים והרשאות גישה |
| `functions/` | API צד־שרת, התקנות תנ"ך, audit והגדרות Strong’s |
| `cron/` | התקנה אוטומטית חוזרת של המרחבים החסרים |
| `public/` | Manifest, service worker, תמונות וקבצי תבנית |
| `__trash/`, `__url_fetch/` | חומר ארכיון, בדיקות זמניות ותיעוד מחקר; אינם חלק מהאפליקציה הפעילה |

מקורות האמת:

- **שרת:** ישויות `fse2.entities`.
- **צד לקוח:** `localStorage` ו־`IndexedDB`.
- **תוכן ברירת־מחדל:** `lib/seedContent.js` ומאגרים סטטיים דומים.
- **שכבת תקשורת:** React Query לריבוי פרטים, SDK ישיר לפעולות משתמש, ו־functions לפעולות ציבוריות או מנהליות.

---

# 2. עמודים ותפקידיהם

## 2.1 קריאה, תוכן ולימוד

| עמוד | כתובת URL לוגית | תפקיד וערך | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Home** | `/` | דף הכניסה והמרכז השיווקי של האפליקציה. מציג את המכירה היומית, ערכי תוכן עיקריים ודרכי כניסה לאזורים שונים באפליקציה. | כפתורי CTA ל־Bible Reader ול־Dashboard, כפתורי תפילה, מכירה יומית, שיתוף, הרשמה/כניסה, מעבר לחברת תפילות, מכירות, Q&A, שירים וקהילה. |
| **About** | `/About` | מסביר את תכלית Pray-Read, את הגישה הפאסטורלית־לקוראת המקרא ואת הקהילה שסביב הפרויקט. | קישור חזרה לדף הבית, קריאת ערכים, קישורי CTA לפעילות מרכזיות. |
| **BibleReader** | `/BibleReader` | מסך בחירת הספר והפרק עבור כל 66 ספרי הברית, עם חיפוש בעברית ובלוגanda. קיים כדי להפריד בין בחירת הספר לבין קריאת הפרק עצמו. | חיפוש ספר, החלפה בין ברית קדמונה לחדשה, תצוגת מספר פרקים, סימון ספר שזמין לקריאה לאופליין, בחירת פרק. |
| **Chapter** | `/Chapter?book=43&chapter=3&verse=16&lang=lu` | מסך הקריאה המרכזי. מציג פרק מלא, מערכת פסוקים, הערות, הפניות צלב, מערכות תפילה, פירושים, insights, Strong’s ותפילת סיום. | בחירת פסוק, החלפת תרגום, סימון, סימון קישור, כתיבת הערה, שיתוף, הערפה, קריאת מוקד, פתיחת פסוקים אחרים, סימון כ־read, מעבר בין פרקים. |
| **Devotionals** | `/Devotionals` ולחלופין `?code=<code>` | ספריית המכירות היומיות. מציג מכירת היום, מכירות קודמות, חיפוש וסינון לפי שפה, נושא, סדרה ותאריך. | החלפת שפה, חיפוש, בחירת נושא/תאריך/סדרה, פתיחת מכירה מלאה, שמירה, סימון כ־read, שיתוף. |
| **PrayerLibrary** | `/PrayerLibrary` | ספריית התפילות הציבורית. מאפשרת חיפוש וסינון תפילות, קריאתן ושמירתן. | חיפוש, בחירת קטגוריה, החלפת שפה, קישור לפסוק, שמירה/הסרה מהמועדפים, שיתוף. |
| **QA** | `/QA?lang=en&topic=All&letter=A&search=...` | ספריית Q&A דו־לשונית המסודרת לפי אות, נושא ומילת חיפוש. התשובות מוסתרות כדי לשמור על קריאה נוחה בנייד. | סינון שפה/אות/נושא, חיפוש, פתיחת תשובה, הצבעת העזרה, הצבעת אי־עזרה, העתקה, שיתוף, קישור לפסוק. |
| **TheologicalInsights** | `/TheologicalInsights` | מציג insights תיאולוגיים לפי נושא, פסוק ומילת חיפוש. | חיפוש, פתיחת כרטיס, קישור למקרא, שמירה מקומית, שיתוף. |
| **HistoricalInsights** | `/HistoricalInsights` | אותו מנגנון כשלעצמו, אך עם תוכן היסטורי. | חיפוש, פתיחת כרטיס, קישור למקרא, שמירה ושיתוף. |
| **VerseOfDay** | `/VerseOfDay` | מציג פסוק מומלץ לפי התאריך, עם גרסה דו־לשונית והערה. | בחירת פסוק לפי תאריך, קישור לפרק, שיתוף. |
| **Plan** | `/Plan` | תוכנית קריאה בת 30 יום המובילה דרך יוחנן ומזמורים. מציג התקדמות, יום נוכחי וימים עתידיים. | מעבר לפרק היום, סימון יום כהושלם דרך דף הקריאה, חישוב streak ואחוז השלמה. |
| **Journal** | `/Journal` וכן `?new=1&book=43&chapter=3` | יומן תפילה אישי המאפשר לכתוב התרשמות, תפילות, הודאות והכרות. | יצירה, עריכה, מחיקה, סינון לפי קטגוריה, קישור לפסוק, שמירה מקומית ובשרת. |
| **BibleNotes** | `/BibleNotes` | מרכז ההערות האישיות: highlights, bookmarks והערות שנשמרו על פסוקים. | סינון לפי סוג, מעבר לפסוק המסומן, הצגת הערה, מחיקה. |
| **Dashboard** | `/Dashboard` | לוח אישי המציג התקדמות קריאה, מכירות, שירורים, פעילות אחרונה, מדדי offline וקיצורי גישה. | מעבר לפעילויות, צפייה ב־activity feed, בדיקת storage, המשך/ניתוק offline ושיתוף. |
| **Community** | `/Community` | דף מרכזי של הקהילה המפנה לשלושה מרכזים: גילויים, לימוד חי וקבוצות דיון. | בחירת hub, פתיחת פוסטים או שידורים קרובים, מעבר לדיונים. |
| **CommunityRevelations** | `/CommunityRevelations` | מאפשר לקוראים לשתף עדות או גילוי אישי ולקבל משוב דרך סימון “לייק” ותגובות. | פרסום גילוי, לייק, פתיחת תגובות, הוספת תגובה, מעבר להתחברות. |
| **CommunityLiveTeaching** | `/CommunityLiveTeaching` | מציג מפגשי הוראה חיים עם מועד, מנחה וקישור הצטרפות. | פתיחת לוח מפגשים וקישור להצטרפות. |
| **DiscussionGroups** | `/DiscussionGroups?group=<name>` | מאפשר לקראים להצטרף לקבוצות לימוד ולשוחח בהן הודעות. | בחירת קבוצה, הצטרפות/עזיבה, קריאת היסטוריית שיחה, שליחת הודעה. |
| **VerseSongs** | `/VerseSongs?series=<id>&song=<id>` | ספריית שירי מקרא עם חיפוש, סינון לפי סדרה וספר, השמעה, הורדה ושיתוף. | השמעה/עצירה, הורדת שיר, בחירת סדרה/ספר, חיפוש, שיתוף. |
| **VerseSongSeries** | `/VerseSongSeries?series=<id>` | מציג את רשימת הסדרות; עם `series` מציג את השירים בסדרה שנבחרה. | פתיחת סדרה, השמעת תור, הורדה ושיתוף. |
| **Offline** | `/Offline` | מרכז הורדה וניהול מקור מקומי לפרקים, פסוקים, Strong’s, מכירות, תפילות, Q&A ועוד. | הורדת חלקים לפי קטגוריה, בחירת תרגום, הצגת storage, מחיקת cache וניקוי כל הנתונים. |
| **InstallPrompt** | `/InstallPrompt` | מסביר כיצד להתקין את האפליקציה כ־PWA במכשירים ניידים ובמחשב. | התקנה דרך `beforeinstallprompt`, זיהוי מערכת הפעלה, הצגת מצב מותקן. |

## 2.2 קשר, תקשורת ושליטה

| עמוד | כתובת URL לוגית | תפקיד וערך | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Contact** | `/Contact` | טופס יצירת קשר עם האחראים. | שם, אימייל, נושא והודעה; בדיקת תקינות בסיסית; שליחה ל־`ContactMessage`; הצגת הצלחה או שגיאה. |
| **Login** | `/Login` | כניסת קורא רגיל לחשבון. | אימייל וסיסמה, כניסה דרך `fse2.auth.login`, הפנה ל־Dashboard. |
| **Signup** | `/Signup` | הרשמת קורא חדש. | שם, אימייל, סיסמה, אישור סיסמה, קבלת תנאי שימוש, בדיקת חוזק סיסמה, אימות דוא"ל או כניסה מיידית. |
| **ForgotPassword** | `/ForgotPassword` | התחלת שחזור סיסמה. | אימייל, שליחת בקשת שחזור, הודעה ניטרלית שלא חושפת אם קיים חשבון. |
| **ResetPassword** | `/ResetPassword?token=<token>` | קביעת סיסמה חדשה מתוך token באימות. | אימות התאמת הסיסמאות, אורך מינימלי, קריאה ל־`resetPassword`, הודעת הצלחה. |
| **Logout** | `/Logout` | יציאה מהחשבון וחזרה לדף הבית. | מציג סטטוס יציאה קצר, מנקה את ההתעדות ומבצע redirect. |
| **Privacy** | `/Privacy` | מסביר מה נשמר בשרת, מה נשמר מקומית ומה אינו נמסר לצד שלישי. | קריאת מדיניות וקישור חזרה. |
| **Terms** | `/Terms` | מציין תנאי שימוש, זכויות תוכן והתייחסות למקורות תנ"ך. | קריאת תנאים וקישור חזרה. |

## 2.3 ניהול תוכן

| עמוד | כתובת URL לוגית | תפקיד וערך | פעולות ואינטראקציות מרכזיות |
|---|---|---|---|
| **Admin** | `/Admin` | מסך כניסת מנהל ושחזור סיסמה. קיים כדי להפריד בין מנהל התוכן למשתמש רגיל. | כניסה, בדיקת session קיים, שחזור סיסמה באמצעות reset key, ניווט ל־AdminDashboard. |
| **AdminDashboard** | `/AdminDashboard` | מרכז ה־CMS. מאפשר לנהל מכירות, תפילות, קטעי מקרא, Q&A, שירים, insights, התקנות והגדרות. | מעבר בין sections, טעינת רשומות, הוספה/עריכה/מחיקה, ייבוא JSON, התקנת מרחבים, הרצת audit, ניהול הודעות, פעילות, ערכת נושא והגדרות. |

ה־AdminDashboard כולל לפחות את האזורים הבאים:

- **Dashboard / Overview**  -  מדדי תוכן, פעילות וסטטוס מערכת.
- **Books & Chapters**  -  ניהול רשומות תנ"ך וכללי collections.
- **Luganda Bible**  -  התקנה וביקורת מרחבי לוגanda.
- **KJV+ with Strong’s**  -  התקנת פרקי KJV+ ומילון Strong’s.
- **Devotionals**  -  מכירות, נושאים, תוכניות וייבוא מרוב.
- **Prayers / Passages**  -  ספריית תפילות, מערכות פסוקים, הפניות צלב, מבואי פרקים ומבואי ספרים.
- **Verse Songs**  -  שירים, סדרות וייבוא מרוב.
- **QA**  -  שאלות, נושאים וייבוא מרוב.
- **JSON Import / Settings / Activity / Messages**  -  ניהול תכנים והגדרות כלליים.

---

# 3. מפת ניווט לצורכי DEBUG

## 3.1 ניווט ציבורי

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת קורא המקרא | `Home` | Get started / Bible Reader | `BibleReader` |
| פתיחת מכירה | `Home` | כרטיס המכירה היומית | `Devotionals` או תצוגת מכירה מלאה |
| בחירת ספר | `BibleReader` | כרטיס ספר | `Chapter?book=<number>&chapter=1` |
| בחירת פרק | `BibleReader` | תא מספר פרק | `Chapter?book=<number>&chapter=<n>` |
| החלפת שפת קריאה | `Chapter` | בורר EN/LU/BOTH | אותו פרק עם `lang=lu` או ללא פרמטר |
| בחירת תרגום | `Chapter` | VersionPicker | אותו פרק; התרגום הפעיל נשמר מקומית |
| פתיחת פעולות פסוק | `Chapter` | לחיצה על פסוק | `VerseActionBar` |
| פתיחת תפילת פסוק | `Chapter` | Prayer | `PassagePrayer` |
| פתיחת הפניות צלב | `Chapter` | Cross-refs | `VerseCrossRefs` / `CrossRefList` |
| פתיחת פירוש ו־insights | `Chapter` | Commentary / Resources | `PassageTabs` / `ChapterResourcesPanel` |
| פתיחת ספר בחלונית | `Chapter` | לחיצה על פסוק מהפניה | `VersePopup` |
| פתיחת מבוא ספר | `BibleReader` | Book Intro | `BookIntro` בתוך `BookSidebar` |
| פתיחת מבנה ספר | `BibleReader` | Book Outline | `BookOutline` בתוך `BookSidebar` |
| פתיחת תפילת ספר | `BibleReader` | Book Prayer | `BookPrayerPanel` בתוך `BookSidebar` |
| שיתוף פסוק | `Chapter` | Share | `ShareSheet` |
| שיתוף מכירה | `Devotionals` / `Home` | Share | `ShareSheet` |
| שמירת מכירה | `Devotionals` | Save | המצב המקומי ו־`DevotionalSaved` |
| סימון מכירה כנקראה | `Devotionals` | Mark as read | `DevotionalProgress` |
| חיפוש תפילה | `PrayerLibrary` | שדה Search | רשימה מסוננת במקום |
| שמירת תפילה | `PrayerLibrary` | Bookmark | `PrayerSaved` |
| שיתוף תפילה | `PrayerLibrary` | Share | `ShareRow` / `openShare` |
| פתיחת אות ב־Q&A | `QA` | A - Z letter bar | רשימת שאלות מסוננת |
| פתיחת תשובת Q&A | `QA` | כרטיס שאלה | תשובה מתרחבת בתוך הכרטיס |
| הצבעת עזרה | `QA` | Thumbs up / down | `pr_qa_votes` ב־localStorage |
| העתקת Q&A | `QA` | Copy | Clipboard |
| שיתוף Q&A | `QA` | Share | `openShare` |
| מעבר לפסוק מ־insight | `InsightsBoard` | קישור Passage | `Chapter` |
| הצטרפות לקבוצה | `DiscussionGroups` | Join | localStorage + הודעת UI |
| שליחת הודעה בקבוצה | `DiscussionGroups` | טופס Message | `DiscussionThread` |
| פרסום גילוי | `CommunityRevelations` | Publish | יצירת `Revelation` |
| סימון לייק | `CommunityRevelations` | Like | עדכון `Revelation.likes` |
| תגובה | `CommunityRevelations` | טופס תגובה | יצירת `Revelation` עם `parent_id` |
| השמעת שיר | `VerseSongs` | Play | `PlayerProvider` |
| הורדת שיר | `VerseSongs` | Download | קובץ מקומי במכשיר |
| שיתוף שיר | `VerseSongs` | Share | `SongShareSheet` |
| פתיחת סדרה | `VerseSongSeries` | כרטיס Series | `VerseSongSeries?series=<id>` |
| הורדת תוכן ל־offline | `Offline` | Download section | IndexedDB לפי section/version |
| מחיקת offline | `Offline` | Clear / Delete | מחיקת stores רלוונטיים |
| התקנת PWA | `InstallPrompt` | Install | native browser prompt |
| כניסת משתמש | Header / Dashboard | Sign in | `Login` |
| הרשמת משתמש | Login / Header | Create account | `Signup` |
| שחזור סיסמה | Login | Forgot password | `ForgotPassword` |
| יציאה | Header / Dashboard | Sign out | `Logout` |

## 3.2 ניווט מנהל

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| כניסת מנהל | `Admin` | Sign in | `AdminDashboard` |
| פתיחת CMS | `Admin` | session קיים | `AdminDashboard` |
| החלפת section | `AdminDashboard` | תפריט sidebar | section פעיל בתוך הדף |
| טעינת collection | `AdminDashboard` | בחירת collection | `RecordEditor` |
| הוספת רשומה | Panel רלוונטי | Add | `RecordEditor` במצב חדש |
| עריכת רשומה | טבלת records | Edit | `RecordEditor` עם ערכים קיימים |
| מחיקת רשומה | טבלת records | Delete | `ConfirmDialog` |
| אישור מחיקה | `ConfirmDialog` | Delete | בקשת delete ל־entity |
| בניית טופס אוטומטי | `CollectionsPanel` | בחירת collection | `RecordEditor` לפי `COLLECTIONS` |
| ייבוא JSON כללי | `JsonImportPanel` | Upload | validation + preview + import |
| ייבוא קובץ ספר | `PrayerCrossRefImport` / `JsonImportPanel` | Upload book JSON | expansion לפי ספר ו־פרק |
| ייבוא מכירות | `DevotionalBulkImport` | Upload | validation + `Devotional` |
| ייבוא Q&A | `QaBulkImport` | Upload | validation + `QAItem` |
| ייבוא שירים | `VerseSongBulkImport` | Upload | validation + סדרות/אפיזודות |
| התקנת לוגanda | `AdminDashboard` | Install Luganda Bible | `LugandaInstaller` → `lugandaInstall` |
| התקנת KJV+ | `AdminDashboard` | Install KJV+ | `KjvPlusInstaller` → `kjvInstall` |
| התקנת מילון Strong’s | `KjvPlusInstaller` | Install definitions | `strongsDefinition` |
| ביקורת ספרייה | `AdminDashboard` | Run audit | `LibraryReport` → `scriptureAudit` |
| מחיקת נושא בשימוש | `QaTopicsPanel` | Delete | חלון move-and-delete |
| מחיקת טופס בשימוש | `DevotionalTopicsPanel` | Delete | הודעת חסימה |
| חיפוש record | Panel | Search | סינון מקומי |

### כללי DEBUG חשובים

- לפני בדיקת מסלול יש לבדוק שה־page מקבל את `currentPageName` הנכון, משום שה־footer מוצג רק ב־Home, QA ו־Devotionals.
- פרמטרים מרכזיים לבדיקה:
  - `book`  -  מספר ספר 1 - 66.
  - `chapter`  -  מספר פרק.
  - `verse`  -  מספר פסוק.
  - `lang`  -  `en` או `lu`.
  - `series`, `song`, `topic`, `letter`, `search`, `new`, `group`.
- שגיאת `Chapter` עם `book=0` או פרק מחוץ לטווח הספר היא בעית נתונים, לא בעית routing.
- אם ה־installer מציג “מותק”, אך הפרק אינו נמצא ב־BibleReader, יש לבדוק לאיזו שפה/גרסה הפרק נשמר.

---

# 4. מבנה הקבצים

## 4.1 דפי Pages

| קובץ | מה נטען |
|---|---|
| `pages/About.jsx` | דף המותג והמשרד |
| `pages/Admin.jsx` | מסך כניסת מנהל ושחזור סיסמה |
| `pages/AdminDashboard.jsx` | מעטפת ה־CMS וכל ה־panels |
| `pages/BibleNotes.jsx` | רשימת סימונים, סימניות והערות אישיות |
| `pages/BibleReader.jsx` | מסך בחירת המקרא והזיהוי ה־offline |
| `pages/Chapter.jsx` | מסך קריאת פרק מלא |
| `pages/Community.jsx` | רכז הקהילה |
| `pages/CommunityLiveTeaching.jsx` | לוח מפגשי לימוד חי |
| `pages/CommunityRevelations.jsx` | פיד גילויים, לייקים ותגובות |
| `pages/Contact.jsx` | טופס יצירת קשר |
| `pages/Dashboard.jsx` | לוח אישי ו־activity feed |
| `pages/Devotionals.jsx` | ספריית ותצוגת מכירות יומיות |
| `pages/DiscussionGroups.jsx` | רשימת קבוצות ושיחות קבוצה |
| `pages/ForgotPassword.jsx` | טופס שחזור סיסמה |
| `pages/HistoricalInsights.jsx` | wrapper ל־InsightsBoard עם `kind="historical"` |
| `pages/Home.jsx` | דף הבית והמכירה היומית |
| `pages/InstallPrompt.jsx` | מסך התקנת PWA |
| `pages/Journal.jsx` | רשימה ועריכת יומן תפילה |
| `pages/Login.jsx` | טופס כניסת קורא |
| `pages/Logout.jsx` | מסך יציאה זמני |
| `pages/Offline.jsx` | מרכז הורדות וניהול cache |
| `pages/Plan.jsx` | תוכנית קריאה והתקדמות |
| `pages/PrayerLibrary.jsx` | ספריית תפילות |
| `pages/Privacy.jsx` | מדיניות פרטיות |
| `pages/QA.jsx` | ספריית Q&A |
| `pages/ResetPassword.jsx` | קביעת סיסמה חדשה |
| `pages/Signup.jsx` | הרשמת קורא |
| `pages/Terms.jsx` | תנאי שימוש |
| `pages/TheologicalInsights.jsx` | wrapper ל־InsightsBoard עם `kind="theological"` |
| `pages/VerseOfDay.jsx` | פסוק היום |
| `pages/VerseSongSeries.jsx` | אינדקס סדרות ותצוגת סדרה |
| `pages/VerseSongs.jsx` | ספריית שירי מקרא |

## 4.2 רכיבי Admin

| קובץ | תפקיד |
|---|---|
| `components/admin/ChapterCoverage.jsx` | מציג כמה פרקים מותקנים, חסרים או פגומים בכל ספר ודוח סיכום. |
| `components/admin/CollectionsPanel.jsx` | טבלה גנרית לכל collections, עם חיפוש, הוספה, עריכה ומחיקה. |
| `components/admin/ConfirmDialog.jsx` | מודאל אישור לפעולה הרסנית. |
| `components/admin/CrossRefEditor.jsx` | עורך references בצורת chips. |
| `components/admin/DevotionalBulkImport.jsx` | ייבוא מכירות מ־JSON עם validation ודוח. |
| `components/admin/DevotionalForm.jsx` | טופס מכירה דו־לשונית עם העלאת cover. |
| `components/admin/DevotionalPlansPanel.jsx` | ניהול תוכניות קריאה של מכירות. |
| `components/admin/DevotionalsPanel.jsx` | ה־desk של המכירות וכל ה־sub-tabs שלו. |
| `components/admin/DevotionalTopicsPanel.jsx` | ניהול נושאי מכירות וחסימת מחיקה בשימוש. |
| `components/admin/JsonImportPanel.jsx` | ייבוא JSON גנרי של אוספים ו־collections. |
| `components/admin/KjvPlusInstaller.jsx` | התקנת KJV+, מילון Strong’s והצגת audit. |
| `components/admin/LibraryReport.jsx` | הפעלת והצגת דוח ביקורת הספרייה. |
| `components/admin/LugandaInstaller.jsx` | התקנת מרחבי לוגanda והצגת כיסוי. |
| `components/admin/PassagesPanel.jsx` | ניהול מערכות פסוקים, cross references, מבואי פרקים ומבואי ספרים. |
| `components/admin/PrayerCrossRefImport.jsx` | ייבוא קובצי תפילה, פסוקים והפניות צלב לפי ספר. |
| `components/admin/PrayersPanel.jsx` | ניהול ספריית התפילות ומערכות הפסוקים. |
| `components/admin/QaAdminList.jsx` | רשימת ניהול Q&A עם A - Z, חיפוש ובחירה מרובה. |
| `components/admin/QaBulkImport.jsx` | ייבוא מרוב של שאלות ותשובות. |
| `components/admin/QaItemForm.jsx` | טופס שאלה ותשובה בינארית. |
| `components/admin/QaPanel.jsx` | מעטפת ה־Q&A desk. |
| `components/admin/QaQuestionsPanel.jsx` | רשימת השאלות, טופס ואישור מחיקה. |
| `components/admin/QaTopicForm.jsx` | טופס נושא Q&A. |
| `components/admin/QaTopicsPanel.jsx` | ניהול נושאים, כולל מעבר שאלות לפני מחיקה. |
| `components/admin/RecordEditor.jsx` | טופס גנרי לפי מידע collection. |
| `components/admin/VerseSongBulkImport.jsx` | ייבוא מרוב של שירי מקרא. |
| `components/admin/VerseSongForm.jsx` | טופס שיר, כולל אודיו ו־cover. |
| `components/admin/VerseSongSeriesForm.jsx` | טופס סדרת שירים. |
| `components/admin/VerseSongsPanel.jsx` | ה־desk של השירים, הסדרות והייבוא. |

## 4.3 רכיבי Common

| קובץ | תפקיד |
|---|---|
| `components/common/BrandIcons.jsx` | SVG מותגיים ל־WhatsApp, Facebook, X, Telegram, LinkedIn, Instagram ודוא"ל. |
| `components/common/EmptyState.jsx` | מצב ריק אחיד עם אייקון, כותרת, הסבר ו־CTA. |
| `components/common/Modal.jsx` | מודאל נגיש עם סגירה ב־Escape, מימוש scroll lock ורקע כהה. |
| `components/common/PageHeader.jsx` | Header אחיד לדפי תוכן, עם hero או רגיל. |
| `components/common/Pagination.jsx` | pager פשוט עם קיצורי אמצע וגלילה. |
| `components/common/ShareRow.jsx` | שורת כפתורי שיתוף מהירים. |
| `components/common/Spinner.jsx` | מצב טעינה אחיד. |

## 4.4 רכיבי קהילה, לימוד, מכירות ושירים

| קובץ | תפקיד |
|---|---|
| `components/community/CommentThread.jsx` | רשימת תגובות וטופס תגובה. |
| `components/community/RevelationCard.jsx` | כרטיס גילוי עם לייק ותגובות. |
| `components/community/RevelationForm.jsx` | טופס פרסום גילוי. |
| `components/community/ThreadMessages.jsx` | שיחת קבוצה. |
| `components/dashboard/ActivityFeed.jsx` | פיד פעילות אישית. |
| `components/devotional/DevotionalCard.jsx` | כרטיס מכירה ברשימה. |
| `components/devotional/DevotionalFeatured.jsx` | מכירת היום המלאה. |
| `components/devotional/DevotionalFilters.jsx` | מסלולי שפה, חיפוש, נושא, תאריך וסדרה. |
| `components/devotional/DevotionalFullView.jsx` | תצוגת מכירה מלאה עם פעולות. |
| `components/home/StatCard.jsx` | כרטיס מדד בדשבורד. |
| `components/insight/InsightsBoard.jsx` | לוח insights משותף לתיאולוגי והיסטורי. |
| `components/journal/JournalCard.jsx` | כרטיס רשומת יומן. |
| `components/journal/JournalForm.jsx` | טופס יומן. |
| `components/plan/PlanRow.jsx` | שורת יום בתוכנית הקריאה. |
| `components/qa/QaCard.jsx` | כרטיס שאלה עם תשובה מתרחבת והצבעה. |
| `components/qa/QaFilters.jsx` | מסלולי שפה, חיפוש ונושא. |
| `components/qa/QaLetterBar.jsx` | A - Z נגיש וניתן לגלילה. |
| `components/song/SeriesCard.jsx` | כרטיס סדרת שירים. |
| `components/song/SongCard.jsx` | כרטיס שיר ופעולות נגן/הורדה/שיתוף. |
| `components/song/SongFilters.jsx` | חיפוש וסינון שירים. |
| `components/song/SongShareSheet.jsx` | מודאל שיתוף שיר. |

## 4.5 רכיבי Layout

| קובץ | תפקיד |
|---|---|
| `components/layout/AppFooter.jsx` | פוטר, קישורים מהירים, לוגו ו־donate. |
| `components/layout/AppHeader.jsx` | ניווט ראשי ומשני, תפריט מובייל, כניסה והתקנה. |
| `components/layout/GlobalPlayer.jsx` | נגן אודיו גלובלי בתחתית המסך. |
| `components/layout/PwaHead.jsx` | הוספת meta tags, manifest, favicon ורישום service worker. |

## 4.6 רכיבי קריאת המקרא

| קובץ | תפקיד |
|---|---|
| `components/read/AnnotatedText.jsx` | טקסט הניתן ל־highlight או underline לפי טווח offsets. |
| `components/read/BookGrid.jsx` | רשת 66 הספרים עם חיפוש והעברה לפרקים. |
| `components/read/BookIntro.jsx` | מבוא הספר, key passages והערות. |
| `components/read/BookOutline.jsx` | מבנה הספר עם ניווט לטווחי פסוקים. |
| `components/read/BookPrayerPanel.jsx` | תפילת הספר בשתי שפות. |
| `components/read/BookSidebar.jsx` | שדונית מבוא/מבנה/תפילת ספר. |
| `components/read/BookStudyResources.jsx` | פירושים ו־insights ברמת הספר עם pagination. |
| `components/read/ChapterClosingPrayer.jsx` | תפילת סיום בתחתית פרק. |
| `components/read/ChapterGrid.jsx` | רשת בחירת פרק. |
| `components/read/ChapterReaderPane.jsx` | מעטפת עמודת הקריאה ותפריט משאבי הלימוד. |
| `components/read/ChapterResourcesPanel.jsx` | insights תיאולוגיים והיסטוריים ברמת פרק. |
| `components/read/ChapterSelector.jsx` | מסך בחירת ספר/פרק ושדונית הלימוד. |
| `components/read/ChapterSidebar.jsx` | מבוא, פירוש, תפילה והפניות צלב של פרק. |
| `components/read/CrossRefList.jsx` | רשימת הפניות צלב וניווט אליהן. |
| `components/read/CrossRefScripture.jsx` | טקסט הפסוק המופנה, מהמאגר או מה־API. |
| `components/read/FloatingVerse.jsx` | חלון צף להצגת פסוק. |
| `components/read/PassagePrayer.jsx` | מציג ומזהה מערכות תפילה השייכות לפסוק. |
| `components/read/PassageTabs.jsx` | מעבר בין פירוש, insights ו־Q&A של מעבר. |
| `components/read/ShareSheet.jsx` | שיתוף פסוק, פרק, מכירה או תוכן מותאם. |
| `components/read/StrongsPopup.jsx` | פופ־אפ להגדרת Strong’s. |
| `components/read/StrongsText.jsx` | מפרק קודי Strong’s ומציגם כ־superscript. |
| `components/read/VerseActionBar.jsx` | סרגל פעולות של פסוק. |
| `components/read/VerseCrossRefs.jsx` | הפניות צלב מתחת לפסוק. |
| `components/read/VerseList.jsx` | רשימת פסוקים בסגנון Tailwind פשוט. |
| `components/read/VersePopup.jsx` | חלון פרק/פסוק בתוך הדף. |
| `components/read/VersionPicker.jsx` | בחירה, התקנה והסרה של תרגומים מקומיים. |

## 4.7 ספריות `lib/`

| קובץ | תפקיד |
|---|---|
| `lib/activity.js` | רישום פעילות קורא ללא הפרעת הממשק בכישלון. |
| `lib/adminCollections.js` | מידע collections ושדות ל־RecordEditor הגנרי. |
| `lib/adminDirect.js` | גיבוי ישיר לפעולות ניהול דרך entity SDK. |
| `lib/adminSession.js` | כניסה, token, renewal, sign-out ו־fallback למסלול ישיר. |
| `lib/app-params.js` | קריאת app token ו־app ID מ־localStorage בצורה עדכנית. |
| `lib/AuthContext.jsx` | מצב משתמש מחובר ופעולות login/logout. |
| `lib/bibleApi.js` | טעינת פרק, fallback ל־offline, וזיהוי גרסאות Strong’s. |
| `lib/bibleBooks.js` | נתוני 66 הספרים, שמות בלוגanda ומספרי פרקים. |
| `lib/bookGuides.js` | מבואות ומבני ספרים מקומיים. |
| `lib/bookImport.js` | זיהוי ופירוק קובצי ספר JSON. |
| `lib/bookIntro.js` | טעינת ונרמול מבואי ספר. |
| `lib/bookPrayers.js` | תפילות מקומיות לכל ספר. |
| `lib/bookStudyContent.js` | תוכן לימוד מקומי לרמת הספר. |
| `lib/brandCss.js` | מערכת CSS מרכזית עם משתני Ivory/Emerald/Gold. |
| `lib/chapterIntros.js` | טעינת ונרמול מבואי פרק. |
| `lib/chapterStudy.js` | בניית מבוא, פירוש ותפילה ברמת פרק. |
| `lib/contentApi.js` | קריאת collections ציבוריות ושליחת תוכן. |
| `lib/crossRefs.js` | הפניות צלב מקומיות מוכרות. |
| `lib/devotionals.js` | כללי תצוגה, תאריך, שפה, cover, share ו־daily selection. |
| `lib/format.js` | עיצוב טקסט, תאריך, משך ו־bytes. |
| `lib/keyPassages.js` | פסוקי מפתח לכל ספר. |
| `lib/luganda.js` | ניקוי ופירוק תוכן לוגanda. |
| `lib/offlineDb.js` | מעטפת IndexedDB, stores ותיקון schema. |
| `lib/planData.js` | תוכנית 30 הימים כ־fallback. |
| `lib/player.jsx` | Provider ו־state machine של הנגן הגלובלי. |
| `lib/prayerImport.js` | פורמטים, validation ונרמול של קובצי תפילה/הפניות צלב. |
| `lib/prayerPassages.js` | טעינת passages ו־cross references לפי ספר ופרק. |
| `lib/qaLibrary.js` | מיון, חיפוש, אותיות ו־seed library של Q&A. |
| `lib/reading.js` | תאריכי ISO, ימים אחרונים ו־streaks. |
| `lib/readings.js` | שמירת התקדמות קריאה וסגירת יום בתוכנית. |
| `lib/scriptureRefs.js` | פירוש, נרמול ופתיחת הפניות מקרא. |
| `lib/seedContent.js` | תוכן גיבוי למכירות, תפילות, Q&A, insights ועוד. |
| `lib/sha256.js` | מימוש SHA-256 ללא תלות ב־Web Crypto. |
| `lib/share.js` | בניית טקסטי share, קישורים ו־Clipboard. |
| `lib/strongs.js` | נרמול קודי Strong’s ו־metadata. |
| `lib/strongsOffline.js` | mirror מקומי של מילון Strong’s. |
| `lib/studyAnnotations.js` | merge ושמירת annotations בשרת וב־IndexedDB. |
| `lib/textSelection.js` | מניעת פעולת לחיצה בזמן בחירת טקסט. |
| `lib/themeContext.jsx` | טעינת הגדרות ערכת נושא והמרת צבעים. |
| `lib/theme.js` | קבועי המותג, לוגו, תמונות ו־donate URL. |
| `lib/useDevotionalLibrary.js` | hook ל־saved/read במקום ובשרת. |
| `lib/verseSongs.js` | נרמול סדרות/שירים, חיפוש ובניית תור. |
| `lib/versions.js` | registry, התקנה והסרה של תרגומים. |

בנוסף:

- `api/fse2Client.js`  -  גישה ל־FSe2 entities, auth ו־functions.
- `utils.js`  -  יוצר את נתיבי העמודים דרך `createPageUrl`.

## 4.8 Functions ו־Cron

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | כניסת מנהל, hash, token, session, renewal ו־reset password. |
| `functions/adminContent.js` | API מורשה ל־list/create/update/delete של תוכן ניהול. |
| `functions/bibleChapter.js` | טעינת פרק מהמקור הציבורי ונרמולו. |
| `functions/content.js` | API ציבורי ל־collections והגשת תוכן. |
| `functions/kjvInstall.js` | התקנת פרקי KJV+ עם Strong’s. |
| `functions/lugandaInstall.js` | התקנת פרקי לוגanda. |
| `functions/scriptureAudit.js` | ביקורת כיסוי ושלמות הספרייה. |
| `functions/strongsDefinition.js` | מילון Strong’s מקומי והשלמה מ־Blue Letter Bible. |
| `cron/scriptureInstall.js` | worker שעתי, idempotent, להשלמת מרחבי התנ"ך ו־Strong’s. |

## 4.9 קבצי `public/`

| קובץ | תפקיד |
|---|---|
| `public/manifest.json` | הגדרות PWA: שם, צבעים, start URL ואייקונים. |
| `public/sw.js` | service worker: cache-first ל־shell/images ו־network-first לנתונים. |
| `public/assets/generated_*.png` | תמונות מעורברות וברירות מחדל לממשק. |
| `public/assets/ingested/media_0fc9eec909.png` | נכס תמונה שהועלה למערכת. |
| `public/assets/ingested/media_7a14bfc357.xicon` | favicon/אייקון שהועלה. |
| `public/assets/media-library/0dbaf742d3ba_Prayer-Crossrefs-Template.json` | תבנית רשמית לייבוא prayer/cross-refs. |
| `public/assets/media-library/f830b722d892_OBADIAH-PRAY-READ-BULK-IMPORT.json` | קובץ ייבוא לדוגמה עבור אובדיה. |
| `public/assets/media-library/4345fa1c4c79_icon-512x512.png` | האייקון הראשי של האפליקציה. |
| `public/assets/media-library/b8660c2286d0_PrayRead-logo-2.png` | לוגו נוסף. |
| `public/assets/media-library/ee6ae196bbbc_favicon.ico` | favicon. |
| שאר `public/assets/media-library/*` | תמונות, קבצי עזר, PDF ו־Markdown לצורך מסירות, עיצוב והדרכה; אינם מרנדרים עצמם. |
| `__generated/tailwind.css` | Tailwind utility CSS מחושל; קובץ generated שאינו יש לערוך ידנית. |

### קבצים שאינם חלק מה־build הפעיל

- `__trash/**`  -  קוד ישן, probes זמניים ודפי בדיקה.
- `__url_fetch/**`  -  captures של אתרים ו־API שנבדקו במהלך המחקר.
- קבצי `probe`, `tmp` ו־`_hash*` בתיקיית `__trash` ראויים למחיקה לפני deployment, במיוחד אם הם מכילים hash, סיסמה או endpoint רגיש.

---

# 5. מודל הנתונים  -  Entities

> בנוסף לשדות המפורשים בקובצי ה־JSON, הפלטפורמה עשויה להוסיף שדות מערכת כגון `id`, `created_date` ו־`updated_date`.

## 5.1 תוכן דו־לשוני

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `Devotional` | מכירה יומית דו־לשונית. | `code`, `title`, `title_lu`, `scripture`, `scripture_lu`, `verse_en`, `verse_lu`, `body`, `body_lu`, `prayer_en`, `prayer_lu`, `topic`, `series`, `publish_date`, `cover_image`, `featured`, `active`. | קשור ל־`DevotionalTopic` ול־`DevotionalPlan` בעיקר לפי שם, לא ב־foreign key. |
| `DevotionalTopic` | נושא להתאמת מכירות. | `name_en`, `name_lu`, `active`. | `Devotional.topic` מציין את שם הנושא. |
| `DevotionalPlan` | סדרת מכירות למספר ימים. | `name_en`, `name_lu`, `description`, `days`, `active`. | `Devotional.series` מציין את שם התוכנית. |
| `Prayer` | תפילה כללית מהספרייה. | `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref`, `cross_refs`. | קשור טקסטואלית ל־פסוקים ול־`CrossReference`. |
| `PrayerPassage` | מערכת תפילה לפרק, טווח פסוקים או פסוק בודד. | `book_number`, `book_name`, `chapter`, `verse`, `verse_end`, `title_en`, `title_lu`, גוף התפילה בשתי שפות. | קשור לפי־מספר ספר/פרק; אין foreign key מפורש. |
| `CrossReference` | הפניה מפסוק אחד לפסוק אחר. | מקור: `book_number`, `chapter`, `verse`; יעד: `ref_book_number`, `ref_chapter`, `ref_verse`, `ref_verse_end`; טקסט והערה בשתי שפות. | יעד נמצא ב־`BibleVerse` או במאגר הפרקים המותקנים. |
| `ChapterIntro` | מבוא ותפילה לרמת פרק. | `book_number`, `book_name`, `chapter`, `title_en`, `title_lu`, `intro_en`, `intro_lu`, `source`. | מזוהה לפי ספר + פרק. |
| `BookIntro` | מבוא ספר ותפילת סיום. | `book_number`, `book_name`, `title_en`, `title_lu`, `intro_en`, `intro_lu`, `closing_prayer_en`, `closing_prayer_lu`. | מזוהה לפי ספר. |
| `Commentary` | הערת פירוש לפרק. | `book`, `chapter`, `title`, `body_en`, `body_lu`. | קשור לפי שם ספר ומספר פרק. |
| `Insight` | תובנה תיאולוגית או היסטורית. | `kind` (`theological`/`historical`), `title`, `passage`, `excerpt`, `body`, `share_count`. | `passage` יכול להפנות לפרק. |
| `QAItem` | שאלה ותשובה בספריית Q&A. | `topic_en`, `topic_lu`, `topic_id`, `scripture_ref`, `question_en`, `question_lu`, `answer_en`, `answer_lu`, `tags`, `featured`, `active`, מדדי עזרה. | קשור ל־`QATopic` דרך `topic_id` וגם דרך שם. |
| `QATopic` | נושא Q&A. | `name_en`, `name_lu`, `description_en`, `description_lu`, `active`. | `QAItem.topic_id`. |
| `QAEntry` | שאלה שהגיעה מקורא ותשובה פסטורלית. | `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email`. | משמעותי בעיקר כצורת פנייה לאדמין. |
| `VerseSongSeries` | סדרת שירי מקרא. | `name`, `description`, `thumbnail`, `cover_image`, `accent`, `active`. | `VerseSongEpisode.series_name` מקשר לפי שם. |
| `VerseSongEpisode` | שיר בודד בסדרה. | `series_name`, `title`, `book_name`, `book_number`, `chapter`, `verse`, `verse_ref`, `language`, `version`, `duration_label`, `duration_seconds`, `audio_url`, `cover_url`, `lyrics_en`, `lyrics_lu`, `episode_order`, `active`. | קשור ל־`VerseSongSeries` לפי שם. |
| `VerseOfDay` | פסוק מומלץ לתאריך. | `verse_date`, `reference`, `text_en`, `text_lu`, `note`. | יום נבחר לפי תאריך. |

## 5.2 תנ"ך ומקורות קריאה

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `BibleVerse` | פסוק בודד בשתי שפות. | `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu`. | מזוהה לפי ספר + פרק + פסוק. |
| `LugandaChapter` | פרק לוגanda מותקן. | `book_number`, `book`, `chapter`, `verse_count`, `verses`. | `verses` מאוחסן כ־JSON בתוך string. |
| `KjvPlusChapter` | פרק KJV עם קודי Strong’s. | `book_number`, `book`, `chapter`, `verse_count`, `verses`. | `verses` מכיל גם markers כגון `(G2424)`. |
| `StrongEntry` | הגדרת מילה יוונית או עברית. | `code`, `language`, `original_word`, `transliteration`, `pronunciation`, `part_of_speech`, `root_word`, `definition`, `source`. | מקוד כגון `G2424` מופיע בתוך `KjvPlusChapter.verses`. |
| `ReadingPlan` | שורת יום בתוכנית הקריאה. | `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture`. | מזוהה ל־`Reading` לפי ספר + פרק. |
| `Reading` | התקדמות קריאה אישית. | `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses`. | משויך למשתמש; `plan_day` מקשר ל־`ReadingPlan`. |
| `StudyMark` | highlight, bookmark או note על פסוק. | `owner_email`, `mark_type`, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text`. | משויך למשתמש ולפסוק. |
| `StudyAnnotation` | הערה ברמת טקסט במבוא, מבנה, תפילה או פסוק. | `owner_email`, `book_number`, `book`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset`. | מזוהה לפי owner + block + offset. |
| `ReadingActivity` | פעולת קריאה לדשבורד. | `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse`. | משויך למשתמש; אינו מהווה תוכן. |

## 5.3 קהילה, חשבונות והגדרות

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `Revelation` | גילוי קורא או תגובה לגילוי. | `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id`. | `parent_id` יוצר קשר עצמי: רשומה עם `parent_id` היא תגובה. |
| `DiscussionGroup` | קבוצת לימוד. | `name`, `description`, `schedule`, `member_count`. | `DiscussionThread.group_name` מקשר לפי שם. |
| `DiscussionThread` | הודעה בקבוצה. | `group_name`, `owner_email`, `author_name`, `title`, `body`. | קשור ל־`DiscussionGroup` לפי שם. |
| `PrayerSaved` | תפילה שנשמרה במועדפי המשתמש. | `owner_email`, `prayer_title`. | קשור ל־`Prayer.title`. |
| `DevotionalSaved` | מכירה שנשמרה. | `owner_email`, `devotional_code`, `saved_date`. | קשור ל־`Devotional.code`. |
| `DevotionalProgress` | מכירה שהושלמה. | `owner_email`, `devotional_code`, `completed_date`. | קשור ל־`Devotional.code`. |
| `JournalEntry` | רשומת יומן תפילה. | `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood`. | משויך למשתמש; `book`/`chapter` מקשרים לפסוק. |
| `ContactMessage` | פנייה מהטופס הציבורי. | `name`, `email`, `subject`, `message`, `is_read`, `reply`. | נמצא רק אצל מנהלים. |
| `LiveSession` | מפגש הוראה חי. | `title`, `session_date`, `host`, `join_link`, `description`. | אין קשר חוויית משתמש נוסף. |
| `SiteSettings` | הגדרת אתר כללית. | `setting_key`, `setting_value`. | נקרא על ידי `ThemeProvider`. |
| `ActivityLog` | יומן פעילות ב־CMS. | `actor`, `action`, `section`, `detail`. | נשמר בצד המנהל. |
| `AdminAccount` | רשומת כניסת מנהל. | `email`, `password_hash`, `salt`, `secret`, `session_version`, `updated_date`. | משמש את `adminAuth` ו־`adminSession`. |

### דפוס הקשרים

המערכת משתמשת בעיקר ב־**natural keys** ולא ב־foreign keys מלאים:

- `Devotional.topic` ← שם ב־`DevotionalTopic`.
- `Devotional.series` ← שם ב־`DevotionalPlan`.
- `VerseSongEpisode.series_name` ← שם ב־`VerseSongSeries`.
- `DiscussionThread.group_name` ← שם ב־`DiscussionGroup`.
- `PrayerSaved.prayer_title` ← כותרת ב־`Prayer`.
- `DevotionalSaved/Progress.devotional_code` ← `Devotional.code`.
- `Reading` מזוהה לתוכנית לפי `book + chapter`, ולא רק לפי `plan_day`.

היתרון הוא import עמיד יותר; החסרון הוא סיכון לכפילויות ולאי־עקביות בעת שינוי שם.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 כניסת משתמש רגיל

1. המשתמש נכנס ל־`/Login`.
2. `fse2.auth.login(email, password)` מאמת את הפרטים.
3. `AuthContext` מעדכן:
   - `user`
   - `isAuthenticated`
   - `isLoadingAuth`
4. המשתמש מופנה ל־`/Dashboard`.
5. רשומות אישיות נטענות עם `email` כחלק ממפתח ה־React Query.
6. בעת logout:
   - ה־state מתאפס.
   - `fse2.auth.logout` מנקה את ההתעדות.
   - המשתמש חוזר ל־Home.

## 6.2 כניסת מנהל ו־admin session

ה־CMS תומך בשני מסלולים:

1. **Server mode**
   - `adminSignIn` שולח אימות ל־`adminAuth`.
   - הפונקציה מאמתת hash, יוצרת signed token ושומרת אותו ב־`pr_admin_token`.
   - פעולות התוכן עוברות דרך `adminContent` עם ה־token.

2. **Direct mode**
   - אם function gateway אינו זמין לדפדפן, `adminDirect` משתמש ב־entity SDK עם הרשאות המנהל המחובר.
   - התשובות מנורמלות לאותו מבנה כמו המסלול הציבורי, ולכן ה־panels לא צריכים לדעת איזה מסלול עבד.

3. `ensureFreshAdminToken` מרענן את ה־session לפני פעולות ארוכות.
4. `adminContent` מקבל גם token שפג תוך תקופת grace כדי לא לעצור התקנה ארוכה באמצע.
5. ה־`AdminDashboard` מפעיל keep-alive כל עוד המנהל נמצא במסך.

## 6.3 קריאת פרק מקרא

1. המשתמש בוחר ספר ופרק.
2. הניווט מגיע ל־`/Chapter?book=...&chapter=...`.
3. `fetchChapter` טוען:
   - מהמאגר המקומי אם הפרק הותקן.
   - מה־API הציבורי אם לא.
4. לאחר טעינה:
   - נרשמת פעולת `chapter_visit`.
   - נטענים passages, cross references, commentary ו־insights.
   - נטענים הערות המשתמש מהשרת ומ־IndexedDB וממוזגים.
5. המשתמש בוחר פסוק.
6. `VerseActionBar` מציג את הפעולות הזמינות.
7. פעולות כגון bookmark, note ו־highlight נשמרים:
   - מידית במקום.
   - בשרת כאשר המשתמש מחובר.

## 6.4 יצירת הערה ו־highlight

1. המשתמש בוחר טקסט.
2. `AnnotatedText` מחשב את ה־`start_offset` ו־`end_offset`.
3. המשתמש בוחר צבע או underline.
4. נוצר annotation עם:
   - `book_number`
   - `section`
   - `block_id`
   - `kind`
   - offsets
5. ה־annotation נשמר ב־IndexedDB.
6. אם המשתמש מחובר, נשמר גם ב־`StudyAnnotation`.
7. בכניסה הבאה:
   - `mergeAnnotations` ממזג לפי key.
   - השרת מקבל עדיפות, והמקומי משלים פערים.

## 6.5 מערכת תפילה והפניות צלב

1. המערכת טוענת את כל ה־passages וה־cross references של הפרק.
2. הנתונים מקובצים לפי פסוק.
3. בחירת פסוק מציגה:
   - passage מדויק.
   - passage של טווח.
   - passage של כל הפרק כגיבוי.
4. הפניית צלב מציגה:
   - את הפסוק המפנה.
   - טקסט מאוחסן, אם קיים.
   - אחרת טעינת הפרק מ־Bible API.
5. לחיצה על הפניה פותחת את היעד בתוך המסך או בדף Chapter.

## 6.6 הגדרת Strong’s

1. `StrongsText` מפרק קודים מסוג `(G2424)` או `(H0436)`.
2. הקוד מוצג כקישור superscript.
3. לחיצה פותחת את `StrongsPopup`.
4. ההגדרה נטענת תחילה מ־IndexedDB.
5. אם אינה, מתבצעת טעינה מהשרת.
6. השרת:
   - מחפש במילון ה־Strong’s המקומי.
   - משלים מידע מ־Blue Letter Bible כשצריך.
   - שומר cache ב־`StrongEntry`.
7. העותק המקומי מתעדכן לשימוש offline.

## 6.7 קריאה ושיתוף מכירה

1. המערכת מחפשת מכירה שתואמת לתאריך, עם fallback ל־seed content.
2. `pickDailyDevotional` קובע את המכירה, ו־`rememberDaily` שומר את הבחירה כך שכל המשתמשים רואים אותה מכירה.
3. המשתמש יכול:
   - להחליף שפה.
   - לפתוח את המכירה המלאה.
   - לשמור.
   - לסמן כנקראה.
   - לשתף.
4. השיתוף מורכב מהכותרת, פסוק המקרא, תוכן המכירה וקישור יציב.

## 6.8 שמירת תפילה

1. המשתמש לוחץ Save.
2. אם אין כתובת, הפעולה נעצרת בעדינות.
3. אם מחובר:
   - נבדק האם כבר קיימת `PrayerSaved`.
   - נוצרת או נמחקת הרשומה.
4. ה־state מתעדכן והכפתור משתנה ל־Saved.

## 6.9 שאלת Q&A

1. המשתמש בוחר שפה, נושא, אות או מונח חיפוש.
2. הרשימה ממוינת לפי האות הראשונה בשאלה האנגלית.
3. בחירת האות מבצעת גלילה לאמצע הרשימה.
4. התשובה נפתחת בתוך הכרטיס.
5. הצבעת עזרה נשמרת מקומית ב־`pr_qa_votes`.
6. העתקה ושיתוף פועלים עם טקסט השאלה והתשובה.

## 6.10 יצירת גילוי ותגובה

1. משתמש לא מחובר מופנה ל־Login.
2. משתמש מחובר מזין כותרת, פסוק וגוף.
3. נוצרת `Revelation` ללא `parent_id`.
4. תגובה נוצרת כ־`Revelation` עם `parent_id` של הגילוי.
5. הפיד מבחין בין פוסטים לתגובות לפי `parent_id`.
6. לייק מעדכן את מונח ה־likes.

## 6.11 קבוצת לימוד

1. המשתמש בוחר קבוצה.
2. הצטרפות נשמרת מקומית.
3. הודעות נטענות מ־`DiscussionThread`.
4. שליחת הודעה יוצרת רשומה עם:
   - `group_name`
   - `owner_email`
   - `author_name`
   - `body`.

## 6.12 יומן ותוכנית קריאה

1. המשתמש פותח יומן חדש או עורך רשומה.
2. נדרש כותרת או גוף.
3. בעת סיום קריאה נשמר גם:
   - רשומת `Reading`.
   - `plan_day`, אם הפרק תואם לתוכנית.
4. בדשבורד מחושבים:
   - streak.
   - מספר פרקים.
   - highlights.
   - bookmarks.
   - notes.
   - פעילות אחרונה.

## 6.13 השמעת שיר

1. המשתמש בוחר Play בכרטיס שיר.
2. ה־`PlayerProvider` מקבל queue ו־index.
3. נוצר אודיו element יחיד ברמת ה־Layout.
4. השיר ממשיך לנגן בעת מעבר בין עמודים.
5. הנגן תומך ב:
   - seek.
   - volume.
   - speed.
   - shuffle.
   - repeat.
   - next/previous.
   - expanded/minimized.
6. המסלול מוסיף ל־body את המחלקה `pr-has-player` כדי למנוע חפיפה עם התוכן.

## 6.14 התקנת תנ"ך

### Luganda

1. המנהל מריץ `lugandaInstall` עם action כגון `status` או `install`.
2. הפונקציה סורקת את `LugandaChapter`.
3. היא מחשבת:
   - פרקים קיימים.
   - פרקים חסרים.
   - פרקים פגומים.
4. מורידה רק את הפרקים החסרים.
5. שומרת כל פרק כ־JSON בתוך `verses`.
6. מחזירה progress ו־status לממשק ההתקנה.
7. ה־cron מריץ את אותו תהליך מדי שעה ועוצר כאשר אין התקדמות.

### KJV+ ו־Strong’s

1. `kjvInstall` מתקין פרקים עם קודי Strong’s.
2. `strongsDefinition` ממלא את המילון.
3. `scriptureAudit` משווה:
   - כיסוי KJV+ מול Luganda.
   - מספר פסוקים בין התרגומים.
   - קודי Strong’s חסרים.
4. `ChapterCoverage` מציג את הפערים לפי ספר.

## 6.15 ייבוא JSON

1. המשתמש בוחר קובץ.
2. הקובץ מזוהה לפי format ולפי מבנה המפתחות.
3. המערכת מרחיבה קובץ ספר ל־collections:
   - prayers.
   - passages.
   - cross references.
   - chapter intros.
   - book intro.
4. נבדקים שדות חובה ושפות.
5. מוצגת תצוגה מקדימה ודוח שגיאות לפי מספר שורה.
6. הייבוא מבצע upsert לפי natural key.
7. ייבוא חוזר של אותו קובץ מעדכן רשומות ולא יוצר כפילויות.

## 6.16 Offline ו־PWA

1. `PwaHead` מוסיף meta ו־manifest ורושם את `sw.js`.
2. השירות המקומי שומר:
   - app shell.
   - תמונות.
   - תגובות runtime.
3. `offlineDb` שומר chapters, verses, devotionals, prayers, Q&A, annotations ועוד.
4. `Offline` מאפשר להוריד חלקים לפי תרגום.
5. `bibleApi` מנסה קודם cache מקומי ורק אז רשת.
6. המשתמש יכול למחוק נתונים ולפנות שטח מקומי.

---

# 7. הערות טכניות לפיתוח

## 7.1 ספריות ותלויות מרכזיות

| ספרייה | שימוש |
|---|---|
| `react` | רכיבים, state, context ו־effects. |
| `react-router-dom` | ניתוב, query parameters ו־links. |
| `@tanstack/react-query` | טעינת entities, mutations ו־cache. |
| `lucide-react` | רכיבי אייקונים. |
| `date-fns` | תאריכים, תאריכים יחסיים ו־streaks. |
| `fse2` SDK | auth, entities, functions ו־file upload. |
| IndexedDB API | אחסון offline. |
| Service Worker API | cache והתקנת PWA. |
| Web Crypto / `TextEncoder` | hash ו־טיפול ב־Base64. |

## 7.2 דפוסים חוזרים

### 7.2.1 רכיבים מבוססי props

רוב ה־panels מקבלים:

- `rows` או records.
- callbacks כגון `onSave`, `onDelete`, `onChange`.
- `busy`.
- `error`.

היתרון: הם ניתנים לבדיקה ושימוש חוזר. החסרון: שגיאות בין הממשק ל־callback עלולות להישאר בלתי גלויות אם אין טיפול מפורש ב־`busy/error`.

### 7.2.2 טפסים מבוססי state

- ערכים נשמרים באובייקט `values`.
- שינוי נעשה עם `setValues(previous => ...)`.
- ה־form מאמת לפני `onSave`.
- ברוב הטפסים הערכים מנוקים לאחר שמירה מוצלחת.

### 7.2.3 ריכוז בעיות טעינה

משתמשים לעיתים קרובות ב:

```text
data.rows || []
```

או ב־helper כגון:

```text
rowsOf(answer)
```

ה־helper תומך בשני מבנים:

- מערך ישיר.
- אובייקט עם `rows`.

יש לשמור על מסכנות זו כאשר מחליפים endpoint או SDK.

### 7.2.4 עיבוד boolean

ב־Verse Songs מוגדר `isOn` כך:

- `false`, `"false"` ו־`0` נחשבים כ־לא פעיל.
- כל ערך אחר נחשב פעיל.

אין להחליף את זה ב־`Boolean(value)` בלי לשמור על התאימות לנתונים ישנים.

### 7.2.5 natural keys

ה־importers מנסים לזהות רשומה קיימת לפי:

- ספר + פרק.
- קוד מכירה.
- שם series.
- כותרת תפילה.
- reference.

זה חשוב מאוד לייבוא idempotent. אין להחליף את ה־lookup ב־`create` בלבד.

### 7.2.6 fallback ל־seed content

כמעט כל דפי התוכן הציבוריים משתמשים בשילוב של:

1. records מהשרת.
2. bundled seed content.
3. merge לפי title או מזהה דומה.

היתרון הוא שהאתר אינו ריק. החסרון הוא ששינוי בכותרת רשומה קיימת יכול ליצור כפילות זמנית של הרשומה הישנה והחדשה.

### 7.2.7 משתני CSS מותגיים

העיצוב מבוסס על:

- `BRAND_CSS`
- `lib/theme.js`
- משתני `--pr-*`.
- מחלקות `pr-*`.

שינוי ערכת נושא מתבצע ב־`ThemeContext`, ואין לשנות ישירות צבעים קשוחים אם רוצים שההגדרות יעבדו.

### 7.2.8 Tailwind מול CSS מותגי

המערכת משתמשת בעיקר ב־`pr-*`, אך חלק מהרכיבים הישנים משתמשים ב־Tailwind utilities. יש לוודא ש־Tailwind build כולל את המחלקות הנדרשות, ולא לבנות מחדש את כל העיצוב.

## 7.3 מקור האמת לפי סוג מידע

| סוג | מקור עיקרי | מקור משני |
|---|---|---|
| תוכן ציבורי | Entities דרך `contentApi` / `functions/content.js` | `seedContent` |
| התקדמות משתמש | Entities משויכים ל־`owner_email` | `localStorage` / IndexedDB |
| פרקים | `LugandaChapter`, `KjvPlusChapter`, Bible API | IndexedDB |
| הערות ספר | `StudyAnnotation` | IndexedDB |
| highlights/bookmarks | `StudyMark` | IndexedDB/local state |
| Q&A | `QAItem` | `QA_ITEMS` |
| תוכן תפילות | `Prayer` | `PRAYERS` |
| תוכן יומי | `Devotional` | `DEVOTIONALS` |
| Strong’s | `StrongEntry` | live lexicon |
| מצב נגן | `PlayerProvider` | זיכרון דפדפן לא נרשם כאן |
| סשן מנהל | `pr_admin_token`, `pr_admin_mode` | חשבון מנהל בשרת |

## 7.4 סיכונים ונקודות שיפור דחופות

### 7.4.1 סיסמת מנהל וסודות בקוד

ב־`functions/adminAuth.js` קיימים ערכי fallback דפופליים לסיסמת התחלה, reset key ו־session secret.

יש ל:

1. להסיר את הערכים מהקוד.
2. להגדיר secrets בסביבת הפלטפורמה.
3. לבצע rotation מיידי אם הקוד כבר פרסם.
4. לא להשאיר hash או reset key בקבצי `__trash`.
5. להשתמש ב־`ADMIN_INITIAL_PASSWORD` דרך מנגנון secrets בלבד.

### 7.4.2 SHA-256 פשוט אינו מתאים לאחסון סיסמאות

המימוש משתמש ב־SHA-256 עם salt, ללא KDF. גם אם ה־salt מונע זהות ישירה, הוא אינו מספיק עמיד מול GPU cracking.

מומלץ לעבור ל:

- PBKDF2.
- scrypt.
- Argon2id.

עם מספר iterations/עלות מותאם, והשוואת hash בזמן קבוע.

### 7.4.3 Token מנהל ב־localStorage

ה־token נמצא ב־`localStorage`, ולכן XSS יכול לגנוב אותו. עדיף:

- HttpOnly + Secure + SameSite cookie.
- או token קצר־חיים.
- להגביל token לפעולות admin בלבד.
- להוסיף CSP חזק.

### 7.4.4 הרשאות ownership

במספר entities של משתמשים מופיעים תפקירים כמו `user` ו־`authenticated`, אך לא תמיד ראו condition שמגביל רשומה לבעל `owner_email`.

אם ה־ACL אינו מוסיף בעצמו filter לפי בעלים, קורא מאומת עלול לקרוא או לשנות רשומות של אחרים. יש לוודא:

- ownership enforcement בצד השרת.
- סינון משתמש רק כ־UI נוסף.
- אין אפשרות להעביר `owner_email` דרך payload לא מורשה.

### 7.4.5 פונקציית Strong’s פתוחה לכתיבה

`strongsDefinition` מתארת עצמה כפתוחה לקוראים ומשמשת למילוי cache. יש להגביל:

- rate limiting.
- max batch size.
- whitelist של מקורות.
- timeout.
- אימות של תגובות חיצוניות.
- מניעת SSRF אם מתקבלים URL גמיש.

### 7.4.6 העלאת cover ב־VerseSongSeriesForm

ב־`VerseSongSeriesForm.handleUpload` מתבצעת כיום בדיקה לסיומות של אודיו:

- `mp3`
- `m4a`
- `wav`

בעוד השדה מיועד לכיסוי תמונה. יש להחליף את הבדיקה ל־`png/jpg/jpeg/webp/gif`, ולהוסיף בדיקת MIME ולא רק סיומת.

### 7.4.7 בדיקות העלאה חלשות

- יש לבדוק את ה־magic bytes של הקובץ.
- לא להסתמך על שם הקובץ.
- להגביל כמות קבצים.
- לנקות metadata אם מגישים לשרת ציבורי.
- לוודא שה־URL שמוחזר נמצא בתחום storage המאושר.

### 7.4.8 פענוח הפניות מקרא

מנגנון `matchesPassage` משתמש ב־`includes` על שם הספר. עלולה להיווצר התנגשות, למשל בין שמות דומים. מומלץ לנרמל reference ל־`book_number`, `chapter`, `verse_start`, `verse_end` ולהשתמש בהם במקום בחיפוש טקסט חופשי.

### 7.4.9 מקורות חיצוניים

המערכת משתמשת במקורות כגון:

- Bible API.
- WordPlanet.
- Bolls.
- Blue Letter Bible.
- Open Scriptures.
- שירותי proxy/CORS.

יש להוסיף לכל fetch:

- timeout.
- retry עם backoff.
- User-Agent מוגדר.
- validation של content type.
- טיפול מובנה ל־HTML חלולי.
- monitoring ל־schema drift.

## 7.5 בעיות consistency ושיתופי נתונים

### 7.5.1 כפילויות

אין כלל שמספר ייחודיים רשמיים בסכמות לרוב ה־entities. לכן חשוב להוסיף אילוצ unique ל־:

- ספר + פרק + שפה עבור chapters.
- `code` עבור `Devotional`.
- `setting_key`.
- `code` עבור `StrongEntry`.
- ספר + פרק עבור ChapterIntro.
- ספר + פרק + מספר פסוק עבור BibleVerse.

אם הפלטפורמה אינה תומכת באילוצים ייחודיים, יש לשמור upsert טבעי בכל import.

### 7.5.2 ספריות תנ"ך משוכפלות

רשימות הספרים ומספרי הפרקים מופיעות ב:

- `lib/bibleBooks.js`
- `functions/kjvInstall.js`
- `functions/lugandaInstall.js`
- `functions/scriptureAudit.js`
- `cron/scriptureInstall.js`

שינוי במקום אחד עלול ליצור סתירה. אם אפשר, יש להפיש מקור יחיד.

### 7.5.3 שמות שדות לא אחידים

למשל:

- `title` מול `title_en`.
- `body` מול `body_en`.
- `publish_date` מול `date` בקובצי import.
- `scripture` מול `scripture_ref`.
- `series` מול `series_name`.

ה־normalizers אחראים לכך, אך כל תוספת collection חדשה צריכה normalizer ולא להסתמך על שם השדה בלבד.

### 7.5.4 ערכי תאריך

- רוב התאריכים נשמרים כ־`YYYY-MM-DD`.
- תאריך יום ראשון מומלץ להיין local date.
- אין להשתמש ב־`toISOString()` ישירות כשרוצים תאריך מקומי, משום ש־UTC יכול להזיז את התאריך ביום.

### 7.5.5 React Query cache

חלק ממפתחות ה־query כוללים רק collection, למשל `["prayers"]`, ולא את מצב האימות. אם אותו cache משמש משתמשים מחוברים ולא מחוברים, עדכון אדמין עלול להיחשך או להופיע בעית לא נכון.

מומלץ:

- לכלול `authenticated`/`email` במפתח כשצריך.
- לבצע invalidation מפורשת לאחר import.
- לא להשתמש ב־seed data כאילו הוא ממדד רשת.

## 7.6 נגישות

המערכת כוללת תוויות ARIA, כפתורי icon עם `aria-label`, `aria-pressed` ו־`aria-current`.

נקודות לשיפור:

1. `Modal` אינו מממש focus trap ואינו מעביר focus לתחילת המודאל.
2. יש להוסיף `aria-labelledby` או להשתמש ב־`aria-label`.
3. כפתורי התפריטים צריכים לשמור על focus בעת החלפת tab.
4. להוסיף `aria-live` להודעות שמירה ושגיאה.
5. לבדוק ניווט מקלדת ב־QaLetterBar, VersionPicker ותפריטי ChapterReaderPane.
6. להוסיף reduced-motion לאנימציות scroll ו־spinner.

## 7.7 מדדי שגיאה ו־observability

מומלץ להוסיף:

- מזהה מבצע או correlation ID לכל import.
- דוח לכל שורה שנכשלה, כולל collection, natural key ושגיאת backend.
- מדדים לכיסוי פרקים.
- מדד לזמן אטימת קריאת מקור חיצוני.
- alert כאשר:
  - פרק לא מתקדם במשך כמה הרצות.
  - יש פער במספר פסוקים בין תרגומים.
  - מילון Strong’s אינו מכיל קודים בשימוש.
  - import הפיק יותר מ־N רשומות.
- אירוע audit לכניסת מנהל, reset password, import ומחיקה.

## 7.8 checklist להוספת feature

## הוספת Entity

1. ליצור `entities/EntityName.json`.
2. להגדיר שדות, required ו־ACL.
3. לוודא ownership בצד השרת.
4. להוסיף ל־`contentApi`/`functions/content.js` אם צריך קריאה ציבורית.
5. להוסיף ל־`adminCollections` אם נדרש ניהול גנרי.
6. להוסיף natural key ו־upsert.
7. להוסיף offline store רק אם התוכן נדרש offline.
8. להוסיף seed content אם הדף חייב להיראות מלא בהתקנה חדשה.

## הוספת Page

1. ליצור `pages/PageName.jsx`.
2. להוסיף ניתוב או לוודא שה־platform מזהה את שם הדף.
3. להוסיף ל־`AppHeader`, `AppFooter` או `AdminDashboard` לפי הצורך.
4. להגדיר מהי כתובת ה־URL ואילו query parameters מתקבלים.
5. להוסיף states של loading, empty, error ו־permission.
6. לבדוק התנהגות לא מחובר/מחובר.
7. לבדוק mobile, keyboard ו־PWA.

## הוספת Component

1. להשתמש במחלקות `pr-*`.
2. להעדיף props מעל תלות גלובלית.
3. להחזיר `null` או EmptyState כאשר אין תוכן.
4. להוסיף `aria-label` לאייקונים אינטראקטיביים.
5. להוסיף disabled ו־busy state לכל פעולת רשת.
6. לוודא ש־safeText משמש לכל נתון מהשרת שאינו בטוח מבנה מוכר.

## הוספת Import Format

1. לשמור על `format` יציב.
2. לא לשנות שמות שדות קיימים.
3. להוסיף validator עם מיקום שגיאה לפי שורה.
4. להשתמש ב־natural key.
5. לבצע dry run והצגת preview.
6. לוודא idempotency.
7. להוסיף rollback או רשימת ייבוא משנית.

## 7.9 checklist לפני deployment

- להחליף ולהסיר את כל סיסמאות ו־reset keys מהקוד.
- לא לפרוס `__trash` ו־`__url_fetch`.
- לבדוק secrets של functions.
- לבדוק ACL של כל entity אישית.
- לבדוק CORS, CSP ו־HTTPS.
- להגביל uploads לפי MIME ו־גודל.
- להריץ import בסביבת staging.
- להריץ audit מלא על 1,189 פרקים.
- לוודא cache version חדש ב־service worker.
- לבדוק PWA install ב־iOS ו־Android.
- לבדוק מצב offline לאחר ניקוי local storage.
- לבדוק imports חוזרים ללא כפילויות.
- לבדוק התחלת session ארוכה ו־renewal.
- לנטרל התראות לא רלוונטיות או stack traces למשתמש.

---

## סיכום

המערכת בנויה כמערכת תוכן דו־לשונית מלאה, לא רק כמסך קריאת תנ"ך. ה־Bible Reader הוא הליבה, אך סביבו פועלים:

- מנוע לימוד והערות.
- תפילות והפניות צלב.
- Strong’s.
- מכירות.
- Q&A.
- שירים עם נגן גלובלי.
- קהילה.
- התקדמות אישית.
- offline/PWA.
- CMS ותהליכי import.

הנקודות הקריטיות לתחזוקה הן **התאמת natural keys**, **עקביות bilingual**, **זהות ownership בשרת**, **עמידות מקורות חיצוניים**, **ניהול cache משתמש ו־offline**, ו**הסרת הסודות וה‑debug code שנמצאים במאגר**.
# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

> **הערת תיקופ:** התיעוד מבוסס על הקוד שסופק. חלק מהקבצים מסומנים ב-`[נחתך]`, ולכן פרטים מסוימים על הממשק המלא, שדות נוספים ועל התנהגות שרת מוסקים מעקבות הקוד, שמות הקבצים והמבנה המרכזי. כתובות ה־URL מבוססות על המוסכמה של `createPageUrl("PageName")`, כלומר `/PageName`, בהתאם ל־`public/manifest.json` ול־`public/sw.js`.

---

# 1. מהות המערכת

## 1.1 תיאור כללי

**Pray-Read Bible** היא אפליקציית React לקריאת התנ"ך, ליקוד, לתפילה וללימוד יומי. היא מחברה בין:

- קריאת פרקי תנ"ך באנגלית ובלוגנדה.
- מספר גרסאות תנ"ך, כולל KJV, KJV עם מספרי Strong's וגרסת רשת.
- הערות אישיות, הדגשות, קווי־תחת, סימניות והערות.
- משאלים בנושאי תיאולוגיה, היסטוריה, פירוש ותפילה.
- מדריך קריאה בן 30 יום, יומן תפילה ומעקב התקדמות.
- תפילות יומיות, ביקורי יום, סרטוני Verse-Song וניהול תור.
- קהילה: גילויים/השרדות אישיות, תגובות, שיעורים חיים וקבוצות דיון.
- מרכז הורדה לשימוש לא מקוון, התקנה כ־PWA והמשך השמעה בין דפים.

המערכת פועלת בעיקר כ־**Single Page Application**. הנתיבים מנוהלים על ידי מערכת ה־FSe2, וה־`Layout` מעטיף את כל הדפים באותו מעטפת עיצוב, אימות, נגן אודיו גלובלי ורישום PWA.

---

## 1.2 קהל היעד

1. **קוראים שלא מחוברים**  -  יכולים לקרוא את התוכן הציבורי, להשתמש בחיפוש, לשתף ולהוריד תוכן למכשיר.
2. **קוראים רשומים**  -  מקבלים היסטוריית קריאה, הערות, סימניות, יומן, התקדמות דיבאות ותפילות שמורות.
3. **קהילת הקוראים**  -  משתפים גילויים, מגיבים, מצטרפים לקבוצות ומשתפים משמעות אישית.
4. **מנהלי תוכן**  -  מנהלים דיבאות, תפילות, מאמרים, שירים, תוכן קהילה, הגדרות וצבעי האתר.
5. **מנהלי ספרייה**  -  מתקינים את התנ"ך הלוגנדה, את KJV+ ואת מילון Strong's, ומנטרים פערים בכיסוי הפרקים.

---

## 1.3 הערך שהמערכת מספקת

- **קריאה ממוקדת:** קריאת פרק שלם במקום אתרים קצרים ורציפים.
- **חיבור בין מקרא לחיים:** כל פרק מחובר להערות, פירושים, תוכן היסטורי, תפילה ופעולות מעקב.
- **אישיות:** הדגשות והערות נשמרות בחשבון וגם במכשיר, כך שאפשר להמשיך ללא חיבור.
- **נגישות ללא חיבור:** IndexedDB, קבצי מטמון ו-Service Worker.
- **תוכן דו־לשוני:** אנגלית ולוגנדה, כולל פורמט תפילות ותוכן העברה מותאם.
- **למידה עם קהילה:** דיון, תגובות, קבוצות ושיעורים חיים.
- **מדדיקות למנהל:** דוח כיסוי לכל ספר ופרק, כולל פרקים חסרים ופגומים.

---

## 1.4 ארכיטקטורה

```text
FSe2 Router
   │
   ▼
Layout.jsx
   ├── AuthProvider
   ├── ThemeProvider
   └── PlayerProvider
          │
          ▼
       Pages
          │
          ├── Reusable components
          ├── Domain libraries ב־lib/
          └── React Query data layer
                    │
                    ▼
                fse2 client
             ┌──────┴────────┐
             ▼               ▼
       Entities          Functions
             │               │
             └──────┬────────┘
                    ▼
       IndexedDB / LocalStorage / External sources
```

### שכבות עיקריות

| שכבה | תפקיד |
|---|---|
| `pages/` | מסכי המוצר המלאים והתהליכים ברמת הדף |
| `components/` | רכיבי UI חוזרים ויחידות תצוגה ממוקדות |
| `lib/` | לוגיקת עסק, עזרי parsing, זיכרון מקומי, נתוני seed ושירותים |
| `entities/` | הגדרות סכמת הנתונים והרשאות גישה |
| `functions/` | לוגיקת שרת: התקנות, תוכן ציבורי, אימות מנהל ושליפת תנ"ך |
| `cron/` | משימות תקינה שוטפת |
| `public/` | Manifest, Service Worker, favicon ונכסים |
| `__trash/` | קוד ישן או ניסיוני, אינו חלק מהמסלול הפעיל |

---

# 2. עמודים ותפקידיהם

## 2.1 דפי תוכן ומסלולי גלישה

| עמוד | כתובת | תפקיד וערך | אינטראקציות מרכזיות |
|---|---|---|---|
| **Home** | `/Home` | דף הבית והכניסה הראשית לאפליקציה. מציג את המסר המרכזי, כניסות לתוכן המרכזי, פסוק היום, תצוגת קהילה והנחיות PWA. | לחיצה על כרטיסי התוכן, מעבר ל־Bible Reader, פתיחת פסוק היום, שיתוף, בקשת התקנת PWA, מעבר לקהילה ולעמודי משאבים. |
| **About** | `/About` | מספר את זהות Pray-Read, המטרה התיאולוגית והערכים של השירות. קיים כדי לבנות אמון ולהסביר את האופן שבו האפליקציה משמשת לקריאה ותפילה. | ניווט לדף הבית, קישורים לדפים מרכזיים, CTA להתחלת קריאה או לתמיכה. |
| **BibleReader** | `/BibleReader` | מסך בחירת הספרים. מציג את 66 הספרים בעברית ולוגנדה, עם חיפוש, החלקה בין הברית הקדומה לחדשה וסימון זמינות לקריאה לא מקוונת. | חיפוש ספר, מעבר לשונית Old/New Testament, לחיצה על ספר, המשך למסך בחירת הפרקים והמשאבים, סימון ספר שכל פרקיו זמינים במכשיר. |
| **Chapter** | `/Chapter?book=<number>&chapter=<number>&verse=<number>&lang=lu` | מסך הקריאה המרכזי. טוען פרק, מציג אותו פסוק־פסוק, מאפשר לשנות גרסת תנ"ך, לבחור פסוק ולפתוח משאבי לימוד. | החלפת גרסה, השמעה/העתקה/שיתוף פסוק, הדגשה, סימנייה, הערה, תפילה, הערות־מקרא, פתיחת פסוקים קשורים, פתיחת Strong's, משאבים תיאולוגיים/היסטוריים, סיום קריאה ושמירה לאופליין. |
| **BibleNotes** | `/BibleNotes` | מאגר הערות האישיות של הקורא: הדגשות, סימניות והערות. מאפשר לחזור לפסוק המסומן. | המערכת מסננת רשומות לפי המשתמש, מציג רשימה משולבת ומאפשר לחזור לפסוק דרך קישור. כאשר אין כניסה, מוצגת הנחיה להתחבר. |
| **Plan** | `/Plan` | מציג את מסע הקריאה בן 30 הימים ואת מצב השלמה של כל יום. | סימון completed/current/upcoming, חישוב התקדמות, לחיצה על יום שמובילה לפרק המתאים. |
| **Devotionals** | `/Devotionals?devotional=<code>` | ספריית התפילות היומיות, עם תצוגת רשימה ותצוגת פתיחה מלאה. | חיפוש, בחירת תוכן, סימון כהושלם, שיתוף, עברית/לוגנדה וחזרה לרשימה. קוד דיבאות יכול להיפתח גם דרך פרמטר URL. |
| **PrayerLibrary** | `/PrayerLibrary` | ספריית תפילות לפי קטגוריה ושפה. | חיפוש, סינון קטגוריה, החלפת שפה, שמירה למועדפים והסרה, שיתוף. |
| **QA** | `/QA` | מאגר שאלות קוראים ותשובות פסטורליות/מקצועיות, וכן שליחת שאלה חדשה. | חיפוש, סינון קטגוריה, פתיחת תשובה, שליחת שאלה עם אימות, מצב הצלחה והודעת שגיאה. |
| **HistoricalInsights** | `/HistoricalInsights` | תצוגת תובנות היסטוריות לפי ספר או פסוק. | חיפוש, פתיחת תובנה, שיתוף ושמירה מקומית למועדפים. |
| **TheologicalInsights** | `/TheologicalInsights` | תצוגת תובנות תיאולוגיות באותו מודל כמו התובנות ההיסטוריות. | חיפוש, פתיחה, שיתוף ושמירה. |
| **VerseOfDay** | `/VerseOfDay` | מציג פסוק אחד ליום, עם תצוגת עברית/לוגנדה ושיתוף. | בחירת הפסוק לפי תאריך, מעבר לפרק המלא, שיתוף. |
| **VerseSongs** | `/VerseSongs` | מקטלוג סדרות Verse-Song והפעלת הפעלה גלובלית. | בחירת סדרה, השמעת פרק, הפעלת תור, ניהול דילוג ושגיאת טעינה. |
| **VerseSongSeries** | `/VerseSongSeries?series=<name>` | עמוד סדרה מלא עם רשימת הפרקים שלה. | בחירת פרק, השמעת הסדרה כולה, המשך מהפרק שנבחר, חזרה למקטלוג. |
| **Community** | `/Community` | מרכז קהילה שמפנה לשלושה אזורים: Revelations, Live Teaching ו־Discussion Groups. מציג גם תצוגת ממוקדת של פעילות אחרונה. | מעבר לאחד משלושת האזורים, פתיחת דיון או שיעור, צפייה בפרסומים אחרונים. |
| **CommunityRevelations** | `/CommunityRevelations` | פיד שיתופים אישיים, לייקים ותגובות. | פרסום גילוי, לייק, פתיחת/סגירת שרשור תגובות, מענה, התחברות לפרסום. |
| **CommunityLiveTeaching** | `/CommunityLiveTeaching` | לוח שיעורים חיים עם תאריך, מנחה וקישור הצטרפות. | פתיחת מושב, הצטרפות דרך קישור, מיון/תצוגה לפי נתונים חיים או seed. |
| **DiscussionGroups** | `/DiscussionGroups?group=<name>` | קבוצות לימוד משותפות ושיחות בתוך קבוצה. | בחירת קבוצה, הצטרפות מקומית, פתיחת שיחה, מענה להודעות. |
| **Contact** | `/Contact` | שליחת פנייה לצוות. | מילוי שם, דוא"ל, נושא והודעה; אימות מקומי; מצב שליחה ושגיאה. |
| **Dashboard** | `/Dashboard` | לוח בקרה אישי: קריאה אחרונה, רצף ימים, סימניות, הערות, התקדמות דיבאות, תפילות שמורות, אחסון אופליין ופיד פעילות. | מעבר להערות, יומן, אופליין ודפי תוכן, הצגת סטטיסטיקות ופעילות אחרונה. |
| **Journal** | `/Journal?new=1&book=<name>&chapter=<n>` | יומן תפילה אישי עם קטגוריות, רישום ספר/פרק ועריכה. | יצירה, עריכה, מחיקה, סינון לפי קטגוריה, בחירת פרק מתוך מסלול הקריאה. |
| **Offline** | `/Offline` | מרכז הורדות וניהול המטמון המקומי. | בחירת תוכן, בחירת היקף: תוכנית קריאה או כל התנ"ך, הורדה לפי גרסה, הצגת התקדמות, מחיקה ובדיקת מכסת אחסון. |
| **InstallPrompt** | `/InstallPrompt` | הסבר והתקנת האפליקציה כ־PWA במכשירים שונים. | זיהוי מערכת, הפעלת `beforeinstallprompt`, מדריך ל־iOS/Desktop, טיפול ב־`appinstalled`. |
| **Login** | `/Login?next=<path>` | כניסת קורא לחשבון. | אימות דוא"ל/סיסמה, הפניית חזרה ל־`next`, הצגת שגיאה ומצב טעינה. |
| **Signup** | `/Signup` | הרשמת קורא חדש. | שם, דוא"ל, סיסמה, אימות סיסמה, קבלת תנאי שימוש, בדיקת חוזקת סיסמה, הדגמת אימות דוא"ל. |
| **ForgotPassword** | `/ForgotPassword` | שליחת קישור שחזור סיסמה. | אימות כתובת דוא"ל, שליחת בקשה, מצב "נשלחה הודעה". |
| **ResetPassword** | `/ResetPassword?token=<token>` | קביעת סיסמה חדשה לאחר אימות האימיות. | בדיקת token, הזנת סיסמה ואימות, אורך מזערי של 8 תווים, עדכון סיסמה והצגת הצלחה. |
| **Logout** | `/Logout` | מסך תצוגה קצר שמנתק את המשתמש ומחזיר לדף הבית. | המתנה של 900ms ולאחריה `logout(false)` וניתוב חלופי ל־Home. |
| **Privacy** | `/Privacy` | מסמך פרטיות המסביר מה נשמר בחשבון, מה נשמר מקומית ומה נמחק. | קריאה בלבד, עם ניווט חזרה. |
| **Terms** | `/Terms` | תנאי שימוש והבהרות על שימוש בתוכן ובתרגומים. | קריאה בלבד, עם ניווט חזרה. |

---

## 2.2 דפי ניהול

| עמוד | כתובת | תפקיד | אינטראקציות מרכזיות |
|---|---|---|---|
| **Admin** | `/Admin` | כניסה נפרדת למנהל תוכן, עם token חתום ותוקף מוגבל. | הזנת דוא"ל/סיסמה, קריאת session קיים, שמירת token ב־localStorage, מעבר ל־AdminDashboard. |
| **AdminDashboard** | `/AdminDashboard` | מרכז ניהול תוכן, ספרים, משתמשים, הודעות, ערכת ערכים, צבעים ויומן פעילות. | הוספה, עריכה, מחיקה והעלאה לפי סוג entity; ניהול דיבאות, תפילות, Verse-Songs, Q&A, תובנות, הודעות, משתמשים, הגדרות ו־SiteSettings; הפעלת מתקני Luganda ו־KJV+; הצגת כיסוי פרקים. |

### מקטעי `AdminDashboard`

| מקטע | תוכן |
|---|---|
| `overview` | מדדי ספירה ופעילות כלליים. |
| `books` | ניהול פרקי תנ"ך ומצב הכיסוי. |
| `luganda` | התקנת התנ"ך הלוגנדה וניטור פרקים חסרים/פגומים. |
| `kjvplus` | התקנת KJV+ ומילון Strong's. |
| `devotionals` | ניהול דיבאות אנגלית/לוגנדה. |
| `prayers` | ניהול תפילות וקטגוריות. |
| `songs` | ניהול סדרות ופרקי Verse-Song. |
| `qa` | ניהול שאלות ותשובות. |
| `insights` | ניהול תובנות תיאולוגיות והיסטוריות. |
| `users` | צפייה במשתמשים ופעולות מנהלתיות. |
| `messages` | צפייה בהודעות צור קשר וסימון כנקראו. |
| `theme` | עדכון צבעי המותג, שם האתר וקישור התרומה. |
| `activity` | יומן פעילות מנהלים. |
| `settings` | הגדרות כלליות. |

---

# 3. מפת ניווט לצורך DEBUG

## 3.1 ניווט ראשי

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת דף הבית | Header, Footer, מסכי שגיאה | לוגו, Home, קישור חזרה | `/Home` |
| מעבר לכל הספרים | Header, Home, Footer | Bible Reader | `/BibleReader` |
| מעבר לתוכן יומי | Header, Home, Footer | Devotionals | `/Devotionals` |
| מעבר לספריית התפילות | Header, Home, Footer | Prayer Library | `/PrayerLibrary` |
| מעבר לשירים | Header, Home, Footer | Verse-Songs | `/VerseSongs` |
| מעבר לשאלות ותשובות | Header, Home, Footer | Q&A | `/QA` |
| מעבר לקהילה | Header, Home, Footer | Community | `/Community` |
| מעבר ללוח אישי | Header, Home, Footer | Dashboard | `/Dashboard` |
| מעבר למרכז אופליין | Header, Footer, Dashboard | Offline Centre | `/Offline` |
| מעבר ליומן | Header, Footer, Dashboard | Prayer Journal | `/Journal` |
| מעבר למדריך קריאה | Header, Footer | Reading Plan | `/Plan` |
| מעבר להערות | Header, Footer, Dashboard | My Notes | `/BibleNotes` |
| מעבר לפסוק היום | Header, Home | Verse of the day | `/VerseOfDay` |
| מעבר לתובנות תיאולוגיות | Header, Footer | Theological Insights | `/TheologicalInsights` |
| מעבר לתובנות היסטוריות | Header, Footer | Historical Insights | `/HistoricalInsights` |
| כניסת קורא | Header | Sign in | `/Login` |
| יצירת חשבון | Header, Login | Create account | `/Signup` |
| יציאה | Header | Logout | `/Logout` ולאחר מכן `/Home` |
| שחזור סיסמה | Login | Forgot password | `/ForgotPassword` |
| איפוס סיסמה | קישור אימות | Reset password | `/ResetPassword?token=...` |
| התקנת PWA | Home, InstallPrompt | Install app | התקנת ה־PWA בדפדפן |

## 3.2 ניווט בקריאת התנ"ך

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| חיפוש ספר | BibleReader | שדה Book search | סינון 66 הספרים לפי אנגלית/לוגנדה |
| מעבר בין הברית הקדומה לחדשה | BibleReader | Old/New Testament tabs | גלילה למקטע המתאים |
| בחירת ספר | BibleReader | כרטיס ספר | מסך בחירת פרק ומשאבי הספר |
| פתיחת פרק | ChapterSelector / ChapterGrid | מספר פרק | `/Chapter?book=...&chapter=...` |
| החלפת גרסת תנ"ך | Chapter | VersionPicker | KJV, KJV+, Luganda או גרסת רשת |
| בחירת פסוק | Chapter | לחיצה על פסוק | פתיחת Verse Action Bar |
| הדגשת פסוק | VerseActionBar | Highlight + צבע | שמירת `StudyMark` |
| סימניית | VerseActionBar | Bookmark | שמירת `StudyMark` |
| הוספת הערה | VerseActionBar | Note | שמירת `StudyMark` מסוג note |
| העתקת פסוק | VerseActionBar | Copy | Clipboard |
| שיתוף פסוק | VerseActionBar | Share | ShareSheet או Web Share API |
| פתיחת תפילה לפסוק | VerseActionBar | Prayer | PassagePrayer |
| פתיחת הערות־מקרא | VerseActionBar | Cross references | FloatingVerse |
| פתיחת פירוש | VerseActionBar / PassageTabs | Commentary | PassageTabs |
| פתיחת מספר Strong's | פסוק KJV+ | קוד כחול | StrongsPopup |
| מעבר למשאבי הפרק | ChapterReaderPane | Intro / Commentary / Prayer / Resources | ChapterSidebar / ChapterResourcesPanel |
| פתיחת קטע מתוך מבוא או תפילה | BookSidebar / ChapterSidebar | קישור מקרא | VersePopup בתוך הדף |
| סיום קריאת פרק | Chapter | סיום/שמירת התקדמות | רשומת `Reading` והתקדמות תוכנית |

## 3.3 ניווט בקהילה ובתוכן

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת אזור קהילה | Community | Revelations | `/CommunityRevelations` |
| פתיחת אזור קהילה | Community | Live teaching | `/CommunityLiveTeaching` |
| פתיחת אזור קהילה | Community | Discussion groups | `/DiscussionGroups` |
| פרסום גילוי | CommunityRevelations | Share what God showed you | יצירת `Revelation` |
| מענה על גילוי | RevelationCard | Comments | CommentThread |
| לייק גילוי | RevelationCard | Like | עדכון מספר לייקים |
| מענה בקבוצה | DiscussionGroups | טקסט הודעה | יצירת `DiscussionThread` |
| הצטרפות לקבוצה | DiscussionGroups | Join | שמירה מקומית בלבד |
| פתיחת סדרת שירים | VerseSongs | שם הסדרה | `/VerseSongSeries?series=...` |
| השמעת פרק בסדרה | VerseSongSeries | Play episode | הפעלת queue גלובלית |
| פתיחת דיבאות | Devotionals | כרטיס דיבאות | תצוגת מלאה/מודאל |
| סימון דיבאות כהושלם | Devotionals | Mark complete | `DevotionalProgress` + local state |
| פתיחת פסוק יום | VerseOfDay | פסוק/קישור | `/Chapter?...` |

## 3.4 ניווט ניהול

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| כניסת מנהל | `/Admin` | Sign in | `/AdminDashboard` |
| חזרה לאתר | AdminDashboard | חזרה לאתר | `/Home` |
| התקנת Luganda | AdminDashboard → Luganda | Install missing | `lugandaInstall` |
| תיקון פרקים פגומים | AdminDashboard → Luganda | Retry broken | `lugandaInstall` |
| התקנת KJV+ | AdminDashboard → KJV+ | Install missing | `kjvInstall` |
| מילוי מילון Strong's | AdminDashboard → KJV+ | Prepare dictionary | `kjvInstall`/`strongsDefinition` |
| הוספת תוכן | מקטע ניהול | Add | טופס לפי `FIELDS` |
| עריכת תוכן | טבלת תוכן | Edit | טופס מלא |
| מחיקת תוכן | טבלת תוכן | Delete | פעולת delete דרך `adminContent` |
| שינוי ערכת נושא | Text Colours | עדכון צבעים | `SiteSettings` |
| התנתקות מנהל | AdminDashboard | Logout | מחיקת token וחזרה ל־Admin |

---

# 4. מבנה קבצים

## 4.1 דפים פעילים

הדפים הפעילים הם:

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
- `pages/Offline.jsx`
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

כל דף מייצג מסלול מוצרי ברמת המשתמש. הם משתמשים ברכיבים מ־`components/` ובשירותי תחום מ־`lib/`.

---

## 4.2 רכיבי ניהול

| קובץ | תפקיד |
|---|---|
| `components/admin/ChapterCoverage.jsx` | מציג כיסוי פרקים לפי ספר, מפרט פרקים חסרים ופגומים, ודוח כיסוי כללי. |
| `components/admin/KjvPlusInstaller.jsx` | מנהל התקנת KJV+ ומילון Strong's דרך ה־function `kjvInstall`. |
| `components/admin/LugandaInstaller.jsx` | מנהל התקנת התנ"ך הלוגנדה דרך `lugandaInstall`. |

## 4.3 רכיבים משותפים

| קובץ | תפקיד |
|---|---|
| `components/common/EmptyState.jsx` | מצב ריק אחיד עם אייקון, כותרת, תיאור ופעולה אופציונלית. |
| `components/common/Modal.jsx` | מודאל נגיש עם כותרת, תת־כותרת, תוכן, פוטר, סגירה ב־Escape וחסימת גלילת הגוף. |
| `components/common/PageHeader.jsx` | כותרת אחידה לדפים, בגרסת hero עם תמונה או גרסת section פשוטה. |
| `components/common/Pagination.jsx` | מתקדם עמודים מקומפקט עם דפים ראשונים/אחרונים, אליפסיס וכפתורי קודם/בא. |
| `components/common/ShareRow.jsx` | שורת כפתורי שיתוף לפניקודים חברתיים והעתקה. |
| `components/common/Spinner.jsx` | מצב טעינה אחיד עם `role="status"` ו־aria live. |

## 4.4 רכיבי קהילה

| קובץ | תפקיד |
|---|---|
| `components/community/CommentThread.jsx` | מציג תגובות לגילוי ומאפשר למשתמש מחובר להוסיף תגובה. |
| `components/community/RevelationCard.jsx` | כרטיס גילוי: מחבר, פסוק, כותרת, גוף, לייקים ותגובות. |
| `components/community/RevelationForm.jsx` | טופס יצירת גילוי; למשתמש שאינו מחובר מציג הנחיה לכניסה. |
| `components/community/ThreadMessages.jsx` | צג שיחות בקבוצת דיון וטופס מענה. |

## 4.5 רכיבי Dashboard, Home, Insight ו־Journal

| קובץ | תפקיד |
|---|---|
| `components/dashboard/ActivityFeed.jsx` | פיד פעילות אישי עם אייקונים, צבעים, זמן יחסי וקישור לפעולה. |
| `components/home/StatCard.jsx` | כרטיס סטטיסטיקה לשימוש בדפי הבית וה־Dashboard. |
| `components/insight/InsightsBoard.jsx` | לוח תובנות אחיד לתובנות תיאולוגיות והיסטוריות, עם חיפוש, פתיחה, שיתוף ושמירה. |
| `components/journal/JournalCard.jsx` | כרטיס רשומת יומן עם קטגוריה, תאריך, ספר/פרק, עריכה ומחיקה. |
| `components/journal/JournalForm.jsx` | טופס יצירה/עריכה של רשומת יומן עם ולידציה מקומית. |

## 4.6 רכיבי Layout

| קובץ | תפקיד |
|---|---|
| `components/layout/AppHeader.jsx` | Header רספונסיבי עם לוגו, ניווט ראשי ומשני, תפריט מובייל, מצב כניסה, התרמה, הורדה והתראות. |
| `components/layout/AppFooter.jsx` | Footer עם לוגו, קישורי תוכן מהירים, מידע משפטי, תמיכה וקישורי התקנה. |
| `components/layout/GlobalPlayer.jsx` | נגן אודיו גלובלי: queue, השמעה/השהיה, חיפוש, העברה, מהירות, עוצמה, shuffle, repeat וגיליון מורחב. |
| `components/layout/PwaHead.jsx` | מוסיף meta tags של PWA, manifest, favicon, Apple icon ורושם את ה־Service Worker. |

## 4.7 רכיבי תוכנית קריאה

| קובץ | תפקיד |
|---|---|
| `components/plan/PlanRow.jsx` | שורת יום בתוכנית, מצב completed/current/upcoming וקישור לפרק. |

## 4.8 רכיבי הקורא

| קובץ | תפקיד |
|---|---|
| `components/read/AnnotatedText.jsx` | מצייד טקסט, מאפשר לבחור טקסט ולהדגיש או להוסיף קו תחת, תוך חישוב segments לפי offsets. |
| `components/read/BookGrid.jsx` | רשת ספרי התנ"ך עם חיפוש, החלקת ברית וגלילה למקטע. |
| `components/read/BookIntro.jsx` | מבוא הספר, עובדות ספר, מקראים מרכזיים והערות קורא. |
| `components/read/BookOutline.jsx` | מבנה הספר עם כותרות וטווחי פסוקים הניתנים לפתיחה. |
| `components/read/BookPrayerPanel.jsx` | תפילת הספר, החלפת אנגלית/לוגנדה וקישורי מקרא פנימיים. |
| `components/read/BookSidebar.jsx` | חלונית ספר עם שלושה אזורים: מבוא, מבנה ותפילה. |
| `components/read/BookStudyResources.jsx` | פירוש, תובנות תיאולוגיות והיסטוריות ברמת הספר, עם pagination. |
| `components/read/ChapterClosingPrayer.jsx` | תפילת סיום לפרק, בשפה נבחרת, עם שיתוף וקישור למקרא. |
| `components/read/ChapterGrid.jsx` | רשת מספרי הפרקים של הספר. |
| `components/read/ChapterReaderPane.jsx` | עמודת הקריאה ותפריט המשאבים הרספונסיבי. |
| `components/read/ChapterResourcesPanel.jsx` | תובנות תיאולוגיות והיסטוריות ברמת פרק, עם fallback לרמת הספר. |
| `components/read/ChapterSelector.jsx` | מסך בחירת פרק לאחר בחירת ספר, הכולל חלונית ספר, רשת פרקים ומשאבים. |
| `components/read/ChapterSidebar.jsx` | מבוא פרק, פירוש ותפילת סיום בחלונית נפרדת. |
| `components/read/FloatingVerse.jsx` | חלון צף להצגת פסוק קשור ומעבר אליו במקום המלא. |
| `components/read/PassagePrayer.jsx` | מציג תפילות המתאימות לפסוק ולטווח פסוקים. |
| `components/read/PassageTabs.jsx` | לשוניות לפירוש, תובנות ו־Q&A עבור הפסוק הנוכחי. |
| `components/read/ShareSheet.jsx` | מודאל שיתוף הכולל את הפסוק, התרגום השני, התפילה וההערות־מקרא. |
| `components/read/StrongsPopup.jsx` | מציג הגדרת Strong's ושומר עותק מקומי לשימוש חוזר. |
| `components/read/StrongsText.jsx` | מפרק קודי `(G2424)` מתוך הפסוק והופך אותם לקישורי superscript. |
| `components/read/VerseActionBar.jsx` | סרגל פעולות לכל פסוק: תפילה, הערות־מקרא, פירוש, הדגשה, שיתוף, סימנייה, העתקה והערה. |
| `components/read/VerseList.jsx` | תצוגת פסוקים פשוטה ונמוכה־רמה, שמורה כרכיב בסיסי. |
| `components/read/VersePopup.jsx` | מודאל/חלון פנימי לטעינת פסוק מתקרא והצגתו ללא עזיבת הדף. |
| `components/read/VersionPicker.jsx` | בחירה, התקנה, הסרה והחלפה של גרסאות תנ"ך. |

---

## 4.9 ספריות תחום ב־`lib/`

| קובץ | תפקיד |
|---|---|
| `lib/activity.js` | קביעת סוגי פעילות וכתיבת `ReadingActivity` בצורה שלא תפיל את פעולת המשתמש. |
| `lib/adminSession.js` | קריאה, שמירה ומחיקה של token המנהל; עוטף קריאה ל־`adminAuth`. |
| `lib/app-params.js` | פרמטרי אפליקציה בסגנון FSe2, הנקראים מ־localStorage ומ־`window`. |
| `lib/AuthContext.jsx` | Provider של מצב המשתמש, בדיקת session, התחברות, התנתקות והפניית login. |
| `lib/bibleApi.js` | API מאחד להבאת פרק לפי גרסה, עם תמיכה באופליין, מקורות מותקנים, Strong's וניקוי טקסט. |
| `lib/bibleBooks.js` | מאגר סטטי של 66 הספרים: מספר, שם, קיצור, שם לוגנדה ומספר פרקים. |
| `lib/bookGuides.js` | מבוא ומבנה לכל ספר. |
| `lib/bookPrayers.js` | תפילה אנגלית ולוגנדה לכל ספר, עם קישורי מקרא. |
| `lib/bookStudyContent.js` | תוכן לימוד חלופי לכל ספר: תיאולוגיה והיסטוריה. |
| `lib/brandCss.js` | מערכת העיצוב המרכזית `pr-*` ומשתני CSS של המותג. |
| `lib/chapterStudy.js` | בניית מבוא, פירוש ותפילה ברמת פרק מתוך מקורות הספר והתוכן הפרסומי. |
| `lib/contentApi.js` | ממשק אחיד בצד הדפדפן לשליפת קולקציות תוכן ופעולות ציבוריות. |
| `lib/crossRefs.js` | הערות־מקרא מבחרות לפסוקים פופולריים. |
| `lib/format.js` | עזרי תצוגה: טקסט בטוח, רשימות, case, משך זמן, גודל קבצים ועוד. |
| `lib/keyPassages.js` | שלושה מקראים מרכזיים לכל ספר. |
| `lib/luganda.js` | פורמט תפילות לוגנדה: כותרות, פסוקים, קטעי יישום ותפילה. |
| `lib/offlineDb.js` | מעטפת IndexedDB ו־stores לספרים, פרקים, מטמון, סימניות והערות. |
| `lib/planData.js` | נתוני fallback לתוכנית הקריאה בן 30 הימים. |
| `lib/player.jsx` | Provider ו־API של נגן האודיו הגלובלי. |
| `lib/reading.js` | תאריכים ב־ISO, הזזת ימים, עיצוב תאריכים, רצף קריאה ונתוני שבוע. |
| `lib/readings.js` | חיפוש יום בתוכנית ושמירת התקדמות קריאה. |
| `lib/scriptureRefs.js` | parsing ו־resolution של מקראים כגון `John 3:16` ו־`Philippians 4:6-7`. |
| `lib/seedContent.js` | תוכן חלופי לדיבאות, תפילות, תובנות, שירים, קבוצות ועוד. |
| `lib/share.js` | בניית קישורי שיתוף, Web Share API והעתקת טקסט. |
| `lib/strongs.js` | נרמול קודי Strong's, קידומת שפה ועזרי תצוגה. |
| `lib/studyAnnotations.js` | מפתחות יציבים, מיזוג ושמירה/מחיקה של הדגשות והקווי־תחת בשרת ובאופליין. |
| `lib/textSelection.js` | מניעת click על קישור כאשר המשתמש באמצע בחירת טקסט. |
| `lib/theme.js` | קבועי מותג, צבעים, לוגו, תמונות, קישורי תרומה ומפתחי localStorage. |
| `lib/themeContext.jsx` | טעינת ערכת נושא, יצירת גוונים נגזרים ועדכון משתני CSS. |
| `lib/versions.js` | הגדרת גרסאות התנ"ך, גרסת ברירת מחדל, רשימת גרסאות מותקנות והחלפת גרסה פעילה. |

## 4.10 Functions ו־Cron

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | כניסת מנהל, בדיקת session, hashing וחתימת token. |
| `functions/adminContent.js` | API גנרי ל-CRUD של תוכן מנוהל לאחר אימות admin token. |
| `functions/bibleChapter.js` | השגת פרק ממקורות חיצוניים וניקוי/נרמול התשובה. |
| `functions/content.js` | API ציבורי לתוכן ולשליחות כגון צור קשר ושאלות. |
| `functions/kjvInstall.js` | התקנת KJV+ לפי פרק והכנת מילון Strong's. |
| `functions/lugandaInstall.js` | התקנת תנ"ך לוגנדה לפי פרק. |
| `functions/strongsDefinition.js` | אכסון והעשרת הגדרות Strong's ממקורות מילוניים. |
| `cron/scriptureInstall.js` | משימה שעתית להשלמת הפרקים החסרים והמילון, עם עצירה כשאין התקדמות. |

## 4.11 קבצי שורש ו־PWA

| קובץ | תפקיד |
|---|---|
| `Layout.jsx` | מעטפת האפליקציה: providers, header, main, footer, PWA ונגן גלובלי. |
| `__generated/tailwind.css` | תוצר של utility classes של Tailwind הנמצאים בפרויקט. אינו מחליף קובץ Tailwind מלא. |
| `public/manifest.json` | הגדרת PWA: שם, תצוגה, צבעים, תחילה ואייקונים. |
| `public/sw.js` | Service Worker עם cache-first ל־app shell ולתמונות, ו־network-first לרשת. |
| `public/assets/generated_*.png` | נכסי תמונה שנוצרו אוטומטית; חלקם עשויים לשמש כרקעים/עיצוב. |
| `public/assets/ingested/*` | נכסים שיובאו לתיקייה. |
| `public/assets/media-library/*` | ספריית מדיה: לוגו, favicon, תמונות, מסמכי תכנון, קובץ ZIP וקובצי יישום. |

### קבצי `media-library` בשם מדויק

- `0c85aa753009_image.png`
- `167e76d5f5ba_image.png`
- `1d6d87cb476f_image.png`
- `1ec9f04959c2_image.png`
- `350264576583_image.png`
- `3c1ee7293fba_image.png`
- `3f5c848bd24a_image.png`
- `43328fef264e_image.png`
- `4345fa1c4c79_icon-512x512.png`
- `58132ad5907d_image.png`
- `63b0fbb0b77e_image.png`
- `69a5f10e35c8_image.png`
- `708b8e11d494_image.png`
- `7e9991b2d1af_image.png`
- `803b8ad26a46_image.png`
- `8b6bfb5e2978_image.png`
- `9865967db356_Pray-Read-Bible-Prompt-3-Bible-Reader-Rebuild.pdf`
- `a6f2acb34271_image.png`
- `aba3dd407174_image.png`
- `b4a70bcd3e36_image.png`
- `b50e6c213bb8_pray-read-pneuma-main-3.zip`
- `b8660c2286d0_PrayRead-logo-2.png`
- `be81da5e995e_image.png`
- `d90047a8174d_image.png`
- `e5b6f7373a8f_image.png`
- `ee0d38d9f96a_image.png`
- `ee6ae196bbbc_favicon.ico`
- `f3b0b02ae7a0_image.png`
- `f438ed2a3a0d_Pray-Read-Bible-Master-Prompt-For-Finestructure-Ai.pdf`
- `f4ad877aa93e_WhatsApp-Image-2026-11-23-at-4-49-46-PM.jpeg`
- `f8aa8ef69f41_image.png`

> חלק מהנכסים מופנים בקוד דרך נתיבי `/api/appfiles/public/...`; לכן לא כל קבצי ה־`public/assets` הם המקור הפעיל בפרודקשן.

## 4.12 קוד ישן וחומרי מחקר

### `__trash/`

אלו רכיבים ישנים או ניסיוניים ואינם חלק מהמסלול הפעיל:

- `__trash/components/home/TodayCard.jsx`
- `__trash/components/home/WeekStrip.jsx`
- `__trash/components/layout/Sidebar.jsx`
- `__trash/components/layout/SignInBanner.jsx`
- `__trash/components/read/BookPicker.jsx`
- `__trash/components/read/ReflectionPanel.jsx`
- `__trash/functions/probeInvoke.js`
- `__trash/functions/probeSources.js`
- `__trash/pages/Insights.jsx`
- `__trash/pages/InstallerCheck.jsx`
- `__trash/pages/Read.jsx`
- `__trash/pages/StrongsPopupTest.jsx`

### `__url_fetch/`

תיקיית מחקר המכילה snapshots של דפי HTML, JSON וניתוחי צילומי מסך ששימשו לפיתוח parsers ולתכנון הממשק. היא אינה צריכה להיכלל ב־bundle ואינה חלק מהריצה בזמן אמת.

---

# 5. מודל הנתונים

## 5.1 ישויות ניהול תוכן

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `AdminAccount` | חשבון מנהל תוכן. | `email` חובה, `password_hash`, `salt`, `updated_date` | משמש ל־`adminAuth`; אינו קשור ישירות ל־`AuthContext`. |
| `ActivityLog` | יומן פעילות של מנהלי התוכן. | `actor`, `action`, `section`, `detail` | קשור למנהל לפי `actor`, אך אין FK. |
| `SiteSettings` | הגדרות מותג ואתר בצורת key/value. | `setting_key` חובה, `setting_value` | נטען על ידי `ThemeContext`; למשלל `site_name`, `donate_url` וצבעים. |

## 5.2 תנ"ך ומקראים

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `BibleVerse` | אחסון פסוק בודד באנגלית ולוגנדה. | `book_number` חובה, `book`, `chapter` חובה, `verse` חובה, `text_en`, `text_lu` | קשור לוגיקית ל־`bibleBooks` דרך `book_number`. |
| `KjvPlusChapter` | פרק KJV+ עם קודי Strong's. | `book_number`, `book`, `chapter`, `verse_count`, `verses` כ־JSON | ייחודיות צפויה לפי `book_number + chapter`. |
| `LugandaChapter` | פרק מלא בלוגנדה. | `book_number`, `book`, `chapter`, `verse_count`, `verses` כ־JSON | ייחודיות צפויה לפי `book_number + chapter`. |
| `Commentary` | פירוש לפי ספר ופרק. | `book` חובה, `chapter` חובה, `title`, `body_en`, `body_lu` | קשור לוגיקית ל־`bibleBooks`; נקרא ב־PassageTabs ו־ChapterSidebar. |
| `Insight` | תובנה תיאולוגית או היסטורית. | `kind` חובה, `title`, `passage`, `excerpt`, `body`, `share_count` | `passage` הוא טקסט חופשי, לא FK. |
| `StrongEntry` | מילון מקומי למספרי Strong's. | `code` חובה, `language`, `original_word`, `transliteration`, `pronunciation`, `part_of_speech`, `root_word`, `definition`, `source` | `code` הוא המזהה העסקי; למשל `G2424`. |

## 5.3 תוכן דיבאות ותפילה

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `Devotional` | דיבאות יומי בשתי שפות. | `code` חובה, כותרות EN/LU, `scripture`, `scripture_lu`, גוף, `related`, `further_readings`, `cover_image` | `DevotionalProgress.devotional_code` מפנה אליו באופן לוגי. |
| `DevotionalProgress` | סימון דיבאות כהושלם עבור משתמש. | `owner_email` חובה, `devotional_code` חובה, `completed_date` | `owner_email` → משתמש; `devotional_code` → `Devotional.code`. |
| `Prayer` | תפילה מספריית התפילות. | `title` חובה, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref` | `PrayerSaved.prayer_title` מפנה אליו באופן לוגי. |
| `PrayerSaved` | תפילה שנשמרה במועדפי המשתמש. | `owner_email` חובה, `prayer_title` חובה | `owner_email` → משתמש; `prayer_title` → `Prayer.title`. |
| `VerseOfDay` | פסוק מוגדר לתאריך. | `verse_date` חובה, `reference`, `text_en`, `text_lu`, `note` | תאריך הוא המפתח העסקי; אין חיבור ישיר ל־BibleVerse. |
| `ReadingPlan` | יום בתוכנית הקריאה. | `day` חובה, `book` חובה, `chapter` חובה, `title`, `theme`, `focus`, `scripture` | `Reading.plan_day` מפנה אליו לוגית. |
| `LiveSession` | שיעור חי עתידי. | `title` חובה, `session_date`, `host`, `join_link`, `description` | ישות תצוגה עצמאית. |

## 5.4 קהילה

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `Revelation` | גילוי אישי או תגובה לגילוי. | `owner_email`, `author_name`, `title` חובה, `passage`, `body`, `likes`, `parent_id` | `parent_id` → מזהה `Revelation` אחר כשהרשומה היא תגובה. |
| `DiscussionGroup` | קבוצת דיון. | `name` חובה, `description`, `schedule`, `member_count` | `DiscussionThread.group_name` מפנה אל `name` באופן לוגי. |
| `DiscussionThread` | הודעה בקבוצת דיון. | `group_name` חובה, `owner_email`, `author_name`, `title`, `body` | `group_name` → `DiscussionGroup.name`; `owner_email` → משתמש. |
| `QAEntry` | שאלת קורא ותשובתה. | `question` חובה, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email` | קשור למשתמש דרך `author_email`; לא קשור מזהה חיצוני ל־BibleVerse. |
| `ContactMessage` | פנייה דרך טופס יצירת קשר. | `name` חובה, `email` חובה, `subject`, `message`, `is_read`, `reply` | נשלט על ידי מנהל; יוצר על ידי כל גולש. |

## 5.5 Verse-Songs

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `VerseSongSeries` | סדרת שירים. | `name` חובה, `description`, `thumbnail`, `cover_image`, `accent` | `VerseSongEpisode.series_name` מפנה אל `name`. |
| `VerseSongEpisode` | פרק בודד בסדרה. | `series_name` חובה, `title`, `verse_ref`, `duration_label`, `duration_seconds`, `audio_url`, `audio_key`, `thumbnail`, `episode_order` | `series_name` → `VerseSongSeries.name`; סדר מוגדר לפי `episode_order`. |

## 5.6 התקדמות, יומן ופעילות אישית

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `Reading` | פרק שהושלם על ידי המשתמש. | `owner_email` חובה, `book` חובה, `chapter` חובה, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses` | `owner_email` → משתמש; `plan_day` → `ReadingPlan.day`. |
| `ReadingActivity` | אירוע קריאה לתצוגה ב־Dashboard. | `owner_email` חובה, `activity_type` חובה, `book`, `book_number`, `chapter`, `verse` | `owner_email` → משתמש. |
| `JournalEntry` | רשומת יומן תפילה. | `owner_email` חובה, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood` | `owner_email` → משתמש. |
| `StudyMark` | הדגשה, סימנייה או הערה בפסוק. | `owner_email` חובה, `mark_type` חובה, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text` | `owner_email` → משתמש. |
| `StudyAnnotation` | הדגשה או קו תחת באזורי לימוד. | `owner_email` חובה, `book_number` חובה, `book`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset` | `owner_email` → משתמש; `book_number` → ספר; `section + block_id` מזהה את המקטע. |

---

## 5.7 מודל ההרשאות

המערכת משתמשת בשני מודלים שונים של ACL:

1. **`x-fse2-access` בגרסה 1**  -  רשימת תפקידים המורשים לקריאה או לכתיבה.
2. **Policy בגרסה 2**  -  wrapper עם כללים משולבים, לרוב עם אותו מבנה תפקידים.

### קטגוריות גישה

| קטגוריה | Entities |
|---|---|
| קריאה ציבורית | BibleVerse, Commentary, DiscussionGroup, Insight, LiveSession, Prayer, QAEntry, ReadingPlan, Revelation, SiteSettings, StrongEntry, VerseOfDay, VerseSongSeries, VerseSongEpisode, KJV+ ו־Luganda chapters |
| CRUD למשתמש מחובר | DevotionalProgress, PrayerSaved, Reading, ReadingActivity, JournalEntry, StudyMark, StudyAnnotation, DiscussionThread |
| כתיבת תוכן על ידי admin/owner | Devotional, Prayer, Commentary, Insight, LiveSession, ReadingPlan, VerseSongSeries, VerseSongEpisode, AdminAccount, ActivityLog, SiteSettings, BibleVerse, KJV+ ו־Luganda chapters |

### אזהרת אבטחה חשובה

בחלק מה־entities התנאים מבוססים רק על תפקיד כללי, ללא תנאי ברור שמגביל רשומה לבעלה. לדוגמה, דפים רבים מבצעים סינון לפי `owner_email` בצד הדפדפן, אך סינון בצד הלקוח **אינו תחליף לאכיפת בעלות בשרת**. יש לוודא שה־ACL או ה־function האכיפים:

- משתמש רגיל יכול לקרוא ולעדכן רק את השורות שלו.
- `parent_id` של תגובה תקין.
- לייק של גילוי אינו מאפשר לשנות את גוף הפוסט.
- מנהל יכול לנהל תוכן ומשתמשים לפי ההרשאות המוגדרות לו.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 אתחול האפליקציה

1. פלטפורמת FSe2 מבצעת routing ומרכיב את `Layout`.
2. `AuthProvider` קורא ל־`fse2.auth.me()` כדי לזהות משתמש קיים.
3. `ThemeProvider` טוען הגדרות מותג מ־`SiteSettings` כאשר יש משתמש מחובר.
4. `PlayerProvider` יוצר אובייקט `Audio` יחיד שנשאר חי במעבר בין דפים.
5. `PwaHead` מוסיף metadata ורושם את ה־Service Worker.
6. הדף הנוכחי מתווג באמצעות `currentPageName` ומציג ניווט מתאים.

---

## 6.2 קריאת פרק בתנ"ך

```text
BibleReader
   ↓ בחירת ספר
ChapterSelector
   ↓ בחירת פרק
/Chapter?book=43&chapter=3
   ↓
fetchChapter(...)
   ├── מטמון מקומי
   ├── גרסה מותקנת
   ├── רשומת KJV+/Luganda
   └── שרת bibleChapter
   ↓
הצגת פסוקים
```

### התנהגות עיקרית

- `fetchChapter` מנקה רווחים ו־HTML entities ומנסח את התוצאה לפי הגרסה.
- קודי Strong's מסומנים בעזרת `markStrongCodes`.
- הקורא משתמש ב־`chapterKey` כדי להפריד בין פרקים לפי ספר, פרק, שפה וגרסה.
- בחירת פסוק מציגה את סרגל הפעולות.
- סיום הפרק יוצר או מעדכן `Reading` ועשוי לעדכן יום בתוכנית.
- הפעולה `logReadingActivity` היא best-effort ולא אמורה להפריע לקריאה גם אם הכתיבה נכשלת.

---

## 6.3 הדגשה והערות בטקסט לימוד

1. המשתמש בוחר טקסט בתוך `AnnotatedText`.
2. הרכיב מחשב `start_offset` ו־`end_offset`.
3. מוצגת סרגלת כלים לבחירת צבע או קו תחת.
4. `buildSegments` מפצל את הטקסט לפי כל נקודות שינוי.
5. ההערה נשמרת:
   - ב־`StudyAnnotation` כשהמשתמש מחובר.
   - ב־IndexedDB כדי לשמור אותה גם ללא חיבור.
6. בכניסה הבאה מתבצע merge בין רשומות השרת והמטמון המקומי.
7. המפתח כולל ספר, אזור, block, סוג וטווח, כדי למנוע כפילויות.

### סיכון debug

ה־offsets תלויים בטקסט המדויק. שינוי נוסחה, החלפת שפה או שינוי תוכן עלולים להפוך הערה קיימת ללא רלוונטית. לפיכך כדאי לשמור גם hash או גרסת טקסט לצד ההערה.

---

## 6.4 סימון פסוק

1. המשתמש בוחר פסוק.
2. `VerseActionBar` מציע הדגשה, סימנייה או הערה.
3. נשמרת רשומת `StudyMark` עם:
   - ספר ופרק.
   - מספר פסוק.
   - סוג סימון.
   - צבע או טקסט הערה.
4. הרשומות מוצגות ב־BibleNotes.
5. לחיצה על רשומה חוזרת אל הפסוק המדויק.

---

## 6.5 פתיחת מקרא ללא עזיבת הדף

1. קישור מקרא במבוא, במבנה הספר, בתפילה או במשאבים מזוהה.
2. `scriptureRefs` מנרמל את שם הספר, חוצה aliases ומפעיל את `parseReference`.
3. `VersePopup` טוען את הפרק דרך `fetchChapter`.
4. הפסוק הרלוונטי מודגש וניתן לסמן.
5. `selectionInside` מונע מהקלדה לפתוח מקרא במקום שהמשתמש רק בחר טקסט לסימון.

---

## 6.6 Strong's

1. `StrongsText` מזהה קודים בפורמט `(G2424)` או `(H0436)`.
2. הקוד מוצג כ־superscript לחיצ.
3. `StrongsPopup` מנרמל את הקוד לצורה אחידה.
4. ניסיון ראשון:
   - קריאה מ־`StrongEntry`.
   - אם אינה קיימת, פנייה ל־`strongsDefinition`.
5. התוצאה נשמרת במטמון המקומי ובהתקדמות, כך שהפתיחה הבאה מהירה.
6. כתיבת העותק אינה אמורה להפריע לקורא גם אם היא נכשלת.

---

## 6.7 התקנת התנ"ך

### התקנה ידנית מה־Admin

1. המנהל נכנס ומקבל token חתום.
2. הוא נכנס למקטע Luganda או KJV+.
3. ה־installer שולח `action` עם ה־token.
4. ה־function קורא למקור החיצוני, מנקה את הפרק ומשמר אותו.
5. כל פרק נשמר כרשומה נפרדת.
6. `ChapterCoverage` מחשב את הפרקים החסרים והפגומים ומציג אותם כטווחים דחוסים.

### התקנה אוטומטית

1. `cron/scriptureInstall.js` מופעל פעם בשעה.
2. הוא משתמש ב־install key מתוך סביבת השרת.
3. הוא מנסה להשלים רק פרקים חסרים.
4. אם הריצה אינה מייצרת התקדמות, הוא עוצר כדי לא להעביר עומס מיותר על המקור.
5. פרק שנכשל ינסה שוב בהרצה הבאה.

---

## 6.8 פרסום גילוי ותגובה

1. משתמש לא מחובר רואה כרטיס התחברות.
2. משתמש מחובר ממלא כותרת, פסוק וגוף.
3. נוצר `Revelation` ראשי עם `owner_email`.
4. תגובה נוצרת כ־`Revelation` נוסף עם `parent_id` של הפוסט הראשי.
5. ה־UI מפריד בין פוסטים לפי `parent_id`.
6. לייק מעדכן את מספר הלייקים דרך פעולת ה־content API.
7. לאחר מועלים רשימות מתעדכנות דרך invalidation של React Query.

---

## 6.9 קבוצת דיון

1. המשתמש בוחר קבוצה מהרשימה.
2. הוא יכול להצטרף; מצב ההצטרפות נשמר מקומית בלבד.
3. הוא מוצא את השיחות של הקבוצה לפי `group_name`.
4. מענה נשמר כ־`DiscussionThread` עם שם המחבר וגוף ההודעה.
5. השיחה מתרעננת דרך React Query.

---

## 6.10 התקדמות תוכנית קריאה

1. רשימת `ReadingPlan` נטענת מהשרת, או מ־`PLAN_DAYS` כגיבוי.
2. לאחר סיום פרק נוצרת רשומת `Reading`.
3. אם הפרק תואם ליום בתוכנית, נשמר `plan_day`.
4. ב־Plan מחושבים אילו ימים הושלמו.
5. היום הנוכחי הוא היום הראשון שטרם הושלם.
6. ההתקדמות מחושבת כאחוז מכלל ימי התוכנית.

---

## 6.11 Devotionals

1. `fetchPublicCollection("devotionals")` טוען נתונים חיים.
2. אם אין נתונים חיים, מוצג `DEVOTIONALS` מ־seed.
3. המשתמש מחפש ובוחר דיבאות.
4. סימון השלמה נשמר בשרת דרך `DevotionalProgress`.
5. מצב מקומי משמש לעדכון מיידי ולגיבוי.
6. התצוגה המלאה יכולה להציג את התוכן בעברית, לוגנדה או שתיהן.
7. ניתן לשתף את הדיבאות דרך `ShareRow`.

---

## 6.12 נגן Verse-Song

1. המשתמש בוחר סדרה או פרק.
2. נבנה queue של עצמי שיר עם metadata.
3. `PlayerProvider` טוען את ה־Audio הגלובלי.
4. המשתמש יכול:
   - להפעיל ולעצור.
   - לדלג לפרק הבא או הקודם.
   - לשנות מהירות ועוצמה.
   - להפעיל shuffle.
   - לבחור repeat: off, all, one.
   - לפתוח גיליון מורחב.
5. הנגן נשאר פעיל גם בעת ניווט בין דפים.

---

## 6.13 הורדה לאופליין

1. המשתמש נכנס למרכז Offline.
2. הוא בוחר אילו סוגי תוכן להוריד.
3. הוא בוחר היקף:
   - תוכנית קריאה: John ו־Psalms.
   - כל התנ"ך.
4. הוא בוחר גרסת תנ"ך.
5. כל פרק נטען דרך `fetchChapter` ונשמר ב־IndexedDB.
6. התקדמות מוצגת בזמן אמת.
7. המשתמש רואה את השימוש באחסון ואת המכסה הזמינה.
8. מחיקת המטמון מסירה את הנתונים המקומיים.

---

## 6.14 PWA

1. `PwaHead` מוסיף metadata רק אם לא קיימים כבר.
2. ה־manifest מגדיר standalone mode.
3. ה־Service Worker:
   - שומר routes עיקריים ב־shell cache.
   - משתמש ב־runtime cache עבור תשובות רשת.
   - מוחק caches ישנים בעת activate.
4. בעת התקנה מוצגת `beforeinstallprompt`.
5. לאחר `appinstalled` מסומן המכשיר כמותקן.

---

# 7. הערות טכניות לפיתוח

## 7.1 ספריות וטכנולוגיות

| ספרייה/טכנולוגיה | שימוש |
|---|---|
| React | רכיבי UI, hooks, Context. |
| React Router DOM | ניתוב, פרמטרי URL ו־Links. |
| TanStack React Query | אחריות שרת, cache, mutation ו־invalidation. |
| `lucide-react` | אייקונים. |
| `date-fns` | עיצוב וחישוב תאריכים. |
| FSe2 SDK | authentication, entities, functions ו־app parameters. |
| IndexedDB | מטמון אופליין, סימניות והערות. |
| Web Audio / `Audio` | נגן אודיו גלובלי. |
| Web Share API / Clipboard API | שיתוף והעתקה. |
| Service Worker | PWA ואחסון. |
| Tailwind utility subset | חלק מהרכיבים הישנים והפשוטים. |
| `BRAND_CSS` | רוב העיצוב המותגי וה־`pr-*` classes. |

---

## 7.2 דפוסי state והתמדה

המערכת משתמשת בכמה מקורות state:

| מקור | מתאים למה |
|---|---|
| Local React state | טפסים, מצב מודאל, סינון, מצב טעינה מקומי. |
| Context | משתמש, ערכת נושא, נגן אודיו. |
| React Query | נתוני שרת וסנכרון. |
| URL query params | ספר, פרק, פסוק, שפה, קוד דיבאות ושם סדרה. |
| `localStorage` | token מנהל, גרסת תנ"ך, מועדפים, קבוצות שהצטרפו אליהן והתקדמות מקומית. |
| IndexedDB | תנ"ך, תוכן וסימונים לשימוש לא מקוון. |
| Entities | מקור האמת לתוכן, התקדמות והרשאות. |

### כלל חשוב

אין להחליף מקור אמת בלי לעדכן גם את:

- ה־cache key של React Query.
- ה־invalidation לאחר mutation.
- הסנכרון עם IndexedDB.
- ה־localStorage המקומי.
- ההרשאות ב־entity.

---

## 7.3 דפוס fallback לתוכן

כמעט כל אזור ציבורי משתמש בשני מקורות:

1. נתונים חיים מ־FSe2.
2. נתוני seed מ־`lib/seedContent.js` או קובצי תוכן ספציפיים.

היתרון הוא שהאפליקציה לעולם אינה נראית ריקה. החסרון הוא שכישל backend עלול להתחבר ל־seed בלי שהמשתמש יבין שזו תוכן מקומי.

כאשר מוסיפים תוכן חדש כדאי:

- להוסיף אותו ל־seed.
- לוודא שה־entity תואם.
- לוודא שאין כפילות לפי כותרת.
- להגדיר מדדי cache יציבים.

---

## 7.4 דפוס React Query

מומלץ לשמור על מבנה אחיד:

- `queryKey` כולל את סוג האוסף, הסינון והמשתמש הרלוונטי.
- `enabled: false` כאשר אין משתמש.
- `invalidateQueries` לאחר create/update/delete.
- mutation עם מצב busy/error מקומי כאשר צריך UI מיידי.

דוגמאות לבדיקה:

- `["prayers"]` משמש במספר מקומות; אם מתחילים להבדיל בין public ל־authenticated, יש להרחיב את המפתח.
- `["insights"]` ו־`["chapterInsights"]` מתייחסים לאותו מקור אך במפתחות שונים; זה עלול ליצור cache כפול.
- רשימות `Reading`, `StudyMark`, `JournalEntry` ו־`ReadingActivity` נטענות לעיתים כל הרשומות ואז מסוננות בדפדפן. זה אינו אופטימי ואינו תחליף לסינון מול ה־API.

---

## 7.5 דפוס routing

- שם הדף ב־`createPageUrl` חייב להיות זהה לשם הקובץ ב־`pages/`.
- פרמטרים חייבים להיות מגיבים באותיות קטנות כפי שמוגדר בדף.
- לאחר מעבר לדף אחר יש לבצע `invalidate` או `refetch` כאשר הדף מציג מידע שהשתנה.
- שינוי פרמטר בדף אחר עשוי להפעיל מחדש `useEffect`; יש להימנע מהוספת אובייקטים חדשים במערך dependencies.

---

## 7.6 עיצוב ו־CSS

- `BRAND_CSS` נטען בתוך `Layout` ומגדיר את משתני המותג.
- `ThemeContext` מחליף את הערכים לפי `SiteSettings`.
- גווני deep ו־soft נגזרים אוטומטית מהצבע שנבחר.
- רכיבים רבים משתמשים ב־inline styles לצד המערכת.
- `__generated/tailwind.css` הוא תוצר חלקי. **אין להניח שכל class של Tailwind זמין.** לפני שימוש ב־class חדש יש לבדוק שהוא נוכל בקובץ המחושל.

### נקודות שינוי מרכזיות

| נושא | קובץ |
|---|---|
| צבעי המותג הסטטיים | `lib/theme.js` |
| CSS מרכזי | `lib/brandCss.js` |
| ערכת נושא דינמית | `lib/themeContext.jsx` |
| Header/Footer | `components/layout/` |
| עיצוב דפים ציבוריים | `components/common/PageHeader.jsx` |

---

## 7.7 אבטחה

### נקודות חוזקות

- React מספק escaping ברירת מחדל לטקסט ב־JSX.
- `safeText` מנטרל ערכים לא־טקסטואליים לפני תצוגה.
- תוכן HTML חיצוני מנוקח בשרת ומומר לטקסט.
- פונקציות ההתקנה מוגנות ב־admin token או install key.
- ה־admin session נחתם ב־HMAC ובעל תוקף.

### סיכונים שכדאי לטפל בהם

1. **Admin token ב־localStorage**  
   גישה ל־XSS יכולה לגנוב את ה־token. עדיף cookie מוגן או token קצר־חיים עם rotation.

2. **סיסמת ברירת מחדל**  
   `adminAuth.js` מכיל fallback:
   - `admin@prayread.com`
   - `prayread-admin`

   בפרודקשן יש להסיר fallback, להגדיר סיסמה חזקה ב־environment ולבצע rotation.

3. **SHA-256 פשוט אינו password hashing מספיק**  
   מומלץ להשתמש ב־Argon2id, scrypt או bcrypt עם salt ייחודי לכל משתמש.

4. **סינון בעלות בצד הלקוח בלבד**  
   אסור להסתמך על `filter(row.owner_email === email)` כהגנת אבטחה.

5. **הרשאת כתיבה ל־מילון Strong's**  
   `strongsDefinition` מתואר כפתוח לקוראים, אך גם עושה cache write. יש לוודא שה־entity מאפשר רק למנהל או לפונקציית שרת לכתוב.

6. **מפתחות בצד הדפדפן**  
   `app-params` קורא `fse2_token` מ־localStorage. אין לחשוף token בעל הרשאות גבוהה בדפדפן.

7. **Regex ו־HTML parsing**  
   אין להעביר HTML ל־`dangerouslySetInnerHTML`. אם נדרש, יש לנקות ב־DOMPurify מאושר.

---

## 7.8 אמינות ועמידות

### מקורות חיצוניים

- `bible-api.com`
- Wordplanet
- Blue Letter Bible
- Open Scriptures/GitHub

המקורות עלולים:

- לשנות markup.
- להפוך לזמינים.
- להחזיר תוכן חלופי או HTML משובש.
- להגביל את מספר הבקשות.

לכן יש לבצע:

- timeout.
- retry עם backoff.
- אימות שהפרק מכיל את מספר הפסוקים הצפוי.
- caching ב־entity.
- דיבאג של פרקים שנפגעו.

### מטמון

- `IndexedDB` עלול להיגרר למצב חלקי אם נסגר באמצע הורדה.
- מומלץ להוסיף מצב `pending`, retries וניקוי רשומות לא תקינות.
- עלייה בגרסת ה־DB דורשת migration.
- קיימת אי־התאמה בין `Offline.jsx`, שמציג קטגוריית `prayers`, לבין `offlineDb.js`, שאינו מכיה במפורש store בשם `prayers`. יש לאמת ולתקן זאת.

### Service Worker

- עדכון של `SHELL` דורש הגדלת גרסת ה־cache.
- `cache.addAll` כושל אם אחד ה־URLs חסר; הקוד ממשיך, אך מספר routes עלולים לא להיכנס ל־cache.
- כדאי להוסיף fallback navigation עבור SPA.
- אין לבצע cache אוטומטי של בקשות מאומתות או תגובות רגישות.

---

## 7.9 בעיות DEBUG ספציפיות שעלולות להופיע

1. **`VerseOfDay` מחלץ את המספר הראשון מההפניה כמספר ספר.**  
   הפניה כגון `1 John 3:16` עלולה להפרש כ־book number 1 במקום 62. יש להשתמש ב־`scriptureRefs.parseReference`.

2. **`matchPassage` הוא פשוט ורגיש לטקסט.**  
   הוא עלול להתאים חלקית או בטעות לפסוקים דומים.

3. **`PassageTabs.bookKey` מתאים לפי תחילת שם הספר.**  
   חפיפה בין שמות ספרים דומים עלולה ליצור התאמות שגויות.

4. **מזהי cache לא אחידים.**  
   `insights`, `chapterInsights`, `prayers` ועוד משתמשים במפתחות דומים אך לא זהים.

5. **רשימות מסוננות אחרי limit.**  
   `list(..., 300)` עלול לא להחזיר את כל הרשומות. אם המשתמש יש לו מעל 300 רשומות, חלקן לא יופיע.

6. **איחוד seed ו־live לפי כותרת.**  
   תוכן עם כותרת זהה אך גוף שונה ייחשב ככפילות. עדיף להשתמש במזהה או קוד יציב.

7. **`ThemeContext` טוען הגדרות רק כשמחוברים.**  
   למרות ש־`SiteSettings` ציבורי, משתמש לא מחובר עשוי לקבל ערכת ברירת מחדל גם אם המנהל שינה אותה.

8. **מצב מקומי לא מסונכרן מיד לאחר logout.**  
   אם מנהל צפה בערכת נושא מותאמת, ייתכן שהיא תישאר בזיכרון עד רענון.

9. **שגיאות `AuthContext.authError` לא ממולאות.**  
   במקום ש־catch פשוט מחליף את מצב האימות, אין הודעת שגיאה מפורטת.

10. **CSS משולב Tailwind חלקי.**  
    שימוש ב־class שאינו ב־`__generated/tailwind.css` לא יספק את העיצוב הצפוי.

11. **הערות לפי offsets.**  
    שינוי בטקסט או בגרסת התרגום עלול להשאיר הערה עם היסט שגוי.

12. **שדות JSON בפרקי תנ"ך.**  
    `verses` הוא string. כל צרכן חייב לטפל ב־JSON לא תקין וב־schema לא צפוי.

---

## 7.10 מדריך להוספת פיצ'ר חדש

### דף חדש

1. ליצור `pages/NewPage.jsx`.
2. להשתמש ב־`createPageUrl("NewPage")`.
3. להוסיף קישור ל־Header/Footer או לדף הבית.
4. לוודא שהדף מוגן בהתאם לצורך:
   - `useAuth`.
   - התחברות חובה.
   - תפקיד admin.
5. להוסיף loading/error/empty states.

### Entity חדש

1. ליצור `entities/NewEntity.json`.
2. להגדיר שדות, labels ו־required.
3. לבחור רמת הרשאה ולוודא row ownership.
4. להוסיף wrapper ב־`lib/contentApi.js` אם הוא ציבורי.
5. להוסיף entry ל־`functions/adminContent.js` אם הוא נמנהל.
6. להוסיף טופס ניהול ולוודא כפילויות.

### מקור תנ"ך חדש

1. להוסיף הגדרה ל־`lib/versions.js`.
2. להוסיף מיפוי ב־`lib/bibleApi.js`.
3. להגדיר מקור server או entity מותקנת.
4. להוסיף מפתח cache ייחודי.
5. לבדוק התקנה, הורדה, אופליין והחלפת גרסה.

### משאב לימוד חדש

1. להוסיף entity ו־seed content.
2. להוסיף פונקציית resolver.
3. לחבר אותו ל־ChapterSidebar, ChapterResourcesPanel או BookStudyResources.
4. לוודא שהמשתמש לא מחובר עדיין רואה תוכן חלופי.

---

## 7.11 בדיקות מומלצות

לפני release מומלץ לכלול לפחות:

- בדיקות יחידה ל־`compressChapters`.
- בדיקות parsing למקראים בעברית ולוגנדה.
- בדיקות ל־`matchesPassage` ו־`parseOutlineRange`.
- בדיקות ל־`buildSegments` ב־AnnotatedText.
- בדיקות לנרמול קודי Strong's.
- בדיקות רשאות לכל entity משתמש.
- בדיקות migration של IndexedDB.
- בדיקות offline לכל גרסת תנ"ך.
- בדיקות service worker בעדכון גרסה.
- בדיקות end-to-end למסלול:
  - כניסה → קריאה → הדגשה → התנתקות → התחברות.
  - התקנת פרק → סגירת דפדפן → קריאה לא מקוונת.
  - יצירת גילוי → תגובה → לייק.
  - התקנת KJV+ → הצגת Strong's.
  - ניגון שיר → מעבר לדף אחר → המשך ניגון.

---

## 7.12 סיכום למפתח חדש

הנקודה הטובה ביותר להבנת המערכת היא להתחיל מ־`Layout.jsx`, ואז:

1. `pages/Chapter.jsx`  -  מסך הליבה.
2. `lib/bibleApi.js`  -  מקור הפרק.
3. `components/read/`  -  חוויית הקריאה.
4. `lib/offlineDb.js`  -  התמדה ללא חיבור.
5. `entities/`  -  מודל הנתונים.
6. `functions/`  -  פעולות שאינן ניתנות לביצוע בבטחה מהדפדפן.
7. `AdminDashboard.jsx`  -  מרכז התפעול והתוכן.

העיקרון המנחה את כל המערכת הוא **מקור אמת מרוכז, עם fallback מקומי להמחקה, הרשאות בצד השרת, והתמדה כפולה של הדפדפן כדי לשמור על חוויית שימוש גם כשהרשת נעלמת**.
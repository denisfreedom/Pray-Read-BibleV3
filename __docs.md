# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

> מסמך זה נכתב על בסיס קוד המקור שסופק. קטעי קוד רבים נחתכו בהעתקה, ולכן חלק מהפרטים (למשל תוכן מלא של חלק מהעמודים) מבוססים על מה שנראה בקטעים הגלויים. במקומות שבהם הדבר משפיע על ההבנה, צוין הדבר במפורש.

---

## 1. מהות המערכת

**Pray-Read Bible** היא פלטפורמה רוחנית מבוססת מקרא לפיתוח רוחני, שמטרתה לעזור לקורא לחוות את המשיח באופן חי ואקספריאנטלי, דרך קריאה ותפילה בכתבי הקודש וכוח הרוח. הסיסמה של המערכת: *Praying the Word • Reading the Word • Living Christ*.

**למי היא מיועדת:**
- קוראי מקרא דוברי אנגלית ולוגנדה (הפלטפורמה דו-לשונית לאורך כל הדרך).
- מאמינים שרוצים לשלב תפילה בקריאה, ולא רק לקרוא מידע.
- קבוצות לימוד, כנסיות וקהילות שמשתפות דברי הוד והמלצות לימוד.
- מנהל תוכן (Administrator) שמנהל את הספרייה הרוחנית של האתר.

**הערך שהיא מספקת:**
1. **קריאת המקרא** בשני תרגומים לפחות (KJV, KJV עם מספרי Strong, לוגנדה), עם הדגשה, הערות, הפניות צולבות ומילון יווני/עברי בלחיצה.
2. **תפילה מבוססת כתובים** - ספריית תפילות לכל ספר, לכל פרק ולכל פסוק.
3. **דבריות יומיות** (Devotionals) וחיבורים לשירי מקרא (Verse-Songs) וכן Q&A תיאולוגי.
4. **פעילות קהילתית** - התגליות (Revelations), לייב טיצ'ינג, קבוצות דיון.
5. **עבודה לא מקוונת (Offline)** - הורדת פרקים, דבריות ומילוני Strong למכשיר.
6. **מערכת ניהול תוכן (CMS)** ייעודית למנהל, המאפשרת ייבוא קבצי JSON ועריכה ישירה.

**מודל גישה:** הציבור רואה את הספרייה ללא התחברות. התחברות (Login / Signup) נדרשת לשמירת הדגשות, הערות, יומן תפילה, קריאה מעקב ותגובות בקהילה.

---

## 2. עמודים ותפקידיהם

> כתובות ה-URL נגזרות מ-`createPageUrl(...)` ומשם שם הקובץ בתיקיית `pages`. לדוגמה `createPageUrl("BibleReader")` מפנה ל-`/BibleReader`.

### 2.1 דף הבית - `Home` (`pages/Home.jsx`)
- **URL:** `/` (או `/Home`)
- **תפקיד:** דף הכניסה. מציג את חזון המערכת ומזמין לקריאה.
- **תוכן (מסודר מלמעלה למטה):**
  - `HomeHero` - כותרת ענקית, סיסמה, ציטוט, שני כפתורים: "Begin Your Pray-Read Journey" ו-"About".
  - `HomeIntro` - "What is Pray-Read Bible?" עם תמונה.
  - `VerseOfDayCard` ו-`DailyDevotionalCard` - הפסוק והדבריה של היום (נטענים מ-`VerseOfDay` ומ-`Devotional`, עם fallback ל-`seedContent`).
  - `VisionCards` - חזון, משימה ומטרה, כל אחד קישור ל-`About`.
  - `JourneySteps` - שישה שלבים: Pray, Read, Receive, Live, Express, Dispense Christ.
  - `ExperiencePoints` - שישה נקודות חוויה.
  - `SixWaysGrid` - שישה "דרכים לבלות זמן עם אלוהים" (Community, Prayer Library, Bible Reader, Verse-Songs, Q&A, Devotionals).
  - `ExploreBible` - רצועת קריאה לקורא המקרא.
  - `ClosingInvite` - הזמנה סופית.
- **אינטראקציות:** כל הכפתורים הם קישורים (`Link`). כפתור ה-`VerseOfDayCard` "Share This Verse" משתף דרך `navigator.share` או מעתיק ללוח.
- **הערה:** `Layout.jsx` מציג את `AppFooter` רק בעמודים `Home`, `QA` ו-`Devotionals`.

### 2.2 אודות - `About` (`pages/About.jsx`)
- **URL:** `/About`
- **תפקיד:** מסמך חזון מלא, מבוסס על המסמך "THE VISION AND ABOUT PRAY-READ BIBLE PROJECT" (ראו `lib/aboutContent.js`).
- **מבנה:** Hero, "Who We Are", סעיפי חזון/משימה/מטרה, שירותים (SERVE_ICONS), תוצאות (OUTCOME_ICONS), סיום.
- **רכיבים:** `AboutCard` (כרטיס עם רקע תמונה ו-scrim כהה) ו-`AboutSplit` (תמונה + טקסט, בהפוך או לא).
- **סגנון:** נטען כ-`<style>` מ-`lib/aboutCss.js`, כל הסלקטורים מתחילים ב-`.pr-about` כדי לא לדלוף.

### 2.3 קורא המקרא - `BibleReader` (`pages/BibleReader.jsx`)
- **URL:** `/BibleReader`
- **תפקיד:** מסך הבחירה של הספר. ראשי פרקים.
- **תוכן:**
  - שורת חיפוש (`BookGrid` - שדה `search`), ו-tabs "Old Testament" / "New Testament".
  - רשימת הספרים מ-`lib/bibleBooks.js` (66 ספרים, שמות באנגלית ולוגנדה, קיצורים, מספר פרקים).
  - סימון "זמין אופליין" - ספר נחשב זמין רק אם כל פרקיו נשמרו ב-IndexedDB (`offline.getAll("chapters")`).
  - `ChapterSelector` מוצג כשנבחר ספר (לפי הפרמטר `?book=`).
- **אינטראקציות:** בחירת ספר → URL מתעדכן (`?book=N`) ו-`ChapterSelector` נטען.

### 2.4 קריאת פרק - `Chapter` (`pages/Chapter.jsx`) - העמוד הכבד ביותר
- **URL:** `/Chapter?book=N&chapter=C[&verse=V][&lang=lu]`
- **תפקיד:** הקריאה עצמה: הפסוקים, הדגשות, הערות, הפניות צולבות, תפילה לפרק, הקשר ומילוני Strong.
- **תוכן מרכזי (לפי הרכיבים שמיובאים):**
  - `VersionPicker` - מעבר בין גרסאות מותקנות (KJV, KJV+ עם Strong, לוגנדה, WEB ועוד).
  - רשימת הפסוקים עם `VerseActionBar` בפסוק שנבחר: הדגשה בארבעה צבעים, סימניה, הערה, העתקה, שיתוף, הפניות צולבות, תפילה, פירוש.
  - `VerseCrossRefs` - הפניות צולבות לפסוק.
  - `PassagePrayer` - התפילה המשויכת לקטע (מחושבת לפי `matchesPassage`).
  - `PassageTabs` - לשוניות Commentary / Theological / Historical / Q&A לקטע.
  - `ChapterReaderPane` - מגירת הלימוד עם לשוניות Intro / Commentary / Prayer / Cross-refs.
  - `ChapterClosingPrayer` - תפילת סיום הפרק בתחתית.
  - `ShareSheet` - חלון שיתוף עם ערוצי WhatsApp, Facebook, X, Telegram, Email, Copy.
  - `StrongsPopup` - הגדרת מילה יוונית/עברית בלחיצה על "(G2424)" וכדומה.
  - `VersePopup` - פסוק מוצג בחלון צף, כשמקפצים מהצד.
- **פרמטרי URL:** `book`, `chapter`, `verse` (מגלול לפסוק ומסמן), `lang` (`lu` ללוגנדה).
- **התנהגות:** `ScrollToTop` מופעל כשמשתנים `pathname`, `book` או `chapter`, אבל לא כשמשתנה `verse`, כדי שקישור עמוק לפסוק יגלול אליו.
- **רישום פעילות:** כל ביקור בפרק נרשם ב-`ReadingActivity`, ו-`recordReading` מסמן תוכנית קריאה יומית אם הפרק נמצא בה.

### 2.5 תוכנית קריאה - `Plan` (`pages/Plan.jsx`)
- **URL:** `/Plan`
- **תפקיד:** מסלול 30 יום של "הנרטיב של יוחנן + תהלים". נתונים מ-`ReadingPlan` עם fallback ל-`PLAN_DAYS`.
- **תצוגה:** פס התקדמות (אחוז ימים שהושלמו), `PlanRow` לכל יום בשלושה מצבים: `completed`, `current`, `upcoming`.
- **מקור ההשלמות:** `Reading` עם `status === "completed"` ו-`plan_day`.
- **אינטראקציה:** לחיצה על יום מובילה לפרק המתאים ב-`Chapter`.

### 2.6 דף הדשבורד - `Dashboard` (`pages/Dashboard.jsx`)
- **URL:** `/Dashboard`
- **תפקיד:** סיכום אישי: רצף קריאה (streak), שבעה ימים אחרונים, היסטוריית פעילות, הדגשות וסימניות, דבריות שנקראו, שירי Verse שנשמעו, תפילות שנשמרו, ונתוני אופליין (מספר פרקים, פסוקים, נפח אחסון).
- **תת-רכיבים:** `ActivityFeed` (פיד של `ReadingActivity` עם `formatDistanceToNow`), `WeekStrip`, `TodayCard`.
- **מצב לא מחובר:** נדרש התחברות, יש `SignInBanner`. ב-`Dashboard.jsx` יש גם ייבוא של `Home` (ייתכן שמוצג תוכן דומה כשאין משתמש).

### 2.7 מילון מחשבה והבנה תיאולוגית/היסטורית
- **`TheologicalInsights`** (`/TheologicalInsights`) ו-**`HistoricalInsights`** (`/HistoricalInsights`) - שני עמודים זהים מבנית, `InsightsBoard` עם `kind="theological"` או `kind="historical"`.
- **תוכן:** רשימת תובנות עם חיפוש, פתיחה/סגירה, שיתוף, "שמור". מקורות: `Insight` ב-DB עם fallback ל-`INSIGHTS` ב-`seedContent`. לכל תובנה `title`, `excerpt`, `passage`, `body`.
- **שמירה:** ב-`localStorage` תחת `STORAGE_KEYS.savedInsights`.

### 2.8 ספריית תפילות - `PrayerLibrary` (`pages/PrayerLibrary.jsx`)
- **URL:** `/PrayerLibrary`
- **תפקיד:** כל התפילות בקטגוריות. חיפוש, פילטר לפי קטגוריה, בחירת שפה (EN/LU), שמירה למועדפים (`PrayerSaved`), ושיתוף (`ShareRow`).
- **מקור:** `Prayer` עם fallback ל-`PRAYERS`.
- **קישורים:** `scripture_ref` ו-`cross_refs` מקושרים דרך `chapterLink`.

### 2.9 שירי Verse - `VerseSongs` (`pages/VerseSongs.jsx`) ו-`VerseSongSeries` (`pages/VerseSongSeries.jsx`)
- **URL:** `/VerseSongs` (כל השירים) ו-`/VerseSongSeries?series=ID` (סדרה אחת).
- **תפקיד:** נגן שירי מקרא. כל שיר `VerseSongEpisode` שייך ל-`VerseSongSeries`.
- **תוכן:** `SongFilters` (חיפוש, סדרה, ספר), רשימת `SongCard`, וכפתורי הורדה/שיתוף.
- **נגן:** `usePlayer()` מתוך `lib/player.jsx`. הנגן הגלובלי `GlobalPlayer` מוצג בתחתית כל דף.
- **מודל מסחרי (לפי הטקסטים):** "Streaming is free. Download is $2 per song." הורדה דורשת רכישה דרך PesaPal. נתיב הרכישה נשמר ב-`localStorage` (`pending_verse_song_purchase`, `purchased_verse_songs`).
- **שיתוף:** `SongShareSheet`.

### 2.10 שאלות ותשובות - `QA` (`pages/QA.jsx`)
- **URL:** `/QA`
- **תפקיד:** ספריית שאלות ותשובות דו-לשונית, מחולקת לנושאים ולפי אות ראשונה (A-Z).
- **רכיבים:** `QaFilters` (שפה EN/LU/BOTH, חיפוש, נושאים), `QaLetterBar` (סרגל אותיות נע), `QaCard` (כרטיס עם תשובה מתקפלת; מקשרים מקראיים מודגשים בזהב באמצעות `splitAnswerParts`).
- **הצבעה:** יש לכל שאלה "כן/לא" (נשמר ב-`localStorage` תחת `pr_qa_votes`).
- **פגינציה:** `PAGE_SIZE = 20` עם "Load more".
- **פרמטרים:** `lang`, `topic`, `letter`, `search` ב-URL.

### 2.11 דבריות - `Devotionals` (`pages/Devotionals.jsx`)
- **URL:** `/Devotionals` או `/Devotionals?devotional=KEY`
- **תפקיד:** הספרייה היומית. הדבריה של היום בראש העמוד, ארכיון של ימים קודמים, תצוגת קריאה מלאה.
- **רכיבים:** `DevotionalFeatured`, `DevotionalCard`, `DevotionalFilters` (שפה, חיפוש, נושא, טווח זמן: היום/השבוע/החודש/הכל), `DevotionalFullView` (קריאה מלאה עם "Previous Day"/"Next Day", "שמור", "סימון כנקרא", "שיתוף").
- **מצב מקומי:** `useDevotionalLibrary` - שמור ונקרא ב-`localStorage`, ומסתנכרן ל-`DevotionalSaved` / `DevotionalProgress` כשהמשתמש מחובר.
- **Pagination:** `PAGE_SIZE = 12`.
- **לוגיקה יומית:** `pickDailyDevotional` בוחר את הדבריה היומית וה-`rememberDaily` שומר אותה.

### 2.12 קהילה - `Community` ותתי-עמודיה
- **`/Community`** - עמוד מרכז: שלושה הוביים (Revelations, Live teaching, Discussion groups), ותצוגה של האחרונים בכל אחד.
- **`/CommunityRevelations`** - רשימת "מה שאלוהים הראה לי". `RevelationForm` (דורש התחברות לשליחה), `RevelationCard` (לייק, פתיחת תגובות), `CommentThread`.
- **`/CommunityLiveTeaching`** - לוח שידורים חיים (`LiveSession`): כותרת, תאריך, מארח, קישור הצטרפות.
- **`/DiscussionGroups`** - קבוצות לימוד קטנות (`DiscussionGroup`). מצטרפים לקבוצה (נשמר ב-`localStorage` ב-`joinedGroups`) ומתכתבים ב-`ThreadMessages`. פרמטר `?group=` לפתיחה ישירה.

### 2.13 יומן תפילה - `Journal` (`pages/Journal.jsx`)
- **URL:** `/Journal`, אפשר גם `?new=1&book=...&chapter=...` לפתיחה ישירה של טופס.
- **תפקיד:** רשומות אישיות: שבח, בקשה, וידוי, תודה, מחשבה. כל רשומה: כותרת, גוף, קטגוריה, ספר/פרק (אופציונלי), תאריך.
- **מסנן:** `all`, `praise`, `petition`, `confession`, `thanksgiving`, `reflection`.
- **שמירה:** `JournalEntry` עם `owner_email`.

### 2.14 הערות וסימניות - `BibleNotes` (`pages/BibleNotes.jsx`)
- **URL:** `/BibleNotes`
- **תפקיד:** מרכז אחד לכל ההדגשות, הסימניות וההערות שנשמרו ב-`StudyMark`.
- **לשוניות/חלוקה:** `highlight`, `bookmark`, `note`. לחיצה מובילה לפסוק ב-`Chapter`.
- **Pagination:** `Pagination` עם `PAGE_SIZE`.

### 2.15 תוכנית קריאה ותצוגה נוספת - `VerseOfDay` (`pages/VerseOfDay.jsx`)
- **URL:** `/VerseOfDay`
- **תפקיד:** הפסוק של היום בתצוגה גדולה, עם כפתור "Pray-Read this verse" (מקשר לקריאה).
- **מקור:** `VerseOfDay` לפי `verse_date`, עם fallback ל-`VERSE_OF_THE_DAY` ב-seed.

### 2.16 Offline Centre - `Offline` (`pages/Offline.jsx`)
- **URL:** `/Offline`
- **תפקיד:** ניהול הורדות לקריאה לא מקוונת. מציג לכל סוג נתונים (SECTIONS) כמה נשמר ומאפשר הורדה וגם מחיקה.
- **סוגי נתונים:** Bible chapters, verses, Strong's dictionary, devotionals, commentary, prayers, prayer passages, cross-references, Q&A, verse of the day.
- **תרגומים:** מ-`VERSIONS` (`lib/versions.js`), כל אחד עם ה-`note` שלו.
- **הורדה:** בהורדת פרק מתבצע `fetchChapter` ושמירה ב-`offline.put("chapters", ...)`. הורדת מילון Strong מתבצעת ב-`writeOfflineStrongs`.
- **תוכנית קריאה:** `PLAN_BOOKS = ["John", "Psalms"]`, כלומר הורדה ממוקדת לתוכנית.

### 2.17 תוכנית ברירת-מחדל לקריאה - `Read` (`__trash/pages/Read.jsx`)
> **שים לב:** קובץ זה נמצא בתיקיית `__trash` ואינו חלק מהאתר הפעיל. הוא נשמר כ"מלבן מת" (dead code) שכדאי לנקות.

### 2.18 עמודים סטטיים/משפטיים
- **`Contact`** (`/Contact`) - טופס שליחה ל-`ContactMessage` (שם, אימייל, נושא, הודעה). בדיקות תקינות בסיסיות בצד הלקוח.
- **`Privacy`** (`/Privacy`) - מדיניות פרטיות (טקסט סטטי). מסביר מה נשמר בשרת (חשבון, קריאות, הדגשות, יומן) ומה נשאר במכשיר (הורדות, רצפי קריאה מקומיים).
- **`Terms`** (`/Terms`) - תנאי שימוש. אפשר לקרוא, להדפיס ולשתף לשימוש אישי וכנסייתי.
- **`InstallPrompt`** (`/InstallPrompt`) - הוראות התקנה כ-PWA. מזהה iOS, Android, Desktop, ותומך ב-`beforeinstallprompt`.

### 2.19 עמודי חשבון
- **`Login`** (`/Login`) - אימייל וסיסמה. מפנה ל-`Dashboard` בהצלחה. יש קישור ל-`Signup` ול-`ForgotPassword`.
- **`Signup`** (`/Signup`) - שם מלא, אימייל, סיסמה (לפחות 8 תווים), אישור סיסמה, אישור תנאי שימוש. מדד חוזק סיסמה (`strengthOf`). תומך באימות אימייל (`verification_required`).
- **`ForgotPassword`** (`/ForgotPassword`) - שליחת קישור איפוס דרך `fse2.auth.forgotPassword`.
- **`ResetPassword`** (`/ResetPassword?token=...`) - בחירת סיסמה חדשה לפי טוקן מהמייל.
- **`Logout`** (`/Logout`) - מנקה session ומפנה ל-`Home` אחרי 900ms.

### 2.20 עמודי ניהול (Admin)
- **`Admin`** (`/Admin`) - כניסה לממשק הניהול. מייל ברירת מחדל `admin@prayreadbible.com`. אם יש session פעיל, מפנה ישר ל-`AdminDashboard`.
- **`AdminDashboard`** (`/AdminDashboard`) - ממשק ניהול מלא, ראו סעיף 2.21.
- **`AdminOwnerReset`** (`/AdminOwnerReset`) - איפוס סיסמה עם "Owner Reset Key", בלי סיסמה ישנה. פועל גם בלי התחברות.

### 2.21 דשבורד הניהול - `AdminDashboard` (`pages/AdminDashboard.jsx`)
**רשימת הסקשנים בתפריט הצד:** `overview` (Dashboard), `books` (Books & Chapters), `luganda` (Luganda Bible), `kjvplus` (KJV+), ועוד. כל סקשן מציג את הרכיב המתאים:

| סקשן | רכיב | תפקיד |
|------|------|-------|
| Dashboard | סטטיסטיקות מתוך `DEVOTIONALS`, `PRAYERS`, `VERSE_SONGS`, `QA_ENTRIES`, `INSIGHTS` | סקירה |
| Books & Chapters | `PassagesPanel` / `PrayersPanel` | עריכת קטעי תפילה, הפניות, פתיחות פרקים |
| Luganda Bible | `LugandaInstaller` | התקנת תרגום הלוגנדה |
| KJV+ | `KjvPlusInstaller` | התקנת KJV עם Strong + מילון |
| Prayer Library | `PrayersPanel mode="library"` | ניהול ספריית תפילות |
| Prayer Passages | `PrayersPanel mode="passages"` | בחירת ספר/פרק/פסוק |
| JSON Import | `JsonImportPanel` | ייבוא קבצי JSON |
| Prayer & CrossRef Import | `PrayerCrossRefImport` | ייבוא תפילות והפניות לספר שלם |
| All Content | `CollectionsPanel` | כל הקולקשנים בטבלה גנרית |
| Verse-Songs | `VerseSongsPanel` | ניהול סדרות ושירים, העלאה בכמות |
| Q&A | `QaPanel` | שאלות, נושאים, העלאה בכמות |
| Devotionals | `DevotionalsPanel` | דבריות, נושאים, תוכניות, העלאה |
| Reset Password | `ResetAdminPasswordSection` | שינוי סיסמה |

**סיסמה וכניסה:** ראו סעיף 4 (אבטחה).

### 2.22 עמוד 404 / ברירת מחדל
לא נמצא קובץ `NotFound.jsx`. ניתוב לכתובת לא קיימת כנראה נופל על ברירת המחדל של ה-router (לא נראה בקוד המסופק).

---

## 3. מפת ניווט (לצרכי DEBUG)

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|-------|------------|------------|-----|
| להתחיל לקרוא | `Home` | "Begin Your Pray-Read Journey" | `/BibleReader` |
| להתחיל לקרוא | `Home` | "Explore the Bible Prayer Project" | `/BibleReader` |
| לקרוא פרק ספציפי | `BibleReader` | בחירת ספר ולחיצה על מספר פרק | `/Chapter?book=N&chapter=C` |
| לקרוא בלוגנדה | `Chapter` | `VersionPicker` → Luganda | `/Chapter?...&lang=lu` (או שינוי גרסה) |
| הדגשת פסוק | `Chapter` | לחיצה על פסוק → `VerseActionBar` → צבע | נשמר ב-`StudyMark` |
| הערה לפסוק | `Chapter` | `VerseActionBar` → "Note" | `StudyMark` (type=note) |
| קישור צולב | `Chapter` | `VerseActionBar` → Cross-refs | `VerseCrossRefs` |
| פתיחת Strong | `Chapter` | לחיצה על "(G2424)" | `StrongsPopup` |
| שיתוף פסוק | `Chapter` | `VerseActionBar` → Share | `ShareSheet` |
| פתיחת פסוק בתוך הסיידבר | `BibleReader`/`Chapter` | לחיצה על הפניה בתוך "Book Intro" | `VersePopup` |
| תוכנית 30 יום | `Plan` | לחיצה על שורת יום | `/Chapter?book=...` |
| תפילות | `PrayerLibrary` | כרטיס תפילה → "Save" | `PrayerSaved` |
| שאלה-תשובה | `QA` | לחיצה על שאלה | פתיחה במקום (`openIds`) |
| דבריה יומית | `Home` | "Read Full Devotional" | `/Devotionals?devotional=KEY` |
| דבריה לשיתוף | `Devotionals` | "Share" | `ShareSheet` |
| מעבר לשירים | `Home` / `SixWaysGrid` | "Open Verse-Songs" | `/VerseSongs` |
| סדרה | `VerseSongs` | `SeriesCard` | `/VerseSongSeries?series=ID` |
| השמעת שיר | `VerseSongs` | לחיצה על `SongCard` | `GlobalPlayer` |
| הורדת שיר | `VerseSongs` | "Buy to Download - $2" | פתיחת PesaPal |
| הוספת מחשבה | `Journal` | "New entry" | `JournalForm` |
| הוספת הגדרה ב-Community | `CommunityRevelations` | `RevelationForm` (דורש התחברות) | `Revelation` |
| הצטרפות לקבוצה | `DiscussionGroups` | "Join" | `joinedGroups` ב-localStorage |
| שמירת תובנה | `TheologicalInsights` | "Save" | `savedInsights` |
| הורדה לאופליין | `Offline` | בחירת סעיף → "Download" | IndexedDB |
| כניסה לניהול | `Admin` | טופס אימייל וסיסמה | `AdminDashboard` |
| איפוס סיסמה מנהל | `AdminOwnerReset` | "Owner Reset Key" | `adminResetPassword` |
| יציאה | `AppHeader` | "Sign out" | `/Logout` |
| תרומה | `AppHeader`/`AppFooter` | "Donate" | `DONATE_URL` (חיצוני) |

---

## 4. מבנה קבצים

### 4.1 שורש ו-Layout
- **`Layout.jsx`** - מעטפת כללית. מעטפת את כל הדפים עם `AuthProvider`, `ThemeProvider`, `PlayerProvider`, `AppHeader`, `AppFooter` (לעמודים מסוימים בלבד), `GlobalPlayer`, `PwaHead`. מזריק את `BRAND_CSS` כ-`<style>`.

### 4.2 `components/layout/`
- **`AppHeader.jsx`** - סרגל ניווט עליון עם תפריט נייד. מציג `NAV_ITEMS` (About, Community, PrayerLibrary, BibleReader, VerseSongs, QA, Devotionals, Dashboard) ו-`SECONDARY_ITEMS` (Theological, Historical, Verse of the day, Plan, Journal, Offline, BibleNotes, Revelations, Live teaching, Discussion groups וכו'). כפתור Donate, כניסה/יציאה.
- **`AppFooter.jsx`** - רגל עם QUICK_LINKS, ניוזלטר ותרומה. מוצג רק בעמודי Home, QA, Devotionals.
- **`GlobalPlayer.jsx`** - נגן שירים צף בתחתית. כפתורי play/pause, דילוג, shuffle, repeat, מהירות, עוצמה, פס התקדמה, מזעור והרחבה. מוסיף את המחלקה `pr-has-player` ל-`body` כדי לפנות מקום.
- **`PwaHead.jsx`** - מוסיף ל-`<head>` מטה-דאטה ל-PWA (theme-color, apple-mobile-web-app, manifest, favicon) ומאזין לרישום service worker.
- **`ScrollToTop.jsx`** - גלילה לראש העמוד בשינוי נתיב/ספר/פרק.

### 4.3 `components/read/` - ליבת הקריאה
- **`AnnotatedText.jsx`** - טקסט שניתן לסמן בו (highlight/underline). טווחים נשמרים לפי `start_offset`/`end_offset`. תומך בעכבר, מגע ומקלדת.
- **`BookGrid.jsx`** - רשת הספרים (Old/New).
- **`BookIntro.jsx`** - מבוא הספר. מציג את `intro` (מ-`fetchBookIntro` או מ-`bookGuides`), `title` ו-`KEY_PASSAGES` כקישורים.
- **`BookOutline.jsx`** - מתאר הספר. כותרות וטווחי פסוקים שניתנים ללחיצה.
- **`BookPrayerPanel.jsx`** - תפילה לספר (`getBookPrayer` או `fetchBookIntro`).
- **`BookSidebar.jsx`** - סיידבר עם שלוש לשוניות: Intro, Outline, Prayer.
- **`BookStudyResources.jsx`** - פאנל משאבים מתחת לרשת הפרקים: Commentary, Theological, Historical, עם `Pagination`.
- **`ChapterClosingPrayer.jsx`** - תפילת סיום לפרק, כולל אמן, שיתוף וחזרה לתפילה.
- **`ChapterGrid.jsx`** - רשת תאי פרקים (`chap-chip`).
- **`ChapterReaderPane.jsx`** - מגירת הלימוד בעמוד הפרק. תפריט עם "Intro", "Commentary", "Prayer", "Cross-refs". בנייד מתקפל מתחת לסרגל, בדסקטופ נשאר בעמודה הצדדית.
- **`ChapterResourcesPanel.jsx`** - שני תובנות (תיאולוגית והיסטורית) לפרק; נופל ל-`getBookStudyInsights` אם אין.
- **`ChapterSelector.jsx`** - שלד הקריאה לספר: סיידבר + רשת פרקים + `VersePopup`. שומר את ההדגשות ב-`StudyAnnotation` ו-`localStorage`.
- **`ChapterSidebar.jsx`** - הסיידבר של הפרק: Intro, Commentary, Prayer, Cross-refs. משתמש ב-`getChapterIntro`, `getChapterCommentary`, `getChapterPrayer`, `getChapterKeyPassages` מ-`lib/chapterStudy.js`.
- **`CrossRefList.jsx`** - רשימת הפניות צולבות לפסוק (גרסה עם `chapterGroups`).
- **`CrossRefScripture.jsx`** - מביא את טקסט הפסוק שאליו מפנה ההפניה דרך `fetchPlainChapter`.
- **`FloatingVerse.jsx`** - פסוק בחלון צף (תצוגה קטנה).
- **`PassagePrayer.jsx`** - תפילה לקטע; `matchesPassage` קובע אם תפילה שייכת לפסוק.
- **`PassageTabs.jsx`** - לשוניות לקטע: commentary, theological, historical, Q&A (מסנן לפי `bookKey` ו-`matchesPassage`).
- **`ShareSheet.jsx`** - חלון שיתוף רב-ערוצי, כולל תצוגה מקדימה, העתקה ו-`navigator.share` כשזמין.
- **`StrongsPopup.jsx`** - הגדרה של מספר Strong. מחפש בתחילה ב-`fse2.entities.StrongEntry` ואם לא, מביא מ-BLB ומשמר.
- **`StrongsText.jsx`** - מפרסר טקסט עם תגיות `(G1234)` ומציג אותן כ-superscript כחול. מחשב גם את הטקסט הנקי (plain) לצורך עוגנים.
- **`VerseActionBar.jsx`** - סרגל פעולות לפסוק, בסדר של זרימת העבודה: תפילה, הפניות צולבות, פירוש, הדגשה, שיתוף, סימניה, העתקה והערה.
- **`VerseCrossRefs.jsx`** - גרסה מורחבת להפניות לפסוק, עם שליפת טקסט מלא.
- **`VerseList.jsx`** - רשימה פשוטה של פסוקים (ללא הדגשות מתקדמות). ככל הנראה רכיב ישן.
- **`VersePopup.jsx`** - חלון קופץ שמציג פסוק מסוים עם הקשר (פסוק לפני ואחרי).
- **`VersionPicker.jsx`** - בחירת גרסה. הגרסאות ב-`VERSIONS` (`lib/versions.js`). תומך בהתקנה/הסרה של גרסה (`installVersion`, `uninstallVersion`).

### 4.4 `components/admin/` - ניהול תוכן
- **`ChapterCoverage.jsx`** - מטריצת כיסוי של 66 הספרים (פרקים מוכנים, חסרים, פגומים). מכיל את `compressChapters` שממיר רשימת מספרים לטווחים (`2-5, 9, 12`).
- **`CollectionsPanel.jsx`** - טבלה גנרית לכל הקולקשנים (`COLLECTIONS`) עם חיפוש, יצירה, עריכה ומחיקה. הטפסים נבנים אוטומטית מתוך `adminCollections.js`.
- **`ConfirmDialog.jsx`** - חלון אישור מחיקה.
- **`CrossRefEditor.jsx`** - עורך רשימת הפניות בצ'יפים (chips), עם `splitRefs` / `joinRefs`.
- **`DevotionalBulkImport.jsx`** - העלאה של קובץ JSON לדבריות (פורמט `pray-read-devotionals-v1`), בדיקת שדות חובה, ורשומות לפי `code`.
- **`DevotionalForm.jsx`** - טופס דבריה דו-לשוני: כותרת, פסוק, גוף, תפילה, נושא, תאריך, תמונת כיסוי, מודל תצוגה מקדימה (`DevotionalFeatured`).
- **`DevotionalPlansPanel.jsx`** - תוכניות דבריות מרובות-יום (למשל תוכנית 21 יום).
- **`DevotionalTopicsPanel.jsx`** - ניהול נושאים. מוחק רק נושא ריק (אסור למחוק נושא עם דבריות).
- **`DevotionalsPanel.jsx`** - לשוניות: Devotionals, Topics, Plans, Bulk upload.
- **`JsonImportPanel.jsx`** - ייבוא JSON גנרי לפי קולקשן (`Prayer`, `Devotional`, `BibleVerse`, `Commentary`...). מקבל גם שמות חלופיים (`ALIASES`). כולל תבנית להורדה.
- **`KjvPlusInstaller.jsx`** - התקנת KJV+ (Strong) ובניית מילון Strong. קורא ל-`kjvInstall` בשרת.
- **`LibraryReport.jsx`** - דוח ביקורת על הספרייה: כמה פרקים מותקנים בכל תרגום, אי-התאמות בין תרגומים בספירת פסוקים, מספר Strong שמוגדרים.
- **`LugandaInstaller.jsx`** - התקנת התנ"ך בלוגנדה. פרק-אחר-פרק דרך `lugandaInstall`.
- **`PassagesPanel.jsx`** - ניהול חומר התפילה לספר: PrayerPassage, CrossReference, ChapterIntro, BookIntro (לשוניות).
- **`PrayCrossRefImport.jsx`** (הערה: השם בקוד `PrayerCrossRefImport.jsx`) - ייבוא תפילות + הפניות לספר שלם. יש מבט מקדים לפרקים מותקנים.
- **`PrayersPanel.jsx`** - ניהול ספריית התפילות (`library`) או התפילות לפי מעבר בספר/פרק/פסוק (`passages`).
- **`QaAdminList.jsx`** - רשימת שאלות עם סרגל אותיות (QaLetterBar), בחירה מרובה והחלפת מצב.
- **`QaBulkImport.jsx`** - ייבוא שאלות בקובץ (`pray-read-qa-v1`), בדיקת שדות, התעלמות מכפילויות.
- **`QaItemForm.jsx`** - טופס שאלה-תשובה דו-לשונית. האות נגזרת מהשאלה ולא נשמרת.
- **`QaPanel.jsx`** - שלוש לשוניות: Questions, Topics, Bulk upload.
- **`QaQuestionsPanel.jsx`** - רשימת שאלות + טופס + אישור מחיקה.
- **`QaTopicForm.jsx`** - טופס נושא דו-לשוני (שם EN ו-LU חובה).
- **`QaTopicsPanel.jsx`** - ניהול נושאים. נושא עם שאלות אי אפשר למחוק ישירות; קודם מעבירים את השאלות לנושא אחר.
- **`RecordEditor.jsx`** - עורך רשומה גנרי שנבנה מהרשימה ב-`adminCollections`. תומך ב-text, textarea, number, boolean, refs.
- **`ResetAdminPasswordSection.jsx`** - שינוי סיסמה (Option A: שינוי עם סיסמה ישנה; Option B: הפניה ל-`AdminOwnerReset`).
- **`VerseSongBulkImport.jsx`** - ייבוא JSON לשירים (`pray-read-verse-songs-v1`). בודק כתובות MP3 תקינות (`http/https` עם סיומת mp3/m4a/wav).
- **`VerseSongForm.jsx`** - טופס שיר. מוציא את אורך השיר מהקובץ אוטומטית דרך `Audio().onloadedmetadata`.
- **`VerseSongSeriesForm.jsx`** - טופס סדרה (שם, סדר תצוגה, תיאור, תמונה).
- **`VerseSongsPanel.jsx`** - לשוניות: Management, Bulk upload. ניהול סדרות ושירים עם ConfirmDialog.

### 4.5 `components/devotional/`
- **`DevotionalCard.jsx`** - כרטיס דבריה ברשימה (תמונה, תאריך, כותרת, פסוק, נושא, תקציר, כפתורי שמירה/שיתוף).
- **`DevotionalFeatured.jsx`** - הדבריה המוצגת בראש העמוד (כהה, עם שני פסוקים).
- **`DevotionalFilters.jsx`** - שורת סינון (שפה, חיפוש, נושא, טווח זמן).
- **`DevotionalFullView.jsx`** - קריאה מלאה: פסוק, גוף בשפה שנבחרה, תפילה, כפתורים לפני/אחרי/שיתוף/שמירה/סימון כנקרא.

### 4.6 `components/home/`
- **`ImageCard.jsx`** - מעטפת כרטיס עם תמונת רקע ו-scrim. מוצג כקישור אם מועבר `to`.
- **`HomeHero.jsx`**, **`HomeIntro.jsx`**, **`JourneySteps.jsx`**, **`VisionCards.jsx`**, **`ExperiencePoints.jsx`**, **`SixWaysGrid.jsx`**, **`ExploreBible.jsx`**, **`ClosingInvite.jsx`**, **`VerseOfDayCard.jsx`**, **`DailyDevotionalCard.jsx`** - רכיבי הדף הראשי.
- **`StatCard.jsx`** - כרטיס מספר (לדשבורד).

### 4.7 `components/community/`
- **`CommentThread.jsx`** - שרשור תגובות לפוסט.
- **`RevelationCard.jsx`** - כרטיס revelation עם לייק ותגובות.
- **`RevelationForm.jsx`** - טופס שיתוף (מציג הזמנה להתחברות למי שלא מחובר).
- **`ThreadMessages.jsx`** - הודעות בקבוצת דיון.

### 4.8 `components/song/`
- **`SongCard.jsx`** - כרטיס שיר עם כפתורי Play, הורדה, שיתוף. לחיצה על הכרטיס = השמעה.
- **`SeriesCard.jsx`** - כרטיס סדרה.
- **`SongFilters.jsx`** - חיפוש וסינונים (סדרה, ספר).
- **`SongShareSheet.jsx`** - שיתוף שיר.

### 4.9 `components/qa/`
- **`QaCard.jsx`** - כרטיס שאלה-תשובה עם קיפול, הצבעה, שיתוף והעתקה.
- **`QaFilters.jsx`** - סינונים.
- **`QaLetterBar.jsx`** - סרגל אותיות נגלל, בוחר אות ממורכזת.

### 4.10 `components/plan/`, `components/journal/`, `components/insight/`
- **`PlanRow.jsx`** - שורת יום בתוכנית.
- **`JournalCard.jsx`**, **`JournalForm.jsx`** - כרטיס ויצירת רשומה ביומן.
- **`InsightsBoard.jsx`** - לוח תובנות.

### 4.11 `components/common/`
- **`BrandIcons.jsx`** - אייקוני מותגים (WhatsApp, Facebook, X, Telegram, Email) כ-SVG מוטמע, כי Lucide אין לו מותגים.
- **`EmptyState.jsx`**, **`Spinner.jsx`**, **`PageHeader.jsx`**, **`Pagination.jsx`**, **`ShareRow.jsx`**, **`Modal.jsx`** - רכיבים כלליים.

### 4.12 `components/dashboard/`
- **`ActivityFeed.jsx`** - פיד פעילות אחרונה של המשתמש (`ReadingActivity`) עם רענון כל 30 שניות.

### 4.13 `lib/` - לוגיקה ונתונים
| קובץ | תפקיד |
|------|--------|
| `AuthContext.jsx` | Context של התחברות (user, isAuthenticated, logout) |
| `themeContext.jsx` | צבעי המותג הדינמיים מתוך `SiteSettings`; נבנה גם מהצבעים הבסיסיים |
| `player.jsx` | נגן אודיו גלובלי (תור, מצבים, שליטה) |
| `theme.js` | קבועי מותג: צבעים, לוגו, תמונות גיבוי |
| `brandCss.js` | מערכת העיצוב (CSS variables + classes `.pr-*`) |
| `homeCss.js`, `aboutCss.js` | CSS לדף הבית ולאודות (scoped) |
| `bibleBooks.js` | 66 ספרים, שמות, קיצורים, מספר פרקים |
| `bibleApi.js` | שליפת פרקים מהמקורות (bible-api.com, wordplanet) עם cache ל-IndexedDB |
| `bookGuides.js`, `bookPrayers.js`, `keyPassages.js`, `bookStudyContent.js` | תוכן לימוד ידני לכל ספר |
| `chapterStudy.js` | בונה תוכן לימוד לפרק (מבוסס על התוכן הקיים) |
| `chapterIntros.js`, `bookIntro.js`, `prayerPassages.js` | קריאה ונרמול של תוכן מיובא (`ChapterIntro`, `BookIntro`, `PrayerPassage`, `CrossReference`) |
| `bookImport.js`, `prayerImport.js` | לוגיקת ייבוא קבצים: נרמול, ולידציה, מפתחות טבעיים, פיצול לפי סוג |
| `bilingual.js` | קריאת טקסט דו-לשוני ללא ערבוב בין שפות |
| `contentApi.js` | קריאה ציבורית (`fetchPublicCollection`) עם fallback ל-seed; ופעולות כתיבה (`submitContactMessage`, `submitRevelation`, `likeRevelation`) |
| `devotionals.js` | נרמול שדות דבריות, בחירת דבריה יומית, מצב "נקרא/שמור" |
| `useDevotionalLibrary.js` | hook לספריית הדבריות האישית |
| `qaLibrary.js` | טעינה, סינון, מיון ו-letter index לשאלות |
| `verseSongs.js` | נרמול סדרות ושירים, בניית תור ניגון, פורמט שיתוף |
| `versions.js` | הגדרת תרגומים ונתיב התקנה |
| `strongs.js`, `strongsOffline.js` | נרמול מספרי Strong ושמירה מקומית |
| `scriptureRefs.js` | פענוח הפניות ("John 3:16") והמרה ל-URL |
| `studyAnnotations.js` | שמירה וטעינה של הדגשות (שרת + IndexedDB) |
| `activity.js` | רישום פעולות קוראים (`ReadingActivity`) |
| `readings.js` | רישום קריאה ותוכנית |
| `reading.js` | פונקציות תאריך (ISO, shiftISODate, formatDateLabel) |
| `offlineDb.js` | מעטפת IndexedDB עם stores מרובים |
| `share.js` | שיתוף: ערוצים, פורמט טקסט, שיתוף דרך Web Share |
| `format.js` | `safeText`, `formatDuration`, `splitList` |
| `textSelection.js` | `selectionInside` - מונע "קליק" כשהמשתמש בוחר טקסט |
| `sha256.js` | SHA-256 טהור בJS (לתאימות בדפדפנים בלי Web Crypto) |
| `adminSession.js` | ניהול סשן מנהל (token, keep-alive, renew) |
| `adminDirect.js` | גישה ישירה לנתונים עבור מנהל (ללא פונקציית שרת) |
| `adminCollections.js` | הגדרת כל הקולקשנים של מנהל וטפסיהם |
| `adminPasswordRules.js` | כללי סיסמה (12 תווים, אותיות גדולות/קטנות, ספרות, סמלים) |
| `app-params.js` | קריאת `appId` וטוקן מ-localStorage |
| `seedContent.js` | תוכן גיבוי לכל הקולקשנים |
| `homeImages.js` | תמונות רקע לדף הבית |
| `planData.js` | נתוני תוכנית 30 יום |
| `crossRefs.js` | הפניות מובנות מראש לקטעים מפורסמים |
| `lugandaFormat.js` / `luganda.js` | עיצוב דבריות בלוגנדה (מסיר שמות אתרים דולפים ומחלק לסעיפים) |

### 4.14 `pages/`
כל קובץ שמייצג URL. פירוט בסעיף 2.

### 4.15 `functions/` (Backend)
| קובץ | תפקיד |
|------|--------|
| `adminAuth.js` | התחברות מנהל, שינוי סיסמה, איפוס עם מפתח בעלים, חתימת session (HMAC) |
| `adminContent.js` | API מוגן לניהול תוכן (list, create, update, delete, import) |
| `bibleChapter.js` | שליפת פרק מ-bible-api.com (EN) או wordplanet.net (LU) |
| `content.js` | API ציבורי לקריאה ולכתיבה של טפסים (צור קשר, שאלות, הודעות). מסנן דבריות לפי תאריך |
| `kjvInstall.js` | התקנת KJV עם Strong, פרק-אחר-פרק |
| `lugandaInstall.js` | התקנת תנ"ך לוגנדה, פרק-אחר-פרק |
| `scriptureAudit.js` | דוח ביקורת קריאה בלבד |
| `strongsDefinition.js` | מילון Strong: מחפש מקורות (openscriptures/strongs, BLB), שומר בזיכרון |

### 4.16 `entities/` (Schema)
קבצי JSON שמגדירים את הטבלאות ב-FSe2 ואת הרשאות הגישה (`x-fse2-access`). מפורט בסעיף 5.

### 4.17 `cron/`
- **`scriptureInstall.js`** - משימה מתוזמנת (כל שעה). ממלאת את ספריית התנ"ך החסרה: לוגנדה ו-KJV+ וכן מילון Strong. עוצרת כשאין התקדמות בריצה.

### 4.18 `public/`
- **`manifest.json`** - manifest של PWA (שם, צבעים, אייקונים).
- **`sw.js`** - Service Worker. מטמון של App Shell (cache-first) ותשובות רשת (network-first). גרסה `prayread-shell-v2`.
- **`assets/`** - תמונות, PDF, DOCX, JSON, אודיו וקבצי מדיה (נשמרו כ-data URIs בקוד המסופק).

### 4.19 `__trash/` (קוד מת)
קבצי ניסוי ומשאבי אבחון שנותרו ב-repo: `pages/AdminDiag.jsx`, `pages/ImportCheck.jsx`, `pages/ShareCheck.jsx`, `pages/StrongsPopupTest.jsx`, `pages/InstallerCheck.jsx`, `functions/_hashcheck.js`, `functions/probeChapter.js` וכו'. **יש לנקות.** חלק מהם מכיל אזכור של סיסמה בגרסת ניסוי, וזו בעיית אבטחה שצריך לתקן.

### 4.20 `__generated/`
`tailwind.css` - פלט אוטומטי (לא לעריכה ידנית).

---

## 5. מודל הנתונים (Entities)

> כל ישות היא טבלה ב-FSe2. "קשר" פירושו שדה שמפנה ל-`book_number`, `owner_email`, `series_name` וכו', ולא קשר מפתח זר פורמלי.

### 5.1 תוכן ציבורי (קריאה לכולם, כתיבה למנהל בלבד)
| ישות | תכלית | שדות מרכזיים | קשרים |
|------|-------|--------------|--------|
| `BibleVerse` | פסוק בודד בעברית/לוגנדה (לא בשימוש ישיר בקריאה) | `book_number`, `chapter`, `verse`, `text_en`, `text_lu` | - |
| `LugandaChapter` | פרק שלם בלוגנדה, מותקן מראש | `book_number`, `chapter`, `verse_count`, `verses` (JSON) | לפי `book_number`, `chapter` |
| `KjvPlusChapter` | פרק KJV עם Strong, מותקן מראש | כמו LugandaChapter | - |
| `Commentary` | פירוש לפרק | `book`, `chapter`, `title`, `body_en`, `body_lu` | לפי `book` ו-`chapter` |
| `Insight` | תובנה תיאולוגית/היסטורית | `kind` (theological / historical), `title`, `passage`, `excerpt`, `body`, `share_count` | `passage` מפנה לפרק |
| `Prayer` | ספריית תפילות | `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref`, `cross_refs` | `scripture_ref` |
| `PrayerPassage` | תפילה לפרק / טווח / פסוק | `book_number`, `chapter`, `verse` (0=פרק), `verse_end`, `title_en/lu`, `prayer_en/lu` | לפי book/chapter/verse |
| `CrossReference` | הפניה צולבת מפסוק לפסוק | `book_number`, `chapter`, `verse`, `ref_book_number`, `ref_chapter`, `ref_verse`, `ref_verse_end`, `ref_text_en/lu` | לפי book/chapter/verse |
| `ChapterIntro` | מבוא לפרק | `book_number`, `chapter`, `title_en/lu`, `intro_en/lu`, `source` | לפי book/chapter |
| `BookIntro` | מבוא לספר וגם תפילה סיום | `book_number`, `title_en/lu`, `intro_en/lu`, `closing_prayer_en/lu` | לפי `book_number` |
| `Devotional` | דבריה יומית דו-לשונית | `code`, `title_en/lu`, `scripture_ref`, `verse_en/lu`, `body_en/lu`, `prayer_en/lu`, `topic`, `series`, `date`, `cover_url`, `featured`, `active` | `topic` → `DevotionalTopic.name_en`; `series` → `DevotionalPlan.name_en` |
| `DevotionalTopic` | נושא לדבריות | `name_en`, `name_lu`, `active` | - |
| `DevotionalPlan` | תוכנית דבריות מרובת-ימים | `name_en`, `name_lu`, `description`, `days`, `active` | - |
| `QATopic` | נושא ל-Q&A | `name_en/lu`, `description_en/lu`, `active` | - |
| `QAItem` | שאלה ותשובה דו-לשונית | `topic_en`, `topic_lu`, `scripture_ref`, `question_en/lu`, `answer_en/lu`, `tags`, `featured`, `active` | `topic_en` → `QATopic.name_en` |
| `VerseOfDay` | פסוק לכל יום | `verse_date`, `reference`, `text_en`, `text_lu`, `note` | - |
| `VerseSongSeries` | סדרת שירי מקרא | `name`, `display_order`, `description`, `thumbnail`, `cover_image`, `accent`, `featured`, `active` | - |
| `VerseSongEpisode` | שיר בסדרה | `series_name`, `title`, `audio_url`, `duration_seconds`, `thumbnail`, `cover_url`, `episode_order`, `plays_count`, `active` | `series_name` → `VerseSongSeries.name` |
| `ReadingPlan` | תוכנית קריאה 30 יום | `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture` | - |
| `LiveSession` | שידור חי | `title`, `session_date`, `host`, `join_link`, `description` | - |
| `DiscussionGroup` | קבוצת לימוד | `name`, `description`, `schedule`, `member_count` | - |
| `SiteSettings` | הגדרות אתר | `setting_key`, `setting_value` | - |

### 5.2 תוכן שנכתב על ידי משתמשים (קריאה לכולם, כתיבה לבעלים/מחוברים)
| ישות | תכלית | שדות מרכזיים |
|------|-------|--------------|
| `Revelation` | שיתוף "מה ה' הראה לי" וגם תגובות (עם `parent_id`) | `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id` |
| `DiscussionThread` | הודעה בקבוצה | `group_name`, `owner_email`, `author_name`, `title`, `body` |
| `QAEntry` | שאלה שהוגשה על ידי קורא | `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email` |
| `ContactMessage` | הודעה דרך טופס צור קשר | `name`, `email`, `subject`, `message`, `is_read`, `reply` |

### 5.3 נתוני משתמש פרטיים (רק הבעלים)
| ישות | תכלית | שדות מרכזיים |
|------|-------|--------------|
| `Reading` | פרק שהושלם | `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses` |
| `ReadingActivity` | פעולה אחת של קורא (ביקור, הדגשה וכו') | `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse` |
| `StudyMark` | הדגשה, סימניה או הערה על פסוק | `owner_email`, `mark_type` (highlight/bookmark/note), `book_number`, `chapter`, `verse`, `color`, `note_text` |
| `StudyAnnotation` | הדגשה בתוך סקשן (מבוא, תוכן, תפילה) | `owner_email`, `book_number`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset` |
| `JournalEntry` | רשומת יומן תפילה | `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood` |
| `PrayerSaved` | תפילה שנשמרה למועדפים | `owner_email`, `prayer_title` |
| `DevotionalSaved` | דבריה שנשמרה | `owner_email`, `devotional_code`, `saved_date` |
| `DevotionalProgress` | דבריה שנקראה | `owner_email`, `devotional_code`, `completed_date` |
| `DiscussionGroup` (membership) | - | (הצטרפות נשמרת כרגע ב-localStorage) |

### 5.4 ניהול
| ישות | תכלית | הרשאות |
|------|-------|--------|
| `AdminAccount` | מייל וגיבוב סיסמה של המנהל | owner, admin בלבד |
| `ActivityLog` | יומן פעולות של המנהל | owner, admin: read, create, update, delete |
| `StrongEntry` | מילון Strong (מטמון) | קריאה לכולם |

### 5.5 מדיניות הרשאות (לדוגמה)
```json
"x-fse2-access": {
  "version": 1,
  "rules": [
    { "actions": ["read"], "subject": { "roles": ["*"] } },
    { "actions": ["create","update","delete"], "subject": { "roles": ["owner","admin"] } }
  ]
}
```
ישויות בעלות אישית (`Reading`, `JournalEntry` וכו') משתמשות ב-`version: 2` עם `condition` שמשווה ל-`owner_email`.

**שימו לב:** `Reading` ו-`JournalEntry` משתמשים בתפקיד `authenticated`, ולכן בעלות נאכפת רק על ידי השאילתה בקליינט (`filter(owner_email === email)`). מומלץ להוסיף תנאי `condition` ברמת השרת.

---

## 6. תהליכים ואינטראקציות מרכזיות

### 6.1 קריאת פרק מקצה לקצה
1. **כניסה:** משתמש מגיע ל-`/BibleReader`, בוחר ספר. `BookGrid` מציג את הספרים, `offline.getAll("chapters")` מסמן אילו זמינים לאופליין.
2. **בחירת פרק:** `ChapterGrid` (ב-`ChapterSelector`) מנווט ל-`/Chapter?book=N&chapter=C`.
3. **טעינה:** `Chapter.jsx` קורא ל-`fetchChapter({bookNumber, chapter, versionId})` (`lib/bibleApi.js`):
   - בודק קודם IndexedDB (`chapterKey`).
   - אם אין, שולח בקשה דרך `functions/bibleChapter.js` (EN/LU) או לקובץ מותקן (`LugandaChapter` / `KjvPlusChapter`).
   - שומר ל-IndexedDB ומחזיר.
4. **הצגה:** נבנית רשימת פסוקים. `markStrongCodes` מסמן מספרי Strong. `StrongsText` מציג אותם.
5. **התקשרות עם פסוק:** לחיצה על פסוק → `VerseActionBar` נפתח (`selectedVerse`). כל פעולה כותבת ל-`StudyMark` (או ל-`localStorage` אם המשתמש לא מחובר) ומתעדת ל-`ReadingActivity`.
6. **תפילה ופירוש:** `PassagePrayer` ו-`PassageTabs` נטענים מ-`PrayerPassage` ו-`Commentary`/`Insight` ועם fallback ל-`seedContent`.
7. **סיום:** `ChapterClosingPrayer` בתחתית, וכפתור "Mark as read" רושם `Reading` ואת `plan_day` אם הפרק בתוכנית.

### 6.2 הדגשת טקסט ב-AnnotatedText
1. המשתמש בוחר טקסט בתוך `AnnotatedText`.
2. `window.getSelection()` → חישוב `start_offset` ו-`end_offset` ביחס לטקסט המקורי.
3. `saveAnnotation` כותב ל-`StudyAnnotation` (שרת) וגם ל-IndexedDB (מקומי).
4. בטעינה הבאה, `mergeAnnotations` ממזג את שני המקורות (מפתח `annotationKey`).
5. `buildSegments` חותך את הטקסט לקטעים לפי נקודות ההדגשה ומרנדר.

### 6.3 שיתוף (Share)
1. `ShareSheet` (או `SongShareSheet`) נפתח עם `text`, `url`, `sections`.
2. `shareChannels` מציג ערוצים (WhatsApp, Facebook, X, Telegram, Email, Copy, Native).
3. ערוצים שדורשים קישור בלבד (Facebook, LinkedIn, Instagram) מעתיקים את הטקסט ללוח.
4. `openShare(channel, text, url)` פותח חלון חדש עם ה-URL המתאים.
5. `copyToClipboard` מחזיר `true` / `false` לתצוגת "Copied".

### 6.4 הורדה לאופליין
1. ב-`Offline` המשתמש בוחר סעיף (למשל Bible chapters) ו-תרגום.
2. לולאה על הספרים → פרקים → `fetchChapter` → `offline.put("chapters", ...)`.
3. המדד `storage` מחושב עם `navigator.storage.estimate()` (אם נתמך).
4. מחיקה: `offline.delete` לפי `chapterKey`.
5. בקריאה, `Chapter` קורא קודם מה-IndexedDB, כך שנתמך מצב לא מקוון.

### 6.5 תוכנית 30 יום
1. `Plan` טוען `ReadingPlan` (או `PLAN_DAYS`).
2. `Reading` עם `status === "completed"` מסמן ימים שהושלמו.
3. `currentDay` = היום הראשון שלא הושלם.
4. לחיצה על היום פותחת את הפרק. בסיום קריאה `recordReading` מסמן `plan_day`.

### 6.6 ייבוא קבצי JSON (מנהל)
1. מנהל מוריד תבנית מהכפתור "Download template" (ב-`JsonImportPanel`).
2. מעלה קובץ. `prepareImport` מנרמל (`bilingualText`, `normaliseCrossRef`, `normalisePassage`).
3. `validatePrayerFile` בודק: שדות חובה, פורמט ספר/פרק/פסוק.
4. הדוח: כמה רשומות חדשות, כמה ידוע (מזהה לפי מפתח טבעי), כמה שגיאות.
5. לחיצה על "Import" → `callAdminData("upsert", ...)` לכל רשומה. לא נוצר כפל כי מפתח טבעי מזהה את הרשומה הקיימת.

### 6.7 התקנת תרגום לוגנדה (מנהל)
1. ב-`AdminDashboard` → "Luganda Bible" → `LugandaInstaller`.
2. לחיצה על "Install" → `lugandaInstall` (action=`install` / `status`).
3. השרת מחשב את הפרקים החסרים (לפי `LugandaChapter`), מוריד אחד-אחד מ-wordplanet, שומר.
4. כל קריאה לשרת מחדשת את הטוקן (`ensureFreshAdminToken`). כדי לא להתנתק באמצע ההתקנה.
5. תצוגת `ChapterCoverage` מציגה התקדמות.
6. ההתקנה ממשיכה אוטומטית ב-cron `scriptureInstall.js` כל שעה.

### 6.8 כניסה לניהול
1. `/Admin` - מייל וסיסמה → `adminSignIn`.
2. מצב "server": השרת מחזיר token חתום (HMAC). נשמר ב-`localStorage` כ-`pr_admin_token`.
3. מצב "direct": אם הפונקציה לא זמינה, נבדק הגיבוב בדפדפן מול `AdminAccount`, והעבודה ממשיכה דרך `adminDirect.js`.
4. ה-keep-alive (`startAdminKeepAlive`) מחדש את הסשן כל מספר דקות.

### 6.9 שליחת הודעה בקהילה
1. משתמש לא מחובר רואה הזמנה להתחברות (`RevelationForm`).
2. משתמש מחובר: `submitRevelation({title, passage, body})` → `Revelation` (ללא `parent_id`).
3. הפוסט מופיע ב-`CommunityRevelations` אחרי רענון `queryClient.invalidateQueries(["revelations"])`.
4. לייק: `likeRevelation(id)` מעדכן את `likes`.
5. תגובה: `submitComment` מגדיר `parent_id` לתגובה.

### 6.10 רכישת שיר (Verse-Song)
1. לחיצה על "Buy to Download - $2" → `setPendingPurchase` ב-`localStorage`.
2. פתיחת `PESAPAL_URL` בלשונית חדשה.
3. כשהמשתמש חוזר, `paymentOpened` מופעל, והכפתור משתנה ל-"Download".
4. `downloadSong` מוריד את הקובץ ומוסיף ל-`purchased_verse_songs`.

---

## 7. הערות טכניות לפיתוח

### 7.1 מחסנית (Stack)
- **React** עם **React Router** לניתוב (`Link`, `useSearchParams`, `useNavigate`).
- **TanStack Query** (`@tanstack/react-query`) לכל קריאות הנתונים עם `queryKey` ברורים.
- **date-fns** לפורמט תאריכים.
- **lucide-react** לאייקונים (חוץ מאייקוני מותגים שנכתבו ידנית ב-`BrandIcons.jsx`).
- **Tailwind CSS** מופיע ב-`__generated/tailwind.css`, אבל רוב העיצוב נעשה דרך CSS מותאם ב-`brandCss.js` עם מחלקות `pr-*`. **אל תערבבו שני סגנונות באותו רכיב** (ב-`__trash` ראו שימוש מעורב, וזה כבר נוטש).
- **IndexedDB** דרך `lib/offlineDb.js` (גרסה 10, stores רבים). במקרה של שדרוג, הוסיפו store חדש ב-`STORES` והגדילו את `DB_VERSION`.
- **Service Worker** ב-`public/sw.js`. שינוי ב-`SHELL` דורש העלאת `SHELL_CACHE` לגרסה חדשה כדי לאלץ רענון.

### 7.2 דפוסים חוזרים
- **Fallback ל-seed:** כמעט כל עמוד מציג תוכן מ-`seedContent.js` כשה-DB ריק. זה מונע מסכים ריקים, אבל מסתיר שבירה של ה-DB. במקרה של בעיה, בדקו קודם את ה-DB ולא את ה-UI.
- **Merge של live ו-seed:** בדפים רבים (`Community`, `DiscussionGroups`, `Insights`) נעשה מיזוג: מוצגים רשומות חיות וגם seed שלא קיים בחיות (לפי `title`). לכן מחיקה ב-DB לא תסיר את ה-seed.
- **Bilingual:** כל שדה בתוכן מופיע כ-`_en` ו-`_lu`. בכמה מקומות עדיין מופיעים שמות ישנים (`title`, `body`, `intro`) לתאימות לאחור. `bilingual.js` ו-`fieldOf` מטפלים בזה.
- **Natural keys:** ייבוא לא יוצר כפילויות כי כל רשומה מזוהה לפי מפתח טבעי (`passageNaturalKey`, `crossRefNaturalKey`, `chapterIntroNaturalKey`, `bookIntroNaturalKey`). שינוי בשדות המפתח ישבור את הייבוא החוזר.
- **Dates:** כל תאריך ב-ISO `YYYY-MM-DD`, והפונקציות ב-`reading.js` מחשבות לפי זמן מקומי (לא UTC). חשוב לדבריות שמופיעות "היום".

### 7.3 נקודות רגישות
- **סיסמאות מנהל:** `adminAuth.js` משתמש ב-PBKDF2 עם 210,000 איטרציות. `lib/sha256.js` מציג SHA-256 בדפדפן, לשימוש בלוגיקת fallback. **אם מוסיפים מסלול אימות חדש, ודאו שהוא לא מחזיר "ok" בלי לבדוק את הסיסמה.**
- **מפתחות בסביבה:** `ADMIN_INITIAL_PASSWORD`, `ADMIN_OWNER_RESET_KEY`, והמפתח לחתימת הסשן. לעולם לא בקוד.
- **ב-`__trash` יש קבצי אבחון שכוללים סיסמה ומזהה משתמש בטקסט גלוי.** יש למחוק לפני פרסום.
- **תוכן לא מאומת:** `QAEntry` נכתב על ידי משתמשים. ודאו שמסננים HTML ו-scripts לפני תצוגה (הרכיבים משתמשים ב-`safeText` ו-React שמברח אוטומטית).
- **Strong Lexicon:** הנתונים נלקחים מ-Blue Letter Bible ומ-openscriptures. יש לבדוק זכויות יוצרים לפני הפצה מסחרית.

### 7.4 נקודות לשים לב בהוספת פיצ'רים
- **הוספת עמוד חדש:** צרו `pages/NewPage.jsx`, הוסיפו ב-`AppHeader` (`NAV_ITEMS` או `SECONDARY_ITEMS`) ו-`AppFooter` (`QUICK_LINKS`) אם רלוונטי. ודאו ש-`Layout` מטפל בו (הוא עובד לכל עמוד, אבל `AppFooter` מוצג רק בעמודים מסוימים).
- **הוספת קולקשן לניהול:** הוסיפו ל-`entities/`, ל-`COLLECTIONS` ב-`lib/adminCollections.js` (עם השדות), וגם ל-`lib/adminDirect.js` (`MANAGED`) כדי שהמנהל יוכל לכתוב אליו בדרך הישירה.
- **הוספת שדה לישות קיימת:** עדכנו את ה-JSON של הישות, את `adminCollections.js`, ואת הטופס הרלוונטי. אם הוא נדרש בייבוא, עדכנו גם את `prayerImport.js`.
- **הוספת תרגום חדש:** הוסיפו ל-`VERSIONS` (`versions.js`), ודאו שיש מסלול התקנה (installer) ב-`functions/` ו-cron, ושהגרסה מופיעה ב-`Offline`.
- **הוספת הדגשת סוג חדש:** `AnnotatedText` תומך כרגע ב-highlight ו-underline. להוספת סוג חדש, הוסיפו ל-`kind` וב-`buildSegments`.
- **שינוי צבעים:** ערכי הצבע מרוכזים ב-`lib/theme.js` וב-`brandCss.js`. `themeContext.jsx` עוקף את הערכים מ-`SiteSettings` כשהמנהל משנה אותם.
- **עבודה לא מקוונת:** פרק שמשתנה ב-DB לא מתעדכן ב-IndexedDB אוטומטית. הוסיפו מנגנון גרסה (למשל `updated_date`) אם צריך.

### 7.5 תיקיית `__trash` ו-`__url_fetch`
- **`__trash/`** - קוד ניסוי. אינו מיובא על ידי האתר. ניתן למחוק בבטחה לאחר בדיקה שאין בו קוד שעוד נדרש.
- **`__url_fetch/`** - תוצרי שליפת דפי מקור (HTML/JSON) לצורך מחקר. לא חלק מהאפליקציה.

### 7.6 מה לא ידוע מהקוד המסופק
- תוכן מלא של `Chapter.jsx`, `Devotionals.jsx`, `AdminDashboard.jsx` ו-`AdminOwnerReset.jsx` נחתך בהעתקה, ולכן יש סעיפים שבהם התיאור מבוסס על הייבוא והמבנה הכללי בלבד.
- קובץ `functions/adminContent.js` ו-`functions/scriptureAudit.js` ארוכים ונחתכו. פירוט פעולותיהם נלקח מהקריאה מהלקוח.
- `lib/offlineDb.js` מכיל יותר stores ממה שמופיע בקטע הגלוי.

---

**סוף המסמך.** עדכנו מסמך זה בכל שינוי משמעותי במבנה הנתונים, במסלולי הניווט או בכלי הניהול.
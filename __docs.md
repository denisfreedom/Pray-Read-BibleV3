# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת: Pray-Read Bible

> **הערה על היקף המסמך:** חלק מקבצי המקור הועברו חתוכים (למשל `ChapterCoverage.jsx`, `CollectionsPanel.jsx`, `Chapter.jsx`, `Home.jsx`, `ChapterSelector.jsx`, וחלק מהישויות בתיקיית `entities/`). התיאורים להלן מבוססים על החלקים הגלויים. במקומות שבהם ההתנהגות הוסקה מהקוד החלקי, זה מצוין במפורש. מומלץ לאמת מול הקוד המלא לפני שינויים משמעותיים.

---

## 1. מהות המערכת

**Pray-Read Bible** היא אפליקציית ווב (PWA) דו-לשונית (אנגלית ולוגנדה) שמשלבת ארבע יכולות:

1. **קריאת המקרא**: 66 ספרים, פרק אחר פרק, עם הדגשות, סימניות והערות, פירוש לכל ספר ולכל פרק, ותפילה לכל מקטע.
2. **תוכן רוחני**: תפילות, דבריי יום (devotionals), שאלות ותשובות (Q&A), תובנות תיאולוגיות והיסטוריות, מוזיקת "Verse-Songs".
3. **קהילה ולמידה**: וידויים/התגלויות של קוראים, שיעורים חיים, קבוצות דיון, יומן תפילה, תוכנית קריאה של 30 יום.
4. **פעולות ניהול (Content Manager)**: ממשק מנהל מוגן בסיסמה לעריכת כל התוכן, ייבוא בכמות (JSON), והתקנה אוטומטית של תרגומי המקרא (KJV עם מספרי Strong ולוגנדה) ושל מילון Strong.

**קהל היעד**: קוראים דוברי אנגלית ולוגנדה שרוצים יותר מ"פסוק היום" ופחות מקורס תיאולוגי, וצוות התוכן של הפרויקט.

**ערך מרכזי**: קריאה עם עומק (פירוש, תפילה, מילון מילים מקורית) שעובדת גם **אופליין** ולא דורשת הרשמה.

---

## 2. ארכיטקטורה כללית

### 2.1 מחסנית טכנולוגית

| רכיב | שימוש |
|------|-------|
| React (Function components + Hooks) | ה-UI |
| React Router (`react-router-dom`) | ניווט; נתיבים בשם דף (`createPageUrl("Chapter")`) |
| TanStack React Query (`useQuery`, `useMutation`) | טעינת נתונים מהשרת, cache, refetch |
| `fse2` (`@/api/fse2Client`) | SDK של הפלטפורמה: `entities.X.list/create/update/delete`, `functions.invoke`, `auth.*` |
| IndexedDB (`lib/offlineDb.js`) | אחסון אופליין של פרקים, פירושים, מילוני Strong, הדגשות |
| `lucide-react` | אייקונים |
| `date-fns` | עיצוב תאריכים |
| CSS גלובלי (`lib/brandCss.js`) | מערכת העיצוב כ-CSS string, עם משתנים `--pr-*` |
| Service Worker (`public/sw.js`) | מטמון של מעטפת האפליקציה (cache-first לסטטי, network-first לשאר) |

### 2.2 שכבות המעטפת (`Layout.jsx`)

כל דף נעטף בסדר הבא:

```
AuthProvider          ← מצב משתמש (fse2.auth.me)
 └ ThemeProvider      ← צבעי המותג (נטענים מ-SiteSettings אם מחובר)
    └ PlayerProvider  ← נגן שירים גלובלי (Audio אחד לכל האפליקציה)
       └ div.pr-page
          ├ <style>BRAND_CSS</style>
          ├ PwaHead      ← meta tags, manifest, service worker
          ├ ScrollToTop  ← גלילה לראש העמוד בשינוי נתיב/ספר/פרק
          ├ AppHeader    ← ניווט
          ├ main         ← תוכן הדף
          ├ AppFooter    ← רק בדפים Home / QA / Devotionals
          └ GlobalPlayer ← נגן שירים, תמיד בתחתית
```

### 2.3 שכבת נתונים: שלושה מקורות עם נפילה חכמה

המערכת מעדיפה **נתונים חיים**, ונופלת אל **תוכן מובנה (seed)** כדי שלעולם לא יופיע מסך ריק:

```
עמוד/רכיב
  → fetchPublicCollection(name)   (lib/contentApi.js)
       ├ מנסה fse2.entities.X.list(...)
       └ אם ריק/נכשל → INSIGHTS / PRAYERS / DEVOTIONALS / ... מ-lib/seedContent.js
  → merge: נתונים חיים + פריטי seed שאין להם מקבילה לפי כותרת/קוד
```

שכבת **אופליין** (`offlineDb`) נבדקת במקביל: פרק שהורד נטען מה-IndexedDB לפני בקשת רשת.

### 2.4 שכבות מקור לתוכן המקרא

| מקור | מתי משמש | קובץ |
|------|---------|------|
| `LugandaChapter` / `KjvPlusChapter` (entities) | פרק שהותקן על ידי המנהל | `functions/lugandaInstall.js`, `functions/kjvInstall.js` |
| bible-api.com (EN, ללא Strong) | קריאה אונליין של KJV/WEB וכו' | `lib/bibleApi.js` |
| wordplanet.net (לוגנדה) | קריאה אונליין של לוגנדה | `functions/bibleChapter.js` |
| IndexedDB (`chapters`) | קריאה אופליין | `lib/offlineDb.js` |

---

## 3. עמודים ותפקידיהם

> ה-URL נוצר על ידי `createPageUrl(PageName)`. לפי השימוש בקוד, הנתיב הוא בערך `/PageName`. מיפוי הנתיבים עצמו (ה-router) אינו חלק מהקבצים שסופקו.

### 3.1 דפי ציבור: קריאה ולמידה

| עמוד (שם) | תפקיד | פעולות מרכזיות |
|---|---|---|
| **Home** | דף הבית: Hero, "דבר היום" (`DevotionalFeatured`), רשת כרטיסים לכל האזורים, פסוק היום, מדדי קהילה | שיתוף דבר היום (ShareSheet), מעבר לכל אזור; לאורחים: באנר התחברות/הרשמה |
| **BibleReader** | בחירת ספר ופרק. שני טאבים: "ברית ישנה" / "ברית חדשה" | חיפוש ספר (שם באנגלית/לוגנדה/קיצור); לחיצה על ספר פותחת `ChapterSelector`; סימון ספרים שמורדים אופליין |
| **Chapter** | קריאת פרק מלא (העמוד המרכזי של האפליקציה) | בחירת גרסה (`VersionPicker`), שפה EN/LU/BOTH, קליק על פסוק → `VerseActionBar`, לשוניות לימוד, הדגשה/סימניה/הערה, תפילה לפרק, פירוש, הפניות צולבות, סגירת פרק בתפילה, שיתוף, השמעת שיר |
| **BibleNotes** | "ההערות שלי": הדגשות, סימניות והערות (StudyMark) | צפייה ברשימה, קישור חזרה לפסוק |
| **Plan** | תוכנית קריאה של 30 יום (ברירת מחדל: יוחנן 1 - 21 ותהילים) | מציג יום נוכחי, סטטוס (הושלם/נוכחי/עתידי), קישור לפרק |
| **Journal** | יומן תפילה אישי (שבח, בקשה, וידוי, הודיה, הרהור) | יצירה, עריכה, מחיקה (עם `ConfirmDialog`), סינון לפי קטגוריה, שיוך לספר/פרק, הפניה מ-`?new=1&book=&chapter=` |
| **Offline** | מרכז הורדה: הורדת פרקים, פסוקים, מילוני Strong, דבר יום, פירושים, תפילות, Q&A | בחירת תרגום, הורדה לפי חלקים, מחיקה, הצגת נפח אחסון |
| **Dashboard** | סיכום אישי: רצף קריאה, ספרים שנקראו, הדגשות, תפילות שנשמרו, פעילות אחרונה (`ActivityFeed`) | מדדי אופליין (`offlineCounts`), קישורים לדפים |
| **InstallPrompt** | הוראות התקנה כ-PWA (iOS / Android / Desktop) | כפתור התקנה כשהדפדפן תומך (`beforeinstallprompt`) |

### 3.2 דפי תוכן רוחני

| עמוד | תפקיד | פעולות |
|---|---|---|
| **Devotionals** | ספרייה של דבריי יום. ברירת מחדל: "היום" ו-12 לכל עמוד | חיפוש, סינון לפי שפה (EN/LU/BOTH), נושא, טווח זמן (היום/שבוע/חודש/הכל), סדרה; פתיחה במלואו (`DevotionalFullView`), ניווט קודם/הבא, שמירה, סימון כ"נקרא", שיתוף |
| **PrayerLibrary** | ספריית תפילות לפי קטגוריה ושפה | חיפוש, סינון קטגוריה, שמירה למועדפים (PrayerSaved), שיתוף, קישור ל-passage |
| **VerseSongs** | ספריית שירים מבוססי פסוקים | חיפוש, סינון סדרה וספר, השמעה בתור (queue), הורדה בתשלום ($2), שיתוף (`SongShareSheet`) |
| **VerseSongSeries** | דף סדרה בודדת (`?series=<id>`) | כמו VerseSongs, מסונן לסדרה |
| **VerseOfDay** | פסוק היום מתוך `VerseOfDay` | שיתוף |
| **QA** | שאלות ותשובות דו-לשוניות | שפה, נושא, חיפוש, **A - Z letter bar**, פתיחה/סגירה של תשובה, הצבעה "מועיל"/לא, העתקה, שיתוף, קישורים לפסוקים |
| **TheologicalInsights** / **HistoricalInsights** | תובנות (`InsightsBoard kind=...`) | חיפוש, שמירה ב-localStorage, שיתוף |

### 3.3 דפי קהילה

| עמוד | תפקיד | פעולות |
|---|---|---|
| **Community** | שער הקהילה: שלוש "תחנות" (התגלויות, שיעור חי, קבוצות) + הפוסטים האחרונים | ניווט לתת-דפים |
| **CommunityRevelations** | "מה אלוהים הראה לך": פוסטים עם כותרת, מקור, גוף | פרסום (מחובר בלבד), לייק (`likeRevelation`), תגובות (`submitComment`) |
| **CommunityLiveTeaching** | רשימת שיעורים חיים עם תאריך, מארח, קישור הצטרפות | צפייה בלבד |
| **DiscussionGroups** | קבוצות לימוד קבועות עם הודעות | הצטרפות (נשמר ב-localStorage), פתיחת שרשור, שליחת הודעה (מחובר) |

### 3.4 דפי חשבון ומידע

| עמוד | תפקיד |
|---|---|
| **Login** / **Signup** / **ForgotPassword** / **ResetPassword** | אימות דרך `fse2.auth`. תמיכה ב-`?next=` להחזרה לדף הקודם |
| **Logout** | מנתק אחרי 900 מ"ש ומפנה לדף הבית |
| **About**, **Contact**, **Privacy**, **Terms** | תוכן סטטי; Contact שומר ב-`ContactMessage` |

### 3.5 דפי ניהול

| עמוד | תפקיד |
|---|---|
| **Admin** | כניסה לניהול (אימייל וסיסמה). יש גם "שחזור סיסמה" עם מפתח איפוס |
| **AdminDashboard** | ממשק הניהול הראשי עם תפריט צד וסקשנים (ראה סעיף 8) |

---

## 4. מפת ניווט (לצרכי DEBUG)

### 4.1 ניווט ראשי (AppHeader)

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| לקרוא תנ"ך | כל דף | "Bible Reader" בתפריט | `BibleReader` |
| לפתוח פרק | `BibleReader` | לחיצה על ספר → לחיצה על מספר פרק | `Chapter?book=N&chapter=M` |
| לפתוח פסוק ספציפי | קישור מ-QA, תפילה, פירוש | לינק עם `&verse=V` | `Chapter` גולל לפסוק |
| לשנות שפה בפרק | `Chapter` | כפתורי EN/LU/BOTH | שינוי סטייט, `?lang=lu` |
| לשנות תרגום | `Chapter` | `VersionPicker` | `setActiveVersionId` + טעינה מחדש |
| לקרוא פירוש לפרק | `Chapter` | טאב "Commentary" ב-`ChapterReaderPane` | `ChapterSidebar` |
| לקרוא תפילה לפרק | `Chapter` | טאב "Prayer" | `PassagePrayer` |
| לפתוח הפניה צולבת | `VerseCrossRefs` | לחיצה על הפניה | `VersePopup` או ניווט לפרק |
| לראות מילון Strong | פסוק עם קוד כחול (G/H####) | לחיצה על הקוד | `StrongsPopup` |
| להדגיש פסוק | `VerseActionBar` | "Highlight" + צבע | `saveAnnotation` / `StudyMark` |
| לשמור סימנייה | `VerseActionBar` | "Bookmark" | `StudyMark(mark_type=bookmark)` |
| להוסיף הערה | `VerseActionBar` | "Note" → טקסט → שמור | `StudyMark(mark_type=note)` |
| לשתף פסוק | `VerseActionBar` | "Share" | `ShareSheet` |
| להוריד פרק לאופליין | `Offline` | כפתור "הורד" | `offline.put("chapters")` |
| להוסיף שיר להשמעה | `VerseSongs` | "Play" | `usePlayer().playQueue` |
| לרכוש הורדת שיר | `VerseSongs` | "Buy to Download $2" | פותח Pesapal, שומר `pending_verse_song_purchase` |
| לשמור תפילה | `PrayerLibrary` | כפתור סימנייה | `PrayerSaved` |
| לסמן דבר יום כנקרא | `DevotionalFullView` | "Mark as read" | `DevotionalProgress` + localStorage |
| לשמור דבר יום | `DevotionalFullView` | "Save" | `DevotionalSaved` + localStorage |
| לשלוח התגלות | `CommunityRevelations` | טופס "Share what God showed you" | `submitRevelation` (מחובר) |
| להצטרף לקבוצה | `DiscussionGroups` | "Join" | localStorage `joinedGroups` |
| לכתוב ביומן | `Journal` | "+ New entry" | `JournalEntry.create` |
| לשלוח הודעה לצור קשר | `Contact` | טופס | `ContactMessage.create` |
| להתחבר לניהול | `Admin` | טופס | `adminSignIn` |
| לשנות צבעי אתר | `AdminDashboard` | סקשן Theme (Palette) | `SiteSettings` |

### 4.2 מסלולי ניהול (Admin)

| פעולה | נקודת כניסה | כפתור | יעד |
|---|---|---|---|
| להתקין לוגנדה | `AdminDashboard` → "Luganda Bible" | "Install" | `lugandaInstall` (פונקציה) → `LugandaChapter` |
| להתקין KJV+ | `AdminDashboard` → "KJV+ with Strong's" | "Install" | `kjvInstall` → `KjvPlusChapter` |
| לבדוק כיסוי תרגום | `LibraryReport` (בתוך Installer) | "Run report" | `scriptureAudit` (read-only) |
| להוסיף דבר יום | `DevotionalsPanel` → Devotionals | "+ Add" | `DevotionalForm` → `Devotional.create` |
| לייבא דברי יום בכמות | `DevotionalsPanel` → Bulk upload | העלאת JSON | `DevotionalBulkImport` |
| להוסיף נושא דבר יום | `DevotionalsPanel` → Topics | "+ Add" | `DevotionalTopicsPanel` |
| לייבא תפילות ו-Cross-refs | `PrayerCrossRefImport` | העלאת JSON של ספר | `prayerImport.js` → `PrayerPassage`, `CrossReference`, `ChapterIntro`, `BookIntro` |
| לערוך תפילות | `PrayersPanel` | "+ Add" / עריכה | `RecordEditor` |
| לערוך כל collection | `CollectionsPanel` | בחירת collection → עריכה | `RecordEditor` (שדות מ-`adminCollections.js`) |
| לנהל שאלות ונושאים | `QaPanel` | טאבים Questions/Topics | `QaQuestionsPanel`, `QaTopicsPanel` |
| לייבא שאלות בכמות | `QaPanel` → Bulk upload | העלאת JSON | `QaBulkImport` (format `pray-read-qa-v1`) |
| לנהל שירים | `VerseSongsPanel` | "+ Add song" / "+ Create series" | `VerseSongForm`, `VerseSongSeriesForm` |
| לייבא שירים בכמות | `VerseSongsPanel` → Bulk upload | העלאת JSON | `VerseSongBulkImport` (format `pray-read-verse-songs-v1`) |
| לערוך פרשות | `PassagesPanel` | טאב | `RecordEditor` עבור `PrayerPassage`, `CrossReference`, `ChapterIntro`, `BookIntro` |

---

## 5. מבנה קבצים

### 5.1 `pages/`

| קובץ | מרנדר | הערות |
|---|---|---|
| `Home.jsx` | עמוד הבית | משתמש ב-`DevotionalFeatured`, `ShareSheet` |
| `BibleReader.jsx` | רשימת ספרים + `ChapterSelector` | שומר סט של ספרים שהורדו |
| `Chapter.jsx` | קריאת פרק | **הקובץ הגדול ביותר בקריאה**: טוען פסוקים, הדגשות, פירושים, הפניות, Strong |
| `Devotionals.jsx` | ספריית דבריי יום | לוגיקת מסננים, pagination, שיתוף |
| `QA.jsx` | שאלות ותשובות | מסננים ב-URL (`?lang=&topic=&letter=&search=`) |
| `VerseSongs.jsx` / `VerseSongSeries.jsx` | שירים | לוגיקת רכישה ב-localStorage |
| `Admin.jsx` / `AdminDashboard.jsx` | כניסה וניהול | ראה סעיף 8 |
| `Dashboard.jsx` | סיכום אישי | מייבא את `Home` כחלק מהתצוגה |
| שאר הדפים | ראה סעיף 3 | |

### 5.2 `components/`

| תיקייה | תפקיד | רכיבים עיקריים |
|---|---|---|
| `admin/` | ממשק הניהול | `DevotionalsPanel`, `DevotionalForm`, `DevotionalBulkImport`, `PrayersPanel`, `PrayerCrossRefImport`, `QaPanel`, `QaAdminList`, `QaItemForm`, `VerseSongsPanel`, `VerseSongForm`, `LugandaInstaller`, `KjvPlusInstaller`, `LibraryReport`, `ChapterCoverage`, `CollectionsPanel`, `RecordEditor`, `ConfirmDialog`, `CrossRefEditor`, `JsonImportPanel` |
| `read/` | קריאת המקרא | `Chapter` מרכיב: `ChapterReaderPane`, `VerseList`, `VerseActionBar`, `VerseCrossRefs`, `CrossRefList`, `CrossRefScripture`, `PassagePrayer`, `PassageTabs`, `ChapterSidebar`, `ChapterResourcesPanel`, `ChapterClosingPrayer`, `VersePopup`, `FloatingVerse`, `StrongsPopup`, `StrongsText`, `AnnotatedText`, `ShareSheet`, `VersionPicker`, `BookGrid`, `ChapterGrid`, `BookSidebar`, `BookIntro`, `BookOutline`, `BookPrayerPanel`, `BookStudyResources`, `ChapterSelector` |
| `devotional/` | דבריי יום | `DevotionalCard`, `DevotionalFeatured`, `DevotionalFullView`, `DevotionalFilters` |
| `qa/` | Q&A | `QaCard`, `QaFilters`, `QaLetterBar` |
| `song/` | שירים | `SongCard`, `SeriesCard`, `SongFilters`, `SongShareSheet` |
| `community/` | קהילה | `RevelationCard`, `RevelationForm`, `CommentThread`, `ThreadMessages` |
| `layout/` | מעטפת | `AppHeader`, `AppFooter`, `GlobalPlayer`, `PwaHead`, `ScrollToTop` |
| `common/` | כלליות | `Modal`, `EmptyState`, `Pagination`, `ShareRow`, `Spinner`, `PageHeader`, `BrandIcons` |
| `home/`, `dashboard/`, `journal/`, `plan/`, `insight/` | רכיבי תצוגה לאזורים | `StatCard`, `ActivityFeed`, `JournalCard`, `JournalForm`, `PlanRow`, `InsightsBoard` |

### 5.3 `lib/` (לוגיקה ושירותים)

| קובץ | תפקיד |
|---|---|
| `adminSession.js` | ניהול סשן ניהול: טוקן ב-localStorage, שני מצבי הפעלה (שרת / דפדפן), keep-alive |
| `adminDirect.js` | מראה בדפדפן של פעולות ה-admin (`adminContent.js`). כולל SHA-256 ב-JS |
| `adminCollections.js` | הגדרת כל ה-collections שהפאנל יודע לנהל, עם שדות `[name, label, type]` |
| `contentApi.js` | קריאה ציבורית של collections עם נפילה ל-seed; שליחת תוכן ציבורי (Contact, Comments) |
| `bibleApi.js` | טעינת פרק: אופליין → entity → רשת; מסווג מקורות |
| `bibleBooks.js` | 66 הספרים: שם EN/LU, קיצורים, מספר פרקים, ברית |
| `bookGuides.js`, `bookPrayers.js`, `bookStudyContent.js`, `keyPassages.js`, `chapterStudy.js` | תוכן לימוד סטטי לכל ספר ולכל פרק |
| `chapterIntros.js`, `bookIntro.js`, `prayerPassages.js` | נורמליזציה וטעינה של תוכן מיובא |
| `prayerImport.js`, `bookImport.js` | ולידציה ופיענוח של קבצי JSON מיובאים; מפתח טבעי לכל רשומה |
| `scriptureRefs.js` | פענוח הפניות ("John 3:16", "Psalm 23:1-3") ויצירת קישורים לפרק |
| `strongs.js`, `strongsOffline.js` | נירמול קודי Strong (H0436 = H436), שמירה אופליין |
| `offlineDb.js` | מעטפת IndexedDB (גרסה 9), חנויות: chapters, verses, devotionals, commentary, prayers, prayerPassages, crossReferences, chapterIntros, strongs, qaItems, ... |
| `studyAnnotations.js` | הדגשות ופסים על מקטעי לימוד; כתיבה כפולה: שרת + אופליין |
| `devotionals.js` | מודל דבר יום, פורמט, `visibleDevotionals` (לפי תאריך), `pickDailyDevotional` |
| `useDevotionalLibrary.js` | Hook לשמור/לסמן כנקרא (localStorage + שרת למחובר) |
| `qaLibrary.js` | טעינה, מיון, סינון, `letterOf` (האות נגזרת מהשאלה ולא נשמרת) |
| `player.jsx` | `PlayerProvider`  -  `Audio` יחיד גלובלי, queue, repeat, shuffle, speed |
| `verseSongs.js` | נורמליזציה של סדרות ושירים, בניית תור, שיתוף |
| `versions.js` | רשימת תרגומים (KJV, KJV+, WEB, לוגנדה ...) ובחירה פעילה |
| `share.js` | בניית טקסט שיתוף וערוצים (WhatsApp, Facebook, X, Telegram, Email, העתקה) |
| `theme.js`, `themeContext.jsx`, `brandCss.js` | צבעי המותג, Context לערכות, CSS גלובלי |
| `AuthContext.jsx` | Context של משתמש מחובר (`fse2.auth.me`) |
| `app-params.js` | קריאת טוקן האפליקציה מ-localStorage (`fse2_app_token_<appId>`) |
| `sha256.js` | SHA-256 טהור ב-JS (עבור סביבות שאין בהן WebCrypto) |
| `seedContent.js` | תוכן ברירת מחדל: DEVOTIONALS, PRAYERS, INSIGHTS, QA, COMMUNITY_POSTS, ... |
| `planData.js` | 30 יום של תוכנית הקריאה (ברירת מחדל) |
| `readings.js`, `reading.js` | סימון קריאה, חישוב רצף, פורמט תאריכים (`toISODate`) |
| `format.js`, `textSelection.js`, `luganda.js`, `bilingual.js` | כלי עזר |

### 5.4 `functions/` (Backend)

| קובץ | תפקיד |
|---|---|
| `adminAuth.js` | התחברות מנהל, סיסמה מלוחה (SHA-256 + salt), חתימת סשן (HMAC), שחזור סיסמה |
| `adminContent.js` | API של הניהול: list/create/update/delete לכל ה-collections |
| `bibleChapter.js` | מביא פרק מ-bible-api.com (EN) או wordplanet (LU); fallback |
| `content.js` | API ציבורי: קריאת תוכן, שליחת פניות, תגובות |
| `kjvInstall.js` | מוריד ומתקין פרקי KJV עם Strong, פרק-פרק, idempotent |
| `lugandaInstall.js` | מוריד ומתקין פרקי לוגנדה, פרק-פרק |
| `scriptureAudit.js` | דוח קריאה בלבד: כמה פרקים מותקנים לכל תרגום, פערים, חוסר התאמה במספר פסוקים |
| `strongsDefinition.js` | מילון Strong: מטמון מ-openscriptures, fallback ל-Blue Letter Bible |
| `cron/scriptureInstall.js` | Cron **כל שעה**: מתקין פרקים חסרים של לוגנדה ו-KJV+, ועוצר כשאין התקדמות |

### 5.5 `entities/` (סכמת נתונים)

ראה סעיף 6.

### 5.6 `__trash/`

תיקייה שמכילה **קבצי בדיקה וכלי דיבאג זמניים** (`_hashTool.js`, `_hashcheck.js`, `tmpSessionProbe.js`, `AdminDiag.jsx`, ...). **מומלץ למחוק אותה מהקוד הפעיל.** חלק מהקבצים מכילים ערכי סיסמה/האש בגלוי (ראה סעיף 11).

---

## 6. מודל הנתונים (Entities)

### 6.1 תוכן מקרא

| Entity | תכלית | שדות מרכזיים |
|---|---|---|
| `BibleVerse` | פסוק בודד (שימוש היסטורי/מצומצם) | `book_number`, `chapter`, `verse`, `text_en`, `text_lu` |
| `LugandaChapter` | פרק שלם בלוגנדה (מותקן) | `book_number`, `chapter`, `verse_count`, `verses` (JSON מחרוזת) |
| `KjvPlusChapter` | פרק KJV עם קודי Strong (מותקן) | כמו לעיל |
| `StrongEntry` | הגדרה של מספר Strong | `code`, `language`, `original_word`, `transliteration`, `definition` |
| `ChapterIntro` | הקדמת פרק (EN/LU) | `book_number`, `chapter`, `title_*`, `intro_*` |
| `BookIntro` | הקדמת ספר + תפילת סיום | `book_number`, `intro_*`, `closing_prayer_*` |
| `PrayerPassage` | תפילה למקטע (פרק / טווח פסוקים / פסוק) | `book_number`, `chapter`, `verse` (0 = כל הפרק), `verse_end`, `prayer_*` |
| `CrossReference` | הפניה צולבת מפסוק למקור | `book_number`, `chapter`, `verse`, `ref_book_number`, `ref_chapter`, `ref_verse`, `ref_verse_end`, `ref_text_*`, `note_*` |
| `Commentary` | הערת פרשנות לפרק | `book`, `chapter`, `title`, `body_en`, `body_lu` |
| `Insight` | תובנה תיאולוגית/היסטורית | `kind` (theological / historical), `title`, `passage`, `body` |

### 6.2 תפילות ודברי יום

| Entity | תכלית | שדות מרכזיים |
|---|---|---|
| `Prayer` | ספריית תפילות | `title`, `title_lu`, `category`, `body_en`, `body_lu`, `scripture_ref`, `cross_refs` |
| `PrayerSaved` | תפילה שנשמרה למשתמש | `owner_email`, `prayer_title` |
| `Devotional` | דבר יום | `code`, `title_en/lu`, `scripture_ref`, `verse_en/lu`, `body_en/lu`, `prayer_en/lu`, `topic`, `series`, `date`, `cover_url`, `featured`, `active` |
| `DevotionalTopic` | נושא של דבר יום | `name_en`, `name_lu`, `active` |
| `DevotionalPlan` | תוכנית של דבריי יום (למשל 21 יום) | `name_en`, `description`, `days` |
| `DevotionalSaved` | דבר יום שנשמר | `owner_email`, `devotional_code` |
| `DevotionalProgress` | דבר יום שסומן כנקרא | `owner_email`, `devotional_code`, `completed_date` |
| `VerseOfDay` | פסוק היום לתאריך | `verse_date`, `reference`, `text_en`, `text_lu`, `note` |

### 6.3 שאלות ותשובות

| Entity | תכלית | שדות |
|---|---|---|
| `QATopic` | נושא | `name_en`, `name_lu`, `description_*`, `active` |
| `QAItem` | שאלה ותשובה | `topic_en`, `topic_lu`, `scripture_ref`, `question_en/lu`, `answer_en/lu`, `tags`, `featured`, `active` |
| `QAEntry` | (ישן) שאלה שהגיש קורא | `question`, `answer`, `status`, `author_email` |

### 6.4 קריאה, לימוד וחשבון

| Entity | תכלית | שדות |
|---|---|---|
| `Reading` | פרק שהושלם, עם הרהור ותפילה | `owner_email`, `book`, `chapter`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses` |
| `ReadingPlan` | 30 יום של תוכנית הקריאה | `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture` |
| `ReadingActivity` | לוג פעולות קורא | `owner_email`, `activity_type`, `book`, `chapter`, `verse` |
| `StudyMark` | הדגשה, סימנייה או הערה על פסוק | `owner_email`, `mark_type` (highlight/bookmark/note), `book_number`, `chapter`, `verse`, `color`, `note_text` |
| `StudyAnnotation` | הדגשה/קו על מקטע לימוד (הקדמה, תפילה, פסוק בסיידבר) | `owner_email`, `book_number`, `section`, `block_id`, `kind`, `start_offset`, `end_offset`, `color` |
| `JournalEntry` | יומן תפילה | `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood` |

### 6.5 קהילה, שירים, מערכת

| Entity | תכלית |
|---|---|
| `Revelation` | התגלות וגם תגובות (`parent_id`), `likes` |
| `DiscussionGroup` / `DiscussionThread` | קבוצות דיון והודעות |
| `LiveSession` | שיעורים חיים |
| `VerseSongSeries` | סדרת שירים (`name`, `display_order`, `thumbnail`, `featured`, `active`) |
| `VerseSongEpisode` | שיר בודד בתוך סדרה (`series_name`, `title`, `audio_url`, `duration_seconds`, `episode_order`, `plays_count`, `active`) |
| `ContactMessage` | פנייה מטופס יצירת קשר |
| `SiteSettings` | הגדרות אתר (`setting_key` / `setting_value`) |
| `AdminAccount` | חשבון מנהל: `email`, `password_hash`, `salt`, `secret`, `session_version` |
| `ActivityLog` | לוג פעולות בניהול |

### 6.6 קשרים (לוגיים, לא מוגדרים כ-FK)

```
BibleVerse / LugandaChapter / KjvPlusChapter  ←  book_number + chapter
PrayerPassage / CrossReference / ChapterIntro ←  book_number + chapter (+ verse)
CrossReference.ref_*                           →  מצביע לפסוק אחר
StudyMark / StudyAnnotation                    ←  owner_email (+ book_number, chapter, verse)
Devotional.topic                               →  DevotionalTopic.name_en
Devotional.series                              →  DevotionalPlan.name_en
QAItem.topic_en                                →  QATopic.name_en
VerseSongEpisode.series_name                   →  VerseSongSeries.name
DevotionalProgress/Saved.devotional_code       →  Devotional.code
```

> **שים לב:** הקישורים הם לפי **שם** (למשל `topic_en`) ולא לפי ID. שינוי שם של topic שובר את הקישור. זה מוזכר ב-`QaTopicsPanel` שמעביר שאלות לפני מחיקה, אבל לא בכל המקומות.

### 6.7 כללי גישה (`x-fse2-access`)

| Entity | קריאה | כתיבה |
|---|---|---|
| תוכן ציבורי (Devotional, Prayer, QAItem, BibleVerse, ...) | `*` (כולם) | `owner`, `admin` |
| נתוני משתמש (StudyMark, JournalEntry, Reading, ...) | בעלים + `admin` + `user` | בעלים + `admin` + `user` |
| `AdminAccount`, `ActivityLog` | `owner`, `admin` בלבד | `owner`, `admin` בלבד |
| `ContactMessage` | כתיבה לכולם (`*`) | קריאה/עדכון/מחיקה ל-`owner`, `admin` |

> **שים לב:** בהרבה entities של משתמש הכלל הוא `roles: ["owner","admin","user","authenticated"]`. אין סינון מפורש לפי `owner_email` ברמת הכלל. הפילטר נעשה בקוד (`row.owner_email === email`). כלומר ההגנה בפועל תלויה בקוד הלקוח, לא במדיניות השרת. ראה סעיף 11.

---

## 7. תהליכים ואינטראקציות מרכזיות

### 7.1 קריאת פרק (Flow מקצה לקצה)

```
1. משתמש ב-BibleReader לוחץ על ספר
   └ setBook → מציג ChapterSelector (סיידבר + רשת פרקים)
2. לחיצה על פרק → Link ל-/Chapter?book=N&chapter=M
3. Chapter.jsx:
   a. קורא את URL params (book, chapter, verse, lang)
   b. fetchChapter(...)
        ├ בודק IndexedDB (chapterKey) → אם קיים, מחזיר
        ├ אחרת: entity (LugandaChapter / KjvPlusChapter) → אם קיים, מחזיר
        └ אחרת: רשת (bible-api.com / wordplanet) → מחזיר
   c. טוען במקביל: prayerPassages, crossReferences, chapterIntros, annotations (שרת + אופליין)
   d. מסמן ReadingActivity (chapter_visit) ו-Reading (אם מחובר)
   e. מציג פסוקים; קודי Strong → StrongsText מוציא ל-span כחול
4. משתמש לוחץ על פסוק → VerseActionBar נפתח מתחתיו
5. בוחר פעולה:
   - הדגשה → saveAnnotation (שרת + IndexedDB)
   - הפניה צולבת → VerseCrossRefs (לוגיקה: פסוק ואם אין, פסוקי הפרק)
   - פירוש → ChapterSidebar
   - שיתוף → ShareSheet (טקסט + קישור)
```

### 7.2 דבר היום

```
1. Home / Devotionals טוענים fetchPublicCollection("devotionals")
2. visibleDevotionals(rows, today) → רק active=true ו-date <= היום
3. pickDailyDevotional(...) בוחר דבר יום קבוע לפי היום (rememberDaily שומר בחירה)
4. DevotionalFeatured מציג את הקוד היומי
5. פתיחה → DevotionalFullView (נתיב ישיר או מתוך הרשימה)
6. "Save" → DevotionalSaved (אם מחובר) + localStorage
7. "Mark as read" → DevotionalProgress + localStorage
```

### 7.3 שיר וקנייה

```
1. VerseSongs/VerseSongSeries טוענים series + episodes
2. buildSongIndex, buildQueue → תור לנגן
3. Play → usePlayer().playQueue(queue, index) → Audio.src = audio_url
4. "Buy to download $2" →
     - נשמר pending_verse_song_purchase ב-localStorage
     - נפתח PESAPAL_URL בטאב חדש
     - כשחוזרים: בודקים paymentOpened → מציגים "downloadSong"
     - מוסיפים ל-purchased_verse_songs (localStorage)
```

> **שים לב:** רכישה מאושרת **רק מקומית**. אין אימות תשלום בשרת. ראה סעיף 11.

### 7.4 ניהול: התקנת תרגום KJV+ (מלא, עם Cron)

```
1. מנהל לוחץ "Install" ב-KjvPlusInstaller
2. call("kjvInstall", { action: "status" }) → מחזיר כמה פרקים קיימים
3. מתחיל round: ensureFreshAdminToken() → call("kjvInstall", { action: "install", batch })
4. השרת מוריד פרקים, כותב KjvPlusChapter (idempotent: מדלג על קיימים)
5. מחזיר progress → UI מעדכן ChapterCoverage (עם compressChapters: "2-5, 9, 12")
6. חוזר עד שאין עוד חסרים או שאין התקדמות
7. במקביל, cron/scriptureInstall.js רץ כל שעה ומשלים את הפערים
```

### 7.5 ייבוא JSON בכמות (תפילות וכתובים)

```
1. מנהל מעלה קובץ JSON ב-PrayerCrossRefImport
2. prepareImport(file) → validatePrayerFile → שגיאות לפי מספר שורה
3. ייבוא נעשה לפי natural key:
     - PrayerPassage: book_number + chapter + verse + verse_end
     - CrossReference: book + chapter + verse + ref_*
     - ChapterIntro: book + chapter
     - BookIntro: book_number
4. אם הרשומה קיימת → update; אחרת → create (לכן אפשר לייבא שוב בבטחה)
5. דוח: נוצרו X, עודכנו Y, נכשלו Z (עם סיבה)
```

---

## 8. מערכת הניהול (Admin)

### 8.1 כניסה וסשן

| שלב | קובץ | מה קורה |
|---|---|---|
| טופס כניסה | `pages/Admin.jsx` | `adminSignIn(email, password)` |
| ניסיון שרת | `lib/adminSession.js` → `functions/adminAuth.js` | מחזיר טוקן חתום (HMAC) |
| ניסיון דפדפן (fallback) | `lib/adminDirect.js` | קורא `AdminAccount`, מחשב SHA-256(salt:password), משווה |
| שמירה | localStorage `pr_admin_token`, `pr_admin_mode` | |
| הארכה | `renewAdminSession`, `startAdminKeepAlive` | הסשן "מתגלגל" בכל שימוש |
| יציאה | `adminSignOut` / `adminRevokeSession` | |

### 8.2 סקשנים בלוח הניהול (AdminDashboard)

הרשימה מלאה לפי הקוד הגלוי:

| מזהה | תווית | רכיב |
|---|---|---|
| `overview` | Dashboard | סטטיסטיקות ו-ActivityLog |
| `books` | Books & Chapters | `PassagesPanel` / `ChapterCoverage` |
| `luganda` | Luganda Bible | `LugandaInstaller` |
| `kjvplus` | KJV+ with Strong's | `KjvPlusInstaller` |
| `devotionals` | Devotionals | `DevotionalsPanel` |
| שאר הסקשנים | (תפילה, שאלות, שירים, תובנות, הגדרות ועוד) | `PrayersPanel`, `QaPanel`, `VerseSongsPanel`, `CollectionsPanel`, `JsonImportPanel`, ... |

> סקשנים נוספים (Prayers, Q&A, Verse-Songs, Insights, Theme, Contact messages, Activity log, Settings) מופיעים לפי האייקונים שבקוד. שמות תוויות מדויקים דורשים את הקובץ המלא.

### 8.3 מודל ה-"Collection" הגנרי

`lib/adminCollections.js` מגדיר כל collection כאובייקט:

```js
{
  id: "Prayer",
  label: "Prayer library",
  fields: [
    ["title", "Title", "text"],
    ["body_en", "Prayer (EN)", "textarea"],
    ["cross_refs", "Cross references", "refs"],
    ["featured", "Featured", "boolean"],
    ...
  ]
}
```

ה-`RecordEditor` בונה טופס אוטומטית מהשדות. **להוספת שדה חדש** למערכת הניהול מספיק להוסיף שורה ב-`fields` (אם ה-entity כבר מכיר את השדה).

---

## 9. Backend Functions ו-Cron

| פונקציה | קלט | פלט | אבטחה |
|---|---|---|---|
| `adminAuth` | action (signIn, verify, changePassword, reset) | token | סיסמה במלח, חתימת HMAC |
| `adminContent` | action (list, create, update, delete), entity, payload | rows / record | דורש טוקן מנהל |
| `lugandaInstall` | action (status, install, batch) | progress | טוקן מנהל **או** `INSTALL_KEY` מהסביבה |
| `kjvInstall` | כמו לעיל | | כמו לעיל |
| `scriptureAudit` | action: "status" | דוח | קריאה בלבד |
| `strongsDefinition` | code | הגדרה | פתוח לכולם (קריאה/כתיבה למטמון) |
| `bibleChapter` | book, chapter, translation | verses | פתוח |
| `content` | type, ... | rows / ok | ציבורי, שולח פניות |
| `cron/scriptureInstall` | ללא | | מתוזמן: `every_hours = 1` |

**Cron:** רץ כל שעה. מחשב אילו פרקים חסרים (לפי `LugandaChapter` ו-`KjvPlusChapter`), מוריד אותם בקבוצות, ועוצר כשאין התקדמות בריצה (כדי לא להעמיס על המקור).

---

## 10. הערות טכניות לפיתוח

### 10.1 דפוסים חוזרים

| דפוס | איפה | למה |
|---|---|---|
| `const rowsOf = (answer) => Array.isArray(answer) ? answer : answer?.rows ?? []` | ב-admin ו-QA | התשובות של השרת לא אחידות (מערך או `{rows}`) |
| `safeText(value)` | `lib/format.js` | מונע הדפסה של אובייקטים מהמסד |
| `fieldOf(row, "title_en")` | `lib/devotionals.js` | תאימות לאחור: רשומות ישנות עם שמות שדות אחרים |
| `bilingualText(value)` | `lib/bilingual.js` | מטפל בצורות שונות של טקסט דו-לשוני |
| `natural key` | `prayerPassages`, `crossRefNaturalKey` | ייבוא idempotent |
| `try/catch` שקט ב-storeEntry | `StrongsPopup` | אל תשבור את הקורא בגלל מטמון |
| `useQuery({ queryKey: [...] })` | כל הדפים | cache לפי מפתח |
| seed fallback | `contentApi` | אף מסך לא ריק |

### 10.2 דברים שחשוב לדעת לפני שינוי

1. **שמות שדות בעברית/אנגלית מעורבבים.** הנתונים הישנים משתמשים ב-`title`, `body`, `scripture` והחדשים ב-`title_en`, `body_en`, `scripture_ref`. תמיד השתמש ב-`fieldOf()` / `bilingualText()`.
2. **לוגנדה מול אנגלית:** שדות כמו `_en`/`_lu` לכל טקסט מיועד לקורא. השמטת צד אחד מציגה fallback לשפה השנייה, ולא שגיאה.
3. **`BibleVerse` מול `LugandaChapter`:** הראשון לא בשימוש עיקרי בקריאה. הפרקים השלמים נשמרים כ-JSON מחרוזת ב-`verses`. לשנות פסוק בודד = לערוך את כל הפרק.
4. **`book_number` (1 - 66)** הוא המפתח הטבעי של המקרא, לא שם הספר. שמות ספרים מתורגמים ומשתנים (למשל "Psalms" / "Zabbuli").
5. **localStorage ו-IndexedDB** מכילים מצב שאינו תלוי בשרת: הדגשות לאורחים, דבר יום שנשמר, רכישות. ניקוי הדפדפן מאפס אותם.
6. **אין Router מוגדר בקבצים שסופקו.** `createPageUrl` מניח מיפוי שם→נתיב. הוספת עמוד חדש דורשת קובץ ב-`pages/` ורישום במקום שאינו גלוי כאן.
7. **Service Worker (`sw.js`) מטמון גרסה** (`prayread-shell-v2`). לשנות את רשימת `SHELL` או לעשות שינויי מבנה: להעלות גרסה, אחרת משתמשים יראו קוד ישן.
8. **`Layout` מציג Footer רק ב-Home, QA ו-Devotionals.** זו החלטה מכוונת, לא באג.
9. **נגן שירים גלובלי:** `GlobalPlayer` מוסיף `pr-has-player` ל-body כדי לשמור מקום בתחתית. שינוי גובה הנגן דורש עדכון ה-CSS.
10. **צבעים:** שלושה עקרונות מותג קבועים (`ivory`, `emerald`, `gold`). `ThemeProvider` יכול לדרוס אותם מ-SiteSettings אבל ה-CSS מתבסס על `--pr-*`.

---

## 11. נקודות לתשומת לב ובעיות ידועות

> סעיף זה נכתב כדי לעזור לדיבאג ולאבטחה. לא כולם "באגים", חלקם חוב טכני או סיכון.

### 11.1 אבטחה (חשוב)

| # | ממצא | מיקום | סיכון | המלצה |
|---|------|-------|-------|--------|
| 1 | **סיסמת ברירת מחדל של המנהל קשיחה בקוד** (`PrayRead-Admin-2026`) ומפתחות שחזור (`PrayRead-Reset-Key-2026`) | `functions/adminAuth.js` | גבוה: כל מי שרואה את הקוד יכול להתחבר כמנהל, אם ה-secret לא הוגדר | להסיר ברירות מחדל, לחייב `ADMIN_INITIAL_PASSWORD` ו-`RESET_KEY` מהסביבה |
| 2 | **בדיקת סיסמה בדפדפן** (`adminDirect.js`), עם hash וסיסמה נשלחים ללקוח ואימות מקומי | `lib/adminDirect.js`, `lib/adminSession.js` | בינוני-גבוה: ה-hash של המנהל ניתן לקריאה ע"י הלקוח אם `AdminAccount` פתוח | לבטל את המסלול הדפדפני, או לכלול את `AdminAccount` רק לשרת |
| 3 | **טוקן מנהל ב-localStorage** | `pr_admin_token` | בינוני: כל XSS חושף את הסשן | להעביר לקוקי `HttpOnly` |
| 4 | **רכישת שירים רק בצד לקוח** (`purchased_verse_songs`) | `pages/VerseSongs.jsx` | גבוה כעסקי: אפשר לזייף רכישה | לאמת תשלום בשרת (webhook של Pesapal) לפני פתיחת הורדה |
| 5 | **הכללים ב-`x-fse2-access` מאפשרים `user` לעדכן כל רשומה** (למשל `StudyMark`, `JournalEntry`) והסינון לפי בעלים נעשה רק בקוד | `entities/*.json` | בינוני: הפרטיות תלויה בלקוח | להגביל ל-`owner_email` = המשתמש המחובר בכלל עצמו |
| 6 | **קבצי בדיקה עם ערכי hash וסיסמאות** ב-`__trash/` | `functions/_hashcheck.js`, `_digestCheck.js` | בינוני | למחוק את התיקייה לחלוטין |
| 7 | **`ContactMessage` ניתן ליצירה לכל `*`** | `entities/ContactMessage.json` | נמוך: ספאם | rate limit / CAPTCHA |

### 11.2 איכות קוד וחוב טכני

- **`ChapterCoverage.jsx`:** יש שורה שנחתכה (`rows.filter(...).leng`), נראה שהקובץ נקטע באמצע עריכה. לוודא שהוא מתקמפל.
- **שמות ישנים ב-entities:** `QAEntry` ו-`BibleVerse` כמעט לא בשימוש. לשקול הסרה.
- **כפילות בין `lib/adminDirect.js` ל-`functions/adminContent.js`:** אותה לוגיקה נכתבה פעמיים. כל שינוי ב-API צריך להתעדכן בשני המקומות.
- **`Chapter.jsx` ו-`ChapterSelector.jsx`** גדולים מאוד (מעל 500 שורות בכל אחד). כדאי לפרק לתת-רכיבים.
- **הרבה inline styles** בתוך JSX. עדיף להעביר ל-classes של `brandCss.js`.
- **`VerseSongBulkImport` ו-`VerseSongForm`** כתובים בפורמט דחוס (שורה אחת לכל פונקציה), קשה לקריאה ולתחזוקה.
- **`lib/share.js` מייבא `fetchPlainChapter` מ-`bibleApi`**, תלות הדדית אפשרית עם `bibleApi` אם יתווספו שיתופים.

### 11.3 דיבאג: סימפטומים נפוצים

| סימפטום | סיבה סבירה | איפה לבדוק |
|---|---|---|
| "הפרק לא נטען" | כל המקורות נכשלו, או פרק לא הותקן | `fetchChapter` ב-`bibleApi.js`, `scriptureAudit` |
| "הדגשה לא נשמרת" | אין התחברות, והמטמון המקומי נכשל | `studyAnnotations.saveAnnotation` |
| "דבר היום לא מופיע" | `date` בעתיד או `active=false` | `visibleDevotionals` ב-`content.js` ו-`devotionals.js` |
| "שיר לא מנגן" | `audio_url` לא `http(s)` או סיומת לא נתמכת | `isVisible`, `validMp3` |
| "ייבוא JSON נכשל בלי הודעה ברורה" | פורמט שגוי / שדה חסר | `prepareImport`, `validatePrayerFile` |
| "ניהול לא מתחבר" | ה-token פג, או מצב הדפדפן ("browser way") | `adminSession.js` (הדפסת `pr_admin_mode`) |
| "אופליין לא עובד אחרי עדכון" | גרסת IndexedDB או Service Worker ישנה | `offlineDb.js` (`DB_VERSION`), `sw.js` (`SHELL_CACHE`) |
| "כניסה ללא סיבה" ב-Admin | `adminSessionCheck` מחזיר `valid` | `pages/Admin.jsx` useEffect |

### 11.4 לפני שחרור (Checklist)

- [ ] הסרת `__trash/`
- [ ] העברת סיסמאות ומפתחות לסביבה בלבד
- [ ] אימות תשלום בשרת לשירים
- [ ] בדיקה ש-`ChapterCoverage.jsx` מתקמפל
- [ ] הרצת `scriptureAudit` ווידוא ש-1,189 הפרקים מותקנים
- [ ] גרסת `SHELL_CACHE` הועלתה אם שונה מבנה
- [ ] מדיניות `x-fse2-access` עברה בדיקת הרשאות ידנית לכל entity אישי

---

## נספח: מילון מונחים

| מונח | משמעות |
|---|---|
| **Seed content** | תוכן קבוע בקוד שמשמש כגיבוי |
| **Natural key** | מפתח לוגי (למשל book+chapter+verse) לזיהוי רשומה בייבוא |
| **Strong's number** | מספר מילון מקורי (G = יווני, H = עברי) |
| **Book intro / Chapter intro** | הקדמות לספר ולפרק, מיובאות או נבנות |
| **Prayer passage** | תפילה למקטע מסוים בפרק |
| **Cross-reference** | הפניה מפסוק לפסוק אחר |
| **Fse2** | פלטפורמת הבק-אנד שעליה האפליקציה רצה (entities, functions, auth, cron) |
| **PWA** | Progressive Web App: ניתנת להתקנה, עובדת אופליין חלקית |
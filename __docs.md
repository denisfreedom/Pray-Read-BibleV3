# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
# תיעוד מערכת Pray-Read Bible

## הערות מתודולוגיות

- שמות הנתיבים שלהלן הם הנתיבים הלוגיים שנוצרים באמצעות `createPageUrl(pageName)`. בפריסה תחת נתיב בסיס, יש להשתמש תמיד ב־`createPageUrl` ולא לבנות נתיבים ידנית.
- `Home` מוגש בדרך כלל משורש `/`.
- חלק מהקבצים שסופקו מקוצרים באמצע ההדפסה. התיעוד מבוסס על הקוד הזמין, הערותיו, שמות הייבוא, ה־imports וה־API calls. התנהגויות משניות שלא ניתן לאמת מסומנות כפערים מוסתרים.
- קבצים תחת `__trash/` הם קוד ארכיון שאינו מיובא על ידי האפליקציה הפעילה. קבצים תחת `__url_fetch/` הם צילומי מחקר ולא חלק מזמן הריצה.
- `__generated/tailwind.css` הוא קובץ מחושב; יש לעדכן את מקור ה־Tailwind ולא לערוך אותו ידנית.

---

# 1. מהות המערכת

## 1.1 תיאור כללי

**Pray-Read Bible** היא אפליקציית React לקריאת המקרא, מחקר ותפילה. המערכת משלבת בין:

- קריאת פרקים במקרא באנגלית ובלוגנדה.
- הערות, הדגשות, סימניות והערות אישיות.
- מבואות ספרים, מבואות פרקים, פירושים, תובנות תיאולוגיות והיסטוריות.
- תפילות לפי פסוק, לפי טווח פסוקים ולפי פרק.
- הפניות בין-פסוקיות.
- KJV עם קודי Strong’s ומילון מונחים.
- מדריכי קריאה, תוכנית קריאה, יומן תפילה ומעקב התקדמות.
- קהילה: חשיפות אמונה, שאלות ותשובות, הוראות חיות וקבוצות דיון.
- קבצי אודיו לשירי מקרא ונגן גלובלי.
- מרכז נתונים להורדה ושימוש ללא חיבור.
- ממשק ניהול תוכן וכלי התקנת תרגומים.

האפליקציה נועדה לקוראים שרוצים חוויית קריאה מדוקדקת ולא רק הצגת פסוק מבודד. כל פרק משמעותו כמסגרת תפילה, מחקר ושיקום, עם אפשרות לעבור בין מקורות ולשמור על התקדמות אישית.

## 1.2 קהל היעד

1. **קוראים מאמינים** שמבקשים לקרוא את המקרא בקצב אישי, להתעמק בפרק ולהפוך את הקריאה לתפילה.
2. **חוברי או קהילות קטנות** המשתמשים בחומרי הלימוד, התפילות וההפניות הבין-פסוקיות.
3. **קוראים דוברי לוגנדה** המבקשים ממשק ותוכן דומים בשפתם.
4. **משתמשים מחוברים** המשתמשים בהתקדמות, הערות, סימניות, יומן והשתתפות קהילתית.
5. **מנהלי תוכן** המעלים ספרים, מבואות, פירושים, תפילות, הפניות ותרגומים.
6. **מפעילי מערכת** המריצים התקנה שעתית של פרקים חסרים ומילון Strong’s.

## 1.3 הערך שהמערכת מספקת

- **קריאה ללא חיבור:** פרקים, תוכן ומילונים שהורדו נשארים זמינים בדפדפן.
- **שימור התקדמות אישית:** קריאות, התגלויות תפילה, הערות והשלמות נשמרים לפי חשבון.
- **חיבור בין סוגי תוכן:** פסוק יכול להוביל לפירוש, תפילה, משאלה, הפניה בין-פסוקית או פתיחת פרק אחר.
- **תוכן אמין עם fallback:** כאשר אין רשומה במסד הנתונים, המערכת מציגה תוכן מובנה מהקוד, כך שהמסך אינו נשאר ריק.
- **ניהול תוכן עקבי:** ייבוא חוזר עם אותו קובץ מעדכן רשומות קיימות במקום ליצור כפילויות.
- **גמישות תוכן:** מסד הנתונים, המסכים, תוכן seed והמערכת הקבצים מופרדים זה מזה.

## 1.4 עקרונות תוכן ושפות

- שמות השדות מסתיימים ב־`_en` וב־`_lu` עבור אנגלית ולוגנדה.
- במצבי תצוגה נתמכים `en`, `lu` ו־`both`.
- קוד הספר הוא מפתח יציב בן 1 - 66, על פי סדר המקרא הקנוני.
- פרק מזוהה לרוב על ידי הצירוף:
  - `book_number`
  - `chapter`
- פסוק מזוהה על ידי:
  - `book_number`
  - `chapter`
  - `verse`
- הפניה בין-פסוקית משתמשת בשני צירופים:
  - הפסוק המקור.
  - פסוק היעד.
- תוכן מיובא קודם משתלט על תוכן מובנה. לדוגמה:
  - `BookIntro` מחליף מבוא ספר מובנה.
  - `ChapterIntro` מחליף מבוא פרק מובנה.
  - תפילת פרק מיובאת מחליפה תפילה גנרטיבית.
  - תובנת פרק מיובאת מחליפה תובנת ספר.

## 1.5 ארכיטקטורה כוללת

```text
React SPA
├── React Router
├── TanStack Query
├── Context Providers
│   ├── AuthContext
│   ├── ThemeContext
│   └── PlayerContext
├── FSe2 SDK
│   ├── Authentication
│   ├── Entity CRUD
│   └── Serverless Functions
├── IndexedDB
│   └── Offline library and annotations
├── Service Worker
│   └── App shell and runtime caching
└── Local Storage
    ├── Admin session
    ├── Reader preferences
    └── Lightweight progress flags
```

### מסלולי נתונים מרכזיים

1. **תוכן ציבורי**
   - נקרא דרך `fetchPublicCollection`.
   - בהתאם לפריסה, ניתן להשתמש ב־`content` function או ישירות ב־Entity SDK.
   - כאשר אין נתונים חיים, הדפים משתמשים ב־`seedContent` ובמאגרי תוכן סטטיים.

2. **נתוני קורא משוברים**
   - נשמרים ב־Entities עם `owner_email`.
   - רוב המסכים מסננים אחריות בצד הלקוח.

3. **תוכן במצב offline**
   - נשמר ב־IndexedDB תחת `prayread-offline`.
   - המערכת מפרידה בין פרקים, פסוקים, הערות, תוכן, Strong’s ונתוני קריאה.

4. **התקנת מקרא**
   - Serverless functions מורידים פרקים ממקורות ציבוריים.
   - הפרקים נשמרים כ־Entity יחיד לכל ספר ופרק.
   - Cron שעתי ממשיך את ההתקנה אוטומטית.

5. **ניהול תוכן**
   - יש שני מסלולי גישה:
     - Server function עם token מתוך `adminAuth`.
     - הרשאות ישירות של מנהל דרך `adminDirect`.
   - המסלול הישיר משמש כגיבוי כאשר function gateway אינו זמין לדפדפן.

---

# 2. עמודים ותפקידיהם

## 2.1 דפים ציבוריים וכלליים

| עמוד | כתובת | תפקיד | אינטראקציות מרכזיות |
|---|---|---|---|
| **Home** | `/` | דף הבית של האפליקציה. מציג את עיקרי המוצר, פסוק/תוכן מובנה, אפשרויות ניווט, התקנת PWA ותוכן קהילתי אחרון. | כפתור “Get started” מוביל ל־Dashboard למשתמש מחובר או ל־Login/Bible Reader למבקר; כרטיסי ייעוד מובילים למוצרים; התקנת אפליקציה; שיתוף פסוק; מעבר לקהילה ולמרכז הנתונים. |
| **About** | `/About` | מציג את זהות Pray-Read, המטרה הדתית והערכים של השימוש ביישום. | קישור חזרה לבית, קישורים לקורא, קהילה ותפילה. העמוד בעיקר סטטי. |
| **Contact** | `/Contact` | שולח פנייה לצוות האתר דרך `ContactMessage`. | שם, אימייל, נושא והודעה; אימות מקומי; שליחה דרך `submitContactMessage`; הצגת הצלחה או שגיאה. |
| **Privacy** | `/Privacy` | מסביר אילו נתונים נשמרים בחשבון, אילו נשמרים מקומית וכיצד ניתן למחוק אותם. | קישור חזרה לבית; טקסט משפטי/מדיניות ללא טופס. |
| **Terms** | `/Terms` | תנאי שימוש, זכויות תוכן והסתייגות לגבי תרגומי המקרא. | קישור חזרה לבית; טקסט משפטי ללא פעולת נתונים. |
| **InstallPrompt** | `/InstallPrompt` | מסף התקנת האפליקציה כ־PWA והסבר לפי מערכת ההפעלה. | זיהוי `beforeinstallprompt`; התקנה בדפדפנים תומכים; הוראות ידניות ל־iOS ולמחשב; זיהוי מצב standalone. |

## 2.2 קריאת המקרא ומעקב אישי

| עמוד | כתובת | תפקיד | אינטראקציות מרכזיות |
|---|---|---|---|
| **BibleReader** | `/BibleReader` | בחירת ספר מתוך 66 הספרים, חיפוש לפי שם או קיצור באנגלית ולוגנדה, מעבר בין הברית הישנה לחדשה והצגת זמינות offline. | חיפוש ספר; לחיצה על ספר; גלילה למקטע; בחירת פרק; המשך ל־`Chapter`; סימון ספר שכל פרקיו זמינים offline. |
| **Chapter** | `/Chapter?book=43&chapter=3&verse=16&lang=lu` | מסך מרכזי לקריאת פרק. מציג את הפסוקים, תפילות, הפניות, פירושים, תובנות, Strong’s, הערות והפעולות הקורא. | בחירת פסוק; בחירת תרגום; הדגשה, סימנייה והערה; בחירת טקסט להדגשה או קו תחתון; פתיחת אזורי Intro/Commentary/Prayer/Cross-refs; פתיחת פסוק אחר; קוד Strong’s; שיתוף; השלמת פרק ועדכון תוכנית הקריאה. |
| **BibleNotes** | `/BibleNotes` | מרכז ההערות, ההדגשות והסימניות של הקורא. | מיון לפי סוג; פתיחת המיקום המדויק במקרא; מחיקת רשומה; הצגת תאריכים והתקדמות קריאה. |
| **Plan** | `/Plan` | תוכנית הקריאה בת 30 יום המשלבת את יוחנן ואת תהילים. | תצוגת סדר ימים; סטטוס completed/current/upcoming; אחוז התקדמות; מעבר לפרק המתוכנן; השלמה מתעדכנת מתוך `Chapter`. |
| **Journal** | `/Journal`; יצירה: `/Journal?new=1&book=John&chapter=1` | יומן תפילה אישי עם מחקר, התחנונות, הודאות, שבח והשקפה. | יצירה, עריכה, מחיקה וסינון לפי קטגוריה; קשר לפרק; שמירת תאריך, מצב רוח, ספר ופרק. |
| **Dashboard** | `/Dashboard` | לוח בקרה אישי למשתמש מחובר: התקדמות, רצף קריאה, ספירת הדגשות, סימניות, תפילות שמורות, פעילות אחרונה ומצב offline. | מעבר לקריאה, יומן, הערות והתקנות; צפייה ב־Activity Feed; המשך פעילות למקום המתאים. |
| **VerseOfDay** | `/VerseOfDay` | מציג פסוק יומי מתוך הנתונים החיים או מהמאגר המובנה. | בחירת פסוק לפי תאריך; שיתוף; פתיחת הפסוק במקרא. |

## 2.3 ספרייה ומחקר

| עמוד | כתובת | תפקיד | אינטראקציות מרכזיות |
|---|---|---|---|
| **Devotionals** | `/Devotionals`; פתיחת דיביוני: `/Devotionals?devotional=D-001` | רשימת ותצוגת מחקבים יומיים באנגלית ולוגנדה. | חיפוש וסינון; פתיחת דיביוני; שיתוף; סימון כהושלם; קישור לפסוק; הצגת חומרים קשורים והמשך קריאה. |
| **PrayerLibrary** | `/PrayerLibrary` | ספריית תפילות מסווגת לפי קטגוריה, עם חיפוש והעדפת שפה. | חיפוש; סינון קטגוריה ושפה; פתיחת פסוק; שמירת תפילה למועדפים; הסרת תפילה; שיתוף. |
| **QA** | `/QA` | שאלות קוראים עם תשובות פסטורליות והפניות מקרא. | חיפוש וסינון קטגוריה; פתיחת תשובה; הגשת שאלה חדשה למשתמש מחובר; קישור לפסוק. |
| **TheologicalInsights** | `/TheologicalInsights` | לוח תובנות תיאולוגיות מתוך המסד והמאגר המובנה. | חיפוש; פתיחת תובנה; שיתוף; שמירה מקומית; פתיחת פסוק. |
| **HistoricalInsights** | `/HistoricalInsights` | לוח תובנות היסטוריות ורקע תרבותי. | זההוי `InsightsBoard` עם `kind="historical"`; אותה חוויית חיפוש, שיתוף ושמירה. |

## 2.4 קהילה

| עמוד | כתובת | תפקיד | אינטראקציות מרכזיות |
|---|---|---|---|
| **Community** | `/Community` | שער לשלושה מרכזי קהילה ותצוגת תוכן אחרון. | מעבר ל־Revelations, Live Teaching ו־Discussion Groups; צפייה בפרסומים אחרונים; פתיחת דיונים ואירועים. |
| **CommunityRevelations** | `/CommunityRevelations` | פיד חשיפות אמונה של קוראים עם תגובות וספירת סימוני לייק. | פרסום חשיפה; לייק; פתיחת תגובות; הוספת תגובה; מעבר להתחברות אם המשתמש אינו מחובר. |
| **CommunityLiveTeaching** | `/CommunityLiveTeaching` | רשימת מושבי הוראה חיים עם תאריך, מנחה וקישור הצטרפות. | צפייה בפרטי מושב; פתיחת `join_link`; טעינת נתונים חלופיים כשאין רשומות חיות. |
| **DiscussionGroups** | `/DiscussionGroups`; בחירת קבוצה: `/DiscussionGroups?group=...` | קבוצות לימוד משותפות עם הודעות דיון. | בחירת קבוצה; הצטרפות מקומית; שליחת הודעה; הצגת מחבר וכותרת; התנתקות מקבוצה. |

## 2.5 אודיו

| עמוד | כתובת | תפקיד | אינטראקציות מרכזיות |
|---|---|---|---|
| **VerseSongs** | `/VerseSongs` | רשימת סדרות Verse-Song. | בחירת סדרה; השמעת רשימת תכנים דרך הנגן הגלובלי; עצירה/המשך; מעבר לעמוד הסדרה. |
| **VerseSongSeries** | `/VerseSongSeries?series=<שם>` | עמוד סדרה מפורט עם כל הפרקים שלה. | בחירת סדרה לפי פרמטר; השמעת פרק בודד או כל הסדרה; הצגת משך והפניה מקראית. |

## 2.6 חשבון והתחברות

| עמוד | כתובת | תפקיד | אינטראקציות מרכזיות |
|---|---|---|---|
| **Login** | `/Login?next=<path>` | התחברות קורא רגיל. | אימייל וסיסמה; קריאה ל־`fse2.auth.login`; הפניה ל־Dashboard; הצגת שגיאה; קישור לשכחת סיסמה והרשמה. |
| **Signup** | `/Signup` | הרשמת קורא חדש. | שם, אימייל, סיסמה, אימות סיסמה וקבלת תנאים; בדיקת חוזק סיסמה; טיפול בדרישת אימות אימייל; הפניה ל־Dashboard. |
| **ForgotPassword** | `/ForgotPassword` | שליחת בקשת איפוס סיסמה. | אימייל; קריאה ל־`fse2.auth.forgotPassword`; הודעת הצלחה שאינה חושפת אם החשבון קיים. |
| **ResetPassword** | `/ResetPassword?token=...` או `?access_token=...` | הגדרת סיסמה חדשה. | אימות אורך סיסמה, התאמת אימות וקריאה ל־`fse2.auth.resetPassword`. |
| **Logout** | `/Logout` | מסך מעבר לביטול ההתחברות. | קורא ל־`logout`, ממתין כמה עשיריות שדי המסך, ואז מחזיר ל־Home. |

## 2.7 Offline והתקנות

| עמוד | כתובת | תפקיד | אינטראקציות מרכזיות |
|---|---|---|---|
| **Offline** | `/Offline` | מרכז הורדות וניהול הנתונים המקומיים. | הורדת פרקים לפי תרגום; הורדת תוכן, תפילות, פירושים, הפניות, Strong’s ועוד; הצגת נפח; בדיקת קריאה; מחיקת כל המטמון או חלקו. |

## 2.8 ניהול תוכן

| עמוד | כתובת | תפקיד | אינטראקציות מרכזיות |
|---|---|---|---|
| **Admin** | `/Admin` | כניסה למנהל התוכן ואיפוס סיסמת מנהל. | אימייל וסיסמה; בדיקת session קיים; כניסה; פתיחת מודאל איפוס עם reset key; הצגת הצלחה או כשל. |
| **AdminDashboard** | `/AdminDashboard` | מרכז ניהול התוכן וההתקנות. | בחירת מקטע; סקירת כיסוי; התקנת לוגנדה; התקנת KJV+ ו־Strong’s; הרצת audit; ניהול מתפללות, מעברי ספרים, הפניות, הערות, אימפורטים, הודעות, ערכת נושא ויומן פעילות; התחברות מחדש ל־session; התנתקות. |

---

# 3. מפת ניווט לצורך DEBUG

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| מעבר לדף הבית | Header, Footer, כפתורי Back | לוגו או חץ | `/` |
| מעבר למקרא | Header, Home, Footer | “Bible Reader” | `/BibleReader` |
| בחירת ספר | BibleReader | כרטיס ספר | תצוגת פרקים של הספר ואפשרות לבחור פרק |
| בחירת פרק | Chapter Grid | מספר הפרק | `/Chapter?book=...&chapter=...` |
| פתיחת פסוק ייעד | פסוק, הפניה, תובנה, תוכנית | קישור או כפתור הפסוק | `/Chapter` עם `book`, `chapter`, `verse` |
| בחירת שפת קריאה | Chapter | VersionPicker | מעבר בין KJV, KJV+, לוגנדה ותרגומים זמינים |
| פתיחת מבוא הספר | Chapter sidebar | “Intro” | `BookIntro` בתוך מסך הפרק |
| פתיחת מבנה הספר | Chapter sidebar | “Outline” | `BookOutline`; בחירת חלק מנווטת לאותו פרק |
| פתיחת תפילת הספר | Chapter sidebar | “Prayer” | `BookPrayerPanel` |
| פתיחת מבוא פרק | Chapter study panel | “Intro” | `ChapterSidebar` → Intro |
| פתיחת פירוש פרק | Chapter study panel | “Commentary” | `ChapterSidebar` → Commentary |
| פתיחת תפילת פרק | Chapter study panel | “Prayer” | `ChapterSidebar` → Prayer |
| פתיחת הפניות הפרק | Chapter study panel | “Cross-refs” | `ChapterSidebar` → Cross-references |
| פתיחת תובנות | Chapter | “Resources” | `ChapterResourcesPanel` |
| פתיחת קוד Strong’s | פסוק KJV+ | הקוד הכחול | `StrongsPopup` |
| הוספת הפניה בין-פסוקית | Verse Action Bar | “Cross-reference” | `VerseCrossRefs` |
| פתיחת הפניה בין-פסוקית | Verse Cross References | כפתור ההפניה | `/Chapter` בפסוק היעד |
| פתיחת תפילת פסוק | Verse Action Bar | “Prayer” | `PassagePrayer` |
| פתיחת פסוק מתוך הפניה | Sidebar/verse popup | שם הפסוק | `VersePopup` או ניווט ל־Chapter |
| שיתוף פסוק | Verse Action Bar | “Share” | `ShareSheet` |
| העתקת פסוק | Verse Action Bar | “Copy” | Clipboard |
| הדגשת פסוק | Verse Action Bar | “Highlight” | יצירת `StudyMark` מסוג `highlight` |
| סימון פסוק | Verse Action Bar | “Bookmark” | יצירת `StudyMark` מסוג `bookmark` |
| כתיבת הערת פסוק | Verse Action Bar | “Note” | יצירת `StudyMark` מסוג `note` |
| הדגשת טקסט חופשי | Intro, outline, prayer | בחירת טקסט וכלי הסימון | יצירת `StudyAnnotation` |
| פתיחת הערות הקורא | Header | “My notes” | `/BibleNotes` |
| מעבר לתוכנית קריאה | Header/Footer | “Reading plan” | `/Plan` |
| פתיחת יומן | Header/Footer | “Prayer journal” | `/Journal` |
| יצירת רשומת יומן מהפרק | Chapter | קישור Journal עם פרמטרים | `/Journal?new=1&book=...&chapter=...` |
| מעבר לדיביוני | Header/Footer | “Daily Devotionals” | `/Devotionals` |
| פתיחת דיביוני | Devotionals | כרטיס דיביוני | מודאל דיביוני |
| מעבר לספריית תפילות | Header/Footer | “Prayer Library” | `/PrayerLibrary` |
| מעבר לשאלות ותשובות | Header/Footer | “Q&A” | `/QA` |
| מעבר לתובנות תיאולוגיות | Header/Footer | “Theological insights” | `/TheologicalInsights` |
| מעבר לתובנות היסטוריות | Header/Footer | “Historical insights” | `/HistoricalInsights` |
| מעבר לקהילה | Header/Footer | “Community” | `/Community` |
| פתיחת חשיפות | Community | “Revelations” | `/CommunityRevelations` |
| פתיחת הוראה חיה | Community | “Live teaching” | `/CommunityLiveTeaching` |
| פתיחת קבוצות דיון | Community | “Discussion groups” | `/DiscussionGroups` |
| פתיחת דיון קבוצה | Discussion Groups | כרטיס קבוצה | `ThreadMessages` |
| השמעת סדרת שירים | Verse Songs | Play | הנגן הגלובלי |
| פתיחת סדרת שירים | Verse Songs | שם הסדרה | `/VerseSongSeries?series=...` |
| מעבר למרכז Offline | Header/Footer | “Offline centre” | `/Offline` |
| התקנת PWA | Home/InstallPrompt | “Install app” | התקנה מקומית או הוראות |
| התחברות | Header/Community | “Sign in” | `/Login` |
| הרשמה | Header/Community | “Create account” | `/Signup` |
| איפוס סיסמה | Login | “Forgot password?” | `/ForgotPassword` |
| צירוף התחברות | Dashboard | “Sign in” | `/Login` |
| התנתקות | Header/Dashboard | “Sign out” | `/Logout` |
| כניסת מנהל | נתיב ישיר או קישור ניהול | “Content manager” | `/Admin` |
| בחירת מקטע ניהול | AdminDashboard | תפריט בצד | Dashboard, Books, Luganda, KJV+, prayers, imports וכו׳ |
| התקנת לוגנדה | AdminDashboard | “Install” | `lugandaInstall` function ועדכון כיסוי |
| התקנת KJV+ | AdminDashboard | “Install chapters” | `kjvInstall` function |
| התקנת מילון Strong’s | AdminDashboard | “Build dictionary” | `kjvInstall`/`strongsDefinition` |
| הרצת דוח ספרייה | AdminDashboard או LibraryReport | “Run audit” | `scriptureAudit` |
| פתיחת אוסף תוכן | AdminDashboard | “All content” | `CollectionsPanel` |
| הוספת רשומה | CollectionsPanel | “Add” | `RecordEditor` |
| עריכת רשומה | CollectionsPanel | עטרת עריכה | `RecordEditor` |
| מחיקת רשומה | CollectionsPanel | עטרת מחיקה | `ConfirmDialog` → מחיקה |
| ייבוא JSON כללי | AdminDashboard | “JSON import” | `JsonImportPanel` |
| ייבוא תפילות והפניות | AdminDashboard | “Prayer & Cross-ref import” | `PrayerCrossRefImport` |
| העלאת קובץ ספר | JsonImportPanel | בחירת קובץ | תצוגת preview ואימות |
| התחברות למנהל קיים | Admin | Sign in | `/AdminDashboard` |
| איפוס סיסמת מנהל | Admin | “Reset password” | מודאל reset key |

---

# 4. מבנה הקבצים

## 4.1 מפת תיקיות

```text
/
├── Layout.jsx
├── api/
│   └── fse2Client.js
├── components/
│   ├── admin/
│   ├── common/
│   ├── community/
│   ├── dashboard/
│   ├── home/
│   ├── insight/
│   ├── journal/
│   ├── layout/
│   ├── plan/
│   └── read/
├── cron/
│   └── scriptureInstall.js
├── entities/
│   └── *.json
├── functions/
│   ├── adminAuth.js
│   ├── adminContent.js
│   ├── bibleChapter.js
│   ├── content.js
│   ├── kjvInstall.js
│   ├── lugandaInstall.js
│   ├── scriptureAudit.js
│   └── strongsDefinition.js
├── lib/
│   └── *.js / *.jsx
├── pages/
│   └── *.jsx
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── assets/
├── utils.js
└── __generated/
    └── tailwind.css
```

`api/fse2Client.js` ו־`utils.js` מיובאים באופן נרחב אך לא ניתנו במלואם בקוד שסופק. הם מהווים את שכבת הגישה ל־FSe2 ואת יצירת הנתיבים בהתאם.

## 4.2 דפי Pages

| קובץ | תפקיד | מה נמסר למשתמש |
|---|---|---|
| `pages/About.jsx` | דף מסגרת המוצר והערכים. | Hero, הסבר על מטרת האפליקציה, קשרים לקריאה וקהילה. |
| `pages/Admin.jsx` | כניסת מנהל תוכן ואיפוס סיסמה. | טופס כניסה, הודעות שגיאה ומודאל איפוס. |
| `pages/AdminDashboard.jsx` | מרכז הניהול. | ניווט מקטעים, סקירות, התקנות, imports, ניהול אוספים ופעילות. |
| `pages/BibleNotes.jsx` | רשימת סימוניות והערות הקורא. | כרטיסי הדגשה, סימנייה והערה עם קישור למיקום. |
| `pages/BibleReader.jsx` | בחירת ספר ופרק. | רשת ספרים, חיפוש, מצבי offline ו־ChapterSelector. |
| `pages/Chapter.jsx` | מסך הקריאה המרכזי. | פסוקים, מחקר, תפילות, הפניות, הערות, Strong’s, מדדי קריאה ושיתוף. |
| `pages/Community.jsx` | שער הקהילה. | כרטיסי הקהילות ותוכן אחרון. |
| `pages/CommunityLiveTeaching.jsx` | מושבי הוראה חיים. | רשימת מושבים וקישורי הצטרפות. |
| `pages/CommunityRevelations.jsx` | פיד חשיפות ותגובות. | טופס פרסום, כרטיסי חשיפה, לייק ותגובות. |
| `pages/Contact.jsx` | שליחת הודעה לאתר. | טופס פרטי וסטטוס שליחה. |
| `pages/Dashboard.jsx` | לוח בקרה למשתמש מחובר. | סטטיסטיקות, רצף, התקדמות, פעילות ומצב הורדות. |
| `pages/Devotionals.jsx` | ספריית דיביוניים. | רשימה, חיפוש, מודאל דיביוני, השלמה ושיתוף. |
| `pages/DiscussionGroups.jsx` | קבוצות לימוד ודיון. | רשימת קבוצות, הצטרפות והודעות. |
| `pages/ForgotPassword.jsx` | בקשת איפוס סיסמה. | טופס אימייל והודעת אישור. |
| `pages/HistoricalInsights.jsx` | עטיפת לוח התובנות ההיסטוריות. | `InsightsBoard` עם סוג historical. |
| `pages/Home.jsx` | דף הבית. | Hero, כרטיסי מוצר, פסוק/תוכן מובנה, התקנה וקהילה. |
| `pages/InstallPrompt.jsx` | התקנת PWA. | הוראות לפי מכשיר וכפתור התקנה כשניתן. |
| `pages/Journal.jsx` | יומן תפילה אישי. | רשימת רשומות, טופס, סינון, עריכה ומחיקה. |
| `pages/Login.jsx` | התחברות קורא. | טופס ושגיאות. |
| `pages/Logout.jsx` | סיום התחברות. | מחוון התנתקות וחזרה לבית. |
| `pages/Offline.jsx` | מרכז הורדות. | בקרת תוכן, הורדה, מחיקה וסטטוס. |
| `pages/Plan.jsx` | תוכנית הקריאה. | 30 ימים, סטטוס ואחוז התקדמות. |
| `pages/PrayerLibrary.jsx` | ספריית תפילות. | חיפוש, סינון, מועדפים ושיתוף. |
| `pages/Privacy.jsx` | מדיניות פרטיות. | הסבר על נתוני חשבון ונתוני מכשיר. |
| `pages/QA.jsx` | שאלות ותשובות. | רשימת Q&A והגשת שאלה. |
| `pages/ResetPassword.jsx` | קביעת סיסמה חדשה. | טופס סיסמה ואימות. |
| `pages/Signup.jsx` | הרשמת קורא. | טופס רישום, בדיקות סיסמה ואימות אימייל. |
| `pages/Terms.jsx` | תנאי שימוש. | טקסט משפטי והגבלות שימוש בתוכן. |
| `pages/TheologicalInsights.jsx` | עטיפת לוח התובנות התיאולוגיות. | `InsightsBoard` עם סוג theological. |
| `pages/VerseOfDay.jsx` | פסוק היום. | פסוק, הפניה, שיתוף וקישור למקרא. |
| `pages/VerseSongSeries.jsx` | פרטי סדרת שירים. | רשימת אוספים והשמעה. |
| `pages/VerseSongs.jsx` | רשימת סדרות והשמעה. | כרטיסי סדרות ונגן גלובלי. |

## 4.3 קבצי Layout ורכיבי מבנה

| קובץ | תפקיד | מה מרנדר |
|---|---|---|
| `Layout.jsx` | מעטפת האפליקציה הגלובלית. | `AuthProvider` → `ThemeProvider` → `PlayerProvider`, Header, תוכן הדף, Footer עבור Home ו־GlobalPlayer. |
| `components/layout/AppHeader.jsx` | Header רספונסיבי ומצב משתמש. | לוגו, ניווט ראשי ומשני, מצב offline, תפריט מובייל, התחברות/התנתקות, donate ו־Get started. |
| `components/layout/AppFooter.jsx` | ניווט משני ומידע מותג. | לוגו עם fallback, קישורי Quick Links, מידע משפטי ותמיכה. |
| `components/layout/GlobalPlayer.jsx` | נגן אודיו גלובלי. | Mini player וגיליון מורחב עם תור, נגן, הבהרה, חזרה, מצב אקראי, מהירות, עוצמה ורשימת תכנים. |
| `components/layout/PwaHead.jsx` | הוספת metadata ורישום Service Worker. | מטא tags, manifest, favicon, Apple icon ורישום ה־SW. |

## 4.4 קבצי `components/common`

| קובץ | תפקיד | מה מרנדר |
|---|---|---|
| `components/common/EmptyState.jsx` | מצב ריק אחיד. | אייקון, כותרת, תיאור ופעולה אופציונלית. |
| `components/common/Modal.jsx` | מודאל גנרי. | Backdrop, כותרת, תת־כותרת, תוכן, footer, סגירה ב־Escape ונעילת גלילת הגוף. |
| `components/common/PageHeader.jsx` | Header אחיד לדפים. | גרסת Hero עם תמונה או גרסת Section ללא תמונה. |
| `components/common/Pagination.jsx` | Pager קל. | כפתורי עמודים, דלילה ומעבר עמוד. |
| `components/common/ShareRow.jsx` | שורת שיתוף מהירה. | כפתורי Facebook, WhatsApp, Telegram, Instagram, LinkedIn ו־Copy. |
| `components/common/Spinner.jsx` | מצב טעינה. | Spinner עם `role="status"` ו־`aria-live`. |

## 4.5 קבצי `components/admin`

| קובץ | תפקיד | מה מרנדר |
|---|---|---|
| `components/admin/ChapterCoverage.jsx` | סיכום כיסוי פרקים. | טבלת ספרים, פרקים חסרים/פגומים כטווחים דחוסים, מצב מלא ופירוט מקונדס. |
| `components/admin/CollectionsPanel.jsx` | מנהל CRUD גנרי לכל אוסף. | בחירת אוסף, חיפוש, טבלת רשומות, הוספה, עריכה ומחיקה. |
| `components/admin/ConfirmDialog.jsx` | אישור פעולה הרסנית. | מודאל אזהרה, כפתורי Cancel ו־Delete ומצב busy. |
| `components/admin/CrossRefEditor.jsx` | עריכת רשימת הפניות מקרא. | Chips של הפניות, הוספה, הסרה ומניעת כפילויות. |
| `components/admin/JsonImportPanel.jsx` | ייבוא JSON גנרי לאוספים. | בחירת קובץ, aliases, תצוגת preview, אימות וייבוא עם דוח. |
| `components/admin/KjvPlusInstaller.jsx` | התקנת KJV+ ומילון Strong’s. | סטטוס התקנה, התקדמות, התקנת פרקים, בניית מילון ודוח כיסוי. |
| `components/admin/LibraryReport.jsx` | הצגת audit של הספרייה. | מדדי כיסוי, פערים, פרקים פגומים, חלוקת פסוקים ו־Strong’s. |
| `components/admin/LugandaInstaller.jsx` | התקנת המקרא בלוגנדה. | סטטוס, התקנה, התקדמות וכיסוי פרקים. |
| `components/admin/PassagesPanel.jsx` | עריכת תוכן המיובא לפי ספר. | ארבעה tabs: PrayerPassage, CrossReference, ChapterIntro ו־BookIntro. |
| `components/admin/PrayerCrossRefImport.jsx` | ייבוא ייעודי של תפילות והפניות לפי ספר. | טעינת קובץ, אימות מפורט, progress, import ודוח תוצאה. |
| `components/admin/PrayersPanel.jsx` | ניהול ספריית תפילות ותפילות לפי מעבר. | בחירת ספר/פרק/פסוק, חיפוש, טבלה ו־RecordEditor. |
| `components/admin/RecordEditor.jsx` | טופס דינמי לרשומה. | שדות text, textarea, number, boolean ו־refs לפי metadata של האוסף. |

## 4.6 קבצי Community, Dashboard, Home, Insight, Journal ו־Plan

| קובץ | תפקיד | מה מרנדר |
|---|---|---|
| `components/community/CommentThread.jsx` | תגובות לחשיפה. | רשימת תגובות, טופס תגובה ומצב משתמש. |
| `components/community/RevelationCard.jsx` | כרטיס חשיפה. | מחבר, פסוק, כותרת, גוף, לייק ותגובות. |
| `components/community/RevelationForm.jsx` | יצירת חשיפה. | הנחיית כותרת/פסוק/גוף והתחברות למשתמש חסר. |
| `components/community/ThreadMessages.jsx` | הודעות בקבוצת דיון. | רשימת הודעות וטופס משלוח. |
| `components/dashboard/ActivityFeed.jsx` | פעילות אחרונה. | אייקון, תיאור, זמן וקישור לפעילות. |
| `components/home/StatCard.jsx` | כרטיס מספר. | אייקון, label, value ו־hint. |
| `components/insight/InsightsBoard.jsx` | לוח תובנות. | חיפוש, רשימת תובנות, פתיחת פרט ושיתוף/שמירה. |
| `components/journal/JournalCard.jsx` | כרטיס רשומת יומן. | קטגוריה, כותרת, גוף, תאריך, ספר ופעולות עריכה/מחיקה. |
| `components/journal/JournalForm.jsx` | טופס יומן. | כותרת, גוף, קטגוריה, ספר ופרק. |
| `components/plan/PlanRow.jsx` | שורת יום בתוכנית. | מספר יום, סטטוס, פרטי הקריאה וקישור לפרק. |

## 4.7 קבצי `components/read`

| קובץ | תפקיד | מה מרנדר |
|---|---|---|
| `components/read/AnnotatedText.jsx` | טקסט הניתן להדגשה ולקו תחתון. | פילוח הטקסט ל־segments, תרשימי בחירה וכלי סימון. |
| `components/read/BookGrid.jsx` | רשת 66 הספרים. | חיפוש, Old/New Testament tabs ורשת ספרים. |
| `components/read/BookIntro.jsx` | מבוא ספר. | מבוא מיובא או מובנה, עובדות ספר, פסוקי מפתח והערות. |
| `components/read/BookOutline.jsx` | מבנה הספר. | כותרות חלקים, טווחי פסוקים וניווט למיקום. |
| `components/read/BookPrayerPanel.jsx` | תפילת הספר. | תפילה באנגלית/לוגנדה, הפניות פנימיות והערות. |
| `components/read/BookSidebar.jsx` | Sidebar של בחירת ספר. | Intro, Outline ו־Book Prayer. |
| `components/read/BookStudyResources.jsx` | משאבי לימוד מתחת לרשת הפרקים. | Commentary, Theological Insights ו־Historical Insights עם pagination. |
| `components/read/ChapterClosingPrayer.jsx` | תפילת סיום הפרק. | תפילה מלאה בשפות הנבחרות, שיתוף, חזרה לתפילה והערות. |
| `components/read/ChapterGrid.jsx` | רשת מספרי פרקים. | מספרים המקשרים ל־Chapter. |
| `components/read/ChapterReaderPane.jsx` | מעטפת קריאת פרק רספונסיבית. | תפריט מחקר, לשוניות, פאנל מובייל ו־wide-screen layout. |
| `components/read/ChapterResourcesPanel.jsx` | תובנות פרק. | תובנה תיאולוגית והיסטורית עם fallback לרמת הספר. |
| `components/read/ChapterSelector.jsx` | בחירת פרק בתוך ספר. | Sidebar, רשת פרקים, משאבי לימוד, popup והערות. |
| `components/read/ChapterSidebar.jsx` | חלונית המחקר של פרק. | Intro, Commentary, Prayer ו־Cross-refs. |
| `components/read/CrossRefList.jsx` | רשימת הפניות. | הפניות לפסוק הנוכחי וכל הפניות האחרות בפרק. |
| `components/read/CrossRefScripture.jsx` | טקסט פסוק היעד. | טקסט השמור או טעינת הפרק מהמקרא. |
| `components/read/FloatingVerse.jsx` | חלון פסוק צף. | פסוק, סגירה וקישור למקרא. |
| `components/read/PassagePrayer.jsx` | תפילה המתאימה לפסוק. | בחירת שפה, תוכן מיובא/מובנה והפניות פסוק. |
| `components/read/PassageTabs.jsx` | לשוניות מחקר לפי מעבר. | Commentary, Theological, Historical ו־Q&A. |
| `components/read/ShareSheet.jsx` | חלון שיתוף מלא. | טקסט משותף, ערוצי שיתוף והעתקה. |
| `components/read/StrongsPopup.jsx` | מילון Strong’s. | מקור, מילה מקורית, ניסוח, הגייה, חלק דיבר והגדרה. |
| `components/read/StrongsText.jsx` | הפיכת קודי Strong’s ל־superscript. | פילוח פסוק לטקסט וקודים לחיצים. |
| `components/read/VerseActionBar.jsx` | פעולות פסוק. | תפילה, הפניות, פירוש, הדגשה, שיתוף, סימנייה, הערה והעתקה. |
| `components/read/VerseCrossRefs.jsx` | הפניות מתחת לפסוק. | רשימת יעדים, טקסט והערות. |
| `components/read/VerseList.jsx` | רשימת פסוקים בסגנון Tailwind מוקדם. | כפתור לכל פסוק ומצב נבחר/מודגש. |
| `components/read/VersePopup.jsx` | מודאל קריאת פסוק. | טעינת פרק, תצוגת פסוק או טווח והערות. |
| `components/read/VersionPicker.jsx` | מתג תרגומים. | תרגום פעיל, התקנה, הסרה והחלפה. |

## 4.8 קבצי `lib`

| קובץ | תפקיד וייצואים מרכזיים |
|---|---|
| `lib/activity.js` | רישום פעילות קורא ותוויות לפעילות. |
| `lib/adminCollections.js` | Metadata של כל אוספי הניהול, שדות, `emptyRecord`, `recordTitle` ו־`splitRefs`. |
| `lib/adminDirect.js` | CRUD ישיר של המנהל דרך Entity SDK כגיבוי ל־function. |
| `lib/adminSession.js` | כניסה, החתמת session, חידוש, התנתקות ובחירת server/direct mode. |
| `lib/app-params.js` | קריאת app ID ו־app token בזמן אמת מ־`localStorage`. |
| `lib/AuthContext.jsx` | Provider של מצב המשתמש ופעולות login/logout. |
| `lib/bibleApi.js` | טעינת פרק, fallback ל־offline, זיהוי Strong’s ו־plain chapter. |
| `lib/bibleBooks.js` | נתוני 66 הספרים: מספר, שם, קיצור, לוגנדה ומספר פרקים. |
| `lib/bookGuides.js` | מבוא ו־outline מובנים לכל ספר. |
| `lib/bookImport.js` | זיהוי ופירוק קובץ ספר לאוספי נתונים. |
| `lib/bookIntro.js` | קריאת ונרמול `BookIntro`. |
| `lib/bookPrayers.js` | תפילה מובנה לכל ספר, עם הפניות `[[Book chapter:verse]]`. |
| `lib/bookStudyContent.js` | תוכן מחקר מובנה לכל ספר. |
| `lib/brandCss.js` | מערכת CSS של המותג ומשתני CSS. |
| `lib/chapterIntros.js` | קריאה ונרמול מבואי פרקים. |
| `lib/chapterStudy.js` | בניית מבוא, פירוש ותפילה לפרק ממקורות קיימים. |
| `lib/contentApi.js` | מיפוי אוספים ציבוריים ושליחת טפסים. |
| `lib/crossRefs.js` | הפניות בין-פסוקיות מוכנות משמשות כ־fallback. |
| `lib/format.js` | `safeText`, פיצול רשימות, כותרות, משך זמן, bytes ועוד. |
| `lib/keyPassages.js` | פסוקי מפתח לכל ספר. |
| `lib/luganda.js` | פירוק ועיצוב דיביוני לוגנדה. |
| `lib/offlineDb.js` | מעטפת IndexedDB, stores, מיגרציה ופעולות CRUD. |
| `lib/planData.js` | תוכנית 30 הימים כ־fallback. |
| `lib/player.jsx` | Provider ו־API לנגן האודיו הגלובלי. |
| `lib/prayerImport.js` | פורמט, ולידציה, import ו־normalization של קובצי התפילות. |
| `lib/prayerPassages.js` | תפילות פרק והפניות, natural keys ו־picking לפי פסוק. |
| `lib/reading.js` | תאריכים, ימים, רצף קריאה ותוויות. |
| `lib/readings.js` | רישום השלמת פרק וסגירת יום בתוכנית. |
| `lib/scriptureRefs.js` | פענוח הפניות, aliases, ranges ו־inline reference nodes. |
| `lib/seedContent.js` | מאגר תוכן מובנה לדיביוניים, תפילות, שירים, Q&A, תובנות ועוד. |
| `lib/sha256.js` | מימוש SHA-256 ב־JavaScript. |
| `lib/share.js` | בניית קישורי שיתוף והעתקת טקסט. |
| `lib/strongs.js` | נרמול קודי Strong’s, קידומת שפה ו־lexicon URL. |
| `lib/strongsOffline.js` | קריאה וכתיבת המילון ב־IndexedDB. |
| `lib/studyAnnotations.js` | טעינה, מיזוג, שמירה ומחיקת הדגשות טקסט. |
| `lib/textSelection.js` | זיהוי האם פעולת קליק נבעה מבחירת טקסט. |
| `lib/theme.js` | קבצי המותג, לוגו, favicon, תמונות וקישורי תרומה. |
| `lib/themeContext.jsx` | טעינת `SiteSettings` ועדכון משתני CSS. |
| `lib/versions.js` | רשימת התרגומים, התקנה, הסרה והתרגום הפעיל. |

## 4.9 קבצי `functions`

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | אימות מנהל, hashing, איפוס סיסמה, יצירה וחידוש session token. |
| `functions/adminContent.js` | API ניהול תוכן מורשה לפי token: list, create, update ו־delete. |
| `functions/bibleChapter.js` | השגת פרק מלא ממקורות ציבוריים וניקוי טקסט. |
| `functions/content.js` | קריאת אוספים ציבוריים וקבלת הגשות כגון Contact ו־QA. |
| `functions/kjvInstall.js` | הורדת והתקנת KJV+ לפי פרק ובניית מילון Strong’s. |
| `functions/lugandaInstall.js` | הורדת והתקנת פרקי המקרא בלוגנדה. |
| `functions/scriptureAudit.js` | בדיקת כיסוי, שלמות והתאמות בין תרגומים; פעולתו read-only. |
| `functions/strongsDefinition.js` | מילון Strong’s ממקורות מקומיים/ציבוריים ושמירת cache. |

## 4.10 Cron, Public וקבצים מיוצרים

| קובץ/מיקום | תפקיד |
|---|---|
| `cron/scriptureInstall.js` | Job שעתי שמתקין פרקים חסרים בלוגנדה וב־KJV+ ומשלים את מילון Strong’s. ההתקנה אידמפוטנטית ועוצרת כשאין התקדמות. |
| `public/manifest.json` | Manifest של PWA: שם, צבעים, start URL, scope, תצוגה ואייקונים. |
| `public/sw.js` | Service Worker: cache-first ל-app shell ולתמונות, network-first לשאר הבקשות. שמות cache: `prayread-shell-v2`, `prayread-runtime-v2`. |
| `__generated/tailwind.css` | Utilities של Tailwind שנוצרו אוטומטית. |
| `public/assets/generated_*.png` | תמונות דקורative שנוצרו אוטומטית. |
| `public/assets/ingested/*` | מדיה שיובאה לאפליקציה. |
| `public/assets/media-library/*_image.png` | תמונות תוכן ומותג. |
| `public/assets/media-library/0dbaf742d3ba_Prayer-Crossrefs-Template.json` | תבנית ייבוא הפניות ותפילות. |
| `public/assets/media-library/f830b722d892_OBADIAH-PRAY-READ-BULK-IMPORT.json` | קובץ ספר לדוגמה ליבוא ובדיקות. |
| `public/assets/media-library/4345fa1c4c79_icon-512x512.png` | לוגו/אייקון המותג המשמש ב־`LOGO_URL`. |
| `public/assets/media-library/ee6ae196bbbc_favicon.ico` | Favicon. |
| `__trash/` | קוד ישן שאינו חלק מהאפליקציה הפעילה. |
| `__url_fetch/` | תוצרי מחקר וצילומי רשת לא פעילים. |

---

# 5. מודל הנתונים

## 5.1 ישויות תוכן ומחקר

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `BibleVerse` | אחסון גנרי של פסוק באנגלית ולוגנדה. | `book_number`, `book`, `chapter`, `verse`, `text_en`, `text_lu` | מזוהה לפי ספר, פרק ופסוק. ייתכן שמיועד לשימוש תאימות או flow ישן. |
| `KjvPlusChapter` | פרק KJV עם קודי Strong’s. | `book_number`, `book`, `chapter`, `verse_count`, `verses` | `verses` הוא JSON מקודד כמחרוזת. מפתח טבעי: `book_number + chapter`. |
| `LugandaChapter` | פרק מקרא בלוגנדה. | `book_number`, `book`, `chapter`, `verse_count`, `verses` | מפתח טבעי: `book_number + chapter`. |
| `StrongEntry` | מילון קוד Strong’s. | `code`, `language`, `original_word`, `transliteration`, `pronunciation`, `part_of_speech`, `root_word`, `definition`, `source` | `code` הוא המפתח העסקי; `G` ל־Greek ו־`H` ל־Hebrew. |
| `BookIntro` | מבוא ספר ותפילת סיום ספר. | `book_number`, `book_name`, `title_en/lu`, `intro_en/lu`, `closing_prayer_en/lu` | קשור לספר 1 - 66; מחליף את `BOOK_GUIDES` ו־`BOOK_PRAYERS`. |
| `ChapterIntro` | מבוא פרק. | `book_number`, `book_name`, `chapter`, `title_en/lu`, `intro_en/lu`, `source` | מפתח טבעי: `book_number + chapter`. |
| `Commentary` | פירוש לפרק. | `book`, `chapter`, `title`, `body_en/lu` | מזוהה לפי שם ספר ופרק; אין key רשמי ב־schema. |
| `Insight` | תובנה תיאולוגית או היסטורית. | `kind`, `title`, `passage`, `excerpt`, `body`, `share_count` | `kind` הוא `theological` או `historical`; ה־passage מקשר למיקום מקרא. |
| `Prayer` | תפילה כללית בספרייה. | `title`, `title_lu`, `category`, `body_en/lu`, `scripture_ref`, `cross_refs` | מקושרת למיקום מקרא דרך `scripture_ref`. |
| `PrayerPassage` | תפילה לפרק או לטווח פסוקים. | `book_number`, `book_name`, `chapter`, `verse`, `verse_end`, `title_en/lu`, `prayer_en/lu` | `verse=0` מייצג את כל הפרק; `verse_end` מייצג סוף טווח. |
| `CrossReference` | הפניה מפסוק לפסוק. | `book_number`, `chapter`, `verse`, `ref_book_number`, `ref_chapter`, `ref_verse`, `ref_verse_end`, טקסטים והערות ב־EN/LU | קשר מקור ליעד; ניתן לאחסן את טקסט היעד כדי להציגו בלי בקשת רשת. |
| `Devotional` | מחקב יומי. | `code`, `title/title_lu`, `scripture/scripture_lu`, `body/body_lu`, `related`, `further_readings`, `cover_image`, `day`, `category` | `code` הוא המפתח שאליו מתייחס `DevotionalProgress`. |
| `VerseOfDay` | פסוק מוגדר לתאריך. | `verse_date`, `reference`, `text_en/lu`, `note` | מזוהה לפי `verse_date`. |
| `ReadingPlan` | יום בתוכנית הקריאה. | `day`, `book`, `chapter`, `title`, `theme`, `focus`, `scripture` | `day` הוא מפתח עסקי; `Reading.plan_day` מפנה אליו. |

## 5.2 נתוני קורא

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `Reading` | השלמת פרק ונתוני השתקפות. | `owner_email`, `book`, `chapter`, `translation`, `plan_day`, `read_date`, `status`, `reflection`, `prayer_point`, `highlighted_verses` | קשור למשתמש וליום תוכנית; משמש לרצף ולהתקדמות. |
| `ReadingActivity` | אירוע קריאה אישי. | `owner_email`, `activity_type`, `book`, `book_number`, `chapter`, `verse` | מזוהה למשתמש; `activity_type` כולל chapter visit, highlight, bookmark, note, prayer ו־devotional. |
| `StudyMark` | הדגשה, סימנייה או הערה בפסוק. | `owner_email`, `mark_type`, `book_number`, `book`, `chapter`, `verse`, `color`, `note_text` | קשור למיקום פסוק; `mark_type` הוא `highlight`, `bookmark` או `note`. |
| `StudyAnnotation` | הדגשה או קו תחתון בטקסט מחקר. | `owner_email`, `book_number`, `book`, `section`, `block_id`, `kind`, `color`, `start_offset`, `end_offset` | `block_id` מזהה את הקטע; ה־offsets מבוססים על אופסים בטקסט. |
| `DevotionalProgress` | סימון דיביוני כהושלם. | `owner_email`, `devotional_code`, `completed_date` | קשור ל־`Devotional.code`. |
| `PrayerSaved` | תפילה במועדפים. | `owner_email`, `prayer_title` | קשור ל־`Prayer.title`; שמירה לפי כותרת בלבד. |
| `JournalEntry` | רשומת יומן תפילה. | `owner_email`, `entry_date`, `title`, `body`, `category`, `book`, `chapter`, `mood` | קשור למשתמש; `book` ו־`chapter` הם קשר לאופציונלי למקרא. |

## 5.3 קהילה, מדיניות וניהול

| Entity | מטרה | שדות מרכזיים | קשרים |
|---|---|---|---|
| `Revelation` | חשיפה אמונה או תגובה לחשיפה. | `owner_email`, `author_name`, `title`, `passage`, `body`, `likes`, `parent_id` | קשר עצמי: רשומה עם `parent_id` היא תגובה לחשיפת אב. |
| `DiscussionGroup` | קבוצת לימוד. | `name`, `description`, `schedule`, `member_count` | `DiscussionThread.group_name` מפנה אליה בשם. |
| `DiscussionThread` | הודעה בקבוצה. | `group_name`, `owner_email`, `author_name`, `title`, `body` | קשר לקבוצה לפי שם; מצב הצטרפות נשמר מקומית בנוסף ל־Entity. |
| `LiveSession` | מושב הוראה חי. | `title`, `session_date`, `host`, `join_link`, `description` | קישור ההצטרפות חיצוני נשמר בשדה. |
| `QAEntry` | שאלה ותשובה. | `question`, `category`, `answer`, `passage_ref`, `answered_by`, `status`, `author_email` | `author_email` מקשר לשולח; `passage_ref` מקשר למקרא. |
| `ContactMessage` | פנייה מצוררת לאתר. | `name`, `email`, `subject`, `message`, `is_read`, `reply` | קשורה למנהל דרך פאנל ההודעות; אין קשר ישיר למשתמש. |
| `SiteSettings` | הגדרות גלובליות. | `setting_key`, `setting_value` | משמש לערכי theme, שם האתר וקישור donate; המפתח הוא `setting_key`. |
| `ActivityLog` | יומן פעילות בממשק הניהול. | `actor`, `action`, `section`, `detail` | נכתב על ידי פעולות מנהל; אינו קשור חובה ל־Activity של קורא. |
| `AdminAccount` | רשומת מנהל ואישורי session. | `email`, `password_hash`, `salt`, `secret`, `session_version`, `updated_date` | עצמאי; משמש לאימות ולחידוש session. |
| `VerseSongSeries` | סדרת Verse-Song. | `name`, `description`, `thumbnail`, `cover_image`, `accent` | `VerseSongEpisode.series_name` מפנה אליה בשם. |
| `VerseSongEpisode` | פרק בסדרת Verse-Song. | `series_name`, `title`, `verse_ref`, `duration_label`, `duration_seconds`, `audio_url`, `audio_key`, `thumbnail`, `episode_order` | קשור לסדרה לפי שם; מוזן בנגן הגלובלי. |

## 5.4 קשרים מרכזיים

ה־Entity JSON אינם מגדיר Foreign Keys. רוב הקשרים הם קשרים לוגיים המיושמים באמצעות natural keys:

```text
Bible book number
├── KjvPlusChapter
├── LugandaChapter
├── BibleVerse
├── BookIntro
├── ChapterIntro
├── PrayerPassage
├── CrossReference
├── StudyMark
└── StudyAnnotation

Prayer title
└── PrayerSaved

Devotional code
└── DevotionalProgress

ReadingPlan.day
└── Reading.plan_day

Revelation.id
└── Revelation.parent_id

VerseSongSeries.name
└── VerseSongEpisode.series_name
```

### מפתחות טבעיים מומלצים

| תחום | מפתח מומלץ |
|---|---|
| פרק מתורגם | `book_number + chapter` |
| פסוק | `book_number + chapter + verse` |
| מבוא פרק | `book_number + chapter` |
| מבוא ספר | `book_number` |
| תפילת פרק | `book_number + chapter + verse + verse_end` |
| הפניה בין-פסוקית | פסוק מקור + פסוק יעד + סוף יעד |
| דיביוני | `code` |
| התקדמות דיביוני | `owner_email + devotional_code` |
| קריאה | `owner_email + book + chapter + translation` |
| סימניית פסוק | `owner_email + mark_type + book_number + chapter + verse` |
| הערת טקסט | בהתאם ל־`annotationKey` ב־`studyAnnotations.js` |
| Strong’s | `normalizeStrongCode(code)` |
| התקדמות Q&A | מזוהה לפי `status` ולא לפי key יחיד |

## 5.5 הרשאות מוצהרות

| קבוצת הרשאות | יכולות אופייניות |
|---|---|
| `*` | קריאה ציבורית של תוכן כמו Prayer, Devotional, Insight, Commentary, Verse of the Day, ReadingPlan, LiveSession ו־Verse Songs. |
| `authenticated` / `user` | יצירה ושינוי של רשומות אישיות כגון Reading, StudyMark, JournalEntry, DevotionalProgress ו־PrayerSaved; במקרים מסוימים גם DiscussionThread. |
| `owner`, `admin` | ניהול תוכן, רשומות מנהל ו־ActivityLog. |
| יצירה ציבורית מוגבלת | `ContactMessage` ניתן ליצירה גם על ידי מבקר. |
| יצירת Q&A | נדרשת התחברות. |

### מגבלה חשובה

ברוב ה־Entities של נתוני קורא אין תנאי access חזק כזה של `owner_email = current_user`. הסינון מתבצע ברוב המקרים ב־JavaScript בלבד. משמעות: יש להניח שכל משתמש מאומת עשוי לראות רשומות של משתמשים אחרים אם הוא מבצע קריאה ישירה מול Entity SDK.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 התחברות קורא

1. המשתמש נכנס ל־`/Login`.
2. טופס `Login.jsx` קורא ל־`fse2.auth.login(email, password)`.
3. בהצלחה מופנה המשתמש ל־`Dashboard`.
4. `AuthProvider` מרענן את מצב המשתמש דרך `fse2.auth.me()`.
5. רשומות אישיות נטענות עם `enabled: !!email`.
6. ב־Logout מתבצע `fse2.auth.logout`, ואז חזרה ל־Home.

### Debug

- בדוקו את `user.email`.
- ודאו ש־query key כולל את ה־email, למשל:
  - `["readings", email]`
  - `["studyMarks", email]`
  - `["journalEntries"]`
- שימו לב: חלק מה־queries אינם כוללים את ה־email ב־key, ולכן שינוי משתמש עלול להחזיר cache ישן.

## 6.2 בחירת ספר ופרק

1. `BibleReader` מציג את `BookGrid`.
2. המשתמש מחפש לפי שם או קיצור.
3. בחירת ספר מעדכנת את `ChapterSelector`.
4. `ChapterGrid` מציג את כל פרקי הספר.
5. לחיצה על פרק:
   - מנווטת ל־`/Chapter`.
   - מעבירה `book` ו־`chapter` ב־query string.
   - מעבירה `lang=lu` כאשר נבחרה לוגנדה.
6. הדף קורא את הפרק דרך `fetchChapter`.
7. `fetchChapter` מנסה למצוא:
   - עותק מקומי.
   - עותק מותקן ב־Entity.
   - מקור חי דרך function/API.
8. הפרק נטען ל־state ומוצג לפי פסוקים.

### מקרים מיוחדים

- ספר עם פרק אחד יכול להיחשב חריג ב־`bible-api.com`.
- KJV+ מזוהה לפי קודי `(G1234)` או `(H1234)`.
- הגרסה הפעילה נשמרת ב־`lib/versions.js` וב־local storage.
- כניסה לרשת חיונית יכולה להשתמש בעותק ה־offline.

## 6.3 קריאת פרק ופעולות קורא

### זרימת טעינה

1. `Chapter.jsx` קורא את פרמטרי ה־URL.
2. מאתר את הספר ואת הפרק.
3. טוען את פרק המקרא.
4. טוען במקביל או בעקבות:
   - הפניות הפרק.
   - תפילות הפרק.
   - מבוא פרק.
   - תובנות.
   - הערות הקורא.
   - התקדמות קריאה.
5. מציג את הפסוקים ואת הפאנלים.

### אירועי קריאה

- פתיחת פרק יכולה ליצור `ReadingActivity` מסוג `chapter_visit`.
- סיום פרק יכול ליצור או לעדכן `Reading`.
- אם הפרק תואם לתוכנית, `plan_day` נסגר.
- פעולות highlight, bookmark ו־note יכולות ליצור גם `ReadingActivity`.

## 6.4 הדגשת פסוק והערת פסוק

1. המשתמש בוחר פסוק.
2. `VerseActionBar` מציג את פעולות הפסוק.
3. בחירת צבע יוצרת `StudyMark` עם:
   - `mark_type=highlight`
   - `color`
   - מיקום הפסוק
4. שמירת סימנייה יוצרת `mark_type=bookmark`.
5. הוספת הערה יוצרת `mark_type=note` ו־`note_text`.
6. ה־`BibleNotes` מציג את הרשומות לפי בעלות.
7. מחיקה מוחקת את הרשומה.

### Debug

- בדוקו שהמספרים ב־`book_number`, `chapter`, `verse` מספריים.
- בדוקו שה־color תואם ל־id מוגדר.
- אין כרגע אילוץ ייחודי ב־Entity schema, ולכן כפילויות אפשריות אם קוד הלקוח רץ במקביל.

## 6.5 הדגשת טקסט חופשי

1. `AnnotatedText` מקבל טקסט ו־annotations.
2. הוא מחשב את כל נקודות הגבול:
   - תחילת וסוף ה־offset של כל הערה.
   - גבולות קודי Strong’s.
3. הטקסט מפוצל ל־segments.
4. כאשר המשתמש בוחר טקסט:
   - מופיעה סרגל כלים.
   - ניתן לבחור highlight או underline.
5. נשמרת רשומת `StudyAnnotation`:
   - `section`
   - `block_id`
   - `kind`
   - `color`
   - `start_offset`
   - `end_offset`
6. ההערה נשמרת גם מקומית ב־IndexedDB.
7. בטעינה הבאת, server ו־local ממוזגים לפי `annotationKey`.

### הערת debug חשובה

ה־offsets תלויים בטקסט המדויק. שינוי במקור הטקסט, בתרגום או ב־normalization עלול להזיז את ההדגשה.

## 6.6 תפילה המתאימה לפסוק

1. `PassagePrayer` מקבל את ספר, פרק ופסוק.
2. `fetchPublicCollection("prayers")` טוען את הספרייה.
3. `matchesPassage` בודק אם ההפניה מתאימה:
   - פסוק בודד.
   - טווח.
   - פרק שלם.
4. תוכן מיובא מ־`PrayerPassage` משתלט על תוכן גנרטיבי.
5. המשתמש יכול:
   - להחליף שפה.
   - להדגיש טקסט.
   - לפתוח פסוק מתוך התפילה.

## 6.7 הפניות בין-פסוקיות

1. הפעולה “Cross-reference” פותחת `VerseCrossRefs`.
2. הפניות מתקבלות מ־`PrayerPassage` או מ־מאגר `crossRefs`.
3. `CrossRefScripture`:
   - משתמש בטקסט המצורף להפניה כאשר קיים.
   - אחרת טוען את פרק היעד באמצעות `fetchPlainChapter`.
4. לחיצה על הפניה:
   - סוגרת popup, אם קיים.
   - עוברת ל־`Chapter` עם מיקום מדויק.

## 6.8 פתיחת פסוק ללא עזיבת המסך

1. רשימת מבנה הספר או פסוקי מפתח מזהים הפניה.
2. `parseReference` ממיר אותה ל:
   - מספר ספר.
   - פרק.
   - פסוק ואולי סוף טווח.
3. `VersePopup` טוען את הפרק דרך `fetchChapter`.
4. הפסוק או הטווח מוצגים בתוך modal.
5. ניתן לסמן גם את הטקסט שנפתח.

## 6.9 פעולת Strong’s

1. `StrongsText` מזהה קודים בתבנית `(G1234)` או `(H1234)`.
2. הקוד מוצג כ־superscript כחול.
3. לחיצה עליו פותחת `StrongsPopup`.
4. המילון נטען מהמקור המקומי/offline או מה־Entity.
5. אם ההגדרה חסרה, מתבצעת שאילתה חיה או אחסון ב־cache.
6. ההגדרה נשמרת גם ב־IndexedDB לשימוש עתידי ללא רשת.
7. `normalizeStrongCode` מאחד קודים כגון `H0436` ו־`H436`.

## 6.10 ניהול תוכן גנרי

1. המנהל נכנס דרך `/Admin`.
2. `adminSession` מנסה תחילה server function.
3. אם ה־gateway אינו זמין, הוא עובר ל־`adminDirect`.
4. `AdminDashboard` מאפשר לבחור אוסף.
5. `CollectionsPanel` קורא את metadata מ־`adminCollections.js`.
6. רשומות נטענות דרך:
   - `callAdminData("list", { entity, limit: 500 })`
   - או `adminDirectCall`.
7. הוספה או עריכה מציגה `RecordEditor`.
8. הטופס נבנה מתוך `fields` בצורה:
   - `[name, label, type]`.
9. מחיקה דורשת אישור ב־`ConfirmDialog`.
10. לאחר שינוי מופעלת טעינה מחדש של הרשימה.

### שגיאות נפוצות

- `meta` אינו קיים עבור entity שלא נוספה ל־`COLLECTIONS`.
- שדה חסר ב־metadata לא יוצג בטופס.
- יש לוודא שה־entity קיים ב־`entities/` ובפלטפורמה.
- `limit=500` עלול להציג רשומות חתוכות באוספים גדולים.

## 6.11 ייבוא JSON כללי

1. המשתמש בוחר קובץ.
2. `JsonImportPanel` קורא ומנרמל את ה־JSON.
3. שמות collection יכולים להגיע באמצעות aliases.
4. הקובץ מוצג בpreview.
5. רשומות מיובאות ב־collection לפי natural key.
6. רשומה קיימת מתעדכנת; רשומה חדשה נוצרת.
7. מוצג דוח של יצירות ועדכונים.

### תבנית כללית

התבנית כוללת:

- `metadata`
- `Prayer`
- `Devotional`
- `BibleVerse`

ומתאימה aliases כגון:

- `prayer`, `prayers`, `passage`, `passages`
- `devotional`, `devotionals`
- `verse`, `verses`, `bible_verse`

## 6.12 ייבוא תפילות והפניות לפי ספר

1. `PrayerCrossRefImport` טוען קובץ של ספר אחד.
2. `readImportedContent` קורא את הקובץ.
3. `validatePrayerFile` בודק:
   - מבנה הקובץ.
   - קיום שדות בסיסיים.
   - תקינות הפניות.
   - נוכחות תוכן בשתי השפות כשנדרש.
4. כל שגיאה מוצגת עם שיוך לרשומה.
5. כל עוד קיימת שגיאה אחת, הייבוא אינו מופעל.
6. `importPrayerFile` כותב במקביל או בסדר את:
   - `PrayerPassage`.
   - `CrossReference`.
   - `ChapterIntro`.
   - `BookIntro`.
7. ה־upsert מתבצע לפי natural key.
8. הייבוא האותו קובץ שוב מעדכן רשומות ואינו יוצר כפילויות.

## 6.13 ייבוא קובץ ספר מלא

קובץ הספר מכיל את:

- מבוא הספר.
- פרקים ופסוקים.
- מבואות פרקים.
- תפילות פסוק.
- הפניות בין-פסוקיות.

`bookFileCollections` מזהה את המבנה, ו־`expandBookFile` מפרק אותו לאוספים תקניים. לאחר מכן אפשר להזין אותו דרך:
- `JsonImportPanel`.
- `PrayerCrossRefImport`.
- `CollectionsPanel` לאחר פירוק ידני.

## 6.14 התקנת לוגנדה

1. המנהל נכנס למקטע “Luganda Bible”.
2. `LugandaInstaller` מבצע `ensureFreshAdminToken`.
3. ה־token נשלח ל־`fse2.functions.invoke("lugandaInstall", ...)`.
4. הפונקציה קוראת את הפרקים הקיימים בפועל.
5. היא מורידה רק פרקים חסרים.
6. הפרק מנוקה ונשמר ב־`LugandaChapter`.
7. הכיסוי מתעדכן ב־`ChapterCoverage`.
8. אם רב הפרקים כבר קיימים, נעצרת הרצה נוספת כדי לא לעמעם את המקור.
9. פרק שנכשל ינסה שוב בהרצה הבאה.

## 6.15 התקנת KJV+ ו־Strong’s

1. `KjvPlusInstaller` מרענן את ה־admin session.
2. `kjvInstall` מוריד פרק KJV+ מהמקור הציבורי.
3. קודי Strong’s נשמרים בתוך טקסט הפסוקים.
4. הפרק נשמר ב־`KjvPlusChapter`.
5. בניית המילון מפרקת את המקור לקודי Greek ו־Hebrew.
6. כל קוד נשמר ב־`StrongEntry`.
7. קוד שחסר משלים מהמילון החי.
8. `LibraryReport` מריץ audit ומציג:
   - כמה פרקים מותקנים.
   - אילו פרקים חסרים.
   - אילו פרקים פגומים.
   - האם מספרי הפסוקים תואמים בין התרגומים.
   - כמה קודי Strong’s מוגדרים.

## 6.16 התקנה אוטומטית

`cron/scriptureInstall.js` מתוזמן לכל שעה.

### עקרונות

- קודם בודקים מה כבר קיים במסד.
- מורידים רק פרקים חסרים.
- פרק שהצליח מתווסף למסד.
- פרק שנכשל נשאר חסר.
- אם הרצה לא הפיקה שום פרק, מפסיקים.
- אין צורך לשמור מצב מתמשך בין הרצות.

## 6.17 הורדת תוכן ל־Offline

1. המשתמש נכנס ל־`Offline`.
2. בוחר תרגום או סוג תוכן.
3. המערכת מורידה את הנתונים דרך ה־API או entities.
4. הנתונים נשמרים ב־IndexedDB.
5. בסיום מחושבים נפח וכמויות.
6. `BibleReader` בודק אם כל פרקי הספר קיימים לפני שהוא מסמן את הספר כזמין offline.
7. בקריאה, `fetchChapter` יכול להשתמש בעותק המקומי.
8. מחיקת המרכז מוחקת את הנתונים המקומיים.

### Stores עיקריים

- `chapters`
- `verses`
- `devotionals`
- `commentary`
- `prayers`
- `prayerPassages`
- `crossReferences`
- `chapterIntros`
- `strongs`
- `meta`
- `highlights`
- `bookmarks`
- `notes`
- `annotations`

## 6.18 דיביוני, התקדמות ותוכנית קריאה

1. המשתמש פותח דיביוני.
2. הדיביוני נשמר מקומית ב־`doneDevotionals` למשתמש מחובר.
3. למשתמש מחובר נשמרת גם רשומת `DevotionalProgress`.
4. סיום פרק יוצר `Reading`.
5. `findPlanDay` מזהה אם הפרק תואם לתוכנית.
6. ה־`plan_day` נסגר.
7. `Dashboard` מחשב streak מתוך תאריכי הקריאה.

## 6.19 יומן תפילה

1. המשתמש יוצר רשומה דרך `JournalForm`.
2. ניתן להתחיל גם ישירות מפרק עם `?new=1`.
3. נשמרים:
   - כותרת.
   - גוף.
   - קטגוריה.
   - ספר ופרק.
   - תאריך.
   - מצב רוח.
4. `JournalCard` מציג את הרשומה.
5. עריכה טוענת את הערכים מחדש לטופס.
6. מחיקה דורשת אישור.
7. הרשומות מסוננות לפי המשתמש והקטגוריה.

## 6.20 קהילה  -  חשיפות ותגובות

### פרסום חשיפה

1. משתמש לא מחובר מופנה ל־Login.
2. משתמש מחובר מזין כותרת, פסוק וגוף.
3. נשמרת רשומת `Revelation` ללא `parent_id`.
4. הפיד מתעדכן דרך invalidation של query.

### תגובה

1. תגובה נשמרת כ־`Revelation` נוספת.
2. `parent_id` מקבל את מזהה החשיפה.
3. המסך מסנן רשומות עם `parent_id` כתגובות.

### לייק

- מספר הלייקים נשמר בשדה `likes`.
- ה־UI מציג עדכון מקומי מיידי.
- עדכון רשומה יכול להיות תנודתי אם שני משתמשים מלייקים במקביל.

## 6.21 קבוצות דיון

1. `DiscussionGroups` טוען קבוצות והודעות.
2. המשתמש בוחר קבוצה.
3. הצטרפות נשמרת מקומית ב־`joinedGroups`.
4. הודעה נשמרת ב־`DiscussionThread`.
5. `ThreadMessages` מציג את ההודעות ומאפשר לשלוח חדשה.

## 6.22 נגן האודיו הגלובלי

1. `VerseSongs` או `VerseSongSeries` בונים מערך של tracks.
2. `playQueue` מעביר את התור ל־`PlayerProvider`.
3. `PlayerProvider` יוצר אובייקט `Audio` אחד ברמת האפליקציה.
4. האודיו ממשיך לנגן בעת מעבר בין דפים.
5. הנגן תומך:
   - play/pause.
   - seek.
   - skip.
   - next/previous.
   - shuffle.
   - repeat off/all/one.
   - speed.
   - volume.
   - expanded sheet.
6. שגיאת טעינת אודיו מוצגת למשתמש.

## 6.23 שיתוף

1. רכיבי השיתוף מרכיבים טקסט ו־URL.
2. `ShareSheet` מחבר את הפסוק, התרגום הנוסף, התפילה וההפניות.
3. `copyToClipboard` מנסה להעתיק ל־Clipboard API.
4. ערוצים כגון WhatsApp ו־Telegram מקבלים טקסט ו־קישור.
5. ערוצים שמקבלים קישור בלבד מקבלים גם את הטקסט להדבקה ידנית.
6. `ShareRow` מציג משוב “Copied” למשך כשני שניות.

## 6.24 Theme ו־PWA

1. `BRAND_CSS` מגדיר את ערכי ברירת המחדל.
2. `ThemeProvider` קורא `SiteSettings` כשמשתמש מחובר.
3. ערכים תקינים מעדכנים משתני CSS.
4. גוונים עמוקים/רכים נגזרים אוטומטית מהצבע שנבחר.
5. `PwaHead` מוסיף metadata ו־manifest.
6. ה־Service Worker שומר את ה-app shell.
7. `InstallPrompt` מנהל את ה־`beforeinstallprompt`.
8. לאחר שינוי באסטרטגיית cache יש להגדיל את גרסת cache ב־`public/sw.js`.

---

# 7. הערות טכניות לפיתוח

## 7.1 ספריות וטכנולוגיות

| טכנולוגיה | שימוש |
|---|---|
| **React** | רכיבי UI, state מקומי, Context ו־hooks. |
| **React Router DOM** | ניתוב בין דפים, שאילתות URL ו־redirects. |
| **TanStack React Query** | אחסון ומטמון server state, mutations ו־invalidation. |
| **Lucide React** | סמלי ממשק אחידים. |
| **date-fns** | תאריכים, תאריכים יחסיים ורצף קריאה. |
| **FSe2 SDK** | Auth, Entity CRUD ו־Serverless Function invocations. |
| **IndexedDB** | אחסון offline והערות מקומיות. |
| **Service Worker API** | PWA, app-shell cache ו־runtime cache. |
| **Web Crypto / SHA-256 JS** | אימות וחתימת session. |
| **Native Audio API** | נגן אודיו גלובלי. |
| **CSS custom properties** | ערכי מותג ו־theme דינמיים. |
| **Tailwind-generated utilities** | שכבת utility מוגברת למסכים חדשים יותר ולקוד ישן. |

## 7.2 דפוסים חוזרים

### Server state מול client state

- `TanStack Query` משמש לנתוני שרת.
- `useState` משמש למצב ממשק זמני כגון טקסט טופס, סינון ומודאל.
- `Context` משמש רק עבור state שחייב לחלוץ על כל העץ:
  - Auth.
  - Theme.
  - Player.
- `localStorage` משמש להעדפות קטנות ו־session.
- `IndexedDB` משמש לנתונים גדולים או offline.

### Schema-driven forms

ה־CMS אינו בונה טופס נפרד לכל entity. `adminCollections.js` הוא מקור האמת:

```text
[name, label, type]
```

המספרים `name` ו־`label` חייבים להתאים לשדות ה־Entity.

### Natural keys ו־upsert

ייבוא אינו מבצע “append בלבד”. לפני כתיבה הוא מחפש רשומה קיימת לפי key עסקי ומעדכן אותה. חשוב לשמור על אותו פורמט key בכל מסלולי הייבוא.

### Fallback content

המערכת מעדיפה נתונים חיים אך שומרת תוכן מובנה. כאשר מוסיפים collection חדש, כדאי לשאול:

1. האם הוא מופיע ב־`seedContent`?
2. האם יש לו static fallback מוכן?
3. האם אי־כשל בטעינה אמור להציג מסך ריק או תוכן חלופי?

### Query invalidation

לאחר create/update/delete יש לבצע invalidate מתאים. לדוגמה:

- `prayers`
- `devotionals`
- `insights`
- `revelations`
- `discussion-threads`
- `readingPlan`

אין כרגע query key מרכזי אחד לכל ה־Entity, ולכן קיימת סיכון ל־cache לא עקבי.

## 7.3 מה חשוב לדעת בעת הוספת פיצ’ר

### הוספת שדה ל־Entity

יש לעדכן:

1. `entities/<Entity>.json`.
2. `lib/adminCollections.js`  -  metadata וסוג השדה.
3. `normalisePayload` או normalizer רלוונטי.
4. ולידציית ייבוא.
5. רכיבי קריאה שמציגים את השדה.
6. מסכי admin ודוחות, אם השדה צריך להיות ניתן לעריכה.
7. IndexedDB ומיגרציה, אם השדה נשמר offline.

### הוספת collection

יש להוסיף:

1. קובץ ב־`entities/`.
2. רשומה ב־`COLLECTIONS`.
3. reader ב־`contentApi`.
4. alias ושדות ב־`JsonImportPanel`.
5. תצוגה ציבורית או admin.
6. seed/fallback אם התוכן חייב להופיע תמיד.

### הוספת דף

יש להוסיף:

1. `pages/<PageName>.jsx`.
2. רישום הנתיב במנגנון הניתוב של הפלטפורמה.
3. קישור מ־Header, Footer או Home.
4. טיפול ב־loading, error ו־empty state.
5. חיבור ל־`createPageUrl`.

### הוספת מקטע מחקר

יש לקבוע:

1. חללן state.
2. block ID יציב להערות.
3. מקור fallback.
4. query key ייחודי.
5. האם הוא נשמר ב־`StudyAnnotation` או רק מוצג.
6. התנהגות במובייל ובמסך רחב.

### הוספת תרגום

יש לעדכן:

1. `lib/versions.js`.
2. Entity או storage עבור פרקי התרגום.
3. פונקציית התקנה.
4. `bibleApi`.
5. `VersionPicker`.
6. `Offline`.
7. `scriptureAudit`.
8. Cron, אם התרגום צריך להותקן אוטומטית.
9. זיהוי שפה והתאמת fallback.

### הוספת מילון Strong’s חדש

יש לשמור על:

- פורמט `G/H + מספר`.
- `normalizeStrongCode`.
- key יחיד ב־`StrongEntry`.
- cache offline.
- fallback חיה.
- חיבור לגלילת המסך.

## 7.4 מפתחות Debug מקומיים

### Local Storage

| Key | מטרה |
|---|---|
| `pr_admin_token` | token של מנהל. |
| `pr_admin_mode` | `server` או `direct`. |
| `fse2_app_id` | מזהה האפליקציה. |
| `fse2_app_token_<appId>` | token של הפלטפורמה. |
| `fse2_token` / `fse2_app_token` | fallbacks. |
| `doneDevotionals` | דיביוניים שהושלמו מקומית. |
| `joinedGroups` | קבוצות שאליהן הצטרפ המשתמש מקומית. |
| `savedInsights` | תובנות שנשמרו מקומית. |
| מפתחות Theme | העדפות ערכת נושא ושמות מותג. |

### IndexedDB

- שם: `prayread-offline`
- גרסה נוכחית: `8`
- עיין ב־Application → IndexedDB → `prayread-offline`.
- ריקון את ה־DB מוחק תוכן offline, אך לא בהכרח נתוני שרת.

### Service Worker

- `prayread-shell-v2`
- `prayread-runtime-v2`

בעת בעיית cache יש לבדוק:
1. האם גרסת ה־cache התעדכנה.
2. האם ה־SW הושבע מ־`PwaHead`.
3. האם הנתיב המבוקש נמצא ב־SHELL.
4. האם network-first מחזיר שגיאה שמוחקת או מחליפה cache.

### React Query

מפתחות שימושיים לבדיקה:

- `["insights", kind]`
- `["prayers"]`
- `["commentary"]`
- `["readingActivity", email]`
- `["studyMarks", email]`
- `["readings", email]`
- `["devotionalProgress", email]`
- `["prayerSaved", email]`
- `["journalEntries"]`
- `["readingPlan"]`
- `["revelations"]`
- `["discussion-groups"]`
- `["discussion-threads"]`
- `["live-sessions"]`
- `["verseSongSeries"]`
- `["verseSongEpisodes"]`

## 7.5 סיכונים טכניים שדורשים טיפול

### סיכון קריטי: סיסמת מנהל ו־reset key קבועים

ב־`functions/adminAuth.js` קיימים:
- כתובת מנהל ברירת מחדל.
- סיסמת ברירת מחדל.
- reset key ברירת מחדל.

אין להשאיר אותם בקוד בסביבת ייצור. יש להגדיר אתם כ־environment secrets, להחליף את הערכים בהתקנה הראשונה ולבצע rotation.

### Hashing של סיסמאות

המערכת משתמשת ב־SHA-256 עם salt. SHA-256 אינו password hashing function ואינו איטי. יש להעביר ל־Argon2id, scrypt או bcrypt עם עליות עבודה מותאמת.

### הרשאות ברמת רשומה

מספר Entities מאפשרים לכל משתמש מאומת לקרוא או לעדכן רשומות של משתמשים אחרים. דרושים תנאי access מבוססי `owner_email` או הגבלת writes ברמת ה־function.

### Admin direct mode

המסלול הישיר נותן לדפדפן גישה גבוהה ל־Entity SDK. יש לוודא:

- שהמשתמש המחובר הוא בעל תפקיד מנהל.
- שה־Entity SDK אינו מאפשר קריאת `AdminAccount` למשתמש רגיל.
- שההרשאות מוגבלות לפי ה־collection שנבחר.
- שאין חשיפת hash, salt או secret לדפדפן.

### אורך חיי session

ה־grace period של 14 ימים אינו מתאים כברירת מחדל לפעילות ניהול רגישה. מומלץ להפחית את ה־grace, להגביל renewal rate ולבטל token על שינוי סיסמה או `session_version`.

### `limit=500`

מספר פאנלים קוראים עד 500 רשומות בלבד. באוספים גדולים זה יכול:

- להסתיר רשומות.
- לשבור חיפוש.
- לגרום למחיקה או עדכון של רשומה שנעלמה מהרשימה.

יש להוסיף pagination ברמת API ולא רק ברמת התצוגה.

### סינון בעלות אחרי limit

בכמה מסכים מבוצעת רשימה מוגבלת לפי תאריך ורק אז מסננים לפי `owner_email`. כאשר פעילות של משתמשים אחרים תופסת את המקסימום, המשתמש עלול לראות פחות רשומות משלו.

### אין אילוץ ייחודיות ב־Entity schema

ה־JSON אינו מכיל אינדקסים או unique constraints. מפתחות טבעיים מיושמים בקוד, ולכן:

- ייבוא מקביל עלול ליצור כפילויות.
- עדכון ידני עלול לשבור key.
- אין ערובה ש־database עצמו ישמור על ייחודיות.

### עיבוד HTML ממקורות חיצוניים

המתקנים מפרקים HTML של מקורות ציבוריים. שינוי markup יכול לשבור parsing. כדאי להוסיף fixtures לכל פורמט מקור ולהריץ smoke test לפני התקנה.

### תלות ב־CORS proxies ו־מקורות חיצוניים

ה־Strong’s, Wordplanet ומקורות אחרים עשויים לשנות מבנה, להגביל גישה או להפיל. יש להשאיר מנגנון fallback ולא להסתמך על proxy יחיד.

### קבצי seed ו־live content

חלק מהמסכים ממזגים seed עם נתונים חיים לפי כותרת. כותרות עם casing, whitespace או ניסוח שונה עלולות ליצור כפילות תצוגה.

### `PrayerSaved` לפי כותרת

שמירת תפילה לפי `prayer_title` מרכזת שתי תפילות בעלות כותרת זהה. עדיף להשתמש ב־ID או natural key יציב.

### עדכון ספירת לייקים

`likes` הוא מספר, ולא counter אטומי. עדכון מקביל עלול לאבד לייקים. אפשר להשתמש ב־entity action/transaction או ב־increment אטומי.

### Service Worker stale

שינוי ב־`public/sw.js` לא יגרום למשתמשים קיימים לקבל cache חדש אוטומטית. יש להגדיל את שם ה־cache ואת גרסת ה־SW.

### Tailwind generated

`__generated/tailwind.css` אינו מכיל בהכרח כל class שנוסף בעתיד. שימוש ב־class חדש דורש יצירה מחדש של הקובץ, ולא עריכה ידנית.

## 7.6 סיכון איכות נתונים

- `compressChapters` אינו מסיר כפילויות; רשימה כגון `[2,2]` עלולה להפוך ל־`2-2`.
- הוספת cross-reference ב־`CrossRefEditor` מונע כפילות case-insensitive, אך הסרה משווה ב־case-sensitive.
- תוכן chapter ו־verses נשמר כ־JSON בתוך שדה string. יש לוודא decode עקבי ולהימנע משינוי format ללא migration.
- אין validation של ספר/פרק מול `bibleBooks` בכל נתיבי כתיבה.
- לא כל השדות המסומנים `required` ב־Entity מקבעים בפועל אימות בטופס admin.
- ה־`safeText` מונע הצגת אובייקטים לא־פרימיטיביים, אך אינו sanitizer של HTML. אין להשתמש ב־`dangerouslySetInnerHTML` בלי sanitization מוכר.

## 7.7 בדיקות מומלצות לפני שחרור

### מסלול קורא

- קורא מחובר ולא מחובר.
- אנגלית, לוגנדה ומצב דו־לשוני.
- KJV רגיל ו־KJV+.
- קריאה עם רשת וללא רשת.
- הדגשת פסוק וטקסט.
- מחיקת הערה.
- פתיחת פסוק בתוך popup.
- פתיחת הפניית cross-reference.
- לייק ותגובה.

### Admin

- כניסה דרך server mode.
- כניסה דרך direct mode כאשר ה־gateway סגור.
- חידוש token באמצע עבודה ארוכה.
- list/create/update/delete.
- טופס refs.
- אישור מחיקה.
- ייבוא קובץ תקין.
- ייבוא קובץ כפול  -  חייב להתעדכן ולא ליצור כפילויות.
- ייבוא עם שגיאה  -  אסור לכתוב חלקית.
- בדיקת audit לאחר התקנה חלקית.

### PWA

- install ב־Chrome/Android.
- הוראות iOS.
- טעינה ראשונה ללא רשת.
- ניתוב בין דפים ללא רשת.
- ניקוי cache והתקנה מחדש.
- עדכון SW לאחר deploy.

## 7.8 סדר עבודה מומלץ לפיתוח Feature חדש

1. זהה אם הנתונים הם:
   - תוכן ציבורי.
   - נתוני משתמש.
   - נתוני offline.
   - נתוני admin.
2. בחר entity או static content.
3. קבע natural key.
4. הוסף schema ו־metadata.
5. הוסף normalization ו־validation.
6. הוסף read/write path.
7. הוסף fallback.
8. הוסף UI.
9. הוסף invalidation.
10. בדוק offline.
11. בדוק הרשאות.
12. בדוק import ו־upsert.
13. בדוק mobile ו־keyboard navigation.
14. עדכן תיעוד ו־release notes.

---

## סיכום למפתח

המערכות המרכזיות שחשוב להבין הן:

1. **המקרא** מוגש מתוך מספר מקורות ומתאים את עצמו ל־offline.
2. **ה־CMS** מבוסס metadata ו־natural keys, ולא טפסים נפרדים לכל entity.
3. **הייבוא** אינו צריך להיות אידמפוטנטי; הוא אמור לעדכן רשומות קיימות.
4. **ההתקנות** מבוססות על בדיקת מצב אמיתי במסד הנתונים, ולא על מוניטר שמתעדם.
5. **נתוני הקורא** נשמרים בעיקר לפי `owner_email`, אך רמת ההרשאה ב־Entity עדיין דורשת חיזוק.
6. **ה־offline** הוא IndexedDB; ה־Service Worker הוא רק שכבת ה-app shell.
7. **התוכן המובנה** הוא fallback, לא מקור אמת סופי, ויש להבטיח שה־seed מתעדכן כאשר מוסיפים content.
8. **ה־admin authentication** הוא הנקודה הרגישה ביותר במערכת ודורש החלקה מיידית של סודות ברירת המחדל ושיפור password hashing והרשאות.
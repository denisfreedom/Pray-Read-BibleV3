# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
<think>
We need craft Hebrew comprehensive. Huge scope. Need infer routes exact URL via createPageUrl unknown. Likely /PageName perhaps. Need mention inferred and verify utils absent. We have pages list. Need cover every page, components maybe all current not trash? User says each file created, section examples. We can organize current production files, entities. Detailed but not absurd. Need identify routes names from createPageUrl likely "/BibleReader". Could caveat generated aliases. We can state URL likely /PageName based manifest and links, must verify utils. Yet request exact. Maybe createPageUrl formats /Name. AdminDashboard etc.

Need include pages 34 and components many. We can group components by domain but "לכל קובץ" asks each. Need name exact, role/render. Also lib/functions not explicitly template but section 4 perhaps all architecture files. High detail limited token. We have 32k token output possible likely. Aim ~14k Hebrew words? Desired 5. Let's structure.

First system essence.

Pages list:
About /About
Admin /Admin
AdminDashboard /AdminDashboard
BibleNotes
BibleReader
Chapter
Community
CommunityLiveTeaching
CommunityRevelations
Contact
Dashboard
Devotionals
DiscussionGroups
ForgotPassword
HistoricalInsights
Home
InstallPrompt
Journal
Login
Logout
Offline
Plan
PrayerLibrary
Privacy
QA
ResetPassword
Signup
Terms
TheologicalInsights
VerseOfDay
VerseSongSeries
VerseSongs
Possibly hidden /Dashboard and home duplicate Dashboard rendering. Mention.

Nav actions table detailed 40 rows.

Components current list 45ish. Need describe.

Entities all 25.

Technical architecture.

Let's formulate in Hebrew. Ensure caveat code excerpts truncated means inferred behavior where needed. Mention no router map included, URLs inferred createPageUrl and manifest. This is important.

Need perhaps dependencies: React, react-router-dom, TanStack Query, lucide-react, date-fns, fse2 client. Tailwind generated utilities but brand CSS own.

Auth two systems: user Auth and admin custom. Permissions.

Bible flow.

Let's write robust.

No need tools.
</think>
# תיעוד מערכת Pray-Read Bible

## הערה מתודולוגית

התיעוד מבוסס על הקוד שסופק. חלק מהקבצים נחתכו באמצע, ולכן התיאור מתמקד במבנה, באחריות, בזרימי הנתונים ובהתנהגות הנראית מהקוד שסופק.

קובץ `utils` שמגדיר את `createPageUrl` לא נ included במלואו. לפי השימושים הקיימים באפליקציה:

- הנתיב הבסיסי של דף הוא בסגנון `/PageName`.
- פרמטרים מועברים באמצעות מחרוזת שאילתה, למשל:  
  `/Chapter?book=43&chapter=3&lang=lu`
- שמות הנתיבים המדויקים מוצגים בהמשך, אך יש לאמת אותם מול `utils` או מול מפת הניתובים בפרויקט.

שמות העמודים הם:

```text
/About
/Admin
/AdminDashboard
/BibleNotes
/BibleReader
/Chapter
/Community
/CommunityLiveTeaching
/CommunityRevelations
/Contact
/Dashboard
/Devotionals
/DiscussionGroups
/ForgotPassword
/HistoricalInsights
/Home
/InstallPrompt
/Journal
/Login
/Logout
/Offline
/Plan
/PrayerLibrary
/Privacy
/QA
/ResetPassword
/Signup
/Terms
/TheologicalInsights
/VerseOfDay
/VerseSongSeries
/VerseSongs
```

---

# 1. מהות המערכת

## 1.1 מה המערכת עושה?

Pray-Read Bible היא אפליקציית React לקריאת התנ"ך, לימוד המקרא, התפילה והתוכן הנוצר על ידי הקהילה. היא משלבת:

- קריאת כל ספרי התנ"ך, בעברית ובלוגנדה.
- התקנה מקומית של תרגומים לקריאה במצב לא מקוון.
- KJV עם מספרי Strong.
- מילון מקומי למספרי Strong ביוונית ובעברית.
- מערכת לימוד לכל פרק: מבוא, פירוש, תפילה, תובנות תיאולוגיות והיסטוריות.
- סימון טקסט, הדגשות, קווי תחתון, סימוני מילים וציוני מקרא.
- יומן תפילה אישי.
- תוכן יומי: מטות תפילה, קיצורי יום, פרשת היום, ושירי מקרא.
- קהילה: גילויים אישיים, תגובות, הוראות חיות וקבוצות לימוד.
- לוח ניהול לעריכת תוכן, התקנת פרקי התנ"ך, ניהול משתמשים, הודעות, ערכים וצבעי מותג.
- ממשק מותאם לנייד, התקנה כ-PWA ועבודה לא מקוונית.
- נגן אודיו גלובלי שממשיך לנגן בעת ניווט בין עמודים.

## 1.2 למי המערכת מיועדת?

### קורא כתובה

הקורא הוא משתמש שאינו חייב להיות מחובר. יכול ל:

- לקרוע פרקים.
- לחפש ספרים.
- לקרוא בעברית או בלוגנדה.
- להשתמש בתוכן ציבורי.
- להתקין תרגומים לקריאה לא מקוונית.
- לשתף פסוקים ולמספים.

### קורא רשום

הקורא הרשום מקבל יכולות נוספות:

- שמירת היסטוריית קריאה.
- סימון והדגשה.
- סימוני מילים ופתקים.
- תוכן יומי משלו.
- יומן תפילה.
- שמירת מטות תפילה.
- השתפות בקהילה.
- הצטרפות לקבוצות לימוד.
- התקנת פרקים למכשיר והמשך התקדמות בין מכשירים.

### מנהל תוכן

המנהל מתחבר דרך מסך נפרד בנתיב `/Admin`, המשתמש באימות נפרד מהמערכת ויכול:

- לנהל תוכן ציבורי.
- להתקין ולתקן פרקי תנ"ך.
- לנהל משתמשים.
- לקרוא ולענות על הודעות.
- לנהל את צבעי המותג.
- לראה יומן פעילות.

### מערכת אוטומטית

ה-cron בנתיב `cron/scriptureInstall.js` מריץ משימת תחזוקה שעתית. הוא משלים את:

- פרקי התנ"ך בלוגנדה.
- פרקי KJV+.
- מילון מספרי Strong.

ההתקנה ניתנת להרצה חוזרת וממשיכה רק כאשר חלה התקדמות אמיתית.

## 1.3 הערך שהמערכת מספקת

הערך המרכזי הוא אחדות בין מקרא, לימוד, תפילה ושיתוף:

1. הקורא קורא פרק.
2. בוחר פסוק או קטע חלופי.
3. מסמן, מבקר, מוסיף הערה או משתף.
4. עובר לפירוש, לתובנה תיאולוגית או להיסטורית.
5. ממשיך לתפילה המתאימה לאותו מקום.
6. שומר התקדמות ומבקר את הקהילה.

המערכת נועדת גם לפעול כיישום בסיסי, מקומי ורב-לשוני, במיוחד בסביבות קהילות שאינן מחוברות לאינטרנט באופן קבוע.

---

# 2. עמודים ותפקידיהם

## 2.1 דפי ציבוריים

### `pages/Home.jsx`  -  `/Home`

**תפקיד:** דף הנחית הראשי של האפליקציה.

**מה מוצג:**

- Hero עם המסר המרכזי של האפליקציה.
- קיצור דרך ל-Bible Reader.
- פסוק היום.
- מומנט תפילה מהספרייה.
- רשת כניסה למוצרים המרכזיים:
  - Bible Reader.
  - Devotionals.
  - Prayer Library.
  - Verse-Songs.
  - Q&A.
  - Community.
- קישורי התקנת אפליקציה.
- כפתור תרומה.
- אזור שיתוף.

**פעולות מרכזיות:**

- מעבר לקריאת התנ"ך.
- התקנת PWA.
- שיתוף פסוק היום.
- פתיחת אזור ההתקנה.
- רישום או התחברות.

**פרטי מימוש חשובים:**

- התוכן המוצג מגיע מה-DB דרך React Query.
- כאשר אין רשומות חיות, משתמשים בנתוני `seedContent`.
- מצב התקנת האפליקציה נשמר מקומית דרך `beforeinstallprompt`.

---

### `pages/About.jsx`  -  `/About`

**תפקיד:** הצגת זהות, מטרות וערכים של Pray-Read.

**תוכן:**

- הסבר מדוע נוצרה האפליקציה.
- ערכים של קריאה איטית, מתפילה ולימוד.
- הסבר על האפליקציה ככלי אישי וקהילתי.
- קישור חזרה לדף הבית.
- אזור תמיכה או תרומה.

---

### `pages/BibleReader.jsx`  -  `/BibleReader`

**תפקיד:** מסך הכניסה המרכזי לקריאת התנ"ך.

**מבנה:**

- חיפוש ספרים באנגלית ובלוגנדה.
- לשוניות Old Testament ו-New Testament.
- רשת 66 הספרים הקנוניים.
- בחירת ספר שמובילה לרשת פרקים.
- מידע על פרקים שמותקנו מקומית.
- קישור ישיר לפרק מסוים דרך פרמטרים.

**פעולות:**

- חיפוש לפי:
  - שם אנגלי.
  - שם לוגנדה.
  - קיצור אנגלי.
  - קיצור לוגנדה.
- מעבר בין הברית הישנה לחדשה.
- בחירת ספר.
- בחירת פרק.
- זיהוי ספר שמיוצא במלואו למצב לא מקוון.
- הפעלה מחדש של אפשרויות הלימוד והצדד.

**מקור הנתונים:**

- `OLD_TESTAMENT` ו-`NEW_TESTAMENT` מתוך `lib/bibleBooks.js`.
- IndexedDB דרך `lib/offlineDb.js` כדי לזהות הורדות מקומיות.

---

### `pages/Chapter.jsx`  -  `/Chapter`

**תפקיד:** מסך הקריאה המרכזי של פרק אחד.

**פרמטרים מרכזיים:**

```text
?book=43&chapter=3
?verse=16
?lang=lu
```

**פעולות:**

- טעינת פרק לפי תרגום פעיל.
- בחירת פסוק.
- פתיחת סרגל פעולות לפסוק.
- הדגשה.
- סימון מילים.
- כתיבת הערה.
- הוספת ציוני מקרא.
- פתיחת תפילה.
- פתיחת פירוש.
- שיתוף הפסוק.
- השמעת פסוק.
- פתיחת מקראים קשורים.
- סימון קטעי טקסט במסגרות הלימוד.
- פתיחת חלונית פסוקים בלי לעזוב את העמוד.
- רישום פעילות קריאה.
- שמירת התקדמות קריאה ותוכנית הקריאה.

**מקור הנתונים:**

- `lib/bibleApi.js` לטעינת פרק.
- `BibleVerse`, `KjvPlusChapter` ו-`LugandaChapter`.
- `StudyMark` לסימונים.
- `StudyAnnotation` להדגשות במסגרות הלימוד.
- `Reading` להתקדמות.
- `ReadingActivity` ליומן הפעילות.
- IndexedDB כגיבוי לקריאה לא מקוונית.

**מבנה מרכזי:**

- עמודת לימוד: Intro, Commentary, Prayer.
- עמודת פסוקים ופעולות.
- Resources: תובנות תיאולוגיות והיסטוריות.
- תפילת סיום.
- מפעיל חלונית פסוק.
- מחליף תרגומים.

---

### `pages/Devotionals.jsx`  -  `/Devotionals`

**תפקיד:** הצגה ושיתוף של תוכן יומי.

**פעולות:**

- חיפוש תוכנית יומית.
- מעבר בין תצוגת רשימה לתצוגת כרטיס.
- פתיחת תוכנית מלאה.
- קריאה באנגלית או לוגנדה.
- סימון כקריאה והשלמה.
- שיתוף.
- שמירת התקדמות למשתמש מחובר.
- פתיחת פסוקים קשורים.

**נתונים:**

- `Devotional`.
- `DevotionalProgress`.
- `DEVOTIONALS` כנתוני גיבוי.

---

### `pages/PrayerLibrary.jsx`  -  `/PrayerLibrary`

**תפקיד:** ספריית מטות תפילה.

**פעולות:**

- חיפוש לפי שם.
- סינון לפי קטגוריה.
- בחירת שפת התצוגה.
- שמירה למועדפים.
- הסרה מהמועדפים.
- שיתוף מטות תפילה.
- פתיחת מקראים קשורים.

**נתונים:**

- `Prayer`.
- `PrayerSaved`.
- `PRAYERS` כנתוני גיבוי.

---

### `pages/VerseOfDay.jsx`  -  `/VerseOfDay`

**תפקיד:** הצגת פסוק מומלץ לפי תאריך.

**פעולות:**

- בחירת הפסוק המתאים לתאריך הנוכחי.
- תצוגה באנגלית או לוגנדה.
- שיתוף.
- פתיחת הפרק המלא.

**נתונים:**

- `VerseOfDay`.
- `VERSE_OF_THE_DAY` כנתוני גיבוי.

---

### `pages/VerseSongs.jsx`  -  `/VerseSongs`

**תפקיד:** רשימת סדרות שירי מקרא.

**פעולות:**

- הצגת כל הסדרות.
- פתיחת סדרה.
- השמעת סדרה מלאה.
- הצגת שגיאת טעינת שמע.
- עבור לנגן הגלובלי.

**נתונים:**

- `VerseSongSeries`.
- `VerseSongEpisode`.

---

### `pages/VerseSongSeries.jsx`  -  `/VerseSongSeries?series=...`

**תפקיד:** הצגת פרטי סדרת שירים והפעלתה.

**פעולות:**

- טעינת הסדרה לפי פרמטר `series`.
- השמעת הסדרה.
- הצגת רשימת פרקים.
- בחירת רצועה מתחילת הסדרה.
- המשך השמעה דרך הנגן הגלובלי.

---

### `pages/QA.jsx`  -  `/QA`

**תפקיד:** שאלות קהל ותשובות עבוריות.

**פעולות:**

- חיפוש שאלות.
- סינון לפי קטגוריה.
- קריאת תשובה.
- פתיחת המקרא המקושר.
- שליחת שאלה חדשה.
- מעבר להתחברות כאשר המשתמש אינו רשום.

**נתונים:**

- `QAEntry`.
- `QA_ENTITIES` כנתוני גיבוי.

---

### `pages/InsightsBoard` דרך שני עמודי wrapper

### `pages/TheologicalInsights.jsx`  -  `/TheologicalInsights`

**תפקיד:** הצגת תובנות תיאולוגיות.

### `pages/HistoricalInsights.jsx`  -  `/HistoricalInsights`

**תפקיד:** הצגת תובנות היסטוריות.

שני העמודים משתמשים באותו רכיב `InsightsBoard`, עם `kind` שונה.

**פעולות משותפות:**

- חיפוש.
- פתיחת תובנה.
- שיתוף.
- שמירה מקומית למועדפים.
- מעבר למקרא הרלוונטי.

**נתונים:**

- `Insight`.
- `INSIGHTS` כנתוני גיבוי.

---

### `pages/Community.jsx`  -  `/Community`

**תפקיד:** שער לפעילויות הקהילה.

**מציג:**

- Revelations.
- Live Teaching.
- Discussion Groups.
- פעילות אחרונות.
- מושבים קרובים.
- קבוצות לימוד.

**פעולות:**

- מעבר לכל סוג פעילות קהילתית.
- פתיחת פריטים אחרונים.
- צפייה בפרטי מושב או קבוצה.

---

### `pages/CommunityRevelations.jsx`  -  `/CommunityRevelations`

**תפקיד:** פיד גילויים אישיים של קוראים, עם תגובות.

**פעולות:**

- קריאת פוסטים.
- לייק.
- פתיחת חלונית תגובות.
- כתיבת תגובה.
- פרסום גילוי חדש.
- התחברות כאשר נדרש.

**נתונים:**

- `Revelation`.
- פוסטים מקומיים או משתפים המשמשים רשומות עם `parent_id`.

---

### `pages/CommunityLiveTeaching.jsx`  -  `/CommunityLiveTeaching`

**תפקיד:** הצגת מושבי הוראה חיים.

**פעולות:**

- הצגת מושבים עתידיים או פעילים.
- פתיחת קישור ההצטרפות.
- הצגת מארג, מנחה ותיאור.

**נתונים:**

- `LiveSession`.
- `LIVE_SESSIONS` כנתוני גיבוי.

---

### `pages/DiscussionGroups.jsx`  -  `/DiscussionGroups`

**תפקיד:** הצגת קבוצות לימוד ושיחות בתוכן.

**פעולות:**

- בחירת קבוצה.
- הצטרפות או עזיבה.
- צפייה בהודעות.
- שליחת הודעה.
- סינון או חיפוש קבוצות.

**נתונים:**

- `DiscussionGroup`.
- `DiscussionThread`.

**הערה:** ההצטרפות מנוהלת מקומית בעת הזמן, ואילו ההודעות נשמרות בשרת.

---

### `pages/Plan.jsx`  -  `/Plan`

**תפקיד:** תוכנית קריאה בת 30 יום הכוללת את יוחנן ואת תהלים.

**פעולות:**

- הצגת התוכנית.
- מעבר לפרק היום.
- סימון ימים שהושלמו.
- חישוב התקדמות.
- זיהוי היום הנוכחי.

**נתונים:**

- `ReadingPlan`.
- `Reading`.
- `PLAN_DAYS` כנתוני גיבוי.

---

### `pages/Journal.jsx`  -  `/Journal`

**תפקיד:** יומן תפילה אישי.

**פעולות:**

- יצירת רשומה.
- עריכת רשומה.
- מחיקת רשומה.
- סינון לפי קטגוריה:
  - praise.
  - petition.
  - confession.
  - thanksgiving.
  - reflection.
- ציון מילה או פסוק שעליו נכתבה הרשומה.
- מעבר לפרק המקושר.

**נתונים:**

- `JournalEntry`.

---

### `pages/BibleNotes.jsx`  -  `/BibleNotes`

**תפקיד:** מרכז כל ההדגשות, סימוני המילים וההערות שנשמרו.

**פעולות:**

- סינון לפי סוג:
  - הדגשה.
  - סימון.
  - הערה.
- מעבר לפסוק המקושר.
- הצגת תאריך השמירה.
- ריקון או מחיקה דרך הפעולות המתאימות.

**נתונים:**

- `StudyMark`.
- `Reading`.

---

### `pages/Dashboard.jsx`  -  `/Dashboard`

**תפקיד:** לוח בקרה אישי לקורא.

**מציג:**

- פעילות קריאה אחרונה.
- מספר פרקים שנקראו.
- ימים רצופים של קריאה.
- התקדמות תוכנית הקריאה.
- הדגשות וסימונים.
- הערות.
- תוכניות יומיות שהושלמו.
- מטות תפילה שנשמרו.
- כמות תכנים זמינים לא מקוון.
- קיצורי תנועה אל העמודים המרכזיים.

**נתונים:**

- `Reading`.
- `StudyMark`.
- `DevotionalProgress`.
- `PrayerSaved`.
- `ReadingActivity`.
- IndexedDB.

**הערה מבנית:** `Dashboard` מייבא גם את `Home`, ולכן במימוש מלא חשוב לבדוק שהרינדור אינו מציג במקרה כפול את מסך הבית או את ה־Hero סתם.

---

### `pages/Offline.jsx`  -  `/Offline`

**תפקיד:** מרכז ניהול התוכן הזמין ללא חיבור.

**פעולות:**

- הצגת נפח אחסון ומכסת הדפדפן.
- הצגת מספר רשומות בכל אחסון.
- הורדת פרקים לפי:
  - תוכנית קריאה.
  - ספרים.
  - כל התנ"ך.
- הורדת תוכניות יומיות.
- הורדת מטות תפילה.
- הורדת פירושים.
- הורדת Q&A.
- הורדת פסוק היום.
- בחירת תרגום.
- מחיקת נתונים לא מקווניים.

**אחסון:**

IndexedDB בשם `prayread-offline`, גרסה 4, עם חנויות:

```text
books
chapters
verses
devotionals
commentary
qa
verseOfDay
meta
highlights
bookmarks
notes
annotations
```

---

### `pages/InstallPrompt.jsx`  -  `/InstallPrompt`

**תפקיד:** הסבר והנחיה להתקנת PWA.

**פעולות:**

- זיהוי מכשיר iOS, Android או Desktop.
- זיהוי אם האפליקציה כבר מותקנת.
- הפעלת `beforeinstallprompt`.
- הצגת הוראות ידניות לפי מערכת ההפעלה.

---

## 2.2 דפי חשבון ואימות

### `pages/Login.jsx`  -  `/Login`

**תפקיד:** התחברות לחשבון קורא.

**טופס:**

- אימייל.
- סיסמה.
- כפתור Sign in.
- קישור לשכחתי סיסמה.
- קישור להרשמה.

**התנהגות:**

- בהצלחה מעבר ל-`/Dashboard`.
- בכישלון מוצגת הודעת שגיאה.
- במהלך תהליך ההתחברות הכפתור נעול.

---

### `pages/Signup.jsx`  -  `/Signup`

**תפקיד:** יצירת חשבון קורא.

**טופס:**

- שם מלא.
- אימייל.
- סיסמה.
- אישור סיסמה.
- קבלת תנאי השימוש.

**וולידציה:**

- אורך סיסמה מינימלי 8 תווים.
- הסיסמה והאישור חייבים להיות זהים.
- חובה לאשר את התנאים.
- מחושב חוזקת סיסמה לצורך משוב.

**התנהגות אחרי הרשמה:**

- אם נדרשת אימות דוא"ל, מוצגת התראת שליחת הודעת אימות.
- אחרת המשתמש מועבר ל-`/Dashboard`.

---

### `pages/ForgotPassword.jsx`  -  `/ForgotPassword`

**תפקיד:** בקשת קישור לאיפוס סיסמה.

**טופס:** אימייל.

**התנהגות:**

- אימות פורמט אימייל.
- שליחת בקשה ל-`fse2.auth.forgotPassword`.
- הודעת הצלחה אינה חושפת אם הכתובת קיימת במערכת.

---

### `pages/ResetPassword.jsx`  -  `/ResetPassword?token=...`

**תפקיד:** קביעת סיסמה חדשה לאחר איפוס.

**פרמטרים:**

- `token`.
- תמיכה גם ב-`access_token`.

**טופס:**

- סיסמה חדשה.
- אישור סיסמה.

**וולידציה:**

- אורך מינימלי 8 תווים.
- התאמת שתי הסיסמאות.
- קיום token.

---

### `pages/Logout.jsx`  -  `/Logout`

**תפקיד:** סיום התחברות.

**התנהגות:**

- מציג מסך המעבר למשך כ-900 מילישניות.
- מנקה את המצב ב-`AuthContext`.
- מבצע logout.
- חוזר ל-`/Home` באמצעות replace.

---

## 2.3 עמודי מדיניות וקשר

### `pages/Contact.jsx`  -  `/Contact`

**תפקיד:** שליחת הודעה לצוות האתר.

**טופס:**

- שם.
- אימייל.
- נושא.
- הודעה.

**וולידציה:**

- שם, אימייל והודעה הם שדות חובה.
- אימות פורמט אימייל בסיסי.
- שליחה דרך `submitContactMessage`.

**נתונים:** `ContactMessage`.

---

### `pages/Privacy.jsx`  -  `/Privacy`

**תפקיד:** הצגת מדיניות פרטיות.

**תוכן עיקרי:**

- מידע שנשמר בחשבון.
- נתונים הנשמרים מקומית בדפדפן.
- מידע על מחיקת נתוני מכשיר.
- עקרונות שיתוף ופרטיות.

---

### `pages/Terms.jsx`  -  `/Terms`

**תפקיד:** הצגת תנאי שימוש.

**תוכן עיקרי:**

- שימוש אישי וקהילתי בתוכן.
- הזכות לקריאה, הדפסה ושיתוף.
- איסור מכירת התוכן או הצגתו כיצירה עצמאית.
- הערות לגבי מקורות התרגומים.
- תנאים נוספים לפי הקוד המלא.

---

## 2.4 עמודי ניהול

### `pages/Admin.jsx`  -  `/Admin`

**תפקיד:** מסך התחברות נפרד למנהל תוכן.

**טופס:**

- אימייל מנהל.
- סיסמה.

**התנהגות:**

- בדיקת קיום session token כאשר העמוד נטען.
- אם ה-session תקף, מעבר ישיר ל-`/AdminDashboard`.
- לאחר כניסה מוצרת ה-token נשמר ב-`localStorage` תחת `pr_admin_token`.
- כישלון מציג הודעת שגיאה.

**הבדל מהתחברות קורא:** זו מערכת session חתום ונפרדת, ולא `fse2.auth`.

---

### `pages/AdminDashboard.jsx`  -  `/AdminDashboard`

**תפקיד:** מרכז ניהול התוכן.

**מקטעים:**

1. Dashboard כללי.
2. Books & Chapters.
3. Luganda Bible.
4. KJV+ with Strong's.
5. Devotionals.
6. Prayer Library.
7. Verse-Songs.
8. Q&A.
9. Insights.
10. Users.
11. Messages.
12. Text Colours.
13. Activity Log.
14. Settings.

**פעולות:**

- רשימה, חיפוש וסינון רשומות.
- יצירה ועדכון.
- מחיקה.
- העלאת מדיה.
- התקנת פרקי התנ"ך.
- הפעלת התקנת מילון Strong.
- צפייה בפעילות מנהלים.
- ניהול הגדרות וצבעי מותג.
- ניהול משתמשים והודעות.

**התקנת תנ"ך:**

- `LugandaInstaller` מתקשר ל-`lugandaInstall`.
- `KjvPlusInstaller` מתקשר ל-`kjvInstall`.
- `ChapterCoverage` מציג כיסוי לפי ספר, פרקים חסרים ופרקים שבורים.

**רעיון מרכזי ב-CMS:** שימוש במפת `FIELDS` מאפשר ליצור טפסים גנריים עבור סוגי ישויות שונים, ולכן הוספת ישות דורשת בעיקר הגדרת שדות ורשאות.

---

# 3. מפת ניווט לצורכי DEBUG

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת התנ"ך | `/Home` | Bible Reader | `/BibleReader` |
| בחירת ברית | `/BibleReader` | Old Testament / New Testament | מגירת ספרים מתאימה |
| חיפוש ספר | `/BibleReader` | שדה החיפוש | סינון מיידי ברשת |
| בחירת ספר | `/BibleReader` | כרטיס ספר | רשת פרקים באותו עמוד |
| בחירת פרק | `/BibleReader` | מספר פרק | `/Chapter?book=...&chapter=...` |
| פתיחת פרק ישירות | קישור חיצוני | פרמטרי URL של Chapter | `/Chapter?book=43&chapter=3` |
| חיפוש מקרא בפסוק | `/Chapter` | סרגל פעולות הפסוק | פרשת קרואות |
| הדגשת פסוק | `/Chapter` | Highlighter | יצירת `StudyMark` מסוג highlight |
| סימון פסוק | `/Chapter` | Bookmark | יצירת `StudyMark` מסוג bookmark |
| כתיבת הערה | `/Chapter` | NotebookPen | יצירת `StudyMark` מסוג note |
| פתיחת תפילה | `/Chapter` | HeartHandshake | חלונית `PassagePrayer` |
| פתיחת פירוש | `/Chapter` | MessageCircle | לשונית Commentary |
| פתיחת תובנות | `/Chapter` | Resources | `ChapterResourcesPanel` |
| מעבר לחלונית מקרא | `/Chapter` או מסגרת לימוד | הפניה | `VersePopup` |
| פתיחת מספר Strong | `/Chapter` בגרסת KJV+ | קוד כחול כגון G2424 | `StrongsPopup` |
| החלפת תרגום | `/Chapter` | VersionPicker | עדכון תרגום פעיל |
| הורדת פרקים | `/Offline` | Download | IndexedDB |
| ניקוי אחסון | `/Offline` | Trash2 | מחיקת stores |
| פתיחת תוכנית יומית | `/Home` או `/Devotionals` | כרטיס Devotional | `/Devotionals?devotional=CODE` |
| סימון תוכנית כנקראה | `/Devotionals` | CheckCircle | יצירת/עדכון `DevotionalProgress` |
| חיפוש מטות תפילה | `/PrayerLibrary` | שדה חיפוש | סינון מקומי |
| שמירת מטות תפילה | `/PrayerLibrary` | Bookmark | יצירת `PrayerSaved` |
| פתיחת סדרת שירים | `/VerseSongs` | כרטיס סדרה | `/VerseSongSeries?series=...` |
| השמעת סדרה | `/VerseSongSeries` | Play | טעינת queue לנגן הגלובלי |
| פתיחת גילוי | `/Community` | Revelations | `/CommunityRevelations` |
| לייק לגילוי | `/CommunityRevelations` | Heart | עדכון מספר הלייקים |
| פתיחת תגובות | `/CommunityRevelations` | MessageCircle | חלונית `CommentThread` |
| פרסום גילוי | `/CommunityRevelations` | טופס | יצירת `Revelation` |
| הצטרפות לקבוצה | `/DiscussionGroups` | Join | עדכון מצב מקומי |
| שליחת הודעה | `/DiscussionGroups` | Send | יצירת `DiscussionThread` |
| פתיחת מושב חי | `/CommunityLiveTeaching` | Join | קישור חיצוני |
| פתיחת יומן | `/Journal` | Plus / New entry | טופס `JournalForm` |
| עריכת יומן | `/Journal` | Pencil | טופס עריכה |
| מחיקת יומן | `/Journal` | Trash2 | מחיקת `JournalEntry` |
| סינון יומן | `/Journal` | תגיות קטגוריה | רשומות מסוננות |
| השלמת יום בתוכנית | `/Plan` | פתיחת יום | `/Chapter?book=...&chapter=...` |
| צפייה בהתקדמות | `/Plan` | סטטוס יום | `Reading` מעודכן |
| צפייה בסימונים | `/BibleNotes` | סרגל סוגים | הדגשות / סימונים / הערות |
| חזרה לפסוק מסומן | `/BibleNotes` | כרטיס סימון | `/Chapter?book=...&chapter=...&verse=...` |
| כניסת קורא | כל עמוד | Sign in | `/Login` |
| הרשמת קורא | כל עמוד | Create account | `/Signup` |
| איפוס סיסמה | `/Login` | Forgot password | `/ForgotPassword` |
| בחירת סיסמה חדשה | קישור אימות | Reset password | `/ResetPassword?token=...` |
| יציאה | Header | Logout | `/Logout` |
| כניסת מנהל | ידנית | `/Admin` | `/Admin` |
| פתיחת CMS | `/Admin` לאחר כניסה | תפריט Admin | `/AdminDashboard` |
| התקנת לוגנדה | `/AdminDashboard` | Luganda Bible | `LugandaInstaller` |
| התקנת KJV+ | `/AdminDashboard` | KJV+ with Strong's | `KjvPlusInstaller` |
| התקנת מילון Strong | `/AdminDashboard` | פעולת dictionary | `kjvInstall` action מתאים |
| עריכת צבעי מותג | `/AdminDashboard` | Text Colours | עדכון `SiteSettings` |
| ניהול הודעות | `/AdminDashboard` | Messages | רשימת `ContactMessage` |
| צפייה ביומן פעילות | `/AdminDashboard` | Activity Log | `ActivityLog` |

---

# 4. מבנה הקבצים

## 4.1 קבצי רשת

### `Layout.jsx`

עוטף את כל האפליקציה בסדר הבא:

```text
AuthProvider
└── ThemeProvider
    └── PlayerProvider
        ├── BRAND_CSS
        ├── PwaHead
        ├── AppHeader
        ├── main עם children
        ├── AppFooter, רק ב-Home
        └── GlobalPlayer
```

העוטף הוא המקום שבו נוצרים האימות, ערכי המותג, הנגן הגלובלי ורישום ה-Service Worker.

### `components/layout/AppHeader.jsx`

הראש הקבוע:

- לוגו.
- ניווט ראשי.
- ניווט משני.
- מצב משתמש.
- כפתור מתנה.
- תפריט מובייל.
- קישורי התקנה, אודפיין וכו'.

### `components/layout/AppFooter.jsx`

כותרת תחתונה, קישורים מהירים, מידע משפטי, לוגו חלופי במקרה שהתמונה נכשלת וקישור לתרומה.

### `components/layout/GlobalPlayer.jsx`

נגן אודיו גלובלי. מציג:

- רצועה נוכחית.
- שליטה בהשמעה.
- זמן נוכחי ואורך כולל.
- העברה אחורה וקדימה.
- עוצמה.
- מהירות.
- shuffle.
- repeat.
- רשימת רצועות.
- מצב expanded.
- טעויות.

### `components/layout/PwaHead.jsx`

מוסיף דינמית ל-`document.head`:

- Theme color.
- תגיות PWA ל-Apple.
- Description.
- Manifest.
- Favicon.
- Apple touch icon.

כמו כן רושם את ה-Service Worker.

---

## 4.2 רכיבים משותפים

### `components/common/EmptyState.jsx`

מצב ריק אחיד עם:

- אייקון אופציונלי.
- כותרת.
- תיאור.
- פעולה אופציונלית.

### `components/common/Modal.jsx`

מודאל כללי:

- סגירה בלחיצה על הרקע.
- סגירה ב-Escape.
- נעילת גלילת גוף הדף.
- כותרת, תת כותרת, תוכן ורגל.
- `aria-modal` ו-`aria-label`.

### `components/common/PageHeader.jsx`

ראש אחיד לעמודים. תומך ברקע תמונה, overlay, eyebrow, כותרת, lead, פעולות ותוכן נוסף.

### `components/common/Pagination.jsx`

מבנה עמודים מקוצר:

- ראשון.
- עמוד קודם.
- עמוד נוכחי.
- עמוד הבא.
- אחרון.
- אליפס בין קבוצות רחוקות.

### `components/common/ShareRow.jsx`

שורת שיתוף עם Facebook, WhatsApp, Telegram, Instagram, LinkedIn והעתקה. מציג "Copied" למשך כשני שניות.

### `components/common/Spinner.jsx`

מצב טעינה נגיש עם `role="status"` ו-`aria-live="polite"`.

---

## 4.3 רכיבי קהילה

### `components/community/RevelationCard.jsx`

כרטיס גילוי אישי. מציג מחבר, מקרא, כותרת, גוף, לייק ומספר תגובות.

### `components/community/RevelationForm.jsx`

טופס פרסום גילוי. דורש כותרת וגוף; המקרא אופציונלי. לא מציג טופס למשתמש לא מחובר.

### `components/community/CommentThread.jsx`

תצוגת תגובות וטופס תגובה. מנקה את הטקסט לאחר שליחה ומציג התראה למשתמש לא מחובר.

### `components/community/ThreadMessages.jsx`

תצוגת הודעות בקבוצת לימוד ושליחת הודעה חדשה.

---

## 4.4 רכיבי לוח בקרה ויומן

### `components/dashboard/ActivityFeed.jsx`

פיד 12 הפעילות האחרונות של המשתמש. ממיין לפי תאריך, מסנן לפי `owner_email` ומרנדר אייקונים לפי סוג הפעילות. מתעדן אוטומטית כל 30 שניות.

### `components/home/StatCard.jsx`

כרטיס סטטיסטיקה עם אייקון, ערך, hint וערך גדול.

### `components/journal/JournalCard.jsx`

כרטיס רשומת יומן עם קטגוריה, כותרת, גוף, מיקום מקרא, תאריך, עריכה ומחיקה.

### `components/journal/JournalForm.jsx`

טופס יצירה ועריכה. מאפשר לשמור רשומה גם אם נכתב רק גוף בלי כותרת, ומשתמש ב-`"Untitled entry"`.

---

## 4.5 רכיבי לימוד התנ"ך

### `components/read/AnnotatedText.jsx`

רכיב מרכזי להדגשת טקסט:

- בוחר קטע.
- מציג סרגל כלים.
- שומר highlight או underline.
- מחלק את הטקסט למקטעים לפי גבולות ההערות.
- מחזיר את הטקסט המסומן לצורה המבנית הנכונה.
- מאפשר סרגלי עזרה סביב קישורי מקרא.

### `components/read/BookGrid.jsx`

רשת הספרים עם חיפוש וניווט בין הבריתות.

### `components/read/BookIntro.jsx`

המבוא לספר:

- עובדת הברית.
- מספר פרקים.
- קיצור.
- מבוא מסומן.
- פסוקי מפתח.

### `components/read/BookOutline.jsx`

מבנה הספר. כל כותרת וטווח פסוקים מאפשר לעבור למקום מדויק בתוך הספר.

### `components/read/BookPrayerPanel.jsx`

תפילת הספר באנגלית או לוגנדה, עם קישורי מקרא פעילים ואפשרות סימון.

### `components/read/BookSidebar.jsx`

העמודה השמאלית במסך הספר. מנהלת שלושה מקטעים:

- Intro.
- Outline.
- Prayer.

### `components/read/BookStudyResources.jsx`

משאבי לימוד ברמת הספר:

- פירוש.
- תובנה תיאולוגית.
- תובנה היסטורית.

משתמש בעמודים של שלוש רשומות ומציג נתוני DB או נתוני גיבוי.

### `components/read/ChapterClosingPrayer.jsx`

תפילת סיום הפרק. תומכת ב:

- אנגלית.
- לוגנדה.
- שתי השפות יחד.
- שיתוף.
- חזרה לתפילה.
- פתיחת המקרא.

### `components/read/ChapterGrid.jsx`

רשת פרקים. כל פרק הוא קישור ל-`/Chapter`.

### `components/read/ChapterReaderPane.jsx`

עמודת קריאה רספונסיבית. במובייל המסגרת התחתונית נפתחת מתחת לשורת הכלים; במסך רחב היא נשארת בעמודה השמאלית.

### `components/read/ChapterResourcesPanel.jsx`

תובנות תיאולוגיות והיסטוריות לפרק. אם אין תוכן לפרק, משתמש בתוכן ברמת הספר.

### `components/read/ChapterSelector.jsx`

המסך המרכזי של בחירת ספר ופרק. מנהל:

- ספר נבחר.
- פרק נבחר.
- חלונית מקרא.
- מצב התרגום.
- סימוני מסגרת הלימוד.
- שמירת מיקום המחקר.
- טעינת משאבי הספר.

### `components/read/ChapterSidebar.jsx`

עמודת הלימוד של פרק:

- מבוא לפרק.
- פירוש.
- תפילה קצרה.
- סימונים.
- הפניות למקרא.

### `components/read/FloatingVerse.jsx`

חלונית צפה של פסוק עם אפשרות סגירה ופתיחת הפרק המלא.

### `components/read/PassagePrayer.jsx`

מוצא תפילות המתאימות למקרא הנוכחי. מייצא את `matchesPassage` לבדיקות יחידה.

### `components/read/PassageTabs.jsx`

לשוניות:

- Commentary.
- Theological insight.
- Historical insight.
- Q&A.

מציג תוכן רלוונטי לפי ספר ופרק.

### `components/read/ShareSheet.jsx`

חלונית שיתוף רבתחתית, הכוללת פסוק בשפות שונות, תפילה, מקראים קשורים והעתקה מלאה.

### `components/read/StrongsPopup.jsx`

הצגת משמעות מספר Strong:

- קוד.
- שפה.
- מילה מקורית.
- תעתיק.
- הגייה.
- חלק דיבר.
- מילת שורש.
- הגדרה.
- מקור.

הקריאה הראשונית מחפשת ב-DB; אם הערך חסר, מתבצעת שאילתה חיצונית ונשמרת תוצאה מקומית.

### `components/read/StrongsText.jsx`

מפרק טקסט KJV+ שמכיל קודים בצורת `(G2424)`, מציג אותם כ-superscript כחול ומאפשר לחיצה.

### `components/read/VerseActionBar.jsx`

סרגל הפעולות של פסוק:

- תפילה.
- הצלבות.
- פירוש.
- הדגשה.
- שיתוף.
- סימון.
- העתקה.
- הערה.
- סגירה.

### `components/read/VerseList.jsx`

רשימת פסוקים פשוטה, עם בחירה והדגשה.

### `components/read/VersePopup.jsx`

טעינת פרק מקומי או מרחוק והצגת טווח פסוקים בחלונית פנימית. תומך בסימון הטקסט שנפתח.

### `components/read/VersionPicker.jsx`

התקנה, בחירה והסרה של תרגומים מקומיים.

---

## 4.6 רכיבי ניהול התקנה

### `components/admin/ChapterCoverage.jsx`

מציג כיסוי התקנה לכל ספר. ממיר רשימת פרקים לטווחים, למשל:

```text
2-5, 9, 12
```

מבדיל בין:

- פרק חסר.
- פרק שבור.
- פרק תקין.

### `components/admin/LugandaInstaller.jsx`

מתקין את תנ"ך הלוגנדה דרך `lugandaInstall`. מציג:

- סטטוס.
- כיסוי.
- התקדמות.
- שגיאות.
- הפעלה חוזרת.

### `components/admin/KjvPlusInstaller.jsx`

מתקין KJV+ ואת מילון Strong. מנהל גם התקנת מילון עצמאית מהממשק.

---

## 4.7 רכיבי משאבי תוכן

### `components/insight/InsightsBoard.jsx`

לוח תובנות משותף לתיאולוגיה והיסטוריה. מאחד תוכן חי עם seed content, מבצע חיפוש ומציג פרטים ושיתוף.

### `components/plan/PlanRow.jsx`

שורה בתוכנית הקריאה, עם מצב completed/current/upcoming וקישור לפרק.

---

## 4.8 קבצי ליבה ב-`lib`

### `lib/AuthContext.jsx`

מנהל את מצב המשתמש הרגיל:

- `user`.
- `isAuthenticated`.
- `isLoadingAuth`.
- `checkAuth`.
- `logout`.
- `navigateToLogin`.

### `lib/adminSession.js`

שומר וקורא את token המנהל ומספק `callAdmin` עבור `adminAuth`.

### `lib/app-params.js`

מנסח פרמטרים תאימות עם FSe2, כולל app ID, token, URL וגרסת functions.

### `lib/theme.js`

טוקני מותג קבועים, כתובות לוגו, favicon ונכסי hero.

### `lib/themeContext.jsx`

טוען הגדרות מותג מהשרת למשתמש מחובר ומחליף את משתני ה-CSS של `BRAND_CSS`.

### `lib/brandCss.js`

מערכת עיצוב מרכזית. כוללת את הצבעים, כרטיסים, כפתורים, שדות, טאבים, מודאלים, רשתות, שדות ורכיבי הקורא.

### `lib/bibleBooks.js`

נתונים סטטיים ל-66 הספרים:

- מספר קנוני.
- שם אנגלי.
- שם לוגנדה.
- קיצורים.
- מספר פרקים.
- הברית.

### `lib/bibleApi.js`

שכבת גישה לפרקים. אחראית ל:

- טעינת התרגום הפעיל.
- חיפוש מקומי קודם.
- ניקוי HTML.
- פענוח מספרי Strong.
- כתיבת פרק לאחסון הלא מקווני.

### `lib/versions.js`

מאגר התרגומים והתקנות המכשיר. כולל KJV, KJV+, Web וגרסאות נוספות, עם metadata על שפה, מקור ותמיכת Strong.

### `lib/offlineDb.js`

מעטפת IndexedDB מרכזית לכל התכנים הזמינים לא מקוון.

### `lib/studyAnnotations.js`

שכבת אחסון כפולה להדגשות וקווי תחתון:

- שרת `StudyAnnotation`.
- IndexedDB.
- מיזוג רשומות לפי מפתח ייחודי.
- מחיקה מסונכרנת.

### `lib/scriptureRefs.js`

מנתח הפניות מקרא:

- `John 3:16`.
- `Philippians 4:6-7`.
- `Psalm 46:1`.
- כינויים כגון `Ps`, `Psalms`, `Song`.

### `lib/chapterStudy.js`

בונה תוכן לימוד לפרק מהמקורות הקיימים:

- מבוא.
- פירוש.
- תפילה.
- פסוקי מפתח.
- טווחי outline.

### `lib/bookGuides.js`

מבוא ו-outline לכל ספר הקנוני.

### `lib/bookPrayers.js`

תפילה באנגלית ובלוגנדה לכל ספר.

### `lib/bookStudyContent.js`

תובנות תיאולוגיות והיסטוריות ברמת הספר.

### `lib/keyPassages.js`

שלושה פסוקי מפתח לכל ספר.

### `lib/crossRefs.js`

הצלבות מעורכות למקראים נפוצים.

### `lib/seedContent.js`

תוכן גיבוי ללא תלות ב-DB:

- תוכניות יומיות.
- מטות תפילה.
- שירי מקרא.
- Q&A.
- תובנות.
- פסוקי יום.
- פוסטי קהילה.
- קבוצות.
- מושבים.

### `lib/contentApi.js`

מאפשר לקרוא תוכן ציבורי דרך השרת ולבצע פעולות ציבוריות כגון:

- שליחת שאלה.
- שליחת צור קשר.
- פרסום גילוי.
- תגובה.
- לייק.
- שליחת הודעת קבוצה.

### `lib/readings.js`

שמירת קריאה שהושלמה, כולל:

- בעלים.
- ספר ופרק.
- תרגום.
- יום בתוכנית.
- תאריך.
- השתקפות.
- פסוקים מסומנים.

### `lib/activity.js`

רישום פעילות קורא. הכתיבה נכשלת אינה אמורה לשבור את פעולת המשתמש.

### `lib/reading.js`

פונקציות תאריך וסטטיסטיקות קריאה:

- ISO date.
- הזזת תאריך.
- תווית תאריך.
- שם יום.
- שבעת ימים אחרונים.
- חישוב streak.

### `lib/strongs.js`

נורמליזציה ועיבוד מספרי Strong, כולל קידומת השפה לפי מספר הספר.

### `lib/share.js`

בניית קישורי שיתוף, העתקה ללוח, והכנת טקסטי שיתוף אחידים.

### `lib/player.jsx`

Provider גלובלי לאודיו. יוצר `Audio` אחד, מנהל queue, השמעה, הפסקה, seek, עוצמה, מהירות, shuffle, repeat והחלפת רצועה.

### `lib/luganda.js`

ניקוי ועיצוב תוכניות יומיות בלוגנדה, כולל הסרת שמות אתרים ושחזור כותרות קטעים.

### `lib/format.js`

עזרי תצוגה:

- `safeText`.
- `safeId`.
- פיצול רשימות.
- Title Case.
- עיצוב משך.
- עיצוב bytes.

### `lib/textSelection.js`

מונע מהקלקה על קישור מקרא להפעיל ניווט בזמן שהמשתמש בוחר טקסט לסימון.

---

## 4.9 קבצי שרת

### `functions/adminAuth.js`

מנהל:

- כניסת מנהל.
- אימות סיסמה.
- Salt.
- SHA-256 hash.
- חתימת session token.
- בדיקת session.
- ניהול סיסמת מנהל.

**חשוב:** הקוד מגדיר סיסמת ברירת מחדל קבועה למקרה שמשתני סביבה לא מוגדרים. בפרודקשן יש להגדיר `ADMIN_INITIAL_PASSWORD` באופן מאובטח ולהימנע מסיסמת ברירת מחדל.

### `functions/adminContent.js`

CRUD מאובטח לתוכן הניהולי. מאמת token ומפנה פעולות רק לרשימת ישויות מורשות.

### `functions/content.js`

API ציבורי לקריאת אוספים וקבלת הגשות ציבוריות.

### `functions/bibleChapter.js`

שכבת שרת לטעינת פרק ממקורות חיצוניים:

- bible-api.com לאנגלית.
- wordplanet.net ללוגנדה.

### `functions/kjvInstall.js`

התקנת KJV+ פרק-פרק. מאמת session או install key, קורא את המצב הקיים, מוריד רק פרקים חסרים ועוצר כאשר אין התקדמות.

### `functions/lugandaInstall.js`

אותו מנגנון עבור לוגנדה.

### `functions/strongsDefinition.js`

מייבא וממלא מילון Strong ממקורות ציבוריים ומ-Blue Letter Bible, ומשמש כמקור משני.

### `cron/scriptureInstall.js`

תהליך תחזוקה שעתי. מריץ את מנגנוני KJV+, לוגנדה ו-Strong וממשיך רק כאשר מתקבלת התקדמות.

---

## 4.10 קבצי ציבור

### `public/manifest.json`

מגדיר:

- שם האפליקציה.
- שם קצר.
- תיאור.
- נתיב התחלה.
- scope.
- מצב תצוגה.
- orientation.
- צבעי רקע וערכת נושא.
- אייקונים.

### `public/sw.js`

Service Worker בגישת hybrid:

- Cache-first ל-app shell ולתמונות.
- Network-first לבקשות אחרות.
- ניקוי caches ישנים.
- הפעלה מיידית של worker חדש.

---

# 5. מודל הנתונים

## 5.1 תוכן ציבורי

### `Devotional`

**מטרה:** תוכנית יומית דו-לשונית.

**שדות מרכזיים:**

- `code`  -  מזהה ייחודי.
- `title`, `title_lu`.
- `scripture`, `scripture_lu`.
- `body`, `body_lu`.
- `related`.
- `further_readings`.
- `cover_image`.
- שדות תאריך ועדכון.

**קשרים:**

- `DevotionalProgress.devotional_code` מפנה לקוד התוכנית.
- `ReadingActivity.activity_type = devotional_access` יכול לייצג גישה לתוכנית.

---

### `Prayer`

**מטרה:** מטות תפילה ציבורית.

**שדות:**

- `title`, `title_lu`.
- `category`.
- `body_en`, `body_lu`.
- `scripture_ref`.

**קשרים:**

- `PrayerSaved.prayer_title` מזהה את התפילה לפי כותרת.
- אין מפתח זר, ולכן שינוי כותרת עלול לשבור קשרי שמירה.

---

### `Commentary`

**מטרה:** הערת פירוש לפי ספר ופרק.

**שדות:**

- `book`.
- `chapter`.
- `title`.
- `body_en`, `body_lu`.

**קשרים:** לוגית ל-`BibleVerse` לפי שם הספר ומספר הפרק, אך אין FK.

---

### `Insight`

**מטרה:** תובנה תיאולוגית או היסטורית.

**שדות:**

- `kind`  -  `theological` או `historical`.
- `title`.
- `passage`.
- `excerpt`.
- `body`.
- `share_count`.

---

### `QAEntry`

**מטרה:** שאלת קורא ותשובה.

**שדות:**

- `question`.
- `category`.
- `answer`.
- `passage_ref`.
- `answered_by`.
- `status`.
- `author_email`.

---

### `VerseOfDay`

**מטרה:** פסוק לפי תאריך.

**שדות:**

- `verse_date`.
- `reference`.
- `text_en`, `text_lu`.
- `note`.

---

### `LiveSession`

**מטרה:** מושב הוראה חי.

**שדות:**

- `title`.
- `session_date`.
- `host`.
- `join_link`.
- `description`.

---

### `DiscussionGroup`

**מטרה:** קבוצת לימוד.

**שדות:**

- `name`.
- `description`.
- `schedule`.
- `member_count`.

**קשר לוגית:**

- `DiscussionThread.group_name` מזהה קבוצה לפי שם.

---

### `DiscussionThread`

**מטרה:** הודעה בקבוצת לימוד.

**שדות:**

- `group_name`.
- `owner_email`.
- `author_name`.
- `title`.
- `body`.

---

### `Revelation`

**מטרה:** גילוי אישי ותגובות.

**שדות:**

- `owner_email`.
- `author_name`.
- `title`.
- `passage`.
- `body`.
- `likes`.
- `parent_id`.

**קשר עצמי:**

- `parent_id` מציין גילוי אב.
- רשומה ללא `parent_id` היא פוסט.
- רשומה עם `parent_id` היא תגובה.

---

### `SiteSettings`

**מטרה:** הגדרות גלובליות.

**שדות:**

- `setting_key`.
- `setting_value`.

שימושים אפשריים: שם האתר, צבעים, קישור תרומה.

---

### `VerseSongSeries`

**מטרה:** סדרת שירי מקרא.

**שדות:**

- `name`.
- `description`.
- `thumbnail`.
- `cover_image`.
- `accent`.

**קשר:**

- `VerseSongEpisode.series_name` מזהה את הסדרה לפי שם.

---

### `VerseSongEpisode`

**מטרה:** רצועה בסדרת שירים.

**שדות:**

- `series_name`.
- `title`.
- `verse_ref`.
- `duration_label`.
- `duration_seconds`.
- `audio_url`.
- `audio_key`.
- `thumbnail`.
- `episode_order`.

---

## 5.2 מקרא

### `BibleVerse`

**מטרה:** פסוק בודד באנגלית ובלוגנדה.

**שדות:**

- `book_number`.
- `book`.
- `chapter`.
- `verse`.
- `text_en`.
- `text_lu`.

**הערה:** היישות קיימת, אך חלק מזרימי הקריאה עובדים עם טבלאות מותקנות מפרק (`KjvPlusChapter` ו-`LugandaChapter`) ועם מקורות חיצוניים.

---

### `KjvPlusChapter`

**מטרה:** פרק KJV עם קודי Strong.

**שדות:**

- `book_number`.
- `book`.
- `chapter`.
- `verse_count`.
- `verses`  -  JSON של הפסוקים.

**ערכים צפויים:** בקוד, KJV+ עשוי להכיל קודים כגון `(G2424)` בתוך טקסט הפסוק.

---

### `LugandaChapter`

**מטרה:** פרק מלא בלוגנדה.

**שדות:**

- `book_number`.
- `book`.
- `chapter`.
- `verse_count`.
- `verses`  -  JSON של הפסוקים.

---

## 5.3 פעילות קורא

### `Reading`

**מטרה:** פרק שנקרא והשלמתו.

**שדות:**

- `owner_email`.
- `book`.
- `chapter`.
- `translation`.
- `plan_day`.
- `read_date`.
- `status`.
- `reflection`.
- `prayer_point`.
- `highlighted_verses`.

**קשרים:**

- `plan_day` מזהה יום ב-`ReadingPlan`.
- משמש ל-`Plan`, `Dashboard` וחישוב streak.

---

### `ReadingActivity`

**מטרה:** יומן פעילות.

**שדות:**

- `owner_email`.
- `activity_type`.
- `book`.
- `book_number`.
- `chapter`.
- `verse`.

**סוגי פעילות:**

- `chapter_visit`.
- `highlight`.
- `bookmark`.
- `note_saved`.
- `prayer_opened`.
- `devotional_access`.

---

### `StudyMark`

**מטרה:** הדגשה, סימון או הערה ברמת פסוק.

**שדות:**

- `owner_email`.
- `mark_type`.
- `book_number`.
- `book`.
- `chapter`.
- `verse`.
- `color`.
- `note_text`.

---

### `StudyAnnotation`

**מטרה:** הדגשה או קו תחתון בטקסט לימוד.

**שדות:**

- `owner_email`.
- `book_number`.
- `book`.
- `section`.
- `block_id`.
- `kind`.
- `color`.
- `start_offset`.
- `end_offset`.

**מזהה לוגי:**

```text
book_number:section:block_id:kind:start:end
```

זהוי זה משמש למיזוג בין השרת ל-IndexedDB.

---

### `JournalEntry`

**מטרה:** רשומת יומן תפילה.

**שדות:**

- `owner_email`.
- `entry_date`.
- `title`.
- `body`.
- `category`.
- `book`.
- `chapter`.
- `mood`.

---

### `DevotionalProgress`

**מטרה:** סימון תוכנית יומית כהושלמה.

**שדות:**

- `owner_email`.
- `devotional_code`.
- `completed_date`.

---

### `PrayerSaved`

**מטרה:** מטות תפילה במועדפים.

**שדות:**

- `owner_email`.
- `prayer_title`.

---

## 5.4 ניהול

### `AdminAccount`

**מטרה:** פרטי כניסת מנהל.

**שדות:**

- `email`.
- `password_hash`.
- `salt`.
- `updated_date`.

---

### `ActivityLog`

**מטרה:** יומן פעילות ב-CMS.

**שדות:**

- `actor`.
- `action`.
- `section`.
- `detail`.

---

## 5.5 Strong

### `StrongEntry`

**מטרה:** משמעות מספר Strong.

**שדות:**

- `code`.
- `language`.
- `original_word`.
- `transliteration`.
- `pronunciation`.
- `part_of_speech`.
- `root_word`.
- `definition`.
- `source`.

---

## 5.6 מודל ההרשאות

המערכת משתמשת בשני מנגנוני זהות נפרדים:

### משתמש רגיל

מוגדר דרך `fse2.auth`. רוב הישויות מאפשרות:

- קריאה ציבורית לכל.
- יצירה, עדכון ומחיקה למשתמש מחובר.
- סינון לפי `owner_email` ברמת הלקוח.

### מנהל

מוגדר דרך `adminAuth` ו-token חתום. יכול לנהל content entities, התקנות, משתמשים, הודעות, הגדרות ויומן פעילות.

**סיכון חשוב:** בהרבה ישויות כתוב בצורה מפורשת שכל משתמש מחובר יכול ליצור, לעדכן ולמחוק רשומה. אם ההרשאות נאכפות ברמת השרת רק לפי תפקיד ולא לפי בעלות, קורא רשום עלול לשנות רשומה של קורא אחר. מומלץ להוסיף תנאי בעלות לכל פעולת update/delete או לסנן ולאמת ownership בשרת.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 פתיחת פרק וטעינת תרגום

1. המשתמש בוחר ספר ופרק.
2. המערכת מנווטת ל-`/Chapter` עם `book` ו-`chapter`.
3. `Chapter` קורא את התרגום הפעיל מ-`lib/versions.js`.
4. `lib/bibleApi.js` בודק תחילה אחסון מקומי.
5. אם הפרק חסר, מתבצעת טעינה מהשרת או מהמקור החיצוני.
6. הטקסט מנוקה ומפוענח.
7. ב-KJV+, קודי Strong מסומנים.
8. הפרק מוצג במסגרת.
9. הפרק נשמר ב-IndexedDB כדי לאפשר קריאה לא מקוונית.

## 6.2 סימון פסוק

1. המשתמש בוחר פסוק.
2. נפתח `VerseActionBar`.
3. הוא בוחר הדגשה, סימון או הערה.
4. נשמרה רשומת `StudyMark`.
5. אם המשתמש מחובר, הרשומה נשמרת בשרת.
6. הנתונים מתמזגים עם מצב המסך.
7. `ReadingActivity` מתעד את הפעולה.
8. בעתיד הסימון מוצג ב-`BibleNotes` וב-`Dashboard`.

## 6.3 סימון טקסט במסגרת לימוד

1. המשתמש בוחר טקסט ב-`AnnotatedText`.
2. נפתח סרגל צבעים וקו תחתון.
3. נקבעים `start_offset` ו-`end_offset`.
4. נוצרת רשומת `StudyAnnotation`.
5. הרשומה נשמרת בשרת וב-IndexedDB.
6. בטעינה הבאת הרשומות ממוזגות לפי `annotationKey`.
7. הטקסט מפוצל למקטעים ומעוטר.

## 6.4 השלמת פרק והתקדמות

1. המשתמש מסיים את הפרק או מבקש לשמור.
2. נבנית רשומת `Reading`.
3. אם הפרק תואם לתוכנית, נקבע `plan_day`.
4. נשמרים תאריך, תרגום והשתקפות.
5. נרשמת פעילות `chapter_visit`.
6. `Plan` מחשב אילו ימים הושלמו.
7. `Dashboard` מחשב את רצף הימים והסטטיסטיקות.

## 6.5 פרסום גילוי ותגובה

1. המשתמש נדרש להתחבר.
2. הוא מזין כותרת, מקרא וגוף.
3. נוצרת רשומת `Revelation` ללא `parent_id`.
4. הפיד מתעדכן באמצעות invalidation של React Query.
5. בפתיחת תגובות נטענים רשומות עם `parent_id` מתאימות.
6. תגובה חדשה נשמרת עם `parent_id` של הפוסט.
7. לייק מעדכן את שדה `likes`.

## 6.6 התקנת לוגנדה

1. המנהל נכנס ל-`/AdminDashboard`.
2. בוחר את המקטע Luganda Bible.
3. `LugandaInstaller` קורא ל-`lugandaInstall` עם action=status.
4. השרת מחזיר רשימת פרקים קיימים וחסרים.
5. המנהל מפעיל Install.
6. השרת מוריד רק פרקים חסרים.
7. כל פרק נשמר ב-`LugandaChapter`.
8. השרת מפסיק אם רץ ללא התקדמות.
9. `ChapterCoverage` מציג כיסוי מעודכן.

## 6.7 התקנת KJV+ ומילון Strong

1. המנהל פותח את מקטע KJV+.
2. המערכת טוענת את מצב הכיסוי.
3. התקנה מורידה פרקים חסרים ושומרת אותם ב-`KjvPlusChapter`.
4. מופעלת התקנת מילון Strong.
5. המילון נשמר ב-`StrongEntry`.
6. בקריאת KJV+, `StrongsText` מזהה את הקודים.
7. לחיצה על הקוד פותחת `StrongsPopup`.
8. המשתמש רשום אינו נדרש להתחבר כדי לקרוא הגדרה שכבר נמצאה.

## 6.8 שיתוף פסוק

1. המשתמש בוחר פסוק או קטע.
2. נפתח `ShareSheet`.
3. המערכת מרכיבה קטעים: פסוק, שפה נוספת, תפילה והצלבות.
4. המשתמש בוחר ערוץ.
5. `lib/share.js` בונה URL.
6. קישור מועתק או נפתח ביישום חיצוני.
7. קוד ה-URL ממוקם בסוף הטקסט.

## 6.9 התקנת PWA

1. הדפדפן מפעיל `beforeinstallprompt`.
2. ה-`InstallPrompt` שומר את האירוע.
3. המשתמש לוחץ Install.
4. נקרא ל-`prompt()`.
5. לאחר `userChoice` מתעדכן מצב ההתקנה.
6. `PwaHead` רושם את ה-Service Worker.
7. ה-Service Worker שומר את ה-app shell ומשתמש ב-runtime cache לתוכן דינמי.

## 6.10 ניהול נגן אודיו גלובלי

1. המשתמש בוחר סדרה.
2. הדפים ממירים אותה ל-queue של רצועות.
3. `PlayerProvider` מקבל את ה-queue.
4. נוצר אובייקט `Audio` אחד.
5. הנגן ממשיך לנגן גם כאשר המשתמש מנווט לעמוד אחר.
6. `GlobalPlayer` מציג את המצב והפעולות.
7. בסיום רצועה מוחלת repeat one/all או מתקדמת ה-queue.

---

# 7. הערות טכניות לפיתוח

## 7.1 ספריות וכלי עזר

### React

- רכיבים פונקציונליים.
- Hooks לניהול מצב ואפקטים.
- Context לאימות, מותג ונגן.
- שימוש נרחב ב-`useMemo`, `useCallback` ו-`useEffect`.

### React Router

- ניווט בין עמודים.
- `Link`.
- `useNavigate`.
- `useSearchParams`.
- פרמטרים שאילתה למצב העמוד.

### TanStack Query

משמש ל:

- טעינת אוספים.
- caching.
- invalidation לאחר mutation.
- מצבי loading/error.
- polling של פעילות קריאה.

**חשוב:** שמות ה-`queryKey` צריכים להיות עקביים בין קריאה, mutation ו-invalidation. לדוגמה, כאשר נוצר גילוי או תגובה יש לבטל את `["revelations"]`.

### Lucide React

מספק את רשימת האייקונים. אין מערכת SVG מותאמת; שינוי עיצוב אייקון נעשה דרך wrapper או class.

### date-fns

משמש לעיצוב תאריכים ולחישוב הפרשים חכמים.

### FSe2

מספק:

- `fse2.entities`.
- `fse2.functions.invoke`.
- `fse2.auth`.
- גישה לשרת-side functions.
- סכמת הרשאות עבור entities.

## 7.2 דפוסי עיצוב חוזרים

### Seed fallback

מערכת התוכן משתמשת בשני מקורות:

1. רשומות חיות מה-DB.
2. נתוני גיבוי מ-`seedContent.js`.

היתרון הוא שהאפליקציה לעולם אינה מציגה מסך ריק באופן מכוער. החסרון הוא שיותר רבות מן הדפים מציגות תוכן גיבוי גם כאשר השרת תקין אך אין עדיין נתונים ניהוליים.

### Dual storage

סימונים, הערות ותוכניות לא מקווניות נשמרים בשרת וב-IndexedDB. בעת מיזוג יש להעדיף תמיד את הגרסה העדכנית או למזג לפי מפתח ייחודי.

### Server-first public content

פעולות כמו יצירת גילוי, תגובה, לייק והודעת קבוצה עוברות דרך `contentApi.js` ולא יוצרות רשומות ישירות מהדפדפן. כך נשמרת לוגיקת הרשאות והאימות בשרת.

### Event-driven UI

אירועים רבים מבוססים `onClick` ולא על כפתורי submit מלאים. יש לשמור על `type="button"` כדי למנוע submit מקרי, במיוחד בטפסים.

### Portal-less modals

המודאלים ממוקמים ישירות בעץ ה-React ולא ב-Portal. אם יתווספו מודאלים עם stacking context או תפריטים חוצי גבולות, יש לבחור Portal.

## 7.3 דפוסים חשובים לפיתוח עתידי

### הוספת ישות תוכן

1. ליצור קובץ תחת `entities/`.
2. להגדיר שדות, required ותוויות.
3. להגדיר הרשאות קריאה וכתיבה.
4. להוסיף את הישות ל-`MANAGED` ב-`adminContent.js`.
5. להוסיף מיפוי ב-`content.js`.
6. להוסיף reader ב-`contentApi.js`.
7. להוסיף טופס או רשומה ב-`AdminDashboard`.
8. להוסיף seed fallback אם צריך.

### הוספת תרגום

1. להוסיף פריט ל-`VERSIONS`.
2. להגדיר `id`, `language`, `translation`, `strongs`.
3. לוודא שהמקור מוכר ל-`bibleApi`.
4. לוודא שהפרק נשמר ב-IndexedDB לפי המפתח הנכון.
5. לוודא שהתרגום מופיע ב-`VersionPicker`.
6. לבדוק את התנהגות שגיאה כאשר התרגום אינו מותקן.

### הוספת אנטיטי

לפני הוספת אנטיטי יש לוודא:

- שאין סתירה עם אנטיטי קיים.
- שהמיקום המדויק תקין.
- שהמפתח מייצג ייחודית את האנטיטי.
- שהחלופה של ה־seed content לא משנה את התוצאה.
- שהמשתמש יכול לסמן טקסט בלי לנתק את הניווט.

### הוספת דף

1. ליצור קובץ תחת `pages/`.
2. לבחור שם ייחודי.
3. להוסיף נתיב במפת הניתובים.
4. להוסיף קישור ב-`AppHeader`, `AppFooter` או בעמוד מרכזי.
5. לוודא שהדף מקבל `currentPageName` דרך `Layout`.
6. להוסיף כותרת, מצב ריק, מצב טעינה ומצב שגיאה.

### הוספת שדה ל-`Reading`

יש לעדכן:

- Entity.
- טופסי `Chapter`.
- `recordReading`.
- Dashboard.
- רשימת `BibleNotes`.
- סטטיסטיקות ותצוגות רלוונטיות.

## 7.4 כללי אבטחה

1. **אין להשאיר את סיסמת המנהל כברירת מחדל בפרודקשן.**
2. יש להגדיר את `ADMIN_INITIAL_PASSWORD` בחסויות מנוהלים.
3. יש להגדיר secret חזק לחתימת session tokens.
4. אין לחשוף tokens בלוגים.
5. יש להבטיח שהרשאות update/delete מוגבלות לבעלים.
6. יש לאמת שדות בצד השרת ולא רק בצד הלקוח.
7. יש להגביל את כלי ההתקנה למנהל או למפתח install מוגנן.
8. יש לנקות token לאחר 12 שעות או בעת logout.
9. אין לחשוף את סיסמת מנהל בקוד או ברישומי URL.
10. יש להימנע משימוש ב-`safeText` כהגנה מול XSS. React כבר מבטל HTML רגיל, אך אין להשתמש ב-`dangerouslySetInnerHTML` עם נתוני משתמש ללא sanitization.
11. יש להגביל ולנקות שדות אינטראקטיביים לפני הצגה.
12. יש להתחשב בעובדה ש-`localStorage` גלוי ל-JavaScript באותו origin.

## 7.5 כללי איכות ונגישות

- להשתמש ב-`aria-label` על כפתורי אייקון.
- לשמור על `role="status"` בטעינה.
- לוודא שמודאלים תומכים ב-Escape.
- לוודא שהסרגל הצץ מסומן כעריכה, לא כפשוט סמן.
- לוודא שהנגן מספק כפתורים בעלי שמות נגישים.
- לא להסתמך על צבע בלבד כדי להבדיל מצב.
- לשמור על מספר רמות של מידע הארדה, אך להימנע מהצפנת תוכן רגיש בלבד.
- לבדוק מקלדת בתפריטים ובחלוניות.
- לוודא שפתירת הטקסט אינה מבטלת את הפעולה שהמשתמש ביקש.

## 7.6 נקודות תשומת לב מיוחדות

### חלונית `Modal` ו-`ShareSheet`

`ShareSheet` מחזיר `null` כאשר `open` הוא false, ובמקביל מרנדר `Modal`. זה תקין, אך אפשר לפשט על ידי הסרת הבדיקה הכפולה מ-`Modal`.

### `AuthContext`

ב-`checkAuth` הקוד מציין `isAuthenticated=true` לאחר `fse2.auth.me()` שהצליח. מומלץ לוודא שה־SDK זורק שגיאה גם כאשר אין משתמש מחובר.

### שאילתות רשימה ללא סינון בעלות

במקרים רבים הקוד מבקש רשומות רבות ומסנן בצד הלקוח:

```js
fse2.entities.Reading.list("-updated_date", 300)
```

לאחר מכן הוא מסנן לפי `owner_email`.

זה עובר, אך עלול:

- להביא לחשיפת רשומות של משתמשים אחרים ברשת.
- להגביל את המשתמש ל-300 רשומות.
- ליצור עומס מיותר.

עדיף להוסיף filters בשרת אם ה־SDK תומך בכך.

### שדות JSON

`KjvPlusChapter.verses` ו-`LugandaChapter.verses` הם מחרוזות JSON. יש לוודא:

- סדר הפסוקים יציב.
- קיימים `verse` ו-`text` בכל רשומה.
- אין JSON פגום בעת התקנה.
- יש להמנע מכתיבת JSON בלי בדיקת parse.

### התקנות אטומיות

ההתקנות אמורות להיות idempotent. מומלץ:

- לאחר קריאת המצב הקיים לבצע upsert.
- להשתמש במפתח ייחודי `book_number + chapter`.
- לא ליצור כפילויות אם התהליך נעצר באמצע.
- להפעיל rate limiting ו-backoff מול מקורות חיצוניים.

### Service Worker

עדכון של `SHELL_CACHE` או `RUNTIME_CACHE` דורש עדכון גרסה, אחרת דפדפנים עלולים להמשיך להשתמש במטמון ישן. נוסף לכך, `cache.addAll` נכשל אם אחד המסלולים אינו זמין; הקוד ממשיך בהתקנה, אך כדאי לרשום cache miss ולא להחריב.

### מותג דינמי

`BRAND_CSS` מוזרק כתוך תוכן קבוע, ו-`ThemeContext` מחליף משתנים דרך style על רמת ה-document. יש לוודא שכל המשתמשים במשתני ה-CSS מגיעים לאותה רמה ושהערכים מהשרת מנוקים.

### רשימות תוכן ונתוני גיבוי

מספר עמודים ממזגים בין DB ל-seed content לפי כותרת. אם שינוי כותרת ב-DB ייצור כפילות, כדאי להוסיף מזהה יציב ומקור, למשל:

```text
source: "db" | "seed"
external_id: "..."
```

## 7.7 שיקולי ביצועים

- `useMemo` משמש לרשימות גדולות, סינון וחישובים.
- כתיבת `ReadingActivity` אינה אמורה לחסום את פעולת הקורא.
- `ActivityFeed` מבצע polling כל 30 שניות; יש לבחון אם נדרש רק כאשר הלשונית פעילה.
- רשימות entity מוגבלות למאות שורות, אך עם מספר משתמשים עשוי להיווצר עומס.
- `StrongsPopup` עשוי להפעיל פעולת רשת לכל קוד חדש; כדאי להוסיף cache מקומי לקודים שכבר נפתחו.
- `IndexedDB` עדיף על localStorage לאחסון תוכן גדול.
- תמונות base64 מגדילות את חבילת האפליקציה; בפרודקשן עדיף קבצים סטטיים רגילים או URL חיצוני.

## 7.8 תרשימי בדיקה מומלצים

### בדיקות יחידה

- `compressChapters`.
- `matchesPassage`.
- `parseReference`.
- `parseOutlineRange`.
- `normalizeStrongCode`.
- `safeText`.
- `formatDuration`.
- `buildSegments` ב-`AnnotatedText`.
- מיזוג annotations.
- `findPlanDay`.
- חישוב streak.

### בדיקות אינטגרציה

- כניסת קורא ושמירת התקדמות.
- כניסת מנהל והפעלת התקנה.
- יצירת גילוי ותגובה.
- התקנת KJV+ ופתיחת Strong.
- הורדת פרק וקריאה לא מקוונית.
- שיתוף פסוק.
- התקנת PWA.

### בדיקות E2E מומלצות

1. משתמש נכנס.
2. בוחר תוכנית יומית.
3. קורא פרק.
4. מסמן פסוק.
5. כותב הערה.
6. משנה תרגום.
7. מוריד את הפרק לאופליין.
8. מבצע reload לאחר ניתוק רשת.
9. קורא את הפרק.
10. בודק שהסימונים נשמרו.

---

# סיכום מפעיל

Pray-Read Bible היא מערכת רבת-פנים שמחברת קריאת מקרא, לימוד, תפילה, מדיה, קהילה והתקנות מקומיות. המבנה מבוסס על React, React Router, TanStack Query, FSe2, IndexedDB ו-Service Worker.

החלקים שדורשים תשומת לב מיוחדת בעת המשך פיתוח הם:

1. הבדלה בין אימות קורא לאימות מנהל.
2. אכיפת בעלות ברמת השרת.
3. עקביות בין אחסון מקומי לאחסון שרת.
4. מניעת כפילויות בהתקנות.
5. שמירה על עקביות בין דפי התוכן לבין הנתונים החיים.
6. ניהול נכון של מקורות חיצוניים, rate limiting ו־backoff.
7. שמירה על נגישות, ניווט מקלדת והודעות שגיאה ברורות.
8. בדיקת consistency של `queryKey`, פילטרים ו־invalidations.
9. טיפול ב־JSON של פרקים וב־localStorage באופן עמיד.
10. החלפת סיסמת ברירת המחדל והגדרת secrets בסביבת ייצור.
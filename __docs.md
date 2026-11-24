# תיעוד מערכת
**App ID:** `app_73e21b4aa5684452`

---
<think>
We need produce Hebrew comprehensive docs based snippets. Need note addresses inferred createPageUrl likely /Name. Need cover all pages shown. "לכל קובץ שנוצר" perhaps all supplied non-trash? Enormous. Need organize. We can state based available excerpts, truncated. Include components, libs, functions, entities. File structure section potentially huge. Desired 5 but user asks high detail. Need avoid inventing exact URL maybe likely createPageUrl. Mention inferred.

We need cover page list around 30. Navigation table.

Need include technical issues perhaps observed: default admin password, SHA256, localStorage token, query keys missing auth filters, filtered client side privacy risk, footer only home, service worker route assumptions, PWA registration truncated. But requested docs, technical notes.

Let's formulate in Hebrew with sections 1-7. File structure per exact files, perhaps group repetitive entity files but says each. Can list all pages, components, entities, libs/functions. Include assets excluded as non-code, trash excluded.

Let's create detailed but within token.
</think>
# תיעוד מערכת  -  Pray-Read Bible

## 0. תקציר מבנה המערכת

Pray-Read היא אפליקציית React לקריאת המקרא, מחקר ותפילה, בעברית, לוגנדה ואנגלית. היא מיועדת לקוראים שמבקשים לקרוא פרק מלא באיטיות, לסמן פסוקים, לשמור הערות והתפללות, להשתמש בחומרי לימוד ולשתף תוכן.

המערכת מורכבת מארבע שכבות:

1. **ממשק React**  -  דפים, רכיבים, ניווט, קורא מקרא, דשבורד, קהילה ומרכז ניהול.
2. **שכבת נתוני האפליקציה**  -  `fse2`, React Query, IndexedDB, `localStorage`.
3. **שכבת שירות (Serverless Functions)**  -  התקנת תוכן, אימות מנהלים, ביקורת ספרייה, הגשת תוכן ציבורי.
4. **מודל נתונים**  -  Entities המגדירים את ספריית התוכן, סימני קריאה, משתמשים, קהילה, התקנות מקרא והגדרות Strong’s.

מספר תכנים ציבוריים נטענים ממסד הנתונים, אך לצדם קיימת ספריית זרע מקומית (`seedContent`) המשמשת כ-fallback כדי שהממשק לא ייראה ריק בעת כשל שרת או כשטבלת התוכן עדיין ריקה.

> **הערה:** חלק מהקבצים שסופקו מקוצרים בסימן `[נחתך]`. התיעוד מבוסס על הקוד הזמין, ולכן פרטים מדויקים על חלק מה-handler-ים, שדות והתנהגויות משניים עשויים להיות חלקיים.

---

# 1. מהות המערכת

## 1.1 מה המערכת עושה

Pray-Read מאפשרת לקורא:

- לקרוא את כל 66 ספרי המקרא.
- לעבור בין פרקים ופסוקים.
- לבחור תרגומים:
  - KJV.
  - KJV עם מספרי Strong’s.
  - מקרא לוגנדה.
  - תרגום/מקור אינטרנטי אם זמין.
- לסמן פסוקים, להוסיף סימונים, הערות וסימני „ספר”.
- לקרוא מבוא לספר, מתווה, תפילה לספר ומקראי מפתח.
- לקבל הערות פרשה, תובנה תיאולוגית, היסטורית ו-Q&A.
- להשתמש בהגדרות מספרי Strong’s באופן מקוון ולא מקוון.
- להשתמש בתוכן אודיו דיגיטלי דרך נגן גלובלי.
- לקרוא את יומן התפילה, תוכן יומי, מנהרת תפילה, קבוצות דיבור והודעות קהילה.
- להוריד תוכן למכשיר ולקרוא אותו ללא חיבור.
- לעקוב אחרי רצף קריאה, יעדי תוכן ופעילות קריאה.

## 1.2 למי המערכת מיועדת

### קוראים אורחים

יכולים:

- לקרוא את התוכן הציבורי.
- להשתמש באופן מקוון.
- להוריד תוכן מקומית.
- לשתף פסוקים ותוכן.

אינם יכולים לשמור על שרת סימנים אישיים או להגיש תוכן קהילתי.

### משתמשים מחוברים

יכולים:

- לשמור התקדמות קריאה.
- ליצור הערות, סימונים, ספסרים ויומן תפילה.
- לשמור תפילות ותוכן יומי.
- להשתף גילויים ולהגיב עליהם.
- להצטרף לקבוצות דיבור ולשלוח הודעות.
- לקבל התראות מספרי Strong’s.

### מנהלי תוכן

יכולים:

- להתחבר למרכז הניהול באמצעות מנהל ייעודי.
- לערוך תוכן ציבורי.
- לנהל משתמשים והודעות.
- להתקין את המקרא בלוגנדה ואת KJV+.
- לבצע אימות על כל פרקי המקרא.
- לנהל את היגיון, הצבעים וההגדרות.

## 1.3 הערך של המערכת

הערך המרכזי הוא אחדות בין:

- **קריאה מקרא איטית וממוקדת.**
- **חומר לימוד המצורך לכל ספר ופרק.**
- **מעקב אישי ורצף קריאה.**
- **עבודה ללא חיבור.**
- **תוכן קהילתי.**
- **תפילה מובנית סביב הפסוקים.**

המערכת אינה רק מציגת מקרא; היא מנסה להפוך קריאה למסלול לימוד, סימון, תפילה ושיתוף.

---

# 2. עמודים ותפקידיהם

כתובות ה-URL מובנות לפי `createPageUrl("<PageName>")` ולכן צפויות להיות בצורת:

```text
/<PageName>
```

לדוגמה:

```text
/BibleReader
/Chapter
/Devotionals
```

## 2.1 דפי עיקריים

### `pages/Home.jsx`  -  דף הבית

**כתובת:** `/Home`

**תפקיד:**

- נקודת הכניסה הראשית לאפליקציה.
- מציג hero, פעולות ראשיות, תוכן יומי, פסוק היום, רשת תוכן והנהורת התקנת PWA.

**למה הוא קיים:**

- לתת למבקר להבין במהירות את הערך של המוצר.
- להוביל לספרייה, תפילות, קהילה, מוזיקה ו-Q&A.
- להציג תוכן יומי גם כשאין חיבור או כשמשתמש אינו מחובר.

**פעולות מרכזיות:**

- כניסה ל-Bible Reader.
- מעבר ל-Devotionals.
- פתיחת Prayer Library.
- פתיחת Verse-Songs.
- פתיחת Q&A.
- מעבר לקהילה.
- שיתוף פסוק היום.
- התקנת האפליקציה למכשיר.
- הצגת מדדי תוכן ופעילות אחרונה.

---

### `pages/BibleReader.jsx`  -  מסך המקרא הראשי

**כתובת:** `/BibleReader`

**תפקיד:**

- מציג את 66 הספרים בשתי מקוראות.
- מאפשר חיפוש בשם הספר באנגלית או לוגנדה.
- מאפשר בחירת ספר והצגת רשת הפרקים.
- מנהל את זמינות התוכן להורדה מקומית.

**מה המשתמש יכול לעשות:**

- חיפוש ספר.
- מעבר בין הברית הקדומה והחדשה.
- לחיצה על ספר.
- בחירת פרק.
- בחירת שפת תצוגה.
- בדיקה אם הספר זמין במלואו במכשיר.

**אינטראקציות מרכזיות:**

- שדה `book-search`.
- לשוניות Old Testament/New Testament.
- כרטיסי ספרים.
- `ChapterGrid`.
- סימון זמינות offline.

**קבצים משולבים:**

- `components/read/BookGrid.jsx`
- `components/read/ChapterSelector.jsx`
- `lib/offlineDb.js`
- `lib/bibleBooks.js`

---

### `pages/Chapter.jsx`  -  מסך קריאת פרק

**כתובת:** `/Chapter`

**פרמטרים אפשריים:**

```text
?book=43&chapter=3
&lang=lu
&verse=16
```

**תפקיד:**

הוא מסך הליבה של המערכת. הוא מטען פרק, מציג את פסוקיו, מאפשר לבחור תרגום, מנהל סימונים, הערות, תפילות, מקראי מפתח, Strong’s, השתפות והתקדמות קריאה.

**מה המשתמש יכו�ל לעשות:**

- לבחור תרגום.
- לבחור פסוק.
- להפעיל או להסיר היל��ט.
- להוסיף סימון או הערה.
- לפתוח תפילה הקשורה לפסוק.
- לפתוח הערת פרשה.
- לפתוח cross-references.
- לשתף פסוק.
- לפתוח הגדרת Strong’s.
- לרשום את הפרק כהושלם.
- להוסיף reflection ו-prayer point.
- לפתוח חלונית המחקר הצדדית.
- לקרוא את תפילת הסיום.

**אינטראקציות מרכזיות:**

- `VersionPicker`.
- לחיצה על פסוק.
- `VerseActionBar`.
- `FloatingVerse`.
- `PassageTabs`.
- `PassagePrayer`.
- `ChapterSidebar`.
- `ChapterResourcesPanel`.
- `ChapterReaderPane`.
- `ChapterClosingPrayer`.
- `ShareSheet`.
- `StrongsPopup`.
- כפתור “Mark complete”.

---

### `pages/Plan.jsx`  -  תוכנית הקריאה

**כתובת:** `/Plan`

**תפקיד:**

- מציג את מסלול הקריאה בן 30 הימים.
- מחשב אילו ימים הושלמו.
- מציג את היום הנוכחי ואת אחוז ההתקדמות.

**מה המשתמש יכול לעשות:**

- לראות את כל ימי התוכנית.
- לראות איזה יום הושלם.
- לעבור לפרק המשויך ב-Bible Reader.
- לחשוף את המקרא בדפדפן.

**מקורות נתונים:**

- `ReadingPlan` דרך `fetchPublicCollection("plan")`.
- fallback מקומי מ-`PLAN_DAYS`.
- התקדמות מ-`Reading`.

---

### `pages/Journal.jsx`  -  יומן התפילה

**כתובת:** `/Journal`

**תפקיד:**

- יוצר ועורך רשומות אישיות.
- מאפשר סינון לפי קטגוריה.
- מאפשר מחיקה.
- מחבר רשומה לפרק מקרא.

**קטגוריות:**

- praise.
- petition.
- confession.
- thanksgiving.
- reflection.

**פעולות:**

- הוספת רשומה.
- עריכה.
- מחיקה.
- סינון.
- קישור לפרק.
- שמירה דרך `JournalEntry`.

---

### `pages/BibleNotes.jsx`  -  סימונים והערות

**כתובת:** `/BibleNotes`

**תפקיד:**

- מציג למשתמש את כל הסימונים, הספסרים וההערות ששמר.
- מאפשר לחזור לפסוק המקורי.

**מקורות:**

- `StudyMark`.
- `Reading`.

**פעולות:**

- סינון לפי סוג.
- מעבר לפסוק.
- מחיקה, במיקום שבו נמספק על ידי הדף/הרכיב.

---

### `pages/Dashboard.jsx`  -  לוח בקרת הקורא

**כתובת:** `/Dashboard`

**תפקיד:**

- להציג את מצב הקריאה של המשתמש.
- להציג רצף ימי קריאה.
- להציג פעילות אחרונה.
- להציג ספירת תוכן offline.
- להציג תוכן יומי והמשך התוכנית.

**מקורות:**

- `Reading`.
- `StudyMark`.
- `DevotionalProgress`.
- `PrayerSaved`.
- `ReadingActivity`.
- IndexedDB.

**פעולות:**

- מעבר ל-Bible Reader.
- מעבר ליומן.
- מעבר להערות.
- מעבר לתוכן יומי.
- הצגת פעילות אחרונה.
- ניהול הורדות offline.

---

### `pages/Devotionals.jsx`  -  תוכן יומי

**כתובת:** `/Devotionals`

**תפקיד:**

- מציג רשימת תוכני יומיים.
- מאפשר חיפוש וסינון.
- פותח תוכן יומי מלא במודאל.
- מאפשר לסמן כהושלם.
- מאפשר שיתוף.

**מקורות:**

- `Devotional`.
- `DevotionalProgress`.
- `DEVOTIONALS` מקומי כ-fallback.

**פעולות:**

- חיפוש.
- סינון.
- פתיחת מודאל.
- סימון “done”.
- שיתוף במספר ערוצים.
- מעבר לאופן לוגנדה.

---

### `pages/PrayerLibrary.jsx`  -  ספריית התפילות

**כתובת:** `/PrayerLibrary`

**תפקיד:**

- מציג תפילות לפי קטגוריה ושפה.
- מאפשר חיפוש, שיתוף ושמירה.

**מקורות:**

- `Prayer`.
- `PrayerSaved`.
- `PRAYERS` מקומי.

**פעולות:**

- חיפוש.
- סינון לפי קטגוריה.
- החלפת אנגלית/לוגנדה.
- שמירת תפילה.
- הסרת תפילה מהשמורים.
- שיתוף.

---

### `pages/QA.jsx`  -  שאלות ותשובות

**כתובת:** `/QA`

**תפקיד:**

- מציג Q&A ציבורי.
- מאפשר חיפוש וסינון לפי קטגוריה.
- מאפשר למשתמש מחובר לשלוח שאלה.

**מקורות:**

- `QAEntry`.
- `QA_ENTRIES` מקומי.

**פעולות:**

- חיפוש.
- סינון.
- פתיחת תשובה.
- שליחת שאלה.
- הצגת מצב הצלחה/שגיאה.

---

### `pages/VerseOfDay.jsx`  -  פסוק היום

**כתובת:** `/VerseOfDay`

**תפקיד:**

- מציג פסוק לפי תאריך.
- מאפשר לעבור לקריאת הפסוק במקרא.
- מאפשר לשתף.

**מקורות:**

- `VerseOfDay`.
- `VERSE_OF_THE_DAY` מקומי.

---

### `pages/TheologicalInsights.jsx`  -  תובנות תיאולוגיות

**כתובת:** `/TheologicalInsights`

**תפקיד:**

- מציג רשימת תובנות תיאולוגיות.
- מאפשר חיפוש, פתיחת פריט ושמירה מקומית.

**רכיב מרכזי:** `InsightsBoard` עם `kind="theological"`.

---

### `pages/HistoricalInsights.jsx`  -  תובנות היסטוריות

**כתובת:** `/HistoricalInsights`

**תפקיד:**

- מציג רשימת תובנות היסטוריות.
- מאפשר חיפוש, פתיחת פריט ושמירה.

**רכיב מרכזי:** `InsightsBoard` עם `kind="historical"`.

---

### `pages/VerseSongs.jsx`  -  רשימת סדרי Verse-Songs

**כתובת:** `/VerseSongs`

**תפקיד:**

- מציג סדרות שירי מקרא.
- מאפשר להפעיל סדרה שלמה דרך הנגן הגלובלי.

**מקורות:**

- `VerseSongSeries`.
- `VerseSongEpisode`.
- `VERSE_SONGS` מקומי.

**פעולות:**

- בחירת סדרה.
- הפעלת סדרה.
- מעבר לפרט הסדרה.

---

### `pages/VerseSongSeries.jsx`  -  פרטי סדרת Verse-Song

**כתובת:** `/VerseSongSeries?series=<שם>`

**תפקיד:**

- מציג את פרטי הסדרה.
- מציג את הרצועות לפי סדר.
- מאפשר לנגן רצועה בודדת או את הסדרה.

**פעולות:**

- Play/Pause.
- בחירת רצועה.
- מעבר בין רצועות דרך הנגן הגלובלי.
- ניווט לסדרות אחרות.

---

### `pages/Community.jsx`  -  מרכז הקהילה

**כתובת:** `/Community`

**תפקיד:**

- מציג את שלושת אזורי הקהילה:
  - Revelations.
  - Live Teaching.
  - Discussion Groups.
- מציג תצוגה מקדימה של פעילות אחרונה.

**פעולות:**

- מעבר לכל אזור.
- פתיחת גילוי, שיעור או קבוצה.

---

### `pages/CommunityRevelations.jsx`  -  גילויים בקהילה

**כתובת:** `/CommunityRevelations`

**תפקיד:**

- מציג פרסומים של קוראים.
- מאפשר לפתוח תגובות.
- מאפשר “לייק”.
- מאפשר פרסום גילוי חדש.

**מקורות:**

- `Revelation`.
- `COMMUNITY_POSTS` מקומי.

**פעולות:**

- פרסום גילוי.
- לייק.
- פתיחת/סגירת שרשור.
- שליחת תגובה.
- מעבר להתחברות אם המשתמש אינו מחובר.

---

### `pages/CommunityLiveTeaching.jsx`  -  לימוד חי

**כתובת:** `/CommunityLiveTeaching`

**תפקיד:**

- מציג מפגשי לימוד חי עתידיים.
- מציג תאריך, מנחה, תיאור וקישור הצטרפות.

**מקורות:**

- `LiveSession`.
- `LIVE_SESSIONS` מקומי.

**פעולות:**

- פתיחת מפגש.
- מעבר לקישור ההצטרפות.

---

### `pages/DiscussionGroups.jsx`  -  קבוצות דיבור

**כתובת:** `/DiscussionGroups`

**תפקיד:**

- מציג קבוצות לימוד.
- מאפשר להצטרף לקבוצה.
- מאפשר לקרוא ולשלוח הודעות בתוך הקבוצה.

**מקורות:**

- `DiscussionGroup`.
- `DiscussionThread`.
- `DISCUSSION_GROUPS` מקומי.

**פעולות:**

- בחירת קבוצה.
- הצטרפות/עזיבה מקומית.
- שליחת הודעה.
- הצגת היסטוריית שיחה.

---

### `pages/Offline.jsx`  -  מרכז אופליין

**כתובת:** `/Offline`

**תפקיד:**

- מנהל את התוכן הזמין במכשיר.
- מאפשר להוריד או למחוק:
  - פרקי מקרא.
  - פסוקים.
  - הגדרות Strong’s.
  - תוכנים יומיים.
  - הערות.
  - תפילות.
  - Q&A.
  - פסוק היום.

**פעולות:**

- הורדת תרגום שלם או חלקי.
- מחיקת קבצים מקומיים.
- ניקוי מאגר.
- הצגת נפח אחסון ומספר רשומות.
- בדיקת זמינות מקומית של פרק.

---

### `pages/About.jsx`  -  אודות

**כתובת:** `/About`

**תפקיד:**

- מסביר את המטרה של Pray-Read.
- מציג את הערך הרוחני והמוצרי של האפליקציה.
- מפנה למספר נתיבי שימוש מרכזיים.

---

### `pages/Contact.jsx`  -  יצירת קשר

**כתובת:** `/Contact`

**תפקיד:**

- מאפשר לשלוח הודעה לצוות.

**טופס:**

- שם.
- דוא"ל.
- נושא.
- הודעה.

**פעולה:**

- `submitContactMessage` יוצר רשומה ב-`ContactMessage`.

---

### `pages/InstallPrompt.jsx`  -  התקנת PWA

**כתובת:** `/InstallPrompt`

**תפקיד:**

- מסביר כיצד להתקין את האפליקציה בדפדפן או במכשיר.
- מזהה פלטפורמה.
- מפעיל את `beforeinstallprompt` כאשר הדפדפן מאפשר התקנה.

---

### `pages/Login.jsx`  -  התחברות

**כתובת:** `/Login`

**תפקיד:**

- מאפשר למשתמש להתחבר עם דוא"ל וסיסמה דרך `fse2.auth.login`.
- לאחר הצלחה מעביר ל-Dashboard.

---

### `pages/Signup.jsx`  -  הרשמה

**כתובת:** `/Signup`

**תפקיד:**

- יוצר חשבון קורא.
- מאמת אורך סיסמה, אימות סיסמה והסכמת תנאי שימוש.
- תומך במצב שבו נדרש אימות דוא"ל לפני כניסה.

---

### `pages/ForgotPassword.jsx`  -  שכחתי סיסמה

**כתובת:** `/ForgotPassword`

**תפקיד:**

- שולח בקשת איפוס סיסמה באמצעות `fse2.auth.forgotPassword`.
- אינו חושף אם כתובת הדוא"ל קיימת בפועל, כדי לא לחשוף כתובות רשומות.

---

### `pages/ResetPassword.jsx`  -  איפוס סיסמה

**כתובת:** `/ResetPassword?token=<token>`

**תפקיד:**

- מאמת את קיום token.
- מאמת סיסמה חדשה באורך של שמונה תווים לפחות.
- קורא ל-`fse2.auth.resetPassword`.

---

### `pages/Logout.jsx`  -  התנתקות

**כתובת:** `/Logout`

**תפקיד:**

- מנקה את מצב ההתחברות.
- מחזיר את המשתמש לדף הבית.

---

### `pages/Privacy.jsx`  -  מדיניות פרטיות

**כתובת:** `/Privacy`

**תפקיד:**

- מסביר אילו נתונים נשמרים בשרת.
- מסביר אילו נתונים נשמרים מקומית.
- מציג מידע בנוגע למחיקת נתונים ושימוש בעוגיות.

---

### `pages/Terms.jsx`  -  תנאי שימוש

**כתובת:** `/Terms`

**תפקיד:**

- מגדיר שימוש אישי וקהילתי בתוכן.
- מציין זכויות יוצרים והגבלות בפרסום מחדש.
- מסביר את מקורות הטקסטים המקראיים.

---

### `pages/Admin.jsx`  -  כניסת מנהל תוכן

**כתובת:** `/Admin`

**תפקיד:**

- מספקת כניסה נפרדת למנהל.
- משתמשת ב-`adminSession`, שומרת את ה-token ב-`localStorage`.
- מנסהת לשחזר מצב באמצעות פעולת `session`.

**פעולות:**

- התחברות עם דוא"ל וסיסמת מנהל.
- זיהוי session שפג.
- מעבר ל-`/AdminDashboard`.

---

### `pages/AdminDashboard.jsx`  -  לוח הניהול

**כתובת:** `/AdminDashboard`

**תפקיד:**

מרכז ה-CMS. כולל את הסעיפים:

- Dashboard.
- Books & Chapters.
- Luganda Bible.
- KJV+ with Strong’s.
- Devotionals.
- Prayer Library.
- Verse-Songs.
- Q&A.
- Insights.
- Users.
- Messages.
- Text Colours.
- Activity Log.
- Settings.

**פעולות:**

- יצירה, עריכה ומחיקה של רשומות.
- התקנת ותיקון המקרא.
- הפעלת ביקורת ספרייה.
- ניהול צבעי האתר.
- ניהול משתמשים, הודעות ויומן פעילות.
- יציאה ממנהל תוכן.

---

# 3. מפת ניווט לצורכי Debug

| פעולה | נקודת כניסה | כפתור/לינק | יעד |
|---|---|---|---|
| פתיחת דף הבית | כל דף | לוגו Pray-Read או תפריט Home | `/Home` |
| פתיחת קורא המקרא | דף הבית / Header | “Bible Reader” | `/BibleReader` |
| חיפוש ספר | `/BibleReader` | שדה חיפוש ליד `BookGrid` | רשת הספרים מסוננת |
| מעבר לברית הקדומה | `/BibleReader` | לשונית Old Testament | מגירה `section-old` |
| מעבר לברית החדשה | `/BibleReader` | לשונית New Testament | מגירה `section-new` |
| בחירת ספר | `/BibleReader` | כרטיס ספר | רשת פרקים של הספר |
| בחירת פרק | רשת הפרקים | מספר פרק | `/Chapter?book=<n>&chapter=<n>` |
| פתיחת פרק מתוכנית | `/Plan` | כרטיס יום/כפתור פתיחה | `/Chapter?...` |
| פתיחת ספר יומי | Header/Home | “Devotionals” | `/Devotionals` |
| חיפוש תוכן יומי | `/Devotionals` | שדה חיפוש | רשימה מסוננת |
| פתיחת תוכן יומי | `/Devotionals` | כרטיס/כפתור פתיחה | מודאל תוכן יומי |
| סימון תוכן יומי כהושלם | מודאל תוכן יומי | כפתור Done | `DevotionalProgress` |
| פתיחת ספריית תפילות | Header/Home | “Prayer Library” | `/PrayerLibrary` |
| סינון תפילות | `/PrayerLibrary` | Dropdown קטגוריה | רשימת תפילות מסוננת |
| החלפת שפת תפילה | `/PrayerLibrary` | EN/LU | תוכן תפילה מתחלף |
| שמירת תפילה | `/PrayerLibrary` | סמל ספסר | `PrayerSaved` |
| פתיחת Q&A | Header/Home | “Q&A” | `/QA` |
| שליחת שאלה | `/QA` | טופס “Ask a question” | `QAEntry` |
| פתיחת תובנה תיאולוגית | Header/Footer | “Theological insights” | `/TheologicalInsights` |
| פתיחת תובנה היסטורית | Header/Footer | “Historical insights” | `/HistoricalInsights` |
| חיפוש תובנה | דף Insights | שדה חיפוש | רשימה מסוננת |
| פתיחת פסוק היום | Header/Footer | “Verse of the day” | `/VerseOfDay` |
| מעבר לפסוק היום | `/VerseOfDay` | קישור/כפתור פתיחה | `/Chapter?...&verse=...` |
| פתיחת Verse-Songs | Header/Footer | “Verse-Songs” | `/VerseSongs` |
| הפעלת סדרה | `/VerseSongs` | כפתור Play בסדרה | הנגן הגלובלי |
| פתיחת סדרה | `/VerseSongs` | שם הסדרה | `/VerseSongSeries?series=...` |
| הפעלת רצועה | פרט סדרה | Play ליד רצועה | הנגן הגלובלי |
| פתיחת קהילה | Header/Footer | “Community” | `/Community` |
| פרסום גילוי | `/CommunityRevelations` | טופס “Share what God showed you” | `Revelation` |
| לייק גילוי | `/CommunityRevelations` | כפתור Heart | עדכון לייק/רשומת `Revelation` |
| פתיחת תגובות | `/CommunityRevelations` | כפתור Comments | שרשור תגובות |
| שליחת תגובה | שרשור תגובות | טופס תגובה | רשומת `Revelation` עם `parent_id` |
| פתיחת לימוד חי | `/Community` | “Live teaching” | `/CommunityLiveTeaching` |
| הצטרפות למפגש | `/CommunityLiveTeaching` | “Join session” | `join_link` חיצוני |
| פתיחת קבוצות | `/Community` | “Discussion groups” | `/DiscussionGroups` |
| בחירת קבוצה | `/DiscussionGroups` | כרטיס קבוצה | שיחת הקבוצה |
| הצטרפות לקבוצה | `/DiscussionGroups` | כפתור Join/Leave | מצב מקומי ב-`localStorage` |
| שליחת הודעה | `/DiscussionGroups` | טופס הודעה | `DiscussionThread` |
| פתיחת דשבורד | Header | “Dashboard” | `/Dashboard` |
| פתיחת הערות | Header/Footer | “My notes” | `/BibleNotes` |
| פתיחת יומן | Header/Footer | “Prayer journal” | `/Journal` |
| יצירת רשומת יומן | `/Journal` | “New entry” / `?new=1` | טופס יומן |
| שמירת יומן | `/Journal` | “Save entry” | `JournalEntry` |
| מעבר לפרק מהיומן | כרטיס יומן | קישור ספר/פרק | `/Chapter?...` |
| פתיחת מרכז אופליין | Header/Footer | “Offline centre” | `/Offline` |
| הורדת מקרא למכשיר | `/Offline` | כפתור הורדה ליד תרגום | IndexedDB |
| מחיקת נתוני מכשיר | `/Offline` | כפתור מחיקה/ניקוי | IndexedDB |
| התחברות | Header | “Sign in” | `/Login` |
| הרשמה | דפי התחברות | “Create account” | `/Signup` |
| איפוס סיסמה | דף התחברות | “Forgot password” | `/ForgotPassword` |
| בחירת תרגום בקריאה | `/Chapter` | `VersionPicker` | מעבר לתרגום פעיל |
| התקנת תרגום | `/Chapter` / `/Offline` | כפתור התקנה | `versions.js` + IndexedDB |
| בחירת פסוק | `/Chapter` | לחיצה על פסוק | פעולות פסוק |
| הערת פסוק | `/Chapter` | כפתור Note | `StudyMark` |
| היל��ט פסוק | `/Chapter` | כפתור Highlighter | `StudyMark` |
| סימון פסוק | `/Chapter` | כפתור Bookmark | `StudyMark` |
| פתיחת תפילת הפסוק | `/Chapter` | כפתור Prayer | `PassagePrayer` |
| פתיחת פרשה | `/Chapter` | כפתור Commentary | לשונית commentary |
| פתיחת cross-reference | `/Chapter` | כפתור קישור | `FloatingVerse` |
| שיתוף פסוק | `/Chapter` | כפתור Share | `ShareSheet` |
| פתיחת הגדרת Strong’s | `/Chapter` | קוד כחול G/H | `StrongsPopup` |
| השלמת פרק | `/Chapter` | “Mark complete” | `Reading` |
| פתיחת מדריך התוכן | `/Admin` | כניסת מנהל | `/AdminDashboard` |
| התקנת לוגנדה | `/AdminDashboard` | “Install Luganda” | `lugandaInstall` |
| התקנת KJV+ | `/AdminDashboard` | “Install KJV+” | `kjvInstall` |
| הפעלת ביקורת | `/AdminDashboard` | “Run library report” | `scriptureAudit` |
| עריכת תוכן | `/AdminDashboard` | Edit | מודאל לפי `FIELDS` |
| מחיקת תוכן | `/AdminDashboard` | Delete | מחיקת entity |
| יצירת תוכן | `/AdminDashboard` | Add/Create | מודאל יצירה |
| התנתקות מנהל | `/AdminDashboard` | Logout | ניקוי admin token |

---

# 4. מבנה הקבצים

## 4.1 דפים

| קובץ | תפקיד | מה מרנדר |
|---|---|---|
| `pages/Home.jsx` | דף הבית וכניסת המשתמש למוצר | Hero, משבצות שירות, פסוק היום, תוכן יומי, התקנת PWA |
| `pages/BibleReader.jsx` | בחירת ספר ופרק | חיפוש, רשת 66 ספרים, רשת פרקים, מצב offline |
| `pages/Chapter.jsx` | קריאת פרק מלאה | פסוקים, סימונים, הערות, תפילה, פרשה, Strong’s, השתפה, התקדמות |
| `pages/Plan.jsx` | מסלול קריאה 30 יום | רשימת ימים, סטטוס, התקדמות, קישורי פרקים |
| `pages/Journal.jsx` | יומן תפילה אישי | טופס, רשומות, סינון, עריכה ומחיקה |
| `pages/BibleNotes.jsx` | סימונים והערות | הילייטים, ספסרים, הערות, קישורים לפסוקים |
| `pages/Dashboard.jsx` | לוח קורא | סטטיסטיקות, streak, activity feed, offline, תוכן יומי |
| `pages/Devotionals.jsx` | ספריית תוכן יומי | רשימה, מודאל תוכן, סימון הושלם, שיתוף |
| `pages/PrayerLibrary.jsx` | ספריית תפילות | חיפוש, קטגוריות, שפות, שמירה ושיתוף |
| `pages/QA.jsx` | שאלות ותשובות | רשימת תשובות, חיפוש, טופס שאלה |
| `pages/VerseOfDay.jsx` | פסוק היום | פסוק, הערה, שיתוף וקישור למקרא |
| `pages/TheologicalInsights.jsx` | תובנות תיאולוגיות | `InsightsBoard` עם סוג תיאולוגי |
| `pages/HistoricalInsights.jsx` | תובנות היסטוריות | `InsightsBoard` עם סוג היסטורי |
| `pages/VerseSongs.jsx` | רשימת סדרות שירים | כרטיסי סדרות, הפעלת queue |
| `pages/VerseSongSeries.jsx` | פרטי סדרת שירים | רצועות, זמנים, נגן |
| `pages/Community.jsx` | מרכז קהילה | שלושה אזורי קהילה ותצוגת פעילות |
| `pages/CommunityRevelations.jsx` | גילויים ותגובות | פרסום, לייק, תגובות |
| `pages/CommunityLiveTeaching.jsx` | לימוד חי | מפגשים, מארחים, תאריכים וקישורים |
| `pages/DiscussionGroups.jsx` | קבוצות לימוד | בחירת קבוצה, הצטרפות, שיחה |
| `pages/Offline.jsx` | מרכז אופליין | הורדות, מחיקות, נתוני מכשיר |
| `pages/About.jsx` | מידע על האפליקציה | Hero ומסגרת מוצר |
| `pages/Contact.jsx` | יצירת קשר | טופס הודעה |
| `pages/InstallPrompt.jsx` | התקנת PWA | הוראות לפי פלטפורמה והפעלת prompt |
| `pages/Login.jsx` | התחברות קורא | טופס דוא"ל וסיסמה |
| `pages/Signup.jsx` | הרשמת קורא | טופס רישום ואימות |
| `pages/ForgotPassword.jsx` | שליחת איפוס | טופס דוא"ל |
| `pages/ResetPassword.jsx` | קביעת סיסמה חדשה | טופס token וסיסמה |
| `pages/Logout.jsx` | התנתקות | מסך טעינה וניקוי session |
| `pages/Privacy.jsx` | מדיניות פרטיות | הסבר תקנות אחסון ושימוש בנתונים |
| `pages/Terms.jsx` | תנאי שימוש | זכויות תוכן והגבלות |
| `pages/Admin.jsx` | כניסת מנהל | טופס admin ואימות session |
| `pages/AdminDashboard.jsx` | ניהול תוכן | מספר אזורי ניהול וטפסים ייעודיים |

## 4.2 רכיבי מנהל

| קובץ | תפקיד | מה מרנדר |
|---|---|---|
| `components/admin/ChapterCoverage.jsx` | סיכום כיסוי מקרא | מצב התקנה לכל ספר, פרקים חסרים ופגומים |
| `components/admin/KjvPlusInstaller.jsx` | התקנת KJV+ | מצב התקנה, התקדמות, כיסוי פרקים, מילון Strong’s ודוח ביקורת |
| `components/admin/LugandaInstaller.jsx` | התקנת לוגנדה | מצב התקנה, התקדמות, כיסוי 1,189 פרקים |
| `components/admin/LibraryReport.jsx` | אימות כללי הספרייה | השוואת תרגומים, פרקים שבורים, התאמת מספר פסוקים ו-Strong’s |

## 4.3 רכיבים כלליים

| קובץ | תפקיד | מה מרנדר |
|---|---|---|
| `components/common/EmptyState.jsx` | מצב ריק | אייקון, כותרת, תיאור ופעולה |
| `components/common/Modal.jsx` | חלון דיאלוג | overlay, כותרת, תוכן, footer, סגירה ב-Escape |
| `components/common/PageHeader.jsx` | כותרת דף | גרסת hero או רגילה |
| `components/common/Pagination.jsx` | עימוד | עמודים קודמים/הבאים וקיצורי range |
| `components/common/ShareRow.jsx` | שורת שיתוף | כפתורי Facebook, WhatsApp, Telegram, Instagram, LinkedIn ו-Copy |
| `components/common/Spinner.jsx` | מצב טעינה | ספינר עם נגישות `role=status` |

## 4.4 רכיבי קהילה

| קובץ | תפקיד | מה מרנדר |
|---|---|---|
| `components/community/CommentThread.jsx` | שרשור תגובות | תגובות קיימות וטופס תגובה למשתמש מחובר |
| `components/community/RevelationCard.jsx` | כרטיס גילוי | מחבר, פסוק, כותרת, גוף, לייק ותגובות |
| `components/community/RevelationForm.jsx` | פרסום גילוי | טופס כותרת, פסוק וגוף |
| `components/community/ThreadMessages.jsx` | שיחת קבוצה | הודעות וטופס שליחה |

## 4.5 רכיבי קריאה

| קובץ | תפקיד | מה מרנדר |
|---|---|---|
| `components/read/AnnotatedText.jsx` | טקסט ניתן לסימון | בחירת טקסט, הילייט/קו תחתון, מחיקת סימון |
| `components/read/BookGrid.jsx` | רשת ספרים | חיפוש ולשוניות מקרא |
| `components/read/BookIntro.jsx` | מבוא לספר | עובדות ספר, מבוא, מקראי מפתח וסימונים |
| `components/read/BookOutline.jsx` | מתווה ספר | כותרות וטווחי פסוקים הניתנים לפתיחה ולסימון |
| `components/read/BookPrayerPanel.jsx` | תפילת ספר | תפילה באנגלית/לוגנדה, קישורי מקרא וסימונים |
| `components/read/BookSidebar.jsx` | מעטפת מחקר הספר | החלפה בין Intro, Outline ו-Prayer |
| `components/read/BookStudyResources.jsx` | חומרי לימוד ספר | פירוש, תובנה תיאולוגית והיסטורית עם עימוד |
| `components/read/ChapterClosingPrayer.jsx` | תפילת סיום פרק | תפילה, מקרא, שיתוף וחזרה לתפילת הספר |
| `components/read/ChapterGrid.jsx` | רשת פרקים | קישור לכל פרק |
| `components/read/ChapterReaderPane.jsx` | עמודת הקריאה | תפריט מחקר, לשוניות, מצב רחב/צר |
| `components/read/ChapterResourcesPanel.jsx` | משאבי פרק | תובנות תיאולוגיות והיסטוריות ופתיחת מקרא |
| `components/read/ChapterSelector.jsx` | מסך בחירת ספר | Sidebar, רשת פרקים, חומרי לימוד ו-VersePopup |
| `components/read/ChapterSidebar.jsx` | מחקר לצד פרק | מבוא, פרשה ותפילה מקוצרת |
| `components/read/FloatingVerse.jsx` | חלונית פסוק צף | פסוק, סגירה ומעבר ל-Bible Reader |
| `components/read/PassagePrayer.jsx` | תפילה לפי פסוק | התאמת `scripture_ref` לפרק/פסוק |
| `components/read/PassageTabs.jsx` | משאבי פסוק | פרשה, תובנות ו-Q&A |
| `components/read/ShareSheet.jsx` | שיתוף פסוק | מודאל, ערוצי שיתוף, העתקת הכול |
| `components/read/StrongsPopup.jsx` | מילון Strong’s | הגדרה, מקור, offline ושמירה מקומית |
| `components/read/StrongsText.jsx` | עיבוד קודי Strong’s | הפיכת `(G2424)` ל-superscript אינטראקטיבי |
| `components/read/VerseActionBar.jsx` | פעולות פסוק | תפילה, הערה, פרשה, הילייט, סימון, העתקה ושיתוף |
| `components/read/VerseList.jsx` | רשימת פסוקים קלה | בחירת פסוק וסימון |
| `components/read/VersePopup.jsx` | קריאת פסוק בחלון | שואב פרק מהשרת ומציג פסוקים מתויגים |
| `components/read/VersionPicker.jsx` | בחירת תרגום | תרגומים מותקנים, התקנה, הסרה והחלפה |

## 4.6 רכיבי layout, dashboard, insight ו-plan

| קובץ | תפקיד | מה מרנדר |
|---|---|---|
| `components/layout/AppFooter.jsx` | פוטר | לוגו, קישורים, תמיכה וקישורי תורמים |
| `components/layout/AppHeader.jsx` | Header רספונסיבי | ניווט ראשי/משני, התחברות, התקנה ותפריט מובייל |
| `components/layout/GlobalPlayer.jsx` | נגן אודיו גלובלי | נגן מקומי, queue, עכבה, seek, עוצמה, מהירות ו-repeat |
| `components/layout/PwaHead.jsx` | PWA head | meta tags, manifest, icons ורישום service worker |
| `components/dashboard/ActivityFeed.jsx` | פיד פעילות | אירועי קריאה אחרונים עם אייקונים וקישורים |
| `components/home/StatCard.jsx` | כרטיס מדד | אייקון, ערך, label ו-hint |
| `components/insight/InsightsBoard.jsx` | לוח תובנות | חיפוש, מיון, פתיחת פריט, שמירה ושיתוף |
| `components/journal/JournalCard.jsx` | כרטיס יומן | קטגוריה, כותרת, גוף, תאריך, עריכה ומחיקה |
| `components/journal/JournalForm.jsx` | טופס יומן | כותרת, גוף, קטגוריה, ספר ופרק |
| `components/plan/PlanRow.jsx` | שורת תוכנית | יום, סטטוס, נושא, פסוק וקישור לפרק |

## 4.7 קבצי עזר ראשיים

| קובץ | תפקיד |
|---|---|
| `lib/activity.js` | הגדרת סוגי פעילות ורישום activity |
| `lib/adminSession.js` | שמירת token מנהל וקריאה ל-`adminAuth` |
| `lib/app-params.js` | פרמטרי FSe2 |
| `lib/AuthContext.jsx` | Provider של מצב המשתמש |
| `lib/bibleApi.js` | טעינת פרק, fallback לרשת ולמקור מקומי |
| `lib/bibleBooks.js` | 66 ספרים, שמות, קיצורים ומספרי פרקים |
| `lib/bookGuides.js` | מבואות ומתוויות לכל ספר |
| `lib/bookPrayers.js` | תפילות לכל ספר |
| `lib/bookStudyContent.js` | חומרי לימוד fallback לכל ספר |
| `lib/brandCss.js` | מערכת CSS מרכזית ומשתני עיצוב |
| `lib/chapterStudy.js` | חיבור חומרי ספר לחומרי פרק |
| `lib/contentApi.js` | גישה לאוספי תוכן ציבוריים ופעולות submission |
| `lib/crossRefs.js` | קשרי מקרא מערכים |
| `lib/format.js` | עיצוב והגנת טקסט |
| `lib/keyPassages.js` | מקראי מפתח לכל ספר |
| `lib/luganda.js` | פורמט תוכן יומי בלוגנדה |
| `lib/offlineDb.js` | IndexedDB וכל הסטורים המקומיים |
| `lib/planData.js` | תוכנית 30 הימים כ-fallback |
| `lib/player.jsx` | Provider ומנוע הנגן הגלובלי |
| `lib/reading.js` | תאריכים, streak ועזרי לוח |
| `lib/readings.js` | שמירת התקדמות קריאה ומיפוי לתוכנית |
| `lib/scriptureRefs.js` | פענוח הפניות מקרא |
| `lib/seedContent.js` | ספריית תוכן מקומית |
| `lib/share.js` | בניית קישורי שיתוף והעתקה |
| `lib/strongs.js` | נרמול ועיבוד קודי Strong’s |
| `lib/strongsOffline.js` | אחסון הגדרות Strong’s במכשיר |
| `lib/studyAnnotations.js` | שמירת הילייטים והקווים התחתונים |
| `lib/textSelection.js` | זיהוי בחירת טקסט בתוך רכיב |
| `lib/theme.js` | קבועי מותג וקבצי לוגו |
| `lib/themeContext.jsx` | עדכון צבעי האתר מהניהול |
| `lib/versions.js` | הגדרת תרגומים והתקנות מקומיות |

## 4.8 שרותי צד שרת

| קובץ | תפקיד |
|---|---|
| `functions/adminAuth.js` | התחברות מנהל, אימות סיסמה, session והחלפת סיסמה |
| `functions/adminContent.js` | CRUD מאומת עבור תוכן במרכז הניהול |
| `functions/bibleChapter.js` | השגת פרק ממקורות חיצוניים וניקוי טקסט |
| `functions/content.js` | API ציבורי לקריאת תוכן וקבלת הגשות |
| `functions/kjvInstall.js` | התקנת KJV+ לפי פרק |
| `functions/lugandaInstall.js` | התקנת המקרא בלוגנדה לפי פרק |
| `functions/scriptureAudit.js` | ביקורת קריאה בלבד על כל המקרא |
| `functions/strongsDefinition.js` | מילוי מאגר הגדרות Strong’s |
| `cron/scriptureInstall.js` | משימת cron שעתית להשלמת המקרא |

## 4.9 Entities

| קובץ | תפקיד |
|---|---|
| `entities/ActivityLog.json` | יומן פעילות מנהל |
| `entities/AdminAccount.json` | חשבון מנהל תוכן |
| `entities/BibleVerse.json` | פסוק מקרא דו-לשוני |
| `entities/Commentary.json` | הערת פרשה לפי ספר ופרק |
| `entities/ContactMessage.json` | הודעת פנייה מהציבור |
| `entities/Devotional.json` | תוכן יומי דו-לשוני |
| `entities/DevotionalProgress.json` | סימון תוכן יומי כהושלם |
| `entities/DiscussionGroup.json` | קבוצת לימוד |
| `entities/DiscussionThread.json` | הודעה בקבוצת לימוד |
| `entities/Insight.json` | תובנה תיאולוגית או היסטורית |
| `entities/JournalEntry.json` | רשומת יומן תפילה |
| `entities/KjvPlusChapter.json` | פרק KJV+ עם קודי Strong’s |
| `entities/LiveSession.json` | מפגש לימוד חי |
| `entities/LugandaChapter.json` | פרק מקרא בלוגנדה |
| `entities/Prayer.json` | תפילה מהספרייה |
| `entities/PrayerSaved.json` | תפילה שנשמרה על ידי קורא |
| `entities/QAEntry.json` | שאלה ותשובה |
| `entities/ReadingActivity.json` | אירוע פעילות קריאה |
| `entities/Reading.json` | פרק שהושלם, reflection ו-prayer point |
| `entities/ReadingPlan.json` | תוכנית הקריאה |
| `entities/Revelation.json` | גילוי קהילתי ותגובותיו כרשומות צאצא |
| `entities/SiteSettings.json` | הגדרות גלובליות וערכי מותג |
| `entities/StrongEntry.json` | הגדרת Strong’s |
| `entities/StudyAnnotation.json` | הילייט או קו תחתון בחומר לימוד |
| `entities/StudyMark.json` | הילייט, ספסר או הערה בפסוק |
| `entities/VerseOfDay.json` | פסוק יומי |
| `entities/VerseSongEpisode.json` | רצועה בסדרת Verse-Song |
| `entities/VerseSongSeries.json` | סדרת Verse-Song |

## 4.10 PWA ונכסים

| קובץ | תפקיד |
|---|---|
| `public/manifest.json` | הגדרת PWA, שם, צבעים, תצוגה ואייקונים |
| `public/sw.js` | Service worker; cache-first ל-shell ולתמונות, network-first לנתונים |
| `public/assets/...` | תמונות, לוגו, PDF, ZIP ונכסים סטטיים |
| `__generated/tailwind.css` | CSS Tailwind מחושלל לשימושי עזר |

## 4.11 קבצי `__trash`

תיקיית `__trash` כוללת גרסאות קוד ישנות, probes וכלי אבחון, לדוגמה:

- `__trash/pages/Read.jsx`
- `__trash/components/read/BookPicker.jsx`
- `__trash/components/read/ReflectionPanel.jsx`
- `__trash/functions/probeChapter.js`
- `__trash/functions/probeSources.js`

אין לראות בהם חלק מהמסלול הפעיל לפני שמוודאים שאין להם ייבואים. הם עשויים להיות שאריות ארכיון ולא תואמים את מבנה ה-React הנוכחי.

---

# 5. מודל הנתונים

## 5.1 `ActivityLog`

**מטרה:** לשמור פעולות של מנהלי תוכן.

**שדות:**

- `actor`  -  המנהל שביצע את הפעולה.
- `action`  -  סוג הפעולה.
- `section`  -  אזור ב-CMS.
- `detail`  -  פרטים נוספים.

**הרשאות:** קריאה וכתיבה ל־owner/admin.

---

## 5.2 `AdminAccount`

**מטרה:** הפרטים של מנהלי תוכן.

**שדות:**

- `email`  -  מזהה מנהל, חובה.
- `password_hash`  -  hash מלוח של הסיסמה.
- `salt`  -  salt ייחודי.
- `updated_date`  -  תאריך עדכון.

**הרשאות:** owner/admin בלבד.

**הערה אבטחה:** הקוד המקומי מגדיר סיסמת ברירת מחדל קבועה בסביבת שרת. יש להבטיח שבפרודקשן `ADMIN_INITIAL_PASSWORD` מוגדר באופן חסרי וידוי, ולא להשאיר את ברירת המחדל.

---

## 5.3 `BibleVerse`

**מטרה:** לשמור פסוקים באנגלית ולוגנדה.

**שדות:**

- `book_number`  -  מספר הספר הקנוני.
- `book`  -  שם הספר.
- `chapter`  -  מספר פרק.
- `verse`  -  מספר פסוק.
- `text_en`  -  טקסט אנגלי.
- `text_lu`  -  טקסט לוגנדה.

**הרשאות:** קריאה ציבורית; כתיבת owner/admin.

**קשרים:** מזוהה לפי המפתח הלוגי `book_number + chapter + verse`.

---

## 5.4 `Commentary`

**מטרה:** הערת פרשה המשויכת לספר ולפרק.

**שדות:**

- `book`  -  שם הספר, חובה.
- `chapter`  -  מספר פרק.
- `title`.
- `body_en`.
- `body_lu`.

**קשרים:** משמש את `PassageTabs` ו-`ChapterSidebar`.

---

## 5.5 `ContactMessage`

**מטרה:** פנייה מהציבור.

**שדות:**

- `name`  -  חובה.
- `email`  -  חובה.
- `subject`.
- `message`.
- `is_read`.
- `reply`  -  תשובת הצוות.

**הרשאות:** כל גולש יכול ליצור; רק מנהלים קוראים ומענים.

---

## 5.6 `Devotional`

**מטרה:** תוכן יומי דו-לשוני.

**שדות מרכזיים:**

- `code`  -  מזהה ייחודי, חובה.
- `title`, `title_lu`.
- `scripture`, `scripture_lu`.
- `body`, `body_lu`.
- `related`.
- `further_readings`.
- `cover_image`.

**קשרים:**

- `DevotionalProgress.devotional_code` מפנה אליו.
- תוכן יומי קיים יכול להפנות לפרקים דרך הפניות מקרא.

---

## 5.7 `DevotionalProgress`

**מטרה:** לשמור איזה תוכן יומי הושלם על ידי קורא.

**שדות:**

- `owner_email`  -  בעל ההתקדמות, חובה.
- `devotional_code`  -  קוד התוכן, חובה.
- `completed_date`.

**קשרים:** לוגית ל-`Devotional.code`.

---

## 5.8 `DiscussionGroup`

**מטרה:** קבוצה שבה קוראים לומדים מקרא יחד.

**שדות:**

- `name`  -  חובה.
- `description`.
- `schedule`.
- `member_count`.

**קשרים:**

- `DiscussionThread.group_name` מזהה את הקבוצה.
- הקשר מבוסס שם ולא `id`, ולכן שינוי שם עלול לנתק הודעות קיימות.

---

## 5.9 `DiscussionThread`

**מטרה:** הודעה בתוך קבוצת דיבור.

**שדות:**

- `group_name`.
- `owner_email`.
- `author_name`.
- `title`.
- `body`.

**הרשאות:** כל משתמש מחובר יכול ליצור הודעה; כל גולש יכול לקרוא.

---

## 5.10 `Insight`

**מטרה:** תובנה תיאולוגית או היסטורית.

**שדות:**

- `kind`  -  `theological` או `historical`, חובה.
- `title`  -  חובה.
- `passage`.
- `excerpt`.
- `body`.
- `share_count`.

**קשרים:**

- משמש ב-`InsightsBoard`.
- משמש ב-`ChapterResourcesPanel`.
- משמש ב-`BookStudyResources` כ-fallback מול רשומות תוכן.

---

## 5.11 `JournalEntry`

**מטרה:** רשומת יומן תפילה אישית.

**שדות:**

- `owner_email`  -  חובה.
- `entry_date`.
- `title`.
- `body`.
- `category`.
- `book`.
- `chapter`.
- `mood`.

**קשרים:**

- יכול להפנות לספר ופרק במקרא.
- שייך למשתמש דרך `owner_email`.

---

## 5.12 `KjvPlusChapter`

**מטרה:** פרק KJV+ עם מספרי Strong’s.

**שדות:**

- `book_number`  -  חובה.
- `book`.
- `chapter`.
- `verse_count`.
- `verses`  -  JSON של פסוקים.

**הרשאות:** קריאה ציבורית; כתיבת owner/admin.

**קשרים:** מקביל ל-`LugandaChapter` ול-`BibleVerse`, אך משמש מקור מלא לתרגום KJV+.

---

## 5.13 `LiveSession`

**מטרה:** מפגש לימוד חי עתידי.

**שדות:**

- `title`  -  חובה.
- `session_date`.
- `host`.
- `join_link`.
- `description`.

**קשרים:** אין קשר ישיר; מוצג ב-`CommunityLiveTeaching`.

---

## 5.14 `LugandaChapter`

**מטרה:** פרק מקרא בלוגנדה.

**שדות:**

- `book_number`  -  חובה.
- `book`.
- `chapter`.
- `verse_count`.
- `verses`  -  JSON.

**קשרים:** מקביל ל-`KjvPlusChapter`; נקרא על ידי `bibleApi`.

---

## 5.15 `Prayer`

**מטרה:** תפילה מהספרייה.

**שדות:**

- `title`  -  חובה.
- `title_lu`.
- `category`.
- `body_en`.
- `body_lu`.
- `scripture_ref`.

**קשרים:**

- `PrayerSaved.prayer_title` מפנה לפי כותרת.
- `PassagePrayer` מנסה להתאים את `scripture_ref` לפסוק הפעיל.
- `BookPrayerPanel` משתמש בהפניות `[[Book 1:1]]`.

---

## 5.16 `PrayerSaved`

**מטרה:** לשמור תפילה ברשימת המשתמש.

**שדות:**

- `owner_email`  -  חובה.
- `prayer_title`  -  חובה.

**קשרים:** לוגית ל-`Prayer.title`.

---

## 5.17 `QAEntry`

**מטרה:** שאלת קורא ותשובת הצוות.

**שדות:**

- `question`  -  חובה.
- `category`.
- `answer`.
- `passage_ref`.
- `answered_by`.
- `status`.
- `author_email`.

**הרשאות:** קריאה ציבורית, יצירה על ידי משתמש מחובר, עריכה על ידי מנהל.

---

## 5.18 `ReadingActivity`

**מטרה:** אירוע קריאה לצורך הפיד והדשבורד.

**שדות:**

- `owner_email`  -  חובה.
- `activity_type`  -  חובה.
- `book`.
- `book_number`.
- `chapter`.
- `verse`.

**סוגי פעילות אפשריים:**

- `chapter_visit`.
- `highlight`.
- `bookmark`.
- `note_saved`.
- `prayer_opened`.
- `devotional_access`.

**קשרים:** שייך למשתמש; אינו מהווה היסטוריית קריאה מלאה, אלא פיד אירועים.

---

## 5.19 `Reading`

**מטרה:** מצב השלמת פרק ורשומות התעדוק של הקורא.

**שדות:**

- `owner_email`  -  חובה.
- `book`  -  חובה.
- `chapter`  -  חובה.
- `translation`.
- `plan_day`.
- `read_date`.
- `status`.
- `reflection`.
- `prayer_point`.
- `highlighted_verses`.

**קשרים:**

- `plan_day` מתאים ל-`ReadingPlan.day`.
- משמש לחישוב streak והתקדמות בתוכנית.
- `highlighted_verses` נשמר כטקסט, לא כ-entity נפרד.

---

## 5.20 `ReadingPlan`

**מטרה:** הגדרת תוכנית הקריאה.

**שדות:**

- `day`  -  חובה.
- `book`  -  חובה.
- `chapter`  -  חובה.
- `title`.
- `theme`.
- `focus`.
- `scripture`.

**קשרים:** `Reading.plan_day` מקבל את מספר היום.

---

## 5.21 `Revelation`

**מטרה:** גילוי קהילתי או תגובה לגילוי.

**שדות:**

- `owner_email`.
- `author_name`.
- `title`  -  חובה.
- `passage`.
- `body`.
- `likes`.
- `parent_id`  -  מזהה גילוי האב לתגובה.

**קשרים:**

- רשומה עם `parent_id` היא תגובה.
- רשומה ללא `parent_id` היא פוסט עיקרי.
- לייק מתעדכן באותו שדה `likes`.

---

## 5.22 `SiteSettings`

**מטרה:** הגדרות גלובליות הניתנות לעריכה.

**שדות:**

- `setting_key`  -  חובה.
- `setting_value`.

**משתמשים לדוגמה:**

- `site_name`.
- `ivory`.
- `emerald`.
- `gold`.
- `donate_url`.

**קשרים:** נטען על ידי `ThemeContext` ומשפיע על CSS variables.

---

## 5.23 `StrongEntry`

**מטרה:** הגדרת מספר Strong’s.

**שדות:**

- `code`  -  חובה, למשל `G2424`.
- `language`  -  Greek/Hebrew.
- `original_word`.
- `transliteration`.
- `pronunciation`.
- `part_of_speech`.
- `root_word`.
- `definition`.
- `source`.

**קשרים:**

- `KjvPlusChapter.verses` מכיל את הקודים.
- `StrongsPopup` מחפש לפי `code`.
- מקביל מקומי נשמר ב-IndexedDB תחת `strongs`.

---

## 5.24 `StudyAnnotation`

**מטרה:** הילייט או קו תחתון בתוך חומר הלימוד.

**שדות:**

- `owner_email`  -  חובה.
- `book_number`.
- `book`.
- `section`  -  `intro`, `outline`, `prayer`, `verse`.
- `block_id`.
- `kind`  -  `highlight` או `underline`.
- `color`.
- `start_offset`.
- `end_offset`.

**קשרים:** משמש את `AnnotatedText` ו-`studyAnnotations`; נשמר גם offline.

---

## 5.25 `StudyMark`

**מטרה:** סימון או הערה בפסוק.

**שדות:**

- `owner_email`  -  חובה.
- `mark_type`  -  `highlight`, `bookmark`, `note`.
- `book_number`.
- `book`.
- `chapter`.
- `verse`.
- `color`.
- `note_text`.

**קשרים:**

- מוצג ב-`BibleNotes`.
- מזוהה גם ב-`ReadingActivity` דרך הפעולה שנרשמה.
- קיימת גם היסטוריית פעילות, אך זו אינה מקור אמין לחישוב מספר הסימונים הנוכחיים.

---

## 5.26 `VerseOfDay`

**מטרה:** פסוק נבחר לתאריך.

**שדות:**

- `verse_date`  -  חובה.
- `reference`.
- `text_en`.
- `text_lu`.
- `note`.

---

## 5.27 `VerseSongSeries`

**מטרה:** סדרת Verse-Song.

**שדות:**

- `name`  -  חובה.
- `description`.
- `thumbnail`.
- `cover_image`.
- `accent`.

---

## 5.28 `VerseSongEpisode`

**מטרה:** רצועה בתוך סדרת Verse-Song.

**שדות:**

- `series_name`  -  חובה.
- `title`.
- `verse_ref`.
- `duration_label`.
- `duration_seconds`.
- `audio_url`.
- `audio_key`.
- `thumbnail`.
- `episode_order`.

**קשרים:** `series_name` מחבר ל-`VerseSongSeries.name`.

---

# 6. תהליכים ואינטראקציות מרכזיות

## 6.1 טעינת פרק מקרא

1. המשתמש בוחר ספר ב-`BibleReader`.
2. נוצרת רשת פרקים דרך `ChapterGrid`.
3. המשתמש לוחץ על פרק.
4. מנתבים ל-`/Chapter?book=<book>&chapter=<chapter>`.
5. `Chapter.jsx` קורא את התרגום הפעיל דרך `lib/versions.js`.
6. `lib/bibleApi.js` מנסה:
   - לקרוא מהמקור המקומי/המותקן.
   - לבצע קריאת רשת דרך `bibleChapter`.
   - להשתמש בתוכן cached ב-IndexedDB כשאין חיבור.
7. הפרק מוצג פסוק לפסוק.
8. הפעולה `chapter_visit` נרשמת ב-`ReadingActivity`.
9. המשתמש יכול לסמן את הפרק כהושלם, ואז נשמרת רשומת `Reading`.

## 6.2 הילייט או הערה בפסוק

1. המשתמש בוחר פסוק.
2. נפתחת `VerseActionBar`.
3. הוא בוחר highlight, bookmark או note.
4. נוצרת רשומת `StudyMark`.
5. נרשמת פעילות ב-`ReadingActivity`.
6. הסימון מוצג ב-`BibleNotes` ובדשבורד.
7. הנתונים נשמרים בשרת; מספר פעולות נשמרות גם במאגר המקומי.

## 6.3 סימון טקסט בחומר לימוד

1. המשתמש בוחר תווים בתוך `AnnotatedText`.
2. מוצגת סרגל כלים לבחירת highlight/underline.
3. נקבעים `start_offset` ו-`end_offset`.
4. נוצרת רשומת `StudyAnnotation`.
5. הרשומה נשמרת בשרת עבור משתמש מחובר וב-IndexedDB.
6. `mergeAnnotations` ממזג שרת ומקומי לפי `annotationKey`.
7. בטעינה הבאה הטקסט מקבל מחדש את הסימונים.

## 6.4 פתיחת מקראי מפתח בתוך הדף

1. המשתמש לוחץ על הפניה, למשל `John 3:16`.
2. `parseReference` מזהה את הספר, פרק ופסוק.
3. `selectionInside` מונע פתיחה אם המשתמש רק בחר טקסט לסימון.
4. נפתח `VersePopup`.
5. `fetchChapter` טוען את הפרק.
6. הפופ-אפ מציג את הפסוק ומאפשר סימון.
7. קיימת גם אפשרות לפתוח את המקום המלא ב-Bible Reader.

## 6.5 התקנת המקרא בלוגנדה

### ידנית מממשק הניהול

1. המנהל נכנס ל-`/AdminDashboard`.
2. בוחר את מקטע Luganda Bible.
3. לוחץ על Install/Continue.
4. `LugandaInstaller` שולח `fse2.functions.invoke("lugandaInstall", ...)`.
5. הפונקציה:
   - מאמתת token מנהל.
   - בודקת אילו פרקים כבר קיימים.
   - מורידה רק פרקים חסרים.
   - שומרת כל פרק ב-`LugandaChapter`.
   - מדווחת כמה פרקים הותקנו וכמה נותרו.
6. `ChapterCoverage` מציג את הכיסוי לפי ספר.

### אוטומטית מה-cron

1. `cron/scriptureInstall.js` מופעל כל שעה.
2. הוא מזהה פרקים חסרים.
3. הוא מפעיל את שירותי ההתקנה עם install key מסביבת השרת.
4. ההתקנה נמשכת עד שאין עוד התקדמות, כדי לא לעבור כל המקרא בכל ריצה.

## 6.6 התקנת KJV+ ומילון Strong’s

1. המנהל בוחר KJV+ with Strong’s.
2. `KjvPlusInstaller` מזמין `kjvInstall`.
3. הפונקציה מתקינה פרקים חסרים ב-`KjvPlusChapter`.
4. נפתחת אפשרות למלא את מילון Strong’s דרך `strongsDefinition`.
5. המילון נשמר ב-`StrongEntry`.
6. בעת הקריאה:
   - `StrongsText` מזהה קודים כגון `(G2424)`.
   - הקוד מוצג כ-superscript.
   - `StrongsPopup` מחפש מקום במקומי, בשרת, ואז במקור חיצוני.
   - התוצאה נשמרת גם במכשיר.

## 6.7 ביקורת ספריית המקרא

1. המנהל לוחץ על הפעלת דוח הספרייה.
2. `LibraryReport` מזמין `scriptureAudit`.
3. הפונקציה קוראת:
   - `KjvPlusChapter`.
   - `LugandaChapter`.
   - `StrongEntry`.
4. היא מחשבת:
   - כמה פרקים מותקנים.
   - אילו פרקים חסרים.
   - אילו פרקים פגומים.
   - איפה מספרי הפסוקים שונים בין התרגומים.
   - כמה קודי Strong’s חסרים.
5. הדוח מוצג בממשק הניהול.
6. הפונקציה אינה כותבת נתונים.

## 6.8 התחברות קורא

1. המשתמש נכנס ל-`/Login`.
2. `fse2.auth.login` מאמת את הפרטים.
3. `AuthProvider` מרענן את `fse2.auth.me()`.
4. המשתמש מופנה ל-Dashboard.
5. המצב נשמר בשירות ההתחברות של FSe2, לא ב-token מנהל מקומי.

## 6.9 התחברות מנהל תוכן

1. המשתמש נכנס ל-`/Admin`.
2. `callAdmin("login", ...)` מזמין את `adminAuth`.
3. הפונקציה:
   - מאמתת את המשתמש מול `AdminAccount`.
   - משווה hash עם salt.
   - יוצרת session חתום ב-HMAC.
   - מחזירה token.
4. `setAdminToken` שומר את ה-token ב-`localStorage` תחת `pr_admin_token`.
5. בכניסה למרכז הניהול נבדק ה-session דרך action בשם `session`.
6. פקודות התקנה מעבירות את ה-token לפונקציות השרת.
7. תפוגת ה-token או חתימה שגויה מחזירה שגיאה/401.

## 6.10 פרסום גילוי קהילתי

1. משתמש לא מחובר רואה כפתור התחברות.
2. משתמש מחובר ממלא כותרת, פסוק וגוף.
3. `submitRevelation` יוצר רשומת `Revelation` ללא `parent_id`.
4. הרשומה מופעלת ברשימה.
5. לחיצה על Comments מציגה תגובות.
6. תגובה נשמרת כרשומת `Revelation` עם `parent_id`.
7. לייק מעדכן את שדה `likes`.

## 6.11 שיתוף פסוק

1. המשתמש בוחר Share.
2. נפתח `ShareSheet`.
3. הקוד בונה גוף הכולל:
   - פסוק בשפה הנוכחית.
   - פסוק בשפה השנייה, אם קיים.
   - תפילה.
   - cross-references.
   - קישור.
4. ערוצי השיתוף נבנים על ידי `lib/share.js`.
5. Copy משתמש ב-`navigator.clipboard`, עם פתיחת חלונית חלופית אם נדרש.

## 6.12 הורדה אופליין

1. המשתמש נכנס ל-`/Offline`.
2. בוחר תרגום או קטגוריית תוכן.
3. הדף מאמת אילו פרקים כבר קיימים ב-IndexedDB.
4. חסרים נטענים דרך `fetchChapter`.
5. הפרקים נשמרים בחנויות `chapters`/`verses`.
6. התוכן הציבורי נשמר בחנויות `devotionals`, `commentary`, `prayers`, `qa` ו-`verseOfDay`.
7. הגדרות Strong’s נשמרות בחנית `strongs`.
8. במצב offline, `bibleApi` קורא מהמקומי.
9. מחיקת מרכז האופליין מוחקת נתונים מהמכשיר, אך לא את נתוני השרת.

## 6.13 נגן אודיו גלובלי

1. המשתמש בוחר סדרה או רצועה.
2. `PlayerProvider` מקבל queue ומתחיל `Audio`.
3. ה-`Audio` element חי ברמת האפליקציה, ולכן ההשמעה ממשיכה בעת ניווט.
4. `GlobalPlayer` מציג:
   - שם הרצועה.
   - זמן.
   - seek.
   - next/previous.
   - shuffle.
   - repeat.
   - עוצמה.
   - מהירות.
   - רשימת queue.
5. אירוע `ended` מחליט אם לעבור לרצועה הבאה, לחזור על אחת או להפסיק.

---

# 7. הערות טכניות לפיתוח

## 7.1 ספריות ותשתיות

### React

- רכיבים פונקציונליים עם Hooks.
- state מקומי למצב UI.
- Context לשלושה שירותים גלובליים:
  - `AuthProvider`.
  - `ThemeProvider`.
  - `PlayerProvider`.

### React Router

- ניווט בין דפים.
- `useSearchParams` לפרמטרי כתובת כגון ספר, פרק, שפה ופסוק.
- `useNavigate` למעברים לאחר התחברות, התקנה או פעולות.

### TanStack React Query

- טעינת collections.
- mutations עם `useMutation`.
- invalidation לאחר יצירה, עדכון או מחיקה.
- `refetchInterval` לפיד הפעילות.

### Lucide React

אייקוני הממשק מגיעים מ-`lucide-react`.

### date-fns

- תאריכים.
- פורמט תאריך.
- תצוגת “לפני X דקות”.

### FSe2 SDK

`fse2` הוא ממשק הגישה ל:

- Authentication.
- Entities.
- Functions.
- Storage ו-app files.

### IndexedDB

מיושם בעצמאות ב-`lib/offlineDb.js` ללא ספריית עזר.

### Service Worker

- cache-first עבור app shell ותמונות.
- network-first עבור נתונים.
- מתקיים גם cache runtime.

---

## 7.2 דפוס fallback

אחד העיקריים במערכת הוא העדפת נתוני שרת אך מעבר לתוכן מקומי כאשר אין נתונים או כשהשרת נכשל.

דוגמאות:

```js
const rows = liveRows && liveRows.length ? liveRows : SEED_ROWS;
```

זה נכון ל:

- Devotionals.
- Prayers.
- Insights.
- Q&A.
- Reading Plan.
- Live Sessions.
- Discussion Groups.
- Verse-Songs.

### יתרון

הממשק נשאר שימושי גם לפני שה-CMS מלא.

### סיכון

- ייתכן שתוכן מקומי יציג גרסה ישנה.
- זיהוי כפילויות מבוסס לעיתים על `title`, ולא על מזהה יציב.
- אין כלל מסודר למיזוג עדכון בין seed לרשומת חיה.

**המלצה:** להוסיף versioning או `seedKey` יציב, ולהבהיר אם תוכן מקומי הוא fallback בלבד או אינו ניתן למחיקה.

---

## 7.3 דפוס collections

פעולת קריאה ציבורית רגילה:

```js
fse2.entities.Entity.list("-updated_date", 300)
```

מגבלות:

- `300`, `200`, `400` וכו׳ מייצגים מספר שורות מרבי, לא בהכרח pagination מלא.
- רשימות ארוכות עלולות להיות חתוכות.
- אין cursor או pagination מרכזי למספר collections.

**המלצה:** אם הספרייה תגדל, להוסיף pagination או pagination לפי keyset.

---

## 7.4 סינון נתונים אישיים בצד הלקוח

בכמה דפים, כגון `ActivityFeed`, `BibleNotes` ו-`Dashboard`, השרת מחזיר רשומות ואז הלקוח מסנן לפי:

```js
row.owner_email === email
```

זה מתאים למקרה שבו ה-API כבר מגביל למשתמש, אך אינו תחליף לרמת הרשאה בשרת.

**עיקרון:** כל סינון אישי חייב להתבצע גם ברמת ה-entity access וגם ברמת ה-API. אין להסתמך על סינון client-side בלבד.

---

## 7.5 מפתחות Query

מפתחות query צריכים לכלול את כל הפרמטרים שמשפיעים על התוצאה.

דוגמאות קיימות:

```js
["insights", kind]
["prayers"]
["studyMarks", email]
["readingActivity", email]
```

נקודות שדורשות זהירות:

- `["prayers"]` לא כולל authenticated.
- `["insights"]` לא כולל authenticated.
- במקרים אחרים כן כולל `email`.
- אם תשתנה זכות הגישה או מספר הפריטים, יש לכלול את המזהה במפתח.

---

## 7.6 מקורות מקרא וגיבוי

המערכת משתמשת בכמה מקורות:

- `bible-api.com` לאנגלית.
- Wordplanet ללוגנדה.
- Bolls/מקור דומה ל-KJV+.
- Open Scriptures Strong’s.
- Blue Letter Bible כמקור משני.

מקורות חיצוניים עלולים להשתנות. לכן מומלץ:

1. להפעיל timeout.
2. לנסות מספר מקורות.
3. לשמור תשובה מוצלחת.
4. לאחסן את התוצאה.
5. להבדיל בין:
   - פרק לא קיים.
   - פרק שגום.
   - שגיאת רשת.
   - תוכן מקומי לא זמין.

---

## 7.7 התקנה אידמפוטנטית

ההתקנות אינן עושות upsert מלא בכל ריצה. הן:

- קוראות את המצב הקיים.
- מתקינות רק פרקים חסרים.
- ממשיכות עד שאין התקדמות.

זה מפחית עומס על המקור, אך עלול ליצור בעיות אם פרק קיים אך פגום. לכן כדאי להפריד:

- `missing`.
- `broken`.
- `present and valid`.

`ChapterCoverage` כבר מציג את `missing` ו-`broken` בנפרד.

---

## 7.8 Strong’s

קודי Strong’s מנורמלים לצורה:

```text
G2424
H0436 → H436
```

המערכת:

- מזהה קודים בתוך הטקסט.
- מציגה אותם כ-superscript.
- שומרת את המילון בשרת.
- שומר copy מקומי ב-IndexedDB.
- משתמשת במקור חיצוני כ-fallback.

שים לב:

- הקוד מופקד בתוך הטקסט של הפסוק.
- `StrongsText` מנסה לזהות את המילה שאחריה הקוד.
- אין כאן מנוע נרדף או הברה מלאה; התצוגה מבוססת regex.
- לפני תצוגה של KJV+ יש לוודא שכל הפרקים עברו את אותו parser.

---

## 7.9 אינטראקציות מקרא

`lib/scriptureRefs.js` מרכז את:

- aliases כגון `Ps` → `Psalms`.
- פענוח פרק.
- פענוח פסוק.
- טווחים כגון `4:6-7`.
- חיפוש שם ספר בקנוני.

הפניות בחומר לימוד משתמשות בפורמט:

```text
[[John 3:16]]
```

או בטקסט רגיל ברכיבים שונים. שינוי פורמט דורש עדכון מקביל ב:

- `scriptureRefs.js`.
- `chapterStudy.js`.
- `bookPrayers.js`.
- `BookPrayerPanel`.

---

## 7.10 סימון טקסט והתנהגות לחיצה

`selectionInside` נועד למנוע מצב שבו המשתמש בוחר טקסט לסימון, אך הלחיצה על רכיב מפעילה גם פעולת ניווט.

כל רכיב שיש בו גם:

- טקסט ניתן לבחירה.
- קישור/כפתור.

צריך לבדוק את התנאי לפני ביצוע הניווט.

---

## 7.11 שינוי מבנה נתונים

### `verses` כ-JSON

שדה `verses` ב-`KjvPlusChapter` וב-`LugandaChapter` הוא string המכיל JSON.

משמעות:

- לא ניתן לסנן ישירות לפי פסוק.
- עליון לפענח JSON בכל קריאה.
- שינוי פורמט דורש migration.
- כדאי לשמור schema/version יחד עם ה-JSON.

### `highlighted_verses` כטקסט

ב-`Reading` נשמרים מספרי פסוקים מסומנים כטקסט, לא כ-records עצמאיים. היתרון הוא פשטות; החסרון הוא חוסר יכולת שאילתה ועקביות חלופית ל-`StudyMark`.

### `owner_email` כמזהה בעלות

הרבה entities משתמשות בדוא"ל במקום `owner_id`. זה מפשט את האינטגרציה עם `fse2.auth.me()`, אך עלול ליצור בעיות אם:

- המשתמש משנה דוא"ל.
- נדרשת העברת חשבון.
- נדרש לנהול יותר מפרופיל אחד למשתמש.

---

## 7.12 אבטחה

### Token מנהל

ה-token נשמר ב-`localStorage`. יתרון: פשוט לשימוש. חסרון: זמין ל-XSS.

יש לוודא:

- ש-`Content-Security-Policy` מגביל scripts ו-connections.
- שאין ה injection של HTML מתוך מסד הנתונים.
- שאין סודות API חשופים בקוד הלקוח.

### סיסמת מנהל

`DEFAULT_PASSWORD` מוגדר ללא fallback ברירת מחדל בסביבת production.

### Hash של סיסמה

המערכת משתמשת ב-SHA-256 עם salt. זה טוב יותר מאחסון plain text, אך אינו אידיאלי לאחסון סיסמאות. מומלץ להשתמש ב-Argon2id, scrypt או bcrypt, עם pepper משרתי אם יש צורך.

### הרשאות

הגדרות ה-entities מבטיחות public read על רוב התוכן. יש לוודא ש-`functions/content.js` ו-`functions/adminContent.js` מגבילים כתיבה בפועל, לא רק בממשק.

### חיבורים חיצוניים

המערכת מורידה תוכן מאתרים ציבוריים. יש להגביל:

- SSRF.
- Redirects.
- גודל תגובה.
- סוג MIME.
- timeout.
- retry/backoff.

---

## 7.13 ביצועים

### `useMemo`

משתמש במקומות רלוונטיים:

- סינון insights.
- סינון books.
- חישוב הכיסוי.
- איחוד seed ונתוני שרת.

### שאילתות רשת

יש להימנע מ:

- קריאה כפולה לאותו collection עם `queryKey` שונה.
- refetch תכיפות מדי.
- טעינת 400 רצועות מלאות בכל דף שאינו זקוק לכל הנתונים.

### Service Worker

אין לשמש `cache.addAll` לכל URL שעלול להיכשל; הקוד הנוכחי ממשיך גם אם `addAll` נכשל, אך כדאי לנטר כל cache miss.

---

## 7.14 נגישות

המערכת כוללת:

- `aria-label`.
- `aria-current`.
- `aria-selected`.
- `role="status"`.
- `aria-live`.
- `role="dialog"`.
- `aria-modal`.
- כפתורים אמיתיים מסוג `button`.
- תמיכה ב-Escape במודאל ובתפריטים.

נקודות שכדאי לבדוק:

- `Modal` אינו מנעל את הפוקוס בתוך הדיאלוג.
- אין focus trap.
- כפתור הסגירה משתמש באנגלית גם אם שאר הממשק מתורגם בעתיד.
- רכיב `span role="button"` ב-`BookOutline` דורש טיפול מלא ב-Enter ו-Space.
- אין מצב focus ברור לכל האלמנטים האינטראקטיביים.
- `role="presentation"` על backdrop עם click handler דורש בדיקה של דפוסי לחיצה ומקלדת.

---

## 7.15 CSS ועיצוב

העיצוב מבוסס על:

- `lib/brandCss.js`.
- קלסי `pr-*`.
- Tailwind חלופי במקרים מסוימים.

יש שימוש מעורב ב:

- CSS variables.
- קלאסי Tailwind.
- inline styles.

עיקרון מומלץ:

- להשאיר את הצבעים, מרווחי הפנימיות והעוגנים ב-CSS variables.
- להשתמש ב-inline style רק כש הערך דינמי.
- לא לשכפל ערכי צבע קשיחים ברכיבים.

`ThemeContext` מחשב גווני deep ו-soft מתוך צבעי ivory, emerald ו-gold שנבחרו על ידי המנהל.

---

## 7.16 PWA

`PwaHead` מוסיף meta tags בזמן ריצה, מוחק את מטא־תגיות כפולות ומחליף קישורי icon.

`public/sw.js` מגדיר cache versions:

```text
prayread-shell-v2
prayread-runtime-v2
```

בעת שינוי מבנה routes או cache behavior:

- יש להגדיל את גרסת ה-cache.
- יש לבדוק שכל נתיבי ה-shell עדיין קיימים.
- יש לוודא שה-service worker אינו מציג stale API responses במקום נתונים חדשים.

---

## 7.17 בדיקות מומלצות

### Unit

- `compressChapters`.
- `matchesPassage`.
- `parseReference`.
- `parseOutlineRange`.
- `normalizeStrongCode`.
- `markStrongCodes`.
- בדיקות תאריכים ו-streak.
- merge של annotations.

### Integration

- טעינת פרק online ו-offline.
- התקנת translation.
- יצירת/מחיקת הערה.
- התחברות והתנתקות.
- session מנהל.
- פרסום גילוי ותגובה.
- הפעלת נגן והמשך השמעה בעת ניווט.

### Admin

- אימות token פג או חתום באופן שגוי.
- התקנה חלקית והשלמתה בהמשך.
- פרק פגום.
- הבדל במספר פסוקים בין תרגומים.
- חסר ב-`StrongEntry`.

### UI

- מובייל ודסקטופ.
- ניווט מקלדת.
- modal focus.
- שגיאות רשת.
- מצב ריק.
- אורך טקסט ארוך בעברית ולוגנדה.

---

# 8. מסלולי שינוי נפוצים

## 8.1 הוספת סוג תוכן חדש

לדוגמה, הוספת `StudyCourse`:

1. צור entity תחת `entities/StudyCourse.json`.
2. הוסף אותו ל-`MANAGED` ב-`functions/adminContent.js`.
3. הוסף mapping ב-`functions/content.js`.
4. הוסף reader ב-`lib/contentApi.js`.
5. הוסף seed fallback ב-`lib/seedContent.js`.
6. צור דף ציבורי.
7. הוסף ניווט ב-`AppHeader` וב-`AppFooter`.
8. הוסף ניהול ב-`AdminDashboard` וב-`FIELDS`.
9. הוסף רשומות ל-`ReadingActivity` אם זו פעילות קריאה.
10. הוסף טיפול ב-`privacy` ובמדיניות אחסון.

## 8.2 הוספת פרק או ספר ל-Bible

1. עדכן את `lib/bibleBooks.js`.
2. עדכן את רשימת `BOOKS` ב:
   - `functions/kjvInstall.js`.
   - `functions/lugandaInstall.js`.
   - `functions/scriptureAudit.js`.
   - `cron/scriptureInstall.js`.
3. עדכן את `BOOK_GUIDES`.
4. עדכן את `BOOK_PRAYERS`.
5. עדכן את `KEY_PASSAGES`.
6. עדכן את `BOOK_STUDY_CONTENT`.
7. הרץ installer.
8. הרץ audit.
9. בדוק chapter count ו-verse count.

חשוב: אין להסתמך על מקור יחיד; במערכת הנוכחית הרשימות כפולות במספר מקומות.

## 8.3 הוספת תרגום מקרא

1. הוסף metadata ל-`VERSIONS` ב-`lib/versions.js`.
2. הגדר:
   - `id`.
   - `language`.
   - `translation`.
   - `strongs`.
   - קובץ או endpoint.
3. הוסף store או namespace ב-`offlineDb.js`.
4. עדכן את `fetchChapter` ב-`bibleApi.js`.
5. עדכן את `bibleChapter` או צור function ייעודי.
6. עדכן `Offline.jsx`.
7. עדכן `VersionPicker` אם נדרש מסך התקנה מותאם.
8. בדוק isolation בין מפתחות cache לכל תרגום.

## 8.4 הוספת סוג פעילות חדש

1. הוסף אותו ל-`ACTIVITY_TYPES`.
2. הוסף icon mapping.
3. הוסף את הסוג ל-`ICONS` ול-`TINTS` ב-`ActivityFeed`.
4. ודא שהפעילות נשמרת עם `owner_email`.
5. בדוק filters וספירות.

## 8.5 שינוי עיצוב גלובלי

עדיף לשנות:

- `lib/theme.js` עבור ערכי ברירת מחדל.
- `lib/brandCss.js` עבור משתני CSS ורכיבי מערכת.
- `lib/themeContext.jsx` עבור עדכון דינמי מהניהול.

יש להימנע מהחלפת צבעים ידנית בעשרות רכיבים.

---

# 9. מסקנות וסיכונים מרכזיים

1. **הקוד מבוסס מדדים מקומיים רבים.** שינוי בתוכן דורש עדכון ספריות seed, קבצי התקנה ורשימות ספרים.
2. **המערכת מיועדת לעבודה ללא חיבור**, אך מסתמכת על cached chapter ועל content fallback.
3. **המודל של אנסמבליות דורש attention**:
   - כמה ישויות מבוססות על שם.
   - `verses` נשמר כ-JSON.
   - `highlighted_verses` נשמר כטקסט.
4. **הרשאות צריכות להיות enforced בשרת**, גם אם הממשק מסנן לפי משתמש.
5. **האימות של המנהל דורש הקשחה**, במיוחד סיסמת ברירת מחדל ושימוש ב-SHA-256.
6. **התקנות המקרא עלולות להיות חלקיות**, ולכן יש להבדיל בין פרק חסר לפרק פגום.
7. **ה-cache של service worker דורש versioning**.
8. **מספר רכיבים משתמשים ב-role button על `span`**, ויש להשלים את התנהגות המקלדת.
9. **ה-modal אינו מנהל focus trap**, דבר שעשוי להשפיע על נגישות.
10. **המערכת תואמת במיוחד לתוכן דו-לשוני**, אך אין כלל validation אחיד לאורך כל ה-entities לגבי התאמת EN/LU.
11. **הפרסום של KJV+, לוגנדה ו-Strong’s מבוסס מקורות חיצוניים**, ולכן נדרשים cache, retry, validation ו-audit.
12. **העוגן הסופי הוא `/Chapter`**  -  כל פיצ’ר חייב להישאר נגיש משם בלי לאבד את הקשר של הפסוק, התרגום והסימונים.
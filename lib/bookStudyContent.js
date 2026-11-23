// Study resources for every book of the Bible.
//
// The Book Study Resources panel under the chapter grid prefers the
// commentary and insight records the content manager publishes, and falls
// back to this bundled library so a reader always finds something written
// for the book in front of them.
//
// Each row carries: number, theological title, theological body,
// historical title, historical body.

const ROWS = [
  [1, "Creation and covenant", "Genesis presents God as creator and covenant-maker, and the rest of the Bible answers the questions it opens about humanity and promise.", "The world of the patriarchs", "Its world assumes the nations of the ancient Near East: a river garden, a flood that judges a wicked age, and a tower that scatters the peoples."],
  [2, "The name and presence of God", "Exodus shows a God who comes down to save, to keep and finally to dwell among his people.", "Out of Egypt", "The story is set in the world of Egypt, where a Hebrew people grew into a nation under foreign rule."],
  [3, "A holy people", "Leviticus gathers worship, festivals and everyday law under one word, holiness, and shows that God shares his holiness with his people.", "A covenant people", "Its prescriptions assume a settled agricultural society with a sanctuary at the centre and neighbours who share its customs."],
  [4, "A stubborn journey", "Numbers traces a people who are guided but often resist, and it shows the patience of God with a stubborn heart.", "The wilderness years", "The book is shaped by the realities of a long trek through desert country, where supplies and faith were tested together."],
  [5, "Remember and obey", "Deuteronomy gathers the law into memory and obedience, calling Israel to love God with all its heart.", "Covenant renewal", "Its speeches belong to the covenant renewal ceremony of the ancient Near East, spoken on the edge of the land Israel was about to enter."],
  [6, "Promise and possession", "Joshua shows the promise of land becoming a call to faithfulness, and ties possession to covenant loyalty.", "The Jordan and Jericho", "Its world is the late Bronze Age, when walled cities crowned the valleys of the Jordan and the hill country."],
  [7, "The cycle of failure", "Judges argues that human sin, not divine weakness, explains the dark cycle of salvation and ruin in the book.", "The judges and their world", "The judges were local leaders in a loose tribal league, and the book remembers that era from a village-centred point of view."],
  [8, "Kindness and redemption", "Ruth shows the covenant faithfulness of God reaching beyond Israel through the loyalty of a foreign widow.", "A field in Moab", "Its setting is the grain harvest of the Moabite plateau, where gleaning was the right of the poor."],
  [9, "A king who asks", "1 Samuel traces the rise of monarchy under a God who gives no king apart from himself.", "The ark and the temple", "The world is an Israel shaped by the Philistine presence on its western coast and by the trade routes inland."],
  [10, "David's rise and fall", "2 Samuel presents David as a gifted king undone by pride, and still sought after as the servant of the covenant.", "The court of David", "Its palace scenes reflect the household politics of an ancient Near Eastern court with its servants, spies and household shrines."],
  [11, "The divided kingdom", "1 Kings weighs Solomon's glory and Israel's decline against the covenant that tied the throne to the law of God.", "Building the temple", "The account of the temple describes the royal building projects that marked a settled monarchy in the ancient Near East."],
  [12, "The exile announced", "2 Kings shows the fall of the northern kingdom and the southern exile, ending with the throne itself swept away.", "Nineveh and the fall of nations", "Its final chapters look back on the Assyrian and Babylonian empires that overran the Levant one after another."],
  [13, "The worshipping kingdom", "1 Chronicles retells Israel's history as the story of a people shaped by worship, genealogies and the temple.", "A priestly world", "Its emphasis reflects a community organised around temple service and the careful keeping of family records."],
  [14, "Returning to the covenant", "2 Chronicles stresses that Judah survives through repentance, reform and a renewed temple.", "Reform and renewal", "The book is written for a community rebuilding worship after exile, when faithfulness to the covenant becomes the test of a generation."],
  [15, "The homecoming of the law", "Ezra shows God's people restored around his word, with the worship and the obedience of the community rebuilt.", "The return from Babylon", "Its setting is the Persian period, when returning exiles re-founded the temple community in Judah."],
  [16, "Prayer and rebuilding", "Nehemiah gives a picture of spiritual courage that carries a practical plan through opposition and hard work.", "A city under pressure", "Its walls were rebuilt in the decades after the exile, when Judah's neighbours questioned every move."],
  [17, "Hidden providence", "Esther asks how God saves without being named, and answers with courage in the place of power.", "A world of Persian courts", "Its banquets and decrees reflect the ceremonial world of the Persian empire, where plots and favour decided fates."],
  [18, "Faith tested", "Job wrestles with what it means to trust God when suffering seems to argue against his goodness.", "The world of ancient wisdom", "The book stands in the tradition of Near Eastern and Greek wisdom teaching, where suffering was probed as a moral question."],
  [19, "The school of prayer", "The Psalms teach the whole congregation to pray, to lament honestly and to trust again by morning.", "Songs for every season", "They grew out of temple worship and private devotion, and they carry the music of a people who kept singing through hard years."],
  [20, "A life of wisdom", "Proverbs collects the practical wisdom of Israel for everyday life, the fear of the Lord and love of neighbour.", "Sayings of the wise", "Its teaching draws on the scribal tradition of the ancient Near East, where families passed on tested sayings for living."],
  [21, "The limits of everything", "Ecclesiastes weighs every human pursuit and finds that only God gives weight to the days we live.", "Wisdom on the wall", "Its reflective tone belongs to the wisdom schools that asked hard questions about justice, prosperity and death."],
  [22, "Beloved love", "The Song lifts human desire and covenant love into the beauty of a song about being cherished and wanted.", "A wedding song", "Its imagery draws on the royal wedding poetry and the fragrance trade of the ancient Near East."],
  [23, "The holy one of Israel", "Isaiah announces a God who is utterly holy, redeeming his people and acting for the nations as a witness.", "Assyria at the zenith", "The prophet speaks into a world reshaped by Assyria's imperial expansion and the collapse of smaller kingdoms around it."],
  [24, "The word that endures", "Jeremiah shows God speaking through a reluctant prophet into a nation heading for judgement and exile.", "A kingdom in crisis", "Its setting is Judah under Babylonian pressure, with the temple still standing and the public certain that nothing would happen."],
  [25, "Grief given words", "Lamentations gives lament a shape, so that grief can be carried honestly instead of being denied or hurried away.", "The city in ruins", "It speaks from a Jerusalem whose walls and temple have been destroyed, with a remnant still living in the land."],
  [26, "A new heart", "Ezekiel watches judgement fall and then sees visions of a new heart, a new spirit and a renewed people.", "Exile by the Kebar", "The prophet writes from a colony of exiles in Babylonia, where the temple was far away and memory itself was contested."],
  [27, "The kingdoms of men", "Daniel sets human empires against the kingdom that shall never pass, and encourages faithfulness under pressure.", "Daniel in Babylon", "Its world is the court of Babylon and Media, where Jewish officials served foreign kings and read their future in dreams."],
  [28, "Love that chases", "Hosea shows the stubborn love of God reaching a people who had traded him for other gods.", "A marriage in the north", "Its imagery draws on the marriage customs of the northern kingdom, where fidelity was the measure of honour."],
  [29, "A day of the Lord", "Joel calls the nation to mourn, and then turns that mourning into the promise of the Spirit poured out.", "A locust in the vineyards", "The locust swarm and the ruined crops describe a real agricultural disaster that the farmers of the Levant knew well."],
  [30, "Let justice roll down", "Amos insists that worship without justice insults the God who made the poor his special care.", "A shepherd at the altar", "The clash at the altar of Bethel shows the friction between rural labourers and the prosperous shrine keepers."],
  [31, "The proud one", "Obadiah shows Edom's pride undone and the day of the Lord reaching beyond Israel to the nations.", "Edom's lost territory", "Edom had lost its highlands to pressure from the desert, and the book answers that loss with a word of judgement."],
  [32, "The runaway prophet", "Jonah exposes the hardness of the prophet and ends with a question about the mercy of God toward outsiders.", "Nineveh on the Tigris", "The great city of the Assyrian world repents, and the later fall of that city is remembered with heavy irony."],
  [33, "What does the Lord require", "Micah demands justice, mercy and humility, and promises a ruler who will come from Bethlehem.", "Judah under threat", "The prophet speaks during the invasions that emptied the countryside and drove the people into Jerusalem."],
  [34, "The fall of the oppressor", "Nahum answers the question of why God allows the innocent to suffer, with the fall of the Assyrian empire.", "Nineveh and the Assyrian army", "The book looks back on the destruction of Nineveh, a terror still fresh in the memory of those who lived to tell it."],
  [35, "The righteous one", "Habakkuk argues with God about theodicy, then learns to trust the God who uses the very nations he questions.", "Babylon at the gates", "Its setting is the approach of the Babylonian army, which soon carried Judah into exile."],
  [36, "The day of the Lord", "Zephaniah holds the God of justice before a smug city and warns that judgement comes upon all people.", "Josiah's reform", "The prophet speaks into the reign of Josiah, when the law was being renewed and the capital had known a rare peace."],
  [37, "Build the house", "Haggai insists that worship comes before comfort, and that the temple must be rebuilt now rather than later.", "The second year of Darius", "He dates his messages precisely, and his audience is a returning community with building stone still lying in the fields."],
  [38, "A priest with a vision", "Zechariah links the rebuilt temple to a coming king and to the Spirit that cleanses and renews the people.", "Night visions and the Persian court", "His visions speak to exiles who had seen the imperial court of Persia and still lived in fear of it."],
  [39, "A people who stopped caring", "Malachi confronts a tired priesthood and a married society, and calls the nation back to itself.", "The end of the Persian period", "It closes the Old Testament with the nation settled in the land but its worship grown formal and empty."],
  [40, "The kingdom of heaven", "Matthew presents Jesus as the promised king who teaches the kingdom and sends it out to the nations.", "Jews and Greeks in Galilee", "The world of the gospel is first-century Galilee and Syria, marked by Roman rule and by Jewish hopes of restoration."],
  [41, "The servant on the way", "Mark shows Jesus as the servant God sent, whose greatest work is done at the cross and ahead of him.", "Roman Galilee", "The gospel addresses a church under Roman pressure, where the cross was at once a scandal and a hope."],
  [42, "The good news for all", "Luke writes for outsiders, so that all people may come to know the salvation God has prepared for everyone.", "The cities of the Mediterranean", "Its world is urban and Roman, and it places Jesus among the crossroads of the empire and its trade."],
  [43, "The Word made flesh", "John offers signs and sayings so that faith in the incarnate Son of God might be complete.", "The Jewish community of the diaspora", "Its audience likely lived near the Jordan, debating who could truly enter the kingdom of God."],
  [44, "The witness of the Spirit", "Acts shows the Spirit spreading the good news from Jerusalem to the ends of the earth through ordinary believers.", "The world of the early church", "Its journeys trace the trade and mission routes of the Roman Mediterranean world."],
  [45, "Righteousness by faith", "Romans states that all are justified by faith, and then works out what that means for a life that is being changed.", "Rome and its churches", "Paul writes to a church in the capital made up of both Jews and Gentiles, living under Claudius."],
  [46, "The body and its gifts", "1 Corinthians corrects pride, immorality and disorder in the church, and gives the highest place to love.", "A divided congregation", "The city was wealthy, crowded and proud, and the church had divided along social and economic lines."],
  [47, "Ministry of weakness", "2 Corinthians defends the apostle's calling through weakness and reconciliation rather than through status.", "A hard letter to a tired church", "It was written after a painful visit, when the church in Corinth had begun to question the apostle's motives."],
  [48, "Freedom in Christ", "Galatians argues that the gospel is not a letter of permission, and that the Spirit brings the fruit of Christ.", "Galatia and its converts", "The churches of Galatia mixed Jewish law and Christian faith, and Paul wrote to correct the mixture."],
  [49, "One body, one hope", "Ephesians treats the church as a single body in Christ, marked by unity, purity and the armour of God.", "A circular letter", "The letter is addressed to churches around Asia Minor and reads like a letter meant to travel from house to house."],
  [50, "Joy and partnership", "Philippians calls for joy, humility and partnership in the gospel wherever the reader finds himself standing.", "A Roman colony", "The city was a Roman colony without a synagogue, so its citizens had no ancestral claim to the faith."],
  [51, "Christ, the whole and the head", "Colossians answers the pressure to add practices by holding fast to Christ as God and as head of the church.", "A church facing competing teachers", "The letter meets a congregation drawn by a philosophy of impressive human effort that it had not been taught."],
  [52, "Faith and the Lord's return", "1 Thessalonians steadies believers who fear the Lord has gone, and settles them in a holy hope.", "A new church in Thessalonica", "It is among the earliest Christian letters, written to a young church in a busy Greek port city."],
  [53, "Steady work and endurance", "2 Thessalonians calms restlessness about the day of the Lord and calls the church to steady work and patient endurance.", "Pressure on an early church", "It answers a church worried that the end had arrived, and longings that had made some of them stop working."],
  [54, "The soundness of the church", "1 Timothy guards the teaching, the prayer and the good order of the church in a community that has settled.", "An experienced church", "It reads as counsel to a young leader in a church that had already lived through hard years."],
  [55, "Suffer for the gospel", "2 Timothy passes the torch of Scripture and courage to the next leader of the work.", "Paul's last words", "It is written from confinement, and gives a final picture of the mission continuing after its founder."],
  [56, "Grace that teaches", "Titus sets out sound doctrine and good works as the shape of grace in a community of new believers.", "A young church on Crete", "The letter addresses a young church on an island with a reputation for troublesome teachers."],
  [57, "A good note for a new man", "Philemon asks a master to receive a runaway slave as a brother, showing the gospel reshaping relationships.", "A private letter", "It is a personal appeal to a Christian landowner, and it reads like the letter it is."],
  [58, "A better word, a better priest", "Hebrews presents Jesus as a better and more enduring revelation, so that readers hold fast to what they have received.", "An audience pressing on", "It was written to a church losing confidence, and it reaches back into Israel's tabernacle and sacrificial system."],
  [59, "Faith with hands", "James insists that faith shows itself in conduct, and that the tongue is where it is tested first.", "A letter of practical wisdom", "It reads like the counsel of a scribe steeped in the wisdom tradition and its question-and-answer teaching."],
  [60, "Living stones in a strange land", "1 Peter calls suffering people to live as God's elect household in a world that does not understand them.", "Christians under the Roman empire", "It addresses believers scattered across Asia Minor, living under imperial pressure and local suspicion."],
  [61, "Watch and grow", "2 Peter urges alertness against false teachers and confidence in the growing knowledge of Christ.", "A late letter to the churches", "Its setting is a church facing deceptive teaching and asking how it is to stay faithful."],
  [62, "Love and assurance", "1 John joins fellowship, obedience and love together, so that confidence in God may grow.", "A community facing division", "It was written to a church where some had drifted away from the truth they had first confessed."],
  [63, "Truth and hospitality", "2 John warns against welcoming teachers who would change the confession of Christ.", "A letter to one house church", "It addresses a sister church through one hostess, and asks that hospitality be given carefully."],
  [64, "Hospitality without partiality", "3 John defends the welcome of the truth and gently resists a leader's love of the spotlight.", "A small network of believers", "It shows the early church as a network of households and travelling workers who carried one another's needs."],
  [65, "Contend for the faith", "Jude calls the church to contend for the faith and to keep love as its mark.", "A warning to one congregation", "It was written to a church where false teachers had already crept in and led some astray."],
  [66, "The reigning Christ and the new creation", "Revelation shows the risen Christ reigning, and his people worshipping in a new creation.", "The world of the Roman empire", "Its images speak to Christians under imperial pressure, in a world that boasted of its own power and permanence."]
];

export const BOOK_STUDY_INSIGHTS = {};

ROWS.forEach(([number, theologicalTitle, theologicalBody, historicalTitle, historicalBody]) => {
  BOOK_STUDY_INSIGHTS[number] = {
    theological: { title: theologicalTitle, body: theologicalBody },
    historical: { title: historicalTitle, body: historicalBody }
  };
});

/** The bundled study insights for a book, with a safe fallback for any book. */
export const getBookStudyInsights = (book) => {
  const number = Number(book && book.number);
  const found = BOOK_STUDY_INSIGHTS[number];
  if (found) return found;
  const name = book && book.name ? book.name : "this book";
  return {
    theological: {
      title: `Reading ${name} in the whole of Scripture`,
      body: `${name} is part of the one story of God with his people, and each of its sections carries that story forward.`
    },
    historical: {
      title: `The world of ${name}`,
      body: `Every book of the Bible was written into a real world of people, places and pressures. Reading ${name} with that world in view makes it speak again.`
    }
  };
};
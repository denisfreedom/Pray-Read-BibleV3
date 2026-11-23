// Study notes for every book of the Bible, used by the reader sidebar.
//
// Each guide carries:
//   intro   - a short orientation to the book in plain language
//   outline - the main divisions of the book with their verse ranges
//
// The ranges follow the usual Protestant divisions, so they line up with the
// study resources the app already shows on the chapter page.

export const BOOK_GUIDES = {};

Object.assign(BOOK_GUIDES, {
  1: {
    intro:
      "Genesis opens the Bible with creation, humanity's fall, and the long line of patriarchs God called. God is the author and the protagonist: through Adam, Noah, Abraham, Isaac, Jacob and Joseph He prepares a family through which every nation will be blessed.",
    outline: [
      ["God creates the heavens and the earth", "1:1-2:25"],
      ["Adam and Eve in the garden", "2:25-3:24"],
      ["Cain and Abel, and the line of Seth", "4:1-5:32"],
      ["The flood and a renewed world", "6:1-9:17"],
      ["The tower of Babel and the nations", "10:1-11:26"],
      ["The call of Abram", "11:27-12:10"],
      ["Abram and Lot, and the promised land", "13:1-14:24"],
      ["The covenant and the birth of Isaac", "15:1-21:33"],
      ["Isaac, Jacob and the family blessing", "22:1-35:29"],
      ["Joseph in Egypt", "37:1-50:26"]
    ]
  },
  2: {
    intro:
      "Exodus answers the question of who this God is who rescued me. It follows Israel's rescue from slavery: a burning bush, a reluctant messenger, a Passover lamb, a sea crossed on dry ground and a forty-year journey that ends at the mountain of God.",
    outline: [
      ["Moses: from the Nile to the burning bush", "1:1-3:6"],
      ["God's demand and the ten plagues", "3:7-12:32"],
      ["The Passover and the departure", "12:1-14:31"],
      ["The journey to Sinai and the covenant", "15:1-19:8"],
      ["The Ten Commandments", "19:1-24:18"],
      ["The tabernacle, God's dwelling among His people", "24:19-27:21"],
      ["The golden calf and the renewed covenant", "28:1-34:35"],
      ["The wilderness journey toward Canaan", "35:1-40:38"]
    ]
  },
  3: {
    intro:
      "Leviticus is the handbook of God's house. It shows how a holy God draws near to His people through sacrifice, priesthood, purity and celebration, and every shadow in the book points forward to the perfect offering and mediator.",
    outline: [
      ["Burnt, grain and peace offerings", "1:1-7:14"],
      ["The priesthood and the holy place", "7:15-10:20"],
      ["Clean and unclean days", "11:1-15:33"],
      ["The Day of Atonement", "16:1-17:2"],
      ["Holiness in everyday life", "18:1-22:33"]
    ]
  },
  4: {
    intro:
      "Numbers follows Israel through the wilderness for almost forty years. It records the census, the camps, the people's unbelief and the leaders who keep the tribes moving toward the land God has promised.",
    outline: [
      ["The census and the march from Sinai", "1:1-4:49"],
      ["The camps, the leaders and the offerings", "5:1-10:49"],
      ["The spies and the unbelief of the people", "11:1-14:45"],
      ["Korah's rebellion and the wilderness walk", "15:1-17:13"],
      ["The journey east of the Jordan", "17:14-22:9"],
      ["Balaam, and Israel blessed", "22:1-25:18"],
      ["The last journeys and the inheritance", "26:1-36:13"]
    ]
  },
  5: {
    intro:
      "Deuteronomy is Moses' farewell. He reminds a new generation what God has done, who they are, and how to love Him wholeheartedly, so that they may enter the land and live as a treasured nation.",
    outline: [
      ["The setting and the choice of Israel", "1:1-3:29"],
      ["The mighty acts of God", "4:1-4:49"],
      ["Love God with all your heart", "5:1-6:25"],
      ["A holy people among the nations", "7:1-11:32"],
      ["The renewed commandment and the heart", "12:1-16:17"],
      ["Warnings, and the song of the law", "16:18-18:29"],
      ["The final charge and the song of Moses", "19:1-34:12"]
    ]
  },
  6: {
    intro:
      "Joshua records the conquest of Canaan and the dividing of the land. It asks us to notice the strength of God among a weak people, and it warns us to choose deliberately whom we will serve.",
    outline: [
      ["The call to take the land", "1:1-5:15"],
      ["Jericho, Ai and the covenant renewed", "6:1-8:35"],
      ["The Gibeon treaty and the long day", "9:1-10:43"],
      ["The southern and eastern conquest", "11:1-13:33"],
      ["The tribes of Reuben, Gad and Manasseh", "13:1-22:34"],
      ["Joshua's farewell charge", "23:1-24:33"]
    ]
  },
});

Object.assign(BOOK_GUIDES, {
  7: {
    intro:
      "Judges shows Israel in a cycle of sin, oppression, crying out and deliverance. The book keeps asking the same question: with no king to lead them, the people did what was right in their own eyes, and the consequence was chaos.",
    outline: [
      ["The judges and the theme of the book", "1:1-2:5"],
      ["Ehud, Deborah and Gideon", "3:1-8:35"],
      ["Abimelech, Jephthah and Ibzan", "9:1-12:15"],
      ["Samson: the call, the exploits and the fall", "13:1-16:31"],
      ["The recurring cycle and its meaning", "17:1-21:25"]
    ]
  },
  8: {
    intro:
      "Ruth is a short story of loyal love in the dark days of the judges. A foreign widow stays faithful to her dead husband and to the God of Israel, and the book shows how God's faithfulness quietly restores her family, her fields and her future.",
    outline: [
      ["Elimelech's family in Moab", "1:1-5"],
      ["Ruth in the field of Boaz", "2:1-23"],
      ["Boaz and the elders at the gate", "3:1-18"],
      ["The redemption of the field and the marriage", "4:1-22"]
    ]
  },
  9: {
    intro:
      "1 Samuel follows Israel from the last days of the judges to the first king. Samuel's life, Hannah's prayer, the ark, the requests of the people and the rise of Saul and David all ask where the heart of the kingdom truly rests.",
    outline: [
      ["Hannah's prayer and the birth of Samuel", "1:1-3:10"],
      ["Samuel as judge and prophet", "3:11-7:17"],
      ["The ark and the request for a king", "8:1-12:24"],
      ["Saul's rise and his early victories", "13:1-14:52"],
      ["Samuel's rebuke of Saul and the rise of David", "15:1-31:13"]
    ]
  },
  10: {
    intro:
      "2 Samuel records the reign of David: his rise, his victories, the covenant with Nathan, and the heavy consequences of his sin with Bathsheba. It shows a great king undone by one moment of self-safety.",
    outline: [
      ["David's victories and the capital", "1:1-10:19"],
      ["The covenant with David", "10:20-12:25"],
      ["David's household and the rise of Absalom", "13:1-15:23"],
      ["Absalom's rebellion and David's grief", "15:24-19:10"],
      ["David's sin and its consequences", "19:11-24:22"]
    ]
  },
  11: {
    intro:
      "1 Kings covers the reign of Solomon and the beginning of the divided kingdom. It shows the wisdom of Solomon, the building of the temple, and the slow decay that ended in Israel and Judah going their separate ways.",
    outline: [
      ["Solomon becomes king", "1:1-2:46"],
      ["Solomon's wisdom and the temple plans", "3:1-5:16"],
      ["The temple is built and dedicated", "6:1-8:66"],
      ["Solomon's wealth, wives and decline", "9:1-11:43"]
    ]
  },
  12: {
    intro:
      "2 Kings tells of the last days of the divided kingdom, the exile of both Israel and Judah, and the prophets who spoke for God in the darkness before the end. It ends with the last people of Judah taken away.",
    outline: [
      ["Ahaziah, Jehoram and Athaliah", "1:1-3:27"],
      ["Elisha and the miracles of power", "3:28-6:18"],
      ["The fall of Samaria and the exile of Israel", "6:19-8:29"],
      ["Jehu's purge and the northern kingdom", "9:1-10:36"],
      ["Josiah's reform and the fall of Jerusalem", "11:1-16:20"],
      ["The final days and the Babylonian exile", "17:1-25:30"]
    ]
  },
  13: {
    intro:
      "1 Chronicles is a history of the covenant people retold for a new generation. It spends most of its length on David: his reign, his worship, his preparations for the temple and his organization of worship that outlasted him.",
    outline: [
      ["The genealogies of the tribes", "1:1-9:44"],
      ["The reign of Saul", "10:1-13:14"],
      ["David and his mighty men", "14:1-20:8"],
      ["The ark is brought to Jerusalem", "13:1-16:43"],
      ["David's reign, his worship and his preparation", "17:1-29:30"]
    ]
  },
  14: {
    intro:
      "2 Chronicles traces the southern kingdom from Solomon to the exile, concentrating on the kings who did right, the reforms of Asa, Jehoshaphat, Hezekiah and Josiah, and the steady decline that ended in captivity.",
    outline: [
      ["Solomon builds the temple", "1:1-5:14"],
      ["Rehoboam and the divided kingdom", "5:15-10:14"],
      ["Asa and Jehoshaphat", "11:1-20:37"],
      ["Jehoram, Ahaziah and the Philistine invasion", "21:1-22:9"],
      ["Joash, Amaziah and Uzziah", "22:10-27:9"],
      ["Jotham, Ahaz, Hezekiah and Manasseh", "27:10-33:13"],
      ["Josiah, Jehoiachin and the exile", "33:14-36:23"]
    ]
  },
});

Object.assign(BOOK_GUIDES, {
  15: {
    intro:
      "Ezra records the return of the people from exile: the decree of Cyrus, the rebuilding of the temple, the reading of the law, the sorrow over sin and the covenant renewal. It is a book about a people who come home to God's word.",
    outline: [
      ["The decree of Cyrus and the first return", "1:1-4:16"],
      ["The rebuilding of the temple", "5:1-6:18"],
      ["Ezra's return and the reading of the law", "7:1-8:46"],
      ["The people's grief over sin", "9:1-10:17"],
      ["The covenant renewal and the feast of booths", "10:18-11:36"]
    ]
  },
  16: {
    intro:
      "Nehemiah shows a man who takes a hard assignment for the good of his people. He asks for prayer, faces opposition, organizes the rebuilding of the walls, deals with corruption, and ends by pointing everyone back to the law and the joy of the Lord.",
    outline: [
      ["Nehemiah's request and the rebuilding of the walls", "1:1-6:16"],
      ["The leaders and the opposition", "6:17-13:31"],
      ["The reading of the law and the covenant", "7:1-10:39"]
    ]
  },
  17: {
    intro:
      "Esther is the only book of the Bible that does not name God. It tells of a young woman who risks her life to save her people, and of a plan reversed overnight so that the enemy is ruined and the feast of Purim is born.",
    outline: [
      ["The kingdom of Ahasuerus", "1:1-2:18"],
      ["Mordecai's discovery of the plot", "2:19-3:8"],
      ["Esther before the king", "3:9-5:14"],
      ["The fall of Haman and the rescue of the Jews", "6:1-10:3"],
      ["The feast of Purim", "10:4-12:1"]
    ]
  },
  18: {
    intro:
      "Job is a book about suffering and the limits of what we can know. A righteous man loses everything, his friends offer explanations that do not help, and in the end Job speaks honestly to God and comes out of the book still worshiping.",
    outline: [
      ["Job and the opening speeches", "1:1-3:13"],
      ["Job's friends and their first round", "3:14-10:20"],
      ["Job's complaint and the second round", "11:1-13:28"],
      ["Job's dispute with his friends", "14:1-21:17"],
      ["God's answer from the whirlwind", "38:1-42:17"]
    ]
  },
  19: {
    intro:
      "Psalms is the prayer and poetry of God's people. Some psalms sing, some lament, some instruct, some bless and some accuse, and taken together they teach the church to bring every part of life to God.",
    outline: [
      ["Psalms of David", "1:1-10:75"],
      ["Songs of ascents and praises", "84:1-89:52"],
      ["The Psalms of the sons of Korah", "90:1-108:13"],
      ["Hallelujah and songs of thanksgiving", "109:1-150:6"]
    ]
  },
  20: {
    intro:
      "Proverbs gathers the wisdom of the centuries for everyday life. It is less a book of rules than a training of character: the fear of the Lord, honest speech, the danger of wealth, the value of a good wife and the strength of a life built on God.",
    outline: [
      ["The beginning of wisdom", "1:1-9:18"],
      ["A collection of proverbs", "10:1-24:33"],
      ["A second collection of proverbs", "25:1-29:27"],
      ["The heart of wisdom: God, love and faithfulness", "30:1-31:31"]
    ]
  },
  21: {
    intro:
      "Ecclesiastes asks the hard questions about meaning, work, time and death. The Preacher searches for satisfaction in pleasure, achievement and wealth, finds them empty, and ends by pointing to the one thing that is better: to fear God and enjoy Him.",
    outline: [
      ["Everything under the sun", "1:1-2:26"],
      ["The seasons God has set", "3:1-3:22"],
      ["A time for everything", "3:1-4:16"],
      ["The house of God and the walk alone", "4:1-6:12"],
      ["The value of a good name and of love", "6:1-8:17"],
      ["Death, and the end of the matter", "9:1-12:14"]
    ]
  },
  22: {
    intro:
      "The Song of Solomon is a love poem that the church has long read as Christ's love for his people. It moves from longing to union, and it asks the reader to be awake, faithful and free in the love of God.",
    outline: [
      ["The bride asks for her beloved", "1:1-2:7"],
      ["Mutual love", "2:8-4:7"],
      ["The bride is led to the king", "4:8-6:3"],
      ["The garden of love", "6:4-8:14"]
    ]
  },
  23: {
    intro:
      "Isaiah was a prophet to a guilty nation in the late eighth century before Christ, and a poet of the gospel. He speaks of judgment and of a remnant who are redeemed, of the Servant who suffers, and of a future in which the whole earth sings.",
    outline: [
      ["Isaiah's vision and the call of a holy nation", "1:1-6:13"],
      ["The day of the Lord and the book of comfort", "6:14-12:6"],
      ["The coming King and the gospel of peace", "12:7-23:6"],
      ["The coming judgement on the nations", "23:7-35:10"],
      ["The Servant, comfort and new heavens", "36:1-39:8"],
      ["The final songs of praise", "40:1-66:24"]
    ]
  },
  24: {
    intro:
      "Jeremiah is a prophet of tears who also spoke of a new covenant and a new heart. He lived through Jerusalem's final decades, warned the nation, watched the temple fall, and looked ahead to a restoration that God would accomplish.",
    outline: [
      ["Jeremiah's call and early messages", "1:1-10:25"],
      ["The temple, the covenant and the judgment", "11:1-25:38"],
      ["The city of God and the true shepherds", "26:1-35:19"],
      ["The exile and the hope of restoration", "36:1-45:13"],
      ["The new covenant and the new heart", "46:1-52:34"]
    ]
  },
  25: {
    intro:
      "Lamentations is a book of five poems over the ruin of Jerusalem. It is grief expressed in deliberate, measured poetry, and through that grief it says that God is still sovereign over the disaster and still reachable in the dark.",
    outline: [
      ["The first lament: the city emptied", "1:1-22"],
      ["The second lament: judgment and mercy", "2:1-22"],
      ["The third lament: a broken people", "3:1-66"],
      ["The fourth and fifth laments", "4:1-5:22"]
    ]
  },
  26: {
    intro:
      "Ezekiel spoke to the exiles in Babylon, among whom he was a voice of life. He calls the people to turn, gives visions of God's glory and the future temple, and names the shepherds who were destroying the flock.",
    outline: [
      ["Ezekiel among the exiles and the call to repent", "1:1-7:27"],
      ["The vision of the new temple and its worship", "8:1-11:25"],
      ["Judgment on Jerusalem and its leaders", "12:1-19:17"],
      ["The vision of the valley of dry bones", "20:1-24:27"],
      ["The closing visions of God's glory", "25:1-48:35"]
    ]
  },
  27: {
    intro:
      "Daniel is a story of faithful people in a pagan empire. It shows God's kingdom overruling human kingdoms, and it ends with a stone cut out of the mountain that fills the whole earth.",
    outline: [
      ["Daniel in Babylon", "1:1-2:49"],
      ["The image of the kingdoms", "2:1-49"],
      ["Daniel before the king", "3:1-4:37"],
      ["The visions of the night", "5:1-6:23"],
      ["The visions of Daniel's days", "7:1-12:13"]
    ]
  },
  28: {
    intro:
      "Hosea shows God's relentless love for a people who kept leaving. Through the broken marriage of Hosea, the book teaches that God's covenant holds even when the beloved does not, and calls the people back to faithfulness.",
    outline: [
      ["Hosea's family and his call", "1:1-3:5"],
      ["Gilead's judgment and Israel's return", "3:6-6:11"],
      ["God's case against the people", "7:1-10:15"],
      ["A faithful people restored", "11:1-14:9"]
    ]
  },
  29: {
    intro:
      "Joel is a short book with a large voice. It calls the nation to a solemn fast, describes a devastating locust invasion as the advance of the Day of the Lord, and then opens the promise of the Spirit poured out on all people.",
    outline: [
      ["The locust devastation", "1:1-2:32"],
      ["A call to repentance", "3:1-5:15"]
    ]
  },
  30: {
    intro:
      "Amos was a herdsman and a thorn pricker for justice. He speaks to Israel at ease and to a nearby nation at war, and every message ends with the same promise: the Day of the Lord is coming for everyone who trusts in themselves.",
    outline: [
      ["Amos's call and his message to the nations", "1:1-2:16"],
      ["God's case against Judah and Israel", "3:1-5:15"],
      ["The Day of the Lord", "6:1-7:25"],
      ["A vision of God's mercy and a closing word", "8:1-9:15"]
    ]
  },
  31: {
    intro:
      "Obadiah is the shortest book in the Bible: one chapter about Edom. It was written for a people who mocked God's people on the day of their downfall, and it says that pride and rejoicing in another's disaster will not stand.",
    outline: [
      ["Edom's pride and its crimes", "1-16"],
      ["The day of the Lord on Edom", "17-21"]
    ]
  },
  32: {
    intro:
      "Jonah is a story about a prophet who ran from his assignment and a city he had already decided to hate. It ends with a question that asks whether our compassion is limited to the people we find convenient.",
    outline: [
      ["Jonah runs away", "1:1-3:10"],
      ["The prayer in the fish", "2:1-4"],
      ["Nineveh is warned and is saved", "3:1-10"],
      ["Jonah's anger and God's question", "4:1-11"]
    ]
  },
  33: {
    intro:
      "Micah speaks to the shepherds and rulers of Judah who exploit the weak. His book holds justice and mercy together: the Micah 6:8 challenge, and a promise of a ruler from Bethlehem who will gather the people as one flock.",
    outline: [
      ["Judgement against Samaria and Jerusalem", "1:1-2:13"],
      ["The shepherds and the remnant", "3:1-5:15"],
      ["The Lord, the nations and the coming ruler", "6:1-7:20"]
    ]
  },
  34: {
    intro:
      "Nahum answers the question of how God deals with the violent empire of Nineveh. It is a short, fierce book that speaks of the Lord as good, the refuge of His people and the judge of the proud.",
    outline: [
      ["The Lord against Nineveh", "1:1-2:13"],
      ["The fall of the city", "2:14-3:19"]
    ]
  },
  35: {
    intro:
      "Habakkuk asks honest questions of God: how long must the violent go unpunished, and why should God use a lesser people to correct a greater one. The answer comes in the person of a righteous servant who learns to trust.",
    outline: [
      ["The prophet's complaint", "1:1-2:20"],
      ["The answer from the watchman", "2:1-3:20"],
      ["The prayer and the trust of the prophet", "3:1-3:20"]
    ]
  },
  36: {
    intro:
      "Zephaniah speaks before Josiah's great reform, warning that the Day of the Lord is near for everyone. The book sings of joy that God will sing over his people and will gather them as his own.",
    outline: [
      ["The Lord against Judah and the nations", "1:1-2:15"],
      ["The day of the Lord and a call to seek him", "3:1-4"]
    ]
  },
  37: {
    intro:
      "Haggai spoke to a people who had stopped rebuilding the temple. Two short speeches call them back to the work and tell them that the promises of God are not yet finished, but are about to be fulfilled.",
    outline: [
      ["The call to rebuild", "1:1-15"],
      ["The second message and the glory of the house", "2:1-23"]
    ]
  },
  38: {
    intro:
      "Zechariah spoke to returning exiles who were discouraged by the temple's unfinished state. He calls them to repentance and then shows what God is about to do: a king who comes, a cleansed people and a holy city.",
    outline: [
      ["A call to return and a vision of the horns", "1:1-6:15"],
      ["The vision of the gold and the olive trees", "6:1-8:23"],
      ["The king who comes and the shepherds", "9:1-11:17"],
      ["The remnant gathered and the temple opened", "12:1-14:21"]
    ]
  },
  39: {
    intro:
      "Malachi is the last of the Old Testament prophets, speaking after the temple was rebuilt. He exposes a people who worship without obedience, argues for the tithe and the firstfruits, and promises that the Messenger of the Covenant is coming.",
    outline: [
      ["Israel's blemished offering", "1:1-14"],
      ["The priests and the silent people", "2:1-17"],
      ["The rebuke and the messenger of the covenant", "3:1-18"],
      ["The day of the Lord and Elijah", "4:1-6"]
    ]
  },
});

Object.assign(BOOK_GUIDES, {
  40: {
    intro:
      "Matthew presents Jesus as the promised King who comes to His people. Written for a Jewish audience that knew the law, it traces the genealogy of Christ, records the birth in Bethlehem, gathers the Sermon on the Mount and ends with the great commission.",
    outline: [
      ["The genealogy and the birth of Jesus", "1:1-2:23"],
      ["John the Baptist and the beginning of Jesus' ministry", "3:1-4:16"],
      ["The Sermon on the Mount", "5:1-7:28"],
      ["The miracles and authority of Jesus", "8:1-9:34"],
      ["The kingdom revealed through parables", "10:1-13:35"],
      ["Rejecting and receiving the kingdom", "14:1-15:39"],
      ["Teaching on faith, money and prayer", "16:1-17:27"],
      ["The way to the cross", "18:1-20:34"],
      ["The passion of Jesus", "21:1-27:66"],
      ["The resurrection and the commission", "28:1-28:20"]
    ]
  },
  41: {
    intro:
      "Mark is the shortest and most urgent of the Gospels. Written for a Gentile audience in Rome, it moves quickly from the call of the disciples to the cross, using the word 'immediately' again and again so that readers will follow Jesus without delay.",
    outline: [
      ["The beginning of the good news", "1:1-13"],
      ["The call of the disciples and the authority of Jesus", "1:14-8:21"],
      ["Who do people say that I am?", "8:22-9:50"],
      ["The journey to Jerusalem", "10:1-12:50"],
      ["The passion and death of Jesus", "14:1-15:47"],
      ["The empty tomb and the mission", "16:1-20"]
    ]
  },
  42: {
    intro:
      "Luke writes an orderly account so that readers may know the certainty of the things they have been taught. He gives us more of the songs of Mary, the shepherds and Jesus, and he follows the good news from Nazareth all the way to Rome.",
    outline: [
      ["The birth and childhood of Jesus", "1:1-2:52"],
      ["John the Baptist and Jesus' baptism", "3:1-4:31"],
      ["The temptation and the Galilean ministry", "4:1-6:49"],
      ["The gospel of the kingdom", "7:1-9:56"],
      ["The good Samaritan and the disciple's prayer", "10:1-11:54"],
      ["The journey to Jerusalem", "12:1-13:35"],
      ["The passion, resurrection and the great commission", "14:1-24:50"],
      ["Acts: the gospel moves outward", "24:51-28:31"]
    ]
  },
  43: {
    intro:
      "John writes a gospel of signs and of the Word made flesh. He records seven signs, long discourses, and the high priestly prayer of Jesus, so that readers may believe that the Son of God is the Christ, the Son of God, the Word made flesh.",
    outline: [
      ["The Word made flesh", "1:1-18"],
      ["The first followers of Jesus", "1:19-51"],
      ["The first sign: water into wine", "2:1-25"],
      ["Nicodemus and the woman at the well", "3:1-4:42"],
      ["The bread of life and the walk on the water", "5:1-6:71"],
      ["The bread of life and the feeding of the five thousand", "6:1-6:71"],
      ["The good shepherd and the blind man", "7:1-9:41"],
      ["The good shepherd and the feast of tabernacles", "10:1-11:57"],
      ["The washing of the feet and the farewell discourse", "12:1-17:26"],
      ["The arrest, trial and resurrection", "18:1-21:25"]
    ]
  },
  44: {
    intro:
      "Acts is the record of the early church. It follows the Spirit from Jerusalem to Rome: Peter's preaching, the calling of Paul, the journeys of the apostle, the council at Jerusalem and the arrival of the gospel in the capital of the empire.",
    outline: [
      ["The ascension and the gift of the Spirit", "1:1-2:47"],
      ["The church in Jerusalem", "2:1-7:43"],
      ["The spreading of the gospel", "8:1-12:25"],
      ["Peter and the Gentiles", "11:1-15:35"],
      ["Paul's first journey", "13:1-14:28"],
      ["The Jerusalem council", "15:1-35"],
      ["Paul's second and third journeys", "16:1-21:18"],
      ["Paul's imprisonment and the journey to Rome", "21:1-28:31"]
    ]
  },
  45: {
    intro:
      "Romans is the fullest statement of the gospel Paul preached. It opens with the human problem, spends eight chapters on God's answer in Christ, and then turns to what that changes: a new life in the Spirit, renewed thinking, and love that carries the community.",
    outline: [
      ["Greetings and Paul's calling", "1:1-17"],
      ["The gospel of God's righteousness", "1:18-3:20"],
      ["Justified by faith", "3:21-5:21"],
      ["Life in the Spirit and freedom from sin", "6:1-8:39"],
      ["The election of Israel", "9:1-11:36"],
      ["A new life for the people of God", "12:1-15:7"],
      ["Greetings and the collections for Jerusalem", "15:1-16:27"]
    ]
  },
  46: {
    intro:
      "1 Corinthians is a letter to a young church that had the gifts of the Spirit but not yet the love that orders them. Paul answers questions about division, lawsuits, sexuality, worship, gifts and the resurrection, and he insists that love is the way of Christ.",
    outline: [
      ["Paul's greeting and the report from Corinth", "1:1-4:21"],
      ["The cross and the wisdom of God", "1:22-4:21"],
      ["Sex, marriage and freedom", "5:1-9:23"],
      ["Idolatry and the Lord's table", "10:1-13:13"],
      ["Spiritual gifts and love", "12:1-14:40"],
      ["The resurrection of Christ", "15:1-16:8"],
      ["The collections and the closing words", "16:1-16:24"]
    ]
  },
  47: {
    intro:
      "2 Corinthians is a letter written from weakness. Paul defends his ministry, defends the gospel against those who challenged his authority, and ends with a plea that the church open its doors so that he can come and rejoice with them.",
    outline: [
      ["Paul's opening and his defence of his ministry", "1:1-2:17"],
      ["The comfort of the new covenant", "2:18-5:21"],
      ["The treasure in jars of clay", "4:1-7:16"],
      ["The appeal for the collection for Jerusalem", "8:1-9:15"],
      ["Paul's ministry and the ministry of reconciliation", "10:1-13:10"],
      ["The final appeal and greetings", "13:1-13:14"]
    ]
  },
  48: {
    intro:
      "Galatians is a short, urgent letter about the gospel of grace. Paul writes to churches that were being told they needed to add something to Christ, and he refuses: justification is by faith in Christ alone, and the Spirit brings the fruit that law could never produce.",
    outline: [
      ["The greeting and Paul's question", "1:1-2:14"],
      ["The gospel Paul received", "2:15-3:29"],
      ["Freedom in Christ and the fruit of the Spirit", "4:1-5:26"],
      ["Walking in the Spirit and restoring a brother", "6:1-6:18"]
    ]
  },
  49: {
    intro:
      "Ephesians explains the mystery of the church: one body, one hope, one Lord, built on Christ and united by his Spirit. It spends half its length on the gospel of grace and the other half on the life that grace produces in the household and the church.",
    outline: [
      ["God's plan from before the foundation of the world", "1:1-14"],
      ["The grace of God and the new life", "1:15-2:22"],
      ["One body, one Lord", "2:19-4:16"],
      ["A new life and the armour of God", "4:17-6:24"]
    ]
  },
  50: {
    intro:
      "Philippians is a letter of thanks and joy. Paul writes from prison, remembers the Philippians' partnership in the gospel, and calls them to the same joyful, gentle, unhurried life of Jesus Christ.",
    outline: [
      ["Paul's greeting and prayer", "1:1-11"],
      ["Paul's circumstances and the advance of the gospel", "1:12-26"],
      ["The example of Christ", "2:1-18"],
      ["The letter to the church in Philippi", "2:19-4:23"]
    ]
  },
});

Object.assign(BOOK_GUIDES, {
  51: {
    intro:
      "Colossians answers a church that was adding rules to the faith. Paul argues that the fullness of God is in Christ, that believers are complete in Him, and that the old ways of religion and morality must give way to a new life of love.",
    outline: [
      ["The greeting and Paul's prayer", "1:1-12"],
      ["The supremacy of the Son and the new creation", "1:13-2:23"],
      ["Set your minds on the things above", "3:1-17"],
      ["Instructions for the household and the church", "3:18-4:18"]
    ]
  },
  52: {
    intro:
      "1 Thessalonians is the earliest Christian letter we have. Paul writes to a new church that is discouraged by persecution, and he thanks God for their faith, corrects a false teaching about those who have died, and calls them to work, love and holiness.",
    outline: [
      ["Paul's greeting and his thanksgiving", "1:1-3:13"],
      ["Living for the Lord and the comfort of the dead", "4:1-5:11"],
      ["Everyday Christian life and the final word", "5:12-5:28"]
    ]
  },
  53: {
    intro:
      "2 Thessalonians answers questions about the coming of the Lord and the work of a Christian while waiting. Paul asks the church to stand firm, to work honestly, to keep the faith and to wait patiently for the man of lawlessness.",
    outline: [
      ["Thanksgiving and a word about the coming of the Lord", "1:1-12"],
      ["The man of lawlessness", "2:1-12"],
      ["Work, patience and Christian conduct", "3:1-3:18"]
    ]
  },
  54: {
    intro:
      "1 Timothy gives Timothy instructions for the life of the church. Paul urges him to guard the truth, to pray for all people, to treat the elders well, to care for widows and to hold a life of godliness that makes the gospel believable.",
    outline: [
      ["Paul's charge to Timothy", "1:1-20"],
      ["How to worship and pray for all people", "2:1-3:16"],
      ["The elders and the church's leaders", "3:1-16"],
      ["Godliness in the household and in the community", "4:1-6:21"]
    ]
  },
  55: {
    intro:
      "2 Timothy is a charge from an old man in prison to a young pastor. Paul passes the torch: guard the gospel, be strong, endure hardship, study the Scriptures and carry on the work even when the generations of faith are being shaken.",
    outline: [
      ["Paul's greeting and his charge", "1:1-18"],
      ["A faithful servant of the gospel", "2:1-26"],
      ["Sound teaching and the value of Scripture", "3:1-17"],
      ["Paul's final charge and greetings", "4:1-4:22"]
    ]
  },
  56: {
    intro:
      "Titus is a short letter about church order and good works. Paul asks Titus to appoint elders in every town, to hold fast to the doctrine, to encourage generosity and to live a life that makes the grace of God attractive to people.",
    outline: [
      ["Paul's greeting and the appointing of elders", "1:1-16"],
      ["Sound doctrine and the life of grace", "2:1-15"],
      ["Duties, and the grace that teaches us", "3:1-17"]
    ]
  },
  57: {
    intro:
      "Philemon is a short letter about a runaway slave. Paul appeals to Philemon to receive Onesimus not as a slave but as a dear brother, showing how the gospel of grace changes the way people treat one another.",
    outline: [
      ["Paul's greeting and appeal", "1:1-25"]
    ]
  },
  58: {
    intro:
      "Hebrews is a sermon that becomes a letter. Its writer urges readers not to drift away from the gospel, and traces the better hope of Christ through the tent, the sacrifices, the priesthood and the once-for-all sacrifice of the Son.",
    outline: [
      ["The Son greater than angels and the Word", "1:1-4:13"],
      ["The great high priest and the new covenant", "4:14-8:13"],
      ["The heavenly sanctuary and the true worship", "9:1-10:39"],
      ["Faith, endurance and the runners", "11:1-12:29"],
      ["Practical exhortations and closing remarks", "13:1-13:25"]
    ]
  },
  59: {
    intro:
      "James is a letter full of practical wisdom. James calls his readers to be doers of the word and not hearers only, and he speaks plainly about the tongue, money, prayer, patience and the way we treat the poor.",
    outline: [
      ["Faith without works", "1:1-2:26"],
      ["Tongues, faith and the power of prayer", "3:1-5:20"],
      ["Wisdom, money and patience", "6:1-20"]
    ]
  },
  60: {
    intro:
      "1 Peter addresses believers who are suffering for their faith. It calls them a living stone in God's house, urges them to live as strangers in a strange land, and promises that the God who shepherds them will keep them through every trial.",
    outline: [
      ["Greetings and the living stones", "1:1-25"],
      ["The calling of a holy people", "2:1-25"],
      ["A people who live before the watching God", "3:1-22"],
      ["Living in the light and in love", "4:1-5:14"]
    ]
  },
  61: {
    intro:
      "2 Peter deals with scoffers who mock the promise of a coming day. The writer answers them with the record of the transfiguration, the reality of the last days and the reminder that God is patient, so that we do not hurry the promise along.",
    outline: [
      ["Growth in the knowledge of Christ", "1:1-19"],
      ["The sure word of prophecy", "3:1-18"],
      ["The day of the Lord and the new heavens", "3:19-4:18"]
    ]
  },
  62: {
    intro:
      "1 John begins with the Word of life and tests every claim by the tests of faith, love and obedience. It is a letter of assurance: those who love God and keep His commands walk in the light and never walk in darkness.",
    outline: [
      ["The Word of life and fellowship", "1:1-7"],
      ["Children of God and the love of the world", "2:1-29"],
      ["Children of God and the truth", "3:1-24"],
      ["The love of God and the tests of faith", "4:1-5:13"]
    ]
  },
  63: {
    intro:
      "2 John is a short letter from an elder to an elected lady and her children, with one firm warning: do not love the world and do not let the teaching of anyone else turn you away from the truth of Christ.",
    outline: [
      ["Greetings and the truth", "1-2"],
      ["Love and obedience", "3-5"],
      ["A warning against false teachers", "6-13"]
    ]
  },
  64: {
    intro:
      "3 John is a letter about hospitality and humility. The writer praises a faithful friend who welcomed travelling workers, and warns against a proud leader who loves to be first among them.",
    outline: [
      ["Greetings and the praise of a faithful friend", "1-2"],
      ["The warning against pride", "3-8"],
      ["Closing words", "9-15"]
    ]
  },
  65: {
    intro:
      "Jude is a short, fierce letter that calls the church to contend for the faith and to be alert to false teachers. It also shows how to respond wrongly: not with anger but with kindness, as God Himself is patient with those who do not know what they do.",
    outline: [
      ["Greetings and the call to contend for the faith", "1-4"],
      ["The danger of false teachers", "5-16"],
      ["A call to watch and to be merciful", "17-25"]
    ]
  },
  66: {
    intro:
      "Revelation is a vision given to a persecuted church so that it would know that God is in control. John sees a throne in heaven, the Lamb who was slain, the new Jerusalem descending, and a final invitation: whoever has ears, let him hear.",
    outline: [
      ["The revelation of Jesus Christ", "1:1-1:20"],
      ["The letters to the seven churches", "2:1-3:22"],
      ["The throne room and the sealed scroll", "4:1-7:14"],
      ["The Lamb opens the scroll", "5:1-8:13"],
      ["The trumpets and the witnesses", "6:1-11:14"],
      ["The dragon, the beast and the woman", "12:1-16:21"],
      ["Babylon and the wine of the wrath of God", "17:1-19:10"],
      ["The final judgment and the new Jerusalem", "19:11-22:21"]
    ]
  },
});

/**
 * Returns the study guide for a book from lib/bibleBooks.js.
 * Falls back to a short generated orientation so the sidebar is never empty.
 */
export const getBookGuide = (book) => {
  if (!book) return null;
  const guide = BOOK_GUIDES[book.number];
  if (guide) return guide;
  const testament = book.number <= 39 ? "Old Testament" : "New Testament";
  return {
    intro: `${book.name} is one of the books of the ${testament}. It runs for ${book.chapters} chapters and is known in Luganda as ${book.luganda}. Read it slowly, one chapter at a time, and ask the Holy Spirit to show you where it points to Christ.`,
    outline: [[`The whole of ${book.name}`, `1:1-${book.chapters}:36`]]
  };
};

/** Section labels used by the reader sidebar. */
export const BOOK_GUIDE_SECTIONS = [
  { key: "intro", label: "Book Intro" },
  { key: "outline", label: "Book Outline" },
  { key: "prayer", label: "Book Prayer" }
];
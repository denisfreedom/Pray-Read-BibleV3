// Luganda devotional formatter.
// Luganda devotionals are stored as one long run; this rebuilds them into
// Title -> Scripture + quoted verse -> Okufumiitiriza -> Okukozesa mu Bulamu
// -> Prayer, and strips any leaked site names.

const LEAKED_SOURCES = ["emanna.com", "emanna", "wordplanet.net", "wordproject.org"];

const HEADINGS = [
  "Okufumiitiriza",
  "Okukozesa mu Bulamu",
  "Okuliriza",
  "Okuzimba",
  "Ebiro",
  "Ebigendererwa"
];

const stripSources = (text) => {
  let out = String(text || "");
  LEAKED_SOURCES.forEach((source) => {
    out = out.split(source).join("");
  });
  return out.replace(/[ \t]{2,}/g, " ").trim();
};

const SENTENCE_ENDINGS = [".", "!", "?"];

const endsSentence = (line) => {
  if (!line) return false;
  const last = line.charAt(line.length - 1);
  return SENTENCE_ENDINGS.indexOf(last) >= 0;
};

const splitSentences = (text) => {
  const parts = [];
  let current = "";
  String(text || "")
    .split(/\s+/)
    .forEach((word) => {
      current = current ? `${current} ${word}` : word;
      if (endsSentence(word)) {
        parts.push(current.trim());
        current = "";
      }
    });
  if (current.trim()) parts.push(current.trim());
  return parts.filter(Boolean);
};

/**
 * Returns { title, scripture, verse, reflection, application, prayer, paragraphs }
 */
export function formatLugandaDevotional(raw) {
  const text = stripSources(raw);
  if (!text) {
    return { title: "", scripture: "", verse: "", reflection: "", application: "", prayer: "", paragraphs: [] };
  }

  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const title = lines.length > 1 ? lines[0] : "";

  let scripture = "";
  let verse = "";
  let reflection = "";
  let application = "";
  let prayer = "";
  const paragraphs = [];

  const lower = text.toLowerCase();
  const headingIndexes = [];
  HEADINGS.forEach((heading) => {
    const index = lower.indexOf(heading.toLowerCase());
    if (index >= 0) headingIndexes.push({ index, heading });
  });
  headingIndexes.sort((a, b) => a.index - b.index);

  const scriptureMatch = text.match(/(\w+\s+\d+\s*:\s*\d+)/);

  if (headingIndexes.length === 0) {
    const body = lines.length > 1 ? lines.slice(1).join("\n") : lines[0] || "";
    paragraphs.push(...splitSentences(body));
    return {
      title,
      scripture: scriptureMatch ? scriptureMatch[1] : "",
      verse: "",
      reflection: paragraphs.join(" "),
      application: "",
      prayer: "",
      paragraphs
    };
  }

  const first = headingIndexes[0];
  const head = text.slice(0, first.index);
  const headSentences = splitSentences(head);
  scripture = scriptureMatch ? scriptureMatch[1] : "";
  verse = headSentences.length > 1 ? headSentences.slice(1).join(" ") : "";
  if (!verse) verse = headSentences.join(" ");

  headingIndexes.forEach((entry, index) => {
    const start = entry.index + entry.heading.length;
    const next = headingIndexes.at(index + 1);
    const end = next ? next.index : text.length;
    const section = text.slice(start, end).trim();
    if (!section) return;
    const heading = entry.heading.toLowerCase();
    if (heading.startsWith("okufumiitiriza") || heading.startsWith("okuliriza")) {
      reflection = section;
    } else if (heading.startsWith("okukozesa")) {
      application = section;
    } else if (heading.startsWith("okuzimba")) {
      prayer = section;
    } else {
      paragraphs.push(section);
    }
  });

  return { title, scripture, verse, reflection, application, prayer, paragraphs };
}

/** English devotionals are plain paragraphs; bold lines become subheadings. */
export function formatEnglishDevotional(raw) {
  const text = stripSources(raw);
  const blocks = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const title = blocks.length > 1 ? blocks[0] : "";
  const body = blocks.length > 1 ? blocks.slice(1) : blocks;
  return {
    title,
    paragraphs: body.map((line) => ({
      heading: line.length < 60 && !endsSentence(line),
      text: line
    }))
  };
}
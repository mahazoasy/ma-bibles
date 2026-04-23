const fs = require('fs');
const path = require('path');

// Supprimer le BOM s'il existe
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) return content.slice(1);
  return content;
}

// Chemin vers ton fichier source (à la racine)
const sourcePath = path.join(__dirname, 'French Louis Segond (1910).json');
let content = fs.readFileSync(sourcePath, 'utf8');
content = stripBOM(content);

let raw;
try {
  // Le fichier est du JavaScript valide, on peut l'évaluer
  raw = eval('(' + content + ')');
} catch (err) {
  console.error('Erreur lors du parsing du fichier source :', err);
  process.exit(1);
}

const bible = { livres: [] };

// Table des noms français des livres
const frenchNames = {
  Genesis: "Genèse",
  Exodus: "Exode",
  Leviticus: "Lévitique",
  Numbers: "Nombres",
  Deuteronomy: "Deutéronome",
  Joshua: "Josué",
  Judges: "Juges",
  Ruth: "Ruth",
  "1 Samuel": "1 Samuel",
  "2 Samuel": "2 Samuel",
  "1 Kings": "1 Rois",
  "2 Kings": "2 Rois",
  "1 Chronicles": "1 Chroniques",
  "2 Chronicles": "2 Chroniques",
  Ezra: "Esdras",
  Nehemiah: "Néhémie",
  Esther: "Esther",
  Job: "Job",
  Psalms: "Psaumes",
  Proverbs: "Proverbes",
  Ecclesiastes: "Ecclésiaste",
  "Song of Solomon": "Cantique des Cantiques",
  Isaiah: "Ésaïe",
  Jeremiah: "Jérémie",
  Lamentations: "Lamentations",
  Ezekiel: "Ézéchiel",
  Daniel: "Daniel",
  Hosea: "Osée",
  Joel: "Joël",
  Amos: "Amos",
  Obadiah: "Abdias",
  Jonah: "Jonas",
  Micah: "Michée",
  Nahum: "Nahum",
  Habakkuk: "Habacuc",
  Zephaniah: "Sophonie",
  Haggai: "Aggée",
  Zechariah: "Zacharie",
  Malachi: "Malachie",
  Matthew: "Matthieu",
  Mark: "Marc",
  Luke: "Luc",
  John: "Jean",
  Acts: "Actes",
  Romans: "Romains",
  "1 Corinthians": "1 Corinthiens",
  "2 Corinthians": "2 Corinthiens",
  Galatians: "Galates",
  Ephesians: "Éphésiens",
  Philippians: "Philippiens",
  Colossians: "Colossiens",
  "1 Thessalonians": "1 Thessaloniciens",
  "2 Thessalonians": "2 Thessaloniciens",
  "1 Timothy": "1 Timothée",
  "2 Timothy": "2 Timothée",
  Titus: "Tite",
  Philemon: "Philémon",
  Hebrews: "Hébreux",
  James: "Jacques",
  "1 Peter": "1 Pierre",
  "2 Peter": "2 Pierre",
  "1 John": "1 Jean",
  "2 John": "2 Jean",
  "3 John": "3 Jean",
  Jude: "Jude",
  Revelation: "Apocalypse"
};

const oldTestamentNames = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
];

// Parcourir les livres
for (const [engName, chapters] of Object.entries(raw)) {
  const frenchName = frenchNames[engName] || engName;
  const testament = oldTestamentNames.includes(engName) ? 'ancien' : 'nouveau';
  const livre = {
    nom: frenchName,
    abrev: frenchName.substring(0, 3),
    testament,
    chapitres: []
  };

  for (const [chapNum, verses] of Object.entries(chapters)) {
    const versets = [];
    for (const [verseNum, text] of Object.entries(verses)) {
      versets.push({ numero: parseInt(verseNum), texte: text });
    }
    livre.chapitres.push({ numero: parseInt(chapNum), versets });
  }
  bible.livres.push(livre);
}

// Écriture du fichier de sortie
const outputPath = path.join(__dirname, 'assets', 'bible_fr.json');
fs.writeFileSync(outputPath, JSON.stringify(bible, null, 2));
console.log(`✅ Bible française convertie → ${outputPath}`);
const fs = require('fs');
const path = require('path');

// Dossier contenant les fichiers JSON malgaches
const BAIBOLY_DIR = path.join(__dirname, 'baiboly');

// Table de correspondance nom du fichier → nom du livre en français (pour compatibilité avec le code)
const bookNameMap = {
  // Ancien Testament (exemples)
  "genesisy": "Genèse",
  "eksodosy": "Exode",
  "levitikosy": "Lévitique",
  "nomery": "Nombres",
  "deoteronomia": "Deutéronome",
  "josoa": "Josué",
  "mpitsara": "Juges",
  "rota": "Ruth",
  "samoela-voalohany": "1 Samuel",
  "samoela-faharoa": "2 Samuel",
  "mpanjaka-voalohany": "1 Rois",
  "mpanjaka-faharoa": "2 Rois",
  "tantara-voalohany": "1 Chroniques",
  "tantara-faharoa": "2 Chroniques",
  "ezra": "Esdras",
  "nehemia": "Néhémie",
  "estera": "Esther",
  "joba": "Job",
  "salamo": "Psaumes",
  "ohabolana": "Proverbes",
  "mpitoriteny": "Ecclésiaste",
  "tononkirani-solomona": "Cantique des Cantiques",
  "isaia": "Ésaïe",
  "jeremia": "Jérémie",
  "fitomaniana": "Lamentations",
  "ezekiela": "Ézéchiel",
  "daniela": "Daniel",
  "hosea": "Osée",
  "joela": "Joël",
  "amosa": "Amos",
  "obadia": "Abdias",
  "jona": "Jonas",
  "mika": "Michée",
  "nahoma": "Nahum",
  "habakoka": "Habacuc",
  "zefania": "Sophonie",
  "hagay": "Aggée",
  "zakaria": "Zacharie",
  "malakia": "Malachie",
  // Nouveau Testament
  "matio": "Matthieu",
  "marka": "Marc",
  "lioka": "Luc",
  "jaona": "Jean",
  "asanny-apostoly": "Actes",
  "romanina": "Romains",
  "1-korintianina": "1 Corinthiens",
  "2-korintianina": "2 Corinthiens",
  "galatianina": "Galates",
  "efesianina": "Éphésiens",
  "filipianina": "Philippiens",
  "kolosianina": "Colossiens",
  "1-tesalonianina": "1 Thessaloniciens",
  "2-tesalonianina": "2 Thessaloniciens",
  "1-timoty": "1 Timothée",
  "2-timoty": "2 Timothée",
  "titosy": "Tite",
  "filemona": "Philémon",
  "hebreo": "Hébreux",
  "jakoba": "Jacques",
  "1-petera": "1 Pierre",
  "2-petera": "2 Pierre",
  "1-jaona": "1 Jean",
  "2-jaona": "2 Jean",
  "3-jaona": "3 Jean",
  "joda": "Jude",
  "apokalypsy": "Apocalypse"
};

const oldTestamentBooks = [
  "Genèse","Exode","Lévitique","Nombres","Deutéronome","Josué","Juges","Ruth",
  "1 Samuel","2 Samuel","1 Rois","2 Rois","1 Chroniques","2 Chroniques","Esdras",
  "Néhémie","Esther","Job","Psaumes","Proverbes","Ecclésiaste","Cantique des Cantiques",
  "Ésaïe","Jérémie","Lamentations","Ézéchiel","Daniel","Osée","Joël","Amos",
  "Abdias","Jonas","Michée","Nahum","Habacuc","Sophonie","Aggée","Zacharie","Malachie"
];

const bible = { livres: [] };

// Lire tous les fichiers du dossier baiboly
const files = fs.readdirSync(BAIBOLY_DIR).filter(f => f.endsWith('.json'));

for (const file of files) {
  const baseName = path.basename(file, '.json');
  const frenchName = bookNameMap[baseName];
  if (!frenchName) {
    console.warn(`⚠️ Nom de livre inconnu pour ${file}, ignoré.`);
    continue;
  }

  const filePath = path.join(BAIBOLY_DIR, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  // content est de la forme { "1": { "1": "texte", "2": "texte" }, "2": {...} }

  const testament = oldTestamentBooks.includes(frenchName) ? 'ancien' : 'nouveau';
  const livre = {
    nom: frenchName,
    abrev: frenchName.substring(0, 3),
    testament,
    chapitres: []
  };

  // Parcours des chapitres
  for (const [chapNum, versesObj] of Object.entries(content)) {
    const versets = [];
    for (const [verseNum, text] of Object.entries(versesObj)) {
      versets.push({
        numero: parseInt(verseNum),
        texte: text
      });
    }
    // Trier les versets par numéro
    versets.sort((a, b) => a.numero - b.numero);
    livre.chapitres.push({
      numero: parseInt(chapNum),
      versets
    });
  }
  // Trier les chapitres par numéro
  livre.chapitres.sort((a, b) => a.numero - b.numero);
  bible.livres.push(livre);
}

// Trier les livres : Ancien Testament puis Nouveau, et alphabétiquement dans chaque testament
bible.livres.sort((a, b) => {
  if (a.testament === b.testament) return a.nom.localeCompare(b.nom);
  return a.testament === 'ancien' ? -1 : 1;
});

const outputPath = path.join(__dirname, 'assets', 'bible_mg.json');
fs.writeFileSync(outputPath, JSON.stringify(bible, null, 2), 'utf8');
console.log(`✅ Bible malgache fusionnée (${bible.livres.length} livres) → ${outputPath}`);
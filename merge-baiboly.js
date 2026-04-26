const fs = require('fs');
const path = require('path');

// Dossier contenant les fichiers JSON malgaches
const BAIBOLY_DIR = path.join(__dirname, 'baiboly');

// Table de correspondance nom du fichier → nom du livre en MALGACHE
const bookNameMgMap = {
  // Ancien Testament
  "genesisy": "Genesisy",
  "eksodosy": "Eksodosy",
  "levitikosy": "Levitikosy",
  "nomery": "Nomery",
  "deoteronomia": "Deoteronomia",
  "josoa": "Josoa",
  "mpitsara": "Mpitsara",
  "rota": "Rota",
  "samoela-voalohany": "1 Samoela",
  "samoela-faharoa": "2 Samoela",
  "mpanjaka-voalohany": "1 Mpanjaka",
  "mpanjaka-faharoa": "2 Mpanjaka",
  "tantara-voalohany": "1 Tantara",
  "tantara-faharoa": "2 Tantara",
  "ezra": "Ezra",
  "nehemia": "Nehemia",
  "estera": "Estera",
  "joba": "Joba",
  "salamo": "Salamo",
  "ohabolana": "Ohabolana",
  "mpitoriteny": "Mpitoriteny",
  "tononkirani-solomona": "Tononkiran'i Solomona",
  "isaia": "Isaia",
  "jeremia": "Jeremia",
  "fitomaniana": "Fitomaniana",
  "ezekiela": "Ezekiela",
  "daniela": "Daniela",
  "hosea": "Hosea",
  "joela": "Joela",
  "amosa": "Amosa",
  "obadia": "Obadia",
  "jona": "Jona",
  "mika": "Mika",
  "nahoma": "Nahoma",
  "habakoka": "Habakoka",
  "zefania": "Zefania",
  "hagay": "Hagay",
  "zakaria": "Zakaria",
  "malakia": "Malakia",
  // Nouveau Testament
  "matio": "Matio",
  "marka": "Marka",
  "lioka": "Lioka",
  "jaona": "Jaona",
  "asanny-apostoly": "Asan'ny Apostoly",
  "romanina": "Romana",
  "1-korintianina": "1 Korintiana",
  "2-korintianina": "2 Korintiana",
  "galatianina": "Galatiana",
  "efesianina": "Efesiana",
  "filipianina": "Filipiana",
  "kolosianina": "Kolosiana",
  "1-tesalonianina": "1 Tesaloniana",
  "2-tesalonianina": "2 Tesaloniana",
  "1-timoty": "1 Timoty",
  "2-timoty": "2 Timoty",
  "titosy": "Titosy",
  "filemona": "Filemona",
  "hebreo": "Hebreo",
  "jakoba": "Jakoba",
  "1-petera": "1 Petera",
  "2-petera": "2 Petera",
  "1-jaona": "1 Jaona",
  "2-jaona": "2 Jaona",
  "3-jaona": "3 Jaona",
  "joda": "Joda",
  "apokalypsy": "Apokalypsy"
};

// Liste des noms des livres de l'Ancien Testament (en malgache) pour déterminer testament
const oldTestamentNamesMg = [
  "Genesisy", "Eksodosy", "Levitikosy", "Nomery", "Deoteronomia", "Josoa", "Mpitsara",
  "Rota", "1 Samoela", "2 Samoela", "1 Mpanjaka", "2 Mpanjaka", "1 Tantara", "2 Tantara",
  "Ezra", "Nehemia", "Estera", "Joba", "Salamo", "Ohabolana", "Mpitoriteny",
  "Tononkiran'i Solomona", "Isaia", "Jeremia", "Fitomaniana", "Ezekiela", "Daniela",
  "Hosea", "Joela", "Amosa", "Obadia", "Jona", "Mika", "Nahoma", "Habakoka", "Zefania",
  "Hagay", "Zakaria", "Malakia"
];

const bible = { livres: [] };

const files = fs.readdirSync(BAIBOLY_DIR).filter(f => f.endsWith('.json'));

for (const file of files) {
  const baseName = path.basename(file, '.json');
  const mgName = bookNameMgMap[baseName];
  if (!mgName) {
    console.warn(` Nom de livre inconnu pour ${file}, ignoré.`);
    continue;
  }

  const filePath = path.join(BAIBOLY_DIR, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  // content est de la forme { "1": { "1": "texte", "2": "texte" }, "2": {...} }

  const testament = oldTestamentNamesMg.includes(mgName) ? 'ancien' : 'nouveau';
  const livre = {
    nom: mgName,
    abrev: mgName.substring(0, 3),
    testament,
    chapitres: []
  };

  for (const [chapNum, versesObj] of Object.entries(content)) {
    const versets = [];
    for (const [verseNum, text] of Object.entries(versesObj)) {
      versets.push({
        numero: parseInt(verseNum),
        texte: text
      });
    }
    versets.sort((a, b) => a.numero - b.numero);
    livre.chapitres.push({
      numero: parseInt(chapNum),
      versets
    });
  }
  livre.chapitres.sort((a, b) => a.numero - b.numero);
  bible.livres.push(livre);
}

// Trier les livres : Ancien Testament puis Nouveau, alphabétique dans chaque
bible.livres.sort((a, b) => {
  if (a.testament === b.testament) return a.nom.localeCompare(b.nom);
  return a.testament === 'ancien' ? -1 : 1;
});

const outputPath = path.join(__dirname, 'assets', 'bible_mg.json');
fs.writeFileSync(outputPath, JSON.stringify(bible, null, 2), 'utf8');
console.log(`Bible malgache fusionnée (${bible.livres.length} livres) → ${outputPath}`);
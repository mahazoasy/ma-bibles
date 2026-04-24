const fs = require('fs');

// Table de correspondance français -> malgache (66 livres)
const bookNamesMg = {
  "Genèse": "Genesisy",
  "Exode": "Eksodosy",
  "Lévitique": "Levitikosy",
  "Nombres": "Nomery",
  "Deutéronome": "Deoteronomia",
  "Josué": "Josoa",
  "Juges": "Mpitsara",
  "Ruth": "Rota",
  "1 Samuel": "1 Samoela",
  "2 Samuel": "2 Samoela",
  "1 Rois": "1 Mpanjaka",
  "2 Rois": "2 Mpanjaka",
  "1 Chroniques": "1 Tantara",
  "2 Chroniques": "2 Tantara",
  "Esdras": "Ezra",
  "Néhémie": "Nehemia",
  "Esther": "Estera",
  "Job": "Joba",
  "Psaumes": "Salamo",
  "Proverbes": "Ohabolana",
  "Ecclésiaste": "Mpitoriteny",
  "Cantique des Cantiques": "tononkiran'i Solomona",
  "Ésaïe": "Isaia",
  "Jérémie": "Jeremia",
  "Lamentations": "Fitomaniana",
  "Ézéchiel": "Ezekiela",
  "Daniel": "Daniela",
  "Osée": "Hosea",
  "Joël": "Joela",
  "Amos": "Amosa",
  "Abdias": "Obadia",
  "Jonas": "Jona",
  "Michée": "Mika",
  "Nahum": "Nahoma",
  "Habacuc": "Habakoka",
  "Sophonie": "Zefania",
  "Aggée": "Hagay",
  "Zacharie": "Zakaria",
  "Malachie": "Malakia",
  "Matthieu": "Matio",
  "Marc": "Marka",
  "Luc": "Lioka",
  "Jean": "Jaona",
  "Actes": "Asan'ny Apostoly",
  "Romains": "Romana",
  "1 Corinthiens": "1 Korintiana",
  "2 Corinthiens": "2 Korintiana",
  "Galates": "Galatiana",
  "Éphésiens": "Efesiana",
  "Philippiens": "Filipiana",
  "Colossiens": "Kolosiana",
  "1 Thessaloniciens": "1 Tesaloniana",
  "2 Thessaloniciens": "2 Tesaloniana",
  "1 Timothée": "1 Timoty",
  "2 Timothée": "2 Timoty",
  "Tite": "Titosy",
  "Philémon": "Filemona",
  "Hébreux": "Hebreo",
  "Jacques": "Jakoba",
  "1 Pierre": "1 Petera",
  "2 Pierre": "2 Petera",
  "1 Jean": "1 Jaona",
  "2 Jean": "2 Jaona",
  "3 Jean": "3 Jaona",
  "Jude": "Joda",
  "Apocalypse": "Apokalypsy"
};

// Charger la Bible française corrigée
const bibleFr = JSON.parse(fs.readFileSync('assets/bible_fr.json', 'utf8'));

// Créer une copie avec les noms traduits (versets non modifiés)
const bibleMg = { livres: [] };
for (const book of bibleFr.livres) {
  const mgName = bookNamesMg[book.nom] || book.nom;
  bibleMg.livres.push({
    ...book,
    nom: mgName,
    abrev: mgName.substring(0, 3)
  });
}

fs.writeFileSync('assets/bible_mg.json', JSON.stringify(bibleMg, null, 2));
console.log(' bible_mg.json généré avec noms de livres malgaches');
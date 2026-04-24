const fs = require('fs');

function fixVerses(bible) {
  for (const book of bible.livres) {
    for (const chapter of book.chapitres) {
      chapter.versets = chapter.versets.map((verse, index) => ({
        ...verse,
        numero: index + 1
      }));
    }
  }
  return bible;
}

// Corriger bible_fr.json
const bibleFr = JSON.parse(fs.readFileSync('assets/bible_fr.json', 'utf8'));
const fixedFr = fixVerses(bibleFr);
fs.writeFileSync('assets/bible_fr.json', JSON.stringify(fixedFr, null, 2));
console.log('bible_fr.json corrigé');

// Corriger bible_mg.json (s'il existe)
if (fs.existsSync('assets/bible_mg.json')) {
  const bibleMg = JSON.parse(fs.readFileSync('assets/bible_mg.json', 'utf8'));
  const fixedMg = fixVerses(bibleMg);
  fs.writeFileSync('assets/bible_mg.json', JSON.stringify(fixedMg, null, 2));
  console.log('bible_mg.json corrigé');
}
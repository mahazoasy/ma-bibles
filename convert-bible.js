const fs = require('fs');
const path = require('path');

function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) return content.slice(1);
  return content;
}

const sourcePath = path.join(__dirname, 'French Louis Segond (1910).json');
let content = fs.readFileSync(sourcePath, 'utf8');
content = stripBOM(content);

let raw;
try {
  raw = eval('(' + content + ')');
} catch (err) {
  console.error('Erreur de parsing:', err);
  process.exit(1);
}

const bible = { livres: [] };

if (!raw.Testaments) {
  console.error('Structure invalide : pas de Testaments');
  process.exit(1);
}

for (const testament of raw.Testaments) {
  const testamentType = testament.Text === 'Ancien Testament' ? 'ancien' : 'nouveau';
  if (!testament.Books) continue;

  for (const book of testament.Books) {
    let bookName = book.Text;
    if (!bookName) continue;

    const livre = {
      nom: bookName,
      abrev: bookName.substring(0, 3),
      testament: testamentType,
      chapitres: []
    };

    if (book.Chapters && Array.isArray(book.Chapters)) {
      for (const chapter of book.Chapters) {
        const chapterNum = chapter.ID;
        if (!chapterNum) continue;

        const versets = [];
        if (chapter.Verses && Array.isArray(chapter.Verses)) {
          for (const verse of chapter.Verses) {
            const verseNum = verse.ID;
            const verseText = verse.Text;
            if (verseNum && verseText) {
              versets.push({ numero: verseNum, texte: verseText });
            }
          }
        }
        if (versets.length > 0) {
          livre.chapitres.push({ numero: chapterNum, versets });
        } else {
          console.warn(`⚠️ Chapitre ${chapterNum} du livre ${bookName} sans versets valides`);
        }
      }
    } else {
      console.warn(`⚠️ Livre ${bookName} sans chapitres`);
    }

    if (livre.chapitres.length > 0) {
      bible.livres.push(livre);
    } else {
      console.warn(`⚠️ Aucun chapitre valide pour le livre : ${bookName}`);
    }
  }
}

// Trier : Ancien Testament puis Nouveau Testament
bible.livres.sort((a, b) => {
  if (a.testament === b.testament) return a.nom.localeCompare(b.nom);
  return a.testament === 'ancien' ? -1 : 1;
});

const outputPath = path.join(__dirname, 'assets', 'bible_fr.json');
fs.writeFileSync(outputPath, JSON.stringify(bible, null, 2));
console.log(`✅ Bible française convertie (${bible.livres.length} livres) → ${outputPath}`);
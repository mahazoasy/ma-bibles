const fs = require('fs');
const path = require('path');

// Supprimer BOM
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) return content.slice(1);
  return content;
}

// Charger fichier source
const sourcePath = path.join(__dirname, 'French Louis Segond (1910).json');

let content = fs.readFileSync(sourcePath, 'utf8');
content = stripBOM(content);

let raw;
try {
  raw = new Function('return ' + content)();
} catch (err) {
  console.error('Erreur de parsing:', err.message);
  process.exit(1);
}

const bible = { livres: [] };

// Vérification structure
if (!raw.Testaments) {
  console.error('Structure invalide : pas de Testaments');
  process.exit(1);
}

// Parcours Testaments
for (const testament of raw.Testaments) {
  const testamentType =
    testament.Text === 'Ancien Testament' ? 'ancien' : 'nouveau';

  if (!testament.Books) continue;

  // Parcours Livres
  for (const book of testament.Books) {
    const bookName = book.Text;
    if (!bookName) continue;

    const livre = {
      nom: bookName,
      abrev: bookName.substring(0, 3),
      testament: testamentType,
      chapitres: []
    };

    let chapters = [];

    //  CAS 1 : format normal
    if (book.Chapters && Array.isArray(book.Chapters)) {
      chapters = book.Chapters;
    } else {
      // CAS 2 : livres à 1 chapitre 
      const directVerses = Object.entries(book).filter(
        ([k, v]) => !isNaN(parseInt(k)) && typeof v === 'string'
      );

      if (directVerses.length > 0) {
        chapters.push({
          ID: 1,
          Verses: directVerses.map(([k, v]) => ({
            ID: parseInt(k),
            Text: v
          }))
        });
      } else {
        // CAS 3 : fallback structures
        for (const key of Object.keys(book)) {
          if (key === 'Text' || key === 'ID') continue;

          const potential = book[key];

          if (potential && typeof potential === 'object') {
            if (potential.ID !== undefined || potential.Verses) {
              chapters.push(potential);
            }
          }
        }
      }
    }

    if (chapters.length === 0) {
      console.warn(`Aucun chapitre trouvé pour : ${bookName}`);
      continue;
    }

    // Parcours chapitres
    for (const chapter of chapters) {
      const chapterNum = chapter.ID || chapter.id || 1;

      let versets = [];

      // format standard
      if (chapter.Verses && Array.isArray(chapter.Verses)) {
        versets = chapter.Verses
          .map(verse => ({
            numero: verse.ID || verse.id,
            texte: verse.Text || verse.text
          }))
          .filter(v => v.numero && v.texte);
      }

      // format alternatif
      else {
        for (const [k, v] of Object.entries(chapter)) {
          if (!isNaN(parseInt(k)) && typeof v === 'string') {
            versets.push({
              numero: parseInt(k),
              texte: v
            });
          }
        }
      }

      if (versets.length > 0) {
        livre.chapitres.push({
          numero: chapterNum,
          versets
        });
      } else {
        console.warn(`Chapitre ${chapterNum} vide pour : ${bookName}`);
      }
    }

    if (livre.chapitres.length > 0) {
      bible.livres.push(livre);
    } else {
      console.warn(`Aucun chapitre valide pour : ${bookName}`);
    }
  }
}

// Tri 
bible.livres.sort((a, b) => {
  if (a.testament === b.testament) {
    return a.nom.localeCompare(b.nom);
  }
  return a.testament === 'ancien' ? -1 : 1;
});

// Créer dossier assets si absent
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Sauvegarde
const outputPath = path.join(assetsDir, 'bible_fr.json');
fs.writeFileSync(outputPath, JSON.stringify(bible, null, 2), 'utf8');

console.log(
  `Bible française convertie (${bible.livres.length} livres) → ${outputPath}`
);
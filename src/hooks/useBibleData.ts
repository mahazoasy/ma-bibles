import { useContext } from 'react';
import { BibleContext } from '../../src/context/BibleContext';
import { Book, Chapter } from '../../src/types';

export function useBibleData() {
  const { bible, isLoading } = useContext(BibleContext);

  // Permet de trouver un livre par son nom ou son abréviation
  const getBook = (bookId: string): Book | undefined => {
    return bible?.livres.find(b => b.abrev === bookId || b.nom === bookId);
  };

  const getChapter = (bookId: string, chapterNumber: number): Chapter | undefined => {
    const book = getBook(bookId);
    return book?.chapitres.find(c => c.numero === chapterNumber);
  };

  const getTotalChapters = () => {
    if (!bible) return 0;
    let total = 0;
    for (const book of bible.livres) {
      total += book.chapitres.length;
    }
    return total;
  };

  const searchBible = (query: string): Array<{ book: string; chapter: number; verse: number; text: string; reference: string }> => {
    if (!bible || query.trim().length === 0) return [];
    const lowerQuery = query.toLowerCase();
    const results: any[] = [];

    for (const book of bible.livres) {
      for (const chapter of book.chapitres) {
        for (const verse of chapter.versets) {
          if (verse.texte && typeof verse.texte === 'string' && verse.texte.toLowerCase().includes(lowerQuery)) {
            results.push({
              book: book.nom,
              chapter: chapter.numero,
              verse: verse.numero,
              text: verse.texte,
              reference: `${book.nom} ${chapter.numero}:${verse.numero}`,
            });
          }
        }
      }
    }
    return results;
  };

  const getMaxChapter = (bookId: string): number => {
    const book = getBook(bookId);
    return book ? book.chapitres.length : 0;
  };

  return {
    bible,
    isLoading,
    getBook,
    getChapter,
    searchBible,
    getMaxChapter,
    totalChapters: getTotalChapters(),
  };
}
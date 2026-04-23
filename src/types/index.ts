export interface Verse {
  numero: number;
  texte: string;
}

export interface Chapter {
  numero: number;
  versets: Verse[];
}

export interface Book {
  nom: string;
  abrev: string;
  testament: 'ancien' | 'nouveau';
  chapitres: Chapter[];
}

export interface BibleData {
  livres: Book[];
}

export interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  addedAt: number;
  category?: string;
}

export interface LastPosition {
  bookName: string;
  bookId: string;
  chapterId: number;
  timestamp: number;
}

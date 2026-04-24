import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const READING_HISTORY_KEY = '@bible:reading_history';

export interface ReadingHistory {
  [chapterKey: string]: number; // key: "bookId_chapterId" -> timestamp
}

export function useReadingHistory() {
  const [history, setHistory] = useState<ReadingHistory>({});
  const [daysRead, setDaysRead] = useState(0);
  const [totalChaptersRead, setTotalChaptersRead] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(READING_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
        // Calculer le nombre de jours distincts (timestamp en ms -> jour)
        const days = new Set(Object.values(parsed).map(ts => new Date(ts).toDateString())).size;
        setDaysRead(days);
        setTotalChaptersRead(Object.keys(parsed).length);
        // Pour la progression, il faudrait le total des chapitres de la Bible
        // On peut le calculer une fois (environ 1189 chapitres). On le passera depuis un contexte ou une constante.
      }
    } catch (error) {
      console.error('Erreur chargement historique', error);
    } finally {
      setLoading(false);
    }
  };

  const markChapterAsRead = async (bookId: string, chapterId: number) => {
    const key = `${bookId}_${chapterId}`;
    if (!history[key]) {
      const newHistory = { ...history, [key]: Date.now() };
      setHistory(newHistory);
      await AsyncStorage.setItem(READING_HISTORY_KEY, JSON.stringify(newHistory));
      // Mettre à jour les stats
      setDaysRead(new Set(Object.values(newHistory).map(ts => new Date(ts).toDateString())).size);
      setTotalChaptersRead(Object.keys(newHistory).length);
    }
  };

  const getTotalChaptersInBible = (totalChapters: number) => {
    // À appeler depuis useBibleData pour obtenir le nombre total de chapitres
  };

  return { history, daysRead, totalChaptersRead, progressPercent, loading, markChapterAsRead };
}
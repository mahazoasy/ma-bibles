import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const READING_HISTORY_KEY = '@bible:reading_history';

export interface ReadingHistory {
  [chapterKey: string]: number; // clé "bookId_chapterId" -> timestamp
}

export function useReadingHistory(totalChaptersInBible: number = 1189) {
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
        const chaptersCount = Object.keys(parsed).length;
        setTotalChaptersRead(chaptersCount);
        // nombre de jours distincts
        const days = new Set(Object.values(parsed).map(ts => new Date(ts).toDateString())).size;
        setDaysRead(days);
        const percent = totalChaptersInBible > 0 ? (chaptersCount / totalChaptersInBible) * 100 : 0;
        setProgressPercent(Math.min(100, Math.round(percent)));
      }
    } catch (error) {
      console.error('Erreur chargement historique', error);
    } finally {
      setLoading(false);
    }
  };

  const saveHistory = async (newHistory: ReadingHistory) => {
    try {
      await AsyncStorage.setItem(READING_HISTORY_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
      const chaptersCount = Object.keys(newHistory).length;
      setTotalChaptersRead(chaptersCount);
      const days = new Set(Object.values(newHistory).map(ts => new Date(ts).toDateString())).size;
      setDaysRead(days);
      const percent = totalChaptersInBible > 0 ? (chaptersCount / totalChaptersInBible) * 100 : 0;
      setProgressPercent(Math.min(100, Math.round(percent)));
    } catch (error) {
      console.error('Erreur sauvegarde historique', error);
    }
  };

  const markChapterAsRead = async (bookId: string, chapterId: number) => {
    const key = `${bookId}_${chapterId}`;
    if (!history[key]) {
      const newHistory = { ...history, [key]: Date.now() };
      await saveHistory(newHistory);
    }
  };

  const isChapterRead = (bookId: string, chapterId: number): boolean => {
    return !!history[`${bookId}_${chapterId}`];
  };

  return {
    history,
    daysRead,
    totalChaptersRead,
    progressPercent,
    loading,
    markChapterAsRead,
    isChapterRead,
  };
}
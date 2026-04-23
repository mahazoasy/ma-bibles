import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LastPosition {
  bookId: string;
  bookName: string;
  chapterId: number;
  timestamp: number;
}

const LAST_POSITION_KEY = '@bible:last_position';

export function useLastPosition() {
  const [lastPosition, setLastPosition] = useState<LastPosition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLastPosition();
  }, []);

  const loadLastPosition = async () => {
    try {
      const stored = await AsyncStorage.getItem(LAST_POSITION_KEY);
      if (stored) setLastPosition(JSON.parse(stored));
    } catch (error) {
      console.error('Erreur chargement dernière position', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLastPosition = async (bookId: string, bookName: string, chapterId: number) => {
    const position: LastPosition = {
      bookId,
      bookName,
      chapterId,
      timestamp: Date.now(),
    };
    try {
      await AsyncStorage.setItem(LAST_POSITION_KEY, JSON.stringify(position));
      setLastPosition(position);
    } catch (error) {
      console.error('Erreur sauvegarde dernière position', error);
    }
  };

  return { lastPosition, isLoading, saveLastPosition };
}
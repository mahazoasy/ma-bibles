import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LastPosition } from '../../src/types';

const STORAGE_KEY = '@bible:last_position';

export function useLastPosition() {
  const [lastPosition, setLastPosition] = useState<LastPosition | null>(null);

  useEffect(() => {
    loadPosition();
  }, []);

  const loadPosition = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLastPosition(JSON.parse(stored));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const savePosition = async (bookName: string, chapterId: number) => {
    const newPos: LastPosition = {
      bookName,
      bookId: bookName,
      chapterId,
      timestamp: Date.now(),
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPos));
      setLastPosition(newPos);
    } catch (error) {
      console.error(error);
    }
  };

  const clearLastPosition = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setLastPosition(null);
  };

  return { lastPosition, savePosition, clearLastPosition };
}

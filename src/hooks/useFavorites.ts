import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bookmark } from '../../src/types';

const STORAGE_KEY = '@bible:bookmarks';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setFavorites(parsed);
        else setFavorites([]);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Erreur chargement favoris', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const saveFavorites = async (newFavorites: Bookmark[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const addFavorite = async (bookmark: Bookmark): Promise<boolean> => {
    const exists = favorites.some(f => f.id === bookmark.id);
    if (!exists) {
      await saveFavorites([...favorites, bookmark]);
      return true;
    }
    return false;
  };

  const removeFavorite = async (idOrRef: string) => {
    const newFavs = favorites.filter(f => f.id !== idOrRef);
    await saveFavorites(newFavs);
  };

  const isFavorite = (verseRef: string): boolean => {
    return favorites.some(f => f.id === verseRef);
  };

  const reloadFavorites = () => {
    loadFavorites();
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    reloadFavorites,
  };
}
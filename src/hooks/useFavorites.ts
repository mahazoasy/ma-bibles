import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bookmark } from '../../src/types';

const STORAGE_KEY = '@bible:bookmarks';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }
    } catch (error) {
      console.error('Erreur chargement favoris', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: Bookmark[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Erreur sauvegarde favoris', error);
    }
  };

  // Accepte un objet Bookmark complet
  const addFavorite = (bookmark: Bookmark) => {
    const exists = favorites.some(f => f.id === bookmark.id);
    if (!exists) {
      saveFavorites([...favorites, bookmark]);
    }
  };

  const removeFavorite = (idOrRef: string) => {
    saveFavorites(favorites.filter(f => f.id !== idOrRef));
  };

  const isFavorite = (verseRef: string): boolean => {
    return favorites.some(f => f.id === verseRef);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
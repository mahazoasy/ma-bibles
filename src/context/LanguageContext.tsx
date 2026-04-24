import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'fr' | 'mg';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traductions complètes
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Onglets
    "home": "Accueil",
    "read": "Lire",
    "search": "Rechercher",
    "favorites": "Favoris",
    // Accueil
    "verse_of_day": "📖 Verset du jour",
    "resume_reading": "📌 Reprendre la lecture",
    "resume_hint": "Appuyez pour continuer",
    "old_testament": "Ancien Testament",
    "new_testament": "Nouveau Testament",
    "statistics": "📊 Statistiques",
    "favorites_count": "Favoris",
    "books_count": "Livres",
    "offline": "Sans connexion",
    "quick_access": "Accès rapide",
    "reading_days": "Jours lus",
    "progress": "Progression",
    // Lecture
    "chapter": "Chapitre",
    "previous": "Précédent",
    "next": "Suivant",
    "add_favorite": "Ajouter aux favoris",
    "remove_favorite": "Retirer des favoris",
    // Recherche
    "search_placeholder": "Rechercher un mot ou une expression...",
    "no_results": "Aucun résultat",
    "filter_all": "Tous",
    "filter_old": "Ancien",
    "filter_new": "Nouveau",
    // Favoris
    "no_favorites": "Aucun favori",
    "add_favorite_hint": "Appuyez longuement sur un verset dans la lecture pour l’ajouter",
    "remove_confirm": "Supprimer ce favori ?",
    "cancel": "Annuler",
    "remove": "Supprimer",
    "added_on": "Ajouté le",
    "all": "Tous",
    "recent": "Récents",
    "categories": "Catégories",
    // Général
    "loading": "Chargement...",
    "error": "Erreur",
    "info": "Information",
    "already_favorite": "Déjà dans les favoris",
    "favorite_added": "Verset ajouté aux favoris",
    "success": "Succès"
  },
  mg: {
    "home": "Fandraisana",
    "read": "Hamaky",
    "search": "Hikaroka",
    "favorites": "Tiany",
    "verse_of_day": "📖 Andininy androany",
    "resume_reading": "📌 Hanohy famakiana",
    "resume_hint": "Tsindrio hanohy",
    "old_testament": "Fanekena Taloha",
    "new_testament": "Fanekena Vaovao",
    "statistics": "📊 Statistika",
    "favorites_count": "Tiany",
    "books_count": "Boky",
    "offline": "Tsy mila tambajotra",
    "quick_access": "Fidirana haingana",
    "reading_days": "Andro namakiana",
    "progress": "Fandrosoana",
    "chapter": "Toko",
    "previous": "Teo aloha",
    "next": "Manaraka",
    "add_favorite": "Ampiana ho tiany",
    "remove_favorite": "Esorina amin’ny tiany",
    "search_placeholder": "Hikaroka teny...",
    "no_results": "Tsy misy valiny",
    "filter_all": "Rehetra",
    "filter_old": "Taloha",
    "filter_new": "Vaovao",
    "no_favorites": "Mbola tsy misy tiany",
    "add_favorite_hint": "Tsindrio ela ny andininy raha te-hametraka ho tiany",
    "remove_confirm": "Hesorina ve izany tiany ?",
    "cancel": "Aoka",
    "remove": "Esory",
    "added_on": "Nampiana tamin'ny",
    "all": "Rehetra",
    "recent": "Vao haingana",
    "categories": "Sokajy",
    "loading": "Entim-bary...",
    "error": "Hadisoana",
    "info": "Fampahalalana",
    "already_favorite": "Efa tao amin’ny tiany",
    "favorite_added": "Andininy nampiana ho tiany",
    "success": "Vita"
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const loadLanguage = async () => {
      const saved = await AsyncStorage.getItem('app_language');
      if (saved === 'fr' || saved === 'mg') setLanguage(saved);
    };
    loadLanguage();
  }, []);

  const handleSetLanguage = async (lang: Language) => {
    setLanguage(lang);
    await AsyncStorage.setItem('app_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
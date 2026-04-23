import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { BibleData } from '../../src/types';
import { useLanguage } from './LanguageContext';
import bibleFr from '../../assets/bible_fr.json';
import bibleMg from '../../assets/bible_mg.json';

interface BibleContextType {
  bible: BibleData | null;
  isLoading: boolean;
}

export const BibleContext = createContext<BibleContextType>({
  bible: null,
  isLoading: true,
});

export function BibleProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [bible, setBible] = useState<BibleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const bibleData = language === 'fr' ? (bibleFr as BibleData) : (bibleMg as BibleData);
      setBible(bibleData);
    } catch (error) {
      console.error('Erreur chargement bible', error);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  return (
    <BibleContext.Provider value={{ bible, isLoading }}>
      {children}
    </BibleContext.Provider>
  );
}
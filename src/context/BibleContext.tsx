import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { BibleData } from '../../src/types';
import bibleJson from '../../assets/bible.json';

interface BibleContextType {
  bible: BibleData | null;
  isLoading: boolean;
}

export const BibleContext = createContext<BibleContextType>({
  bible: null,
  isLoading: true,
});

export function BibleProvider({ children }: { children: ReactNode }) {
  const [bible, setBible] = useState<BibleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setBible(bibleJson as BibleData);
    } catch (error) {
      console.error('Erreur chargement bible.json', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <BibleContext.Provider value={{ bible, isLoading }}>
      {children}
    </BibleContext.Provider>
  );
}

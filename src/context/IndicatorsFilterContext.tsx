/**
 * IndicatorsFilterContext - Context to share category filter between drawer and screen
 * Also handles quotes categories
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface IndicatorsFilterContextType {
  // Indicators
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  currentCategory: string | null;
  setCurrentCategory: (category: string | null) => void;
  // Quotes
  selectedQuoteCategory: string | null;
  setSelectedQuoteCategory: (category: string | null) => void;
  currentQuoteCategory: string | null;
  setCurrentQuoteCategory: (category: string | null) => void;
}

const IndicatorsFilterContext = createContext<IndicatorsFilterContextType | undefined>(undefined);

export const IndicatorsFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [selectedQuoteCategory, setSelectedQuoteCategory] = useState<string | null>(null);
  const [currentQuoteCategory, setCurrentQuoteCategory] = useState<string | null>(null);

  return (
    <IndicatorsFilterContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        currentCategory,
        setCurrentCategory,
        selectedQuoteCategory,
        setSelectedQuoteCategory,
        currentQuoteCategory,
        setCurrentQuoteCategory,
      }}>
      {children}
    </IndicatorsFilterContext.Provider>
  );
};

export const useIndicatorsFilter = (): IndicatorsFilterContextType => {
  const context = useContext(IndicatorsFilterContext);
  if (!context) {
    throw new Error('useIndicatorsFilter must be used within IndicatorsFilterProvider');
  }
  return context;
};


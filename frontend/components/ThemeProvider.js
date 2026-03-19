'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ dark: true, toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // Persist preference
    const saved = localStorage.getItem('theme');
    if (saved) setDark(saved === 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme: () => setDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

'use client';

import { useEffect, useState } from 'react';
import { makeCookieStorageAdapter } from '@/main/factories/storage';

const applyTheme = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const storage = makeCookieStorageAdapter();

  // Initialize theme from storage or system preference
  useEffect(() => {
    setIsMounted(true);
    const initializeTheme = async () => {
      try {
        const savedTheme = (await storage.get('theme')) as string | null;

        if (savedTheme) {
          const isDark = savedTheme === 'dark';
          setIsDarkMode(isDark);
          applyTheme(isDark);
        } else {
          // Fallback to system preference
          const systemPrefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches;
          setIsDarkMode(systemPrefersDark);
          applyTheme(systemPrefersDark);
        }
      } catch (error) {
        console.error('Error initializing theme:', error);
        // Fallback to system preference on error
        const systemPrefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        setIsDarkMode(systemPrefersDark);
        applyTheme(systemPrefersDark);
      }
    };

    initializeTheme();
  }, [storage]);

  const toggleTheme = async () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    applyTheme(newIsDarkMode);

    // Persist theme preference
    try {
      await storage.set('theme', newIsDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return {
    isDarkMode,
    isMounted,
    toggleTheme,
  };
};

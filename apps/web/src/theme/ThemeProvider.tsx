import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeId, applyTheme, initTheme, PRESETS } from './theme';

interface ThemeCtx {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => initTheme());

  const setTheme = (id: ThemeId) => {
    applyTheme(id);
    setThemeState(id);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme harus dipakai di dalam ThemeProvider');
  return v;
}

export { PRESETS };

export type ThemeId = 'heritage-light' | 'midnight-heritage' | 'royal-blue' | 'teal-ocean';

export interface ThemePreset {
  id: ThemeId;
  name: string;
  label: string;
  description: string;
}

export const PRESETS: ThemePreset[] = [
  {
    id: 'heritage-light',
    name: 'Heritage Light',
    label: 'Krem + Emas · Terang',
    description: 'Default Editorial Luxe — elegan, ramah mata untuk kerja harian.',
  },
  {
    id: 'midnight-heritage',
    name: 'Midnight Heritage',
    label: 'Navy + Emas · Gelap',
    description: 'Kesan bank privat, mewah, cocok ruangan redup.',
  },
  {
    id: 'royal-blue',
    name: 'Classic Royal Blue',
    label: 'Biru Korporat',
    description: 'Tampilan biru tua klasik, familiar bagi pengguna lama.',
  },
  {
    id: 'teal-ocean',
    name: 'Teal Ocean',
    label: 'Teal Fintech',
    description: 'Modern marine, segar, untuk koperasi digital.',
  },
];

export const DEFAULT_THEME: ThemeId = 'heritage-light';
const STORAGE_KEY = 'theme_preset';

export function getStoredTheme(): ThemeId {
  const v = localStorage.getItem(STORAGE_KEY);
  return (PRESETS.find((p) => p.id === v)?.id ?? DEFAULT_THEME) as ThemeId;
}

export function applyTheme(id: ThemeId): void {
  if (!PRESETS.some((p) => p.id === id)) return;
  document.documentElement.setAttribute('data-theme', id);
  localStorage.setItem(STORAGE_KEY, id);
}

export function initTheme(): ThemeId {
  const id = getStoredTheme();
  applyTheme(id);
  return id;
}

import { describe, it, expect, beforeEach } from 'vitest';
import { applyTheme, getStoredTheme, DEFAULT_THEME, PRESETS } from './theme';

describe('theme module', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('applyTheme menaruh atribut data-theme & simpan ke localStorage', () => {
    applyTheme('midnight-heritage');
    expect(document.documentElement.getAttribute('data-theme')).toBe('midnight-heritage');
    expect(localStorage.getItem('theme_preset')).toBe('midnight-heritage');
  });

  it('applyTheme mengabaikan id tidak valid', () => {
    applyTheme('heritage-light');
    // @ts-expect-error pengujian nilai ilegal
    applyTheme('tema-goib');
    expect(document.documentElement.getAttribute('data-theme')).toBe('heritage-light');
  });

  it('getStoredTheme fallback ke default bila kosong', () => {
    expect(getStoredTheme()).toBe(DEFAULT_THEME);
  });

  it('getStoredTheme membaca nilai tersimpan', () => {
    localStorage.setItem('theme_preset', 'teal-ocean');
    expect(getStoredTheme()).toBe('teal-ocean');
  });

  it('daftar preset memiliki 4 entri valid', () => {
    expect(PRESETS).toHaveLength(4);
  });
});

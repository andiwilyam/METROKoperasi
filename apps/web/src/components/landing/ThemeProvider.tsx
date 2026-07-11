import React from 'react';
import type { LandingSettings } from '../../types';

export default function ThemeProvider({ settings, children }: { settings: LandingSettings | any; children: React.ReactNode }) {
  const primary = settings?.primaryColor || '#2563eb';
  const secondary = settings?.secondaryColor || '#d97706';
  return (
    <div style={{ '--ve-primary': primary, '--ve-secondary': secondary } as React.CSSProperties}>
      {children}
    </div>
  );
}

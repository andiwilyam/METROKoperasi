/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Palette, Check, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { PRESETS, ThemeId } from '../../theme/theme';

interface AdminTemaProps {
  currentTheme: string;
  onSelectThemePreset: (id: ThemeId) => void;
}

export default function AdminTema({ currentTheme, onSelectThemePreset }: AdminTemaProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="mc-card p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl mc-badge-accent flex items-center justify-center mc-icon-accent">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold mc-ink-strong flex items-center gap-2">
            Kustomisasi Tema &amp; Identitas Visual Koperasi
          </h2>
          <p className="text-[11px] mc-muted mt-0.5 leading-relaxed">
            Pilih salah satu preset tema visual di bawah untuk merubah seluruh skema warna tombol, badge, sorotan, serta portal anggota secara real-time.
          </p>
        </div>
      </div>

      {/* Grid of Themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PRESETS.map((preset) => {
          const isActive = currentTheme === preset.id;
          return (
            <div
              key={preset.id}
              className={`mc-card flex flex-col justify-between transition-transform duration-300 ${
                isActive ? 'ring-2' : 'hover:shadow-md'
              }`}
              style={isActive ? { boxShadow: '0 0 0 2px var(--mc-accent)' } : undefined}
            >
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold mc-muted tracking-wider">
                      {preset.label}
                    </span>
                    {preset.id === 'heritage-light' && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] mc-badge-ok font-extrabold flex items-center gap-1">
                        <HeartHandshake className="w-2.5 h-2.5" /> Coop Recommended
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold mc-ink-strong flex items-center gap-1.5">
                    {preset.name}
                  </h3>
                </div>
                <p className="text-[11px] mc-muted leading-relaxed font-normal">
                  {preset.description}
                </p>
              </div>

              <div className="p-4 mc-surface-2 mc-border border-t flex items-center justify-between">
                <span className="text-[10px] mc-muted font-mono font-bold uppercase">
                  ID: {preset.id}
                </span>

                {isActive ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold mc-icon-accent mc-badge-accent px-3 py-1.5 rounded-lg">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Aktif Digunakan
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectThemePreset(preset.id)}
                    aria-label={`Terapkan tema ${preset.name}`}
                    className="mc-btn-primary px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm transition cursor-pointer"
                  >
                    Terapkan Tema
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info warning */}
      <div className="p-4 mc-surface-2 mc-border rounded-xl flex gap-3 text-xs leading-normal">
        <ShieldCheck className="w-5 h-5 mc-icon-accent flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold mc-ink-strong">Hak Akses Super Administrator</p>
          <p className="mc-muted font-normal">
            Pengaturan tema tampilan ini hanya dapat diakses oleh Administrator &amp; Pengurus Pusat Koperasi. Anggota biasa akan langsung melihat perubahan tema visual ini secara serentak di dashboard mereka demi menjaga keselarasan identitas merk Koperasi MetroCOOP.
          </p>
        </div>
      </div>
    </div>
  );
}

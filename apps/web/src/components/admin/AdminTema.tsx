/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Palette, Check, Sparkles, ShieldAlert, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  bgPalette: string[];
  textColor: string;
  isConventionalRecommended?: boolean;
}

interface AdminTemaProps {
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'royal_blue',
    name: 'Classic Royal Blue',
    tagline: 'Metro Blue Corporate',
    description: 'Tampilan default professional biru tua dan abu-abu yang melambangkan kestabilan institusi keuangan, kepercayaan, dan kejelasan administrasi.',
    primaryColor: '#2563eb', // blue-600
    accentColor: '#d97706', // amber-600
    bgPalette: ['bg-blue-600', 'bg-blue-100', 'bg-slate-900', 'bg-slate-50'],
    textColor: 'text-blue-600'
  },
  {
    id: 'emerald_classic',
    name: 'Emerald Classic',
    tagline: 'Green Mint & Balance',
    description: 'Tema bernuansa hijau emerald dan mint yang melambangkan pertumbuhan ekonomi, kesuburan, ketenteraman, dan harmoni anggota.',
    primaryColor: '#16a34a', // emerald-600
    accentColor: '#ca8a04', // gold-600
    bgPalette: ['bg-emerald-600', 'bg-emerald-100', 'bg-emerald-900', 'bg-green-50'],
    textColor: 'text-emerald-600',
    isConventionalRecommended: true
  },
  {
    id: 'gold_wealth',
    name: 'Warm Amber',
    tagline: 'Gold Wealth & Prosperity',
    description: 'Kombinasi warna emas, amber hangat, dan tembaga perunggu yang melambangkan kemakmuran, investasi logam mulia, dan pelayanan yang ramah serta bersahabat.',
    primaryColor: '#d97706', // amber-600
    accentColor: '#b45309', // bronze-700
    bgPalette: ['bg-amber-600', 'bg-amber-100', 'bg-amber-950', 'bg-amber-50'],
    textColor: 'text-amber-600'
  },
  {
    id: 'teal_ocean',
    name: 'Teal Ocean',
    tagline: 'Modern Marine Fintech',
    description: 'Tampilan modern futuristik dengan perpaduan warna deep teal samudera dan cyan neon yang segar. Cocok untuk koperasi modern yang mengadopsi efisiensi teknologi digital terkini.',
    primaryColor: '#0d9488', // teal-600
    accentColor: '#0891b2', // cyan-600
    bgPalette: ['bg-teal-600', 'bg-teal-100', 'bg-teal-950', 'bg-cyan-50'],
    textColor: 'text-teal-600'
  },
  {
    id: 'charcoal_minimalist',
    name: 'Charcoal Minimalist',
    tagline: 'Stealth Slate Elegance',
    description: 'Desain monokromatik hitam arang, zinc abu-abu, dan putih bersih yang sangat elegan dan minimalis. Memancarkan estetika premium, fokus fungsional yang tinggi, dan profesionalisme mutlak.',
    primaryColor: '#27272a', // zinc-800
    accentColor: '#475569', // slate-600
    bgPalette: ['bg-zinc-800', 'bg-zinc-200', 'bg-zinc-950', 'bg-zinc-50'],
    textColor: 'text-zinc-800'
  }
];

export default function AdminTema({ currentTheme, onSelectTheme }: AdminTemaProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              Kustomisasi Tema &amp; Identitas Visual Koperasi
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Pilih salah satu dari 5 preset tema visual premium di bawah untuk merubah seluruh skema warna tombol, badge, sorotan, serta portal anggota secara real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {THEME_PRESETS.map((preset) => {
          const isActive = currentTheme === preset.id;
          return (
            <div
              key={preset.id}
              className={`bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md ${
                isActive ? 'border-blue-600 ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="p-5 space-y-4">
                {/* Header info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {preset.tagline}
                    </span>
                    {preset.isConventionalRecommended && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-150 font-extrabold flex items-center gap-1">
                        <HeartHandshake className="w-2.5 h-2.5" />
                        Coop Recommended
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                    {preset.name}
                  </h3>
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 mr-2 uppercase">Palet:</span>
                  <div className="flex gap-1.5">
                    {preset.bgPalette.map((colorClass, idx) => (
                      <div
                        key={idx}
                        className={`w-6 h-6 rounded-full border border-white shadow-sm ${colorClass}`}
                        title={colorClass}
                      />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  {preset.description}
                </p>
              </div>

              {/* Action area */}
              <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
                  ID: {preset.id}
                </span>

                {isActive ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Aktif Digunakan
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectTheme(preset.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold shadow-sm transition cursor-pointer"
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
      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-3 text-xs leading-normal">
        <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-blue-900">Hak Akses Super Administrator</p>
          <p className="text-blue-800/80 font-normal">
            Pengaturan tema tampilan ini hanya dapat diakses oleh Administrator &amp; Pengurus Pusat Koperasi. Anggota biasa akan langsung melihat perubahan tema visual ini secara serentak di dashboard mereka demi menjaga keselarasan identitas merk Koperasi MetroCOOP.
          </p>
        </div>
      </div>
    </div>
  );
}

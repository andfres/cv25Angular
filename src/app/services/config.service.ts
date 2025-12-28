import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CvConfig {
  baseFontScale: number;
  nameScale: number;
  sectionTitleScale: number;
  verticalPaddingScale: number;
  sortByDate: boolean;
  photoOnTop: boolean;
  asideWidth: number;
  experienceTheme: string;
  educationTheme: string;
  cardStyle: 'filled' | 'outlined' | 'subtle';
}

const DEFAULT: CvConfig = {
  baseFontScale: 1.0,
  nameScale: 1.0,
  sectionTitleScale: 1.0,
  verticalPaddingScale: 0.8,
  sortByDate: false,
  photoOnTop: false,
  asideWidth: 14,
  experienceTheme: 'purple',
  educationTheme: 'green',
  cardStyle: 'outlined',
};

const EXPERIENCE_THEMES: { [key: string]: any } = {
  blue: {
    '--exp-bg-light': '#eff6ff', // blue-50
    '--exp-bg-medium': '#3b82f6', // blue-500
    '--exp-border-light': '#93c5fd', // blue-300
    '--exp-border-medium': '#60a5fa', // blue-400
    '--exp-border-dark': '#1d4ed8', // blue-700
    '--exp-text-dark': '#1e3a8a', // blue-900
    '--exp-dot-border': '#ffffff',
  },
  purple: {
    '--exp-bg-light': '#f3e8ff', // purple-50
    '--exp-bg-medium': '#a855f7', // purple-500
    '--exp-border-light': '#d8b4fe', // purple-300
    '--exp-border-medium': '#c084fc', // purple-400
    '--exp-border-dark': '#7e22ce', // purple-700
    '--exp-text-dark': '#581c87', // purple-900
    '--exp-dot-border': '#ffffff',
  },
  teal: {
    '--exp-bg-light': '#f0fdfa', // teal-50
    '--exp-bg-medium': '#14b8a6', // teal-500
    '--exp-border-light': '#5eead4', // teal-300
    '--exp-border-medium': '#2dd4bf', // teal-400
    '--exp-border-dark': '#0f766e', // teal-700
    '--exp-text-dark': '#134e4a', // teal-900
    '--exp-dot-border': '#ffffff',
  },
  red: {
    '--exp-bg-light': '#fef2f2', // red-50
    '--exp-bg-medium': '#ef4444', // red-500
    '--exp-border-light': '#fca5a5', // red-300
    '--exp-border-medium': '#f87171', // red-400
    '--exp-border-dark': '#b91c1c', // red-700
    '--exp-text-dark': '#7f1d1d', // red-900
    '--exp-dot-border': '#ffffff',
  },
  gray: {
    '--exp-bg-light': '#f9fafb', // gray-50
    '--exp-bg-medium': '#6b7280', // gray-500
    '--exp-border-light': '#d1d5db', // gray-300
    '--exp-border-medium': '#9ca3af', // gray-400
    '--exp-border-dark': '#374151', // gray-700
    '--exp-text-dark': '#111827', // gray-900
    '--exp-dot-border': '#ffffff',
  }
};

const EDUCATION_THEMES: { [key: string]: any } = {
  green: {
    '--edu-bg-light': '#f0fdf4',
    '--edu-border-dark': '#15803d',
    '--edu-text': '#15803d',
  },
  blue: {
    '--edu-bg-light': '#eff6ff',
    '--edu-border-dark': '#1d4ed8',
    '--edu-text': '#1e3a8a',
  },
  purple: {
    '--edu-bg-light': '#f3e8ff',
    '--edu-border-dark': '#7e22ce',
    '--edu-text': '#581c87',
  },
  orange: {
    '--edu-bg-light': '#fff7ed',
    '--edu-border-dark': '#c2410c',
    '--edu-text': '#7c2d12',
  },
  pink: {
    '--edu-bg-light': '#fdf2f8',
    '--edu-border-dark': '#be185d',
    '--edu-text': '#831843',
  }
};

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private subj = new BehaviorSubject<CvConfig>(DEFAULT);
  state$ = this.subj.asObservable();

  get state(): CvConfig {
    return this.subj.value;
  }

  set(partial: Partial<CvConfig>) {
    const next = { ...this.state, ...partial };
    this.subj.next(next);
    this.apply(next);
  }

  apply(cfg: CvConfig) {
    const root = document.documentElement;
    root.style.setProperty('--base-font-scale', String(cfg.baseFontScale));
    root.style.setProperty('--name-scale', String(cfg.nameScale));
    root.style.setProperty('--section-title-scale', String(cfg.sectionTitleScale));
    root.style.setProperty('--vertical-padding-scale', String(cfg.verticalPaddingScale));

    // Apply card style
    root.setAttribute('data-card-style', cfg.cardStyle);

    // Apply experience theme colors
    const expTheme = EXPERIENCE_THEMES[cfg.experienceTheme] || EXPERIENCE_THEMES['blue'];
    Object.keys(expTheme).forEach(key => {
      root.style.setProperty(key, expTheme[key]);
    });

    // Apply education theme colors
    const eduTheme = EDUCATION_THEMES[cfg.educationTheme] || EDUCATION_THEMES['green'];
    Object.keys(eduTheme).forEach(key => {
      root.style.setProperty(key, eduTheme[key]);
    });
  }

  init() {
    // Apply default config to document
    this.apply(this.state);
  }
}

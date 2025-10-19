import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CvConfig {
  fontScale: number;
  profileFontScale: number;
  paddingScale: number;
  verticalPaddingScale: number;
  sortByDate: boolean;
  photoOnTop: boolean;
}

const DEFAULT: CvConfig = {
  fontScale: 0.85,
  profileFontScale: 1.05,
  paddingScale: 0.8,
  verticalPaddingScale: 0.8,
  sortByDate: true,
  photoOnTop: false
};

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private key = 'cv_config_v1';
  private subj = new BehaviorSubject<CvConfig>(this.load() || DEFAULT);
  state$ = this.subj.asObservable();

  get state(): CvConfig {
    return this.subj.value;
  }

  set(partial: Partial<CvConfig>) {
    const next = { ...this.state, ...partial };
    this.subj.next(next);
    this.save(next);
    this.apply(next);
  }

  apply(cfg: CvConfig) {
    document.documentElement.style.setProperty('--font-scale', String(cfg.fontScale));
    document.documentElement.style.setProperty('--profile-font-scale', String(cfg.profileFontScale));
    document.documentElement.style.setProperty('--padding-scale', String(cfg.paddingScale));
    document.documentElement.style.setProperty('--vertical-padding-scale', String(cfg.verticalPaddingScale));
  }

  private save(cfg: CvConfig) {
    try { localStorage.setItem(this.key, JSON.stringify(cfg)); } catch { /* ignore */ }
  }

  private load(): CvConfig | null {
    try { return JSON.parse(localStorage.getItem(this.key) || 'null'); } catch { return null; }
  }

  init() {
    // Apply saved or default config to document
    this.apply(this.state);
  }
}

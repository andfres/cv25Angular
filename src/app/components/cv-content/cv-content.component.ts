import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvData } from '../../models/cv.model';
import { LanguagesComponent } from '../languages/languages.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TimelineComponent } from '../timeline/timeline.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-cv-content',
  standalone: true,
  imports: [CommonModule, LanguagesComponent, TranslateModule, TimelineComponent],
  templateUrl: './cv-content.component.html',
})
export class CvContentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() cvData!: CvData;
  @Input() profileImage!: string;
  combinedEntries: any[] = [];
  photoOnTop = false;
  asideWidth = 20;
  asideWidthPercent = 40;

  constructor(
    public translate: TranslateService,
    private sanitizer: DomSanitizer,
    private config: ConfigService,
  ) { }

  ngOnInit(): void {
    // Apply initial configuration (sort and layout) from global config
    const initial = this.config.state;
    this.photoOnTop = initial.photoOnTop;
    this.asideWidth = initial.asideWidth ?? 20;
    this.asideWidthPercent = Math.round((this.asideWidth / 50) * 100); // 20rem/50rem = 40%
    this.combineEntries(initial.sortByDate);

    // Subscribe to future changes
    this.config.state$.subscribe((cfg) => {
      this.photoOnTop = cfg.photoOnTop;
      this.asideWidth = cfg.asideWidth ?? 20;
      this.asideWidthPercent = Math.round((this.asideWidth / 50) * 100);
      this.combineEntries(cfg.sortByDate);
    });

    // Keep existing event listeners for compatibility
    window.addEventListener('sortingChanged', this.onSortingChanged as EventListener);
    window.addEventListener('layoutChanged', this.onLayoutChanged as EventListener);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cvData']) {
      console.log('CvContent ngOnChanges:', this.cvData);
      console.log('CvContent config state:', this.config.state);
      this.combineEntries(this.config.state.sortByDate);
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('sortingChanged', this.onSortingChanged as EventListener);
    window.removeEventListener('layoutChanged', this.onLayoutChanged as EventListener);
  }

  private onSortingChanged = (evt: Event) => {
    const { sortByDate } = (evt as CustomEvent).detail as { sortByDate: boolean };
    this.combineEntries(sortByDate);
  };

  private onLayoutChanged = (evt: Event) => {
    const { photoOnTop } = (evt as CustomEvent).detail as { photoOnTop: boolean };
    this.photoOnTop = photoOnTop;
  };

  private combineEntries(sortByDate: boolean = false): void {
    console.log('CvContent combineEntries called. SortByDate:', sortByDate);
    if (!this.cvData) {
      console.warn('CvContent combineEntries: No cvData');
      this.combinedEntries = [];
      return;
    }
    console.log('CvContent cvData internal:', this.cvData);
    const all = [...(this.cvData.experience || []), ...(this.cvData.education || [])];
    if (sortByDate) {
      this.combinedEntries = all.sort((a, b) => {
        const normalize = (entry: any): number => {
          if (entry.endDate === 'present') {
            return Number.MAX_SAFE_INTEGER; // treat present as most recent
          }
          if (entry.endDate) {
            const d = new Date(entry.endDate).getTime();
            return isNaN(d) ? 0 : d;
          }
          if (entry.startDate) {
            const d = new Date(entry.startDate).getTime();
            return isNaN(d) ? 0 : d;
          }
          return 0;
        };
        return normalize(b) - normalize(a);
      });
    } else {
      // Default: sort by 'order' property if present, otherwise fallback to original order
      const all = [...(this.cvData.experience || []), ...(this.cvData.education || [])];
      this.combinedEntries = all.sort((a, b) => {
        const orderA = (a as any).order ?? 999;
        const orderB = (b as any).order ?? 999;
        return orderA - orderB;
      });
    }
  }

  get sanitizedObjective(): SafeHtml {
    const objective = this.translate.instant('personalInfo.objective');
    return this.sanitizer.bypassSecurityTrustHtml(objective);
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}

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

  photoOnTop = false;
  asideWidth = 20;
  asideWidthPercent = 40;

  constructor(
    public translate: TranslateService,
    private sanitizer: DomSanitizer,
    private config: ConfigService,
  ) {}

  ngOnInit(): void {
    // Apply initial configuration (sort and layout) from global config
    const initial = this.config.state;
    this.photoOnTop = initial.photoOnTop;
    this.asideWidth = initial.asideWidth ?? 20;
    this.asideWidthPercent = Math.round((this.asideWidth / 50) * 100); // 20rem/50rem = 40%

    // Subscribe to future changes
    this.config.state$.subscribe((cfg) => {
      this.photoOnTop = cfg.photoOnTop;
      this.asideWidth = cfg.asideWidth ?? 20;
      this.asideWidthPercent = Math.round((this.asideWidth / 50) * 100);
    });

    // Keep existing event listeners for compatibility

    window.addEventListener('layoutChanged', this.onLayoutChanged as EventListener);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cvData']) {
      console.log('CvContent ngOnChanges:', this.cvData);
      console.log('CvContent config state:', this.config.state);
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('layoutChanged', this.onLayoutChanged as EventListener);
  }

  private onLayoutChanged = (evt: Event) => {
    const { photoOnTop } = (evt as CustomEvent).detail as { photoOnTop: boolean };
    this.photoOnTop = photoOnTop;
  };

  get sanitizedObjective(): SafeHtml {
    const objective = this.translate.instant('personalInfo.objective');
    return this.sanitizer.bypassSecurityTrustHtml(objective);
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}

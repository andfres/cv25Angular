import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvData } from '../../models/cv.model';
import { LanguagesComponent } from '../languages/languages.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { TimelineComponent } from '../timeline/timeline.component';

@Component({
  selector: 'app-cv-content',
  standalone: true,
  imports: [CommonModule, LanguagesComponent, TranslateModule, PersonalInfoComponent, TimelineComponent],
  templateUrl: './cv-content.component.html',
  styleUrl: './cv-content.component.scss',
})
export class CvContentComponent implements OnInit {
  @Input() cvData!: CvData;
  @Input() profileImage!: string;

  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}

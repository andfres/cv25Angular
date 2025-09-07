import { Component, OnInit, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CvData } from '../../models/cv.model';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { SkillsComponent } from '../skills/skills.component';
import { LanguagesComponent } from '../languages/languages.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [TranslateModule, PersonalInfoComponent, SkillsComponent, LanguagesComponent, TimelineComponent, CommonModule],
  template: `
    <div *ngIf="cvData">
      <app-personal-info [personalInfo]="cvData.personalInfo"></app-personal-info>
      <app-timeline [timeline]="cvData.timeline"></app-timeline>
      <app-skills [skills]="cvData.skills"></app-skills>
      <app-languages [languages]="cvData.languages"></app-languages>
    </div>
  `,
  styleUrl: './cv.component.scss',
})
export class CvComponent implements OnInit {
  cvData!: CvData;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.get(['personalInfo', 'timeline', 'skills', 'languages', 'sections']).subscribe((translations) => {
      this.cvData = {
        HELLO: translations.HELLO,
        WELCOME: translations.WELCOME,
        personalInfo: translations.personalInfo,
        timeline: translations.timeline,
        skills: translations.skills,
        languages: translations.languages,
        sections: translations.sections,
      };
    });
  }
}

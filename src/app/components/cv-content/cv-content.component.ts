import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvData } from '../../models/cv.model';
import { SkillsComponent } from '../skills/skills.component';
import { LanguagesComponent } from '../languages/languages.component'; // Re-add LanguagesComponent
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router'; // Import RouterOutlet
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { ExperienceTimelineComponent } from '../experience-timeline/experience-timeline.component';
import { EducationTimelineComponent } from '../education-timeline/education-timeline.component';

@Component({
  selector: 'app-cv-content',
  standalone: true,
  imports: [CommonModule, SkillsComponent, LanguagesComponent, TranslateModule, RouterOutlet, PersonalInfoComponent, ExperienceTimelineComponent, EducationTimelineComponent],
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

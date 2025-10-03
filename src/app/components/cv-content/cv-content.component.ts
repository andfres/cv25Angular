import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvData } from '../../models/cv.model';
import { SkillsComponent } from '../skills/skills.component';
import { LanguagesComponent } from '../languages/languages.component'; // Re-add LanguagesComponent
import { HeaderComponent } from '../header/header.component'; // Add HeaderComponent import
import { CvComponent } from '../cv/cv.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router'; // Import RouterOutlet

@Component({
  selector: 'app-cv-content',
  standalone: true,
  imports: [CommonModule, SkillsComponent, LanguagesComponent, HeaderComponent, CvComponent, TranslateModule, RouterOutlet],
  template: `
    <main>
      <aside class="sidebar">
        <div class="profile-image-container">
          <img [src]="profileImage" alt="{{ 'profile.picture' | translate }}" class="profile-image">
        </div>
        <app-skills [skills]="cvData.skills"></app-skills>
      </aside>
      <div class="main-content">
        <app-cv [cvData]="cvData"></app-cv>
        <router-outlet />
      </div>
    </main>
  `,
  styleUrl: './cv-content.component.scss',
})
export class CvContentComponent implements OnInit {
  @Input() cvData!: CvData;
  @Input() profileImage!: string;

  ngOnInit(): void {
    // Initialization logic if needed
  }
}

import { Component, OnInit, signal, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CvData } from '../../models/cv.model';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [TranslateModule, PersonalInfoComponent, TimelineComponent, CommonModule],
  template: `
    @if (cvData) {
      <app-personal-info [personalInfo]="cvData.personalInfo"></app-personal-info>
      <app-timeline [timeline]="cvData.timeline"></app-timeline>
    }
  `,
  styleUrl: './cv.component.scss',
})
export class CvComponent implements OnInit {
  @Input() cvData!: CvData;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // No longer fetching data here, it's passed via @Input
  }
}

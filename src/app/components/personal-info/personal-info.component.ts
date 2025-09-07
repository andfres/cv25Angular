import { Component, Input } from '@angular/core';
import { PersonalInfo } from '../../models/cv.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <section>
      <h2>{{ 'personalInfo.name' | translate }}</h2>
      <p>{{ 'personalInfo.title' | translate }}</p>
      <p>{{ 'personalInfo.location' | translate }}</p>
      <p>{{ 'personalInfo.email' | translate }}</p>
      <p>{{ 'personalInfo.objective' | translate }}</p>
    </section>
  `,
  styleUrl: './personal-info.component.scss',
})
export class PersonalInfoComponent {
  @Input() personalInfo!: PersonalInfo;
}

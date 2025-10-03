import { Component, Input } from '@angular/core';
import { Skill } from '../../models/cv.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="cv-section">
      <h2 class="cv-heading-2">{{ 'sections.skills' | translate }}</h2>
      <ul class="reset-list">
        @for (skill of skills; track skill.name) {
          <li class="list-item-margin">
            {{ skill.name }} ({{ skill.level }}%)
          </li>
        }
      </ul>
    </section>
  `,
})
export class SkillsComponent {
  @Input() skills!: Skill[];
}

import { Component, Input } from '@angular/core';
import { Skill } from '../../models/cv.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section>
      <h2>{{ 'sections.skills' | translate }}</h2>
      <ul>
        @for (skill of skills; track skill.name) {
          <li>
            {{ skill.name }} ({{ skill.level }}%)
          </li>
        }
      </ul>
    </section>
  `,
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  @Input() skills!: Skill[];
}

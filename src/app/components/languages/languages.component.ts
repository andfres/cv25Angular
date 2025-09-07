import { Component, Input } from '@angular/core';
import { Language } from '../../models/cv.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section>
      <h2>{{ 'sections.languages' | translate }}</h2>
      <ul>
        @for (language of languages; track language.name) {
          <li>
            {{ language.name }} ({{ language.level }}%)
          </li>
        }
      </ul>
    </section>
  `,
  styleUrl: './languages.component.scss',
})
export class LanguagesComponent {
  @Input() languages!: Language[];
}

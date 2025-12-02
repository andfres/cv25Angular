import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './languages.component.html',
})
export class LanguagesComponent {
  @Input() languages!: string[];
}

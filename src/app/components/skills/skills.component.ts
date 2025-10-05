import { Component, Input } from '@angular/core';
import { Skill } from '../../models/cv.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './skills.component.html',
})
export class SkillsComponent {
  @Input() skills!: Skill[];
}

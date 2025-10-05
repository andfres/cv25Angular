import { Component, Input } from '@angular/core';
import { PersonalInfo } from '../../models/cv.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './personal-info.component.html',
})
export class PersonalInfoComponent {
  @Input() personalInfo!: PersonalInfo;
}

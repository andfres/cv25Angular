import { Component, Input } from '@angular/core';
import { PersonalInfo } from '../../models/cv.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './personal-info.component.html',
})
export class PersonalInfoComponent {
  @Input() personalInfo!: PersonalInfo;

  constructor(private sanitizer: DomSanitizer, private translate: TranslateService) {}

  get sanitizedObjective(): SafeHtml {
    const objective = this.translate.instant('personalInfo.objective');
    return this.sanitizer.bypassSecurityTrustHtml(objective);
  }
}

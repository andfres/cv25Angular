import { Component, OnInit, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import { CvComponent } from './components/cv/cv.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, CvComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,               // 👈 importante
})
export class App implements OnInit {
  protected readonly title = signal('my-angular-app');

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    void this.translate.use('en');
  }

  changeLanguage(lang: string) {
    void this.translate.use(lang);
  }
}

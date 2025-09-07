import { Component, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.sass',
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

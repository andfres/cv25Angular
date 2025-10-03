import { Component, OnInit, signal } from '@angular/core';
import { TranslateModule, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CvContentComponent } from './components/cv-content/cv-content.component';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { HeaderComponent } from './components/header/header.component'; // Import HeaderComponent

@Component({
  selector: 'app-root',
  imports: [TranslateModule, CvContentComponent, CommonModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App implements OnInit {
  protected readonly title = signal('my-angular-app');
  cvData: any; // Se cargará dinámicamente
  profileImage: string = '/assets/user-profile.png'; // Ruta estática de la imagen de perfil
  currentLanguageDisplay: string = ''; // Nueva propiedad para mostrar el idioma actual

  constructor(public translate: TranslateService, private http: HttpClient) {
    console.log('App Constructor - translate service initialized');
  }

  ngOnInit(): void {
    console.log('App ngOnInit - starting initialization');
    // Añadir idiomas soportados y establecer un idioma de respaldo
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');

    // Usar el idioma por defecto del navegador o 'en' si no se detecta
    const browserLang = this.translate.getBrowserLang();
    const initialLang = (browserLang && browserLang.match(/en|es/)) ? browserLang : 'en';
    console.log(`App ngOnInit - Initializing with language: ${initialLang}`);

    // Cargar las traducciones para el idioma inicial y luego cargar los datos del CV
    this.translate.use(initialLang).subscribe(() => {
      console.log(`App ngOnInit - Initial translations for ${initialLang} loaded.`);
      this.loadAndSetCvData();
      this.currentLanguageDisplay = this.translate.currentLang;
    });

    // Suscribirse a los cambios de idioma para actualizar cvData en el futuro
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log(`App onLangChange - Language changed to: ${event.lang}`);
      this.loadAndSetCvData();
      this.currentLanguageDisplay = event.lang;
    });
  }

  private loadAndSetCvData(): void {
    console.log('App loadAndSetCvData - Attempting to load CV data.');
    const currentLang = this.translate.currentLang; // Get the currently active language
    this.http.get(`/assets/i18n/${currentLang}.json`).subscribe((data: any) => {
      console.log('App loadAndSetCvData - CV data received:', data);
      this.cvData = data;
      console.log('App loadAndSetCvData - cvData assigned:', this.cvData);
    });
  }

  printPage(): void {
    window.print();
  }

  changeLanguage(lang: string) {
    this.translate.use(lang).subscribe(() => {
      console.log(`App changeLanguage - Language changed to: ${lang}`);
      this.loadAndSetCvData(); // Reload data when language changes
      this.currentLanguageDisplay = this.translate.currentLang;
    });
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }

  getAvailableLanguages(): readonly string[] {
    return this.translate.getLangs();
  }
}

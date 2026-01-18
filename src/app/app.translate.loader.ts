import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    // Usar path relativo para que funcione en cualquier base path
    // responseType: 'text' para poder quitar comentarios antes de parsear
    return this.http.get(`./assets/i18n/${lang}.jsonc`, { responseType: 'text' }).pipe(
      map((text: string) => {
        const cleaned = this.stripComments(text);
        try {
          return JSON.parse(cleaned);
        } catch (e) {
          console.error(`Error parsing translation file ${lang}.json:`, e);
          return {};
        }
      }),
    );
  }

  private stripComments(text: string): string {
    // Regex para quitar comentarios de línea (//) y multilínea (/*...*/)
    const commentsStripped = text.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
    // Regex para quitar comas finales (trailing commas) antes de ] o }
    return commentsStripped.replace(/,(\s*[\]}])/g, '$1');
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

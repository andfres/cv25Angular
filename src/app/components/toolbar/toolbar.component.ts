import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UnifiedControlComponent } from '../unified-control/unified-control.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, TranslateModule, UnifiedControlComponent],
  template: `
    <div class="toolbar-container print:hidden">
      <!-- Header con banderas y botón de imprimir - siempre visible -->
      <div class="toolbar-header">
        <!-- Banderas -->
        <div class="language-flags">
          @for (lang of availableLanguages; track lang) {
            <button
              (click)="onLanguageChange(lang)"
              [class.active]="lang === currentLanguage"
              class="flag-button"
              [title]="lang | uppercase"
            >
              <img 
                src="./assets/flags/{{ lang }}.png" 
                alt="{{ lang | uppercase }}" 
                class="flag-image"
              />
            </button>
          }
        </div>

        <!-- Botón Imprimir -->
        <button class="print-button" (click)="onPrint()">
          🖨️ Print CV
        </button>

        <!-- Botón expandir/colapsar controles -->
        <button 
          class="toggle-controls-button"
          (click)="toggleControls()"
          [title]="isExpanded ? 'Contraer controles' : 'Expandir controles'"
        >
          <span class="toggle-icon" [class.rotated]="isExpanded">▶</span>
          ⚙️ Controls
        </button>
      </div>

      <!-- Panel de controles expandible -->
      <div 
        class="controls-panel" 
        [class.expanded]="isExpanded"
      >
        <app-unified-control></app-unified-control>
      </div>
    </div>
  `,
  styles: [`
    .toolbar-container {
      position: fixed;
      top: 10px;
      right: 10px;
      background: white;
      border: 2px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      min-width: 220px;
      overflow: hidden;
      transition: box-shadow 0.2s;
    }

    .toolbar-header {
      padding: 10px;
      background: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
    }

    /* Banderas */
    .language-flags {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      justify-content: center;
    }

    .flag-button {
      padding: 4px;
      border: 2px solid transparent;
      background: transparent;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .flag-button:hover {
      border-color: #4CAF50;
      transform: scale(1.1);
    }

    .flag-button.active {
      border-color: #2196F3;
      background: #e3f2fd;
    }

    .flag-image {
      width: 28px;
      height: 28px;
      display: block;
      object-fit: cover;
    }

    /* Botón Imprimir */
    .print-button {
      width: 100%;
      padding: 10px;
      margin-bottom: 8px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: background 0.2s;
    }

    .print-button:hover {
      background: #45a049;
    }

    /* Botón expandir controles */
    .toggle-controls-button {
      width: 100%;
      padding: 10px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.2s;
    }

    .toggle-controls-button:hover {
      background: #1976D2;
    }

    .toggle-icon {
      font-size: 10px;
      transition: transform 0.3s;
      display: inline-block;
    }

    .toggle-icon.rotated {
      transform: rotate(90deg);
    }

    /* Panel de controles */
    .controls-panel {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-in-out;
    }

    .controls-panel.expanded {
      max-height: 800px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .toolbar-container {
        right: 5px;
        top: 5px;
        min-width: 180px;
      }
    }
  `]
})
export class ToolbarComponent {
  @Input() availableLanguages: readonly string[] = [];
  @Input() currentLanguage: string = 'en';
  @Output() languageChange = new EventEmitter<string>();
  @Output() print = new EventEmitter<void>();

  isExpanded = false;

  toggleControls(): void {
    this.isExpanded = !this.isExpanded;
  }

  onLanguageChange(lang: string): void {
    this.languageChange.emit(lang);
  }

  onPrint(): void {
    this.print.emit();
  }
}

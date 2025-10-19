import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-unified-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="unified-control-panel print:hidden">
      <!-- Font Control -->
      <div class="control-section">
        <label class="control-label">Font Scale: {{ fontScale | number: '1.2-2' }}</label>
        <input
          type="range"
          [value]="fontScale"
          (input)="onFontScaleChange($event)"
          min="0.6"
          max="1.4"
          step="0.05"
          class="control-slider"
        />
        <div class="control-buttons">
          <button (click)="setFontScale(0.8)" class="control-btn">80%</button>
          <button (click)="setFontScale(0.85)" class="control-btn">85%</button>
          <button (click)="setFontScale(0.9)" class="control-btn">90%</button>
          <button (click)="setFontScale(1.0)" class="control-btn">100%</button>
          <button (click)="setFontScale(1.1)" class="control-btn">110%</button>
        </div>
      </div>

      <!-- Profile Font Control -->
      <div class="control-section">
        <label class="control-label"
          >Profile Font Scale: {{ profileFontScale | number: '1.2-2' }}</label
        >
        <input
          type="range"
          [value]="profileFontScale"
          (input)="onProfileFontScaleChange($event)"
          min="0.6"
          max="1.6"
          step="0.05"
          class="control-slider"
        />
        <div class="control-buttons">
          <button (click)="setProfileFontScale(0.8)" class="control-btn">80%</button>
          <button (click)="setProfileFontScale(0.9)" class="control-btn">90%</button>
          <button (click)="setProfileFontScale(1.0)" class="control-btn">100%</button>
          <button (click)="setProfileFontScale(1.2)" class="control-btn">120%</button>
          <button (click)="setProfileFontScale(1.4)" class="control-btn">140%</button>
        </div>
      </div>

      <!-- Padding Control -->
      <div class="control-section">
        <label class="control-label">Padding Scale: {{ paddingScale | number: '1.2-2' }}</label>
        <input
          type="range"
          [value]="paddingScale"
          (input)="onPaddingScaleChange($event)"
          min="0.5"
          max="1.3"
          step="0.05"
          class="control-slider"
        />
        <div class="control-buttons">
          <button (click)="setPaddingScale(0.6)" class="control-btn">60%</button>
          <button (click)="setPaddingScale(0.7)" class="control-btn">70%</button>
          <button (click)="setPaddingScale(0.8)" class="control-btn">80%</button>
          <button (click)="setPaddingScale(0.9)" class="control-btn">90%</button>
          <button (click)="setPaddingScale(1.0)" class="control-btn">100%</button>
        </div>
      </div>

      <!-- Vertical Padding Control -->
      <div class="control-section">
        <label class="control-label"
          >Vertical Padding: {{ verticalPaddingScale | number: '1.2-2' }}</label
        >
        <input
          type="range"
          [value]="verticalPaddingScale"
          (input)="onVerticalPaddingScaleChange($event)"
          min="0.4"
          max="1.2"
          step="0.05"
          class="control-slider"
        />
        <div class="control-buttons">
          <button (click)="setVerticalPaddingScale(0.5)" class="control-btn">50%</button>
          <button (click)="setVerticalPaddingScale(0.6)" class="control-btn">60%</button>
          <button (click)="setVerticalPaddingScale(0.7)" class="control-btn">70%</button>
          <button (click)="setVerticalPaddingScale(0.8)" class="control-btn">80%</button>
          <button (click)="setVerticalPaddingScale(1.0)" class="control-btn">100%</button>
        </div>
      </div>

      <!-- Date Sorting Control -->
      <div class="control-section">
        <label class="control-label">Sort by Date:</label>
        <div class="checkbox-container">
          <input
            type="checkbox"
            [checked]="sortByDate"
            (change)="onSortByDateChange($event)"
            class="control-checkbox"
          />
          <span class="checkbox-label">Chronological order (newest first)</span>
        </div>
      </div>

      <!-- Layout Control -->
      <div class="control-section">
        <label class="control-label">Layout:</label>
        <div class="checkbox-container">
          <input
            type="checkbox"
            [checked]="photoOnTop"
            (change)="onPhotoOnTopChange($event)"
            class="control-checkbox"
          />
          <span class="checkbox-label">Photo and About Me on top</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .unified-control-panel {
        position: fixed;
        top: 10px;
        right: 10px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        font-size: 12px;
        width: 200px;
      }

      .control-section {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }

      .control-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .control-label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        font-size: 11px;
      }

      .control-slider {
        width: 100%;
        margin-bottom: 8px;
      }

      .control-buttons {
        display: flex;
        gap: 3px;
        flex-wrap: wrap;
      }

      .control-btn {
        padding: 2px 4px;
        border: 1px solid #ccc;
        background: #f5f5f5;
        border-radius: 4px;
        cursor: pointer;
        font-size: 9px;
        min-width: 25px;
      }

      .control-btn:hover {
        background: #e5e5e5;
      }

      .checkbox-container {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 5px;
      }

      .control-checkbox {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }

      .checkbox-label {
        font-size: 10px;
        color: #374151;
        cursor: pointer;
      }
    `,
  ],
})
export class UnifiedControlComponent {
  fontScale = 1;
  profileFontScale = 1;
  paddingScale = 1;
  verticalPaddingScale = 1;
  sortByDate = true;
  photoOnTop = false;

  constructor(private config: ConfigService) {
    const s = this.config.state;
    this.fontScale = s.fontScale;
    this.profileFontScale = s.profileFontScale;
    this.paddingScale = s.paddingScale;
    this.verticalPaddingScale = s.verticalPaddingScale;
    this.sortByDate = s.sortByDate;
    this.photoOnTop = s.photoOnTop;

    // ensure CSS vars applied
    this.config.init();

    // subscribe to changes
    this.config.state$.subscribe((cfg) => {
      this.fontScale = cfg.fontScale;
      this.profileFontScale = cfg.profileFontScale;
      this.paddingScale = cfg.paddingScale;
      this.verticalPaddingScale = cfg.verticalPaddingScale;
      this.sortByDate = cfg.sortByDate;
      this.photoOnTop = cfg.photoOnTop;
    });
  }

  onFontScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const scale = parseFloat(target.value);
    this.config.set({ fontScale: scale });
    this.logCurrentConfiguration('🔤 Font Scale Applied');
  }

  onProfileFontScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const scale = parseFloat(target.value);
    this.config.set({ profileFontScale: scale });
    this.logCurrentConfiguration('👤 Profile Font Scale Applied');
  }

  onPaddingScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const scale = parseFloat(target.value);
    this.config.set({ paddingScale: scale });
    this.logCurrentConfiguration('📏 Padding Scale Applied');
  }

  onVerticalPaddingScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const scale = parseFloat(target.value);
    this.config.set({ verticalPaddingScale: scale });
    this.logCurrentConfiguration('📐 Vertical Padding Scale Applied');
  }

  onSortByDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.config.set({ sortByDate: checked });
    this.logCurrentConfiguration('🔀 Sort By Date Toggled');
    this.notifySortingChange();
  }

  onPhotoOnTopChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.config.set({ photoOnTop: checked });
    this.logCurrentConfiguration('🖼️ Layout Toggled');
    this.notifyLayoutChange();
  }

  // Add direct setter methods used by template buttons
  setFontScale(scale: number): void {
    this.config.set({ fontScale: scale });
    this.logCurrentConfiguration('🔤 Font Scale Applied');
  }

  setProfileFontScale(scale: number): void {
    this.config.set({ profileFontScale: scale });
    this.logCurrentConfiguration('👤 Profile Font Scale Applied');
  }

  setPaddingScale(scale: number): void {
    this.config.set({ paddingScale: scale });
    this.logCurrentConfiguration('📏 Padding Scale Applied');
  }

  setVerticalPaddingScale(scale: number): void {
    this.config.set({ verticalPaddingScale: scale });
    this.logCurrentConfiguration('📐 Vertical Padding Scale Applied');
  }

  notifySortingChange(): void {
    // Emit event to parent component or use a service to communicate with timeline
    const event = new CustomEvent('sortingChanged', {
      detail: { sortByDate: this.sortByDate },
    });
    window.dispatchEvent(event);
  }

  notifyLayoutChange(): void {
    // Emit event to communicate layout changes
    const event = new CustomEvent('layoutChanged', {
      detail: { photoOnTop: this.photoOnTop },
    });
    window.dispatchEvent(event);
  }

  private logCurrentConfiguration(action: string): void {
    const layoutHuman = {
      sortByDate: this.sortByDate ? 'Chronological order (newest first)' : 'No sorting',
      photoOnTop: this.photoOnTop ? 'Photo and About Me on top' : 'Original layout',
    };

    const config = {
      action: action,
      timestamp: new Date().toLocaleTimeString(),
      configuration: {
        fontScale: {
          value: this.fontScale,
          percentage: Math.round(this.fontScale * 100) + '%',
        },
        profileFontScale: {
          value: this.profileFontScale,
          percentage: Math.round(this.profileFontScale * 100) + '%',
        },
        paddingScale: {
          value: this.paddingScale,
          percentage: Math.round(this.paddingScale * 100) + '%',
        },
        verticalPaddingScale: {
          value: this.verticalPaddingScale,
          percentage: Math.round(this.verticalPaddingScale * 100) + '%',
        },
        layout: {
          sortByDate: this.sortByDate,
          photoOnTop: this.photoOnTop,
        },
        layoutHuman: layoutHuman,
      },
    };

    console.log('🎛️ CV Configuration Applied:', config);
    console.log('📋 Copy this configuration for print styles:', {
      fontScale: this.fontScale,
      profileFontScale: this.profileFontScale,
      paddingScale: this.paddingScale,
      verticalPaddingScale: this.verticalPaddingScale,
      sortByDate: this.sortByDate,
      photoOnTop: this.photoOnTop,
      sortByDateLabel: layoutHuman.sortByDate,
      layoutLabel: layoutHuman.photoOnTop,
    });
  }
}

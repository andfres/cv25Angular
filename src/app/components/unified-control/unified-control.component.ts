import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-unified-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="unified-control-panel print:hidden">
      <!-- Version -->
      <div class="version-info">
        <span class="version-label">v1.0.0</span>
      </div>
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

      <!-- Aside Width Control -->
      <div class="control-section">
        <label class="control-label">Aside Width: {{ asideWidth | number: '1.0-2' }}rem</label>
        <input
          type="range"
          [value]="asideWidth"
          (input)="onAsideWidthChange($event)"
          min="10"
          max="40"
          step="1"
          class="control-slider"
        />
        <div class="control-buttons">
           <button (click)="setAsideWidth(15)" class="control-btn">15</button>
          <button (click)="setAsideWidth(20)" class="control-btn">20</button>
          <button (click)="setAsideWidth(25)" class="control-btn">25</button>
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
        padding: 15px;
        font-size: 12px;
        background: white;
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

      .version-info {
        text-align: center;
        padding: 8px;
        margin-bottom: 10px;
        background: #f8f9fa;
        border-radius: 4px;
      }

      .version-label {
        font-size: 10px;
        color: #6b7280;
        font-weight: 600;
      }
    `,
  ],
})
export class UnifiedControlComponent {
  fontScale = 1;
  profileFontScale = 1;
  asideWidth = 20;
  verticalPaddingScale = 1;
  sortByDate = true;
  photoOnTop = false;

  constructor(private config: ConfigService) {
    const s = this.config.state;
    this.fontScale = s.fontScale;
    this.profileFontScale = s.profileFontScale;
    this.asideWidth = s.asideWidth ?? 20;
    this.verticalPaddingScale = s.verticalPaddingScale;

    this.sortByDate = s.sortByDate;
    this.photoOnTop = s.photoOnTop;

    // ensure CSS vars applied
    this.config.init();

    // subscribe to changes
    this.config.state$.subscribe((cfg) => {
      this.fontScale = cfg.fontScale;
      this.profileFontScale = cfg.profileFontScale;
      this.asideWidth = cfg.asideWidth ?? 20;
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

  onAsideWidthChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const width = parseInt(target.value, 10);
    this.config.set({ asideWidth: width });
    this.logCurrentConfiguration('📏 Aside Width Applied');
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

  setAsideWidth(width: number): void {
    this.config.set({ asideWidth: width });
    this.logCurrentConfiguration('📏 Aside Width Applied');
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
         asideWidth: {
          value: this.asideWidth,
          unit: 'rem',
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
      asideWidth: this.asideWidth,
      sortByDate: this.sortByDate,
      photoOnTop: this.photoOnTop,
      sortByDateLabel: layoutHuman.sortByDate,
      layoutLabel: layoutHuman.photoOnTop,
    });
  }
}

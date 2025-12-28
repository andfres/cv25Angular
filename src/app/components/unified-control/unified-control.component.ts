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

      <!-- Name Font Control -->
      <div class="control-section">
        <label class="control-label"
          >Name Scale: {{ nameScale | number: '1.2-2' }}</label
        >
        <input
          type="range"
          [value]="nameScale"
          (input)="onNameScaleChange($event)"
          min="0.8"
          max="2.0"
          step="0.05"
          class="control-slider"
        />
        <div class="control-buttons">
          <button (click)="setNameScale(0.9)" class="control-btn">90%</button>
          <button (click)="setNameScale(1.0)" class="control-btn">100%</button>
          <button (click)="setNameScale(1.2)" class="control-btn">120%</button>
          <button (click)="setNameScale(1.5)" class="control-btn">150%</button>
        </div>
      </div>

      <!-- Section Title Font Control -->
      <div class="control-section">
        <label class="control-label"
          >Section Titles Scale: {{ sectionTitleScale | number: '1.2-2' }}</label
        >
        <input
          type="range"
          [value]="sectionTitleScale"
          (input)="onSectionTitleScaleChange($event)"
          min="0.8"
          max="2.5"
          step="0.05"
          class="control-slider"
        />
        <div class="control-buttons">
          <button (click)="setSectionTitleScale(0.9)" class="control-btn">90%</button>
          <button (click)="setSectionTitleScale(1.0)" class="control-btn">100%</button>
          <button (click)="setSectionTitleScale(1.3)" class="control-btn">130%</button>
          <button (click)="setSectionTitleScale(1.6)" class="control-btn">160%</button>
          <button (click)="setSectionTitleScale(2.0)" class="control-btn">200%</button>
        </div>
      </div>

      <!-- Base Font Scale Control -->
      <div class="control-section">
        <label class="control-label"
          >Base Font Scale: {{ baseFontScale | number: '1.2-2' }}</label
        >
        <input
          type="range"
          [value]="baseFontScale"
          (input)="onBaseFontScaleChange($event)"
          min="0.7"
          max="1.3"
          step="0.05"
          class="control-slider"
        />
        <div class="control-buttons">
          <button (click)="setBaseFontScale(0.8)" class="control-btn">80%</button>
          <button (click)="setBaseFontScale(0.9)" class="control-btn">90%</button>
          <button (click)="setBaseFontScale(1.0)" class="control-btn">100%</button>
          <button (click)="setBaseFontScale(1.1)" class="control-btn">110%</button>
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

      <!-- Card Style Control -->
      <div class="control-section">
        <label class="control-label">Card Style:</label>
        <div class="control-buttons">
          <button 
            (click)="setCardStyle('filled')" 
            [class.active-style]="cardStyle === 'filled'"
            class="control-btn"
          >Filled</button>
          <button 
            (click)="setCardStyle('subtle')" 
            [class.active-style]="cardStyle === 'subtle'"
            class="control-btn"
          >Subtle</button>
          <button 
            (click)="setCardStyle('outlined')" 
            [class.active-style]="cardStyle === 'outlined'"
            class="control-btn"
          >Outlined</button>
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

      <!-- Experience Color Control -->
      <div class="control-section">
        <label class="control-label">Experience Color:</label>
        <div class="theme-buttons">
          <button 
            (click)="setTheme('blue')" 
            class="theme-btn" 
            [class.active]="experienceTheme === 'blue'"
            title="Blue"
            style="background-color: #3b82f6;"
          ></button>
          <button 
            (click)="setTheme('purple')" 
            class="theme-btn" 
            [class.active]="experienceTheme === 'purple'"
            title="Purple"
            style="background-color: #a855f7;"
          ></button>
          <button 
            (click)="setTheme('teal')" 
            class="theme-btn" 
            [class.active]="experienceTheme === 'teal'"
            title="Teal"
            style="background-color: #14b8a6;"
          ></button>
          <button 
            (click)="setTheme('red')" 
            class="theme-btn" 
            [class.active]="experienceTheme === 'red'"
            title="Red"
            style="background-color: #ef4444;"
          ></button>
          <button 
            (click)="setTheme('gray')" 
            class="theme-btn" 
            [class.active]="experienceTheme === 'gray'"
            title="Gray"
            style="background-color: #6b7280;"
          ></button>
        </div>
      </div>

      <!-- Education Color Control -->
      <div class="control-section">
        <label class="control-label">Education Color:</label>
        <div class="theme-buttons">
          <button 
            (click)="setEducationTheme('green')" 
            class="theme-btn" 
            [class.active]="educationTheme === 'green'"
            title="Green"
            style="background-color: #22c55e;"
          ></button>
          <button 
            (click)="setEducationTheme('blue')" 
            class="theme-btn" 
            [class.active]="educationTheme === 'blue'"
            title="Blue"
            style="background-color: #3b82f6;"
          ></button>
          <button 
            (click)="setEducationTheme('purple')" 
            class="theme-btn" 
            [class.active]="educationTheme === 'purple'"
            title="Purple"
            style="background-color: #a855f7;"
          ></button>
          <button 
            (click)="setEducationTheme('orange')" 
            class="theme-btn" 
            [class.active]="educationTheme === 'orange'"
            title="Orange"
            style="background-color: #f97316;"
          ></button>
          <button 
            (click)="setEducationTheme('pink')" 
            class="theme-btn" 
            [class.active]="educationTheme === 'pink'"
            title="Pink"
            style="background-color: #ec4899;"
          ></button>
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

      .control-btn.active-style {
        background: #2196F3;
        color: white;
        border-color: #1976D2;
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

      /* Theme Buttons */
      .theme-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .theme-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid transparent;
        cursor: pointer;
        transition: transform 0.2s, border-color 0.2s;
      }

      .theme-btn:hover {
        transform: scale(1.1);
      }

      .theme-btn.active {
        border-color: #333;
        border-width: 3px;
        transform: scale(1.15);
      }
    `,
  ],
})
export class UnifiedControlComponent {
  baseFontScale = 1;
  nameScale = 1;
  sectionTitleScale = 1;
  asideWidth = 20;
  verticalPaddingScale = 1;
  sortByDate = true;
  photoOnTop = false;
  experienceTheme = 'blue';
  educationTheme = 'green';
  cardStyle: 'filled' | 'outlined' | 'subtle' = 'outlined';

  constructor(private config: ConfigService) {
    const s = this.config.state;
    this.baseFontScale = s.baseFontScale || 1;
    this.nameScale = s.nameScale || 1;
    this.sectionTitleScale = s.sectionTitleScale || 1;
    this.asideWidth = s.asideWidth ?? 20;
    this.verticalPaddingScale = s.verticalPaddingScale;

    this.sortByDate = s.sortByDate;
    this.photoOnTop = s.photoOnTop;
    this.experienceTheme = s.experienceTheme || 'blue';
    this.educationTheme = s.educationTheme || 'green';
    this.cardStyle = s.cardStyle || 'outlined';

    // ensure CSS vars applied
    this.config.init();

    // subscribe to changes
    this.config.state$.subscribe((cfg) => {
      this.baseFontScale = cfg.baseFontScale || 1;
      this.nameScale = cfg.nameScale || 1;
      this.sectionTitleScale = cfg.sectionTitleScale || 1;
      this.asideWidth = cfg.asideWidth ?? 20;
      this.verticalPaddingScale = cfg.verticalPaddingScale;

      this.sortByDate = cfg.sortByDate;
      this.photoOnTop = cfg.photoOnTop;
      this.experienceTheme = cfg.experienceTheme || 'blue';
      this.educationTheme = cfg.educationTheme || 'green';
      this.cardStyle = cfg.cardStyle || 'outlined';
    });
  }

  onNameScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const scale = parseFloat(target.value);
    this.config.set({ nameScale: scale });
    this.logCurrentConfiguration('👤 Name Scale Applied');
  }

  onSectionTitleScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const scale = parseFloat(target.value);
    this.config.set({ sectionTitleScale: scale });
    this.logCurrentConfiguration('📑 Section Title Scale Applied');
  }

  onBaseFontScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const scale = parseFloat(target.value);
    this.config.set({ baseFontScale: scale });
    this.logCurrentConfiguration('📝 Base Font Scale Applied');
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

  setTheme(theme: string): void {
    this.config.set({ experienceTheme: theme });
    this.logCurrentConfiguration('🎨 Experience Theme: ' + theme);
  }

  setEducationTheme(theme: string): void {
    this.config.set({ educationTheme: theme });
    this.logCurrentConfiguration('🎓 Education Theme: ' + theme);
  }

  setCardStyle(style: 'filled' | 'outlined' | 'subtle'): void {
    this.config.set({ cardStyle: style });
    this.logCurrentConfiguration('🎴 Card Style: ' + style);
  }

  // Add direct setter methods used by template buttons
  setNameScale(scale: number): void {
    this.config.set({ nameScale: scale });
    this.logCurrentConfiguration('👤 Name Scale Applied');
  }

  setSectionTitleScale(scale: number): void {
    this.config.set({ sectionTitleScale: scale });
    this.logCurrentConfiguration('📑 Section Title Scale Applied');
  }

  setAsideWidth(width: number): void {
    this.config.set({ asideWidth: width });
    this.logCurrentConfiguration('📏 Aside Width Applied');
  }

  setVerticalPaddingScale(scale: number): void {
    this.config.set({ verticalPaddingScale: scale });
    this.logCurrentConfiguration('📐 Vertical Padding Scale Applied');
  }

  setBaseFontScale(scale: number): void {
    this.config.set({ baseFontScale: scale });
    this.logCurrentConfiguration('📝 Base Font Scale Applied');
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
      scales: {
        baseFontScale: {
          value: this.baseFontScale,
          percentage: Math.round(this.baseFontScale * 100) + '%',
        },
        nameScale: {
          value: this.nameScale,
          percentage: Math.round(this.nameScale * 100) + '%',
        },
        sectionTitleScale: {
          value: this.sectionTitleScale,
          percentage: Math.round(this.sectionTitleScale * 100) + '%',
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
        theme: this.experienceTheme,
        layoutHuman: layoutHuman,
      },
    };

    console.log('🎛️ CV Configuration Applied:', config);
    console.log('📋 Copy this configuration for print styles:', {
      nameScale: this.nameScale,
      sectionTitleScale: this.sectionTitleScale,
      asideWidth: this.asideWidth,
      sortByDate: this.sortByDate,
      photoOnTop: this.photoOnTop,
      experienceTheme: this.experienceTheme,
      sortByDateLabel: layoutHuman.sortByDate,
      layoutLabel: layoutHuman.photoOnTop,
    });
  }
}

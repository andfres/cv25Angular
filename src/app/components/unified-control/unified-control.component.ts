import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { applyFontScale, getCurrentFontScale, applyPaddingScale, getCurrentPaddingScale } from '../../config/font-config';

@Component({
  selector: 'app-unified-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="unified-control-panel print:hidden">
      <!-- Font Control -->
      <div class="control-section">
        <label class="control-label">Font Scale: {{ fontScale | number:'1.2-2' }}</label>
        <input 
          type="range" 
          [value]="fontScale" 
          (input)="onFontScaleChange($event)"
          min="0.6" 
          max="1.4" 
          step="0.05"
          class="control-slider">
        <div class="control-buttons">
          <button (click)="setFontScale(0.8)" class="control-btn">80%</button>
          <button (click)="setFontScale(0.85)" class="control-btn">85%</button>
          <button (click)="setFontScale(0.9)" class="control-btn">90%</button>
          <button (click)="setFontScale(1.0)" class="control-btn">100%</button>
          <button (click)="setFontScale(1.1)" class="control-btn">110%</button>
        </div>
      </div>

      <!-- Padding Control -->
      <div class="control-section">
        <label class="control-label">Padding Scale: {{ paddingScale | number:'1.2-2' }}</label>
        <input 
          type="range" 
          [value]="paddingScale" 
          (input)="onPaddingScaleChange($event)"
          min="0.5" 
          max="1.3" 
          step="0.05"
          class="control-slider">
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
        <label class="control-label">Vertical Padding: {{ verticalPaddingScale | number:'1.2-2' }}</label>
        <input 
          type="range" 
          [value]="verticalPaddingScale" 
          (input)="onVerticalPaddingScaleChange($event)"
          min="0.4" 
          max="1.2" 
          step="0.05"
          class="control-slider">
        <div class="control-buttons">
          <button (click)="setVerticalPaddingScale(0.5)" class="control-btn">50%</button>
          <button (click)="setVerticalPaddingScale(0.6)" class="control-btn">60%</button>
          <button (click)="setVerticalPaddingScale(0.7)" class="control-btn">70%</button>
          <button (click)="setVerticalPaddingScale(0.8)" class="control-btn">80%</button>
          <button (click)="setVerticalPaddingScale(1.0)" class="control-btn">100%</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unified-control-panel {
      position: fixed;
      top: 10px;
      right: 10px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
  `]
})
export class UnifiedControlComponent {
  fontScale = getCurrentFontScale();
  paddingScale = getCurrentPaddingScale();
  verticalPaddingScale = getCurrentVerticalPaddingScale();

  onFontScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const scale = parseFloat(target.value);
    this.setFontScale(scale);
  }

  onPaddingScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const scale = parseFloat(target.value);
    this.setPaddingScale(scale);
  }

  onVerticalPaddingScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const scale = parseFloat(target.value);
    this.setVerticalPaddingScale(scale);
  }

  setFontScale(scale: number): void {
    this.fontScale = scale;
    applyFontScale(scale);
  }

  setPaddingScale(scale: number): void {
    this.paddingScale = scale;
    applyPaddingScale(scale);
  }

  setVerticalPaddingScale(scale: number): void {
    this.verticalPaddingScale = scale;
    applyVerticalPaddingScale(scale);
  }
}

// Add vertical padding functions to the config
function getCurrentVerticalPaddingScale(): number {
  const scale = getComputedStyle(document.documentElement)
    .getPropertyValue('--vertical-padding-scale');
  return parseFloat(scale) || 1.0;
}

function applyVerticalPaddingScale(scale: number): void {
  document.documentElement.style.setProperty('--vertical-padding-scale', scale.toString());
}


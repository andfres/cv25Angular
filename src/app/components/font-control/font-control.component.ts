import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { applyFontScale, getCurrentFontScale } from '../../config/font-config';

@Component({
  selector: 'app-font-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="font-control-panel print:hidden">
      <label class="font-control-label">Font Scale: {{ currentScale | number:'1.2-2' }}</label>
      <input 
        type="range" 
        [value]="currentScale" 
        (input)="onScaleChange($event)"
        min="0.6" 
        max="1.4" 
        step="0.05"
        class="font-control-slider">
      <div class="font-control-buttons">
        <button (click)="setScale(0.8)" class="font-control-btn">80%</button>
        <button (click)="setScale(0.85)" class="font-control-btn">85%</button>
        <button (click)="setScale(0.9)" class="font-control-btn">90%</button>
        <button (click)="setScale(1.0)" class="font-control-btn">100%</button>
        <button (click)="setScale(1.1)" class="font-control-btn">110%</button>
      </div>
    </div>
  `,
  styles: [`
    .font-control-panel {
      position: fixed;
      top: 10px;
      right: 10px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      font-size: 12px;
    }
    
    .font-control-label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .font-control-slider {
      width: 100%;
      margin-bottom: 10px;
    }
    
    .font-control-buttons {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
    }
    
    .font-control-btn {
      padding: 2px 6px;
      border: 1px solid #ccc;
      background: #f5f5f5;
      border-radius: 4px;
      cursor: pointer;
      font-size: 10px;
    }
    
    .font-control-btn:hover {
      background: #e5e5e5;
    }
  `]
})
export class FontControlComponent {
  currentScale = getCurrentFontScale();

  onScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const scale = parseFloat(target.value);
    this.setScale(scale);
  }

  setScale(scale: number): void {
    this.currentScale = scale;
    applyFontScale(scale);
  }
}


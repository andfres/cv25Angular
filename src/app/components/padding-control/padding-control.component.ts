import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { applyPaddingScale, getCurrentPaddingScale } from '../../config/font-config';

@Component({
  selector: 'app-padding-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="padding-control-panel print:hidden">
      <label class="padding-control-label">Padding Scale: {{ currentScale | number:'1.2-2' }}</label>
      <input 
        type="range" 
        [value]="currentScale" 
        (input)="onScaleChange($event)"
        min="0.5" 
        max="1.3" 
        step="0.05"
        class="padding-control-slider">
      <div class="padding-control-buttons">
        <button (click)="setScale(0.6)" class="padding-control-btn">60%</button>
        <button (click)="setScale(0.7)" class="padding-control-btn">70%</button>
        <button (click)="setScale(0.8)" class="padding-control-btn">80%</button>
        <button (click)="setScale(0.9)" class="padding-control-btn">90%</button>
        <button (click)="setScale(1.0)" class="padding-control-btn">100%</button>
        <button (click)="setScale(1.1)" class="padding-control-btn">110%</button>
      </div>
    </div>
  `,
  styles: [`
    .padding-control-panel {
      position: fixed;
      top: 10px;
      right: 200px; /* Position next to font control */
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      font-size: 12px;
      width: 180px;
    }
    
    .padding-control-label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .padding-control-slider {
      width: 100%;
      margin-bottom: 10px;
    }
    
    .padding-control-buttons {
      display: flex;
      gap: 3px;
      flex-wrap: wrap;
    }
    
    .padding-control-btn {
      padding: 2px 4px;
      border: 1px solid #ccc;
      background: #f5f5f5;
      border-radius: 4px;
      cursor: pointer;
      font-size: 9px;
      min-width: 25px;
    }
    
    .padding-control-btn:hover {
      background: #e5e5e5;
    }
  `]
})
export class PaddingControlComponent {
  currentScale = getCurrentPaddingScale();

  onScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const scale = parseFloat(target.value);
    this.setScale(scale);
  }

  setScale(scale: number): void {
    this.currentScale = scale;
    applyPaddingScale(scale);
  }
}


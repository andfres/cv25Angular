import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core'; // Keep TranslateModule for pipes
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  // Constructor and language methods removed, as they are now in AppComponent
}


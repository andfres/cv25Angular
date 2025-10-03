import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TimelineEntry } from '../../models/cv.model';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section>
      <h2>{{ 'sections.timeline' | translate }}</h2>
      @for (entry of sortedTimeline; track entry.startDate) {
        <div [ngClass]="{
          'experience-entry': entry.type === 'experience',
          'education-entry': entry.type === 'education'
        }">
          <h3>
            @if (entry.type === 'experience') {
              <span>{{ entry.company }}</span>
            }
            @if (entry.type === 'education') {
              <span>{{ entry.institution }}</span>
            }
          </h3>
          @if (entry.type === 'experience') {
            <p>{{ entry.position }}</p>
          }
          @if (entry.type === 'education') {
            <p>{{ entry.degree }}</p>
          }
          <p>{{ entry.period }}</p>
          @if (entry.type === 'experience' && entry.summary) {
            <p>{{ entry.summary }}</p>
          }
          @if (entry.type === 'experience' && entry.roles && entry.roles.length > 0) {
            <h4>{{ 'sections.roles' | translate }}</h4>
            <ul>
              @for (role of entry.roles; track role.startDate) {
                <li>
                  {{ role.title }} ({{ role.period }})
                  <p>{{ role.summary }}</p>
                </li>
              }
            </ul>
          }
        </div>
      }
    </section>
  `,
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit, OnChanges {
  @Input() timeline!: TimelineEntry[];
  sortedTimeline!: TimelineEntry[];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // La ordenación se realizará en ngOnChanges
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeline'] && this.timeline) {
      this.sortTimeline();
    }
  }

  sortTimeline(): void {
    this.sortedTimeline = [...this.timeline].sort((a, b) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }
}

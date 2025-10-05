import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience, Role } from '../../models/cv.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { formatPeriod } from '../../utils/date-format.utility'; // Import the utility function

@Component({
  selector: 'app-experience-timeline',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './experience-timeline.component.html',
  styleUrl: './experience-timeline.component.scss',
})
export class ExperienceTimelineComponent implements OnInit, OnChanges {
  @Input() entries!: Experience[];
  sortedEntries: Experience[] = [];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // console.log('ExperienceTimelineComponent entries:', this.entries);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entries'] && this.entries) {
      this.sortEntries();
    }
  }

  private sortEntries(): void {
    this.sortedEntries = [...this.entries].sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB.getTime() - dateA.getTime();
    });

    this.sortedEntries.forEach(entry => {
      if (entry.roles) {
        entry.roles.sort((a, b) => {
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateB.getTime() - dateA.getTime();
        });
      }
    });
  }

  // Use the utility function directly in the template
  protected readonly formatPeriod = (startDate: string, endDate: string | 'present' | undefined) =>
    formatPeriod(startDate, endDate, this.translate);
}

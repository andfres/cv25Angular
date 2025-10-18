import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience, Role, TimelineEntry, Education } from '../../models/cv.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { formatPeriod } from '../../utils/date-format.utility'; // Import the utility function
import { isExperience } from '../../utils/timeline-type.utility'; // Import isExperience type guard

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit, OnChanges {
  @Input() entries!: (Experience | Education)[]; // Aceptar ambos tipos
  sortedEntries: (Experience | Education)[] = [];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // console.log('TimelineComponent entries on init:', this.entries);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entries'] && this.entries) {
      // console.log('TimelineComponent entries on changes:', this.entries);
      // this.entries.forEach(entry => {
      //   console.log(`Entry: ${entry.company || entry.position}, Type: ${entry.type}, isExperience: ${this.isExperience(entry)}`);
      // });
      this.sortEntries();
    }
  }

  private sortEntries(): void {
    this.sortedEntries = [...this.entries].sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate) : new Date(0); // Usar Epoch para ordenar entradas sin fecha al final
      const dateB = b.startDate ? new Date(b.startDate) : new Date(0); // Usar Epoch para ordenar entradas sin fecha al final
      return dateB.getTime() - dateA.getTime();
    });

    // Si es una experiencia, ordenar también los roles
    this.sortedEntries.forEach(entry => {
      if (isExperience(entry) && entry.roles) {
        entry.roles.sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
          const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      }
    });
  }

  // Use the utility function directly in the template
  protected readonly formatPeriod = (startDate: string | undefined, endDate: string | 'present' | undefined) =>
    formatPeriod(startDate, endDate, this.translate);

  getExperienceRoles(entry: Experience | Education): Role[] | undefined {
    if (isExperience(entry)) {
      return (entry as Experience).roles;
    }
    return undefined;
  }
  protected readonly isExperience = isExperience; // Expose isExperience to the template

  getLogoClass(entry: Experience | Education): string {
    if (isExperience(entry)) {
      const experience = entry as Experience;
      if (experience.logoStyle === 'full') {
        return 'company-logo-full';
      }
    }
    return 'company-logo';
  }
}

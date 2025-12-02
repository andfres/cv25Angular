import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience, Role, Education } from '../../models/cv.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { formatPeriod } from '../../utils/date-format.utility'; // Import the utility function
import { isExperience } from '../../utils/timeline-type.utility'; // Import isExperience type guard

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './timeline.component.html',
})
export class TimelineComponent implements OnInit, OnChanges, OnDestroy {
  @Input() entries!: (Experience | Education)[]; // Aceptar ambos tipos
  sortedEntries: (Experience | Education)[] = [];
  sortByDate = false;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    // console.log('TimelineComponent entries on init:', this.entries);
    // Listen for sorting changes from control panel
    window.addEventListener('sortingChanged', this.onSortingChanged.bind(this) as EventListener);
  }

  ngOnDestroy(): void {
    // Clean up event listener
    window.removeEventListener('sortingChanged', this.onSortingChanged.bind(this) as EventListener);
  }

  onSortingChanged(event: Event): void {
    const customEvent = event as CustomEvent;
    this.sortByDate = customEvent.detail.sortByDate;
    this.sortEntries();
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
    // Respect incoming order from parent; only sort roles inside experiences
    this.sortedEntries = [...this.entries];

    // Si es una experiencia, ordenar también los roles por fecha (más reciente primero)
    this.sortedEntries.forEach((entry) => {
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
  protected readonly formatPeriod = (
    startDate: string | undefined,
    endDate: string | 'present' | undefined,
  ) => formatPeriod(startDate, endDate, this.translate);

  getExperienceRoles(entry: Experience | Education): Role[] | undefined {
    if (isExperience(entry)) {
      return (entry as Experience).roles;
    }
    return undefined;
  }
  protected readonly isExperience = isExperience;
}

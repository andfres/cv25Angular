import { Experience, Education, TimelineEntry } from '../models/cv.model';

export function isExperience(entry: TimelineEntry): entry is Experience {
  return entry.type === 'experience';
}

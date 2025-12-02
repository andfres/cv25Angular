export interface Profile {
  picture: string;
}

export interface Sections {
  [key: string]: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedin?: string;
  github?: string;
  objective: string;
}

export interface Role {
  title: string;
  startDate: string;
  endDate: string | 'present';
  summary: string;
}

export interface TimelineEntry {
  type: 'experience' | 'education';
  startDate?: string;
  endDate?: string | 'present';
  show?: boolean;
}

export interface Experience extends TimelineEntry {
  company: string;
  location: string;
  roles: Role[];
  technologies: string[];
}

export interface Education extends TimelineEntry {
  degree: string;
  institution: string;
  location: string;
  technologies: string[];
}

export interface CvData {
  profile: Profile;
  sections: Sections;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  languages: string[];
}

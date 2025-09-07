export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  objective: string;
}

export interface Role {
  title: string;
  period: string;
  startDate: string;
  endDate: string;
  summary: string;
}

export interface Experience {
  type: 'experience';
  company: string;
  location: string;
  position: string;
  period: string;
  startDate: string;
  endDate: string;
  roles?: Role[];
  summary?: string;
}

export interface Education {
  type: 'education';
  institution: string;
  degree: string;
  period: string;
  startDate: string;
  endDate: string;
}

export type TimelineEntry = Experience | Education;

export interface Skill {
  name: string;
  level: number;
}

export interface Language {
  name: string;
  level: number;
}

export interface CvData {
  HELLO: string;
  WELCOME: string;
  personalInfo: PersonalInfo;
  timeline: TimelineEntry[];
  skills: Skill[];
  languages: Language[];
  sections: { [key: string]: string };
}

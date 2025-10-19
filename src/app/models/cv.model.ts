export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  objective: string;
  image: string;
}

export interface Role {
  title: string;
  startDate: string;
  endDate: string | 'present'; // Allow 'present' string
  summary: string;
  technologies?: TechnologySkill[];
}

export interface TechnologySkill {
  name: string;
  level: number;
}

export interface TimelineEntry {
  type: 'experience' | 'education';
  startDate?: string;
  endDate?: string | 'present';
  show?: boolean; // Para ocultar entradas si show: false
}

export interface Experience extends TimelineEntry {
  company: string;
  location: string;
  position: string;
  logo?: string; // Add this line
  logoAlt?: string; // Add this line for accessibility
  logoStyle?: 'default' | 'full' | 'no-border'; // Add logo style configuration
  roles?: Role[];
  summary?: string;
  technologies?: TechnologySkill[];
  showLogo?: boolean; // If true, show company logo
}

export interface Education extends TimelineEntry {
  company: string;
  position: string;
  location: string;
  summary?: string;
  technologies?: TechnologySkill[];
}

export interface Skill {
  name: string;
  level: number;
}

export interface Language {
  name: string;
  level: number;
}

export interface CvData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
}

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
  technologies?: string[];
}

export interface Experience {
  company: string;
  location: string;
  position: string;
  startDate?: string;
  endDate?: string | 'present'; // Allow 'present' string
  roles?: Role[];
  summary?: string;
  technologies?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string | 'present'; // Allow 'present' string
  summary?: string;
  technologies?: string[];
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

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  website?: string;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  template: 'modern' | 'classic' | 'minimal';
  accentColor: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface FormState {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  jobTitle: string;
  yearsOfExperience: string;
  keySkills: string;
  previousRoles: string;
  education: string;
  template: 'modern' | 'classic' | 'minimal';
  accentColor: string;
}
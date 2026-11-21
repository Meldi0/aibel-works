export type ProjectCategory = 'posind' | 'creative' | 'mobile-school' | 'ai';

export interface ProjectAttachment {
  src: string;
  label: string;
  caption: string;
  kind?: 'ui' | 'diagram' | 'mobile';
}

export interface ProjectItem {
  id: string;
  number: string;
  code: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  categoryLabel: string;
  client: string;
  role: string;
  year: string;
  status: string;
  description: string;
  fullCaseStudy: {
    overview: string;
    challenge: string;
    architectureSolution: string;
    keyAchievements: string[];
    metrics: { label: string; value: string }[];
  };
  technologies: string[];
  metrics: string;
  image: string;
  attachments: ProjectAttachment[];
  aspect?: 'landscape' | 'portrait';
  liveUrl?: string;
  githubUrl?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'ai-creative';
  level: number;
  usedIn: string;
  detail: string;
}

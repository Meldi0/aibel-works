export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  role: string;
  year: string;
  description: string;
  fullCaseStudy: {
    overview: string;
    challenge: string;
    architectureSolution: string;
    keyAchievements: string[];
    metrics: { label: string; value: string }[];
    architectureDiagram?: string;
  };
  technologies: string[];
  metrics: string;
  image: string;
  aspect?: 'landscape' | 'portrait';
  liveUrl?: string;
  githubUrl?: string;
}

export interface MetricItem {
  number: string;
  value: string;
  label: string;
  sublabel: string;
  detail: string;
}

export interface TechNode {
  id: string;
  name: string;
  category: 'core' | 'database' | 'backend' | 'frontend' | 'spatial';
  level: string;
  description: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface ScrollHeroState {
  id: number;
  line1: string;
  line2: string;
  category: string;
  description: string;
  stageProgress: [number, number];
}

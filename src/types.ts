export interface Milestone {
  id: string;
  title: string;
  subtitle: string;
  status: 'completo' | 'foco' | 'futuro';
  year: string;
  description: string;
  challengeSolved: string;
  technicalImpact: string;
  codeSnippet?: string;
  category: 'frontend' | 'backend' | 'devops' | 'architecture';
}

export interface Experiment {
  id: string;
  title: string;
  tag: string;
  problem: string;
  process: string;
  solution: string;
  learnings: string[];
  interactiveType: 'rate-limiter' | 'state-machine' | 'graph-nodes';
  demoMetrics: {
    label: string;
    value: string;
    status: 'neutral' | 'success' | 'warning';
  }[];
}

export interface ToolCategory {
  name: string;
  status: 'active' | 'learning';
  items: {
    name: string;
    level: 'primária' | 'avançada' | 'absorvendo' | 'fundacional';
    utility: string;
  }[];
}

export interface FutureGoal {
  title: string;
  timeframe: string;
  description: string;
  milestones: string[];
  codeName: string;
}

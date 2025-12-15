export interface UserProfile {
  age: string;
  company: string;
  industry: string;
  position: string;
  years: string;
  resumeFile: File | null;
  resumeBase64: string | null;
}

export interface Persona {
  industry_keywords: string[];
  career_stage: string;
  core_management_domains: string[];
  unique_research_advantage: string;
  suitable_thesis_types: string[];
  data_access_assessment: string;
}

export interface ThesisTopic {
  title: string;
  background: string;
  research_questions: string[];
  theoretical_perspective: string;
  data_sources: string;
  methodology: string;
  academic_value: string;
  practical_value: string;
  advisor_acceptance_reason: string;
  feasibility: "High" | "Medium" | "Low" | "高" | "中" | "低";
}

export enum Step {
  INPUT = 0,
  PERSONA = 1,
  TOPICS = 2,
  OUTLINE = 3,
  FEASIBILITY = 4,
}

export interface AppState {
  step: Step;
  user: UserProfile;
  persona: Persona | null;
  topics: ThesisTopic[];
  selectedTopic: ThesisTopic | null;
  outline: string;
  feasibilityReport: string;
  isLoading: boolean;
  error: string | null;
}

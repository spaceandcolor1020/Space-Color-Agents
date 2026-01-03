
export type LensId = 'recruiter' | 'engineer' | 'designer' | 'source';

export interface Lens {
  headline: string;
  content: string;
  reasoning: string;
  status: string;
  artifact?: string;
}

export interface ProjectData {
  meta: {
    title: string;
    role: string;
    timeline: string;
    awards: string[];
  };
  lenses: {
    [key in LensId]: Lens;
  };
}

export interface GeminiResponse {
  meta: ProjectData['meta'];
  lenses: ProjectData['lenses'];
}
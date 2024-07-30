export interface ProjectType {
  id: number;
  title: string;
  category: string[];
  description: string;
  year: number;
}

export interface Project {
  slug: { current: string };
  title: string;
}

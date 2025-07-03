export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  skills: string[];
  details: {
    goal: string;
    process: string;
    outcome: string;
  };
};

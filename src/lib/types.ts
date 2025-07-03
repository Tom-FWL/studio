export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  mediaUrl: string;
  mediaHint: string;
  mediaType: 'image' | 'video';
  audioUrl?: string;
  skills: string[];
  details: {
    goal: string;
    process: string;
    outcome: string;
  };
};

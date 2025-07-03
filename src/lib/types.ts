export type Project = {
  id: string; // Firestore document ID
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
  createdAt?: string | null;
  likes?: number;
};

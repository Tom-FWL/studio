export type Project = {
  id: string; // Firestore document ID
  slug: string;
  title: string;
  category: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string; // Optional URL for video thumbnails
  pdfUrl?: string;
  mediaHint: string;
  mediaType: 'image' | 'video' | 'audio';
  skills: string[];
  details: {
    goal: string;
    process: string;
    outcome: string;
  };
  createdAt?: string | null;
  likes?: number;
  isDeleted: boolean;
  deletedAt: string | null;
};


'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types';
import { ArrowRight, Heart, Music, Video } from 'lucide-react';
import { likeProject } from '@/lib/project-service';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { toast } = useToast();

  const [likes, setLikes] = useState(project.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);

  useEffect(() => {
    try {
      const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
      if (likedProjects.includes(project.id)) {
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Could not parse liked projects from localStorage", error);
      localStorage.setItem('likedProjects', '[]');
    }
  }, [project.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); 
    if (isLiked || isProcessingLike) return;

    setIsProcessingLike(true);
    
    try {
      await likeProject(project.id);
      
      const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
      localStorage.setItem('likedProjects', JSON.stringify([...likedProjects, project.id]));
      
      setLikes(prevLikes => prevLikes + 1);
      setIsLiked(true);
      
      toast({
        title: "Thanks for liking!",
        description: `You've shown your appreciation for "${project.title}".`,
      });
    } catch (error) {
      console.error("Failed to like project:", error);
      toast({
        title: "Error",
        description: "Could not register your like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingLike(false);
    }
  };

  const likeButton = (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleLike}
      disabled={isLiked || isProcessingLike}
      className={cn(
        "relative z-10 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors",
        !isLiked && "hover:text-primary",
        isLiked && "cursor-default text-red-500"
      )}
      aria-label="Like project"
    >
      <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
      <span>{likes}</span>
    </motion.button>
  );

  return (
    <Link href={`/projects/${project.slug}`} className="block h-full">
      <Card className="group h-full cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
        <CardHeader className="p-0">
          <div className="aspect-video overflow-hidden bg-black relative">
            {project.mediaType === 'image' ? (
              <Image
                src={project.mediaUrl}
                alt={project.title}
                width={600}
                height={400}
                data-ai-hint={project.mediaHint}
                className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            ) : project.mediaType === 'video' ? (
               <>
                <Image
                  src={project.thumbnailUrl || "https://placehold.co/600x400.png"}
                  alt={`${project.title} video thumbnail`}
                  width={600}
                  height={400}
                  data-ai-hint="video play button"
                  className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Video className="h-16 w-16 text-white/80" />
                </div>
              </>
            ) : (
               <>
                <Image
                  src="https://placehold.co/600x400.png"
                  alt={project.title}
                  width={600}
                  height={400}
                  data-ai-hint="music audio track"
                  className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Music className="h-16 w-16 text-white/80" />
                </div>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Badge variant="secondary" className="mb-2">
            {project.category}
          </Badge>
          <CardTitle className="mb-2 font-headline text-xl">{project.title}</CardTitle>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          <div className="flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center text-primary">
              View Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
            {likeButton}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

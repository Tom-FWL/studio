
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types';
import { ArrowRight, Mail, Heart, Music } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
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
        "flex items-center gap-1.5 text-sm text-muted-foreground transition-colors",
        !isLiked && "hover:text-primary",
        isLiked && "cursor-default",
        likes > 0 && "text-red-500"
      )}
      aria-label="Like project"
    >
      <Heart className={cn("h-4 w-4", likes > 0 && "fill-current")} />
      <span>{likes}</span>
    </motion.button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
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
                <video
                  key={project.mediaUrl}
                  src={project.mediaUrl}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
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
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 md:p-8">
            <div className="mb-8 rounded-lg overflow-hidden shadow-xl bg-muted flex items-center justify-center">
             {project.mediaType === 'image' && (
                <Image
                  src={project.mediaUrl}
                  alt={`Showcase image for ${project.title}`}
                  width={1200}
                  height={675}
                  className="w-full object-cover"
                  data-ai-hint={project.mediaHint}
                />
              )}
              {project.mediaType === 'video' && (
                 <video
                  src={project.mediaUrl}
                  width={1200}
                  height={675}
                  className="w-full object-cover"
                  autoPlay
                  loop
                  controls
                  muted
                />
              )}
              {project.mediaType === 'audio' && (
                <div className="p-8 w-full aspect-video flex flex-col items-center justify-center bg-black text-white">
                  <Music className="h-24 w-24 text-primary mb-4" />
                  <audio controls className="w-full max-w-lg">
                    <source src={project.mediaUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>

            <DialogHeader className="mb-8 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                      <Badge variant="secondary" className="mb-2">
                          {project.category}
                      </Badge>
                      <DialogTitle className="text-4xl md:text-5xl font-headline">
                          {project.title}
                      </DialogTitle>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground shrink-0 pt-2">
                      <Heart className={cn("h-5 w-5", likes > 0 ? "text-red-500 fill-current" : "")} />
                      <span className="font-semibold text-lg">{likes} Likes</span>
                  </div>
              </div>
            </DialogHeader>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <aside className="md:col-span-1">
                  <h3 className="text-xl font-headline border-b pb-2 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </aside>

                <div className="md:col-span-2 space-y-6 font-body text-lg text-foreground/80">
                  <div>
                    <h3 className="text-2xl font-headline text-foreground mb-3">Project Goal</h3>
                    <p>{project.details.goal}</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline text-foreground mb-3">The Process</h3>
                    <p>{project.details.process}</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline text-foreground mb-3">Outcome</h3>
                    <p>{project.details.outcome}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center border-t pt-8">
                 <Button asChild size="lg">
                    <Link href={{ pathname: '/contact', query: { project: project.title } }}>
                      <Mail className="mr-2 h-4 w-4" />
                      Request More Info
                    </Link>
                  </Button>
              </div>

            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

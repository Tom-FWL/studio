'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types';
import { ArrowRight, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group h-full cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
          <CardHeader className="p-0">
            <div className="aspect-video overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.title}
                width={600}
                height={400}
                data-ai-hint={project.imageHint}
                className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Badge variant="secondary" className="mb-2">
              {project.category}
            </Badge>
            <CardTitle className="mb-2 font-headline text-xl">{project.title}</CardTitle>
            <p className="mb-4 text-sm text-muted-foreground">{project.description}</p>
            <div className="flex items-center text-sm font-semibold text-primary">
              View Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 md:p-8">
            <div className="mb-8 rounded-lg overflow-hidden shadow-xl">
              <Image
                src={project.imageUrl}
                alt={`Showcase image for ${project.title}`}
                width={1200}
                height={675}
                className="w-full object-cover"
                data-ai-hint={project.imageHint}
              />
            </div>

            <DialogHeader className="mb-8 text-center">
              <Badge variant="secondary" className="mx-auto mb-4 w-fit text-sm">
                {project.category}
              </Badge>
              <DialogTitle className="text-4xl md:text-5xl">{project.title}</DialogTitle>
            </DialogHeader>

            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-3 gap-12 mb-8">
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

                <div className="md:col-span-2 space-y-8 font-body text-lg text-foreground/80">
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
              
              {project.audioUrl && (
                <div className="my-8 border-t pt-8">
                  <h3 className="text-2xl font-headline text-foreground mb-3 text-center">Project Audio</h3>
                    <audio controls className="w-full">
                    <source src={project.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              <div className="text-center border-t pt-8">
                 <Button asChild size="lg">
                    <a href={`mailto:hello@artfolio.com?subject=Inquiry about the '${project.title}' project`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Request More Info
                    </a>
                  </Button>
              </div>

            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

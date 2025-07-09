import { getProjects, getProjectBySlug } from '@/lib/project-service';
import type { Project } from '@/lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Music, FileDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project: Project | undefined = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 md:py-20">
       <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Link>
        </Button>
      </div>

      <header className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4 text-sm">{project.category}</Badge>
        <h1 className="text-4xl md:text-6xl font-headline text-foreground">{project.title}</h1>
      </header>

      <div className="mb-12 rounded-lg overflow-hidden shadow-xl bg-muted flex items-center justify-center">
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

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          <aside className="md:col-span-1">
            <h3 className="text-xl font-headline border-b pb-2 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <Badge key={skill} variant="outline">{skill}</Badge>
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
      </div>
      
      {project.pdfUrl && (
        <div className="mt-16 text-center">
          <Button asChild size="lg">
            <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer" download>
              <FileDown className="mr-2 h-5 w-5" />
              Download Full Case Study
            </a>
          </Button>
        </div>
      )}

    </article>
  );
}

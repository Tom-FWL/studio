import { projects } from '@/lib/data';
import type { Project } from '@/lib/types';
import { notFound } from 'next/navigation';
import { EditProjectForm } from '@/components/admin/edit-project-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type EditProjectPageProps = {
  params: {
    slug: string;
  };
};

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const project: Project | undefined = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline text-foreground">Edit Project</h1>
        <p className="text-lg text-muted-foreground mt-2">Editing: <span className="font-semibold text-primary">{project.title}</span></p>
      </header>
      <div className="max-w-2xl mx-auto">
        <EditProjectForm project={project} />
      </div>
    </div>
  );
}

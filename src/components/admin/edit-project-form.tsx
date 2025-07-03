'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import type { Project } from '@/lib/types';
import { onEditProject } from '@/app/admin/projects/[slug]/edit/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Saving...' : (
        <>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </>
      )}
    </Button>
  );
}

type EditProjectFormProps = {
  project: Project;
};

export function EditProjectForm({ project }: EditProjectFormProps) {
  const [state, formAction] = useActionState(onEditProject, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // The server action now redirects on success, so we only need to handle error messages.
    if (state.message && state.message !== 'success') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <form ref={formRef} action={formAction}>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 pr-4">
            <div className="space-y-4">
              <input type="hidden" name="slug" value={project.slug} />
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" name="title" defaultValue={project.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={project.category} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input id="skills" name="skills" defaultValue={project.skills.join(', ')} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mediaUrl">Media URL (Image or .mp4 Video)</Label>
                <Input id="mediaUrl" name="mediaUrl" defaultValue={project.mediaUrl} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mediaHint">Media AI Hint</Label>
                <Input id="mediaHint" name="mediaHint" defaultValue={project.mediaHint} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={project.description}
                  className="min-h-[60px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Project Goal</Label>
                <Textarea
                  id="goal"
                  name="goal"
                  defaultValue={project.details.goal}
                  className="min-h-[80px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="process">The Process</Label>
                <Textarea
                  id="process"
                  name="process"
                  defaultValue={project.details.process}
                  className="min-h-[80px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outcome">Outcome</Label>
                <Textarea
                  id="outcome"
                  name="outcome"
                  defaultValue={project.details.outcome}
                  className="min-h-[80px]"
                  required
                />
              </div>
              {state.message && state.message !== 'success' && (
                  <div className="text-destructive text-sm">
                    <p>{state.message}</p>
                  </div>
                )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-6">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}

'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { onAddProject } from '@/app/admin/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Project
        </>
      )}
    </Button>
  );
}

export function AddProjectForm({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
  const [state, formAction] = useActionState(onAddProject, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.message === 'success') {
      toast({
        title: 'Project Added',
        description: 'The new project has been added successfully.',
      });
      formRef.current?.reset();
      setDialogOpen(false);
      router.refresh();
    } else if (state.message && state.message !== 'success') {
      toast({
        title: 'Error Adding Project',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, setDialogOpen, router]);

  return (
    <Card className="border-0 shadow-none">
    <CardHeader>
        <CardTitle>Add New Project</CardTitle>
        <CardDescription>Fill in the details for your new portfolio piece.</CardDescription>
    </CardHeader>
    <form ref={formRef} action={formAction}>
        <CardContent>
            <ScrollArea className="h-96 pr-6">
                <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input id="title" name="title" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Input id="skills" name="skills" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mediaUrl">Media URL (Image or .mp4 Video)</Label>
                    <Input id="mediaUrl" name="mediaUrl" defaultValue="https://placehold.co/600x400.png" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mediaHint">Media AI Hint</Label>
                    <Input id="mediaHint" name="mediaHint" placeholder="e.g. elegant flowers" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea id="description" name="description" className="min-h-[60px]" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="goal">Project Goal</Label>
                    <Textarea id="goal" name="goal" className="min-h-[80px]" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="process">The Process</Label>
                    <Textarea id="process" name="process" className="min-h-[80px]" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="outcome">Outcome</Label>
                    <Textarea id="outcome" name="outcome" className="min-h-[80px]" required />
                </div>
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

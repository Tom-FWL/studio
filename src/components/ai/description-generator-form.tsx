'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { onGenerate } from '@/app/admin/generate-description/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Clipboard } from 'lucide-react';

const initialState = {
  message: '',
  description: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Generating...' : <>
      <Wand2 className="mr-2 h-4 w-4" /> Generate Description
      </>}
    </Button>
  );
}

export function DescriptionGeneratorForm() {
  const [state, formAction] = useFormState(onGenerate, initialState);
  const [description, setDescription] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === 'success' && state.description) {
      setDescription(state.description);
      formRef.current?.reset();
    } else if (state.message && state.message !== 'success') {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    toast({
        title: "Copied!",
        description: "The description has been copied to your clipboard.",
      });
  }

  return (
    <div className="space-y-8">
      <Card>
        <form ref={formRef} action={formAction}>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Provide the information for the AI to work its magic.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input id="projectName" name="projectName" placeholder="e.g., Ethereal Bloom" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectCategory">Project Category</Label>
              <Input id="projectCategory" name="projectCategory" placeholder="e.g., Branding, Web Design" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectSkills">Skills Used (comma-separated)</Label>
              <Input id="projectSkills" name="projectSkills" placeholder="e.g., Illustrator, Figma, React" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input id="targetAudience" name="targetAudience" placeholder="e.g., High-end clientele, art enthusiasts" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDescriptionDetails">Project Details</Label>
              <Textarea
                id="projectDescriptionDetails"
                name="projectDescriptionDetails"
                placeholder="Describe the project goal, process, and outcome..."
                className="min-h-[120px]"
                required
              />
            </div>
            {state.issues && (
              <div className="text-destructive text-sm">
                <ul>
                  {state.issues.map((issue) => (
                    <li key={issue}>- {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {description && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Description</CardTitle>
            <CardDescription>Here is the AI-crafted description for your project.</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={handleCopy}>
                <Clipboard className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

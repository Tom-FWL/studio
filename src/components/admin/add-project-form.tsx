
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { addProject } from '@/lib/project-service';
import { z } from 'zod';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Progress } from '@/components/ui/progress';

const projectSchema = z.object({
  title: z.string().min(1, "Title is required."),
  category: z.string().min(1, "Category is required."),
  skills: z.string().min(1, "Please list at least one skill."),
  mediaHint: z.string().optional(),
  description: z.string().min(10, "Description is required."),
  goal: z.string().min(10, "Goal is required."),
  process: z.string().min(10, "Process is required."),
  outcome: z.string().min(10, "Outcome is required."),
});

const initialFormData = {
    title: '', category: '', skills: '',
    mediaHint: '', description: '', goal: '', process: '', outcome: '',
};

export function AddProjectForm({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  useEffect(() => {
    const result = projectSchema.safeParse(formData);
    setIsFormValid(result.success && file !== null);
  }, [formData, file]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setMediaPreview(URL.createObjectURL(selectedFile));
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFile(null);
    setMediaPreview(null);
    setUploadProgress(null);
    formRef.current?.reset();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth.currentUser) {
        toast({ title: 'Authentication Error', description: 'You must be logged in to upload files. Please log out and log in again.', variant: 'destructive' });
        setIsLoading(false);
        return;
    }

    if (!file) {
        toast({ title: 'Media file is required.', variant: 'destructive' });
        setIsLoading(false);
        return;
    }

    const validationResult = projectSchema.safeParse(formData);
    if (!validationResult.success) {
      toast({
        title: 'Invalid Form Data',
        description: 'Please fill out all required fields correctly.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }
    
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `media/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
        },
        (error) => {
            console.error("Upload failed:", error);
            toast({ title: "Upload Failed", description: "Could not upload media file. Check console for details.", variant: "destructive" });
            setIsLoading(false);
            setUploadProgress(null);
        },
        async () => {
            try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                let mediaType: 'image' | 'video' | 'audio' = 'image';
                if (file.type.startsWith('video/')) mediaType = 'video';
                else if (file.type.startsWith('audio/')) mediaType = 'audio';

                const newProjectData = {
                  ...validationResult.data,
                  skills: validationResult.data.skills.split(",").map(s => s.trim()),
                  mediaUrl: downloadURL,
                  mediaType,
                  mediaHint: validationResult.data.mediaHint || 'new project',
                  details: {
                    goal: validationResult.data.goal,
                    process: validationResult.data.process,
                    outcome: validationResult.data.outcome,
                  }
                };

                await addProject(newProjectData as any);
                
                toast({ title: 'Project Added', description: 'The new project has been added successfully.' });
                resetForm();
                setDialogOpen(false);
                router.refresh();

            } catch (error) {
                console.error("Failed to add project:", error);
                toast({ title: 'Error Adding Project', description: 'Failed to add project to the database.', variant: 'destructive' });
            } finally {
                setIsLoading(false);
                setUploadProgress(null);
            }
        }
    );
  }

  return (
    <>
      <DialogHeader className="p-6">
        <DialogTitle>Add New Project</DialogTitle>
        <DialogDescription>Fill in the details for your new portfolio piece. Fields marked with * are required.</DialogDescription>
      </DialogHeader>
      <form ref={formRef} onSubmit={handleSubmit}>
          <div className="p-6 pt-0">
              <ScrollArea className="h-96 pr-6">
                  <div className="space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="title">Project Title *</Label>
                      <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Ethereal Branding" required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Web Design" required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="skills">Skills (comma-separated) *</Label>
                      <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., Figma, Next.js, Illustrator" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media">Media File (Image, Video, Audio) *</Label>
                    <Input id="media" name="media" type="file" accept="image/*,video/*,audio/*" onChange={handleFileChange} required />
                    {uploadProgress !== null && (
                      <div className="mt-2 space-y-1">
                        <Label className='text-xs'>Upload Progress</Label>
                        <Progress value={uploadProgress} />
                      </div>
                    )}
                    {mediaPreview && file && (
                        <div className="mt-2 rounded-md border p-2 bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-2">Media Preview:</p>
                            {file.type.startsWith('image/') && <img src={mediaPreview} alt="Media preview" className="rounded-md object-cover w-full h-auto max-h-48" />}
                            {file.type.startsWith('video/') && <video src={mediaPreview} controls className="rounded-md w-full h-auto max-h-48" />}
                            {file.type.startsWith('audio/') && <audio src={mediaPreview} controls className="w-full" />}
                        </div>
                    )}
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="mediaHint">Image Description (for AI &amp; SEO)</Label>
                      <Input id="mediaHint" name="mediaHint" value={formData.mediaHint} onChange={handleChange} placeholder="e.g., elegant flowers on a desk" />
                      <p className="text-xs text-muted-foreground">Describe the image for search engines and AI image tools.</p>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="description">Short Description *</Label>
                      <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="min-h-[60px]" placeholder="A brief, one-sentence summary of the project." required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="goal">Project Goal *</Label>
                      <Textarea id="goal" name="goal" value={formData.goal} onChange={handleChange} className="min-h-[80px]" placeholder="What was the main objective of this project?" required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="process">The Process *</Label>
                      <Textarea id="process" name="process" value={formData.process} onChange={handleChange} className="min-h-[80px]" placeholder="Briefly describe the steps you took to complete the project." required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="outcome">Outcome *</Label>
                      <Textarea id="outcome" name="outcome" value={formData.outcome} onChange={handleChange} className="min-h-[80px]" placeholder="What was the final result or impact?" required />
                  </div>
                  </div>
              </ScrollArea>
          </div>
          <div className="flex items-center p-6 pt-6">
              <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadProgress !== null ? `Uploading... ${Math.round(uploadProgress)}%` : 'Processing...'}
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                  </>
                )}
              </Button>
          </div>
      </form>
    </>
  );
}

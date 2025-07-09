
'use client';

import { useState, type FormEvent } from 'react';
import type { Project } from '@/lib/types';
import { updateProject } from '@/lib/project-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, Music } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Progress } from '@/components/ui/progress';

type EditProjectFormProps = {
  project: Project;
};

const editSchema = z.object({
    title: z.string().min(2, "Title is required."),
    category: z.string().min(2, "Category is required."),
    skills: z.string().min(2, "Please list at least one skill."),
    mediaHint: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters long."),
    goal: z.string().min(10, "Goal must be at least 10 characters long."),
    process: z.string().min(10, "Process must be at least 10 characters long."),
    outcome: z.string().min(10, "Outcome must be at least 10 characters long."),
});


export function EditProjectForm({ project }: EditProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: project.title,
    category: project.category,
    skills: project.skills.join(', '),
    mediaHint: project.mediaHint || '',
    description: project.description,
    goal: project.details.goal,
    process: project.details.process,
    outcome: project.details.outcome,
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(project.mediaUrl);
  const [mediaTypePreview, setMediaTypePreview] = useState(project.mediaType);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState<number | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(project.thumbnailUrl || null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUploadProgress, setPdfUploadProgress] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setMediaPreview(URL.createObjectURL(selectedFile));
      if (selectedFile.type.startsWith('video/')) {
        setMediaTypePreview('video');
      } else if (selectedFile.type.startsWith('audio/')) {
        setMediaTypePreview('audio');
      } else {
        setMediaTypePreview('image');
        setThumbnailFile(null);
        setThumbnailPreview(null);
      }
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setThumbnailFile(selectedFile);
      setThumbnailPreview(URL.createObjectURL(selectedFile));
    }
  };
  
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        setPdfFile(selectedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const uploadFile = (fileToUpload: File, path: string, setProgress: (p: number | null) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          setProgress(null);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setProgress(null);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth.currentUser) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to upload files.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    const result = editSchema.safeParse(formData);
    if (!result.success) {
      toast({ title: 'Invalid Form Data', description: result.error.issues.map(i => i.message).join(', '), variant: 'destructive' });
      setIsLoading(false);
      return;
    }
    
    const { title, category, skills, mediaHint, description, goal, process, outcome } = result.data;
    
    const projectUpdateData: Partial<Project> = {
      title,
      category,
      skills: skills.split(',').map(s => s.trim()),
      mediaHint: mediaHint || 'edited project',
      description,
      details: { goal, process, outcome },
    };

    try {
        if (file) {
            const mediaUrl = await uploadFile(file, `media/${project.id}/${file.name}`, setUploadProgress);
            projectUpdateData.mediaUrl = mediaUrl;
            projectUpdateData.mediaType = mediaTypePreview;
        }

        if (thumbnailFile) {
            const thumbnailUrl = await uploadFile(thumbnailFile, `media/${project.id}/${thumbnailFile.name}`, setThumbnailUploadProgress);
            projectUpdateData.thumbnailUrl = thumbnailUrl;
        }
        
        if (pdfFile) {
            const pdfUrl = await uploadFile(pdfFile, `media/${project.id}/pdfs/${pdfFile.name}`, setPdfUploadProgress);
            projectUpdateData.pdfUrl = pdfUrl;
        }

        await updateProject(project.id, projectUpdateData);
        toast({ title: 'Project Saved!', description: 'Your changes have been successfully saved.' });
        router.refresh();
        router.push('/admin/dashboard');
    } catch (error) {
        console.error("Failed to update project:", error);
        toast({ title: 'Error Saving Project', description: 'Failed to save project. Please try again.', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Current Media</Label>
                <div className="rounded-md border p-2 bg-muted/50">
                    {mediaPreview && (
                      <>
                        {mediaTypePreview === 'image' && <img src={mediaPreview} alt="Media preview" className="rounded-md object-cover w-full h-auto max-h-48" />}
                        {mediaTypePreview === 'video' && <video src={mediaPreview} controls className="rounded-md w-full h-auto max-h-48" />}
                        {mediaTypePreview === 'audio' && (
                           <div className="flex items-center gap-4 p-2">
                            <Music className="h-8 w-8 text-muted-foreground" />
                            <audio src={mediaPreview} controls className="w-full" />
                          </div>
                        )}
                      </>
                    )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="media">Upload New Media (Optional)</Label>
                <Input id="media" name="media" type="file" accept="image/*,video/*,audio/*" onChange={handleFileChange} />
                 {uploadProgress !== null && (
                      <div className="mt-2 space-y-1">
                        <Label className='text-xs'>Upload Progress</Label>
                        <Progress value={uploadProgress} />
                      </div>
                    )}
              </div>
              {mediaTypePreview === 'video' && (
                <div className="space-y-2 pt-2 border-t mt-4">
                  <Label htmlFor="thumbnail">Thumbnail Image (Optional)</Label>
                  <p className="text-xs text-muted-foreground">A static image to show on the portfolio grid instead of the video.</p>
                  
                  {thumbnailPreview && (
                       <div className="mt-2 rounded-md border p-2 bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-2">Thumbnail Preview:</p>
                          <img src={thumbnailPreview} alt="Thumbnail preview" className="rounded-md object-cover w-full h-auto max-h-48" />
                      </div>
                  )}

                  <Input id="thumbnail" name="thumbnail" type="file" accept="image/png, image/jpeg" onChange={handleThumbnailChange} />
                  {thumbnailUploadProgress !== null && (
                      <div className="mt-2 space-y-1">
                          <Label className='text-xs'>Thumbnail Upload Progress</Label>
                          <Progress value={thumbnailUploadProgress} />
                      </div>
                  )}
                </div>
              )}
               <div className="space-y-2 pt-2 border-t mt-4">
                <Label htmlFor="pdf">Supporting PDF (Optional)</Label>
                {project.pdfUrl && !pdfFile && (
                    <div className="text-sm text-muted-foreground">
                        Current PDF: <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{decodeURIComponent(project.pdfUrl.split('/').pop()?.split('?')[0] || '')}</a>
                    </div>
                )}
                <p className="text-xs text-muted-foreground">{project.pdfUrl ? 'Upload a new file to replace the current one.' : 'Upload a case study or supporting document.'}</p>
                <Input id="pdf" name="pdf" type="file" accept="application/pdf" onChange={handlePdfFileChange} />
                {pdfUploadProgress !== null && (
                    <div className="mt-2 space-y-1">
                        <Label className='text-xs'>PDF Upload Progress</Label>
                        <Progress value={pdfUploadProgress} />
                    </div>
                )}
                {pdfFile && (
                    <div className="mt-2 rounded-md border p-2 bg-muted/50">
                        <p className="text-sm text-muted-foreground">New PDF: {pdfFile.name}</p>
                    </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mediaHint">Media AI Hint</Label>
                <Input id="mediaHint" name="mediaHint" value={formData.mediaHint} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="min-h-[60px]" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Project Goal</Label>
                <Textarea id="goal" name="goal" value={formData.goal} onChange={handleChange} className="min-h-[80px]" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="process">The Process</Label>
                <Textarea id="process" name="process" value={formData.process} onChange={handleChange} className="min-h-[80px]" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outcome">Outcome</Label>
                <Textarea id="outcome" name="outcome" value={formData.outcome} onChange={handleChange} className="min-h-[80px]" required />
              </div>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {uploadProgress !== null || thumbnailUploadProgress !== null || pdfUploadProgress !== null ? 'Uploading...' : 'Saving...'}
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                )}
            </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

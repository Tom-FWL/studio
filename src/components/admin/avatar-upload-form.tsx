
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { updateProfileSettings, SETTINGS_COLLECTION } from '@/lib/settings-service';
import { useRouter } from 'next/navigation';

export function AvatarUploadForm({ currentAvatar, setDialogOpen }: { currentAvatar?: string; setDialogOpen: (open: boolean) => void }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(currentAvatar || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setMediaPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: 'No file selected', description: 'Please choose an image to upload.', variant: 'destructive' });
      return;
    }
    if (!auth.currentUser) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to upload.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    const storageRef = ref(storage, `settings/profile-avatar`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        toast({ title: "Upload Failed", description: "Could not upload the avatar. Please try again.", variant: "destructive" });
        setIsLoading(false);
        setUploadProgress(null);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfileSettings({ avatarUrl: downloadURL });
          toast({ title: 'Avatar Updated!', description: 'Your new profile picture has been saved.' });
          setDialogOpen(false);
          router.refresh();
        } catch (error) {
          console.error("Failed to update avatar settings in Firestore:", error);
          let errorMessage = "An unknown error occurred.";
          if (error instanceof Error) {
            // Check for Firestore permission error
            if (error.message.includes("Missing or insufficient permissions")) {
              errorMessage = `Permission denied. Please check your Firestore security rules to allow writes to the '${SETTINGS_COLLECTION}' collection for authenticated users.`;
            } else {
              errorMessage = error.message;
            }
          }
          toast({
            title: 'Error Saving Avatar',
            description: `Upload succeeded, but saving the URL failed. Reason: ${errorMessage}`,
            variant: 'destructive',
            duration: 10000,
          });
        } finally {
          setIsLoading(false);
          setUploadProgress(null);
        }
      }
    );
  };

  return (
    <>
      <DialogHeader className="p-6 pb-4">
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogDescription>Upload a new image to be displayed on your "About Me" page. The old image will be replaced.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="p-6 pt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avatar">New Avatar Image</Label>
            <Input id="avatar" name="avatar" type="file" accept="image/*" onChange={handleFileChange} required />
          </div>

          {uploadProgress !== null && (
            <div className="space-y-1">
              <Label className='text-xs'>Upload Progress</Label>
              <Progress value={uploadProgress} />
            </div>
          )}

          {mediaPreview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto border-2 border-primary">
                <Image src={mediaPreview} alt="Avatar preview" layout="fill" objectFit="cover" />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center pt-6 mt-4">
          <Button type="submit" className="w-full" disabled={isLoading || !file}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadProgress !== null ? `Uploading... ${Math.round(uploadProgress)}%` : 'Processing...'}
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" /> Save and Upload
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

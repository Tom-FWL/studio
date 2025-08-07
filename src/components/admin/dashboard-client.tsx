
'use client';

import { useState, useEffect } from 'react';
import type { Project } from '@/lib/types';
import { ProjectsTable } from '@/components/admin/projects-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Shield, LogOut, UserCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AddProjectForm } from '@/components/admin/add-project-form';
import { useAuth } from '@/context/auth-context';
import { AvatarUploadForm } from './avatar-upload-form';
import { getProfileSettings } from '@/lib/settings-service';
import { signInWithGoogle } from '@/lib/firebase';

export function DashboardClient({ projects: initialProjects }: { projects: Project[] }) {
  const [isAddProjectOpen, setAddProjectOpen] = useState(false);
  const [isAvatarUploadOpen, setAvatarUploadOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<string | undefined>();
  const { logout, user } = useAuth();

  useEffect(() => {
    if (user) {
      getProfileSettings().then(settings => {
        if (settings.url) {
          setCurrentAvatar(settings.url);
        }
      });
    }
  }, [user, isAvatarUploadOpen]);

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">Admin Panel</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
                <Link href="/admin/bin">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Bin
                </Link>
            </Button>
            <Dialog open={isAvatarUploadOpen} onOpenChange={setAvatarUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Update Avatar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md p-0">
                <AvatarUploadForm currentAvatar={currentAvatar} setDialogOpen={setAvatarUploadOpen} />
              </DialogContent>
            </Dialog>

            <Button variant="ghost" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-headline">Manage Projects</h1>
          <Dialog open={isAddProjectOpen} onOpenChange={setAddProjectOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0">
              <AddProjectForm setDialogOpen={setAddProjectOpen} />
            </DialogContent>
          </Dialog>
        </div>
        <ProjectsTable projects={initialProjects} />
      </main>
    </div>
  );
}

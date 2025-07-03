'use client';

import { useState } from 'react';
import type { Project } from '@/lib/types';
import { ProjectsTable } from '@/components/admin/projects-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AddProjectForm } from '@/components/admin/add-project-form';
import { useAuth } from '@/context/auth-context';

export function DashboardClient({ projects: initialProjects }: { projects: Project[] }) {
  const [isAddProjectOpen, setAddProjectOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">Admin Panel</span>
          </Link>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
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

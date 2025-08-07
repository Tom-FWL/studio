
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Restore, Trash2, Hourglass, Info } from 'lucide-react';
import { deleteProject, restoreProject } from '@/lib/project-service';
import { formatDistanceToNow, differenceInDays } from 'date-fns';

export function BinClient({ projects }: { projects: Project[] }) {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();
  const router = useRouter();

  const handleAction = async (projectId: string, action: 'restore' | 'delete') => {
    setLoadingStates(prev => ({ ...prev, [projectId]: true }));

    try {
      if (action === 'restore') {
        await restoreProject(projectId);
        toast({ title: 'Project Restored', description: 'The project has been successfully restored.' });
      } else {
        await deleteProject(projectId);
        toast({ title: 'Project Deleted Permanently', description: 'The project has been removed forever.' });
      }
      router.refresh();
    } catch (error) {
      console.error(`Failed to ${action} project:`, error);
      toast({
        title: `Error`,
        description: `Could not ${action} the project. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [projectId]: false }));
    }
  };
  
  const getDeletionStatus = (deletedAt: string | null): string => {
    if (!deletedAt) return 'Pending deletion';
    const deletionDate = new Date(deletedAt);
    const daysRemaining = 30 - differenceInDays(new Date(), deletionDate);
    if (daysRemaining <= 0) return 'Deleting soon';
    return `in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`;
  }

  if (projects.length === 0) {
    return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Info className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">The Bin is Empty</h2>
            <p className="mt-2 text-muted-foreground">Soft-deleted projects will appear here.</p>
        </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Deleted At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>
                {project.deletedAt ? formatDistanceToNow(new Date(project.deletedAt), { addSuffix: true }) : 'N/A'}
              </TableCell>
               <TableCell>
                <Badge variant="secondary" className="gap-1.5">
                    <Hourglass className="h-3 w-3" />
                    {getDeletionStatus(project.deletedAt)}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleAction(project.id, 'restore')}
                    disabled={loadingStates[project.id]}
                >
                  <Restore className="mr-2 h-4 w-4" /> Restore
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={loadingStates[project.id]}
                     >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project
                        &quot;{project.title}&quot; and all associated data from the servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleAction(project.id, 'delete')}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Yes, delete it forever
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

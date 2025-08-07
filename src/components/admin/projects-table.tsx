
"use client";

import type { Project } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { Edit, Trash2, Video } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { softDeleteProject } from "@/lib/project-service";
import { useRouter } from "next/navigation";

type ProjectsTableProps = {
  projects: Project[];
};

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleSoftDelete = async (id: string, title: string) => {
    try {
      await softDeleteProject(id);
      toast({
        title: "Project Moved to Bin",
        description: `"${title}" has been moved to the bin.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to move project to bin:", error);
      toast({
        title: "Error",
        description: "Failed to move project to bin. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Media</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                 {project.mediaType === 'video' ? (
                  <div className="w-16 h-12 flex items-center justify-center bg-muted rounded-md">
                    {project.thumbnailUrl ? (
                      <Image
                        src={project.thumbnailUrl}
                        alt={project.title}
                        width={64}
                        height={48}
                        className="rounded-md object-cover w-16 h-12"
                      />
                    ) : (
                      <Video className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                ) : project.mediaType === 'audio' ? (
                   <div className="w-16 h-12 flex items-center justify-center bg-muted rounded-md">
                      <Video className="h-6 w-6 text-muted-foreground" />
                   </div>
                ) : (
                  <Image
                    src={project.mediaUrl}
                    alt={project.title}
                    width={64}
                    height={48}
                    className="rounded-md object-cover w-16 h-12"
                    data-ai-hint={project.mediaHint}
                  />
                )}
              </TableCell>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{project.category}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {project.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                    {project.skills.length > 3 && <Badge variant="secondary">...</Badge>}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/projects/${project.slug}/edit`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Move this project to the bin?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will move the project &quot;{project.title}&quot; to the bin. It will be permanently deleted after 30 days.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleSoftDelete(project.id, project.title)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Move to Bin
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

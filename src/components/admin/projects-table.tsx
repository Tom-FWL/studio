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
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

type ProjectsTableProps = {
  projects: Project[];
};

function handleNotImplemented() {
    toast({
        title: "Feature not implemented",
        description: "This functionality is not yet available in this prototype.",
    });
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.slug}>
              <TableCell>
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={64}
                  height={48}
                  className="rounded-md object-cover"
                  data-ai-hint={project.imageHint}
                />
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
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project
                        &quot;{project.title}&quot;.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleNotImplemented}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
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

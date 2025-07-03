"use client";

import { projects as initialProjects } from "@/lib/data";
import { ProjectsTable } from "@/components/admin/projects-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Shield, LogOut } from "lucide-react";
import Link from "next/link";
import { logout } from "./actions";
import { useState } from "react";
import type { Project } from "@/lib/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  return (
    <div className="min-h-screen bg-muted/20">
       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">Admin Panel</span>
          </Link>
          <form action={logout}>
            <Button variant="ghost" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-headline">Manage Projects</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
        </div>
        <ProjectsTable projects={projects} setProjects={setProjects} />
      </main>
    </div>
  );
}


import { getBinnedProjects } from "@/lib/project-service";
import { BinClient } from "@/components/admin/bin-client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function BinPage() {
  const projects = await getBinnedProjects();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
       <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline text-foreground">Recycle Bin</h1>
        <p className="text-lg text-muted-foreground mt-2">Projects in the bin will be permanently deleted after 30 days.</p>
      </header>
      <BinClient projects={projects} />
    </div>
  );
}

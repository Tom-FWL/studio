import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { projects } from "@/lib/data";

export default function Home() {
  const categories = Array.from(new Set(projects.map((p) => p.category)));

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-headline text-foreground mb-2">Creative Works</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          A curated collection of my projects, showcasing my passion for design and development.
        </p>
      </header>
      
      <PortfolioGrid projects={projects} categories={categories} />
    </div>
  );
}

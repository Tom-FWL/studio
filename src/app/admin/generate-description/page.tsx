import { DescriptionGeneratorForm } from "@/components/ai/description-generator-form";
import { Bot } from "lucide-react";

export default function GenerateDescriptionPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
       <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <Bot className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-6xl font-headline text-foreground mb-2">AI Project Description Generator</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Craft compelling project descriptions with the help of AI. Just fill in the details below.
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        <DescriptionGeneratorForm />
      </div>
    </div>
  );
}

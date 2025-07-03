import Image from "next/image";
import { Award, Lightbulb, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-3 gap-12 items-start">
        <div className="md:col-span-1 flex flex-col items-center text-center">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg mb-6">
            <Image
              src="https://placehold.co/400x400.png"
              alt="Portrait of the creator"
              layout="fill"
              objectFit="cover"
              data-ai-hint="professional portrait"
            />
          </div>
          <h1 className="text-4xl font-headline text-primary">Hello, I'm Artfolio</h1>
          <p className="text-muted-foreground mt-2">Creative Designer & Developer</p>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-3xl md:text-4xl font-headline text-foreground mb-6 border-l-4 border-primary pl-4">
            My Story
          </h2>
          <div className="space-y-6 text-lg text-foreground/80 font-body">
            <p>
              From a young age, I've been captivated by the intersection of art and technology. This passion has guided my journey, leading me to explore various facets of digital creation—from intricate branding projects to immersive web experiences. I believe that great design is not just about aesthetics, but about telling a story and creating a meaningful connection with the audience.
            </p>
            <p>
              My work is driven by a minimalist philosophy, where clarity and purpose are paramount. I strive to create designs that are not only beautiful but also intuitive and effective. Every line, color, and interaction is carefully considered to contribute to a cohesive and engaging user experience.
            </p>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl md:text-3xl font-headline text-foreground mb-6 border-l-4 border-primary pl-4">
              My Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-4 rounded-lg">
                <Lightbulb className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-xl font-headline mb-2">Creativity</h4>
                <p className="text-muted-foreground text-sm">
                  Pushing boundaries and exploring new ideas to deliver unique and innovative solutions.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg">
                <Heart className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-xl font-headline mb-2">Passion</h4>
                <p className="text-muted-foreground text-sm">
                  A genuine love for the craft, ensuring dedication and enthusiasm in every project.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg">
                <Award className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-xl font-headline mb-2">Excellence</h4>
                <p className="text-muted-foreground text-sm">
                  A commitment to the highest standards of quality and a meticulous attention to detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

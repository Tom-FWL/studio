
'use client';

import Image from "next/image";
import { Award, Lightbulb, Heart } from "lucide-react";
import { motion } from 'framer-motion';
import { AnimatedText } from "@/components/animated-text";

export default function AboutPage() {
  const story1 = "From a young age, I've been captivated by the intersection of art and technology. This passion has guided my journey, leading me to explore various facets of digital creation—from intricate branding projects to immersive web experiences. I believe that great design is not just about aesthetics, but about telling a story and creating a meaningful connection with the audience.";
  const story2 = "My work is driven by a minimalist philosophy, where clarity and purpose are paramount. I strive to create designs that are not only beautiful but also intuitive and effective. Every line, color, and interaction is carefully considered to contribute to a cohesive and engaging user experience.";

  // Parent container that orchestrates the entire page animation sequence
  const pageContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.8, // This will animate the direct children (the two main sections) in order
      },
    },
  };

  // Variant for the two main sections to fade in
  const sectionVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };
  
  // Variants for the intro column specifically
  const introColumnContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // Stagger the image, title, and subtitle
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Variants for the values cards container
  const valuesContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // This will stagger the cards
      },
    },
  };

  const valueItem = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };
  
  const valueCardHover = {
    scale: 1.05,
    boxShadow: "0px 10px 30px -5px hsl(var(--primary) / 0.1)",
    transition: { type: "spring", stiffness: 300, damping: 15 }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-12 md:py-20 overflow-x-hidden"
      variants={pageContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* SECTION 1: Intro + Story */}
      <motion.div variants={sectionVariant}>
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Intro column */}
          <motion.div 
            className="md:col-span-1 flex flex-col items-center text-center"
            variants={introColumnContainer}
          >
            <motion.div 
              className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg mb-6"
              variants={fadeInUp}
            >
              <Image
                src="https://placehold.co/400x400.png"
                alt="Portrait of the creator"
                layout="fill"
                objectFit="cover"
                data-ai-hint="professional portrait"
              />
            </motion.div>
            <motion.h1 
              className="text-4xl font-headline text-primary"
              variants={fadeInUp}
            >
              Hello, I'm Artfolio
            </motion.h1>
            <motion.p 
              className="text-muted-foreground mt-2"
              variants={fadeInUp}
            >
              Creative Designer & Developer
            </motion.p>
          </motion.div>

          {/* Story column */}
          <div className="md:col-span-2">
            <div>
              <h2 className="text-3xl md:text-4xl font-headline text-foreground mb-6 border-l-4 border-primary pl-4">
                My Story
              </h2>
              <div className="space-y-6 text-lg text-foreground/80 font-body">
                 <AnimatedText text={story1} staggerDelay={0.06} className="text-lg text-foreground/80 font-body" />
                 <AnimatedText text={story2} staggerDelay={0.06} className="text-lg text-foreground/80 font-body" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SECTION 2: Values */}
      <motion.div 
        className="mt-20"
        variants={sectionVariant}
      >
        <motion.h3 
            className="text-2xl md:text-3xl font-headline text-foreground mb-8 border-l-4 border-primary pl-4"
            variants={fadeInUp}
        >
            My Values
        </motion.h3>
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8"
            variants={valuesContainer}
        >
            <motion.div 
                className="flex flex-col items-center text-center p-6 rounded-lg transition-shadow duration-300"
                variants={valueItem}
                whileHover={valueCardHover}
            >
                <Lightbulb className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-xl font-headline mb-2">Creativity</h4>
                <p className="text-muted-foreground text-sm">
                  Pushing boundaries and exploring new ideas to deliver unique and innovative solutions.
                </p>
            </motion.div>
            <motion.div 
                className="flex flex-col items-center text-center p-6 rounded-lg transition-shadow duration-300"
                variants={valueItem}
                whileHover={valueCardHover}
            >
                <Heart className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-xl font-headline mb-2">Passion</h4>
                <p className="text-muted-foreground text-sm">
                  A genuine love for the craft, ensuring dedication and enthusiasm in every project.
                </p>
            </motion.div>
            <motion.div 
                className="flex flex-col items-center text-center p-6 rounded-lg transition-shadow duration-300"
                variants={valueItem}
                whileHover={valueCardHover}
            >
                <Award className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-xl font-headline mb-2">Excellence</h4>
                <p className="text-muted-foreground text-sm">
                  A commitment to the highest standards of quality and a meticulous attention to detail.
                </p>
            </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

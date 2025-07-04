
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

type AnimatedTextProps = {
  text: string;
  el?: keyof JSX.IntrinsicElements;
  className?: string;
  staggerDelay?: number;
  delay?: number;
};

const defaultAnimations = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
    },
  },
};

export function AnimatedText({ text, el: Wrapper = 'p', className, staggerDelay = 0.05, delay = 0 }: AnimatedTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: true });
  const words = text.split(' ').filter(word => word.length > 0);

  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        transition={{ staggerChildren: staggerDelay, delayChildren: delay }}
        aria-hidden
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={defaultAnimations}
            className="inline-block mr-1.5"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
};

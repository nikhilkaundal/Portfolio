'use client';
import { cn } from '../../lib/utils';
import { motion, Variants } from 'framer-motion';
import React from 'react';

type TextEffectPer = 'word' | 'char' | 'line';
type TextEffectPreset = 'fade' | 'slide' | 'scale' | 'blur';

interface TextEffectProps {
  children: string;
  per?: TextEffectPer;
  as?: keyof React.JSX.IntrinsicElements | string;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: TextEffectPreset;
  delay?: number;
}

const defaultItemVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(2px)',
    transition: {
      duration: 0.2,
    },
  },
};

export const TextEffect: React.FC<TextEffectProps> = ({
  children,
  per = 'word',
  as: Component = 'span',
  variants,
  className,
  delay = 0,
}) => {
  const containerVariants: Variants = variants?.container || {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: per === 'char' ? 0.02 : 0.06,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = variants?.item || defaultItemVariants;
  const content = typeof children === "string" ? children : String(children || "");
  const items = per === 'word' ? content.split(' ') : content.split('');

  const MotionComponent = (motion as any)[Component] || motion.span;

  return (
    <MotionComponent
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className={cn('inline-block', className)}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block whitespace-pre"
        >
          {item}
          {per === 'word' && index < items.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

export default TextEffect;

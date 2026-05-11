import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Premium page transition — spring-based for a bouncy, high-end native feel.
 * stiffness: 300, damping: 30 per design spec.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.99 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 },
      }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}

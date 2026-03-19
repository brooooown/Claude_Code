import { Variants } from 'framer-motion';

// Recommendation card animations
export const recommendationCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
  swipeLeft: {
    x: -100,
    opacity: 0.8,
    rotate: -5,
    transition: {
      duration: 0.2,
    },
  },
  swipeRight: {
    x: 100,
    opacity: 0.8,
    rotate: 5,
    transition: {
      duration: 0.2,
    },
  },
  removing: {
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  longPress: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
};

// Section container animations
export const recommendationSectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

// Grid container animations
export const recommendationGridVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Individual grid item animations
export const recommendationItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

// Long press menu animations
export const longPressMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.15,
    },
  },
};

// Menu item animations
export const menuItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Swipe hint overlay animations
export const swipeHintVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.15,
    },
  },
};

// Pull-to-refresh animations
export const pullToRefreshVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Loading skeleton animations
export const skeletonVariants: Variants = {
  loading: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Error state animations
export const errorStateVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Empty state animations
export const emptyStateVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Badge/Tag animations
export const badgeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Floating action animations
export const floatingActionVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    y: 100,
    transition: {
      duration: 0.2,
    },
  },
};

// Page transition for recommendation views
export const recommendationPageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  in: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  out: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

// Refresh indicator animations
export const refreshIndicatorVariants: Variants = {
  idle: {
    rotate: 0,
  },
  spinning: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Like button animations
export const likeButtonVariants: Variants = {
  idle: {
    scale: 1,
  },
  liked: {
    scale: [1, 1.3, 1],
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: 0.1,
    },
  },
};

// Notification/Toast animations for feedback
export const feedbackToastVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

// Progress bar animations
export const progressVariants: Variants = {
  hidden: {
    width: '0%',
  },
  visible: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

// Confidence meter animations (for debugging)
export const confidenceMeterVariants: Variants = {
  hidden: {
    scaleX: 0,
  },
  visible: (confidence: number) => ({
    scaleX: confidence,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  }),
};
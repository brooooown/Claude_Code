import { Variants } from 'framer-motion';

// Page transition variants for React Router
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.98
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  out: {
    opacity: 0,
    x: -100,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

// Page transition for back navigation
export const pageVariantsBack: Variants = {
  initial: {
    opacity: 0,
    x: -100,
    scale: 0.98
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  out: {
    opacity: 0,
    x: 100,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

// Modal/overlay transitions
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.15,
      ease: 'easeIn'
    }
  }
};

// Backdrop for modals
export const backdropVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15
    }
  }
};

// Header scroll animation
export const headerVariants: Variants = {
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  hidden: {
    y: -100,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};
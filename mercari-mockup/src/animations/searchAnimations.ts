import { Variants } from 'framer-motion';

// Search bar expand animation
export const searchBarVariants: Variants = {
  idle: {
    width: '100%',
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  focused: {
    width: '100%',
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// Search suggestions stagger animation
export const suggestionsContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: 'easeIn'
    }
  }
};

// Individual suggestion item animation
export const suggestionItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
    y: -5
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  hover: {
    backgroundColor: '#F8F8F8',
    scale: 1.02,
    transition: {
      duration: 0.1,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.05,
      ease: 'easeInOut'
    }
  }
};

// Filter tag animations
export const filterTagVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    x: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    x: 20,
    transition: {
      duration: 0.15,
      ease: 'easeIn'
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.1,
      ease: 'easeOut'
    }
  }
};

// Filter container stagger
export const filterContainerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1
    }
  }
};

// Search results grid animation
export const resultsGridVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

// Individual result item animation
export const resultItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  hover: {
    y: -2,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: 'easeInOut'
    }
  }
};

// Search input focus background blur
export const backgroundBlurVariants: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)'
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(4px)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};
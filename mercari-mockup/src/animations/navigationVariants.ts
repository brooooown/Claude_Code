import { Variants } from 'framer-motion';

// Header navigation variants
export const headerVariants: Variants = {
  hidden: {
    y: -100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  scrolled: {
    y: 0,
    opacity: 1,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

// Bottom tab navigation variants
export const tabNavigationVariants: Variants = {
  hidden: {
    y: 100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.05
    }
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

// Individual tab item variants
export const tabItemVariants: Variants = {
  inactive: {
    scale: 1,
    color: '#666666',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  active: {
    scale: 1.1,
    color: '#FF6B35',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeInOut'
    }
  },
  bounce: {
    scale: [1, 1.15, 1.05, 1],
    transition: {
      duration: 0.15,
      ease: 'easeOut'
    }
  }
};

// Tab icon variants
export const tabIconVariants: Variants = {
  inactive: {
    scale: 1,
    rotate: 0
  },
  active: {
    scale: 1.1,
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: 0.05,
      ease: 'easeInOut'
    }
  }
};

// Breadcrumb navigation
export const breadcrumbVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.1
    }
  }
};

// Breadcrumb item
export const breadcrumbItemVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  hover: {
    scale: 1.05,
    color: '#FF6B35',
    transition: {
      duration: 0.1,
      ease: 'easeOut'
    }
  }
};

// Drawer/sidebar navigation
export const drawerVariants: Variants = {
  closed: {
    x: '-100%',
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// Drawer menu items
export const drawerItemVariants: Variants = {
  closed: {
    opacity: 0,
    x: -50
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  hover: {
    x: 10,
    backgroundColor: '#F8F8F8',
    transition: {
      duration: 0.1,
      ease: 'easeOut'
    }
  }
};

// Button hover and press variants
export const buttonVariants: Variants = {
  idle: {
    scale: 1,
    transition: {
      duration: 0.1,
      ease: 'easeOut'
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.1,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.05,
      ease: 'easeInOut'
    }
  },
  loading: {
    scale: [1, 1.02, 1],
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'easeInOut'
    }
  }
};

// Floating action button (FAB)
export const fabVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
    rotate: -45
  },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  hover: {
    scale: 1.1,
    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: 0.1,
      ease: 'easeInOut'
    }
  }
};
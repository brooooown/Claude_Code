import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimationControls, useAnimation } from 'framer-motion';

export type TabItem = 'home' | 'search' | 'favorites' | 'profile';

interface UseNavigationReturn {
  activeTab: TabItem;
  isHeaderVisible: boolean;
  scrollY: number;
  tabControls: AnimationControls;
  headerControls: AnimationControls;
  setActiveTab: (tab: TabItem) => void;
  animateTabChange: (tab: TabItem) => void;
  toggleHeaderVisibility: (visible: boolean) => void;
}

export const useNavigation = (): UseNavigationReturn => {
  const [activeTab, setActiveTab] = useState<TabItem>('home');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  const tabControls = useAnimation();
  const headerControls = useAnimation();
  const location = useLocation();

  // Map routes to tabs
  const routeToTab = useCallback((pathname: string): TabItem => {
    if (pathname.startsWith('/search')) return 'search';
    if (pathname.startsWith('/favorites')) return 'favorites';
    if (pathname.startsWith('/profile')) return 'profile';
    return 'home';
  }, []);

  // Update active tab based on route
  useEffect(() => {
    const currentTab = routeToTab(location.pathname);
    setActiveTab(currentTab);
  }, [location.pathname, routeToTab]);

  // Handle scroll for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Show/hide header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        if (isHeaderVisible) {
          setIsHeaderVisible(false);
          headerControls.start('hidden');
        }
      } else {
        // Scrolling up
        if (!isHeaderVisible) {
          setIsHeaderVisible(true);
          headerControls.start('visible');
        }
      }

      setLastScrollY(currentScrollY);
    };

    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY, isHeaderVisible, headerControls]);

  const animateTabChange = useCallback(async (tab: TabItem) => {
    // Animate tab bounce effect
    await tabControls.start({
      scale: [1, 1.15, 1.05, 1],
      transition: {
        duration: 0.15,
        ease: 'easeOut'
      }
    });

    setActiveTab(tab);
  }, [tabControls]);

  const toggleHeaderVisibility = useCallback((visible: boolean) => {
    setIsHeaderVisible(visible);
    headerControls.start(visible ? 'visible' : 'hidden');
  }, [headerControls]);

  return {
    activeTab,
    isHeaderVisible,
    scrollY,
    tabControls,
    headerControls,
    setActiveTab,
    animateTabChange,
    toggleHeaderVisibility
  };
};

// Hook for managing drawer/sidebar navigation
export const useDrawerNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();

  const openDrawer = useCallback(async () => {
    setIsOpen(true);
    await controls.start('open');
  }, [controls]);

  const closeDrawer = useCallback(async () => {
    await controls.start('closed');
    setIsOpen(false);
  }, [controls]);

  const toggleDrawer = useCallback(() => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }, [isOpen, openDrawer, closeDrawer]);

  return {
    isOpen,
    controls,
    openDrawer,
    closeDrawer,
    toggleDrawer
  };
};

// Hook for managing breadcrumb navigation
export const useBreadcrumbNavigation = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; path: string }[]>([]);
  const location = useLocation();

  const addBreadcrumb = useCallback((label: string, path: string) => {
    setBreadcrumbs(prev => {
      const existing = prev.find(item => item.path === path);
      if (existing) return prev;

      return [...prev, { label, path }];
    });
  }, []);

  const removeBreadcrumbsAfter = useCallback((path: string) => {
    setBreadcrumbs(prev => {
      const index = prev.findIndex(item => item.path === path);
      if (index === -1) return prev;

      return prev.slice(0, index + 1);
    });
  }, []);

  const clearBreadcrumbs = useCallback(() => {
    setBreadcrumbs([]);
  }, []);

  // Auto-generate breadcrumbs based on current path
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const newBreadcrumbs: { label: string; path: string }[] = [];

    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;

      let label = segment;
      // Convert common path segments to Japanese labels
      if (segment === 'search') label = '検索';
      else if (segment === 'favorites') label = 'お気に入り';
      else if (segment === 'profile') label = 'マイページ';
      else if (segment === 'category') label = 'カテゴリー';
      else label = segment.charAt(0).toUpperCase() + segment.slice(1);

      newBreadcrumbs.push({ label, path: currentPath });
    });

    setBreadcrumbs(newBreadcrumbs);
  }, [location.pathname]);

  return {
    breadcrumbs,
    addBreadcrumb,
    removeBreadcrumbsAfter,
    clearBreadcrumbs
  };
};

// Utility function for throttling
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}
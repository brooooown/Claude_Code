import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type NavigationDirection = 'forward' | 'back';

interface UsePageTransitionReturn {
  isNavigating: boolean;
  direction: NavigationDirection;
  navigate: (to: string, options?: { direction?: NavigationDirection }) => void;
}

export const usePageTransition = (): UsePageTransitionReturn => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [direction, setDirection] = useState<NavigationDirection>('forward');
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = useCallback((
    to: string,
    options?: { direction?: NavigationDirection }
  ) => {
    const navigationDirection = options?.direction || 'forward';

    setIsNavigating(true);
    setDirection(navigationDirection);

    // Slight delay to allow animation to start
    setTimeout(() => {
      navigate(to);

      // Reset navigation state after transition
      setTimeout(() => {
        setIsNavigating(false);
      }, 300);
    }, 50);
  }, [navigate]);

  return {
    isNavigating,
    direction,
    navigate: handleNavigate
  };
};

// Hook for managing navigation history and determining direction
export const useNavigationHistory = () => {
  const [history, setHistory] = useState<string[]>(['/']);
  const location = useLocation();

  const addToHistory = useCallback((path: string) => {
    setHistory(prev => [...prev, path]);
  }, []);

  const removeFromHistory = useCallback(() => {
    setHistory(prev => prev.slice(0, -1));
  }, []);

  const isGoingBack = useCallback((targetPath: string) => {
    const currentIndex = history.indexOf(location.pathname);
    const targetIndex = history.indexOf(targetPath);

    return targetIndex !== -1 && targetIndex < currentIndex;
  }, [history, location.pathname]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    isGoingBack,
    currentPath: location.pathname
  };
};

// Hook for managing scroll position during page transitions
export const useScrollTransition = () => {
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});

  const saveScrollPosition = useCallback((path: string) => {
    const scrollY = window.scrollY;
    setScrollPositions(prev => ({
      ...prev,
      [path]: scrollY
    }));
  }, []);

  const restoreScrollPosition = useCallback((path: string) => {
    const savedPosition = scrollPositions[path];
    if (savedPosition !== undefined) {
      setTimeout(() => {
        window.scrollTo(0, savedPosition);
      }, 100);
    }
  }, [scrollPositions]);

  return {
    saveScrollPosition,
    restoreScrollPosition
  };
};
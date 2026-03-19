import { useState, useCallback, useRef, useEffect } from 'react';
import {
  SwipeAction,
  InteractionType,
  LongPressOption,
  DEFAULT_LONG_PRESS_OPTIONS,
  RecommendationCardState,
  SectionRefreshState,
  DEFAULT_REFRESH_CONFIG
} from '../data/recommendationTypes';

interface UseRecommendationInteractionsProps {
  onSwipeAction?: (productId: string, action: SwipeAction) => void;
  onLongPressAction?: (productId: string, action: InteractionType) => void;
  onSectionRefresh?: (sectionId: string) => Promise<void>;
  onProductClick?: (productId: string) => void;
  swipeThreshold?: number;
  longPressDelay?: number;
  enableVibration?: boolean;
}

export const useRecommendationInteractions = ({
  onSwipeAction,
  onLongPressAction,
  onSectionRefresh,
  onProductClick,
  swipeThreshold = 80,
  longPressDelay = 500,
  enableVibration = true
}: UseRecommendationInteractionsProps) => {
  // Card states for each product
  const [cardStates, setCardStates] = useState<Map<string, RecommendationCardState>>(new Map());

  // Section refresh states
  const [sectionRefreshStates, setSectionRefreshStates] = useState<Map<string, SectionRefreshState>>(new Map());

  // Touch/interaction refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressedRef = useRef(false);

  // Initialize card state for a product
  const initializeCardState = useCallback((productId: string) => {
    if (!cardStates.has(productId)) {
      setCardStates(prev => new Map(prev).set(productId, {
        isVisible: true,
        animationState: 'visible',
        swipeOffset: 0,
        isLongPressed: false,
        showMenu: false,
        isRemoving: false
      }));
    }
  }, [cardStates]);

  // Update card state
  const updateCardState = useCallback((
    productId: string,
    updates: Partial<RecommendationCardState>
  ) => {
    setCardStates(prev => {
      const current = prev.get(productId) || {
        isVisible: true,
        animationState: 'visible',
        swipeOffset: 0,
        isLongPressed: false,
        showMenu: false,
        isRemoving: false
      };
      return new Map(prev).set(productId, { ...current, ...updates });
    });
  }, []);

  // Initialize section refresh state
  const initializeSectionRefreshState = useCallback((sectionId: string) => {
    if (!sectionRefreshStates.has(sectionId)) {
      setSectionRefreshStates(prev => new Map(prev).set(sectionId, {
        isRefreshing: false,
        pullDistance: 0,
        canRefresh: false,
        refreshCount: 0
      }));
    }
  }, [sectionRefreshStates]);

  // Handle touch start
  const handleTouchStart = useCallback((
    e: React.TouchEvent | React.MouseEvent,
    productId: string
  ) => {
    initializeCardState(productId);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    touchStartRef.current = {
      x: clientX,
      y: clientY,
      time: Date.now()
    };

    isLongPressedRef.current = false;

    // Start long press timer
    longPressTimerRef.current = setTimeout(() => {
      if (touchStartRef.current && !isLongPressedRef.current) {
        handleLongPressStart(productId);
      }
    }, longPressDelay);
  }, [longPressDelay, initializeCardState]);

  // Handle touch move
  const handleTouchMove = useCallback((
    e: React.TouchEvent | React.MouseEvent,
    productId: string
  ) => {
    if (!touchStartRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - touchStartRef.current.x;
    const deltaY = clientY - touchStartRef.current.y;

    // Cancel long press if moved too much
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }

    // Handle horizontal swipe
    if (Math.abs(deltaX) > 10 && Math.abs(deltaY) < 50) {
      updateCardState(productId, {
        swipeOffset: deltaX,
        animationState: deltaX < 0 ? 'swiping_left' : 'swiping_right'
      });
    }
  }, [updateCardState]);

  // Handle touch end
  const handleTouchEnd = useCallback((
    e: React.TouchEvent | React.MouseEvent,
    productId: string
  ) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    const currentState = cardStates.get(productId);
    if (!currentState || !touchStartRef.current) {
      touchStartRef.current = null;
      return;
    }

    const swipeOffset = currentState.swipeOffset;

    // Handle swipe actions
    if (Math.abs(swipeOffset) >= swipeThreshold) {
      const action: SwipeAction = swipeOffset < 0 ? 'not_interested' : 'more_like_this';
      handleSwipeAction(productId, action);
    } else if (!isLongPressedRef.current && Math.abs(swipeOffset) < 10) {
      // Handle click if no significant swipe or long press
      const timeSinceStart = Date.now() - touchStartRef.current.time;
      if (timeSinceStart < 300) { // Quick tap
        handleProductClick(productId);
      }
    } else {
      // Snap back to original position
      updateCardState(productId, {
        swipeOffset: 0,
        animationState: 'visible'
      });
    }

    touchStartRef.current = null;
    isLongPressedRef.current = false;
  }, [cardStates, swipeThreshold]);

  // Handle long press start
  const handleLongPressStart = useCallback((productId: string) => {
    isLongPressedRef.current = true;

    // Haptic feedback
    if (enableVibration && navigator.vibrate) {
      navigator.vibrate(50);
    }

    updateCardState(productId, {
      isLongPressed: true,
      showMenu: true,
      animationState: 'long_pressing'
    });
  }, [enableVibration, updateCardState]);

  // Handle long press menu action
  const handleLongPressMenuAction = useCallback((
    productId: string,
    option: LongPressOption
  ) => {
    updateCardState(productId, {
      showMenu: false,
      isLongPressed: false,
      animationState: 'visible'
    });

    onLongPressAction?.(productId, option.action);
  }, [updateCardState, onLongPressAction]);

  // Handle swipe action
  const handleSwipeAction = useCallback((productId: string, action: SwipeAction) => {
    updateCardState(productId, {
      isRemoving: true,
      animationState: 'removing'
    });

    // Haptic feedback
    if (enableVibration && navigator.vibrate) {
      navigator.vibrate(100);
    }

    // Delay to show animation
    setTimeout(() => {
      onSwipeAction?.(productId, action);

      // Reset state after action
      updateCardState(productId, {
        isVisible: false,
        isRemoving: false,
        swipeOffset: 0,
        animationState: 'visible'
      });
    }, 300);
  }, [updateCardState, enableVibration, onSwipeAction]);

  // Handle product click
  const handleProductClick = useCallback((productId: string) => {
    onProductClick?.(productId);
  }, [onProductClick]);

  // Handle section pull-to-refresh
  const handleSectionPullStart = useCallback((
    e: React.TouchEvent,
    sectionId: string
  ) => {
    initializeSectionRefreshState(sectionId);

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, [initializeSectionRefreshState]);

  const handleSectionPullMove = useCallback((
    e: React.TouchEvent,
    sectionId: string,
    scrollTop: number
  ) => {
    // Only allow pull-to-refresh when at top of section
    if (scrollTop > 0 || !touchStartRef.current) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartRef.current.y;

    if (deltaY > 0) { // Pulling down
      const pullDistance = Math.min(deltaY, DEFAULT_REFRESH_CONFIG.maxPull);
      const canRefresh = pullDistance >= DEFAULT_REFRESH_CONFIG.threshold;

      setSectionRefreshStates(prev => {
        const current = prev.get(sectionId) || {
          isRefreshing: false,
          pullDistance: 0,
          canRefresh: false,
          refreshCount: 0
        };
        return new Map(prev).set(sectionId, {
          ...current,
          pullDistance,
          canRefresh
        });
      });
    }
  }, []);

  const handleSectionPullEnd = useCallback(async (sectionId: string) => {
    const refreshState = sectionRefreshStates.get(sectionId);
    if (!refreshState?.canRefresh || refreshState.isRefreshing) {
      // Snap back
      setSectionRefreshStates(prev => {
        const current = prev.get(sectionId);
        if (current) {
          return new Map(prev).set(sectionId, {
            ...current,
            pullDistance: 0,
            canRefresh: false
          });
        }
        return prev;
      });
      return;
    }

    // Start refresh
    setSectionRefreshStates(prev => {
      const current = prev.get(sectionId);
      if (current) {
        return new Map(prev).set(sectionId, {
          ...current,
          isRefreshing: true,
          lastRefreshTime: new Date().toISOString(),
          refreshCount: current.refreshCount + 1
        });
      }
      return prev;
    });

    try {
      await onSectionRefresh?.(sectionId);
    } finally {
      // End refresh
      setSectionRefreshStates(prev => {
        const current = prev.get(sectionId);
        if (current) {
          return new Map(prev).set(sectionId, {
            ...current,
            isRefreshing: false,
            pullDistance: 0,
            canRefresh: false
          });
        }
        return prev;
      });
    }
  }, [sectionRefreshStates, onSectionRefresh]);

  // Close long press menu
  const closeLongPressMenu = useCallback((productId: string) => {
    updateCardState(productId, {
      showMenu: false,
      isLongPressed: false,
      animationState: 'visible'
    });
  }, [updateCardState]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return {
    // State
    cardStates,
    sectionRefreshStates,

    // Card interactions
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleLongPressMenuAction,
    closeLongPressMenu,

    // Section interactions
    handleSectionPullStart,
    handleSectionPullMove,
    handleSectionPullEnd,

    // Utilities
    initializeCardState,
    updateCardState,
    initializeSectionRefreshState,

    // Long press options
    longPressOptions: DEFAULT_LONG_PRESS_OPTIONS
  };
};
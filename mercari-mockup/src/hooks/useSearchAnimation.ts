import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimationControls, useAnimation } from 'framer-motion';

interface UseSearchAnimationReturn {
  isSearchFocused: boolean;
  showSuggestions: boolean;
  showResults: boolean;
  searchValue: string;
  searchBarControls: AnimationControls;
  suggestionsControls: AnimationControls;
  resultsControls: AnimationControls;
  backgroundControls: AnimationControls;
  handleSearchFocus: () => void;
  handleSearchBlur: () => void;
  handleSearchChange: (value: string) => void;
  handleSearchSubmit: (query: string) => void;
  clearSearch: () => void;
  animateFilterAdd: () => void;
  animateFilterRemove: () => void;
}

export const useSearchAnimation = (): UseSearchAnimationReturn => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const searchBarControls = useAnimation();
  const suggestionsControls = useAnimation();
  const resultsControls = useAnimation();
  const backgroundControls = useAnimation();

  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSearchFocus = useCallback(async () => {
    setIsSearchFocused(true);

    // Animate search bar expansion and background blur
    await Promise.all([
      searchBarControls.start('focused'),
      backgroundControls.start('visible')
    ]);

    // Show suggestions after search bar animation
    if (searchValue.length > 0) {
      setShowSuggestions(true);
      suggestionsControls.start('visible');
    }
  }, [searchBarControls, backgroundControls, suggestionsControls, searchValue]);

  const handleSearchBlur = useCallback(async () => {
    // Small delay to allow for suggestion clicks
    setTimeout(async () => {
      setIsSearchFocused(false);
      setShowSuggestions(false);

      await Promise.all([
        searchBarControls.start('idle'),
        suggestionsControls.start('exit'),
        backgroundControls.start('exit')
      ]);
    }, 150);
  }, [searchBarControls, suggestionsControls, backgroundControls]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Show suggestions for non-empty search with debounce
    if (value.length > 0) {
      searchTimeoutRef.current = setTimeout(() => {
        if (isSearchFocused) {
          setShowSuggestions(true);
          suggestionsControls.start('visible');
        }
      }, 100);
    } else {
      setShowSuggestions(false);
      suggestionsControls.start('exit');
    }
  }, [isSearchFocused, suggestionsControls]);

  const handleSearchSubmit = useCallback(async (query: string) => {
    if (query.trim() === '') return;

    setSearchValue(query);
    setShowSuggestions(false);
    setShowResults(true);

    // Animate suggestions exit and results entrance
    await suggestionsControls.start('exit');
    await resultsControls.start('visible');

    // Hide background blur
    backgroundControls.start('exit');
  }, [suggestionsControls, resultsControls, backgroundControls]);

  const clearSearch = useCallback(async () => {
    setSearchValue('');
    setShowSuggestions(false);
    setShowResults(false);

    await Promise.all([
      suggestionsControls.start('exit'),
      resultsControls.start('exit'),
      backgroundControls.start('exit')
    ]);

    searchBarControls.start('idle');
  }, [searchBarControls, suggestionsControls, resultsControls, backgroundControls]);

  const animateFilterAdd = useCallback(() => {
    // Trigger filter tag add animation
    return resultsControls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.3, ease: 'easeOut' }
    });
  }, [resultsControls]);

  const animateFilterRemove = useCallback(() => {
    // Trigger filter tag remove animation
    return resultsControls.start({
      scale: [1, 0.98, 1],
      transition: { duration: 0.2, ease: 'easeInOut' }
    });
  }, [resultsControls]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    isSearchFocused,
    showSuggestions,
    showResults,
    searchValue,
    searchBarControls,
    suggestionsControls,
    resultsControls,
    backgroundControls,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchChange,
    handleSearchSubmit,
    clearSearch,
    animateFilterAdd,
    animateFilterRemove
  };
};

// Hook for managing individual search result animations
export const useResultItemAnimation = () => {
  const controls = useAnimation();

  const animateEnter = useCallback((delay: number = 0) => {
    return controls.start({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        delay
      }
    });
  }, [controls]);

  const animateHover = useCallback(() => {
    return controls.start({
      y: -2,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    });
  }, [controls]);

  const animateLeave = useCallback(() => {
    return controls.start({
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    });
  }, [controls]);

  return {
    controls,
    animateEnter,
    animateHover,
    animateLeave
  };
};
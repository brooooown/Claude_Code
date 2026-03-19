import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../../atoms/Input';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { useSearchAnimation } from '../../../hooks/useSearchAnimation';
import {
  searchBarVariants,
  suggestionsContainerVariants,
  suggestionItemVariants,
  backgroundBlurVariants
} from '../../../animations/searchAnimations';
import { searchSuggestions, recentSearches } from '../../../data/mockProducts';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  autoFocus?: boolean;
  showRecentSearches?: boolean;
  showSuggestions?: boolean;
  maxSuggestions?: number;
  onSearch?: (query: string) => void;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

interface SuggestionItemProps {
  text: string;
  isRecent?: boolean;
  onClick: () => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  text,
  isRecent = false,
  onClick
}) => {
  return (
    <motion.div
      className="flex items-center px-4 py-3 cursor-pointer transition-colors duration-150"
      variants={suggestionItemVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
    >
      <Icon
        name={isRecent ? 'arrow-right' : 'search'}
        size="sm"
        className="text-gray-400 mr-3"
      />
      <span className="text-sm text-text-primary">{text}</span>
      {isRecent && (
        <Badge variant="secondary" size="sm" className="ml-auto">
          履歴
        </Badge>
      )}
    </motion.div>
  );
};

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '何をお探しですか？',
  value = '',
  autoFocus = false,
  showRecentSearches = true,
  showSuggestions = true,
  maxSuggestions = 8,
  onSearch,
  onChange,
  onFocus,
  onBlur,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    isSearchFocused,
    showSuggestions: showSuggestionsState,
    searchBarControls,
    suggestionsControls,
    backgroundControls,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchChange,
    handleSearchSubmit
  } = useSearchAnimation();

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Filter suggestions based on input
  useEffect(() => {
    if (localValue.length === 0) {
      setFilteredSuggestions([]);
    } else {
      const filtered = searchSuggestions
        .filter(suggestion =>
          suggestion.toLowerCase().includes(localValue.toLowerCase())
        )
        .slice(0, maxSuggestions);
      setFilteredSuggestions(filtered);
    }
  }, [localValue, maxSuggestions]);

  const handleInputChange = (newValue: string) => {
    setLocalValue(newValue);
    handleSearchChange(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleInputFocus = () => {
    handleSearchFocus();
    if (onFocus) {
      onFocus();
    }
  };

  const handleInputBlur = () => {
    handleSearchBlur();
    if (onBlur) {
      onBlur();
    }
  };

  const handleSubmit = (query?: string) => {
    const searchQuery = query || localValue;
    if (searchQuery.trim()) {
      handleSearchSubmit(searchQuery);
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalValue(suggestion);
    handleSubmit(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleInputBlur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleInputBlur]);

  const shouldShowSuggestions =
    showSuggestions &&
    showSuggestionsState &&
    isSearchFocused &&
    (filteredSuggestions.length > 0 || (showRecentSearches && recentSearches.length > 0 && localValue.length === 0));

  return (
    <>
      {/* Background Blur Overlay */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40"
            variants={backgroundBlurVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      <div ref={containerRef} className={`relative ${className}`}>
        {/* Search Input */}
        <motion.div
          variants={searchBarVariants}
          animate={searchBarControls}
          initial="idle"
          className="relative z-50"
        >
          <Input
            ref={inputRef}
            type="search"
            variant="search"
            size="md"
            value={localValue}
            placeholder={placeholder}
            autoFocus={autoFocus}
            fullWidth
            clearable
            icon={<Icon name="search" size="sm" />}
            iconPosition="left"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            onClear={() => {
              setLocalValue('');
              handleSearchChange('');
              if (onChange) {
                onChange('');
              }
            }}
            className="shadow-sm"
          />
        </motion.div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {shouldShowSuggestions && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
              variants={suggestionsContainerVariants}
              animate={suggestionsControls}
              initial="hidden"
              exit="exit"
            >
              <div className="max-h-80 overflow-y-auto">
                {/* Recent Searches */}
                {localValue.length === 0 && showRecentSearches && recentSearches.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-background-secondary border-b border-gray-100">
                      <span className="text-xs font-medium text-text-secondary">最近の検索</span>
                    </div>
                    {recentSearches.map((search, index) => (
                      <SuggestionItem
                        key={`recent-${index}`}
                        text={search}
                        isRecent
                        onClick={() => handleSuggestionClick(search)}
                      />
                    ))}
                  </div>
                )}

                {/* Search Suggestions */}
                {filteredSuggestions.length > 0 && (
                  <div>
                    {localValue.length === 0 && showRecentSearches && recentSearches.length > 0 && (
                      <div className="px-4 py-2 bg-background-secondary border-b border-gray-100">
                        <span className="text-xs font-medium text-text-secondary">人気のキーワード</span>
                      </div>
                    )}
                    {filteredSuggestions.map((suggestion, index) => (
                      <SuggestionItem
                        key={`suggestion-${index}`}
                        text={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                      />
                    ))}
                  </div>
                )}

                {/* No results */}
                {localValue.length > 0 && filteredSuggestions.length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <Icon name="search" size="lg" className="mx-auto mb-2" />
                    <p className="text-sm">候補が見つかりませんでした</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SearchBar;
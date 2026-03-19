import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../atoms/Icon';
import { LongPressOption } from '../../../data/recommendationTypes';
import { longPressMenuVariants, menuItemVariants } from '../../../animations/recommendationAnimations';

interface InteractionMenuProps {
  isVisible: boolean;
  options: LongPressOption[];
  productTitle: string;
  onOptionSelect: (option: LongPressOption) => void;
  onClose: () => void;
  position?: { x: number; y: number };
}

const InteractionMenu: React.FC<InteractionMenuProps> = ({
  isVisible,
  options,
  productTitle,
  onOptionSelect,
  onClose,
  position
}) => {
  const handleOptionClick = (option: LongPressOption) => {
    onOptionSelect(option);
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl p-6 m-4 max-w-sm w-full shadow-2xl"
            variants={longPressMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={position ? {
              position: 'absolute',
              left: Math.min(position.x, window.innerWidth - 320),
              top: Math.min(position.y, window.innerHeight - 400)
            } : {}}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-800 line-clamp-2 flex-1 pr-2">
                {productTitle}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 p-1"
                onClick={onClose}
              >
                <Icon name="x" size="sm" />
              </button>
            </div>

            {/* Menu Options */}
            <div className="space-y-2">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                  variants={menuItemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionClick(option)}
                >
                  <div className={`p-2 rounded-lg ${getIconBgColor(option.action)} transition-colors`}>
                    <Icon
                      name={option.icon as any}
                      size="sm"
                      className={getIconColor(option.action)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 group-hover:text-gray-900">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-sm text-gray-500 group-hover:text-gray-600">
                        {option.description}
                      </div>
                    )}
                  </div>
                  <Icon
                    name="chevron-right"
                    size="sm"
                    className="text-gray-400 group-hover:text-gray-600"
                  />
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                className="w-full p-3 text-center text-gray-500 hover:text-gray-700 text-sm transition-colors"
                onClick={onClose}
              >
                キャンセル
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function to get icon background color based on action
const getIconBgColor = (action: string): string => {
  switch (action) {
    case 'not_interested':
      return 'bg-red-100';
    case 'want_more_like_this':
      return 'bg-green-100';
    case 'save_for_later':
      return 'bg-blue-100';
    case 'view':
      return 'bg-gray-100';
    default:
      return 'bg-gray-100';
  }
};

// Helper function to get icon color based on action
const getIconColor = (action: string): string => {
  switch (action) {
    case 'not_interested':
      return 'text-red-600';
    case 'want_more_like_this':
      return 'text-green-600';
    case 'save_for_later':
      return 'text-blue-600';
    case 'view':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
};

export default InteractionMenu;
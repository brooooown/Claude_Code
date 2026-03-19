import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Icon } from '../../atoms/Icon';
import { SwipeAction } from '../../../data/recommendationTypes';

interface SwipeActionsProps {
  children: React.ReactNode;
  onSwipe: (action: SwipeAction) => void;
  threshold?: number;
  disabled?: boolean;
  className?: string;
}

const SwipeActions: React.FC<SwipeActionsProps> = ({
  children,
  onSwipe,
  threshold = 80,
  disabled = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const constraintsRef = useRef(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 0.8, 1, 0.8, 0.5]);

  // Reset position when not dragging
  useEffect(() => {
    if (!isDragging) {
      x.set(0);
      setSwipeDirection(null);
    }
  }, [isDragging, x]);

  const handleDragStart = () => {
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDrag = (_: any, info: PanInfo) => {
    if (disabled) return;

    const currentX = info.offset.x;

    // Update swipe direction based on offset
    if (Math.abs(currentX) > 20) {
      setSwipeDirection(currentX < 0 ? 'left' : 'right');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (disabled) return;

    setIsDragging(false);
    const currentX = info.offset.x;

    // Check if swipe threshold is met
    if (Math.abs(currentX) >= threshold) {
      const action: SwipeAction = currentX < 0 ? 'not_interested' : 'more_like_this';
      onSwipe(action);
    } else {
      // Snap back to center if threshold not met
      x.set(0);
    }
  };

  const getLeftActionInfo = () => ({
    color: 'bg-red-500',
    icon: 'x',
    label: '興味なし',
    textColor: 'text-white'
  });

  const getRightActionInfo = () => ({
    color: 'bg-green-500',
    icon: 'heart',
    label: 'もっと見る',
    textColor: 'text-white'
  });

  return (
    <div className={`relative overflow-hidden ${className}`} ref={constraintsRef}>
      {/* Left Action Background */}
      <motion.div
        className={`absolute inset-0 flex items-center justify-end pr-6 ${
          getLeftActionInfo().color
        } ${getLeftActionInfo().textColor}`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: swipeDirection === 'left' && Math.abs(x.get()) > 40 ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center space-x-2">
          <Icon name={getLeftActionInfo().icon as any} size="lg" />
          <span className="font-bold text-lg">{getLeftActionInfo().label}</span>
        </div>
      </motion.div>

      {/* Right Action Background */}
      <motion.div
        className={`absolute inset-0 flex items-center justify-start pl-6 ${
          getRightActionInfo().color
        } ${getRightActionInfo().textColor}`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: swipeDirection === 'right' && Math.abs(x.get()) > 40 ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center space-x-2">
          <Icon name={getRightActionInfo().icon as any} size="lg" />
          <span className="font-bold text-lg">{getRightActionInfo().label}</span>
        </div>
      </motion.div>

      {/* Draggable Content */}
      <motion.div
        drag={!disabled ? "x" : false}
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          x,
          rotate,
          opacity
        }}
        whileTap={{ scale: 0.98 }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Swipe Hints */}
      {isDragging && swipeDirection && Math.abs(x.get()) > 20 && (
        <motion.div
          className="absolute inset-0 pointer-events-none flex items-center justify-center z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div
            className={`px-4 py-2 rounded-lg ${
              swipeDirection === 'left' ? 'bg-red-500' : 'bg-green-500'
            } text-white font-bold shadow-lg`}
          >
            {swipeDirection === 'left' ? '興味なし' : 'もっと見る'}
          </div>
        </motion.div>
      )}

      {/* Progress Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex space-x-1">
          {/* Left indicator */}
          <motion.div
            className="w-2 h-2 bg-red-500 rounded-full"
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: swipeDirection === 'left' && Math.abs(x.get()) > threshold * 0.5 ? 1 : 0.3,
              scale: swipeDirection === 'left' && Math.abs(x.get()) > threshold * 0.8 ? 1.5 : 1
            }}
          />
          {/* Center indicator */}
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: swipeDirection === null ? 1 : 0.3,
              scale: swipeDirection === null ? 1.2 : 1
            }}
          />
          {/* Right indicator */}
          <motion.div
            className="w-2 h-2 bg-green-500 rounded-full"
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: swipeDirection === 'right' && Math.abs(x.get()) > threshold * 0.5 ? 1 : 0.3,
              scale: swipeDirection === 'right' && Math.abs(x.get()) > threshold * 0.8 ? 1.5 : 1
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SwipeActions;
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, IconName } from '../../atoms/Icon';
import { NotificationBadge } from '../../atoms/Badge';
import { useNavigation } from '../../../hooks/useNavigation';
import {
  tabNavigationVariants,
  tabItemVariants,
  tabIconVariants
} from '../../../animations/navigationVariants';

export interface TabItem {
  id: string;
  label: string;
  icon: IconName;
  path: string;
  badge?: number;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs?: TabItem[];
  className?: string;
}

const defaultTabs: TabItem[] = [
  {
    id: 'home',
    label: 'ホーム',
    icon: 'home',
    path: '/'
  },
  {
    id: 'search',
    label: '検索',
    icon: 'search',
    path: '/search'
  },
  {
    id: 'favorites',
    label: 'いいね',
    icon: 'heart',
    path: '/favorites',
    badge: 3
  },
  {
    id: 'profile',
    label: 'マイページ',
    icon: 'user',
    path: '/profile',
    badge: 1
  }
];

interface TabItemComponentProps {
  tab: TabItem;
  isActive: boolean;
  onClick: () => void;
}

const TabItemComponent: React.FC<TabItemComponentProps> = ({
  tab,
  isActive,
  onClick
}) => {
  return (
    <motion.button
      className="flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[64px] focus:outline-none"
      variants={tabItemVariants}
      animate={isActive ? 'active' : 'inactive'}
      whileTap={!tab.disabled ? 'tap' : undefined}
      onClick={onClick}
      disabled={tab.disabled}
    >
      <NotificationBadge count={tab.badge || 0} dot={false}>
        <motion.div
          variants={tabIconVariants}
          animate={isActive ? 'active' : 'inactive'}
          whileTap={!tab.disabled ? 'tap' : undefined}
          className="mb-1"
        >
          <Icon
            name={tab.icon}
            size="md"
            className={isActive ? 'text-mercari-red' : 'text-text-secondary'}
          />
        </motion.div>
      </NotificationBadge>
      <span
        className={`text-xs font-medium transition-colors duration-200 ${
          isActive ? 'text-mercari-red' : 'text-text-secondary'
        }`}
      >
        {tab.label}
      </span>
    </motion.button>
  );
};

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs = defaultTabs,
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { animateTabChange } = useNavigation();

  const getActiveTabId = () => {
    const activeTab = tabs.find(tab => {
      if (tab.path === '/') {
        return location.pathname === '/';
      }
      return location.pathname.startsWith(tab.path);
    });
    return activeTab?.id || tabs[0]?.id;
  };

  const activeTabId = getActiveTabId();

  const handleTabClick = (tab: TabItem) => {
    if (tab.disabled) return;

    if (location.pathname !== tab.path) {
      animateTabChange(tab.id as any);

      // Small delay for animation
      setTimeout(() => {
        navigate(tab.path);
      }, 50);
    }
  };

  return (
    <motion.nav
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-40 ${className}`}
      variants={tabNavigationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex items-center justify-around max-w-screen-xl mx-auto">
        {tabs.map((tab) => (
          <TabItemComponent
            key={tab.id}
            tab={tab}
            isActive={activeTabId === tab.id}
            onClick={() => handleTabClick(tab)}
          />
        ))}
      </div>
    </motion.nav>
  );
};

export default TabNavigation;
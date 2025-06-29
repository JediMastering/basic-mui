/**
 * Example Page Constants
 * 
 * This file centralizes all constants and configurations for the example page,
 * following the Single Responsibility Principle by only handling example page data.
 */

// Navigation items configuration
export const NAVIGATION_ITEMS_CONFIG = [
  { 
    label: 'Home', 
    icon: '🏠', 
    path: '/home',
  },
  { 
    label: 'Dashboard', 
    icon: '📊', 
    path: '/dashboard',
  },
  { 
    label: 'Users', 
    icon: '👥', 
    path: '/table',
  },
  { 
    label: 'Settings', 
    icon: '⚙️', 
    path: '/settings',
  },
  { 
    label: 'Profile', 
    icon: '👤', 
    path: '/profile',
  },
];

// Layout features list
export const LAYOUT_FEATURES = [
  'Responsive design',
  'Collapsible sidebar',
  'Fixed header',
  'Clean component structure',
  'English naming conventions',
  'Separated concerns with custom hooks',
  'Reusable components',
];

// Header configuration
export const HEADER_CONFIG = {
  title: "Example Application",
  subtitle: "Improved Layout Demo",
  showMenuButton: true,
};

// Sidebar configuration
export const SIDEBAR_CONFIG = {
  title: "Main  ",
};

// Page metadata
export const PAGE_METADATA = {
  title: "Example Page",
  description: "Demonstrates the improved layout with proper composition and state management",
  features: LAYOUT_FEATURES,
}; 
import React from 'react';
import { Button } from 'framework/mui';
import RefreshIcon from '@mui/icons-material/Refresh';
import MainLayout from '../framework/layouts/MainLayout';
import ApplicationHeader from '../framework/components/header/ApplicationHeader';
import FilterSidebar from '../framework/components/sidebar/FilterSidebar';
import EmptyState from '../framework/components/content/EmptyState';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSidebar } from '../hooks/useSidebar';

/**
 * DeliveryPage - Main delivery management page
 * 
 * This component demonstrates the use of the improved layout components
 * and follows the composition pattern for better maintainability.
 */
const DeliveryPage = () => {
  const sidebar = useSidebar(false);
  
  console.log('DeliveryPage render - sidebar.isOpen:', sidebar.isOpen);

  // Header configuration
  const headerConfig = {
    logo: {
      src: 'https://i.imgur.com/8Km9tLL.png',
      alt: 'Grok Logo',
      height: 32,
      invert: true,
    },
    title: 'Grok',
    subtitle: 'Delivery (PR066)',
    navigationItems: [
      { label: 'Portals', onClick: () => console.log('Portals clicked') },
      { label: 'My Tasks', onClick: () => console.log('My Tasks clicked') },
      { label: 'Tools', onClick: () => console.log('Tools clicked') },
    ],
    userActions: [
      {
        icon: <NotificationsNoneIcon />,
        onClick: () => console.log('Notifications clicked'),
        ariaLabel: 'Notifications',
      },
      {
        icon: <HelpOutlineIcon />,
        onClick: () => console.log('Help clicked'),
        ariaLabel: 'Help',
      },
      {
        icon: <AccountCircleIcon />,
        onClick: () => console.log('Profile clicked'),
        ariaLabel: 'Profile',
      },
    ],
    onMenuClick: sidebar.toggleSidebar,
  };

  // Filter configuration
  const filterConfig = {
    filters: [
      {
        type: 'text',
        label: 'Identifier',
        placeholder: 'Enter identifier',
      },
      {
        type: 'text',
        label: 'Name',
        placeholder: 'Enter name',
      },
      {
        type: 'select',
        label: 'Status',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'all', label: 'All' },
        ],
        defaultValue: 'active',
      },
    ],
    savedQueries: [], // Empty for now
    onSearch: () => console.log('Search triggered'),
    onSave: () => console.log('Save triggered'),
    onClear: () => console.log('Clear triggered'),
    onAdvancedFilters: () => console.log('Advanced filters clicked'),
  };

  // Empty state configuration
  const emptyStateConfig = {
    title: 'No results found for your search',
    description: 'Please check your filters and search terms.',
    actions: (
      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={() => console.log('Refresh clicked')}
      >
        Refresh
      </Button>
    ),
  };

  return (
    <MainLayout
      header={<ApplicationHeader {...headerConfig} />}
      sidebar={sidebar.isOpen ? <FilterSidebar {...filterConfig} /> : null}
      mainContent={<EmptyState {...emptyStateConfig} />}
    />
  );
};

export default DeliveryPage; 
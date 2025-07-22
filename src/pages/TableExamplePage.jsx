import React from 'react';
import AppLayout from '../framework/layouts/AppLayout';
import { useExamplePage } from '../framework/hooks/useExamplePage';
import UsersPage from './users/UsersPage';

const TableExamplePage = () => {
  const {
    headerConfig,
    sidebarConfig,
  } = useExamplePage();

  return (
    <AppLayout
      headerConfig={headerConfig}
      navigationConfig={sidebarConfig}
    >
      <UsersPage />
    </AppLayout>
  );
};

export default TableExamplePage;

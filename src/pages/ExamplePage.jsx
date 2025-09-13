
import React from 'react';
import AppLayout from '../framework/layouts/AppLayout';
import ExampleContent from '../framework/components/content/ExampleContent';
import { useExamplePage } from '../framework/hooks/useExamplePage';

/**
 * ExamplePage - Demonstrates how to use the generic AppLayout.
 */
const ExamplePage = () => {
  const {
    headerConfig,
    sidebarConfig,
    layoutFeatures,
    handleSampleAction,
  } = useExamplePage();

  return (
    <AppLayout
      headerConfig={headerConfig}
      navigationConfig={sidebarConfig}
    >
      <ExampleContent
        layoutFeatures={layoutFeatures}
        onSampleAction={handleSampleAction}
      />
    </AppLayout>
  );
};

export default ExamplePage;

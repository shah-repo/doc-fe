import React, { ReactNode, useContext, useState } from 'react';
import { SelectedItemDetails } from './interface';

interface BulkMigrationConextType {
  selectedItems: SelectedItemDetails[]
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedItemDetails[]>>
}

interface BulkMigrationProviderProps {
  children: ReactNode
}

const BulkMigrationContext = React.createContext<BulkMigrationConextType>({} as BulkMigrationConextType);

export const BulkMigrationProvider: React.FC<BulkMigrationProviderProps> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItemDetails[]>([]);

  const contextValue = {
    selectedItems,
    setSelectedItems,
  };

  return (
    <BulkMigrationContext.Provider value={contextValue}>
      {children}
    </BulkMigrationContext.Provider>
  );
};

export const useBulkMigrationContext = () => {
  const context = useContext(BulkMigrationContext);
  if (context === undefined) {
    throw new Error('useMigrationContext must be used within a MigrationProvider');
  }
  return context;
};

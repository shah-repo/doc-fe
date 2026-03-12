import React, { createContext, useContext, useMemo } from 'react';
import { DamNumberingStyleRestrictions } from '../../../FBApprovalMatrixField/FBApprovalMatrixField.state';

interface DamRestrictionsContextType {
  restrictions?: DamNumberingStyleRestrictions
}

const DamRestrictionsContext = createContext<DamRestrictionsContextType | null>(null);

export const useDamRestrictions = () => {
  const ctx = useContext(DamRestrictionsContext);
  if (!ctx) {
    throw new Error('useDamRestrictions must be used within provider');
  }
  return ctx;
};

export const DamRestrictionsProvider: React.FC<{
  value: DamRestrictionsContextType
}> = ({ value, children }) => {
  const memoValue = useMemo(() => value, [value.restrictions]);

  return (
    <DamRestrictionsContext.Provider value={memoValue}>
      {children}
    </DamRestrictionsContext.Provider>
  );
};

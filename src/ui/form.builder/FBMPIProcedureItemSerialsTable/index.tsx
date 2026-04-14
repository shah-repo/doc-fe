/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { withThemeNext } from '../../layout/theme-next';
import FBSerialsTable from '../FBSerialsTable';
import { useLHRSSerialNumbers } from './hooks';
import { FBMPIProcedureItemSerialsTableProps } from './types';

const FBMPIProcedureItemSerialsTable: React.FC<FBMPIProcedureItemSerialsTableProps> = ({
  name = '',
  stepIndex = 1,
  isPreview = false,
  disabled = false,
}) => {
  const {
    stepSerialNumbers,
    isLoading,
    updateSerialNumber,
  } = useLHRSSerialNumbers(name, stepIndex);

  return (
    <FBSerialsTable
      serialNumbers={stepSerialNumbers}
      isLoading={isLoading}
      onUpdate={updateSerialNumber}
    />
  );
};

export default withThemeNext(FBMPIProcedureItemSerialsTable);

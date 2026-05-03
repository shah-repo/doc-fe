import { Box } from '@material-ui/core';
import React from 'react';
import { FBText } from '..';
import { withThemeNext } from '../../layout/theme-next';
import useStyles from '../FBMPIProcedureItem/FBMPIProcedureItem.styles';
import { FBProcedureItemLocale } from '../FBProcedureItem/FBProcedureItem.types';
import FBSerialsTable from '../FBSerialsTable';
import { useLHRSSerialNumbers } from './hooks';
import { FBMPIProcedureItemSerialsTableProps } from './types';

const FBMPIProcedureItemSerialsTable: React.FC<FBMPIProcedureItemSerialsTableProps> = ({
  name = '',
  isDisabled = false,
}) => {
  const classes = useStyles();
  const {
    shouldShowSerials,
    stepSerialNumbers,
    isLoading,
    updateSerialNumber,
    updateSerialNumbers,
  } = useLHRSSerialNumbers(name);

  if (!shouldShowSerials) {
    return null;
  }

  return (
    <>
      <Box className={classes.typeLabel}>
        <FBText loading={isLoading} locale={FBProcedureItemLocale.serials} />
      </Box>
      <FBSerialsTable
        isLoading={isLoading}
        isDisabled={isDisabled}
        serialNumbers={stepSerialNumbers}
        onUpdate={updateSerialNumber}
        onBulkUpdate={updateSerialNumbers}
      />
    </>

  );
};

export default withThemeNext(FBMPIProcedureItemSerialsTable);

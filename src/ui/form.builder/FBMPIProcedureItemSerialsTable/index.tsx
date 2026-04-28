/* eslint-disable @typescript-eslint/no-unused-vars */
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
}) => {
  const classes = useStyles();
  const {
    shouldShowSerials,
    stepSerialNumbers,
    isLoading,
    lhrsInfo,
    updateSerialNumber,
    updateSerialNumbers,
  } = useLHRSSerialNumbers(name);

  if (!shouldShowSerials) {
    return null;
  }

  console.log({
    lhrsInfo: JSON.parse(JSON.stringify(lhrsInfo)),
    stepSerialNumbers: JSON.parse(JSON.stringify(stepSerialNumbers)),
  });

  return (
    <>
      <Box className={classes.typeLabel}>
        <FBText loading={isLoading} locale={FBProcedureItemLocale.serials} />
      </Box>
      <FBSerialsTable
        serialNumbers={stepSerialNumbers}
        isLoading={isLoading}
        onUpdate={updateSerialNumber}
        onBulkUpdate={updateSerialNumbers}
      />
    </>

  );
};

export default withThemeNext(FBMPIProcedureItemSerialsTable);

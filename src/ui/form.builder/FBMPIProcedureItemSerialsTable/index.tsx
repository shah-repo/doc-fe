import cx from 'classnames';
import React, { useRef } from 'react';
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
  const toolbarRef = useRef<HTMLDivElement>(null);
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
    <div>
      <div className={cx(classes.typeLabel, classes.typeLabelContainer)}>
        <FBText loading={isLoading} locale={FBProcedureItemLocale.serials} />
        <div ref={toolbarRef} />
      </div>
      <FBSerialsTable
        isLoading={isLoading}
        isDisabled={isDisabled}
        serialNumbers={stepSerialNumbers}
        onUpdate={updateSerialNumber}
        onBulkUpdate={updateSerialNumbers}
        toolbarRef={toolbarRef}
      />
    </div>
  );
};

export default withThemeNext(FBMPIProcedureItemSerialsTable);

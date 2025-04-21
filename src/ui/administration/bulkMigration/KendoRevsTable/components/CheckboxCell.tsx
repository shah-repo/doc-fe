import React from 'react';
import { CellTemplate } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { Checkbox } from '../../../../components/forms/fields-next';
import { ISupplierScanResultRev } from '../../interface';
import { SELECTED_FIELD } from '../constants';

const CheckboxCell: CellTemplate<ISupplierScanResultRev> = ({ dataItem, selectionChange }) => (
  <Checkbox
    checked={dataItem[SELECTED_FIELD]}
    onChange={(event) => selectionChange?.({ syntheticEvent: event as React.SyntheticEvent })}
  />
);

export default CheckboxCell;

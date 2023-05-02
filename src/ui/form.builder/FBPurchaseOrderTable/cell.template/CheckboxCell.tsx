import React from 'react';
import { Checkbox } from '@material-ui/core';
import { CellTemplate } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { FBPurchaseOrderItem } from '../../FBPurchaseOrder/FBPurchaseOrder.types';

const CheckboxCell: CellTemplate<FBPurchaseOrderItem> = ({ dataItem, ...props }) => (
  <Checkbox checked={dataItem.tax} disabled />
);

export default CheckboxCell;

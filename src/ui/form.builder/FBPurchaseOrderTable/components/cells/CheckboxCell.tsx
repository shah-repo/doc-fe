import React from 'react';
import { CellTemplate } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { Checkbox } from '../../../../components/forms/fields-next';
import { FBPurchaseOrderItem } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';

const CheckboxCell: CellTemplate<FBPurchaseOrderItem> = ({ dataItem }) => (
  <Checkbox
    checked={dataItem.tax}
    disabled
  />
);

export default CheckboxCell;

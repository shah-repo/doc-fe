import React from 'react';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { FBPurchaseOrderItem, FBPurchaseOrderItemType } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';
import ValueWithNACell from './ValueWithNACell';

const TitleCell: CellComponent<FBPurchaseOrderItem> = ({
  dataItem,
  field,
  ...props
}) => (
  <ValueWithNACell
    {...props}
    field={dataItem.type === FBPurchaseOrderItemType.PRODUCT ? 'partNumberDocId' : 'serviceId'}
    dataItem={dataItem}
  />
);

export default TitleCell;

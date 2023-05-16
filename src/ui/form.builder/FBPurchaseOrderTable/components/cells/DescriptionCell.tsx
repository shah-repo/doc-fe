import React from 'react';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { FBPurchaseOrderItem, FBPurchaseOrderItemType } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';
import ContentCell from './ContentCell';

const DescriptionCell: CellComponent<FBPurchaseOrderItem> = ({
  dataItem,
  field,
  ...props
}) => (
  <ContentCell
    {...props}
    field={dataItem.type === FBPurchaseOrderItemType.PRODUCT ? 'partNumberTitle' : 'description'}
    dataItem={dataItem}
  />
);

export default DescriptionCell;

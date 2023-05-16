import React from 'react';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { FBPurchaseOrderItem } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';
import ContentCell from './ContentCell';

const ItemCell: CellComponent<FBPurchaseOrderItem> = ({
  dataItem,
  ...props
}) => (
  <ContentCell
    {...props}
    dataItem={dataItem}
  >
    {dataItem.index + 1}
  </ContentCell>
);

export default ItemCell;

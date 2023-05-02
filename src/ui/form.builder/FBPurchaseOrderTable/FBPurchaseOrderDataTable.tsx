import React from 'react';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridRowClickEvent } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBPurchaseOrderItem } from '../FBPurchaseOrder/FBPurchaseOrder.types';
import { FBPurchaseOrderTableProps } from './FBPurchaseOrderTable.types';
import COLUMNS from './column.definition';

const FBPurchaseOrderDataTable: React.FC<FBPurchaseOrderTableProps> = ({
  items = [],
  handleItem,
}) => {
  const showItemDetails = ({ dataItem }: DataGridRowClickEvent<FBPurchaseOrderItem>) => {
    handleItem?.(dataItem);
  };

  return (
    <KendoDataGrid<FBPurchaseOrderItem>
      schema={COLUMNS}
      data={items}
      onRowClick={showItemDetails}
    />
  );
};

export default FBPurchaseOrderDataTable;

import React from 'react';
import { FormattedNumber } from 'react-intl';
import { CellComponent } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import KendoDataGridCell from '../../../components/KendoDataGrid/KendoDataGridCell';
import { FBPurchaseOrderItem } from '../../FBPurchaseOrder/FBPurchaseOrder.types';

const SumCell: CellComponent<FBPurchaseOrderItem> = ({ dataItem, ...props }) => {
  return (
    <KendoDataGridCell
      {...props}
      dataItem={dataItem}
    >
      <FormattedNumber
        value={Number(dataItem.totalAmount)}
        style="currency"
        currency="usd"
      />
    </KendoDataGridCell>
  );
};

export default SumCell;

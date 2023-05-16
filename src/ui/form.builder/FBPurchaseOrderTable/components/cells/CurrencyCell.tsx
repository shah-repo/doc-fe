import React from 'react';
import { FormattedNumber } from 'react-intl';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { FBPurchaseOrderItem } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';
import ContentCell from './ContentCell';

const SumCell: CellComponent<FBPurchaseOrderItem, { currency?: string }> = ({
  dataItem,
  field,
  currency = 'usd',
  ...props
}) => {
  const value = Number(dataItem[field] ?? 0);

  return (
    <ContentCell
      {...props}
      field={field}
      dataItem={dataItem}
    >
      <FormattedNumber
        value={value}
        style="currency"
        currency={currency}
      />
    </ContentCell>
  );
};

export default SumCell;

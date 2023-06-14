import React from 'react';
import { FormattedNumber } from 'react-intl';
import { defaultCurrency } from '../../../../../common/intl';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { FBPurchaseOrderItem } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';
import ContentCell from './ContentCell';

const SumCell: CellComponent<FBPurchaseOrderItem, { currency?: string }> = ({
  dataItem,
  field,
  currency = defaultCurrency,
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
        // eslint-disable-next-line react/style-prop-object
        style="currency"
        currency={currency}
      />
    </ContentCell>
  );
};

export default SumCell;

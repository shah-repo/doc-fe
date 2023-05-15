import React from 'react';
import { translate } from '../../../../../common/intl';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { FBPurchaseOrderItem } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';
import ContentCell from './ContentCell';

const ValueWithNACell: CellComponent<FBPurchaseOrderItem> = ({
  dataItem,
  field,
  ...props
}) => (
  <ContentCell
    {...props}
    field={field}
    dataItem={dataItem}
  >
    {dataItem[field] || translate('common.not.applicable')}
  </ContentCell>
);

export default ValueWithNACell;

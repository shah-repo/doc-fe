import React from 'react';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import KendoDataGridCell from '../../../../components/KendoDataGrid/KendoDataGridCell';
import OveflowTooltip from '../../../../components/OverflowTooltip';
import { FBPurchaseOrderItem } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';
import { kebabCase } from 'lodash';

const ContentCell: CellComponent<FBPurchaseOrderItem> = ({
  dataItem,
  field,
  children,
  ...props
}) => {
  const value = children ?? dataItem[field];

  return (
    <KendoDataGridCell
      {...props}
      field={field}
      data-cy={kebabCase(field)}
      dataItem={dataItem}
    >
      <OveflowTooltip
        title={value}
        arrow
      >
        {value}
      </OveflowTooltip>
    </KendoDataGridCell>
  );
};

export default ContentCell;

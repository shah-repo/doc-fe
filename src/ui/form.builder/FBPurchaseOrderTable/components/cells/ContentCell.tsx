import { kebabCase } from 'lodash';
import React from 'react';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import KendoDataGridCell from '../../../../components/KendoDataGrid/KendoDataGridCell';
import OveflowTooltip from '../../../../components/OverflowTooltip';
import { FBPurchaseOrderItem } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';

const ContentCell: CellComponent<FBPurchaseOrderItem> = ({
  dataItem,
  field,
  column,
  children,
  ...props
}) => {
  const value: unknown = children ?? dataItem[field];

  return (
    <KendoDataGridCell
      {...props}
      field={field}
      data-cy={kebabCase(String(props['data-cy']) ?? field ?? column.id)}
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

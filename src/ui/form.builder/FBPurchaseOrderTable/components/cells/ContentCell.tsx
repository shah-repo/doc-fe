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
  const dataCy = props['data-cy'] ?? kebabCase(field ?? column.id);

  return (
    <KendoDataGridCell
      {...props}
      field={field}
      data-cy={dataCy}
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

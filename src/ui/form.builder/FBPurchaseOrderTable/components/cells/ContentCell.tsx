import { kebabCase } from 'lodash';
import React, { ReactNode } from 'react';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import KendoDataGridCell from '../../../../components/KendoDataGrid/KendoDataGridCell';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { FBPurchaseOrderItem } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';

const ContentCell: CellComponent<FBPurchaseOrderItem> = ({
  dataItem,
  field,
  column,
  children,
  ...props
}) => {
  const value: unknown = children ?? (dataItem[field] as ReactNode);
  const dataCy = props['data-cy'] ?? kebabCase(field ?? column.id);

  return (
    <KendoDataGridCell
      {...props}
      field={field}
      data-cy={dataCy}
      dataItem={dataItem}
    >
      <OverflowTooltip
        title={value}
        arrow
      >
        {value}
      </OverflowTooltip>
    </KendoDataGridCell>
  );
};

export default ContentCell;

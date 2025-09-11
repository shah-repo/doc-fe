import { kebabCase } from 'lodash';
import React, { ReactNode } from 'react';
import StyledLink from '../../../../components/common/kendo/StyledLink';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import KendoDataGridCell from '../../../../components/KendoDataGrid/KendoDataGridCell';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import { FBPurchaseOrderItem } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';

const ContentCell: CellComponent<FBPurchaseOrderItem> = ({
  dataItem,
  field,
  column,
  children,
  ...props
}) => {
  const value: ReactNode = children ?? (dataItem[field] as ReactNode);
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
        { field === 'partNumberDocId'
          ? <StyledLink
              to={
                dataItem?.partNumber && dataItem?.partNumberDocumentId
                  ? documentVersionPath(dataItem?.partNumber, dataItem?.partNumberDocumentId)
                  : '#'
              }
              onClick={(e) => {
                e.stopPropagation();
              }}
              data-cy="selected-product-or-service-link"
            >
              {dataItem.partNumberDocId}
            </StyledLink> : value
        }
      </OverflowTooltip>
    </KendoDataGridCell>
  );
};

export default ContentCell;

import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import React, { MouseEventHandler } from 'react';
import { Button, IconButton } from '../../../../components/forms/fields-next';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import KendoDataGridCell from '../../../../components/KendoDataGrid/KendoDataGridCell';
import Text from '../../../../components/Text';
import useHover from '../../../../hooks/useHover';
import { FBPurchaseOrderItem, FBPurchaseOrderItemType, FBPurchaseOrderProps } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';

interface Props {
  onDelete: (index: number) => MouseEventHandler
  onLotCreate: FBPurchaseOrderProps['handleLot']
  isReceivable?: boolean
  disabled?: boolean
}

const ActionCell: CellComponent<FBPurchaseOrderItem, Props> = ({
  dataIndex,
  dataItem,
  onDelete,
  onLotCreate,
  isReceivable,
  disabled,
  ...props
}) => {
  const [ref, isHovered] = useHover<HTMLButtonElement>();
  const isDeleteAllowed = !isReceivable && !disabled;
  const isCreateLOTAllowed = isReceivable && dataItem.type === FBPurchaseOrderItemType.PRODUCT;

  return (
    <KendoDataGridCell
      {...props}
      data-cy={isReceivable ? 'create-lot' : 'remove'}
      dataIndex={dataIndex}
      dataItem={dataItem}
      onClick={null}
    >
      {isDeleteAllowed && (
        <Tooltip
          title={<Text message="common.delete" />}
          arrow
        >
          <IconButton
            kind="destructive"
            onClick={onDelete(dataIndex)}
            ref={ref}
          >
            <FontAwesomeIcon icon={isHovered ? solid('trash-can') : regular('trash-can')} />
          </IconButton>
        </Tooltip>
      )}
      {isCreateLOTAllowed && (
        <Button
          kind="outlined"
          size="small"
          onClick={(e) => onLotCreate?.(e, dataItem)}
        >
          <Text message="form.builder.po.create.a.lot" />
        </Button>
      )}
    </KendoDataGridCell>
  );
};

export default ActionCell;

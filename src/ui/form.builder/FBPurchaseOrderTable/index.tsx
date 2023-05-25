import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import { GridProps } from '@progress/kendo-react-grid';
import cx from 'classnames';
import React from 'react';
import { FBPurchaseOrderItem } from '..';
import AlertDialog from '../../app/alert.dialog/AlertDialog';
import { Button } from '../../components/forms/fields-next';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridRowClickEvent } from '../../components/KendoDataGrid/KendoDataGrid.types';
import Text from '../../components/Text';
import ActionCell from './components/cells/ActionCell';
import SumCell from './components/cells/CurrencyCell';
import RecievedCell from './components/cells/RecievedCell';
import Total from './components/Total';
import baseShema from './schema';
import useStyles from './styles';
import { FBPurchaseOrderTableProps } from './types';
import { withFBPurchaseOrderTable } from './wrap';

const FBPurchaseOrderTable: React.FunctionComponent<FBPurchaseOrderTableProps> = ({
  handleShippingCostChange,
  handleTaxChange,
  handleTaxRateChange,
  handleCurrencyChange,
  handleDelete,
  handleItem,
  handleLot,
  reCalculateValueOnBlur,
  onAlertNotificationConfirm,
  onAlertNotificationCancel,
  onAddLineItemClick,
  calculation,
  disabled,
  items = [],
  loading,
  mode,
  name = '',
  isReceivable,
  isPOAddAction,
  isPORemoveAction,
  dialog,
}) => {
  const classes = useStyles();
  const isActionsAllowed = !disabled || isReceivable;

  const editItem = ({ dataItem }: DataGridRowClickEvent<FBPurchaseOrderItem>) => {
    handleItem?.(dataItem);
  };

  const rowRender: GridProps['rowRender'] = (row) => React.cloneElement(row, {
    ['data-cy' as string]: 'po-items',
  });

  const schema = baseShema.map((column) => {
    if (['price', 'sum'].includes(column.id)) {
      return {
        ...column,
        hidden: isReceivable,
        className: classes.currencyCell,
        headerClassName: classes.currencyCell,
        cell: (props) => (
          <SumCell
            {...props}
            currency={calculation?.currency}
          />
        ),
      };
    }
    if (column.id === 'received') {
      return {
        ...column,
        cell: (props) => (
          <RecievedCell
            {...props}
            loading={loading}
          />
        ),
      };
    }
    if (column.id === 'tax') {
      return {
        ...column,
        hidden: isReceivable,
      };
    }
    if (column.id === 'action') {
      return {
        ...column,
        hidden: !isActionsAllowed,
        width: isReceivable ? 125 : 40,
        className: cx(classes.actionCell, { [classes.lotCell]: isReceivable }),
        cell: (props) => (
          <ActionCell
            {...props}
            disabled={disabled}
            isReceivable={isReceivable}
            onDelete={handleDelete}
            onLotCreate={handleLot}
          />
        ),
      };
    }
    return column;
  });

  return (
    <>
      <Box mb={2} position="relative">
        {isReceivable && (
          <Box className={classes.lotMessage}>
            <FontAwesomeIcon icon={regular('circle-info')} />
            <Text translation="receiving.table.header.text" />
          </Box>
        )}
        <KendoDataGrid<FBPurchaseOrderItem>
          data={items}
          schema={schema}
          className={cx(classes.grid, { [classes.activeGrid]: !disabled })}
          rowRender={rowRender}
          onRowClick={editItem}
          fullWidth
          hasBoxScrollbars
        />
        {!disabled && (
          <Button
            kind="add"
            attached
            fullWidth
            onClick={onAddLineItemClick}
            data-cy="form-builder-add-line-item"
          >
            <Text message="form.builder.add.line.item" />
          </Button>
        )}
        {!isReceivable && (
          <Total
            {...{
              handleShippingCostChange,
              handleTaxChange,
              handleTaxRateChange,
              handleCurrencyChange,
              reCalculateValueOnBlur,
              calculation,
              disabled,
              name,
            }}
          />
        )}
      </Box>

      {dialog && onAlertNotificationConfirm && (
        <AlertDialog
          dialog={dialog}
          confirmAction={onAlertNotificationConfirm}
          cancelAction={onAlertNotificationCancel}
          confirmLabel="common.yes.proceed"
          message={
            isPOAddAction
              ? 'documentRevision.po.notification.alert.add'
              : isPORemoveAction
                ? 'documentRevision.po.notification.alert.remove'
                : 'documentRevision.po.notification.alert.update'
          }
        />
      )}
    </>
  );
};

export default withFBPurchaseOrderTable(FBPurchaseOrderTable);

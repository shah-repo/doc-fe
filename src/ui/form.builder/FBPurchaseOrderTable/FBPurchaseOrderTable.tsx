import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, TableBody } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import cx from 'classnames';
import React from 'react';
import { FBButton, FBPurchaseOrderItem, FBPurchaseOrderTableDetails, FBPurchaseOrderTableSum, FBPurchaseOrderTableTotal, FBTableCell } from '..';
import { ReactComponent as PlusIcon } from '../../../assets/images/plus_icon_add_btn.svg';
import AlertDialog from '../../app/alert.dialog/AlertDialog';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import Text from '../../components/Text';
import { Button } from '../../components/forms/fields-next';
import { useStyles } from './FBPurchaseOrderTable.styles';
import { FBPurchaseOrderTableProps } from './FBPurchaseOrderTable.types';
import { withFBPurchaseOrderTable } from './FBPurchaseOrderTable.wrap';
import Total from './components/Total';
import ActionCell from './components/cells/ActionCell';
import SumCell from './components/cells/CurrencyCell';
import RecievedCell from './components/cells/RecievedCell';
import baseShema from './schema';

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
  classes,
  calculation,
  disabled,
  items = [],
  loading,
  mode,
  name = '',
  isReceivable,
  isPOAddAction,
  dialog,
}) => {
  const gridClasses = useStyles();
  const isActionsAllowed = !disabled || isReceivable;

  const schema = baseShema.map((column) => {
    if (['price', 'sum'].includes(column.id)) {
      return {
        ...column,
        hidden: isReceivable,
        className: gridClasses.currencyCell,
        headerClassName: gridClasses.currencyCell,
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
        className: cx(gridClasses.actionCell, { [gridClasses.lotCell]: isReceivable }),
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
          <Box className={gridClasses.lotMessage}>
            <FontAwesomeIcon icon={regular('circle-info')} />
            <Text translation="receiving.table.header.text" />
          </Box>
        )}
        <KendoDataGrid<FBPurchaseOrderItem>
          data={items}
          schema={schema}
          className={cx(gridClasses.grid, { [gridClasses.activeGrid]: !disabled })}
          onRowClick={({ dataItem }) => { handleItem?.(dataItem); }}
          fullWidth
          hasBoxScrollbars
        />
        {!disabled && (
          <Button
            kind="add"
            attached
            fullWidth
            onClick={onAddLineItemClick}
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

      <Table className={classes?.root}>
        <TableBody>
          <TableRow>
            <FBTableCell colSpan={8} className={classes?.list}>
              <FBPurchaseOrderTableDetails {...{
                handleDelete,
                handleItem,
                classes,
                items,
                mode,
                loading,
                calculation,
                isReceivable,
              }} />
            </FBTableCell>
            <FBTableCell colSpan={2} className={classes?.sum}>
              <FBPurchaseOrderTableSum {...{ handleItem, handleLot, classes, items, calculation, mode, isReceivable }} />
            </FBTableCell>
          </TableRow>
          {!disabled && (
            <TableRow>
              <FBTableCell colSpan={10}>
                <FBButton
                  label="form.builder.add.line.item"
                  onClick={onAddLineItemClick}
                  fullWidth
                  showNewButton
                  startIcon={<PlusIcon />}
                  className={classes?.button}
                  newVariant={true}
                  {...{ disabled }} />
              </FBTableCell>
            </TableRow>
          )}
          {mode === 'form' && (
            <FBPurchaseOrderTableTotal {...{
              handleShippingCostChange,
              handleTaxChange,
              handleTaxRateChange,
              handleCurrencyChange,
              reCalculateValueOnBlur,
              calculation,
              disabled,
              name,
            }} />
          )}
        </TableBody>
      </Table>
      {dialog && onAlertNotificationConfirm
        && <AlertDialog
          confirmAction={onAlertNotificationConfirm}
          cancelAction={onAlertNotificationCancel}
          confirmLabel="common.yes.proceed"
          message={isPOAddAction ? 'documentRevision.po.notification.alert.add'
            : 'documentRevision.po.notification.alert.remove'}
          {...{ dialog }}
        />}
    </>
  );
};

export default withFBPurchaseOrderTable(FBPurchaseOrderTable);

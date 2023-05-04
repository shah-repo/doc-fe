import { TableBody } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { FBButton, FBPurchaseOrderTableDetails, FBPurchaseOrderTableSum, FBPurchaseOrderTableTotal, FBTableCell } from '..';
import { ReactComponent as PlusIcon } from '../../../assets/images/plus_icon_add_btn.svg';
import AlertDialog from '../../app/alert.dialog/AlertDialog';
import { FBPurchaseOrderTableProps } from './FBPurchaseOrderTable.types';
import { withFBPurchaseOrderTable } from './FBPurchaseOrderTable.wrap';

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
  classes,
  calculation,
  disabled,
  items = [],
  loading,
  mode,
  name,
  isReceivable,
  dialog,
}) => (
  <>
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
                onClick={() => handleItem && handleItem()}
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
      message="documentRevision.po.notification.alert.remove"
      {...{ dialog }}
    />}
  </>
);

export default withFBPurchaseOrderTable(FBPurchaseOrderTable);

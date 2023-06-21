import { Grid } from '@material-ui/core';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBInputProps, FBTextField, FBWorkspaceModeOptions } from '..';
import { DEDUCTABLE_TRANSFER_TYPES } from '../FBLotTransfers/constants';
import { LotTransfer, LotTransferType } from '../FBLotTransfers/types';

const FBLotOnHandQuantityField: React.FC<FBInputProps> = ({
  name = '',
  label,
  ...props
}) => {
  const { workspaceState, formState } = FB.useStores();
  const { workspaceMode: mode } = formState ?? {};
  const transfers = useObserver(() => workspaceState?.formInputSync.get('lot_transfers') as LotTransfer[]);
  const initialQuantity = useObserver(() => workspaceState?.formInputSync.get('lot_usable_quantity') as number);
  const unit = useObserver(() => workspaceState?.formInputSync.get('lot_usable_quantity_unit') as string);

  const value = transfers?.reduce((sum, transfer) => {
    const shouldDeduct = DEDUCTABLE_TRANSFER_TYPES.includes(transfer.type);
    const shouldAdd = transfer.type !== LotTransferType.Move;
    if (shouldDeduct) {
      return sum - transfer.quantity;
    }
    if (shouldAdd) {
      return sum + transfer.quantity;
    }
    return sum;
  }, initialQuantity) ?? initialQuantity;

  if (mode === FBWorkspaceModeOptions.PREVIEW) {
    const compoundValue = initialQuantity ? `${value ?? ''} ${unit ?? ''}` : '';

    return (
      <FBTextField
        label={label}
        name={undefined}
        gutter={false}
        defaultValue={compoundValue}
        value={compoundValue}
        disabled
      />
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid item md={8} xs={6}>
        <FBTextField
          label={label}
          name={undefined}
          gutter={false}
          value={value}
          disabled
        />
      </Grid>
      <Grid item md={4} xs={6}>
        <FBTextField
          label="form.builder.field.units"
          name={undefined}
          gutter={false}
          value={unit}
          disabled
        />
      </Grid>
    </Grid>
  );
};

export default FBLotOnHandQuantityField;

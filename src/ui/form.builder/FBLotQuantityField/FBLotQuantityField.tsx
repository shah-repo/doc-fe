import { Grid } from '@material-ui/core';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBInputProps, FBTextField, FBWorkspaceModeOptions } from '..';
import FBUnitMeasures from '../FBUnitMeasures/FBUnitMeasures';

const getUnitsLabel = (name: string) => {
  switch (name) {
    case 'lot_quantity':
      return 'form.builder.field.units.buy';
    case 'lot_usable_quantity':
      return 'form.builder.field.units.use';
    default:
      return 'form.builder.field.units';
  }
};

const FBQuantityField: React.FC<FBInputProps> = ({
  name = '',
  ...props
}) => {
  const { workspaceState, formState } = FB.useStores();
  const { workspaceMode: mode } = formState ?? {};
  const value = formState?.getFieldValue(name) as number;
  const unit = useObserver(() => workspaceState?.formInputSync.get(`${name}_unit`) as string);
  const unitsLabel = getUnitsLabel(name);

  if (mode === FBWorkspaceModeOptions.PREVIEW) {
    return (
      <FBTextField
        {...props}
        name={undefined}
        gutter={false}
        defaultValue={`${value ?? ''} ${unit ?? ''}`}
        disabled
      />
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid item md={8} xs={6}>
        <FBTextField
          {...props}
          name={name}
          type="number"
          inputProps={{ min: '0' }}
          gutter={false}
          placeholder="0"
        />
      </Grid>
      <Grid item md={4} xs={6}>
        <FBUnitMeasures
          {...props}
          label={unitsLabel}
          gutter={false}
          name={`${name}_unit`}
        />
      </Grid>
    </Grid>
  );
};

export default FBQuantityField;

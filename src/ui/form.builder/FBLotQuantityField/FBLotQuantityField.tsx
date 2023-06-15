import { Grid } from '@material-ui/core';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBInputProps, FBTextField, FBWorkspaceModeOptions } from '..';
import FBUnitMeasures from '../FBUnitMeasures/FBUnitMeasures';

const FBQuantityField: React.FC<FBInputProps> = ({
  name = '',
  ...props
}) => {
  const { workspaceState, formState } = FB.useStores();
  const { workspaceMode: mode } = formState ?? {};
  const unit = useObserver(() => workspaceState?.formInputSync.get(`${name}_unit`) as string);
  const value = formState?.getFieldValue(name) as number;

  if (mode === FBWorkspaceModeOptions.PREVIEW) {
    return (
      <FBTextField
        {...props}
        name={undefined}
        gutter={false}
        defaultValue={`${value} ${unit}`}
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
        />
      </Grid>
      <Grid item md={4} xs={6}>
        <FBUnitMeasures
          {...props}
          label="form.builder.field.units"
          gutter={false}
          name={`${name}_unit`}
        />
      </Grid>
    </Grid>
  );
};

export default FBQuantityField;

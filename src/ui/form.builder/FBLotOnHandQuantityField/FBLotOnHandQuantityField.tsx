import { Grid } from '@material-ui/core';
import { kebabCase } from 'lodash';
import React from 'react';
import { FB, FBInputProps, FBTextField, FBWorkspaceModeOptions } from '..';
import { useOnHandQuantity } from '../FBLotTransfers/utils';

const FBLotOnHandQuantityField: React.FC<FBInputProps> = ({
  name = '',
  label,
  ...props
}) => {
  const { formState } = FB.useStores();
  const { workspaceMode: mode } = formState ?? {};
  const { initialQuantity, onHandQuantity, onHandQuantityUnit } = useOnHandQuantity();

  const cyName = kebabCase(name);

  if (mode === FBWorkspaceModeOptions.PREVIEW) {
    const compoundValue = initialQuantity ? `${onHandQuantity ?? ''} ${onHandQuantityUnit}` : '';

    return (
      <FBTextField
        {...props}
        label={label}
        name={undefined}
        dataCy={kebabCase(name)}
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
          {...props}
          label={label}
          name={undefined}
          dataCy={cyName}
          gutter={false}
          value={onHandQuantity ?? ''}
          disabled
        />
      </Grid>
      <Grid item md={4} xs={6}>
        <FBTextField
          {...props}
          label="form.builder.field.units"
          dataCy={`${cyName}-unit`}
          name={undefined}
          gutter={false}
          value={onHandQuantityUnit}
          disabled
        />
      </Grid>
    </Grid>
  );
};

export default FBLotOnHandQuantityField;

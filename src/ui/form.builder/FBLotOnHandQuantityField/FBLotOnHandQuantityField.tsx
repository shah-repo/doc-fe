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
  const { onHandQuantity, onHandQuantityUnit } = useOnHandQuantity();

  const isPreview = formState?.workspaceMode === FBWorkspaceModeOptions.PREVIEW;
  const cyName = kebabCase(name);

  return (
    <Grid container spacing={1}>
      <Grid item md={8} xs={6}>
        <FBTextField
          {...props}
          label={label}
          name={undefined}
          dataCy={cyName}
          gutter={false}
          value={isPreview ? undefined : onHandQuantity}
          defaultValue={isPreview ? onHandQuantity : undefined}
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
          value={isPreview ? undefined : onHandQuantityUnit}
          defaultValue={isPreview ? onHandQuantityUnit : undefined}
          disabled
        />
      </Grid>
    </Grid>
  );
};

export default FBLotOnHandQuantityField;

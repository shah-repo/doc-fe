import { Grid } from '@material-ui/core';
import React from 'react';
import { FBInputProps, FBTextField } from '..';
import { translate } from '../../../common/intl';

const FBCustomerHeaderQuaterAddress: React.FC<FBInputProps> = ({
  name = '',
  label = '',
  ...props
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item md={6} xs={6}>
        <FBTextField
          {...props}
          label={label}
          name={name}
          multiline
          rows={3}
          gutter={false}
          placeholder=""
        />
      </Grid>
      <Grid item md={2} xs={6}>
        <FBTextField
          {...props}
          label={translate('form.builder.customer.city.label')}
          name={`${name}City`}
          gutter={false}
          placeholder=""
        />
      </Grid>
      <Grid item md={2} xs={6}>
        <FBTextField
          {...props}
          label={translate('form.builder.customer.zip.code.label')}
          name={`${name}ZipCode`}
          inputProps={{ min: '0' }}
          gutter={false}
          placeholder=""
        />
      </Grid>
      <Grid item md={2} xs={6}>
        <FBTextField
          {...props}
          label={translate('form.builder.customer.country.label')}
          name={`${name}Country`}
          gutter={false}
          placeholder=""
        />
      </Grid>
    </Grid>
  );
};

export default FBCustomerHeaderQuaterAddress;

import { Box, CircularProgress, Grid, TextField, Typography } from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { find, isEmpty } from 'lodash';
import React from 'react';
import { translate } from '../../../common/intl';
import styles from './FBShippingAddress.styles';
import { withFBShippingAddress } from './FBShippingAddress.wrap';
import { Contact, FBShippingAddresProps } from './types';

const FBShippingAddress: React.FC<FBShippingAddresProps> = ({ options, handleChange, shippingAddresses, value, loading, disabled }) => {
  const classes = styles();
  const attention = find(value?.siteContact, { attention: true }) ?? ({} as Contact);
  const shipping = find(value?.siteContact, { shipping: true }) ?? ({} as Contact);

  return (
    <div>
      <Box className={classes.shippingInfo}>
        <Grid xs={12} container>
          <Grid xs={6} className={classes.fieldContainer} >
            <Typography
              className={classes.label}
              data-cy="shipping-info-customer"
              component="span"
            >
              {translate('form.builder.record.shipping.info.label.shipping.address')}
            </Typography>
            <Autocomplete
              key={isEmpty(options) ? 'disabled' : 'enabled'}
              options={options}
              getOptionLabel={(option) => option.label ?? ''}
              loading={loading}
              disabled={disabled}
              onChange={handleChange}
              value={value}
              renderInput={(params: RenderInputParams) => (
                <Box display="flex">
                  <Box width="100%">
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      placeholder={translate('lhr.summary.placeholder.select.enter')}
                      InputProps={{
                        ...params.InputProps,
                        style: { padding: '0px 30px 0px 9px', borderRadius: 3 },
                        startAdornment: <div>{params.InputProps.startAdornment}</div>,
                        endAdornment: (
                          <>
                            {loading && (
                              <CircularProgress color="inherit" size={16} />
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  </Box>
                </Box>
              )}
            />
          </Grid>
          <Grid xs={6}>
            <Box className={classes.shippingInfoContainer}>
              <Grid xs={6}>
                <Box className={classes.shippingInfoCard}>
                  <Typography
                    className={classes.cardHeading}
                    data-cy="shipping-info-customer"
                    component="span"
                  >
                    {translate('form.builder.record.shipping.info.heading.shipping.attention')}
                  </Typography>
                  <Typography
                    className={classes.cardInfo}
                    data-cy="shipping-info-customer"
                    component="span"
                  >
                    {attention.name && <>
                      {attention.name} (<span className={classes.cardEmail}>{attention.email}</span>)
                    </>}
                  </Typography>
                  {attention.phoneNumber && <Typography
                    className={classes.cardInfo}
                    data-cy="shipping-info-customer"
                    component="span"
                  >
                    +{attention.phoneNumber}
                  </Typography>}
                </Box>
              </Grid>
              <Grid xs={6}>
                <Box className={classes.shippingInfoCard} >
                  <Typography
                    className={classes.cardHeading}
                    data-cy="shipping-info-customer"
                    component="span"
                  >
                    {translate('form.builder.record.shipping.info.heading.shipping.contact')}
                  </Typography>
                  <Typography
                    className={classes.cardInfo}
                    data-cy="shipping-info-customer"
                    component="span"
                  >
                    {shipping.name && <>
                      {shipping.name} (<span className={classes.cardEmail} >{shipping.email}</span>)
                    </>}
                  </Typography>
                  {shipping.phoneNumber && <Typography
                    className={classes.cardInfo}
                    data-cy="shipping-info-customer"
                    component="span"
                  >
                    +{shipping.phoneNumber}
                  </Typography>}
                </Box>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default withFBShippingAddress(FBShippingAddress);

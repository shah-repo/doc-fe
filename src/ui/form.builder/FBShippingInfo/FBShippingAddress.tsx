import { Box, CircularProgress, Grid, TextField, Typography } from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { find, isEmpty } from 'lodash';
import React from 'react';
import { translate } from '../../../common/intl';
import styles from './FBShippingAddress.styles';
import { withFBShippingAddress } from './FBShippingAddress.wrap';
import { Contact, FBShippingAddresProps } from './types';

const FBShippingAddress: React.FC<FBShippingAddresProps> = ({ options, handleChange, value, loading, disabled, isShippingAddressEmpty }) => {
  const classes = styles();
  const attention = find(value?.siteContact, { attention: true });
  const shipping = find(value?.siteContact, { shipping: true });

  const renderInfoCardDetails = (
    type: string,
    name?: string,
    email?: string,
    phoneNumber?: string,
  ) => (
    <>
      {(name || email) && (
        <Typography
          className={classes.cardInfo}
          data-cy={`${type}-info-name-email`}
          component="span"
        >
          {name}{email && <span className={classes.cardEmail}> ({email})</span>}
        </Typography>
      )}
      {phoneNumber && (
        <Typography
          className={classes.cardInfo}
          data-cy={`${type}-info-phone-number`}
          component="span"
        >
          {phoneNumber}
        </Typography>
      )}
    </>
  );

  const InfoCard = ({ title, info, type }: {
    title: string
    info?: Contact
    type: string
  }) => (
    <Box className={classes.shippingInfoCard}>
      <Typography
        className={classes.cardHeading}
        data-cy={`${type}-info-heading`}
        component="span"
      >
        {title}
      </Typography>
      {renderInfoCardDetails(type, info?.name, info?.email, info?.phoneNumber)}
    </Box>
  );

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
              disableClearable
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
                      placeholder={translate('common.select')}
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
          {!isShippingAddressEmpty && <Grid xs={6}>
            <Box className={classes.shippingInfoContainer}>
              <Grid xs={6}>
                <InfoCard
                  title={translate('form.builder.record.shipping.info.heading.shipping.attention')}
                  info={attention}
                  type="attention"
                />
              </Grid>
              <Grid xs={6}>
                <InfoCard
                  title={translate('form.builder.record.shipping.info.heading.shipping.contact')}
                  info={shipping}
                  type="shipping"
                />
              </Grid>
            </Box>
          </Grid>}
        </Grid>
      </Box>
    </div>
  );
};

export default withFBShippingAddress(FBShippingAddress);

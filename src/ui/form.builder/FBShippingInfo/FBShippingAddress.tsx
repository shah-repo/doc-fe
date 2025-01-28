import { Box, Grid, Typography } from '@material-ui/core';
import { find, isEmpty } from 'lodash';
import React from 'react';
import { translate } from '../../../common/intl';
import { Autocomplete } from '../../components/forms/fields-next';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import styles from './FBShippingAddress.styles';
import { withFBShippingAddress } from './FBShippingAddress.wrap';
import { Contact, FBShippingAddressProps } from './types';

const FBShippingAddress: React.FC<FBShippingAddressProps> = ({ options, handleChange, value, isLoading, disabled, isShippingAddressEmpty }) => {
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
              blurOnSelect
              key={isEmpty(options) ? 'disabled' : 'enabled'}
              options={options}
              disableClearable
              placeholder={translate('common.select')}
              disabled={disabled}
              onChange={handleChange}
              value={value}
              data-cy="shipping-address-field"
              getOptionLabel={(option: OptionType) => option.label}
              size="small"
              loading={isLoading}
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

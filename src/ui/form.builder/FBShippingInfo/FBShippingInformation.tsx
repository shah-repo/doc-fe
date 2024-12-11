import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import { Autocomplete } from '../../components/forms/fields-next';
import FBSection from '../FBSection/FBSection';
import styles from './FBShippingInformation.styles';

const FBShippingInformation = () => {
  const classes = styles();
  return (
    <div>
      <FBSection label="Shipping Information" />
      <Box className={classes.shippingInfo}>
        <Grid xs={6} className={classes.fieldContainer}>
          <Typography
            className={classes.label}
            data-cy="shipping-info-customer"
            component="span"
          >
            {translate('form.builder.record.shipping.info.label.customer')}
          </Typography>
          <Autocomplete />
        </Grid>
        <Grid xs={12} container>
          <Grid xs={6} className={classes.fieldContainer} >
            <Typography
              className={classes.label}
              data-cy="shipping-info-customer"
              component="span"
            >
              {translate('form.builder.record.shipping.info.label.shipping.address')}
            </Typography>
            <Autocomplete />
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
            Darlene Robertson (<span className={classes.cardEmail}>darlene@mail.com</span>)
                  </Typography>
                  <Typography
                    className={classes.cardInfo}
                    data-cy="shipping-info-customer"
                    component="span"
                  >
+55 (24) 1234-5478
                  </Typography>
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
Wade Warren (<span className={classes.cardEmail} >wade@mail.com</span>)
                  </Typography>
                  <Typography
                    className={classes.cardInfo}
                    data-cy="shipping-info-customer"
                    component="span"
                  >
+55 (24) 5548-2134
                  </Typography>
                </Box>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default FBShippingInformation;

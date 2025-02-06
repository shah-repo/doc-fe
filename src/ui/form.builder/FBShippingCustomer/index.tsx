import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { get } from 'lodash';
import React from 'react';
import { Colors } from '../../layout/theme-next';
import FBAutocompleteAsync from '../FBAutocompleteAsync/FBAutocompleteAsync';
import useStyles from './styles';
import { withFBShippingCustomer } from './wrap';

const FBShippingCustomer: React.FC = (props) => {
  const classes = useStyles();
  console.log('props', props);

  return (
    <Grid container style={{ width: '100%' }}>
      <Grid item xs="auto"
        className={classes.shippingInfo}
      >
        <span className={classes.infoIcon}>
          <Tooltip arrow title="New revision available" placement="top-start">
            <FontAwesomeIcon
              data-cy="new-revision-available"
              color={Colors.primaryLight}
              className={classes.infoIcon}
              icon={solid('circle-exclamation')}
            />
          </Tooltip>
        </span>
      </Grid>
      <Grid item xs>
        <FBAutocompleteAsync
          {...props}
          label={<span className={classes.infoIcon}>
            <Tooltip arrow title="New revision available" placement="top-start">
              <>{get(props, 'label')}<FontAwesomeIcon
                data-cy="new-revision-available"
                color={Colors.primaryLight}
                className={classes.infoIcon}
                icon={solid('circle-exclamation')}
              /></>
            </Tooltip>
          </span>}
          data-cy="shipping-address-field" />
      </Grid>
    </Grid>
  );
};

export default withFBShippingCustomer(FBShippingCustomer);

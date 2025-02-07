import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import React from 'react';
import { Colors } from '../../layout/theme-next';
import FBAutocompleteAsync from '../FBAutocompleteAsync/FBAutocompleteAsync';
import useStyles from './styles';
import { FBShippingCustomerProps } from './types';
import { withFBShippingCustomer } from './wrap';

const FBShippingCustomer: React.FC<FBShippingCustomerProps> = ({
  latestRevisionSummary,
  resetOBSCustomerSelection,
  updateLatestAvailableRevision,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.grid}>
      <Grid item xs="auto" className={classes.shippingInfo}>
        <span className={classes.infoIcon}>
          {latestRevisionSummary.hasReleasedRevision && (
            <Tooltip
              arrow
              title="Released revision available"
              placement="top-start"
            >
              <FontAwesomeIcon
                data-cy="new-revision-available"
                color={Colors.primaryLight}
                className={classes.infoIcon}
                onClick={updateLatestAvailableRevision}
                icon={solid('circle-exclamation')}
              />
            </Tooltip>
          )}
          {latestRevisionSummary.hasOBSRevision && (
            <Tooltip arrow title="OBS revision available" placement="top-start">
              <FontAwesomeIcon
                className={classes.infoIcon}
                onClick={resetOBSCustomerSelection}
                color={Colors.error}
                icon={solid('triangle-exclamation')}
              />
            </Tooltip>
          )}
        </span>
      </Grid>
      <Grid item xs>
        <FBAutocompleteAsync
          {...props}
          autosave
          withState
          data-cy="shipping-address-field"
        />
      </Grid>
    </Grid>
  );
};

export default withFBShippingCustomer(FBShippingCustomer);

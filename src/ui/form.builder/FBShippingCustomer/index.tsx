import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import { Colors } from '../../layout/theme-next';
import FBAutocompleteAsync from '../FBAutocompleteAsync/FBAutocompleteAsync';
import { FBAutocompleteAsyncOption } from '../FBAutocompleteAsync/FBAutocompleteAsync.types';
import useStyles from './styles';
import { FBShippingCustomerProps } from './types';
import { withFBShippingCustomer } from './wrap';

const FBShippingCustomer: React.FC<FBShippingCustomerProps> = ({
  latestRevisionSummary,
  resetOBSCustomerSelection,
  updateLatestAvailableRevision,
  autocompleteKey,
  defaultValue,
  onShippingCustomerChange,
  ...props
}) => {
  const classes = useStyles();
  const { hasObsoleteRevision, hasReleasedRevision }
    = latestRevisionSummary ?? {};
  return (
    <Grid container className={classes.grid}>
      {(hasObsoleteRevision || hasReleasedRevision) && !props.disabled && (
        <Grid item xs="auto" className={classes.shippingInfo}>
          <span className={classes.infoIcon}>
            {hasReleasedRevision && (
              <Tooltip
                arrow
                title={translate(
                  'form.builder.shipping.released.rev.available.message',
                )}
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
            {hasObsoleteRevision && (
              <Tooltip
                arrow
                title={translate(
                  'form.builder.shipping.obs.rev.available.message',
                )}
                placement="top-start"
              >
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
      )}
      <Grid item xs>
        <FBAutocompleteAsync
          {...props}
          key={autocompleteKey}
          optionId={FBAutocompleteAsyncOption.shippingInformation}
          autosave
          defaultValue={defaultValue}
          onChange={onShippingCustomerChange}
          withState
          data-cy="shipping-address-field"
        />
      </Grid>
    </Grid>
  );
};

export default withFBShippingCustomer(FBShippingCustomer);

import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, LinearProgress, Typography } from '@material-ui/core';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { translate } from '../../../common/intl';
import { GroupTag } from '../../../state/ducks/auth/types';
import { companyActions, companySelectors } from '../../../state/ducks/company';
import { Subscription } from '../../../state/ducks/company/types';
import { AsyncStatus } from '../../../state/types';
import { AlertDialog } from '../../components/dialogs';
import { Button } from '../../components/forms/fields-next';
import { HOME_URL } from '../../constants/urls';
import useDialog from '../../hooks/useDialog';
import useGetHasTag from '../../hooks/useGetHasTag';
import { withThemeNext } from '../../layout/theme-next';
import NewBadge from './components/NewBadge';
import SubscriptionItem from './components/SubscriptionItem';
import useStyles from './styles';

const PremiumFeaturesContainer: React.FC = () => {
  const canManageSettings = useGetHasTag(GroupTag.ADMIN_MANAGEMENT);
  const subscriptionsDialog = useDialog();
  const classes = useStyles();
  const asyncState = useSelector(companySelectors.getSubscriptionsAsyncState);
  const allSubscriptions = useSelector(companySelectors.getSubscriptions);
  const isLoading = asyncState.status === AsyncStatus.Active;
  const dispatch = useDispatch();
  const toggledSubscription = useRef<Subscription>();

  if (!canManageSettings) {
    return <Redirect to={HOME_URL} />;
  }

  const confirmToggling = (state: boolean, subscription: Subscription) => {
    toggledSubscription.current = subscription;
    if (state) {
      return subscriptionsDialog.open();
    }
    toggleSubscription();
  };

  const toggleSubscription = () => {
    const currentSubscription = toggledSubscription.current;
    if (currentSubscription) {
      currentSubscription.isEnabled = !currentSubscription.isEnabled;
      dispatch(companyActions.updateSubscription(currentSubscription.id, {
        isEnabled: currentSubscription.isEnabled,
      }));
    }
    subscriptionsDialog.close();
  };

  return (
    <Box className={classes.root}>
      <AlertDialog
        handler={subscriptionsDialog}
        onConfirm={toggleSubscription}
        title="administration.premium.feature.table.popup.title"
        confirmLabel={translate('common.confirm')}
        icon={regular('wand-magic-sparkles')}
        iconClass={classes.dialogIcon}
      >
        <div data-cy="dialog-message" className={classes.contentText}>
          {translate('administration.premium.features.info')}
        </div>
      </AlertDialog>
      <Box className={classes.header}>
        <Box>
          <Typography
            variant="h1"
            className={classes.title}
          >
            {translate('administration.premium.feature.title')}
            <NewBadge />
          </Typography>
          <Typography
            variant="subtitle1"
            className={classes.subtitle}
          >
            {translate('administration.premium.feature.subtitle')}
          </Typography>
          <br className={classes.spaceTitle} />
        </Box>
        <Box className={classes.actions}>
          <Box className={classes.buttons}>
            <Button kind="outlined" data-cy="settings-history" disabled>
              {translate('common.history')}
            </Button>
          </Box>
        </Box>
        {isLoading && <LinearProgress className={classes.progress} data-cy="saving-progress-bar" />}
      </Box>
      <Box>
        <Box className={classes.description}>
          <FontAwesomeIcon className={classes.descriptionIcon} icon={solid('circle-info')} />
          <Box>
            {translate('administration.premium.feature.description')}
          </Box>
        </Box>
        <Box className={classes.subscriptionsList}>
          <Typography
            variant="subtitle1"
            className={classes.panelTitle}
          >
            {translate('administration.premium.feature.table.title')}
          </Typography>
          {allSubscriptions.map(subscription => (
            <SubscriptionItem
              subscription={subscription}
              onToggle={confirmToggling}
              key={subscription.type}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default withThemeNext(PremiumFeaturesContainer);

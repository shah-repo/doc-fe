import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../common/intl';
import { PremiumFeatures } from '../../../state/ducks/company/types';
import AlertDialog from '../../components/dialogs/Alert';
import { Button } from '../../components/forms/fields-next';
import useDialog from '../../hooks/useDialog';
import { withThemeNext } from '../../layout/theme-next';
import HeaderLastSaved from '../general.settings/components/HeaderLastSaved';
import SwitchControl from '../general.settings/components/SwitchControl';
import NewBadge from './components/NewBadge';
import useStyles from './styles';

interface PremiumFeaturesPageProps {
  isLoading: boolean
  updatedAt?: string
  onSave: () => void
  setValue: (field: string, value: boolean, shouldValidate?: boolean | undefined) => any
  values: PremiumFeatures
}

const PremiumFeaturesPage: React.FC<PremiumFeaturesPageProps> = ({
  isLoading,
  updatedAt,
  onSave,
  setValue,
  values,
}) => {
  const classes = useStyles();
  const SubscriptionsDialog = useDialog();
  const [hover, setHover] = useState(false);

  return (
    <Box className={classes.root}>
      <AlertDialog
        handler={SubscriptionsDialog}
        onConfirm={() => {
          SubscriptionsDialog.close();
          setValue('isAIEnabled', !values.isAIEnabled);
          onSave();
        }}
        title="administration.premium.feature.table.popup.title"
        confirmLabel="Confirm"
        icon={regular('wand-magic-sparkles')}
        iconClass={classes.dialogIcon}
      >
        <Typography data-cy="dialog-message" className={classes.contentText}>
          {translate('administration.premium.features.info')}
        </Typography>
      </AlertDialog>
      <Box className={classes.header}>
        <Box>
          <Typography
            variant="h1"
            className={classes.title}
          >
            {translate('administration.premium.feature.title')} <NewBadge />
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
          {updatedAt && (
            <HeaderLastSaved
              timestamp={updatedAt}
              loading={isLoading}
            />
          )}
          <Box className={classes.buttons}>
            <Button kind="outlined" data-cy="settings-history" disabled>{translate('common.history')}</Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box className={classes.description}>
          <FontAwesomeIcon className={classes.descriptionIcon} icon={solid('circle-info')} />
          <Box>
            {translate('administration.premium.feature.description1')} <Link to="/group_management">group management</Link> {translate('administration.premium.feature.description2')}
          </Box>
        </Box>
        <Box className={classes.togglerBox}>
          <Typography
            variant="subtitle1"
            className={classes.togglerText}
          >
            {translate('administration.premium.feature.table.title')}
          </Typography>
          <Box className={classes.togglerContainer}>
            <SwitchControl
              id="isAIEnabled"
              onChange={() => {
                SubscriptionsDialog.open();
              }}
              checked={values.isAIEnabled}
              label={translate('administration.premium.features.ai.title')}
              disabled={values.isAIEnabled}
            />
            <Tooltip title={translate('administration.premium.features.info')} arrow placement="right">
              <FontAwesomeIcon
                className={classes.togglerIcon}
                icon={hover ? solid('circle-info') : regular('circle-info')}
                onMouseEnter={() => { setHover(true); }}
                onMouseLeave={() => { setHover(false); }}
              />
            </Tooltip>
          </Box>
          <Typography className={classes.descriptionPlaceholder}>{translate('administration.premium.features.ai.description')}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default withThemeNext(PremiumFeaturesPage);

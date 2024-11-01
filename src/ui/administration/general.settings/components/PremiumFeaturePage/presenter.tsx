import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { withThemeNext } from '../../../../layout/theme-next';
import SwitchControl from '../../components/SwitchControl';
import BlueTagWithWhiteTextProps from '../BlueTagWithWhiteText/BlueTagWithWhiteText';
import useStyles from './styles';
import { Button } from '../../../../components/forms/fields-next';
import { PremiumFeaturesProps } from '../../types';
import HeaderLastSaved from '../HeaderLastSaved';
import AlertDialog from '../../../../components/dialogs/Alert';
import useDialog from '../../../../hooks/useDialog';

const PremiumFeaturesPage: React.FC<PremiumFeaturesProps> = ({
  isLoading,
  updatedAt,
  onSave,
  setValue,
  values,
}) => {
  const classes = useStyles();
  const GRPTDialog = useDialog();
  const [hover, setHover] = useState(false);

  return (
    <Box className={classes.root}>
      <AlertDialog
        handler={GRPTDialog}
        onConfirm={() => {
          GRPTDialog.close();
          setValue('isAIEnabled', !values.isAIEnabled);
          onSave();
        }}
        title="administration.premium.feature.table.popup.title"
        confirmLabel="Confirm"
        icon={regular('wand-magic-sparkles')}
        iconClass={classes.dialogIcon}
      >
        <Typography data-cy="dialog-message" className={classes.contentText}>
          {translate('administration.premium.feature.table.description1')}
        </Typography>
      </AlertDialog>
      <Box className={classes.header}>
        <Box>
          <Typography
            variant="h1"
            className={classes.title}
          >
            {translate('administration.premium.feature.title')} <BlueTagWithWhiteTextProps />
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
                GRPTDialog.open();
              }}
              checked={values.isAIEnabled}
              label="AI Enablement"
              disabled={values.isAIEnabled}
            />
            <Tooltip title={translate('administration.premium.feature.table.description1')} arrow placement="right">
              <FontAwesomeIcon
                className={classes.togglerIcon}
                icon={hover ? solid('circle-info') : regular('circle-info')}
                onMouseEnter={() => { setHover(true); }}
                onMouseLeave={() => { setHover(false); }} />
            </Tooltip>
          </Box>
          <Typography className={classes.descriptionPlaceholder}>[Description of the service goes here]</Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default withThemeNext(PremiumFeaturesPage);

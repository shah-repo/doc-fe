import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { withThemeNext } from '../../../../layout/theme-next';
import SwitchControl from '../../components/SwitchControl';
import BlueTagWithWhiteTextProps from '../BlueTagWithWhiteText/BlueTagWithWhiteText';
import useStyles from './styles';
import { Button } from '../../../../components/forms/fields-next';
import { PremiumFeaturesProps } from '../../types';
import HeaderLastSaved from '../HeaderLastSaved';

const PremiumFeaturesPage: React.FC<PremiumFeaturesProps> = ({
  isLoading,
  updatedAt,
  onSave,
  onChange,
  values,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
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
            <Button onClick={onSave} data-cy="settings-save">{translate('common.save.changes')}</Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box className={classes.description}>
          <FontAwesomeIcon icon={regular('circle-info')} /> {translate('administration.premium.feature.description1')} <Link to="/group_management">group management</Link> {translate('administration.premium.feature.description2')}
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
              onChange = {onChange}
              checked={values.isAIEnabled}
              label="AI Enablement"
            />
            <Typography
              variant="body1"
              className={classes.togglerDescription}
            >
              {translate('administration.premium.feature.table.description1')} <a href="#">feedback@enlil.com</a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default withThemeNext(PremiumFeaturesPage);

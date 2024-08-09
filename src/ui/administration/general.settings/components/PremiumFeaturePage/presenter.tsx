import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { withThemeNext } from '../../../../layout/theme-next';
import SwitchControl from '../../components/SwitchControl';
import BlueTagWithWhiteTextProps from '../BlueTagWithWhiteText/BlueTagWithWhiteText';
import useStyles from './styles';
const PremiumFeaturePage: React.FC = () => {
  const classes = useStyles();
  const [checked, setChecked] = useState<boolean>(false);
  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
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
              onChange = {() => setChecked(!checked)}
              checked={checked}
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
export default withThemeNext(PremiumFeaturePage);

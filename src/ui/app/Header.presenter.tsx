import { FormControlLabel, Grid, Switch, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import HelpCenter from '../../App/Enlil/Features/HelpCenter/HelpCenter';
import { SearchBar } from '../../App/Enlil/Features/Search';
import { ReactComponent as CompanyAvatar } from '../../assets/images/company_avatar.svg';
import { ReactComponent as MobileLogo } from '../../assets/images/enlil_white_logo.svg';
import Config from '../../config';
import { WhiteLabelingEnv } from '../../state/ducks/company/types';
import { store } from '../../state/store';
import Text from '../components/Text';
import { ThemeEnv } from '../layout/theme/utils/types';
import AutosaveToggle from './autosave/autosave';
import styles from './Header.styles';

export interface HeaderPresenterProps {
  name: string
  fullHeight?: boolean
  toggleCustomLabels: () => void
  customLabelsValue: boolean
  canToggleCustomLabels: boolean
  logo
  showEnvironment
  open
}

const Header: React.FunctionComponent<HeaderPresenterProps & WithStyles<typeof styles>> = ({
  classes,
  name,
  fullHeight,
  toggleCustomLabels,
  customLabelsValue,
  canToggleCustomLabels,
}) => {
  const user = store.getState().auth.user;
  const companyName = user.employee.company.name;
  const whiteLabeling = ((user.employee.company.whiteLabeling || {})[Config.Theme as ThemeEnv] || {}) as WhiteLabelingEnv;
  return (
    <AppBar className={classes.appBar}>
      <Grid className={classes.mobileMake}>
        <Grid sm={2}>
          <MobileLogo />
        </Grid>
        <Grid xs={8}>
          <Typography variant="caption" className={classes.textMake} component="div">
            <Text translation="header.design.make" />
          </Typography>
        </Grid>
        <Grid xs={4}>
          {whiteLabeling.avatar ? (
            <img
              id="logo"
              className={classes.avatarMobile}
              src={whiteLabeling.avatar}
              alt={companyName}
            />
          ) : (
            <CompanyAvatar className={classes.avatarMobile} />
          )}
        </Grid>
      </Grid>
      <Toolbar className={classes.toolbar}>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          wrap="nowrap"
          spacing={2}
        >
          <Grid item xs className={classes.mobileGrwFlex}>
            {!fullHeight && (
              <SearchBar />
            )}
          </Grid>
          <Grid item>
            {fullHeight && (
              <Typography variant="caption" className={classes.welcomeText} component="div">
                <Text translation="header.welcome.back" />,
                {' '}
                <b className={classes.welcomeTextName}>{name}!</b>
              </Typography>
            )}
            {canToggleCustomLabels && (
              <FormControlLabel className={classes.mobileStyle}
                control={<Switch name="toggleCustomLabels" checked={customLabelsValue} onChange={toggleCustomLabels} />}
                label={<Text translation="form.builder.header.control.label" />}
              />
            )}
            <AutosaveToggle className={classes.mobileStyle} />
            <HelpCenter className={classes.mobileStyle} />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
export default withStyles(styles)(Header);

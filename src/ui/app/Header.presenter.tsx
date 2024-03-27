import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControlLabel, Grid, Switch, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import React from 'react';
import HelpCenter from '../../App/Enlil/Features/HelpCenter/HelpCenter';
import { SearchBar } from '../../App/Enlil/Features/Search';
import { ReactComponent as CompanyAvatar } from '../../assets/images/company_avatar.svg';
import { ReactComponent as MobileLogo } from '../../assets/images/enlil_white_logo.svg';
import Config from '../../config';
import { WhiteLabelingEnv } from '../../state/ducks/company/types';
import { store } from '../../state/store';
import { isCurrentUrl } from '../common/utils/helpers';
import Text from '../components/Text';
import { ThemeEnv } from '../layout/theme/utils/types';
import styles from './Header.styles';
import { UserMenuContext } from './NavigationProfile.container';
import AutosaveToggle from './autosave/autosave';
export interface HeaderPresenterProps {
  name: string
  fullHeight?: boolean
  toggleCustomLabels: () => void
  customLabelsValue: boolean
  canToggleCustomLabels: boolean
  isOpened: boolean
  handleDrawerOpen: () => void
  className: string
}

const Header: React.FunctionComponent<HeaderPresenterProps & WithStyles<typeof styles>> = ({
  classes,
  name,
  fullHeight,
  toggleCustomLabels,
  customLabelsValue,
  canToggleCustomLabels,
  handleDrawerOpen,
  className,
}) => {
  const user = store.getState().auth.user;
  const companyName = user.employee.company.name;
  const whiteLabeling = ((user.employee.company.whiteLabeling || {})[Config.Theme as ThemeEnv] || {}) as WhiteLabelingEnv;
  const isComponentHidden = isCurrentUrl();
  const {
    handleSwitchCompany,
  } = React.useContext(UserMenuContext)! ?? {};

  return (
    <AppBar className={cx(classes.appBar, className)}>
      <div className={classes.mobileMake}>
        <div>
          <FontAwesomeIcon icon={solid('bars-sort')} className={classes.mobileSide} onClick={handleDrawerOpen} />
          <MobileLogo className={classes.logoMobile} />
          <Typography variant="caption" className={classes.mobileLogoText} component="div">
            <Text translation="header.design.make" />
          </Typography>
        </div>
        <div>
          {whiteLabeling.avatar ? (
            <img
              id="logo"
              className={classes.mobileAvatar}
              src={whiteLabeling.avatar}
              alt={companyName}
              onClick={handleSwitchCompany}
            />
          ) : (
            <CompanyAvatar className={classes.mobileAvatar} onClick={handleSwitchCompany} />
          )}
        </div>
      </div>
      <Toolbar className={cx(classes.toolbar, { [classes.welcomeHide]: !isComponentHidden })}>
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
              <FormControlLabel
                className={cx(classes.mobileStyle,
                  { [classes.toggleCustomLabels]: fullHeight, [classes.toggleCustomLabelsSm]: !fullHeight })}
                control={<Switch name="toggleCustomLabels" checked={customLabelsValue} onChange={toggleCustomLabels} />}
                label={<Text translation="form.builder.header.control.label" />}
              />
            )}
            <AutosaveToggle className={cx(classes.mobileStyle, classes.autosaveToggle)} />
            <HelpCenter className={cx(classes.mobileStyle, classes.autosaveToggle)} />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
export default withStyles(styles)(Header);

import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import cx from 'classnames';
import React from 'react';
import HelpCenter from '../../App/Enlil/Features/HelpCenter/HelpCenter';
import { SearchBar } from '../../App/Enlil/Features/Search';
import { ReactComponent as CompanyAvatar } from '../../assets/images/company_avatar.svg';
import { ReactComponent as MobileLogo } from '../../assets/images/enlil_white_logo.svg';
import { translate } from '../../common/intl';
import Text from '../components/Text';
import AppSwitcher from './AppSwitcher';
import useStyles from './Header.styles';
import Toggler from './Toggler';

interface HeaderPresenterProps {
  companyName: string
  companyAvatar?: string
  isFullHeight: boolean
  isSidebarExpanded: boolean
  isCustomLabelsEnabled: boolean
  isAutosaveEnabled: boolean
  canToggleCustomLabels: boolean
  canToggleAutosave: boolean
  className?: string
  onSidebarToggle: () => void
  onAutosaveToggle: () => void
  onCustomLabelsToggle: () => void
  onCompanyAvatarClick?: () => void
}

const Header: React.FunctionComponent<HeaderPresenterProps> = ({
  companyName,
  companyAvatar,
  className,
  isSidebarExpanded,
  isCustomLabelsEnabled,
  isAutosaveEnabled,
  canToggleCustomLabels,
  canToggleAutosave,
  onSidebarToggle,
  onAutosaveToggle,
  onCustomLabelsToggle,
  onCompanyAvatarClick,
}) => {
  const classes = useStyles();

  return (
    <AppBar className={cx(classes.root, className, { [classes.withSidebarExpanded]: isSidebarExpanded })}>
      {false && (
        <div className={classes.mobileMake}>
          <div>
            <FontAwesomeIcon
              icon={solid('bars-sort')}
              className={classes.mobileSide}
              onClick={onSidebarToggle}
            />
            <MobileLogo className={classes.logoMobile} />
            <Typography variant="caption" className={classes.mobileLogoText} component="div">
              <Text translation="header.design.make" />
            </Typography>
          </div>

        </div>
      )}
      <Toolbar className={classes.toolbar}>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          wrap="nowrap"
        >
          <Grid item className={classes.menu}>
            <FontAwesomeIcon
              className={classes.menuIcon}
              icon={isSidebarExpanded ? solid('xmark') : solid('bars-sort')}
              onClick={onSidebarToggle}
            />
          </Grid>
          <Grid item className={classes.switch}>
            <AppSwitcher />
          </Grid>
          <Grid item xs className={cx(classes.search, classes.hideOnMobile)}>
            <SearchBar />
          </Grid>
          <Grid item className={cx(classes.controls, classes.hideOnMobile)}>
            {canToggleCustomLabels && (
              <Toggler
                className={classes.toggler}
                isChecked={isCustomLabelsEnabled}
                onChange={onCustomLabelsToggle}
                name="toggleCustomLabels"
              >
                {translate('form.builder.header.control.label')}
              </Toggler>
            )}
            {canToggleAutosave && (
              <Toggler
                className={classes.toggler}
                isChecked={isAutosaveEnabled}
                onChange={onAutosaveToggle}
                name="toggleAutosave"
              >
                {translate('header.toggle.autosave')}
              </Toggler>
            )}
            <HelpCenter className={classes.help} />
          </Grid>
          <Grid item className={classes.company}>
            {companyAvatar ? (
              <img
                id="logo"
                className={classes.companyAvatar}
                src={companyAvatar}
                alt={companyName}
                onClick={onCompanyAvatarClick}
              />
            ) : (
              <CompanyAvatar
                className={classes.mobileAvatar}
                onClick={onCompanyAvatarClick}
              />
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Toolbar } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import cx from 'classnames';
import React from 'react';
import HelpCenter from '../../App/Enlil/Features/HelpCenter/HelpCenter';
import { SearchBar } from '../../App/Enlil/Features/Search';
import { ReactComponent as CompanyAvatar } from '../../assets/images/company_avatar.svg';
import { translate } from '../../common/intl';
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
  canAccessNavigation: boolean
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
  canAccessNavigation,
  onSidebarToggle,
  onAutosaveToggle,
  onCustomLabelsToggle,
  onCompanyAvatarClick,
}) => {
  const classes = useStyles();

  return (
    <AppBar className={cx(classes.root, className, { [classes.withSidebarExpanded]: isSidebarExpanded })}>
      <Toolbar className={classes.toolbar}>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          wrap="nowrap"
        >
          <Grid item className={classes.menu}>
            <FontAwesomeIcon
              className={cx(classes.menuIcon, { [classes.menuIconDisabled]: !canAccessNavigation })}
              icon={isSidebarExpanded ? solid('xmark') : solid('bars-sort')}
              onClick={canAccessNavigation ? onSidebarToggle : undefined}
            />
          </Grid>
          <Grid item className={classes.switch}>
            <AppSwitcher />
          </Grid>
          <Grid item xs className={cx(classes.search, classes.hideOnMobile)}>
            <SearchBar canSearch={canAccessNavigation} />
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
                onClick={canAccessNavigation ? onCompanyAvatarClick : undefined}
              />
            ) : (
              <CompanyAvatar
                className={classes.companyAvatar}
                onClick={canAccessNavigation ? onCompanyAvatarClick : undefined}
              />
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

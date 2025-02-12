import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Grid, ListSubheader, Menu, MenuItem, useMediaQuery, useTheme } from '@material-ui/core';
import cx from 'classnames';
import React, { useEffect } from 'react';
import { ReactComponent as EnlilLogo } from '../../../assets/images/app_switcher_logo.svg';
import { translate } from '../../../common/intl';
import Config from '../../../config';
import { IconButton } from '../../components/forms/fields-next';
import useMenu from '../../hooks/useMenu';
import { withThemeNext } from '../../layout/theme-next';
import useStyles from './styles';
import { App } from './types';

const AppSwitcher: React.FunctionComponent = () => {
  const classes = useStyles();
  const switchMenu = useMenu();
  const theme = useTheme();
  const isSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentApp, setCurrentApp] = React.useState<App>(App.D2M);
  const isD2M = currentApp === App.D2M;

  const switchApp = (app: App) => () => {
    setCurrentApp(app);
    window.location.href = Config.TMUrl;
  };

  useEffect(() => {
    if (!isSmBreakpoint && switchMenu.isOpen) {
      switchMenu.close();
    }
  }, [isSmBreakpoint, switchMenu]);

  return (
    <Box
      className={classes.container}

    >
      <Grid
        container
        alignItems="center"
        wrap="nowrap"
      >
        <EnlilLogo className={classes.logo} />
        <Box
          onClick={isSmBreakpoint ? switchMenu.open : undefined}
        >
          <span
            data-cy="selected-app-switcher"
            className={cx(classes.label, { [classes.link]: !isD2M })}
          >
            {translate('header.design.make')}
          </span>
          <span className={classes.toggler} onClick={switchApp(App.TM)}>
            <FontAwesomeIcon
              icon={regular('toggle-large-on')}
              size="2xl"
              flip={isD2M ? 'horizontal' : undefined}
            />
          </span>
          <IconButton
            kind="simple"
            className={classes.menuIcon}
          >
            <FontAwesomeIcon
              icon={solid('circle-chevron-down')}
            />
          </IconButton>
        </Box>
        <Menu
          anchorEl={switchMenu.anchor}
          open={switchMenu.isOpen}
          onClose={switchMenu.close}
          classes={{
            paper: classes.menu,
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <ListSubheader className={classes.menuTitle}>
            {translate('header.switch.to')}
          </ListSubheader>
          <MenuItem
            onClick={switchApp(App.TM)}
            className={classes.menuLink}
          >
            {translate('header.trace.matrix')}
          </MenuItem>
        </Menu>
        <span
          data-cy="tm-app-switcher"
          className={cx(classes.label, { [classes.link]: isD2M })}
          onClick={switchApp(App.TM)}
        >
          {translate('header.trace.matrix')}
        </span>
      </Grid>
    </Box>
  );
};

export default withThemeNext(AppSwitcher);

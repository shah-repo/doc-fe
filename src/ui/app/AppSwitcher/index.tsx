import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Grid, Link, ListSubheader, Menu, MenuItem, useMediaQuery, useTheme } from '@material-ui/core';
import cx from 'classnames';
import React, { useEffect } from 'react';
import { ReactComponent as EnlilLogo } from '../../../assets/images/app_switcher_logo.svg';
import { translate } from '../../../common/intl';
import Config from '../../../config';
import { IconButton } from '../../components/forms/fields-next';
import useMenu from '../../hooks/useMenu';
import { withThemeNext } from '../../layout/theme-next';
import useStyles from './styles';

const AppSwitcher: React.FunctionComponent = () => {
  const classes = useStyles();
  const switchMenu = useMenu();
  const theme = useTheme();
  const isSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
  const [isCurrentApp, setIsCurrentApp] = React.useState(false);

  const handleClick = (value: boolean) => () => setIsCurrentApp(value);

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
            className={classes.optionItemText}
          >
            {translate('header.design.make')}
          </span>
          <span className={classes.toggler}>
            <FontAwesomeIcon
              icon={regular('toggle-large-on')}
              size="2xl"
              flip={!isCurrentApp ? 'horizontal' : undefined}
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
            component={Link}
            href={Config.TMUrl}
            className={classes.menuLink}
          >
            {translate('header.trace.matrix')}
          </MenuItem>
        </Menu>
        <Link href={Config.TMUrl} className={classes.link}>
          <span
            data-cy="tm-app-switcher"
            className={cx(classes.optionItemText, { [classes.options]: !isCurrentApp })}
            onClick={handleClick(true)}
          >
            {translate('header.trace.matrix')}
          </span>
        </Link>
      </Grid>
    </Box>
  );
};

export default withThemeNext(AppSwitcher);

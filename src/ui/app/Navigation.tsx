import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { translate } from '../../common/intl';
import { getCurrentUserTags } from '../../common/utils/selectors';
import { authSelectors } from '../../state/ducks/auth';
import { GroupTag, Permission } from '../../state/ducks/auth/types';
import { companyActions, companySelectors } from '../../state/ducks/company';
import { NavigationItem, NavigationItems } from '../../state/ducks/company/types';
import Logo from '../components/icons/Logo.container';
import { HOME_URL } from '../constants/urls';
import useStyles from '../form.builder/FBTooltip/FBTooltip.styles';
import useActionCreator from '../hooks/useActionCreator';
import useAsync from '../hooks/useAsync';
import styles from './Navigation.styles';
import NavigationLinkContainer from './NavigationLink.container';
import NavigationProfileContainer from './NavigationProfile.container';

type NavigationProps = WithStyles<typeof styles> & RouteComponentProps & {
  handleDrawerOpen: () => void
  open: boolean
};

function isChildAllowedByUserTags (item: NavigationItem, userTags: GroupTag[]): boolean {
  return !item.restrictedToUsersWithTags?.length
        || item.restrictedToUsersWithTags.some((tag) => userTags.includes(tag));
}

function isChildAllowedByUserPermissions (item: NavigationItem, userPermissions: Permission[]): boolean {
  return !item.restrictedToUserPermissions?.length
        || item.restrictedToUserPermissions.some((permission) => userPermissions.includes(permission));
}

const Navigation: React.FunctionComponent<NavigationProps> = ({
  classes,
  location,
  open,
  handleDrawerOpen,
}) => {
  const userTags = useSelector(getCurrentUserTags());
  const currentEmployeePermissions = useSelector(authSelectors.currentEmployeePermissions);
  const async = useAsync({
    onSuccess: () => {
      setIsLoading(false);
    },
  });
  const tooltipClasses = useStyles();
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const getCompanyMine = useActionCreator(companyActions.getCompanyMine);
  const navigationSelectorItems = useSelector(companySelectors.getNavigationItems) || [];

  const navigationItems = (navigationSelectorItems)
    .reduce<NavigationItem[]>((acc, item) => {
    const isChildAllowedByTag = isChildAllowedByUserTags(item, userTags);
    const isChildAllowedByPermission = isChildAllowedByUserPermissions(item, currentEmployeePermissions);

    if (isChildAllowedByTag && isChildAllowedByPermission) {
      if (item.type === NavigationItems.MENU) {
        item.menu = (item.menu ?? []).filter((menuItem) =>
          (isChildAllowedByTag && isChildAllowedByUserTags(menuItem, userTags))
                  && (isChildAllowedByPermission && isChildAllowedByUserPermissions(menuItem, currentEmployeePermissions)),
        );
      }
      acc.push(item);
    }
    return acc;
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (currentEmployeeId) {
      async.start(getCompanyMine, currentEmployeeId, async);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEmployeeId]);

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Drawer
      PaperProps={{ id: 'navigation' }}
      variant="permanent"
      classes={{
        root: cx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
        paper: cx(classes.drawerPaper, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      anchor="left"
    >
      <Box className={classes.root}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.toolbarTitle}>
            <Link to={HOME_URL} className={classes.headerLink}>
              <Logo open={open} />
            </Link>
          </Typography>
        </Toolbar>
        <Box
          className={cx(classes.defaultIcon, {
            [classes.icon]: !open,
            [classes.shiftIcon]: open,
          })}
        >
          <span
            onClick={() => {
              handleMouseLeave();
              handleDrawerOpen();
            }}
            className={classes.leftSideIcon}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave }
            data-cy={open ? 'collapse-icon' : 'expand-icon'}
          >
            <Tooltip
              arrow
              placement="right-start"
              title={open ? translate('common.collapse') : translate('common.expand')}
              disableHoverListener
              open={isHovered}
              classes={tooltipClasses}
            >
              <FontAwesomeIcon flip={!open ? 'horizontal' : undefined} size="xs" icon={solid('chevron-left')} />
            </Tooltip>
          </span>
        </Box>
        {
          isLoading
            ? <CircularProgress size={20} className={classes.progress} />
            : (
              <List className={cx(classes.list, 'containing-box-scrollbar')}>
                {navigationItems.map((link: NavigationItem) => (
                  <NavigationLinkContainer
                    key={link.label}
                    currentPath={location.pathname}
                    {...link}
                    open={open}
                  />
                ))}
              </List>
            )
        }
        <Box className={classes.userInfo}>
          <NavigationProfileContainer open={open} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default withRouter(withStyles(styles)(Navigation));

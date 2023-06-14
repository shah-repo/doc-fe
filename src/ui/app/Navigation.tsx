import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { getCurrentUserTags } from '../../common/utils/selectors';
import { authSelectors } from '../../state/ducks/auth';
import { GroupTag } from '../../state/ducks/auth/types';
import { companyActions, companySelectors } from '../../state/ducks/company';
import { NavigationItem } from '../../state/ducks/company/types';
import BottomLogo from '../components/icons/BottomLogo.container';
import Logo from '../components/icons/Logo.container';
import { HOME_URL } from '../constants/urls';
import useActionCreator from '../hooks/useActionCreator';
import useAsync from '../hooks/useAsync';
import styles from './Navigation.styles';
import NavigationLinkContainer from './NavigationLink.container';
import NavigationProfileContainer from './NavigationProfile.container';

type NavigationProps = WithStyles<typeof styles> & RouteComponentProps;

function  itemAllowedForUser(item: NavigationItem, userTags: GroupTag[]): boolean {
  return !item.restrictedToUsersWithTags?.length
        || item.restrictedToUsersWithTags.some((tag) => userTags.includes(tag));
}

const Navigation: React.FunctionComponent<NavigationProps> = ({
  classes,
  location,
}) => {
  const userTags = useSelector(getCurrentUserTags());
  const async = useAsync({
    onSuccess: () => {
      setIsLoading(false);
    },
  });
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const getCompanyMine = useActionCreator(companyActions.getCompanyMine);
  const navigationSelectorItems = useSelector(companySelectors.getNavigationItems) || [];

  const navigationItems = (navigationSelectorItems)
    .reduce<NavigationItem[]>((acc, item) => {
      if (itemAllowedForUser(item, userTags)) {
        if (item.type === 'MENU') {
          item.menu = (item.menu || []).filter((menuItem) => itemAllowedForUser(menuItem, userTags));
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

  return (
    <Drawer
      PaperProps={{ id: 'navigation' }}
      variant="permanent"
      classes={{
        root: classes.drawer,
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <Box className={classes.root}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.toolbarTitle}>
            <Link to={HOME_URL} className={classes.headerLink}>
              <Logo />
            </Link>
          </Typography>
        </Toolbar>
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
                  />
                ))}
              </List>
            )
        }
        <NavigationProfileContainer />
        <Box className={classes.bottom}>
          <BottomLogo />
        </Box>
      </Box>
    </Drawer>
  );
};

export default withRouter(withStyles(styles)(Navigation));

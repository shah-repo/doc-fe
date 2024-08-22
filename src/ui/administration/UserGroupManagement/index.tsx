import { Grid, Tab } from '@material-ui/core';
import { History } from 'history';
import React, { useEffect } from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { GroupTag } from '../../../state/ducks/auth/types';
import GridTitle from '../../components/KendoGrid/GridTitle/presenter';
import KendoGridStyles from '../../components/KendoGrid/KendoGrid.styles';
import { HOME_URL, USER_GROUP_URL, USER_GROUPS_URL } from '../../constants/urls';
import StyledTabs from '../../dashboard.new/tabs/common/StyledTabs';
import GroupManagementListContainer from '../../group.management/kendo/container';
import useGetHasTag from '../../hooks/useGetHasTag';
import LABELS from '../../translations/en.json';
import UserManagementKendoContainer from '../../user.management/kendo/container';
import { UserGroupTabValues } from './userGroupType';

const UserGroupManagment: React.FC = () => {
  const history = useHistory() as History;
  const match = useRouteMatch(USER_GROUPS_URL);
  const classes = KendoGridStyles();
  const canManageGroups = useGetHasTag(GroupTag.GROUP_MANAGEMENT);
  const canManageUser = useGetHasTag(GroupTag.USER_MANAGEMENT);

  useEffect(() => {
    if (!canManageUser && canManageGroups) {
      history.push(USER_GROUPS_URL);
    } else if (!canManageGroups && canManageUser) {
      history.push(USER_GROUP_URL);
    } else if (!canManageGroups && !canManageUser) {
      history.push(HOME_URL);
    }
  }, [canManageUser, canManageGroups, history]);

  const showUserTab = canManageUser && !canManageGroups;
  const showGroupTab = canManageGroups && !canManageUser;
  const showBothTabs = canManageUser && canManageGroups;

  return (
    <>
      <Grid item xs={12} className={classes.headerGridItem}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <GridTitle translation="navigation.userGroup.management" />
          </Grid>
        </Grid>

        <StyledTabs value={match ? UserGroupTabValues.Group : UserGroupTabValues.User}>
          {showUserTab && (
            <Tab
              component={Link}
              to={USER_GROUP_URL}
              value={UserGroupTabValues.User}
              label={LABELS.USERTAB}
            />
          )}
          {showGroupTab && (
            <Tab
              component={Link}
              to={USER_GROUPS_URL}
              value={UserGroupTabValues.Group}
              label={LABELS.GROUPTAB}
            />
          )}
          {showBothTabs && (
            <>
              <Tab
                component={Link}
                to={USER_GROUP_URL}
                value={UserGroupTabValues.User}
                label={LABELS.USERTAB}
              />
              <Tab
                component={Link}
                to={USER_GROUPS_URL}
                value={UserGroupTabValues.Group}
                label={LABELS.GROUPTAB}
              />
            </>
          )}
        </StyledTabs>
      </Grid>

      <Switch>
        {canManageGroups && (
          <Route path={USER_GROUPS_URL} component={GroupManagementListContainer} />
        )}
        {canManageUser && (
          <Route path={USER_GROUP_URL} component={UserManagementKendoContainer} />
        )}
        <Route component={canManageUser ? UserManagementKendoContainer : GroupManagementListContainer} />
      </Switch>
    </>
  );
};

export default UserGroupManagment;

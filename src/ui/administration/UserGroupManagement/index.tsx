import { Tab } from '@material-ui/core';
import { History } from 'history';
import React, { useEffect } from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { GroupTag } from '../../../state/ducks/auth/types';
import GridTitle from '../../components/KendoGrid/GridTitle/presenter';
import { HOME_URL, USER_GROUP_URL, USER_GROUPS_URL } from '../../constants/urls';
import StyledTabs from '../../dashboard.new/tabs/common/StyledTabs';
import GroupManagementListContainer from '../../group.management/kendo/container';
import useGetHasTag from '../../hooks/useGetHasTag';
import LABELS from '../../translations/en.json';
import UserManagementKendoContainer from '../../user.management/kendo/container';
import useStyles from './styles';
import { UserGroupTab } from './types';

const UserGroupManagment: React.FC = () => {
  const history = useHistory() as History;
  const match = useRouteMatch(USER_GROUPS_URL);
  const classes = useStyles();

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

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <GridTitle translation="navigation.userGroup.management" />

        <StyledTabs value={match ? UserGroupTab.Group : UserGroupTab.User}>
          {canManageUser && (
            <Tab
              component={Link}
              to={USER_GROUP_URL}
              value={UserGroupTab.User}
              label={LABELS.USERTAB}
            />
          )}
          {canManageGroups && (
            <Tab
              component={Link}
              to={USER_GROUPS_URL}
              value={UserGroupTab.Group}
              label={LABELS.GROUPTAB}
            />
          )}
        </StyledTabs>
      </div>

      <div className={classes.content}>
        <Switch>
          {canManageGroups && (
            <Route path={USER_GROUPS_URL} component={GroupManagementListContainer} />
          )}
          {canManageUser && (
            <Route path={USER_GROUP_URL} component={UserManagementKendoContainer} />
          )}
          <Route component={canManageUser ? UserManagementKendoContainer : GroupManagementListContainer} />
        </Switch>
      </div>
    </div>
  );
};

export default UserGroupManagment;

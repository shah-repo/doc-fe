import { Grid, Tab } from '@material-ui/core';
import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import GridTitle from '../../components/KendoGrid/GridTitle/presenter';
import KendoGridStyles from '../../components/KendoGrid/KendoGrid.styles';
import { USER_GROUPS_URL, USER_GROUP_URL } from '../../constants/urls';
import StyledTabs from '../../dashboard.new/tabs/common/StyledTabs';
import GroupManagementListContainer from '../../group.management/kendo/container';
import LABELS from '../../translations/en.json';
import UserManagementKendoContainer from '../../user.management/kendo/container';
import { UserGroupTabValues } from './userGroupType';

const UserGroupManagment: React.FC = () => {
  const match = useRouteMatch(USER_GROUPS_URL);
  const classes = KendoGridStyles();

  return (
    <>
      <Grid item xs={12} className={classes.headerGridItem}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <GridTitle translation="navigation.userGroup.management" />
          </Grid>
        </Grid>
        <StyledTabs value={match ? UserGroupTabValues.Group : UserGroupTabValues.User}>
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
        </StyledTabs>
      </Grid>
      <Switch>
        <Route path={USER_GROUPS_URL} component={GroupManagementListContainer} />
        <Route component={UserManagementKendoContainer} />
      </Switch>
    </>
  );
};

export default UserGroupManagment;

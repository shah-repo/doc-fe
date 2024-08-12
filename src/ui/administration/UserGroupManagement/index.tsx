import { Grid, Tab } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import GridTitle from '../../components/KendoGrid/GridTitle/presenter';
import KendoGridStyles from '../../components/KendoGrid/KendoGrid.styles';
import StyledTabs from '../../dashboard.new/tabs/common/StyledTabs';
import GroupManagementListContainer from '../../group.management/kendo/container';
import lables from '../../translations/en.json';
import UserManagementKendoContainer from '../../user.management/kendo/container';
import { UserGroupTabValues } from './userGroupType';

const UserGroupManagment: React.FC = () => {
  const [value, setValue] = useState<UserGroupTabValues>(UserGroupTabValues.User);
  const classes = KendoGridStyles();
  const handleChange = useCallback(
    (event: any, newValue: UserGroupTabValues) => setValue(newValue),
    [],
  );

  return (
    <>
      <Grid item xs={12} className={classes.headerGridItem}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <GridTitle translation="navigation.userGroup.management" />
          </Grid>
        </Grid>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="dashboard tabs">
          <Tab
            value={UserGroupTabValues.User}
            label={lables.USERTAB}
          />
          <Tab
            value={UserGroupTabValues.Group}
            label={lables.GROUPTAB}
          />
        </StyledTabs>
      </Grid>

      {value === UserGroupTabValues.User && <UserManagementKendoContainer />}
      {value === UserGroupTabValues.Group && <GroupManagementListContainer />}

    </>
  );
};

export default UserGroupManagment;

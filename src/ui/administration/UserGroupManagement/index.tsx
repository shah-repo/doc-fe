import { Box, Grid, Tab } from '@material-ui/core';
import React, { useState } from 'react';
import GridTitle from '../../components/KendoGrid/GridTitle/presenter';
import KendoContainer from '../../group.management/kendo/container';
import UserManagementKendoContainer from '../../user.management/kendo/container';

const UserGroupManagment: React.FC = () => {
  const [value, setValue] = useState('1'); // State to manage selected tab

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log('check');
  return (
    <>

      <Grid item>
        <GridTitle translation="navigation.userGroup.management" />
      </Grid>
      <Box>
        <Tab
          value="1"
          label="User Management "
          onChange={() => handleChange(null, '1')} />
        <Tab
          value="2"
          label="Group Management"
          onChange={() => handleChange(null, '2')} />

        <Box>
          <div>
            {value === '1' && <UserManagementKendoContainer />}
            {value === '2' && <KendoContainer history={undefined} location={undefined} match={undefined} />}
          </div>
        </Box>
      </Box></>
  );
};

export default UserGroupManagment;

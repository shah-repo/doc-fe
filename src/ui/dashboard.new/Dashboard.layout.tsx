import { Box, Grid } from '@material-ui/core';
import React from 'react';
import { GroupTag } from '../../state/ducks/auth/types';
import useGetHasTag from '../hooks/useGetHasTag';
import useStyles from './Dashboard.styles';
import Tabs from './tabs/Tabs';
import TrainingStats from './training.stats/TrainingStats';
import Search from '../../App/Enlil/Features/Search/Search';

const DashboardLayout: React.FC = () => {
  const classes = useStyles();
  const isDashboardAdmin = useGetHasTag(GroupTag.DASHBOARD_ADMIN);

  return (
    <Box className={classes.box}>
      <Grid container>
        <Grid item xs className={classes.searchContainer}>
          <Search />
        </Grid>
      </Grid>
      <Grid container className={classes.root}>
        <Grid item className={classes.tabs} xs={12} md={isDashboardAdmin ? 8 : 12}>
          <Tabs />
        </Grid>
        {isDashboardAdmin && (
          <Grid item className={classes.stats} xs={12} md={4}>
            <TrainingStats />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DashboardLayout;

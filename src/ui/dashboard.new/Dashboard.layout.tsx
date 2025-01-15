import { Box, Grid } from '@material-ui/core';
import React from 'react';
import { GroupTag } from '../../state/ducks/auth/types';
import useGetHasTag from '../hooks/useGetHasTag';
import useStyles from './Dashboard.styles';
import Tabs from './tabs/Tabs';
import TrainingStats from './training.stats/TrainingStats';
import Welcome from './welcome';

const DashboardLayout: React.FC = () => {
  const classes = useStyles();
  const isDashboardAdmin = useGetHasTag(GroupTag.DASHBOARD_ADMIN);

  return (
    <Box className={classes.root}>
      <Welcome />
      <Box className={classes.dashboard}>
        <Grid container className={classes.wrapper}>
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
    </Box>
  );
};

export default DashboardLayout;

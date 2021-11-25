import { Box, Grid } from "@material-ui/core";
import React from "react";
import { GroupTag } from "../../state/ducks/auth/types";
import useGetHasTag from "../hooks/useGetHasTag";
import { styles } from "./Dashboard.styles";
import DashboardTabs from "./DashboardTabs";
import TrainingStats from "./training.stats/TrainingStats";

const DashboardLayout: React.FunctionComponent = () => {
  const classes = styles();
  const isDashboardAdmin = useGetHasTag(GroupTag.DASHBOARD_ADMIN);

  return (
    <Box boxShadow={10} borderRadius={10} className={classes.box} padding={1}>
      <Grid
        container={true}
        className={classes.root}
        justify="center"
      >
        <Grid item={true} xs={12} sm={12} md={isDashboardAdmin ? 8 : 12} lg={isDashboardAdmin ? 8 : 12}>
          <DashboardTabs />
        </Grid>
        {isDashboardAdmin && (
          <Grid item={true} className={classes.trainingStats} xs={6} sm={6} md={4} lg={4}>
            <TrainingStats />
          </Grid>
        )}
      </Grid>
    </Box>

  );
};

export default DashboardLayout;

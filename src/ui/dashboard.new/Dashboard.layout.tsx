import { Grid } from "@material-ui/core";
import React from "react";
import { styles } from "./Dashboard.styles";
import DashboardTabs from "./DashboardTabs";
import useGetHasTag from "../hooks/useGetHasTag";
import { GroupTag } from "../../state/ducks/auth/types";
import TrainingStats from "./training.stats/TrainingStats";

const DashboardLayout: React.FunctionComponent = () => {
  const classes = styles();
  let isDashboardAdmin = useGetHasTag(GroupTag.DASHBOARD_ADMIN);

  return (
    <Grid
      container={true}
      className={classes.root}
      alignItems="center"
      justify="center"
    >
      <Grid item={true} className={classes.item} sm={isDashboardAdmin ? 8 : 12}>
        <DashboardTabs />
      </Grid>
      {isDashboardAdmin && (
        <Grid item={true} className={classes.trainingStats} sm={4}>
          <TrainingStats />
        </Grid>
      )}
    </Grid>
  );
};

export default DashboardLayout;

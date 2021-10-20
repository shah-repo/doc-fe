import { Grid } from "@material-ui/core";
import React from "react";
import { styles } from "./Dashboard.styles";
import DashboardTabs from "./DashboardTabs";

const DashboardLayout: React.FunctionComponent = () => {
  const classes = styles();

  return (
    <Grid container={true} className={classes.root} alignItems="center" justify="center">
      <Grid item={true} className={classes.item} sm={12} >
        <DashboardTabs />
      </Grid>
    </Grid>
  );
};

export default DashboardLayout;

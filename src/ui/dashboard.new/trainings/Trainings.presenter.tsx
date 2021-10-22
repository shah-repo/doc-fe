import { Grid, List } from "@material-ui/core";
import React from "react";
import { styles } from "./Trainings.styles";

const TrainingssLineItemPresenter: React.FunctionComponent = () => {
  const classes = styles();

  return (

    <Grid container={true} spacing={5}>
      <Grid item={true} md={12} sm={12}>
        <List dense className={classes.root}>
          Training List Items
        </List>
      </Grid>
    </Grid>

  );
};

export default TrainingssLineItemPresenter;

import { Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import AsyncGate from "../components/AsyncGate";
import styles from "./Dashboard.styles";
import DocumentReviews from "./DocumentReviews.presenter";
import { DashboardPresenterParentProps } from "./types";

type DashboardPresenterProps = DashboardPresenterParentProps & WithStyles<typeof styles>;

const DashboardPresenter: React.FunctionComponent<DashboardPresenterProps> = ({
  classes,
  loadPendingActions, loadPendingActionsListAsyncState, itemsToReview,
}) => {
  return (
    <Grid container={true} className={classes.root} spacing={8}>
      <Grid item={true} xs={12} md={3} className={classes.item}>
        <AsyncGate
          asyncAction={loadPendingActions}
          asyncState={loadPendingActionsListAsyncState}
          startActionOnMount={true}
        >
          <DocumentReviews documentsToReview={itemsToReview} />
        </AsyncGate>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(DashboardPresenter);

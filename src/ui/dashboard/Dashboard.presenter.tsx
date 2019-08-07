import { Grid, WithStyles, withStyles, Paper } from "@material-ui/core";
import React from "react";
import AsyncGate from "../components/AsyncGate";
import styles from "./Dashboard.styles";
import PendingAction from "./PendingAction.presenter";
import { DashboardPresenterParentProps } from "./types";

type DashboardPresenterProps = DashboardPresenterParentProps & WithStyles<typeof styles>;

const DashboardPresenter: React.FunctionComponent<DashboardPresenterProps> = ({
  classes,
  loadPendingActions, loadPendingActionsListAsyncState, pendingActions,
}) => {
  return (
    <Grid container={true} className={classes.root} spacing={8}>
      <Grid item={true} className={classes.item}>
        <AsyncGate
          asyncAction={loadPendingActions}
          asyncState={loadPendingActionsListAsyncState}
          startActionOnMount={true}
        >
          <Paper className={classes.actionsContainer}>
          {
            pendingActions.map((pendingAction) => {
              return <PendingAction key={pendingAction.changeReq.id} pendingAction={pendingAction} />
            })
          }
          </Paper>
        </AsyncGate>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(DashboardPresenter);

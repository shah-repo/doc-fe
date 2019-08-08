import { Grid, WithStyles, withStyles, Paper, Typography } from "@material-ui/core";
import React from "react";
import AsyncGate from "../components/AsyncGate";
import { styles } from "./Dashboard.styles";
import PendingAction from "./PendingAction.presenter";
import { DashboardPresenterParentProps } from "./types";
import Text from "../components/Text";

type DashboardPresenterProps = DashboardPresenterParentProps;

const DashboardPresenter: React.FunctionComponent<DashboardPresenterProps> = ({
  loadPendingActions, loadPendingActionsListAsyncState, pendingActions,
}) => {
  const classes = styles();
  const renderPendingActions = () => (
    <React.Fragment>
    {
      pendingActions.map((pendingAction) => {
        return <PendingAction key={pendingAction.changeReq.id} pendingAction={pendingAction} />
      })
    }
    </React.Fragment>
  );
  const renderNoPendingActions = pendingActions.length === 0 && (
      <Typography className={classes.noPendingActions}>
        <Text translation="dashboard.noPendingActions" />
      </Typography>
    );

  return (
    <Grid container={true} className={classes.root} spacing={8}>
      <Grid item={true} className={classes.item}>
        <AsyncGate
          asyncAction={loadPendingActions}
          asyncState={loadPendingActionsListAsyncState}
          startActionOnMount={true}
        >
          <Paper className={classes.actionsContainer}>
            {pendingActions.length > 0 && renderPendingActions()}
            {renderNoPendingActions}
          </Paper>
        </AsyncGate>
      </Grid>
    </Grid>
  );
};

export default DashboardPresenter;

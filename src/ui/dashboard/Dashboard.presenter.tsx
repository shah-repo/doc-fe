import { Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import { PendingActionType } from "../../state/ducks/dashboard";
import AsyncGate from "../components/AsyncGate";
import Text from "../components/Text";
import ChangeRequestApproval from "./action.types/ChangeRequestApproval";
import TaskApproval from "./action.types/TaskApproval";
import TrainingRequest from "./action.types/TrainingRequest";
import { styles } from "./Dashboard.styles";
import { DashboardPresenterParentProps } from "./types";
import { IotService } from "../../common/utils/iot/mqttClient";

type DashboardPresenterProps = DashboardPresenterParentProps;

const DashboardPresenter: React.FunctionComponent<DashboardPresenterProps> = ({
  loadPendingActions, loadPendingActionsListAsyncState, pendingActions,
}) => {
  const classes = styles();
  const renderPendingActions = () => (
    <React.Fragment>
    {
      pendingActions.map((pendingAction, index) => {
        switch (pendingAction.type) {
          case PendingActionType.PENDING_REVIEW:
            return <ChangeRequestApproval key={index} pendingAction={pendingAction} />;
          case PendingActionType.PENDING_TRAINING_RECORDS:
            return <TrainingRequest key={index} pendingAction={pendingAction} />;
          default:
            return <TaskApproval key={index} pendingAction={pendingAction} />;
        }
      })
    }
    </React.Fragment>
  );
  const renderNoPendingActions = pendingActions.length === 0 && (
      <Typography className={classes.noPendingActions}>
        <Text translation="dashboard.noPendingActions" />
      </Typography>
    );
  // IotService.prototype.unsubscribeFromTopic("testfe");
  IotService.prototype.unsubscribeAll();

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

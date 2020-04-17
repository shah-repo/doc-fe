import { Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import { PendingActionType } from "../../state/ducks/dashboard";
import AsyncGate from "../components/AsyncGate";
import Text from "../components/Text";
import ChangeRequestApproval from "./action.types/ChangeRequestApproval";
import PurchaseOrderApproval from "./action.types/purchaseOrder/PurchaseOrderApproval";
import TaskApproval from "./action.types/TaskApproval";
import TrainingRequest from "./action.types/TrainingRequest";
import { styles } from "./Dashboard.styles";
import { DashboardPresenterParentProps } from "./types";

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
              return pendingAction.changeReq &&
                <ChangeRequestApproval key={index} changeRequest={pendingAction.changeReq} />;
            case PendingActionType.PENDING_TRAINING_RECORDS:
              return pendingAction.trainingRecord &&
                <TrainingRequest key={index} trainingRecord={pendingAction.trainingRecord} />;
            case PendingActionType.PURCHASE_ORDERS:
              return pendingAction.documentRevision &&
                <PurchaseOrderApproval key={index} documentRevision={pendingAction.documentRevision} />;
            case PendingActionType.PENDING_DOC_CONTROL:
            case PendingActionType.PENDING_IMPL_PLAN_TASK:
              return pendingAction.changeReq &&
                <TaskApproval key={index} changeRequest={pendingAction.changeReq} />;
            default:
              return "Missing item";
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

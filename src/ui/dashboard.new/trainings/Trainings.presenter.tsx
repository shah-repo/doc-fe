/* eslint-disable react/react-in-jsx-scope */
import { Grid, List, Typography } from "@material-ui/core";
import React from "react";
import { ActionTypes } from "../../../state/ducks/dashboard/types";
import Text from "../../components/Text";
import NewTraining from "../line.items/training/new.training/newTraining";
import PendingTraining from "../line.items/training/pending.training/pendingTraining";
import { styles } from "./Trainings.styles";

interface Props {
  trainingItems: {
    id: string;
    type: string;
    title: string;
    documentId: string;
    status: string;
    timestamp: string;
    verbose: string;
    dueDate?: any;
    requestedBy?: any;
    approvers: string[];
  }[];
}
const TrainingsLineItemPresenter: React.FunctionComponent<Props> = ({
  trainingItems,
}) => {
  const classes = styles();
  const renderPendingActions = () => (
    <List dense className={classes.root}>
      {trainingItems.map((pendingAction, index) => {
        switch (pendingAction.type) {
          case ActionTypes.NEW_TRAINING_RECORDS:
            return (
              <NewTraining
                id={pendingAction.id}
                type={pendingAction.type}
                title={pendingAction.title}
                documentId={pendingAction.documentId}
                status={pendingAction.status}
                timestamp={pendingAction.timestamp}
                verbose={pendingAction.verbose}
                dueDate={pendingAction.dueDate}
                approvers={pendingAction.approvers}
              />
            );
          case ActionTypes.PENDING_TRAINING_RECORDS:
            return (
              <PendingTraining
                id={pendingAction.id}
                type={pendingAction.type}
                title={pendingAction.title}
                documentId={pendingAction.documentId}
                status={pendingAction.status}
                timestamp={pendingAction.timestamp}
                verbose={pendingAction.verbose}
                dueDate={pendingAction.dueDate}
              />
            );
          default:
            return null;
        }
      })}
    </List>
  );
  const renderNoPendingActions = trainingItems.length === 0 && (
    <Typography className={classes.noPendingActions}>
      <Text
        translation="dashboard.noPendingActions"
        dataCy="dashboard.noPendingActions"
      />
    </Typography>
  );

  return (
    <Grid container={true} spacing={5}>
      <Grid item={true} md={12} sm={12}>
        {trainingItems.length > 0 && renderPendingActions()}
        {renderNoPendingActions}
      </Grid>
    </Grid>
  );
};

export default TrainingsLineItemPresenter;

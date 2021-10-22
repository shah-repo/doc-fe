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
const TrainingssLineItemPresenter: React.FunctionComponent<Props> = ({
  trainingItems,
}) => {
  const classes = styles();
  const renderPendingActions = () => (
    <List dense className={classes.root}>
      {
        trainingItems.map((pendingAction, index) => {
          switch (pendingAction.type) {
            case ActionTypes.NEW_TRAINING_RECORDS:
              return <NewTraining />;
            case ActionTypes.PENDING_TRAINING_RECORDS:
              return <PendingTraining />;
            default:
              return null;
          }
        })
      }
    </List>
  );
  const renderNoPendingActions = trainingItems.length === 0 && (
    <Typography className={classes.noPendingActions}>
      <Text translation="dashboard.noPendingActions" dataCy="dashboard.noPendingActions"/>
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

export default TrainingssLineItemPresenter;

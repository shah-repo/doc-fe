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
    docDocumentId: string;
    docId: string;
    docRevId: string;
    docRevName: string;
    dueOn?: string;
    trainingRecordId?: string;
    trId?: string;
    type: string;
    trainingStatus: string;
    timestamp: string;
    pendingTrainees?: any;
  }[];
}

const TrainingsLineItemPresenter: React.FunctionComponent<Props> = ({
  trainingItems,
}) => {
  const classes = styles();
  const [hoverItemId, setHoverItemId] = React.useState("");
  const onMouseHoverItem = (id) => {
    setHoverItemId(id);
  };
  const onMouseLeaveItem = () => {
    setHoverItemId("");
  };
  const renderPendingActions = () => (
    <List dense className={classes.root} onMouseLeave={onMouseLeaveItem}>
      {trainingItems.map((pendingAction, index) => {
        switch (pendingAction.type) {
          case ActionTypes.TRAINING_STATUS_OWNER:
            return (
              <NewTraining
                key={index}
                id={pendingAction.id}
                docId={pendingAction.docId}
                docRevId={pendingAction.docRevId}
                type={pendingAction.type}
                docRevName={pendingAction.docRevName}
                docDocumentId={pendingAction.docDocumentId}
                trainingStatus={pendingAction.trainingStatus}
                timestamp={pendingAction.timestamp}
                pendingTrainees={pendingAction.pendingTrainees}
                hoverItemId={hoverItemId}
                onMouseHoverItem={onMouseHoverItem}
              />
            );
          case ActionTypes.TRAINING_STATUS_TRAINEE:
            return (
              <PendingTraining
                key={index}
                id={pendingAction.id}
                docId={pendingAction.docId}
                type={pendingAction.type}
                title={pendingAction.docRevName}
                docDocumentId={pendingAction.docDocumentId}
                docRevId={pendingAction.docRevId}
                trainingStatus={pendingAction.trainingStatus}
                timestamp={pendingAction.timestamp}
                verbose={pendingAction.trainingStatus}
                dueDate={pendingAction.dueOn}
                hoverItemId={hoverItemId}
                onMouseHoverItem={onMouseHoverItem}
              />
            );
          default:
            return <Text key={index} translation="common.undefined" />;
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

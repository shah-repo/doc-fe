import { Grid, List, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import {
  getFormattedDateString,
  MomentFormats,
} from "../../../common/utils/date";
import { trainingSelectors } from "../../../state/ducks/dashboard.new/training";
import { ActionTypes } from "../../../state/ducks/dashboard/types";
import Text from "../../components/Text";
import NewTraining from "../line.items/training/new.training/newTraining";
import { styles } from "./Trainings.styles";

const TrainingsLineItemPresenter: React.FunctionComponent = () => {
  const classes = styles();
  const [hoverItemId, setHoverItemId] = React.useState("");
  const onMouseHoverItem = (id) => {
    setHoverItemId(id);
  };
  const onMouseLeaveItem = () => {
    setHoverItemId("");
  };
  const trainingItems = useSelector(trainingSelectors.trainingList);
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
                docRevVersion={pendingAction.docRevVersion}
                docDocumentId={pendingAction.docDocumentId}
                trainingStatus={pendingAction.trainingStatus}
                timestamp={getFormattedDateString(
                  pendingAction.timestamp,
                  MomentFormats.BriefDateTime
                )}
                pendingTrainees={pendingAction.pendingTrainees}
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
    <List dense>
      <ListItemText
        primary={
          <Typography className={classes.noPendingActions}>
            <Text
              translation="dashboard.noPendingActions"
              dataCy="dashboard.noPendingActions"
            />
          </Typography>
        }
      />
    </List>
  );

  return (
    <Grid container={true} spacing={5} className={classes.grid}>
      <Grid item={true} md={12} sm={12}>
        {trainingItems.length > 0 && renderPendingActions()}
        {renderNoPendingActions}
      </Grid>
    </Grid>
  );
};

export default TrainingsLineItemPresenter;

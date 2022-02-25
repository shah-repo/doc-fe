import { Divider, List, ListItemText, Typography } from "@material-ui/core";
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
import { LoadMoreButton } from "../LoadMoreButton";
import { styles } from "./Trainings.styles";

interface Props {
  pinLineItem: (id: string) => void;
  unPinLineItem: (id: string) => void;
  onLoadMoreData: () => void;
  overallLimit: number;
}

const TrainingsLineItemPresenter: React.FunctionComponent<Props> = ({
  pinLineItem,
  unPinLineItem,
  onLoadMoreData,
  overallLimit,
}) => {
  const classes = styles();
  const [hoverItemId, setHoverItemId] = React.useState("");
  const onMouseHoverItem = (id) => {
    setHoverItemId(id);
  };
  const onMouseLeaveItem = () => {
    setHoverItemId("");
  };
  const trainingItems: any = useSelector(trainingSelectors.trainingList);

  const renderPendingActions = () => (
    <List dense className={classes.root} onMouseLeave={onMouseLeaveItem}>
      {trainingItems.results.map((pendingAction, index) => {
        switch (pendingAction.type) {
          case ActionTypes.TRAINING_STATUS_OWNER:
            return (
              <div key={index}>
                <NewTraining
                  id={pendingAction.id}
                  docId={pendingAction.docId}
                  docRevId={pendingAction.docRevId}
                  type={pendingAction.type}
                  docRevName={pendingAction.docRevName}
                  docRevVersion={pendingAction.docRevVersion}
                  docDocumentId={pendingAction.docDocumentId}
                  trainingStatus={pendingAction.trainingStatus}
                  pendingEmailSentAt={pendingAction.pendingEmailSentAt}
                  timestamp={getFormattedDateString(
                    pendingAction.timestamp,
                    MomentFormats.BriefDateTime
                  )}
                  pendingTrainees={pendingAction.pendingTrainees}
                  hoverItemId={hoverItemId}
                  onMouseHoverItem={onMouseHoverItem}
                  pinLineItem={pinLineItem}
                  unPinLineItem={unPinLineItem}
                  pinned={pendingAction.pinned}
                />
                <Divider />
              </div>
            );
          default:
            return <Text key={index} translation="common.undefined" />;
        }
      })}
      <LoadMoreButton onLoadMore={onLoadMoreData} disable={ overallLimit >= trainingItems.total } id="trainingBoxLoadMore"/>
    </List>

  );
  const renderNoPendingActions = trainingItems.total === 0 && (
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
    <>
      {trainingItems.total > 0 && renderPendingActions()}
      {renderNoPendingActions}
    </>
  );
};

export default TrainingsLineItemPresenter;

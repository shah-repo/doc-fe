import { Button, Grid } from "@material-ui/core";
import React from "react";
import { TrainingRecord } from "../../../state/ducks/training";
import Date from "../../components/Date";
import Text from "../../components/Text";
import { documentDetailsPath } from "../../document.revision/utils/paths";
import { styles } from "./PendingAction.styles";

interface OwnProps {
  trainingRecord: TrainingRecord;
}

type Props = OwnProps;

export const TrainingRequest: React.FunctionComponent<Props> = ({
  trainingRecord,
}) => {
  const classes = styles();

  return (
    <Grid
      container={true}
      spacing={10}
      justify="space-between"
      alignItems="baseline"
      id="TrainingRequest-pendingActions"
    >
      <Grid item={true} xs={8}>
        <span className={classes.highlight}>
          <Text message="dashboard.type.PENDING_TRAINING_RECORDS" />
        </span>
        <span>
          <Text
            translation="dashboard.is.due.on"
            values={{ docId: trainingRecord?.trainingPlan?.document.docId }}
          />
          <Date value={trainingRecord.dueOn} />
        </span>
      </Grid>
      <Grid item={true} xs={2}>
        <Button
          variant="contained"
          target="_blank"
          href={documentDetailsPath(trainingRecord.trainingPlan?.document.id || "")}
          color="secondary"
          id="TrainingRequest-button"
        >
          <Text translation="common.open" />
        </Button>
      </Grid>
    </Grid>
  );
};

export default TrainingRequest;

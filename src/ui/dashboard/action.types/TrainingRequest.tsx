import { Button, Grid } from "@material-ui/core";
import React from "react";
import { PendingAction } from "../../../state/ducks/dashboard";
import { TrainingRecord } from "../../../state/ducks/training";
import Date from "../../components/Date";
import Text from "../../components/Text";
import { documentDetailsPath } from "../../document.revision/utils/paths";
import { styles } from "./PendingAction.styles";

interface OwnProps {
  pendingAction: PendingAction;
}

type Props = OwnProps;

export const TrainingRequest: React.FunctionComponent<Props> = ({
  pendingAction,
}) => {
  const classes = styles();
  const trainingRecord = pendingAction.trainingRecord as TrainingRecord;

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
          <Text message={`dashboard.type.${pendingAction.type}`} />
        </span>
        <span>
          <Text
            translation="dashboard.is.due.on"
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            values={{ docId: pendingAction.trainingRecord!.trainingPlan!.document.docId }}
          />
          <Date value={trainingRecord.dueOn} />
        </span>
      </Grid>
      <Grid item={true} xs={2}>
        <Button
          variant="contained"
          target="_blank"
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          href={documentDetailsPath(trainingRecord.trainingPlan!.document.id)}
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

import { Button, Grid } from "@material-ui/core";
import React from "react";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import Text from "../../components/Text";
import { styles } from "./PendingAction.styles";

interface OwnProps {
  changeRequest: ChangeRequest;
}

type Props = OwnProps;

export const TaskApproval: React.FunctionComponent<Props> = ({
  changeRequest,
}) => {
  const classes = styles();

  return (
    <Grid container spacing={10} justify="space-between" alignItems="baseline" id="TaslApproval-tasks">
      <Grid item xs={9}>
        <span className={classes.highlight}>{`CRID: ${changeRequest.crId} `}</span>
        <span>{`"${changeRequest.title}"`}</span>
        <Text message="dashboard.type.PENDING_IMPL_PLAN_TASK" />
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="contained"
          target="_blank"
          href={changeRequestEditPath(changeRequest.id)}
          color="secondary"
          id="TaskApproval-button"
        >
          <Text translation="common.open" />
        </Button>
      </Grid>
    </Grid>
  );
};

export default TaskApproval;

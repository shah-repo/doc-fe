import { Button, Grid } from "@material-ui/core";
import React from "react";
import { PendingAction } from "../../../state/ducks/dashboard";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import Text from "../../components/Text";
import { styles } from "./PendingAction.styles";

interface OwnProps {
  pendingAction: PendingAction;
}

type Props = OwnProps;

export const TaskApproval: React.FunctionComponent<Props> = ({
  pendingAction,
}) => {
  const classes = styles();

  return (
    <Grid container spacing={10} justify="space-between" alignItems="baseline" id="TaslApproval-tasks">
      <Grid item xs={9}>
        <span className={classes.highlight}>{`CRID: ${pendingAction.changeReq.crId} `}</span>
        <span>{`"${pendingAction.changeReq.title}"`}</span>
        <Text message={`dashboard.type.${pendingAction.type}`} />
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="contained"
          target="_blank"
          href={changeRequestEditPath(pendingAction.changeReq.id)}
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

import React from "react";
import { PendingAction } from "../../../state/ducks/dashboard";
import Text from "../../components/Text";
import { Button, Grid } from "@material-ui/core";
import { styles } from "./PendingAction.styles";
import { changeRequestEditPath } from "../../change.request/utils/paths";

interface OwnProps {
  pendingAction: PendingAction;
}

type Props = OwnProps;

export const TaskApproval: React.FunctionComponent<Props> = ({
  pendingAction
}) => {
  const classes = styles();
  
  return (
    <Grid container spacing={10} justify="space-between" alignItems="baseline">
      <Grid item xs={9}>
        <span className={classes.crId}>{`CRID: ${pendingAction.changeReq.crId} `}</span>
        <span>{`"${pendingAction.changeReq.title}"`}</span>
        <Text message={`dashboard.type.${pendingAction.type}`} />
      </Grid>
      <Grid item xs={2}>
        <Button variant="contained" target="_blank" href={changeRequestEditPath(pendingAction.changeReq.id)} color="secondary">
          <Text translation="common.open" />
        </Button>
      </Grid>
    </Grid>
  );
};

export default TaskApproval;

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

export const ChangeRequestApproval: React.FunctionComponent<Props> = ({
  pendingAction,
}) => {
  const classes = styles();

  return (
    <Grid container={true} spacing={10} justify="space-between" alignItems="baseline">
      <Grid item={true} xs={8}>
        <span className={classes.crId}>{`CRID: ${pendingAction.changeReq.crId} `}</span>
        <span>{`from ${pendingAction.changeReq.owner.user.name} `}</span>
        <Text message={`dashboard.type.${pendingAction.type}`} />
      </Grid>
      <Grid item={true} xs={2}>
        <Button
          variant="contained"
          target="_blank"
          href={changeRequestEditPath(pendingAction.changeReq.id)}
          color="secondary"
        >
          <Text translation="common.open" />
        </Button>
      </Grid>
    </Grid>
  );
};

export default ChangeRequestApproval;

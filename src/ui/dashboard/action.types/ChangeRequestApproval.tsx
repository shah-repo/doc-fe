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

export const ChangeRequestApproval: React.FunctionComponent<Props> = ({
  changeRequest,
}) => {
  const classes = styles();

  return (
    <Grid
      container={true}
      spacing={10}
      justify="space-between"
      alignItems="baseline"
      id="ChangeRequestApproval-pendingActions"
    >
      <Grid item={true} xs={8}>
        <span className={classes.highlight}>{`CRID: ${changeRequest.crId} `}</span>
        <span>{`from ${changeRequest.owner.user.name} `}</span>
        <Text message="dashboard.type.PENDING_REVIEW" />
      </Grid>
      <Grid item={true} xs={2}>
        <Button
          variant="contained"
          target="_blank"
          href={changeRequestEditPath(changeRequest.id)}
          color="secondary"
          id="ChangeRequestApproval-button"
        >
          <Text translation="common.open" />
        </Button>
      </Grid>
    </Grid>
  );
};

export default ChangeRequestApproval;

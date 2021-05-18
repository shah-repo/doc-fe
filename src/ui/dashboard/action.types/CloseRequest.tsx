import { Box, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { dashboardActions } from "../../../state/ducks/dashboard";
import ChangeRequestTransitionDialogContainer from "../../change.request/dialogs/ChangeRequestTransitionDialog.container";
import { changeRequestEditPath } from "../../change.request/utils/paths";

interface Props {
  index: number;
  changeRequest: ChangeRequest;
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    containerWrap: {
      paddingLeft: "42px",
      marginTop: "15px",
      marginBottom: "15px",
    },

    itemWrap: {
      display: "flex",
      justifyContent: "flex-end",
    },
  }));

const CloseRequest: React.FunctionComponent<Props> = ({
  index,
  changeRequest,
}) => {
  const intl = useIntl();
  const [crTitle] = useState(intl.formatMessage(
    { id: "dashboard.title.task" },
    { crId: changeRequest.crId },
  ));
  const classes = styles();
  const linkRenderer = () => (
    <Link to={changeRequestEditPath(changeRequest.id)} style={{ textDecoration: "none", color: "inherit" }}>
      <Box data-cy="pendingActionsAR">
        <Box
          color="primary.main"
          fontWeight="fontWeightBold"
          marginBottom="5px"
        >
          {crTitle}
        </Box>
        <Box>
          {changeRequest.title}
        </Box>
      </Box>
    </Link>
  );

  const dispatch = useDispatch();
  const removeDashboardItem = () => {
    setTimeout(() => dispatch(dashboardActions.removeFromList(index)), 500);
  };

  return (
    <Grid
      container={true}
      className={classes.containerWrap}
    >
      <Grid
        item={true}
        xs={9}
      >
        {linkRenderer()}
      </Grid>
      <Grid
        item
        xs={3}
        className={classes.itemWrap}
      >
        <ChangeRequestTransitionDialogContainer
          transition="closed"
          changeRequestId={changeRequest.id}
          label="changeRequest.transition.closed"
          onSuccess={removeDashboardItem}
        />
      </Grid>
    </Grid>
  );
};

export default CloseRequest;

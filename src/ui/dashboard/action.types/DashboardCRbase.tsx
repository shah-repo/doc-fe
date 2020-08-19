import { Box, Grid } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import ChangeRequestTransitionDialogContainer from "../../change.request/dialogs/ChangeRequestTransitionDialog.container";

interface Props {
  crTitle: string;
  url: string;
  changeRequest: ChangeRequest;
}

export const DashboardCRBase: React.FunctionComponent<Props> = ({
  crTitle,
  url,
  changeRequest,
}) => (
  <Grid
    container={true}
    style={{
      paddingLeft: "42px",
      marginTop: "15px",
      marginBottom: "15px",
    }}
  >
    <Grid
      item={true}
      xs={9}
    >
      <Link to={url} style={{ textDecoration: "none", color: "inherit" }}>
        <Box>
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
    </Grid>
    <Grid
      container={true}
      alignItems="flex-end"
      justify="flex-end"
      xs={3}
    >
      <Grid item={true}>
        <ChangeRequestTransitionDialogContainer
          transition="reject"
          changeRequest={changeRequest}
          label="transition.action.reject"
        />
        <ChangeRequestTransitionDialogContainer
          transition="approve"
          changeRequest={changeRequest}
          label="transition.action.approve"
        />
      </Grid>
    </Grid>
  </Grid>
);

export default DashboardCRBase;

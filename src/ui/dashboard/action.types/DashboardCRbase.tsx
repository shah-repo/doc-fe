import { Box, Grid } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import ChangeRequestTransitionDialogContainer from "../../change.request/dialogs/ChangeRequestTransitionDialog.container";

interface Props {
  title: string;
  crTitle: string;
  url: string;
  crId: string;
}

export const DashboardCRBase: React.FunctionComponent<Props> = ({
  title,
  crTitle,
  url,
  crId,
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
            {title}
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
          changeRequestId={crId}
          label="transition.action.reject"
        />
        <ChangeRequestTransitionDialogContainer
          transition="approve"
          changeRequestId={crId}
          label="transition.action.approve"
        />
      </Grid>
    </Grid>
  </Grid>
);

export default DashboardCRBase;

import { Box, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import ChangeRequestTransitionDialogContainer from "../../change.request/dialogs/ChangeRequestTransitionDialog.container";

interface Props {
  title: string;
  crTitle: string;
  url: string;
  crId: string;
}

export const styles = makeStyles((theme: Theme) =>
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

export const DashboardCRBase: React.FunctionComponent<Props> = ({
  title,
  crTitle,
  url,
  crId,
}) => {
  const classes = styles();
  const linkRenderer = () => (
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
  );

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
  ); };

export default DashboardCRBase;

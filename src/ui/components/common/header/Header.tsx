import { Box, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import { SM } from "../../../../App";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions/types";
// import { DRAWER_WIDTH } from "../../../app/NavigationLink.styles";
import { DOCUMENT_REVISION_CREATE_URL } from "../../../constants/urls";
import Colors from "../../../layout/theme/utils/colors";
import { headerBackgroundStyles } from "./Header.background.styles";
import { FormHeaderStatusClassMapping } from "./Helpers";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    headerSection: {
      minHeight: "64px",
      borderRadius: "6px",
    },
    appbar: {
      backgroundColor: Colors.white,
      position: "sticky",
      top: "45px",
      zIndex: theme.zIndex.drawer + 1,
    },
    toolbar: {
      borderBottom: `1px solid ${Colors.medium_gray}`,
      minHeight: "60px",
    },
  },
  ));
interface Props{
  status?: DocumentRevisionStatus;
  displayStatus?: DocumentRevisionStatus;
  fromSummary?: boolean;
}
const Header: React.FunctionComponent<Props> = ({ children, status, displayStatus, fromSummary }) => {
  const classes = styles();
  const headerBackgroundClasses = headerBackgroundStyles();
  const isCreateUrl = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL);
  if ((SM.isNewLayout || SM.isNewCRLayout) && !isCreateUrl) {
    return (
      <Box
        minHeight={84}
        borderColor={Colors.medium_gray}
        bgcolor={Colors.alabaster}
        py={1.25}
        px={1.25}
        alignContent="center"
        marginTop={fromSummary || SM.isNewCRLayout ? 6 : 0}
      >
        <Grid
          container={true}
          className={`${classes.headerSection} ${
            headerBackgroundClasses[
              FormHeaderStatusClassMapping[
                displayStatus || status || ""
              ]
            ]
          }`}
          alignItems="center"
        >
          {children}
        </Grid>
      </Box>
    );
  }

  return (
    <AppBar color="primary" className={classes.appbar}>
      <Toolbar className={classes.toolbar}>
        <Grid container={true}>
          {children}
        </Grid>
      </Toolbar>
    </AppBar>
  ); };

export default Header;

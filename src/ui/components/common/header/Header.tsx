import { Box, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Observer } from "mobx-react";
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
      zIndex: theme.zIndex.drawer + 1,
      overflow: "hidden",
    },
    toolbar: (createUrl) => ({
      minHeight: createUrl ? "" : "84px",
      padding: createUrl ? "" : "10px",
      display: "flex",
      justifyContent: "flex-end",
      borderBottom: createUrl ? `1px solid ${Colors.medium_gray}` : "",
      background: Colors.alabaster,
    }),
  },
  ));
interface Props{
  status?: DocumentRevisionStatus;
  displayStatus?: DocumentRevisionStatus;
}
const Header: React.FunctionComponent<Props> = ({ children, status, displayStatus }) => {
  const headerBackgroundClasses = headerBackgroundStyles();
  const isCreateUrl = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL);
  const classes = styles(isCreateUrl);
  if ((SM.isNewLayout || SM.isNewCRLayout) && !isCreateUrl) {
    return (
      <AppBar color="primary" className={classes.appbar} position="relative">
        <Toolbar className={classes.toolbar}>
          <Observer>
            {() => (
              <Box width="100%">
                <Grid
                  container={true}
                  data-cy='header-section'
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
            )}
          </Observer>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar color="primary" className={classes.appbar} position="relative">
      <Toolbar className={classes.toolbar}>
        <Grid container={true}>
          {children}
        </Grid>
      </Toolbar>
    </AppBar>
  ); };

export default Header;

import { Box, Collapse, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Observer } from "mobx-react";
import React from "react";
import { SM } from "../../../../App";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions/types";
import { DRAWER_WIDTH } from "../../../app/NavigationLink.styles";
import { DOCUMENT_REVISION_CREATE_URL } from "../../../constants/urls";
import Colors from "../../../layout/theme/utils/colors";
import { headerBackgroundStyles } from "./Header.background.styles";

export enum FormHeaderStatusClassMapping {
  "Pending Approval"="PENDING_STATUS",
  "In Review"="PENDING_STATUS",
  "Pending Change"="PENDING_STATUS",
  "IN_REVIEW" = "PENDING_STATUS",
  "Approved"="GREEN_STATUS",
  "Released"="GREEN_STATUS",
  "APPROVED" = "GREEN_STATUS",
  "Obsolete"="GRAY_STATUS",
  "WIP" = "WIP_STATUS",
  "Voided"="RED_STATUS",
  "CLOSED" = "CLOSED_STATUS",
  "VOIDED" = "RED_STATUS",
  "Superseded"="GRAY_STATUS",
  "Void"="GRAY_STATUS",
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    headerSection: {
      minHeight: "64px",
      borderRadius: "6px",
    },
    appbar: {
      backgroundColor: Colors.white,
      position: "fixed",
      top: "45px",
      zIndex: theme.zIndex.drawer + 1,
    },
    toolbar: {
      marginLeft: DRAWER_WIDTH,
      borderBottom: `1px solid ${Colors.medium_gray}`,
      minHeight: "60px",
    },
  },
  ));
interface Props{
  status?: DocumentRevisionStatus;
  displayStatus?: DocumentRevisionStatus;
}
const Header: React.FunctionComponent<Props> = ({ children, status, displayStatus }) => {
  const classes = styles();
  const headerBackgroundClasses = headerBackgroundStyles();
  const { _documentRevisionFormState } = SM.useStores();
  const isCreateUrl = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL);
  if (SM.isNewLayout && !isCreateUrl) {
    return (
      <Observer>
        {() => (
          <>
            <Collapse in={!_documentRevisionFormState?.isHeaderHidden}>
              <Box
                minHeight={60}
                borderColor={Colors.medium_gray}
                bgcolor={Colors.white}
                py={1}
                px={2}
                alignContent="center"
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
            </Collapse>
          </>
        )}
      </Observer>
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

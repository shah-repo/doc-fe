import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ChangeRequestContainer from "../changeRequest/ChangeRequest.container";
import ChangeRequestCreateContainer from "../changeRequest/ChangeRequestCreate.container";
import ChangeRequestListContainer from "../changeRequest/ChangeRequestList.container";
import {
  CHANGE_REQUEST_CREATE_URL,
  CHANGE_REQUEST_LIST_URL,
  CHANGE_REQUEST_ROOT_URL,
  DOCUMENT_REVISION_CREATE_URL,
  DOCUMENT_REVISION_LIST_URL,
  DOCUMENT_REVISION_ROOT_URL,
  DOCUMENT_ROOT_URL,
  HOME_URL,
  DOCUMENT_REVISION_DETAILS_URL,
} from "../constants/urls";
import DashboardContainer from "../dashboard/Dashboard.container";
import DocumentRevisionContainer from "../documentRevision/DocumentRevision.container";
import DocumentRevisionCreateContainer from "../documentRevision/DocumentRevisionCreate.container";
import DocumentRevisionTableContainer from "../documentRevision/DocumentRevisionTable.container";
import DocumentContainer from "../documents/Document.container";
import HeaderContainer from "./Header.container";
import styles from "./Layout.styles";
import Navigation from "./Navigation";
import { DocumentRevisionManagerContainer } from "../documentRevision/DocumentRevisionsManager.container";

type Props = WithStyles<typeof styles>;

const Layout: React.FunctionComponent<Props> = ({ classes }) => {
  return (
    <div>
      <CssBaseline />
      <HeaderContainer />
      <Navigation />
      <main className={classes.content}>
        <Switch>
          <Route path={HOME_URL} exact={true} component={DashboardContainer} />
          <Route path={DOCUMENT_ROOT_URL} component={DocumentContainer} />
          <Route path={CHANGE_REQUEST_CREATE_URL} exact={true} component={ChangeRequestCreateContainer} />
          <Route path={CHANGE_REQUEST_ROOT_URL} component={ChangeRequestContainer} />
          <Route path={CHANGE_REQUEST_LIST_URL} exact={true} component={ChangeRequestListContainer} />
          <Route path={DOCUMENT_REVISION_LIST_URL} exact={true} component={DocumentRevisionTableContainer} />
          <Route path={DOCUMENT_REVISION_CREATE_URL} exact={true} component={DocumentRevisionCreateContainer} />
          <Route path={DOCUMENT_REVISION_ROOT_URL} component={DocumentRevisionContainer} />
          <Redirect to={{ pathname: HOME_URL }} />
        </Switch>
      </main>
    </div>
  );
};

export default withStyles(styles)(Layout);

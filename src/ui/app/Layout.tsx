import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ChangeRequestContainer from "../change.request/Container";
import ChangeRequestListContainer from "../change.request/list/container";
import ChangeRequestCreateContainer from "../changeRequest/ChangeRequestCreate.container";
import {
  CHANGE_REQUEST_CREATE_URL,
  CHANGE_REQUEST_LIST_URL,
  CHANGE_REQUEST_ROOT_URL,
  DOCUMENT_REVISION_CREATE_URL,
  DOCUMENT_REVISION_LIST_URL,
  DOCUMENT_REVISION_ROOT_URL,
  HOME_URL,
  TRAINING_DETAIL_URL,
  USER_MANAGEMENT_ROOT_URL,
} from "../constants/urls";
import DashboardContainer from "../dashboard/Dashboard.container";
import DocumentRevisionContainer from "../document.revision/container";
import DocumentRevisionListContainer from "../document.revision/list/container";
import DocumentRevisionCreateContainer from "../documentRevision/DocumentRevisionCreate.container";
import RemoteValidatorsLoader from "../remoteValidators/RemoteValidators";
import TrainingDetailContainer from "../training/TrainingDetail.container";
import UserManagementListContainer from "../user.management/list/container";
import AutoLogout from "./AutoLogout";
import DataFetcherContainer from "./DataFetcher.container";
import HeaderContainer from "./Header.container";
import styles from "./Layout.styles";
import Navigation from "./Navigation";

type Props = WithStyles<typeof styles>;

const Layout: React.FunctionComponent<Props> = ({ classes }) => {
  return (
    <div>
      <AutoLogout />
      <RemoteValidatorsLoader />
      <CssBaseline />
      <HeaderContainer />
      <Navigation />
      <main className={classes.content}>
        <DataFetcherContainer />
        <Switch>
          <Route path={HOME_URL} exact={true} component={DashboardContainer} />
          <Route
            path={CHANGE_REQUEST_CREATE_URL}
            exact={true}
            component={ChangeRequestCreateContainer}
          />
          <Route
            path={CHANGE_REQUEST_ROOT_URL}
            component={ChangeRequestContainer}
          />
          <Route
            path={CHANGE_REQUEST_LIST_URL}
            exact={true}
            component={ChangeRequestListContainer}
          />
          <Route
            path={DOCUMENT_REVISION_LIST_URL}
            exact={true}
            component={DocumentRevisionListContainer}
          />
          <Route
            path={DOCUMENT_REVISION_CREATE_URL}
            exact={true}
            component={DocumentRevisionCreateContainer}
          />
          <Route
            path={DOCUMENT_REVISION_ROOT_URL}
            component={DocumentRevisionContainer}
          />
          <Route
            path={TRAINING_DETAIL_URL}
            component={TrainingDetailContainer}
          />
          <Route
            path={USER_MANAGEMENT_ROOT_URL}
            component={UserManagementListContainer}
          />
          <Redirect to={{ pathname: HOME_URL }} />
        </Switch>
      </main>
    </div>
  );
};

export default withStyles(styles)(Layout);

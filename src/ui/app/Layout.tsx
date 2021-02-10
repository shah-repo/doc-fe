import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ChangeRequestCreateContainer from "../change.request/ChangeRequestCreate.container";
import ChangeRequestContainer from "../change.request/Container";
import ChangeRequestListContainer from "../change.request/list/container";
import WatermarkFooterContainer from "../components/watermarkFooter/container";
import { CHANGE_REQUEST_CREATE_URL, CHANGE_REQUEST_LIST_URL, CHANGE_REQUEST_ROOT_URL, DOCUMENT_BY_CATEGORY_LIST_URL, DOCUMENT_BY_TYPE_LIST_URL, DOCUMENT_REVISION_CREATE_MAINTENANCE_URL, DOCUMENT_REVISION_CREATE_URL, DOCUMENT_REVISION_LIST_URL, DOCUMENT_REVISION_ROOT_URL, DOCUMENT_TYPE_MANAGEMENT_URL, GROUP_MANAGEMENT_ROOT_URL, HOME_URL, PAGE_DETAILS_MANAGEMENT_URL, SLACK_ROOT_URL, TRAINING_DETAIL_URL, TRAINING_URL, USER_MANAGEMENT_ROOT_URL } from "../constants/urls";
import DashboardContainer from "../dashboard/Dashboard.container";
import DocumentRevisionContainer from "../document.revision/container";
import DocumentRevisionListContainer from "../document.revision/list/container";
import { DocumentTypeManagementContainer } from "../document.type.management/list/container";
import DocumentRevisionCreateContainer from "../documentRevision/DocumentRevisionCreate.container";
import DocumentTypeListContainer from "../documentType/list/container";
import GroupManagementListContainer from "../group.management/list/container";
import { PageDetailsManagementContainer } from "../page.details.management/list/container";
import RemoteValidatorsLoader from "../remoteValidators/RemoteValidators";
import SlackContainer from "../slack/Container";
import TrainingListContainer from "../training/list/container";
import TrainingDetailContainer from "../training/TrainingDetail.container";
import UserManagementListContainer from "../user.management/list/container";
import DataFetcherContainer from "./DataFetcher.container";
import HeaderContainer from "./Header.container";
import styles from "./Layout.styles";
import Navigation from "./Navigation";
import PingServer from "./PingServer";
import SocketsContainer from "./sockets/container";

type Props = WithStyles<typeof styles>;

const Layout: React.FunctionComponent<Props> = ({ classes }) => (
  <div>
    <RemoteValidatorsLoader />
    <PingServer />
    <CssBaseline />
    <HeaderContainer />
    <Navigation />
    <SocketsContainer />
    <WatermarkFooterContainer />
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
          path={DOCUMENT_REVISION_CREATE_MAINTENANCE_URL}
          exact
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
          path={TRAINING_URL}
          component={TrainingListContainer}
        />
        <Route
          path={USER_MANAGEMENT_ROOT_URL}
          component={UserManagementListContainer}
        />
        <Route
          path={GROUP_MANAGEMENT_ROOT_URL}
          component={GroupManagementListContainer}
        />
        <Route path={SLACK_ROOT_URL} component={SlackContainer} />
        <Route
          path={DOCUMENT_BY_TYPE_LIST_URL}
          component={DocumentTypeListContainer}
        />
        <Route
          path={DOCUMENT_BY_CATEGORY_LIST_URL}
          component={DocumentTypeListContainer}
        />
        <Route
          path={DOCUMENT_TYPE_MANAGEMENT_URL}
          component={DocumentTypeManagementContainer}
        />
        <Route
          path={PAGE_DETAILS_MANAGEMENT_URL}
          component={PageDetailsManagementContainer}
        />
        <Redirect to={{ pathname: HOME_URL }} />
      </Switch>
    </main>
  </div>
);

export default withStyles(styles)(Layout);

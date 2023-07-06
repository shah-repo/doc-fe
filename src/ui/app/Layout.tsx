import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { SM } from '../../App';
import { SearchPage } from '../../App/Enlil/Features/Search';
import AsyncTasksContainer from '../async.tasks/grid/container';
import ChangeRequestCreateContainer from '../change.request/ChangeRequestCreate.container';
import ChangeRequestContainer from '../change.request/Container';
import ChangeRequestListContainer from '../change.request/grid/container';
import WatermarkFooterContainer from '../components/watermarkFooter/container';
import { ASYNC_TASKS_URL, CHANGE_REQUEST_CREATE_URL, CHANGE_REQUEST_LIST_URL, CHANGE_REQUEST_ROOT_URL, DASHBOARD_URL, DOCUMENT_BY_CATEGORY_LIST_URL, DOCUMENT_BY_TYPE_LIST_URL, DOCUMENT_REVISION_CREATE_URL, DOCUMENT_REVISION_LIST_URL, DOCUMENT_REVISION_ROOT_URL, DOCUMENT_TYPE_MANAGEMENT_URL, GROUP_MANAGEMENT_ROOT_URL, HOME_URL, PAGE_DETAILS_MANAGEMENT_URL, SLACK_ROOT_URL, TRAINING_DETAIL_URL, TRAINING_URL, USER_MANAGEMENT_ROOT_URL, GLOBAL_SEARCH_URL } from '../constants/urls';
import DashboardLayout from '../dashboard.new/Dashboard.layout';
import DashboardContainer from '../dashboard/Dashboard.container';
import DocumentRevisionContainer from '../document.revision/container';
import DocumentRevisionListContainer from '../document.revision/grid/container';
import { DocumentTypeManagementContainer } from '../document.type.management/kendo/container';
import DocumentRevisionCreateContainer from '../documentRevision/DocumentRevisionCreate.container';
import DocumentTypeListContainer from '../documentType/grid/container';
import GroupManagementListContainer from '../group.management/kendo/container';
import PageDetailsManagementContainer from '../page.details.management/list/container';
import RemoteValidatorsLoader from '../remoteValidators/RemoteValidators';
import SlackContainer from '../slack/Container';
import TrainingListContainer from '../training/grid/container';
import TrainingDetailContainer from '../training/TrainingDetail.container';
import UserManagementListContainer from '../user.management/kendo/container';
import DataFetcherContainer from './DataFetcher.container';
import HeaderContainer from './Header.container';
import useStyles from './Layout.styles';
import Navigation from './Navigation';
import PingServer from './PingServer';
import SocketsContainer from './sockets/container';

const Layout: React.FunctionComponent = () => {
  const classes = useStyles(SM.isHomeURL);

  return (
    <>
      <RemoteValidatorsLoader />
      <PingServer />
      <CssBaseline />
      <HeaderContainer />
      <Navigation />
      <SocketsContainer />
      <WatermarkFooterContainer />
      <main className={classes.root}>
        <DataFetcherContainer />
        <Switch>
          <Route
            path={DOCUMENT_REVISION_CREATE_URL}
            exact
            component={DocumentRevisionCreateContainer}
          />
          <Route
            path={DOCUMENT_REVISION_ROOT_URL}
            component={DocumentRevisionContainer}
          />
          <Route
            path={DASHBOARD_URL}
            exact
            component={DashboardContainer}
          />
          <Route
            path={HOME_URL}
            exact
            component={DashboardLayout}
          />
          <Route
            path={CHANGE_REQUEST_CREATE_URL}
            exact
            component={ChangeRequestCreateContainer}
          />
          <Route
            path={CHANGE_REQUEST_ROOT_URL}
            component={ChangeRequestContainer}
          />
          <Route
            path={CHANGE_REQUEST_LIST_URL}
            exact
            component={ChangeRequestListContainer}
          />
          <Route
            path={DOCUMENT_REVISION_LIST_URL}
            exact
            component={DocumentRevisionListContainer}
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
          <Route
            path={SLACK_ROOT_URL}
            component={SlackContainer}
          />
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
          <Route
            path={ASYNC_TASKS_URL}
            component={AsyncTasksContainer}
          />
          <Route
            path={GLOBAL_SEARCH_URL}
            component={SearchPage}
          />
          <Redirect to={HOME_URL} />
        </Switch>
      </main>
    </>
  );
};

export default Layout;

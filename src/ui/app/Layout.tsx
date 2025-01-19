import CssBaseline from '@material-ui/core/CssBaseline';
import cx from 'classnames';
import isMobile from 'is-mobile';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { SearchPage } from '../../App/Enlil/Features/Search';
import { authSelectors } from '../../state/ducks/auth';
import UserGroupManagment from '../administration/UserGroupManagement';
import BulkMigrationPage from '../administration/bulkMigration';
import GeneralSettingsPage from '../administration/general.settings';
import AsyncTasksContainer from '../async.tasks/grid/container';
import BulkImportPage from '../bulkImport/container';
import BulkImportProgressPage from '../bulkImport/container.progress';
import ChangeRequestCreateContainer from '../change.request/ChangeRequestCreate.container';
import ChangeRequestContainer from '../change.request/Container';
import ChangeRequestListContainer from '../change.request/grid/container';
import WatermarkFooterContainer from '../components/watermarkFooter/container';
import {
  ASYNC_TASKS_URL,
  BULK_IMPORT_PROGRESS_URL,
  BULK_IMPORT_URL,
  BULK_MIGRATION_URL,
  CHANGE_REQUEST_CREATE_URL,
  CHANGE_REQUEST_LIST_URL,
  CHANGE_REQUEST_ROOT_URL,
  DASHBOARD_URL,
  DOCUMENT_BY_CATEGORY_LIST_URL,
  DOCUMENT_BY_TYPE_LIST_URL,
  DOCUMENT_REVISION_CREATE_URL,
  DOCUMENT_REVISION_LIST_URL,
  DOCUMENT_REVISION_ROOT_URL,
  DOCUMENT_TYPE_MANAGEMENT_URL,
  GENERAL_SETTINGS_URL,
  GLOBAL_SEARCH_URL,
  HOME_URL,
  NO_ACCESS,
  PAGE_DETAILS_MANAGEMENT_URL,
  SLACK_ROOT_URL,
  TRAINING_DETAIL_URL,
  TRAINING_URL,
  USER_GROUP_URL,
} from '../constants/urls';
import DashboardLayout from '../dashboard.new/Dashboard.layout';
import DashboardContainer from '../dashboard/Dashboard.container';
import DocumentRevisionContainer from '../document.revision/container';
import DocumentRevisionListContainer from '../document.revision/grid/container';
import { DocumentTypeManagementContainer } from '../document.type.management/kendo/container';
import DocumentRevisionCreateContainer from '../documentRevision/DocumentRevisionCreate.container';
import { IS_SIDEBAR_EXPANDED } from '../documentRevision/Sidebar/constants';
import DocumentTypeListContainer from '../documentType/grid/container';
import NoAccessScreen from '../noAccessScreen';
import PageDetailsManagementContainer from '../page.details.management/list/container';
import RemoteValidatorsLoader from '../remoteValidators/RemoteValidators';
import SlackContainer from '../slack/Container';
import TrainingDetailContainer from '../training/TrainingDetail.container';
import TrainingListContainer from '../training/grid/container';
import DataFetcherContainer from './DataFetcher.container';
import HeaderContainer from './Header.container';
import useStyles from './Layout.styles';
import Navigation from './Navigation';
import PingServer from './PingServer';
import SocketsContainer from './sockets/container';

const Layout: React.FunctionComponent = () => {
  const isMobileView = isMobile();
  const defaultSidebarExpandedValue = isMobileView ? false : localStorage.getItem(IS_SIDEBAR_EXPANDED) === '1';
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(defaultSidebarExpandedValue);
  const classes = useStyles();
  const toggleSidebar = () => {
    localStorage.setItem(IS_SIDEBAR_EXPANDED, !isSidebarExpanded ? '1' : '0');
    setIsSidebarExpanded(prev => !prev);
  };
  const canAccessNavigation = useSelector(authSelectors.hasCompanies);

  return (
    <>
      <RemoteValidatorsLoader />
      <PingServer />
      <CssBaseline />
      <HeaderContainer
        isSidebarExpanded={isSidebarExpanded && canAccessNavigation}
        onSidebarToggle={toggleSidebar}
        canAccessNavigation={canAccessNavigation}
      />
      {canAccessNavigation && (
        <Navigation isOpen={(isSidebarExpanded || isMobileView) && canAccessNavigation} onSidebarToggle={toggleSidebar} />
      )}
      <SocketsContainer />
      <WatermarkFooterContainer />
      <main className={cx(
        classes.root,
        {
          [classes.withSidebarExpanded]: isSidebarExpanded,
          [classes.fullWidth]: !canAccessNavigation,
        },
      )} >
        <DataFetcherContainer />
        <Switch>
          <Route
            path={DOCUMENT_REVISION_LIST_URL}
            exact
            component={DocumentRevisionListContainer}
          />
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
            path={TRAINING_DETAIL_URL}
            component={TrainingDetailContainer}
          />
          <Route
            path={TRAINING_URL}
            component={TrainingListContainer}
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
          <Route
            path={GENERAL_SETTINGS_URL}
            component={GeneralSettingsPage}
          />
          <Route
            path={BULK_IMPORT_URL}
            component={BulkImportPage}
            exact
          />
          <Route
            path={BULK_MIGRATION_URL}
            component={BulkMigrationPage}
          />
          <Route
            path={USER_GROUP_URL}
            component={UserGroupManagment}
          />
          <Route
            path={BULK_IMPORT_PROGRESS_URL}
            component={BulkImportProgressPage}
            exact
          />
          <Route
            path={NO_ACCESS}
            component={NoAccessScreen}
            exact
          />
          <Redirect to={HOME_URL} />
        </Switch>
      </main>
    </>
  );
};

export default Layout;

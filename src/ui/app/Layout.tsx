import CssBaseline from '@material-ui/core/CssBaseline';
import { Widget as AiWidget, AppName } from 'ai-widget';
import cx from 'classnames';
import isMobile from 'is-mobile';
import React from 'react';
import { connect, useSelector } from 'react-redux';
import { matchPath, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { SM } from '../../App';
import { SearchPage } from '../../App/Enlil/Features/Search';
import { authSelectors } from '../../state/ducks/auth';
import { Permission } from '../../state/ducks/auth/types';
import { companySelectors } from '../../state/ducks/company';
import { ApplicationState } from '../../state/reducers';
import { store } from '../../state/store';
import UserGroupManagment from '../administration/UserGroupManagement';
import GeneralSettingsPage from '../administration/general.settings';
import PremiumFeaturesPage from '../administration/premium.settings';
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
  CHANGE_REQUEST_CREATE_URL,
  CHANGE_REQUEST_LIST_URL,
  CHANGE_REQUEST_ROOT_URL,
  DASHBOARD_URL,
  DOCUMENT_BY_CATEGORY_LIST_URL,
  DOCUMENT_BY_TYPE_LIST_URL,
  DOCUMENT_REVISION_CREATE_URL,
  DOCUMENT_REVISION_LIST_URL,
  DOCUMENT_REVISION_ROOT_URL,
  DOCUMENT_REVISION_VERSION_URL,
  DOCUMENT_TYPE_MANAGEMENT_URL,
  GENERAL_SETTINGS_URL,
  GLOBAL_SEARCH_URL,
  HOME_URL,
  PAGE_DETAILS_MANAGEMENT_URL,
  PREMIUM_FEATURES_URL,
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

const Layout: React.FunctionComponent<{ isAIEnabled: boolean, currentEmployeePermissions: Permission[] }> = ({ isAIEnabled, currentEmployeePermissions }) => {
  const isExpanded = localStorage.getItem(IS_SIDEBAR_EXPANDED) ? localStorage.getItem(IS_SIDEBAR_EXPANDED) !== '0' : false;
  const [isOpened, setOpen] = React.useState(isMobile() ? false : isExpanded);
  const classes = useStyles({ isDashboard: SM.isHomeURL, isOpened: isOpened });
  const handleDrawerOpen = () => {
    localStorage.setItem(IS_SIDEBAR_EXPANDED, !isOpened ? '1' : '0');
    setOpen(!isOpened);
  };
  const isAIPermissionEnabled = currentEmployeePermissions.includes(Permission.AI_SUBSCRIPTION);
  const isAIWidgetShown = isAIEnabled && isAIPermissionEnabled;
  const userName = useSelector(authSelectors.currentUserName);
  const location = useLocation();
  const documentMatch = matchPath<{ documentRevisionId?: string }>(location.pathname, {
    path: DOCUMENT_REVISION_VERSION_URL,
    exact: false,
    strict: false,
  });
  const companyId = useSelector(companySelectors.companyIdSelector);
  const documentRevisionId = documentMatch?.params?.documentRevisionId;
  const accessToken = `${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`;

  return (
    <>
      <RemoteValidatorsLoader />
      <PingServer />
      <CssBaseline />
      <HeaderContainer className={classes.mobileLayout} isOpened={isOpened} handleDrawerOpen={handleDrawerOpen} />
      <Navigation handleDrawerOpen={handleDrawerOpen} open={isOpened} />
      <SocketsContainer />
      <WatermarkFooterContainer />
      <main className={cx(classes.root, classes.mobileLayout)} >
        <DataFetcherContainer />
        {isAIWidgetShown && (
          <AiWidget
            appName={AppName.D2M}
            userName={userName}
            companyId={companyId}
            documentRevisionId={documentRevisionId}
            token={accessToken}
            apiPath="https://api.ai.dev2.enlil.io/t4/v1"
          />
        )}
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
            path={PREMIUM_FEATURES_URL}
            component={PremiumFeaturesPage}
          />
          <Route
            path={BULK_IMPORT_URL}
            component={BulkImportPage}
            exact
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
          <Redirect to={HOME_URL} />
        </Switch>
      </main>
    </>
  );
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    isAIEnabled: state.company.premiumFeatures.isAIEnabled,
    currentEmployeePermissions: state.auth.groups.permissions,
  };
};

export default connect(mapStateToProps)(Layout);

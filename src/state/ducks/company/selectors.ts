import { createSelector } from "reselect";
import Config from "../../../config";
import { ThemeEnv } from "../../../ui/layout/theme/utils/types";
import { ApplicationState } from "../../reducers";
import { WHITE_LABEL_DEFAULT } from "./constants";

const getSelectedCompany = (state: ApplicationState) => state.company.selectedCompany;
const slackTeamId = (state: ApplicationState) => state.company.selectedCompany.teamId;
const isSlackIntegrationEnabled = (state: ApplicationState) => state.company.selectedCompany.slackIntegrationEnabled;
const isHelloSignIntegrationEnabled = (state: ApplicationState) =>
  state.company.companyMine.helloSignIntegrationEnabled;
const isDropboxEnabled = (state: ApplicationState) => state.company.companyMine.dropboxEnabled;

const getWhiteLabeling = createSelector(
  getSelectedCompany,
  (selectedCompany) => (selectedCompany.whiteLabeling || {})[Config.Theme as ThemeEnv] || WHITE_LABEL_DEFAULT,
);

const getAllWhiteLabeling = createSelector(
  getSelectedCompany,
  (selectedCompany) => selectedCompany.whiteLabeling || WHITE_LABEL_DEFAULT,
);

const getCompanyMine = (state: ApplicationState) => state.company.companyMine;

const getNavigationItems = (state: ApplicationState) => state.company.selectedCompany.navigation;
const getNavigationItemStatus = (state: ApplicationState, label: string) =>
  state.company.companyMine.navigation.find((item) => item.label === label);

const getCompanyMaxRevisionStage = (state: ApplicationState) => state.company.companyMine.numOfRevStages;
const getAutosaveEnabled = (state: ApplicationState) => state.company.autosaveConfig.autosaveEnabled;

export default {
  getWhiteLabeling,
  isSlackIntegrationEnabled,
  isDropboxEnabled,
  slackTeamId,
  getSelectedCompany,
  getCompanyMine,
  isHelloSignIntegrationEnabled,
  getNavigationItems,
  getNavigationItemStatus,
  getCompanyMaxRevisionStage,
  getAllWhiteLabeling,
  getAutosaveEnabled,
};

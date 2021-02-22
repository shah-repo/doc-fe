import { createSelector } from "reselect";
import { WHITE_LABEL_DEFAULT } from ".";
import Config from "../../../config";
import { ThemeEnv } from "../../../ui/layout/theme/utils/types";
import { ApplicationState } from "../../reducers";

const getSelectedCompany = (state: ApplicationState) => state.company.selectedCompany;
const slackTeamId = (state: ApplicationState) => state.company.selectedCompany.teamId;
const isSlackIntegrationEnabled = (state: ApplicationState) => state.company.selectedCompany.slackIntegrationEnabled;
const isHelloSignIntegrationEnabled = (state: ApplicationState) =>
  state.company.companyMine.helloSignIntegrationEnabled;

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

export default {
  getWhiteLabeling,
  isSlackIntegrationEnabled,
  slackTeamId,
  getSelectedCompany,
  getCompanyMine,
  isHelloSignIntegrationEnabled,
  getNavigationItems,
  getNavigationItemStatus,
  getCompanyMaxRevisionStage,
  getAllWhiteLabeling,
};

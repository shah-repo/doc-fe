import { createSelector } from "reselect";
import { ApplicationState } from "../../reducers";
import { WHITE_LABEL_DEFAULT } from "./constants";

const getSelectedCompany = (state: ApplicationState) => state.company.selectedCompany;
const slackTeamId = (state: ApplicationState) => state.company.selectedCompany.teamId;
const isSlackIntegrationEnabled = (state: ApplicationState) => state.company.selectedCompany.slackIntegrationEnabled;
const isHelloSignIntegrationEnabled = (state: ApplicationState) =>
  state.company.companyMine.helloSignIntegrationEnabled;

const getWhiteLabeling = createSelector(
  getSelectedCompany,
  (selectedCompany) => selectedCompany.whiteLabeling || WHITE_LABEL_DEFAULT,
);

const getCompanyMine = (state: ApplicationState) => state.company.companyMine;

const getNavigationItems = (state: ApplicationState) => state.company.selectedCompany.navigation;

export default {
  getWhiteLabeling,
  isSlackIntegrationEnabled,
  slackTeamId,
  getSelectedCompany,
  getCompanyMine,
  isHelloSignIntegrationEnabled,
  getNavigationItems,
};

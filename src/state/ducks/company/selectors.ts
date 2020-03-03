import { createSelector } from "reselect";
import { ApplicationState } from "../../reducers";
import { WHITE_LABEL_DEFAULT } from "./constants";

const getSelectedCompany = (state: ApplicationState) => state.company.selectedCompany;
const slackTeamId = (state: ApplicationState) => state.company.selectedCompany.teamId;
const isSlackIntegrationEnabled = (state: ApplicationState) => state.company.selectedCompany.slackIntegrationEnabled;

const getWhiteLabeling = createSelector(
  getSelectedCompany,
  (selectedCompany) => selectedCompany.whiteLabeling || WHITE_LABEL_DEFAULT,
);

const getCompanyMine = (state: ApplicationState) => state.company.companyMine;

export default {
  getWhiteLabeling,
  isSlackIntegrationEnabled,
  slackTeamId,
  getSelectedCompany,
  getCompanyMine,
};

import { createSelector } from "reselect";
import { ApplicationState } from "../../reducers";
import { WHITE_LABEL_DEFAULT } from "./constants";

const getSelectedCompany = (state: ApplicationState) => state.company.selectedCompany;

const isSlackIntegrationEnabled = createSelector(
  getSelectedCompany,
  (selectedCompany) => selectedCompany.slackIntegrationEnabled,
);

const getWhiteLabeling = createSelector(
  getSelectedCompany,
  (selectedCompany) => selectedCompany.whiteLabeling || WHITE_LABEL_DEFAULT,
);

export default {
  getWhiteLabeling,
  isSlackIntegrationEnabled,
};

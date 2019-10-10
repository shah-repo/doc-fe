import { ApplicationState } from "../../reducers";

const getSelectedCompany = (state: ApplicationState) => state.company.selectedCompany;

export default {
  getSelectedCompany,
};

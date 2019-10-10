import { ApplicationState } from "../../reducers";

const getWhiteLabeling = (state: ApplicationState) => state.company.selectedCompany.whiteLabeling;

export default {
  getWhiteLabeling,
};

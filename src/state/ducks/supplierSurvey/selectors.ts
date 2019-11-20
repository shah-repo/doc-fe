import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";

const supplierSurvey = (state: ApplicationState) =>
  state.supplierSurvey.supplierSurvey;

const getLoadSupplierSurveyListAsyncInfo = (
  state: ApplicationState,
): AsyncState => state.supplierSurvey.loadSupplierSurveyListAsyncInfo;

export default {
    getLoadSupplierSurveyListAsyncInfo,
    supplierSurvey,
};

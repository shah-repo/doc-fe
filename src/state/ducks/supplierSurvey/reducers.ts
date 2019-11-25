import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { SUPPLIER_SURVEY_LIST, SUPPLIER_SURVEY_LIST_ASYNC } from "./constants";
import { SupplierSurveyForm, SupplierSurveyListAction, SupplierSurveyState } from "./types";

export const SUPPLIER_SURVEY_DEFAULT_STATE: SupplierSurveyForm = {
  createdAt: "",
  updatedAt: "",
  id: "",
  token: "",
  surveyFormDocumentRevision: {},
  surveySubmission: null,
};

export const supplierSurvey = (
  state: SupplierSurveyState = SUPPLIER_SURVEY_DEFAULT_STATE,
  action: SupplierSurveyListAction,
): SupplierSurveyState => {
  switch (action.type) {
    case SUPPLIER_SURVEY_LIST:
      return { ...action.payload };
    default:
      return state;
  }
};

export default combineReducers({
    loadSupplierSurveyListAsyncInfo: asyncReducer(SUPPLIER_SURVEY_LIST_ASYNC),
    supplierSurvey,
});

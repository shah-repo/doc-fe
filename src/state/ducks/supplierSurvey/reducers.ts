import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { SUPPLIER_SURVEY, SUPPLIER_SURVEY_ASYNC } from "./constants";
import { SupplierSurveyAction, SupplierSurveyForm, SupplierSurveyState } from "./types";

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
  action: SupplierSurveyAction,
): SupplierSurveyState => {
  switch (action.type) {
    case SUPPLIER_SURVEY:
      return { ...action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  loadSupplierSurveyAsyncInfo: asyncReducer(SUPPLIER_SURVEY_ASYNC),
  supplierSurvey,
});

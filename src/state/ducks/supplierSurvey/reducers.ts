import { combineReducers } from "redux";
import { SupplierSurveyAction, SupplierSurveyForm, SupplierSurveyState, SUPPLIER_SURVEY, SUPPLIER_SURVEY_ASYNC } from ".";
import asyncReducer from "../../reducers/asyncReducer";

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

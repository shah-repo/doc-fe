import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { SUPPLIER_SURVEY_LIST, SUPPLIER_SURVEY_LIST_ASYNC } from "./constants";
import { SupplierSurveyListAction, SupplierSurveyState } from "./types";

export const supplierSurvey = (
  state: SupplierSurveyState = [],
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

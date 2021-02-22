import { Dictionary } from "lodash";
import { SUPPLIER_SURVEY, SUPPLIER_SURVEY_SUBMIT } from ".";
import { DocumentRevision } from "../documentRevisions";

export interface SupplierSurveyForm {
  createdAt: string;
  updatedAt: string;
  id: string;
  token: string;
  surveyFormDocumentRevision: Partial<DocumentRevision>;
  surveySubmission: Partial<DocumentRevision> | null;
}

export interface SupplierSurveyAction {
  type: typeof SUPPLIER_SURVEY;
  payload: SupplierSurveyForm;
}
export interface SupplierSurveySubmitAction {
  type: typeof SUPPLIER_SURVEY_SUBMIT;
  payload: SupplierSurveyForm;
}

export interface SubmitSupplierSurvey {
  formInput: Dictionary<any> | string;
}

export type SupplierSurveyState = SupplierSurveyForm;

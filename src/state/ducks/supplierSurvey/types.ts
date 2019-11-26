import { DocumentRevision } from "../documentRevisions";
import { SUPPLIER_SURVEY_LIST, SUPPLIER_SURVEY_SUBMIT } from "./constants";

export interface SupplierSurveyForm {
    createdAt: string;
    updatedAt: string;
    id: string;
    token: string;
    surveyFormDocumentRevision: Partial<DocumentRevision>;
    surveySubmission: Partial<DocumentRevision> | null;
}

export interface SupplierSurveyListAction {
    type: typeof SUPPLIER_SURVEY_LIST;
    payload: SupplierSurveyForm;
}
export interface SupplierSurveySubmitAction {
    type: typeof SUPPLIER_SURVEY_SUBMIT;
    payload: SupplierSurveyForm;
}

export interface SubmitSupplierSurvey {
    formInput: {};
}

export type SupplierSurveyState = SupplierSurveyForm;

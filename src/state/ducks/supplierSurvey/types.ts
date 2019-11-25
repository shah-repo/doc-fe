import { DocumentRevision } from "../documentRevisions";
import { SUPPLIER_SURVEY_LIST } from "./constants";

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

export type SupplierSurveyState = SupplierSurveyForm;

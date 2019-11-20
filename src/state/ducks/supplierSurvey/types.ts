import { DocumentRevision } from "../documentRevisions";
import { SUPPLIER_SURVEY_LIST } from "./constants";

export interface SupplierSurveyListAction {
    type: typeof SUPPLIER_SURVEY_LIST;
    payload: DocumentRevision[];
}

export type SupplierSurveyState = DocumentRevision[];

import { User } from "../common";
import { DocumentType } from "../documentRevisions/documentType";
import { SELECT_COMPANY } from "./constants";

export interface WhiteLabelingColors {
  main: string;
  primary: string;
  secondary: string;
  hint: string;
}

export interface WhiteLabeling {
  logo: string;
  colors: WhiteLabelingColors;
}

export interface Company {
  id: string;
  name: string;
  maxRevisionStages: number;
  users: User[];
  documentTypes: DocumentType[];
  whiteLabeling: WhiteLabeling;
}

export interface SelectCompanyAction {
  type: typeof SELECT_COMPANY;
  payload: Company;
}

export type SelectCompanyState = Company;

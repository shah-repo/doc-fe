import { User } from "../common";
import { DocumentType } from "../documentRevisions/documentType";
import { SELECT_COMPANY } from "./constants";

export interface WhiteLabelingColors {
  defaultBackground: string;
  primary: string;
  primaryContrastText: string;
  secondary: string;
  secondaryContrastText: string;
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

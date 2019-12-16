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
  avatar: string;
  colors: WhiteLabelingColors;
}

export interface Employee {
  id: string;
  active: boolean;
  company: Company;
}

export interface Company {
  slackIntegrationEnabled: boolean;
  id: string;
  name: string;
  maxRevisionStages: number;
  users: User[];
  documentTypes: DocumentType[];
  whiteLabeling: WhiteLabeling;
  teamId: string;
}

export interface SelectCompanyAction {
  type: typeof SELECT_COMPANY;
  payload: Company;
}

export type SelectCompanyState = Company;

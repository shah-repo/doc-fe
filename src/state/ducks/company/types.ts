import { User } from "../common";
import { DocumentType } from "../documentRevisions/documentType";
import { GET_COMPANY_MINE, SELECT_COMPANY } from "./constants";

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
  slackUserId: string;
  user?: User;
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
  addresses: [];
  acctCodes: [];
}

export interface SelectCompanyAction {
  type: typeof SELECT_COMPANY;
  payload: Company;
}

export interface CompanyMineAction {
  type: typeof GET_COMPANY_MINE;
  payload: Company;
}

export interface CompanyMineRequest {
  name?: string;
  addresses?: string[];
  acctCodes?: string[];
}

export type SelectCompanyState = Company;

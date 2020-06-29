import { User } from "../common";
import { DocumentType } from "../documentRevisions/documentType";
import { SELECT_COMPANY, SET_COMPANY_MINE } from "./constants";

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
  helloSignAppId: string;
  helloSignIntegrationEnabled: boolean;
  teamId: string;
  addresses: [];
  acctCodes: [];
  navigation: NavigationItem[];
  navigationBasedOnUserTagsRestriction: NavigationItem[];
}

export interface SelectCompanyAction {
  type: typeof SELECT_COMPANY;
  payload: Company;
}

export interface CompanyMineAction {
  type: typeof SET_COMPANY_MINE;
  payload: Company;
}

export interface CompanyMineRequest {
  name?: string;
  addresses?: string[];
  acctCodes?: string[];
  helloSignIntegrationEnabled?: boolean;
}

export type SelectCompanyState = Company;

export type NavigationItemType = "LINK" | "MENU" | "CATEGORY";

export enum NAVIGATION_ICON {
  DASHBOARD="DASHBOARD",
  DOC_REV_LIST="DOC_REV_LIST",
  CR_LIST = "CR_LIST",
  USER_MANAGEMENT="USER_MANAGEMENT",
  GROUP_MANAGEMENT = "GROUP_MANAGEMENT",
  PURCHASE_ORDER = "PURCHASE_ORDER",
  RECEIVABLE = "RECEIVABLE",
  SUPPLIERS = "SUPPLIERS",
  LOTS = "LOTS",
}


export interface NavigationItem {
  label: string;
  type: NavigationItemType;
  link?: string;
  menu?: NavigationItem[];
  icon?: NAVIGATION_ICON;
}

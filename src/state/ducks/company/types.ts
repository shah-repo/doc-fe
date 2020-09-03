import { GroupTag } from "../auth/types";
import { User } from "../common";
import { DocumentType } from "../documentRevisions/documentType";
import { SELECT_COMPANY, SET_COMPANY_MINE, UPDATE_NAVIGATION_ITEM } from "./constants";

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
}

export interface SelectCompanyAction {
  type: typeof SELECT_COMPANY;
  payload: Company;
}

export interface CompanyMineAction {
  type: typeof SET_COMPANY_MINE;
  payload: Company;
  navigationMenu?: NavigationMenu;
  currentEmployeeId?: string;
}

export interface UpdateNavigationMenuItem {
  type: typeof UPDATE_NAVIGATION_ITEM;
  payload: NavigationMenuItem;
  navigationMenu?: NavigationMenu;
  currentEmployeeId?: string;
}

export interface CompanyMineRequest {
  name?: string;
  addresses?: string[];
  acctCodes?: string[];
  helloSignIntegrationEnabled?: boolean;
}

export type SelectCompanyState = Company;

export type NavigationItemType = "LINK" | "MENU" | "CATEGORY";

export interface NavigationItem {
  label: string;
  type: NavigationItemType;
  path?: string;
  menu?: NavigationItem[];
  icon?: string;
  category?: string;
  restrictedToUsersWithTags?: GroupTag[];
  isOpen?: boolean;
}

export interface NavigationMenu {
  id: string;
  menus: NavigationItem[];
}

export interface NavigationMenuItem {
  label: string;
  isOpen: boolean;
}

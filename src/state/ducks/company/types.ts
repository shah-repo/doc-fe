import { ThemeEnv } from "../../../ui/layout/theme/utils/types";
import { GroupTag } from "../auth/types";
import { User } from "../common/types";
import { DocumentType } from "../documentRevisions/documentType/types";
import { AUTOSAVE_CONFIG, REDLINE_CONFIG, SELECT_COMPANY, SET_COMPANY_MINE, UPDATE_NAVIGATION_ITEM } from "./constants";

export interface WhiteLabelingColors {
  defaultBackground: string;
  primary: string;
  primaryContrastText: string;
  secondary: string;
  secondaryContrastText: string;
}

export interface WhiteLabelingEnv {
  logo: string;
  avatar: string;
  colors: WhiteLabelingColors;
}

export interface WhiteLabeling {
  [ThemeEnv.DEV_THEME]?: WhiteLabelingEnv;
  [ThemeEnv.DEMO_THEME]?: WhiteLabelingEnv;
  [ThemeEnv.SANDBOX_THEME]?: WhiteLabelingEnv;
  [ThemeEnv.PRODUCTION_THEME]?: WhiteLabelingEnv;
}

export interface Employee {
  id: string;
  active: boolean;
  company: Company;
  slackUserId: string;
  user?: User;
  dropboxEnabled?: boolean;
}

export interface Company {
  slackIntegrationEnabled: boolean;
  id: string;
  name: string;
  numOfRevStages: number;
  users: User[];
  documentTypes: DocumentType[];
  whiteLabeling: WhiteLabeling;
  helloSignAppId: string;
  helloSignIntegrationEnabled: boolean;
  teamId: string;
  addresses: string[];
  acctCodes: string[];
  navigation: NavigationItem[];
  employees?: Employee[];
  dropboxEnabled?: boolean;
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
  navigation?: NavigationItem[];
  numOfRevStages?: number;
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
  menus: NavigationMenuItem[];
}

export interface NavigationMenuItem {
  label: string;
  isOpen: boolean;
}

export interface AutosaveState {
  autosaveEnabled: boolean;
}

export interface AutosaveAction {
  type: typeof AUTOSAVE_CONFIG;
}

export interface RedlineState {
  redlineActive: boolean;
}

export interface RedlineAction {
  type: typeof REDLINE_CONFIG;
  payload: RedlineState;
}

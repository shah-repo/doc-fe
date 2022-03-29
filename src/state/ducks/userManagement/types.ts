import { Dictionary } from "lodash";
import { Group, GroupTag, GroupType, Permission } from "../auth/types";
import { Id, Nullable, User } from "../common/types";
import { Company, Employee } from "../company/types";
import { COMPANY_GROUPS_LIST, HISTORY_LIST } from "./constants";

export interface GetEmployeeResponse {
  id: string;
  active: boolean;
  groups: Group[];
  user: User;
}

export interface GetSlackUrl {
  url: string;
}

export interface AddEmployeeRequest {
  user: Partial<User>;
  groups: Nullable<Id[]>;
}

export interface LoadCompanyGroup {
  id: string;
  name: string;
  permissions: Permission[];
  defaultForNewUsers: boolean;
  tags: Nullable<GroupTag[]>;
  company: Company;
  employees: Employee[];
  isOfficial: boolean;
  parents: Group[];
  joinedParents: Group[];
  type?: GroupType;
  inEdit?: boolean | string;
}

export interface EmployeeGroupsEditRequestBody {
  groups: Id[];
}

export interface EmployeeActiveStatusRequestBody {
  active: boolean;
}

export type LoadCompanyGroups = LoadCompanyGroup[];

export interface CompanyGroupsListAction {
  type: typeof COMPANY_GROUPS_LIST;
  payload: LoadCompanyGroups;
}

export type GroupsByIdState = Dictionary<LoadCompanyGroup>;

export type GroupsAllIdsState = string[];

export interface ApiTokenData {
  name: string;
}

export interface ApiTokenState {
  id: string;
  secretKey: string;
  name: string;
}

export interface GetApiTokenList {
  id: string;
  name: string;
  active: boolean;
}

// Update Once get Api Response ... Currently Its training
interface History {
  pendingEmailSentAt: Nullable<string>;
  trainingStatus: string;
  docId: string;
  docDocumentId: string;
  docRevName: string;
  docRevVersion: string;
  trainingRecordId?: string;
  docRevId: string;
  id: string;
  type: string;
  timestamp: string;
  pinned: boolean;
  // TODO: Update this
  pendingTrainees?: any[] | undefined;
}
export interface HistoryListAction {
  type: typeof HISTORY_LIST;
  payload: HistoryListApiResponse;
  initialLoad?: boolean;
}
export interface HistoryListApiResponse {
  results: History[];
  page_total: number;
  total: number;
}

export type HistoryState = HistoryListApiResponse;

export enum ACTION_TITLE_MAPPIING {
  AddedToGroups = "AddedToGroups",
  CreatedNewUser = "CreatedNewUser",
  DeactivateUser = "DeactivateUser",
  ActivateUser = "ActivateUser",
  Unknown = "Unknown",
  EmployeeNameUpdated = "EmployeeNameUpdated",
  DeletedFromGroup = "DeletedFromGroup",
}

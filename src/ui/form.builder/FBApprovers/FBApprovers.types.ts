import { FBAutocompleteAsyncProps } from "../FBAutocompleteAsync";
import { FBProviderProps } from "../FBProvider";

export type FBApproversProps =
& Pick<FBProviderProps, "approversState">
& FBAutocompleteAsyncProps
& {
  isIncluded?: (group: FBRequiredApprover) => void;
  groups?: Record<string, FBRequiredApprover>;
  value?: string[];
};

export interface FBEmployee {
  id: string;
  user: FBUser;
}

export interface FBUser {
  id: string;
  email: string;
  name: string;
}

export interface FBGroup {
  id: string;
  employees: FBEmployee[];
}

export interface FBApprover {
  id: string;
  user?: FBUser;
}

export interface FBJoinedEmployee {
  id: string;
  name: string;
}

export type FBRequiredApprover =
& FBJoinedEmployee
& {
  joinedEmployees: FBJoinedEmployee[] | string[];
};

export interface FBApproversConstructor {
  documentRevisions?: string[];
  formValue?: string[];
}

export interface FBApproversBody {
  ids: string[];
}

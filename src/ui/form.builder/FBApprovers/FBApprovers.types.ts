import { FBUser } from "..";
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

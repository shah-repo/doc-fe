import { FBApprovalMatrixFieldState, FBButtonProps, FBInputProps } from "..";
import { Group } from "../../../state/ducks/auth/types";
import { Employee } from "../../../state/ducks/company";
import { FBWorkspaceMode } from "../types/workspace";

export type FBApprovalMatrixFieldProps =
& Pick<FBInputProps, "name" | "disabled" | "autosave">
& {
  handleAdd?: FBButtonProps["onClick"];
  approvalMatrixFieldState?: FBApprovalMatrixFieldState;
  mode?: FBApprovalMatrixFieldMode;
  workspaceMode: FBWorkspaceMode;
};

export interface FBApprovalRole {
  id: string;
  employees: Employee[] | string[];
  groups: Group[] | string[];
  name: string;
  index: number;
}

export interface FBApprovalMatrixDocType {
  id?: string;
  acronym: string;
  name: string;
  defaultTraining: boolean;
  group: string;
  needsSignature: boolean;
  category: string;
}

export interface FBApprovalRolesStages {
  stage1: boolean[];
  stage2: boolean[];
  stage3: boolean[];
  admStage: boolean[];
}

export interface FBApprovalMatrixItem {
  id: string;
  docType: FBApprovalMatrixDocType;
  approvalRoles: FBApprovalRolesStages;
}

export interface FBApprovalMatrixFieldData {
  approvalRoles: FBApprovalRole[];
  approvalMatrix: FBApprovalMatrixItem[];
}

export type FBApprovalMatrixFieldMode = "none" | "add" | "edit" | "fullscreen";

export interface FBApprovalMatrixConstructor {
  formValue?: FBApprovalMatrixFieldData;
  outputRevision?: boolean;
  isOutput?: boolean;
}

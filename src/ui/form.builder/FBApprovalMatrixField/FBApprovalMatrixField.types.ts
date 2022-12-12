import { FBApprovalMatrixFieldState, FBButtonProps, FBInputProps } from "..";
import { FBWorkspaceMode } from "../types/workspace";

export type FBApprovalMatrixFieldProps =
& Pick<FBInputProps, "name" | "disabled" | "autosave" | "type">
& {
  handleAdd?: FBButtonProps["onClick"];
  approvalMatrixFieldState?: FBApprovalMatrixFieldState;
  mode?: FBApprovalMatrixFieldMode;
  workspaceMode: FBWorkspaceMode;
};

export interface FBApprovalRole {
  id: string;
  employees: any[];
  groups: any[];
  name: string;
  index: number;
}

interface FBApprovalMatrixDocType {
  id?: string;
  acronym: string;
  name: string;
  defaultTraining: boolean;
  group: string;
  needsSignature: boolean;
  category: string;
}

interface FBApprovalRolesStages {
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

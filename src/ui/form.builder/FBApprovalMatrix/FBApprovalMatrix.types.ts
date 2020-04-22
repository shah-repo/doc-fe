import { Employee } from "../../../state/ducks/company";
import { FBInputProps } from "../types/common";
import FBApprovalMatrixState from "./FBApprovalMatrix.state";

export interface ApprovalMatrix {
  approvalRoles: ApprovalRole[];
  approvalMatrix: ApprovalMatrixItem[];
}

export interface ApprovalRole {
  id: string;
  employees: Employee[];
  groups: Group[];
  name: string;
  index: number;
}

export interface Group {
  name: string;
  id: string;
}

export interface ApprovalMatrixItem {
  id: string;
  docType: DocType;
  approvalRoles: ApprovalRolesStages;
}

export interface DocType {
  id?: string;
  acronym: string;
  name: string;
  defaultTraining: boolean;
  group: string;
}

export interface ApprovalRolesStages {
  stage1: boolean[];
  stage2: boolean[];
  stage3: boolean[];
  admStage: boolean[];
}

export type FBApprovalMatrixBasicProps = Pick<FBInputProps, "name" | "disabled">;

export type FBApprovalMatrixFieldProps =
& FBApprovalMatrixBasicProps
& {
  amState: FBApprovalMatrixState;
};

export type FBApprovalMatrixTableProps =
& FBApprovalMatrixBasicProps
& {
  approvalRoles: ApprovalRole[];
  approvalMatrix: ApprovalMatrixItem[];
  handleEditDefaultTraining: (index: number, item: boolean) => () => void;
  handleEdit: (index: number, item: boolean, stage: string, indexItem: number) => () => void;
  handleAdd: () => void;
  cancelAddMode: () => void;
  handleAddRoleItems: (index: number, item: string, type: string) => void;
  addMode: boolean;
  handleSaveChanges: () => void;
  errorMessage: string;
  handleEditRoleDetails: (e: string, index: number, type: string) => void;
  addAnotherRole: () => void;
  handleSaveRole: (dialog) => void;
  handleCancelDialogRole: () => void;
  disabled: boolean;
} & Pick<FBInputProps, "disabled">;


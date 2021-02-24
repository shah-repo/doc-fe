import { FBInputProps } from "..";
import { Group } from "../../../state/ducks/auth/types";
import { Employee } from "../../../state/ducks/company/types";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
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

export interface ApprovalMatrixItem {
  id: string;
  docType: DocType;
  approvalRoles: ApprovalRolesStages;
}

interface DocType {
  id?: string;
  acronym: string;
  name: string;
  defaultTraining: boolean;
  group: string;
}

interface ApprovalRolesStages {
  stage1: boolean[];
  stage2: boolean[];
  stage3: boolean[];
  admStage: boolean[];
}

type FBApprovalMatrixBasicProps = Pick<FBInputProps, "name" | "disabled">;

export type FBApprovalMatrixFieldProps =
& FBApprovalMatrixBasicProps
& {
  amState: FBApprovalMatrixState;
};

interface Dialog {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

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
  handleSaveRole: (dialog: Dialog) => void;
  handleCancelDialogRole: () => void;
  disabled: boolean;
} & Pick<FBInputProps, "disabled">;

export interface FBApprovalMatrixFieldUIProps {
  approvalRoles: ApprovalRole[];
  addAnotherRole: () => void;
  handleEditRoleDetails: (e: string, index: number, type: string) => void;
  handleSaveRole: (dialog: Dialog) => void;
  handleCancelDialogRole: () => void;
  errorMessage: string;
  disabled: boolean;
  dialog: Dialog;
  toggleEditMode: (boolean) => void;
  editMode: boolean;
  addMode: boolean;
  data: any[];
  columns: any[];
  readInputValue: (event: string, header: string, index: number) => void;
  readSelectValue: (event: string, index: number) => void;
  handleAdd: () => void;
  handleSaveChanges: () => void;
  cancelAddMode: () => void;
}

export interface ApprovalRolesPresenterProps {
  name: string;
  groups: Group[];
  employees: Employee[];
  groupOptions: OptionType[];
  employeeOptions: GetEmployeeResponse[];
  isWithoutBorder: boolean;
  handleEditRoleDetails: (e, index, type) => void;
  index?: number;
  isDisabled: boolean;
  disabledSelectField?: boolean;
}

export interface AddRoleDialogProps {
  activeEmployees: GetEmployeeResponse[];
  groupOptions: OptionType[];
  onSave: (dialog) => void;
  handleEditRoleDetails: (e, index, type) => void;
  isDisabled: boolean;
  addAnotherRole: () => void;
  approvalRoles: ApprovalRole[];
  handleCancelDialogRole: () => void;
  errorMessage: string;
  disabled: boolean;
}

export interface ApprovalRolesProps {
  approvalRoles: ApprovalRole[];
  handleEditRoleDetails: (e, index, type) => void;
  addAnotherRole: () => void;
  handleSaveRole: (dialog) => void;
  handleCancelDialogRole: () => void;
  errorMessage: string;
  disabled: boolean;
}

export interface ApprovalRolesContainerProps {
  activeEmployees: GetEmployeeResponse[];
  groupOptions: OptionType[];
  approvalRoles: ApprovalRole[];
  handleEditRoleDetails: (e, index, type) => void;
  isDisabled: boolean;
  disabledSelectField: boolean;
}

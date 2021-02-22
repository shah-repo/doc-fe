import { ButtonProps } from "@material-ui/core";
import { Dictionary } from "lodash";
import { FBDialogState, FBFormProps, FBFormState, FBInputProps, FBPOApprovalMatrixState } from "..";
import { Group } from "../../../state/ducks/auth";
import { Employee } from "../../../state/ducks/company";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

type FBPOApprovalMatrixBasicProps = Pick<FBInputProps, "name" | "disabled" | "label" | "autosave" | "isInputOwner">;

export type FBPOApprovalMatrixFieldProps =
& FBPOApprovalMatrixBasicProps
& {
  poamState: FBPOApprovalMatrixState;
  dialogState?: FBDialogState;
  handleAdd?: () => any;
  handleRevert?: () => any;
};

export type FBPOApprovalMatrixDialogProps =
& FBPOApprovalMatrixBasicProps
& {
  isDialogOpen: boolean;
  initialValues?: Dictionary<any>;
  onSubmit: (item: any) => void;
  closeDialog: () => void;
  groupOptions: OptionType[];
  employees: GetEmployeeResponse[];
  signatureStages: number[];
};

export type FBPOApprovalMatrixFormProps =
& Pick<FBFormProps, "initialValues">
& Pick<FBPOApprovalMatrixDialogProps, "signatureStages">;

// export type FBPOApprovalMatrixFormProps =
// & FBPOApprovalMatrixBasicProps
// & Pick<FBPOApprovalMatrixDialogProps, "initialValues" |
// "onSubmit" | "closeDialog" | "groupOptions" | "employees" | "signatureStages">
// & {
//   validateForm?: (values: any) => void;
// };

export type FBPOApprovalMatrixAddItemProps =
& FBPOApprovalMatrixBasicProps
& Pick<FBPOApprovalMatrixDialogProps,
"onSubmit" | "closeDialog" | "isDialogOpen" | "employees" | "groupOptions" | "signatureStages">
& {
  openDialog: () => void;
};


export type FBPOApprovalMatrixTableProps =
& FBPOApprovalMatrixBasicProps
& Pick<FBPOApprovalMatrixDialogProps, "onSubmit" |
"closeDialog" | "isDialogOpen" | "initialValues" | "groupOptions" | "employees" | "signatureStages">
& {
  approvalLevels?: POApprovalMatrixLevel[];
  handleEdit: (index: number, item: POApprovalMatrixLevel) => () => void;
  isDocumentReleased: boolean;
  groups?: Map<string, Group>;
  employees?: Map<string, Employee>;
};

export interface POApprovalMatrix {
  approvalLevels: POApprovalMatrixLevel[];
}

export interface POApprovalMatrixLevel {
  id: string;
  name: string;
  limit: number;
  signatures: Signature[];
}

export interface Signature {
  id: string;
  signatureStage: number;
  groups: Group[];
  employees: Employee[];
}

export type FBPOApprovalMatrixFormActionsProps =
& {
  handleAdd?: ButtonProps["onClick"];
  handleCancel?: ButtonProps["onClick"];
};

export interface FBPOApprovalMatrixConstructor {
  formState?: FBFormState;
  approvalLevels?: POApprovalMatrixLevel[];
  outputRevision?: boolean;
  isOutput?: boolean;
}


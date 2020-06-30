import { BoxProps } from "@material-ui/core";
import { FBDialogState, FBFormProps, FBInputProps, FBSchemaProps, FBTaskState } from "..";
import { Employee } from "../../../state/ducks/company";
import { FBTaskFieldState } from "../FBTaskField/FBTaskField.state";

export type FBTaskItemType = "CR_IMPLEMENTATION_PLAN" | "GENERIC";

export type FBTaskItemStatus = "DRAFT" | "PENDING" | "DONE" | "ABANDONED";

export interface FBTaskItem {
  id?: string;
  descriptionSchema: FBSchemaProps[];
  descriptionInput: Record<string, any>;
  closingNoteSchema: FBSchemaProps[];
  closingNoteInput: Record<string, any>;
  assigned: Partial<Employee>;
  type: FBTaskItemType;
  dueDate: string;
  fieldId: string;
  status?: FBTaskItemStatus;
  partOf: {
    id: string;
  };
}

export type FBTaskProps =
& Pick<FBInputProps, "name" | "label" | "disabled">
& {
  onClick?: (id?: string) => any;
  taskState?: FBTaskState;
  dialogState?: FBDialogState;
  tasks?: FBTaskItem[];
  loading?: boolean;
};

export type FBTaskFormProps =
& Pick<FBInputProps, "name">
& Pick<FBFormProps, "formState" | "children" | "initialValues">
& {
  handleAdd?: () => any;
  handleCancel?: () => any;
};

export type FBTaskFieldProps =
& Pick<FBTaskProps, "onClick">
& Pick<BoxProps, "onMouseOver" | "onMouseLeave">
& {
  getApprover?: (task?: FBTaskItem) => any;
  handleRemoveTask?: (task?: FBTaskItem) => any;
  taskFieldState?: FBTaskFieldState;
  task: FBTaskItem;
  visibility?: "visible" | "hidden";
};

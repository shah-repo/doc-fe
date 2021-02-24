import { BoxProps } from "@material-ui/core";
import { FBDialogState, FBFormProps, FBInputProps, FBSchemaComponentProps, FBSchemaProps, FBTaskFieldState, FBTaskState, FBVisibilityType } from "..";
import { Attachment } from "../../../state/ducks/attachments/types";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { Employee } from "../../../state/ducks/company/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

export type FBTaskItemType = "CR_IMPLEMENTATION_PLAN" | "GENERIC";
export type FBTaskItemStatus = "DRAFT" | "PENDING" | "DONE" | "ABANDONED";
export type FBTaskActionMode = "description" | "note";

export interface FBTaskItem {
  id?: string;
  descriptionSchema: FBSchemaProps[];
  descriptionInput: Record<string, any>;
  closingNoteSchema: FBSchemaProps[];
  closingNoteInput: Record<string, any>;
  assigned: Partial<Employee>;
  type?: FBTaskItemType;
  dueDate: string;
  fieldId: string;
  status?: FBTaskItemStatus;
  attachments?: Attachment[];
  partOf?: Partial<DocumentRevision> | Partial<ChangeRequest>;
}

export type FBClosingNoteProps = Pick<FBTaskItem, "id" | "closingNoteInput" | "attachments">;

export type FBTaskProps =
& Pick<FBInputProps, "name" | "label" | "disabled">
& {
  onClick?: (id?: string) => any;
  taskState?: FBTaskState;
  dialogState?: FBDialogState;
  tasks?: FBTaskItem[];
  loading?: boolean;
  canAddTask?: boolean;
};

export type FBTaskFormProps =
& Pick<FBInputProps, "name">
& Pick<FBFormProps, "formState" | "children" | "initialValues">
& Pick<FBSchemaComponentProps, "schema">
& {
  handleAdd?: () => any;
  handleCancel?: () => any;
  actionMode?: FBTaskActionMode;
};

export type FBTaskFieldProps =
& Pick<FBTaskProps, "onClick">
& Pick<BoxProps, "onMouseOver" | "onMouseLeave">
& {
  handleRemoveTask?: (task?: FBTaskItem) => any;
  handleClosingNote?: () => any;
  taskFieldState?: FBTaskFieldState;
  task: FBTaskItem;
  visibility?: FBVisibilityType;
  canBeDone?: boolean;
};

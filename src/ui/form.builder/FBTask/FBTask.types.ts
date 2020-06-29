import { FBDialogState, FBFormProps, FBInputProps, FBTaskState } from "..";

export interface FBTaskItem {
  id: string;
  index: number;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
}

export type FBTaskProps =
& FBInputProps
& {
  onClick?: (index?: number) => any;
  getApprover?: (id: string) => any;
  taskState?: FBTaskState;
  dialogState?: FBDialogState;
  tasks?: FBTaskItem[];
};

export type FBTaskFormProps =
& Pick<FBFormProps, "formState" | "children" | "initialValues">
& {
  handleAdd?: () => any;
  handleCancel?: () => any;
  index?: number;
};

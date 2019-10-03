import { BoxProps } from "@material-ui/core/Box";
import { FBDialogInjectedProps, FBDialogProps } from "./dialog";

export interface FBEditorDialogProps extends FBDialogProps {
  handleClick: () => any;
}

export type FBEditorDialogInjectedProps = Pick<FBEditorDialogProps, "handleClick">;

export interface FBEditorWrapperInjectedProps {
  editField: () => any;
  removeField: () => any;
}

export interface FBEditorWrapperProps extends
BoxProps,
FBEditorWrapperInjectedProps {
  index: number;
}

export type FBEditorSectionType = "section" | "basicFields" | "lists";
export type FBEditorElementType =
  "textfield" | "checkbox" | "checkboxgroup";

export interface FBEditorSectionInjectedProps {
  generateSections: () => any;
}

export type FBEditorSectionProps = FBEditorSectionInjectedProps & FBDialogProps;

export interface FBEditorFormProps extends Partial<FBDialogInjectedProps> {
  type: FBEditorElementType;
}

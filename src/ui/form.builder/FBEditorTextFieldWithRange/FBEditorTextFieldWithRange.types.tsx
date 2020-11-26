import { FBFormProps } from "..";

export type FBEditorTextFieldWithRangeProps =
& Pick<FBFormProps, "formState">
& {
  isRangeVisible: boolean;
  isInspectionVisible: boolean;
};

import { FBFormProps, FBOption } from "..";

export type FBEditorTextFieldWithRangeProps =
& Pick<FBFormProps, "formState">
& {
  isRangeVisible: boolean;
  isInspectionVisible: boolean;
  isPassValueVisible: boolean;
  aqlOptions: FBOption[];
};

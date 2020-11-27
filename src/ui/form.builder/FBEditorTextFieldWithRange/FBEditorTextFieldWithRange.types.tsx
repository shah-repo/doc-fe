import { FBEditorProps, FBFormProps, FBOption } from "..";

export type FBEditorTextFieldWithRangeProps =
& FBEditorProps
& Pick<FBFormProps, "formState">
& {
  isRangeVisible: boolean;
  isInspectionVisible: boolean;
  isPassValueVisible: boolean;
  aqlOptions: FBOption[];
};

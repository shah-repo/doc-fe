import { FBControlPickerState, FBEditorHelperProps, FBInputProps, FBInputType } from "..";

export type FBControlPickerProps =
& FBEditorHelperProps
& Pick<FBInputProps, "index">
& {
  controlPickerState?: FBControlPickerState;
  pickers?: FBControlPickerDataProps;
};

export type FBControlPickerType =
| "section"
| "inputs"
| "approvals"
| "customcontrols"
| "buttons"
| "instructions"
| "actions";

export type FBControlPickerDataProps = Partial<Record<FBControlPickerType, FBInputType[]>>;

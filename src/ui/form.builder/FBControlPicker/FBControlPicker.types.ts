import { FBControlPickerState, FBInputProps, FBInputType } from "..";
import { FBEditorHelperProps } from "../FBEditor";

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

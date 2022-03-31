import { FBControlPickerState, FBEditorHelperProps, FBInputProps, FBInputType } from "..";

export type FBControlPickerProps =
& FBEditorHelperProps
& Pick<FBInputProps, "index">
& {
  controlPickerState?: FBControlPickerState;
  pickers?: FBControlPickerDataProps;
};

type FBControlPickerType =
| "section"
| "inputs"
| "approvals"
| "customcontrols"
| "buttons"
| "instructions"
| "actions"
| "favourites";

export interface FBFavouritesBody {
  fbComponent: string;
}
export type FBControlPickerDataProps = Partial<Record<FBControlPickerType, FBInputType[]>>;

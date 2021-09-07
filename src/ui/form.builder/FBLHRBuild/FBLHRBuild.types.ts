import { FBProviderProps, FBRadioGroupProps } from "..";
import { SMDialogHOCProps, SMDialogProps } from "../../../App";

export type FBLHRBuildProps =
& FBRadioGroupProps
& SMDialogHOCProps
& Pick<FBProviderProps, "lhrBuildState">
& Pick<SMDialogProps, "onDialogActionClick">;

export type FBLHRBuildOption = "R&D" | "Production";

export interface FBLHRBuildConstructor {
  value?: string;
  disabled?: boolean;
}

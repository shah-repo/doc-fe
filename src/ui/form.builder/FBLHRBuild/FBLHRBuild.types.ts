import { FBProviderProps, FBRadioGroupProps } from "..";
import { SMDialogHOCProps, SMDialogProps } from "../../../App";

export type FBLHRBuildProps =
& FBRadioGroupProps
& SMDialogHOCProps
& Pick<FBProviderProps, "lhrBuildState">
& Pick<SMDialogProps, "onDialogActionClick">;

export interface FBLHRBuildConstructor {
  value?: string;
  disabled?: boolean;
}

export enum FBLHRBuildOptions {
  "R&D" = "R&D",
  Production = "Production"
}

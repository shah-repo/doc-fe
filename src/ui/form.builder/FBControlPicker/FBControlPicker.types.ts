import { FBInputProps, FBInputType } from "..";
import { FBEditorHelperProps } from "../FBEditor";

export type FBControlPickerProps =
& FBEditorHelperProps
& Pick<FBInputProps, "index">;

export type FBControlPickerType = "section" | "inputs" | "approvals" | "buttons" | "instructions" | "actions";
export type FBControlPickerDataProps = Record<FBControlPickerType, FBInputType[]>;

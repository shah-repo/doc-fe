import { FBInputType } from "..";
import { FBEditorHelperProps } from "../FBEditor";

export type FBControlPickerProps = FBEditorHelperProps;

export type FBControlPickerType = "section" | "inputs" | "approvals" | "buttons" | "instructions" | "actions";
export type FBControlPickerDataProps = Record<FBControlPickerType, FBInputType[]>;

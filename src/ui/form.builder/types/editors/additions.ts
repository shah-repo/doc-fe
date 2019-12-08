import { FBInputProps } from "../common";

export type FBAdditionEditorType =
    | "autocomplete"
    | "select"
    | "control"
    | "controlgroup"
    | "radio";

export type FBAdditionEditorProps = Pick<FBInputProps, "type" | "contextLabel">;

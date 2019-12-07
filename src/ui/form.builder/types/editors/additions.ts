export type FBAdditionEditorType =
    | "autocomplete"
    | "select"
    | "control"
    | "controlgroup"
    | "radio";

export interface FBAdditionEditorProps {
    type: FBAdditionEditorType;
}
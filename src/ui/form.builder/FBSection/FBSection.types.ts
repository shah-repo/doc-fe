import { FBFormProps, FBInputProps } from "..";

export type FBSectionProps =
& Pick<FBInputProps, "label" | "gutter" | "stepIndex">
& Pick<FBFormProps, "children">;

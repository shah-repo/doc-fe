import { FBFormProps, FBInputProps } from "..";

export type FBSectionProps =
& Pick<FBInputProps, "label" | "gutter" | "stepIndex" | "bookmarked" | "name" | "index" | "loading">
& Pick<FBFormProps, "children">;

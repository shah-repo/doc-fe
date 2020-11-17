import { FBFormProps, FBInputProps } from "..";

export type FBSectionProps =
& FBInputProps
& Pick<FBFormProps, "children">;

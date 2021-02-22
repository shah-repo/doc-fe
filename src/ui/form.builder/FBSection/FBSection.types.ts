import { FBFormProps, FBInputProps, FBInputType } from "..";

export const FBSectionTypes: FBInputType[] = [
  "section",
  "stepsection",
  "teststep",
];

export type FBSectionProps =
& FBInputProps
& Pick<FBFormProps, "children">;

import { FBFormProps, FBInputProps } from "..";
import { FBInputType } from "../FBInput";

export const FBSectionTypes: FBInputType[] = [
  "section",
  "stepsection",
  "teststep",
];

export type FBSectionProps =
& FBInputProps
& Pick<FBFormProps, "children">;

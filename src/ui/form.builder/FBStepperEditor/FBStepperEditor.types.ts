import { StepProps } from "@material-ui/core";
import { FBStepperProps } from "..";

export type FBStepperEditorProps =
  & Pick<StepProps, "children">
  & Pick<FBStepperProps, "config" | "beforeStepChange">;

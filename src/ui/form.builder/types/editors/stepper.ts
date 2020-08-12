import { StepProps } from "@material-ui/core/Step/Step";
import { StepperProps } from "@material-ui/core/Stepper/Stepper";

export type FBEditorStepperProps =
    & Pick<StepProps, "children">
    & Pick<StepperProps, "activeStep">
    & {
      getStepContent?: (step: number) => void;
      steps?: React.ReactNode[];
      stepContent?: React.ReactNode;
    };

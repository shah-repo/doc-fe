
import React from "react";
import { FBStepperProps } from "../../types/common/stepper";

export const withStepper = <T extends FBStepperProps>(
  Component: React.FunctionComponent<T>,
) => {
  return ({
    steps,
    ...props
  }: T) => {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleStep = (step: number) => () => {
      setActiveStep(step);
    };

    return Component({
      ...(props as T),
      steps,
      activeStep,
      handleStep,
    });
  };
};

import { Step, StepButton } from "@material-ui/core";
import React from "react";
import FBValidator from "../../components/validation/FBValidator";
import { FBEditorStepperProps } from "../../types/editors/stepper";

export const withStepperEditor = <T extends FBEditorStepperProps>(
  Component: React.FunctionComponent<T>,
) => {
  return (props: T) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const stepLabels = ["Field config", "Validation"];
    const getStepContent = (step: number): React.ReactNode => {
      switch (step) {
        case 0:
          return props.children;
        case 1:
          return <FBValidator />;
        default:
          return "";
      }
    };

    const handleStep = (step: number) => () => {
      setActiveStep(step);
    };

    const steps = (): React.ReactNode[] =>
      stepLabels.map((label, index) => (
        <Step style={{ padding: 0 }} key={`step-${index}-${label}`}>
          <StepButton onClick={handleStep(index)}>{label}</StepButton>
        </Step>
      ));

    return Component({
      ...props,
      getStepContent,
      stepContent: getStepContent(activeStep),
      steps: steps(),
    });
  };
};

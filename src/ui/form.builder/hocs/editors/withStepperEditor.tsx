import { Step, StepButton } from "@material-ui/core";
import React from "react";
import FBValidatorForm from "../../components/validation/FBValidatorForm";
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
          return <FBValidatorForm />;
        default:
          return "";
      }
    };

    const handleStep = (step: number) => () => {
      setActiveStep(step);
    };

    const steps = (): React.ReactNode[] =>
      stepLabels.map((label, index) => (
        <Step
          key={`step-${index}-${label}`}
          style={{ padding: 0 }}
        >
          <StepButton onClick={handleStep(index)}>
            {label}
          </StepButton>
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

import { BottomNavigation, BottomNavigationAction, Box, Step, StepButton } from "@material-ui/core";
import React from "react";
import FBValidatorCustom from "../../components/validation/FBValidatorCustom";
import FBValidatorForm from "../../components/validation/FBValidatorForm";
import editorStore from "../../stores/ui/FBEditorStore";
import { FBEditorStepperProps } from "../../types/editors/stepper";

export const withStepperEditor = <T extends FBEditorStepperProps>(
  Component: React.FunctionComponent<T>,
) => (props: T) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [value, setValue] = React.useState(0);
  const stepLabels = ["Field config", "Validation"];
  const getStepContent = (step: number): React.ReactNode => {
    switch (step) {
      case 0:
        editorStore.maxWidth = "sm";
        return props.children;
      case 1:
        editorStore.maxWidth = "lg";
        return (
          <Box>
            <BottomNavigation
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              showLabels
            >
              <BottomNavigationAction label="Validators" />
              <BottomNavigationAction label="Custom Validators" />
            </BottomNavigation>
            <Box mt={1} py={2}>
              {value === 0 && <FBValidatorForm />}
              {value === 1 && <FBValidatorCustom />}
            </Box>
          </Box>
        );
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

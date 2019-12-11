import Box from "@material-ui/core/Box/Box";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton/StepButton";
import Stepper from "@material-ui/core/Stepper";
import React from "react";
import { withStepper } from "../../hocs/common/withStepper";
import { FBStepperProps } from "../../types/common/stepper";

const FBStepper: React.FunctionComponent<FBStepperProps> = ({
  steps,
  activeStep = 0,
  handleStep,
  getStepContent,
}) => (
  <Box>
    {getStepContent(activeStep)}
    <Stepper nonLinear activeStep={activeStep}>
      {steps.map((label, index) => (
        <Step key={label}>
          <StepButton onClick={handleStep && handleStep(index)}>
            {label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  </Box>
);

export default withStepper(FBStepper);

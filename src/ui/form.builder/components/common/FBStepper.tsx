import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton/StepButton';
import Box from '@material-ui/core/Box/Box';
import _ from 'lodash';
import { FBStepperProps } from '../../types/common/stepper';
import { withStepper } from '../../hocs/common/withStepper';

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

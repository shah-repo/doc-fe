import {
  Box,
  Step,
  StepLabel,
  Stepper,
} from '@material-ui/core';
import React from 'react';
import useStyles, { StepperConnector } from './styles';

interface StepsProps {
  activeStep: number
  steps: string[]
}

const Steps: React.FC<StepsProps> = ({ activeStep, steps }) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Stepper activeStep={activeStep} alternativeLabel connector={<StepperConnector />} className={classes.customStepper}>
        {steps.map((label) => (
          <Step key={label} className={classes.step}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ),
        )}
      </Stepper>
    </Box>
  );
};

export default Steps;

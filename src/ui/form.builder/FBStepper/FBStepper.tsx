import { Box } from "@material-ui/core";
import Stepper from "@material-ui/core/Stepper";
import React from "react";
import { FBStepperProps, FBStepperWidth } from "..";
import { withFBStepper } from "./FBStepper.wrap";

const FBStepper: React.FunctionComponent<FBStepperProps> = ({
  width = FBStepperWidth.default,
  activeStep = 0,
  steps,
  content,
}) => (
  <Box>
    <Box display="flex" justifyContent="center" mb={2}>
      <Box {...{ width }}>
        <Stepper nonLinear {...{ activeStep }}>
          {steps}
        </Stepper>
      </Box>
    </Box>
    {content}
  </Box>
);

export default withFBStepper(FBStepper);

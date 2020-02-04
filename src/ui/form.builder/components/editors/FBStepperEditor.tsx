import { Box, Stepper } from "@material-ui/core";
import React from "react";
import { withStepperEditor } from "../../hocs/editors/withStepperEditor";
import { FBEditorStepperProps } from "../../types/editors/stepper";

const FBStepperEditor: React.FunctionComponent<FBEditorStepperProps> = ({
  stepContent,
  activeStep,
  steps,
}) => (
  <Box pb={6}>
    {stepContent}
    <Stepper style={{ padding: 0 }} nonLinear activeStep={activeStep}>
      {steps}
    </Stepper>
  </Box>
);

export default withStepperEditor(FBStepperEditor);

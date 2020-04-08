import React from "react";
import { FBSection } from "..";
import { FBTestStepProps } from "./FBTestStep.types";
import { withFBTestStep } from "./FBTestStep.wrap";

const FBTestStep: React.FunctionComponent<FBTestStepProps> = ({
  label,
  schema,
}) => (
  <>
    <FBSection {...{ label }} />
  </>
);

export default withFBTestStep(FBTestStep);

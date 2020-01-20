import React from "react";
import FBCheckboxGroup from "../components/inputs/FBCheckboxGroup";
import { withFBValidationMode } from "./FBValidationMode.wrap";
import { FBValidationModeProps } from ".";

const FBValidationMode: React.FunctionComponent<FBValidationModeProps> = ({
  options,
}) => (
  <FBCheckboxGroup
    name="validationMode"
    row={false}
    {...{ options }}
  />
);

export default withFBValidationMode(FBValidationMode);

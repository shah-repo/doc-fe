import React from "react";
import { FBValidationModeProps } from "..";
import FBCheckboxGroup from "../components/inputs/FBCheckboxGroup";
import { withFBValidationMode } from "./FBValidationMode.wrap";

const FBValidationMode: React.FunctionComponent<FBValidationModeProps> = ({
  options,
}) => <FBCheckboxGroup name="validationMode" row={false} {...{ options }} />;

export default withFBValidationMode(FBValidationMode);

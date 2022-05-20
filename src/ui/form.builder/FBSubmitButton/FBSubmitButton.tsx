import React from "react";
import { FBButtonProps } from "..";
import FBButton from "../FBButton/FBButton";
import { withFBSubmitButton } from "./FBSubmitButton.wrap";

const FBSubmitButton: React.FunctionComponent<FBButtonProps> = ({
  onClick,
  ...props
}) => (
  <FBButton {...props} {...{ onClick }} />
);

export default withFBSubmitButton(FBSubmitButton);

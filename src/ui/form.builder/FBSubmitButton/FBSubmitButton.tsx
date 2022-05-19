import React from "react";
import { FBButtonProps } from "..";
import { StyledSubmitFBButton } from "../FBButton/StyledSubmitFBButton";
import { withFBSubmitButton } from "./FBSubmitButton.wrap";

const FBSubmitButton: React.FunctionComponent<FBButtonProps> = ({
  onClick,
  ...props
}) => (
  <StyledSubmitFBButton {...props} {...{ onClick }} />
);

export default withFBSubmitButton(FBSubmitButton);

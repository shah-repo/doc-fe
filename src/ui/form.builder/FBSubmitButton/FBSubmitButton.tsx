import React from 'react';
import { FBButton, FBButtonProps } from '..';
import { withFBSubmitButton } from './FBSubmitButton.wrap';

const FBSubmitButton: React.FunctionComponent<FBButtonProps> = ({
  onClick,
  ...props
}) => (
  <FBButton {...props} {...{ onClick }} />
);

export default withFBSubmitButton(FBSubmitButton);

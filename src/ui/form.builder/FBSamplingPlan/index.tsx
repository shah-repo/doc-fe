import React from 'react';
import { FBInput, FBInputProps } from '..';

const FBSamplingPlan: React.FC<FBInputProps> = ({
  name = '',
  label = '',
  ...props
}) => {
  return (
    <FBInput {...props} name={name}>
      <div>Sampling</div>
    </FBInput>
  );
};

export default FBSamplingPlan;

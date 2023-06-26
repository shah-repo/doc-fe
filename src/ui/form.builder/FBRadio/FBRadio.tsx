import { FormControlLabel, Radio } from '@material-ui/core';
import React from 'react';
import { FBInput, FBInputProps } from '..';
import Text from '../../components/Text';
import { withFBCheckbox } from '../FBCheckbox/FBCheckbox.wrap';

const FBRadio: React.FunctionComponent<FBInputProps> = ({
  label,
  disabled,
  defaultChecked,
  ...props
}) =>  (
  <FBInput {...props} {...{ disabled, label }} type="radio">
    <FormControlLabel
      control={<Radio {...{ disabled, defaultChecked }} />}
      label={<Text message={label as string} />}
    />
  </FBInput>
);

export default withFBCheckbox(FBRadio);

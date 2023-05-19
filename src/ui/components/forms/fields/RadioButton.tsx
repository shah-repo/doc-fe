import {
  FormControlLabel,
  Radio as MuiRadio,
} from '@material-ui/core';
import { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import { RadioProps as MuiRadioProps } from '@material-ui/core/Radio';
import * as React from 'react';
import { ReactComponent as CheckedRadioIcon } from '../../../../assets/images/radio.svg';
import { ReactComponent as UnCheckedRadioIcon } from '../../../../assets/images/unchecked_radio.svg';

interface RadioButtonOwnProps extends Pick<FormControlLabelProps, Exclude<keyof FormControlLabelProps, 'control'>> {
  radioButton?: MuiRadioProps;
}

type RadioButtonProps = RadioButtonOwnProps;

const RadioButton: React.FunctionComponent<RadioButtonProps> = ({ radioButton, ...formControlLabelProps }) => (
  <FormControlLabel
    control={<MuiRadio disableTouchRipple color="primary" icon={<UnCheckedRadioIcon />}
      checkedIcon={<CheckedRadioIcon />} {...radioButton} />}
    {...formControlLabelProps}
  />
);

export default RadioButton;

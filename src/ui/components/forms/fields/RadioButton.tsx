import {
  FormControlLabel,
  Radio as MuiRadio,
} from '@material-ui/core';
import { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import { RadioProps as MuiRadioProps } from '@material-ui/core/Radio';
import * as React from 'react';
import { ReactComponent as CheckedRadioIcon } from '../../../../assets/images/radio.svg';
import { ReactComponent as DisabledCheckedRadioIcon } from '../../../../assets/images/radio_checked_disabled.svg';
import { ReactComponent as UnCheckedRadioIcon } from '../../../../assets/images/unchecked_radio.svg';
import { ReactComponent as DisabledUnCheckedRadioIcon } from '../../../../assets/images/unchecked_radio_disabled.svg';

interface RadioButtonOwnProps extends Pick<FormControlLabelProps, Exclude<keyof FormControlLabelProps, 'control'>> {
  radioButton?: MuiRadioProps
}

type RadioButtonProps = RadioButtonOwnProps;

const RadioButton: React.FC<RadioButtonProps> = ({ radioButton, disabled, ...formControlLabelProps }) => (
  <FormControlLabel
    control={
      <MuiRadio
        disableTouchRipple
        color="primary"
        disabled={disabled}
        icon={disabled ? <DisabledUnCheckedRadioIcon /> : <UnCheckedRadioIcon />}
        checkedIcon={disabled ? <DisabledCheckedRadioIcon /> : <CheckedRadioIcon />}
        {...radioButton}
      />
    }
    {...formControlLabelProps}
  />
);

export default RadioButton;

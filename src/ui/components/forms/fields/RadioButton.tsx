import {
  FormControlLabel,
  Radio as MuiRadio,
} from "@material-ui/core";
import { FormControlLabelProps } from "@material-ui/core/FormControlLabel";
import { RadioProps as MuiRadioProps } from "@material-ui/core/Radio";
import * as React from "react";

interface RadioButtonOwnProps extends Pick<FormControlLabelProps, Exclude<keyof FormControlLabelProps, "control">> {
  radioButton?: MuiRadioProps;
}

type RadioButtonProps = RadioButtonOwnProps;

const RadioButton: React.FunctionComponent<RadioButtonProps> = ({ radioButton, ...formControlLabelProps }) => (
  <FormControlLabel
    control={<MuiRadio color="primary" {...radioButton} />}
    {...formControlLabelProps}
  />
);

export default RadioButton;

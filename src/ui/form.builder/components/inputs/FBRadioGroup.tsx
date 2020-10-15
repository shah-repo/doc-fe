import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import { get, map } from "lodash";
import React from "react";
import Text from "../../../components/Text";
import { withOptions } from "../../hocs/common/withOptions";
import { FBCheckGroupProps } from "../../types/inputs/check";
import FBInput from "../common/FBInput";

const FBRadioGroup: React.FunctionComponent<FBCheckGroupProps> = ({
  row = true,
  type = "radiogroup",
  options,
  optionValueKey = "value",
  optionLabelKey = "text",
  ...props
}) => (
  <FBInput {...props} {...{ type }}>
    <RadioGroup row={row}>
      {map(options, (option, index) => (
        <FormControlLabel
          key={`${get(option, optionValueKey)}-${index}`}
          value={get(option, optionValueKey)}
          control={<Radio disabled={props.disabled} />}
          label={<Text message={get(option, optionLabelKey)} />}
        />
      ))}
    </RadioGroup>
  </FBInput>
);

export default withOptions(FBRadioGroup);

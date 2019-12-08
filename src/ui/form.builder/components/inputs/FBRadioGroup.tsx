import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import Text from "../../../components/Text";
import { FBCheckGroupProps } from "../../types/inputs/check";
import FBInput from "../common/FBInput";
import { withOptions } from "../../hocs/common/withOptions";

const FBRadioGroup: React.FunctionComponent<FBCheckGroupProps> = ({
  row = true,
  type = "radiogroup",
  options,
  optionValueKey = "value",
  optionLabelKey = "text",
  labelValues,
  ...props
}) => (
  <FBInput {...props} {...{ type }}>
    <RadioGroup row={row}>
      {_.map(options, (option, index) => (
        <FormControlLabel
          key={`${_.get(option, optionValueKey)}-${index}`}
          value={_.get(option, optionValueKey)}
          control={<Radio />}
          label={<Text message={_.get(option, optionLabelKey)}  values={labelValues}/>}
        />
      ))}
    </RadioGroup>
  </FBInput>
);

export default withOptions(FBRadioGroup);

import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import Text from "../../../components/Text";
import { withCheckGroup } from "../../hocs/inputs/withCheckGroup";
import { FBCheckGroupProps } from "../../types/inputs/check";
import FBInput from "../common/FBInput";

const FBRadioGroup: React.FunctionComponent<FBCheckGroupProps> = ({
  row = true,
  includeContext,
  type = "radiogroup",
  options,
  optionValueKey = "",
  optionLabelKey = "",
  labelValues,
  ...props
}) => (
  <FBInput {...props} {...{ type }}>
    <RadioGroup row={row}>
      {_.map(options, (option) => (
        <FormControlLabel
          value={_.get(option, optionValueKey)}
          control={<Radio color="primary" />}
          label={<Text message={_.get(option, optionLabelKey)}  values={labelValues}/>}
        />
      ))}
    </RadioGroup>
  </FBInput>
);

export default withCheckGroup(FBRadioGroup);

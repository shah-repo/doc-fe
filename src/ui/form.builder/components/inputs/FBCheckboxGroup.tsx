import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import Text from "../../../components/Text";
import { withOptions } from "../../hocs/common/withOptions";
import { FBCheckGroupProps } from "../../types/inputs/check";
import FBInput from "../common/FBInput";

const FBCheckboxGroup: React.FunctionComponent<FBCheckGroupProps> = ({
  row = true,
  type = "checkboxgroup",
  options,
  optionValueKey = "value",
  optionLabelKey = "text",
  labelValues,
  form,
  ...props
}) => (
  <FBInput {...props} {...{ type }}>
    <FormGroup row={row}>
      {_.map(options, (option, index) => (
        <FormControlLabel
          key={`${_.get(option, optionValueKey)}-${index}`}
          value={_.get(option, optionValueKey)}
          control={
            <Checkbox
              disabled={props.disabled}
              checked={form?.values[_.get(option, optionValueKey)]}
            />
          }
          label={
            <Text
              message={_.get(option, optionLabelKey)}
              values={labelValues}
            />
          }
        />
      ))}
    </FormGroup>
  </FBInput>
);

export default withOptions(FBCheckboxGroup);

import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { get, map } from "lodash";
import React from "react";
import Text from "../../../components/Text";
import { withOptions } from "../../hocs/common/withOptions";
import FBStore from "../../stores/ui/FBStore";
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
      {map(options, (option, index) => {

        const valueKey = get(option, optionValueKey);
        const checked = form?.values[valueKey] || FBStore.getValue(valueKey);

        return (
          <FormControlLabel
            key={`${get(option, optionValueKey)}-${index}`}
            value={get(option, optionValueKey)}
            control={
              <Checkbox
                disabled={props.disabled}
                checked={checked}
              />
            }
            label={
              <Text
                message={get(option, optionLabelKey)}
                values={labelValues}
              />
            }
          />
        );
      })}
    </FormGroup>
  </FBInput>
);

export default withOptions(FBCheckboxGroup);

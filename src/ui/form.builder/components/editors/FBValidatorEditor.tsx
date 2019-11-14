import _ from "lodash";
import React from "react";
import FBValidatorStore from "../../stores/FBValidatorStore";
import FBRadioGroup from "../inputs/FBRadioGroup";

const FBValidatorEditor: React.FunctionComponent<{}> = () => (
  <FBRadioGroup
    type="radiogroup"
    row={false}
    name="validatorGroup"
    label="form.builder.groups"
    options={_.join(FBValidatorStore.groups, "\n")}
  />
);

export default FBValidatorEditor;

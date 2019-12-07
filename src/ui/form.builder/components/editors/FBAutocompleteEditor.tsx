
import React from "react";
import autocompleteOptions from "../../../../data/autocompleteOptions.json";
import FBSelect from "../inputs/FBSelect";
import FBAdditionsEditor from "./FBAdditionsEditor";
import FBLabelEditor from "./FBLabelEditor";
import FBPlaceholderEditor from "./FBPlaceholderEditor";
import FBStepperEditor from "./FBStepperEditor";
import _ from "lodash";

const FBAutocompleteEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBPlaceholderEditor />
    <FBSelect
      label="form.builder.select.options"
      options={autocompleteOptions}
      optionLabelKey="label"
      optionValueKey="id"
      name="optionId"
    />
    <FBAdditionsEditor type="autocomplete" />
  </FBStepperEditor>
);

export default FBAutocompleteEditor;

import React from "react";
import autocompleteOptions from "../../../../data/autocompleteOptions.json";
import FBCheckbox from "../inputs/FBCheckbox";
import FBSelect from "../inputs/FBSelect";
import FBLabelEditor from "./FBLabelEditor";
import FBPlaceholderEditor from "./FBPlaceholderEditor";
import FBStepperEditor from "./FBStepperEditor";

const FBAutocompleteEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBPlaceholderEditor />
    <FBSelect
      label="form.builder.select.options"
      options={autocompleteOptions}
      optionLabelKey="label"
      optionValueKey="id"
      name="optionsId"
    />
    <FBCheckbox label="form.builder.multi.select" name="isMulti" />
  </FBStepperEditor>
);

export default FBAutocompleteEditor;

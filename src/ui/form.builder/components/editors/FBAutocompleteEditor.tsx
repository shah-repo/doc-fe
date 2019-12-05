import _ from "lodash";
import React from "react";
import autocompleteOptions from "../../../../data/autocompleteOptions.json";
import { FBGroupEditorOptions } from "../../defaults/editor";
import { FBOptionProps } from "../../types/common.js";
import FBCheckboxGroup from "../inputs/FBCheckboxGroup";
import FBSelect from "../inputs/FBSelect";
import FBLabelEditor from "./FBLabelEditor";
import FBPlaceholderEditor from "./FBPlaceholderEditor";
import FBStepperEditor from "./FBStepperEditor";

const FBAutocompleteEditor: React.FunctionComponent<
  Pick<FBOptionProps, "options">
> = ({ options = _.get(FBGroupEditorOptions, "autocomplete") }) => (
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
    <FBCheckboxGroup label="form.builder.additions" options={options} />
  </FBStepperEditor>
);

export default FBAutocompleteEditor;

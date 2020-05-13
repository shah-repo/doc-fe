import React from "react";
import autocompleteOptions from "../../../../data/autocompleteOptions.json";
import { FBStepperEditor } from "../../FBStepperEditor";
import { FBAutocompleteEditorProps } from "../../types/editors/autocomplete.js";
import FBSelect from "../inputs/FBSelect";
import FBAdditionsEditor from "./FBAdditionsEditor";
import FBLabelEditor from "./FBLabelEditor";
import FBPlaceholderEditor from "./FBPlaceholderEditor";

const FBAutocompleteEditor: React.FunctionComponent<FBAutocompleteEditorProps> = ({
  afterChange,
}) => (
  <FBStepperEditor>
    <FBLabelEditor standalone={false} />
    <FBPlaceholderEditor />
    <FBSelect
      label="form.builder.select.options"
      options={autocompleteOptions}
      optionLabelKey="label"
      optionValueKey="id"
      name="optionId"
      {...{ afterChange }}
    />
    <FBAdditionsEditor type="autocomplete" />
  </FBStepperEditor>
);

export default FBAutocompleteEditor;

import React from "react";
import { FBStepperEditor } from "../..";
import { FBData } from "../../FBData";
import { FBAutocompleteEditorProps } from "../../types/editors/autocomplete";
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
      options={FBData.autocompleteOptions}
      optionLabelKey="label"
      optionValueKey="id"
      name="optionId"
      {...{ afterChange }}
    />
    <FBAdditionsEditor type="autocomplete" />
  </FBStepperEditor>
);

export default FBAutocompleteEditor;

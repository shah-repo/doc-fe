import React from "react";
import autocompleteEditorList from "../../stores/domain/collections/FBAutocompleteEditorCollection";
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
      options={autocompleteEditorList.options()}
      name="autocompleteId"
    />
    <FBCheckbox label="form.builder.multi.select" name="multiple" />
  </FBStepperEditor>
);

export default FBAutocompleteEditor;

import React from "react";
import { FBAutocomplete } from "..";
import requirementsOptions from "../../../data/requirementsOptions.json";
import { FBLabelEditorProps } from "../components/editors/FBLabelEditor";
import FBTextField from "../components/inputs/FBTextField";

const FBEditorTestRequirement: React.FunctionComponent<FBLabelEditorProps> = ({
  defaultValue,
}) => (
  <>
    <FBTextField label="form.builder.label" name="label" {...{ defaultValue }}  />
    <FBAutocomplete
      label="form.builder.testRequirement"
      name="testRequirement"
      options={requirementsOptions}
    />
  </>
);

export default FBEditorTestRequirement;

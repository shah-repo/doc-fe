import React from "react";
import { FBEditorPropertiesProps } from ".";
import { FBCheckboxGroup, FBFieldName } from "..";
import { withFBEditorProperties } from "./FBEditorProperties.wrap";

const FBEditorProperties: React.FunctionComponent<FBEditorPropertiesProps> = ({
  options = [],
}) => (
  <FBCheckboxGroup
    name={FBFieldName.EditorProps}
    label="form.builder.properties"
    {...{ options }}
  />
);

export default withFBEditorProperties(FBEditorProperties);

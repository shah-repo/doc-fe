import React from "react";
import { FBEditorPropertiesProps } from ".";
import { FBCheckboxGroup, FBData, FBFieldName } from "..";

const FBEditorProperties: React.FunctionComponent<FBEditorPropertiesProps> = ({
  type,
}) => (
  <FBCheckboxGroup
    name={FBFieldName.EditorProps}
    label="form.builder.properties"
    options={type && FBData.editorProperties[type]}
  />
);

export default FBEditorProperties;

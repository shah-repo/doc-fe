import React from "react";
import { FBEditorPropertiesProps } from ".";
import { FBCheckboxGroup, FBData, FBFieldName } from "..";
import { withFBEditorProperties } from "./FBEditorProperties.wrap";

const FBEditorProperties: React.FunctionComponent<FBEditorPropertiesProps> = ({
  onChange,
  type,
}) => (
  <FBCheckboxGroup
    name={FBFieldName.EditorProps}
    label="form.builder.properties"
    options={type && FBData.editorProperties[type]}
    {...{ onChange }}
  />
);

export default withFBEditorProperties(FBEditorProperties);

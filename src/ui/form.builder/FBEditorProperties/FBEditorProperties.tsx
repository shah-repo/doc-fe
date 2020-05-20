import React from "react";
import { FBEditorPropertiesProps } from ".";
import { FBCheckboxGroup, FBFieldName } from "..";
import { withFBEditorProperties } from "./FBEditorProperties.wrap";

const FBEditorProperties: React.FunctionComponent<FBEditorPropertiesProps> = ({
  onChange,
  options,
  type,
}) => (
  <>
    {options && (
      <FBCheckboxGroup
        name={FBFieldName.EditorProps}
        label="form.builder.properties"
        {...{ onChange, options }}
      />
    )}
  </>

);

export default withFBEditorProperties(FBEditorProperties);

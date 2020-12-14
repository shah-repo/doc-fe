import { isEmpty } from "lodash";
import React from "react";
import { FBEditorPropertiesDefaultValue, FBEditorPropertiesProps } from ".";
import { FBCheckboxGroup, FBFieldName } from "..";
import { withFBEditorProperties } from "./FBEditorProperties.wrap";

const FBEditorProperties: React.FunctionComponent<FBEditorPropertiesProps> = ({
  onChange,
  options,
  type = "",
}) => (
  <>
    {options && !isEmpty(options) && (
      <FBCheckboxGroup
        name={FBFieldName.EditorProps}
        label="form.builder.properties"
        {...{ onChange, options }}
        defaultValue={FBEditorPropertiesDefaultValue[type]}
      />
    )}
  </>

);

export default withFBEditorProperties(FBEditorProperties);

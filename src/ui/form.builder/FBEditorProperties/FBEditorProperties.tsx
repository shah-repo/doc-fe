import { isEmpty } from "lodash";
import React from "react";
import { FBCheckboxGroup, FBEditorPropertiesProps, FBFieldName, FBInputType } from "..";
import { FBEditorPropertiesDefaultValue } from "./FBEditorProperties.helper";
import { withFBEditorProperties } from "./FBEditorProperties.wrap";

const FBEditorProperties: React.FunctionComponent<FBEditorPropertiesProps> = ({
  onChange,
  options,
  docGroupOptions,
  type = "" as FBInputType,
}) => (
  <>
    {options && !isEmpty(options) && (
      <FBCheckboxGroup
        name={FBFieldName.EditorProps}
        label="form.builder.properties"
        {...{ onChange, options }}
        defaultValue={FBEditorPropertiesDefaultValue(type, docGroupOptions)[type]}
      />
    )}
  </>

);

export default withFBEditorProperties(FBEditorProperties);

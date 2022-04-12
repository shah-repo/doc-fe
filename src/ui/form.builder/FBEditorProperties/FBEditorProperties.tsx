import { isEmpty } from "lodash";
import React from "react";
import { FBCheckboxGroup, FBEditorPropertiesProps, FBFieldName, FBInputType } from "..";
import { styles } from "../styles/FBEditorTextField.styles";
import { FBEditorPropertiesDefaultValue } from "./FBEditorProperties.helper";
import { withFBEditorProperties } from "./FBEditorProperties.wrap";

const FBEditorProperties: React.FunctionComponent<FBEditorPropertiesProps> = ({
  onChange,
  options,
  docGroupOptions,
  type = "" as FBInputType,
}) => {
  const classes = styles();
  return (
    <>
      {options && !isEmpty(options) && (
        <FBCheckboxGroup
          name={FBFieldName.EditorProps}
          label="form.builder.properties"
          {...{ onChange, options }}
          defaultValue={FBEditorPropertiesDefaultValue(type, docGroupOptions)[type]}
          boxProps={{ mb: 3.125, className: classes.error }}
          labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 14 }}
          className={classes.textfield}
        />
      )}
    </>
  );
};

export default withFBEditorProperties(FBEditorProperties);

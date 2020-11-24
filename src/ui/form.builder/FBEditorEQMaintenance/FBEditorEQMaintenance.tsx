import React from "react";
import { FBData, FBEditor, FBEditorLabel, FBEditorProps } from "..";
import { FBCheckboxGroup } from "../FBCheckboxGroup";

const FBEditorEQMaintenance: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBEditorLabel {...props} {...{ inputProps }} standalone={true} />
    <FBCheckboxGroup
      label="form.builder.include.fields"
      name="editorConfig"
      options={FBData.eqMaintenanceOptions}
    />
    {children}
  </FBEditor>
);

export default FBEditorEQMaintenance;

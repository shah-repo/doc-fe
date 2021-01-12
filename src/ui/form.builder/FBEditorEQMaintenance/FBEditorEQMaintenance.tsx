import React from "react";
import { FBData, FBEditor, FBEditorLabel, FBEditorProps, FBRadioGroup } from "..";

const FBEditorEQMaintenance: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBEditorLabel {...props} {...{ inputProps }} standalone={true} />
    <FBRadioGroup
      label="form.builder.choose.form"
      name="editorConfig.type"
      options={FBData.eqMaintenanceTypeOptions}
      rules="required"
    />
    {children}
  </FBEditor>
);

export default FBEditorEQMaintenance;

import React from "react";
import { FBData, FBEditor, FBEditorLabel, FBEditorProps, FBRadioGroup } from "..";
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
      name="editorConfig.fields"
      options={FBData.eqMaintenanceFieldOptions}
    />
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

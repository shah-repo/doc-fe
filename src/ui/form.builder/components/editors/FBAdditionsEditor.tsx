import { get } from "lodash";
import React from "react";
import { FBGroupEditorOptions } from "../../defaults/editor";
import { FBAdditionEditorProps } from "../../types/editors/additions";
import FBCheckboxGroup from "../inputs/FBCheckboxGroup";

const FBAdditionsEditor: React.FunctionComponent<FBAdditionEditorProps> = ({
  type = "",
  contextLabel,
}) => (
  <FBCheckboxGroup
    name="editor-additions"
    label="form.builder.additions"
    options={get(FBGroupEditorOptions, type)}
    contextLabel={contextLabel}
  />
);

export default FBAdditionsEditor;

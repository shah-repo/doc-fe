import React from "react";
import { omitReviseDisabledOption } from "../../defaults/editor";
import FBTextField from "../inputs/FBTextField";
import FBAdditionsEditor from "./FBAdditionsEditor";

interface FBLabelEditorProps {
  defaultValue?: string;
  standalone?: boolean;
  type?: string;
}
const FBLabelEditor: React.FunctionComponent<FBLabelEditorProps> = ({
  standalone = true,
  type = "",
  ...props
}) => (
  <>
    <FBTextField label="form.builder.label" {...props} name="label"  />
    {standalone && !omitReviseDisabledOption.includes(type) && (
      <FBAdditionsEditor type="label" />
    )}
  </>
);

export default FBLabelEditor;

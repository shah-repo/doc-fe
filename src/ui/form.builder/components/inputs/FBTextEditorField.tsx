import React from "react";
import ReactQuill from "react-quill";
import { formats, modules } from "../../../components/forms/fields/TextEditor/configuration";
import { FBFormDefaultProps, FBOnChangeProps, FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

export type Props = FBFormDefaultProps & FBOnChangeProps;

const FBTextEditorField: React.FunctionComponent<FBInputProps> = ({
  disabled,
  name,
  ...props
}) => (
  <FBInput {...props} {...{name}} type="texteditor">
    <ReactQuill
      theme="snow"
      modules={modules}
      formats={formats}
      onChange={props.onChange}
      readOnly={disabled}
      style={{ minHeight: 220 }}
      id={`field-${name}`}
    />
  </FBInput>
);

export default FBTextEditorField;

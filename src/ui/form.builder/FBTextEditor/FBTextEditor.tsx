import React from "react";
import ReactQuill from "react-quill";
import { FBInput, FBInputProps } from "..";
import { formats, modules } from "../../components/forms/fields/TextEditor/configuration";

const FBTextEditor: React.FunctionComponent<FBInputProps> = ({
  disabled,
  name,
  ...props
}) => (
  <FBInput {...props} {...{ name, disabled }} type="texteditor">
    <ReactQuill
      theme="snow"
      modules={modules}
      formats={formats}
      readOnly={disabled}
      id={`field-${name}`}
    />
  </FBInput>
);

export default FBTextEditor;

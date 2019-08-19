

import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import ReactQuill, { } from "react-quill";
import { QuillOptionsStatic} from "quill";
import Field, { FieldOwnProps } from "./Field";
import { RenderSize } from "../../../../state/ducks/common";

interface TextEditorOwnProps extends FieldOwnProps {
  quillOptions?: QuillOptionsStatic;
  size?: RenderSize;
  actionsRenderer?: () => any;
}

type TextEditorPropsWithFormik = TextEditorOwnProps & FormikFieldProps;

/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'video'],
    ['clean'],
    [{ 'color': [] }, { 'background': [] }],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'video', 'color'
]

const TextEditor: React.FunctionComponent<TextEditorPropsWithFormik> = ({
  quillOptions,
  actionsRenderer,
  size,
  ...fieldProps
}) => {
  const handleChange = (editHtml: string) => {
    fieldProps.form.setFieldValue(fieldProps.field.name, editHtml);
  };

  return (
    <Field size={size} actionsRenderer={actionsRenderer} {...fieldProps} inputLabelProps={{ shrink: true }} >
      <div className="editor-container">
        <ReactQuill
          theme="bubble"
          modules={modules}
          formats={formats}
          bounds={'.editor-container'}
          {...quillOptions}
          onChange={handleChange}
          value={fieldProps.field.value}
        />
      </div>
    </Field>
  );
};

type TextEditorFieldProps = TextEditorOwnProps & FieldConfig;

const TextEditorField: React.FunctionComponent<TextEditorFieldProps> = (props) => <FormikField component={TextEditor} {...props} />;

export default TextEditorField;



import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import ReactQuill, { } from "react-quill";
import { QuillOptionsStatic} from "quill";
import Field, { FieldOwnProps } from "./Field";
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

interface TextEditorOwnProps extends FieldOwnProps {
  quillOptions?: QuillOptionsStatic;
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
    ['link', 'image', 'video'],
    ['clean']
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
  'link', 'image', 'video'
]

const TextEditor: React.FunctionComponent<TextEditorPropsWithFormik> = ({
  quillOptions,
  ...fieldProps
}) => {
  const handleChange = (editHtml: string) => {
    fieldProps.form.setFieldValue(fieldProps.field.name, editHtml);
  };

  return (
    <Field {...fieldProps} >
      <div className="editor-container">
        <ReactQuill
          theme="bubble"
          onChange={handleChange}
          value={fieldProps.field.value}
          modules={modules}
          formats={formats}
          bounds={'.editor-container'}
          placeholder="Test"
          {...quillOptions}
        />
      </div>
    </Field>
  );
};

type TextEditorFieldProps = TextEditorOwnProps & FieldConfig;

const TextEditorField: React.FunctionComponent<TextEditorFieldProps> = (props) => <FormikField component={TextEditor} {...props} />;

export default TextEditorField;

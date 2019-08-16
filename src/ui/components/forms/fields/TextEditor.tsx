
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  ContentState,
} from "draft-js";

import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import Field, { FieldOwnProps } from "./Field";

interface TextEditorOwnProps extends FieldOwnProps {}

type TextEditorPropsWithFormik = TextEditorOwnProps & FormikFieldProps;

const TextEditor: React.FunctionComponent<TextEditorPropsWithFormik> = ({
  ...fieldProps
}) => {
  const onEditorStateChange = (editorState: EditorState) => {
    fieldProps.form.setFieldValue(fieldProps.field.name, editorState);
  };

  return (
    <Field {...fieldProps} >
      <Editor
        editorState={fieldProps.field.value}
        // editorStyle={this.styles.editor}
        toolbarStyle={{
          backgroundColor: "#f0f0f0",
        }}
        editorStyle={
          {
            minHeight: '150px',
            maxHeight: '150px',
            backgroundColor: "rgba(0, 0, 0, 0.09)",
            padding: '0 5px',
          }
        }
        onEditorStateChange={onEditorStateChange}
/*         localization={{
          locale: intl.locale,
        }} */
        toolbarOnFocus={true}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize'],
        }}
      />
    </Field>
  );
};

type TextEditorFieldProps = TextEditorOwnProps & FieldConfig;

const TextEditorField: React.FunctionComponent<TextEditorFieldProps> = (props) => <FormikField component={TextEditor} {...props} />;

export default TextEditorField;

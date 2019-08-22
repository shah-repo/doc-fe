

import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import ReactQuill, { } from "react-quill";
import { QuillOptionsStatic} from "quill";
import classNames from "classnames";
import Field, { FieldOwnProps } from "../Field";
import { RenderSize } from "../../../../../state/ducks/common";
import { modules, formats } from "./configuration";

interface TextEditorOwnProps extends FieldOwnProps {
  quillOptions?: QuillOptionsStatic;
  size?: RenderSize;
  actionsRenderer?: () => any;
}

type TextEditorPropsWithFormik = TextEditorOwnProps & FormikFieldProps;

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
      <div className={classNames("editor-container", { "label-margin": !actionsRenderer })} >
        <ReactQuill
          theme="snow"
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

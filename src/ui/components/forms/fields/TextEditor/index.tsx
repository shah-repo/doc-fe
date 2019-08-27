

import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import ReactQuill from "react-quill";
import { QuillOptionsStatic } from "quill";
import classNames from "classnames";
import Field, { FieldOwnProps } from "../Field";
import { RenderSize } from "../../../../../state/ducks/common";
import { modules, formats } from "./configuration";
import useComponentVisible from "../../../../hooks/useComponentVisible";

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
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const handleChange = (editHtml: string) => {
    fieldProps.form.setFieldValue(fieldProps.field.name, editHtml);
  };
  const handleBlur = (e: any) => {
    const {
      field: { name },
      form: { touched, setFieldTouched }
    } = fieldProps;

    if (!touched[name]) {
      setFieldTouched(name, true);
    }
  }

  const onClick = () => setIsComponentVisible(true);

  return (
    <Field 
      size={size}
      actionsRenderer={actionsRenderer}
      {...fieldProps}
      inputLabelProps={{ shrink: true }}
    >
      <div
        className={classNames("editor-container", { "label-margin": !actionsRenderer })}
        onClick={onClick}
        ref={ref}
      >
        <ReactQuill
          theme="snow"
          bounds=".editor-container"
          modules={{
            ...modules,
            toolbar: isComponentVisible ? modules.toolbar : false,
          }}
          formats={formats}
          {...quillOptions}
          onChange={handleChange}
          value={fieldProps.field.value}
          onBlur={handleBlur}
        />
      </div>
    </Field>
  );
};

type TextEditorFieldProps = TextEditorOwnProps & FieldConfig;

const TextEditorField: React.FunctionComponent<TextEditorFieldProps> = (props) => <FormikField component={TextEditor} {...props} />;

export default TextEditorField;

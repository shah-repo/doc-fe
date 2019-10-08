import classNames from "classnames";
import {
  Field as FormikField,
  FieldConfig,
  FieldProps as FormikFieldProps,
} from "formik";
import { QuillOptionsStatic } from "quill";
import * as React from "react";
import ReactQuill from "react-quill";
import { RenderSize } from "../../../../../state/ducks/common";
import useComponentVisible from "../../../../hooks/useComponentVisible";
import Field, { FieldOwnProps } from "../Field";
import { formats, modules } from "./configuration";

export interface TextEditorOwnProps extends FieldOwnProps {
  quillOptions?: QuillOptionsStatic;
  size?: RenderSize;
  actionsRenderer?: () => any;
}

export type TextEditorPropsWithFormik = TextEditorOwnProps & FormikFieldProps;

const TextEditor: React.FunctionComponent<TextEditorPropsWithFormik> = ({
  quillOptions,
  actionsRenderer,
  size,
  ...fieldProps
}) => {
  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);
  const handleChange = (editHtml: string) => {
    fieldProps.form.setFieldValue(fieldProps.field.name, editHtml);
  };
  const handleBlur = (e: any) => {
    const {
      field: { name },
      form: { touched, setFieldTouched },
    } = fieldProps;

    if (!touched[name]) {
      setFieldTouched(name, true);
    }
  };

  const handleFocus = () => setIsComponentVisible(true);

  return (
    <Field
      size={size}
      actionsRenderer={actionsRenderer}
      {...fieldProps}
      inputLabelProps={{ shrink: true }}
    >
      <div
        className={classNames("editor-container", {
          "label-margin": !actionsRenderer,
        })}
        ref={ref}
        tabIndex={0}
        onFocus={handleFocus}
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
          value={fieldProps.field.value || ""}
          onBlur={handleBlur}
          readOnly={!isComponentVisible}
        />
      </div>
    </Field>
  );
};

export type TextEditorFieldProps = TextEditorOwnProps & FieldConfig;

const TextEditorField: React.FunctionComponent<TextEditorFieldProps> = (
  props,
) => <FormikField component={TextEditor} {...props} />;

export default TextEditorField;



import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import ReactQuill from "react-quill";
import { QuillOptionsStatic, RangeStatic, Sources } from "quill";
import classNames from "classnames";
import Field, { FieldOwnProps } from "../Field";
import { RenderSize } from "../../../../../state/ducks/common";
import { modules, formats } from "./configuration";
import ClickedOutside from "../../../ClickedOutside";

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
  const [showToolbar, setShowToolbar] = React.useState(false);
  const handleChange = (editHtml: string) => {
    fieldProps.form.setFieldValue(fieldProps.field.name, editHtml);
  };

  const onClick = () => setShowToolbar(true);
  const onBlur = () => setShowToolbar(false);

  return (
    <Field 
      size={size}
      actionsRenderer={actionsRenderer}
      {...fieldProps}
      inputLabelProps={{ shrink: true }}
    >
      <ClickedOutside onBlur={onBlur}>
        <div
          className={classNames("editor-container", { "label-margin": !actionsRenderer })}
          onClick={onClick}
        >
          <ReactQuill
            theme="snow"
            bounds=".editor-container"
            modules={{
              ...modules,
              toolbar: showToolbar ? modules.toolbar : false,
            }}
            formats={formats}
            {...quillOptions}
            onChange={handleChange}
            value={fieldProps.field.value}
          />
        </div>
      </ClickedOutside>
    </Field>
  );
};

type TextEditorFieldProps = TextEditorOwnProps & FieldConfig;

const TextEditorField: React.FunctionComponent<TextEditorFieldProps> = (props) => <FormikField component={TextEditor} {...props} />;

export default TextEditorField;

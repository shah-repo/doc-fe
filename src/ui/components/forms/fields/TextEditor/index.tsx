import { Box } from "@material-ui/core";
import classNames from "classnames";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
// tslint:disable-next-line: no-implicit-dependencies
import { QuillOptionsStatic } from "quill";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { sanitizeHtml } from "../../../../../common/utils/helpers";
import { RenderSize } from "../../../../../state/ducks/common";
import useComponentVisible from "../../../../hooks/useComponentVisible";
import Field, { FieldOwnProps } from "../Field";
import { reactQuillEmptyString } from "../validators";
import { formats, modules } from "./configuration";
import "./customLink";
import "./textEditor.css";

export interface TextEditorOwnProps extends FieldOwnProps {
  quillOptions?: QuillOptionsStatic;
  size?: RenderSize;
  customContainers?: any[];
  customHandlers?: any;
  customToolbarAction?: () => void;
  actionsRenderer?: () => any;
  hidden?: boolean;
}

export type TextEditorPropsWithFormik = TextEditorOwnProps & FormikFieldProps;

const TextEditor: React.FunctionComponent<TextEditorPropsWithFormik> = ({
  quillOptions,
  actionsRenderer,
  size,
  customContainers = [],
  customHandlers = [],
  customToolbarAction,
  hidden = false,
  ...fieldProps
}) => {

  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);
  const refEditor = useRef<ReactQuill>(null);

  const [toolbar, setToolbar] = useState<any>({});
  const [value, setValue] = useState<string>("");
  const { field, form } = fieldProps;

  useMemo(() => {
    setValue(sanitizeHtml(field.value) || "");
  }, [field.value]);

  useEffect(() => {
    setToolbar(
      {
        container: [
          ...modules.toolbar.container,
          ...customContainers,
        ],
        handlers: {
          ...modules.toolbar.handlers,
          ...customHandlers,
        },
      },
    );
  }, [customContainers, customHandlers]);

  useEffect(() => {
    if (!isComponentVisible) {
      return;
    }
    customToolbarAction && customToolbarAction();
  }, [customToolbarAction, isComponentVisible]);

  const handleChange = (editHtml: string) => {
    // when you click on an empty editor Quill injects some HTML
    const value = editHtml === reactQuillEmptyString ? "" : editHtml;
    form.setFieldValue(field.name, value);
  };
  const handleBlur = (e: any) => {
    const  { name } = field;
    const { touched, setFieldTouched } = form;

    if (!touched[name]) {
      setFieldTouched(name, true);
    }
  };

  const handleFocus = () => {
    setIsComponentVisible(true);
  };

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
        <Box hidden={hidden}>
          <ReactQuill
            ref={refEditor}
            theme="snow"
            bounds=".editor-container"
            modules={{
              ...modules,
              toolbar: isComponentVisible ? toolbar : false,
            }}
            formats={formats}
            {...quillOptions}
            onChange={handleChange}
            defaultValue={value}
            onBlur={handleBlur}
            readOnly={!isComponentVisible}
          />
        </Box>
      </div>
    </Field>
  );
};

export type TextEditorFieldProps = TextEditorOwnProps & FieldConfig;

const TextEditorField: React.FunctionComponent<TextEditorFieldProps> = (
  props,
) => <FormikField component={TextEditor} {...props} />;

export default TextEditorField;

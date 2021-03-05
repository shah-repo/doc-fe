/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@material-ui/core";
import classNames from "classnames";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import React, { useEffect, useState } from "react";
import { Editor, EditorProps } from "react-draft-wysiwyg";
import useDebounce from "use-debounce/lib/useDebounce";
import "../../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { RenderSize } from "../../../../../state/ducks/common/types";
import useDidMount from "../../../../hooks/useDidMount";
import { useFormContext } from "../../FormContext";
import Field, { FieldOwnProps } from "../Field";
import { convertHtmlToDraft } from "./helpers";
import "./rte.css";

const toolbarOptions = [
  "inline",
  "blockType",
  "fontSize",
  "fontFamily",
  "list",
  "textAlign",
  "colorPicker",
  "link",
  "remove",
  "history",
];

const inline = { options: ["bold", "italic", "underline", "monospace"] };

interface RichTextEditorOwnProps extends FieldOwnProps {
  size?: RenderSize;
  customToolbarAction?: () => void;
  actionsRenderer?: () => any;
  hidden?: boolean;
  editorProps?: EditorProps;
  toggleToolbar?: boolean;
}

type RichTextEditorPropsWithFormik = RichTextEditorOwnProps & FormikFieldProps;

const RichTextEditor: React.FunctionComponent<RichTextEditorPropsWithFormik> = ({
  actionsRenderer,
  size,
  hidden = false,
  editorProps,
  toggleToolbar = true,
  ...fieldProps
}) => {
  const { submitForm } = useFormContext();
  const didMount = useDidMount();
  const { field, form } = fieldProps;
  const [value, setValue] = useState();
  const [toolbarHidden, setToolbarHidden] = useState(toggleToolbar);
  const [toolbarHiddenDebounced, setToolbarHiddenDebounced] = useState(toggleToolbar);

  useEffect(() => {
    setValue(convertHtmlToDraft(field.value));
  }, []);

  // ENC-1934 - in case of pointer run
  // useEffect(() => {
  //   if (!value) {
  //     return;
  //   }

  //   const html = draftToHtml(convertToRaw(value.getCurrentContent())).trim();

  //   // workaround for assessment description
  //   // field value is set to undefined if attachment is added
  //   // that's why we have to update the editor value as well
  //   if (!field.value && html && html !== "<p></p>") {
  //     setValue(convertHtmlToDraft(""));
  //   }
  // }, [field.value]);

  const [debouncedUpdate] = useDebounce(value, 200);
  useEffect(() => {
    if (!value) {
      return;
    }

    const html = draftToHtml(convertToRaw(value.getCurrentContent())).trim();
    const fieldValue = html === "<p></p>" ? "" : html;
    form.setFieldValue(field.name, fieldValue);
  }, [debouncedUpdate]);

  const [debouncedToggle] = useDebounce(toolbarHidden, 150);
  useEffect(() => {
    if (!didMount) {
      return;
    }
    if (toolbarHiddenDebounced) {
      setToolbarHiddenDebounced(false);
      return;
    }
    setTimeout(() => {
      setToolbarHiddenDebounced(true);
    }, 300);
  }, [debouncedToggle]);

  const handleBlur = () => {
    const { name } = field;
    const { touched, setFieldTouched } = form;

    if (toggleToolbar) {
      setToolbarHidden(true);
    }

    if (!touched[name]) {
      setFieldTouched(name, true);
    }

    submitForm();
  };

  const handleFocus = () => {
    if (toggleToolbar) {
      setToolbarHidden(false);
    }
  };
  return (
    <Field
      size={size}
      actionsRenderer={actionsRenderer}
      {...fieldProps}
      inputLabelProps={{ shrink: true }}
    >
      <Box hidden={hidden} data-cy={`RichTextEditor.${field.name}`}>
        <Editor
          editorState={value}
          onEditorStateChange={setValue}
          onBlur={handleBlur}
          onFocus={handleFocus}
          toolbarClassName={
            classNames(
              "rte-toolbar",
              {
                "rte-toolbar-hide": toolbarHiddenDebounced,
              },
            )
          }
          wrapperClassName="rte-wrapper"
          editorClassName="rte-editor"
          toolbar={{
            options: toolbarOptions,
            inline,
          }}
          {...editorProps}

        />
      </Box>
    </Field>
  );
};

type RichTextEditorFieldProps = RichTextEditorOwnProps & FieldConfig;

const RichTextEditorField: React.FunctionComponent<RichTextEditorFieldProps> = (
  props,
) => <FormikField component={RichTextEditor} {...props} />;

export default RichTextEditorField;

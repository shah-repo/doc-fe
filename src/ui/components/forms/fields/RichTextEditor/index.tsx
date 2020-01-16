import { Box } from "@material-ui/core";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import {
  Field as FormikField,
  FieldConfig,
  FieldProps as FormikFieldProps,
} from "formik";
import htmlToDraft from "html-to-draftjs";
import React, { useEffect, useState } from "react";
import { Editor, EditorProps } from "react-draft-wysiwyg";
import useDebounce from "use-debounce/lib/useDebounce";
import "../../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { RenderSize } from "../../../../../state/ducks/common";
import Field, { FieldOwnProps } from "../Field";
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

export interface RichTextEditorOwnProps extends FieldOwnProps {
  size?: RenderSize;
  customToolbarAction?: () => void;
  actionsRenderer?: () => any;
  hidden?: boolean;
  editorProps?: EditorProps;
  toggleToolbar?: boolean;
}

export type RichTextEditorPropsWithFormik = RichTextEditorOwnProps & FormikFieldProps;

const RichTextEditor: React.FunctionComponent<RichTextEditorPropsWithFormik> = ({
  actionsRenderer,
  size,
  hidden = false,
  editorProps,
  toggleToolbar = true,
  ...fieldProps
}) => {

  const { field, form } = fieldProps;
  const [value, setValue] = useState();
  const [toolbarHidden, setToolbarHidden] = useState(toggleToolbar);

  useEffect(() => {
    const contentBlock = htmlToDraft(field.value);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setValue(editorState);
    }
  }, []);

  const [debouncedUpdate] = useDebounce(value, 300);
  useEffect(() => {
    if (!value) {
      return;
    }

    const html = draftToHtml(convertToRaw(value.getCurrentContent())).trim();
    const fieldValue = html === "<p></p>" ? "" : html;
    form.setFieldValue(field.name, fieldValue);
  }, [debouncedUpdate]);

  const handleBlur = () => {
    const  { name } = field;
    const { touched, setFieldTouched } = form;

    if (toggleToolbar) {
      setToolbarHidden(true);
    }

    if (!touched[name]) {
      setFieldTouched(name, true);
    }
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
      <Box hidden={hidden}>
        <Editor
          editorState={value}
          onEditorStateChange={setValue}
          onBlur={handleBlur}
          onFocus={handleFocus}
          toolbarClassName="rte-toolbar-absolute"
          wrapperClassName="rte-wrapper"
          editorClassName="rte-editor"
          toolbar={{
            options: toolbarOptions,
          }}
          {...editorProps}
          toolbarHidden={toolbarHidden}
        />
      </Box>
    </Field>
  );
};

export type RichTextEditorFieldProps = RichTextEditorOwnProps & FieldConfig;

const RichTextEditorField: React.FunctionComponent<RichTextEditorFieldProps> = (
  props,
) => <FormikField component={RichTextEditor} {...props} />;

export default RichTextEditorField;

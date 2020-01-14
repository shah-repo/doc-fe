import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import {
  Field as FormikField,
  FieldConfig,
  FieldProps as FormikFieldProps,
} from "formik";
import htmlToDraft from "html-to-draftjs";
// tslint:disable-next-line: no-implicit-dependencies
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
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
}

export type RichTextEditorPropsWithFormik = RichTextEditorOwnProps & FormikFieldProps;

const RichTextEditor: React.FunctionComponent<RichTextEditorPropsWithFormik> = ({
  actionsRenderer,
  size,
  hidden = false,
  ...fieldProps
}) => {

  const { field, form } = fieldProps;
  const [value, setValue] = useState();

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

    if (!touched[name]) {
      setFieldTouched(name, true);
    }
  };

  return (
    <Field
      size={size}
      actionsRenderer={actionsRenderer}
      {...fieldProps}
      inputLabelProps={{ shrink: true }}
    >
      <div>
        <Editor
          toolbarClassName="rte-toolbar-absolute"
          wrapperClassName="rte-wrapper"
          editorClassName="rte-editor"
          editorState={value}
          onEditorStateChange={setValue}
          onBlur={handleBlur}
          toolbarOnFocus
          toolbar={{
            options: toolbarOptions,
          }}
        />
      </div>
    </Field>
  );
};

export type RichTextEditorFieldProps = RichTextEditorOwnProps & FieldConfig;

const RichTextEditorField: React.FunctionComponent<RichTextEditorFieldProps> = (
  props,
) => <FormikField component={RichTextEditor} {...props} />;

export default RichTextEditorField;

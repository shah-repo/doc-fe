import { Box, FormControl } from '@material-ui/core';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { useFormikContext } from 'formik';
import htmlToDraft from 'html-to-draftjs';
import React, { useEffect, useRef, useState } from 'react';
import FBLabel from '../../../form.builder/FBLabel/FBLabel';
import FBTextEditorChild from '../../../form.builder/FBTextEditor/FBTextEditor.child';
import { FBTextEditorProps } from '../../../form.builder/FBTextEditor/FBTextEditor.types';
import { FBFontStyle } from '../../../form.builder/styles/FBFont.styles';
import useStyles from './FormikTextEditor.styles';

/**
 * Standalone Text Editor Field wrapper - works with Formik without FB store
 * Adapted from FBTextEditor.wrap.tsx to work independently
 */

const FormikTextEditorField: React.FunctionComponent<Omit<FBTextEditorProps, 'textEditorState'>> = ({
  name = '',
  label,
  placeholder = '',
  disabled = false,
  isPreview = false,
  removeBorder = false,
  dataCy,
  ...props
}) => {
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formik = useFormikContext<Record<string, any>>();
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const [masked, setMasked] = useState(true);
  const editorRefState = useRef<HTMLInputElement>();
  const preserveFocusRef = useRef(false);

  const emptyHtmlContent = '<p></p>';
  const formValue = (formik?.values?.[name] as string) || '';
  const error = !!(formik?.errors?.[name] && formik?.touched?.[name]);

  // Helper: Creates editor state with initial value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const htmlToEditorState = (value?: string): EditorState => {
    if (!value) {
      return EditorState.createEmpty();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
    const contentBlock: any = htmlToDraft(value);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    return EditorState.createWithContent(contentState);
  };

  // Initialize editor state from form value
  useEffect(() => {
    const newEditorState = htmlToEditorState(formValue);
    setEditorState(newEditorState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync editor state when form value changes externally
  useEffect(() => {
    if (masked) {
      const newEditorState = htmlToEditorState(formValue);
      setEditorState(newEditorState);
    }
  }, [formValue, masked]);

  // Handle editor state change - convert to HTML and update Formik
  const handleEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    let htmlContent = String(draftToHtml(convertToRaw(newEditorState.getCurrentContent())) || '').trim();
    if (htmlContent === emptyHtmlContent) {
      htmlContent = '';
    }

    if (formik && (formik.values[name] as string) !== htmlContent) {
      formik.setFieldValue(name, htmlContent);
    }
  };

  const handleMask = (maskState: boolean) => {
    if (!editorRefState.current) {
      return;
    }
    if (!maskState && !preserveFocusRef.current) {
      editorRefState.current.focus();
      setEditorState((prevEditorState) => EditorState.moveFocusToEnd(prevEditorState));
    }
    setMasked(maskState);
  };

  const handleEditorRef = (ref: HTMLInputElement) => {
    editorRefState.current = ref;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBlur = (ev: any) => {
    if (preserveFocusRef.current) {
      return;
    }

    handleMask(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    let htmlContent = String(draftToHtml(convertToRaw(editorState.getCurrentContent())) || '').trim();
    if (htmlContent === emptyHtmlContent) {
      htmlContent = '';
    }

    if (formik && (formik.values[name] as string) !== htmlContent) {
      formik.setFieldValue(name, htmlContent);
      formik.setFieldTouched(name, true);
    }
  };

  const handleOptionsChange = (value: string) => {
    const newEditorState = htmlToEditorState(value);
    handleEditorStateChange(newEditorState);
  };

  const toolbar = {
    options: [
      'inline',
      'blockType',
      'fontSize',
      'fontFamily',
      'list',
      'textAlign',
      'colorPicker',
      'link',
      'remove',
      'history',
    ],
    inline: { options: ['bold', 'italic', 'underline', 'monospace'] },
  };

  return (
    <Box className={classes.root}>
      <FormControl fullWidth error={error}>
        <Box data-cy={dataCy} className={classes.labelRow} display="flex" flexDirection="row">
          {label && (
            <FBLabel
              {...{
                error,
                label,
                loading: false,
                labelProps: removeBorder ? FBFontStyle.labelMediumProps : FBFontStyle.labelProps,
              }}
            />
          )}
        </Box>
        <FBTextEditorChild
          name={name}
          placeholder={placeholder}
          disabled={disabled || isPreview}
          isPreview={isPreview}
          removeBorder={removeBorder}
          editorState={editorState}
          onEditorStateChange={handleEditorStateChange}
          editorRef={handleEditorRef}
          handleMask={handleMask}
          onBlur={handleBlur}
          onOptionsChange={handleOptionsChange}
          toolbar={toolbar}
          formValue={formValue}
          masked={masked}
          {...props}
        />
      </FormControl>
    </Box>
  );
};

export default FormikTextEditorField;

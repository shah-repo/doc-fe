import { FieldWrapper } from '@progress/kendo-react-form';
import { TextArea } from '@progress/kendo-react-inputs';
import { TextAreaBlurEvent } from '@progress/kendo-react-inputs/dist/npm/textarea/interfaces/TextAreaBlurEvent';
import { Field, useFormikContext } from 'formik';
import React, { useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FB } from '../../form.builder';
import { FBInputProps } from '../../form.builder/FBInput/FBInput.types';

type KendoTextEditorProps =
& FBInputProps
& {
  editorReference?: HTMLInputElement
  formValue?: string
  defaultValue?: string
  masked?: boolean
  isPreview?: boolean
  shouldNotAutosaveOnBlur?: boolean
};

const KendoTextEditor: React.FunctionComponent<KendoTextEditorProps> = ({
  isPreview,
  formValue = '',
  disabled,
  name = 'justificationOfChange',
  label,
  defaultValue,
}) => {
  // const formattedFormValue = formValue?.replace(/<[^\/>]*>([\s]?)*<\/[^>]*>/g, '<p><br></p>');
  // const classes = styles();
  /* <div className={classes.marginBStyle}
            style={{ width: '100%', height: '100%' }}
            dangerouslySetInnerHTML={{ __html: formattedFormValue }}
          /> */
  console.log('MDF', name);
  const { formState } = FB.useStores();
  const formik = useFormikContext();
  defaultValue = defaultValue || formState?.getFieldValue(name);
  const [textEditorValue, setTextEditorValue] = useState<string>(defaultValue);

  const onBlur = (evt: TextAreaBlurEvent) => {
    if (!name) { return; }
    const updatedValue = evt?.target?.element?.current?.value;
    if (updatedValue) {
      formik.setFieldValue(name, updatedValue);
    formState?.setFieldValue(name, updatedValue);
    setTextEditorValue(updatedValue);
    }
  };

  return (
    <Field
      id={name}
      type="textfield"
      name={name}
      label={label}
      component={(() => <FieldWrapper>
        <div className="k-form-field-wrap">
          <TextArea
            defaultValue={textEditorValue}
            onBlur={onBlur}
            style={{ width: '100%' }}
            rows={4}
          />
        </div>
      </FieldWrapper>)}
      defaultVal={textEditorValue}
    />);
};

export default KendoTextEditor;

import { TextArea } from '@progress/kendo-react-inputs';
import { TextAreaBlurEvent } from '@progress/kendo-react-inputs/dist/npm/textarea/interfaces/TextAreaBlurEvent';
import { Field, useFormikContext } from 'formik';
import React, { useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useIntl } from 'react-intl';
import { translate } from '../../../common/intl';
import { FB } from '../../form.builder';
import { FBInputProps } from '../../form.builder/FBInput/FBInput.types';
import styles from './KendoTextEditor.styles';

type KendoTextEditorProps =
& FBInputProps
& {
  name: string
  label: string
  defaultValue?: string
};

const KendoTextEditor: React.FunctionComponent<KendoTextEditorProps> = ({
  name = 'justificationOfChange',
  label,
  defaultValue,
}) => {
  const { formState } = FB.useStores();
  const formik = useFormikContext();
  const intl = useIntl();
  defaultValue = (defaultValue ?? formState?.getFieldValue(name)) as string;
  const [textEditorValue, setTextEditorValue] = useState<string>(defaultValue);
  const classes = styles();

  const onBlur = (evt: TextAreaBlurEvent) => {
    if (!name) { return; }
    const updatedValue = evt?.target?.element?.current?.value ?? '';
    formik.setFieldValue(name, updatedValue);
    formState?.setFieldValue(name, updatedValue);
    setTextEditorValue(updatedValue);
  };

  return (
    <Field
      id={name}
      type="textarea"
      name={name}
      label={label}
      required={true}
      component={(() => <>
        <TextArea
          defaultValue={textEditorValue}
          onBlur={onBlur}
          className={classes.textArea}
          rows={4}
        />
        {!textEditorValue && <span className={classes.error}>
          <p>{intl.formatMessage({ id: 'change.request.name.required' }, { name: translate(label) })}</p>
        </span>}
      </>)}
      defaultVal={textEditorValue}
    />);
};

export default KendoTextEditor;

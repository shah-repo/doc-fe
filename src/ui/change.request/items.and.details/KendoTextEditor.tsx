import { TextArea } from '@progress/kendo-react-inputs';
import { TextAreaBlurEvent } from '@progress/kendo-react-inputs/dist/npm/textarea/interfaces/TextAreaBlurEvent';
import { Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
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
  const classes = styles();

  const onBlur = (evt: TextAreaBlurEvent) => {
    if (!name) { return; }
    const updatedValue = evt?.target?.element?.current?.value ?? '';
    formik.setFieldValue(name, updatedValue);
    formState?.setFieldValue(name, updatedValue);
  };

  const textEditorRenderComponent = ({ field }: FieldProps) => {
    const defaultVal = (field?.value ?? defaultValue) as string;
    return (<>
      <TextArea
        defaultValue={defaultVal}
        onBlur={onBlur}
        className={classes.textArea}
        rows={4}
      />
      {!defaultVal && <span className={classes.error}>
        <p>{intl.formatMessage({ id: 'change.request.name.required' }, { name: translate(label) })}</p>
      </span>}
    </>);
  };

  return (
    <Field
      id={name}
      type="textarea"
      name={name}
      label={label}
      required
      component={textEditorRenderComponent}
      defaultVal={defaultValue as string}
    />);
};

export default KendoTextEditor;

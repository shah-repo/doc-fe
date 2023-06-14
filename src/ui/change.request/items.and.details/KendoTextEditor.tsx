import TextareaAutosize from '@material-ui/core/TextareaAutosize';
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
  const maxAutoRowExpandSize = 4;
  defaultValue = (defaultValue ?? formState?.getFieldValue(name)) as string;
  const classes = styles();

  const onBlur = (evt) => {
    if (!name) { return; }
    const updatedValue = (evt?.currentTarget?.value ?? '') as string;
    formik.setFieldValue(name, updatedValue);
    formState?.setFieldValue(name, updatedValue);
  };

  const textEditorRenderComponent = ({ field }: FieldProps) => {
    const value = (defaultValue ?? field?.value) as string;
    return (<>
      <TextareaAutosize
        defaultValue={value}
        onBlur={onBlur}
        className={classes.textArea}
        rowsMax={maxAutoRowExpandSize}
      />
      {!value && <p className={classes.error}>
        <span>{intl.formatMessage({ id: 'change.request.name.required' }, { name: translate(label) })}</span>
      </p>}
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

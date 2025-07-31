import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Field, FieldProps, useFormikContext } from 'formik';
import React, { ChangeEvent, FocusEvent, useEffect } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
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
  placeholder,
}) => {
  const { formState } = FB.useStores();
  const formik = useFormikContext();
  const maxAutoRowExpandSize = 4;
  const fieldValue = (defaultValue ?? formState?.getFieldValue(name)) as string;
  const classes = styles();

  useEffect(formik.resetForm, []);

  const updateFieldValues = (
    event: ChangeEvent<HTMLTextAreaElement> | FocusEvent<HTMLTextAreaElement>,
    updateFormik: boolean,
  ) => {
    if (!name) return;

    const updatedValue = event?.currentTarget?.value ?? '';

    formState?.setFieldValue(name, updatedValue);
    if (updateFormik) {
      formik.setFieldValue(name, updatedValue);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => updateFieldValues(event, false);
  const handleInputBlur = (event: FocusEvent<HTMLTextAreaElement>) => updateFieldValues(event, true);

  const textEditorRenderComponent = ({ field }: FieldProps) => {
    const value = fieldValue ?? field?.value;
    return (<>
      <TextareaAutosize
        defaultValue={value}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        className={classes.textArea}
        data-cy={name}
        name={name}
        rowsMax={maxAutoRowExpandSize}
        placeholder={translate(placeholder)}
      />
    </>);
  };

  return (
    <Field
      id={name}
      type="textarea"
      name={name}
      label={label}
      component={textEditorRenderComponent}
      defaultVal={fieldValue}
    />);
};

export default KendoTextEditor;

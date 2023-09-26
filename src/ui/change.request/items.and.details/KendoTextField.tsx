import { Field, FieldProps } from 'formik';
import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useIntl } from 'react-intl';
import { translate } from '../../../common/intl';
import { TextField } from '../../components/forms/fields-next';
import { FBInputProps } from '../../form.builder/FBInput/FBInput.types';
import styles from './KendoTextEditor.styles';

type KendoTextFieldProps =
  & FBInputProps
  & {
    name: string
    label: string
    defaultValue?: string
  };

const KendoTextField: React.FunctionComponent<KendoTextFieldProps> = ({
  name,
  label,
  defaultValue,
}) => {
  const intl = useIntl();
  const classes = styles();
  const textFieldRenderComponent = ({ field }: FieldProps) => {
    const value = field?.value;
    return (<>
      <TextField
        autosize
        name={name}
        defaultValue={value}
        placeholder={translate('form.builder.enter')}
        data-cy={name}
      />
      {!value && <p className={classes.error}>
        <span>{intl.formatMessage({ id: 'change.request.name.required' }, { name: translate(label) })}</span>
      </p>}
    </>
    );
  };

  return (
    <Field
      id={name}
      type="textarea"
      name={name}
      label={label}
      required
      component={textFieldRenderComponent}
      defaultVal={defaultValue}
    />);
};

export default KendoTextField;

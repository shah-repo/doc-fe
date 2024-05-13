import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../common/intl';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { CustomTemplateProps, EditableTrainee } from '../types';

interface OptionItem {
  id: string
  active: boolean
}

interface Props<T extends OptionItem> extends CustomTemplateProps {
  options: T[]
  getOptionLabel: (item: T) => string
  getOptionDisabled?: (item: T) => boolean
  getValue: (item?: T) => any
  getKey: (item?: EditableTrainee) => string
  renderStoredValue: () => React.ReactNode
}

const getOptionDisabled = (option: OptionItem) => !option.active;

const Editor = <T extends OptionItem>(props: Props<T>): JSX.Element => {
  const { field, options, column: { title }, getOptionLabel, getValue, getKey } = props;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, setFieldValue, getFieldProps, errors } = useFormikContext<EditableTrainee>();

  const handleChange = (event: ChangeEvent<unknown>, value: T) => {
    setFieldValue(field, getValue(value));
  };

  const value = options?.find(item => item.id === getKey(values[field]));

  return (
    <FormikField name={field} error={get(errors, field)}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        placeholder={translate(title)}
        blurOnSelect
        disableClearable
        options={options}
        value={value}
        getOptionLabel={getOptionLabel}
        getOptionDisabled={props.getOptionDisabled ?? getOptionDisabled}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const AutocompleteCellTemplate = <T extends OptionItem>(props: Props<T>): JSX.Element => {
  const { dataItem, onClick, column, renderStoredValue } = props;
  const { editable } = column;
  const mode = get(dataItem, MODE_FIELD);
  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  if (canBeModified) {
    return <Editor {...props} />;
  }

  const handleClick = () => {
    onClick?.({ dataItem });
  };

  return (
    <div onClick={handleClick}>
      {renderStoredValue()}
    </div>
  );
};

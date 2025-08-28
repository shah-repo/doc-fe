import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { Autocomplete, FormikField } from '../../../../../../forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER, Mode, MODE_FIELD } from '../../../../../../KendoDataGrid/constants';
import OverflowContent from '../../../../../../OverflowContent';
import { CustomTemplateProps, EditableScanLot } from '../types';

interface Props extends CustomTemplateProps {
  options: string[]
}

const Editor: React.FC<Props> = ({ dataItem, field, options }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, setFieldValue, getFieldProps } = useFormikContext<EditableScanLot>();

  const handleChange = (event: ChangeEvent<unknown>, value?: string) => {
    setFieldValue(field, value);
  };

  const value = values[field] as string;

  return (
    <FormikField
      name={field}
    >
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        blurOnSelect
        options={options}
        onChange={handleChange}
        value={value}
        size="small"
        disabled
      />
    </FormikField>
  );
};

export const UnitsCellTemplate: React.FC<Props> = (props) => {
  const { dataItem, field, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });

  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <OverflowContent onClick={handleClick}>
      {displayValue}
    </OverflowContent>
  );
};

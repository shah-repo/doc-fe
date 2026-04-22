import { useFormikContext } from 'formik';
import React from 'react';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../components/OverflowContent';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();

  return (
    <FormikField name={field}>
      <TextField
        {...getFieldProps(field)}
        defaultValue={undefined}
        type="text"
        size="small"
      />
    </FormikField>
  );
};

export const TextFieldCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const mode = dataItem[MODE_FIELD];
  const value = dataItem[field] ?? EMPTY_VALUE_PLACEHOLDER;

  if ([Mode.add, Mode.edit].includes(mode)) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });

  return (
    <OverflowContent key={`${field}-${mode}-${value}`} onClick={handleClick}>
      {value}
    </OverflowContent>
  );
};

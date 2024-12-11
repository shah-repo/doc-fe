import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../components/OverflowContent';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomSiteTemplateProps } from '../types';

const Editor: React.FC<CustomSiteTemplateProps> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();
  const isNumberField = field === 'zipCode';

  return (
    <FormikField
      name={field}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={undefined}
        type={isNumberField ? 'number' : 'text'}
        size="small"
      />
    </FormikField>
  );
};

export const TextFieldCellTemplate: React.FC<CustomSiteTemplateProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const isEditMode = dataItem[MODE_FIELD] && [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

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

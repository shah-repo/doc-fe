import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { FormikField, TextField } from '../../../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../../../components/KendoDataGrid/constants';
import { EMPTY_VALUE_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../interface';
import OverflowingContent from '../OveflowContent';

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();

  return (
    <FormikField
      name={field}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={undefined}
        type="text"
        size="small"
      />
    </FormikField>
  );
};

export const TextInputCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });

  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <OverflowingContent onClick={handleClick}>
      {displayValue}
    </OverflowingContent>
  );
};

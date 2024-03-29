import { useFormikContext } from 'formik';
import React from 'react';
import {
  FormikField,
  TextField,
} from '../../../../components/forms/fields-next';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { EMPTY_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../types';

export const QuantityCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
  onClick,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const defaultValue = dataItem[field];

  const handleClick = () => {
    onClick?.({ dataItem });
  };

  if (isEditMode) {
    const { getFieldProps } = useFormikContext();
    return (
      <FormikField name={field}>
        <TextField
          {...getFieldProps(field)}
          defaultValue={undefined}
          type="number"
          inputProps={{ min: 0 }}
          size="small"
        />
      </FormikField>
    );
  }

  return (
    <>
      {defaultValue ? (
        <OverflowTooltip
          title={defaultValue}
          onClick={handleClick}
          placement="top"
          interactive
          arrow
        >
          {defaultValue}
        </OverflowTooltip>
      ) : (
        EMPTY_PLACEHOLDER
      )}
    </>
  );
};

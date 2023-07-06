import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, DocumentRevisionOption, EditableLotTransfer } from '../types';
import { getOptionLabel } from '../utils';

interface Props extends CustomTemplateProps {
  options?: DocumentRevisionOption[]
}

export const ReferencesCellTemplate: React.FC<Props> = ({ dataItem, options, onClick }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLotTransfer>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, reference?: DocumentRevisionOption) => {
    const value = reference ? {
      id: reference.id,
      docId: reference.document.docId,
    } : undefined;

    setFieldValue('reference', value);
  };

  const defaultValue = isEditMode ? values.reference?.id : dataItem.reference?.id;
  const value = options?.find((reference) => reference.id === defaultValue);

  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (
      <FormikField
        name="reference"
      >
        <Autocomplete
          {...getFieldProps('reference')}
          blurOnSelect
          options={options}
          getOptionLabel={getOptionLabel}
          value={value}
          onChange={handleChange}
          size="small"
        />
      </FormikField>
    );
  }

  const displayValue = value ? getOptionLabel(value) : EMPTY_VALUE_PLACEHOLDER;

  return (
    <Box onClick={() => onClick?.({ dataItem })}>
      <OverflowTooltip
        title={displayValue}
        placement="top"
        onClick={() => onClick?.({ dataItem })}
        interactive
        arrow
      >
        {displayValue}
      </OverflowTooltip>
    </Box>
  );
};

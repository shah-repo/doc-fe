import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../common/intl';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { ArrayElement, CustomTemplateProps, EditableLotTransfer, LotTransferType } from '../types';

const options = Object.values(LotTransferType).map((value) => ({
  value,
  label: translate(`form.builder.lot.transfers.type.${value}`),
}));

export const TransferTypeCellTemplate: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLotTransfer>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: ArrayElement<typeof options>) => {
    setFieldValue(field, value?.value);
  };

  const defaultValue = isEditMode ? values.type : dataItem.type;
  const value = options.find((option) => option.value === defaultValue);

  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (
      <FormikField
        name={field}
        required
      >
        <Autocomplete
          {...getFieldProps(field)}
          blurOnSelect
          disableClearable
          options={options}
          value={value}
          getOptionLabel={(option: ArrayElement<typeof options>) => option.label}
          onChange={handleChange}
          size="small"
        />
      </FormikField>
    );
  }

  return <>{value?.label}</>;
};

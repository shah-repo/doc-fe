import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
import { EditableVendorData, VendorOption } from '../types';

interface Props extends CellTemplateProps<EditableVendorData> {
  vendors?: VendorOption[]
}

const getOptionLabel = (option: VendorOption) => {
  return option.name;
};

export const SupplierCellTemplate: React.FC<Props> = ({ dataItem, field, vendors }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableVendorData>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, vendor?: VendorOption) => {
    const value = vendor?.name ? {
      id: vendor.id,
      name: vendor.name,
      status: vendor.status,
    } : undefined;
    setFieldValue(field, value);
  };

  const defaultValue = isEditMode ? values.supplier : dataItem.supplier;
  const value = vendors?.find((vendor) => vendor.name === defaultValue);

  if (isEditMode) {
    return (
      <FormikField
        name={field}
      >
        <Autocomplete
          {...getFieldProps(field)}
          blurOnSelect
          disableClearable
          options={vendors}
          getOptionLabel={getOptionLabel}
          value={value}
          onChange={handleChange}
          size="small"
        />
      </FormikField>
    );
  }
  return <>{dataItem.supplier}</>;
};

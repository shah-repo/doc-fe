import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Autocomplete } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
import { EditableVendorData, VendorOption } from '../types';

interface Props extends CellTemplateProps<EditableVendorData> {
  vendors?: VendorOption[]
}

const getOptionLabel = (option: VendorOption) => {
  return option.name;
};

export const SupplierCellTemplate: React.FC<Props> = ({ dataItem, vendors }) => {
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableVendorData>();

  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  // const isPrimaryVendor = <FBTooltip
  //   title="Primary Vendor"
  // >
  //   {dataItem.supplier === 'ProtoLabs' ? <div style={{ height: 10, width: 10, borderRadius: '50%', backgroundColor: Colors.dodger_blue, marginRight: 8 }} /> : ''}
  // </FBTooltip>;

  const handleChange = (event: ChangeEvent<unknown>, vendor?: VendorOption) => {
    const value = vendor ? {
      id: vendor.id,
      docId: vendor.document.docId,
    } : undefined;
    setFieldValue('vendor', value);
  };

  const defaultValue = isEditMode ? values.vendor?.id : dataItem.vendor?.id;
  const value = vendors?.find((vendor) => vendor.id === defaultValue);
  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (

      <Autocomplete
        {...getFieldProps('vendor')}
        blurOnSelect
        options={vendors}
        getOptionLabel={getOptionLabel}
        value={value}
        onChange={handleChange}
        size="small"
      />
    );
  }
  return <>{value ? getOptionLabel(value) : dataItem.vendor}</>;
};

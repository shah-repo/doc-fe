import React from 'react';
import { FBTooltip } from '../..';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Autocomplete } from '../../../components/forms/fields-next';
import Colors from '../../../layout/theme/utils/colors';
import { MODE_FIELD, Mode } from '../constants';
import { EditableVendorData, VendorData } from '../types';
import { getVendorData } from '../utils';

interface Props extends CellTemplateProps<EditableVendorData> {}

export const SupplierCellTemplate: React.FC<Props> = ({ dataItem }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const isPrimaryVendor = <FBTooltip
    title="Primary Vendor"
  >
    {dataItem.supplier === 'ProtoLabs' ? <div style={{ height: 10, width: 10, borderRadius: '50%', backgroundColor: Colors.dodger_blue, marginRight: 8 }} /> : ''}
  </FBTooltip>;

  if (isEditMode) {
    const options = getVendorData().map((item: VendorData) => item.supplier);
    console.log('dataItem.supplier', dataItem.supplier);

    return (<div style={{ display: 'flex', alignItems: 'center' }}>
      <>{isPrimaryVendor}</>
      <Autocomplete
        style={{ width: '100%' }}
        options={options}
        value={dataItem.supplier}
        size="small"
      />
    </div>
    );
  }

  return <div style={{ display: 'flex', alignItems: 'center' }}>
    <>{isPrimaryVendor}</>
    {dataItem.supplier}
  </div>;
};

import { Box, Radio } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../constants';
import { EditableVendorData } from '../types';

interface Props extends CellTemplateProps<EditableVendorData> {
  setPrimaryVendorId: React.Dispatch<React.SetStateAction<any>>
}

export const PrimarySupplierCellTemplate: React.FC<Props> = ({
  field,
  dataIndex,
  dataItem,
  onChange,
  setPrimaryVendorId,
}) => {
  const [isPrimarySupplier, setIsPrimarySupplier] = useState<boolean>(dataItem.primary);

  const isEditMode = dataItem[MODE_FIELD] === Mode.add || dataItem[MODE_FIELD] === Mode.edit;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setPrimaryVendorId(newValue);
    if (onChange) {
      onChange({
        dataItem,
        dataIndex,
        syntheticEvent: event,
        field,
        value: newValue,
      });
    }
  };

  useEffect(() => {
    // This useEffect will update the isPrimarySupplier state whenever the dataItem changes.
    setIsPrimarySupplier(dataItem.primary);
  }, [dataItem.primary]);

  return (
    <Box style={{ display: 'flex', justifyContent: 'center' }}>
      {isEditMode ? (
        <Radio
          checked={isPrimarySupplier}
          onChange={handleChange}
          color="primary"
          value={dataItem.supplier}
          name={`primary-supplier-${dataIndex}`}
        />
      ) : (
        <Radio
          checked={isPrimarySupplier}
          color="primary"
          value={dataItem.supplier}
          name={`primary-supplier-${dataIndex}`}
          disabled
        />
      )}
    </Box>
  );
};

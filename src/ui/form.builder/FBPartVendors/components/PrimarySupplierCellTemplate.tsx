import { Box, Radio } from '@material-ui/core';
import React from 'react';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { CustomTemplateProps } from '../types';

interface Props extends CustomTemplateProps {
  setPrimaryVendor?: (id: string) => void
  isActive: boolean
  isInEditMode: boolean
}

export const PrimarySupplierCellTemplate: React.FC<Props> = ({
  dataIndex,
  dataItem,
  isActive,
  isInEditMode,
  setPrimaryVendor,
}) => {
  const isEditMode = dataItem[MODE_FIELD] === Mode.add || dataItem[MODE_FIELD] === Mode.edit;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;
    if (id && setPrimaryVendor) {
      setPrimaryVendor(id);
    }
  };

  return (
    <Box style={{ display: 'flex', justifyContent: 'center' }}>
      <Radio
        checked={dataItem.primary}
        color="primary"
        size="small"
        value={dataItem.id}
        name={`primary-supplier-${dataIndex}`}
        onChange={handleChange}
        disabled={!isActive || (isInEditMode && !isEditMode)}
      />
    </Box>
  );
};

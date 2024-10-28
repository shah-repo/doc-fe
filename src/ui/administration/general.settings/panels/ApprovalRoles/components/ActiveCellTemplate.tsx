import { Box } from '@material-ui/core';
import React from 'react';
import { Checkbox } from '../../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { EditableApprovalRoles } from '../types';

const ActiveCellTemplate: React.FC<CellTemplateProps<EditableApprovalRoles>> = ({ dataItem, dataIndex, onChange }) => {
  const isAddMode = Mode.add === dataItem[MODE_FIELD];
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  return (
    <Box display="flex" justifyContent="center" marginTop={ isEditMode ? '4px' : '' }>
      <Checkbox
        checked={dataItem.isActive}
        disabled={isAddMode}
        onChange={(event) => onChange?.({ dataItem, dataIndex, syntheticEvent: event })}
      />
    </Box>
  );
};

export default ActiveCellTemplate;

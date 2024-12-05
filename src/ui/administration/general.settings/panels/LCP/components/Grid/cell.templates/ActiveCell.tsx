import { Box } from '@material-ui/core';
import React from 'react';
import { Checkbox } from '../../../../../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { CustomGroupOptions, LCP } from '../types';
import { getCellDataCyBasedOnParentDocType } from '../utils';

interface ActiveCellProps extends CellTemplateProps<LCP> {
  hasEditLCPPermission?: boolean
  selectedPartGroups: CustomGroupOptions[]
}

export const ActiveCell: React.FC<ActiveCellProps> = ({ dataItem, colSpan, style, field, dataIndex, hasEditLCPPermission, selectedPartGroups, className, onChange }) => {
  const dataCy = React.useMemo(
    () =>
      getCellDataCyBasedOnParentDocType(
        selectedPartGroups,
        dataItem.documentTypeId,
        field,
        dataItem.internalType,
      ),
    [selectedPartGroups, dataItem, field],
  );

  const handleChange = (event, checked: boolean) => {
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: event.syntheticEvent,
      field,
      value: checked,
    });
  };

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-cy={`${dataCy}td`}
    >
      <Box display="flex" justifyContent="center">
        <Checkbox
          checked={dataItem.isActive}
          disabled={!hasEditLCPPermission || dataItem?.isGroupDeactivated}
          onChange={handleChange}
          data-cy={`${dataCy}field`}
        />
      </Box>
    </td>
  );
};

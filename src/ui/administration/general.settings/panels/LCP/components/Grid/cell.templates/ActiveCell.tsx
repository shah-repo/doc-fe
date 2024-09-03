import { Box } from '@material-ui/core';
import { kebabCase } from 'lodash';
import React from 'react';
import { Checkbox } from '../../../../../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { CustomGroupOptions, LCP } from '../types';

interface ActiveCellProps extends CellTemplateProps<LCP> {
  hasEditLCPPermission?: boolean
  selectedPartGroups: CustomGroupOptions[]
}

export const ActiveCell: React.FC<ActiveCellProps> = ({ dataItem, colSpan, style, field, dataIndex, hasEditLCPPermission, selectedPartGroups, className, onChange }) => {
  const selectedGroup = selectedPartGroups?.find((group: CustomGroupOptions) => dataItem.documentTypeId === group.value);
  const dataCy = `${selectedGroup?.docTypeAcronym}${dataItem?.internalType}-select`;

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
      data-cy={`${kebabCase(field)}-td`}
    >
      <Box display="flex" justifyContent="center">
        <Checkbox
          checked={dataItem.isActive}
          disabled={!hasEditLCPPermission || dataItem?.isGroupDeactivated}
          onChange={handleChange}
          data-cy={dataCy}
        />
      </Box>
    </td>
  );
};

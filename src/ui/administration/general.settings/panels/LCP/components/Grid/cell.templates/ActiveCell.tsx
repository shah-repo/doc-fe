import { Box } from '@material-ui/core';
import { kebabCase } from 'lodash';
import React from 'react';
import { Checkbox } from '../../../../../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { LCP } from '../types';

interface ActiveCellProps extends CellTemplateProps<LCP> {
  hasEditLCPPermission?: boolean
}

export const ActiveCell: React.FC<ActiveCellProps> = ({ dataItem, colSpan, style, field, dataIndex, hasEditLCPPermission, className, onChange }) => {
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
          disabled={!hasEditLCPPermission}
          onChange={handleChange}
        />
      </Box>
    </td>
  );
};

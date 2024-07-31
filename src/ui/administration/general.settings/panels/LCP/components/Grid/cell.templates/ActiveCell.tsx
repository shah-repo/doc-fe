import { Box } from '@material-ui/core';
import { kebabCase } from 'lodash';
import React from 'react';
import { Checkbox } from '../../../../../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { LCP } from '../types';

export const ActiveCell: React.FC<CellTemplateProps<LCP>> = ({ dataItem, colSpan, style, field, dataIndex, className, onChange }) => {
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
          onChange={handleChange}
        />
      </Box>
    </td>
  );
};

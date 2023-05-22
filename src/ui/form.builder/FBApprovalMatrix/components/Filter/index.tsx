import React from 'react';
import { Box } from '@material-ui/core';
import { kebabCase } from 'lodash';
import { GridFilterCellProps } from '@progress/kendo-react-grid';

const Filter: React.FC<GridFilterCellProps> = (props) => {
  const { field, children } = props;

  return (
    <Box className="k-filtercell" data-cy={`filter-${kebabCase(field)}`}>
      {children}
    </Box>
  );
};

export default Filter;

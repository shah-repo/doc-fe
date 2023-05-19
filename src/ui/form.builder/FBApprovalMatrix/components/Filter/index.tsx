import React from 'react';
import { kebabCase } from 'lodash';
import { GridFilterCellProps } from '@progress/kendo-react-grid';

const Filter: React.FC<GridFilterCellProps> = (props) => {
  const { field, children } = props;

  return (
    <div className="k-filtercell" data-cy={`filter-${kebabCase(field)}`}>
      {children}
    </div>
  );
};

export default Filter;

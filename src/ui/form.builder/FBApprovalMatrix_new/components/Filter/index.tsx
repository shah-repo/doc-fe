import React from 'react';
import { GridFilterCellProps } from '@progress/kendo-react-grid';

const Filter: React.FC<GridFilterCellProps> = (props) => {
  const { field, children } = props;

  return (
    <div className="k-filtercell" data-cy={`filter.${field ?? ''}`}>
      {children}
    </div>
  );
};

export default Filter;

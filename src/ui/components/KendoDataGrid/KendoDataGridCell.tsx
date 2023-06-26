import { GridCell, GridCellProps } from '@progress/kendo-react-grid';
import React from 'react';

const KendoDataGridCell: React.FC<GridCellProps> = ({ children, ...props }) => (
  <GridCell
    {...props}
    render={(element, props) => {
      if (React.isValidElement(element)) {
        return React.cloneElement(element, {}, children);
      }
      return element;
    }}
  />
);

export default KendoDataGridCell;

import { GridCell, GridCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { PropsWithDataset } from '../../../common/types';

const KendoDataGridCell: React.FC<PropsWithDataset<GridCellProps>> = ({ children, onClick, ...props }) => (
  <GridCell
    {...props}
    render={(element, props) => {
      if (React.isValidElement(element)) {
        const enhancedProps = {
          ...element.props,
          onClick,
          'data-cy': String(props['data-cy']),
        };
        return React.cloneElement(element, enhancedProps, children);
      }
      return element;
    }}
  />
);

export default KendoDataGridCell;

import { Tooltip } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React, { memo } from 'react';
import { translate } from '../../../../../../common/intl';
import {
  ColumnMenuContext,
  CustomColumnMenu,
} from '../../../../../components/common/treelist/column.templates/CustomColumnMenu';

export const RevHeaderCell: React.FC<TreeListHeaderCellProps> = memo(
  (props) => {
    const { onLock, columns, onColumnShowHide, isMaximizedView }
      = React.useContext(ColumnMenuContext);
    const { field, title } = props;

    return (
      <span className="k-cell-inner">
        <span className="k-link">
          <span className="k-column-title">
            <Tooltip
              title={translate('allocation.rev.header.title')}
              placement="top"
              arrow
            >
              <span>{title}</span>
            </Tooltip>
          </span>
        </span>
        {!isMaximizedView && (
          <CustomColumnMenu
            {...{
              field,
              onLock,
              columns,
              onColumnShowHide,
            }}
          />
        )}
      </span>
    );
  },
);

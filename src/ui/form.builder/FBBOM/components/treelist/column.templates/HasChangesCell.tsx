import { Link } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import Tooltip from '../../../../../components/common/kendo/Tooltip';
import { CELL_EMPTY_VALUE } from '../constants';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const HasChangesCell: React.ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  openARIDQuickView,
  ...otherProps
}) => {
  const classes = styles({ hasChildren });
  const changeReqDetails = dataItem.availableRevisions?.changeRequestDetails;

  function render () {
    const arID = changeReqDetails?.crId;
    const isReleased = dataItem.availableRevisions?.isReleased;

    if (!dataItem.availableRevisions) {
      return CELL_EMPTY_VALUE;
    }

    if (isReleased) {
      return CELL_EMPTY_VALUE;
    }

    if (!changeReqDetails) {
      return dataItem.availableRevisions?.displayRevision;
    }

    return <Tooltip
      data={changeReqDetails?.title ?? ''}
      childrenElement={
        <Link
          underline="hover"
          onClick={() => openARIDQuickView?.(changeReqDetails?.id)}
          className={classes.link}
        >
          {arID}
        </Link>
      }
    />;
  }

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx('k-table-td', className, classes.cellborderBottom)}
      {...{
        'aria-colindex': otherProps.ariaColumnIndex,
        'data-grid-col-index': otherProps.colIndex,
        'aria-expanded': otherProps.expanded,
      }}
      data-cy="cell-has-changes"
    >
      <span className={classes.titleInfoCell}>
        {render()}
      </span>
    </td>
  );
};

export default HasChangesCell;

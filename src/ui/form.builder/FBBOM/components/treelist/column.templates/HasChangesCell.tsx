import { Link } from '@material-ui/core';
import cx from 'classnames';
import React, { ComponentType } from 'react';
import { useHistory } from 'react-router-dom';
import { changeRequestEditPath } from '../../../../../change.request/utils/paths';
import Tooltip from '../../../../../components/common/kendo/Tooltip';
import { CELL_EMPTY_VALUE } from '../constants';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const HasChangesCell: ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const history = useHistory();
  const classes = styles({ hasChildren });
  const changeReqDetails = dataItem.availableRevisions?.changeRequestDetails;
  const openARDetailsPage = () => {
    const id = changeReqDetails?.id;
    id && history.push(changeRequestEditPath(id));
  };

  function render () {
    if (!dataItem.availableRevisions) {
      return CELL_EMPTY_VALUE;
    }

    if (dataItem.availableRevisions?.isReleased) {
      return CELL_EMPTY_VALUE;
    }

    if (!changeReqDetails) {
      return dataItem.availableRevisions?.revision;
    }

    return <Tooltip
      data={changeReqDetails?.title ?? ''}
      childrenElement={
        <Link
          underline="hover"
          onClick={openARDetailsPage}
          className={classes.link}
        >
          {changeReqDetails?.crId}
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
    >
      <span className={classes.titleInfoCell}>
        {render()}
      </span>
    </td>
  );
};

export default HasChangesCell;

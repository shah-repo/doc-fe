import { Link } from '@material-ui/core';
import cx from 'classnames';
import React, { ComponentType } from 'react';
import { DocumentRevisionStatus } from '../../../../../../state/ducks/documentRevisions/types';
import Tooltip from '../../../../../components/common/kendo/Tooltip';
import { CELL_EMPTY_VALUE } from '../constants';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const ARIDCell: ComponentType<CustomTreeListCellProps> = ({
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
  const changeReqDetails = dataItem?.changeRequestDetails;
  const arID = changeReqDetails?.crId;
  const ArIdAllowedStatusList = [DocumentRevisionStatus.Approved, DocumentRevisionStatus.PendingChange, DocumentRevisionStatus.InReview];
  const isArIdVisible = ArIdAllowedStatusList.includes(dataItem?.status);

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
      data-cy="cell-ar-id"
    >
      <span className={classes.Cell}>
        {arID && isArIdVisible && (
          <Tooltip
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
          />
        )}
        {(!arID || !isArIdVisible) && CELL_EMPTY_VALUE}
      </span>
    </td>
  );
};

export default ARIDCell;

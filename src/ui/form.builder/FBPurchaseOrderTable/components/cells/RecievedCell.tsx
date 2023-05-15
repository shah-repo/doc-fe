import { CircularProgress } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { FBPurchaseOrderItem } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';
import useStyles from '../../styles';
import ContentCell from './ContentCell';

const RecievedCell: CellComponent<FBPurchaseOrderItem, { loading?: boolean }> = ({
  dataItem,
  loading,
  ...props
}) => {
  const classes = useStyles();

  return (
    <ContentCell
      {...props}
      dataItem={dataItem}
      className={cx({ [classes.nullValue]: !dataItem?.received })}
    >
      {loading ? <CircularProgress size={12} /> : dataItem.received}
    </ContentCell>
  );
};

export default RecievedCell;

import cx from 'classnames';
import moment from 'moment';
import React, { useMemo } from 'react';
import { MomentFormats, useDate } from '../../../../../common/utils/date';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import FBAutocompleteAsyncStore from '../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { getValidDueDate } from '../../../FBEquipmentTable/components/treelist/utils';
import { CustomTreeListCellProps } from '../types';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';

export const DateCell: React.FC<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem, onClick } = props;
  const classes = styles();
  const { timezone } = useDate();
  const updatedDate = getValidDueDate(dataItem[field]);
  const lotId = dataItem?.lotId ?? '';

  const storedLot = useMemo(() => {
    if (!lotId) return null;

    return FBAutocompleteAsyncStore.getValue<DocumentRevision>(FBAutocompleteAsyncOption.ebLots, lotId);
  }, [lotId]);

  const expiryDate = storedLot?.precalc?.lot_expiry_date ?? '';

  const isExpired = useMemo(() => {
    if (!expiryDate) return false;

    const expiryDateInMs = moment.tz(expiryDate, MomentFormats.YearMonthDateDash, timezone).add(1, 'day').valueOf();

    const currentDateInMs = moment().tz(timezone).valueOf();

    return expiryDateInMs < currentDateInMs;
  }, [expiryDate, timezone]);

  return (
    <TreeListCellWrapper {...props}>
      {expiryDate && (
        <OverflowTooltip title={updatedDate} placement="top" onClick={() => onClick?.({ dataItem })} interactive arrow>
          <span className={cx(classes.Cell, { [classes.expired]: isExpired })}>{expiryDate}</span>
        </OverflowTooltip>
      )}
    </TreeListCellWrapper>
  );
};

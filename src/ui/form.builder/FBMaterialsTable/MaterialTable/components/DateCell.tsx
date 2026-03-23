import cx from 'classnames';
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
import { isDateExpired } from './utils';

export const DateCell: React.FC<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem, onClick } = props;
  const classes = styles();
  const { formatDisplayDate } = useDate();
  const updatedDate = getValidDueDate(dataItem[field]);
  const lotId = dataItem?.lotId ?? '';

  const { expiryDate, isExpired } = useMemo(() => {
    if (!lotId) return { expiryDate: '', isExpired: false };

    const lot = FBAutocompleteAsyncStore.getValue<DocumentRevision>(FBAutocompleteAsyncOption.ebLots, lotId);
    const expiryDate = lot?.precalc?.lot_expiry_date ?? '';
    return {
      expiryDate,
      isExpired: isDateExpired(expiryDate),
    };
  }, [lotId]);

  return (
    <TreeListCellWrapper {...props}>
      {expiryDate && (
        <OverflowTooltip title={updatedDate} placement="top" onClick={() => onClick?.({ dataItem })} interactive arrow>
          <span className={cx(classes.Cell, { [classes.expired]: isExpired })}>{formatDisplayDate(expiryDate, MomentFormats.MonthDateYear)}</span>
        </OverflowTooltip>
      )}
    </TreeListCellWrapper>
  );
};

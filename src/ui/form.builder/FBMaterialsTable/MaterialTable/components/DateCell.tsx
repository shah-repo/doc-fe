import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import FBAutocompleteAsyncStore from '../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { getValidDueDate, isDateOverdue } from '../../../FBEquipmentTable/components/treelist/utils';
import { CustomTreeListCellProps } from '../types';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';

export const DateCell: React.FC<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem, onClick } = props;
  const isExpired = dataItem[field] ? isDateOverdue(dataItem[field]) : false;
  const updatedDate = getValidDueDate(dataItem[field]);
  const classes = styles();

  const lotId = useMemo(
    () => dataItem?.lotId ?? '',
    [dataItem?.lotId],
  );

  const storedLot = useMemo(() => {
    if (!lotId) return null;

    return FBAutocompleteAsyncStore.getValue<DocumentRevision>(
      FBAutocompleteAsyncOption.ebLots,
      lotId,
    );
  }, [lotId]);

  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    if (!storedLot) return;

    setExpiryDate(storedLot?.precalc?.lot_part ?? '');
  }, [storedLot]);

  console.log('expiryDate', expiryDate);

  return (
    <TreeListCellWrapper {...props}>
      <OverflowTooltip
        title={updatedDate}
        placement="top"
        onClick={() => onClick?.({ dataItem })}
        interactive
        arrow
      >
        <span className={cx(classes.Cell, { [classes.expired]: isExpired })}>{expiryDate}</span>
        {isExpired && (<span>
          <FontAwesomeIcon
            size="lg"
            className={cx(classes.expired, classes.expiredIcon)}
            icon={ solid('circle-exclamation')}
          />
        </span>)}
      </OverflowTooltip>
    </TreeListCellWrapper>
  );
};

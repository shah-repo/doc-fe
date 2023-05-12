import React from 'react';
import { translate } from '../../../../../common/intl';
import DropdownFilter from '../DropdownFilter';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { DATA_ITEM_KEY, TEXT_FIELD } from '../Grid';

const StatusFilter: React.FC<GridFilterCellProps> = (props) => {
  return (
    <DropdownFilter
      {...props}
      data={[
        { [DATA_ITEM_KEY]: true, [TEXT_FIELD]: translate('common.active') },
        { [DATA_ITEM_KEY]: false, [TEXT_FIELD]: translate('common.inactive') },
      ]}
      defaultItem={{ [DATA_ITEM_KEY]: '', [TEXT_FIELD]: translate('common.all') }}
    />
  );
};

export default StatusFilter;

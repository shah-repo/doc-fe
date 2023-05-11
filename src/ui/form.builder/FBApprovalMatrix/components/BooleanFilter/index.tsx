import React from 'react';
import { translate } from '../../../../../common/intl';
import DropdownFilter from '../DropdownFilter';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { DATA_ITEM_KEY, TEXT_FIELD } from '../Grid';

const BooleanFilter: React.FC<GridFilterCellProps> = (props) => {
  return (
    <DropdownFilter
      {...props}
      data={[
        { [DATA_ITEM_KEY]: true, [TEXT_FIELD]: translate('common.true') },
        { [DATA_ITEM_KEY]: false, [TEXT_FIELD]: translate('common.false') },
      ]}
      defaultItem={{ [DATA_ITEM_KEY]: '', [TEXT_FIELD]: translate('common.all') }}
    />
  );
};

export default BooleanFilter;

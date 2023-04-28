import React from 'react';
import { translate } from '../../../../../common/intl';
import DropdownFilter from '../DropdownFilter';
import { GridFilterCellProps } from '@progress/kendo-react-grid';

const BooleanFilter: React.FC<GridFilterCellProps> = (props) => {
  return (
    <DropdownFilter
      {...props}
      data={[
        { value: true, text: translate('common.true') },
        { value: false, text: translate('common.false') },
      ]}
      defaultItem={{ value: '', text: translate('common.all') }}
    />
  );
};

export default BooleanFilter;

import React from 'react';
import { translate } from '../../../../../common/intl';
import DropdownFilter from '../DropdownFilter';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { createOption } from '../Grid';

const BooleanFilter: React.FC<GridFilterCellProps> = (props) => {
  return (
    <DropdownFilter
      {...props}
      data={[
        createOption(true, translate('common.true')),
        createOption(false, translate('common.false')),
      ]}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );
};

export default BooleanFilter;

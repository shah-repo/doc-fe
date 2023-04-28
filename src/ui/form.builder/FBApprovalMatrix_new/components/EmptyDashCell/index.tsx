import React from 'react';
import { get } from 'lodash';
import { CellProps } from '../../types';

const EmptyDashCell: React.FC<CellProps> = (props) => {
  const { dataItem, field } = props;

  const value = String(get(dataItem, field ?? ''));

  return (
    <div>
      {value || '-'}
    </div>
  );
};

export default EmptyDashCell;

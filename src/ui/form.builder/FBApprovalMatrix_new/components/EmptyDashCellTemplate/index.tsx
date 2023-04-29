import React from 'react';
import { get } from 'lodash';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export default function EmptyDashCellTemplate<T> (props: CellTemplateProps<T>): React.ReactNode {
  const { dataItem, field } = props;

  const value = String(get(dataItem, field ?? ''));

  return (
    <div>
      {value || '-'}
    </div>
  );
}

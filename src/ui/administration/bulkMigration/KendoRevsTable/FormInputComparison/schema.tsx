import React from 'react';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ISupplierScanResultRev } from '../../interface';
import { NewFormInputCellTemplate } from './components/NewFormInputCellTemplate';
import { OriginalFormInputCellTemplate } from './components/OriginalFormInputCellTemplate';

export const buildSchema = (): Array<ColumnDefinition<ISupplierScanResultRev>> => {
  return [
    {
      id: 'originalFormInput',
      field: 'originalFormInput',
      filterable: false,
      title: 'administration.bulk.migration.comparison.grid.heading.originalFormInput',
      template: (props) => <OriginalFormInputCellTemplate {...props} />,
      width: 350,
    },
    {
      id: 'newFormInput',
      field: 'newFormInput',
      title: 'administration.bulk.migration.comparison.grid.heading.newFormInput',
      filterable: false,
      template: (props) => <NewFormInputCellTemplate {...props} />,
      width: 350,
    },
  ];
};

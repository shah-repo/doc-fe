import React from 'react';
import { ColumnDefinition } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import InputFilter from '../../FBApprovalMatrix/components/InputFilter';
import GroupCellTemplate from './components/GroupCellTemplate';
import NameCellTemplate from './components/NameCellTemplate';
import { POApprovalMatrixLevelItem, RowClickEvent } from './types';

interface Options {
  signatureStages: number[]
  disableFilter?: boolean
  onRowClick?: (e: RowClickEvent) => void
}

export default function createSchema ({
  signatureStages,
  disableFilter,
  onRowClick,
}: Options): Array<ColumnDefinition<POApprovalMatrixLevelItem>> {
  const Filter = disableFilter ? undefined : InputFilter;

  const schema: Array<ColumnDefinition<POApprovalMatrixLevelItem>> = [
    {
      id: 'name',
      field: 'name',
      locked: true,
      title: 'form.builder.poam.level.name',
      filterCell: Filter,
      template: NameCellTemplate,
      width: 150,
    },
    {
      id: 'limit',
      field: 'limit',
      title: 'form.builder.poam.limit',
      filterCell: Filter,
      width: 120,
    },
    {
      id: 'threshold',
      field: 'threshold',
      title: 'form.builder.field.threshold',
      filterCell: Filter,
      width: 120,
    },
  ];

  signatureStages.forEach((stage) => {
    schema.push({
      id: `signature-${stage}`,
      field: `signatureStages.${stage}.list`,
      title: `form.builder.poam.signature${stage}`,
      filterCell: Filter,
      template: (props) => (
        <GroupCellTemplate
          {...props}
          stage={stage}
          onClick={onRowClick}
        />
      ),
      width: 300,
    });
  });

  return schema;
}

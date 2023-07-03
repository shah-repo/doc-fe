import { GridFilterCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { translate } from '../../../common/intl';
import { Employee } from '../../../state/ducks/company/types';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import DropdownFilter from '../FBApprovalMatrix/components/DropdownFilter';
import { createOption } from '../FBApprovalMatrix/components/Grid';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import { BuildCellTemplate } from './components/BuildCellTemplate';
import { CommentsCellTemplate } from './components/CommentsCellTemplate';
import { DateCellTemplate } from './components/DateCellTemplate';
import { EmployeeCellTemplate } from './components/EmployeeCellTemplate';
import { LocationCellTemplate } from './components/LocationCellTemplate';
import { QuantityCellTemplate } from './components/QuantityCellTemplate';
import { TransferTypeCellTemplate } from './components/TransferTypeCellTemplate';
import { TRANSFER_TYPE_OPTIONS } from './constants';
import { BuildOption, CompanyLocation, EditableLotTransfer, LotTranferEditEvent } from './types';

interface SchemaOptions {
  locations: CompanyLocation[]
  existingLocations: string[]
  employees: Employee[]
  builds: BuildOption[]
  onRowClick?: (e: LotTranferEditEvent) => void
}

export const buildSchema = ({
  locations,
  existingLocations = [],
  employees,
  builds,
  onRowClick,
}: SchemaOptions): Array<ColumnDefinition<EditableLotTransfer>> => {
  const transferTypeOptions = TRANSFER_TYPE_OPTIONS.map((option) => createOption(option.value, option.label));

  const TransferTypeFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={transferTypeOptions}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  const locationOptions
    = locations
      .filter((location) => location.active || existingLocations.includes(location.id))
      .map((location) => createOption(location.id, location.name));

  const LocationFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={locationOptions}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  return [
    {
      id: 'type',
      field: 'type',
      title: 'form.builder.lot.transfers.type',
      filterCell: TransferTypeFilter,
      template: TransferTypeCellTemplate,
      width: 140,
    },
    {
      id: 'from',
      field: 'from',
      title: 'form.builder.lot.transfers.from',
      filterCell: LocationFilter,
      template: (props) => <LocationCellTemplate {...props} locations={locations} onClick={onRowClick} />,
      width: 180,
    },
    {
      id: 'to',
      field: 'to',
      title: 'form.builder.lot.transfers.to',
      filterCell: LocationFilter,
      template: (props) => <LocationCellTemplate {...props} locations={locations} onClick={onRowClick} />,
      width: 180,
    },
    {
      id: 'build',
      field: 'build.docId',
      title: 'form.builder.lot.transfers.build',
      filterCell: InputFilter,
      template: (props) => <BuildCellTemplate {...props} builds={builds} onClick={onRowClick} />,
      width: 200,
    },
    {
      id: 'quantity',
      field: 'quantity',
      filterCell: InputFilter,
      title: 'form.builder.lot.transfers.quantity',
      template: QuantityCellTemplate,
      width: 150,
    },
    {
      id: 'date',
      field: 'date',
      title: 'form.builder.lot.transfers.date',
      filterCell: InputFilter,
      template: DateCellTemplate,
      width: 160,
    },
    {
      id: 'by',
      field: 'by',
      title: 'form.builder.lot.transfers.by',
      filterCell: InputFilter,
      template: (props) => <EmployeeCellTemplate {...props} employees={employees} onClick={onRowClick} />,
      width: 200,
    },
    {
      id: 'comments',
      field: 'comments',
      title: 'form.builder.lot.transfers.comments',
      filterCell: InputFilter,
      template: (props) => <CommentsCellTemplate {...props} onClick={onRowClick} />,
      width: 250,
    },
  ];
};

import { GridFilterCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { translate } from '../../../common/intl';
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
import { ReferencesCellTemplate } from './components/ReferencesCellTemplate';
import { TransferTypeCellTemplate } from './components/TransferTypeCellTemplate';
import { BUILD_FIELD, DATE_FIELD, EMPLOYEE_FIELD, REFERENCE_FIELD, TRANSFER_TYPE_OPTIONS } from './constants';
import { CompanyLocation, DocumentRevisionOption, EditableLotTransfer, LotTranferEditEvent } from './types';

interface SchemaOptions {
  locations: CompanyLocation[]
  existingLocations: string[]
  builds: DocumentRevisionOption[]
  records: DocumentRevisionOption[]
  units?: string
  onRowClick?: (e: LotTranferEditEvent) => void
}

export const buildSchema = ({
  locations,
  existingLocations = [],
  builds,
  records,
  units,
  onRowClick,
}: SchemaOptions): Array<ColumnDefinition<EditableLotTransfer>> => {
  const transferTypeOptions = TRANSFER_TYPE_OPTIONS.map((option) => createOption(option.value, option.label));

  const quantityTitle
    = units
      ? `${translate('form.builder.lot.transfers.quantity')} (${units})`
      : translate('form.builder.lot.transfers.quantity');

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
      template: (props) => <LocationCellTemplate {...props} options={locations} onClick={onRowClick} />,
      width: 180,
    },
    {
      id: 'to',
      field: 'to',
      title: 'form.builder.lot.transfers.to',
      filterCell: LocationFilter,
      template: (props) => <LocationCellTemplate {...props} options={locations} onClick={onRowClick} />,
      width: 180,
    },
    {
      id: 'build',
      field: BUILD_FIELD,
      title: 'form.builder.lot.transfers.build',
      filterCell: InputFilter,
      template: (props) => <BuildCellTemplate {...props} options={builds} onClick={onRowClick} />,
      width: 200,
    },
    {
      id: 'reference',
      field: REFERENCE_FIELD,
      title: 'form.builder.lot.transfers.reference',
      filterCell: InputFilter,
      template: (props) => <ReferencesCellTemplate {...props} options={records} onClick={onRowClick} />,
      width: 200,
    },
    {
      id: 'quantity',
      field: 'quantity',
      filterCell: InputFilter,
      title: quantityTitle,
      template: QuantityCellTemplate,
      width: 150,
    },
    {
      id: 'date',
      field: DATE_FIELD,
      title: 'form.builder.lot.transfers.date',
      filterCell: InputFilter,
      template: DateCellTemplate,
      width: 160,
    },
    {
      id: 'by',
      field: EMPLOYEE_FIELD,
      title: 'form.builder.lot.transfers.by',
      filterCell: InputFilter,
      template: (props) => <EmployeeCellTemplate {...props} onClick={onRowClick} />,
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

import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { Input } from '@progress/kendo-react-inputs';
import React from 'react';
import { translate } from '../../../common/intl';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import DropdownFilter from '../FBApprovalMatrix/components/DropdownFilter';
import { createOption } from '../FBApprovalMatrix/components/Grid';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { NumericCellTemplate } from './components/NumericCellTemplate';
import { PrimarySupplierCellTemplate } from './components/PrimarySupplierCellTemplate';
import { PrimarySupplierTitle } from './components/PrimarySupplierTitle';
import { SupplierCellTemplate } from './components/SupplierCellTemplate';
import { SupplierPartNumberCellTemplate } from './components/SupplierPartNumberCellTemplate';
import { SupplierStatusCellTemplate } from './components/SupplierStatusCellTemplate';
import { UnitCostCellTemplate } from './components/UnitCostCellTemplate';
import { UnitsCellTemplate } from './components/UnitsCellTemplate';
import { SUPPLIER_FIELD, SUPPLIER_STATUS_FIELD } from './constants';
import { EditableVendor, SchemaOptions } from './types';

export const buildSchema = ({
  units,
  statuses,
  suppliers,
  isActive,
  isInEditMode,
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
  onPrimaryChange,
}: SchemaOptions): Array<ColumnDefinition<EditableVendor>> => {
  const unitOptions = units.map(unit => createOption(unit, unit));
  const UnitsFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={unitOptions}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  const statusOptions = statuses.map(status => createOption(status, status));
  const StatusFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={statusOptions}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  return [
    {
      id: 'primary',
      field: 'primary',
      filterCell: () => <Input disabled />,
      headerCell: PrimarySupplierTitle,
      template: (props) => (
        <PrimarySupplierCellTemplate
          {...props}
          onPrimaryChange={onPrimaryChange}
          isActive={isActive}
          isInEditMode={isInEditMode}
        />
      ),
      width: 50,
    },
    {
      id: 'supplier',
      field: SUPPLIER_FIELD,
      title: 'form.builder.part.vendors.vendor',
      filterCell: InputFilter,
      template: (props) => (
        <SupplierCellTemplate{...props} options={suppliers} onClick={onRowClick} />
      ),
      width: 200,
    },
    {
      id: 'status',
      field: SUPPLIER_STATUS_FIELD,
      title: 'form.builder.part.vendors.vendor.status',
      filterCell: StatusFilter,
      template: (props) => <SupplierStatusCellTemplate {...props} onClick={onRowClick} />,
      width: 120,
    },
    {
      id: 'part-number',
      field: 'partNumber',
      title: 'form.builder.part.vendors.partNumber',
      filterCell: InputFilter,
      template: (props) => <SupplierPartNumberCellTemplate {...props} onClick={onRowClick} />,
      width: 200,
    },
    {
      id: 'cost',
      field: 'cost.value',
      title: 'form.builder.part.vendors.cost',
      filterCell: InputFilter,
      template: (props) => <UnitCostCellTemplate {...props} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'units-buy',
      field: 'unitsBuy',
      title: 'form.builder.part.vendors.unitsBuy',
      filterCell: UnitsFilter,
      template: (props) => <UnitsCellTemplate {...props} options={units} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'conversion',
      field: 'conversion',
      title: 'form.builder.part.vendors.conversion',
      filterCell: InputFilter,
      template: (props) => <NumericCellTemplate {...props} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'units-use',
      field: 'unitsUse',
      title: 'form.builder.part.vendors.unitsUse',
      filterCell: UnitsFilter,
      template: (props) => <UnitsCellTemplate {...props} options={units} />,
      width: 150,
    },
    {
      id: 'lead-time',
      field: 'leadTime',
      title: 'form.builder.part.vendors.leadTime',
      filterCell: InputFilter,
      template: (props) => <NumericCellTemplate {...props} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'actions',
      title: 'actions',
      className: actionsClass,
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          onConfirm={onConfirm}
          onDiscard={onDiscard}
          onDelete={onDelete}
        />
      ),
      width: 1,
    },
  ];
};

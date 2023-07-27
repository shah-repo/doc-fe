import { GridFilterCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { translate } from '../../../common/intl';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import DropdownFilter from '../FBApprovalMatrix/components/DropdownFilter';
import { createOption } from '../FBApprovalMatrix/components/Grid';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import FBData from '../FBData/FBData';
import { ConversionCellTemplate } from './components/ConversionCellTemplate';
import { LeadTimeCellTemplate } from './components/LeadTimeCellTemplate';
import { PrimarySupplierCellTemplate } from './components/PrimarySupplierCellTemplate';
import { PrimarySupplierTitle } from './components/PrimarySupplierTitle';
import { SupplierCellTemplate } from './components/SupplierCellTemplate';
import { SupplierPartNumberCellTemplate } from './components/SupplierPartNumberCellTemplate';
import { SupplierStatusCellTemplate } from './components/SupplierStatusCellTemplate';
import { UnitCostCellTemplate } from './components/UnitCostCellTemplate';
import { UnitsBuyCellTemplate } from './components/UnitsBuyCellTemplate';
import { UnitsUseCellTemplate } from './components/UnitsUseCellTemplate';
import { EditableVendorData, VendorDataEditEvent, VendorOption } from './types';

interface SchemaOptions {
  vendors: VendorOption[]
  setPrimaryVendorId: React.Dispatch<React.SetStateAction<any>>
  onRowClick?: (e: VendorDataEditEvent) => void
  statuses: DocumentRevisionStatus[]
}

export default function vendorDataSchema ({ vendors, setPrimaryVendorId, onRowClick, statuses }: SchemaOptions): Array<ColumnDefinition<EditableVendorData>> {
  const unitFilterOptions = FBData.unitsOptions.map(obj => createOption(obj.value));
  const supplierStatusFilterOptions = statuses.map(status => createOption(status));

  const unitsFilterOptions: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={unitFilterOptions}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  const supplierStatusFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={supplierStatusFilterOptions}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  const schema = [
    {
      id: 'primarySupplier',
      field: 'primarySupplier',
      title: <PrimarySupplierTitle />,
      filterCell: InputFilter,
      template: (props) => <PrimarySupplierCellTemplate {...props} setPrimaryVendorId={setPrimaryVendorId} />,
      width: 50,
    },
    {
      id: 'supplier',
      field: 'supplier',
      title: 'Supplier',
      filterCell: InputFilter,
      template: (props) => <SupplierCellTemplate {...props} vendors={vendors} />,
      width: 150,
    },
    {
      id: 'status',
      field: 'status',
      title: 'Supplier Status',
      filterCell: supplierStatusFilter,
      template: (props) => <SupplierStatusCellTemplate {...props} />,
      width: 150,
    },
    {
      id: 'cost',
      field: 'cost',
      title: 'Unit Cost',
      filterCell: InputFilter,
      template: UnitCostCellTemplate,
      width: 150,
    },
    {
      id: 'partNumber',
      field: 'partNumber',
      title: 'Supplier Part Number',
      filterCell: InputFilter,
      template: SupplierPartNumberCellTemplate,
      width: 150,
    },
    {
      id: 'unitsBuy',
      field: 'unitsBuy',
      title: 'Units(Buy)',
      filterCell: unitsFilterOptions,
      template: UnitsBuyCellTemplate,
      width: 150,
    },
    {
      id: 'conversion',
      field: 'conversion',
      title: 'Conversion',
      filterCell: InputFilter,
      template: ConversionCellTemplate,
      width: 150,
    },
    {
      id: 'unitsUse',
      field: 'unitsUse',
      title: 'Units(Use)',
      filterCell: unitsFilterOptions,
      template: UnitsUseCellTemplate,
      width: 150,
    },
    {
      id: 'leadTime',
      field: 'leadTime',
      title: 'Lead Time(Days)',
      filterCell: InputFilter,
      template: LeadTimeCellTemplate,
      width: 150,
    },
  ];

  return schema;
}

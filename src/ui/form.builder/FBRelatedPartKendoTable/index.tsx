import { Box } from '@material-ui/core';
import React from 'react';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import { UnitsBuyCellTemplate } from './components/UnitsBuyCellTemplate';
import { VendorData, VendorDataProps } from './types';
import { withFBVendorData } from './wrap';

const vendorDataSchema = (items) => ([
  {
    id: 'supplier',
    field: 'supplier',
    title: 'Supplier',
    filterCell: InputFilter,
    template: ({ dataItem }) => <>{dataItem.supplier}</>,
    width: 150,
  },
  {
    id: 'status',
    field: 'status',
    title: 'Supplier Status',
    filterCell: InputFilter,
    template: ({ dataItem }) => <>{dataItem.status}</>,
    width: 200,
  },
  {
    id: 'cost',
    field: 'cost',
    title: 'Unit Cost',
    filterCell: InputFilter,
    template: ({ dataItem }) => <>{dataItem.cost}</>,
    width: 200,
  },
  {
    id: 'partNumber',
    field: 'partNumber',
    title: 'Supplier Part Number',
    filterCell: InputFilter,
    template: ({ dataItem }) => <>{dataItem.partNumber}</>,
    width: 200,
  },
  {
    id: 'unitsBuy',
    field: 'unitsBuy',
    title: 'Units(Buy)',
    filterCell: InputFilter,
    template: UnitsBuyCellTemplate,
    width: 150,
  },
  {
    id: 'conversion',
    field: 'conversion',
    title: 'Conversion',
    filterCell: InputFilter,
    template: ({ dataItem }) => <>{dataItem.conversion}</>,
    width: 150,
  },
  {
    id: 'unitsUse',
    field: 'unitsUse',
    title: 'Units(Use)',
    filterCell: InputFilter,
    template: ({ dataItem }) => <>{dataItem.unitsUse}</>,
    width: 150,
  },
  {
    id: 'leadTime',
    field: 'leadTime',
    title: 'Lead Time(Days)',
    filterCell: InputFilter,
    template: ({ dataItem }) => <>{dataItem.leadTime}</>,
    width: 150,
  },

]);

const FBVendorDataTable: React.FC<VendorDataProps> = ({
  items,
  addVendorData,
}) => {
  const schema = vendorDataSchema(items);

  return (
    <Box position="relative">
      <KendoDataGrid<VendorData>
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={items}
      />
    </Box>
  );
};
export default withFBVendorData(FBVendorDataTable);

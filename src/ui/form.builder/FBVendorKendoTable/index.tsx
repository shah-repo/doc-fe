import { Box } from '@material-ui/core';
import React from 'react';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import { ConversionCellTemplate } from './components/ConversionCellTemplate';
import { LeadTimeCellTemplate } from './components/LeadTimeCellTemplate';
import { SupplierCellTemplate } from './components/SupplierCellTemplate';
import { SupplierPartNumberCellTemplate } from './components/SupplierPartNumberCellTemplate';
import { UnitCostCellTemplate } from './components/UnitCostCellTemplate';
import { UnitsBuyCellTemplate } from './components/UnitsBuyCellTemplate';
import { UnitsUseCellTemplate } from './components/UnitsUseCellTemplate';
import { MODE_FIELD, Mode } from './constants';
// import useStyles from './styles';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import { Button } from '../../components/forms/fields-next';
import { EditableVendorData, VendorData, VendorDataEditEvent, VendorDataProps } from './types';
import { withFBVendorData } from './wrap';

const vendorDataSchema = (items) => ([
  {
    id: 'supplier',
    field: 'supplier',
    title: 'Supplier',
    filterCell: InputFilter,
    template: SupplierCellTemplate,
    width: 150,
  },
  {
    id: 'status',
    field: 'status',
    title: 'Supplier Status',
    filterCell: InputFilter,
    template: ({ dataItem }) => <>{dataItem.status}</>,
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
    filterCell: InputFilter,
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
    filterCell: InputFilter,
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

]);

const FBVendorDataTable: React.FC<VendorDataProps> = ({
  items = [],
  disabled,
  addVendorData,
}) => {
  // const classes = useStyles();
  const [editedVendorData, setEditedVendorData] = React.useState<Partial<EditableVendorData>>();

  const isActive = true;
  const editVendorData = ({ dataItem }: VendorDataEditEvent) => setEditedVendorData(dataItem);

  const createDraftVendorData = () => setEditedVendorData({
    id: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

  const schema = vendorDataSchema(items);

  const rowRender: DataGridProps<EditableVendorData>['rowRender'] = (row, { dataItem }) => {
    return React.cloneElement(
      row,
    );
  };

  const isVendorDataAdded = editedVendorData?.[MODE_FIELD] === Mode.add;

  const vendorDataList = items.reduce((list, item) => {
    const isVendorDataEdited = editedVendorData && editedVendorData.id === item.id;
    return [
      ...list,
      {
        ...(isVendorDataEdited ? editedVendorData : item),
        [MODE_FIELD]: isVendorDataEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isVendorDataAdded ? [editedVendorData] : []);

  return (
    <Box position="relative">
      <KendoDataGrid<VendorData>
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={vendorDataList}
        onRowClick={isActive ? editVendorData : undefined}
        rowRender={rowRender}
      />
      {isActive && (
        <Button
          kind="add"
          fullWidth
          onClick={createDraftVendorData}
        >
          {translate('form.builder.new.supplier.add')}
        </Button>
      )}
    </Box>
  );
};
export default withFBVendorData(FBVendorDataTable);

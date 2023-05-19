import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBPurchaseOrderItem } from '../FBPurchaseOrder/FBPurchaseOrder.types';
import CheckboxCell from './components/cells/CheckboxCell';
import ContentCell from './components/cells/ContentCell';
import DescriptionCell from './components/cells/DescriptionCell';
import ItemCell from './components/cells/ItemCell';
import TitleCell from './components/cells/TitleCell';
import ValueWithNACell from './components/cells/ValueWithNACell';

const columnsShema: Array<ColumnDefinition<FBPurchaseOrderItem>> = [
  {
    id: 'index',
    field: 'index',
    title: 'form.builder.item',
    cell: ItemCell,
    width: 60,
    resizable: false,
  },
  {
    id: 'part-number',
    title: 'form.builder.field.part.number',
    cell: TitleCell,
    width: 160,
    sortable: false,
  },
  {
    id: 'supplier-part-number',
    field: 'supplierPartNumber',
    title: 'form.builder.field.supplier.part.number',
    cell: ValueWithNACell,
    width: 200,
  },
  {
    id: 'description',
    field: 'description',
    title: 'form.builder.field.description',
    cell: DescriptionCell,
    width: 200,
  },
  {
    id: 'ordered',
    field: 'order',
    title: 'form.builder.field.ordered',
    cell: ContentCell,
    width: 90,
  },
  {
    id: 'received',
    field: 'received',
    title: 'form.builder.field.received',
    cell: ContentCell,
    width: 115,
  },
  {
    id: 'units',
    field: 'units',
    title: 'form.builder.field.units',
    cell: ContentCell,
    width: 65,
  },
  {
    id: 'data',
    field: 'formattedDate',
    title: 'form.builder.field.date.required',
    cell: ContentCell,
    width: 130,
  },
  {
    id: 'price',
    field: 'unitPrice',
    title: 'form.builder.field.unit.price',
    width: 130,
  },
  {
    field: 'lots',
    id: 'lots',
    title: 'form.builder.field.lots',
    cell: ContentCell,
    width: 130,
  },
  {
    id: 'tax',
    field: 'tax',
    title: 'form.builder.field.tax',
    template: CheckboxCell,
    width: 50,
    locked: true,
    resizable: false,
  },
  {
    id: 'sum',
    field: 'totalAmount',
    title: 'form.builder.sum',
    width: 150,
    locked: true,
    resizable: false,
  },
  {
    id: 'action',
    locked: true,
    hidden: true,
  },
];

export default columnsShema;

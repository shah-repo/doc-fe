import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBPurchaseOrderItem, FBPurchaseOrderItemType } from '../FBPurchaseOrder/FBPurchaseOrder.types';
import CheckboxCell from './cell.template/CheckboxCell';
import CurrencyCell from './cell.template/CurrencyCell';

const COLUMNS: Array<ColumnDefinition<FBPurchaseOrderItem>> = [
  {
    id: 'index',
    field: 'index',
    title: 'form.builder.item',
    template: ({ dataItem }) => dataItem.index + 1,
    width: 60,
    resizable: false,
  },
  {
    id: 'part-number',
    title: 'form.builder.field.part.number',
    template: ({ dataItem }) => (
      dataItem.type === FBPurchaseOrderItemType.SERVICE
        ? dataItem
        : dataItem.partNumberDocId
    ),
    width: 150,
    sortable: false,
  },
  {
    id: 'supplier-part-number',
    field: 'supplierPartNumber',
    title: 'form.builder.field.supplier.part.number',
    width: 200,
  },
  {
    id: 'description',
    field: 'description',
    title: 'form.builder.field.description',
    width: 200,
  },
  {
    id: 'order',
    field: 'order',
    title: 'form.builder.field.ordered',
    width: 90,
  },
  {
    id: 'data',
    field: 'formattedDate',
    title: 'form.builder.field.date.required',
    width: 140,
    sortable: true,
    resizable: false,
  },
  {
    id: 'price',
    field: 'unitPrice',
    title: 'form.builder.field.unit.price',
    width: 140,
    sortable: true,
    resizable: false,
  },
  {
    field: 'lots',
    id: 'lots',
    title: 'form.builder.field.lots',
    width: 140,
    sortable: true,
    resizable: false,
  },
  {
    id: 'tax',
    field: 'tax',
    title: 'form.builder.field.tax',
    template: CheckboxCell,
    width: 60,
    locked: true,
    resizable: false,
  },
  {
    id: 'sum',
    field: 'totalAmount',
    title: 'form.builder.sum',
    cell: CurrencyCell,
    width: 150,
    locked: true,
    resizable: false,
  },
];

export default COLUMNS;

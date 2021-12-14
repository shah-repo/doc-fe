import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { DocumentTypeManagementProps } from "../../../components/table/types";
import { CheckboxCell } from "../cell.formatter/checkbox";
import { CellFormatter } from "../cell.formatter/grid.cell";
import { SchemaCell } from "../cell.formatter/schema.cell";
import { BooleanFilterCell, DropdownFilterCellTemplate } from "../column.filter.formatter/filter.formatter";
import { ColumnMenu } from "../columns/column.menu";

const columns: DocumentTypeManagementProps[] = [{
  field: "id",
  title: "ID",
  show: false,
},
{
  field: "active",
  title: "Status",
  cell: CellFormatter, // Filter Not Working
  filter: "text",
  filterCell: DropdownFilterCellTemplate,
  show: true,
  columnMenu: ColumnMenu,
  width: "150px",
  locked: true,
}, {
  field: "documentTypeName",
  title: "Document Type",
  show: true,
  columnMenu: ColumnMenu,
  width: "165px",
  locked: true,
},
{
  field: "documentTypeAcronym",
  title: "Acronym",
  show: true,
  columnMenu: ColumnMenu,
  width: "125px",
  locked: true,
},
{
  field: "privateNumberPool",
  title: "Private Number Pool",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: BooleanFilterCell,
  show: true,
  columnMenu: ColumnMenu,
  width: "200px",
},
{
  field: "canRedLine",
  title: "RedLine",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: BooleanFilterCell,
  show: true,
  columnMenu: ColumnMenu,
  width: "110px",
},
{
  field: "isQms",
  title: "Qms",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: BooleanFilterCell,
  show: true,
  columnMenu: ColumnMenu,
  width: "85px",
},
{
  field: "needsSignature",
  title: "Needs Signature",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: BooleanFilterCell,
  show: true,
  columnMenu: ColumnMenu,
  width: "185px",
},
{
  field: "defaultTraining",
  title: "Training",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: BooleanFilterCell,
  show: true,
  columnMenu: ColumnMenu,
  width: "125px",
}, {
  field: "startingNumber",
  title: "Starting Number",
  show: true,
  columnMenu: ColumnMenu,
  width: "185px",
},
{
  field: "defaultRevStage",
  title: "Revision Stage",
  filterCell: DropdownFilterCellTemplate,
  show: true,
  columnMenu: ColumnMenu,
  width: "165px",
}, {
  field: "hiddenForCreationForUsersWithoutTags",
  title: "Users without Tags", // TODO: Check if multiSelect
  filterCell: DropdownFilterCellTemplate, // Not working
  show: true,
  columnMenu: ColumnMenu,
  width: "200px",
},
{
  field: "group",
  title: "Group",
  filterCell: DropdownFilterCellTemplate,
  show: true,
  columnMenu: ColumnMenu,
  width: "125px",
}, {
  field: "category",
  title: "Category", // In Wireframe its dd but not in existing. No datasource found
  show: true,
  columnMenu: ColumnMenu,
  width: "125px",
}, {
  field: "schema",
  title: "Schema",
  cell: SchemaCell,
  show: true,
  filterable: false,
  width: "95px",
}];

interface PageState {
  skip: number;
  take: number;
  group: any[];
}
// TODO: Move in common file
const pagerSettings: GridPagerSettings = {
  buttonCount: 5,
  info: true,
  type: "numeric",
  pageSizes: [25, 50, 75, 100, 500, 1000],
  previousNext: true,
};

const booleanFilterCellOptions = [{
  text: "Yes",
  value: true,
}, {
  text: "No",
  value: false,
}];

const initialDataState: PageState = { skip: 0, take: 25, group: [] };
const gridConfiguration = { columns, pagerSettings, initialDataState, booleanFilterCellOptions };

export default gridConfiguration;

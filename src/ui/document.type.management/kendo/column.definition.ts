import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { ActiveDropdown } from "../../components/common/kendo.column.templates/ActiveDropdown";
import { GridDropDownSettings, KendoColumn, PageState } from "../../components/common/kendo/types";
import { CheckboxCell } from "./column.templates/Checkbox";
import { FieldsConfig } from "./column.templates/FieldsConfig";
import { Schema } from "./column.templates/Schema";
import { EditDropdownCellFormatter } from "./filter.template/CommonCellDropdownFilterTemplate";

const columns: KendoColumn[] = [{
  field: "id",
  title: "ID",
  show: false,
},
{
  field: "active",
  title: "Status",
  cell: ActiveDropdown,
  filter: "text",
  filterCell: "DropdownFilterCellTemplate",
  show: true,
  width: "150px",
  locked: true,
  orderIndex: 0,
  groupable: true,
},
{
  field: "documentTypeName",
  title: "Document Type",
  show: true,
  width: "165px",
  locked: true,
  groupable: false,
  orderIndex: 1,
},
{
  field: "documentTypeAcronym",
  title: "Acronym",
  show: true,
  width: "125px",
  locked: false,
  groupable: false,
  orderIndex: 2,
},
{
  field: "privateNumberPool",
  title: "Private Number Pool",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: "BooleanFilterCell",
  show: true,
  width: "110px",
  groupable: false,
  orderIndex: 3,
},
{
  field: "canRedLine",
  title: "RedLine",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: "BooleanFilterCell",
  show: true,
  width: "110px",
  groupable: false,
  orderIndex: 4,
},
{
  field: "isQms",
  title: "Qms",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: "BooleanFilterCell",
  show: true,
  width: "110px",
  groupable: false,
  orderIndex: 5,
},
{
  field: "needsSignature",
  title: "Needs Signature",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: "BooleanFilterCell",
  show: true,
  width: "110px",
  groupable: false,
  orderIndex: 6,
},
{
  field: "defaultTraining",
  title: "Training",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: "BooleanFilterCell",
  show: true,
  width: "110px",
  groupable: false,
  orderIndex: 7,
}, {
  field: "startingNumber",
  title: "Starting Number",
  show: true,
  width: "185px",
  groupable: false,
  orderIndex: 8,
},
{
  field: "defaultRevStage",
  title: "Revision Stage",
  cell: EditDropdownCellFormatter,
  filterCell: "DropdownFilterCellTemplate",
  show: true,
  width: "165px",
  groupable: true,
  orderIndex: 9,
},
{
  field: "hiddenForCreationForUsersWithoutTagsFormatted",
  title: "Users without Tags", // TODO: Check if multiSelect
  cell: EditDropdownCellFormatter,
  filterCell: "DropdownFilterCellTemplate",
  show: true,
  width: "200px",
  groupable: false,
  orderIndex: 10,
},
{
  field: "group",
  title: "Group",
  cell: EditDropdownCellFormatter,
  filterCell: "DropdownFilterCellTemplate",
  show: true,
  width: "125px",
  groupable: true,
  orderIndex: 11,
}, {
  field: "category",
  title: "Category", // In Wireframe its dd but not in existing. No datasource found
  show: true,
  width: "125px",
  groupable: true,
  orderIndex: 12,
}, {
  field: "schema",
  title: "Schema",
  cell: Schema,
  show: true,
  filterable: false,
  width: "110px",
  groupable: false,
  orderIndex: 13,
}, {
  field: "fieldsConfig",
  title: "Field Config",
  cell: FieldsConfig,
  show: true,
  filterable: false,
  width: "110px",
  groupable: false,
  orderIndex: 14,
}, {
  field: "",
  title: "",
  show: true,
  groupable: false,
  filterable: false,
  locked: true,
  width: "90px",
  reorderable: false,
  resizable: false,
  orderIndex: 15,
}];

// TODO: Move in common file
const pagerSettings: GridPagerSettings = {
  buttonCount: 5,
  info: true,
  type: "numeric",
  pageSizes: [25, 50, 75, 100, 500, 1000],
  previousNext: true,
};

const booleanFilterCellOptions: GridDropDownSettings[] = [{
  text: "Yes",
  value: true,
}, {
  text: "No",
  value: false,
}];

const initialDataState: PageState = { skip: 0, take: 25, group: [] };
const gridConfiguration = { columns, pagerSettings, initialDataState, booleanFilterCellOptions };

export default gridConfiguration;

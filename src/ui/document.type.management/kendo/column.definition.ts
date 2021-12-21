import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { CheckboxCell } from "./column.templates/Checkbox";
import { Dropdown } from "./column.templates/Dropdown";
import { FieldsConfig } from "./column.templates/FieldsConfig";
import { Schema } from "./column.templates/Schema";
import { BooleanFilterCell, DropdownFilterCellTemplate, EditDropdownCellFormatter } from "./filter.template/CommonCellDropdownFilterTemplate";
import { DocumentTypeManagementProps } from "./types";

const columns: DocumentTypeManagementProps[] = [{
  field: "id",
  title: "ID",
  show: false,
},
{
  field: "active",
  title: "Status",
  cell: Dropdown,
  filter: "text",
  filterCell: DropdownFilterCellTemplate,
  show: true,
  width: "150px",
  locked: true,
},
{
  field: "documentTypeName",
  title: "Document Type",
  show: true,
  width: "165px",
  locked: true,
},
{
  field: "documentTypeAcronym",
  title: "Acronym",
  show: true,
  width: "125px",
  locked: false,
},
{
  field: "privateNumberPool",
  title: "Private Number Pool",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: BooleanFilterCell,
  show: true,
  width: "200px",
},
{
  field: "canRedLine",
  title: "RedLine",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: BooleanFilterCell,
  show: true,
  width: "110px",
},
{
  field: "isQms",
  title: "Qms",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: BooleanFilterCell,
  show: true,
  width: "85px",
},
{
  field: "needsSignature",
  title: "Needs Signature",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: BooleanFilterCell,
  show: true,
  width: "185px",
},
{
  field: "defaultTraining",
  title: "Training",
  cell: CheckboxCell,
  filter: "boolean",
  filterCell: BooleanFilterCell,
  show: true,
  width: "125px",
}, {
  field: "startingNumber",
  title: "Starting Number",
  show: true,
  width: "185px",
},
{
  field: "defaultRevStage",
  title: "Revision Stage",
  cell: EditDropdownCellFormatter,
  filterCell: DropdownFilterCellTemplate,
  show: true,
  width: "165px",
}, {
  field: "hiddenForCreationForUsersWithoutTags",
  title: "Users without Tags", // TODO: Check if multiSelect
  cell: EditDropdownCellFormatter,
  filterCell: DropdownFilterCellTemplate, // Not working
  show: true,
  width: "200px",
},
{
  field: "group",
  title: "Group",
  cell: EditDropdownCellFormatter,
  filterCell: DropdownFilterCellTemplate,
  show: true,
  width: "125px",
}, {
  field: "category",
  title: "Category", // In Wireframe its dd but not in existing. No datasource found
  show: true,
  width: "125px",
}, {
  field: "schema",
  title: "Schema",
  cell: Schema,
  show: true,
  filterable: false,
  width: "95px",
}, {
  field: "fieldsConfig", // TODO: Update svg, check with Shiv
  title: "Field Config",
  cell: FieldsConfig,
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

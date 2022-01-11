import { pagerSettings } from "../../components/common/kendo/helpers";
import { KendoColumn, PageState } from "../../components/common/kendo/types";

enum DTMCellTemplates {
  DROPDOWN_FILTER_CELL = "DropdownFilterCellTemplate"
}

const columns: KendoColumn[] = [{
  field: "id",
  title: "common.id",
  show: false,
},
{
  field: "active",
  title: "common.status",
  filter: "text",
  filterCell: DTMCellTemplates.DROPDOWN_FILTER_CELL,
  show: true,
  width: "150px",
  locked: true,
  orderIndex: 0,
  groupable: true,
},
{
  field: "documentTypeName",
  title: "common.document.type.name",
  show: true,
  width: "165px",
  locked: true,
  groupable: false,
  orderIndex: 1,
},
{
  field: "documentTypeAcronym",
  title: "common.document.type.acronym",
  show: true,
  width: "125px",
  locked: false,
  groupable: false,
  orderIndex: 2,
},
{
  field: "privateNumberPool",
  title: "common.private.number.pool",
  filter: "boolean",
  show: true,
  width: "110px",
  groupable: true,
  orderIndex: 3,
},
{
  field: "canRedLine",
  title: "common.redline",
  filter: "boolean",
  show: true,
  width: "110px",
  groupable: true,
  orderIndex: 4,
},
{
  field: "isQms",
  title: "common.qms",
  filter: "boolean",
  show: true,
  width: "110px",
  groupable: true,
  orderIndex: 5,
},
{
  field: "needsSignature",
  title: "form.builder.needsSignature",
  filter: "boolean",
  show: true,
  width: "110px",
  groupable: true,
  orderIndex: 6,
},
{
  field: "defaultTraining",
  title: "common.training",
  filter: "boolean",
  show: true,
  width: "110px",
  groupable: true,
  orderIndex: 7,
}, {
  field: "startingNumber",
  title: "common.starting.number",
  show: true,
  width: "185px",
  groupable: false,
  orderIndex: 8,
},
{
  field: "defaultRevStage",
  title: "document.revision.stage",
  filterCell: DTMCellTemplates.DROPDOWN_FILTER_CELL,
  show: true,
  width: "165px",
  groupable: true,
  orderIndex: 9,
},
{
  field: "hiddenForCreationForUsersWithoutTagsFormatted",
  title: "common.hidden.message", // TODO: Check if multiSelect
  filterCell: DTMCellTemplates.DROPDOWN_FILTER_CELL,
  show: true,
  width: "200px",
  groupable: false,
  orderIndex: 10,
},
{
  field: "group",
  title: "common.group",
  filterCell: DTMCellTemplates.DROPDOWN_FILTER_CELL,
  show: true,
  width: "125px",
  groupable: true,
  orderIndex: 11,
}, {
  field: "category",
  title: "form.builder.category", // In Wireframe its dd but not in existing. No datasource found
  show: true,
  width: "125px",
  groupable: true,
  orderIndex: 12,
}, {
  field: "schema",
  title: "common.schema",
  show: true,
  filterable: false,
  width: "110px",
  groupable: false,
  orderIndex: 13,
}, {
  field: "fieldsConfig",
  title: "common.fields.config",
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

const initialDataState: PageState = { skip: 0, take: 25, group: [] };
const gridConfiguration = {
  columns,
  pagerSettings,
  initialDataState,
};

export default gridConfiguration;

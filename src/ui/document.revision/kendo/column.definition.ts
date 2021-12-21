import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { chain } from "lodash";
import { KendoCellTemplates, KendoColumn, KendoGridConfiguration } from "../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "document.docId",
    title: "DOC ID",
    show: true,
    filter: "text",
    locked: false,
    width: "200px",
    groupable: false,
    showColumnMenu: true,
    orderIndex: 1,
  },
  {
    field: "displayRevision",
    title: "REVISION",
    show: true,
    filter: "text",
    locked: false,
    width: "200px",
    groupable: false,
    showColumnMenu: true,
    orderIndex: 2,
  },
  {
    field: "name",
    title: "DOCUMENT TITLE",
    show: true,
    filter: "text",
    locked: false,
    width: "400px",
    groupable: false,
    showColumnMenu: true,
    orderIndex: 3,
  },
  {
    field: "document.documentType.documentTypeAcronym",
    title: "TYPE",
    show: true,
    filter: "text",
    locked: false,
    width: "200px",
    groupable: true,
    showColumnMenu: true,
    orderIndex: 4,
  },
  {
    field: "owner.user.name",
    title: "OWNER",
    show: true,
    filter: "text",
    locked: false,
    width: "200px",
    groupable: true,
    cell: KendoCellTemplates.USER_AVATAR,
    showColumnMenu: true,
    orderIndex: 5,
  },
  {
    field: "changeRequest.crId",
    title: "AR ID",
    show: true,
    filter: "text",
    locked: false,
    width: "200px",
    groupable: false,
    showColumnMenu: true,
    orderIndex: 6,
  },
  {
    field: "displayStatus",
    title: "STATUS",
    show: true,
    locked: false,
    width: "200px",
    groupable: true,
    cell: KendoCellTemplates.STATUS,
    showColumnMenu: true,
    orderIndex: 7,
  },
  {
    field: "effectiveDate",
    title: "EFFECTIVE DATE",
    show: true,
    filter: "date",
    locked: false,
    width: "150px",
    groupable: false,
    format: "{0:d}",
    showColumnMenu: true,
    orderIndex: 8,
  },
];

const pagerSettings: GridPagerSettings = {
  buttonCount: 5,
  info: true,
  type: "numeric",
  pageSizes: [25, 50, 75, 100, 500, 1000],
  previousNext: true,
};

const gridConfiguration: KendoGridConfiguration = {
  groupableFields: chain(columns).filter({ groupable: true }).map("field").value(),
  columns,
  pagerSettings,
};

export default gridConfiguration;

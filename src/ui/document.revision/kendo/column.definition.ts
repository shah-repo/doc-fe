import { chain } from "lodash";
import { pagerSettings } from "../../components/common/kendo/helpers";
import { KendoCellTemplates, KendoColumn, KendoGridConfiguration } from "../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "document.docId",
    title: "DOC ID",
    show: true,
    filter: "text",
    locked: false,
    width: 8,
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
    width: 8,
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
    width: 30,
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
    width: 12,
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
    width: 20,
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
    width: 8,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 6,
  },
  {
    field: "displayStatus",
    title: "STATUS",
    show: true,
    locked: false,
    width: 14,
    groupable: true,
    cell: KendoCellTemplates.STATUS,
    showColumnMenu: true,
    orderIndex: 7,
  },
  {
    field: "effectiveDate",
    title: "EFFECTIVE DATE",
    show: true,
    locked: false,
    width: 12,
    groupable: false,
    cell: KendoCellTemplates.DATE_INFO,
    showColumnMenu: true,
    orderIndex: 8,
  },
];

const gridConfiguration: KendoGridConfiguration = {
  groupableFields: chain(columns)
    .filter({ groupable: true })
    .map("field")
    .value(),
  columns,
  pagerSettings,
};

export default gridConfiguration;

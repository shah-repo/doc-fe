import { chain } from "lodash";
import { pagerSettings } from "../../components/common/kendo/helpers";
import { KendoCellTemplates, KendoColumn, KendoGridConfiguration } from "../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "trId",
    title: "TRN ID",
    show: true,
    filter: "text",
    locked: false,
    width: 10,
    showColumnMenu: true,
    groupable: false,
    orderIndex: 1,
  },
  {
    field: "trainingPlan.document.docId",
    title: "DOC ID",
    show: true,
    filter: "text",
    locked: false,
    width: 10,
    showColumnMenu: true,
    groupable: false,
    orderIndex: 2,
  },
  {
    field: "documentRevision.displayRevision",
    title: "REVISION",
    show: true,
    filter: "text",
    locked: false,
    width: 9,
    showColumnMenu: true,
    groupable: false,
    orderIndex: 3,
  },
  {
    field: "documentRevision.name",
    title: "DOCUMENT TITLE",
    show: true,
    filter: "text",
    locked: false,
    width: 20,
    showColumnMenu: true,
    groupable: false,
    orderIndex: 4,
  },
  {
    field: "trainingPlan.employee.user.name",
    title: "TRAINEE",
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
    field: "trainingPlan.createdAt",
    title: "ASSIGNED DATE",
    show: true,
    locked: false,
    width: 12,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 6,
    cell: KendoCellTemplates.DATE_INFO,
  },
  {
    field: "dueOn",
    title: "DUE DATE",
    show: true,
    filter: "text",
    locked: false,
    width: 12,
    groupable: true,
    showColumnMenu: true,
    orderIndex: 7,
    cell: KendoCellTemplates.DATE_INFO,
  },
  {
    field: "completedAt",
    title: "COMPLETED ON",
    show: true,
    filter: "text",
    locked: false,
    width: 12,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 8,
    cell: KendoCellTemplates.DATE_COMPLETED,
  },
  {
    field: "trainingPlan.curriculumDocIds",
    title: "TC ID",
    show: true,
    locked: false,
    width: 10,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 9,
    filter: "text",
  },
];

const gridConfiguration: KendoGridConfiguration = {
  columns,
  pagerSettings,
  groupableFields: chain(columns)
    .filter({ groupable: true })
    .map("field")
    .value(),
};

export default gridConfiguration;

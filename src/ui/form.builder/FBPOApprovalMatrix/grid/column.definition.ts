import { chain } from "lodash";
import { KendoColumn, KendoGridConfiguration } from "../../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "name",
    title: "form.builder.poam.level.name",
    show: true,
    filter: "text",
    locked: false,
    width: 10,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 1,
  },
  {
    field: "limit",
    title: "form.builder.poam.limit",
    show: true,
    filter: "text",
    locked: false,
    width: 10,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 2,
  },
  {
    field: "threshold",
    title: "form.builder.field.threshold",
    show: true,
    filter: "text",
    locked: false,
    width: 10,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 3,
  },
  {
    field: "signatures.signatureStage1",
    title: "form.builder.poam.signature1",
    show: true,
    filter: "text",
    locked: false,
    width: 20,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 4,
    showTooltip: true,
  },
  {
    field: "signatures.signatureStage2",
    title: "form.builder.poam.signature2",
    show: true,
    filter: "text",
    locked: false,
    groupable: false,
    width: 20,
    showColumnMenu: true,
    orderIndex: 5,
    showTooltip: true,
  },
  {
    field: "signatures.signatureStage3",
    title: "form.builder.poam.signature3",
    show: true,
    filter: "text",
    locked: false,
    groupable: false,
    width: 20,
    showColumnMenu: true,
    orderIndex: 6,
  },
];

const gridConfiguration: KendoGridConfiguration = {
  groupableFields: chain(columns)
    .filter({ groupable: true })
    .map("field")
    .value(),
  columns,
  pagerSettings: {},
};

export default gridConfiguration;

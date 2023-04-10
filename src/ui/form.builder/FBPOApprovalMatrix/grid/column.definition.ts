import { chain } from "lodash";
import { pagerSettings } from "../../../components/common/kendo/helpers";
import { KendoCellTemplates, KendoColumn, KendoGridConfiguration } from "../../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "name",
    title: "Level Name",
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
    title: "Limit",
    show: true,
    filter: "text",
    locked: false,
    width: 10,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 2,
  },
  {
    field: "signatures.signatureStage1",
    title: "Signature 1",
    show: true,
    filter: "text",
    locked: false,
    cell: KendoCellTemplates.SIGNATURE_CELL,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 3,
    showTooltip: true,
  },
  {
    field: "signatures.signatureStage2",
    title: "Signature 2",
    show: true,
    filter: "text",
    locked: false,
    groupable: true,
    cell: KendoCellTemplates.SIGNATURE_CELL,
    showColumnMenu: true,
    orderIndex: 4,
    showTooltip: true,
  },
  {
    field: "signatures.signatureStage3",
    title: "Signature 3",
    show: true,
    filter: "text",
    locked: false,
    groupable: true,
    cell: KendoCellTemplates.SIGNATURE_CELL,
    showColumnMenu: true,
    orderIndex: 5,
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

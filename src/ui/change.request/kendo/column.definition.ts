import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { chain } from "lodash";
import { KendoCellTemplates, KendoColumn, KendoGridConfiguration } from "../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "crId",
    title: "AR ID",
    show: true,
    filter: "text",
    locked: false,
    width: 10,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 1,
  },
  {
    field: "title",
    title: "AR TITLE",
    show: true,
    filter: "text",
    locked: false,
    width: 40,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 2,
  },
  {
    field: "owner.user.name",
    title: "OWNER",
    show: true,
    filter: "text",
    locked: false,
    width: 30,
    groupable: true,
    cell: KendoCellTemplates.USER_AVATAR,
    showColumnMenu: true,
    orderIndex: 3,
  },
  {
    field: "state",
    title: "STATUS",
    show: true,
    locked: false,
    width: 20,
    groupable: true,
    cell: KendoCellTemplates.STATUS,
    showColumnMenu: true,
    orderIndex: 4,
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
  columns,
  pagerSettings,
  groupableFields: chain(columns).filter({ groupable: true }).map("field").value(),
};

export default gridConfiguration;

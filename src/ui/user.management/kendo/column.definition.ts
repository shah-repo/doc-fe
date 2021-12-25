import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { GridDropDownSettings, KendoColumn, KendoGridConfiguration, PageState } from "../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "status",
    title: "SIGNED UP",
    show: true,
    filter: "text",
    locked: false,
    orderIndex: 1,
    groupable: true,
  },
  {
    field: "user.name",
    title: "NAME",
    show: true,
    filter: "text",
    groupable: true,
    locked: false,
    orderIndex: 2,
  },
  {
    field: "user.email",
    title: "EMAIL",
    show: true,
    filter: "text",
    groupable: true,
    locked: false,
    orderIndex: 3,
  },
  {
    field: "groups",
    title: "GROUPS",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 4,
  },
  {
    field: "active",
    title: "ACTIVE",
    show: true,
    filter: "boolean",
    groupable: true,
    locked: false,
    orderIndex: 5,
  },
  {
    field: "",
    title: "",
    show: true,
    groupable: false,
    filterable: false,
    locked: true,
    width: "80px",
    reorderable: false,
    resizable: false,
    orderIndex: 6,
  },
];

const pagerSettings: GridPagerSettings = {
  buttonCount: 5,
  info: true,
  type: "numeric",
  pageSizes: [25, 50, 75, 100, 500, 1000],
  previousNext: true,
};

const booleanFilterCellOptions: GridDropDownSettings[] = [{
  text: "Active",
  value: true,
}, {
  text: "InActive",
  value: false,
}];

const initialDataState: PageState = { skip: 0, take: 25 };
const gridConfiguration: KendoGridConfiguration = {
  columns, pagerSettings, initialDataState, booleanFilterCellOptions,
};

export default gridConfiguration;

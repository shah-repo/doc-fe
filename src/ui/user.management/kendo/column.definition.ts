import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { GridDropDownSettings, KendoColumn, KendoGridConfiguration, PageState } from "../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "status",
    title: "SIGNED UP",
    show: true,
    filterable: false,
    groupable: true,
  },
  {
    field: "user.name",
    title: "NAME",
    show: true,
    filter: "text",
    groupable: true,
  },
  {
    field: "user.email",
    title: "EMAIL",
    show: true,
    filter: "text",
    groupable: true,
  },
  {
    field: "groups",
    title: "GROUPS",
    show: true,
    groupable: true,
  },
  {
    field: "active",
    title: "ACTIVE",
    show: true,
    filter: "boolean",
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

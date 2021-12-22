import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { GridDropDownSettings, KendoColumn, KendoGridConfiguration, PageState } from "../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "",
    title: "",
    show: true,
    filterable: false,
    groupable: false,
    width: "80px",
  },
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

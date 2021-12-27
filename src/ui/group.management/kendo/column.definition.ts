import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { GridDropDownSettings, KendoColumn, KendoGridConfiguration, PageState } from "../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "isOfficial",
    title: "GROUP TYPE",
    show: true,
    filter: "boolean",
    groupable: true,
    orderIndex: 1,
    showColumnMenu: true,
  },
  {
    field: "name",
    title: "NAME",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 2,
    showColumnMenu: true,
  },
  {
    field: "memberNames",
    title: "MEMBERS",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 3,
    showColumnMenu: true,
  },
  {
    field: "formattedPermissions",
    title: "PERMISSIONS",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 4,
    showColumnMenu: true,
  },
  {
    field: "formattedTags",
    title: "TAGS",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 5,
    showColumnMenu: true,
  },
  {
    field: "parentName",
    title: "PARENT GROUPS",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 6,
    showColumnMenu: true,
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
    orderIndex: 7,
    showColumnMenu: false,
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
  text: "Official",
  value: true,
}, {
  text: "Unofficial",
  value: false,
}];
const initialDataState: PageState = { skip: 0, take: 25 };
const gridConfiguration: KendoGridConfiguration = {
  columns, pagerSettings, initialDataState,
  booleanFilterCellOptions,
};

export default gridConfiguration;

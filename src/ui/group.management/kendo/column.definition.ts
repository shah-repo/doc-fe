import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";

const columns = [
  {
    field: "",
    title: "",
    show: true,
    groupable: false,
    filterable: false,
    locked: true,
    width: "80px",
  },
  {
    field: "isOfficial",
    title: "GROUP TYPE",
    show: true,
    filter: "boolean",
  },
  {
    field: "name",
    title: "NAME",
    show: true,
    filter: "text",
    groupable: false,
  },
  {
    field: "memberNames",
    title: "MEMBERS",
    show: true,
    filter: "text",
    groupable: false,
  },
  {
    field: "formattedPermissions",
    title: "PERMISSIONS",
    show: true,
    filter: "text",
    groupable: false,
  },
  {
    field: "formattedTags",
    title: "TAGS",
    show: true,
    filter: "text",
    groupable: false,
  },
  {
    field: "parentName",
    title: "PARENT GROUPS",
    show: true,
    filter: "text",
    groupable: false,
  },
];

interface PageState {
  skip: number;
  take: number;
}

const pagerSettings: GridPagerSettings = {
  buttonCount: 5,
  info: true,
  type: "numeric",
  pageSizes: [25, 50, 75, 100, 500, 1000],
  previousNext: true,
};

const booleanFilterCellOptions = [{
  text: "Official",
  value: true,
}, {
  text: "Unofficial",
  value: false,
}];
const initialDataState: PageState = { skip: 0, take: 25 };
const gridConfiguration = { columns, pagerSettings, initialDataState, booleanFilterCellOptions };

export default gridConfiguration;

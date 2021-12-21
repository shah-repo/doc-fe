import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";

const columns = [
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
  text: "Active",
  value: true,
}, {
  text: "InActive",
  value: false,
}];

const initialDataState: PageState = { skip: 0, take: 25 };
const gridConfiguration = { columns, pagerSettings, initialDataState, booleanFilterCellOptions };

export default gridConfiguration;

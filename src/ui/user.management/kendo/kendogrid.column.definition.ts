import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { ActiveCell } from "./cell_template/activeCell";
import { GroupDropdown } from "./cell_template/groupDropdown";
import { GroupsCell } from "./cell_template/groupsCell";
import { SignedCell } from "./cell_template/signedCell";

const columns = [
  {
    field: "user.name",
    title: "NAME",
    show: true,
    filter: "text",
    groupable: false,
  },
  {
    field: "user.email",
    title: "EMAIL",
    show: true,
    filter: "text",
    groupable: false,
  },
  {
    field: "groups",
    title: "GROUPS",
    show: true,
    groupable: false,
    filterCell: GroupDropdown,
    cell: GroupsCell,
  },
  {
    field: "active",
    title: "ACTIVE",
    show: true,
    filter: "boolean",
    cell: ActiveCell,
  },
  {
    field: "user.confirmed",
    title: "SIGNED UP",
    show: true,
    filterable: false,
    cell: SignedCell,
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

const initialDataState: PageState = { skip: 0, take: 25 };
const gridConfiguration = { columns, pagerSettings, initialDataState };

export default gridConfiguration;

import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { BooleanFilterCell } from "./cell.template/BooleanFilterCell";
import { CommandCell } from "./cell.template/CommandCell";
import { EmployeesCell } from "./cell.template/EmployeesCell";
import { GroupCell } from "./cell.template/GroupCell";
import { NameCell } from "./cell.template/NameCell";
import { ParentsCell } from "./cell.template/ParentsCell";
import { PermissionsCell } from "./cell.template/PermissionsCell";
import { TagsCell } from "./cell.template/TagsCell";

const columns = [
  {
    field: "",
    title: "",
    show: true,
    groupable: false,
    filterable: false,
    cell: CommandCell,
    locked: true,
    width: "80px",
  },
  {
    field: "isOfficial",
    title: "GROUP TYPE",
    show: true,
    filter: "boolean",
    filterCell: BooleanFilterCell,
    cell: GroupCell,
  },
  {
    field: "name",
    title: "NAME",
    show: true,
    filter: "text",
    groupable: false,
    cell: NameCell,
  },
  {
    field: "memberNames",
    title: "MEMBERS",
    show: true,
    filter: "text",
    groupable: false,
    cell: EmployeesCell,
  },
  {
    field: "formattedPermissions",
    title: "PERMISSIONS",
    show: true,
    filter: "text",
    groupable: false,
    cell: PermissionsCell,
  },
  {
    field: "formattedTags",
    title: "TAGS",
    show: true,
    filter: "text",
    groupable: false,
    cell: TagsCell,
  },
  {
    field: "parentName",
    title: "PARENT GROUPS",
    show: true,
    filter: "text",
    groupable: false,
    cell: ParentsCell,
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

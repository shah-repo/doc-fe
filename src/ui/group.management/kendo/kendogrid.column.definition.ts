import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { BooleanFilterCell } from "./cell_template/booleanFilterCell";
import { CommandCell } from "./cell_template/commandCell";
import { EmployeesCell } from "./cell_template/employeesCell";
import { GroupCell } from "./cell_template/groupCell";
import { NameCell } from "./cell_template/nameCell";
import { ParentsCell } from "./cell_template/parentsCell";
import { PermissionsCell } from "./cell_template/permissionsCell";
import { TagsCell } from "./cell_template/tagsCell";

const columns = [
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
    field: "isOfficial",
    title: "GROUP TYPE",
    show: true,
    filter: "boolean",
    filterCell: BooleanFilterCell,
    cell: GroupCell,
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

  {
    field: "",
    title: "",
    show: true,
    filterable: false,
    cell: CommandCell,
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

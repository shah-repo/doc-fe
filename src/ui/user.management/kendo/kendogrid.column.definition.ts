import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { ActiveCell } from "./cell_template/activeCell";
import { BooleanFilterCell } from "./cell_template/booleanFilterCell";
import { CommandCell } from "./cell_template/commandCell";
import { EmailCell } from "./cell_template/emailCell";
import { GroupDropdown } from "./cell_template/groupDropdown";
import { GroupsCell } from "./cell_template/groupsCell";
import { NameCell } from "./cell_template/nameCell";
import { SignedCell } from "./cell_template/signedCell";

const columns = [
  {
    field: "user.name",
    title: "NAME",
    show: true,
    filter: "text",
    groupable: true,
    cell: NameCell,
  },
  {
    field: "user.email",
    title: "EMAIL",
    show: true,
    filter: "text",
    groupable: true,
    cell: EmailCell,
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
    filterCell: BooleanFilterCell,
    cell: ActiveCell,
  },
  {
    field: "user",
    title: "SIGNED UP",
    show: true,
    filterable: false,
    cell: SignedCell,
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
  text: "Active",
  value: true,
}, {
  text: "InActive",
  value: false,
}];

const initialDataState: PageState = { skip: 0, take: 25 };
const gridConfiguration = { columns, pagerSettings, initialDataState, booleanFilterCellOptions };

export default gridConfiguration;

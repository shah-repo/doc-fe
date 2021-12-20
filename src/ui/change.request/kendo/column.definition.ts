import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { KendoCellTemplates } from "../../components/common/kendo.column.templates/types";

const columns = [
  {
    field: "crId",
    title: "AR ID",
    show: true,
    filter: "text",
    locked: false,
    width: "200px",
    groupable: false,
    showColumnMenu: true,
    orderIndex: 0,
  },
  {
    field: "title",
    title: "AR TITLE",
    show: true,
    filter: "text",
    locked: false,
    width: "700px",
    groupable: false,
    showColumnMenu: true,
    orderIndex: 1,
  },
  {
    field: "owner.user.name",
    title: "OWNER",
    show: true,
    filter: "text",
    locked: false,
    width: "300px",
    groupable: true,
    cell: KendoCellTemplates.USER_AVATAR,
    showColumnMenu: true,
    orderIndex: 2,
  },
  {
    field: "state",
    title: "STATUS",
    show: true,
    locked: false,
    width: "200px",
    groupable: true,
    cell: KendoCellTemplates.STATUS,
    showColumnMenu: true,
    orderIndex: 3,
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

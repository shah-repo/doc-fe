import { pagerSettings } from "../../components/common/kendo/helpers";
import { KendoColumn, KendoGridConfiguration, PageState } from "../../components/common/kendo/types";

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
    showColumnMenu: false,
  },
  {
    field: "memberNames",
    title: "MEMBERS",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 3,
    showColumnMenu: false,
  },
  {
    field: "formattedPermissions",
    title: "PERMISSIONS",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 4,
    showColumnMenu: false,
  },
  {
    field: "formattedTags",
    title: "TAGS",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 5,
    showColumnMenu: false,
  },
  {
    field: "parentName",
    title: "PARENT GROUPS",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 6,
    showColumnMenu: false,
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

const initialDataState: PageState = { skip: 0, take: 25 };
const gridConfiguration: KendoGridConfiguration = {
  columns,
  pagerSettings,
  initialDataState,
};

export default gridConfiguration;

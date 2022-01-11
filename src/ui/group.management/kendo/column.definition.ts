import { pagerSettings } from "../../components/common/kendo/helpers";
import { KendoColumn, KendoGridConfiguration, PageState } from "../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "isOfficial",
    title: "group.management.group.type",
    show: true,
    filter: "boolean",
    groupable: true,
    orderIndex: 1,
    showColumnMenu: true,
  },
  {
    field: "name",
    title: "common.name",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 2,
    showColumnMenu: true,
  },
  {
    field: "memberNames",
    title: "common.members",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 3,
    showColumnMenu: true,
  },
  {
    field: "formattedPermissions",
    title: "common.permissions",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 4,
    showColumnMenu: true,
  },
  {
    field: "formattedTags",
    title: "common.tags",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 5,
    showColumnMenu: true,
  },
  {
    field: "parentName",
    title: "common.parent.groups",
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

const initialDataState: PageState = { skip: 0, take: 25 };
const gridConfiguration: KendoGridConfiguration = {
  columns,
  pagerSettings,
  initialDataState,
};

export default gridConfiguration;

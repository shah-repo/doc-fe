import { pagerSettings } from "../../components/common/kendo/helpers";
import { KendoColumn, KendoGridConfiguration, PageState } from "../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "groupType",
    title: "group.management.group.type",
    show: true,
    filter: "text",
    groupable: true,
    orderIndex: 1,
    showColumnMenu: true,
    width: 8,
  },
  {
    field: "name",
    title: "common.name",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 2,
    showColumnMenu: false,
    width: 8,
  },
  {
    field: "memberNames",
    title: "common.members",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 3,
    showColumnMenu: false,
    width: 500,
  },
  {
    field: "formattedPermissions",
    title: "common.permissions",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 4,
    showColumnMenu: false,
    width: 300,
  },
  {
    field: "formattedTags",
    title: "common.tags",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 5,
    showColumnMenu: false,
    width: 300,
  },
  {
    field: "parentName",
    title: "common.parent.groups",
    show: true,
    filter: "text",
    groupable: false,
    orderIndex: 6,
    showColumnMenu: false,
    width: 300,
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

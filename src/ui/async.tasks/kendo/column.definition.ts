import { pagerSettings } from "../../components/common/kendo/helpers";
import { KendoColumn, KendoGridConfiguration, PageState } from "../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "taskType",
    title: "async.task.type",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 1,
    showColumnMenu: false,
  },
  {
    field: "createdAt",
    title: "async.tasks.timestamp",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 2,
    showColumnMenu: false,
  },
  {
    field: "duration",
    title: "async.task.duration",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 3,
    showColumnMenu: false,
  },
  {
    field: "nextTaskTypes",
    title: "async.task.next.task.types",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 4,
    showColumnMenu: false,
  },
  {
    field: "status",
    title: "async.task.status",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 5,
    showColumnMenu: false,
  },
  {
    field: "employee.user.name",
    title: "common.name",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 6,
    showColumnMenu: false,
  },
  {
    field: "employee.user.email",
    title: "common.email",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
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

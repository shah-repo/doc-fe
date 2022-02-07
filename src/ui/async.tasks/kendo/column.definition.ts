import { pagerSettings } from "../../components/common/kendo/helpers";
import { KendoColumn, KendoGridConfiguration, PageState } from "../../components/common/kendo/types";

const columns: KendoColumn[] = [
  {
    field: "taskType",
    title: "Task Type",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 1,
    showColumnMenu: false,
  },
  {
    field: "createdAt",
    title: "TimeStamp",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 2,
    showColumnMenu: false,
  },
  {
    field: "duration",
    title: "Duration",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 3,
    showColumnMenu: false,
  },
  {
    field: "nextTaskTypes",
    title: "Next Task Types",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 4,
    showColumnMenu: false,
  },
  {
    field: "status",
    title: "Status",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 5,
    showColumnMenu: false,
  },
  {
    field: "employee.user.name",
    title: "Employee Name",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 6,
    showColumnMenu: false,
  },
  {
    field: "employee.user.email",
    title: "Employee Email",
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

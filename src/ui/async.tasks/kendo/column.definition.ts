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
    field: "duration",
    title: "Duration",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 2,
    showColumnMenu: false,
  },
  {
    field: "nextTaskTypes",
    title: "Next Task Types",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 8,
    showColumnMenu: false,
  },
  {
    field: "status",
    title: "Status",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 9,
    showColumnMenu: false,
  },
  {
    field: "employee.user.name",
    title: "Employee Name",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 10,
    showColumnMenu: false,
  },
  {
    field: "employee.user.email",
    title: "Employee Email",
    show: true,
    filter: "text",
    groupable: false,
    locked: false,
    orderIndex: 11,
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

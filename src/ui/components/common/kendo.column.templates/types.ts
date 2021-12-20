export enum KendoCellTemplates {
  USER_AVATAR="UserAvatar",
  STATUS="Status",
  DATE_COMPLETED="DateCompleted",
  DATE_INFO="DateInfo",
  COMMON_CELL="CommonCell"
}

export interface KendoColumnInterface {
  field: string;
  title: string;
  show: boolean;
  showColumnMenu: boolean;
  format?: any; // TODO Check
  filter?: "boolean" | "numeric" | "text" | "date" | undefined;
  groupable: boolean;
  filterCell?: any;  // TODO: FIND TYPE FOR TEMPLATE
  cell?: any; // TODO: FIND TYPE FOR TEMPLATE
  locked?: boolean;
  width?: any;
  columnMenu?: any; // TODO: FIND TYPE FOR TEMPLATE
}

import { DropdownFilterDefaultItem } from "../../components/common/kendo/types";

export interface DroDownFilterChangeProps {
  parentField: string;
  selectedItem: DropdownFilterDefaultItem;
}

export enum DateFields {
  CREATED_AT= "createdAt",
  DUE_ON= "dueOn",
  COMPLETED_AT="completedAt"
}

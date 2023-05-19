import { KendoPanelProps } from '../../components/common/kendo/types';
import { TableColumnActionType } from '../../components/table/column/types';

type GridRowSelection<T> = (
  props: GridRowSelectionProps<T>
) => () => any;


interface GridRowSelectionProps<T> {
  dataItem: T;
  actionType?: TableColumnActionType;
}

export interface UserManage {
  id: string;
  name: string;
  email: string;
  groups?: string[];
  active?: boolean | string;
  confirmed?: boolean | string;
  inEdit?: boolean | string;
  groupsOrg?: string[];
  isNewRecord?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export interface AddUserManage {
  user: User;
  groups?: string[];
}

export interface UserManagementProps<T> extends KendoPanelProps<T>{
  onSelect: GridRowSelection<T>;
  rerender: boolean;
}

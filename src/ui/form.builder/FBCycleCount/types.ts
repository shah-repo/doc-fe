import { Employee } from '../../../state/ducks/company/types';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../components/KendoDataGrid/constants';
import { FBInputProps } from '../FBInput/FBInput.types';

export enum ActionNeededType {
  Yes = 'Yes',
  No = 'No',
}

export type FBCycleCountProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  cycleCounts: CycleCount[]
  employees: Employee[]
  onHandQuantity?: number
  onHandQuantityUnit?: string
  cycleCountFrequency?: number
  updateCycleCount: (item: CycleCount) => void
  deleteCycleCount: (item: CycleCount) => void
};

export interface CycleCount {
  id: string
  by: string
  count: number
  systemCounte: number
  date: string
  actionNeeded: ActionNeededType
  comments?: string
}

export interface EditableCycleCount extends CycleCount {
  [MODE_FIELD]: Mode
}

export interface CycleCountEditEvent {
  dataItem: EditableCycleCount
}

export interface CustomTemplateProps extends CellTemplateProps<EditableCycleCount> {
  onClick?: (e: CycleCountEditEvent) => void
}

import { MODE_FIELD } from './components/treelist/constants';

export interface EquipmentItem {
  id: string
  plannedId?: string
  actualId?: string
  calDueDate?: string
  pmDueDate?: string
  actualItems?: Array<Partial<EquipmentItem>>
  title?: string
  LHRTparameter?: boolean
  type?: string
  paramsId?: string
}

export interface EditableEquipmentItem extends EquipmentItem {
  [MODE_FIELD]?: boolean
}

export interface EquipmentItemEditEvent {
  dataItem: EditableEquipmentItem
  level: number[]
}

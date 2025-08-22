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
  actualEquipDocId?: string
  isActualIdAddition?: boolean
}

export interface EditableEquipmentItem extends EquipmentItem {
  [MODE_FIELD]?: boolean
  parentEquipPlannedId?: string
  parentId?: string
}

export interface EquipmentItemEditEvent {
  dataItem: EditableEquipmentItem
  level: number[]
}

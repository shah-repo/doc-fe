import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FBBOMProps {}
export interface Employee {
  id: number
  title: string
  displayRevision: string
  displayStatus: string
  cost: string
  docId: string
  leadTime?: string
  quantity?: string
  unit?: string
  name: string
  reportsTo?: null | number
  phone?: string
  extension?: number
  hireDate?: Date
  fullTime: boolean
  position: string
  timeInPosition?: number
  employees?: Employee[]
  inEdit?: boolean
  isNew?: boolean
}

export interface DataState {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
}

export interface EmployeesFlat {
  id: number
  name: string
  reportsTo: null | number
  phone: string
  extension: number
  hireDate: Date
  fullTime: boolean
  position: string
  timeInPosition: number
}

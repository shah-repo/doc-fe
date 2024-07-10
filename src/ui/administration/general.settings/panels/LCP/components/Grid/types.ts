import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { MODE_FIELD } from '../../../../../../components/KendoDataGrid/constants';

// Remove keys at last
// id , createdAt, updatedAt, order, enlilType, displayLabel, isAllowedOnPO, isAllowedOnLhrProd, isAllowedToBuy,
export interface LCP {
  id: string
  category: string
  order?: string
  enlilType: string
  displayLabel: string
  isAllowedOnPO: string
  isAllowedOnLhrProd: string
  isAllowedToBuy: string
  inEdit?: boolean
  isAdd?: boolean
}

export interface EditableLCP extends LCP {
  [MODE_FIELD]?: boolean
}

export interface LCPState {
  data: LCP[]
  dataState: DataState
  expanded: string[]
  inEdit: Array<{id: string }>
}

interface DataState {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
}

export interface CustomGroupDataItem {
  items: LCP[]
  value: string
  field: string
  groupId: string
  expanded: boolean
}

import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { MODE_FIELD } from '../../../../../../components/KendoDataGrid/constants';

export interface LCP {
  id: string
  category: string
  type: string
  label: string
  AllowOnPOWithApprovedSupplier: string
  AllowOnLHRProduction: string
  AllowToBuy: string
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

import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { OptionType } from '../../../../../../components/forms/fields/Autocomplete/types';
import { MODE_FIELD } from '../../../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';

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
  documentTypeIdArr: string[]
  isUserAdded?: boolean
  group?: string
  isUserModified?: boolean
  inEdit?: boolean
  isAdd?: boolean
  isAddPhase?: boolean
  enlilTypeOptions?: string[]
  otherLabelOptions?: string[]
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

export interface CustomGroupOptions extends OptionType{
  category: string
}

export interface GroupDocTypes {
  id: string
  documentTypeName: string
  documentTypeAcronym: string
  group: string
}

export interface LCPResponse {
  docTypes: GroupDocTypes[]
  phases: LCP[]
}

export interface processLCPType {
  groups: CustomGroupOptions[]
  phases: LCP[]
}

export interface SchemaOptions {
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: () => void
}

export type CustomTemplateProps = CellTemplateProps<EditableLCP>;

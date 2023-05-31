import { FBSchemaProps } from '..';

export interface SortableFieldProps {
  item: FBSchemaProps
  isFirst: boolean
  autosave: boolean
  disabled: boolean
  isDragging?: boolean
}

export interface SortableItemProps {
  item: FBSchemaProps
  isFirst: boolean
  isDesignMode: boolean
  isAutosaveEnabled: boolean
}

export interface FBSortableProps {
  items?: FBSchemaProps[]
  updateWorkspaceSchema?: (oldIndex: string, newIndex: string) => void
}

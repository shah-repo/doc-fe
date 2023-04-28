import { GridFilterCellProps } from '@progress/kendo-react-grid';

interface SelectedItemProps {
  text: string
  value: string | boolean
}

interface StateChangeProps {
  selectedItem?: SelectedItemProps
  parentField: string | undefined
}

export interface DropdownFilterCellProps extends GridFilterCellProps {
  defaultItem: {
    text: string
    value: string
  }
  defaultValue?: {
    text: string
    value: string
  }
  data: Array<{
    text: string
    value: string | boolean
  }>
  customOperator?: string
  onStateChange?: (data: StateChangeProps) => void
}

import { GridFilterCellProps } from '@progress/kendo-react-grid';

interface Item {
  text: string
  value: string | boolean | undefined
}

export interface DropdownFilterCellProps extends GridFilterCellProps {
  defaultItem: Item
  defaultValue?: Item
  data: Item[]
  disabled?: boolean
}

import { GridFilterCellProps } from '@progress/kendo-react-grid';

interface Item {
  text: string
  value: string | boolean | undefined | null
}

export interface DropdownFilterCellProps extends GridFilterCellProps {
  defaultItem: Item
  defaultValue?: Item
  data: Item[]
  disabled?: boolean
}

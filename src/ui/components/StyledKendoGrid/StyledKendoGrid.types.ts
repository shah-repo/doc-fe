import { GridProps, GridRowProps } from '@progress/kendo-react-grid';

export interface StyledKendoGridProps extends GridProps {
  hasBoxScrollbars?: boolean
}

export type RowComponent = (row: React.ReactElement<HTMLTableRowElement>, props: GridRowProps) => React.ReactNode;

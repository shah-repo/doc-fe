import { State } from '@progress/kendo-data-query';
import { Grid, GridCellProps, GridColumnProps, GridColumnReorderEvent, GridDataStateChangeEvent, GridProps } from '@progress/kendo-react-grid';
import React, { ComponentType } from 'react';

export interface CellTemplateProps<T> extends GridCellProps {
  dataItem: T
  column: GenericColumnDefinition<T>
}

export type CellComponent<T> = ComponentType<CellTemplateProps<T>>;

export type CellTemplate<T> = (props: CellTemplateProps<T>) => React.ReactNode;

export interface GenericColumnDefinition<T> extends Omit<GridColumnProps, 'id' | 'cell'> {
  id: string
  hidden?: boolean
  fitContent?: boolean
  cell?: CellComponent<T>
  template?: CellTemplate<T>
}
export interface ColumnDefinition<T> extends Omit<GenericColumnDefinition<T>, 'field'> {
  field?: keyof T
}

export interface DataGridProps<T> extends GridProps {
  data: T[]
  schema: Array<ColumnDefinition<T>>
  fullWidth?: boolean
  fullHeight?: boolean
  hasBoxScrollbars?: boolean
  fallback?: React.ReactNode
  onDataStateChange?: (event: GridDataStateChangeEvent) => State
  onColumnReorder?: (event: GridColumnReorderEvent) => Array<ColumnDefinition<T>>
  calculateColumWidth?: WidthCalculator
  ref?: React.MutableRefObject<Grid>
}

export interface CustomGridCellProps extends GridCellProps {
  column: GenericColumn
}

export type WidthCalculator = (width: number, gridWidth: number) => number;

export type GenericColumn = GenericColumnDefinition<Record<string, unknown>>;

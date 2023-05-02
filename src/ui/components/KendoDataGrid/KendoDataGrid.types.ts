import { State } from '@progress/kendo-data-query';
import { Grid, GridCellProps, GridColumnProps, GridColumnReorderEvent, GridDataStateChangeEvent, GridProps, GridRowClickEvent } from '@progress/kendo-react-grid';
import React, { ComponentType, ReactElement } from 'react';

export interface DataGridRowClickEvent<T> extends GridRowClickEvent {
  dataItem: T
}

interface CellTemplateProps<T> extends GridCellProps {
  dataItem: T
  column: Omit<GenericColumnDefinition<T>, 'cell' | 'template' | 'children'>
}

export type CellComponent<T = unknown> = ComponentType<CellTemplateProps<T>>;

export type CellTemplate<T = unknown> = (props: CellTemplateProps<T>) => React.ReactNode;

interface GenericColumnDefinition<T> extends Omit<GridColumnProps, 'id' | 'cell' | 'children'> {
  id: string
  hidden?: boolean
  fitContent?: boolean
  children?: Array<GenericColumnDefinition<T>>
  cell?: CellComponent<T>
  template?: CellTemplate<T>
}

export interface ColumnDefinition<T> extends Omit<GenericColumnDefinition<T>, 'field' | 'children'> {
  // TODO after upgrading typescript switch to object-deep-keys generic type
  field?: keyof T | string
  children?: Array<ColumnDefinition<T>> | Array<ReactElement<ColumnDefinition<T>>>
}

export interface DataGridProps<T> extends GridProps {
  data: T[]
  schema: Array<ColumnDefinition<T>>
  skipDataProcessing?: boolean
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

export type GenericColumn = GenericColumnDefinition<unknown>;

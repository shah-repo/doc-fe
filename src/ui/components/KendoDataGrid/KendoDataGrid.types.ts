import { State } from '@progress/kendo-data-query';
import { Grid, GridCellProps, GridColumnProps, GridColumnReorderEvent, GridDataStateChangeEvent, GridHeaderCellProps, GridRowClickEvent } from '@progress/kendo-react-grid';
import React, { ComponentType, ReactElement } from 'react';
import { StyledKendoGridProps } from '../StyledKendoGrid/StyledKendoGrid.types';

export interface DataGridRowClickEvent<T> extends GridRowClickEvent {
  dataItem: T
}

export interface CellTemplateProps<T> extends GridCellProps {
  dataItem: T
  field: string
  column: Omit<GenericColumnDefinition<T>, 'cell' | 'template' | 'children'>
}

export type CellComponent<T = unknown, R = Record<string, unknown>> = ComponentType<CellTemplateProps<T> & R>;

export type CellTemplate<T = unknown, R = Record<string, unknown>> = (props: CellTemplateProps<T> & R) => React.ReactNode;

export type HeaderCellComponent = ComponentType<CustomGridHeaderCellProps>;

export interface GenericColumnDefinition<T = unknown> extends Omit<GridColumnProps, 'id' | 'cell' | 'headerCell' | 'children'> {
  id: string
  hidden?: boolean
  fitContent?: boolean
  children?: Array<GenericColumnDefinition<T>>
  cell?: CellComponent<T>
  headerCell?: HeaderCellComponent
  template?: CellTemplate<T>
}

export interface ColumnDefinition<T> extends Omit<GenericColumnDefinition<T>, 'field' | 'children'> {
  // TODO after upgrading typescript switch to object-deep-keys generic type
  field?: keyof T | string
  children?: Array<ColumnDefinition<T>> | Array<ReactElement<ColumnDefinition<T>>>
}

export interface DataGridProps<T> extends StyledKendoGridProps {
  data: T[]
  schema: Array<ColumnDefinition<T>>
  loading?: boolean
  skipDataProcessing?: boolean
  fullWidth?: boolean
  fullHeight?: boolean
  fallback?: React.ReactNode
  onDataStateChange?: (event: GridDataStateChangeEvent) => State
  onColumnReorder?: (event: GridColumnReorderEvent) => Array<ColumnDefinition<T>>
  calculateColumWidth?: WidthCalculator
  ref?: React.MutableRefObject<Grid>
}

export interface CustomGridCellProps extends Omit<GridCellProps, 'field'> {
  field: string
  column: GenericColumnDefinition
}
export interface CustomGridHeaderCellProps extends Omit<GridHeaderCellProps, 'field'> {
  field: string
  column: GenericColumnDefinition
}

export type WidthCalculator = (width: number, gridWidth: number) => number;

import { State, process } from '@progress/kendo-data-query';
import { Grid, GridCell, GridColumn, GridColumnReorderEvent, GridDataStateChangeEvent, GridNoRecords } from '@progress/kendo-react-grid';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AutoSizer } from 'react-virtualized';
import { translate } from '../../../common/intl';
import StyledKendoGrid from '../../components/StyledKendoGrid/StyledKendoGrid';
import { ColumnDefinition, CustomGridCellProps, DataGridProps, GenericColumn, WidthCalculator } from './KendoDataGrid.types';

const CustomGridCell: React.FC<CustomGridCellProps> = ({ column, ...props }) => (
  column.cell
    ? <column.cell {...props} column={column} />
    : (
      <GridCell
        {...props}
        render={(element, props) => {
          if (React.isValidElement(element) && column.template) {
            return React.cloneElement(element, {}, column.template({ ...props, column }));
          }
          return element;
        }}
      />
    )
);

const renderColumns = (columns: GenericColumn[], gridWidth: number, calculateColumWidth?: WidthCalculator) =>
  columns.map(({ hidden, ...column }) => (
    !hidden && (
      <GridColumn
        {...column}
        key={column.id}
        field={column.field ?? `custom-${column.id}`}
        title={column.title ? translate(column.title) : undefined}
        cell={(props) => <CustomGridCell { ...props} column={column} />}
        resizable={column.resizable && !column.fitContent}
        width={
          calculateColumWidth && typeof column.width === 'number'
            ? calculateColumWidth(column.width, gridWidth)
            : column.width
        }
      />
    )
  ));

const defaultDataState: State = {
  filter: {
    logic: 'and',
    filters: [],
  },
  group: [],
  sort: [],
};

export function KendoDataGrid<T> ({
  data,
  schema,
  fullWidth,
  fullHeight,
  fallback,
  onColumnReorder,
  onDataStateChange,
  calculateColumWidth,
  ref,
  ...props
}: DataGridProps<T>): React.ReactElement | null {
  const gridRef = ref ?? useRef<Grid>();
  const [columnsSchema, setColumnsSchema] = useState<Array<ColumnDefinition<T>>>(schema);
  const [dataState, setDataState] = useState<State>(defaultDataState);

  useEffect(() => {
    setColumnsSchema(schema);
  }, [schema]);

  const resultData = useMemo(
    () => process(data, dataState),
    [data, dataState],
  );

  const autosizedColumns = useMemo(
    () => columnsSchema.filter((column) => column.fitContent).map((column) => column.id),
    [columnsSchema],
  );

  useLayoutEffect(() => {
    if (autosizedColumns.length && gridRef.current) {
      gridRef.current.fitColumns(autosizedColumns);
    }
  });

  const updateDataState = (event: GridDataStateChangeEvent) => {
    onDataStateChange
      ? setDataState(onDataStateChange(event))
      : setDataState(event.dataState);
  };

  const reorderColumns = (event: GridColumnReorderEvent) => {
    if (onColumnReorder) {
      return setColumnsSchema(onColumnReorder(event));
    }
    const { columns } = event;
    setColumnsSchema((prevSchema) => prevSchema.map((column) => {
      const updatedColumn = columns.find((el) => el.id === column.id);
      return {
        ...column,
        orderIndex: updatedColumn ? updatedColumn.orderIndex : column.orderIndex,
      };
    }));
  };

  return (
    <AutoSizer
      {...{
        disableWidth: !fullWidth,
        disableHeight: !fullHeight,
      }}
    >
      {({ width, height }) => (
        <StyledKendoGrid
          {...props}
          style={{
            width: fullWidth ? `${width}px` : undefined,
            height: fullHeight ? `${height}px` : undefined,
          }}
          data={resultData}
          onDataStateChange={updateDataState}
          onColumnReorder={reorderColumns}
          ref={gridRef}
          {...dataState}
        >
          {renderColumns(columnsSchema as GenericColumn[], width, calculateColumWidth)}
          {fallback && (
            <GridNoRecords>{fallback}</GridNoRecords>
          )}
        </StyledKendoGrid>
      )}
    </AutoSizer>
  );
}

export default KendoDataGrid;

import { State, process } from '@progress/kendo-data-query';
import { Grid, GridCell, GridColumn, GridDataStateChangeEvent, GridHeaderCell, GridNoRecords, GridProps } from '@progress/kendo-react-grid';
import { kebabCase } from 'lodash';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AutoSizer } from 'react-virtualized';
import { translate } from '../../../common/intl';
import StyledKendoGrid from '../../components/StyledKendoGrid/StyledKendoGrid';
import Loader from '../common/kendo/Loader';
import { ColumnDefinition, CustomGridCellProps, CustomGridHeaderCellProps, DataGridProps, GenericColumnDefinition, WidthCalculator } from './KendoDataGrid.types';

const CustomGridCell: React.FC<CustomGridCellProps> = ({ column, field, ...props }) => (
  column.cell
    ? <column.cell {...props} column={column} field={field} />
    : (
      <GridCell
        {...props}
        field={field}
        render={(element, props) => {
          if (React.isValidElement(element) && column.template) {
            return React.cloneElement(
              element,
              {
                ...element.props,
                ['data-cy' as string]: `cell-${kebabCase(column.id)}`,
              },
              column.template({ ...props, column, field }),
            );
          }
          return element;
        }}
      />
    )
);

const CustomHeaderCell: React.FC<CustomGridHeaderCellProps> = ({ column, ...props }) => {
  if (column.headerCell) {
    return <column.headerCell {...props} column={column} />;
  }
  return column.title ? <GridHeaderCell {...props} /> : null;
};

function isGenericColumns (columns: GenericColumnDefinition['children']): columns is GenericColumnDefinition[] {
  return Array.isArray(columns) && columns.every((item) => 'id' in item);
}

const renderColumns = (columns: GenericColumnDefinition[], gridWidth: number, calculateColumWidth?: WidthCalculator) =>
  columns.filter(({ hidden }) => !hidden).map(({ children, ...column }) => {
    const field = column.field ?? `custom-${column.id}`;

    return (
      <GridColumn
        {...column}
        key={column.id}
        field={field}
        title={translate(column.title)}
        cell={(props) => <CustomGridCell {...props} column={column} field={field} />}
        headerCell={(props) => <CustomHeaderCell {...props} column={column} field={field} />}
        resizable={column.resizable && !column.fitContent}
        width={
          calculateColumWidth && typeof column.width === 'number'
            ? calculateColumWidth(column.width, gridWidth)
            : column.width
        }
      >
        {
          isGenericColumns(children)
            ? renderColumns(children, gridWidth, calculateColumWidth)
            : children
        }
      </GridColumn>
    );
  });

const DEFAULT_DATA_STATE: State = {
  filter: {
    logic: 'and',
    filters: [],
  },
};

function KendoDataGrid<T> ({
  data,
  defaultDataState = DEFAULT_DATA_STATE,
  filter,
  group,
  sort,
  skipDataProcessing,
  loading,
  schema,
  fullWidth,
  fullHeight,
  fallback,
  onColumnReorder,
  onDataStateChange,
  calculateColumWidth,
  ref,
  containerRef,
  style,
  ...props
}: DataGridProps<T>): React.ReactElement {
  const gridRef = ref ?? useRef<Grid>();
  const gridContainerRef = containerRef ?? useRef<HTMLDivElement>(null);
  const [columnsSchema, setColumnsSchema] = useState<Array<ColumnDefinition<T>>>(schema);
  const [dataState, setDataState] = useState<State>({
    ...defaultDataState,
    ...filter && { filter },
    ...group && { group },
    ...sort && { sort },
  });

  useEffect(() => {
    setColumnsSchema(schema);
  }, [schema]);

  useEffect(() => {
    setDataState((prev) => ({
      ...prev,
      ...filter && { filter },
      ...group && { group },
      ...sort && { sort },
    }));
  }, [filter, group, sort]);

  const resultData = useMemo(
    () => skipDataProcessing ? data : process(data, dataState),
    [data, skipDataProcessing, dataState],
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
    setDataState(
      onDataStateChange
        ? onDataStateChange(event)
        : event.dataState,
    );
  };

  const reorderColumns: GridProps['onColumnReorder'] = (event) => {
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
      disableWidth={!fullWidth}
      disableHeight={!fullHeight}
    >
      {({ width, height }) => (
        <>
          <StyledKendoGrid
            {...props}
            style={{
              width: fullWidth ? `${width}px` : undefined,
              height: fullHeight ? `${height}px` : undefined,
              ...style,
            }}
            data={resultData}
            onDataStateChange={updateDataState}
            onColumnReorder={reorderColumns}
            ref={gridRef}
            containerRef={containerRef}
            {...dataState}
          >
            {renderColumns(columnsSchema as GenericColumnDefinition[], width, calculateColumWidth)}
            {fallback && (
              <GridNoRecords>{fallback}</GridNoRecords>
            )}
          </StyledKendoGrid>
          {loading && (
            <Loader gridRef={gridContainerRef} />
          )}
        </>
      )}
    </AutoSizer>
  );
}

export default KendoDataGrid;

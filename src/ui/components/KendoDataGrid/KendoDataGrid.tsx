import { State, process } from '@progress/kendo-data-query';
import { Grid, GridCell, GridCellProps, GridColumn, GridDataStateChangeEvent, GridHeaderCell, GridNoRecords, GridProps, GridRowClickEvent } from '@progress/kendo-react-grid';
import invariant from 'invariant';
import { flatMapDeep, kebabCase } from 'lodash';
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AutoSizer } from 'react-virtualized';
import { translate } from '../../../common/intl';
import StyledKendoGrid from '../../components/StyledKendoGrid/StyledKendoGrid';
import Loader from '../common/kendo/Loader';
import { ColumnDefinition, CustomGridCellProps, CustomGridHeaderCellProps, DataGridProps, GenericColumnDefinition, WidthCalculator } from './KendoDataGrid.types';
import { SOLO_OPERATORS } from './constants';

const DEFAULT_DATA_STATE: State = {
  filter: {
    logic: 'and',
    filters: [],
  },
};

const CustomGridCell: React.FC<CustomGridCellProps> = ({ column, field, onClick, ...props }) => {
  const onCellClick = (e: GridRowClickEvent) => {
    onClick?.({
      ...e,
      dataItem: props.dataItem,
    });
  };
  return (
    column.cell
      ? <column.cell {...props} column={column} field={field} onClick={onCellClick} />
      : (
        <GridCell
          {...props}
          field={field}
          render={(element, props) => {
            if (React.isValidElement(element)) {
              return React.cloneElement(
                element,
                {
                  ['data-cy' as string]: `cell-${kebabCase(column.id)}`,
                },
                column.template
                  ? column.template({ ...props, column, field, onClick: onCellClick })
                  : undefined,
              );
            }
            return element;
          }}
        />
      )
  );
};

const CustomHeaderCell: React.FC<CustomGridHeaderCellProps> = ({ column, ...props }) => {
  if (column.headerCell) {
    return <column.headerCell {...props} column={column} />;
  }
  return column.title ? <GridHeaderCell {...props} /> : null;
};

function isGenericColumns (columns: GenericColumnDefinition['children']): columns is GenericColumnDefinition[] {
  return Array.isArray(columns) && columns.every((item) => 'id' in item);
}

const GridContext = React.createContext<{
  columns: GenericColumnDefinition[]
  onRowClick?: GridProps['onRowClick']
}>({
  columns: [],
  onRowClick: undefined,
});

function processSchema<T> (schema: Array<ColumnDefinition<T>>): Array<ColumnDefinition<T>> {
  return schema.map((column) => {
    const field = column.field ?? `custom-${column.id}`;

    return {
      ...column,
      field,
    };
  });
}

const CellWrapper = (props: GridCellProps) => {
  const { columns, onRowClick } = useContext(GridContext);

  invariant(props.field, 'Field is required when using custom cell');

  const allColumns = useMemo(
    () => flatMapDeep(columns, (column) => (column?.children ? [column, ...column?.children] : [column])),
    [columns],
  );

  const column = allColumns.find(({ field }) => field === props.field);

  invariant(column, `Column with field ${props.field} not found`);

  if (!column) {
    return null;
  }
  return (
    <CustomGridCell
      {...props}
      column={column}
      field={props.field}
      onClick={onRowClick}
    />
  );
};

const renderColumns = (
  columns: GenericColumnDefinition[],
  gridWidth: number,
  calculateColumWidth?: WidthCalculator,
) => {
  return columns.filter(({ hidden }) => !hidden).map(({ children, ...column }) => {
    const shouldUseCustomCell = column.cell ?? column.template;

    return (
      <GridColumn
        {...column}
        key={column.id}
        title={translate(column.title)}
        cell={shouldUseCustomCell ? CellWrapper : undefined}
        headerCell={(props) => <CustomHeaderCell {...props} column={column} />}
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
  onRowClick,
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
  const [columnsSchema, setColumnsSchema] = useState<Array<ColumnDefinition<T>>>(processSchema(schema));
  const [dataState, setDataState] = useState<State>({
    ...defaultDataState,
    ...filter && { filter },
    ...group && { group },
    ...sort && { sort },
  });

  useEffect(() => {
    setColumnsSchema(processSchema(schema));
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
    if (event.dataState.filter?.filters) {
      event.dataState.filter.filters = event.dataState.filter.filters
        .filter((item) => {
          if ('value' in item && 'operator' in item) {
            return (
              item.value !== undefined
              || (typeof item.operator === 'string' && SOLO_OPERATORS.includes(item.operator))
            );
          }

          return true;
        });
    }

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
        <GridContext.Provider
          value={{
            columns: columnsSchema as GenericColumnDefinition[],
            onRowClick,
          }}
        >
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
            onRowClick={onRowClick}
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
        </GridContext.Provider>
      )}
    </AutoSizer>
  );
}

export default KendoDataGrid;

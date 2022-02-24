import { Grid } from "@material-ui/core";
import { DataResult, process, State } from "@progress/kendo-data-query";
import { setExpandedState, setGroupIds } from "@progress/kendo-react-data-tools";
import {
  Grid as KendoTable,
  GridColumn as KendoColumn,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
  GridFilterCellProps, GridToolbar,
} from "@progress/kendo-react-grid";
import { cloneDeep, find, findIndex, map, set } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { AutoSizer, Size } from "react-virtualized";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { RenderCustomCell } from "../../components/common/kendo.column.templates/RenderCellTemplate";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import ColumnShowHideMenu from "../../components/common/kendo/ColumnShowHideMenu";
import { DisplayText, orderByLockedState, setColumnWidth, TranslatedText } from "../../components/common/kendo/helpers";
import { KendoColumn as KendoColumnProps } from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import { toastError } from "../../components/notifications";
import ClearFilters from "../../components/table/ClearFilters";
import useDidMount from "../../hooks/useDidMount";
import { ColumnMenu } from "./cell.templates/ColumnMenu";
import { DataLoader } from "./DataLoader";
import { CompletedDateFilterTemplate } from "./filter.template/CompletedDateFilterTemplate";
import { DocumentTypeFilterTemplate } from "./filter.template/DocumentTypeFilterTemplate";
import { DueOnDateFilterTemplate } from "./filter.template/DueOnDateFilterTemplate";
import { EffectiveDateFilterTemplate } from "./filter.template/EffectiveDateFilterTemplate";
import { StatusFilterTemplate } from "./filter.template/StatusFilterTemplate";
import { KendoGridProps } from "./interfaces";
import KendoGridStyles from "./KendoGrid.styles";

export function KendoGrid<T extends any>({
  tableName,
  tableCriteria,
  schema,
  statuses = [],
  onRowClick,
}: KendoGridProps<T>) {
  const didMount = useDidMount();
  const classes = KendoGridStyles();
  console.log("debug :: KendoPanel");
  const [columns, setColumns] = useState<KendoColumnProps[]>([]);
  const dispatch = useDispatch();
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  const [dataState, setDataState] = React.useState<State>(tableCriteria?.queryDict?.dataState);
  const [collapsedState, setCollapsedState] = useState<string[]>([]);

  useEffect(() => {
    if (didMount) {
      setDataState(tableCriteria.queryDict.dataState);
      if (tableCriteria.columnConfig) {
        setColumns(JSON.parse(tableCriteria.columnConfig));
      }
    }
  }, [didMount, tableCriteria]);

  const [products, setProducts] = React.useState<DataResult>({
    data: [],
    total: 77,
  });

  const processWithGroups = (data, dataState: State) => {
    const dataStateOne = cloneDeep(dataState);
    if (dataStateOne) {
      dataStateOne.skip = 0;
      const processedData = process(data.data, dataStateOne);
      setGroupIds({ data: processedData.data, group: dataStateOne.group });
      return processedData;
    }
    return data;
  };

  const [resultState, setResultState] = useState<DataResult>(
    processWithGroups(products, dataState)
  );

  const dataStateChange = (e: GridDataStateChangeEvent) => {
    setDataState(e.dataState);
    const groupedResultState = processWithGroups(products, e.dataState);
    setResultState(groupedResultState);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            dataState: e.dataState,
          },
        },
        tableName
      )
    );
  };

  const dataReceived = (products: DataResult) => {
    setProducts(products);
    const newDataState = processWithGroups(products, dataState);
    newDataState.total = products.total;
    setResultState(newDataState);
  };

  // Column Menu Filters
  const StatusFilter = (props: GridFilterCellProps) => (
    <StatusFilterTemplate
      {...props}
      data={statuses as DocumentRevisionStatus[]}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );
  const TypeFilter = (props: GridFilterCellProps) => (
    <DocumentTypeFilterTemplate
      {...props}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );
  const EffectiveDate = (props: GridFilterCellProps) => (
    <EffectiveDateFilterTemplate
      {...props}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );
  const CompletedDate = (props: GridFilterCellProps) => (
    <CompletedDateFilterTemplate
      {...props}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );
  const DueOnDate = (props: GridFilterCellProps) => (
    <DueOnDateFilterTemplate
      {...props}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );

  const filterCellMapping = {
    "displayStatus": StatusFilter,
    "document.documentType.documentTypeAcronym": TypeFilter,
    "effectiveDate": EffectiveDate,
    "completedAt": CompletedDate,
    "dueOn": DueOnDate,
    "createdAt": EffectiveDate,
    "releasedAt": EffectiveDate,
  };

  const sortedColumnDefinitions = orderByLockedState(
    columns,
    []
  );

  const renderKendoColumns = (
    gridWidth: number
  ) => (
    sortedColumnDefinitions.map((column, index) => (
      column.show && <KendoColumn
        key={index}
        {...column}
        title={getTranslatedText(column.title)}
        width={setColumnWidth(column.width as number, gridWidth)}
        minResizableWidth={200}
        headerCell={
          column.title ? (props) => <ColumnHeader {...props} /> : undefined
        }
        cell={(props) =>
          RenderCustomCell(
            {
              ...props,
              cellRowClick: onRowClick,
              showTooltip: column.showTooltip,
              tooltipField: column.tooltipField,
            },
            column.cell || ""
          )
        }
        filterCell={
          filterCellMapping[column.field]
            ? filterCellMapping[column.field]
            : undefined
        }
        columnMenu={
          column.showColumnMenu
            ? (props) => (
              <ColumnMenu
                {...props}
                tableName={tableName}
                columns={columns}
              />
            )
            : undefined
        }
      />)
    ));
  const clearFilter = () => {
    set(dataState, "filter.filters", []);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            dataState,
          },
        },
        tableName
      )
    );
  };
  const updateDataColumnsState = (dataColumns: KendoColumnProps[]) => {
    setColumns(dataColumns);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          columnConfig: JSON.stringify(dataColumns),
        },
        tableName
      )
    );
  };
  const onColumnShowHide = ({ field }) => {
    const isGrouped = findIndex(dataState.group, { field });
    if (isGrouped > -1) {
      toastError(getTranslatedText("common.no.hide"));
      return;
    }
    const dataColumns = map(columns, (column) => {
      if (column.field === field) {
        column.show = !column.show;
      }
      return column;
    });
    updateDataColumnsState(dataColumns);
  };
  const onExpandChange = useCallback(
    ({ dataItem, value }: GridExpandChangeEvent) => {
      const item = dataItem;
      if (item.groupId) {
        const newCollapsedIds = !value
          ? [...collapsedState, item.groupId]
          : collapsedState.filter((groupId) => groupId !== item.groupId);
        setCollapsedState(newCollapsedIds);
      }
    },
    [collapsedState]
  );

  const onColumnResize = ({ end, columns: cols }: GridColumnResizeEvent) => {
    if (!end) { return false; }
    let dataColumns = columns;
    dataColumns = map(dataColumns, (column) => {
      const columnObject = find(cols, { field: column.field });
      column.width = columnObject ? columnObject.width : column.width;
      return column;
    });
    setColumns(dataColumns);
    updateDataColumnsState(dataColumns);
  };

  const onColumnReorder = ({ columns: cols }: GridColumnReorderEvent) => {
    let dataColumns = columns;
    dataColumns = map(dataColumns, (column) => {
      const columnObject = find(cols, { field: column.field });
      column.orderIndex = columnObject?.orderIndex;
      return column;
    });
    setColumns(dataColumns);
    updateDataColumnsState(dataColumns);
  };

  const result = setExpandedState({
    data: resultState.data,
    collapsedIds: collapsedState,
  });

  // Render Kendo Columns
  const renderKendoGrid = ({ width }: Size) => (
    <>
      <KendoGlobalization>
        <KendoTable
          style={{ width: `${width}px` }}
          className={classes.grid}
          filterable={true}
          sortable={true}
          pageable={true}
          groupable={true}
          reorderable={true}
          resizable={true}
          {...dataState}
          data={result}
          total={products.total}
          onDataStateChange={dataStateChange}
          onExpandChange={onExpandChange}
          expandField="expanded"
          onColumnResize={onColumnResize}
          onColumnReorder={onColumnReorder}
        >
          <GridToolbar>
            <Grid container>
              <Grid item={true} xs={6} style={{ textAlign: "left" }}>
                <ClearFilters {...{ clearFilter }} />
              </Grid>
              <Grid item={true} xs={6} style={{ textAlign: "right" }}>
                <ColumnShowHideMenu
                  columnDefinition={columns}
                  onChange={onColumnShowHide}
                />
              </Grid>
            </Grid>
          </GridToolbar>
          {renderKendoColumns(width)}
        </KendoTable>

        {dataState && (
          <DataLoader
            dataState={dataState}
            onDataReceived={dataReceived}
            schema={schema}
            tableName={tableName}
          />
        )}
      </KendoGlobalization>
    </>
  );
  const renderBody = () => <AutoSizer>{renderKendoGrid}</AutoSizer>;
  return (
    <>
      <div style={{ color: "red" }}>{""}</div>
      {renderBody()}
    </>
  );
}

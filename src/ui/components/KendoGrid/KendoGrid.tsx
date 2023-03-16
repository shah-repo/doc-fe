import { Grid } from "@material-ui/core";
import { DataResult, FilterDescriptor, process, State } from "@progress/kendo-data-query";
import {
  setExpandedState,
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as KendoTable,
  GridColumn as KendoColumn,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
  GridFilterCellProps,
  GridNoRecords,
  GridToolbar,
} from "@progress/kendo-react-grid";
import { cloneDeep, find, findIndex, map, set } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { AutoSizer, Size } from "react-virtualized";
import { ChangeRequestStatus } from "../../../state/ducks/changeRequest/types";
import { DocumentCategory, DocumentRevisionStatus, DocumentRevisionStatusDisplay, POStatusLabelMapping } from "../../../state/ducks/documentRevisions/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { AsyncFilterTemplate } from "../../async.tasks/grid/filter.template/AsyncFilterTemplate";
import { DateFilterTemplate } from "../../async.tasks/grid/filter.template/DateFilterTemplate";
import { AsyncStatus, dropDownOptions } from "../../async.tasks/grid/helper";
import { changeRequestStatusOption } from "../../change.request/utils/helpers";
import { ColumnMenu } from "../../document.revision/grid/cell.templates/ColumnMenu";
import { CompletedDateFilterTemplate } from "../../document.revision/grid/filter.template/CompletedDateFilterTemplate";
import { DocumentTypeFilterTemplate } from "../../document.revision/grid/filter.template/DocumentTypeFilterTemplate";
import { DueOnDateFilterTemplate } from "../../document.revision/grid/filter.template/DueOnDateFilterTemplate";
import { EffectiveDateFilterTemplate } from "../../document.revision/grid/filter.template/EffectiveDateFilterTemplate";
import { InputFilterTemplate } from "../../document.revision/grid/filter.template/InputFilterTemplate";
import { StatusFilterTemplate } from "../../document.revision/grid/filter.template/StatusFilterTemplate";
import useDidMount from "../../hooks/useDidMount";
import { DropdownFilterTemplate } from "../common/kendo.column.templates/DropdownFilterTemplate";
import { RenderCustomCell } from "../common/kendo.column.templates/RenderCellTemplate";
import ColumnHeader from "../common/kendo/ColumnHeader";
import ColumnShowHideMenu from "../common/kendo/ColumnShowHideMenu";
import {
  DisplayText,
  hideColumnTitleOnResize,
  hideOperatorTooltip,
  orderByLockedState,
  pagerSettings,
  setColumnWidth,
  TranslatedText,
} from "../common/kendo/helpers";
import NoDataFound from "../common/kendo/NoDataFound";
import { KendoColumn as KendoColumnProps } from "../common/kendo/types";
import KendoGlobalization from "../KendoGlobalization";
import { toastError } from "../notifications";
import ClearFilters from "../table/ClearFilters";
import { DataLoader } from "./DataLoader";
import { KendoGridFilterCell, KendoGridProps } from "./interfaces";
import KendoGridStyles from "./KendoGrid.styles";

export function KendoGrid<T extends any>({
  tableName,
  tableCriteria,
  schema,
  statuses = [],
  onRowClick,
  queryUrl,
  defaultPayloadData,
  documentTypeCategory,
  exportDataChanges,
}: KendoGridProps<T>) {
  const didMount = useDidMount();
  const classes = KendoGridStyles();
  const [columns, setColumns] = useState<KendoColumnProps[]>([]);
  const dispatch = useDispatch();
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  const [dataState, setDataState] = React.useState<State>(
    tableCriteria?.queryDict?.dataState
  );
  const [collapsedState, setCollapsedState] = useState<string[]>([]);
  const [noDataMessage, setNoDataMessage] = useState(<span />);

  useEffect(() => {
    if (didMount) {
      setDataState(tableCriteria.queryDict.dataState);
      if (tableCriteria.columnConfig) {
        setColumns(JSON.parse(tableCriteria.columnConfig));
      }
    }
  }, [didMount, tableCriteria]);

  const [records, setRecords] = React.useState<DataResult>({
    data: [],
    total: 0,
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
    processWithGroups(records, dataState)
  );

  const dataStateChange = (e: GridDataStateChangeEvent) => {
    const updatedDataState = { ...e.dataState };
    // Hack to handle excpetion. Fixes ENC-11080
    if (updatedDataState.filter) {
      const updatedFilters = map(updatedDataState.filter.filters, (filterObject: FilterDescriptor) => {
        if (
          [
            "startswith",
            "endswith",
            "contains",
            "doesnotcontain",
            "isempty",
            "isnotempty",
          ].includes(filterObject.operator as string)
        ) {
          filterObject.value = filterObject.value || "";
        }
        return filterObject;
      });
      updatedDataState.filter.filters = updatedFilters as any;
    }
    setDataState(updatedDataState);
    const groupedResultState = processWithGroups(records, updatedDataState);
    setResultState(groupedResultState);
    setNoDataMessage(<span />);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            dataState: updatedDataState,
          },
        },
        tableName
      )
    );
  };

  const dataReceived = (data: DataResult, updatedDataState: State) => {
    setRecords(data);
    const newDataState = processWithGroups(data, updatedDataState);
    newDataState.total = data.total;
    exportDataChanges(newDataState.data);
    setResultState(newDataState);
    if (data.total === 0) {
      setNoDataMessage(<NoDataFound />);
    }
  };

  // Column Menu Filters
  const ActiveFilter = (props: GridFilterCellProps) => (
    <DropdownFilterTemplate
      {...props}
      data={[
        { value: true, text: getTranslatedText("common.active") },
        { value: false, text: getTranslatedText("common.inactive") },
      ]}
      defaultItem={{ value: "", text: getTranslatedText("common.all") }}
    />
  );

  const StatusFilter = (props: GridFilterCellProps) => (
    <StatusFilterTemplate
      {...props}
      documentTypeCategory={documentTypeCategory}
      data={statuses as DocumentRevisionStatus[]}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );

  const poStatusOptions = [
    POStatusLabelMapping.OPENED,
    POStatusLabelMapping.CLOSED,
    POStatusLabelMapping.VOIDED,
  ];

  const POStatusFilter = (props: GridFilterCellProps) => (
    <StatusFilterTemplate
      {...props}
      data={poStatusOptions}
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
  const StateFilter = (props: GridFilterCellProps) => (
    <StatusFilterTemplate
      {...props}
      data={map(changeRequestStatusOption(), "value") as ChangeRequestStatus[]}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );
  const TaskTypeFilter = (props: GridFilterCellProps) => (
    <AsyncFilterTemplate
      {...props}
      data={dropDownOptions.map((e) => e.value)}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );
  const AsyncStatusFilter = (props: GridFilterCellProps) => (
    <AsyncFilterTemplate
      {...props}
      data={AsyncStatus.map((e) => e.value)}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );
  const AsyncDateFilter = (props: GridFilterCellProps) => (
    <DateFilterTemplate
      {...props}
    />
  );
  const InputFilter = (props: GridFilterCellProps) => (
    <InputFilterTemplate {...props} />
  );

  const filterCellMapping = {
    [KendoGridFilterCell.ACTIVE]: ActiveFilter,
    [KendoGridFilterCell.DISPLAY_STATUS]: StatusFilter,
    [KendoGridFilterCell.PO_STATUS]: POStatusFilter,
    [KendoGridFilterCell.DOCUMENT_TYPE_ACRONYM]: TypeFilter,
    [KendoGridFilterCell.EFFECTIVE_DATE]: EffectiveDate,
    [KendoGridFilterCell.COMPLETED_AT]: CompletedDate,
    [KendoGridFilterCell.DUE_ON]: DueOnDate,
    [KendoGridFilterCell.CREATED_AT]: EffectiveDate,
    [KendoGridFilterCell.RELEASED_AT]: EffectiveDate,
    [KendoGridFilterCell.STATE]: StateFilter,
    [KendoGridFilterCell.TASKTYPE]: TaskTypeFilter,
    [KendoGridFilterCell.STATUS]: AsyncStatusFilter,
    [KendoGridFilterCell.ASYNC_CREATED_AT]: AsyncDateFilter,
  };

  const sortedColumnDefinitions = orderByLockedState(columns, []);

  const renderKendoColumns = (gridWidth: number) =>
    sortedColumnDefinitions.map(
      (column, index) =>
        column.show && (
          <KendoColumn
            key={index}
            {...column}
            title={getTranslatedText(column.title)}
            width={setColumnWidth(column.width as number, gridWidth)}
            minResizableWidth={200}
            headerCell={
              column.title ? (props) => <ColumnHeader {...props} /> : undefined
            }
            cell={(props) =>
            {
              props.dataItem.displayStatus =  ((documentTypeCategory === DocumentCategory.PurchaseOrder &&
                 props?.dataItem?.displayStatus === DocumentRevisionStatusDisplay.Released) ?
                DocumentRevisionStatusDisplay.Approved : props?.dataItem?.displayStatus );
              return RenderCustomCell(
                {
                  ...props,
                  cellRowClick: onRowClick,
                  showTooltip: column.showTooltip,
                  tooltipField: column.tooltipField,
                },
                column.cell || ""
              ); }
            }
            filterCell={
              filterCellMapping[column.filterCell as string]
                ? filterCellMapping[column.filterCell as string]
                : InputFilter
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
          />
        )
    );
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
    hideColumnTitleOnResize();
    if (!end) {
      return false;
    }
    let dataColumns = columns;
    dataColumns = map(dataColumns, (column) => {
      const columnObject = find(cols, { field: column.field });
      column.width = columnObject ? columnObject.width : column.width;
      return column;
    });
    setTimeout(() => {
      setColumns(dataColumns);
      updateDataColumnsState(dataColumns);
    }, 100);
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

  // Hide Choose Operator Tooltip. There is Kendo-react configuration to do this
  hideOperatorTooltip();

  // Render Kendo Columns
  const renderKendoGrid = ({ width }: Size) => (
    <>
      {console.log("width", width)}
      <KendoGlobalization>
        <KendoTable
          style={{ width: `${width}px` }}
          className={classes.grid}
          filterable={true}
          sortable={true}
          pageable={pagerSettings}
          groupable={true}
          reorderable={true}
          resizable={true}
          {...dataState}
          data={result}
          total={records.total}
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
          <GridNoRecords>{noDataMessage}</GridNoRecords>
        </KendoTable>

        {dataState && (
          <DataLoader
            dataState={dataState}
            onDataReceived={dataReceived}
            schema={schema}
            tableName={tableName}
            queryUrl={queryUrl}
            defaultPayloadData={defaultPayloadData}
            documentTypeCategory={documentTypeCategory}
            tableCriteria={tableCriteria}
          />
        )}
      </KendoGlobalization>
    </>
  );
  const renderBody = () => <AutoSizer>{renderKendoGrid}</AutoSizer>;
  return (
    <div className={classes.kendoGridContainer}>
      <div style={{ color: "red" }}>{tableCriteria.apiError}</div>
      {renderBody()}
    </div>
  );
}

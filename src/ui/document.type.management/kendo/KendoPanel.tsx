import { Button, Grid, Typography } from "@material-ui/core";
import { process, State } from "@progress/kendo-data-query";
import { setExpandedState, setGroupIds } from "@progress/kendo-react-data-tools";
import {
  Grid as Kgrid,
  GridCellProps,
  GridColumn,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
  GridFilterCellProps,
  GridItemChangeEvent,
  GridNoRecords,
  GridToolbar,
} from "@progress/kendo-react-grid";
import { cloneDeep, each, find, isEmpty, map, set, sortBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import Config from "../../../config";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { ActiveDropdown } from "../../components/common/kendo.column.templates/ActiveDropdown";
import CellRender from "../../components/common/kendo.column.templates/CellRender";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import { DisplayText, hideColumnTitleOnResize, TranslatedText } from "../../components/common/kendo/helpers";
import Loader from "../../components/common/kendo/Loader";
import NoDataFound from "../../components/common/kendo/NoDataFound";
import { KendoColumn, KendoGridConfiguration } from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import { toastError } from "../../components/notifications";
import { TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import ExportDAMDetails from "../export.dam.details/exportDAMDetails";
import { toDocumentTypeBody } from "../transform";
import { CheckboxCell } from "./column.templates/Checkbox";
import { CommandCell } from "./column.templates/CommandCell";
import { FieldsConfig } from "./column.templates/FieldsConfig";
import { NewRowObject } from "./column.templates/NewRowObject";
import { Schema } from "./column.templates/Schema";
import { EditDropdownCellFormatter, getDropDownDataSource } from "./filter.template/CommonCellDropdownFilterTemplate";
import { DropdownFilterCell } from "./filter.template/DropdownFilterTemplate";
import KendoGridStyles from "./styles";
import { DTMAddRow, DTMRowItem } from "./types";

interface KendoPanelProps<T> {
  gridData: T[];
  gridConfiguration: KendoGridConfiguration;
  tableName: string;
  tableCriteria: TablePanelStateProps;
}
interface ResultProps {
  dataSource: any[];
  operator: string;

}
type Props<T> = KendoPanelProps<T>;
export function KendoGrid<T extends { id?: string }>({
  gridData,
  gridConfiguration,
  tableName,
  tableCriteria,
}: Props<T>) {
  const intl = useIntl();
  const classes = KendoGridStyles();
  const actualData: T[] = cloneDeep(gridData);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const [isLoading, setIsLoading] = useState(false);

  const { columnConfig, kendoConfig } = tableCriteria;

  const [columnDefinitions, setColumnDefinitions] = useState<KendoColumn[]>(
    columnConfig ? JSON.parse(columnConfig) : gridConfiguration.columns
  );

  const editField = intl.formatMessage({
    id: TranslatedText[DisplayText.INEDIT],
  });
  const [gridEditID, setGridEditID] = React.useState("");
  const exportDAMDialog = useDialog();
  const processWithGroups = (data: T[], dataState: State) => {
    const cloneDeepDataState = cloneDeep(dataState);
    const newDataState = process(data, cloneDeepDataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };
  const defaultItem = {
    text: (intl.formatMessage({ id: TranslatedText[DisplayText.SELECT_ITEM] })),
    value: "",
  };

  // Update
  const updateDocumentTypeAction = useActionCreator(
    documentTypeActions.updateDocumentType
  );
  // Add New
  const addDocumentTypeAction = useActionCreator(
    documentTypeActions.addDocumentType
  );
  const disabled = Config.docTypeManagementEditDisabled;
  const dispatch = useDispatch();
  const async = useAsync({
    onSuccess: () => {
      // On success Reload
    },
    onError: (error) => {
      // On fail reset grid to original state
      cancel();
      toastError(error as string);
    },
  });

  const [dropDownState, setDropDownState] = React.useState({});
  let initialDataState: State;

  if (kendoConfig) {
    initialDataState = JSON.parse(kendoConfig);
  } else {
    initialDataState = {
      filter: {
        logic: "and",
        filters: [],
      },
      take: 25,
      skip: 0,
      group: [],
      sort: [
        {
          field: "documentTypeName",
        },
      ],
    };
  }

  const [dataState, setDataState] = React.useState(initialDataState);
  const [collapsedState, setCollapsedState] = useState<string[]>([]);
  const [resultState, setResultState] = React.useState(
    processWithGroups(gridData, dataState)
  );
  useEffect(() => {
    setIsLoading(true);
    const newDataState = processWithGroups(actualData, dataState);
    setDataState(dataState);
    setResultState(newDataState);

    initialDataState?.filter?.filters.forEach((el: any) => {
      if (["privateNumberPool",
        "canRedLine",
        "isQms",
        "needsSignature",
        "defaultTraining",
        "defaultRevStage",
        "hiddenForCreationForUsersWithoutTagsFormatted",
        "group",
        "active"].includes(el.field)) {
        setDropDownState((prevState) => {
          const object = Object.assign({}, { ...prevState });
          let value;
          if (typeof el.value === "boolean" && el.field === "active") {
            value = el.value
              ? intl.formatMessage({ id: TranslatedText[DisplayText.ACTIVE] })
              : intl.formatMessage({
                id: TranslatedText[DisplayText.INACTIVE],
              });
          } else if (typeof el.value === "boolean") {
            value = el.value ? "Yes" : "No";
          } else {
            value = el.value;
          }
          object[el.field] = {
            value: el.value,
            text: value,
          };
          return object;
        });
      }
    });

    if (!gridData.length) {
      setNoDataMessage(<NoDataFound />);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridData]);

  const setKendoFilterStatus = (
    kendoConfig: string,
  ): void => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          kendoConfig,
        },
        tableName
      )
    );
  };

  const onDataStateChange = (event: GridDataStateChangeEvent) => {
    const newDataState = processWithGroups(actualData, event.dataState);
    setDataState(event.dataState);
    setResultState(newDataState);
    setKendoFilterStatus(JSON.stringify(event.dataState));
    setIsLoading(false);
    if (!newDataState.total) {
      setNoDataMessage(<NoDataFound />);
    }
  };

  // Kendo Grid Actions Methods
  const onStateChange = (setDefault: any) => {
    setDropDownState((prevState) => {
      const object = Object.assign({}, { ...prevState });
      object[setDefault.parentField] = setDefault.selectedItem;
      return object;
    });
  };

  const DropdownFilterCellTemplate = (props: GridFilterCellProps) => {
    const result: ResultProps  = getDropDownDataSource(props.field || "");
    return <DropdownFilterCell
      {...props}
      data={result.dataSource}
      defaultItem={defaultItem}
      defaultValue={dropDownState[props.field || ""] || defaultItem}
      customOperator={result.operator}
      onStateChange={onStateChange}
    />;
  };
  const BooleanFilterCell = (props: any) => (
    <DropdownFilterCell
      {...props}
      data={gridConfiguration.booleanFilterCellOptions}
      defaultItem={{
        text: intl.formatMessage({ id: TranslatedText[DisplayText.ALL] }),
        value: "All",
      }}
      defaultValue={
        dropDownState[props.field || ""] || {
          text: intl.formatMessage({ id: TranslatedText[DisplayText.ALL] }),
          value: "All",
        }
      }
      customOperator="eq"
      onStateChange={onStateChange}
    />
  );

  const commandCell = (props: GridCellProps) =>
    <CommandCell
      {...props}
      edit={enterEdit}
      remove={deleteDocumnet}
      add={addNewRow}
      update={update}
      cancel={cancel}
      disabled={disabled}
      editField={editField}
    />
;

  const FilterCellMapping = {
    DropdownFilterCellTemplate,
    BooleanFilterCell,
  };

  const TemplateCellMapping = {
    "active": ActiveDropdown,
    "privateNumberPool": CheckboxCell,
    "canRedLine": CheckboxCell,
    "isQms": CheckboxCell,
    "needsSignature": CheckboxCell,
    "defaultTraining": CheckboxCell,
    "defaultRevStage": EditDropdownCellFormatter,
    "hiddenForCreationForUsersWithoutTagsFormatted": EditDropdownCellFormatter,
    "group": EditDropdownCellFormatter,
    "schema": Schema,
    "fieldsConfig": FieldsConfig,
    "": commandCell,
  };

  // Create Grid Columns
  const renderColumns = () =>
    sortBy(columnDefinitions, ["orderIndex"]).map((col: KendoColumn, index: number) => {
      if (col.show) {
        return (
          <GridColumn
            {...col}
            title={col.title.toUpperCase()}
            key={index}
            cell={TemplateCellMapping[col.field]}
            filterCell={
              FilterCellMapping[col.filterCell]
                ? FilterCellMapping[col.filterCell]
                : undefined
            }
            headerCell={
              col.title ? (props) => <ColumnHeader data={props} /> : undefined
            }
          ></GridColumn>
        );
      }
    });

  // On edit click- all cells in edit mode
  const enterEdit = (dataItem: DTMRowItem) => {
    each(actualData, (item: any) => {
      if (item.id === dataItem.id) {
        item.inEdit = true;
      }
    });
    setGridEditID(
      intl.formatMessage({ id: TranslatedText[DisplayText.INEDIT] })
    );
    const newDataState = processWithGroups(actualData, dataState);
    setDataState(dataState);
    setResultState(newDataState);
  };

  // On cancel- come out of edit mode
  const cancel = () => {
    const newDataState = processWithGroups(gridData, dataState);
    setDataState(dataState);
    setResultState(newDataState);
  };

  // On field config: inline edit
  const update = (dataItem: DTMRowItem) => {
    const newData = {
      documentTypeName: dataItem.documentTypeName,
      documentTypeAcronym: dataItem.documentTypeAcronym,
      privateNumberPool: dataItem.privateNumberPool,
      canRedLine: dataItem.canRedLine,
      isQms: dataItem.isQms,
      needsSignature: dataItem.needsSignature,
      defaultTraining: dataItem.defaultTraining,
      startingNumber: dataItem.startingNumber,
      hiddenForCreationForUsersWithoutTags:
      dataItem.hiddenForCreationForUsersWithoutTagsFormatted,
      group: dataItem.group,
      category: dataItem.category,
      schema: dataItem.schema,
      fieldsConfig: dataItem.fieldsConfig,
      defaultRevStage: dataItem.defaultRevStage,
      active: dataItem.active,
    };
    const emptyFields: string[] = gridCellValidation(newData);
    if (!isEmpty(emptyFields)) {
      toastError(`${emptyFields.join(",")} is missing.`);
      return;
    } else {
      dataItem.inEdit = false;
      onFieldConfig(newData, dataItem.id);
    }
  };
  // On field config: inline edit- Update api call
  const onFieldConfig = (values, id: string) => {
    async.start(
      updateDocumentTypeAction,
      id,
      toDocumentTypeBody(values),
      async
    );
  };

  // Add New row object
  const addNewRowObject = async () => {
    await clearFilter(true);
    const newDataItem: any = cloneDeep(NewRowObject);
    newDataItem.inEdit = true;
    const newDataArr: any[] = [newDataItem, ...actualData];
    setGridEditID(
      intl.formatMessage({ id: TranslatedText[DisplayText.INEDIT] })
    );
    const newDataState = processWithGroups(newDataArr, dataState);
    setDataState(dataState);
    setResultState(newDataState);
  };

  // TODO: FIND BETTER SOLUTION
  const gridCellValidation = (dataItem: DTMAddRow) => {
    const emptyFields: string[] = [];
    if (isEmpty(dataItem.documentTypeName)) {
      emptyFields.push("Document Type");
    }
    if (isEmpty(dataItem.documentTypeAcronym)) {
      emptyFields.push("Document Acronym");
    }
    if (isEmpty(dataItem.group)) {
      emptyFields.push("Group");
    }
    return emptyFields;
  };

  // Api Call on Add New Row
  const addNewRow = (values: DTMAddRow) => {
    const emptyFields: string[] = gridCellValidation(values);
    if (!isEmpty(emptyFields)) {
      toastError(`${emptyFields.join(",")} is missing.`);
      return;
    } else {
      delete values.inEdit;
      delete values.expanded;
      delete values?.hiddenForCreationForUsersWithoutTagsFormatted;
      async.start(addDocumentTypeAction, toDocumentTypeBody(values), async);
    }
  };

  // Delete document
  const deleteDocumnet = (dataItem: DTMRowItem) => {
    dispatch(documentTypeActions.deleteDocumentType(dataItem.id));
  };

  // While editing setting the new values to the dataItem
  const itemChange = (e: GridItemChangeEvent) => {
    // For Update
    let newData: T[] = [];
    if (e.dataItem.id) {
      newData = map(actualData, (item) => {
        if (item.id === e.dataItem.id) {
          item = set(e.dataItem, e.field || "", e.value);
        }
        return item;
      });
    } else {
      // For New Record
      const updatedDataItem = set(e.dataItem, e.field || "", e.value);
      newData = [updatedDataItem, ...actualData];
    }
    const newDataState = processWithGroups(newData, dataState);
    setDataState(dataState);
    setResultState(newDataState);
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  const clearFilter = async (reset: boolean) => {
    dataState.filter = {
      logic: "and",
      filters: [],
    };
    if (reset) {
      dataState.group = [];
      dataState.sort = [];
      dataState.take = 25;
      dataState.skip = 0;
    }
    setDropDownState({});
    const newDataState = processWithGroups(gridData, dataState);
    setDataState(dataState);
    setResultState(newDataState);
    tableCriteria.kendoConfig = JSON.stringify(dataState);
    setColumnDefinitions(gridConfiguration.columns);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          columnConfig: JSON.stringify(gridConfiguration.columns),
        },
        tableName
      )
    );
  };

  const updateDataColumnsState = (dataColumns: KendoColumn[]) => {
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

  const columnResize = (event: GridColumnResizeEvent) => {
    let dataColumns: KendoColumn[] = columnDefinitions;
    if (event.end) {
      dataColumns = map(dataColumns, (column: KendoColumn) => {
        const columnObject = find(event.columns, { field: column.field });
        column.width = columnObject?.width;
        return column;
      });
      hideColumnTitleOnResize();
      setColumnDefinitions(dataColumns);
      updateDataColumnsState(dataColumns);
    }
    return false;
  };

  const columnReorder = (event: GridColumnReorderEvent) => {
    let dataColumns: KendoColumn[] = columnDefinitions;
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(event.columns, { field: column.field });
      column.orderIndex = columnObject?.orderIndex;
      return column;
    });
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
  };

  const onExpandChange = useCallback(
    (event: GridExpandChangeEvent) => {
      const item = event.dataItem;
      if (item.groupId) {
        const newCollapsedIds = !event.value
          ? [...collapsedState, item.groupId]
          : collapsedState.filter((groupId) => groupId !== item.groupId);
        setCollapsedState(newCollapsedIds);
      }
    },
    [collapsedState]
  );

  const result = setExpandedState({
    data: resultState.data,
    collapsedIds: collapsedState,
  });

  return (
    <>
      <Grid>
        {isLoading && <Loader />}
        <Grid container justify="space-between">
          <Grid item>
            <Typography className={classes.title}>
              <Text translation="documenttype.management" />
            </Typography>
          </Grid>
          <Grid item>
            <Button
              onClick={exportDAMDialog.open}
              variant="outlined"
              className={classes.exportBtn}
            >
              <Text translation={"common.export.dam.details"} />
            </Button>
            <Button
              variant="outlined"
              onClick={addNewRowObject}
              className={ disabled ? classes.disabledAddBtn : classes.addBtn}
              {...{ disabled }}
            >
              <Text translation={"common.add.document.type"} />
            </Button>
          </Grid>
        </Grid>
        <Grid item={true}>
          <KendoGlobalization>
            <Kgrid
              className={`${classes.kGrid} no-row-pointer`}
              data={result}
              sortable={true}
              filterable={true}
              reorderable={true}
              pageable={gridConfiguration.pagerSettings}
              resizable={true}
              groupable={true}
              total={resultState.total}
              cellRender={CellRender}
              onDataStateChange={onDataStateChange}
              {...dataState}
              onExpandChange={onExpandChange}
              expandField="expanded"
              editField={gridEditID}
              onItemChange={itemChange}
              onColumnReorder={columnReorder}
              onColumnResize={columnResize}
            >
              <GridToolbar>
                <Grid item>
                  <Button
                    variant="outlined"
                    className={classes.clearButton}
                    onClick={async () => { await clearFilter(false); }}
                  >
                    <Text translation={"common.clear.filters"} />
                  </Button>
                </Grid>
              </GridToolbar>
              {renderColumns()}
              <GridNoRecords>{noDataMessage}</GridNoRecords>
            </Kgrid>
          </KendoGlobalization>
        </Grid>
      </Grid>
      <ExportDAMDetails dialog={exportDAMDialog} />
    </>
  );
}


import { Button, Grid } from "@material-ui/core";
import { FilterDescriptor, process, State } from "@progress/kendo-data-query";
import { setExpandedState, setGroupIds } from "@progress/kendo-react-data-tools";
import {
  Grid as KendoGrid, GridColumn,
  GridColumnMenuGroup,
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
import { AutoSizer, Size } from "react-virtualized";
import Config from "../../../config";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import { DocumentType, DOC_TYPE_GROUP_OPTION, GroupWithGroupOptions } from "../../../state/ducks/documentRevisions/documentType/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import CellRender from "../../components/common/kendo.column.templates/CellRender";
import { DropdownFilterTemplate } from "../../components/common/kendo.column.templates/DropdownFilterTemplate";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import ExportListIcon from "../../components/common/kendo/ExportListIcon";
import { DisplayText, hideColumnTitleOnResize, hideOperatorTooltip, TranslatedText } from "../../components/common/kendo/helpers";
import Loader from "../../components/common/kendo/Loader";
import NoDataFound from "../../components/common/kendo/NoDataFound";
import { KendoColumn, KendoGridConfiguration } from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import GridTitle from "../../components/KendoGrid/GridTitle/presenter";
import KendoGridStyles from "../../components/KendoGrid/KendoGrid.styles";
import { toastError } from "../../components/notifications";
import { TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import ExportDAMDetails from "../export.dam.details/exportDAMDetails";
import { toDocumentTypeBody } from "../transform";
import { CommandCell } from "./column.templates/CommandCell";
import { NewRowObject } from "./column.templates/NewRowObject";
import { DTMCellTemplateMapping } from "./config";
import { getDropDownDataSource } from "./filter.template/CommonCellDropdownFilterTemplate";
import { styles } from "./styles";
import { DTMAddRow, DTMRowItem } from "./types";

interface KendoPanelProps<T> {
  gridData: DocumentType[];
  gridConfiguration: KendoGridConfiguration;
  tableName: string;
  tableCriteria: TablePanelStateProps;
}
interface DocumentTypeCustom extends DocumentType {
  inEdit?: boolean;
  isNewRecord?: boolean;
}
interface ResultProps {
  dataSource: {
    text: string;
    value: string | boolean;
  }[];
  operator: string;

}
export function KendoPanel<T extends { id?: string }>({
  gridData,
  gridConfiguration,
  tableName,
  tableCriteria,
}: KendoPanelProps<DocumentType>) {
  const intl = useIntl();
  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : "";
  const classes = styles();
  const gridClasses = KendoGridStyles();
  const actualData: DocumentType[] = cloneDeep(gridData);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const [isLoading, setIsLoading] = useState(false);

  const { columnConfig, kendoConfig } = tableCriteria;

  const [columnDefinitions, setColumnDefinitions] = useState<KendoColumn[]>(
    columnConfig ? JSON.parse(columnConfig) : gridConfiguration.columns
  );

  const editField = getTranslatedText(TranslatedText[DisplayText.INEDIT]);
  const [gridEditID, setGridEditID] = React.useState("");
  const exportDAMDialog = useDialog();
  const processWithGroups = (data: DocumentType[], dataState: State) => {
    const cloneDeepDataState = cloneDeep(dataState);
    const newDataState = process(data, cloneDeepDataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };
  const defaultItem = {
    text: getTranslatedText(TranslatedText[DisplayText.SELECT_ITEM]),
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
    onError: (error) => {
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
      sort: [],
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

    each(initialDataState.filter?.filters as FilterDescriptor[], ({ field, value }) => {
      if (["privateNumberPool",
        "canRedLine",
        "isQms",
        "needsSignature",
        "defaultTraining",
        "defaultRevStage",
        "hiddenForCreationForUsersWithoutTagsFormatted",
        "group",
        "active"].includes(field as string)) {
        setDropDownState((prevState) => {
          const object = { ...prevState };
          let newValue: string;
          if (typeof value === "boolean" && field === "active") {
            newValue = value
              ? getTranslatedText(TranslatedText[DisplayText.ACTIVE])
              : getTranslatedText(TranslatedText[DisplayText.INACTIVE]);
          } else if (typeof value === "boolean") {
            newValue = value ? "Yes" : "No";
          } else {
            newValue = value;
          }
          object[field as string] = {
            value,
            text: newValue,
          };
          return object;
        });
      }
    });

    if (!newDataState.total) {
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

  const onDataStateChange = ({ dataState }: GridDataStateChangeEvent) => {
    const newDataState = processWithGroups(actualData, dataState);
    setDataState(dataState);
    setResultState(newDataState);
    setKendoFilterStatus(JSON.stringify(dataState));
    setIsLoading(false);
    if (!newDataState.total) {
      setNoDataMessage(<NoDataFound />);
    }
  };

  // Kendo Grid Actions Methods
  const onStateChange = (setDefault) => {
    setDropDownState((prevState) => {
      const object = Object.assign({}, { ...prevState });
      object[setDefault.parentField] = setDefault.selectedItem;
      return object;
    });
  };

  const DropdownFilterCellTemplate = (props: GridFilterCellProps) => {
    const result: ResultProps  = getDropDownDataSource(props.field || "");
    return <DropdownFilterTemplate
      {...props}
      data={result.dataSource}
      defaultItem={defaultItem}
      defaultValue={dropDownState[props.field || ""] || defaultItem}
      customOperator={result.operator}
      onStateChange={onStateChange}
    />;
  };
  const BooleanFilterCell = (props) => (
    <DropdownFilterTemplate
      {...props}
      data={[
        {
          text: getTranslatedText("common.true"),
          value: true,
        },
        {
          text: getTranslatedText("common.false"),
          value: false,
        },
      ]}
      defaultItem={{
        text: getTranslatedText(TranslatedText[DisplayText.ALL]),
        value: "All",
      }}
      defaultValue={
        dropDownState[props.field || ""] || {
          text: getTranslatedText(TranslatedText[DisplayText.ALL]),
          value: "All",
        }
      }
      customOperator="eq"
      onStateChange={onStateChange}
    />
  );

  const FilterCellMapping = {
    DropdownFilterCellTemplate,
    BooleanFilterCell,
  };

  const renderCol = (props, col: KendoColumn) => {
    const template = DTMCellTemplateMapping[col.cell || ""];
    if (template) {
      return template(props);
    } else {
      return <CommandCell
        {...props}
        edit={enterEdit}
        remove={deleteDocumnet}
        add={addNewRow}
        update={update}
        cancel={cancel}
        disabled={disabled}
        editField={editField}
      />;
    }
  };
  // Create Grid Columns
  const renderColumns = () =>
    sortBy(columnDefinitions, ["orderIndex"]).map((col: KendoColumn, index: number) => (
      col.show && <GridColumn
        {...col}
        title={getTranslatedText(col.title)}
        key={index}
        cell={DTMCellTemplateMapping[col.cell || ""] || col.field === "" ? (props) => renderCol(props, col) : undefined}
        filterCell={FilterCellMapping[col.filterCell as string]}
        headerCell={
          col.title ? (props) => <ColumnHeader {...props} /> : undefined
        }
        columnMenu={
          col.showColumnMenu
            ? (props) => (
              <GridColumnMenuGroup {...props} />
            )
            : undefined
        }
      />
    ));

  // On edit click- all cells in edit mode
  const enterEdit = ({ id }: DTMRowItem) => {
    each(actualData, (item: DocumentTypeCustom) => {
      if (item.id === id) {
        item.inEdit = true;
        item.isNewRecord = false;
      }
    });
    setGridEditID(getTranslatedText(TranslatedText[DisplayText.INEDIT]));
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
    // need to convert
    dataItem.active = dataItem.active === true || dataItem.active.toString() ===
    getTranslatedText(TranslatedText[DisplayText.ACTIVE]);
    const newData = {
      documentTypeName: dataItem.documentTypeName,
      documentTypeAcronym: dataItem.documentTypeAcronym,
      privateNumberPool: dataItem.privateNumberPool,
      canRedLine: dataItem.canRedLine,
      isQms: dataItem.isQms,
      needsSignature: dataItem.needsSignature,
      defaultTraining: dataItem.defaultTraining,
      startingNumber: +dataItem.startingNumber,
      hiddenForCreationForUsersWithoutTags:
      dataItem.hiddenForCreationForUsersWithoutTagsFormatted,
      group: dataItem.group,
      category: dataItem.category,
      schema: dataItem.schema,
      fieldsConfig: dataItem.fieldsConfig,
      defaultRevStage: dataItem.defaultRevStage,
      active: dataItem.active,
      equipmentEnforceProd: dataItem.equipmentEnforceProd,
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
  const onFieldConfig = (values: DTMAddRow, id: string) => {
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
    const newDataItem = cloneDeep(NewRowObject);
    newDataItem.inEdit = true;
    newDataItem.isNewRecord = true;
    const newDataArr = [newDataItem, ...actualData];
    setGridEditID(getTranslatedText(TranslatedText[DisplayText.INEDIT]));
    const newDataState = processWithGroups(newDataArr as DocumentType[], dataState);
    setDataState(dataState);
    setResultState(newDataState);
  };

  // TODO: FIND BETTER SOLUTION
  const gridCellValidation = ({ documentTypeName, documentTypeAcronym, group }: DTMAddRow) => {
    const emptyFields: string[] = [];
    if (isEmpty(documentTypeName)) {
      emptyFields.push("Document Type");
    }
    if (isEmpty(documentTypeAcronym)) {
      emptyFields.push("Document Acronym");
    }
    if (isEmpty(group)) {
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
      const startingNumber = values?.startingNumber;
      values.startingNumber = startingNumber
        ? +startingNumber
        : startingNumber;
      values.hiddenForCreationForUsersWithoutTags =
      values.hiddenForCreationForUsersWithoutTagsFormatted;
      delete values.inEdit;
      delete values.expanded;
      delete values.isNewRecord;
      delete values?.hiddenForCreationForUsersWithoutTagsFormatted;
      async.start(addDocumentTypeAction, toDocumentTypeBody(values), async);
    }
  };

  // Delete document
  const deleteDocumnet = ({ id }: DTMRowItem) => {
    dispatch(documentTypeActions.deleteDocumentType(id));
  };

  // While editing setting the new values to the dataItem
  const itemChange = ({ dataItem, field, value }: GridItemChangeEvent) => {
    // For Update
    const grp = typeof value === "boolean" ? dataItem.group : value;
    const isLHR = GroupWithGroupOptions[grp]?.includes(DOC_TYPE_GROUP_OPTION.BASE_LHR);
    let newData: DocumentType[] = [];
    if (dataItem.id) {
      newData = map(actualData, (item) => {
        if (item.id === dataItem.id) {
          item = set(dataItem, field || "", value);
          if (!isLHR) {
            item.equipmentEnforceProd = false;
          }
        }
        return item;
      });
    } else {
      // For New Record
      const updatedDataItem = set(dataItem, field || "", value);
      if (!isLHR) {
        updatedDataItem.equipmentEnforceProd = false;
      }
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

  const columnResize = ({ end, columns }: GridColumnResizeEvent) => {
    hideColumnTitleOnResize();
    if (!end) { return false; }
    let dataColumns: KendoColumn[] = columnDefinitions;
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(columns, { field: column.field });
      column.width = columnObject?.width;
      return column;
    });
    setTimeout(() => {
      setColumnDefinitions(dataColumns);
      updateDataColumnsState(dataColumns);
    }, 100);
  };

  const columnReorder = ({ columns }: GridColumnReorderEvent) => {
    let dataColumns: KendoColumn[] = columnDefinitions;
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(columns, { field: column.field });
      column.orderIndex = columnObject?.orderIndex;
      return column;
    });
    setColumnDefinitions(dataColumns);
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

  const result = setExpandedState({
    data: resultState.data,
    collapsedIds: collapsedState,
  });

  // Hide Choose Operator Tooltip. There is Kendo-react configuration to do this
  hideOperatorTooltip();

  const tableRenderer = ({ width }: Size) => (
    <>
      <KendoGlobalization>
        <KendoGrid
          className={`${gridClasses.grid} no-row-pointer`}
          style={{ width: `${width}px` }}
          data={result}
          sortable={true}
          filterable={true}
          reorderable={false}
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
        </KendoGrid>
      </KendoGlobalization>
      {isLoading && <Loader />}
    </>
  );

  const renderBody = () => <AutoSizer>{tableRenderer}</AutoSizer>;
  const isGrouped = (initialDataState?.group || [])?.length > 0;
  return (
    <Grid container>
      <Grid item xs={12} className={gridClasses.headerGridItem}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <GridTitle translation="documenttype.management" />
          </Grid>
          <Grid item>
            <Button
              onClick={exportDAMDialog.open}
              variant="outlined"
              data-cy="Export-Dam-Button"
              className={classes.exportBtn}
              disabled={isGrouped}
            >
              <ExportListIcon isGrouped={isGrouped} />
              <Text translation={"common.export.dam.details"} />
            </Button>
            <Button
              variant="outlined"
              onClick={addNewRowObject}
              data-cy="Add-DocumentType-Button"
              className={ disabled ? classes.disabledAddBtn : classes.addBtn}
              {...{ disabled }}
            >
              <Text translation={"common.add.document.type"} />
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={gridClasses.kendoGridItem}>
        {renderBody()}
      </Grid>
      <ExportDAMDetails dialog={exportDAMDialog} />
    </Grid>
  );
}


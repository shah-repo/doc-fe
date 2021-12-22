import { Button, Grid, Typography } from "@material-ui/core";
import { process, State } from "@progress/kendo-data-query";
import {
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as Kgrid, GridColumn, GridDataStateChangeEvent, GridNoRecords,
} from "@progress/kendo-react-grid";
import { cloneDeep, each, isEmpty, map, set } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import Config from "../../../config";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import Loader from "../../components/common/kendo/Loader";
import { KendoColumn } from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import { toastError } from "../../components/notifications";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import ExportDAMDetails from "../export.dam.details/exportDAMDetails";
import { toDocumentTypeBody } from "../transform";
import gridConfiguration from "./column.definition";
import { CommandCell } from "./column.templates/CommandCell";
import { NewRowObject } from "./column.templates/NewRowObject";
import KendoGridStyles from "./styles";

export function KendoGrid({
  gridData,
}) {
  const classes = KendoGridStyles();
  const actualData = cloneDeep(gridData);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const [isLoading, setIsLoading] = useState(false);
  const columns = gridConfiguration.columns;
  const editField = "inEdit";
  const [gridEditID, setGridEditID] = React.useState("");
  const exportDAMDialog = useDialog();
  const processWithGroups = (data: any[], dataState: State) => {
    const cloneDeepDataState = cloneDeep(dataState);
    const newDataState = process(data, cloneDeepDataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };

  // Update
  const updateDocumentTypeAction = useActionCreator(documentTypeActions.updateDocumentType);
  // Add New
  const addDocumentTypeAction = useActionCreator(documentTypeActions.addDocumentType);
  // TODO: CHECK WHEN TO DISABLE FIELD
  // const disabled = Config.docTypeManagementEditDisabled;
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
  // For Pagination
  const createDataState = (dataState: State) => ({
    result: processWithGroups(gridData, dataState),
    dataState,
  });

  const initialState = createDataState({
    take: 25,
    skip: 0,
    group: [],
    sort: [{
      field: "documentTypeName",
    }],
  });

  const [resultState, setResultState] = React.useState(initialState.result);
  const [dataState, setDataState] = React.useState(initialState.dataState);
  useEffect(() => {
    setIsLoading(true);
    const newDataState = processWithGroups(actualData, dataState);
    setDataState(dataState);
    setResultState(newDataState);

    if (!gridData.length ) {
      setNoDataMessage(<Typography><Text translation="table.no.results.found"></Text></Typography>);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridData]);

  const onDataStateChange = ((
    event: GridDataStateChangeEvent) => {
    const newDataState = processWithGroups(actualData, event.dataState);
    setDataState(event.dataState);
    setResultState(newDataState);
    setIsLoading(false);
  }
  );

  // Create Grid Columns
  const renderColumns = () => columns.map((col: KendoColumn, index) => {
    if (col.show) {
      return <GridColumn
        field={col.field}
        title={col.title.toUpperCase()}
        key={index} cell={col.cell}
        filter={col.filter}
        filterCell={col.filterCell}
        // columnMenu={col.columnMenu}  // TODO: Will Check Later
        filterable={col.filterable}
        width={col.width}
        locked={col.locked}
      >
      </GridColumn>;
    }
  });

  // Services
  const commandCell = (props) => (
    <CommandCell
      {...props}
      edit={enterEdit}
      remove={deleteDocumnet}
      add={addNewRow}
      update={update}
      cancel={cancel}
      editField={editField}
    />
  );
  // On edit click- all cells in edit mode
  const enterEdit = (dataItem) => {
    each(actualData, (item: any) => {
      if (item.id === dataItem.id) {
        item.inEdit = true;
        item.hiddenForCreationForUsersWithoutTags = !isEmpty(dataItem.hiddenForCreationForUsersWithoutTags) ? dataItem.hiddenForCreationForUsersWithoutTags[0] : null;
      }
    });
    setGridEditID("inEdit");
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
  const update = (dataItem) => {
    const  newData = {
      documentTypeName: dataItem.documentTypeName,
      documentTypeAcronym: dataItem.documentTypeAcronym,
      privateNumberPool: dataItem.privateNumberPool,
      canRedLine: dataItem.canRedLine,
      isQms: dataItem.isQms,
      needsSignature: dataItem.needsSignature,
      defaultTraining: dataItem.defaultTraining,
      startingNumber: dataItem.startingNumber,
      hiddenForCreationForUsersWithoutTags: dataItem.hiddenForCreationForUsersWithoutTags,
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
  const onFieldConfig = (values, id) => {
    async.start(
      updateDocumentTypeAction,
      id,
      toDocumentTypeBody(values),
      async,
    );
  };

  // Add New row object
  const addNewRowObject = () => {
    const newDataItem: any = cloneDeep(NewRowObject);
    newDataItem.inEdit = true;
    const newDataArr: any = [newDataItem, ...actualData];
    setGridEditID("inEdit");
    const newDataState = processWithGroups(newDataArr, dataState);
    setDataState(dataState);
    setResultState(newDataState);
  };

  // TODO: FIND BETTER SOLUTION
  const gridCellValidation = (dataItem) => {
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
  const addNewRow = (values: any) => {
    const emptyFields: string[] = gridCellValidation(values);
    if (!isEmpty(emptyFields)) {
      toastError(`${emptyFields.join(",")} is missing.`);
      return;
    } else {
      delete values.inEdit;
      async.start(
        addDocumentTypeAction,
        toDocumentTypeBody(values),
        async,
      );
    }

  };

  // Delete document
  const deleteDocumnet = (dataItem) => {
    dispatch(documentTypeActions.deleteDocumentType(dataItem.id));
  };

  // While editing setting the new values to the dataItem
  const itemChange = (e) => {
    // For Update
    let newData: any = [];
    if (e.dataItem.id) {
      newData = map(actualData, (item) => {
        if (item.id === e.dataItem.id) {
          item = set(e.dataItem, e.field, e.value);
        }
        return item;
      }
      );
    } else {
      // For New Record
      const updatedDataItem = set(e.dataItem, e.field, e.value);
      newData = [updatedDataItem, ...actualData];
    }
    const newDataState = processWithGroups(newData, dataState);
    setDataState(dataState);
    setResultState(newDataState);
  };

  // CLear All Grid Filters
  const clearFilter = () => {
    // TODO: Reset dropdown values
    // console.log(dataState);
    dataState.filter = {
      logic: "and",
      filters: [],
    };
    const newDataState = processWithGroups(gridData, dataState);
    setDataState(dataState);
    setResultState(newDataState);
  };

  return (
    <>
      <Grid>
        {isLoading && <Loader/>}
        <Grid container spacing={1}>
          <Grid item={true} xs={6} style={{ textAlign: "left" }}>
            <Button
              variant="outlined"
              className={classes.clearButton}
              onClick={clearFilter}
            >
              <Text translation={"common.clear.filters"} />
            </Button>
          </Grid>
          <Grid item={true} xs={6} style={{ textAlign: "right" }}>
            <Button onClick={exportDAMDialog.open} variant="outlined" className={classes.exportBtn}>
              <Text translation={"common.export.dam.details"} />
            </Button>
            {/* onClick={dialog.open}  {...{ disabled }} */}
            <Button
              variant="outlined"
              onClick={addNewRowObject}
              className={classes.addBtn}
            >
              <Text translation={"common.add.document.type"} />
            </Button>
          </Grid>
        </Grid>
        <Grid item={true}>
          <KendoGlobalization>
            <Kgrid
              className={classes.kGrid}
              data={resultState}
              sortable={true}
              filterable={true}
              reorderable={true}
              pageable={gridConfiguration.pagerSettings}
              resizable={true}
              // groupable={true}
              total={resultState.total}
              onDataStateChange={onDataStateChange}
              {...dataState}
              // onExpandChange={onExpandChange}
              expandField="expanded"
              editField={gridEditID}
              onItemChange={itemChange}
            >
              {renderColumns()}
              <GridColumn
                cell={commandCell}
                title=""
                width="90px"
                filterable={false}
                locked={true}
                reorderable={false}
                resizable={false}
              />
              <GridNoRecords>{noDataMessage}</GridNoRecords>
            </Kgrid>
          </KendoGlobalization>
        </Grid>
      </Grid>
      <ExportDAMDetails dialog={exportDAMDialog} />
    </>
  );
}



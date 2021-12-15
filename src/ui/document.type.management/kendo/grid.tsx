/* eslint-disable no-console */

import { Box, Button, Grid, Typography } from "@material-ui/core";
import { DataResult, process, State } from "@progress/kendo-data-query";
import {
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as Kgrid, GridColumn, GridDataStateChangeEvent, GridNoRecords, GridToolbar,
} from "@progress/kendo-react-grid";
import { cloneDeep, each, set } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { ReactComponent as ViewGridIcon } from "../../../assets/images/grid_view.svg";
// import { ReactComponent as SolidIcon } from "../../../assets/images/view.svg";
// import { ReactComponent as ViewChecked } from "../../../assets/images/view_checked.svg";
import Config from "../../../config";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import KendoGlobalization from "../../components/KendoGlobalization";
import { toastError } from "../../components/notifications";
// import ClearFilters from "../../components/table/ClearFilters";
import { DocumentTypeManagementProps } from "../../components/table/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { toDocumentTypeBody } from "../transform";
import { CommandCell } from "./cell.formatter/command.cell";
import { rowObj } from "./cell.formatter/row.oject";
import gridConfiguration from "./columns/column.definition";
import GridStyles from "./grid.styles";
// import { DocumentType } from "../../../state/ducks/documentRevisions/documentType/types";


export function KendoGrid({
  tableData,
}) {
  const classes = GridStyles();
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const [isLoading, setIsLoading] = useState(false);
  const initialDataState = gridConfiguration.initialDataState;
  const columns = gridConfiguration.columns;
  const editField = "inEdit";
  // const [editID, setEditID] = React.useState(null);
  const [gridEditID, setGridEditID] = React.useState("");
  const processWithGroups = (data: any[], dataState: State) => {
    const cloneDeepDataState = cloneDeep(dataState);
    const newDataState = process(data, cloneDeepDataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };
  const [dataState, setDataState] = React.useState<State>(initialDataState);
  const [resultState, setResultState] = React.useState<DataResult>(
    processWithGroups(tableData, initialDataState)
  );

  // Update
  const updateDocumentTypeAction = useActionCreator(documentTypeActions.updateDocumentType);
  // Add New
  const addDocumentTypeAction = useActionCreator(documentTypeActions.addDocumentType);
  // TODO: CHECK WHEN TO DISABLE FIELD
  const disabled = Config.docTypeManagementEditDisabled;
  const dispatch = useDispatch();
  const async = useAsync({
    onError: (error) => {
      toastError(error as string);
    },
  });

  useEffect(() => {
    setIsLoading(true);
    setResultState(tableData);
    if (!tableData.length ) {
      setNoDataMessage(<Typography><Text translation="table.no.results.found"></Text></Typography>);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [tableData]);

  const onDataStateChange = ((
    event: GridDataStateChangeEvent) => {
    const newDataState = processWithGroups(tableData, event.dataState);
    setDataState(event.dataState);
    setResultState(newDataState);
    setIsLoading(false);
  }
  );

  const loadingPanel = (
    isLoading && (<div className={`k-loading-mask`} >
      <div className="k-loading-image"></div>
      <div className="k-loading-color"></div>
    </div>)
  );

  const renderColumns = () => columns.map((col: DocumentTypeManagementProps, index) => {
    if (col.show) {
      return <GridColumn
        field={col.field}
        title={col.title.toUpperCase()}
        key={index} cell={col.cell}
        filter={col.filter}
        filterCell={col.filterCell}
        columnMenu={col.columnMenu}
        filterable={col.filterable}
        width={col.width}
        locked={col.locked}
      >
      </GridColumn>;
    }
  });

  // Services : for command Cell
  // TODO: Move in separate File
  const dataT: any = [...tableData];
  const getItems = () => dataT;
  const updateItem = (item) =>
    // const index = dataT.findIndex((record) => record.id === item.id);
    // const fields = ["id", "group", "documentTypeName", "documentTypeAcronym", "privateNumberPool", "canRedLine", "isQms", "needsSignature", "defaultTraining", "equipmentEnforceProd", "startingNumber", "hiddenForCreationForUsersWithoutTags", "schema", "category", "fieldsConfig"];
    // const pickItem = pick(item, fields);
    // // dataT[index] = pickItem;
    // console.log(pickItem);
    item
  ;

  // Services
  const commandCell = (props) => (
    <CommandCell
      {...props}
      edit={enterEdit}
      remove={deleteDocumnet}
      add={addNewRow}
      discard={discard}
      update={update}
      cancel={cancel}
      editField={editField}
    />
  );
  const enterEdit = (dataItem) => {
    each(tableData, (item: any) => {
      item.inEdit = item.id === dataItem.id;
    });
    setGridEditID("inEdit");
    setResultState(tableData);
  };


  const discard = () => {
    console.log("Discard");
    const newData: any = [...tableData];
    newData.splice(0, 1);
    setResultState(newData);
  };

  const cancel = (dataItem) => {
    console.log("Cancel");
    const originalItem = getItems().find(
      (p) => p.id === dataItem.id
    );
    const newData: any = dataT.map((item) =>
      item.id === originalItem.id ? originalItem : item
    );
    setResultState(newData);
  };
  // On field config: inline edit
  const update = (dataItem) => {
    dataItem.inEdit = false;
    const newData: any = updateItem(dataItem);
    const id = newData.id;
    delete newData.id;
    onFieldConfig(newData, id);
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
    const newDataItem: any = rowObj;
    newDataItem.inEdit = true;
    const newDataT: any = [newDataItem, ...dataT];
    setResultState(newDataT);
    setGridEditID("inEdit");
  };

  // Api Call on Add New Row
  const addNewRow = (values: any) => {
    delete values.inEdit;
    console.log(disabled);
    async.start(
      addDocumentTypeAction,
      toDocumentTypeBody(values),
      async,
    );
  };

  // Delete document
  const deleteDocumnet = (dataItem) => {
    dispatch(documentTypeActions.deleteDocumentType(dataItem.id));
  };

  const itemChange = (e) => {
    dataT.unshift(set(e.dataItem, e.field, e.value));
    setResultState(dataT);
  };

  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);

  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  // const [coldef, setColdef] = React.useState(columns);
  // const onChange = (item: any) => {
  //   const newState = [...coldef];
  //   newState.map((c) => {
  //     if (c.field === item.field) {
  //       c.show = !c.show;
  //     }
  //   });
  //   setColdef(newState);

  // };
  // const clearFilter = (event) => {
  //   dataState.filter = {
  //     logic: "and",
  //     filters: [],
  //   };
  //   const newDataState = processWithGroups(tableData, event.dataState);
  //   setDataState(event.dataState);
  //   setResultState(newDataState);
  // };


  return (
    <Grid>
      {isLoading && loadingPanel}
      {/* <Button onClick={addNewRowObject}>Add New</Button> */}
      <Grid item={true}>
        <Box display="flex" justifyContent="flex-end">
          {/* onClick={exportDAMDialog.open}  */}
          <Button variant="outlined">
            <Text translation={"common.export.dam.details"} />
          </Button>
          {/* onClick={dialog.open}  {...{ disabled }} */}
          <Button variant="outlined" onClick={addNewRowObject}>
            <Text translation={"common.add.document.type"} />
          </Button>
        </Box>
      </Grid>
      <Grid item={true}>
        <KendoGlobalization>
          <Kgrid className={classes.kGrid}
            data={resultState}
            sortable={true}
            filterable={true}
            reorderable={true}
            pageable={gridConfiguration.pagerSettings}
            resizable={true}
            groupable={true}
            total={resultState.total}
            onDataStateChange={onDataStateChange}
            {...dataState}
            // onExpandChange={onExpandChange}
            expandField="expanded"
            editField={gridEditID}
            onItemChange={itemChange}
          // dataItemKey={"id"}
          >
            <GridToolbar>
              <Grid container spacing={1}>
                {/* <Grid item={true} xs style={{ textAlign: "left" }}>
              <ClearFilters {...{ clearFilter }} />
            </Grid> */}
                {/* <Grid item={true} xs style={{ textAlign: "right" }}>
                  <FormControl variant="outlined">
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <ViewGridIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem>
                        <ListItemText
                          primary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                className={classes.columnsCus}
                                color="textPrimary"
                              >
                            Columns
                              </Typography>
                            </>
                          }
                        ></ListItemText>
                      </MenuItem>
                      {columns.map((item: any) =>
                        item.field !== "docID" ? (
                          <MenuItem key={item.title} value={item.field}>
                            <ListItemText id={item.field} primary={item.title} />
                            <Box flexGrow={1} mr={5}></Box>
                            {item.show ? (
                              <SolidIcon
                                onClick={() => {
                                  onChange(item);
                                }}
                              />
                            ) : (
                              <ViewChecked
                                onClick={() => {
                                  onChange(item);
                                }}
                              />
                            )}
                          </MenuItem>
                        ) : null
                      )}
                    </Menu>
                  </FormControl>{" "}
                </Grid> */}
              </Grid>
            </GridToolbar>
            {/* locked={true} */}
            <GridColumn cell={commandCell} title="Actions" width="200px" locked={true}/>
            {renderColumns()}
            <GridNoRecords>
              {noDataMessage}
            </GridNoRecords>
          </Kgrid>
        </KendoGlobalization>
      </Grid>
    </Grid>
  );
}



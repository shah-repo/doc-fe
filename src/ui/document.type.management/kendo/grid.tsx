/* eslint-disable no-console */

import { Box, FormControl, Grid, IconButton, ListItemText, Menu, MenuItem, Typography } from "@material-ui/core";
import { DataResult, process, State } from "@progress/kendo-data-query";
import {
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as Kgrid, GridColumn, GridDataStateChangeEvent, GridNoRecords, GridToolbar,
} from "@progress/kendo-react-grid";
import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { ReactComponent as ViewGridIcon } from "../../../assets/images/grid_view.svg";
import { ReactComponent as SolidIcon } from "../../../assets/images/view.svg";
import { ReactComponent as ViewChecked } from "../../../assets/images/view_checked.svg";
// import ClearFilters from "../../components/table/ClearFilters";
import { DocumentTypeManagementProps } from "../../components/table/types";
import Text from "../../components/Text";
import { CommandCell } from "./cell.formatter/command.cell";
import gridConfiguration from "./columns/column.definition";
import GridStyles from "./grid.styles";

export function KendoGrid({
  tableData,
}) {
  const classes = GridStyles();
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const [isLoading, setIsLoading] = useState(false);
  const initialDataState = gridConfiguration.initialDataState;
  const columns = gridConfiguration.columns;
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
      // width={col.width} locked={col.locked}
      return <GridColumn field={col.field} title={col.title.toUpperCase()} key={index} cell={col.cell} filter={col.filter} filterCell={col.filterCell} columnMenu={col.columnMenu} ></GridColumn>;
    }
  });

  function commandCell(props) {
    return <CommandCell {...props} edit={enterEdit} remove={remove} add={add} discard={discard} update={update} cancel={cancel} editField={editField} />;
  }
  const enterEdit = () => {
    console.log("Enter Edit");
  };
  const remove = () => {
    console.log("Remove");
  };
  const add = () => {
    console.log("Add");
  };
  const discard = () => {
    console.log("Discard");
  };
  const cancel = () => {
    console.log("Cancel");
  };
  const update = () => {
    console.log("update");
  };
  const editField = () => {
    console.log("editField");
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [coldef, setColdef] = React.useState(columns);
  const onChange = (item: any) => {
    const newState = [...coldef];
    newState.map((c) => {
      if (c.field === item.field) {
        c.show = !c.show;
      }
    });
    setColdef(newState);

  };
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
    <>
      {isLoading && loadingPanel}
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
      // onRowClick={onRowClick}
      >
        <GridToolbar>
          <Grid container spacing={1}>
            {/* <Grid item={true} xs style={{ textAlign: "left" }}>
              <ClearFilters {...{ clearFilter }} />
            </Grid> */}
            <Grid item={true} xs style={{ textAlign: "right" }}>
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
            </Grid>
          </Grid>
        </GridToolbar>
        {renderColumns()}
        <GridColumn cell={commandCell} title="Actions" width="240px" locked={true}/>
        <GridNoRecords>
          {noDataMessage}
        </GridNoRecords>
        {/* <GridColumn cell={commandCell} title="Actions"/> */}
      </Kgrid>
    </>
  );
}

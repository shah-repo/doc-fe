import { InputBase, MenuItem, Select, withStyles } from "@material-ui/core";
import React from "react";
import { useBlockLayout, useTable } from "react-table";
import { useSticky } from "react-table-sticky";
import styled from "styled-components";
import { FBFormDefaultProps } from "../types/common";

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
    "width": "94px",
  },
  input: {
    position: "relative",
    padding: 2,
    fontSize: 12,
    border: "1px solid lightgray",
    fontFamily: "Open Sans, sans-serif",
  },
  selectMenu: {
    padding: 0,
  },
}))(InputBase);

const Styles = styled.div`
  .table {
    border: 1px solid #ddd;
    width: 100%;
    font-family: Open Sans, sans-serif;
    font-size: 12px;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
      border-bottom: 1px solid lightgray;
    }

    .th {
      background: #DFE1E3;
      padding: 5px;
      border-bottom: 1px solid white;
      border-right: 1px solid white;
      overflow: hidden;
      vertical-align: inherit;
      text-align: center;
      text-transform: uppercase;
    }

    .secondRowTh {
      background: #D4DBE1;
      padding: 5px;
      border-bottom: 1px solid white;
      border-right: 1px solid white;
      overflow: hidden;
      vertical-align: inherit;
      text-align: center;
      text-transform: uppercase;
    }

    .td {
      padding: 5px;
      height: 34px;
      border-bottom: 1px solid white;
      border-right: 1px solid white;
      background-color: white;
      overflow: hidden;
      vertical-align: inherit;
      text-align: center;
      font-family: Open Sans, sans-serif;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;

        &.isResizing {
          background: red;
        }
      }
    }

    &.sticky {
      overflow-x: scroll;
      overflow-y: hidden;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }

      .header {
        top: 0;
        font-weight: bold;
      }

      .footer {
        bottom: 0;
      }

      .body {
        position: relative;
        z-index: 0;
      }

      [data-sticky-td] {
        position: sticky;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px lightgray;
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px lightgray;
      }
    }
    .muiRoot {
      .MuiSelect-selectMenu.MuiSelect-selectMenu {
        padding: 0;
      }
    }
    .control {
      .MuiFormControl-root {
        margin-top: 1px;
        font-size: 12px;
      }
    }
    .muiInput {
      .MuiInputBase-input {
        padding: 2px;
        font-size: 12px;
      }
    }
    .capitalize {
      text-transform: uppercase;
      font-family: Open Sans, sans-serif;
      color: #4d4d4d;
    }
    .input {
      font-family: Open Sans, sans-serif;
      color: #4d4d4d;
      font-size: 12px;
    }
  }
`;

export interface Props extends FBFormDefaultProps {
  data: any[];
  columns: any[];
  editMode: boolean;
  handleAddRoleItems: (index: number, item: string, type: string) => void;
}

const ReactTable: React.FunctionComponent<Props> = ({
  data, columns, editMode, handleAddRoleItems,
}) => {

  const readInputValue = (event, header, index) => {
    handleAddRoleItems(index, event.target.value, header);
  };

  const readSelectValue = (event, index) => {
    handleAddRoleItems(index, event.target.value, "internalType");
  };


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useBlockLayout,
    useSticky
  );
  // if fullscreen size set clasName to width: fit-content
  return (
    <Styles>
      <div
        {...getTableProps()}
        className="table sticky"
      >
        <div className="header">
          {headerGroups.map((headerGroup, index) => (
            <div key={index} {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column, key) => (<div key={key} {...column.getHeaderProps()} className={column.depth === 1 ? "secondRowTh" : "th"}>
                {column.render("Header")}
              </div>))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()} className="body">
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <div key={i} {...row.getRowProps()} className="tr">
                {row.cells.map((cell, index) => {
                  if (cell.column.parent.Header !== " " && !editMode && cell.row.values.acronym !== "") {
                    const value = cell.value ? "Y" : "";
                    return (
                      <div key={index} {...cell.getCellProps()} className="td">
                        {value}
                      </div>
                    );
                  }
                  if (cell.column.Header === "Training req." && !editMode && cell.row.values.acronym !== "") {
                    const value = cell.value ? "Yes" : "No";
                    return (
                      <div key={index} {...cell.getCellProps()} className="td">
                        {value}
                      </div>
                    );
                  }
                  if (cell.row.values.name === "" && (cell.column.Header === "Internal type") ) {
                    return (
                      <div key={index} {...cell.getCellProps()} className="td">
                        <Select
                          value={cell.row.values.internalType}
                          onChange={(e) => readSelectValue(e, cell.row.index)}
                          input={<BootstrapInput />}
                        >
                          <MenuItem value={"DOC"}>DOC</MenuItem>
                          <MenuItem value={"FORM"}>FORM</MenuItem>
                          <MenuItem value={"OTHER"}>OTHER</MenuItem>
                        </Select>
                      </div>
                    );
                  }
                  if (cell.row.values.name === "" && ((cell.column.Header === "Prefix") || (cell.column.Header === "Document type"))) {
                    const name = cell.column.Header === "Prefix" ? "prefix" : "documentType";
                    return (
                      <div key={index} {...cell.getCellProps()} className="td">
                        <input
                          type="text"
                          name={name}
                          onChange={(e) => readInputValue(e, name, cell.row.index)}
                          style={{ width: name === "prefix" ? 44 : 185, padding: 3, border: "1px solid lightgray" }}
                          className={name === "prefix" ? "capitalize" : "input"}
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={index} {...cell.getCellProps()} className="td">
                      {cell.render("Cell")}
                    </div>
                  );
                }
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Styles>
  );
};

export default ReactTable;

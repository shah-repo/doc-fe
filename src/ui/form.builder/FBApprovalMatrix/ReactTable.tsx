import { FormControl } from "@material-ui/core";
import React from "react";
import { useBlockLayout, useTable } from "react-table";
import { useSticky } from "react-table-sticky";
import styled from "styled-components";
import InputField from "../../components/forms/fields/Input";
import SelectField from "../../components/forms/fields/Select";
import { FBFormDefaultProps } from "../types/common";


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
  }
`;

export interface Props extends FBFormDefaultProps {
  data: any[];
  columns: any[];
  editMode: boolean;
}

const ReactTable: React.FunctionComponent<Props> = ({
  data, columns, editMode,
}) => {

  // const renderEditable = (cellInfo) => {
  //   return (
  //     <div
  //       style={{ backgroundColor: "#fafafa" }}
  //       contentEditable
  //       suppressContentEditableWarning
  //       onBlur={(e) => {
  //         const data = [...this.state.data];
  //         data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
  //         data[cellInfo.index].full = data[cellInfo.index].age * 2;
  //       }}
  //       dangerouslySetInnerHTML={{
  //         __html: this.state.data[cellInfo.index][cellInfo.column.id],
  //       }}
  //     />
  //   );
  // };

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
                        <FormControl className="control" id="ApprovalMatrix-selectField" style={{ width: "100%", height: 20 }}>
                          <SelectField
                            name={cell.row.values.index}
                            includeEmpty={false}
                            options={[{ value: "DOC", text: "DOC" }, { value: "RSD", text: "RSD" }]}
                            selectProps={{
                              placeholder: "Select...",
                              style: {
                                margin: 0,
                                height: 20,
                                padding: 0,
                                marginTop: 0,
                              },
                              className: "muiRoot",
                            }}
                            inputFieldProps={{
                              style: { marginTop: 0 },
                            }}
                          />
                        </FormControl>
                      </div>
                    );
                  }
                  if (cell.row.values.name === "" && ((cell.column.Header === "Prefix") || (cell.column.Header === "Document type"))) {
                    return (
                      <div key={index} {...cell.getCellProps()} className="td">
                        <FormControl className="control" id="ApprovalMatrix-selectField" style={{ width: "100%", height: 20 }}>
                          <InputField name={cell.column.Header === "Prefix" ? "prefix" : "documentType"} inputProps={
                            {
                              style: {
                                margin: 0,
                                height: 20,
                                padding: 0,
                                marginTop: 0,
                              },
                              className: "muiInput",
                            }
                          } />
                        </FormControl>
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

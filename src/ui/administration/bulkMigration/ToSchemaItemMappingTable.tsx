import { Chip } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toastError } from '../../components/notifications';
import { ISchemaItem, SourceMapping, TableRowData } from './interface';
import useStyles from './styles';
import { validateTableMappings } from './utils';

const ADD_ROW_COLUMN_WIDTH_PERCENT = 4;

const ToSchemaItemMappingTable: React.FC<{
  schemaItem: ISchemaItem
  handleMappingChange: (rows: TableRowData[], entryRemoved?: SourceMapping) => void
  selectedSchemaItem: ISchemaItem | undefined
  isSingleRow?: boolean
}> = ({ schemaItem, handleMappingChange, selectedSchemaItem, isSingleRow }) => {
  const classes = useStyles();
  const [rows, setRows] = useState<TableRowData[]>(schemaItem.tableMappings ?? []);

  useEffect(() => {
    if (!rows.length) {
      addNewRow();
    }
  }, [schemaItem.name]);

  function addNewRow () {
    const rowDetails: {[key: string]: any} = {
      id: uuidv4(),
    };
    schemaItem.fieldNames?.forEach(fieldName => {
      rowDetails[fieldName] = null;
    });
    setRows([...rows, rowDetails]);
  }

  function deleteRow (rowToDelete: TableRowData) {
    const modifiedRows = rows.filter(row => row.id !== rowToDelete.id);
    Object.keys(rowToDelete).forEach(key => {
      const removedEntries = rowToDelete[key];
      if (Array.isArray(removedEntries)) {
        removedEntries.forEach(removedEntry => {
          handleMappingChange(modifiedRows, removedEntry);
        });
      }
    });

    setRows(modifiedRows);
  }

  function handleRowCellClicked (
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    selectedRow: TableRowData, key: string, mappedToSchemaItem: ISchemaItem,
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!selectedSchemaItem) {
      return;
    }

    if (selectedSchemaItem.referenceDataType) {
      toastError('Reference data type cannot be mapped to a column in the table. Please use direct mapping.');
      return;
    }

    const modifiedRow = cloneDeep(selectedRow);
    if (!modifiedRow[key]) {
      modifiedRow[key] = [];
    }
    modifiedRow[key].push({
      name: selectedSchemaItem.name,
      label: selectedSchemaItem.label,
      type: selectedSchemaItem.type,
      rules: selectedSchemaItem.rules,
    });

    // Check for Table Mappings
    const { canMap, errMessage }
      = validateTableMappings(key, selectedSchemaItem, modifiedRow, mappedToSchemaItem);
    if (!canMap) {
      toastError(errMessage);
      return;
    }

    const modifiedRows = rows.map(row => {
      if (row.id === selectedRow.id) {
        return modifiedRow;
      } else {
        return row;
      }
    });

    setRows(modifiedRows);
    handleMappingChange(modifiedRows);
  }

  function handleRowCellClearMapping (selectedRow: TableRowData, key: string, removedEntry) {
    const modifiedRows = rows.map(row => {
      if (row.id === selectedRow.id) {
        row[key] = row[key].filter(entry => entry.name !== removedEntry.name);
      }

      return row;
    });
    setRows(modifiedRows);
    handleMappingChange(modifiedRows, removedEntry);
  }

  function handleCellInput (event, selectedRow: TableRowData, key: string) {
    const newValue = event.target.textContent;
    const modifiedRows = rows.map(row => {
      if (row.id === selectedRow.id) {
        row[key] = newValue;
      }

      return row;
    });
    // setRows(modifiedRows);
    handleMappingChange(modifiedRows);
  }

  return (
    <Table className={classes.width100}
      size="small"
      aria-label="Mapping Table"
    >
      <TableHead>
        <TableRow>
          <TableCell style={{ width: `${ADD_ROW_COLUMN_WIDTH_PERCENT}` }} >No. </TableCell>
          {schemaItem.fieldNames?.map(fieldName => {
            return (
              <TableCell key={`header-${fieldName}`}>{fieldName}</TableCell>
            );
          })}
          { !isSingleRow && <TableCell style={{ width: `${ADD_ROW_COLUMN_WIDTH_PERCENT}` }} /> }
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index} className={classes.mappingTableRowHeight}>
            <TableCell className={classes.mappingTableCell}>
              {index + 1}.
            </TableCell>
            {schemaItem.fieldNames?.map(fieldName => {
              return (
                <TableCell className={classes.mappingTableCell}
                  onClick={e => handleRowCellClicked(e, row, fieldName, schemaItem)}
                  contentEditable = {!Array.isArray(row[fieldName])}
                  suppressContentEditableWarning
                  onInput={(event) => handleCellInput(event, row, fieldName)}
                  key={`valueField-${fieldName}-${index}`}
                >
                  {(Array.isArray(row[fieldName]) && row[fieldName]?.length) ? row[fieldName].map(entry => {
                    return (
                      <Chip
                        label={entry.label}
                        onDelete={e => handleRowCellClearMapping(row, fieldName, entry)}
                        color="secondary"
                        className={classes.chip}
                        key={entry.label}
                      />
                    );
                  }) : row[fieldName]}
                </TableCell>
              );
            })}
            { !isSingleRow && <TableCell className={classes.mappingTableCell}>
              { index > 0 && <DeleteIcon onClick={e => deleteRow(row)} className={classes.deleteIcon} /> }
              <PlaylistAddIcon onClick={addNewRow} className={classes.cursorPointer} />
            </TableCell> }
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ToSchemaItemMappingTable;

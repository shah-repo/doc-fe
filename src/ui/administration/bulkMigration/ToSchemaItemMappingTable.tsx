import { Chip } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toastError } from '../../components/notifications';
import Colors from '../../layout/theme/utils/colors';
import { IMappedFrom, IRowData, ISchemaItem } from './interface';
import { validateTableMappings } from './utils';

const ADD_ROW_COLUMN_WIDTH_PERCENT = 4;

const ToSchemaItemMappingTable: React.FC<{
  schemaItem: ISchemaItem
  handleMappingChange: (rows: IRowData[], entryRemoved?: IMappedFrom) => void
  selectedSchemaItems: ISchemaItem[]
  isSingleRow?: boolean
}> = ({ schemaItem, handleMappingChange, selectedSchemaItems, isSingleRow }) => {
  const [rows, setRows] = useState<IRowData[]>(schemaItem.tableMappings ?? []);

  // const widthPercent = Math.floor((100 - ADD_ROW_COLUMN_WIDTH_PERCENT) / (schemaItem.fieldNames?.length ?? 1));

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

  function deleteRow (rowToDelete: IRowData) {
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
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>, selectedRow: IRowData, key: string,
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!selectedSchemaItems.length) {
      return;
    }

    if (selectedSchemaItems.length > 1) {
      toastError('Only a single field can be mapped to a table column');
      return;
    }

    const selectedSchemaItem = selectedSchemaItems[0];

    if (selectedSchemaItem.referenceDataType) {
      toastError('Reference data type cannot be mapped to a column in the table. Please use direct mapping.');
      return;
    }

    const modifiedRow = { ...selectedRow };
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
    const { canMap, errMessage } = validateTableMappings(modifiedRow);
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

  function handleRowCellClearMapping (selectedRow: IRowData, key: string, removedEntry) {
    const modifiedRows = rows.map(row => {
      if (row.id === selectedRow.id) {
        row[key] = row[key].filter(entry => entry.name !== removedEntry.name);
      }

      return row;
    });
    setRows(modifiedRows);
    handleMappingChange(modifiedRows, removedEntry);
  }

  function handleCellInput (event, selectedRow: IRowData, key: string) {
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
    <Table
      // style={{ width: '100%', tableLayout: 'fixed' }}
      style={{ width: '100%' }}
      size="small"
      aria-label="Mapping Table"
    >
      <TableHead>
        <TableRow>
          <TableCell style={{ width: `${ADD_ROW_COLUMN_WIDTH_PERCENT}` }} >No. </TableCell>
          {schemaItem.fieldNames?.map(fieldName => {
            return (
              // <TableCell style={{ width: `${widthPercent}`, overflow: 'hidden', overflowWrap: 'break-word' }}>{fieldName}</TableCell>
              <TableCell>{fieldName}</TableCell>
            );
          })}
          { !isSingleRow && <TableCell style={{ width: `${ADD_ROW_COLUMN_WIDTH_PERCENT}` }} /> }
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index} style={{ height: '32px' }}>
            <TableCell style={{ border: `1px solid ${Colors.dark_gray2}` }}>
              {index + 1}.
            </TableCell>
            {schemaItem.fieldNames?.map(fieldName => {
              return (
                <TableCell style={{ border: `1px solid ${Colors.dark_gray2}` }}
                  onClick={e => handleRowCellClicked(e, row, fieldName)}
                  contentEditable = {!Array.isArray(row[fieldName])}
                  suppressContentEditableWarning
                  onInput={(event) => handleCellInput(event, row, fieldName)}
                >
                  {(Array.isArray(row[fieldName]) && row[fieldName]?.length) ? row[fieldName].map(entry => {
                    return (
                      <Chip
                        label={entry.label}
                        onDelete={e => handleRowCellClearMapping(row, fieldName, entry)}
                        color="secondary"
                        style={{ padding: '0px 4px', height: '28px', margin: '0 4px 4px 0' }}
                      />
                    );
                  }) : row[fieldName]}
                </TableCell>
              );
            })}
            { !isSingleRow && <TableCell style={{ border: `1px solid ${Colors.dark_gray2}` }}>
              { index > 0 && <DeleteIcon onClick={e => deleteRow(row)} style={{ cursor: 'pointer', color: Colors.red, marginRight: '4px' }} /> }
              <PlaylistAddIcon onClick={addNewRow} style={{ cursor: 'pointer' }} />
            </TableCell> }
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ToSchemaItemMappingTable;

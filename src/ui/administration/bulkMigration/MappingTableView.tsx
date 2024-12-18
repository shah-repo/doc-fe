import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import Colors from '../../layout/theme/utils/colors';
import { IReferenceDataType, IRowData, ISchemaItem } from './interface';

const ADD_ROW_COLUMN_WIDTH_PERCENT = 4;

const MappingTableView: React.FC<{
  schemaItem: ISchemaItem
  formInput?: Record<string, unknown>
}> = ({ schemaItem, formInput }) => {
  const [rows, setRows] = useState<IRowData[]>([]);

  useEffect(() => {
    const formInputValueRows = formInput ? formInput[schemaItem.name!] : null;
    if (schemaItem.referenceDataType === IReferenceDataType.ARRAY && Array.isArray(formInputValueRows) && formInputValueRows.length) {
      setRows(formInputValueRows);
    } else if (schemaItem.referenceDataType === IReferenceDataType.OBJECT && formInputValueRows) {
      setRows([formInputValueRows as IRowData]);
    }
  }, [schemaItem.name]);

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
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => {
          return (
            <TableRow key={index} style={{ height: '32px' }}>
              <TableCell style={{ border: `1px solid ${Colors.dark_gray2}` }}>
                {index + 1}.
              </TableCell>
              {schemaItem.fieldNames?.map(fieldName => {
                return (
                  <TableCell style={{ border: `1px solid ${Colors.dark_gray2}` }}>
                    <em style={{ fontWeight: 'bold' }}>{typeof row[fieldName] === 'string' ? row[fieldName] : JSON.stringify(row[fieldName])}</em>
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default MappingTableView;

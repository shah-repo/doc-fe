import * as XLSX from '@progress/kendo-ooxml';
import { saveAs } from '@progress/kendo-file-saver';
import { TreeListColumnProps } from '@progress/kendo-react-treelist';
import { getExcelColumns } from '../Grid';
import createSchema from '../../schema';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ApprovalRole } from '../../../FBApprovalMatrixRoles/types';
import { SEARCHABLE_GROUPS_FIELD } from '../../../FBApprovalMatrixRoles/constants';

interface Column {
  field?: string
  title: string
  children?: Column[]
}

interface HeaderCell {
  value: string
  colSpan?: number
  rowSpan?: number
  bold?: boolean
}

interface HeaderRow {
  cells: HeaderCell[]
}

const flattenColumns = (columns) => {
  const result: Column[] = [];

  const walk = (cols) => {
    cols.forEach(col => {
      if (col.children) {
        walk(col.children);
      } else {
        result.push(col);
      }
    });
  };

  walk(columns);
  return result;
};

const buildHeaderRows = (columns, depth = getMaxDepth(columns)) => {
  const rows: HeaderRow[] = Array.from({ length: depth }, () => ({ cells: [] }));

  const walk = (cols, level = 0) => {
    cols.forEach(col => {
      const isGroup = !!col.children;
      const colSpan = isGroup ? countLeafColumns(col) : 1;
      const rowSpan = isGroup ? 1 : depth - level;

      rows[level].cells.push({
        value: col.title || col.field,
        colSpan,
        rowSpan,
        bold: true,
      });

      if (isGroup) {
        walk(col.children, level + 1);
      }
    });
  };

  walk(columns);
  return rows;
};

const getMaxDepth = (cols) => {
  return cols.reduce((max, col) => {
    if (col.children) {
      return Math.max(max, 1 + getMaxDepth(col.children));
    }
    return Math.max(max, 1);
  }, 0);
};

const countLeafColumns = (col) => {
  if (!col.children) return 1;
  return col.children.reduce((sum, child) => sum + countLeafColumns(child), 0);
};

const exportSheets = async (sheetData, fileName, damName) => {
  const sheets = sheetData.map(({ name, data, columns }) => {
    const flatColumns = flattenColumns(columns);

    const headerRows = buildHeaderRows(columns);

    const dataRows = data.map(row => ({
      cells: flatColumns.map((col, colIndex) => {
        let value = getNestedValue(row, col.field);
        if (colIndex === 0) {
          if (value === true) {
            value = 'Active';
          } else if (value === false) {
            value = 'Inactive';
          }
        }
        else if (value === true) {
          value = 'Y';
        } else if (value === false) {
          value = '';
        }
        return { value, alignment: { horizontal: 'center' } };
      }),
    }));

    const customIntroRow = {
      cells: [
        { value: name === 'Matrix Details' ? damName : '' }, // only for first sheet
        ...Array(flatColumns.length - 1).fill({ value: '' }), // fill remaining columns with blanks
      ],
    };

    return {
      name,
      rows: name === 'Matrix Details'
        ? [customIntroRow, ...headerRows, ...dataRows]
        : [...headerRows, ...dataRows],
    };
  });

  const workbook = new XLSX.Workbook({ sheets });
  const dataURL = await workbook.toDataURL();
  saveAs(dataURL, `${fileName}.xlsx`);
};

const getNestedValue = (obj, path) =>
  path?.split('.').reduce((acc, part) => acc?.[part], obj);

export const exportDAM = (approvalMatrixFieldState, groups, existingRoles, numOfRevStages, fileName, damName) => {
  const matrixDetailsData = approvalMatrixFieldState?.getCurrentData('matrix') ?? [];
  const approvalRoles = existingRoles.map((role) => {
    const foundGroups = role.groups.map(({ id }) => {
      const foundGroup = groups.find((group) => group.id === id);
      return foundGroup ?? { id, name: '' };
    });
    return {
      ...role,
      groups: foundGroups ?? [],
    };
  }).sort((a, b) => a.index - b.index);
  const approvalRolesData = approvalRoles.map((role: ApprovalRole) => {
    return {
      ...role, [SEARCHABLE_GROUPS_FIELD]: role.groups.map(({ name }) => name).join(' '),
    };
  });
  let schemaMatrix = createSchema({ data: { approvalMatrix: matrixDetailsData, approvalRoles: approvalRolesData } });

  if(numOfRevStages === 2) {
    schemaMatrix = schemaMatrix.filter(item => item.id !== 'form-builder-approvals-numeric-alpha');
  }

  const matrixDetailsColumns = getExcelColumns(schemaMatrix as TreeListColumnProps[]);
  const approvalRolesColumns = getExcelColumns(schemaApprovalRoles as TreeListColumnProps[]);
  const introRow = matrixDetailsColumns.reduce((acc, col, index) => {
    if (col.field) {
      acc[col.field] = index === 0 ? damName : '';
    }
    return acc;
  }, {} as Record<string, any>);
  const matrixSheetDataWithHeader = [
    introRow,
    ...matrixDetailsData,
  ];
    const sheetData = [
      {
        name: 'Matrix Details',
        data: matrixSheetDataWithHeader,
        columns: matrixDetailsColumns,
      },
      {
        name: 'Approval Roles',
        data: approvalRolesData,
        columns: approvalRolesColumns,
      },
    ];
    exportSheets(sheetData, fileName, damName);
};

  const schemaApprovalRoles: Array<ColumnDefinition<any>> = [
    {
      id: 'name',
      field: 'name',
      title: 'form.builder.approval.role',
    },
    {
      id: 'groups',
      field: 'groupsList',
      title: 'form.builder.approving.groups',
    },
  ];

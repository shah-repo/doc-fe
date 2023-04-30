import React from 'react';
import CheckboxCellTemplate from '../CheckboxCellTemplate';
import DropdownCellTemplate from '../DropdownCellTemplate';
import ActiveCellTemplate from '../ActiveCellTemplate';
import InputCellTemplate from '../InputCellTemplate';
import BooleanFilter from '../BooleanFilter';
import StatusFilter from '../StatusFilter';
import InputFilter from '../InputFilter';
import { FBApprovalMatrixTableRoleHead as RoleStageTitles } from '../../../FBApprovalMatrixTable/FBApprovalMatrixTable.types';
import { CellTemplate, ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import {
  FBApprovalMatrixItem,
  FBApprovalRole,
} from '../../../FBApprovalMatrixField/FBApprovalMatrixField.types';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import DropdownFilter from '../DropdownFilter';
import { translate } from '../../../../../common/intl';

export default function createSchema (
  approvalMatrix: FBApprovalMatrixItem[],
  approvalRoles: FBApprovalRole[],
): Array<ColumnDefinition<FBApprovalMatrixItem>> {
  const uniqueCategories = Array.from(new Set(
    approvalMatrix
      .map((item) => item?.docType?.category)
      .filter(Boolean),
  ));
  const uniqueCategoriesOptions = uniqueCategories.map((category) => ({ value: category, text: category }));

  const CategoryFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={uniqueCategoriesOptions}
      defaultItem={{ value: '', text: translate('common.all') }}
    />
  );

  const CategoryCellTemplate: CellTemplate<FBApprovalMatrixItem> = (props) => (
    <DropdownCellTemplate
      {...props}
      data={uniqueCategoriesOptions}
      defaultItem={{ value: '', text: '-' }}
    />
  );

  const schema: Array<ColumnDefinition<FBApprovalMatrixItem>> = [
    {
      id: 'active',
      title: 'Status',
      field: 'docType.active',
      filterable: true,
      editable: false,
      filterCell: StatusFilter,
      template: ActiveCellTemplate,
      locked: true,
      width: 140,
    },
    {
      id: 'prefix',
      title: 'Prefix',
      field: 'docType.acronym',
      filterable: true,
      editable: false,
      filterCell: InputFilter,
      template: InputCellTemplate,
      locked: true,
      width: 100,
    },

    {
      id: 'internal-type',
      title: 'Internal type',
      field: 'docType.group',
      filterable: true,
      editable: false,
      filterCell: InputFilter,
      template: InputCellTemplate,
      locked: true,
      width: 100,
    },
    {
      id: 'document-type',
      title: 'Document type',
      field: 'docType.name',
      filterable: true,
      editable: false,
      filterCell: InputFilter,
      template: InputCellTemplate,
      locked: true,
      width: 100,
    },
    {
      id: 'training',
      title: 'Training',
      field: 'docType.defaultTraining',
      filterable: true,
      editable: true,
      filterCell: BooleanFilter,
      template: CheckboxCellTemplate,
      width: 100,
    },
    {
      id: 'signature',
      title: 'Signature',
      field: 'docType.needsSignature',
      filterable: true,
      editable: true,
      filterCell: BooleanFilter,
      template: CheckboxCellTemplate,
      width: 100,
    },
    {
      id: 'category',
      title: 'Category',
      field: 'docType.category',
      filterable: true,
      editable: false,
      filterCell: CategoryFilter,
      template: CategoryCellTemplate,
      width: 100,
    },
  ];

  if (approvalRoles) {
    for (const [headKey, headTitle] of Object.entries(RoleStageTitles)) {
      schema.push({
        id: headTitle,
        title: translate(headTitle),
        children: approvalRoles.map((role) => ({
          id: role.name,
          title: role.name,
          field: `approvalRoles.${headKey}.${role.index}`,
          filterable: false,
          editable: true,
          template: CheckboxCellTemplate,
          width: 50,
        })),
      });
    }
  }

  return schema;
}

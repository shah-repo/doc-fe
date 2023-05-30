import React from 'react';
import CheckboxCellTemplate from './components/CheckboxCellTemplate';
import DropdownCellTemplate from './components/DropdownCellTemplate';
import StatusCellTemplate from './components/StatusCellTemplate';
import InputCellTemplate from './components/InputCellTemplate';
import BooleanFilter from './components/BooleanFilter';
import InputFilter from './components/InputFilter';
import { FBApprovalMatrixRoleTitles } from './types';
import { CellTemplate, ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import {
  FBApprovalMatrixFieldData,
  FBApprovalMatrixItem,
} from '../FBApprovalMatrixField/FBApprovalMatrixField.types';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import DropdownFilter from './components/DropdownFilter';
import { translate } from '../../../common/intl';
import cx from 'classnames';
import { kebabCase } from 'lodash';
import { createOption } from './components/Grid';
import { GroupWithGroupOptions } from '../../../state/ducks/documentRevisions/documentType/types';
import { CATEGORY_OPTIONS } from './constants';

interface Options {
  data?: FBApprovalMatrixFieldData
  withoutStatus?: boolean
  cellARHeaderClassName: string
  cellARClassName: string
  clearRightBorderClassName: string
}

export default function createSchema (options: Options): Array<ColumnDefinition<FBApprovalMatrixItem>> {
  const {
    data, withoutStatus,
    cellARHeaderClassName, cellARClassName, clearRightBorderClassName,
  } = options;
  const { approvalMatrix = [], approvalRoles = [] } = data ?? {};

  const internalTypeOptions = Object.keys(GroupWithGroupOptions).map(v => createOption(v));

  // Add unknown Categories to Filter from data.
  const categoryFilterOptions = [...CATEGORY_OPTIONS];
  approvalMatrix
    .map(item => item.docType.category)
    .filter(Boolean)
    .forEach((value) => {
      if (!categoryFilterOptions.find(item => item.value === value)) {
        categoryFilterOptions.push(createOption(value));
      }
    });

  const StatusFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      disabled={withoutStatus}
      data={[
        createOption(true, translate('common.active')),
        createOption(false, translate('common.inactive')),
      ]}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  const InternalTypeFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={internalTypeOptions}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  const InternalTypeCellTemplate: CellTemplate<FBApprovalMatrixItem> = (props) => (
    <DropdownCellTemplate
      {...props}
      data={internalTypeOptions}
    />
  );

  const CategoryFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={categoryFilterOptions}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  const CategoryCellTemplate: CellTemplate<FBApprovalMatrixItem> = (props) => (
    <DropdownCellTemplate
      {...props}
      data={CATEGORY_OPTIONS}
    />
  );

  const schema: Array<ColumnDefinition<FBApprovalMatrixItem>> = [
    {
      id: 'status',
      title: 'form.builder.am.status',
      field: 'docType.active',
      filterable: true,
      editable: false,
      filterCell: StatusFilter,
      template: StatusCellTemplate,
      locked: true,
      width: 140,
    },
    {
      id: 'prefix',
      title: 'form.builder.am.prefix',
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
      title: 'form.builder.am.internal-type',
      field: 'docType.group',
      filterable: true,
      editable: false,
      filterCell: InternalTypeFilter,
      template: InternalTypeCellTemplate,
      locked: true,
      width: 130,
    },
    {
      id: 'document-type',
      title: 'form.builder.am.document-type',
      field: 'docType.name',
      filterable: true,
      editable: false,
      filterCell: InputFilter,
      template: InputCellTemplate,
      locked: true,
      width: 140,
    },
    {
      id: 'training',
      title: 'form.builder.am.training',
      field: 'docType.defaultTraining',
      filterable: true,
      editable: true,
      filterCell: BooleanFilter,
      template: CheckboxCellTemplate,
      width: 100,
    },
    {
      id: 'signature',
      title: 'form.builder.am.signature',
      field: 'docType.needsSignature',
      filterable: true,
      editable: true,
      filterCell: BooleanFilter,
      template: CheckboxCellTemplate,
      width: 100,
    },
    {
      id: 'category',
      title: 'form.builder.am.category',
      field: 'docType.category',
      filterable: true,
      editable: false,
      filterCell: CategoryFilter,
      template: CategoryCellTemplate,
      width: 140,
    },
  ];

  if (approvalRoles) {
    for (const [headKey, headTitle] of Object.entries(FBApprovalMatrixRoleTitles)) {
      schema.push({
        id: kebabCase(headTitle),
        title: headTitle,
        headerClassName: cellARHeaderClassName,
        children: approvalRoles.map((role, index, arr) => ({
          id: kebabCase(role.name),
          title: role.name,
          field: `approvalRoles.${headKey}.${role.index}`,
          filterable: false,
          editable: true,
          template: CheckboxCellTemplate,
          width: 90,
          headerClassName: cx(cellARHeaderClassName, { [clearRightBorderClassName]: index !== arr.length - 1 }),
          className: cellARClassName,
        })),
      });
    }
  }

  return schema;
}

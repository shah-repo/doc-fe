import { GridFilterCellProps } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { kebabCase } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../common/intl';
import { Group } from '../../../state/ducks/auth/types';
import { Employee } from '../../../state/ducks/company/types';
import { GroupWithGroupOptions } from '../../../state/ducks/documentRevisions/documentType/types';
import { ApplicationState } from '../../../state/reducers';
import { CellTemplate, ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBApprovalMatrixFieldData, FBApprovalMatrixItem } from '../FBApprovalMatrixField/FBApprovalMatrixField.types';
import AllowedCreateDropdownCellTemplate from './components/AllowedCreateDropdownCellTemplate';
import BooleanFilter from './components/BooleanFilter';
import CheckboxCellTemplate from './components/CheckboxCellTemplate';
import DropdownCellTemplate from './components/DropdownCellTemplate';
import DropdownFilter from './components/DropdownFilter';
import { createOption } from './components/Grid';
import InputCellTemplate from './components/InputCellTemplate';
import InputFilter from './components/InputFilter';
import NamingStyleDropdownCellTemplate from './components/NamingStyleDropdownCellTemplate';
import StatusCellTemplate from './components/StatusCellTemplate';
import { CATEGORY_OPTIONS, DEFAULT_CATEGORY_LABEL, NUMBERING_STYLE_OPTIONS } from './constants';
import { FBApprovalMatrixRoleTitles } from './types';

interface Options {
  data?: FBApprovalMatrixFieldData
  withoutStatus?: boolean
  cellARHeaderClassName?: string
  cellARClassName?: string
  clearRightBorderClassName?: string
  popupContainer?: React.RefObject<HTMLDivElement>
}

export default function createSchema (options: Options): Array<ColumnDefinition<FBApprovalMatrixItem>> {
  const {
    data, withoutStatus,
    cellARHeaderClassName, cellARClassName, clearRightBorderClassName,
    popupContainer,
  } = options;
  const { approvalMatrix = [], approvalRoles = [] } = data ?? {};

  const internalTypeOptions = Object.keys(GroupWithGroupOptions).map(v => createOption(v));

  const allCompanyGroups: Group[] = useSelector((state: ApplicationState) => state.auth.user.groups) as Group[];
  const groupOptions = allCompanyGroups.map(companyGroup => (createOption(companyGroup.id, companyGroup.name)));

  const allCompanyEmployees: Employee[] = useSelector((state: ApplicationState) => state.company.companyMine.employees) as Employee[];
  const employeeOptions = allCompanyEmployees.map(companyEmployee => (createOption(companyEmployee.id, companyEmployee.user?.name ?? '')));

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

  const NumberingStyleFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      disabled={withoutStatus}
      data={NUMBERING_STYLE_OPTIONS}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  const NumberingStyleTemplate: CellTemplate<FBApprovalMatrixItem> = (props) => (
    <NamingStyleDropdownCellTemplate
      {...props}
      data={NUMBERING_STYLE_OPTIONS}
      popupSettings={{
        appendTo: popupContainer?.current!,
      }}
    />
  );

  const AllowedCreateUsersTemplate: CellTemplate<FBApprovalMatrixItem> = (props) => (
    <AllowedCreateDropdownCellTemplate
      {...props}
      data={employeeOptions}
      popupSettings={{
        appendTo: popupContainer?.current!,
      }}
    />
  );

  const AllowedCreateRolesTemplate: CellTemplate<FBApprovalMatrixItem> = (props) => (
    <AllowedCreateDropdownCellTemplate
      {...props}
      data={groupOptions}
      popupSettings={{
        appendTo: popupContainer?.current!,
      }}
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
      popupSettings={{
        appendTo: popupContainer?.current!,
      }}
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
      emptyLabel={DEFAULT_CATEGORY_LABEL}
      data={CATEGORY_OPTIONS}
      popupSettings={{
        appendTo: popupContainer?.current!,
      }}
    />
  );

  const StatusCellRenderer: CellTemplate<FBApprovalMatrixItem> = (props) => (
    <StatusCellTemplate
      {...props}
      popupSettings={{
        appendTo: popupContainer?.current!,
      }}
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
      template: StatusCellRenderer,
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
      template: InputCellTemplate as CellTemplate<FBApprovalMatrixItem>,
      locked: true,
      required: true,
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
      template: InputCellTemplate as CellTemplate<FBApprovalMatrixItem>,
      locked: true,
      required: true,
      width: 140,
    },
    {
      id: 'numberingStyle',
      title: 'form.builder.am.numberingStyle',
      field: 'docType.numberingStyle',
      filterable: true,
      editable: true,
      filterCell: NumberingStyleFilter,
      template: NumberingStyleTemplate,
      width: 180,
    },
    {
      id: 'training',
      title: 'form.builder.am.training',
      field: 'docType.defaultTraining',
      filterable: true,
      editable: true,
      filterCell: BooleanFilter,
      template: CheckboxCellTemplate as CellTemplate<FBApprovalMatrixItem>,
      width: 100,
    },
    {
      id: 'signature',
      title: 'form.builder.am.signature',
      field: 'docType.needsSignature',
      filterable: true,
      editable: true,
      filterCell: BooleanFilter,
      template: CheckboxCellTemplate as CellTemplate<FBApprovalMatrixItem>,
      width: 100,
    },
    {
      id: 'category',
      title: 'form.builder.am.category',
      field: 'docType.updatedCategory',
      filterable: true,
      editable: false,
      filterCell: CategoryFilter,
      template: CategoryCellTemplate,
      width: 140,
    },
    {
      id: 'allowedCreateUsers',
      title: 'form.builder.am.allowedCreateUsers',
      field: 'docType.allowedCreateUserIds',
      filterable: false,
      editable: true,
      template: AllowedCreateUsersTemplate,
      width: 180,
    },
    {
      id: 'allowedCreateRoles',
      title: 'form.builder.am.allowedCreateRoles',
      field: 'docType.allowedCreateRoleIds',
      filterable: false,
      editable: true,
      template: AllowedCreateRolesTemplate,
      width: 180,
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
          template: CheckboxCellTemplate as CellTemplate<FBApprovalMatrixItem, Record<string, unknown>>,
          width: 90,
          headerClassName: cx(cellARHeaderClassName, clearRightBorderClassName && { [clearRightBorderClassName]: index !== arr.length - 1 }),
          className: cellARClassName,
          isRoleCheckbox: true,
          role,
        })),
      });
    }
  }

  return schema;
}

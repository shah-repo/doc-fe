import React from 'react';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { ApprovedToReceiveCell } from './components/ApprovedToReceiveCell';
import { PrimaryCell } from './components/PrimaryCell';
import { SiteAddressCell } from './components/SiteAddressCell';
import { TextFieldCellTemplate } from './components/TextFieldCellTemplate';
import { EditableSite, SchemaOptions } from './types';

export const buildSchema = ({
  isActive,
  isInEditMode,
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
  onSameAsHQ,
}: SchemaOptions): Array<ColumnDefinition<EditableSite>> => {
  return [
    {
      id: 'primary',
      field: 'primary',
      filterable: false,
      title: 'form.builder.site.inforation.grid.heading.primary',
      template: (props) => (
        <PrimaryCell
          isActive={false}
          {...props}
          isInEditMode={isInEditMode} />
      ),
      width: 80,
    },
    {
      id: 'siteName',
      field: 'siteName',
      title: 'form.builder.site.inforation.grid.heading.site.name',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 200,
    },
    {
      id: 'siteAddress',
      field: 'siteAddress',
      title: 'form.builder.site.inforation.grid.heading.site.address',
      filterable: false,
      template: (props) => <SiteAddressCell {...props} onClick={onRowClick} onSameAsHQ={onSameAsHQ} />,
      width: 350,
    },
    {
      id: 'city',
      field: 'city',
      title: 'form.builder.site.inforation.grid.heading.city',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 200,
    },
    {
      id: 'zipCode',
      field: 'zipCode',
      title: 'form.builder.site.inforation.grid.heading.zip.code',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'country',
      field: 'country',
      title: 'form.builder.site.inforation.grid.heading.country',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'approvedToReceive',
      field: 'approvedToReceive',
      title: 'form.builder.site.inforation.grid.heading.approved.to.receive',
      filterable: false,
      template: (props) => <ApprovedToReceiveCell {...props} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'actions',
      title: 'actions',
      className: actionsClass,
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          onConfirm={onConfirm}
          onDiscard={onDiscard}
          onDelete={onDelete}
        />
      ),
      width: 1,
    },
  ];
};

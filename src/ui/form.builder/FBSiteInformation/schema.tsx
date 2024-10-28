import React from 'react';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { PrimaryCell } from './components/PrimaryCell';
import { SameAsHQCellCellTemplate } from './components/SameAsHQCell';
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
      id: 'sameAsHQ',
      field: 'sameAsHQ',
      filterable: false,
      title: 'form.builder.site.inforation.grid.heading.same.as.hq',
      template: (props) => (
        <SameAsHQCellCellTemplate
          {...props}
          isActive={isActive}
          isInEditMode={isInEditMode}
        />
      ),
      width: 110,
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
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 120,
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
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
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

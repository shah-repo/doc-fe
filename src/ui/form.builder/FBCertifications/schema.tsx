import React from 'react';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { AttachmentCell } from './components/AttachmentCell';
import { ExpiryDateCell } from './components/ExpiryDateCell';
import { TextFieldCellTemplate } from './components/TextFieldCellTemplate';
import { UploadedByCell } from './components/UploadedByCell';
import { EditableCertification, SchemaOptions } from './types';

export const buildSchema = ({
  isActive,
  isInEditMode,
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
}: SchemaOptions): Array<ColumnDefinition<EditableCertification>> => {
  return [
    {
      id: 'certificateId',
      field: 'certificateId',
      title: 'form.builder.supplier.certifications.grid.heading.certifications.name',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 140,
    },
    {
      id: 'attachments',
      field: 'attachments',
      title: 'form.builder.supplier.certifications.grid.heading.attachments',
      filterable: false,
      template: (props) => <AttachmentCell {...props} onClick={onRowClick} />,
      width: 250,
    },
    {
      id: 'uploaded-by',
      field: 'uploadedBy',
      title: 'form.builder.supplier.certifications.grid.heading.uploaded.by',
      filterable: false,
      template: (props) => <UploadedByCell {...props} onClick={onRowClick} />,
      width: 140,
    },
    {
      id: 'type',
      field: 'type',
      title: 'form.builder.supplier.certifications.grid.heading.certifications.type',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 140,
    },
    {
      id: 'expiry-date',
      field: 'expiryDate',
      title: 'form.builder.supplier.certifications.grid.heading.expiry.date',
      filterable: false,
      template: (props) => <ExpiryDateCell {...props} onClick={onRowClick} />,
      width: 140,
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

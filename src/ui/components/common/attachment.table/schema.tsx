import { createStyles, makeStyles } from '@material-ui/styles';
import { CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import React from 'react';
import { AttachmentType } from '../../../../state/ducks/attachments/types';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { Attachment } from '../../../change.request/form/types';
import InputFilter from '../../../form.builder/FBApprovalMatrix/components/InputFilter';
import { ColumnDefinition } from '../../KendoDataGrid/KendoDataGrid.types';
import ActionNeededCellTemplate from './components/ActionNeededCellTemplate';
import DragCell from './components/DragCell';
import FileExtensionCellTemplate from './components/FileExtensionCellTemplate';
import FileNameCellTemplate from './components/FileNameCellTemplate';
import FileOwnerCellTemplate from './components/FileOwnerCellTemplate';
import FileSizeCellTemplate from './components/FileSizeCellTemplate';
import FileUploadDateCellTemplate from './components/FileUploadDateCellTemplate';
import SelectFilter from './components/SelectFilter';

interface SchemaOptions {
  isHeaderChecked: boolean
  documentRevision: DocumentRevision
  onDownloadAttachment?: (attachment: Attachment, type?: AttachmentType) => void
  onDownloadAsPDF?: (attachment: Attachment, attachmentType: AttachmentType) => void
  onView?: (attachment: Attachment) => (evt: React.MouseEvent<HTMLElement>) => void
  onDelete?: (attachment: Attachment) => () => void
  handleHeaderCheckedChange: (event: CheckboxChangeEvent) => void
}

const styles = makeStyles(() =>
  createStyles({
    checkbox: {
      paddingLeft: '20px !important',
    },
  }));

export const buildSchema = ({
  isHeaderChecked,
  documentRevision,
  onDownloadAttachment,
  onDownloadAsPDF,
  onDelete,
  onView,
  handleHeaderCheckedChange,
}: SchemaOptions): Array<ColumnDefinition<Attachment>> => {
  const classes = styles();

  return [
    {
      id: 'id',
      field: 'id',
      cell: (props) => <DragCell {...props} />,
      filterable: false,
      width: 30,
    },
    {
      id: 'id',
      field: 'selected',
      title: 'Select',
      filterCell: (props) => <SelectFilter {...{ props, isHeaderChecked, handleHeaderCheckedChange }} />,
      className: classes.checkbox,
      width: 65,
    },
    {
      id: 'name',
      field: 'name',
      title: 'attachment.table.file.name',
      filterCell: InputFilter,
      template: (props) => <FileNameCellTemplate {...props} {...{ documentRevision, onView }} />,
      width: 250,
    },
    {
      id: 'type',
      field: 'type',
      filterCell: InputFilter,
      title: 'attachment.table.extension',
      template: (props) => <FileExtensionCellTemplate {...props} />,
      width: 70,
    },
    {
      id: 'ownerName',
      field: 'owner.user.name',
      filterCell: InputFilter,
      title: 'attachment.table.uploaded.by',
      template: (props) => <FileOwnerCellTemplate {...props} />,
      width: 200,
    },
    {
      id: 'date',
      field: 'createdAt',
      title: 'attachment.table.uploaded.date',
      filterCell: InputFilter,
      template: (props) => <FileUploadDateCellTemplate {...props} />,
      width: 100,
    },
    {
      id: 'fileSizeS3Link',
      field: 'fileSizeS3Link',
      title: 'attachment.table.file.size',
      filterCell: InputFilter,
      template: (props) => <FileSizeCellTemplate {...props} />,
      width: 100,
    },
    {
      id: 'action-needed',
      field: 'actionNeeded',
      title: 'table.column.actions',
      filterable: false,
      template: (props) => <ActionNeededCellTemplate {...props} {...{ onDownloadAttachment, onDelete, onDownloadAsPDF, onView, documentRevision }} />,
      width: 60,
    },
  ];
};

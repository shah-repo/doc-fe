import { Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import { CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import React from 'react';
import { AttachmentType } from '../../../../state/ducks/attachments/types';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { Attachment } from '../../../change.request/form/types';
import InputFilter from '../../../form.builder/FBApprovalMatrix/components/InputFilter';
import { ColumnDefinition } from '../../KendoDataGrid/KendoDataGrid.types';
import ActionNeededCellTemplate from './components/ActionNeededCellTemplate';
import FileExtensionCellTemplate from './components/FileExtensionCellTemplate';
import FileNameCellTemplate from './components/FileNameCellTemplate';
import FileOwnerCellTemplate from './components/FileOwnerCellTemplate';
import FileSizeCellTemplate from './components/FileSizeCellTemplate';
import FileUploadDateCellTemplate from './components/FileUploadDateCellTemplate';
import DateFilter from './filter/DateFilter';
import FileSizeFilter from './filter/FileSizeFilter';
import SelectFilter from './filter/SelectFilter';

interface SchemaOptions {
  headerChecked: boolean
  documentRevision: DocumentRevision
  onDownloadAttachment?: (attachment: Attachment, type?: AttachmentType) => () => any
  onDownloadAsPDF?: (attachment: Attachment, attachmentType: AttachmentType) => void
  onView?: (e: any) => void
  onDelete?: (attachment: Attachment) => () => any
  handleHeaderCheckedChange: (event: CheckboxChangeEvent) => void
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    checkbox: {
      paddingLeft: '20px !important',
    },
  }));

export const buildSchema = ({
  headerChecked,
  documentRevision,
  onDownloadAttachment,
  onDownloadAsPDF,
  onDelete,
  onView,
  handleHeaderCheckedChange,
}: SchemaOptions): Array<ColumnDefinition<any>> => {
  const classes = styles();
  return [
    {
      id: 'id',
      field: 'selected',
      title: 'Select',
      filterCell: (props) => <SelectFilter {...{ props, headerChecked, handleHeaderCheckedChange }} />,
      className: classes.checkbox,
      width: 60,
    },
    {
      id: 'name',
      field: 'name',
      title: 'attachment.table.file.name',
      filterCell: InputFilter,
      template: (props) => <FileNameCellTemplate {...{ props, documentRevision }} />,
      width: 200,
    },
    {
      id: 'type',
      field: 'type',
      filterCell: InputFilter,
      title: 'attachment.table.extension',
      template: (props) => <FileExtensionCellTemplate {...props} />,
      width: 150,
    },
    {
      id: 'ownerName',
      field: 'owner.user.name',
      filterCell: InputFilter,
      title: 'attachment.table.uploaded.by',
      template: (props) => <FileOwnerCellTemplate {...props} />,
      width: 150,
    },
    {
      id: 'date',
      field: 'createdAt',
      title: 'attachment.table.uploaded.date',
      filterCell: DateFilter,
      template: (props) => <FileUploadDateCellTemplate {...props} />,
      width: 170,
    },
    {
      id: 'fileSizeS3Link',
      field: 'fileSizeS3Link',
      title: 'attachment.table.file.size',
      filterCell: FileSizeFilter,
      template: (props) => <FileSizeCellTemplate {...props} />,
      width: 170,
    },
    {
      id: 'action-needed',
      field: 'actionNeeded',
      title: 'table.column.actions',
      filterable: false,
      template: (props) => <ActionNeededCellTemplate {...props} {...{ onDownloadAttachment, onDelete, onDownloadAsPDF, onView }} />,
      width: 60,
    },
  ];
};

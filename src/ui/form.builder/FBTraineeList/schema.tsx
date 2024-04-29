import React from 'react';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import InputCellTemplate from '../FBApprovalMatrix/components/InputCellTemplate';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { DateCellTemplate } from './components/DateCellTemplate';
import { PrimaryOwnerCellTemplate } from './components/PrimaryOwnerCellTemplate';
import { RevisionCellTemplate } from './components/RevisionCellTemplate';
import { UploadEvidenceCellTemplate } from './components/UploadEvidenceCellTemplate';
import { EditableTrainee, SchemaOptions } from './types';

export const buildSchema = ({
  employees,
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
  documentOptions,
  currentState,
}: SchemaOptions): Array<ColumnDefinition<EditableTrainee>> => {
  const employeeOptions = employees.filter(item => item.active);

  return [
    {
      id: 'user',
      field: 'user.name', // deep field name for correct filter working
      title: 'common.user',
      filterCell: InputFilter,
      template: (props) => <PrimaryOwnerCellTemplate {...props} field="user" options={employeeOptions} />,
      editable: false,
      width: 200,
    },
    {
      id: 'docId',
      field: 'docId',
      title: 'form.builder.trainee.list.doc.id',
      filterCell: InputFilter,
      template: (props) => <RevisionCellTemplate {...props} options={documentOptions} onClick={onRowClick} fieldToEdit="docId" />,
      width: 220,
    },
    {
      id: 'id',
      field: 'id',
      title: 'form.builder.trainee.list.id',
      filterCell: InputFilter,
      template: (props) => <></>,
      width: 150,
    },
    {
      id: 'attachments',
      field: 'attachments',
      title: 'Attachments',
      show: false,
      template: (props) => <UploadEvidenceCellTemplate {...props} {...{ employeeEvidenceUpdates: undefined, isDisabled: false, currentState }} />,
      width: 300,
    },
    {
      id: 'date',
      field: 'date',
      title: 'form.builder.trainee.list.completion.date',
      filterCell: InputFilter,
      template: DateCellTemplate,
      width: 200,
    },
    {
      id: 'comments',
      field: 'comments',
      title: 'form.builder.trainee.list.comments',
      filterCell: InputFilter,
      template: InputCellTemplate,
      width: 250,
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

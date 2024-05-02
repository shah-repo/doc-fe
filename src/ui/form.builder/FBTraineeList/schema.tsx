import React from 'react';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import { CommentsCellTemplate } from '../FBCycleCount/components/CommentsCellTemplate';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { DateCellTemplate } from './components/DateCellTemplate';
import { RevisionCellTemplate } from './components/RevisionCellTemplate';
import { UploadEvidenceCellTemplate } from './components/UploadEvidenceCellTemplate';
import { UserCellTemplate } from './components/UserCellTemplate';
import { CustomTemplateProps, EditableTrainee, SchemaOptions } from './types';

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
  return [
    {
      id: 'employee',
      field: 'employee.name', // deep field name for correct filter working
      title: 'common.user',
      filterCell: InputFilter,
      template: (props) => <UserCellTemplate {...props} field="employee" options={employees} />,
      editable: true,
      width: 200,
    },
    {
      id: 'trainingDocument',
      field: 'trainingDocument.docId', // deep field name for correct filter working
      title: 'form.builder.trainee.list.doc.id',
      filterCell: InputFilter,
      template: (props) => <RevisionCellTemplate {...props} field="trainingDocument" options={documentOptions} onClick={onRowClick} />,
      editable: true,
      width: 220,
    },
    {
      id: 'id',
      field: 'id',
      title: 'form.builder.trainee.list.id',
      filterCell: InputFilter,
      template: (props) => <></>,
      editable: false,
      width: 150,
    },
    {
      id: 'attachments',
      field: 'attachments',
      title: 'Attachments',
      show: false,
      filterCell: InputFilter,
      template: (props) => <UploadEvidenceCellTemplate {...props} {...{ employeeEvidenceUpdates: undefined, isDisabled: false, currentState }} />,
      editable: true,
      width: 300,
    },
    {
      id: 'trainingCompletionDate',
      field: 'trainingCompletionDate',
      title: 'form.builder.trainee.list.completion.date',
      filterCell: InputFilter,
      template: DateCellTemplate,
      editable: true,
      width: 200,
    },
    {
      id: 'comments',
      field: 'comments',
      title: 'form.builder.trainee.list.comments',
      filterCell: InputFilter,
      template: CommentsCellTemplate as unknown as React.FC<CustomTemplateProps>,
      editable: true,
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

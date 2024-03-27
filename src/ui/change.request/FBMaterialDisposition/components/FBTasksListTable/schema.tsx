import React from 'react';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from '../commonCells/ActionsCellTemplate';
import { AssignedTOCellTemplate } from './components/cells/AssignedTOCellTemplate';
import { AssigneeActionCellTemplate } from './components/cells/AssigneeActionCellTemplate';
import { CommentCellTemplate } from './components/cells/CommentCellTemplate';
import { InstructionsCellTemplate } from './components/cells/InstructionsCellTemplate';
import { UploadEvidenceCellTemplate } from './components/cells/UploadEvidenceCellTemplate';
import { EditableTLItem, SchemaOptions } from './types';

export const buildSchema = ({
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
  isDisabled,
  isClosed,
  employeeStatusUpdates,
  employeeEvidenceUpdates,
}: SchemaOptions): Array<ColumnDefinition<EditableTLItem>> => {
  return [
    {
      id: 'number',
      field: 'number',
      title: 'approvalRequest.grid.heading.number',
      show: true,
      width: 84,
    },
    {
      id: 'instruction',
      field: 'instruction',
      title: 'approvalRequest.grid.heading.instructions',
      show: true,
      template: (props) => <InstructionsCellTemplate {...props} onClick={onRowClick} />,
      width: 600,
      sortable: false,
    },
    {
      id: 'assignedTo',
      field: 'employeeResponse',
      title: 'approvalRequest.grid.heading.assignedto',
      show: true,
      template: (props) => <AssignedTOCellTemplate {...props} onClick={onRowClick} />,
      width: 528,
    },
    {
      id: 'attachments',
      field: 'attachments',
      title: 'approvalRequest.grid.heading.attachments',
      show: false,
      template: (props) => <UploadEvidenceCellTemplate {...props} {...{ employeeEvidenceUpdates, isDisabled, isClosed }} />,
      width: 324,
    },
    {
      id: 'comment',
      field: 'comments',
      title: 'approvalRequest.grid.heading.comments',
      show: false,
      template: (props) => <CommentCellTemplate {...props} {...{ isDisabled, isClosed }} />,
      width: 324,
    },
    {
      id: 'assigneeAction',
      title: 'approvalRequest.grid.heading.assignee.action',
      show: false,
      template: (props) => <AssigneeActionCellTemplate {...props} {...{ employeeStatusUpdates, isDisabled, isClosed }} />,
      width: 350,
    },
    {
      id: 'actions',
      className: actionsClass,
      show: true,
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

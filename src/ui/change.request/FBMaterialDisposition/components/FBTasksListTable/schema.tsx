import React from 'react';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from '../commonCells/ActionsCellTemplate';
import { AssignedTOCellTemplate } from './components/cells/AssignedTOCellTemplate';
import { AssigneeActionCellTemplate } from './components/cells/AssigneeActionCellTemplate';
import { CommentCellTemplate } from './components/cells/CommentCellTemplate';
import { EvidenceCommonCell } from './components/cells/EvidenceCommonCell';
import { InstructionsCellTemplate } from './components/cells/InstructionsCellTemplate';
import { EditableTLItem, SchemaOptions } from './types';

export const buildSchema = ({
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
  isDisabled,
  isActionsDisabled,
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
      title: 'approvalRequest.grid.heading.assigned.to',
      show: true,
      template: (props) => <AssignedTOCellTemplate {...props} onClick={onRowClick} />,
      width: 528,
    },
    {
      id: 'attachments',
      field: 'attachments',
      title: 'approvalRequest.grid.heading.attachments',
      show: false,
      template: (props) => <EvidenceCommonCell {...props} {...{ employeeEvidenceUpdates, isDisabled }} />,
      width: 324,
    },
    {
      id: 'comment',
      field: 'comments',
      title: 'approvalRequest.grid.heading.comments',
      show: false,
      template: (props) => <CommentCellTemplate {...props} {...{ isDisabled }} />,
      width: 324,
    },
    {
      id: 'assigneeAction',
      title: 'approvalRequest.grid.heading.assignee.action',
      show: false,
      template: (props) => <AssigneeActionCellTemplate {...props} {...{ employeeStatusUpdates, isDisabled }} />,
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
          isDeleteDisabled={isActionsDisabled}
          isSubmitDisabled={isActionsDisabled}
        />
      ),
      width: 1,
    },
  ];
};

import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from '../commonCells/ActionsCellTemplate';
import { AssignedTOCellTemplate } from './components/cells/AssignedTOCellTemplate';
import { AssigneeActionCellTemplate } from './components/cells/AssigneeActionCellTemplate';
import { CommentCellTemplate } from './components/cells/CommentCellTemplate';
import { InstructionsCellTemplate } from './components/cells/InstructionsCellTemplate';
import { EditableTLItem, SchemaOptions } from './interface';
import React from 'react';

export const buildSchema = ({
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
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
      id: 'instructions',
      field: 'instructions',
      title: 'approvalRequest.grid.heading.instructions',
      show: true,
      template: (props) => <InstructionsCellTemplate {...props} onClick={onRowClick} />,
      width: 1100,
      sortable: false,
    },
    {
      id: 'assignedTo',
      field: 'assignedTo',
      title: 'approvalRequest.grid.heading.assignedto',
      show: true,
      template: (props) => <AssignedTOCellTemplate {...props} onClick={onRowClick} />,
      width: 528,
    },
    {
      id: 'comment',
      field: 'comments',
      title: 'approvalRequest.grid.heading.comments',
      show: false,
      template: (props) => <CommentCellTemplate {...props} onClick={onRowClick} />,
      width: 324,
    },
    {
      id: 'assigneeAction',
      title: 'approvalRequest.grid.heading.assignee.action',
      show: false,
      template: (props) => <AssigneeActionCellTemplate {...props} />,
      width: 240,
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
        />
      ),
      width: 1,
    },
  ];
};

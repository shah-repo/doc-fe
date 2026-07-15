import React from 'react';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/cells/ActionsCellTemplate';
import { LotIDCell } from './components/cells/LotIDCell';
import { SerialNumbersCell } from './components/cells/SerialNumbersCell';
import { EditableASN, SchemaOptions } from './types';

export const buildSchema = ({
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
  isDisabled,
  lots,
  isLotsloading,
}: SchemaOptions): Array<ColumnDefinition<EditableASN>> => {
  return [
    {
      id: 'lotId',
      field: 'lotId',
      title: 'form.builder.affected.serial.numbers.grid.heading.lot.number',
      template: (props) => <LotIDCell {...props} options={lots} isLoading={isLotsloading} onClick={onRowClick} />,
      show: true,
      width: 200,
    },
    {
      id: 'serialNumbers',
      field: 'serialNumbers',
      title: 'form.builder.affected.serial.numbers.grid.heading.serial.numbers',
      show: true,
      template: (props) => <SerialNumbersCell {...props} serialNumbers={[]} onClick={onRowClick} />,
      width: 400,
      sortable: false,
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

import React from 'react';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { CustomTemplateProps, SchemaOptions } from '../types';
import { ActionsCell } from './ActionsCell';

type Props = CustomTemplateProps & Pick<SchemaOptions, 'onConfirm' | 'onDiscard' | 'onDelete'>;

export const ActionsCellTemplate: React.FC<Props> = (props) => {
  const { dataItem, onConfirm, onDiscard, onDelete } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (!isEditMode) {
    return null;
  }

  return (
    <ActionsCell
      dataItem={dataItem}
      onConfirm={onConfirm}
      onDiscard={onDiscard}
      onDelete={() => onDelete?.(dataItem)}
    />
  );
};

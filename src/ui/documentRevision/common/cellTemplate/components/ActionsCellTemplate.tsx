import React from 'react';
import { translate } from '../../../../../common/intl';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import { CustomTemplateProps, SchemaOptions } from '../types';
import { ActionsCell } from './ActionsCell';

type Props = CustomTemplateProps & Pick<SchemaOptions, 'onConfirm' | 'onDiscard' | 'onDelete'>;

export const ActionsCellTemplate: React.FC<Props> = (props) => {
  const { dataItem, onConfirm, onDiscard, onDelete } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (!isEditMode) {
    return null;
  }

  const shouldDisableDelete = dataItem?.primary;
  const deleteTootltipText
      = shouldDisableDelete
        ? translate('form.builder.part.vendors.primary.delete.message')
        : undefined;

  return (
    <ActionsCell
      dataItem={dataItem}
      onConfirm={onConfirm}
      onDiscard={onDiscard}
      onDelete={onDelete}
      deleteTooltipText={deleteTootltipText}
      isDeleteDisabled={shouldDisableDelete}
    />
  );
};

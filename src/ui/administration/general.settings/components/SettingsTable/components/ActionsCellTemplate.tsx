import React, { useCallback } from 'react';
import { CellTemplateProps, EditableItem } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import ActionsButtons from './ActionButtons';

interface Props<T extends EditableItem> extends CellTemplateProps<T> {
  scrollBehavior?: ScrollBehavior
  isLoading?: boolean
  isActive?: boolean
  onEdit?: (item: T) => void
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: (item: T) => void
}

function ActionsCellTemplate<T extends EditableItem> ({
  dataItem,
  scrollBehavior = 'auto',
  isLoading,
  isActive,
  onEdit,
  onDelete,
  onConfirm,
  onDiscard,
}: Props<T>): React.ReactElement {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'center' }));
    }
  }, [scrollBehavior]);

  return (
    <>
      <ActionsButtons
        ref={ref}
        isEditMode={isEditMode}
        isActive={isActive}
        isLoading={isLoading}
        onConfirm={onConfirm}
        onDiscard={onDiscard}
        onEdit={() => onEdit?.(dataItem)}
        onDelete={() => onDelete?.(dataItem)}
      />
    </>
  );
}

export default ActionsCellTemplate;

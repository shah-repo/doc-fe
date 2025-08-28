import React, { useCallback } from 'react';
import { Mode, MODE_FIELD } from '../../../../../../KendoDataGrid/constants';
import { CellTemplateProps, EditableItem } from '../../../../../../KendoDataGrid/KendoDataGrid.types';
import ActionsButtons from './ActionButtons';

interface Props<T extends EditableItem> extends CellTemplateProps<T> {
  scrollBehavior?: ScrollBehavior
  isLoading?: boolean
  isActive?: boolean
  isEditHidden?: boolean
  isEditButtonHidden?: boolean
  onEdit?: (item: T) => void
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: (item: T) => void
  onOpenQuickView?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    dataItem: T
  ) => void
}

function ActionsCellTemplate<T extends EditableItem> ({
  dataItem,
  scrollBehavior = 'auto',
  isLoading,
  isActive,
  isEditHidden,
  onEdit,
  onDelete,
  onConfirm,
  onDiscard,
  onOpenQuickView,
  isEditButtonHidden = false,
}: Props<T>): React.ReactElement {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'center' }));
    }
  }, [scrollBehavior]);

  if (isEditButtonHidden && dataItem[MODE_FIELD] === Mode.show) {
    return <></>;
  }

  return (
    <>
      <ActionsButtons
        ref={ref}
        isEditMode={isEditMode}
        isActive={isActive}
        isLoading={isLoading}
        onConfirm={onConfirm}
        onDiscard={onDiscard}
        isEditHidden={isEditHidden}
        onEdit={() => onEdit?.(dataItem)}
        onDelete={onDelete && (() => onDelete(dataItem))}
        openQuickView={onOpenQuickView && ((event) => onOpenQuickView(event, dataItem))}
      />
    </>
  );
}

export default ActionsCellTemplate;
